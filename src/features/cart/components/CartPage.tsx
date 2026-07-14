'use client';

import Link from 'next/link';
import { useStore, cartLineKey } from '@/stores/StoreContext';
import { useProductsBySkus } from '@/features/catalog/useProductsBySkus';
import { formatPrice } from '@/types/product';

export default function CartPage() {
  const { cart, cartSubtotal, updateQty, removeFromCart } = useStore();
  const tax = Math.round(cartSubtotal * 0.05);
  const grand = cartSubtotal + tax;

  /* The bag line itself (name, price, image) is a snapshot taken when the piece
   * was added, and is shown as-is. The only thing missing from it is the slug —
   * the link back to the piece — which is resolved from the database here. It
   * came from the mock catalogue before, so a real piece in the bag had no link
   * at all and its name was dead text. */
  const bySku = new Map(
    useProductsBySkus([...new Set(cart.map(item => item.sku))]).products.map(p => [p.sku, p]),
  );

  if (cart.length === 0) {
    return (
      <div className="lum-cart">
        <h1 className="lum-h2 lum-listing-title">Your Bag</h1>
        <div className="lum-empty-results" style={{ marginTop: 30 }}>
          <div className="lum-breathe-diamond" style={{ width: 18, height: 18, margin: '0 auto 20px' }} />
          Your bag is empty.
          <div style={{ marginTop: 20 }}><Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">Your Bag</h1>
      <div className="lum-cart-grid">
        <div className="lum-cart-items">
          {cart.map(item => {
            const key = cartLineKey(item);
            const slug = bySku.get(item.sku)?.slug;
            return (
              <div key={key} className="lum-cart-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="lum-cart-thumb" />
                <div className="lum-cart-row-info">
                  {slug
                    ? <Link href={`/products/${slug}`} className="lum-cart-name">{item.name}</Link>
                    : <span className="lum-cart-name">{item.name}</span>}
                  <div className="lum-cart-meta">
                    {[item.purity, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' · ')}{item.engraving ? ` · “${item.engraving}”` : ''}
                  </div>
                  <div className="lum-drawer-qty">
                    <button aria-label="Decrease" onClick={() => updateQty(key, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button aria-label="Increase" onClick={() => updateQty(key, item.qty + 1)}>+</button>
                    <button className="lum-drawer-remove" onClick={() => removeFromCart(key)}>Remove</button>
                  </div>
                </div>
                <div className="lum-cart-price">{formatPrice(item.price * item.qty)}</div>
              </div>
            );
          })}
        </div>

        <aside className="lum-cart-summary">
          <h2 className="lum-cart-summary-title">Order Summary</h2>
          <div className="lum-cart-line"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
          <div className="lum-cart-line"><span>Est. VAT (5%)</span><span>{formatPrice(tax)}</span></div>
          <div className="lum-cart-line lum-cart-total"><span>Indicative total</span><span>{formatPrice(grand)}</span></div>
          <p className="lum-pdp-note" style={{ marginTop: 10 }}>Final price confirmed by your concierge.</p>
          <Link href="/checkout" className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%', marginTop: 14 }}>
            Reserve These Pieces
          </Link>
          <Link href="/shop" className="lum-drawer-viewbag" style={{ marginTop: 14 }}>Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
