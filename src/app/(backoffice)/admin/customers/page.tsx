import Link from 'next/link';
import { query } from '@/server/db/client';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || '';

  const conditions: string[] = [];
  const args: string[] = [];
  if (q) { conditions.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)'); args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const customers = await query<{
    id: number; name: string; email: string; phone: string | null; created_at: string;
    orders: number; spent: number;
  }>(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
            COUNT(o.id) orders,
            COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','returned','refunded') THEN o.grand_total END),0) spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     ${where}
     GROUP BY u.id
     ORDER BY spent DESC, u.created_at DESC
     LIMIT 200`,
    args,
  );

  return (
    <>
      <h1 className="adm-h1">Customers</h1>
      <p className="adm-sub">{customers.length} customer{customers.length === 1 ? '' : 's'} · ranked by lifetime spend</p>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <input name="q" placeholder="Search name, email or phone…" defaultValue={q} />
        </div>
        <button className="adm-btn ghost sm" type="submit">Search</button>
        {q ? <Link href="/admin/customers" className="adm-toolbar-reset">Reset</Link> : null}
      </form>

      {customers.length === 0 ? (
        <AdminEmptyState icon={Users} title={q ? 'No customers match this search' : 'No customers yet'}
          description={q ? 'Try a different name, email or phone number.' : 'Customers appear here once they create an account.'} />
      ) : (
        <div className="adm-table-wrap"><table className="adm-table">
          <thead><tr><th>Customer</th><th>Contact</th><th>Joined</th><th>Orders</th><th>Lifetime spend</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="adm-avatar">{c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                    <strong>{c.name}</strong>
                  </div>
                </td>
                <td>
                  {c.email}
                  <div style={{ fontSize: 12, color: '#687168' }}>{c.phone}</div>
                </td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>{c.orders}</td>
                <td><strong>{bdt(c.spent)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </>
  );
}
