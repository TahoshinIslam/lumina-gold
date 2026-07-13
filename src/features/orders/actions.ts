'use server';

import { revalidatePath } from 'next/cache';
import { db, query } from '@/server/db/client';
import { getCurrentCustomer } from '@/server/auth/customer';
import { canCancel, canReturn, type OrderStatus } from '@/types/order';

export type OrderActionResult = { ok: boolean; message: string };

/**
 * Cancel an order — the customer's side of it.
 *
 * Only before the workshop has touched the gold (see CANCELLABLE_STATUSES): once
 * a piece is being cast or set for a specific finger, it cannot go back on a
 * shelf. Stock is returned in the same transaction that flips the status, so a
 * cancellation can never lose a piece of inventory.
 */
export async function cancelOrderAction(formData: FormData): Promise<OrderActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const orderNo = String(formData.get('order_no') || '');
  const reason = String(formData.get('reason') || '').trim().slice(0, 255) || 'cancelled by customer';

  const rows = await query<{ id: number; status: OrderStatus }>(
    'SELECT id, status FROM orders WHERE order_no = ? AND user_id = ?', [orderNo, customer.id],
  );
  const order = rows[0];
  if (!order) return { ok: false, message: 'Order not found.' };
  if (!canCancel(order.status)) {
    return { ok: false, message: 'This order is already in the workshop and can no longer be cancelled.' };
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Put every piece back on the shelf. One statement per line — a multi-table
    // UPDATE...JOIN only touches each inventory row once, so two lines of the
    // same variant would silently restore only one.
    const items = await query<{ variant_id: number; quantity: number }>(
      'SELECT variant_id, quantity FROM order_items WHERE order_id = ?', [order.id],
    );
    for (const item of items) {
      if (!item.variant_id) continue;
      await conn.query(
        `UPDATE inventory SET quantity_available = quantity_available + ?
          WHERE variant_id = ? AND warehouse_id = 1`,
        [item.quantity, item.variant_id],
      );
      await conn.query(
        `INSERT INTO inventory_movements
           (variant_id, warehouse_id, movement_type, quantity, reference_type, reference_id, note)
         VALUES (?, 1, 'return', ?, 'order', ?, 'order cancelled')`,
        [item.variant_id, item.quantity, order.id],
      );
    }

    await conn.query(
      `UPDATE orders SET status = 'cancelled', reserved_until = NULL WHERE id = ?`, [order.id],
    );
    await conn.query(
      `UPDATE payment_transactions SET status = 'cancelled'
        WHERE order_id = ? AND type = 'payment' AND status = 'pending'`,
      [order.id],
    );
    await conn.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, ?, 'cancelled', ?)`,
      [order.id, order.status, reason],
    );

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    return { ok: false, message: e instanceof Error ? e.message : 'Could not cancel this order.' };
  } finally {
    conn.release();
  }

  revalidatePath(`/account/orders/${orderNo}`);
  revalidatePath('/account/orders');
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Your order has been cancelled.' };
}

/**
 * Ask to return a delivered piece. This only OPENS a request — the boutique
 * inspects the piece before any money moves, so nothing is refunded here.
 */
export async function requestReturnAction(formData: FormData): Promise<OrderActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const orderNo = String(formData.get('order_no') || '');
  const reason = String(formData.get('reason') || '').trim();
  if (reason.length < 4) return { ok: false, message: 'Tell us briefly what’s wrong.' };

  const rows = await query<{ id: number; status: OrderStatus }>(
    'SELECT id, status FROM orders WHERE order_no = ? AND user_id = ?', [orderNo, customer.id],
  );
  const order = rows[0];
  if (!order) return { ok: false, message: 'Order not found.' };
  if (!canReturn(order.status)) {
    return { ok: false, message: 'Only delivered orders can be returned.' };
  }

  const open = await query<{ id: number }>(
    `SELECT id FROM returns WHERE order_id = ? AND status IN ('requested','approved','received')`,
    [order.id],
  );
  if (open[0]) return { ok: false, message: 'A return is already open on this order.' };

  await query(
    `INSERT INTO returns (order_id, reason, status, quantity, note)
     VALUES (?, ?, 'requested', 1, NULL)`,
    [order.id, reason.slice(0, 255)],
  );
  await query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES (?, ?, 'delivered', ?)`,
    [order.id, order.status, `return requested: ${reason.slice(0, 200)}`],
  );

  revalidatePath(`/account/orders/${orderNo}`);
  revalidatePath('/admin/orders');
  return { ok: true, message: 'Return requested — a concierge will call you to arrange collection.' };
}
