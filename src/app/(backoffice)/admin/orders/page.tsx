import Link from 'next/link';
import { query } from '@/server/db/client';
import {
  updateOrderStatusAction, confirmBookingAction, releaseBookingAction, bulkUpdateOrderStatusAction,
} from '../actions';
import { expireStaleBookings } from '@/server/dal/bookings';
import { SortableHead } from '@/features/admin/components/SortableHead';
import { Pagination } from '@/features/admin/components/Pagination';
import { StatusFilter } from '@/features/admin/components/StatusFilter';
import { BulkActionsBar } from '@/features/admin/components/BulkActionsBar';
import { AdminActionButton, AdminInlineForm } from '@/features/admin/components/AdminFeedback';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';
import { PackageSearch, FileDown } from 'lucide-react';
import { ORDER_STATUS } from '@/types/order';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Number(n).toLocaleString('en-IN')}`;
// The jewellery pipeline, straight from the shared vocabulary — the admin's
// dropdown and the customer's timeline must offer the same words.
const STATUSES = Object.keys(ORDER_STATUS);
const badge = (s: string) =>
  ['delivered','confirmed'].includes(s) ? 'ok'
    : ['cancelled','returned','refunded','expired'].includes(s) ? 'err'
    : 'warn';
const PAGE_SIZE = 25;
const SORT_COLUMNS: Record<string, string> = {
  order_no: 'o.order_no', customer: 'o.shipping_name', total: 'o.grand_total', placed: 'o.placed_at', status: 'o.status',
};

/** "in 12m" / "expired" for a reserved hold. */
function holdLabel(reservedUntil: string | null) {
  if (!reservedUntil) return null;
  const ms = new Date(reservedUntil).getTime() - Date.now();
  if (ms <= 0) return 'expiring…';
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  return `holds ${m}m ${s}s`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string; status?: string | string[]; from?: string; to?: string; sort?: string; dir?: string; page?: string;
  }>;
}) {
  // Sweep expired holds before rendering so the board is always current.
  await expireStaleBookings();

  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const statuses = (Array.isArray(sp.status) ? sp.status : sp.status ? [sp.status] : [])
    .filter(s => STATUSES.includes(s));
  const from = sp.from?.trim() || '';
  const to = sp.to?.trim() || '';
  const sort = SORT_COLUMNS[sp.sort || ''] ? sp.sort! : 'placed';
  const dir = sp.dir === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(1, Number(sp.page) || 1);

  const conditions: string[] = [];
  const args: (string | number)[] = [];
  if (q) { conditions.push('(o.order_no LIKE ? OR o.shipping_name LIKE ? OR o.shipping_phone LIKE ?)'); args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (statuses.length) { conditions.push(`o.status IN (${statuses.map(() => '?').join(',')})`); args.push(...statuses); }
  if (from) { conditions.push('o.placed_at >= ?'); args.push(`${from} 00:00:00`); }
  if (to) { conditions.push('o.placed_at <= ?'); args.push(`${to} 23:59:59`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [{ total }] = await query<{ total: number }>(
    `SELECT COUNT(*) total FROM orders o ${where}`, args,
  );

  const orders = await query<{
    id: number; order_no: string; status: string; reserved_until: string | null; grand_total: number;
    shipping_name: string | null; shipping_phone: string | null; placed_at: string; items: number;
  }>(
    `SELECT o.id, o.order_no, o.status, o.reserved_until, o.grand_total, o.shipping_name, o.shipping_phone,
            o.placed_at, COUNT(oi.id) items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     ${where}
     GROUP BY o.id
     ORDER BY (o.status = 'reserved') DESC, ${SORT_COLUMNS[sort]} ${dir}
     LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    args,
  );
  const bookings = orders.filter(o => o.status === 'reserved').length;

  const linkParams = { q, status: statuses, from, to, sort, dir: dir.toLowerCase() };
  const activeFilters = q || statuses.length || from || to;

  return (
    <>
      <div className="adm-detail-head">
        <h1 className="adm-h1">Orders &amp; Bookings</h1>
        {/* Exports what is on screen, not the whole table — the filter travels
            with the link. */}
        <div className="adm-detail-tools">
        <a className="adm-btn ghost"
          href={`/api/admin/orders/export?${new URLSearchParams({
            ...(q ? { q } : {}),
            // The export takes ONE status; with several ticked, exporting them
            // all and letting the spreadsheet filter is the honest behaviour.
            ...(statuses.length === 1 ? { status: statuses[0] } : {}),
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          }).toString()}`}>
          <FileDown size={14} /> Export CSV
        </a>
        <a className="adm-btn ghost"
          href={`/api/admin/orders/export?${new URLSearchParams({
            format: 'xlsx',
            ...(q ? { q } : {}),
            ...(statuses.length === 1 ? { status: statuses[0] } : {}),
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          }).toString()}`}>
          <FileDown size={14} /> Export Excel
        </a>
        </div>
      </div>
      <p className="adm-sub">
        {bookings > 0
          ? `${bookings} active hold${bookings === 1 ? '' : 's'} awaiting phone confirmation — call & confirm before the timer runs out.`
          : `${total} order${total === 1 ? '' : 's'}. Reserved pieces appear here for the concierge to confirm.`}
      </p>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <DebouncedSearchInput placeholder="Search order #, name or phone…" defaultValue={q} />
        </div>
        <StatusFilter
          options={STATUSES.map(s => ({ value: s, label: s.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()) }))}
          selected={statuses}
        />
        <input type="date" name="from" className="adm-select" defaultValue={from} aria-label="From date" />
        <input type="date" name="to" className="adm-select" defaultValue={to} aria-label="To date" />
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir.toLowerCase()} />
        <button className="adm-btn ghost sm" type="submit">Filter</button>
        {activeFilters ? <Link href="/admin/orders" className="adm-toolbar-reset">Reset</Link> : null}
      </form>

      {orders.length === 0 ? (
        <AdminEmptyState icon={PackageSearch}
          title={activeFilters ? 'No orders match these filters' : 'No orders yet'}
          description={activeFilters ? 'Try a different search or clear the filters.' : undefined} />
      ) : (
        <>
          <form id="orders-bulk-form" action={bulkUpdateOrderStatusAction} />
          <BulkActionsBar
            formId="orders-bulk-form"
            selectAllId="orders-select-all"
            label="order"
            actions={[{ label: 'Apply status', formAction: bulkUpdateOrderStatusAction }]}
          >
            <select name="status" form="orders-bulk-form" className="adm-select" defaultValue="">
              <option value="" disabled>Set status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </BulkActionsBar>

          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-check-col"><input id="orders-select-all" type="checkbox" aria-label="Select all" /></th>
                <SortableHead col="order_no" label="Order" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/orders" />
                <SortableHead col="customer" label="Customer" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/orders" />
                <th>Items</th>
                <SortableHead col="total" label="Total" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/orders" />
                <SortableHead col="placed" label="Placed" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/orders" />
                <SortableHead col="status" label="Status" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/orders" />
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const hold = o.status === 'reserved' ? holdLabel(o.reserved_until) : null;
                return (
                  <tr key={o.id} style={o.status === 'reserved' ? { background: 'rgba(201,154,74,0.06)' } : undefined}>
                    <td className="adm-check-col">
                      <input type="checkbox" form="orders-bulk-form" name="ids" value={o.id} aria-label={`Select ${o.order_no}`} />
                    </td>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="adm-link">
                        <strong>{o.order_no}</strong>
                      </Link>
                    </td>
                    <td>
                      {o.shipping_name || '—'}
                      <div style={{ fontSize: 12, color: '#687168' }}>{o.shipping_phone}</div>
                    </td>
                    <td>{o.items}</td>
                    <td>{bdt(o.grand_total)}</td>
                    <td>{new Date(o.placed_at).toLocaleString()}</td>
                    <td>
                      <span className={`adm-badge ${badge(o.status)}`}>{o.status}</span>
                      {hold && <div style={{ fontSize: 11, color: '#AD7D32', marginTop: 4 }}>{hold}</div>}
                    </td>
                    <td>
                      {o.status === 'reserved' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <AdminActionButton action={confirmBookingAction} values={{ id: o.id }}
                            message="Booking confirmed" className="adm-btn sm">✓ Confirm call</AdminActionButton>
                          <AdminActionButton action={releaseBookingAction} values={{ id: o.id }}
                            message="Booking released" tone="info" className="adm-btn danger">Release</AdminActionButton>
                        </div>
                      ) : (
                        <AdminInlineForm action={updateOrderStatusAction} successMessage="Order status updated"
                          style={{ display: 'flex', gap: 6 }}>
                          <input type="hidden" name="id" value={o.id} />
                          <select name="status" defaultValue={o.status}
                            style={{ padding: '4px 8px', border: '1px solid rgba(201,154,74,0.35)', borderRadius: 6 }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button className="adm-btn ghost sm" type="submit">Update</button>
                        </AdminInlineForm>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/orders" params={linkParams} />
    </>
  );
}
