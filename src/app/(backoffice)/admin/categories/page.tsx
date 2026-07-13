import Link from 'next/link';
import { query } from '@/server/db/client';
import { deleteCategoryAction } from '../actions';
import { ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';
import { Pencil, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>;
}) {
  const { error, q: rawQ } = await searchParams;
  const q = rawQ?.trim() || '';
  const like = `%${q}%`;

  const categories = await query<{ id: number; name: string; slug: string; products: number }>(
    `SELECT c.id, c.name, c.slug, COUNT(pc.product_id) products
     FROM categories c
     LEFT JOIN product_categories pc ON pc.category_id = c.id
     ${q ? 'WHERE c.name LIKE ? OR c.slug LIKE ?' : ''}
     GROUP BY c.id ORDER BY c.sort_order, c.name`,
    q ? [like, like] : [],
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 className="adm-h1">Categories</h1>
          <p className="adm-sub">{categories.length} categories — keep them broad; details belong in filters.</p>
        </div>
        <Link href="/admin/categories/new" className="adm-btn">+ Add category</Link>
      </div>

      {error === 'in-use' && (
        <div className="adm-error">That category is used by products — reassign them first.</div>
      )}

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <DebouncedSearchInput placeholder="Search categories…" defaultValue={q} />
        </div>
        <button className="adm-btn ghost sm" type="submit">Search</button>
        {q ? <Link href="/admin/categories" className="adm-toolbar-reset">Reset</Link> : null}
      </form>

      {categories.length === 0 ? (
        <div className="adm-empty">No categories match “{q}”.</div>
      ) : (
      <div className="adm-table-wrap"><table className="adm-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td style={{ color: '#687168' }}>{c.slug}</td>
                <td>{c.products}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link className="adm-btn ghost sm" href={`/admin/categories/${c.id}/edit`}><Pencil size={14} /> Edit</Link>{' '}
                  <ConfirmActionButton
                    action={deleteCategoryAction}
                    values={{ id: c.id }}
                    title={`Delete ${c.name}?`}
                    description="The category will be permanently removed. Products must be reassigned before an in-use category can be deleted."
                    confirmLabel="Delete category"
                    className="adm-btn danger"
                    disabled={c.products > 0}
                    successMessage="Category deleted successfully"
                  ><Trash2 size={14} /> Delete</ConfirmActionButton>
                </td>
              </tr>
            ))}
          </tbody>
      </table></div>
      )}
    </>
  );
}
