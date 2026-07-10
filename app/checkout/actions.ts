'use server';

import { db, query } from '../../lib/db';
import { HOLD_MINUTES } from '../../lib/bookings';

export interface CheckoutItem { sku: string; qty: number; size?: string; engraving?: string }
export interface CheckoutCustomer {
  name: string; phone: string; email?: string; address: string; note?: string;
}

/**
 * createBooking — reserves the bag as a time-limited HOLD (not a sale).
 * Writes an order with status 'reserved' + reserved_until = now + HOLD_MINUTES,
 * records an inventory reservation, and decrements available stock for the
 * duration of the hold. A concierge confirms by phone; otherwise the hold
 * expires (see expireStaleBookings) and stock returns automatically.
 * Prices are re-read from the DB — never trusted from the client.
 */
export async function createBooking(
  items: CheckoutItem[],
  customer: CheckoutCustomer,
): Promise<{ ok: boolean; orderNo?: string; holdMinutes?: number; reservedUntil?: string; error?: string }> {
  if (!items?.length) return { ok: false, error: 'Your bag is empty.' };
  if (!customer.name?.trim() || !customer.phone?.trim()) {
    return { ok: false, error: 'Name and phone are required so we can confirm your booking.' };
  }

  const skus = [...new Set(items.map(i => i.sku))];
  const placeholders = skus.map(() => '?').join(',');
  const rows = await query<{ sku: string; variant_id: number; name: string; variant_sku: string; price: number }>(
    `SELECT p.sku, v.id variant_id, p.name, v.variant_sku, pc.fixed_price price
     FROM products p
     JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
     JOIN variant_price_components pc ON pc.variant_id = v.id
     WHERE p.sku IN (${placeholders})`,
    skus,
  );
  const bySku = new Map(rows.map(r => [r.sku, r]));

  const lines = items.map(i => {
    const r = bySku.get(i.sku);
    if (!r) throw new Error(`Product ${i.sku} is no longer available`);
    const qty = Math.max(1, Math.min(20, Math.floor(i.qty)));
    return { ...r, qty, size: i.size, engraving: i.engraving, lineTotal: r.price * qty };
  });

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + tax; // no shipping — items are held for boutique confirmation
  const orderNo = `LUM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [ores] = await conn.query(
      `INSERT INTO orders
        (order_no, status, reserved_until, currency, subtotal, discount_total, tax_total, shipping_total, grand_total,
         shipping_name, shipping_phone, shipping_address, customer_note, placed_at)
       VALUES (?, 'reserved', DATE_ADD(NOW(), INTERVAL ? MINUTE), 'BDT', ?, 0, ?, 0, ?, ?, ?, ?, ?, NOW())`,
      [orderNo, HOLD_MINUTES, subtotal, tax, grand, customer.name.trim(),
       customer.phone.trim(), customer.address?.trim() || null, customer.note?.trim() || null],
    );
    const orderId = (ores as { insertId: number }).insertId;

    for (const l of lines) {
      await conn.query(
        `INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, quantity, unit_price, line_total, engraving)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, l.variant_id, l.name, l.variant_sku, l.qty, l.price, l.lineTotal, l.engraving || null],
      );
      await conn.query(
        `INSERT INTO inventory_reservations (variant_id, warehouse_id, quantity, order_id, status, expires_at)
         VALUES (?, 1, ?, ?, 'active', DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
        [l.variant_id, l.qty, orderId, HOLD_MINUTES],
      );
      await conn.query(
        `UPDATE inventory SET quantity_available = GREATEST(0, quantity_available - ?)
         WHERE variant_id = ? AND warehouse_id = 1`,
        [l.qty, l.variant_id],
      );
    }

    await conn.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, NULL, 'reserved', 'booked via storefront — awaiting phone confirmation')`,
      [orderId],
    );
    await conn.commit();

    const reservedUntil = new Date(Date.now() + HOLD_MINUTES * 60000).toISOString();
    return { ok: true, orderNo, holdMinutes: HOLD_MINUTES, reservedUntil };
  } catch (e) {
    await conn.rollback();
    return { ok: false, error: e instanceof Error ? e.message : 'Could not reserve' };
  } finally {
    conn.release();
  }
}
