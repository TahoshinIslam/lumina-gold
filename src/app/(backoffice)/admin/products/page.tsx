import Link from 'next/link';
import { query } from '@/server/db/client';
import { deleteProductAction } from '../actions';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Number(n).toLocaleString('en-IN')}`;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const like = `%${(q || '').trim()}%`;

  const products = await query<{
    id: number; sku: string; name: string; status: string;
    is_featured: number; is_new_arrival: number;
    category: string | null; price: number | null; qty: number | null; image: string | null;
  }>(
    `SELECT p.id, p.sku, p.name, p.status, p.is_featured, p.is_new_arrival,
            c.name category, pc.fixed_price price, i.quantity_available qty, img.image_path image
     FROM products p
     LEFT JOIN product_categories pcat ON pcat.product_id = p.id
     LEFT JOIN categories c ON c.id = pcat.category_id
     LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     LEFT JOIN inventory i ON i.variant_id = v.id AND i.warehouse_id = 1
     LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = 1
     ${q ? 'WHERE p.name LIKE ? OR p.sku LIKE ?' : ''}
     ORDER BY p.id DESC`,
    q ? [like, like] : [],
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 className="adm-h1">Products</h1>
          <p className="adm-sub">{products.length} products{q ? ` matching “${q}”` : ''}</p>
        </div>
        <Link href="/admin/products/new" className="adm-btn">+ Add product</Link>
      </div>

      <form className="adm-inline-form" method="get">
        <div className="adm-field" style={{ width: 320 }}>
          <input name="q" placeholder="Search name or SKU…" defaultValue={q || ''} />
        </div>
        <button className="adm-btn ghost sm" type="submit">Search</button>
      </form>

      {products.length === 0 ? (
        <div className="adm-empty">No products found.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ width: 50 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.image && <img className="adm-thumb" src={p.image} alt="" />}
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: 12, color: '#9A8668' }}>{p.sku}
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
                  <span className={`adm-badge ${p.status === 'active' ? 'ok' : 'warn'}`}>{p.status}</span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link className="adm-btn ghost sm" href={`/admin/products/${p.id}`}>Edit</Link>{' '}
                  <form action={deleteProductAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="adm-btn danger" type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
