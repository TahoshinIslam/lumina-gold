import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, PackageSearch } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { listCustomerOrders } from '@/server/dal/orders';
import { expireStaleBookings } from '@/server/dal/bookings';
import { ORDER_STATUS, PAYMENT_LABEL, type OrderStatus } from '@/types/order';
import { formatPrice } from '@/types/product';
import LiveData from '@/features/shared/LiveData';
import Select from '@/features/shared/Select';

export const metadata: Metadata = { title: 'My Orders — Nahar Jewellers' };
export const dynamic = 'force-dynamic';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Only the statuses a customer's own orders can actually be in. */
const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'crafting', label: 'Crafting' },
  { value: 'hallmarking', label: 'Hallmarking' },
  { value: 'diamond_setting', label: 'Diamond setting' },
  { value: 'quality_check', label: 'Quality check' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

/**
 * My Orders — every order this customer has placed, searchable by order number
 * or piece, filterable by status, paginated.
 *
 * The filter form is a plain GET form: no client JavaScript, the URL is the
 * state, and a filtered list can be bookmarked or shared with the boutique.
 */
export default async function MyOrders({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');

  const params = await searchParams;
  // Holds expire lazily (there's no background worker), so sweep before we read.
  await expireStaleBookings();

  const { orders, total, page, pages } = await listCustomerOrders(customer.id, {
    search: params.q,
    status: params.status,
    page: Number(params.page) || 1,
  });

  const link = (next: number) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (next > 1) query.set('page', String(next));
    const qs = query.toString();
    return `/account/orders${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="lum-root">
      <LiveData />
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart">
          <div className="lum-orders-head">
            <div>
              <h1 className="lum-h2 lum-listing-title">My Orders</h1>
              <div className="lum-listing-count">
                {total} {total === 1 ? 'order' : 'orders'}
              </div>
            </div>
            <Link href="/account" className="lum-link-gold">Back to account</Link>
          </div>

          <form className="lum-orders-filter" method="get">
            <input name="q" defaultValue={params.q ?? ''} placeholder="Search order number or piece" />
            {/* Still a plain GET form — the listbox carries its value in a hidden
                input, so "Filter" submits exactly as the <select> used to. */}
            <Select name="status" options={FILTERS} defaultValue={params.status ?? 'all'}
              ariaLabel="Filter by status" />
            <button type="submit" className="lum-cta-ghost">Filter</button>
          </form>

          {orders.length === 0 ? (
            <div className="lum-empty-results" style={{ marginTop: 30 }}>
              <PackageSearch size={26} style={{ display: 'block', margin: '0 auto 16px', opacity: 0.6 }} />
              {params.q || (params.status && params.status !== 'all')
                ? 'No orders match that search.'
                : 'You haven’t placed an order yet.'}
              <div style={{ marginTop: 20 }}>
                <Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link>
              </div>
            </div>
          ) : (
            <div className="lum-orders">
              {orders.map(order => {
                const status = ORDER_STATUS[order.status as OrderStatus];
                // SUM() comes back from mysql2 as a string — `=== 1` would never
                // match and every order would read "1 pieces".
                const pieces = Number(order.item_count);
                return (
                  <Link key={order.id} href={`/account/orders/${order.order_no}`} className="lum-order-card">
                    <div className="lum-order-thumb lum-img-ph">
                      {order.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={order.thumbnail} alt="" />
                      )}
                    </div>

                    <div className="lum-order-card-body">
                      <div className="lum-order-no">{order.order_no}</div>
                      <div className="lum-order-date">
                        {DATE.format(new Date(order.placed_at))} · {pieces}{' '}
                        {pieces === 1 ? 'piece' : 'pieces'}
                      </div>
                      <div className="lum-order-first">{order.first_item}</div>
                    </div>

                    <div className="lum-order-card-meta">
                      <span className={`lum-order-status is-${status.tone}`}>{status.label}</span>
                      <span className="lum-order-total">{formatPrice(Number(order.grand_total))}</span>
                      <span className="lum-order-pay">
                        {PAYMENT_LABEL[order.payment_method] ?? order.payment_method} ·{' '}
                        <em className={`lum-pay-state is-${order.payment_status}`}>{order.payment_status}</em>
                      </span>
                    </div>

                    <ChevronRight size={18} className="lum-order-chev" />
                  </Link>
                );
              })}
            </div>
          )}

          {pages > 1 && (
            <nav className="lum-pager" aria-label="Orders pages">
              {page > 1 && <Link href={link(page - 1)} className="lum-cta-ghost">← Newer</Link>}
              <span className="lum-pager-at">Page {page} of {pages}</span>
              {page < pages && <Link href={link(page + 1)} className="lum-cta-ghost">Older →</Link>}
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
