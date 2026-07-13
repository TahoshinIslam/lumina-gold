import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { ProductFormFields } from '../../../products/ProductForm';
import { saveProductAction } from '../../../actions';

/**
 * Add Product, intercepted — clicking "Add product" on the list slides this in
 * from the right over the table instead of navigating away. A direct link or a
 * refresh falls through to the full page at admin/products/new.
 */
export default async function AddProductModal({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminDrawer
      title="New product"
      description="Creates the product with its default variant, price, and stock."
      routePath="/admin/products/new"
      formId="product-form"
      action={saveProductAction}
      submitLabel="Create product"
    >
      <ProductFormFields product={{}} error={error} />
    </AdminDrawer>
  );
}
