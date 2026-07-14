# Load & performance testing

A load test is only worth running if it hits the code the site actually uses.
The common playbook — `POST /api/auth/login`, `POST /api/cart`, `GET /api/products`
— was written for a REST backend, and **this app is not one.** It is server-rendered
pages plus a couple of read APIs, with the cart living in the browser's
`localStorage` and every write going through a Next server action. Point k6 at
`/api/cart` here and you measure a wall of 404s.

So these tests hit the surfaces that exist. What they found is at the bottom.

## What is here

| File | What it drives |
| --- | --- |
| `browse.js` | The read path a shopper takes: home → listing → search → product. |
| `account.js` | Authenticated load: the signed session cookie is verified and per-customer queries run (the closest robust proxy for checkout — see below). |
| `session.mjs` | Mints a valid `lum_customer` cookie for a demo account, so the auth test can log in without knowing `AUTH_SECRET`. |

## Running them

```bash
brew install k6                       # macOS   (winget install k6 on Windows)

npm run build && npm start            # serve the production build on :3000
```

```bash
# Browse — no login needed
k6 run -e BASE=http://localhost:3000 loadtest/browse.js
k6 run -e BASE=http://localhost:3000 -e PEAK=500 loadtest/browse.js

# Authenticated — mint a cookie for a demo account first (never a real customer)
USER_COOKIE=$(node loadtest/session.mjs 47) \
  k6 run -e BASE=http://localhost:3000 loadtest/account.js
```

`PEAK` is the number of concurrent virtual users to hold (default 100). Each test
warms, ramps to `PEAK`, holds for two minutes — the number that counts — then
winds down. Thresholds fail the run if p95 crosses 500ms or the error rate crosses
1%.

### Frontend — Lighthouse

```bash
npx lighthouse http://localhost:3000/ \
  --only-categories=performance,accessibility,best-practices,seo --view
```

Targets: Performance > 90, Accessibility > 95, SEO > 95. Run it on the home page,
a listing and a product page — they score very differently, and the average hides
that.

## Why checkout is not flooded with orders

`placeOrderAction` runs the entire sale in one transaction and **decrements live
stock**. Pointing a thousand virtual users at it would drain real inventory and
fill the orders table with junk, so no test does.

The checkout page's read state comes through a server action, and a server action
is not a REST endpoint you can curl: the browser invokes it by POSTing React
Flight-encoded arguments to the page, an internal contract that is re-hashed on
every build and rots the moment it is hand-forged. `account.js` stands in for it
instead — it exercises the same two things checkout leans on, session
verification and customer-scoped database reads, over pages that really are
server-rendered. If those hold under load, the till's reads do too. The order
*write* is one transaction and belongs in a bounded functional test, not a flood.

## Keeping this honest

- **Test the production build, not `npm run dev`.** Dev recompiles per request and
  its numbers are fiction.
- **The action ids change every build.** `session.mjs` doesn't depend on them, but
  if you ever script an action directly, re-read the ids after each `npm run build`.
- **k6 on the same laptop as the server** shares its CPU — good for finding the
  shape of a bottleneck, not for an absolute req/s number. For real figures, run
  k6 from a separate machine against staging.

---

## Baseline

Measured against the production build, on one laptop shared with k6 and MariaDB.
These show the *shape* of the app's behaviour, not production capacity.

### After the July 2026 performance work

| Browse, 500 users | before | after |
| --- | --- | --- |
| Home p95 | **2.06 s** | **453 ms** |
| Errors | 0% | 0% |
| Home SQL per render | **47 SELECTs** | **16** |
| Home page weight | 3,840 KiB | **1,570 KiB** |
| Home LCP (Lighthouse) | 11.4 s | ~7.3 s |

Lighthouse, warm: home Perf 76-82 / A11y 96 / BP 100 / SEO 100 · shop 86 / **100** /
100 / 100 · product 90 / 96 / 96 / 91. (The Perf figure swings several points
between identical runs on a loaded laptop — treat page weight and the load-test
p95 as the real numbers.)

**What was done**

1. **The home page's DATA is cached** (`unstable_cache`, see
   `src/server/dal/homepage.ts`). It is the same for every visitor and changes only
   when an admin edits it; five consecutive requests now cost **0 SQL queries**.
   Every admin action that can change it goes through one `revalidateHome()`
   helper that purges the route *and* the cache tag behind it — purging only the
   route would re-render the page from the same stale data. Verified by hiding a
   testimonial in the admin and watching it leave the home page immediately.
   Gold rates and campaigns did NOT revalidate it and now do; without that a
   cached page would have gone on quoting yesterday's gold price.

   **The data, not the page, and that is a deliberate trade.** Marking the route
   `revalidate = 60` caches the rendered HTML and is faster still — it took the
   p95 to 68 ms rather than 453 ms — but it also makes Next PRERENDER the page at
   build time, so the build needs a reachable database. CI has none, and a deploy
   pipeline usually cannot reach production MySQL either; it failed exactly there.
   Caching the data keeps `npm run build` database-free at the cost of ~385 ms of
   p95 under heavy load, which is the right way round. If you ever want that back,
   the price is giving the build a database.

2. **Eight showcase queries folded into one.** The page asked for Gold and Diamond
   × New/Best/Featured/Discounts separately, and each of those is three queries
   (rows, then images, then stones) — 24 round trips for a couple of dozen
   products out of one small table. `getHomepageShowcases()` fetches the flagged
   products once and partitions them in memory. Verified tab-by-tab against the
   database: identical products, identical order.

3. **Images through the optimizer.** A 1200px product rendition was being poured
   into a 300px card and a 2560px backdrop onto a phone. Everything now goes
   through `optimized()` (`src/features/shared/optimized.ts`) → AVIF/WebP at the
   width actually painted. A CSS background cannot be a `<next/image>`, but it can
   point at the same endpoint. The hero is also preloaded, per-media-query, since
   a CSS background is invisible to the browser's preload scanner.

4. **The pool, last and on evidence.** Raising `connectionLimit` is the tempting
   first move and mostly hides the problem. MariaDB never ran out of room during
   any run (0 connection errors, 51 of 151 used) — the constraint was queries per
   request, not connections. After the work above, 10 -> 25 bought a further ~18%
   on the product page, so it was kept. It is not a licence to keep climbing.

### What is still slow

The load moved, as it always does, to the next uncached page.

- **The product page: 26 SELECTs to draw one product**, p95 ~7.9 s at 500 users.
  This is now the worst page in the app. It is the same `attachChildren` tail
  (rows, then images, then stones) repeated across the product, its variants, its
  related pieces and its featured rail.
- **`/shop`**: p95 ~3.8 s at 500 users. It loads the whole scoped catalogue and
  filters in memory, which is fine at 15 products and will not be at 1,500.
- Product page Lighthouse: no `<meta name="description">` (SEO 91).

Neither page is cacheable as bluntly as the home page — `/shop` varies by query
string and the product page by slug — but both are good candidates for
`revalidate` + `revalidateTag`, since a product changes when an admin saves it and
not otherwise.
