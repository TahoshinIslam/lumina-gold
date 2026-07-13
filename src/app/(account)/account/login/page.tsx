import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { loginCustomerAction } from '@/features/customer/actions';

export const metadata: Metadata = { title: 'Sign In — Nahar Jewellers' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentCustomer()) redirect('/account');
  const { error } = await searchParams;

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart" style={{ maxWidth: 460 }}>
          <h1 className="lum-h2 lum-listing-title">Welcome Back</h1>
          <p className="lum-pdp-desc">Sign in to your Nahar Jewellers account.</p>

          {error && <div className="lum-pdp-warn" style={{ marginTop: 16 }}>Wrong phone number or password.</div>}

          <form action={loginCustomerAction} className="lum-checkout-form" style={{ marginTop: 24 }}>
            <label className="lum-field">
              <span>Phone *</span>
              <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01712345678" required />
            </label>
            <label className="lum-field">
              <span>Password *</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%' }} type="submit">
              Sign in
            </button>
          </form>

          <p className="lum-pdp-desc" style={{ marginTop: 20, fontSize: 14 }}>
            New to Nahar Jewellers? <Link href="/account/register" className="lum-link-gold">Create an account</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
