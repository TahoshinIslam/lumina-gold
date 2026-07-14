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

## Baseline (2026-07, local, MariaDB via XAMPP, single machine)

Measured against the production build. These are the shape of the app's behaviour,
not production capacity (k6 and the server shared one laptop).

**Browse**

| Users | p95 (blended) | Search p95 | Home p95 | Errors |
| --- | --- | --- | --- | --- |
| 100 | 36 ms | 17 ms | 40 ms | 0% |
| 500 | 2.36 s | 40 ms | **2.06 s** | 0% |

**Authenticated** (`account.js`, 100 users): account p95 16 ms, 0% errors.

**Lighthouse**

| Page | Perf | A11y | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Home | **75** | 96 | 100 | 100 |
| Shop | 94 | 96 | 100 | 100 |
| Product | 84 | 92 | 96 | 91 |

### What this says, and what to fix

Nothing errored even at 500 concurrent users — the app stays *up*. But two things
keep it from staying *fast*, and both point at the same page.

1. **The home page is the bottleneck, on both axes.** Under load its p95 climbs to
   2 seconds while search stays at 40ms — so it is not the server topping out, it
   is that one page. It is `force-dynamic` (never cached) and fires **13 sequential
   queries** against a 10-connection pool on every request, so at 500 users the
   requests queue on the pool. Fixes, cheapest first:
   - Cache it. The home page changes when an admin edits it, not per visitor —
     `revalidate = 60` (or `revalidateTag` on an admin save) would take almost all
     of that load off the database.
   - Raise `connectionLimit` in `src/server/db/client.ts` (currently 10) to nearer
     the DB's `max_connections`.

2. **Home LCP is 11.4 s** — a Lighthouse failure the load test cannot see. The
   cause is the hero: a large background image served as PNG/JPEG. Lighthouse puts
   ~1.6 MB of savings on next-gen formats alone. Serve the backdrops as WebP/AVIF
   and give the hero a `<link rel="preload">`; the upload route (sharp) already
   re-encodes, so this is a format change, not new plumbing.

3. **Two small Lighthouse misses on the product page**, both quick: no
   `<meta name="description">` (SEO 91), and an `aria-hidden` container holds a
   focusable element (A11y 92).

Re-run after each change and watch the home p95 and LCP move.
