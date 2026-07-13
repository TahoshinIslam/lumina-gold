import { notFound } from 'next/navigation';
import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { ProductFormFields, loadProduct } from '../../../../products/ProductForm';
import { saveProductAction } from '../../../../actions';

/**
 * Edit Product, intercepted — the row's Edit link slides the form in over the
 * list instead of navigating away. A direct link or a refresh falls through to
 * the full page at admin/products/[id]/edit.
 */
export default async function EditProductModal({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const product = await loadProduct(Number(id));
  if (!product) notFound();

  return (
    <AdminDrawer
      title={`Edit: ${product.name}`}
      description="Changes apply to the product and its default variant."
      routePath={`/admin/products/${id}/edit`}
      formId="product-form"
      action={saveProductAction}
      submitLabel="Save changes"
    >
      <ProductFormFields product={product} error={error} />
    </AdminDrawer>
  );
}
