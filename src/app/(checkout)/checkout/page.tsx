import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutPage from '@/features/checkout/components/CheckoutPage';

// The CSP nonce (src/proxy.ts) is minted per request, so a page prerendered at
// build time would ship inline scripts with no nonce and the browser would block
// them — a dead page. Nothing here was worth prerendering anyway.
export const dynamic = 'force-dynamic';


export const metadata: Metadata = { title: 'Checkout — Nahar Jewellers' };

export default function Checkout() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  );
}
