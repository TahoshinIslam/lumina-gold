# Database

MariaDB 10.4 (XAMPP). The app connects as `root` with no password to
`lumina_jewelry` by default — override with `DB_HOST`, `DB_PORT`, `DB_USER`,
`DB_PASSWORD`, `DB_NAME`.

## Setting up a new database

```bash
mysql -u root < database/schema.sql
npx tsx database/seed-demo.ts        # optional
```

`schema.sql` is the whole thing: all 73 tables plus the reference data the app
cannot boot without — metals, purities, metal colours, stone shapes and grades,
gold rates, categories, collections, occasions, styles, genders, tags, the
warehouse, roles/permissions, the nav menus, and the testimonials the landing
page ships with. It holds **no business data**: no products, customers, orders
or reviews. Those come from the admin panel.

## Upgrading a database that already has data

Apply `migrations/*.sql` in numeric order. That is what the migrations are for —
they are the upgrade path for a live database, and `schema.sql` is where they
all end up. Do not run both.

## schema.sql is generated

It is a dump of the live database, not a hand-written file. It had been
maintained by hand and drifted five tables and several columns behind the
migrations, which meant a fresh install produced a database the app could not
actually run against. Regenerate it rather than editing it:

```bash
mysqldump -u root --no-data --skip-comments lumina_jewelry
mysqldump -u root --no-create-info --skip-comments --complete-insert \
          --skip-extended-insert lumina_jewelry \
          attribute_values attributes categories collections genders menu_items \
          menus metal_colors metal_purities metal_rates metals occasions \
          permissions role_permissions roles stone_clarities stone_colors \
          stone_cuts stone_shapes stone_types styles tags warehouses
```

(Strip the `AUTO_INCREMENT=` counters; they are local row counts and would churn
the file on every dump.)

## seed-demo.ts

Demo customers, coupons and 60 days of orders, so the dashboard and analytics
have something to show. Safe and reversible: every row it writes is tagged
(`@demo.lumina` emails, `LUM-DEMO-…` order numbers) and it deletes those before
re-inserting, so it never duplicates and never touches real data.

```bash
npx tsx database/seed-demo.ts            # seed
npx tsx database/seed-demo.ts --clear    # remove
```

## seed.ts (removed)

There used to be a `seed.ts` that populated the catalogue from the hardcoded
mock array in `src/features/catalog/catalog.ts`. It began with
`DELETE FROM products`, so running it against a working shop destroyed every
product the admin had entered and replaced them with fictional demo pieces. The
admin panel owns the catalogue now, so it has been deleted.
