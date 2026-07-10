import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WishlistPage from '@/features/wishlist/components/WishlistPage';

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
