import Link from 'next/link';
import { query } from '@/server/db/client';
import {
  deleteProductAction, bulkDeleteProductsAction, bulkPublishProductsAction, bulkUnpublishProductsAction,
  toggleProductStatusAction,
} from '../actions';
import { SortableHead } from '@/features/admin/components/SortableHead';
import { Pagination } from '@/features/admin/components/Pagination';
import { StatusFilter } from '@/features/admin/components/StatusFilter';
import { BulkActionsBar } from '@/features/admin/components/BulkActionsBar';
import { PLACEHOLDER_IMAGE } from '@/features/catalog/image';
import { AdminActionButton, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Number(n).toLocaleString('en-IN')}`;
const PAGE_SIZE = 20;
const SORT_COLUMNS: Record<string, string> = {
  name: 'p.name', price: 'price', stock: 'qty', status: 'p.status', category: 'category',
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string; category?: string; status?: string | string[]; sort?: string; dir?: string; page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const categoryId = Number(sp.category) || 0;
  const statuses = (Array.isArray(sp.status) ? sp.status : sp.status ? [sp.status] : [])
    .filter(s => ['draft', 'active', 'archived'].includes(s));
  const sort = SORT_COLUMNS[sp.sort || ''] ? sp.sort! : 'name';
  const dir = sp.dir === 'desc' ? 'DESC' : 'ASC';
  const page = Math.max(1, Number(sp.page) || 1);

  const conditions: string[] = [];
  const args: (string | number)[] = [];
  if (q) { conditions.push('(p.name LIKE ? OR p.sku LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  if (categoryId) { conditions.push('pcat.category_id = ?'); args.push(categoryId); }
  if (statuses.length) { conditions.push(`p.status IN (${statuses.map(() => '?').join(',')})`); args.push(...statuses); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const base = `
    FROM products p
    LEFT JOIN product_categories pcat ON pcat.product_id = p.id
    LEFT JOIN categories c ON c.id = pcat.category_id
    LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
    LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
    LEFT JOIN inventory i ON i.variant_id = v.id AND i.warehouse_id = 1
    LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = 1
    ${where}`;

  const [{ total }] = await query<{ total: number }>(
    `SELECT COUNT(DISTINCT p.id) total ${base}`, args,
  );

  const products = await query<{
    id: number; sku: string; name: string; status: string;
    is_featured: number; is_new_arrival: number;
    category: string | null; price: number | null; qty: number | null; image: string | null;
  }>(
    `SELECT p.id, p.sku, p.name, p.status, p.is_featured, p.is_new_arrival,
            c.name category, pc.fixed_price price, i.quantity_available qty, img.image_path image
     ${base}
     GROUP BY p.id
     ORDER BY ${SORT_COLUMNS[sort]} ${dir}
     LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    args,
  );

  const categories = await query<{ id: number; name: string }>('SELECT id, name FROM categories ORDER BY sort_order, name');

  const linkParams = { q, category: sp.category || '', status: statuses, sort, dir: dir.toLowerCase() };
  const activeFilters = q || categoryId || statuses.length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 className="adm-h1">Products</h1>
          <p className="adm-sub">{total} product{total === 1 ? '' : 's'}{q ? ` matching “${q}”` : ''}</p>
        </div>
        {/* Soft-navigates, so @modal/(.)products/new intercepts it into the
            right-hand drawer; a direct hit on the URL gets the full page. */}
        <Link href="/admin/products/new" className="adm-btn"><Plus size={16} /> Add product</Link>
      </div>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <DebouncedSearchInput placeholder="Search name or SKU…" defaultValue={q} />
        </div>
        <select name="category" className="adm-select" defaultValue={sp.category || ''}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <StatusFilter
          options={[
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' },
          ]}
          selected={statuses}
        />
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir.toLowerCase()} />
        <button className="adm-btn ghost sm" type="submit">Filter</button>
        {activeFilters ? <Link href="/admin/products" className="adm-toolbar-reset">Reset</Link> : null}
      </form>

      {products.length === 0 ? (
        <div className="adm-empty">No products found.</div>
      ) : (
        <>
          {/* Detached form: row checkboxes reference it via `form="products-bulk-form"`
             instead of nesting, since the per-row Delete form below can't live inside
             another <form>. */}
          <form id="products-bulk-form" action={bulkDeleteProductsAction} />
          <BulkActionsBar
            formId="products-bulk-form"
            selectAllId="products-select-all"
            label="product"
            actions={[
              { label: 'Publish', formAction: bulkPublishProductsAction },
              { label: 'Unpublish', formAction: bulkUnpublishProductsAction },
              { label: 'Delete', formAction: bulkDeleteProductsAction, danger: true, confirm: 'Delete the selected products? This cannot be undone.' },
            ]}
          />
          <div className="adm-table-wrap"><table className="adm-table">
            <thead>
              <tr>
                <th className="adm-check-col"><input id="products-select-all" type="checkbox" aria-label="Select all" /></th>
                <th></th>
                <SortableHead col="name" label="Product" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/products" />
                <SortableHead col="category" label="Category" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/products" />
                <SortableHead col="price" label="Price" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/products" />
                <SortableHead col="stock" label="Stock" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/products" />
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="adm-check-col">
                    <input type="checkbox" form="products-bulk-form" name="ids" value={p.id} aria-label={`Select ${p.name}`} />
                  </td>
                  <td style={{ width: 50 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="adm-thumb" src={p.image || PLACEHOLDER_IMAGE} alt="" loading="lazy" decoding="async" />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 12, color: '#687168' }}>{p.sku}
                      {p.is_featured ? ' · Featured' : ''}{p.is_new_arrival ? ' · New' : ''}</div>
                  </td>
                  <td>{p.category || '—'}</td>
                  <td>{p.price != null ? bdt(p.price) : '—'}</td>
                  <td>
                    <span className={`adm-badge ${(p.qty ?? 0) === 0 ? 'err' : (p.qty ?? 0) <= 3 ? 'warn' : 'ok'}`}>
                      {p.qty ?? 0}
                    </span>
                  </td>
                  <td>
                    {p.status === 'archived' ? (
                      <span className="adm-badge draft">Archived</span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <AdminActionButton action={toggleProductStatusAction} values={{ id: p.id }}
                          message={p.status === 'active' ? 'Product unpublished' : 'Product published'}
                          className={`adm-switch ${p.status === 'active' ? 'on' : ''}`}
                          ariaLabel={p.status === 'active' ? 'Unpublish' : 'Publish'}>
                          <span className="sr-only">{p.status === 'active' ? 'Unpublish' : 'Publish'}</span>
                        </AdminActionButton>
                        <span className={`adm-badge ${p.status === 'active' ? 'ok' : 'warn'}`}>{p.status}</span>
                      </span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {/* Soft-navigates, so @modal/(.)products/[id]/edit intercepts
                        it into the drawer; a direct hit gets the full page. */}
                    <Link className="adm-btn ghost sm" href={`/admin/products/${p.id}/edit`}>
                      <Pencil size={14} /> Edit
                    </Link>{' '}
                    <ConfirmActionButton
                      action={deleteProductAction}
                      values={{ id: p.id }}
                      title={`Delete ${p.name}?`}
                      description="This permanently removes the product, its variants, inventory, and uploaded images. This action cannot be undone."
                      confirmLabel="Delete product"
                      className="adm-btn danger"
                      successMessage="Product deleted successfully"
                    ><Trash2 size={14} /> Delete</ConfirmActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/products" params={linkParams} />
    </>
  );
}
