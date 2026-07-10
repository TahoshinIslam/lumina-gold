import Link from 'next/link';

/**
 * ShopByCategory — circular category tiles directly under the hero.
 * Each circle is just a preset filter link into /shop (categories are
 * database filters, never folders).
 */
const CATEGORIES = [
  { label: 'Rings', type: 'Ring', img: '/uploads/home/GZdjz.jpg' },
  { label: 'Earrings', type: 'Earring', img: '/uploads/home/9v96v.jpg' },
  { label: 'Necklaces', type: 'Necklace', img: '/uploads/home/fSg1p.jpg' },
  { label: 'Bangles', type: 'Bangle', img: '/uploads/home/bvE3z.jpg' },
  { label: 'Bracelets', type: 'Bracelet', img: '/uploads/home/bvE3z.jpg' },
  { label: 'Chains', type: 'Chain', img: '/uploads/home/fSg1p.jpg' },
];

export default function ShopByCategory() {
  return (
    <section className="lum-cats" id="categories">
      <div className="lum-eyebrow lum-eyebrow--center" data-reveal="up">
        <div className="lum-rule lum-rule--l" />
        <div className="lum-eyebrow-label">The Boutique</div>
        <div className="lum-rule lum-rule--r" />
      </div>
      <h2 className="lum-h2 lum-cats-title" data-reveal="up">Shop by Category</h2>

      <div className="lum-cats-grid" data-reveal="stagger">
        {CATEGORIES.map(cat => (
          <Link key={cat.label} href={`/shop?type=${encodeURIComponent(cat.type)}`} className="lum-cat">
            <span className="lum-cat-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.img} alt={cat.label} />
            </span>
            <span className="lum-cat-label">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
