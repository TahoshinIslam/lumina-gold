import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Printer } from 'lucide-react';
import { query } from '@/server/db/client';
import { ORDER_STATUS, PAYMENT_LABEL, type OrderStatus } from '@/types/order';
import {
  updateOrderStatusAction, saveShipmentAction, refundOrderAction, saveInternalNoteAction,
  toggleTestOrderAction,
} from '../../actions';
import { AdminInlineForm, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import type { OrderItemRow, OrderRow } from '@/server/dal/orders';
import LiveData from '@/features/shared/LiveData';

export const dynamic = 'force-dynamic';

const bdt = (v: unknown) => `৳ ${Number(v ?? 0).toLocaleString('en-IN')}`;
const STAMP = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

interface Event { to_status: OrderStatus; from_status: string | null; note: string | null; created_at: string }
interface Shipment { courier: string; tracking_no: string | null; status: string }

/**
 * Admin order detail (Phase 10) — everything a boutique does to one order:
 * move it through the workshop, hand it to a courier, refund it, keep a private
 * note, and read the log of what has already happened to it.
 */
export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!orderId) notFound();

  const [orders, items, history, shipments, activity] = await Promise.all([
    query<OrderRow & { internal_note: string | null; user_id: number | null }>(
      'SELECT * FROM orders WHERE id = ?', [orderId],
    ),
    query<OrderItemRow>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [orderId]),
    query<Event>(
      'SELECT to_status, from_status, note, created_at FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC, id DESC',
      [orderId],
    ),
    query<Shipment>('SELECT courier, tracking_no, status FROM shipments WHERE order_id = ?', [orderId]),
    query<{ method: string; type: string; status: string; amount: string; created_at: string }>(
      'SELECT method, type, status, amount, created_at FROM payment_transactions WHERE order_id = ? ORDER BY id DESC',
      [orderId],
    ),
  ]);

  const order = orders[0];
  if (!order) notFound();
  const shipment = shipments[0];
  const status = ORDER_STATUS[order.status];

  return (
    <>
      <LiveData />
      <div className="adm-detail-head">
        <div>
          <Link href="/admin/orders" className="adm-back">← Orders</Link>
          <h1 className="adm-h1">{order.order_no}</h1>
          <p className="adm-sub">
            Placed {STAMP.format(new Date(order.placed_at))} · {status.label}
          </p>
        </div>
        <div className="adm-detail-tools">
          {/* The ADMIN's invoice route — the customer's is scoped to a customer
              session and would bounce staff to /account/login. */}
          <a className="adm-btn ghost" target="_blank" rel="noreferrer"
            href={`/admin/orders/${order.id}/invoice`}>
            <Printer size={14} /> Invoice
          </a>
          {/* Two deliberate choices, because a refunded piece is not
              automatically resellable — it may be damaged or in for repair.
              The default refund leaves it OFF the shelf; restocking is a
              separate, explicit tick. */}
          {/* A test order is not revenue. Flagging it removes it from every
              figure on the dashboard and from the purchase funnel. */}
          <ConfirmActionButton
            action={toggleTestOrderAction}
            values={{ id: order.id }}
            title={order.is_test ? `Restore ${order.order_no} as a real order?` : `Mark ${order.order_no} as a test order?`}
            description={order.is_test
              ? 'It will count towards revenue and the sales funnel again.'
              : 'It will be excluded from revenue and from the sales funnel. Use this for orders placed to check that checkout works.'}
            confirmLabel={order.is_test ? 'Restore as real' : 'Mark as test'}
            className="adm-btn"
            successMessage={order.is_test ? 'Restored as a real order' : 'Marked as a test order'}
          >
            {order.is_test ? 'Restore as real' : 'Mark as test'}
          </ConfirmActionButton>
          <ConfirmActionButton
            action={refundOrderAction}
            values={{ id: order.id, restock: '0' }}
            title={`Refund ${order.order_no}?`}
            description="Records the refund. The piece is NOT returned to stock — use ‘Refund & restock’ only if it has come back and is resellable. No money moves automatically; the boutique sends it."
            confirmLabel="Refund order"
            className="adm-btn danger"
            successMessage="Refund recorded"
          >
            Refund
          </ConfirmActionButton>
          <ConfirmActionButton
            action={refundOrderAction}
            values={{ id: order.id, restock: '1' }}
            title={`Refund ${order.order_no} and return to stock?`}
            description="Records the refund AND puts the piece back on the shelf as resellable. Choose this only when the item has physically returned in sellable condition."
            confirmLabel="Refund & restock"
            className="adm-btn"
            successMessage="Refund recorded, stock returned"
          >
            Refund &amp; restock
          </ConfirmActionButton>
        </div>
      </div>

      <div className="adm-order-grid">
        <div className="adm-order-main">
          {/* Pieces, with the spec as sold. */}
          <div className="adm-card">
            <h2 className="adm-h2">Pieces</h2>
            <table className="adm-table">
              <thead>
                <tr><th>Piece</th><th>Specification</th><th>Qty</th><th>Line</th></tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.product_name}</strong>
                      <div className="adm-sub">{item.variant_sku}</div>
                    </td>
                    <td>
                      {[
                        [item.purity, item.metal_color ?? item.metal].filter(Boolean).join(' ') || null,
                        item.size_label ? `Size ${item.size_label}` : null,
                        Number(item.metal_weight_g ?? 0) > 0 ? `${item.metal_weight_g} g` : null,
                        Number(item.diamond_carat ?? 0) > 0 ? `${item.diamond_carat} ct` : null,
                        item.certificate_no ? `${item.certificate_issuer ?? ''} ${item.certificate_no}`.trim() : null,
                        item.engraving ? `“${item.engraving}”` : null,
                      ].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{bdt(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delivery partner. */}
          <div className="adm-card">
            <h2 className="adm-h2">Delivery</h2>
            <AdminInlineForm action={saveShipmentAction} successMessage="Delivery partner saved"
              className="adm-inline-form">
              <input type="hidden" name="id" value={order.id} />
              <div className="adm-field" style={{ width: 200 }}>
                <label>Delivery partner</label>
                <input name="courier" defaultValue={shipment?.courier ?? ''} placeholder="Pathao, Sundarban…" required />
              </div>
              <div className="adm-field" style={{ width: 220 }}>
                <label>Tracking number</label>
                <input name="tracking_no" defaultValue={shipment?.tracking_no ?? ''} placeholder="TRK-000000" />
              </div>
              <button className="adm-btn" type="submit">Save</button>
            </AdminInlineForm>
            {shipment && <p className="adm-sub">Shipment is <strong>{shipment.status}</strong>.</p>}
          </div>

          {/* Private note. */}
          <div className="adm-card">
            <h2 className="adm-h2">Internal note</h2>
            <p className="adm-sub" style={{ marginBottom: 12 }}>Only the boutique sees this — never the customer.</p>
            <AdminInlineForm action={saveInternalNoteAction} successMessage="Note saved">
              <input type="hidden" name="id" value={order.id} />
              <div className="adm-field">
                <textarea name="internal_note" rows={3} defaultValue={order.internal_note ?? ''} />
              </div>
              <button className="adm-btn" type="submit" style={{ marginTop: 10 }}>Save note</button>
            </AdminInlineForm>
          </div>

          {/* Activity log. */}
          <div className="adm-card">
            <h2 className="adm-h2">Activity</h2>
            <table className="adm-table">
              <thead><tr><th>When</th><th>Change</th><th>Note</th></tr></thead>
              <tbody>
                {history.map((event, index) => (
                  <tr key={index}>
                    <td>{STAMP.format(new Date(event.created_at))}</td>
                    <td>
                      {event.from_status ? `${ORDER_STATUS[event.from_status as OrderStatus]?.label ?? event.from_status} → ` : ''}
                      <strong>{ORDER_STATUS[event.to_status]?.label ?? event.to_status}</strong>
                    </td>
                    <td>{event.note ?? '—'}</td>
                  </tr>
                ))}
                {activity.map((row, index) => (
                  <tr key={`pay-${index}`}>
                    <td>{STAMP.format(new Date(row.created_at))}</td>
                    <td><strong>{row.type === 'refund' ? 'Refund' : 'Payment'}</strong> · {row.status}</td>
                    <td>{PAYMENT_LABEL[row.method] ?? row.method} · {bdt(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="adm-order-side">
          <div className="adm-card">
            <h2 className="adm-h2">Status</h2>
            <AdminInlineForm action={updateOrderStatusAction} successMessage="Order status updated">
              <input type="hidden" name="id" value={order.id} />
              <div className="adm-field">
                <select name="status" defaultValue={order.status}>
                  {Object.entries(ORDER_STATUS).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </div>
              <button className="adm-btn" type="submit" style={{ marginTop: 10 }}>Update status</button>
            </AdminInlineForm>
          </div>

          <div className="adm-card">
            <h2 className="adm-h2">Customer</h2>
            <p><strong>{order.shipping_name}</strong></p>
            <p className="adm-sub">{order.shipping_phone}</p>
            <p className="adm-sub">{order.shipping_address}</p>
            <p className="adm-sub">
              {[order.shipping_postcode, order.shipping_country].filter(Boolean).join(' · ')}
            </p>
            {order.gift_message && <p className="adm-sub">Gift: “{order.gift_message}”</p>}
            {order.customer_note && <p className="adm-sub">Note: {order.customer_note}</p>}
            {order.user_id && (
              <Link className="adm-btn ghost sm" href={`/admin/customers?q=${order.shipping_phone}`}>
                <ExternalLink size={13} /> Customer
              </Link>
            )}
          </div>

          <div className="adm-card">
            <h2 className="adm-h2">Money</h2>
            <table className="adm-table">
              <tbody>
                <tr><td>Subtotal</td><td>{bdt(order.subtotal)}</td></tr>
                {Number(order.discount_total) > 0 && (
                  <tr><td>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</td>
                    <td>− {bdt(order.discount_total)}</td></tr>
                )}
                <tr><td>VAT ({Number(order.tax_rate)}%)</td><td>{bdt(order.tax_total)}</td></tr>
                <tr><td>Shipping</td><td>{bdt(order.shipping_total)}</td></tr>
                <tr><td><strong>Total</strong></td><td><strong>{bdt(order.grand_total)}</strong></td></tr>
                <tr><td>Payment</td>
                  <td>{PAYMENT_LABEL[order.payment_method] ?? order.payment_method} · {order.payment_status}</td></tr>
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </>
  );
}
