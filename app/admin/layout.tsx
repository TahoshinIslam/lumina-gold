import { cookies } from 'next/headers';
import Link from 'next/link';
import './admin.css';
import { ADMIN_COOKIE, adminToken } from '../../lib/adminAuth';
import { logoutAction } from './actions';

export const metadata = { title: 'Admin — LUMINA' };

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/inventory', label: 'Inventory' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/offers', label: 'Offers' },
  { href: '/admin/rates', label: 'Gold Rates' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const authed = jar.get(ADMIN_COOKIE)?.value === adminToken();

  // Login page (or any unauthenticated hit the middleware redirects) — no chrome.
  if (!authed) return <>{children}</>;

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand">
          LUMINA
          <small>ADMIN PANEL</small>
        </div>
        <nav className="adm-nav">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link href="/" target="_blank">↗ View store</Link>
        </nav>
        <form action={logoutAction}>
          <button className="adm-btn ghost sm" type="submit">Sign out</button>
        </form>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
