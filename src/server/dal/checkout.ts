import { query } from '@/server/db/client';
import { sellExpr } from '@/server/pricing';

/**
 * Checkout pricing and specification — the server's view of the bag.
 *
 * The cart in the browser carries only a SKU, a chosen size/purity and the
 * price the shopper was shown. None of that is trusted: every line is re-read
 * here, the real variant is resolved from the choices, and the money is
 * recomputed from `variant_price_components`. The same function feeds the
 * checkout summary and the order that gets written, so what the customer is
 * quoted and what is charged can never drift apart.
 */

/** What the browser sends us: one bag line. */
export interface CartLineInput {
  sku: string;
  qty: number;
  size?: string;
  purity?: string;
  engraving?: string;
}

/** One priced, fully specified line — everything an invoice needs, years later. */
export interface CheckoutLine {
  productId: number;
  variantId: number;
  sku: string;
  variantSku: string;
  name: string;
  slug: string;
  image: string | null;
  /* jewellery specification */
  metal: string | null;
  purity: string | null;
  metalColor: string | null;
  sizeLabel: string | null;
  metalWeightG: number | null;
  diamondCarat: number | null;
  stoneCount: number | null;
  certificateNo: string | null;
  certificateIssuer: string | null;
  engraving: string | null;
  /* money, per unit */
  unitPrice: number;
  makingCharge: number;
  stoneCharge: number;
  taxPercent: number;
  qty: number;
  lineTotal: number;
  /* fulfilment */
  stock: number;
  inStock: boolean;
}

interface VariantRow {
  product_id: number; sku: string; name: string; slug: string; image: string | null;
  variant_id: number; variant_sku: string; is_default: number; status: string;
  metal: string | null; purity: string | null; metal_color: string | null;
  metal_weight_g: string | null;
  fixed_price: string | null; making_charge: string | null; stone_charge: string | null;
  tax_percent: string | null; discount_amount: string | null;
  carat_total: string | null; stone_qty: number | null;
  certificate_no: string | null; certificate_issuer: string | null;
  stock: number | null;
  size_values: string | null;
}

const num = (v: string | number | null | undefined): number | null =>
  v === null || v === undefined ? null : Number(v);

/**
 * Every variant of every SKU in the bag, with its spec, price and stock.
 * One query rather than one per line — a bag of ten pieces shouldn't be ten
 * round trips.
 */
async function variantsForSkus(skus: string[]): Promise<VariantRow[]> {
  if (!skus.length) return [];
  const holes = skus.map(() => '?').join(',');
  return query<VariantRow>(
    `SELECT p.id AS product_id, p.sku, p.name, p.slug,
            (SELECT pi.image_path FROM product_images pi
              WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.sort_order LIMIT 1) AS image,
            v.id AS variant_id, v.variant_sku, v.is_default, v.status, v.metal_weight_g,
            m.name AS metal, mp.name AS purity, mc.name AS metal_color,
            -- The SAME expression the catalogue quotes from: a rate-based piece
            -- must cost at the till exactly what the product page said — and the
            -- markdown is IN the price (sellExpr), so a piece advertised at a
            -- discount is charged at that discount. It used to be priceExpr here,
            -- which ignored discount_amount: the shop said ৳10,000 and the till
            -- said ৳20,000.
            ${sellExpr('v', 'pc')} AS fixed_price,
            pc.making_charge, pc.stone_charge, pc.tax_percent, pc.discount_amount,
            (SELECT SUM(vs.carat_total) FROM variant_stones vs WHERE vs.variant_id = v.id) AS carat_total,
            (SELECT SUM(vs.quantity)    FROM variant_stones vs WHERE vs.variant_id = v.id) AS stone_qty,
            (SELECT c.certificate_no FROM certificates c WHERE c.variant_id = v.id LIMIT 1) AS certificate_no,
            (SELECT c.issuer         FROM certificates c WHERE c.variant_id = v.id LIMIT 1) AS certificate_issuer,
            (SELECT i.quantity_available FROM inventory i
              WHERE i.variant_id = v.id AND i.warehouse_id = 1) AS stock,
            -- Every selectable choice on this variant (a ring size, a chain
            -- length…), joined so one row still describes one variant.
            (SELECT GROUP_CONCAT(av.value) FROM variant_attributes va
               JOIN attribute_values av ON av.id = va.attribute_value_id
              WHERE va.variant_id = v.id) AS size_values
       FROM products p
       JOIN product_variants v ON v.product_id = p.id
       LEFT JOIN metals m         ON m.id  = v.metal_id
       LEFT JOIN metal_purities mp ON mp.id = v.purity_id
       LEFT JOIN metal_colors mc  ON mc.id  = v.metal_color_id
       LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
      WHERE p.sku IN (${holes}) AND p.status = 'active'`,
    skus,
  );
}

/**
 * Resolve the bag against the catalogue.
 *
 * A line whose SKU no longer exists is dropped and reported, rather than
 * silently priced at zero — the shopper is told the piece is gone.
 */
export async function priceCart(items: CartLineInput[]): Promise<{
  lines: CheckoutLine[];
  missing: string[];
}> {
  const skus = [...new Set(items.map(i => i.sku))];
  const rows = await variantsForSkus(skus);

  const lines: CheckoutLine[] = [];
  const missing: string[] = [];

  for (const item of items) {
    const candidates = rows.filter(r => r.sku === item.sku);
    if (!candidates.length) { missing.push(item.sku); continue; }

    // Honour what the shopper actually chose; fall back to the default variant
    // when the choice no longer exists (an admin can retire a size).
    const wantedSize = item.size?.trim();
    const wantedPurity = item.purity?.trim();
    const match = candidates.find(r => {
      const sizes = (r.size_values ?? '').split(',').filter(Boolean);
      const sizeOk = !wantedSize || sizes.includes(wantedSize);
      const purityOk = !wantedPurity || r.purity === wantedPurity;
      return sizeOk && purityOk && r.status === 'active';
    });
    const row = match
      ?? candidates.find(r => r.is_default && r.status === 'active')
      ?? candidates[0];

    const qty = Math.max(1, Math.min(20, Math.floor(item.qty) || 1));
    const unitPrice = Number(row.fixed_price ?? 0);
    const stock = Number(row.stock ?? 0);

    lines.push({
      productId: row.product_id,
      variantId: row.variant_id,
      sku: row.sku,
      variantSku: row.variant_sku,
      name: row.name,
      slug: row.slug,
      image: row.image,
      metal: row.metal,
      purity: row.purity,
      metalColor: row.metal_color,
      // The size the shopper picked is the one on the order, not the list of
      // sizes the variant could have been.
      sizeLabel: wantedSize || (row.size_values ? row.size_values.split(',')[0] : null),
      metalWeightG: num(row.metal_weight_g),
      diamondCarat: num(row.carat_total),
      stoneCount: row.stone_qty === null ? null : Number(row.stone_qty),
      certificateNo: row.certificate_no,
      certificateIssuer: row.certificate_issuer,
      engraving: item.engraving?.trim() || null,
      unitPrice,
      makingCharge: Number(row.making_charge ?? 0),
      stoneCharge: Number(row.stone_charge ?? 0),
      taxPercent: Number(row.tax_percent ?? 0),
      qty,
      lineTotal: unitPrice * qty,
      stock,
      inStock: stock >= qty,
    });
  }

  return { lines, missing };
}

/* ── Coupons ──────────────────────────────────────────────────────────── */

export interface CouponResult {
  ok: boolean;
  code?: string;
  couponId?: number;
  discount?: number;
  label?: string;
  error?: string;
}

/**
 * Validate a coupon against a subtotal. Every rule the admin can set is checked
 * here, on the server — the code the customer types is only a claim.
 *
 * `customerId` enables the per-user limit. It is optional because the checkout
 * summary previews a discount before an account necessarily exists; the binding
 * check happens at order placement, where the customer is always known AND the
 * global count is claimed atomically (see placeOrderAction).
 */
export async function checkCoupon(
  codeRaw: string,
  subtotal: number,
  customerId?: number,
): Promise<CouponResult> {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return { ok: false, error: 'Enter a code.' };

  const rows = await query<{
    id: number; code: string; type: 'percent' | 'fixed'; value: string;
    min_order: string | null; max_discount: string | null;
    usage_limit: number | null; used_count: number; per_user_limit: number | null;
    starts_at: string | null; expires_at: string | null; is_active: number;
  }>('SELECT * FROM coupons WHERE UPPER(code) = ?', [code]);

  const coupon = rows[0];
  if (!coupon || !coupon.is_active) return { ok: false, error: 'That code isn’t valid.' };

  const now = Date.now();
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) {
    return { ok: false, error: 'That code isn’t active yet.' };
  }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < now) {
    return { ok: false, error: 'That code has expired.' };
  }
  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return { ok: false, error: 'That code has been fully redeemed.' };
  }

  // Per-user limit: how many times THIS customer has already redeemed it. Counts
  // their live orders carrying this coupon — a cancelled/expired/refunded order
  // freed the redemption, so it does not count against them.
  if (coupon.per_user_limit !== null && customerId != null) {
    const [used] = await query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM orders
        WHERE user_id = ? AND coupon_id = ?
          AND status NOT IN ('cancelled', 'expired', 'refunded')`,
      [customerId, coupon.id],
    );
    if (Number(used?.n ?? 0) >= coupon.per_user_limit) {
      return { ok: false, error: 'You have already used this code.' };
    }
  }

  const min = Number(coupon.min_order ?? 0);
  if (min > 0 && subtotal < min) {
    return { ok: false, error: `Spend ৳ ${min.toLocaleString('en-IN')} to use this code.` };
  }

  const value = Number(coupon.value);
  let discount = coupon.type === 'percent' ? Math.round((subtotal * value) / 100) : Math.round(value);
  const cap = Number(coupon.max_discount ?? 0);
  if (cap > 0) discount = Math.min(discount, cap);
  // Never let a coupon pay the customer.
  discount = Math.min(discount, subtotal);

  return {
    ok: true,
    code: coupon.code,
    couponId: coupon.id,
    discount,
    label: coupon.type === 'percent' ? `${value}% off` : `৳ ${value.toLocaleString('en-IN')} off`,
  };
}

/* ── Totals ───────────────────────────────────────────────────────────── */

export const VAT_RATE = 5;          // %
export const SHIPPING_FLAT = 150;   // ৳, insured courier
export const FREE_SHIPPING_OVER = 100_000;

export interface Totals {
  subtotal: number;
  makingCharge: number;
  stoneCharge: number;
  discount: number;
  taxRate: number;
  tax: number;
  shipping: number;
  grandTotal: number;
}

/**
 * One place where money is added up, used by the summary panel AND by the order
 * that gets written — so the number the customer agreed to is the number stored.
 * Making and stone charges are shown for transparency but are already inside the
 * line price (that is how the catalogue prices a piece), so they are NOT added
 * again here.
 */
export function totalsFor(lines: CheckoutLine[], discount = 0): Totals {
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const makingCharge = lines.reduce((n, l) => n + l.makingCharge * l.qty, 0);
  const stoneCharge = lines.reduce((n, l) => n + l.stoneCharge * l.qty, 0);
  const capped = Math.min(discount, subtotal);
  const taxable = subtotal - capped;
  const tax = Math.round((taxable * VAT_RATE) / 100);
  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FLAT;
  return {
    subtotal,
    makingCharge,
    stoneCharge,
    discount: capped,
    taxRate: VAT_RATE,
    tax,
    shipping,
    grandTotal: taxable + tax + shipping,
  };
}
