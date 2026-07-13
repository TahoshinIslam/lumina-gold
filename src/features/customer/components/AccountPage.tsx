'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import { getProductBySku } from '@/features/catalog/catalog';
import { Product, formatPrice } from '@/types/product';
import ProductCard from '@/features/catalog/components/ProductCard';
import { BOOKING_STATUS, type Booking } from '@/types/booking';

type Customer = { id: number; name: string; phone: string | null; email: string | null };

const NOTICE: Record<string, string> = {
  set: 'Password set — you can now sign in from any device with your phone number.',
  changed: 'Password updated.',
};
const ERROR: Record<string, string> = {
  weak: 'Choose a password of at least 6 characters.',
  mismatch: 'The two passwords don’t match.',
  current: 'That isn’t your current password.',
};

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** A hold ledger, not a parcel tracker — these pieces are reserved, not shipped. */
function Bookings({ bookings }: { bookings: Booking[] }) {
  return (
    <div style={{ marginTop: 50 }}>
      <div className="lum-orders-head">
        <h2 className="lum-cart-summary-title">Recent orders</h2>
        <Link href="/account/orders" className="lum-link-gold">See all →</Link>
      </div>
      {bookings.length === 0 ? (
        <div className="lum-empty-results" style={{ marginTop: 20 }}>
          No bookings yet.
          <div style={{ marginTop: 20 }}><Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link></div>
        </div>
      ) : (
        <div className="lum-orders">
          {bookings.map(booking => {
            const status = BOOKING_STATUS[booking.status];
            return (
              <article key={booking.id} className="lum-order">
                <header className="lum-order-head">
                  <div>
                    <div className="lum-order-no">{booking.order_no}</div>
                    <div className="lum-order-date">{DATE.format(new Date(booking.placed_at))}</div>
                  </div>
                  <div className={`lum-order-status is-${booking.status}`}>{status.label}</div>
                </header>
                <ul className="lum-order-items">
                  {booking.items.map((item, index) => (
                    <li key={`${item.variant_sku}-${index}`}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>{formatPrice(item.line_total)}</span>
                    </li>
                  ))}
                </ul>
                <footer className="lum-order-foot">
                  <span className="lum-order-note">{status.note}</span>
                  <span className="lum-order-total">{formatPrice(booking.grand_total)}</span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * AccountPage — the shopper's hub: bookings they can track, a password they can
 * set, saved items, recently viewed.
 *
 * Most accounts here are born at checkout, out of the details typed to reserve a
 * piece — so the shopper arrives already signed in, with no password at all.
 * Setting one is what turns a device-bound session into an account they can come
 * back to, which is why that card sits in the page rather than behind a settings
 * link they'd never find.
 */
export default function AccountPage({
  customer, bookings, hasPassword, notice, error, logoutAction, setPasswordAction,
}: {
  customer: Customer | null;
  bookings: Booking[];
  hasPassword: boolean;
  notice?: string | null;
  error?: string | null;
  logoutAction: () => void;
  setPasswordAction: (formData: FormData) => void;
}) {
  const { wished, wishCount, cartCount, recent, toggleWish } = useStore();
  const recentItems = recent
    .map(getProductBySku)
    .filter((p): p is Product => !!p)
    .slice(0, 4);

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">
        {customer ? `Welcome, ${customer.name.split(' ')[0]}` : 'My Account'}
      </h1>

      {customer ? (
        <div className="lum-account-meta">
          Signed in as <strong>{customer.phone}</strong>
          {customer.email ? <> · <strong>{customer.email}</strong></> : null}
          {' · '}
          <form action={logoutAction} style={{ display: 'inline' }}>
            <button type="submit" className="lum-link-gold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <p className="lum-pdp-desc" style={{ maxWidth: 520 }}>
          <Link href="/account/login" className="lum-link-gold">Sign in</Link> or{' '}
          <Link href="/account/register" className="lum-link-gold">create an account</Link> to save your
          pieces and check out faster. Your saved items are kept on this device in the meantime.
        </p>
      )}

      {notice && NOTICE[notice] && <div className="lum-account-notice">{NOTICE[notice]}</div>}
      {error && ERROR[error] && <div className="lum-pdp-warn" style={{ marginTop: 16 }}>{ERROR[error]}</div>}

      <div className="lum-account-cards">
        <Link href="/account/orders" className="lum-account-card">
          <span className="lum-account-num">{bookings.length}</span>
          <span className="lum-account-lbl">Orders</span>
        </Link>
        <Link href="/wishlist" className="lum-account-card">
          <span className="lum-account-num">{wishCount}</span>
          <span className="lum-account-lbl">Saved pieces</span>
        </Link>
        <Link href="/cart" className="lum-account-card">
          <span className="lum-account-num">{cartCount}</span>
          <span className="lum-account-lbl">In your bag</span>
        </Link>
        <Link href="/#appointment" className="lum-account-card">
          <span className="lum-account-num">✦</span>
          <span className="lum-account-lbl">Book an appointment</span>
        </Link>
      </div>

      {customer && (
        <>
          <Bookings bookings={bookings.slice(0, 3)} />

          <div className="lum-account-security">
            <h2 className="lum-cart-summary-title">
              {hasPassword ? 'Change your password' : 'Set a password'}
            </h2>
            <p className="lum-pdp-desc" style={{ maxWidth: 560 }}>
              {hasPassword
                ? 'Choose a new password for signing in with your phone number.'
                : 'Your account was created from the details you gave when you reserved, so it has no password yet. Set one and you can sign in from any device — and keep every booking in one place.'}
            </p>
            <form action={setPasswordAction} className="lum-checkout-form" style={{ marginTop: 20, maxWidth: 420 }}>
              {hasPassword && (
                <label className="lum-field">
                  <span>Current password *</span>
                  <input name="current" type="password" autoComplete="current-password" required />
                </label>
              )}
              <label className="lum-field">
                <span>{hasPassword ? 'New password *' : 'Password *'}</span>
                <input name="password" type="password" autoComplete="new-password" minLength={6} required />
              </label>
              <label className="lum-field">
                <span>Confirm password *</span>
                <input name="confirm" type="password" autoComplete="new-password" minLength={6} required />
              </label>
              <button className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%' }} type="submit">
                {hasPassword ? 'Update password' : 'Set password'}
              </button>
            </form>
          </div>
        </>
      )}

      {recentItems.length > 0 && (
        <div style={{ marginTop: 50 }}>
          <h2 className="lum-cart-summary-title">Recently Viewed</h2>
          <div className="lum-results-grid" style={{ marginTop: 20 }}>
            {recentItems.map(p => (
              <ProductCard key={p.sku} product={p} wished={!!wished[p.sku]} onToggleWish={toggleWish} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
