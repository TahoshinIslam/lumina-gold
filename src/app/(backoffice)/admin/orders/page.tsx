import { query } from '@/server/db/client';
import { updateOrderStatusAction, confirmBookingAction, releaseBookingAction } from '../actions';
import { expireStaleBookings } from '@/server/dal/bookings';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Number(n).toLocaleString('en-IN')}`;
const STATUSES = ['reserved','pending','confirmed','processing','ready_to_ship','shipped','delivered','cancelled','returned','refunded','expired'];
const badge = (s: string) =>
  ['delivered','confirmed'].includes(s) ? 'ok'
    : ['cancelled','returned','refunded','expired'].includes(s) ? 'err'
    : 'warn';

/** "in 12m" / "expired" for a reserved hold. */
function holdLabel(reservedUntil: string | null) {
  if (!reservedUntil) return null;
  const ms = new Date(reservedUntil).getTime() - Date.now();
  if (ms <= 0) return 'expiring…';
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  return `holds ${m}m ${s}s`;
}

export default async function AdminOrdersPage() {
  // Sweep expired holds before rendering so the board is always current.
  await expireStaleBookings();

  const orders = await query<{
    id: number; order_no: string; status: string; reserved_until: string | null; grand_total: number;
    shipping_name: string | null; shipping_phone: string | null; placed_at: string; items: number;
  }>(
    `SELECT o.id, o.order_no, o.status, o.reserved_until, o.grand_total, o.shipping_name, o.shipping_phone,
            o.placed_at, COUNT(oi.id) items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     GROUP BY o.id ORDER BY (o.status = 'reserved') DESC, o.placed_at DESC LIMIT 150`,
  );
  const bookings = orders.filter(o => o.status === 'reserved').length;

  return (
    <>
      <h1 className="adm-h1">Orders &amp; Bookings</h1>
      <p className="adm-sub">
        {bookings > 0
          ? `${bookings} active hold${bookings === 1 ? '' : 's'} awaiting phone confirmation — call & confirm before the timer runs out.`
          : 'No active holds. Reserved pieces appear here for the concierge to confirm.'}
      </p>

      {orders.length === 0 ? (
        <div className="adm-empty">No orders yet.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Placed</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const hold = o.status === 'reserved' ? holdLabel(o.reserved_until) : null;
              return (
                <tr key={o.id} style={o.status === 'reserved' ? { background: 'rgba(200,155,60,0.06)' } : undefined}>
                  <td><strong>{o.order_no}</strong></td>
                  <td>
                    {o.shipping_name || '—'}
                    <div style={{ fontSize: 12, color: '#9A8668' }}>{o.shipping_phone}</div>
                  </td>
                  <td>{o.items}</td>
                  <td>{bdt(o.grand_total)}</td>
                  <td>{new Date(o.placed_at).toLocaleString()}</td>
                  <td>
                    <span className={`adm-badge ${badge(o.status)}`}>{o.status}</span>
                    {hold && <div style={{ fontSize: 11, color: '#A06818', marginTop: 4 }}>{hold}</div>}
                  </td>
                  <td>
                    {o.status === 'reserved' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <form action={confirmBookingAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button className="adm-btn sm" type="submit">✓ Confirm call</button>
                        </form>
                        <form action={releaseBookingAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button className="adm-btn danger" type="submit">Release</button>
                        </form>
                      </div>
                    ) : (
                      <form action={updateOrderStatusAction} style={{ display: 'flex', gap: 6 }}>
                        <input type="hidden" name="id" value={o.id} />
                        <select name="status" defaultValue={o.status}
                          style={{ padding: '4px 8px', border: '1px solid rgba(200,155,60,0.35)', borderRadius: 6 }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button className="adm-btn ghost sm" type="submit">Update</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
