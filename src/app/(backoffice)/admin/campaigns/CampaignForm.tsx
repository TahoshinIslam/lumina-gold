import { query } from '@/server/db/client';
import { saveCampaignAction } from '../actions';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

export type CampaignFormData = {
  id?: number; title?: string; description?: string | null;
  start_at?: string | Date; end_at?: string | Date;
  section?: string; is_home_featured?: number; is_published?: number;
};

const SECTIONS = [
  { value: 'home_top', label: 'Home — Top' },
  { value: 'home_middle', label: 'Home — Middle' },
  { value: 'home_bottom', label: 'Home — Bottom' },
];

/** DATETIME (or datetime-local string) → value a <input type="datetime-local"> accepts. */
function toLocalInput(value: string | Date | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function loadAssignedProductIds(campaignId?: number) {
  if (!campaignId) return new Set<number>();
  const rows = await query<{ product_id: number }>(
    'SELECT product_id FROM campaign_products WHERE campaign_id = ?', [campaignId],
  );
  return new Set(rows.map(r => r.product_id));
}

/** Field markup only — see ProductFormFields for why this is split from the <form> tag. */
export async function CampaignFormFields({ campaign, error }: { campaign: CampaignFormData; error?: string }) {
  const c = campaign;
  const [products, assigned] = await Promise.all([
    query<{ id: number; name: string; sku: string }>('SELECT id, name, sku FROM products ORDER BY name'),
    loadAssignedProductIds(c.id),
  ]);

  return (
    <>
      {c.id && <input type="hidden" name="id" value={c.id} />}
      {error === 'missing' && <div className="adm-error">Title, start time, and end time are required.</div>}
      {error === 'dates' && <div className="adm-error">End time must be after the start time.</div>}

      <div className="adm-field">
        <label>Title</label>
        <input name="title" placeholder="e.g. Eid Flash Sale" defaultValue={c.title || ''} required autoFocus />
      </div>

      <div className="adm-field">
        <label>Description</label>
        <textarea name="description" rows={2} defaultValue={c.description || ''} />
      </div>

      <div className="adm-grid2">
        <div className="adm-field">
          <label>Start time</label>
          <input name="start_at" type="datetime-local" defaultValue={toLocalInput(c.start_at)} required />
        </div>
        <div className="adm-field">
          <label>End time</label>
          <input name="end_at" type="datetime-local" defaultValue={toLocalInput(c.end_at)} required />
        </div>
      </div>

      <div className="adm-field">
        <label>Display section</label>
        <select name="section" defaultValue={c.section || 'home_middle'}>
          {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <label className="adm-check">
          <input type="checkbox" name="is_home_featured" defaultChecked={!!c.is_home_featured} /> Show on home page
        </label>
        <label className="adm-check">
          <input type="checkbox" name="is_published" defaultChecked={c.is_published === undefined || !!c.is_published} /> Published
        </label>
      </div>
      <p className="adm-sub" style={{ marginTop: -12, marginBottom: 0 }}>
        Only one campaign can be featured on the home page at a time — enabling this unfeatures any other.
      </p>

      <div className="adm-field">
        <label>Campaign products</label>
        {products.length === 0 ? (
          <p className="adm-sub" style={{ marginTop: 4 }}>No products in the catalogue yet.</p>
        ) : (
          <div className="adm-picker">
            {products.map(p => (
              <label key={p.id} className="adm-picker-row">
                <input type="checkbox" name="product_ids" value={p.id} defaultChecked={assigned.has(p.id)} />
                <span>{p.name}</span>
                <span className="adm-picker-sku">{p.sku}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/** Full-page usage (direct-link / hard-refresh fallback for the intercepted drawer route). */
export default async function CampaignForm({ campaign, error }: { campaign: CampaignFormData; error?: string }) {
  return (
    <AdminFormShell action={saveCampaignAction} submitLabel={campaign.id ? 'Save changes' : 'Add campaign'}
      cancelHref="/admin/campaigns">
      <CampaignFormFields campaign={campaign} error={error} />
    </AdminFormShell>
  );
}
