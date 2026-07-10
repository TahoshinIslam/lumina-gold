'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATALOG } from '../shop/catalog';
import { Product } from '../shop/types';
import { useWishlist } from '../shop/useWishlist';

/**
 * BestSellers — "Luxury Jewellery" tabbed showcase (reference: centered
 * title with NEW ARRIVED / FEATURED / ON A SALE tab bar). Tabs filter the
 * live catalog; cards link to their product pages and share the storefront
 * wishlist (localStorage).
 */
const TABS = [
  { key: 'new', label: 'New Arrivals', pick: (p: Product) => !!p.isNew },
  { key: 'best', label: 'Best Sellers', pick: (p: Product) => !!p.featured },
  { key: 'ready', label: 'Ready to Ship', pick: (p: Product) => p.availability === 'Ready to Ship' },
] as const;

const bdt = (n: number) => `৳ ${n.toLocaleString('en-IN')}`;

export default function BestSellers() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('new');
  const { wished, toggleWish } = useWishlist();

  const active = TABS.find(t => t.key === tab)!;
  const products = CATALOG.filter(active.pick).slice(0, 8);

  return (
    <section id="bestsellers" className="lum-shop">
      <div className="lum-shop-inner">
        {/* Section header */}
        <div className="lum-shop-head" data-reveal="scale">
          <div className="lum-breathe-diamond" style={{ width: 22, height: 22 }} />
          <h2 className="lum-h2">Luxury Jewellery</h2>
          <div className="lum-shop-tag">New arrivals &amp; the pieces our collectors return for</div>
        </div>

        {/* Tab bar */}
        <div className="lum-tabs" role="tablist" aria-label="Product showcase tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`lum-tab${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Product cards */}
        <div className="lum-prod-grid" key={tab}>
          {products.map(product => (
            <div key={product.sku} className="lum-prod-card lum-pcard" data-spothost="">
              <div className="lum-spot" data-spot="" />
              {product.isNew && <div className="lum-pcard-badge">New</div>}

              <button
                className="lum-wish"
                aria-label={`Add ${product.name} to wishlist`}
                aria-pressed={!!wished[product.sku]}
                onClick={e => { e.stopPropagation(); toggleWish(product.sku); }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill={wished[product.sku] ? '#C89B3C' : 'none'}
                  stroke="#A8863D" strokeWidth="1.5"
                  style={{ pointerEvents: 'none' }}
                >
                  <path d="M12 21C12 21 3 14.5 3 8.8C3 5.6 5.5 3.5 8 3.5C9.8 3.5 11.3 4.5 12 6C12.7 4.5 14.2 3.5 16 3.5C18.5 3.5 21 5.6 21 8.8C21 14.5 12 21 12 21Z" />
                </svg>
              </button>

              <Link href={`/products/${product.slug}`} className="lum-prod-link">
                <div className="lum-prod-media">
                  <div className="lum-prod-zoom lum-img-ph">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                </div>

                <div className="lum-prod-body">
                  <div className="lum-prod-meta">
                    {product.purity ? `${product.purity} · ` : ''}{product.material} · {product.type}
                  </div>
                  <div className="lum-prod-name">{product.name}</div>
                  <div className="lum-prod-price">{bdt(product.price)}</div>
                  <div className="lum-quickview">View Creation</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
