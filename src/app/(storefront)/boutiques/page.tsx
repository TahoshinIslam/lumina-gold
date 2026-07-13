import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Boutiques — Nahar Jewellers',
  description: 'Visit a Nahar Jewellers maison. Discover our boutiques and book a private appointment.',
};

/** /boutiques — placeholder; boutique locator content to come. */
export default function BoutiquesPage() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>Nahar Jewellers</div>
              <h1 className="lum-h2 lum-listing-title">Our Boutiques</h1>
              <div className="lum-listing-count">Private salons in Paris, London, Dubai and Dhaka</div>
            </div>
          </div>
          <div className="lum-empty-results" style={{ marginTop: 30 }}>
            <div className="lum-breathe-diamond" style={{ width: 18, height: 18, margin: '0 auto 20px' }} />
            Our boutique locator is coming soon.
            <div style={{ marginTop: 20 }}>
              <Link href="/#appointment" className="lum-cta-gold">Book an appointment</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
