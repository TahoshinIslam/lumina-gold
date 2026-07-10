import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Client Services — LUMINA',
  description: 'Complimentary engraving, resizing, cleaning, repairs and lifetime care for every LUMINA creation.',
};

const SERVICES = [
  { title: 'Personal Styling', body: 'A private consultation with a client advisor, in boutique or by video.' },
  { title: 'Engraving', body: 'Hand and machine engraving to make a piece unmistakably yours.' },
  { title: 'Resizing & Repairs', body: 'Expert atelier resizing, restringing and restoration.' },
  { title: 'Care & Cleaning', body: 'Complimentary lifetime cleaning and inspection for LUMINA pieces.' },
  { title: 'Certificates', body: 'Diamond and gemstone certification (GIA / IGI / HRD) on request.' },
  { title: 'Shipping & Returns', body: 'Insured worldwide delivery and a considered returns policy.' },
];

/** /client-services — placeholder overview of maison services. */
export default function ClientServicesPage() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>Maison Lumina</div>
              <h1 className="lum-h2 lum-listing-title">Client Services</h1>
              <div className="lum-listing-count">A lifetime of care for every creation</div>
            </div>
          </div>
          <div className="lum-results-grid" style={{ marginTop: 24 }}>
            {SERVICES.map(service => (
              <div key={service.title} className="lum-pcard" style={{ padding: 28 }}>
                <div className="lum-prod-name" style={{ fontSize: 20 }}>{service.title}</div>
                <div className="lum-prod-cat" style={{ marginTop: 8 }}>{service.body}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link href="/#appointment" className="lum-cta-gold">Request an appointment</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
