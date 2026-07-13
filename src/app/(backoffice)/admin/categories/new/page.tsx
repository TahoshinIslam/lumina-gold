import { addCategoryAction } from '../../actions';
import { CategoryFormFields } from '../CategoryForm';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">New category</h1>
      <p className="adm-sub">Keep it broad; details belong in filters.</p>
      <AdminFormShell action={addCategoryAction} submitLabel="Add category" cancelHref="/admin/categories">
        <CategoryFormFields category={{}} error={error} />
      </AdminFormShell>
    </>
  );
}
