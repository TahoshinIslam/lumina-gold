import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

/**
 * Full-page Add Product — the fallback the intercepting drawer
 * (admin/@modal/(.)products/new) falls through to on a direct link or a hard
 * refresh, since interception only happens on client-side navigation.
 */
export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">New product</h1>
      <p className="adm-sub">Creates the product with its default variant, price, and stock.</p>
      <ProductForm product={{}} error={error} />
    </>
  );
}
