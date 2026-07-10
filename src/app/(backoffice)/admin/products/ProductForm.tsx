import { query } from '@/server/db/client';
import { saveProductAction } from '../actions';
import ImageUpload from './ImageUpload';

type Option = { id: number; name: string };

export type ProductFormData = {
  id?: number; name?: string; sku?: string; description?: string; status?: string;
  is_featured?: number; is_new_arrival?: number;
  category_id?: number | null; collection_id?: number | null;
  gender_id?: number | null; style_id?: number | null;
  metal_id?: number | null; purity_id?: number | null; metal_color_id?: number | null;
  price?: number | null; stock?: number | null; weight?: number | null; image?: string | null;
};

async function lookups() {
  const [categories, collections, genders, styles, metals, purities, colors] = await Promise.all([
    query<Option>('SELECT id, name FROM categories ORDER BY sort_order, name'),
    query<Option>('SELECT id, name FROM collections ORDER BY sort_order, name'),
    query<Option>('SELECT id, name FROM genders ORDER BY id'),
    query<Option>('SELECT id, name FROM styles ORDER BY name'),
    query<Option>('SELECT id, name FROM metals ORDER BY id'),
    query<Option>(`SELECT mp.id, CONCAT(m.name, ' ', mp.name) name
                   FROM metal_purities mp JOIN metals m ON m.id = mp.metal_id ORDER BY mp.id`),
    query<Option>('SELECT id, name FROM metal_colors ORDER BY id'),
  ]);
  return { categories, collections, genders, styles, metals, purities, colors };
}

function Select({ label, name, options, value }: {
  label: string; name: string; options: Option[]; value?: number | null;
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      <select name={name} defaultValue={value ?? ''}>
        <option value="">—</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </div>
  );
}

export default async function ProductForm({ product }: { product: ProductFormData }) {
  const lk = await lookups();
  const p = product;

  return (
    <form className="adm-form" action={saveProductAction}>
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <div className="adm-grid2">
        <div className="adm-field">
          <label>Name</label>
          <input name="name" defaultValue={p.name || ''} required />
        </div>
        <div className="adm-field">
          <label>SKU</label>
          <input name="sku" defaultValue={p.sku || ''} required />
        </div>
      </div>

      <div className="adm-field">
        <label>Description</label>
        <textarea name="description" rows={3} defaultValue={p.description || ''} />
      </div>

      <div className="adm-grid2">
        <Select label="Category" name="category_id" options={lk.categories} value={p.category_id} />
        <Select label="Collection" name="collection_id" options={lk.collections} value={p.collection_id} />
      </div>
      <div className="adm-grid2">
        <Select label="Recipient" name="gender_id" options={lk.genders} value={p.gender_id} />
        <Select label="Style" name="style_id" options={lk.styles} value={p.style_id} />
      </div>
      <div className="adm-grid3">
        <Select label="Metal" name="metal_id" options={lk.metals} value={p.metal_id} />
        <Select label="Purity" name="purity_id" options={lk.purities} value={p.purity_id} />
        <Select label="Metal color" name="metal_color_id" options={lk.colors} value={p.metal_color_id} />
      </div>

      <div className="adm-grid3">
        <div className="adm-field">
          <label>Price (৳)</label>
          <input name="price" type="number" step="0.01" min="0" defaultValue={p.price ?? ''} required />
        </div>
        <div className="adm-field">
          <label>Stock</label>
          <input name="stock" type="number" min="0" defaultValue={p.stock ?? 0} />
        </div>
        <div className="adm-field">
          <label>Weight (g)</label>
          <input name="weight" type="number" step="0.001" min="0" defaultValue={p.weight ?? ''} />
        </div>
      </div>

      <div className="adm-grid2">
        <ImageUpload initial={p.image} />
        <div className="adm-field">
          <label>Status</label>
          <select name="status" defaultValue={p.status || 'active'}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <label className="adm-check">
          <input type="checkbox" name="featured" defaultChecked={!!p.is_featured} /> Featured
        </label>
        <label className="adm-check">
          <input type="checkbox" name="new_arrival" defaultChecked={!!p.is_new_arrival} /> New arrival
        </label>
      </div>

      <div>
        <button className="adm-btn" type="submit">{p.id ? 'Save changes' : 'Create product'}</button>
      </div>
    </form>
  );
}
