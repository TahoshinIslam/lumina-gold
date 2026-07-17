'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { rm, unlink } from 'fs/promises';
import path from 'path';
import { query, db } from '@/server/db/client';
import { ADMIN_COOKIE } from '@/server/auth/admin';
import { signSession, SESSION_TTL_SEC } from '@/server/auth/adminSession';
import { verifyPassword } from '@/server/auth/password';
import {
  ensureAdminSeed,
  getAdminByEmail,
  getAdminById,
  touchLastLogin,
  updateAdminPassword,
  updateAdminProfile,
  normaliseEmail,
} from '@/server/dal/adminUsers';
import { verifySession } from '@/server/auth/adminSession';
import { VARIANT_AXIS_CODES } from '@/config/sizes';
import { homeSection } from '@/config/home';
import { readingMinutes } from '@/server/dal/journal';
import { HOME_TAG } from '@/server/dal/homepage';
import { PRODUCT_RAILS_TAG } from '@/server/dal/productpage';
import { CATALOG_TAG } from '@/server/dal/browse';
import { SESSION_COOKIE_OPTIONS } from '@/server/auth/cookieOptions';
import { hit, reset, clientKey, LIMITS } from '@/server/security/rateLimit';
import { audit } from '@/server/security/audit';
import { deductStock, restoreStock, recordMovement, claimSerials, releaseSerials } from '@/server/dal/inventory';
import { recordRefund } from '@/server/analytics';
import type { ActionResult } from '@/features/admin/components/AdminFeedback';
import type { PoolConnection } from 'mysql2/promise';

const UPLOAD_SIZES = ['original', 'zoom', 'large', 'medium', 'thumb'];
const productUploadDir = (sku: string) => path.join(process.cwd(), 'public', 'uploads', 'products', sku);

/**
 * The home page and the cached data behind it, together.
 *
 * The page is rendered per request but its queries are not — they sit behind
 * unstable_cache (server/dal/homepage.ts). Purging the route alone would re-render
 * the page from the SAME stale data, so an admin edit would appear to do nothing
 * for up to a minute. Both, or neither.
 */
function revalidateHome() {
  revalidatePath('/');
  // `{ expire: 0 }` — expire it NOW, not at the end of its window. The
  // single-argument form is deprecated in Next 16.
  revalidateTag(HOME_TAG, { expire: 0 });
}

/** Revalidate every storefront surface a product mutation can affect. */
function revalidateStorefront() {
  revalidatePath('/admin/products');
  revalidateHome();
  revalidatePath('/shop');
  // Every product page carries two rails of OTHER pieces, cached together. Editing
  // any product can change what belongs in them, so they all go at once — there is
  // no cheap way to know which rails a given piece appears in.
  revalidateTag(PRODUCT_RAILS_TAG, { expire: 0 });
  revalidatePath('/products', 'layout');
  // Every listing — /shop, /categories/*, /jewelry/* — filters a cached copy of
  // the catalogue. A saved product can change what is in it, what it costs, and
  // therefore which filters it answers to.
  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath('/categories', 'layout');
  revalidatePath('/jewelry', 'layout');
}

/** A campaign appears as the home page banner and at /campaigns/[slug]; the admin
 *  list also lists it. The home page is cached, so a campaign edit that skipped
 *  this would not show until the page's timer lapsed. */
function revalidateCampaigns() {
  revalidatePath('/admin/campaigns');
  revalidateHome();
  revalidatePath('/campaigns', 'layout'); // every /campaigns/[slug]
}

function feedbackUrl(url: string, message: string, tone: 'success' | 'warning' | 'error' | 'info' = 'success') {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}toast=${encodeURIComponent(message)}&tone=${tone}`;
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

/**
 * A valid scrypt hash that no password produces. Login runs verifyPassword
 * against THIS when the email is unknown, so a missing account and a wrong
 * password cost the same scrypt work — otherwise the response time tells an
 * attacker which admin emails are real. (Rate limiting already bounds guessing;
 * this closes the enumeration side-channel underneath it.)
 */
const DUMMY_HASH =
  'scrypt$16384$8$1$64$BUHCjcM4ckgaj8RvcRlWZA==$8HJKXIJdmTyk8S1tqSZQgt+ABDd/E5uGLfbp0mNzmK7siMxs2SFe/jeojxcXMam4UVktNHscQ1ryR71YoqWRLQ==';

export async function loginAction(formData: FormData) {
  // Five tries per quarter-hour, per IP. Without it an attacker gets unlimited
  // guesses; with rows now per-admin in the database, that is a password
  // brute-force, which is exactly what this bounds.
  const key = await clientKey('admin-login');
  const gate = hit(key, LIMITS.login.limit, LIMITS.login.windowSec);
  if (!gate.ok) {
    redirect(`/admin/login?error=throttled&retry=${gate.retryAfterSec}`);
  }

  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  // First-ever login: the table ships empty, so seed one Super Admin from
  // ADMIN_EMAIL + ADMIN_PASSWORD. No-ops once a row exists.
  await ensureAdminSeed();

  const admin = await getAdminByEmail(email);
  // Always run the KDF — against the real hash if the admin exists, a dummy if
  // not — so timing does not distinguish "no such email" from "wrong password".
  const passwordOk = await verifyPassword(password, admin?.password_hash ?? DUMMY_HASH);

  if (!admin || admin.is_active !== 1 || !passwordOk) {
    // A failed admin sign-in is the highest-signal event on the site: a run of
    // these from one IP IS the attack, and without a row here nobody would know.
    await audit({ action: 'admin.login_failed', entityType: 'admin' });
    redirect('/admin/login?error=1');
  }

  // Signed in: forget the failures, so a legitimate admin who mistyped twice is
  // not left one attempt from a lockout.
  reset(key);
  await audit({ action: 'admin.login', entityType: 'admin', entityId: admin.id });
  await touchLastLogin(admin.id);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signSession(admin.id), {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: SESSION_TTL_SEC,
  });
  redirect('/admin');
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

/* ── Profile (self-service account management) ────────────────────────── */

/** The signed-in admin, resolved from the session cookie, or null. Every
 *  profile action re-derives identity from the cookie — never from a form
 *  field — so one admin cannot edit another by tampering with a hidden id. */
async function currentAdmin() {
  const jar = await cookies();
  const id = verifySession(jar.get(ADMIN_COOKIE)?.value);
  return id ? getAdminById(id) : null;
}

const PROFILE_URL = '/admin/profile';

export async function updateProfileAction(formData: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');

  const name = String(formData.get('name') || '').trim();
  const email = normaliseEmail(String(formData.get('email') || ''));
  if (!name) redirect(feedbackUrl(PROFILE_URL, 'Name cannot be empty', 'warning'));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect(feedbackUrl(PROFILE_URL, 'Enter a valid email address', 'warning'));
  }

  try {
    await updateAdminProfile(admin.id, { name, email });
  } catch {
    // email is UNIQUE — a collision is the realistic failure, not a 500.
    redirect(feedbackUrl(PROFILE_URL, 'That email is already in use', 'warning'));
  }
  await audit({ action: 'admin.profile_updated', entityType: 'admin', entityId: admin.id });
  redirect(feedbackUrl(PROFILE_URL, 'Profile updated'));
}

export async function changePasswordAction(formData: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');

  const current = String(formData.get('current_password') || '');
  const next = String(formData.get('new_password') || '');
  const confirm = String(formData.get('confirm_password') || '');

  // Knowing the current password is what stops someone with a borrowed, still
  // open session from locking the real admin out by changing it.
  if (!(await verifyPassword(current, admin.password_hash))) {
    await audit({ action: 'admin.password_change_failed', entityType: 'admin', entityId: admin.id });
    redirect(feedbackUrl(PROFILE_URL, 'Current password is incorrect', 'warning'));
  }
  if (next.length < 10) {
    redirect(feedbackUrl(PROFILE_URL, 'New password must be at least 10 characters', 'warning'));
  }
  if (next !== confirm) {
    redirect(feedbackUrl(PROFILE_URL, 'New passwords do not match', 'warning'));
  }

  await updateAdminPassword(admin.id, next);
  await audit({ action: 'admin.password_changed', entityType: 'admin', entityId: admin.id });

  // The session token is keyed to the admin id, not the password, so it stays
  // valid — the person who just changed their own password is not signed out.
  redirect(feedbackUrl(PROFILE_URL, 'Password changed'));
}

/* ── Inventory (adjust stock, delete a variant) ───────────────────────── */

const INVENTORY_URL = '/admin/inventory';

/**
 * Set a variant's on-hand quantity to an exact number.
 *
 * Returns an ActionResult (not a redirect) because it is driven by an inline
 * AJAX form — the row updates in place via revalidatePath rather than a full
 * navigation, which matters when you are correcting a dozen counts in a row.
 *
 * The write is transactional and records an inventory_movement, because a
 * quantity_available that changed with no movement row is the "who took this
 * off the shelf?" question the movement log exists to answer. Availability is
 * kept honest as a side effect: a stocked line that hits 0 flips to
 * out_of_stock, and a refilled one flips back — this is the "0 but still says
 * In Stock" oddity, fixed at the source. made_to_order / ready_to_ship are left
 * alone: 0 on hand is legitimate for them.
 */
export async function setStockAction(formData: FormData): Promise<ActionResult> {
  const admin = await currentAdmin();
  if (!admin) return { ok: false, message: 'Your session expired — sign in again.' };

  const variantId = Number(formData.get('variant_id'));
  const qty = Number(String(formData.get('qty') ?? '').trim());
  if (!variantId || !Number.isInteger(qty) || qty < 0 || qty > 1_000_000) {
    return { ok: false, message: 'Enter a whole number of units (0–1,000,000).' };
  }

  let outcome: ActionResult = { ok: true, message: `Stock set to ${qty} unit${qty === 1 ? '' : 's'}.` };
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // FOR UPDATE: lock the row so a concurrent order's deduct/reserve serialises
    // against this manual set instead of racing it.
    const [rows] = await conn.query(
      `SELECT quantity_available AS qa, availability AS av FROM inventory WHERE variant_id = ? FOR UPDATE`,
      [variantId],
    );
    const cur = (rows as { qa: number; av: string }[])[0];
    if (!cur) {
      await conn.rollback();
      outcome = { ok: false, message: 'That variant no longer exists.' };
    } else {
      const delta = qty - Number(cur.qa);
      let availability = cur.av;
      if (qty === 0 && availability === 'in_stock') availability = 'out_of_stock';
      else if (qty > 0 && availability === 'out_of_stock') availability = 'in_stock';

      await conn.query(
        `UPDATE inventory SET quantity_available = ?, availability = ? WHERE variant_id = ?`,
        [qty, availability, variantId],
      );
      if (delta !== 0) {
        await recordMovement(conn as unknown as PoolConnection, {
          variantId, type: 'adjustment', quantity: delta,
          referenceType: 'admin', referenceId: admin.id, note: `Manual set to ${qty}`,
        });
      }
      await conn.commit();
    }
  } catch {
    await conn.rollback().catch(() => {});
    outcome = { ok: false, message: 'Could not update stock — please retry.' };
  } finally {
    conn.release();
  }

  if (outcome.ok) {
    await audit({ action: 'inventory.stock_set', entityType: 'variant', entityId: variantId, after: { qty } });
    revalidatePath(INVENTORY_URL);
  }
  return outcome;
}

/**
 * Delete a variant outright.
 *
 * FK-safe by the schema's own design: order_items.variant_id is ON DELETE SET
 * NULL and the line already snapshots product_name / variant_sku / unit_price,
 * so order history survives intact; inventory, prices, images, and serials
 * cascade away. The one thing that must NOT be deleted is a variant with live
 * reservations — that would strand a cart or an unpaid order mid-checkout — so
 * a positive quantity_reserved refuses the delete.
 */
export async function deleteVariantAction(formData: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');

  const variantId = Number(formData.get('variant_id'));
  if (!variantId) redirect(feedbackUrl(INVENTORY_URL, 'Missing variant', 'warning'));

  const rows = await query<{ reserved: number; sku: string }>(
    `SELECT COALESCE(i.quantity_reserved, 0) AS reserved, v.variant_sku AS sku
       FROM product_variants v LEFT JOIN inventory i ON i.variant_id = v.id
      WHERE v.id = ? LIMIT 1`,
    [variantId],
  );
  const row = rows[0];
  if (!row) redirect(feedbackUrl(INVENTORY_URL, 'That variant no longer exists', 'warning'));
  if (Number(row.reserved) > 0) {
    redirect(feedbackUrl(
      INVENTORY_URL,
      `Cannot delete ${row.sku}: ${row.reserved} unit(s) are reserved for a live order`,
      'warning',
    ));
  }

  await query(`DELETE FROM product_variants WHERE id = ?`, [variantId]);
  await audit({ action: 'inventory.variant_deleted', entityType: 'variant', entityId: variantId, before: { sku: row.sku } });
  revalidateStorefront();
  redirect(feedbackUrl(INVENTORY_URL, `Variant ${row.sku} deleted`));
}

/* ── Products ─────────────────────────────────────────────────────────── */

/** Replace a product's rows in a many-to-many pivot with the checked ids. */
const pivotUpsertMany = async (table: string, col: string, productId: number, values: FormDataEntryValue[]) => {
  await query(`DELETE FROM ${table} WHERE product_id = ?`, [productId]);
  const ids = values.map(Number).filter(Boolean);
  if (ids.length) {
    await query(
      `INSERT INTO ${table} (product_id, ${col}) VALUES ${ids.map(() => '(?, ?)').join(', ')}`,
      ids.flatMap(id => [productId, id]),
    );
  }
};

/** Next sequential SKU (LUM-####). SKUs are system-owned and immutable, so this
 * is the only place they're minted — no user typing means no collisions. */
export async function nextSku(): Promise<string> {
  const rows = await query<{ max_sku: number | null }>(
    `SELECT MAX(CAST(SUBSTRING(sku, 5) AS UNSIGNED)) max_sku
     FROM products WHERE sku REGEXP '^LUM-[0-9]+$'`,
  );
  const max = Number(rows[0]?.max_sku ?? 0);
  return `LUM-${String(max + 1).padStart(4, '0')}`;
}

/** slug is UNIQUE; append -2, -3… on collision so two same-named products can't crash the insert. */
async function uniqueSlug(base: string, excludeId: number | null): Promise<string> {
  const root = base || 'product';
  let slug = root;
  let n = 1;
  for (;;) {
    const rows = await query<{ id: number }>('SELECT id FROM products WHERE slug = ? AND id <> ?', [slug, excludeId ?? 0]);
    if (!rows[0]) return slug;
    slug = `${root}-${++n}`;
  }
}

export async function saveProductAction(formData: FormData) {
  const id = Number(formData.get('id')) || null;
  const name = String(formData.get('name') || '').trim();
  const backTo = id ? `/admin/products/${id}/edit` : '/admin/products/new';
  if (!name) redirect(`${backTo}?error=missing`);

  // Checked up here, BEFORE the product row is written — a metal-less product
  // used to reach the storefront and be silently rendered as Gold. The <select>
  // is `required` too, but client validation is bypassable.
  const metalId = Number(formData.get('metal_id')) || null;
  if (!metalId) redirect(`${backTo}?error=metal`);

  // SKU is system-owned: reuse the existing one on edit, mint a fresh one on
  // create (the form submits the SKU reserved when it opened — the one images
  // were uploaded under). Re-check to survive the rare concurrent-reserve race.
  let sku: string;
  if (id) {
    const cur = await query<{ sku: string }>('SELECT sku FROM products WHERE id = ?', [id]);
    sku = cur[0]?.sku ?? await nextSku();
  } else {
    sku = String(formData.get('sku') || '').trim() || await nextSku();
    const taken = await query<{ id: number }>('SELECT id FROM products WHERE sku = ?', [sku]);
    if (taken[0]) sku = await nextSku();
  }

  const baseSlug = name.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const slug = await uniqueSlug(baseSlug, id);
  const fields = {
    sku, slug, name,
    short_description: String(formData.get('description') || '').slice(0, 500),
    description: String(formData.get('description') || ''),
    status: String(formData.get('status') || 'active'),
    is_featured: formData.get('featured') ? 1 : 0,
    is_new_arrival: formData.get('new_arrival') ? 1 : 0,
    is_best_seller: formData.get('best_seller') ? 1 : 0,
  };

  let productId = id;
  if (id) {
    await query(
      `UPDATE products SET sku=?, slug=?, name=?, short_description=?, description=?, status=?, is_featured=?, is_new_arrival=?, is_best_seller=? WHERE id=?`,
      [...Object.values(fields), id],
    );
  } else {
    const [res] = await db.query(
      `INSERT INTO products (sku, slug, name, short_description, description, status, is_featured, is_new_arrival, is_best_seller)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(fields),
    );
    productId = (res as { insertId: number }).insertId;
  }

  await pivotUpsertMany('product_categories', 'category_id', productId!, formData.getAll('category_ids'));
  await pivotUpsertMany('product_collections', 'collection_id', productId!, formData.getAll('collection_ids'));
  await pivotUpsertMany('product_genders', 'gender_id', productId!, formData.getAll('gender_ids'));
  await pivotUpsertMany('product_occasions', 'occasion_id', productId!, formData.getAll('occasion_ids'));
  await pivotUpsertMany('product_styles', 'style_id', productId!, formData.getAll('style_ids'));
  await pivotUpsertMany('product_tags', 'tag_id', productId!, formData.getAll('tag_ids'));

  // Metal + Metal Color are product-level — every variant of a product
  // shares them. Purity and the size axis (Ring Size / Chain Length) vary
  // per row; see ProductVariantsEditor. Every real, priced combination is a
  // `product_variants` row with its own price/compare/cost/stock/weight/
  // barcode/status, submitted as one JSON blob (variable-length array,
  // simplest way through a native form POST).
  const colorId = Number(formData.get('metal_color_id')) || null;

  // Fixed, or follows today's gold rate. One choice for the whole product — a
  // ring priced by rate in 22K and by hand in 24K would be a shop with two
  // pricing policies.
  const pricingMode = String(formData.get('pricing_mode')) === 'rate_based' ? 'rate_based' : 'fixed';

  interface VariantInput {
    id?: number; purityId: number | null; sizeValueId: number | null; sku: string;
    price: string; comparePrice: string; costPrice: string; stock: string; weight: string;
    barcode: string; status: 'active' | 'inactive';
    makingCharge?: string; wastagePercent?: string;
  }
  let variantInputs: VariantInput[] = [];
  try {
    variantInputs = JSON.parse(String(formData.get('variants_json') || '[]'));
  } catch { /* malformed payload — falls through to the empty-array guard below */ }
  if (!variantInputs.length) redirect(`${backTo}?error=missing`);

  // Remove variant rows the admin deleted from the editor (FK cascades to
  // their pricing/inventory/attribute/image/stone/certificate rows).
  const existingVariantRows = await query<{ id: number }>('SELECT id FROM product_variants WHERE product_id = ?', [productId]);
  const keptIds = new Set(variantInputs.filter(v => v.id).map(v => v.id as number));
  const removedIds = existingVariantRows.map(r => r.id).filter(vid => !keptIds.has(vid));
  if (removedIds.length) {
    await query(`DELETE FROM product_variants WHERE id IN (${removedIds.map(() => '?').join(',')})`, removedIds);
  }

  // Every SELECTABLE axis's values (is_variant_level = 1) — Ring Size, Bangle
  // Size, Length. Dimensions are excluded by that flag, so they can never end up
  // on variant_attributes and multiply this product's SKUs.
  const sizeValueRows = await query<{ id: number }>(
    `SELECT av.id FROM attribute_values av JOIN attributes a ON a.id = av.attribute_id
     WHERE a.is_variant_level = 1`,
  );
  const allSizeValueIds = new Set(sizeValueRows.map(r => r.id));

  let defaultVariantId: number | null = null;
  for (let i = 0; i < variantInputs.length; i++) {
    const v = variantInputs[i];
    const isDefault = i === 0 ? 1 : 0;
    const weight = v.weight ? Number(v.weight) : null;
    const barcode = v.barcode?.trim() || null;
    const status = v.status === 'inactive' ? 'inactive' : 'active';
    const variantSku = v.sku?.trim() || `${sku}-${String(i + 1).padStart(2, '0')}`;

    let variantId = v.id;
    if (variantId) {
      await query(
        `UPDATE product_variants SET variant_sku=?, barcode=?, metal_id=?, purity_id=?, metal_color_id=?, metal_weight_g=?, is_default=?, status=? WHERE id=?`,
        [variantSku, barcode, metalId, v.purityId, colorId, weight, isDefault, status, variantId],
      );
    } else {
      const [vres] = await db.query(
        `INSERT INTO product_variants (product_id, variant_sku, barcode, metal_id, purity_id, metal_color_id, metal_weight_g, is_default, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [productId, variantSku, barcode, metalId, v.purityId, colorId, weight, isDefault, status],
      );
      variantId = (vres as { insertId: number }).insertId;
    }
    if (isDefault) defaultVariantId = variantId!;

    const price = v.price ? Number(v.price) : 0;
    const comparePrice = v.comparePrice ? Number(v.comparePrice) : null;
    const costPrice = v.costPrice ? Number(v.costPrice) : null;
    // Discount amount is a product-level markdown flag (drives the homepage
    // Discounts tab) — only the default variant carries it, same as before.
    const discountAmount = isDefault ? Number(formData.get('discount_amount')) || 0 : 0;
    await query(
      // pricing_mode was hardcoded to 'fixed', which is why the Gold Rates screen
      // changed nothing: no piece could ever be priced from a rate. It now comes
      // from the form, along with the making charge and wastage the rate-based
      // formula needs (see @/server/pricing).
      `INSERT INTO variant_price_components
         (variant_id, pricing_mode, fixed_price, compare_price, cost_price, discount_amount,
          making_charge, wastage_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pricing_mode=VALUES(pricing_mode), fixed_price=VALUES(fixed_price),
         compare_price=VALUES(compare_price), cost_price=VALUES(cost_price),
         discount_amount=VALUES(discount_amount), making_charge=VALUES(making_charge),
         wastage_percent=VALUES(wastage_percent)`,
      [variantId, pricingMode, price, comparePrice, costPrice, discountAmount,
       Number(v.makingCharge) || 0, Number(v.wastagePercent) || 0],
    );
    await query(
      `INSERT INTO price_history (variant_id, price, sale_price, effective_at, reason) VALUES (?, ?, ?, NOW(), 'admin edit')`,
      [variantId, price, discountAmount > 0 ? price - discountAmount : null],
    );

    const stock = v.stock !== '' && v.stock != null ? Number(v.stock) : 0;
    // Availability status is also product-level for now — default variant only.
    const availability = isDefault ? String(formData.get('availability') || 'in_stock') : 'in_stock';

    // A manual stock edit is a stock movement like any other, and it used to
    // leave no trace: an admin typing "12" over "3" moved nine pieces with
    // nothing in the ledger to show for it. Record the delta as an adjustment.
    const [prev] = await query<{ quantity_available: number }>(
      'SELECT quantity_available FROM inventory WHERE variant_id = ? AND warehouse_id = 1', [variantId],
    );
    const before = prev ? Number(prev.quantity_available) : 0;

    await query(
      `INSERT INTO inventory (variant_id, warehouse_id, quantity_available, availability)
       VALUES (?, 1, ?, ?) ON DUPLICATE KEY UPDATE quantity_available=VALUES(quantity_available), availability=VALUES(availability)`,
      [variantId, stock, availability],
    );

    if (stock !== before) {
      await query(
        `INSERT INTO inventory_movements
           (variant_id, warehouse_id, movement_type, quantity, reference_type, note)
         VALUES (?, 1, 'adjustment', ?, 'admin', 'manual stock edit')`,
        [variantId, stock - before],
      );
    }

    if (allSizeValueIds.size) {
      const ids = [...allSizeValueIds];
      await query(
        `DELETE FROM variant_attributes WHERE variant_id = ? AND attribute_value_id IN (${ids.map(() => '?').join(',')})`,
        [variantId, ...ids],
      );
      if (v.sizeValueId && allSizeValueIds.has(v.sizeValueId)) {
        await query(
          'INSERT IGNORE INTO variant_attributes (variant_id, attribute_value_id) VALUES (?, ?)',
          [variantId, v.sizeValueId],
        );
      }
    }
  }

  // Diamond Information — optional, only saved while "Has diamonds" is
  // checked. Stored as a single variant_stones row (Diamond stone type) plus
  // an optional certificates row, both keyed off the default variant.
  const hasDiamonds = !!formData.get('has_diamonds');
  const stoneRows = await query<{ id: number }>(
    `SELECT id FROM variant_stones WHERE variant_id = ? ORDER BY is_center_stone DESC, id LIMIT 1`,
    [defaultVariantId],
  );
  if (hasDiamonds) {
    const stoneTypeId = Number(formData.get('stone_type_id')) || null;
    const isLabGrown = formData.get('diamond_type') === 'lab_grown' ? 1 : 0;
    const shapeId = Number(formData.get('diamond_shape_id')) || null;
    const colorId = Number(formData.get('diamond_color_id')) || null;
    const clarityId = Number(formData.get('diamond_clarity_id')) || null;
    const cutId = Number(formData.get('diamond_cut_id')) || null;
    const caratEach = Number(formData.get('diamond_carat_each')) || null;
    const caratTotal = Number(formData.get('diamond_carat_total')) || null;
    const quantity = Number(formData.get('diamond_quantity')) || 1;

    if (stoneRows[0] && stoneTypeId) {
      await query(
        `UPDATE variant_stones SET stone_type_id=?, is_lab_grown=?, stone_shape_id=?, stone_color_id=?, stone_clarity_id=?,
           stone_cut_id=?, carat_each=?, carat_total=?, quantity=? WHERE id=?`,
        [stoneTypeId, isLabGrown, shapeId, colorId, clarityId, cutId, caratEach, caratTotal, quantity, stoneRows[0].id],
      );
    } else if (stoneTypeId) {
        await query(
          `INSERT INTO variant_stones
             (variant_id, stone_type_id, is_lab_grown, stone_shape_id, stone_color_id, stone_clarity_id,
              stone_cut_id, carat_each, carat_total, quantity, is_center_stone)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [defaultVariantId, stoneTypeId, isLabGrown, shapeId, colorId, clarityId, cutId, caratEach, caratTotal, quantity],
        );
    }

    const certIssuer = String(formData.get('diamond_cert_issuer') || '').trim();
    const certNumber = String(formData.get('diamond_cert_number') || '').trim();
    await query('DELETE FROM certificates WHERE variant_id = ?', [defaultVariantId]);
    if (certIssuer && certNumber) {
      await query(
        `INSERT INTO certificates (variant_id, certificate_no, issuer) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE variant_id = VALUES(variant_id)`,
        [defaultVariantId, certNumber, certIssuer],
      );
    }
  } else {
    if (stoneRows[0]) await query('DELETE FROM variant_stones WHERE id = ?', [stoneRows[0].id]);
    await query('DELETE FROM certificates WHERE variant_id = ?', [defaultVariantId]);
  }

  // New images uploaded this submit (existing product_images rows are
  // managed independently via deleteProductImageAction/setPrimaryImageAction
  // — they take effect immediately and aren't resubmitted here).
  const newImages = formData.getAll('new_images').map(String).filter(Boolean);
  if (newImages.length) {
    const maxSort = await query<{ m: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) m FROM product_images WHERE product_id = ?', [productId],
    );
    let sortOrder = maxSort[0].m + 1;
    for (const imagePath of newImages) {
      await query(
        'INSERT INTO product_images (product_id, image_path, sort_order, is_primary) VALUES (?, ?, ?, 0)',
        [productId, imagePath, sortOrder++],
      );
    }
  }
  // Every product needs exactly one primary image once it has any at all.
  const hasPrimary = await query<{ id: number }>(
    'SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1', [productId],
  );
  if (!hasPrimary[0]) {
    const first = await query<{ id: number }>(
      'SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1', [productId],
    );
    if (first[0]) await query('UPDATE product_images SET is_primary = 1 WHERE id = ?', [first[0].id]);
  }

  const metaTitle = String(formData.get('meta_title') || '').trim() || null;
  const metaDescription = String(formData.get('meta_description') || '').trim() || null;
  const metaKeywords = String(formData.get('meta_keywords') || '').trim() || null;
  const ogImage = String(formData.get('og_image') || '').trim() || null;
  if (metaTitle || metaDescription || metaKeywords || ogImage) {
    await query(
      `INSERT INTO seo_meta (entity_type, entity_id, meta_title, meta_description, meta_keywords, og_image)
       VALUES ('product', ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description),
         meta_keywords=VALUES(meta_keywords), og_image=VALUES(og_image)`,
      [productId, metaTitle, metaDescription, metaKeywords, ogImage],
    );
  } else {
    await query(`DELETE FROM seo_meta WHERE entity_type = 'product' AND entity_id = ?`, [productId]);
  }

  /* Measured dimensions — one row per product, NOT a variant. Posted as
   * spec_<code> by the product form. A blank field means "not measured", so it
   * is deleted rather than stored as an empty string. */
  const specAttrs = await query<{ id: number; code: string }>(
    'SELECT id, code FROM attributes WHERE is_variant_level = 0',
  );
  for (const attr of specAttrs) {
    const value = String(formData.get(`spec_${attr.code}`) ?? '').trim();
    if (value) {
      await query(
        `INSERT INTO product_specifications (product_id, attribute_id, value) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)`,
        [productId, attr.id, value],
      );
    } else {
      await query(
        'DELETE FROM product_specifications WHERE product_id = ? AND attribute_id = ?',
        [productId, attr.id],
      );
    }
  }

  revalidateStorefront();
  redirect(feedbackUrl('/admin/products', id ? 'Product updated successfully' : 'Product created successfully'));
}

/** Delete one uploaded image: DB row + every resized rendition on disk. */
export async function deleteProductImageAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  const rows = await query<{ image_path: string; product_id: number; sku: string; was_primary: number }>(
    `SELECT pi.image_path, pi.product_id, p.sku, pi.is_primary AS was_primary
     FROM product_images pi JOIN products p ON p.id = pi.product_id WHERE pi.id = ?`,
    [id],
  );
  const row = rows[0];
  if (!row) return;

  await query('DELETE FROM product_images WHERE id = ?', [id]);

  const filename = path.basename(row.image_path);
  await Promise.all(
    UPLOAD_SIZES.map(size => unlink(path.join(productUploadDir(row.sku), size, filename)).catch(() => {})),
  );

  // The deleted image was primary — promote whichever image is next in order.
  if (row.was_primary) {
    const next = await query<{ id: number }>(
      'SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1', [row.product_id],
    );
    if (next[0]) await query('UPDATE product_images SET is_primary = 1 WHERE id = ?', [next[0].id]);
  }

  revalidateStorefront();
}

export async function setPrimaryImageAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  const rows = await query<{ product_id: number }>('SELECT product_id FROM product_images WHERE id = ?', [id]);
  if (!rows[0]) return;
  await query('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [rows[0].product_id]);
  await query('UPDATE product_images SET is_primary = 1 WHERE id = ?', [id]);
  revalidateStorefront();
}

/**
 * Register unique serial numbers against a variant — the hallmark/certificate
 * number stamped on each physical piece. Once a variant has serials, the
 * checkout claims one per unit sold, so an individual ring cannot leave twice.
 *
 * Idempotent on the serial (INSERT IGNORE against the UNIQUE key), so
 * re-submitting a list already partly entered adds only the new ones.
 */
export async function addSerialsAction(formData: FormData) {
  const variantId = Number(formData.get('variant_id'));
  if (!variantId) return { ok: false, message: 'Missing variant.' };

  // One serial per line, trimmed, de-duplicated, capped to a sane batch.
  const serials = [...new Set(
    String(formData.get('serials') || '')
      .split(/[\n,]/).map(s => s.trim()).filter(Boolean),
  )].slice(0, 500);
  if (!serials.length) return { ok: false, message: 'Enter at least one serial number.' };

  let added = 0;
  for (const serial of serials) {
    const [res] = await db.query(
      `INSERT IGNORE INTO product_serials (variant_id, serial_number, status) VALUES (?, ?, 'in_stock')`,
      [variantId, serial.slice(0, 80)],
    );
    added += (res as { affectedRows: number }).affectedRows;
  }
  if (added) {
    await query(
      `INSERT INTO inventory_movements (variant_id, warehouse_id, movement_type, quantity, reference_type, note)
       VALUES (?, 1, 'adjustment', ?, 'serial', 'serials registered')`,
      [variantId, added],
    );
  }
  await audit({ action: 'serials.add', entityType: 'variant', entityId: variantId, after: { added, requested: serials.length } });
  revalidatePath('/admin/products');
  return { ok: true, message: `${added} serial${added === 1 ? '' : 's'} registered${added < serials.length ? ` (${serials.length - added} already existed)` : ''}.` };
}

export async function deleteProductAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) {
    const rows = await query<{ sku: string }>('SELECT sku FROM products WHERE id = ?', [id]);
    await query('DELETE FROM products WHERE id = ?', [id]); // FK cascades (variants, images, pricing, inventory rows)
    if (rows[0]) await rm(productUploadDir(rows[0].sku), { recursive: true, force: true }).catch(() => {});
    // Cascades through variants, images, pricing and inventory, and takes the
    // upload folder with it. Irreversible, so it is recorded.
    await audit({ action: 'product.delete', entityType: 'product', entityId: id, before: rows[0] ?? null });
  }
  revalidateStorefront();
}

export async function bulkDeleteProductsAction(formData: FormData) {
  const ids = formData.getAll('ids').map(Number).filter(Boolean);
  if (ids.length) {
    const rows = await query<{ sku: string }>(`SELECT sku FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    await query(`DELETE FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids); // FK cascades
    await Promise.all(rows.map(r => rm(productUploadDir(r.sku), { recursive: true, force: true }).catch(() => {})));
    await audit({ action: 'product.bulk_delete', entityType: 'product', before: { ids, skus: rows.map(r => r.sku) } });
  }
  revalidateStorefront();
}

async function bulkSetProductStatus(ids: number[], status: 'draft' | 'active' | 'archived') {
  if (ids.length) {
    await query(`UPDATE products SET status = ? WHERE id IN (${ids.map(() => '?').join(',')})`, [status, ...ids]);
  }
  revalidateStorefront();
}

export async function bulkPublishProductsAction(formData: FormData) {
  await bulkSetProductStatus(formData.getAll('ids').map(Number).filter(Boolean), 'active');
}

export async function bulkUnpublishProductsAction(formData: FormData) {
  await bulkSetProductStatus(formData.getAll('ids').map(Number).filter(Boolean), 'draft');
}

/** Row-level publish/unpublish switch — toggles between draft and active only. */
export async function toggleProductStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  const rows = await query<{ status: string }>('SELECT status FROM products WHERE id = ?', [id]);
  if (!rows[0] || rows[0].status === 'archived') return;
  const next = rows[0].status === 'active' ? 'draft' : 'active';
  await query('UPDATE products SET status = ? WHERE id = ?', [next, id]);
  revalidateStorefront();
}

/* ── Categories ───────────────────────────────────────────────────────── */

export async function addCategoryAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) redirect('/admin/categories/new?error=missing');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const image = String(formData.get('image') || '').trim() || null;
  await query('INSERT IGNORE INTO categories (name, slug, image) VALUES (?, ?, ?)', [name, slug, image]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  revalidateHome(); // the home page's category circles read the same rows
  redirect(feedbackUrl('/admin/categories', 'Category created successfully'));
}

export async function updateCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = String(formData.get('name') || '').trim();
  if (!id || !name) redirect(`/admin/categories/${id}/edit?error=missing`);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Empty means the admin removed the tile image — store NULL, not ''.
  const image = String(formData.get('image') || '').trim() || null;
  await query('UPDATE categories SET name = ?, slug = ?, image = ? WHERE id = ?', [name, slug, image, id]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  revalidateHome();
  redirect(feedbackUrl('/admin/categories', 'Category updated successfully'));
}

export async function deleteCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  const used = await query<{ c: number }>(
    'SELECT COUNT(*) c FROM product_categories WHERE category_id = ?', [id],
  );
  if (used[0].c > 0) redirect(feedbackUrl('/admin/categories', 'Category is still used by products', 'warning'));
  await query('DELETE FROM categories WHERE id = ?', [id]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  revalidateHome();
}

/* ── Home models (the landing page's editorial imagery) ───────────────────
 * A section is a gallery, not a slot: one image sits still, several cross-fade.
 * The home page is force-dynamic, so revalidating '/' is belt-and-braces — it
 * matters if the page is ever made static. */

const homeUploadPath = (image: string) =>
  path.join(process.cwd(), 'public', image.replace(/^\/+/, '').split('?')[0]);

export async function addHomeMediaAction(formData: FormData) {
  const section = String(formData.get('section') || '');
  const image = String(formData.get('image') || '').trim();
  if (!homeSection(section)) return { ok: false, message: 'Unknown section' };
  if (!image) return { ok: false, message: 'Upload an image first' };

  // Appended, not prepended: the admin's existing order is left alone.
  const last = await query<{ n: number | null }>(
    'SELECT MAX(sort_order) n FROM home_media WHERE section = ?', [section],
  );
  // The upload keeps the photo's own proportions, so the page needs them to give
  // it a frame that fits rather than cropping it back into a fixed one.
  const width = Number(formData.get('width')) || null;
  const height = Number(formData.get('height')) || null;
  // Backdrops also carry an upright crop, derived from the same photograph at
  // upload time — see /api/admin/upload-home. NULL for every gallery section.
  const imagePhone = String(formData.get('image_phone') || '').trim() || null;
  await query(
    `INSERT INTO home_media (section, image, image_phone, width, height, alt, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [section, image, imagePhone, width, height,
     String(formData.get('alt') || '').trim() || null, (last[0]?.n ?? 0) + 1],
  );
  revalidatePath('/admin/home');
  revalidateHome();
  return { ok: true, message: 'Image added to the home page' };
}

export async function deleteHomeMediaAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to remove' };
  const rows = await query<{ image: string; image_phone: string | null }>(
    'SELECT image, image_phone FROM home_media WHERE id = ?', [id],
  );
  if (!rows[0]) return { ok: false, message: 'Already removed' };

  await query('DELETE FROM home_media WHERE id = ?', [id]);
  // Only ever deletes inside public/uploads/home, and only a path we wrote —
  // including the upright crop derived from this photograph, if it has one.
  await unlink(homeUploadPath(rows[0].image)).catch(() => {});
  if (rows[0].image_phone) await unlink(homeUploadPath(rows[0].image_phone)).catch(() => {});

  revalidatePath('/admin/home');
  revalidateHome();
  return { ok: true, message: 'Image removed' };
}

/** Swap this image with its neighbour, so the admin controls which card gets what. */
export async function moveHomeMediaAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const dir = String(formData.get('dir')) === 'up' ? 'up' : 'down';
  if (!id) return { ok: false, message: 'Nothing to move' };

  const rows = await query<{ section: string; sort_order: number }>(
    'SELECT section, sort_order FROM home_media WHERE id = ?', [id],
  );
  const current = rows[0];
  if (!current) return { ok: false, message: 'Already removed' };

  // Ties on sort_order are broken by id, exactly as the gallery is ordered.
  const neighbours = await query<{ id: number; sort_order: number }>(
    dir === 'up'
      ? `SELECT id, sort_order FROM home_media
          WHERE section = ? AND (sort_order < ? OR (sort_order = ? AND id < ?))
          ORDER BY sort_order DESC, id DESC LIMIT 1`
      : `SELECT id, sort_order FROM home_media
          WHERE section = ? AND (sort_order > ? OR (sort_order = ? AND id > ?))
          ORDER BY sort_order ASC, id ASC LIMIT 1`,
    [current.section, current.sort_order, current.sort_order, id],
  );
  const swap = neighbours[0];
  if (!swap) return { ok: false, message: dir === 'up' ? 'Already first' : 'Already last' };

  await query('UPDATE home_media SET sort_order = ? WHERE id = ?', [swap.sort_order, id]);
  await query('UPDATE home_media SET sort_order = ? WHERE id = ?', [current.sort_order, swap.id]);
  // Equal sort_orders would leave the order decided by id — force them apart.
  if (swap.sort_order === current.sort_order) {
    await query('UPDATE home_media SET sort_order = ? WHERE id = ?', [current.sort_order - (dir === 'up' ? 1 : -1), id]);
  }

  revalidatePath('/admin/home');
  revalidateHome();
  return { ok: true, message: 'Order updated' };
}

/* ── Sizes (admin-managed, store-wide) ────────────────────────────────────
 * Only CUSTOMER-SELECTABLE axes get a shared option list — Ring Size, Bangle
 * Size, Length. Dimensions (height, width, …) are measured per product and are
 * refused here: an option row for them would make them selectable, which is
 * exactly the SKU explosion this split exists to prevent. See config/sizes.ts. */

export async function addSizeAction(formData: FormData) {
  const code = String(formData.get('code') || '');
  const value = String(formData.get('value') || '').trim();
  if (!VARIANT_AXIS_CODES.includes(code)) return { ok: false, message: 'Not a selectable size option' };
  if (!value) return { ok: false, message: 'Enter a size value' };

  const attr = await query<{ id: number }>('SELECT id FROM attributes WHERE code = ?', [code]);
  const attrId = attr[0]?.id;
  if (!attrId) return { ok: false, message: 'Enter a size value' };
  const mx = await query<{ s: number }>(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 s FROM attribute_values WHERE attribute_id = ?', [attrId],
  );
  await query(
    'INSERT IGNORE INTO attribute_values (attribute_id, value, sort_order) VALUES (?, ?, ?)',
    [attrId, value, mx[0].s],
  );
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/sizes');
  return { ok: true, message: 'Size added successfully' };
}

export async function deleteSizeAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('DELETE FROM attribute_values WHERE id = ?', [id]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/sizes');
  return { ok: true, message: 'Size removed successfully' };
}

/* ── Metal rates ──────────────────────────────────────────────────────── */

export async function addRateAction(formData: FormData) {
  const purityId = Number(formData.get('purity_id'));
  const rate = Number(formData.get('rate'));
  if (!purityId || rate <= 0) return { ok: false, message: 'Enter a valid purity and rate' };
  await query(
    'INSERT INTO metal_rates (purity_id, rate_per_gram, effective_from) VALUES (?, ?, NOW())',
    [purityId, rate],
  );
  // One row here re-prices every rate-based piece in the shop. It is the single
  // most consequential thing an admin can do, and until now it left no trace.
  await audit({ action: 'rate.publish', entityType: 'metal_rate', entityId: purityId,
                after: { purityId, ratePerGram: rate } });

  revalidatePath('/admin/rates');
  // A new rate re-prices every rate-based piece, so the whole storefront is now
  // stale — the home showcases and every listing. Without this the cached home
  // page would keep quoting yesterday's gold price until its timer lapsed.
  revalidateStorefront();
  return { ok: true, message: 'Rate published successfully' };
}

/* ── Offers / Coupons ─────────────────────────────────────────────────── */

export async function saveCouponAction(formData: FormData) {
  const id = Number(formData.get('id')) || null;
  const code = String(formData.get('code') || '').trim().toUpperCase();
  const type = String(formData.get('type') || 'percent');
  const value = Number(formData.get('value')) || 0;
  const minOrder = Number(formData.get('min_order')) || 0;
  const usageLimit = Number(formData.get('usage_limit')) || null;
  const expiresAt = String(formData.get('expires_at') || '') || null;
  if (!code || value <= 0) {
    const back = id ? `/admin/offers/${id}/edit` : '/admin/offers/new';
    redirect(`${feedbackUrl(back, 'Enter a code and a value greater than 0', 'warning')}&error=1`);
  }

  if (id) {
    await query(
      `UPDATE coupons SET code=?, type=?, value=?, min_order=?, usage_limit=?, expires_at=? WHERE id=?`,
      [code, type, value, minOrder, usageLimit, expiresAt, id],
    );
  } else {
    await query(
      `INSERT INTO coupons (code, type, value, min_order, usage_limit, expires_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [code, type, value, minOrder, usageLimit, expiresAt],
    );
  }
  revalidatePath('/admin/offers');
  redirect(feedbackUrl('/admin/offers', id ? 'Coupon updated successfully' : 'Coupon created successfully'));
}

export async function toggleCouponAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('UPDATE coupons SET is_active = 1 - is_active WHERE id = ?', [id]);
  revalidatePath('/admin/offers');
  return { ok: true };
}

export async function deleteCouponAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('DELETE FROM coupons WHERE id = ?', [id]);
  revalidatePath('/admin/offers');
  return { ok: true };
}

/* ── Orders ───────────────────────────────────────────────────────────── */

// Mirrors the enum in 009_orders_commerce.sql — the workshop stages included,
// or an admin could never move an order into 'crafting' or 'hallmarking'.
const ORDER_STATUSES = [
  'reserved', 'pending', 'confirmed', 'processing',
  'crafting', 'hallmarking', 'diamond_setting', 'polishing', 'quality_check', 'packed',
  'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered',
  'cancelled', 'returned', 'refunded', 'expired',
];

/**
 * Mark an order as a TEST (or back to real).
 *
 * An order placed to check that the checkout works is not revenue. Flagging it
 * removes it from every figure on the dashboard AND from the purchase event that
 * feeds the funnel — the analytics queries join `orders` and exclude `is_test`,
 * so the flag is the single source of truth and nothing has to be deleted.
 */
export async function toggleTestOrderAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Order not found' };

  const rows = await query<{ is_test: number; order_no: string }>(
    'SELECT is_test, order_no FROM orders WHERE id = ?', [id],
  );
  const order = rows[0];
  if (!order) return { ok: false, message: 'Order not found' };

  const next = order.is_test ? 0 : 1;
  await query('UPDATE orders SET is_test = ? WHERE id = ?', [next, id]);
  await audit({
    action: 'order.mark_test', entityType: 'order', entityId: id,
    before: { isTest: !!order.is_test }, after: { isTest: !!next },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  return {
    ok: true,
    message: next ? 'Marked as a test order — excluded from revenue' : 'Restored as a real order',
  };
}

/* ── Appointments & bespoke requests ──────────────────────────────────── */

/** Move an enquiry along: new → contacted → scheduled → completed. */
export async function setEnquiryStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  const ALLOWED = ['new', 'contacted', 'scheduled', 'completed', 'cancelled'];
  if (!id || !ALLOWED.includes(status)) return { ok: false, message: 'Nothing to update' };

  await query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  await audit({ action: 'enquiry.status', entityType: 'appointment', entityId: id, after: { status } });

  revalidatePath('/admin/appointments');
  return { ok: true, message: 'Status updated' };
}

/** Confirm a phone booking: lock in the sale, close the hold, clear timer. */
export async function confirmBookingAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query(`UPDATE inventory_reservations SET status = 'fulfilled' WHERE order_id = ? AND status = 'active'`, [id]);
  await query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES (?, 'reserved', 'confirmed', 'confirmed by phone from admin')`,
    [id],
  );
  await query(`UPDATE orders SET status = 'confirmed', reserved_until = NULL WHERE id = ? AND status = 'reserved'`, [id]);
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Booking confirmed' };
}

/** Manually release a hold before it expires (stock returns). */
export async function releaseBookingAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query(
    `UPDATE inventory i JOIN order_items oi ON oi.variant_id = i.variant_id AND i.warehouse_id = 1
     SET i.quantity_available = i.quantity_available + oi.quantity WHERE oi.order_id = ?`, [id],
  );
  // The stock just moved back onto the shelf; log a movement per line so the
  // ledger balances. This was the one restore path that wrote none.
  await query(
    `INSERT INTO inventory_movements (variant_id, warehouse_id, movement_type, quantity, reference_type, reference_id, note)
     SELECT oi.variant_id, 1, 'release', oi.quantity, 'order', oi.order_id, 'hold released from admin'
       FROM order_items oi WHERE oi.order_id = ? AND oi.variant_id IS NOT NULL`, [id],
  );
  await query(`UPDATE inventory_reservations SET status = 'released' WHERE order_id = ? AND status = 'active'`, [id]);
  await query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES (?, 'reserved', 'cancelled', 'hold released from admin')`, [id],
  );
  await query(`UPDATE orders SET status = 'cancelled', reserved_until = NULL WHERE id = ?`, [id]);
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Booking released' };
}

/**
 * Statuses in which the pieces are OFF the shelf — sold, or being made for
 * someone. Everything else means they're back in the boutique.
 *
 * A status change that crosses this line has to move the stock with it, or the
 * shelf and the system quietly disagree: an admin cancelling an order from the
 * dropdown used to leave the stock deducted for ever, so a piece sitting in the
 * safe could never be sold again.
 */
const STOCK_IS_OUT = (status: string) =>
  !['cancelled', 'returned', 'refunded', 'expired'].includes(status);

/** Move an order's stock to match a status change. Runs inside the caller's transaction. */
async function reconcileStock(
  conn: Awaited<ReturnType<typeof db.getConnection>>,
  orderId: number, from: string, to: string,
) {
  const was = STOCK_IS_OUT(from);
  const now = STOCK_IS_OUT(to);
  if (was === now) return; // the line wasn't crossed — nothing to move

  const items = await query<{ variant_id: number; quantity: number }>(
    'SELECT variant_id, quantity FROM order_items WHERE order_id = ?', [orderId],
  );
  // Restoring when it comes back, taking it out again if an order is revived.
  const reviving = !was && now;
  for (const item of items) {
    if (!item.variant_id) continue;

    if (reviving) {
      // Re-opening a cancelled/refunded order (rare, admin-driven). The stock
      // must be there to give — same atomic guard as a fresh sale, or reviving
      // an order could oversell a piece already sold to someone else.
      const took = await deductStock(conn, item.variant_id, item.quantity);
      if (!took) {
        throw new Error('Cannot re-open this order — a piece on it has since sold out.');
      }
      await claimSerials(conn, item.variant_id, item.quantity, orderId);
    } else {
      // Piece coming back to the shelf (cancel/return/refund/expire).
      await restoreStock(conn, item.variant_id, item.quantity);
    }
    await recordMovement(conn, {
      variantId: item.variant_id,
      type: reviving ? 'sale' : 'return',
      quantity: (reviving ? -1 : 1) * item.quantity,
      referenceType: 'order', referenceId: orderId, note: `status → ${to}`,
    });
  }
  if (!reviving) await releaseSerials(conn, orderId);
}

/** Change one order's status, moving its stock with it. */
async function setOrderStatus(id: number, status: string, note: string) {
  const rows = await query<{ status: string; order_no: string }>(
    'SELECT status, order_no FROM orders WHERE id = ?', [id],
  );
  const order = rows[0];
  if (!order || order.status === status) return { ok: false, message: 'Status unchanged' };

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    await conn.query(
      'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES (?, ?, ?, ?)',
      [id, order.status, status, note],
    );
    await reconcileStock(conn, id, order.status, status);
    await conn.commit();

    // Changing an order's status moves stock. Logged after the COMMIT, so the
    // log can never claim a change that was rolled back.
    await audit({
      action: 'order.status', entityType: 'order', entityId: id,
      before: { status: order.status }, after: { status, note },
    });
  } catch (e) {
    await conn.rollback();
    return { ok: false, message: e instanceof Error ? e.message : 'Could not update the order' };
  } finally {
    conn.release();
  }

  revalidatePath(`/account/orders/${order.order_no}`);
  return { ok: true, message: 'Order status updated' };
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  if (!id || !ORDER_STATUSES.includes(status)) return { ok: false, message: 'Invalid status' };
  const result = await setOrderStatus(id, status, 'changed from admin panel');
  revalidatePath('/admin/orders');
  return result;
}

export async function bulkUpdateOrderStatusAction(formData: FormData) {
  const ids = formData.getAll('ids').map(Number).filter(Boolean);
  const status = String(formData.get('status') || '');
  if (!ids.length || !ORDER_STATUSES.includes(status)) return;
  const rows = await query<{ id: number; status: string }>(
    `SELECT id, status FROM orders WHERE id IN (${ids.map(() => '?').join(',')})`, ids,
  );
  for (const row of rows) {
    if (row.status === status) continue;
    // Same path as a single change, so a bulk cancel returns stock too.
    await setOrderStatus(row.id, status, 'bulk update from admin panel');
  }
  revalidatePath('/admin/orders');
}

/* ── Campaigns ────────────────────────────────────────────────────────── */

export async function saveCampaignAction(formData: FormData) {
  const id = Number(formData.get('id')) || null;
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim() || null;
  const startAt = String(formData.get('start_at') || '').replace('T', ' ');
  const endAt = String(formData.get('end_at') || '').replace('T', ' ');
  const section = String(formData.get('section') || 'home_middle');
  const isFeatured = formData.get('is_home_featured') ? 1 : 0;
  const isPublished = formData.get('is_published') ? 1 : 0;
  const productIds = formData.getAll('product_ids').map(Number).filter(Boolean);

  const back = id ? `/admin/campaigns/${id}/edit` : '/admin/campaigns/new';
  if (!title || !startAt || !endAt) redirect(`${feedbackUrl(back, 'Title, start and end date are required', 'warning')}&error=missing`);
  if (new Date(endAt) <= new Date(startAt)) redirect(`${feedbackUrl(back, 'End date must be after start date', 'warning')}&error=dates`);

  let campaignId = id;
  if (id) {
    // Slug isn't regenerated on edit — a title tweak shouldn't reshuffle a URL
    // that might already be shared, and re-deriving it here could collide with
    // another campaign's slug.
    await query(
      `UPDATE campaigns SET title=?, description=?, start_at=?, end_at=?, section=?, is_home_featured=?, is_published=? WHERE id=?`,
      [title, description, startAt, endAt, section, isFeatured, isPublished, id],
    );
  } else {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${base}-${Date.now().toString(36)}`;
    const [res] = await db.query(
      `INSERT INTO campaigns (title, slug, description, start_at, end_at, section, is_home_featured, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, description, startAt, endAt, section, isFeatured, isPublished],
    );
    campaignId = (res as { insertId: number }).insertId;
  }

  // Only one campaign may be featured on the home page at a time.
  if (isFeatured) {
    await query('UPDATE campaigns SET is_home_featured = 0 WHERE id != ?', [campaignId]);
  }

  await query('DELETE FROM campaign_products WHERE campaign_id = ?', [campaignId]);
  if (productIds.length) {
    const values = productIds.map((pid, i) => [campaignId, pid, i]);
    await query(
      `INSERT INTO campaign_products (campaign_id, product_id, sort_order) VALUES ${values.map(() => '(?,?,?)').join(',')}`,
      values.flat(),
    );
  }

  revalidateCampaigns();
  redirect('/admin/campaigns');
}

export async function deleteCampaignAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('DELETE FROM campaigns WHERE id = ?', [id]);
  revalidateCampaigns();
  return { ok: true };
}

export async function bulkDeleteCampaignsAction(formData: FormData) {
  const ids = formData.getAll('ids').map(Number).filter(Boolean);
  if (ids.length) await query(`DELETE FROM campaigns WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
  revalidateCampaigns();
}

export async function toggleCampaignPublishedAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('UPDATE campaigns SET is_published = 1 - is_published WHERE id = ?', [id]);
  revalidateCampaigns();
  return { ok: true };
}

/* ── Fulfilment (Phase 10) ────────────────────────────────────────────────
 * The things a boutique actually does to an order after it lands: ship it,
 * refund it, write a note only staff can see. Each one revalidates the
 * customer's own view of the order too, so the two never disagree. */

/** Courier + tracking number. The shipment row is the source of truth; setting
 *  one also moves the order to 'shipped' if it hasn't got there yet. */
export async function saveShipmentAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const courier = String(formData.get('courier') || '').trim().slice(0, 80);
  const tracking = String(formData.get('tracking_no') || '').trim().slice(0, 120);
  if (!id || !courier) return { ok: false, message: 'Name the delivery partner' };

  const rows = await query<{ order_no: string; status: string }>(
    'SELECT order_no, status FROM orders WHERE id = ?', [id],
  );
  if (!rows[0]) return { ok: false, message: 'Order not found' };

  const existing = await query<{ id: number }>('SELECT id FROM shipments WHERE order_id = ?', [id]);
  if (existing[0]) {
    await query(
      `UPDATE shipments SET courier = ?, tracking_no = ?, status = 'in_transit', shipped_at = COALESCE(shipped_at, NOW())
        WHERE id = ?`,
      [courier, tracking || null, existing[0].id],
    );
  } else {
    await query(
      `INSERT INTO shipments (order_id, courier, tracking_no, status, shipped_at)
       VALUES (?, ?, ?, 'in_transit', NOW())`,
      [id, courier, tracking || null],
    );
  }

  if (!['shipped', 'out_for_delivery', 'delivered'].includes(rows[0].status)) {
    await query(`UPDATE orders SET status = 'shipped' WHERE id = ?`, [id]);
    await query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, ?, 'shipped', ?)`,
      [id, rows[0].status, `handed to ${courier}${tracking ? ` · ${tracking}` : ''}`],
    );
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/account/orders/${rows[0].order_no}`);
  return { ok: true, message: 'Delivery partner saved' };
}

/**
 * Refund an order.
 *
 * Records the money AND puts the stock back, in one transaction: a refund that
 * forgets the inventory is how a boutique ends up selling a piece it no longer
 * has. Cash is not moved here — no gateway is connected — so the refund row is
 * marked 'pending' for whoever actually sends the money.
 */
export async function refundOrderAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const reason = String(formData.get('reason') || '').trim().slice(0, 255) || 'refunded by the boutique';
  // A refund does NOT put the piece back on the shelf by default. A refunded
  // item is often damaged, kept by the customer, or in for repair — silently
  // re-listing it as sellable is how a boutique promises a ring it doesn't have.
  // Restocking is a deliberate tick ("the piece is back and resellable"), off
  // unless the admin says so.
  const restock = formData.get('restock') === 'on' || formData.get('restock') === '1';
  if (!id) return { ok: false, message: 'Order not found' };

  const rows = await query<{ order_no: string; status: string; grand_total: string; payment_method: string }>(
    'SELECT order_no, status, grand_total, payment_method FROM orders WHERE id = ?', [id],
  );
  const order = rows[0];
  if (!order) return { ok: false, message: 'Order not found' };
  if (order.status === 'refunded') return { ok: false, message: 'Already refunded' };

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const items = await query<{ variant_id: number; quantity: number }>(
      'SELECT variant_id, quantity FROM order_items WHERE order_id = ?', [id],
    );
    // Restock ONLY when the admin asked for it AND the stock had actually left
    // (a cancelled/expired/returned order already gave it back — crediting again
    // would invent inventory). Default is to leave the shelf untouched.
    const stockIsOut = !['cancelled', 'expired', 'returned'].includes(order.status);
    if (restock && stockIsOut) {
      for (const item of items) {
        if (!item.variant_id) continue;
        await restoreStock(conn, item.variant_id, item.quantity);
        await recordMovement(conn, {
          variantId: item.variant_id, type: 'return', quantity: item.quantity,
          referenceType: 'order', referenceId: id, note: 'refunded — restocked',
        });
      }
      // The individual pieces come back too, if they were serial-tracked.
      await releaseSerials(conn, id);
    }

    await conn.query(
      `INSERT INTO refunds (order_id, amount, method, status)
       VALUES (?, ?, ?, 'pending')`,
      [id, order.grand_total, order.payment_method],
    );
    await conn.query(
      `INSERT INTO payment_transactions (order_id, method, type, status, amount, currency)
       VALUES (?, ?, 'refund', 'pending', ?, 'BDT')`,
      [id, order.payment_method, order.grand_total],
    );
    await conn.query(`UPDATE orders SET status = 'refunded', payment_status = 'refunded' WHERE id = ?`, [id]);
    await conn.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, ?, 'refunded', ?)`,
      [id, order.status, reason],
    );

    // The refund event, in the same transaction as the refund itself, for the
    // amount actually given back. Stored positive; the dashboard subtracts it.
    await recordRefund(conn, { orderId: id, value: Number(order.grand_total), currency: 'BDT' });

    await conn.commit();

    // Money leaving the business. If any single row in this table matters, it is
    // this one — written after the COMMIT, so the log never claims a refund that
    // was rolled back.
    await audit({
      action: 'order.refund', entityType: 'order', entityId: id,
      before: { status: order.status, orderNo: order.order_no },
      after: { status: 'refunded', amount: order.grand_total, method: order.payment_method, reason, restocked: restock && stockIsOut },
    });
  } catch (e) {
    await conn.rollback();
    return { ok: false, message: e instanceof Error ? e.message : 'Could not refund' };
  } finally {
    conn.release();
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/account/orders/${order.order_no}`);
  return { ok: true, message: 'Refund recorded and stock returned' };
}

/** A note only the boutique sees — never shown to the customer. */
export async function saveInternalNoteAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const note = String(formData.get('internal_note') || '').trim().slice(0, 1000);
  if (!id) return { ok: false, message: 'Order not found' };
  await query('UPDATE orders SET internal_note = ? WHERE id = ?', [note || null, id]);
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Note saved' };
}

/* ── Reviews (Phase 11) ───────────────────────────────────────────────────
 * Moderation is a state machine on `reviews.status`, and every move is written
 * to audit_logs — "who hid this five-star review, and when" has to be
 * answerable. */

const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];

async function logModeration(reviewId: number, from: string, to: string) {
  await query(
    `INSERT INTO audit_logs (action, entity_type, entity_id, old_values, new_values)
     VALUES ('review.moderate', 'review', ?, ?, ?)`,
    [reviewId, JSON.stringify({ status: from }), JSON.stringify({ status: to })],
  );
}

export async function moderateReviewAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  if (!id || !REVIEW_STATUSES.includes(status)) return { ok: false, message: 'Invalid status' };

  const rows = await query<{ status: string; product_id: number }>(
    'SELECT status, product_id FROM reviews WHERE id = ?', [id],
  );
  if (!rows[0]) return { ok: false, message: 'Review not found' };
  if (rows[0].status === status) return { ok: false, message: 'Nothing to change' };

  await query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
  await logModeration(id, rows[0].status, status);

  revalidatePath('/admin/reviews');
  revalidateStorefront();
  return {
    ok: true,
    message: status === 'approved' ? 'Review published'
      : status === 'rejected' ? 'Review hidden from the storefront'
      : 'Review sent back to moderation',
  };
}

async function bulkModerate(ids: number[], status: string) {
  if (!ids.length || !REVIEW_STATUSES.includes(status)) return;
  const rows = await query<{ id: number; status: string }>(
    `SELECT id, status FROM reviews WHERE id IN (${ids.map(() => '?').join(',')})`, ids,
  );
  for (const row of rows) {
    if (row.status === status) continue;
    await query('UPDATE reviews SET status = ? WHERE id = ?', [status, row.id]);
    await logModeration(row.id, row.status, status);
  }
  revalidatePath('/admin/reviews');
  revalidateStorefront();
}

/* One action per verdict: the bulk bar submits ONE form, so a shared
 * `status` field would make "Approve" and "Hide" send the same thing. */
export async function bulkApproveReviewsAction(formData: FormData) {
  await bulkModerate(formData.getAll('ids').map(Number).filter(Boolean), 'approved');
}

export async function bulkHideReviewsAction(formData: FormData) {
  await bulkModerate(formData.getAll('ids').map(Number).filter(Boolean), 'rejected');
}

/** The boutique's public answer, shown under the review on the product page. */
export async function replyToReviewAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const reply = String(formData.get('reply') || '').trim().slice(0, 2000);
  if (!id) return { ok: false, message: 'Review not found' };

  await query(
    'UPDATE reviews SET reply = ?, replied_at = ? WHERE id = ?',
    [reply || null, reply ? new Date() : null, id],
  );
  revalidatePath('/admin/reviews');
  revalidateStorefront();
  return { ok: true, message: reply ? 'Reply published' : 'Reply removed' };
}

export async function deleteReviewAdminAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Review not found' };
  const media = await query<{ path: string }>('SELECT path FROM review_media WHERE review_id = ?', [id]);
  await query('DELETE FROM reviews WHERE id = ?', [id]); // media + votes cascade
  await Promise.all(media.map(m =>
    unlink(path.join(process.cwd(), 'public', m.path.replace(/^\/+/, ''))).catch(() => {})));
  await query(
    `INSERT INTO audit_logs (action, entity_type, entity_id) VALUES ('review.delete', 'review', ?)`,
    [id],
  );
  revalidatePath('/admin/reviews');
  revalidateStorefront();
  return { ok: true, message: 'Review deleted' };
}

/* ── The Journal ──────────────────────────────────────────────────────────
 * Articles are stored as PLAIN TEXT, not HTML — see the article page for why.
 * Reading time is computed here, once, rather than on every render of a list. */

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** slug is UNIQUE — append -2, -3… rather than failing the insert. */
async function uniqueArticleSlug(base: string, excludeId: number | null): Promise<string> {
  const root = base || 'article';
  let slug = root;
  let n = 1;
  for (;;) {
    const rows = await query<{ id: number }>(
      'SELECT id FROM blogs WHERE slug = ? AND id <> ?', [slug, excludeId ?? 0],
    );
    if (!rows[0]) return slug;
    slug = `${root}-${++n}`;
  }
}

export async function saveArticleAction(formData: FormData) {
  const id = Number(formData.get('id')) || null;
  const title = String(formData.get('title') || '').trim();
  // A browser submits a <textarea> with CRLF line endings (the HTML spec says so).
  // Stored raw, the article's blank lines are "\r\n\r\n" and a split on /\n{2,}/
  // never matches — every article renders as one unbroken wall of text.
  const body = String(formData.get('body') || '').replace(/\r\n/g, '\n').trim();
  const backTo = id ? `/admin/journal/${id}/edit` : '/admin/journal/new';

  if (!title) redirect(`${backTo}?error=title`);
  if (body.length < 20) redirect(`${backTo}?error=body`);

  const status = String(formData.get('status') || 'draft') === 'published' ? 'published' : 'draft';
  const excerpt = String(formData.get('excerpt') || '').trim().slice(0, 500)
    // No excerpt written? Take the opening of the article rather than showing a
    // blank card on the Journal index.
    || `${body.replace(/\s+/g, ' ').slice(0, 180)}…`;
  const tag = String(formData.get('tag') || '').trim().slice(0, 40) || null;
  const cover = String(formData.get('cover_image') || '').trim() || null;
  const slug = await uniqueArticleSlug(slugify(title), id);
  const minutes = readingMinutes(body);

  // published_at is set the FIRST time an article goes live and then left alone:
  // re-editing a published piece must not silently re-date it to today.
  if (id) {
    await query(
      `UPDATE blogs
          SET title = ?, slug = ?, excerpt = ?, body = ?, cover_image = ?, tag = ?,
              read_minutes = ?, status = ?,
              published_at = CASE
                WHEN ? = 'published' AND published_at IS NULL THEN NOW()
                WHEN ? = 'draft' THEN NULL
                ELSE published_at END
        WHERE id = ?`,
      [title, slug, excerpt, body, cover, tag, minutes, status, status, status, id],
    );
  } else {
    await query(
      `INSERT INTO blogs (title, slug, excerpt, body, cover_image, tag, read_minutes, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${status === 'published' ? 'NOW()' : 'NULL'})`,
      [title, slug, excerpt, body, cover, tag, minutes, status],
    );
  }

  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  revalidatePath(`/journal/${slug}`);
  revalidateHome(); // the home page's Latest News reads the same rows
  redirect(feedbackUrl('/admin/journal', id ? 'Article updated' : 'Article created'));
}

export async function deleteArticleAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to delete' };
  await query('DELETE FROM blogs WHERE id = ?', [id]); // comments cascade
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  revalidateHome();
  return { ok: true, message: 'Article deleted' };
}

export async function toggleArticleStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Article not found' };
  const rows = await query<{ status: string; published_at: string | null }>(
    'SELECT status, published_at FROM blogs WHERE id = ?', [id],
  );
  if (!rows[0]) return { ok: false, message: 'Article not found' };

  const next = rows[0].status === 'published' ? 'draft' : 'published';
  await query(
    `UPDATE blogs SET status = ?,
        published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN NOW()
                            WHEN ? = 'draft' THEN NULL ELSE published_at END
      WHERE id = ?`,
    [next, next, next, id],
  );
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  revalidateHome();
  return { ok: true, message: next === 'published' ? 'Article published' : 'Article unpublished' };
}

/** Hide or show a comment. Hidden rather than deleted, so a moderator can see
 *  what they acted on. */
export async function moderateCommentAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status')) === 'hidden' ? 'hidden' : 'visible';
  if (!id) return { ok: false, message: 'Comment not found' };
  await query('UPDATE blog_comments SET status = ? WHERE id = ?', [status, id]);
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  return { ok: true, message: status === 'hidden' ? 'Comment hidden' : 'Comment restored' };
}

export async function deleteCommentAdminAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Comment not found' };
  await query('DELETE FROM blog_comments WHERE id = ?', [id]);
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  return { ok: true, message: 'Comment deleted' };
}

/* ── Testimonials ─────────────────────────────────────────────────────────
 * "In Their Words / Cherished by Collectors" on the landing page. The table
 * shipped with the first schema and nothing ever wrote to it — the quotes were
 * a hardcoded array in a component, so the boutique could not put a real
 * client's words on its own home page.
 */

export async function saveTestimonialAction(formData: FormData) {
  const id = Number(formData.get('id')) || 0;
  const author = String(formData.get('author_name') || '').trim();
  const city = String(formData.get('author_title') || '').trim();
  // Browsers submit a textarea with CRLF; the card prints one paragraph, so the
  // line endings are normalised rather than carried into the quote.
  const quote = String(formData.get('quote') || '').replace(/\r\n/g, '\n').trim();
  const active = formData.get('is_active') ? 1 : 0;

  // A form action must return void, so a rejected save goes back to the form with
  // ?error= — the same way the article editor reports itself.
  const backTo = id ? `/admin/testimonials/${id}/edit` : '/admin/testimonials/new';
  if (!author) redirect(`${backTo}?error=name`);
  if (!quote) redirect(`${backTo}?error=quote`);
  if (quote.length > 600) redirect(`${backTo}?error=long`);

  if (id) {
    await query(
      `UPDATE testimonials SET author_name = ?, author_title = ?, quote = ?, is_active = ? WHERE id = ?`,
      [author, city || null, quote, active, id],
    );
  } else {
    // Appended, so adding a quote never reshuffles the ones already there.
    const last = await query<{ n: number | null }>('SELECT MAX(sort_order) n FROM testimonials');
    await query(
      `INSERT INTO testimonials (author_name, author_title, quote, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [author, city || null, quote, (last[0]?.n ?? 0) + 1, active],
    );
  }

  revalidatePath('/admin/testimonials');
  revalidateHome();
  redirect(feedbackUrl('/admin/testimonials', id ? 'Testimonial updated' : 'Testimonial added'));
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to remove' };
  await query('DELETE FROM testimonials WHERE id = ?', [id]);
  revalidatePath('/admin/testimonials');
  revalidateHome();
  return { ok: true, message: 'Testimonial removed' };
}

/** Hide a quote without losing it — the boutique may want it back. */
export async function toggleTestimonialAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to change' };
  const rows = await query<{ is_active: number }>('SELECT is_active FROM testimonials WHERE id = ?', [id]);
  if (!rows[0]) return { ok: false, message: 'Already removed' };

  const next = rows[0].is_active ? 0 : 1;
  await query('UPDATE testimonials SET is_active = ? WHERE id = ?', [next, id]);
  revalidatePath('/admin/testimonials');
  revalidateHome();
  return { ok: true, message: next ? 'Testimonial is now on the home page' : 'Testimonial hidden' };
}

/** Swap a quote with its neighbour — the carousel plays in this order. */
export async function moveTestimonialAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const dir = String(formData.get('dir')) === 'up' ? 'up' : 'down';
  if (!id) return { ok: false, message: 'Nothing to move' };

  const rows = await query<{ sort_order: number }>('SELECT sort_order FROM testimonials WHERE id = ?', [id]);
  const current = rows[0];
  if (!current) return { ok: false, message: 'Already removed' };

  // Ties on sort_order are broken by id, exactly as the list is ordered.
  const neighbours = await query<{ id: number; sort_order: number }>(
    dir === 'up'
      ? `SELECT id, sort_order FROM testimonials
          WHERE sort_order < ? OR (sort_order = ? AND id < ?)
          ORDER BY sort_order DESC, id DESC LIMIT 1`
      : `SELECT id, sort_order FROM testimonials
          WHERE sort_order > ? OR (sort_order = ? AND id > ?)
          ORDER BY sort_order ASC, id ASC LIMIT 1`,
    [current.sort_order, current.sort_order, id],
  );
  const neighbour = neighbours[0];
  if (!neighbour) return { ok: false, message: dir === 'up' ? 'Already first' : 'Already last' };

  // Two rows, two statements: a multi-table UPDATE ... JOIN touches each target
  // row only once in MySQL, which silently half-applies a swap.
  await query('UPDATE testimonials SET sort_order = ? WHERE id = ?', [neighbour.sort_order, id]);
  await query('UPDATE testimonials SET sort_order = ? WHERE id = ?', [current.sort_order, neighbour.id]);

  revalidatePath('/admin/testimonials');
  revalidateHome();
  return { ok: true, message: 'Order updated' };
}
