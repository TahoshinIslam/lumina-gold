import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GEMSTONE_SLUGS, MATERIAL_SLUGS } from '@/features/catalog/taxonomy';

// The CSP nonce (src/proxy.ts) is minted per request, so a page prerendered at
// build time would ship inline scripts with no nonce and the browser would block
// them — a dead page. Nothing here was worth prerendering anyway.
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'Shop by Material — Nahar Jewellers',
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

          <div className="lum-browse-section">Metals</div>
          <div className="lum-browse-grid">
            {metals.map(([slug, label]) => (
              <Link key={slug} href={`/jewelry/${slug}`} className="lum-browse-tile">
                <div className="lum-browse-tile-name">{label}</div>
                <div className="lum-browse-tile-cta">Explore {label} →</div>
              </Link>
            ))}
          </div>

          <div className="lum-browse-section">Gemstones</div>
          <div className="lum-browse-grid">
            {gemstones.map(([slug, label]) => (
              <Link key={slug} href={`/jewelry/${slug}`} className="lum-browse-tile">
                <div className="lum-browse-tile-name">{label}</div>
                <div className="lum-browse-tile-cta">Explore {label} →</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
