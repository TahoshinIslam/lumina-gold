'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRelatedProducts, getProductBySku } from './catalog';
import ProductCard from './ProductCard';
import { MetalPurity, Product, formatPrice } from './types';
import { useStore } from './StoreContext';

/**
 * ProductDetail — premium product page (IA spec Step 10).
 *
 * Includes: gallery, purity selector, ring-size / chain-length selectors,
 * engraving, price breakdown (metal / stone / making / VAT), diamond
 * specification + certificate, availability & delivery estimate,
 * wishlist/share, care + lifetime-service accordions, related products.
 */

const RING_SIZES = ['6', '8', '10', '12', '14', '16', '18', '20'];
const CHAIN_LENGTHS = ['16"', '18"', '20"', '22"', '24"'];
const PURITIES: MetalPurity[] = ['24K', '22K', '21K', '18K', '14K'];

/** Illustrative price breakdown: metal by weight, stone, 12% making, 5% VAT. */
function breakdown(product: Product) {
  const metalRate: Record<string, number> = { '24K': 11800, '22K': 10900, '21K': 10400, '18K': 8900, '14K': 7000 };
  const metal = Math.round(product.weightGrams * (metalRate[product.purity ?? '18K'] ?? 9500));
  const stone = product.diamond ? Math.round(product.price * 0.42) : 0;
  const base = metal + stone;
  const making = Math.round(base * 0.12);
  const vat = Math.round(product.price * 0.05 / 1.05);
  const spread = product.price - metal - stone - making - vat;
  return [
    { label: `Metal (${product.weightGrams} g)`, value: metal },
    ...(stone ? [{ label: `Diamond (${product.diamond!.caratWeight} ct)`, value: stone }] : []),
    { label: 'Making charges', value: making + Math.max(0, spread) },
    { label: 'VAT (5%)', value: vat },
  ];
}

export default function ProductDetail({ product }: { product: Product }) {
  const { wished, toggleWish, addToCart, pushRecent, recent } = useStore();
  const related = getRelatedProducts(product);

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [engraving, setEngraving] = useState('');
  const [shared, setShared] = useState(false);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);

  const isRing = product.type === 'Ring';
  const hasLength = product.type === 'Chain' || product.type === 'Necklace';
  const requiresSize = isRing || hasLength;
  const rows = breakdown(product);

  // Record this product as recently viewed (once on mount).
  useEffect(() => { pushRecent(product.sku); }, [product.sku, pushRecent]);

  const recentlyViewed = recent
    .filter(sku => sku !== product.sku)
    .map(getProductBySku)
    .filter((p): p is Product => !!p)
    .slice(0, 4);

  const addToBag = () => {
    if (requiresSize && !size) { setNeedSize(true); return; }
    addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: size ?? undefined,
      engraving: engraving.trim() || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="lum-pdp">
      {/* Breadcrumb */}
      <nav className="lum-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{' '}
        <Link href={`/shop?material=${product.material}`}>{product.material}</Link> /{' '}
        <Link href={`/shop?material=${product.material}&type=${encodeURIComponent(product.type)}`}>
          {product.type}s
        </Link>{' '}
        / <span>{product.name}</span>
      </nav>

      <div className="lum-pdp-grid">
        {/* ── Gallery ─────────────────────────────────────────────────── */}
        <div className="lum-pdp-gallery">
          <div
            className="lum-pdp-main lum-img-ph lum-pdp-zoomable"
            onMouseMove={e => {
              const r = e.currentTarget.getBoundingClientRect();
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transformOrigin =
                `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
            }}
            onMouseLeave={e => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transformOrigin = 'center center';
            }}
          >
            <img src={product.images[activeImage]} alt={product.name} />
            {product.isNew && <div className="lum-pcard-badge">New</div>}
            <span className="lum-pdp-zoomhint">Hover to zoom</span>
          </div>
          <div className="lum-pdp-thumbs">
            {product.images.map((src, index) => (
              <button
                key={index}
                className={`lum-pdp-thumb lum-img-ph${index === activeImage ? ' is-active' : ''}`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info column ─────────────────────────────────────────────── */}
        <div className="lum-pdp-info">
          <div className="lum-eyebrow-label">{product.collection} Collection</div>
          <h1 className="lum-pdp-name">{product.name}</h1>
          <div className="lum-pdp-sku">SKU {product.sku}</div>
          <div className="lum-pdp-price">{formatPrice(product.price)}</div>
          <p className="lum-pdp-desc">{product.description}</p>

          {/* Purity selector (metal pieces only) */}
          {product.purity && (
            <div className="lum-pdp-field">
              <div className="lum-pdp-field-label">Metal Purity</div>
              <div className="lum-pdp-choices">
                {PURITIES.map(purity => (
                  <span
                    key={purity}
                    className={`lum-choice${purity === product.purity ? ' is-active' : ' is-disabled'}`}
                    title={purity === product.purity ? undefined : 'Available made-to-order'}
                  >
                    {purity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size / length selectors */}
          {isRing && (
            <div className="lum-pdp-field">
              <div className="lum-pdp-field-label">Ring Size</div>
              <div className="lum-pdp-choices">
                {RING_SIZES.map(option => (
                  <button
                    key={option}
                    className={`lum-choice${size === option ? ' is-active' : ''}`}
                    onClick={() => { setSize(option); setNeedSize(false); }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          {hasLength && (
            <div className="lum-pdp-field">
              <div className="lum-pdp-field-label">Length</div>
              <div className="lum-pdp-choices">
                {CHAIN_LENGTHS.map(option => (
                  <button
                    key={option}
                    className={`lum-choice${size === option ? ' is-active' : ''}`}
                    onClick={() => { setSize(option); setNeedSize(false); }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engraving */}
          <div className="lum-pdp-field">
            <div className="lum-pdp-field-label">Engraving <span>(optional, 20 characters)</span></div>
            <input
              className="lum-engraving"
              type="text"
              maxLength={20}
              placeholder="Your message…"
              value={engraving}
              onChange={e => setEngraving(e.target.value)}
            />
          </div>

          {/* Availability + delivery */}
          <div className="lum-pdp-avail">
            <span className={`lum-avail-dot${product.availability === 'In Stock' ? ' is-in' : ''}`} />
            {product.availability}
            <span className="lum-pdp-delivery">
              {product.availability === 'Made To Order'
                ? 'Estimated delivery: 4–6 weeks'
                : product.availability === 'Ready to Ship'
                  ? 'Ships within 24 hours'
                  : 'Estimated delivery: 3–5 days'}
            </span>
          </div>

          {needSize && (
            <div className="lum-pdp-warn">Please choose a {isRing ? 'ring size' : 'length'} first.</div>
          )}

          {/* Actions */}
          <div className="lum-pdp-actions">
            <button
              className="lum-cta-gold"
              style={{ justifyContent: 'center' }}
              onClick={addToBag}
              disabled={product.availability === 'Made To Order' ? false : product.stock === 0}
            >
              {added ? '✓ Added to Bag' : product.availability === 'Made To Order' ? 'Add to Bag · Made to Order' : 'Add to Bag'}
            </button>
            <button
              className="lum-cta-ghost"
              onClick={() => toggleWish(product.sku)}
              aria-pressed={!!wished[product.sku]}
            >
              {wished[product.sku] ? '♥ Saved' : '♡ Wishlist'}
            </button>
            <button className="lum-cta-ghost" onClick={share}>
              {shared ? 'Link copied' : 'Share'}
            </button>
          </div>

          {/* Price breakdown */}
          <details className="lum-pdp-acc" open>
            <summary>Price Breakdown</summary>
            <table className="lum-breakdown">
              <tbody>
                {rows.map(row => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{formatPrice(row.value)}</td>
                  </tr>
                ))}
                <tr className="lum-breakdown-total">
                  <td>Total</td>
                  <td>{formatPrice(product.price)}</td>
                </tr>
              </tbody>
            </table>
            <div className="lum-pdp-note">EMI available from ৳{new Intl.NumberFormat('en-IN').format(Math.round(product.price / 12))}/month over 12 months.</div>
          </details>

          {/* Specifications */}
          <details className="lum-pdp-acc">
            <summary>Specifications</summary>
            <table className="lum-breakdown">
              <tbody>
                <tr><td>Material</td><td>{product.material}</td></tr>
                {product.purity && <tr><td>Purity</td><td>{product.purity}</td></tr>}
                {product.goldColor && <tr><td>Metal Color</td><td>{product.goldColor}</td></tr>}
                <tr><td>Metal Weight</td><td>{product.weightGrams} g</td></tr>
                <tr><td>Recipient</td><td>{product.gender}</td></tr>
                {product.style && <tr><td>Style</td><td>{product.style}</td></tr>}
                <tr><td>Occasions</td><td>{product.occasions.join(', ')}</td></tr>
                {product.diamond && (
                  <>
                    <tr><td>Diamond</td><td>{product.diamond.caratWeight} ct {product.diamond.shape}</td></tr>
                    <tr><td>Color / Clarity</td><td>{product.diamond.color} / {product.diamond.clarity}</td></tr>
                    <tr><td>Origin</td><td>{product.diamond.origin}</td></tr>
                    <tr>
                      <td>Certificate</td>
                      <td><span className="lum-cert">{product.diamond.certification} Certified ↗</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </details>

          {/* Care + service */}
          <details className="lum-pdp-acc">
            <summary>Care Instructions</summary>
            <p className="lum-pdp-note">
              Store separately in the LUMINA pouch. Clean with a soft brush and lukewarm
              soapy water; avoid perfume and chlorine. Complimentary professional cleaning
              at any boutique, always.
            </p>
          </details>
          <details className="lum-pdp-acc">
            <summary>Lifetime Service</summary>
            <p className="lum-pdp-note">
              Every LUMINA creation carries a lifetime craftsmanship guarantee: free
              resizing within the first year, annual inspection, and re-polishing for life.
            </p>
          </details>
        </div>
      </div>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="lum-pdp-related">
          <h2 className="lum-h2" style={{ fontSize: 'clamp(24px, 3vw, 40px)', textAlign: 'center', marginBottom: 44 }}>
            Recently Viewed
          </h2>
          <div className="lum-results-grid">
            {recentlyViewed.map(other => (
              <ProductCard
                key={other.sku}
                product={other}
                wished={!!wished[other.sku]}
                onToggleWish={toggleWish}
              />
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="lum-pdp-related">
          <h2 className="lum-h2" style={{ fontSize: 'clamp(24px, 3vw, 40px)', textAlign: 'center', marginBottom: 44 }}>
            You May Also Admire
          </h2>
          <div className="lum-results-grid">
            {related.map(other => (
              <ProductCard
                key={other.sku}
                product={other}
                wished={!!wished[other.sku]}
                onToggleWish={toggleWish}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
