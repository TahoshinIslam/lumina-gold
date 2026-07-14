import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WishlistPage from '@/features/wishlist/components/WishlistPage';

// The CSP nonce (src/proxy.ts) is minted per request, so a page prerendered at
// build time would ship inline scripts with no nonce and the browser would block
// them — a dead page. Nothing here was worth prerendering anyway.
export const dynamic = 'force-dynamic';


export const metadata: Metadata = { title: 'Wishlist — Nahar Jewellers' };

export default function Wishlist() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <WishlistPage />
      </main>
      <Footer />
    </div>
  );
}
