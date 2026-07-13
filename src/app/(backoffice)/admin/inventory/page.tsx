import { query } from '@/server/db/client';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { PackageOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || '';

  const conditions: string[] = [];
  const args: string[] = [];
  if (q) { conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR v.variant_sku LIKE ?)'); args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await query<{
    sku: string; name: string; variant_sku: string; qty: number;
    availability: string; price: number | null;
  }>(
    `SELECT p.sku, p.name, v.variant_sku, i.quantity_available qty, i.availability, pc.fixed_price price
     FROM inventory i
     JOIN product_variants v ON v.id = i.variant_id
     JOIN products p ON p.id = v.product_id
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     ${where}
     ORDER BY i.quantity_available ASC`,
    args,
  );
  const [tot] = await query<{ units: number; value: number }>(
    `SELECT COALESCE(SUM(i.quantity_available),0) units,
            COALESCE(SUM(pc.fixed_price * i.quantity_available),0) value
     FROM inventory i LEFT JOIN variant_price_components pc ON pc.variant_id = i.variant_id`,
  );

  const tone = (q: number) => (q === 0 ? 'err' : q <= 3 ? 'warn' : 'ok');

  return (
    <>
      <h1 className="adm-h1">Inventory</h1>
      <p className="adm-sub">{rows.length} variant{rows.length === 1 ? '' : 's'} · {tot.units} units on hand · {bdt(tot.value)} stock value</p>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <input name="q" placeholder="Search product name or SKU…" defaultValue={q} />
        </div>
        <button className="adm-btn ghost sm" type="submit">Search</button>
        {q ? <a href="/admin/inventory" className="adm-toolbar-reset">Reset</a> : null}
      </form>

      {rows.length === 0 ? (
        <AdminEmptyState icon={PackageOpen} title={q ? 'No variants match this search' : 'No inventory yet'}
          description={q ? 'Try a different product name or SKU.' : 'Stock levels appear here once products have variants.'} />
      ) : (
        <div className="adm-table-wrap"><table className="adm-table">
          <thead><tr><th>Product</th><th>Variant SKU</th><th>Availability</th><th>Unit price</th><th>On hand</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.variant_sku}>
                <td><strong>{r.name}</strong><div style={{ fontSize: 12, color: '#687168' }}>{r.sku}</div></td>
                <td>{r.variant_sku}</td>
                <td style={{ textTransform: 'capitalize' }}>{r.availability.replace(/_/g, ' ')}</td>
                <td>{r.price != null ? bdt(r.price) : '—'}</td>
                <td><span className={`adm-badge ${tone(r.qty)}`}>{r.qty}</span></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </>
  );
}
