import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import { CATEGORY_SLUGS, pluralType } from '@/components/shop/taxonomy';

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

          <div className="lum-results-grid" style={{ marginTop: 24 }}>
            {categories.map(([slug, type]) => (
              <Link key={slug} href={`/categories/${slug}`} className="lum-pcard-link">
                <div className="lum-pcard" style={{ padding: 28, textAlign: 'center' }}>
                  <div className="lum-prod-name" style={{ fontSize: 20 }}>{pluralType(type)}</div>
                  <div className="lum-prod-cat">Explore {pluralType(type)} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
