# Nahar Jewellers

The Nahar Jewellers website — a haute-joaillerie storefront and its admin panel, built
on Next.js 16 (App Router, Turbopack), React 19, TypeScript and MySQL.

## Running it on a new machine

You need **Node 20 or newer** (CI runs 22) and **MySQL / MariaDB**. XAMPP is what this
was built against and is the easiest way to get MariaDB on Windows or macOS; a plain
MySQL 8 install works just as well.

### 1. Get the code and its packages

```bash
git clone https://github.com/leotechbd/nahar_jewellers.git
cd nahar_jewellers
npm ci                 # `npm install` is fine too; `npm ci` obeys the lockfile exactly
```

### 2. Create the database

Start MySQL, then load the schema **once**. It creates the `lumina_jewelry` database,
all 72 tables, and the reference data the app cannot boot without — metals, purities,
stone shapes and grades, gold rates, categories, collections, occasions, roles, the nav
menus and the landing page's testimonials.

```bash
mysql -u root < database/schema.sql
```

On XAMPP the client is not on your PATH; call it where it lives:

```bash
# macOS
/Applications/XAMPP/xamppfiles/bin/mysql -u root < database/schema.sql
# Windows
C:\xampp\mysql\bin\mysql.exe -u root < database\schema.sql
```

> **Do not also run the migrations.** `database/migrations/` is the upgrade path for a
> database that *already has data in it*; `schema.sql` is where all of them have already
> landed. Running both fails — the second one tries to create tables and columns the
> first has just made.

It ships with **no products, customers or orders**. Those come from the admin panel, so a
fresh install is a working shop with an empty shelf — that is expected.

Once you have added a product or two, you can fill the dashboard with 60 days of demo
customers and orders. It is reversible, and every row it writes is tagged
(`@demo.lumina` emails, `LUM-DEMO-…` order numbers) so it can never touch real data:

```bash
npx tsx database/seed-demo.ts            # add it
npx tsx database/seed-demo.ts --clear    # take it away again
```

Run it before there are any products and it will tell you so and stop — an order needs
something to be an order for.

### 3. Point the app at it

Create `.env.local` in the project root. It is deliberately not committed. Every value
has a working default for a stock XAMPP install, so on a machine like that you can skip
this file entirely — but do not ship without setting the two secrets.

```bash
# Database — the defaults below are XAMPP's, so omit any you don't need to change
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=            # XAMPP's root has no password
DB_NAME=lumina_jewelry

# Secrets — set these
ADMIN_PASSWORD=…        # the shared admin password. Defaults to "lumina123"
AUTH_SECRET=…           # signs the customer session cookie. Anyone who knows it can
                        # forge a login, so use a long random string in production
```

### 4. Run it

```bash
npm run dev            # http://localhost:3000
```

- **Storefront** — http://localhost:3000
- **Admin panel** — http://localhost:3000/admin (one shared password: `ADMIN_PASSWORD`,
  or `lumina123` if you never set it)

For a production build:

```bash
npm run build
npm start              # serves the build on http://localhost:3000
```

**In production the server refuses to boot without real secrets.** `npm start`
runs with `NODE_ENV=production`, and a boot guard (`src/instrumentation.ts`)
throws if `AUTH_SECRET` or `ADMIN_PASSWORD` is missing, still the dev default, or
(AUTH_SECRET) shorter than 32 chars — because the defaults are printed in this
repo and AUTH_SECRET signs the session cookie. So a real deploy needs:

```bash
AUTH_SECRET=$(openssl rand -hex 32) ADMIN_PASSWORD=your-real-password npm start
```

Without them the process exits on start with a message telling you which is
missing. This is deliberate: it fails loud at boot rather than quietly shipping
with a forgeable session key.

### Two things that catch people out

**Uploads are files on disk, not blobs in the database.** Product, category and home page
photographs live under `public/uploads/`, and the database only stores their paths. That
directory must be writable by whoever runs the app, and it is *not* recreated by
`schema.sql` — copy it across if you are moving an existing site, or the rows will point
at pictures that are not there.

**The build does not need the database.** Every page that reads MySQL is rendered per
request, so `npm run build` succeeds with the database down. If a build ever starts
failing on a connection error, a page has begun querying at build time.

## The shape of it

| Path | What lives there |
| --- | --- |
| `src/app/(storefront)` | The shop: home, categories, product pages, cart |
| `src/app/(checkout)` | Checkout and the order-success page |
| `src/app/(account)` | Customer account, orders, invoices |
| `src/app/(backoffice)/admin` | The admin panel |
| `src/server/dal` | Every SQL query — components never reach the database directly |
| `src/features` | Feature slices: catalog, checkout, orders, reviews, customer, admin |
| `database/migrations` | Schema changes, applied in filename order |

## Things worth knowing before changing anything

**An order is a snapshot, not a join.** Price, jewellery specification (metal, purity,
size, weight, carat, stone count, certificate), address, coupon and tax are all copied
onto the order when it is placed, and nothing about it is re-derived from the catalogue
afterwards. Otherwise re-pricing a ring would silently rewrite last year's invoice.

**Stock follows the status.** Cancelling or refunding returns the pieces to the shelf;
reviving an order takes them out again. Any new path that changes an order's status must
go through the same place, or inventory drifts away from reality.

**Nothing the browser sends is trusted.** At Place Order the bag is re-priced, the coupon
re-validated and stock re-checked on the server. Server actions answer with
`{ ok, message }` for anything foreseeable and are called through `runAction`, so an
unexpected failure can't leave a button spinning for ever.

**A review requires a delivered order.** The proof is the `order_id` stored on the review,
not a flag anyone can set — and a review stays `pending` until an admin approves it.

**Payment is Cash on Delivery.** The other methods stay in the `payment_method` enum so a
gateway can be added later without a migration, but nothing else is wired.

**This is not the Next.js you may remember.** Next 16 changed APIs and conventions that
older tutorials — and your memory — still describe the old way. Read the guides in
`node_modules/next/dist/docs/` before reaching for an API from memory.

## Checks

```bash
npm run lint           # eslint .
npm run typecheck      # tsc --noEmit
npm test               # vitest run — unit tests for the security/inventory primitives
npm run build          # next build
npm run check          # all four, in order — the deployment gate
npm run test:e2e       # playwright (needs `npx playwright install` once; boots the prod build)
```

`npm run check` is the gate: it runs lint → typecheck → test → build and **exits
non-zero the moment any one fails**, so a deploy pipeline that keys off the exit
code blocks automatically. CI (`.github/workflows/ci.yml`) runs the same four
plus dependency and secret scanning on every push.

Lint should report **0 errors**; four `<img>` warnings are expected and
long-standing. The e2e smoke suite lives in `e2e/` and asserts the production
build loads every key route with no console errors, failed requests, hydration
mismatches, or broken images.
