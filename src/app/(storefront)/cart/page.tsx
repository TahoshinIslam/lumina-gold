import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartPage from '@/features/cart/components/CartPage';

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
