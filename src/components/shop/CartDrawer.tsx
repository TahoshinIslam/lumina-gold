'use client';

import Link from 'next/link';
import { useStore, cartLineKey } from './StoreContext';
import { formatPrice } from './types';

/** CartDrawer — slide-in bag panel, opened from the header cart icon. */
export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartSubtotal, cartCount, updateQty, removeFromCart } = useStore();

  return (
    <>
      <div className={`lum-drawer-scrim${open ? ' is-open' : ''}`} onClick={onClose} />
      <aside className={`lum-drawer${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label="Shopping bag">
        <div className="lum-drawer-head">
          <span>Your Bag ({cartCount})</span>
          <button className="lum-drawer-close" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="lum-drawer-empty">
            <div className="lum-breathe-diamond" style={{ width: 16, height: 16, margin: '0 auto 16px' }} />
            Your bag is empty.
            <Link href="/shop" className="lum-cta-ghost" style={{ marginTop: 20 }} onClick={onClose}>
              Explore the Boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="lum-drawer-items">
              {cart.map(item => {
                const key = cartLineKey(item);
                return (
                  <div key={key} className="lum-drawer-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} />
                    <div className="lum-drawer-item-info">
                      <div className="lum-drawer-item-name">{item.name}</div>
                      <div className="lum-drawer-item-meta">
                        {item.size ? `Size ${item.size}` : ''}{item.engraving ? ` · “${item.engraving}”` : ''}
                      </div>
                      <div className="lum-drawer-qty">
                        <button aria-label="Decrease" onClick={() => updateQty(key, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button aria-label="Increase" onClick={() => updateQty(key, item.qty + 1)}>+</button>
                        <button className="lum-drawer-remove" onClick={() => removeFromCart(key)}>Remove</button>
                      </div>
                    </div>
                    <div className="lum-drawer-item-price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                );
              })}
            </div>

            <div className="lum-drawer-foot">
              <div className="lum-drawer-subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(cartSubtotal)}</strong>
              </div>
              <div className="lum-drawer-note">Reserve to hold these pieces — a concierge confirms by phone.</div>
              <Link href="/checkout" className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%' }} onClick={onClose}>
                Reserve
              </Link>
              <Link href="/cart" className="lum-drawer-viewbag" onClick={onClose}>View full bag</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
