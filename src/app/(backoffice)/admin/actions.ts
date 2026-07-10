'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { query, db } from '@/server/db/client';
import { ADMIN_COOKIE, adminToken, checkPassword } from '@/server/auth/admin';

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

const pivotUpsert = async (table: string, col: string, productId: number, value: FormDataEntryValue | null) => {
  await query(`DELETE FROM ${table} WHERE product_id = ?`, [productId]);
  const id = Number(value);
  if (id) await query(`INSERT INTO ${table} (product_id, ${col}) VALUES (?, ?)`, [productId, id]);
};

export async function saveProductAction(formData: FormData) {
  const id = Number(formData.get('id')) || null;
  const name = String(formData.get('name') || '').trim();
  const sku = String(formData.get('sku') || '').trim();
  if (!name || !sku) redirect(`/admin/products?error=missing-fields`);

  const slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fields = {
    sku, slug, name,
    short_description: String(formData.get('description') || '').slice(0, 500),
    description: String(formData.get('description') || ''),
    status: String(formData.get('status') || 'active'),
    is_featured: formData.get('featured') ? 1 : 0,
    is_new_arrival: formData.get('new_arrival') ? 1 : 0,
  };

  let productId = id;
  if (id) {
    await query(
      `UPDATE products SET sku=?, slug=?, name=?, short_description=?, description=?, status=?, is_featured=?, is_new_arrival=? WHERE id=?`,
      [...Object.values(fields), id],
    );
  } else {
    const [res] = await db.query(
      `INSERT INTO products (sku, slug, name, short_description, description, status, is_featured, is_new_arrival)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(fields),
    );
    productId = (res as { insertId: number }).insertId;
  }

  await pivotUpsert('product_categories', 'category_id', productId!, formData.get('category_id'));
  await pivotUpsert('product_collections', 'collection_id', productId!, formData.get('collection_id'));
  await pivotUpsert('product_genders', 'gender_id', productId!, formData.get('gender_id'));
  await pivotUpsert('product_styles', 'style_id', productId!, formData.get('style_id'));

  // Default variant (single-variant admin for now)
  const price = Number(formData.get('price')) || 0;
  const stock = Number(formData.get('stock')) || 0;
  const weight = Number(formData.get('weight')) || null;
  const metalId = Number(formData.get('metal_id')) || null;
  const purityId = Number(formData.get('purity_id')) || null;
  const colorId = Number(formData.get('metal_color_id')) || null;

  const variants = await query<{ id: number }>(
    'SELECT id FROM product_variants WHERE product_id = ? AND is_default = 1', [productId],
  );
  let variantId = variants[0]?.id;
  if (variantId) {
    await query(
      `UPDATE product_variants SET metal_id=?, purity_id=?, metal_color_id=?, metal_weight_g=? WHERE id=?`,
      [metalId, purityId, colorId, weight, variantId],
    );
  } else {
    const [vres] = await db.query(
      `INSERT INTO product_variants (product_id, variant_sku, metal_id, purity_id, metal_color_id, metal_weight_g, is_default)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [productId, `${sku}-01`, metalId, purityId, colorId, weight],
    );
    variantId = (vres as { insertId: number }).insertId;
  }

  await query(
    `INSERT INTO variant_price_components (variant_id, pricing_mode, fixed_price)
     VALUES (?, 'fixed', ?) ON DUPLICATE KEY UPDATE fixed_price = VALUES(fixed_price)`,
    [variantId, price],
  );
  await query(
    `INSERT INTO price_history (variant_id, price, effective_at, reason) VALUES (?, ?, NOW(), 'admin edit')`,
    [variantId, price],
  );
  await query(
    `INSERT INTO inventory (variant_id, warehouse_id, quantity_available)
     VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE quantity_available = VALUES(quantity_available)`,
    [variantId, stock],
  );

  const image = String(formData.get('image') || '').trim();
  if (image) {
    const existing = await query<{ id: number }>(
      'SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1', [productId],
    );
    if (existing[0]) {
      await query('UPDATE product_images SET image_path = ? WHERE id = ?', [image, existing[0].id]);
    } else {
      await query(
        'INSERT INTO product_images (product_id, image_path, sort_order, is_primary) VALUES (?, ?, 0, 1)',
        [productId, image],
      );
    }
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProductAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) await query('DELETE FROM products WHERE id = ?', [id]); // FK cascades
  revalidatePath('/admin/products');
}

/* ── Categories ───────────────────────────────────────────────────────── */

export async function addCategoryAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (name) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await query('INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
  }
  revalidatePath('/admin/categories');
}

export async function deleteCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  const used = await query<{ c: number }>(
    'SELECT COUNT(*) c FROM product_categories WHERE category_id = ?', [id],
  );
  if (used[0].c > 0) redirect('/admin/categories?error=in-use');
  await query('DELETE FROM categories WHERE id = ?', [id]);
  revalidatePath('/admin/categories');
}

/* ── Metal rates ──────────────────────────────────────────────────────── */

export async function addRateAction(formData: FormData) {
  const purityId = Number(formData.get('purity_id'));
  const rate = Number(formData.get('rate'));
  if (purityId && rate > 0) {
    await query(
      'INSERT INTO metal_rates (purity_id, rate_per_gram, effective_from) VALUES (?, ?, NOW())',
      [purityId, rate],
    );
  }
  revalidatePath('/admin/rates');
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
  if (!code || value <= 0) redirect('/admin/offers?error=1');

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
  redirect('/admin/offers');
}

export async function toggleCouponAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) await query('UPDATE coupons SET is_active = 1 - is_active WHERE id = ?', [id]);
  revalidatePath('/admin/offers');
}

export async function deleteCouponAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) await query('DELETE FROM coupons WHERE id = ?', [id]);
  revalidatePath('/admin/offers');
}

/* ── Orders ───────────────────────────────────────────────────────────── */

const ORDER_STATUSES = ['reserved','pending','confirmed','processing','ready_to_ship','shipped','delivered','cancelled','returned','refunded','expired'];

/** Confirm a phone booking: lock in the sale, close the hold, clear timer. */
export async function confirmBookingAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  await query(`UPDATE inventory_reservations SET status = 'fulfilled' WHERE order_id = ? AND status = 'active'`, [id]);
  await query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES (?, 'reserved', 'confirmed', 'confirmed by phone from admin')`,
    [id],
  );
  await query(`UPDATE orders SET status = 'confirmed', reserved_until = NULL WHERE id = ? AND status = 'reserved'`, [id]);
  revalidatePath('/admin/orders');
}

/** Manually release a hold before it expires (stock returns). */
export async function releaseBookingAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) return;
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
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  if (!id || !ORDER_STATUSES.includes(status)) return;
  const rows = await query<{ status: string }>('SELECT status FROM orders WHERE id = ?', [id]);
  if (!rows[0] || rows[0].status === status) return;
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES (?, ?, ?, ?)',
    [id, rows[0].status, status, 'changed from admin panel'],
  );
  revalidatePath('/admin/orders');
}
