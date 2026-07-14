'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product, productBadge } from '@/types/product';
import { useWishlist } from '@/features/wishlist/useWishlist';
import { firstImage } from '@/features/catalog/image';
import { optimized } from '@/features/shared/optimized';

/**
 * ShowcaseSection — shared tab-bar + card-grid markup for the homepage's
 * material-scoped Gold and Diamond sections. Product arrays are pre-scoped
 * and pre-fetched server-side; this component only switches the visible tab.
 */
const TABS = [
  { key: 'new', label: 'New Arrivals' },
  { key: 'best', label: 'Best Sellers' },
  { key: 'featured', label: 'Featured' },
  { key: 'discount', label: 'Discounts' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export interface ShowcaseData {
  newArrivals: Product[];
  bestSellers: Product[];
  featured: Product[];
  discounts: Product[];
}

const bdt = (n: number) => `৳ ${n.toLocaleString('en-IN')}`;

export default function ShowcaseSection({
  id, heading, subtitle, data,
}: { id: string; heading: string; subtitle: string; data: ShowcaseData }) {
  const [tab, setTab] = useState<TabKey>('new');
  const { wished, toggleWish } = useWishlist();

  const productsByTab: Record<TabKey, Product[]> = {
    new: data.newArrivals,
    best: data.bestSellers,
    featured: data.featured,
    discount: data.discounts,
  };
  const products = productsByTab[tab];

  return (
    <section id={id} className="lum-shop">
      <div className="lum-shop-inner">
        {/* Section header */}
        <div className="lum-shop-head" data-reveal="scale">
          <div className="lum-breathe-diamond" style={{ width: 22, height: 22 }} />
          <h2 className="lum-h2">{heading}</h2>
          <div className="lum-shop-tag">{subtitle}</div>
        </div>

        {/* Tab bar */}
        <div className="lum-tabs" role="tablist" aria-label={`${heading} tabs`}>
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
        {products.length === 0 ? (
          <div className="lum-empty-results">
            <div className="lum-breathe-diamond" style={{ width: 18, height: 18, margin: '0 auto 20px' }} />
            No creations here yet — check back soon.
          </div>
        ) : (
          <div className="lum-prod-grid" key={tab}>
            {products.map(product => {
              const badge = productBadge(product);
              const glowClass = badge === 'gold' ? ' lum-pcard--gold-glow' : badge === 'diamond' ? ' lum-pcard--diamond-glow' : '';
              return (
                <div key={product.sku} className={`lum-prod-card lum-pcard${glowClass}`} data-spothost="">
                  <div className="lum-spot" data-spot="" />
                  {badge === 'diamond' && <div className="lum-pcard-badge lum-pcard-badge--diamond">Diamond</div>}
                  {(badge === 'gold' || badge === 'new') && <div className="lum-pcard-badge">New</div>}
                  {tab === 'discount' && !!product.discountPercent && (
                    <div className="lum-pcard-badge lum-pcard-badge--diamond">-{product.discountPercent}%</div>
                  )}

                  <button
                    className="lum-wish"
                    aria-label={`Add ${product.name} to wishlist`}
                    aria-pressed={!!wished[product.sku]}
                    onClick={e => { e.stopPropagation(); toggleWish(product.sku); }}
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill={wished[product.sku] ? '#DAA858' : 'none'}
                      stroke="#B08D4F" strokeWidth="1.5"
                      style={{ pointerEvents: 'none' }}
                    >
                      <path d="M12 21C12 21 3 14.5 3 8.8C3 5.6 5.5 3.5 8 3.5C9.8 3.5 11.3 4.5 12 6C12.7 4.5 14.2 3.5 16 3.5C18.5 3.5 21 5.6 21 8.8C21 14.5 12 21 12 21Z" />
                    </svg>
                  </button>

                  <Link href={`/products/${product.slug}`} className="lum-prod-link">
                    <div className="lum-prod-media">
                      <div className="lum-prod-zoom lum-img-ph">
                        {/* The showcase card paints at ~300px; the stored "large" rendition is
                            1200px. Optimizer resizes and re-encodes to AVIF/WebP. */}
                        <img src={optimized(firstImage(product), 828)} alt={product.name} />
                      </div>
                    </div>

                    <div className="lum-prod-body">
                      <div className="lum-prod-meta">
                        {product.purity ? `${product.purity} · ` : ''}{product.material} · {product.type}
                      </div>
                      <div className="lum-prod-name">{product.name}</div>
                      <div className="lum-prod-price">
                        {product.hasDiscount && product.discountPrice != null ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: 8, fontSize: '0.82em' }}>
                              {bdt(product.price)}
                            </span>
                            {bdt(product.discountPrice)}
                          </>
                        ) : product.variantCount && product.variantCount > 1 && product.priceFrom != null && product.priceFrom < product.price
                          ? `From ${bdt(product.priceFrom)}`
                          : bdt(product.price)}
                      </div>
                      <div className="lum-quickview">View Creation</div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
