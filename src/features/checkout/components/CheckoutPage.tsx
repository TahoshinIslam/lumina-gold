'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreditCard, Gift, MapPin, Pencil, Tag, Trash2, Truck } from 'lucide-react';
import { useStore } from '@/stores/StoreContext';
import { formatPrice } from '@/types/product';
import type { Address } from '@/server/dal/addresses';
import type { CheckoutState } from '@/app/(checkout)/checkout/actions';
import type { PaymentMethod } from '@/config/payments';
import {
  getCheckoutState, applyCouponAction, placeOrderAction,
  deleteAddressAction, setDefaultAddressAction,
} from '@/app/(checkout)/checkout/actions';
import AddressDialog from './AddressDialog';
import { runAction } from '@/features/shared/runAction';

/**
 * Checkout — address, payment, coupon, notes, and a summary priced by the server.
 *
 * The bag lives in localStorage, so this page hands it to `getCheckoutState` and
 * renders what comes back: real variants, real prices, real stock. Nothing shown
 * here is trusted at Place Order either — the action re-prices the whole bag and
 * re-checks the coupon before it writes a single row.
 */

/**
 * The boutique takes cash on delivery, and nothing else. The other methods stay
 * in the `payment_method` enum (and in @/config/payments) so a gateway can be
 * added later without a migration — but a button that cannot actually take money
 * has no business being on this page.
 */
const PAYMENTS: { id: PaymentMethod; label: string; note: string; icon: React.ElementType }[] = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    note: 'Pay the courier when your piece arrives — please have the exact amount ready',
    icon: Truck,
  },
];

/**
 * Checkout's own actions answer with `error`; runAction's fallback (when the
 * action itself throws) answers with `message`. One reader for both, so a
 * failure can never render as `undefined`.
 */
const failureText = (result: { error?: string; message?: string }) => result.error ?? result.message;

/** The jewellery facts that identify what was actually bought. */
function LineSpec({ line }: { line: CheckoutState['lines'][number] }) {
  const facts = [
    line.purity && line.metal ? `${line.purity} ${line.metal}` : line.metal,
    line.metalColor,
    line.sizeLabel ? `Size ${line.sizeLabel}` : null,
    line.diamondCarat ? `${line.diamondCarat} ct` : null,
    line.stoneCount ? `${line.stoneCount} stones` : null,
  ].filter(Boolean);
  return <div className="lum-sum-spec">{facts.join(' · ')}</div>;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();

  const [state, setState] = useState<CheckoutState | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  // Only one method exists, so it starts selected. The validation below stays:
  // it is what will catch an empty choice the day a second method is added.
  // Billing is the delivery address unless the shopper says otherwise — asking
  // twice for the same thing is how a checkout loses people.
  const [billingSame, setBillingSame] = useState(true);
  const [billingId, setBillingId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(
    PAYMENTS.length === 1 ? PAYMENTS[0].id : null,
  );
  const [coupon, setCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [note, setNote] = useState('');
  const [gift, setGift] = useState('');
  const [dialog, setDialog] = useState<{ open: boolean; address: Address | null }>({ open: false, address: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Serialised so the effect below re-runs when the BAG changes, not on every
  // render (a fresh array literal would never be referentially equal).
  const itemsKey = JSON.stringify(
    cart.map(i => ({ sku: i.sku, qty: i.qty, size: i.size, purity: i.purity, engraving: i.engraving })),
  );
  const items = useMemo(() => JSON.parse(itemsKey) as {
    sku: string; qty: number; size?: string; purity?: string; engraving?: string;
  }[], [itemsKey]);

  const absorb = useCallback((next: CheckoutState) => {
    setState(next);
    // Keep whatever the shopper picked; otherwise fall back to their default.
    setAddressId(current => {
      if (current && next.addresses.some(a => a.id === current)) return current;
      return next.addresses.find(a => a.is_default)?.id ?? next.addresses[0]?.id ?? null;
    });
  }, []);

  /** Re-price the bag and re-read the address book (after saving one, say). */
  const refresh = useCallback(async () => {
    absorb(await getCheckoutState(JSON.parse(itemsKey)));
  }, [itemsKey, absorb]);

  // Priced on mount and whenever the bag changes. `alive` guards the late
  // response of a bag the shopper has already changed again.
  useEffect(() => {
    let alive = true;
    getCheckoutState(JSON.parse(itemsKey))
      .then(next => { if (alive) absorb(next); })
      // Without this the page would sit on "Preparing your order…" for ever.
      .catch(() => { if (alive) setError('We couldn’t load your bag. Please refresh.'); });
    return () => { alive = false; };
  }, [itemsKey, absorb]);

  const lines = state?.lines ?? [];
  const totals = state?.totals;

  // A discount changes the tax, so the visible totals are recomputed with the
  // coupon on — exactly as placeOrderAction will recompute them server-side.
  const view = useMemo(() => {
    if (!totals) return null;
    const discount = Math.min(coupon?.discount ?? 0, totals.subtotal);
    const taxable = totals.subtotal - discount;
    const tax = Math.round((taxable * totals.taxRate) / 100);
    return { ...totals, discount, tax, grandTotal: taxable + tax + totals.shipping };
  }, [totals, coupon]);

  const applyCoupon = async () => {
    setCouponError('');
    const result = await runAction(() => applyCouponAction(couponInput, items));
    if (!result.ok) {
      setCouponError(failureText(result) ?? 'That code isn’t valid.');
      return;
    }
    setCoupon({ code: result.code!, discount: result.discount!, label: result.label! });
    setCouponInput('');
  };

  const removeAddress = async (id: number) => {
    const data = new FormData();
    data.set('id', String(id));
    const result = await runAction(() => deleteAddressAction(data));
    if (!result.ok) setError(result.message ?? 'Could not remove that address.');
    void refresh();
  };

  const makeDefault = async (id: number) => {
    const data = new FormData();
    data.set('id', String(id));
    const result = await runAction(() => setDefaultAddressAction(data));
    if (!result.ok) setError(result.message ?? 'Could not update your default address.');
    void refresh();
  };

  const place = async () => {
    setError('');
    // Nothing to deliver to. Telling someone to add an address and making them
    // find the button is one step too many — open the form for them.
    if (!addressId) {
      setDialog({ open: true, address: null });
      return;
    }
    if (!billingSame && !billingId) { setError('Choose a billing address.'); return; }
    if (!payment) { setError('Choose how you’d like to pay.'); return; }

    setBusy(true);
    // runAction guarantees we get an answer even if the action itself blows up,
    // so the button can never be left spinning on "Placing your order…".
    const result = await runAction(() => placeOrderAction({
      items, addressId, payment,
      billingAddressId: billingSame ? null : billingId,
      couponCode: coupon?.code, note, giftMessage: gift,
    }));
    setBusy(false);

    if (!result.ok || !('orderNo' in result) || !result.orderNo) {
      setError(failureText(result) ?? 'Could not place your order.');
      void refresh(); // stock or price may have moved under us
      return;
    }
    clearCart();
    router.push(`/checkout/success/${result.orderNo}`);
  };

  if (cart.length === 0) {
    return (
      <div className="lum-cart">
        <h1 className="lum-h2 lum-listing-title">Checkout</h1>
        <div className="lum-empty-results" style={{ marginTop: 30 }}>
          Your bag is empty.
          <div style={{ marginTop: 20 }}><Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link></div>
        </div>
      </div>
    );
  }

  if (!state || !view) {
    return (
      <div className="lum-cart">
        <h1 className="lum-h2 lum-listing-title">Checkout</h1>
        <div className="lum-empty-results" style={{ marginTop: 30 }}>Preparing your order…</div>
      </div>
    );
  }

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">Checkout</h1>

      {state.missing.length > 0 && (
        <div className="lum-pdp-warn" style={{ marginTop: 16 }}>
          {state.missing.join(', ')} is no longer available and has been left out of this order.
        </div>
      )}
      {error && <div className="lum-pdp-warn" style={{ marginTop: 16 }}>{error}</div>}

      <div className="lum-checkout-grid">
        <div className="lum-checkout-main">
          {/* ── Shipping address ─────────────────────────────────────── */}
          <section className="lum-panel">
            <h2 className="lum-panel-title"><MapPin size={17} /> Shipping address</h2>

            {state.addresses.length === 0 ? (
              <div className="lum-panel-empty">
                <p className="lum-pdp-desc" style={{ margin: 0 }}>Where should we deliver your piece?</p>
                <button className="lum-cta-gold" style={{ marginTop: 16 }}
                  onClick={() => setDialog({ open: true, address: null })}>
                  Add a delivery address
                </button>
              </div>
            ) : (
              <>
                <div className="lum-addr-list">
                  {state.addresses.map(address => (
                    <label key={address.id} className={`lum-addr${addressId === address.id ? ' is-on' : ''}`}>
                      <input type="radio" name="address" checked={addressId === address.id}
                        onChange={() => setAddressId(address.id)} />
                      <div className="lum-addr-body">
                        <div className="lum-addr-head">
                          <strong>{address.name}</strong>
                          {address.label && <span className="lum-addr-tag">{address.label}</span>}
                          {!!address.is_default && <span className="lum-addr-tag is-default">Default</span>}
                        </div>
                        <div className="lum-addr-lines">
                          {[address.line1, address.line2, address.city, address.district, address.postcode]
                            .filter(Boolean).join(', ')}
                        </div>
                        <div className="lum-addr-lines">{address.phone}</div>
                      </div>
                      <div className="lum-addr-tools">
                        <button type="button" aria-label={`Edit ${address.name}’s address`}
                          onClick={() => setDialog({ open: true, address })}><Pencil size={14} /></button>
                        <button type="button" aria-label={`Remove ${address.name}’s address`}
                          onClick={() => removeAddress(address.id)}><Trash2 size={14} /></button>
                        {!address.is_default && (
                          <button type="button" className="lum-addr-default"
                            onClick={() => makeDefault(address.id)}>Make default</button>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <button className="lum-cta-ghost" style={{ marginTop: 16 }}
                  onClick={() => setDialog({ open: true, address: null })}>
                  + Add new address
                </button>

                <label className="lum-check" style={{ marginTop: 18 }}>
                  <input type="checkbox" checked={billingSame}
                    onChange={e => setBillingSame(e.target.checked)} />
                  <span>Billing address is the same as delivery</span>
                </label>

                {!billingSame && (
                  <div className="lum-addr-list" style={{ marginTop: 12 }}>
                    {state.addresses.map(address => (
                      <label key={`bill-${address.id}`}
                        className={`lum-addr${billingId === address.id ? ' is-on' : ''}`}>
                        <input type="radio" name="billing" checked={billingId === address.id}
                          onChange={() => setBillingId(address.id)} />
                        <div className="lum-addr-body">
                          <div className="lum-addr-head"><strong>{address.name}</strong></div>
                          <div className="lum-addr-lines">
                            {[address.line1, address.city, address.postcode].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* ── Payment ──────────────────────────────────────────────── */}
          <section className="lum-panel">
            <h2 className="lum-panel-title"><CreditCard size={17} /> Payment method</h2>
            <div className="lum-pay-list">
              {PAYMENTS.map(option => (
                <label key={option.id} className={`lum-pay${payment === option.id ? ' is-on' : ''}`}>
                  <input type="radio" name="payment" checked={payment === option.id}
                    onChange={() => setPayment(option.id)} />
                  <option.icon size={18} />
                  <div className="lum-pay-body">
                    <div className="lum-pay-label">{option.label}</div>
                    <div className="lum-pay-note">{option.note}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* ── Promo code ───────────────────────────────────────────── */}
          <section className="lum-panel">
            <h2 className="lum-panel-title"><Tag size={17} /> Promo code</h2>
            {coupon ? (
              <div className="lum-coupon-on">
                <div>
                  <strong>{coupon.code}</strong> — {coupon.label}
                  <div className="lum-addr-lines">−{formatPrice(view.discount)} applied</div>
                </div>
                <button type="button" className="lum-cta-ghost"
                  onClick={() => { setCoupon(null); setCouponError(''); }}>Remove</button>
              </div>
            ) : (
              <>
                <div className="lum-coupon-row">
                  <input value={couponInput} placeholder="Enter code"
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void applyCoupon(); } }} />
                  <button type="button" className="lum-cta-gold" disabled={!couponInput.trim()}
                    onClick={applyCoupon}>Apply</button>
                </div>
                {couponError && <em className="lum-field-error">{couponError}</em>}
              </>
            )}
          </section>

          {/* ── Notes ────────────────────────────────────────────────── */}
          <section className="lum-panel">
            <h2 className="lum-panel-title"><Gift size={17} /> Order notes</h2>
            <label className="lum-field">
              <span>Gift message (optional)</span>
              <textarea rows={2} maxLength={300} value={gift} onChange={e => setGift(e.target.value)}
                placeholder="Hand-written on a card and enclosed with the piece" />
            </label>
            <label className="lum-field">
              <span>Special instructions (optional)</span>
              <textarea rows={2} maxLength={500} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Delivery timing, engraving notes, anything else" />
            </label>
          </section>
        </div>

        {/* ── Summary (sticky) ───────────────────────────────────────── */}
        <aside className="lum-summary">
          <h2 className="lum-cart-summary-title">Order summary</h2>

          <div className="lum-sum-lines">
            {lines.map(line => (
              <div key={line.variantSku + (line.sizeLabel ?? '')} className="lum-sum-line">
                <div className="lum-sum-thumb lum-img-ph">
                  {line.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.image} alt="" />
                  )}
                  <span className="lum-sum-qty">{line.qty}</span>
                </div>
                <div className="lum-sum-body">
                  <div className="lum-sum-name">{line.name}</div>
                  <LineSpec line={line} />
                  {line.engraving && <div className="lum-sum-spec">“{line.engraving}”</div>}
                  {!line.inStock && (
                    <div className="lum-field-error">
                      {line.stock === 0 ? 'Sold out' : `Only ${line.stock} left`}
                    </div>
                  )}
                </div>
                <div className="lum-sum-price">{formatPrice(line.lineTotal)}</div>
              </div>
            ))}
          </div>

          <div className="lum-cart-line"><span>Subtotal</span><span>{formatPrice(view.subtotal)}</span></div>
          {view.makingCharge > 0 && (
            <div className="lum-cart-line lum-cart-line--sub">
              <span>Making charge (included)</span><span>{formatPrice(view.makingCharge)}</span>
            </div>
          )}
          {view.stoneCharge > 0 && (
            <div className="lum-cart-line lum-cart-line--sub">
              <span>Stone charge (included)</span><span>{formatPrice(view.stoneCharge)}</span>
            </div>
          )}
          {view.discount > 0 && (
            <div className="lum-cart-line lum-cart-line--save">
              <span>Discount{coupon ? ` (${coupon.code})` : ''}</span><span>−{formatPrice(view.discount)}</span>
            </div>
          )}
          <div className="lum-cart-line"><span>VAT ({view.taxRate}%)</span><span>{formatPrice(view.tax)}</span></div>
          <div className="lum-cart-line">
            <span>Shipping</span>
            <span>{view.shipping === 0 ? 'Free' : formatPrice(view.shipping)}</span>
          </div>
          <div className="lum-cart-line lum-cart-total">
            <span>Total</span><span>{formatPrice(view.grandTotal)}</span>
          </div>

          <button className="lum-cta-gold lum-place" onClick={place}
            disabled={busy || lines.some(l => !l.inStock)}>
            {busy ? 'Placing your order…' : `Place order — ${formatPrice(view.grandTotal)}`}
          </button>
          <p className="lum-pdp-note">
            {!addressId ? 'Add a delivery address to continue.'
              : !payment ? 'Choose a payment method to continue.'
              : 'By placing your order you agree to our terms.'}
          </p>
        </aside>
      </div>

      <AddressDialog
        open={dialog.open}
        address={dialog.address}
        // A guest has no account yet — saving this address is what opens one.
        askEmail={!state.signedIn && !dialog.address}
        onClose={() => setDialog({ open: false, address: null })}
        onSaved={id => {
          setDialog({ open: false, address: null });
          setAddressId(id);
          void refresh();
        }}
      />
    </div>
  );
}
