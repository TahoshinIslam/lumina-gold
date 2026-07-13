import { notFound } from 'next/navigation';
import ProductForm, { loadProduct } from '../../ProductForm';

export const dynamic = 'force-dynamic';

/**
 * Full-page Edit Product — the fallback the intercepting drawer
 * (admin/@modal/(.)products/[id]/edit) falls through to on a direct link or a
 * hard refresh, since interception only happens on client-side navigation.
 */
export default async function EditProductPage({
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
    <>
      <h1 className="adm-h1">Edit: {product.name}</h1>
      <p className="adm-sub">Changes apply to the product and its default variant.</p>
      <ProductForm product={product} error={error} />
    </>
  );
}
