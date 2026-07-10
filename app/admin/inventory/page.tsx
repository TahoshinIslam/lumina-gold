import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminInventoryPage() {
  const rows = await query<{
    sku: string; name: string; variant_sku: string; qty: number;
    availability: string; price: number | null;
  }>(
    `SELECT p.sku, p.name, v.variant_sku, i.quantity_available qty, i.availability, pc.fixed_price price
     FROM inventory i
     JOIN product_variants v ON v.id = i.variant_id
     JOIN products p ON p.id = v.product_id
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     ORDER BY i.quantity_available ASC`,
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
      <p className="adm-sub">{rows.length} variants · {tot.units} units on hand · {bdt(tot.value)} stock value</p>

      <table className="adm-table">
        <thead><tr><th>Product</th><th>Variant SKU</th><th>Availability</th><th>Unit price</th><th>On hand</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.variant_sku}>
              <td><strong>{r.name}</strong><div style={{ fontSize: 12, color: '#9A8668' }}>{r.sku}</div></td>
              <td>{r.variant_sku}</td>
              <td style={{ textTransform: 'capitalize' }}>{r.availability.replace(/_/g, ' ')}</td>
              <td>{r.price != null ? bdt(r.price) : '—'}</td>
              <td><span className={`adm-badge ${tone(r.qty)}`}>{r.qty}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
