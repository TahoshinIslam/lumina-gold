'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/features/catalog/components/ProductCard';
import Breadcrumbs from '@/features/catalog/components/Breadcrumbs';
import { productCrumbs } from '@/features/catalog/breadcrumbs';
import { firstImage } from '@/features/catalog/image';
import { Product, formatPrice, productBadge } from '@/types/product';
import { useStore } from '@/stores/StoreContext';

/**
 * ProductDetail — premium product page (IA spec Step 10).
 *
 * Includes: gallery, purity selector, ring-size / chain-length selectors,
 * engraving, price breakdown (metal / stone / making / VAT), diamond
 * specification + certificate, availability & delivery estimate,
 * wishlist/share, care + lifetime-service accordions, related products.
 */

/**
 * Illustrative metal-rate table — used only to *split* a real, admin-priced
 * variant's total into a cosmetic metal/stone/making/VAT breakdown. It never
 * computes the price itself: price, stock, SKU and weight all come straight
 * from the selected `ProductVariant` row (real data, set on the Add Product
 * page), not a formula.
 */
const METAL_RATE: Record<string, number> = { '24K': 11800, '22K': 10900, '21K': 10400, '18K': 8900, '14K': 7000 };
const rateOf = (purity?: string | null) => METAL_RATE[purity ?? ''] ?? 9500;

/** Illustrative price breakdown for the current price/weight/purity. */
function breakdown(product: Product, price: number, weight: number, purity: string | null) {
  const metal = Math.round(weight * rateOf(purity ?? product.purity));
  const stone = product.diamond ? Math.round(price * 0.42) : 0;
  const base = metal + stone;
  const making = Math.round(base * 0.12);
  const vat = Math.round(price * 0.05 / 1.05);
  const spread = price - metal - stone - making - vat;
  return [
    { label: `Metal (${weight} g${purity ? ` · ${purity}` : ''})`, value: metal },
    ...(stone ? [{ label: `Diamond (${product.diamond!.caratWeight} ct)`, value: stone }] : []),
    { label: 'Making charges', value: making + Math.max(0, spread) },
    { label: 'VAT (5%)', value: vat },
  ];
}

export default function ProductDetail({
  product,
  related = [],
}: {
  product: Product;
  related?: Product[];
}) {
  const { wished, toggleWish, addToCart, pushRecent, recent } = useStore();

  // Real, admin-priced variants (Metal Purity × Ring Size/Chain Length, or
  // just the one row for a single-price product). `attributes` is generic —
  // whichever size axis code the variants actually carry drives the second
  // selector, so this works for rings, chains, necklaces or nothing at all.
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 1;
  const purityValues = [...new Set(variants.map(vr => vr.purity).filter((p): p is NonNullable<typeof p> => !!p))];
  const firstAttr = variants.flatMap(vr => vr.attributes)[0];
  const sizeCode = firstAttr?.code ?? null;
  const sizeLabel = firstAttr?.label ?? 'Size';
  const sizeValues = sizeCode
    ? [...new Set(variants.flatMap(vr => vr.attributes).filter(a => a.code === sizeCode).map(a => a.value))]
    : [];
  const requiresPurity = hasVariants && purityValues.length > 0;
  const requiresSize = hasVariants && sizeValues.length > 0;
  const choosesPurity = hasVariants && purityValues.length > 1;
  const choosesSize = hasVariants && sizeValues.length > 1;

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(sizeValues.length === 1 ? (sizeValues[0] ?? null) : null);
  const [purity, setPurity] = useState<string | null>(purityValues.length === 1 ? (purityValues[0] ?? null) : (product.purity ?? null));
  const [engraving, setEngraving] = useState('');
  const [shared, setShared] = useState(false);
  const [added, setAdded] = useState(false);
  const [needSelection, setNeedSelection] = useState(false);

  const [certUrl, setCertUrl] = useState<string | null>(null);

  const selectedVariant = hasVariants
    ? variants.find(vr =>
        (!requiresPurity || vr.purity === purity) &&
        (!requiresSize || vr.attributes.some(a => a.code === sizeCode && a.value === size)),
      )
    : variants[0];

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompare = selectedVariant?.comparePrice;
  const displayWeight = selectedVariant?.weightGrams ?? product.weightGrams;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const displaySku = selectedVariant?.sku ?? product.sku;
  const canOrder = !!selectedVariant && selectedVariant.status === 'active'
    && (displayStock > 0 || product.availability === 'Made To Order');

  /** The shopper simply hasn't picked yet — not the same as "can't be bought". */
  const awaitingChoice = (requiresPurity && !purity) || (requiresSize && !size);

  const rows = breakdown(product, displayPrice, displayWeight, purity);

  // Record this product as recently viewed (once on mount).
  useEffect(() => { pushRecent(product.sku); }, [product.sku, pushRecent]);

  // Certificate of Authenticity: shown only if the admin has uploaded a PDF
  // to the product's folder (convention: /uploads/products/<SKU>/certificate.pdf).
  useEffect(() => {
    let cancelled = false;
    const url = `/uploads/products/${product.sku}/certificate.pdf`;
    fetch(url, { method: 'HEAD' })
      .then(res => { if (!cancelled && res.ok) setCertUrl(url); })
      .catch(() => { /* no certificate on file */ });
    return () => { cancelled = true; };
  }, [product.sku]);

  // Recently viewed SKUs are tracked client-side (localStorage), so they're
  // resolved to live product data via a lookup API rather than a mock array.
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  useEffect(() => {
    const skus = recent.filter(sku => sku !== product.sku).slice(0, 4);
    if (skus.length === 0) { setRecentlyViewed([]); return; }
    let cancelled = false;
    fetch(`/api/products/lookup?skus=${skus.map(encodeURIComponent).join(',')}`)
      .then(res => res.json())
      .then((data: { products: Product[] }) => { if (!cancelled) setRecentlyViewed(data.products); })
      .catch(() => { /* lookup failed — recently viewed just stays empty */ });
    return () => { cancelled = true; };
  }, [recent, product.sku]);

  const addToBag = () => {
    if ((requiresPurity && !purity) || (requiresSize && !size)) { setNeedSelection(true); return; }
    addToCart({
      sku: product.sku,
      name: product.name,
      price: displayPrice,
      image: firstImage(product),
      size: size ?? undefined,
      purity: purity ?? undefined,
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
      {/* Home / Diamond / Diamond Ring / <name> — see features/catalog/breadcrumbs.ts */}
      <Breadcrumbs items={productCrumbs(product)} />

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
            <img src={product.images[activeImage] || firstImage(product)} alt={product.name} />
            {/* New-arrival badge takes the diamond shimmer on a diamond piece,
                so it reads the same as the grid card instead of gold. */}
            {product.isNew && (
              <div className={`lum-pcard-badge${
                productBadge(product) === 'diamond' ? ' lum-pcard-badge--diamond' : ''}`}>
                New
              </div>
            )}
            <span className="lum-pdp-zoomhint">Hover to zoom</span>
          </div>
          <div className="lum-pdp-thumbs">
            {(product.images.length ? product.images : [firstImage(product)]).map((src, index) => (
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
          <div className="lum-pdp-sku">SKU {displaySku}</div>
          <div className="lum-pdp-price">
            {displayCompare && displayCompare > displayPrice && (
              <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: 10, fontSize: '0.7em' }}>
                {formatPrice(displayCompare)}
              </span>
            )}
            {formatPrice(displayPrice)}
          </div>
          <div className="lum-pdp-varinfo">
            <span>Weight <strong>{displayWeight} g</strong></span>
            {purity && <span>Purity <strong>{purity}</strong></span>}
            {requiresSize && (
              <span>{sizeLabel} <strong>{size ?? '—'}</strong></span>
            )}
            {hasVariants && (
              <span className="lum-pdp-varnote">price shown is for the selected combination</span>
            )}
          </div>
          <p className="lum-pdp-desc">{product.description}</p>

          {/* Purity selector — only shown when this product has more than one real, priced purity variant */}
          {choosesPurity && (
            <div className="lum-pdp-field">
              <div className="lum-pdp-field-label">Metal Purity</div>
              <div className="lum-pdp-choices">
                {purityValues.map(pk => (
                  <button
                    key={pk}
                    type="button"
                    className={`lum-choice${pk === purity ? ' is-active' : ''}`}
                    onClick={() => setPurity(pk)}
                  >
                    {pk}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / length selector — options come from this product's real
              variants (Add Product page), not a store-wide default list. */}
          {choosesSize && (
            <div className="lum-pdp-field">
              <div className="lum-pdp-field-label">{sizeLabel}</div>
              <div className="lum-pdp-choices">
                {sizeValues.map(option => (
                  <button
                    key={option}
                    className={`lum-choice${size === option ? ' is-active' : ''}`}
                    onClick={() => { setSize(option); setNeedSelection(false); }}
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
            <span className={`lum-avail-dot${canOrder ? ' is-in' : ''}`} />
            {selectedVariant ? (canOrder ? product.availability : 'Out of Stock') : product.availability}
            <span className="lum-pdp-delivery">
              {product.availability === 'Made To Order'
                ? 'Estimated delivery: 4–6 weeks'
                : product.availability === 'Ready to Ship'
                  ? 'Ships within 24 hours'
                  : 'Estimated delivery: 3–5 days'}
            </span>
          </div>

          {needSelection && (requiresPurity && !purity) && (
            <div className="lum-pdp-warn">Please choose a Metal Purity first.</div>
          )}
          {needSelection && !(requiresPurity && !purity) && (requiresSize && !size) && (
            <div className="lum-pdp-warn">Please choose a {sizeLabel} first.</div>
          )}
          {hasVariants && purity && (!requiresSize || size) && !selectedVariant && (
            <div className="lum-pdp-warn">This combination isn&apos;t available — try a different {sizeLabel.toLowerCase()} or purity.</div>
          )}

          {/* Actions */}
          <div className="lum-pdp-actions">
            {/* A missing CHOICE must not disable the button. Disabling it here is
                what made the page look broken: a ring with sizes opened with Add
                to Bag greyed out, nothing said why, and the "choose a size" prompt
                below could never fire — you cannot click a disabled button. So the
                button is only disabled when the piece genuinely cannot be bought
                (no stock, inactive variant); an unmade choice lets the click
                through and surfaces the prompt. */}
            <button
              className="lum-cta-gold"
              style={{ justifyContent: 'center' }}
              onClick={addToBag}
              disabled={hasVariants
                ? !awaitingChoice && !canOrder
                : product.availability === 'Made To Order' ? false : product.stock === 0}
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
                  <td>{formatPrice(displayPrice)}</td>
                </tr>
              </tbody>
            </table>
            <div className="lum-pdp-note">EMI available from ৳{new Intl.NumberFormat('en-IN').format(Math.round(displayPrice / 12))}/month over 12 months.</div>
          </details>

          {/* Specifications */}
          <details className="lum-pdp-acc">
            <summary>Specifications</summary>
            <table className="lum-breakdown">
              <tbody>
                {/* "Body" on a gemstone piece — the metal is the setting, not
                    what the piece is sold as. See metalLabel(). */}
                <tr>
                  <td>{product.gemstones?.length ? 'Body' : 'Material'}</td>
                  <td>{product.goldColor ?? product.material}</td>
                </tr>
                {purity && <tr><td>Purity</td><td>{purity}</td></tr>}
                {/* Measured dimensions — informational, never a size you pick. */}
                {product.specifications?.map(spec => (
                  <tr key={spec.label}><td>{spec.label}</td><td>{spec.value}</td></tr>
                ))}
                {product.goldColor && <tr><td>Metal Color</td><td>{product.goldColor}</td></tr>}
                <tr><td>Weight</td><td>{displayWeight} g</td></tr>
                {requiresSize && size && <tr><td>{sizeLabel}</td><td>{size}</td></tr>}
                {selectedVariant?.sku && <tr><td>Variant SKU</td><td>{selectedVariant.sku}</td></tr>}
                <tr><td>Recipient</td><td>{product.gender}</td></tr>
                {product.style && <tr><td>Style</td><td>{product.style}</td></tr>}
                <tr><td>Occasions</td><td>{product.occasions.join(', ')}</td></tr>
                {product.diamond && (
                  <>
                    <tr><td>Diamond</td><td>{product.diamond.caratWeight} ct {product.diamond.shape}</td></tr>
                    {(product.diamond.color || product.diamond.clarity) && (
                      <tr><td>Color / Clarity</td><td>{[product.diamond.color, product.diamond.clarity].filter(Boolean).join(' / ')}</td></tr>
                    )}
                    {product.diamond.cut && <tr><td>Cut</td><td>{product.diamond.cut}</td></tr>}
                    {!!product.diamond.quantity && product.diamond.quantity > 1 && (
                      <tr><td>Number of Stones</td><td>{product.diamond.quantity}</td></tr>
                    )}
                    {product.diamond.caratTotal != null && (
                      <tr><td>Total Diamond Weight</td><td>{product.diamond.caratTotal} ct (CTW)</td></tr>
                    )}
                    <tr><td>Origin</td><td>{product.diamond.origin}</td></tr>
                    {product.diamond.certification && (
                      <tr>
                        <td>Certificate</td>
                        <td>
                          <span className="lum-cert">
                            {product.diamond.certification} Certified
                            {product.diamond.certificateNumber ? ` · ${product.diamond.certificateNumber}` : ''} ↗
                          </span>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </details>

          {/* Care + service */}
          <details className="lum-pdp-acc">
            <summary>Care Instructions</summary>
            <p className="lum-pdp-note">
              Store separately in the Nahar Jewellers pouch. Clean with a soft brush and lukewarm
              soapy water; avoid perfume and chlorine. Complimentary professional cleaning
              at any boutique, always.
            </p>
          </details>
          <details className="lum-pdp-acc">
            <summary>Lifetime Service</summary>
            <p className="lum-pdp-note">
              Every Nahar Jewellers creation carries a lifetime craftsmanship guarantee: free
              resizing within the first year, annual inspection, and re-polishing for life.
            </p>
          </details>

          {/* Certificate of Authenticity — shown only if a PDF is on file */}
          <details className="lum-pdp-acc">
            <summary>Certificate of Authenticity</summary>
            {certUrl ? (
              <>
                <p className="lum-pdp-note">
                  This piece is accompanied by an official Certificate of Authenticity
                  {product.diamond ? ` and ${product.diamond.certification} diamond grading` : ''}.
                </p>
                <object data={certUrl} type="application/pdf" className="lum-cert-embed" aria-label="Certificate of Authenticity">
                  <p className="lum-pdp-note">Your browser can&apos;t preview PDFs here.</p>
                </object>
                <a href={certUrl} target="_blank" rel="noopener noreferrer" className="lum-cta-ghost" style={{ marginTop: 12 }}>
                  View / Download Certificate (PDF) ↗
                </a>
              </>
            ) : (
              <p className="lum-pdp-note">
                A hallmarked Certificate of Authenticity is issued with every piece and
                handed over at confirmation. Request a preview from your concierge below.
              </p>
            )}
          </details>

        </div>
      </div>

      {/* Still confused to buy — full-width concierge band, above related */}
      <section className="lum-pdp-contact">
        <div className="lum-eyebrow lum-eyebrow--center" style={{ justifyContent: 'center', marginBottom: 14 }}>
          <span className="lum-rule lum-rule--l" style={{ width: 44 }} />
          <span className="lum-eyebrow-label">Client Care</span>
          <span className="lum-rule lum-rule--r" style={{ width: 44 }} />
        </div>
        <h2 className="lum-pdp-contact-title">Still Confused To Buy?</h2>
        <p className="lum-pdp-contact-text">
          Just one more step to reach us! Send a text or call us for details of this
          piece or any queries.
        </p>
        <div className="lum-pdp-contact-actions">
          <a className="lum-contact-btn" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M14 9h3V6h-3c-1.9 0-3 1.5-3 3.3V11H8v3h3v7h3v-7h2.5l.5-3H14V9.6c0-.4.3-.6.7-.6H14Z"/></svg>
            Facebook
          </a>
          <a className="lum-contact-btn" href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.7 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3Z"/></svg>
            Chat on WhatsApp
          </a>
          <a className="lum-contact-btn" href="tel:+8801712345678">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 18v-4l-5-2"/></svg>
            Talk to our Experts
          </a>
        </div>
      </section>

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

      {/* Recently viewed — after related */}
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
    </div>
  );
}
