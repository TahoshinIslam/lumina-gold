import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import { GEMSTONE_SLUGS, MATERIAL_SLUGS } from '@/components/shop/taxonomy';

export const metadata: Metadata = {
  title: 'Shop by Material — LUMINA',
  description: 'Browse haute joaillerie by metal and gemstone — gold, platinum, silver and diamond.',
};

/** /jewelry — the "browse by material" hub. */
export default function JewelryIndex() {
  const metals = Object.entries(MATERIAL_SLUGS);
  const gemstones = Object.entries(GEMSTONE_SLUGS);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>The Boutique</div>
              <h1 className="lum-h2 lum-listing-title">Shop by Material</h1>
              <div className="lum-listing-count">Choose a metal or gemstone</div>
            </div>
          </div>

          <div className="lum-filter-heading" style={{ marginTop: 24 }}>Metals</div>
          <div className="lum-results-grid" style={{ marginTop: 12 }}>
            {metals.map(([slug, label]) => (
              <Link key={slug} href={`/jewelry/${slug}`} className="lum-pcard-link">
                <div className="lum-pcard" style={{ padding: 28, textAlign: 'center' }}>
                  <div className="lum-prod-name" style={{ fontSize: 20 }}>{label}</div>
                  <div className="lum-prod-cat">Explore {label} →</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="lum-filter-heading" style={{ marginTop: 36 }}>Gemstones</div>
          <div className="lum-results-grid" style={{ marginTop: 12 }}>
            {gemstones.map(([slug, label]) => (
              <Link key={slug} href={`/jewelry/${slug}`} className="lum-pcard-link">
                <div className="lum-pcard" style={{ padding: 28, textAlign: 'center' }}>
                  <div className="lum-prod-name" style={{ fontSize: 20 }}>{label}</div>
                  <div className="lum-prod-cat">Explore {label} →</div>
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
