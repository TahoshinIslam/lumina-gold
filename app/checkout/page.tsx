import type { Metadata } from 'next';
import Header from '../../components/lumina/Header';
import Footer from '../../components/lumina/Footer';
import CheckoutPage from '../../components/shop/CheckoutPage';

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
