import { query } from '@/server/db/client';
import { addCategoryAction, deleteCategoryAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await query<{ id: number; name: string; slug: string; products: number }>(
    `SELECT c.id, c.name, c.slug, COUNT(pc.product_id) products
     FROM categories c
     LEFT JOIN product_categories pc ON pc.category_id = c.id
     GROUP BY c.id ORDER BY c.sort_order, c.name`,
  );

  return (
    <>
      <h1 className="adm-h1">Categories</h1>
      <p className="adm-sub">{categories.length} categories — keep them broad; details belong in filters.</p>

      {error === 'in-use' && (
        <div className="adm-error">That category is used by products — reassign them first.</div>
      )}

      <form className="adm-inline-form" action={addCategoryAction}>
        <div className="adm-field" style={{ width: 280 }}>
          <label>New category</label>
          <input name="name" placeholder="e.g. Anklets" required />
        </div>
        <button className="adm-btn" type="submit">Add</button>
      </form>

      <table className="adm-table">
        <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th></th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td><strong>{c.name}</strong></td>
              <td style={{ color: '#9A8668' }}>{c.slug}</td>
              <td>{c.products}</td>
              <td style={{ textAlign: 'right' }}>
                <form action={deleteCategoryAction} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="adm-btn danger" type="submit" disabled={c.products > 0}
                    title={c.products > 0 ? 'In use by products' : 'Delete'}>
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
