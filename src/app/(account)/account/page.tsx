import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountPage from '@/features/customer/components/AccountPage';

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
