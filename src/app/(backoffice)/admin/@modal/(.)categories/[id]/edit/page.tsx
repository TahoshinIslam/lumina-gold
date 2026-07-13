import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CategoryFormFields } from '../../../../categories/CategoryForm';
import { updateCategoryAction } from '../../../../actions';

export default async function EditCategoryModal({
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
    <AdminDrawer
      routePath={`/admin/categories/${id}/edit`}
      title={`Edit: ${rows[0].name}`}
      description="Renaming regenerates the slug."
      formId="category-form"
      action={updateCategoryAction}
      submitLabel="Save changes"
    >
      <CategoryFormFields category={rows[0]} error={error} />
    </AdminDrawer>
  );
}
