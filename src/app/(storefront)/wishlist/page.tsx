import type { Metadata } from 'next';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import WishlistPage from '@/components/shop/WishlistPage';

export const metadata: Metadata = { title: 'Wishlist — LUMINA' };

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
