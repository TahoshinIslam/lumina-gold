import type { Metadata } from 'next';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import CartPage from '@/components/shop/CartPage';

export const metadata: Metadata = { title: 'Your Bag — LUMINA' };

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
