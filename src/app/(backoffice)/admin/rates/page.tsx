import { query } from '@/server/db/client';
import { addRateAction } from '../actions';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Number(n).toLocaleString('en-IN')}`;

export default async function AdminRatesPage() {
  const purities = await query<{ id: number; name: string; metal: string }>(
    `SELECT mp.id, mp.name, m.name metal FROM metal_purities mp
     JOIN metals m ON m.id = mp.metal_id ORDER BY m.id, mp.purity_percent DESC`,
  );
  const current = await query<{ purity_id: number; rate: number; effective_from: string }>(
    `SELECT mr.purity_id, mr.rate_per_gram rate, mr.effective_from
     FROM metal_rates mr
     WHERE mr.id IN (SELECT MAX(id) FROM metal_rates GROUP BY purity_id)`,
  );
  const history = await query<{ name: string; rate: number; effective_from: string }>(
    `SELECT mp.name, mr.rate_per_gram rate, mr.effective_from
     FROM metal_rates mr JOIN metal_purities mp ON mp.id = mr.purity_id
     ORDER BY mr.effective_from DESC LIMIT 15`,
  );
  const rateOf = (id: number) => current.find(c => c.purity_id === id);

  return (
    <>
      <h1 className="adm-h1">Gold Rates</h1>
      <p className="adm-sub">
        Per-gram rates drive rate-based variant pricing. Publishing a new rate keeps full history.
      </p>

      <form className="adm-inline-form" action={addRateAction}>
        <div className="adm-field" style={{ width: 220 }}>
          <label>Purity</label>
          <select name="purity_id" required>
            {purities.map(p => (
              <option key={p.id} value={p.id}>{p.metal} {p.name}</option>
            ))}
          </select>
        </div>
        <div className="adm-field" style={{ width: 200 }}>
          <label>New rate (৳ / gram)</label>
          <input name="rate" type="number" step="0.01" min="1" required />
        </div>
        <button className="adm-btn" type="submit">Publish rate</button>
      </form>

      <div className="adm-grid2" style={{ alignItems: 'start' }}>
        <div>
          <h2 className="adm-h1" style={{ fontSize: 18 }}>Current rates</h2>
          <table className="adm-table">
            <thead><tr><th>Purity</th><th>Rate / gram</th><th>Since</th></tr></thead>
            <tbody>
              {purities.map(p => {
                const r = rateOf(p.id);
                return (
                  <tr key={p.id}>
                    <td>{p.metal} {p.name}</td>
                    <td>{r ? bdt(r.rate) : <span className="adm-badge warn">not set</span>}</td>
                    <td>{r ? new Date(r.effective_from).toLocaleString() : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="adm-h1" style={{ fontSize: 18 }}>Recent updates</h2>
          <table className="adm-table">
            <thead><tr><th>Purity</th><th>Rate</th><th>Published</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.name}</td>
                  <td>{bdt(h.rate)}</td>
                  <td>{new Date(h.effective_from).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
