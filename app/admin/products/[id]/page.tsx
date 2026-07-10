import { notFound } from 'next/navigation';
import { query } from '../../../../lib/db';
import ProductForm, { ProductFormData } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await query<ProductFormData & { name: string }>(
    `SELECT p.id, p.name, p.sku, p.description, p.status, p.is_featured, p.is_new_arrival,
            pcat.category_id, pcol.collection_id, pg.gender_id, ps.style_id,
            v.metal_id, v.purity_id, v.metal_color_id, v.metal_weight_g weight,
            pc.fixed_price price, i.quantity_available stock, img.image_path image
     FROM products p
     LEFT JOIN product_categories pcat ON pcat.product_id = p.id
     LEFT JOIN product_collections pcol ON pcol.product_id = p.id
     LEFT JOIN product_genders pg ON pg.product_id = p.id
     LEFT JOIN product_styles ps ON ps.product_id = p.id
     LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     LEFT JOIN inventory i ON i.variant_id = v.id AND i.warehouse_id = 1
     LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = 1
     WHERE p.id = ? LIMIT 1`,
    [Number(id)],
  );
  if (!rows[0]) notFound();

  return (
    <>
      <h1 className="adm-h1">Edit: {rows[0].name}</h1>
      <p className="adm-sub">Changes apply to the product and its default variant.</p>
      <ProductForm product={rows[0]} />
    </>
  );
}
