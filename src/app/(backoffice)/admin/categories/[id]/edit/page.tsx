import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import { updateCategoryAction } from '../../../actions';
import { CategoryFormFields } from '../../CategoryForm';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const rows = await query<{ id: number; name: string; slug: string; image: string | null }>(
    'SELECT id, name, slug, image FROM categories WHERE id = ?', [Number(id)]);
  if (!rows[0]) notFound();

  return (
    <>
      <h1 className="adm-h1">Edit: {rows[0].name}</h1>
      <p className="adm-sub">Renaming regenerates the slug.</p>
      <AdminFormShell action={updateCategoryAction} submitLabel="Save changes" cancelHref="/admin/categories">
        <CategoryFormFields category={rows[0]} error={error} />
      </AdminFormShell>
    </>
  );
}
