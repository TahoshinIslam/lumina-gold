'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from './StoreContext';
import { formatPrice } from './types';
import { createBooking } from '../../app/checkout/actions';

/** Live mm:ss countdown to a target ISO time. */
function useCountdown(targetIso: string | null) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const tick = () => setLeft(Math.max(0, Math.round((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return { left, label: `${mm}:${ss}` };
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ orderNo: string; reservedUntil: string; phone: string } | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '' });

  const tax = Math.round(cartSubtotal * 0.05);
  const grand = cartSubtotal + tax;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const { left, label } = useCountdown(done?.reservedUntil ?? null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const res = await createBooking(
        cart.map(i => ({ sku: i.sku, qty: i.qty, size: i.size, engraving: i.engraving })),
        form,
      );
      if (res.ok && res.orderNo && res.reservedUntil) {
        clearCart();
        setDone({ orderNo: res.orderNo, reservedUntil: res.reservedUntil, phone: form.phone });
      } else setError(res.error || 'Could not reserve your pieces.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  if (done) {
    const expired = left <= 0;
    return (
      <div className="lum-cart" style={{ textAlign: 'center' }}>
        <div className="lum-breathe-diamond" style={{ width: 22, height: 22, margin: '0 auto 24px' }} />
        <h1 className="lum-h2 lum-listing-title">{expired ? 'Your hold has ended' : 'Reserved for you'}</h1>
        {!expired ? (
          <>
            <div className="lum-hold-timer" aria-live="polite">{label}</div>
            <p className="lum-pdp-desc" style={{ maxWidth: 500, margin: '6px auto 0' }}>
              Booking <strong>{done.orderNo}</strong> is held. A LUMINA concierge will call{' '}
              <strong>{done.phone}</strong> within this window to confirm your appointment and
              arrange secure collection or delivery. If we can&apos;t reach you, the hold is
              released so nothing is charged.
            </p>
          </>
        ) : (
          <p className="lum-pdp-desc" style={{ maxWidth: 500, margin: '6px auto 0' }}>
            The hold on booking <strong>{done.orderNo}</strong> has ended. The pieces are back in
            the boutique — you&apos;re welcome to reserve them again, or call us to arrange a private viewing.
          </p>
        )}
        <div style={{ marginTop: 28, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:+8801712345678" className="lum-cta-gold">Call the boutique</a>
          <Link href="/shop" className="lum-cta-ghost">Continue browsing</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="lum-cart">
        <h1 className="lum-h2 lum-listing-title">Reserve</h1>
        <div className="lum-empty-results" style={{ marginTop: 30 }}>
          Your bag is empty.
          <div style={{ marginTop: 20 }}><Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">Reserve Your Pieces</h1>
      <p className="lum-pdp-desc" style={{ maxWidth: 620 }}>
        LUMINA pieces aren&apos;t sold online. Reserve now and we&apos;ll hold them for you;
        a concierge calls within 15 minutes to confirm your booking and arrange a private
        viewing, collection, or insured delivery.
      </p>
      {error && <div className="lum-pdp-warn" style={{ marginTop: 16 }}>{error}</div>}
      <div className="lum-cart-grid">
        <form className="lum-checkout-form" onSubmit={submit}>
          <h2 className="lum-cart-summary-title">Your Details</h2>
          <label className="lum-field"><span>Full name *</span><input value={form.name} onChange={set('name')} required /></label>
          <label className="lum-field"><span>Phone (we&apos;ll call to confirm) *</span><input value={form.phone} onChange={set('phone')} required placeholder="+880…" /></label>
          <label className="lum-field"><span>Email</span><input type="email" value={form.email} onChange={set('email')} /></label>
          <label className="lum-field"><span>Preferred boutique / delivery area</span><textarea rows={2} value={form.address} onChange={set('address')} /></label>
          <label className="lum-field"><span>Note for the concierge</span><textarea rows={2} value={form.note} onChange={set('note')} /></label>
          <button className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%' }} disabled={busy}>
            {busy ? 'Reserving…' : `Reserve · hold for 15 minutes`}
          </button>
        </form>

        <aside className="lum-cart-summary">
          <h2 className="lum-cart-summary-title">Your Booking</h2>
          {cart.map(i => (
            <div key={i.sku + (i.size ?? '')} className="lum-cart-line">
              <span>{i.name} × {i.qty}</span><span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="lum-cart-line" style={{ marginTop: 10 }}><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
          <div className="lum-cart-line"><span>Est. VAT (5%)</span><span>{formatPrice(tax)}</span></div>
          <div className="lum-cart-line lum-cart-total"><span>Indicative total</span><span>{formatPrice(grand)}</span></div>
          <p className="lum-pdp-note">Final price is confirmed by your concierge — today&apos;s gold rate may vary.</p>
        </aside>
      </div>
    </div>
  );
}
