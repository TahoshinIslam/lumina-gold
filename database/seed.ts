/**
 * Seed lumina_jewelry from the storefront's mock catalog.
 * Run: npx tsx database/seed.ts   (idempotent — wipes and re-inserts products)
 */
import mysql from 'mysql2/promise';
import { CATALOG } from '../src/features/catalog/catalog';

const TYPE_TO_CATEGORY: Record<string, string> = {
  Ring: 'Rings', Earring: 'Earrings', Necklace: 'Necklaces', Pendant: 'Pendants',
  Bracelet: 'Bracelets', Bangle: 'Bangles', Chain: 'Chains', Locket: 'Lockets',
  'Nose Pin': 'Nose Pins',
};

const AVAIL: Record<string, string> = {
  'In Stock': 'in_stock', 'Made To Order': 'made_to_order', 'Ready to Ship': 'ready_to_ship',
};

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  const db = await mysql.createConnection({
    host: '127.0.0.1', user: 'root', password: '', database: 'lumina_jewelry',
  });

  const lookup = async (table: string, name: string): Promise<number | null> => {
    const [rows] = await db.query(`SELECT id FROM ${table} WHERE name = ?`, [name]);
    return (rows as { id: number }[])[0]?.id ?? null;
  };

  await db.query('DELETE FROM products'); // cascades to variants, images, pivots
  console.log('Cleared existing products.');

  for (const p of CATALOG) {
    const [res] = await db.query(
      `INSERT INTO products (sku, slug, name, short_description, description, status, is_featured, is_new_arrival)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`,
      [p.sku, slugify(p.name), p.name, p.description.slice(0, 500), p.description,
       p.featured ? 1 : 0, p.isNew ? 1 : 0],
    );
    const productId = (res as mysql.ResultSetHeader).insertId;

    // pivots
    const catId = await lookup('categories', TYPE_TO_CATEGORY[p.type as string] ?? String(p.type));
    if (catId) await db.query('INSERT INTO product_categories VALUES (?, ?)', [productId, catId]);
    const colId = p.collection ? await lookup('collections', p.collection) : null;
    if (colId) await db.query('INSERT INTO product_collections VALUES (?, ?)', [productId, colId]);
    const genId = await lookup('genders', p.gender);
    if (genId) await db.query('INSERT INTO product_genders VALUES (?, ?)', [productId, genId]);
    const styId = p.style ? await lookup('styles', p.style) : null;
    if (styId) await db.query('INSERT INTO product_styles VALUES (?, ?)', [productId, styId]);
    for (const occ of p.occasions) {
      const occId = await lookup('occasions', occ);
      if (occId) await db.query('INSERT IGNORE INTO product_occasions VALUES (?, ?)', [productId, occId]);
    }

    // variant — material is a metal (diamonds are seeded as stones below).
    const metalName = p.material;
    const metalId = await lookup('metals', metalName);
    let purityId: number | null = null;
    const purityName = p.purity ?? (p.material === 'Platinum' ? 'PT950' : p.material === 'Silver' ? 'S925' : null);
    if (purityName) {
      const [rows] = await db.query('SELECT id FROM metal_purities WHERE name = ?', [purityName]);
      purityId = (rows as { id: number }[])[0]?.id ?? null;
    }
    const colorId = p.goldColor ? await lookup('metal_colors', p.goldColor) : null;

    const [vres] = await db.query(
      `INSERT INTO product_variants (product_id, variant_sku, metal_id, purity_id, metal_color_id, metal_weight_g, is_default)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [productId, `${p.sku}-01`, metalId, purityId, colorId, p.weightGrams ?? null],
    );
    const variantId = (vres as mysql.ResultSetHeader).insertId;

    await db.query(
      `INSERT INTO variant_price_components (variant_id, pricing_mode, fixed_price) VALUES (?, 'fixed', ?)`,
      [variantId, p.price],
    );
    await db.query(
      `INSERT INTO price_history (variant_id, price, effective_at, reason) VALUES (?, ?, NOW(), 'initial seed')`,
      [variantId, p.price],
    );
    await db.query(
      `INSERT INTO inventory (variant_id, warehouse_id, quantity_available, availability) VALUES (?, 1, ?, ?)`,
      [variantId, p.stock ?? 0, AVAIL[p.availability] ?? 'in_stock'],
    );

    for (let i = 0; i < p.images.length; i++) {
      await db.query(
        `INSERT INTO product_images (product_id, image_path, sort_order, is_primary) VALUES (?, ?, ?, ?)`,
        [productId, p.images[i], i, i === 0 ? 1 : 0],
      );
    }

    if (p.diamond) {
      const shapeId = await lookup('stone_shapes', p.diamond.shape);
      const scolorId = await lookup('stone_colors', p.diamond.color ?? '');
      const clarityId = await lookup('stone_clarities', p.diamond.clarity ?? '');
      const typeId = await lookup('stone_types', 'Diamond');
      await db.query(
        `INSERT INTO variant_stones (variant_id, stone_type_id, stone_shape_id, stone_color_id, stone_clarity_id, is_lab_grown, carat_total, quantity, is_center_stone)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
        [variantId, typeId, shapeId, scolorId, clarityId,
         p.diamond.origin === 'Lab Grown' ? 1 : 0, p.diamond.caratWeight],
      );
      await db.query(
        `INSERT INTO certificates (variant_id, certificate_no, issuer) VALUES (?, ?, ?)`,
        [variantId, `${p.diamond.certification}-${p.sku}`, p.diamond.certification],
      );
    }
  }

  const [prodRows] = await db.query('SELECT COUNT(*) c FROM products');
  const [varRows] = await db.query('SELECT COUNT(*) c FROM product_variants');
  const count = (rows: unknown) => (rows as { c: number }[])[0].c;
  console.log(`Seeded ${count(prodRows)} products, ${count(varRows)} variants.`);
  await db.end();
}

main().catch(e => { console.error(e); process.exit(1); });
