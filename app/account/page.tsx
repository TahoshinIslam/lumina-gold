import type { Metadata } from 'next';
import Header from '../../components/lumina/Header';
import Footer from '../../components/lumina/Footer';
import AccountPage from '../../components/shop/AccountPage';

export const metadata: Metadata = { title: 'My Account — LUMINA' };

export default function Account() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <AccountPage />
      </main>
      <Footer />
    </div>
  );
}
