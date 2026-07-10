import { query } from '@/server/db/client';
import { saveCouponAction, toggleCouponAction, deleteCouponAction } from '../actions';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const coupons = await query<{
    id: number; code: string; type: string; value: number; min_order: number;
    used_count: number; usage_limit: number | null; expires_at: string | null; is_active: number;
  }>(`SELECT id, code, type, value, min_order, used_count, usage_limit, expires_at, is_active
      FROM coupons ORDER BY is_active DESC, expires_at ASC`);

  return (
    <>
      <h1 className="adm-h1">Offers</h1>
      <p className="adm-sub">{coupons.length} coupons · discounts applied at checkout</p>

      {error && <div className="adm-error">Enter a code and a value greater than zero.</div>}

      {/* New coupon */}
      <form className="adm-form" action={saveCouponAction} style={{ maxWidth: 'none', marginBottom: 28 }}>
        <div className="adm-grid3">
          <div className="adm-field"><label>Code</label><input name="code" placeholder="EID40" required /></div>
          <div className="adm-field">
            <label>Type</label>
            <select name="type"><option value="percent">Percentage off</option><option value="fixed">Flat amount off</option></select>
          </div>
          <div className="adm-field"><label>Value</label><input name="value" type="number" step="0.01" min="1" required /></div>
        </div>
        <div className="adm-grid3">
          <div className="adm-field"><label>Min order (৳)</label><input name="min_order" type="number" min="0" defaultValue={0} /></div>
          <div className="adm-field"><label>Usage limit</label><input name="usage_limit" type="number" min="0" placeholder="Unlimited" /></div>
          <div className="adm-field"><label>Expires</label><input name="expires_at" type="date" /></div>
        </div>
        <div><button className="adm-btn" type="submit">+ Create coupon</button></div>
      </form>

      <table className="adm-table">
        <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Usage</th><th>Expires</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {coupons.map(c => {
            const expired = c.expires_at && new Date(c.expires_at) < new Date();
            return (
              <tr key={c.id}>
                <td><strong style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{c.code}</strong></td>
                <td>{c.type === 'percent' ? `${c.value}%` : bdt(c.value)}</td>
                <td>{c.min_order > 0 ? bdt(c.min_order) : '—'}</td>
                <td>{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                <td><span className={`adm-badge ${expired ? 'err' : c.is_active ? 'ok' : 'warn'}`}>
                  {expired ? 'Expired' : c.is_active ? 'Active' : 'Paused'}
                </span></td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <form action={toggleCouponAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="adm-btn ghost sm" type="submit">{c.is_active ? 'Pause' : 'Activate'}</button>
                  </form>{' '}
                  <form action={deleteCouponAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="adm-btn danger" type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
