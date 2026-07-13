import { unstable_cache } from 'next/cache';
import { query } from '@/server/db/client';
import { saveProductAction, nextSku } from '../actions';
import ImageGallery, { GalleryImage } from './ImageGallery';
import CertificateUpload from './CertificateUpload';
import ProductVariantFields from './ProductVariantFields';
import type { InitialVariant, PurityOption } from './ProductVariantsEditor';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

type Option = { id: number; name: string };
/** Categories carry their slug — the size-axis map is keyed by slug. */
type CategoryOption = Option & { slug: string };

export type ProductFormData = {
  id?: number; name?: string; sku?: string; slug?: string; description?: string; status?: string;
  is_featured?: number; is_new_arrival?: number; is_best_seller?: number;
  metal_id?: number | null; metal_color_id?: number | null;
  discount_amount?: number | null; availability?: string | null;
  has_diamond?: number; is_lab_grown?: number;
  stone_type_id?: number | null;
  diamond_shape_id?: number | null; diamond_color_id?: number | null;
  diamond_clarity_id?: number | null; diamond_cut_id?: number | null;
  diamond_carat_each?: number | null; diamond_carat_total?: number | null; diamond_quantity?: number | null;
  diamond_cert_issuer?: string | null; diamond_cert_number?: string | null;
  meta_title?: string | null; meta_description?: string | null;
  meta_keywords?: string | null; og_image?: string | null;
};

type SizeOption = { id: number; value: string };
type SizeValueRow = SizeOption & { code: string };

const loadProductLookups = unstable_cache(async () => {
  const [
    categories, collections, genders, occasions, styles, tags, metals, purities, colors,
    stoneTypes, diamondShapes, diamondColors, diamondClarities, diamondCuts,
    sizeValues,
  ] = await Promise.all([
    query<CategoryOption>('SELECT id, name, slug FROM categories ORDER BY sort_order, name'),
    query<Option>('SELECT id, name FROM collections ORDER BY sort_order, name'),
    query<Option>('SELECT id, name FROM genders ORDER BY id'),
    query<Option>('SELECT id, name FROM occasions ORDER BY name'),
    query<Option>('SELECT id, name FROM styles ORDER BY name'),
    query<Option>('SELECT id, name FROM tags ORDER BY name'),
    query<Option>('SELECT id, name FROM metals ORDER BY id'),
    query<PurityOption>(`SELECT mp.id, mp.name code, CONCAT(m.name, ' ', mp.name) label
                   FROM metal_purities mp JOIN metals m ON m.id = mp.metal_id ORDER BY mp.id`),
    query<Option>('SELECT id, name FROM metal_colors ORDER BY id'),
    query<Option>('SELECT id, name FROM stone_types ORDER BY name'),
    query<Option>('SELECT id, name FROM stone_shapes ORDER BY name'),
    query<Option>('SELECT id, name FROM stone_colors ORDER BY name'),
    query<Option>('SELECT id, name FROM stone_clarities ORDER BY id'),
    query<Option>('SELECT id, name FROM stone_cuts ORDER BY id'),
    // Every SELECTABLE axis at once (is_variant_level = 1). Dimensions are
    // excluded by that flag — they are specs, not options.
    query<SizeValueRow>(
      `SELECT av.id, av.value, a.code FROM attribute_values av JOIN attributes a ON a.id = av.attribute_id
       WHERE a.is_variant_level = 1
       ORDER BY av.sort_order, CAST(av.value AS UNSIGNED), av.value`,
    ),
  ]);
  const sizeOptionsByCode: Record<string, SizeOption[]> = {};
  for (const row of sizeValues) {
    (sizeOptionsByCode[row.code] ??= []).push({ id: row.id, value: row.value });
  }

  return {
    categories, collections, genders, occasions, styles, tags, metals, purities, colors,
    stoneTypes, diamondShapes, diamondColors, diamondClarities, diamondCuts,
    sizeOptionsByCode,
  };
}, ['admin-product-lookups-v2'], { tags: ['admin-product-lookups'], revalidate: 300 });

/** Which many-to-many rows a product already has, for pre-checking the pickers. */
async function loadRelations(productId?: number) {
  const empty = {
    categories: new Set<number>(), collections: new Set<number>(),
    genders: new Set<number>(), occasions: new Set<number>(),
    styles: new Set<number>(), tags: new Set<number>(),
  };
  if (!productId) return empty;
  const rows = await query<{ kind: string; id: number }>(
    `SELECT 'category' kind, category_id id FROM product_categories WHERE product_id = ?
     UNION ALL SELECT 'collection', collection_id FROM product_collections WHERE product_id = ?
     UNION ALL SELECT 'gender', gender_id FROM product_genders WHERE product_id = ?
     UNION ALL SELECT 'occasion', occasion_id FROM product_occasions WHERE product_id = ?
     UNION ALL SELECT 'style', style_id FROM product_styles WHERE product_id = ?
     UNION ALL SELECT 'tag', tag_id FROM product_tags WHERE product_id = ?`,
    [productId, productId, productId, productId, productId, productId],
  );
  const ids = (kind: string) => new Set(rows.filter(r => r.kind === kind).map(r => r.id));
  return {
    categories: ids('category'), collections: ids('collection'), genders: ids('gender'),
    occasions: ids('occasion'), styles: ids('style'), tags: ids('tag'),
  };
}

/** Every real variant row a product already has (any status), for the Variants & Pricing editor. */
async function loadVariants(productId?: number): Promise<InitialVariant[]> {
  if (!productId) return [];
  const rows = await query<{
    id: number; sku: string; purity_id: number | null; price: number | null; compare_price: number | null;
    cost_price: number | null; stock: number | null; weight: number | null; barcode: string | null; status: string;
    size_value_id: number | null;
  }>(
    `SELECT v.id, v.variant_sku sku, v.purity_id, v.metal_weight_g weight, v.barcode, v.status,
            pc.fixed_price price, pc.compare_price, pc.cost_price, i.quantity_available stock,
            MAX(CASE WHEN a.is_variant_level = 1 THEN va.attribute_value_id END) size_value_id
     FROM product_variants v
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     LEFT JOIN inventory i ON i.variant_id = v.id AND i.warehouse_id = 1
     LEFT JOIN variant_attributes va ON va.variant_id = v.id
     LEFT JOIN attribute_values av ON av.id = va.attribute_value_id
     LEFT JOIN attributes a ON a.id = av.attribute_id
     WHERE v.product_id = ?
     GROUP BY v.id
     ORDER BY v.is_default DESC, v.id`,
    [productId],
  );

  return rows.map(r => ({
    id: r.id,
    purityId: r.purity_id,
    sizeValueId: r.size_value_id,
    sku: r.sku,
    price: r.price,
    comparePrice: r.compare_price,
    costPrice: r.cost_price,
    stock: r.stock,
    weight: r.weight,
    barcode: r.barcode,
    status: r.status === 'active' ? 'active' : 'inactive',
  }));
}

/** Single-value variant attribute (Metal / Purity / Colour). */
function Select({ label, name, options, value, required = false }: {
  label: string; name: string; options: Option[]; value?: number | null; required?: boolean;
}) {
  return (
    <div className="adm-field">
      <label>{label}{required && <span aria-hidden> *</span>}</label>
      <select name={name} defaultValue={value ?? ''} required={required}
        className={value ? 'adm-select--selected' : ''}>
        <option value="">—</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </div>
  );
}

/** Compact multi-value taxonomy rendered as a wrapping choice array. */
function CheckboxPicker({ label, name, options, selected }: {
  label: string; name: string; options: Option[]; selected: Set<number>;
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {options.length === 0 ? (
        <p className="adm-sub" style={{ marginTop: 4 }}>None available yet.</p>
      ) : (
        <div className="adm-choice-array">
          {options.map(o => (
            <label key={o.id} className="adm-choice-chip">
              <input type="checkbox" name={name} value={o.id} defaultChecked={selected.has(o.id)} />
              <span>{o.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export async function loadProduct(id: number) {
  const rows = await query<ProductFormData & { name: string }>(
    `SELECT p.id, p.name, p.sku, p.slug, p.description, p.status, p.is_featured, p.is_new_arrival, p.is_best_seller,
            v.metal_id, v.metal_color_id,
            pc.discount_amount, i.availability,
            (vs.id IS NOT NULL) has_diamond, vs.stone_type_id, vs.is_lab_grown,
            vs.stone_shape_id diamond_shape_id, vs.stone_color_id diamond_color_id,
            vs.stone_clarity_id diamond_clarity_id, vs.stone_cut_id diamond_cut_id,
            vs.carat_each diamond_carat_each, vs.carat_total diamond_carat_total, vs.quantity diamond_quantity,
            cert.issuer diamond_cert_issuer, cert.certificate_no diamond_cert_number,
            seo.meta_title, seo.meta_description, seo.meta_keywords, seo.og_image
     FROM products p
     LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_default = 1
     LEFT JOIN variant_price_components pc ON pc.variant_id = v.id
     LEFT JOIN inventory i ON i.variant_id = v.id AND i.warehouse_id = 1
     LEFT JOIN variant_stones vs ON vs.id = (
       SELECT first_vs.id FROM variant_stones first_vs
       WHERE first_vs.variant_id = v.id ORDER BY first_vs.is_center_stone DESC, first_vs.id LIMIT 1
     )
     LEFT JOIN certificates cert ON cert.variant_id = v.id
     LEFT JOIN seo_meta seo ON seo.entity_type = 'product' AND seo.entity_id = p.id
     WHERE p.id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

/** The product's measured dimensions, keyed by attributes.code. Never variants. */
async function loadSpecs(productId?: number): Promise<Record<string, string>> {
  if (!productId) return {};
  const rows = await query<{ code: string; value: string }>(
    `SELECT a.code, ps.value FROM product_specifications ps
     JOIN attributes a ON a.id = ps.attribute_id WHERE ps.product_id = ?`,
    [productId],
  );
  return Object.fromEntries(rows.map(r => [r.code, r.value]));
}

/** All uploaded images for a product, for the gallery editor. */
export async function loadImages(productId?: number): Promise<GalleryImage[]> {
  if (!productId) return [];
  const rows = await query<{ id: number; image_path: string; is_primary: number }>(
    'SELECT id, image_path, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order, id',
    [productId],
  );
  return rows.map(r => ({ id: r.id, path: r.image_path, isPrimary: !!r.is_primary }));
}

/** Field markup only — no <form> tag, no submit button — so it can be reused
 * inside both a plain page form and the AdminDrawer's own <form>. */
export async function ProductFormFields({ product, error }: { product: ProductFormData; error?: string }) {
  const p = product;
  const [lk, rel, images, variants, specs] = await Promise.all([
    loadProductLookups(), loadRelations(p.id), loadImages(p.id), loadVariants(p.id), loadSpecs(p.id),
  ]);
  // SKU is system-owned: reuse it on edit, reserve the next one for a new
  // product so images can be uploaded under a stable, collision-free folder.
  const sku = p.id ? (p.sku || '') : await nextSku();
  const previewTitle = p.meta_title || p.name || 'Product Title';
  const previewDesc = p.meta_description || 'Product description will appear here…';

  return (
    <div className="adm-tabs">
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <input type="radio" name="ptab" id="tab-basic" className="adm-tab-radio" defaultChecked />
      <input type="radio" name="ptab" id="tab-seo" className="adm-tab-radio" />
      <div className="adm-tab-list">
        <label htmlFor="tab-basic" className="adm-tab-btn">Basic Info</label>
        <label htmlFor="tab-seo" className="adm-tab-btn">SEO</label>
      </div>

      <div className="adm-tab-panel" data-tab="basic">
        {error === 'missing' && <div className="adm-error">Product name is required.</div>}
        {error === 'metal' && <div className="adm-error">Metal is required — pick one under Classification.</div>}

        <details className="adm-form-section" open>
          <summary className="adm-form-section-head"><span>Product identity</span></summary>
          <div className="adm-identity-grid">
            <div className="adm-field adm-field--wide">
              <label>Name</label>
              <input name="name" defaultValue={p.name || ''} required autoFocus />
            </div>
            <div className="adm-field">
              <label>SKU · auto-generated</label>
              <input name="sku" defaultValue={sku} readOnly tabIndex={-1}
                style={{ background: 'var(--surface-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }} />
            </div>
            <div className="adm-field adm-field--full">
              <label>Description</label>
              <textarea name="description" rows={2} defaultValue={p.description || ''} />
            </div>
          </div>
        </details>

        <details className="adm-form-section" open>
          <summary className="adm-form-section-head"><span>Classification</span></summary>
          <div className="adm-classification-grid">
            {/* Required: with no metal the storefront cannot say what a piece is
                made of, and a gemstone piece has no body to name. */}
            <Select label="Metal" name="metal_id" options={lk.metals} value={p.metal_id} required />
            <Select label="Metal color" name="metal_color_id" options={lk.colors} value={p.metal_color_id} />
            <div className="adm-field adm-field--categories">
              <ProductVariantFields
                categories={lk.categories} selectedCategoryIds={rel.categories}
                productSku={sku} purityOptions={lk.purities}
                sizeOptionsByCode={lk.sizeOptionsByCode} initialSpecs={specs}
                initialVariants={variants}
                stoneTypes={lk.stoneTypes}
                diamondShapes={lk.diamondShapes} diamondColors={lk.diamondColors}
                diamondClarities={lk.diamondClarities} diamondCuts={lk.diamondCuts}
                initialHasDiamonds={!!p.has_diamond}
                initialStoneTypeId={p.stone_type_id}
                initialDiamondType={p.is_lab_grown ? 'lab_grown' : 'natural'}
                initialShapeId={p.diamond_shape_id} initialColorId={p.diamond_color_id}
                initialClarityId={p.diamond_clarity_id} initialCutId={p.diamond_cut_id}
                initialCaratEach={p.diamond_carat_each} initialCaratTotal={p.diamond_carat_total}
                initialQuantity={p.diamond_quantity}
                initialCertIssuer={p.diamond_cert_issuer} initialCertNumber={p.diamond_cert_number}
              />
            </div>
          </div>
        </details>

        <details className="adm-form-section" open>
          <summary className="adm-form-section-head"><span>Audience &amp; merchandising</span></summary>
          <div className="adm-taxonomy-grid">
            <CheckboxPicker label="Collection" name="collection_ids" options={lk.collections} selected={rel.collections} />
            <CheckboxPicker label="Recipient" name="gender_ids" options={lk.genders} selected={rel.genders} />
            <CheckboxPicker label="Occasion" name="occasion_ids" options={lk.occasions} selected={rel.occasions} />
            <CheckboxPicker label="Style" name="style_ids" options={lk.styles} selected={rel.styles} />
            <CheckboxPicker label="Tags" name="tag_ids" options={lk.tags} selected={rel.tags} />
          </div>
        </details>

        <details className="adm-form-section" open>
          <summary className="adm-form-section-head"><span>Commerce</span></summary>
          <div className="adm-grid3">
            <div className="adm-field">
              <label>Discount amount (৳)</label>
              <input name="discount_amount" type="number" step="0.01" min="0" placeholder="Optional" defaultValue={p.discount_amount ?? ''} />
            </div>
            <div className="adm-field">
              <label>Availability</label>
              <select name="availability" defaultValue={p.availability || 'in_stock'}>
                <option value="in_stock">In Stock</option>
                <option value="made_to_order">Made to Order</option>
                <option value="ready_to_ship">Ready to Ship</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="adm-field">
              <label>Status</label>
              <select name="status" defaultValue={p.status || 'active'}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="adm-choice-array adm-choice-array--flags">
            <label className="adm-choice-chip">
              <input type="checkbox" name="featured" defaultChecked={!!p.is_featured} /><span>Featured</span>
            </label>
            <label className="adm-choice-chip">
              <input type="checkbox" name="new_arrival" defaultChecked={!!p.is_new_arrival} /><span>New arrival</span>
            </label>
            <label className="adm-choice-chip">
              <input type="checkbox" name="best_seller" defaultChecked={!!p.is_best_seller} /><span>Best seller</span>
            </label>
          </div>
        </details>

        <details className="adm-form-section" open>
          <summary className="adm-form-section-head"><span>Media</span></summary>
          <div className="adm-media-grid">
            <ImageGallery initial={images} />
            <CertificateUpload sku={sku} hasExisting={!!p.id} />
          </div>
        </details>
      </div>

      <div className="adm-tab-panel" data-tab="seo">
        <div className="adm-field">
          <label>Meta title</label>
          <input name="meta_title" placeholder="Custom SEO title (leave empty to use product title)"
            defaultValue={p.meta_title || ''} />
        </div>
        <div className="adm-field">
          <label>Meta description</label>
          <textarea name="meta_description" rows={3}
            placeholder="Custom SEO description (leave empty to use product description)"
            defaultValue={p.meta_description || ''} />
        </div>
        <div className="adm-field">
          <label>SEO keywords</label>
          <input name="meta_keywords" placeholder="Comma-separated, e.g. gold ring, engagement, 18k"
            defaultValue={p.meta_keywords || ''} />
        </div>
        <div className="adm-field">
          <label>OG image URL</label>
          <input name="og_image" placeholder="Open Graph image URL (leave empty to use product image)"
            defaultValue={p.og_image || ''} />
        </div>

        <div className="adm-seo-preview">
          <div className="lbl">SEO Preview</div>
          <div className="title">{previewTitle}</div>
          <div className="url">yourstore.com/product/{p.slug || '…'}</div>
          <div className="desc">{previewDesc}</div>
        </div>
      </div>
    </div>
  );
}

/** Full-page usage (direct-link / hard-refresh fallback for the intercepted drawer route). */
export default async function ProductForm({ product, error }: { product: ProductFormData; error?: string }) {
  return (
    <AdminFormShell action={saveProductAction}
      submitLabel={product.id ? 'Save changes' : 'Create product'} cancelHref="/admin/products">
      <ProductFormFields product={product} error={error} />
    </AdminFormShell>
  );
}
