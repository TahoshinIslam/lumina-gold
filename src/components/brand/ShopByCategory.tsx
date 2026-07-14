import Link from 'next/link';
import type { CategoryTile } from '@/server/dal/home';
import { optimized } from '@/features/shared/optimized';

/**
 * ShopByCategory — circular category tiles directly under the hero.
 *
 * The circles read the same `categories` rows the admin edits (name, tile
 * image, order) as /categories does; this list used to be hardcoded, which is
 * why an image set in the admin never appeared here. A category with no image
 * keeps the gold-on-dark gradient rather than showing a broken frame.
 */
export default function ShopByCategory({ categories }: { categories: CategoryTile[] }) {
  if (!categories.length) return null;

  return (
    <section className="lum-cats" id="categories">
      <div className="lum-eyebrow lum-eyebrow--center" data-reveal="up">
        <div className="lum-rule lum-rule--l" />
        <div className="lum-eyebrow-label">The Boutique</div>
        <div className="lum-rule lum-rule--r" />
      </div>
      <h2 className="lum-h2 lum-cats-title" data-reveal="up">Shop by Category</h2>

      <div className="lum-cats-grid" data-reveal="stagger">
        {categories.map(category => (
          <Link key={category.slug} href={`/categories/${category.slug}`} className="lum-cat">
            <span className="lum-cat-circle lum-img-ph">
              {category.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimized(category.image, 640)} alt={category.name} />
              )}
            </span>
            <span className="lum-cat-label">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
