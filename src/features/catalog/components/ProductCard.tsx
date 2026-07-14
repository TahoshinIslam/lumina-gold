'use client';

import Link from 'next/link';
import { Product, formatPrice, metalLabel, productBadge } from '@/types/product';
import { firstImage } from '@/features/catalog/image';
import ProductImage from '@/features/shared/ProductImage';
import { track } from '@/features/analytics/track';

/**
 * ProductCard — grid tile used on listing pages and "You may also like".
 * Wishlist state is lifted to the parent (persisted in localStorage there).
 */
export default function ProductCard({
  product,
  wished,
  onToggleWish,
}: {
  product: Product;
  wished: boolean;
  onToggleWish: (sku: string) => void;
}) {
  const badge = productBadge(product);
  const glowClass = badge === 'gold' ? ' lum-pcard--gold-glow' : badge === 'diamond' ? ' lum-pcard--diamond-glow' : '';

  return (
    <div className={`lum-prod-card lum-pcard${glowClass}`}>
      {badge === 'diamond' && <div className="lum-pcard-badge lum-pcard-badge--diamond">Diamond</div>}
      {(badge === 'gold' || badge === 'new') && <div className="lum-pcard-badge">New</div>}

      <button
        className="lum-wish"
        aria-label={`Add ${product.name} to wishlist`}
        aria-pressed={wished}
        onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleWish(product.sku); }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill={wished ? '#DAA858' : 'none'}
          stroke="#B08D4F" strokeWidth="1.5"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M12 21C12 21 3 14.5 3 8.8C3 5.6 5.5 3.5 8 3.5C9.8 3.5 11.3 4.5 12 6C12.7 4.5 14.2 3.5 16 3.5C18.5 3.5 21 5.6 21 8.8C21 14.5 12 21 12 21Z" />
        </svg>
      </button>

      {/* select_item — the click that takes a shopper from a listing into a
          product. It is what turns "impressions" into a real funnel step. */}
      <Link
        href={`/products/${product.slug}`}
        className="lum-pcard-link"
        onClick={() => track('select_item', { label: product.sku })}
      >
        <div className="lum-prod-media">
          <div className="lum-prod-zoom lum-img-ph">
            {/* Grid card: ~250–350px wide (auto-fit minmax(250px,1fr)), full-width
                on a phone. next/image builds the srcset; sizes tells it which
                rendition to pull per breakpoint so a phone never fetches the
                desktop width. */}
            <ProductImage
              src={firstImage(product)}
              alt={product.name}
              sizes="(max-width: 640px) 90vw, (max-width: 1080px) 45vw, 320px"
            />
          </div>
        </div>
        <div className="lum-prod-body">
          <div className="lum-pcard-meta">
            {[product.purity, metalLabel(product), product.type].filter(Boolean).join(' · ')}
          </div>
          <div className="lum-prod-name">{product.name}</div>
          <div className="lum-prod-price">
            {/* The grid never showed a markdown at all — a discounted piece looked
                full price here while the homepage advertised the saving. `price`
                is now what the till charges, and `comparePrice` the "was". */}
            {product.comparePrice != null ? (
              <>
                <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: 8, fontSize: '0.82em' }}>
                  {formatPrice(product.comparePrice)}
                </span>
                {formatPrice(product.price)}
              </>
            ) : product.variantCount && product.variantCount > 1 && product.priceFrom != null && product.priceFrom < product.price
              ? `From ${formatPrice(product.priceFrom)}`
              : formatPrice(product.price)}
          </div>
          {product.availability !== 'In Stock' && (
            <div className="lum-pcard-avail">{product.availability}</div>
          )}
        </div>
      </Link>
    </div>
  );
}
