import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return (
    <>
      <h1 className="adm-h1">New product</h1>
      <p className="adm-sub">Creates the product with its default variant, price, and stock.</p>
      <ProductForm product={{}} />
    </>
  );
}
