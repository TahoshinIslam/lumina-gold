import { query } from '@/server/db/client';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminCustomersPage() {
  const customers = await query<{
    id: number; name: string; email: string; phone: string | null; created_at: string;
    orders: number; spent: number;
  }>(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
            COUNT(o.id) orders,
            COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','returned','refunded') THEN o.grand_total END),0) spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY spent DESC, u.created_at DESC
     LIMIT 200`,
  );

  return (
    <>
      <h1 className="adm-h1">Customers</h1>
      <p className="adm-sub">{customers.length} customers · ranked by lifetime spend</p>

      {customers.length === 0 ? (
        <div className="adm-empty">No customers yet.</div>
      ) : (
        <table className="adm-table">
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
                  <div style={{ fontSize: 12, color: '#9A8668' }}>{c.phone}</div>
                </td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>{c.orders}</td>
                <td><strong>{bdt(c.spent)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
