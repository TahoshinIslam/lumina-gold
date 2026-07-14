import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartPage from '@/features/cart/components/CartPage';

// The CSP nonce (src/proxy.ts) is minted per request, so a page prerendered at
// build time would ship inline scripts with no nonce and the browser would block
// them — a dead page. Nothing here was worth prerendering anyway.
export const dynamic = 'force-dynamic';


export const metadata: Metadata = { title: 'Your Bag — Nahar Jewellers' };

export default function Cart() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <CartPage />
      </main>
      <Footer />
    </div>
  );
}
