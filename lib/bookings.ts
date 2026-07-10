import { query } from './db';

/**
 * Booking model — a jewellery boutique doesn't sell online. A customer
 * RESERVES a piece; it's held for HOLD_MINUTES while a concierge calls to
 * confirm. If not confirmed in time, the hold expires and stock is released.
 */
export const HOLD_MINUTES = 15;

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
