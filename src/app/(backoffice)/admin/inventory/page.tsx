import { query } from '@/server/db/client';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { AdminInlineForm, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { Pagination } from '@/features/admin/components/Pagination';
import { PackageOpen, Trash2, Check } from 'lucide-react';
import { setStockAction, deleteVariantAction } from '../actions';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;
const PAGE_SIZE = 20;

/** The label shown in the Availability column. A stocked line at 0 reads
 *  "Out of stock" no matter what the stored enum says — that mismatch ("0 but
 *  In Stock") is exactly what the raw availability column got wrong.
 *  made_to_order / ready_to_ship keep their meaning: 0 on hand is fine there. */
function availabilityLabel(availability: string, qty: number): string {
  if (qty === 0 && (availability === 'in_stock' || availability === 'out_of_stock')) return 'Out of stock';
  return availability.replace(/_/g, ' ');
}

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q: rawQ, page: rawPage } = await searchParams;
  const q = rawQ?.trim() || '';
  const page = Math.max(1, Number(rawPage) || 1);

  const conditions: string[] = [];
  const args: string[] = [];
  if (q) {
    conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR v.variant_sku LIKE ?)');
    args.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count for the pager, and the totals across the WHOLE filtered set (not just
  // this page) so the summary line means what it says.
  const [counts] = await query<{ variants: number }>(
    `SELECT COUNT(*) variants
       FROM inventory i
       JOIN product_variants v ON v.id = i.variant_id
       JOIN products p ON p.id = v.product_id
       ${where}`,
    args,
  );
  const total = counts?.variants ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const offset = (current - 1) * PAGE_SIZE;

  const [tot] = await query<{ units: number; value: number }>(
    `SELECT COALESCE(SUM(i.quantity_available),0) units,
            COALESCE(SUM(pc.fixed_price * i.quantity_available),0) value
       FROM inventory i
       JOIN product_variants v ON v.id = i.variant_id
       JOIN products p ON p.id = v.product_id
       LEFT JOIN variant_price_components pc ON pc.variant_id = i.variant_id
       ${where}`,
    args,
  );

  const rows = await query<{
    variant_id: number; sku: string; name: string; variant_sku: string;
    qty: number; reserved: number; availability: string; price: number | null;
  }>(
    `SELECT v.id AS variant_id, p.sku, p.name, v.variant_sku,
            i.quantity_available qty, i.quantity_reserved reserved,
            i.availability, pc.fixed_price price
       FROM inventory i
       JOIN product_variants v ON v.id = i.variant_id
       JOIN products p ON p.id = v.product_id
       LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
       ${where}
       ORDER BY i.quantity_available ASC, p.name ASC
       LIMIT ? OFFSET ?`,
    [...args, PAGE_SIZE, offset],
  );

  const tone = (n: number) => (n === 0 ? 'err' : n <= 3 ? 'warn' : 'ok');

  return (
    <>
      <h1 className="adm-h1">Inventory</h1>
      <p className="adm-sub">
        {total} variant{total === 1 ? '' : 's'} · {tot.units} units on hand · {bdt(tot.value)} stock value
      </p>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <input name="q" placeholder="Search product name or SKU…" defaultValue={q} />
        </div>
        <button className="adm-btn ghost sm" type="submit">Search</button>
        {q ? <a href="/admin/inventory" className="adm-toolbar-reset">Reset</a> : null}
      </form>

      {rows.length === 0 ? (
        <AdminEmptyState
          icon={PackageOpen}
          title={q ? 'No variants match this search' : 'No inventory yet'}
          description={q ? 'Try a different product name or SKU.' : 'Stock levels appear here once products have variants.'}
        />
      ) : (
        <>
          <div className="adm-table-wrap"><table className="adm-table">
            <thead>
              <tr>
                <th>Product</th><th>Variant SKU</th><th>Availability</th>
                <th>Unit price</th><th>On hand</th><th>Set stock</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.variant_id} className={r.qty === 0 ? 'adm-row-danger' : undefined}>
                  <td><strong>{r.name}</strong><div className="adm-cell-sub">{r.sku}</div></td>
                  <td>{r.variant_sku}</td>
                  <td style={{ textTransform: 'capitalize' }}>{availabilityLabel(r.availability, r.qty)}</td>
                  <td>{r.price != null ? bdt(r.price) : '—'}</td>
                  <td>
                    <span className={`adm-badge ${tone(r.qty)}`}>{r.qty}</span>
                    {r.reserved > 0 ? <div className="adm-cell-sub">{r.reserved} reserved</div> : null}
                  </td>
                  <td>
                    {/* Inline AJAX set — the row refreshes in place via
                        revalidatePath, so a run of corrections doesn't reload. */}
                    <AdminInlineForm
                      action={setStockAction}
                      successMessage="Stock updated"
                      className="adm-inv-setform"
                    >
                      <input type="hidden" name="variant_id" value={r.variant_id} />
                      <input
                        type="number" name="qty" defaultValue={r.qty}
                        min={0} max={1000000} step={1} required
                        aria-label={`Set stock for ${r.variant_sku}`}
                      />
                      <button className="adm-btn ghost sm" type="submit" aria-label="Save stock">
                        <Check size={14} />
                      </button>
                    </AdminInlineForm>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ConfirmActionButton
                      action={deleteVariantAction}
                      values={{ variant_id: r.variant_id }}
                      title={`Delete ${r.variant_sku}?`}
                      description={
                        r.reserved > 0
                          ? `This variant has ${r.reserved} unit(s) reserved for a live order and cannot be deleted yet.`
                          : 'The variant, its stock, price and images are removed permanently. Past orders keep their record.'
                      }
                      confirmLabel="Delete variant"
                      className="adm-btn danger sm"
                      disabled={r.reserved > 0}
                      successMessage="Variant deleted"
                    ><Trash2 size={14} /></ConfirmActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>

          <Pagination
            page={current} pageSize={PAGE_SIZE} total={total}
            basePath="/admin/inventory" params={q ? { q } : {}}
          />
        </>
      )}
    </>
  );
}
