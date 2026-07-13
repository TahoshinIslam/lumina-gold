'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { rm, unlink } from 'fs/promises';
import path from 'path';
import { query, db } from '@/server/db/client';
import { ADMIN_COOKIE, adminToken, checkPassword } from '@/server/auth/admin';
import { VARIANT_AXIS_CODES } from '@/config/sizes';

const UPLOAD_SIZES = ['original', 'zoom', 'large', 'medium', 'thumb'];
const productUploadDir = (sku: string) => path.join(process.cwd(), 'public', 'uploads', 'products', sku);

/** Revalidate every storefront surface a product mutation can affect. */
function revalidateStorefront() {
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/shop');
}

function feedbackUrl(url: string, message: string, tone: 'success' | 'warning' | 'error' | 'info' = 'success') {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}toast=${encodeURIComponent(message)}&tone=${tone}`;
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '');
  if (!checkPassword(password)) {
    redirect('/admin/login?error=1');
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12,
  });
  redirect('/admin');
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect('/admin/login');
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

  interface VariantInput {
    id?: number; purityId: number | null; sizeValueId: number | null; sku: string;
    price: string; comparePrice: string; costPrice: string; stock: string; weight: string;
    barcode: string; status: 'active' | 'inactive';
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
      `INSERT INTO variant_price_components (variant_id, pricing_mode, fixed_price, compare_price, cost_price, discount_amount)
       VALUES (?, 'fixed', ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE fixed_price=VALUES(fixed_price), compare_price=VALUES(compare_price),
         cost_price=VALUES(cost_price), discount_amount=VALUES(discount_amount)`,
      [variantId, price, comparePrice, costPrice, discountAmount],
    );
    await query(
      `INSERT INTO price_history (variant_id, price, sale_price, effective_at, reason) VALUES (?, ?, ?, NOW(), 'admin edit')`,
      [variantId, price, discountAmount > 0 ? price - discountAmount : null],
    );

    const stock = v.stock !== '' && v.stock != null ? Number(v.stock) : 0;
    // Availability status is also product-level for now — default variant only.
    const availability = isDefault ? String(formData.get('availability') || 'in_stock') : 'in_stock';
    await query(
      `INSERT INTO inventory (variant_id, warehouse_id, quantity_available, availability)
       VALUES (?, 1, ?, ?) ON DUPLICATE KEY UPDATE quantity_available=VALUES(quantity_available), availability=VALUES(availability)`,
      [variantId, stock, availability],
    );

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

export async function deleteProductAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) {
    const rows = await query<{ sku: string }>('SELECT sku FROM products WHERE id = ?', [id]);
    await query('DELETE FROM products WHERE id = ?', [id]); // FK cascades (variants, images, pricing, inventory rows)
    if (rows[0]) await rm(productUploadDir(rows[0].sku), { recursive: true, force: true }).catch(() => {});
  }
  revalidateStorefront();
}

export async function bulkDeleteProductsAction(formData: FormData) {
  const ids = formData.getAll('ids').map(Number).filter(Boolean);
  if (ids.length) {
    const rows = await query<{ sku: string }>(`SELECT sku FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    await query(`DELETE FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids); // FK cascades
    await Promise.all(rows.map(r => rm(productUploadDir(r.sku), { recursive: true, force: true }).catch(() => {})));
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
  await query('INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/categories');
  redirect(feedbackUrl('/admin/categories', 'Category created successfully'));
}

export async function updateCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = String(formData.get('name') || '').trim();
  if (!id || !name) redirect(`/admin/categories/${id}/edit?error=missing`);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  await query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
  revalidateTag('admin-product-lookups', { expire: 0 });
  revalidatePath('/admin/categories');
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
  revalidatePath('/admin/rates');
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

const ORDER_STATUSES = ['reserved','pending','confirmed','processing','ready_to_ship','shipped','delivered','cancelled','returned','refunded','expired'];

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
  await query(`UPDATE inventory_reservations SET status = 'released' WHERE order_id = ? AND status = 'active'`, [id]);
  await query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES (?, 'reserved', 'cancelled', 'hold released from admin')`, [id],
  );
  await query(`UPDATE orders SET status = 'cancelled', reserved_until = NULL WHERE id = ?`, [id]);
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Booking released' };
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  if (!id || !ORDER_STATUSES.includes(status)) return { ok: false, message: 'Invalid status' };
  const rows = await query<{ status: string }>('SELECT status FROM orders WHERE id = ?', [id]);
  if (!rows[0] || rows[0].status === status) return { ok: false, message: 'Status unchanged' };
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES (?, ?, ?, ?)',
    [id, rows[0].status, status, 'changed from admin panel'],
  );
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Order status updated' };
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
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, row.id]);
    await query(
      'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES (?, ?, ?, ?)',
      [row.id, row.status, status, 'bulk update from admin panel'],
    );
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

  revalidatePath('/admin/campaigns');
  redirect('/admin/campaigns');
}

export async function deleteCampaignAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('DELETE FROM campaigns WHERE id = ?', [id]);
  revalidatePath('/admin/campaigns');
  return { ok: true };
}

export async function bulkDeleteCampaignsAction(formData: FormData) {
  const ids = formData.getAll('ids').map(Number).filter(Boolean);
  if (ids.length) await query(`DELETE FROM campaigns WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
  revalidatePath('/admin/campaigns');
}

export async function toggleCampaignPublishedAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return { ok: false };
  await query('UPDATE campaigns SET is_published = 1 - is_published WHERE id = ?', [id]);
  revalidatePath('/admin/campaigns');
  return { ok: true };
}
