import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutPage from '@/features/checkout/components/CheckoutPage';

export const metadata: Metadata = { title: 'Checkout — LUMINA' };

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
