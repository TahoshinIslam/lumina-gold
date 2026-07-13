import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { registerCustomerAction } from '@/features/customer/actions';

export const metadata: Metadata = { title: 'Create Account — Nahar Jewellers' };

const ERRORS: Record<string, string> = {
  missing: 'Please enter your name and a valid phone number.',
  weak: 'Password must be at least 6 characters.',
  exists: 'An account with this phone number already exists — sign in instead.',
};

export default async function RegisterPage({
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
          <h1 className="lum-h2 lum-listing-title">Create Your Account</h1>
          <p className="lum-pdp-desc">
            Save your pieces, track reservations, and check out faster.
          </p>

          {error && <div className="lum-pdp-warn" style={{ marginTop: 16 }}>{ERRORS[error] || 'Something went wrong — try again.'}</div>}

          <form action={registerCustomerAction} className="lum-checkout-form" style={{ marginTop: 24 }}>
            <label className="lum-field">
              <span>Full name *</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label className="lum-field">
              <span>Phone *</span>
              <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01712345678" required />
            </label>
            <label className="lum-field">
              <span>Email (optional)</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label className="lum-field">
              <span>Password *</span>
              <input name="password" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <button className="lum-cta-gold" style={{ justifyContent: 'center', width: '100%' }} type="submit">
              Create account
            </button>
          </form>

          <p className="lum-pdp-desc" style={{ marginTop: 20, fontSize: 14 }}>
            Already have an account? <Link href="/account/login" className="lum-link-gold">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
