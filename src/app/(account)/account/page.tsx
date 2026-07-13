import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ChevronRight, Gem, Heart, Lock, MapPin, Package, Sparkles, Star, User,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { query } from '@/server/db/client';
import { getAddresses } from '@/server/dal/addresses';
import { listCustomerOrders } from '@/server/dal/orders';
import { getMyReviews, awaitingReview } from '@/server/dal/reviews';
import { getRewards, TIERS } from '@/features/customer/profile';
import { logoutCustomerAction } from '@/features/customer/actions';
import { ORDER_STATUS, type OrderStatus } from '@/types/order';
import { formatPrice } from '@/types/product';
import ProfileForm from '@/features/customer/components/ProfileForm';
import AddressBook from '@/features/customer/components/AddressBook';
import SecurityPanel from '@/features/customer/components/SecurityPanel';
import MyReviews from '@/features/customer/components/MyReviews';
import WishlistPanel from '@/features/customer/components/WishlistPanel';

export const metadata: Metadata = { title: 'My Account — Nahar Jewellers' };
export const dynamic = 'force-dynamic';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'rewards', label: 'Rewards', icon: Sparkles },
  { id: 'security', label: 'Security', icon: Lock },
] as const;

type TabId = (typeof TABS)[number]['id'];

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

interface UserRow {
  id: number; name: string; email: string | null; phone: string | null;
  avatar_path: string | null; password_hash: string | null;
  notify_order: number; notify_offers: number; notify_sms: number;
}

/**
 * The account (Phase 8) — one page, seven tabs.
 *
 * The tab is a URL, not client state: each panel is server-rendered with only
 * the data that panel needs, so opening "Profile" doesn't query the order
 * history, and any tab can be linked to or bookmarked.
 */
export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; ok?: string; error?: string }>;
}) {
  const session = await getCurrentCustomer();
  if (!session) redirect('/account/login');

  const params = await searchParams;
  const tab: TabId = (TABS.find(t => t.id === params.tab)?.id ?? 'profile');

  const rows = await query<UserRow>(
    `SELECT id, name, email, phone, avatar_path, password_hash,
            notify_order, notify_offers, notify_sms
       FROM users WHERE id = ?`,
    [session.id],
  );
  const customer = rows[0];

  // Only what this tab renders.
  const [addresses, orders, reviews, awaiting, rewards] = await Promise.all([
    tab === 'addresses' ? getAddresses(customer.id) : Promise.resolve([]),
    tab === 'orders' ? listCustomerOrders(customer.id, { perPage: 5 }) : Promise.resolve(null),
    tab === 'reviews' ? getMyReviews(customer.id) : Promise.resolve([]),
    tab === 'reviews' ? awaitingReview(customer.id) : Promise.resolve([]),
    tab === 'rewards' ? getRewards(customer.id) : Promise.resolve(null),
  ]);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart">
          <div className="lum-orders-head">
            <div>
              <h1 className="lum-h2 lum-listing-title">
                Welcome, {customer.name.split(' ')[0]}
              </h1>
              <div className="lum-account-meta">
                {customer.phone}
                {customer.email ? <> · {customer.email}</> : null}
              </div>
            </div>
            <form action={logoutCustomerAction}>
              <button type="submit" className="lum-cta-ghost">Sign out</button>
            </form>
          </div>

          <div className="lum-account-layout">
            <nav className="lum-account-nav" aria-label="Account sections">
              {TABS.map(item => (
                <Link key={item.id} href={`/account?tab=${item.id}`}
                  className={`lum-account-tab${tab === item.id ? ' is-on' : ''}`}
                  aria-current={tab === item.id ? 'page' : undefined}>
                  <item.icon size={16} /> {item.label}
                </Link>
              ))}
            </nav>

            <div className="lum-account-panel">
              {params.ok === 'set' && <div className="lum-account-notice">Password set — you can now sign in from any device.</div>}
              {params.ok === 'changed' && <div className="lum-account-notice">Password updated.</div>}
              {params.error === 'current' && <div className="lum-pdp-warn">That isn’t your current password.</div>}
              {params.error === 'weak' && <div className="lum-pdp-warn">Choose a password of at least 6 characters.</div>}
              {params.error === 'mismatch' && <div className="lum-pdp-warn">The two passwords don’t match.</div>}

              {tab === 'profile' && <ProfileForm customer={customer} />}

              {tab === 'addresses' && <AddressBook addresses={addresses} />}

              {tab === 'security' && (
                <SecurityPanel
                  hasPassword={!!customer.password_hash}
                  prefs={{
                    notify_order: customer.notify_order,
                    notify_offers: customer.notify_offers,
                    notify_sms: customer.notify_sms,
                  }}
                />
              )}

              {tab === 'wishlist' && <WishlistPanel />}

              {tab === 'reviews' && <MyReviews reviews={reviews} awaiting={awaiting} />}

              {tab === 'orders' && orders && (
                <div>
                  <div className="lum-orders-head">
                    <h2 className="lum-cart-summary-title">Recent orders</h2>
                    <Link href="/account/orders" className="lum-link-gold">See all {orders.total} →</Link>
                  </div>
                  {orders.orders.length === 0 ? (
                    <div className="lum-empty-results" style={{ marginTop: 20 }}>
                      You haven’t placed an order yet.
                      <div style={{ marginTop: 20 }}>
                        <Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="lum-orders" style={{ marginTop: 20 }}>
                      {orders.orders.map(order => {
                        const status = ORDER_STATUS[order.status as OrderStatus];
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
                              <div className="lum-order-date">{DATE.format(new Date(order.placed_at))}</div>
                              <div className="lum-order-first">{order.first_item}</div>
                            </div>
                            <div className="lum-order-card-meta">
                              <span className={`lum-order-status is-${status.tone}`}>{status.label}</span>
                              <span className="lum-order-total">{formatPrice(Number(order.grand_total))}</span>
                            </div>
                            <ChevronRight size={18} className="lum-order-chev" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {tab === 'rewards' && rewards && (
                <div>
                  <h2 className="lum-cart-summary-title">Rewards</h2>
                  <div className="lum-rewards">
                    <div className="lum-rewards-head">
                      <div>
                        <div className="lum-rewards-points">{rewards.points.toLocaleString('en-IN')}</div>
                        <div className="lum-addr-lines">points earned</div>
                      </div>
                      <div className="lum-rewards-tier">
                        <Gem size={15} /> {rewards.tier.name}
                      </div>
                    </div>
                    <p className="lum-pdp-desc" style={{ marginTop: 0 }}>{rewards.tier.perk}</p>

                    <div className="lum-bar-track" style={{ marginTop: 16 }}>
                      <span className="lum-bar-fill" style={{ width: `${rewards.progress * 100}%` }} />
                    </div>
                    <p className="lum-pdp-note">
                      {rewards.next
                        ? `${rewards.toNext.toLocaleString('en-IN')} points to ${rewards.next.name}.`
                        : 'You’ve reached our highest tier.'}
                      {' '}You earn 1 point for every ৳100 on a delivered order —{' '}
                      {formatPrice(rewards.spent)} so far.
                    </p>

                    <table className="lum-rewards-table">
                      <thead><tr><th>Tier</th><th>From</th><th>What it opens</th></tr></thead>
                      <tbody>
                        {TIERS.map(tier => (
                          <tr key={tier.name} className={tier.name === rewards.tier.name ? 'is-on' : ''}>
                            <td>{tier.name}</td>
                            <td>{tier.from.toLocaleString('en-IN')}</td>
                            <td>{tier.perk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
