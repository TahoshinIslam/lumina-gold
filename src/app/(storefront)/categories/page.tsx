import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCategoryTiles } from '@/server/dal/home';

export const metadata: Metadata = {
  title: 'Shop by Category — Nahar Jewellers',
  description: 'Browse haute joaillerie by category — rings, necklaces, earrings, bracelets and more.',
};

// Reads the live categories table, so a category added or re-imaged in the
// admin shows up on the very next request.
export const dynamic = 'force-dynamic';

/** /categories — the "browse by jewellery type" hub. */
export default async function CategoriesIndex() {
  // The same rows the home page's circles read — one query, one behaviour.
  const categories = await getCategoryTiles();

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
            {categories.map(category => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`lum-browse-tile${category.image ? ' has-image' : ''}`}
              >
                {/* No image set in the admin → the tile keeps its gradient. */}
                {category.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="lum-browse-tile-img" src={category.image} alt="" loading="lazy" />
                )}
                <div className="lum-browse-tile-name">{category.name}</div>
                <div className="lum-browse-tile-cta">
                  {category.product_count} {category.product_count === 1 ? 'creation' : 'creations'}
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
