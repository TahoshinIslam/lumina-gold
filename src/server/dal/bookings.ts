import { query } from '@/server/db/client';
import type { Booking, BookingLine } from '@/types/booking';

/**
 * Booking model — a jewellery boutique doesn't sell online. A customer
 * RESERVES a piece; it's held for HOLD_MINUTES while a concierge calls to
 * confirm. If not confirmed in time, the hold expires and stock is released.
 */
export const HOLD_MINUTES = 15;

/**
 * Every booking belonging to a customer — the order-tracking table on their
 * account page. Orders are matched by user_id, which checkout now stamps even
 * for a guest (it creates the account from the details they typed).
 */
export async function getCustomerBookings(userId: number): Promise<Booking[]> {
  const orders = await query<Omit<Booking, 'items'>>(
    `SELECT id, order_no, status, reserved_until, grand_total, placed_at
       FROM orders WHERE user_id = ? ORDER BY placed_at DESC, id DESC LIMIT 50`,
    [userId],
  );
  if (!orders.length) return [];

  const ids = orders.map(o => o.id);
  const lines = await query<BookingLine & { order_id: number }>(
    `SELECT order_id, product_name, variant_sku, quantity, line_total
       FROM order_items WHERE order_id IN (${ids.map(() => '?').join(',')}) ORDER BY id`,
    ids,
  );
  return orders.map(order => ({
    ...order,
    grand_total: Number(order.grand_total),
    items: lines
      .filter(l => l.order_id === order.id)
      .map(({ product_name, variant_sku, quantity, line_total }) =>
        ({ product_name, variant_sku, quantity, line_total: Number(line_total) })),
  }));
}

/**
 * Lazily expire stale reservations. There's no background worker, so we
 * sweep on admin reads: any 'reserved' order past its window is marked
 * 'expired', its held stock is returned, and its reservation row closed.
 */
export async function expireStaleBookings(): Promise<number> {
  const stale = await query<{ id: number }>(
    `SELECT id FROM orders WHERE status = 'reserved' AND reserved_until IS NOT NULL AND reserved_until < NOW()`,
  );
  for (const { id } of stale) {
    // Return the held units to inventory.
    await query(
      `UPDATE inventory i
       JOIN order_items oi ON oi.variant_id = i.variant_id AND i.warehouse_id = 1
       SET i.quantity_available = i.quantity_available + oi.quantity
       WHERE oi.order_id = ?`,
      [id],
    );
    // Log the return as a movement per line — the sweep used to move stock with
    // nothing in the ledger. And release any serial-tracked pieces held.
    await query(
      `INSERT INTO inventory_movements (variant_id, warehouse_id, movement_type, quantity, reference_type, reference_id, note)
       SELECT oi.variant_id, 1, 'release', oi.quantity, 'order', oi.order_id, 'hold expired'
         FROM order_items oi WHERE oi.order_id = ? AND oi.variant_id IS NOT NULL`,
      [id],
    );
    await query(
      `UPDATE product_serials SET status = 'in_stock', order_id = NULL WHERE order_id = ? AND status = 'reserved'`,
      [id],
    );
    await query(`UPDATE inventory_reservations SET status = 'expired' WHERE order_id = ? AND status = 'active'`, [id]);
    await query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, 'reserved', 'expired', 'hold expired — not confirmed in time')`,
      [id],
    );
    await query(`UPDATE orders SET status = 'expired', reserved_until = NULL WHERE id = ?`, [id]);
  }
  return stale.length;
}
