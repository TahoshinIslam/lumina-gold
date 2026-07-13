# Nahar Jewellers

The Nahar Jewellers website — a haute-joaillerie storefront and its admin panel, built
on Next.js 16 (App Router, Turbopack), React 19, TypeScript and MySQL.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

You need MySQL (XAMPP is fine) with the `lumina_jewelry` schema loaded, and the
migrations applied in filename order:

```bash
mysql -u root lumina_jewelry < database/schema.sql
for f in database/migrations/*.sql; do mysql -u root lumina_jewelry < "$f"; done
```

`.env.local` holds the secrets and is deliberately not committed:

```
ADMIN_PASSWORD=…      # the shared admin password (falls back to lumina123 in dev)
AUTH_SECRET=…         # signs the customer session cookie
```

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

**This is not the Next.js you may remember** — see `AGENTS.md`. Read the guides in
`node_modules/next/dist/docs/` before reaching for an API from memory.
