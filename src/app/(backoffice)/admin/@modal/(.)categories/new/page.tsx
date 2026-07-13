import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CategoryFormFields } from '../../../categories/CategoryForm';
import { addCategoryAction } from '../../../actions';

export default async function AddCategoryModal({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminDrawer
      routePath="/admin/categories/new"
      title="Add Category"
      description="Keep it broad; details belong in filters."
      formId="category-form"
      action={addCategoryAction}
      submitLabel="Add Category"
    >
      <CategoryFormFields category={{}} error={error} />
    </AdminDrawer>
  );
}
