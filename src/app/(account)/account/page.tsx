import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountPage from '@/features/customer/components/AccountPage';
import { getCurrentCustomer } from '@/server/auth/customer';
import { logoutCustomerAction } from '@/features/customer/actions';

export const metadata: Metadata = { title: 'My Account — Nahar Jewellers' };
export const dynamic = 'force-dynamic';

export default async function Account() {
  const customer = await getCurrentCustomer();
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <AccountPage customer={customer} logoutAction={logoutCustomerAction} />
      </main>
      <Footer />
    </div>
  );
}
