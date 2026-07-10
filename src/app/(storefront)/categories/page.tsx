import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CATEGORY_SLUGS, pluralType } from '@/features/catalog/taxonomy';

export const metadata: Metadata = {
  title: 'Shop by Category — LUMINA',
  description: 'Browse haute joaillerie by category — rings, necklaces, earrings, bracelets and more.',
};

/** /categories — the "browse by jewellery type" hub. */
export default function CategoriesIndex() {
  const categories = Object.entries(CATEGORY_SLUGS);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>The Boutique</div>
              <h1 className="lum-h2 lum-listing-title">Shop by Category</h1>
              <div className="lum-listing-count">Choose a jewellery type</div>
            </div>
          </div>

          <div className="lum-browse-section">Categories</div>
          <div className="lum-browse-grid">
            {categories.map(([slug, type]) => (
              <Link key={slug} href={`/categories/${slug}`} className="lum-browse-tile">
                <div className="lum-browse-tile-name">{pluralType(type)}</div>
                <div className="lum-browse-tile-cta">Explore {pluralType(type)} →</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
