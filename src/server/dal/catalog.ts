import { query } from '@/server/db/client';
import { priceExpr } from '@/server/pricing';
import { CATEGORY_SLUGS } from '@/features/catalog/taxonomy';
import type { Availability, GemstoneKind, Gender, Material, Product, ProductSpec, ProductVariant } from '@/types/product';

/**
 * Storefront read layer — the DB-backed counterpart to the old
 * `features/catalog/catalog.ts` mock. Every function here returns objects
 * shaped like `Product` so the existing filter engine, product cards and
 * product detail page keep working unchanged; only the data source moves
 * from an in-memory array to MariaDB.
 *
 * "Diamond" is a gemstone, not a metal (a diamond piece still has a metal,
 * e.g. an 18K gold diamond ring) — mirrors the material/gemstone split
 * already used by `features/catalog/presets.ts`.
 */

export type MainCategory = 'gold' | 'diamond' | 'platinum' | 'silver';
export type ShowcaseTab = 'new' | 'best' | 'featured' | 'discount';

interface ProductRow {
  id: number;
  sku: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  is_featured: number;
  is_new_arrival: number;
  is_best_seller: number;
  variant_id: number | null;
  weight_g: number | null;
  material_name: string | null;
  purity_metal_name: string | null;
  purity_name: string | null;
  color_name: string | null;
  fixed_price: number | null;
  discount_amount: number | null;
  availability_enum: string | null;
  stock: number | null;
  category_name: string | null;
  category_slug: string | null;
  collection_name: string | null;
  gender_name: string | null;
  style_name: string | null;
  occasion_names: string | null;
  price_from: number | null;
  variant_count: number;
}

const BASE_SELECT = `
  SELECT
    p.id, p.sku, p.slug, p.name, p.short_description, p.description,
    p.is_featured, p.is_new_arrival, p.is_best_seller,
    v.id AS variant_id, v.metal_weight_g AS weight_g,
    m.name AS material_name, mp.name AS purity_name, mc.name AS color_name,
    pm.name AS purity_metal_name,
    ${priceExpr('v', 'pc')} AS fixed_price, pc.discount_amount,
    inv.availability AS availability_enum, inv.quantity_available AS stock,
    (SELECT c.name FROM product_categories x JOIN categories c ON c.id = x.category_id
       WHERE x.product_id = p.id ORDER BY c.sort_order LIMIT 1) AS category_name,
    (SELECT c.slug FROM product_categories x JOIN categories c ON c.id = x.category_id
       WHERE x.product_id = p.id ORDER BY c.sort_order LIMIT 1) AS category_slug,
    (SELECT col.name FROM product_collections x JOIN collections col ON col.id = x.collection_id
       WHERE x.product_id = p.id ORDER BY col.sort_order LIMIT 1) AS collection_name,
    (SELECT g.name FROM product_genders x JOIN genders g ON g.id = x.gender_id
       WHERE x.product_id = p.id LIMIT 1) AS gender_name,
    (SELECT s.name FROM product_styles x JOIN styles s ON s.id = x.style_id
       WHERE x.product_id = p.id LIMIT 1) AS style_name,
    -- A piece can suit SEVERAL occasions (an engagement ring is also an
    -- anniversary gift), so unlike collection/gender/style this is not a
    -- LIMIT 1 — all of them are needed or the Occasion filter matches nothing.
    (SELECT GROUP_CONCAT(o.name ORDER BY o.name) FROM product_occasions x
       JOIN occasions o ON o.id = x.occasion_id
       WHERE x.product_id = p.id) AS occasion_names,
    (SELECT MIN(${priceExpr('v2', 'pc2')}) FROM product_variants v2
       JOIN variant_price_components pc2 ON pc2.variant_id = v2.id
      WHERE v2.product_id = p.id AND v2.status = 'active') AS price_from,
    (SELECT COUNT(*) FROM product_variants v2 WHERE v2.product_id = p.id AND v2.status = 'active') AS variant_count
  FROM products p
  JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
  LEFT JOIN metals m ON m.id = v.metal_id
  LEFT JOIN metal_purities mp ON mp.id = v.purity_id
  -- The purity already knows its metal (PT950 belongs to Platinum), so it can
  -- stand in when the admin left the variant's Metal unset.
  LEFT JOIN metals pm ON pm.id = mp.metal_id
  LEFT JOIN metal_colors mc ON mc.id = v.metal_color_id
  LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
  LEFT JOIN inventory inv ON inv.variant_id = v.id AND inv.warehouse_id = 1
`;

const DIAMOND_EXISTS = `EXISTS (
  SELECT 1 FROM variant_stones vs JOIN stone_types st ON st.id = vs.stone_type_id
  WHERE vs.variant_id = v.id AND st.name = 'Diamond'
)`;

/** The variant's metal, or the metal its purity belongs to — same fallback the
 * row mapper uses, so a piece is scoped to the metal page it displays as. */
const METAL_NAME = 'COALESCE(m.name, pm.name)';

/** SQL fragment + params scoping a query to one of the four main categories. */
function scopeClause(mainCategory?: MainCategory): { sql: string; params: unknown[] } {
  switch (mainCategory) {
    case 'gold': return { sql: `AND ${METAL_NAME} = ?`, params: ['Gold'] };
    case 'platinum': return { sql: `AND ${METAL_NAME} = ?`, params: ['Platinum'] };
    case 'silver': return { sql: `AND ${METAL_NAME} = ?`, params: ['Silver'] };
    case 'diamond': return { sql: `AND ${DIAMOND_EXISTS}`, params: [] };
    default: return { sql: '', params: [] };
  }
}

const AVAILABILITY_MAP: Record<string, Availability> = {
  in_stock: 'In Stock',
  made_to_order: 'Made To Order',
  ready_to_ship: 'Ready to Ship',
  out_of_stock: 'Out of Stock',
};

const GEMSTONE_KINDS: GemstoneKind[] = ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl'];
const GENDERS: Gender[] = ['Women', 'Men', 'Kids', 'Unisex'];

/** Batch-load images + gemstones for a set of rows (avoids a JOIN fan-out). */
async function attachChildren(rows: ProductRow[]): Promise<Product[]> {
  if (rows.length === 0) return [];
  const productIds = rows.map(r => r.id);
  const variantIds = rows.map(r => r.variant_id).filter((id): id is number => id != null);

  const images = await query<{ product_id: number; image_path: string }>(
    `SELECT product_id, image_path FROM product_images WHERE product_id IN (${productIds.map(() => '?').join(',')}) ORDER BY sort_order, id`,
    productIds,
  );
  const imagesByProduct = new Map<number, string[]>();
  for (const img of images) {
    const list = imagesByProduct.get(img.product_id) ?? [];
    list.push(img.image_path);
    imagesByProduct.set(img.product_id, list);
  }

  const stones = variantIds.length
    ? await query<StoneRow>(
        `SELECT vs.variant_id, st.name AS stone_name, vs.carat_total, vs.carat_each, vs.quantity,
                sh.name AS shape, sc.name AS color, scl.name AS clarity, sct.name AS cut, vs.is_lab_grown
         FROM variant_stones vs
         JOIN stone_types st ON st.id = vs.stone_type_id
         LEFT JOIN stone_shapes sh ON sh.id = vs.stone_shape_id
         LEFT JOIN stone_colors sc ON sc.id = vs.stone_color_id
         LEFT JOIN stone_clarities scl ON scl.id = vs.stone_clarity_id
         LEFT JOIN stone_cuts sct ON sct.id = vs.stone_cut_id
         WHERE vs.variant_id IN (${variantIds.map(() => '?').join(',')})`,
        variantIds,
      )
    : [];
  const stonesByVariant = new Map<number, StoneRow[]>();
  for (const s of stones) {
    const list = stonesByVariant.get(s.variant_id) ?? [];
    list.push(s);
    stonesByVariant.set(s.variant_id, list);
  }

  const certs = variantIds.length
    ? await query<{ variant_id: number; issuer: string; certificate_no: string }>(
        `SELECT variant_id, issuer, certificate_no FROM certificates WHERE variant_id IN (${variantIds.map(() => '?').join(',')})`,
        variantIds,
      )
    : [];
  const certByVariant = new Map<number, { issuer: string; certificate_no: string }>();
  for (const c of certs) certByVariant.set(c.variant_id, c);

  // Measured dimensions (Height, Width, ...). Per PRODUCT, never per variant —
  // they describe the piece rather than offering a choice, so they add no SKUs.
  const specs = await query<{ product_id: number; label: string; value: string }>(
    `SELECT ps.product_id, a.name AS label, ps.value
     FROM product_specifications ps JOIN attributes a ON a.id = ps.attribute_id
     WHERE ps.product_id IN (${productIds.map(() => '?').join(',')})
     ORDER BY a.sort_order`,
    productIds,
  );
  const specsByProduct = new Map<number, ProductSpec[]>();
  for (const spec of specs) {
    const list = specsByProduct.get(spec.product_id) ?? [];
    list.push({ label: spec.label, value: spec.value });
    specsByProduct.set(spec.product_id, list);
  }

  return rows.map(row => mapRowToProduct(
    row,
    imagesByProduct.get(row.id) ?? [],
    stonesByVariant.get(row.variant_id ?? -1) ?? [],
    certByVariant.get(row.variant_id ?? -1),
    specsByProduct.get(row.id) ?? [],
  ));
}

interface StoneRow {
  variant_id: number; stone_name: string; carat_total: number | null; carat_each: number | null; quantity: number;
  shape: string | null; color: string | null; clarity: string | null; cut: string | null; is_lab_grown: number;
}

function mapRowToProduct(
  row: ProductRow,
  images: string[],
  stoneRows: StoneRow[],
  cert: { issuer: string; certificate_no: string } | undefined,
  specs: ProductSpec[],
): Product {
  // When the admin leaves the variant's Metal unset, fall back to the metal the
  // PURITY belongs to before defaulting: a PT950 piece is Platinum, and calling
  // it Gold produced the impossible "PT950 · Gold" on the product card.
  const METALS = ['Gold', 'Platinum', 'Silver'] as Material[];
  const asMetal = (name: string | null) =>
    METALS.includes(name as Material) ? (name as Material) : null;
  const material = asMetal(row.material_name)
    ?? asMetal(row.purity_metal_name)
    ?? 'Gold'; // nothing to go on — best-effort rather than dropping the product
  const gender = GENDERS.includes(row.gender_name as Gender) ? (row.gender_name as Gender) : 'Unisex';
  const type = (row.category_slug && CATEGORY_SLUGS[row.category_slug]) || row.category_name || 'Other';

  const gemstones = [...new Set(stoneRows.map(s => s.stone_name))].filter((s): s is GemstoneKind =>
    GEMSTONE_KINDS.includes(s as GemstoneKind),
  );

  const diamondStone = stoneRows.find(s => s.stone_name === 'Diamond');
  const diamond = diamondStone && (diamondStone.carat_each || diamondStone.carat_total) && diamondStone.shape
    ? {
        caratWeight: Number(diamondStone.carat_each ?? diamondStone.carat_total),
        shape: diamondStone.shape,
        color: diamondStone.color || undefined,
        clarity: diamondStone.clarity || undefined,
        cut: diamondStone.cut || undefined,
        origin: diamondStone.is_lab_grown ? 'Lab Grown' : 'Natural',
        certification: cert?.issuer || undefined,
        certificateNumber: cert?.certificate_no || undefined,
        quantity: diamondStone.quantity || undefined,
        caratTotal: diamondStone.carat_total != null ? Number(diamondStone.carat_total) : undefined,
      }
    : undefined;

  const fixedPrice = Number(row.fixed_price ?? 0);
  const discountAmount = Number(row.discount_amount ?? 0);
  const hasDiscount = discountAmount > 0 && fixedPrice > 0;

  return {
    id: String(row.id),
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    description: row.description || row.short_description || '',
    material,
    ...(specs.length ? { specifications: specs } : {}),
    ...(gemstones.length ? { gemstones } : {}),
    // Purity/gold-color only apply to gold pieces — platinum (PT950) / silver
    // (S925) purities use a different vocabulary than the karat selector.
    ...(material === 'Gold' && row.purity_name ? { purity: row.purity_name as Product['purity'] } : {}),
    ...(material === 'Gold' && row.color_name ? { goldColor: row.color_name as Product['goldColor'] } : {}),
    gender,
    type,
    collection: row.collection_name || '',
    // Was hardcoded to [] — which silently made the whole Occasion filter dead:
    // every product failed every occasion test, so the facet returned nothing.
    occasions: (row.occasion_names?.split(',').filter(Boolean) ?? []) as Product['occasions'],
    style: row.style_name || undefined,
    price: fixedPrice,
    weightGrams: Number(row.weight_g ?? 0),
    ...(diamond ? { diamond: diamond as unknown as NonNullable<Product['diamond']> } : {}),
    availability: AVAILABILITY_MAP[row.availability_enum ?? ''] ?? 'In Stock',
    stock: Number(row.stock ?? 0),
    images,
    isNew: !!row.is_new_arrival,
    featured: !!row.is_featured,
    isBestSeller: !!row.is_best_seller,
    ...(hasDiscount
      ? {
          hasDiscount: true,
          discountPrice: Math.round((fixedPrice - discountAmount) * 100) / 100,
          discountPercent: Math.round((discountAmount / fixedPrice) * 100),
        }
      : {}),
    variantCount: Number(row.variant_count ?? 1),
    ...(row.price_from != null ? { priceFrom: Number(row.price_from) } : {}),
  };
}

/** Full active product set, optionally scoped by main category — feeds `ShopPage`'s in-memory filter engine. */
export async function getStorefrontProducts(opts: { mainCategory?: MainCategory } = {}): Promise<Product[]> {
  const scope = scopeClause(opts.mainCategory);
  const rows = await query<ProductRow>(
    `${BASE_SELECT} WHERE p.status = 'active' ${scope.sql} ORDER BY p.created_at DESC`,
    scope.params,
  );
  return attachChildren(rows);
}

/** Scoped, flag-filtered homepage tab query (New Arrivals / Best Sellers / Discounts). */
export async function getHomepageSection(mainCategory: MainCategory, tab: ShowcaseTab, limit = 8): Promise<Product[]> {
  const scope = scopeClause(mainCategory);
  const tabClause =
    tab === 'new' ? 'AND p.is_new_arrival = 1'
    : tab === 'best' ? 'AND p.is_best_seller = 1'
    // is_featured has been on the product form all along; nothing read it.
    : tab === 'featured' ? 'AND p.is_featured = 1'
    : 'AND pc.discount_amount > 0';
  const rows = await query<ProductRow>(
    `${BASE_SELECT} WHERE p.status = 'active' ${scope.sql} ${tabClause} ORDER BY p.created_at DESC LIMIT ?`,
    [...scope.params, limit],
  );
  return attachChildren(rows);
}

/**
 * Every real, purchasable variant of a product (Purity × Ring Size / Chain
 * Length, or just one row for a single-price product) — its own price,
 * compare price, stock, SKU, weight, barcode and status. Powers the product
 * detail page's real selector (no formula-computed pricing).
 */
export async function getProductVariants(productId: number): Promise<ProductVariant[]> {
  const rows = await query<{
    id: number; sku: string; barcode: string | null; status: string; weight_g: number | null;
    purity_name: string | null; fixed_price: number | null; compare_price: number | null; stock: number | null;
  }>(
    `SELECT v.id, v.variant_sku sku, v.barcode, v.status, v.metal_weight_g weight_g,
            mp.name purity_name, ${priceExpr('v', 'pc')} AS fixed_price,
            pc.compare_price, inv.quantity_available stock
     FROM product_variants v
     LEFT JOIN metal_purities mp ON mp.id = v.purity_id
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     LEFT JOIN inventory inv ON inv.variant_id = v.id AND inv.warehouse_id = 1
     WHERE v.product_id = ? AND v.status = 'active'
     ORDER BY v.is_default DESC, v.id`,
    [productId],
  );
  if (rows.length === 0) return [];

  const variantIds = rows.map(r => r.id);
  const attrRows = await query<{ variant_id: number; code: string; label: string; value: string }>(
    `SELECT va.variant_id, a.code, a.name AS label, av.value
     FROM variant_attributes va
     JOIN attribute_values av ON av.id = va.attribute_value_id
     JOIN attributes a ON a.id = av.attribute_id
     WHERE va.variant_id IN (${variantIds.map(() => '?').join(',')})`,
    variantIds,
  );
  const attrsByVariant = new Map<number, { code: string; label: string; value: string }[]>();
  for (const a of attrRows) {
    const list = attrsByVariant.get(a.variant_id) ?? [];
    list.push({ code: a.code, label: a.label, value: a.value });
    attrsByVariant.set(a.variant_id, list);
  }

  return rows.map(row => ({
    id: String(row.id),
    sku: row.sku,
    ...(row.purity_name ? { purity: row.purity_name as ProductVariant['purity'] } : {}),
    price: Number(row.fixed_price ?? 0),
    ...(row.compare_price != null ? { comparePrice: Number(row.compare_price) } : {}),
    stock: Number(row.stock ?? 0),
    ...(row.weight_g != null ? { weightGrams: Number(row.weight_g) } : {}),
    ...(row.barcode ? { barcode: row.barcode } : {}),
    status: row.status === 'active' ? 'active' : 'inactive',
    attributes: attrsByVariant.get(row.id) ?? [],
  }));
}

/** Single product detail lookup by slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await query<ProductRow>(`${BASE_SELECT} WHERE p.status = 'active' AND p.slug = ? LIMIT 1`, [slug]);
  const [product] = await attachChildren(rows);
  if (!product) return null;
  const variants = await getProductVariants(Number(product.id));
  return { ...product, variants };
}

/** Same type or same collection, excluding itself. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const categorySlug = Object.entries(CATEGORY_SLUGS).find(([, t]) => t === product.type)?.[0];
  const rows = await query<ProductRow>(
    `${BASE_SELECT} WHERE p.status = 'active' AND p.sku <> ?
     AND (
       ${categorySlug ? '(SELECT c.slug FROM product_categories x JOIN categories c ON c.id = x.category_id WHERE x.product_id = p.id ORDER BY c.sort_order LIMIT 1) = ?' : '0=1'}
       OR (SELECT col.name FROM product_collections x JOIN collections col ON col.id = x.collection_id WHERE x.product_id = p.id ORDER BY col.sort_order LIMIT 1) = ?
     )
     ORDER BY p.created_at DESC LIMIT ?`,
    categorySlug ? [product.sku, categorySlug, product.collection, limit] : [product.sku, product.collection, limit],
  );
  return attachChildren(rows);
}

/** Lightweight lookup for arbitrary SKUs (e.g. "recently viewed" resolved client-side from localStorage). */
export async function getProductsBySkus(skus: string[]): Promise<Product[]> {
  if (skus.length === 0) return [];
  const rows = await query<ProductRow>(
    `${BASE_SELECT} WHERE p.status = 'active' AND p.sku IN (${skus.map(() => '?').join(',')})`,
    skus,
  );
  return attachChildren(rows);
}

/** Distinct facet values actually present within a scope, so a filter panel never offers a value with zero matches (e.g. no Diamond-only facet on the Gold page). */
export async function getFacetOptions(opts: { mainCategory?: MainCategory } = {}): Promise<{
  type: string[]; collection: string[]; purity: string[]; color: string[]; gender: string[];
  shape: string[]; dcolor: string[]; clarity: string[]; stones: string[]; cert: string[];
}> {
  const products = await getStorefrontProducts(opts);
  const uniq = (values: (string | undefined)[]) => [...new Set(values.filter((v): v is string => !!v))];
  return {
    type: uniq(products.map(p => p.type)),
    collection: uniq(products.map(p => p.collection)),
    purity: uniq(products.map(p => p.purity)),
    color: uniq(products.map(p => p.goldColor)),
    gender: uniq(products.map(p => p.gender)),
    // Diamond facets come from the admin's own lookup tables (stone_shapes,
    // stone_colors, stone_clarities), which grow — a hand-kept list in
    // filtering.ts had already drifted, hiding every Cushion and Marquise piece
    // from the shape filter.
    shape: uniq(products.map(p => p.diamond?.shape)),
    dcolor: uniq(products.map(p => p.diamond?.color)),
    clarity: uniq(products.map(p => p.diamond?.clarity)),
    cert: uniq(products.map(p => p.diamond?.certification)),
    stones: uniq(products.map(p => p.diamond?.quantity?.toString()))
      .sort((a, b) => Number(a) - Number(b)),
  };
}

/** Active categories for /categories listing + admin-added-category awareness. */
export async function getCategorySlugs(): Promise<{ id: number; name: string; slug: string }[]> {
  return query('SELECT id, name, slug FROM categories WHERE is_active = 1 ORDER BY sort_order, name');
}

/**
 * The pieces the boutique has featured (`is_featured` on the product form — a
 * flag that existed from the start and that nothing ever read).
 *
 * `excludeSku` keeps a product out of its own "You May Also Admire" row.
 */
export async function getFeaturedProducts(limit = 12, excludeSku?: string): Promise<Product[]> {
  const rows = await query<ProductRow>(
    `${BASE_SELECT}
      WHERE p.status = 'active' AND p.is_featured = 1
        AND (? IS NULL OR p.sku <> ?)
      ORDER BY p.created_at DESC
      LIMIT ?`,
    [excludeSku ?? null, excludeSku ?? '', limit],
  );
  return attachChildren(rows);
}
