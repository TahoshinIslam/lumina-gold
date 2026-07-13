import { query } from '@/server/db/client';
import { addSizeAction, deleteSizeAction } from '../actions';
import { AdminInlineForm, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import {
  CATEGORY_SPEC_FIELDS, SPEC_FIELDS, SizeAxis, VARIANT_AXES, categoriesForAxis,
} from '@/config/sizes';
import { X } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SizeRow = { id: number; value: string; code: string };

/** Values for the SELECTABLE axes only — spec fields have no shared option list
 *  by design (they are measured per product, see config/sizes.ts). */
async function variantAxisValues() {
  return query<SizeRow>(
    `SELECT av.id, av.value, a.code
     FROM attribute_values av JOIN attributes a ON a.id = av.attribute_id
     WHERE a.is_variant_level = 1
     ORDER BY av.sort_order, CAST(av.value AS UNSIGNED), av.value`,
  );
}

async function categoryNames() {
  const rows = await query<{ slug: string; name: string }>('SELECT slug, name FROM categories');
  return new Map(rows.map(r => [r.slug, r.name]));
}

function SizeGroup({ axis, rows, appliesTo }: { axis: SizeAxis; rows: SizeRow[]; appliesTo: string }) {
  return (
    <div className="adm-card" style={{ marginBottom: 24 }}>
      <h2 className="adm-h2" style={{ marginBottom: 4 }}>{axis.label}</h2>
      <p className="adm-sub" style={{ marginBottom: 6 }}>{axis.hint}</p>
      <p className="adm-sub" style={{ marginBottom: 16, fontSize: 12 }}>
        <strong>Applies to:</strong> {appliesTo || 'no categories yet'}
      </p>

      <AdminInlineForm action={addSizeAction} successMessage="Size added successfully" resetOnSuccess
        className="adm-inline-form" style={{ marginBottom: 18 }}>
        <input type="hidden" name="code" value={axis.code} />
        <div className="adm-field" style={{ width: 220 }}>
          <label>Add a value</label>
          <input name="value" placeholder={axis.placeholder} required />
        </div>
        <button className="adm-btn" type="submit">Add</button>
      </AdminInlineForm>

      <div className="adm-chip-row">
        {rows.length === 0 ? (
          <span className="adm-sub">No values yet — add one above.</span>
        ) : rows.map(r => (
          <ConfirmActionButton key={r.id}
            action={deleteSizeAction}
            values={{ id: r.id }}
            title={`Remove “${r.value}”?`}
            description="Products currently using this value keep their existing variant, but it will no longer be offered as an option."
            confirmLabel="Remove size"
            className="adm-size-chip"
            ariaLabel={`Remove ${r.value}`}
            successMessage="Size removed successfully"
          >
            <span>{r.value}</span>
            <X size={12} />
          </ConfirmActionButton>
        ))}
      </div>
    </div>
  );
}

export default async function AdminSizesPage() {
  const [values, names] = await Promise.all([variantAxisValues(), categoryNames()]);
  const label = (slug: string) => names.get(slug) ?? slug;

  return (
    <>
      <h1 className="adm-h1">Sizes</h1>
      <p className="adm-sub">
        The store-wide lists of sizes a customer can <strong>choose</strong>. Each choice is a real
        purchasable variant with its own SKU, price and stock, so only options that genuinely change
        what someone is buying belong here.
      </p>

      <div style={{ maxWidth: 640, marginTop: 20 }}>
        {VARIANT_AXES.map(axis => (
          <SizeGroup
            key={axis.code}
            axis={axis}
            rows={values.filter(v => v.code === axis.code)}
            appliesTo={categoriesForAxis(axis.code).map(label).join(' · ')}
          />
        ))}

        {/* Dimensions deliberately have no list here — see config/sizes.ts. */}
        <div className="adm-card">
          <h2 className="adm-h2" style={{ marginBottom: 4 }}>Specifications</h2>
          <p className="adm-sub" style={{ marginBottom: 14 }}>
            Dimensions are <strong>measured per product</strong>, not chosen from a list, so they are
            entered on the product itself and shown to customers under Specifications. They never
            create a SKU — a locket with 3 heights × 3 widths × 2 thicknesses would otherwise become
            18 variants of an item sold exactly one way.
          </p>
          <table className="adm-table">
            <thead><tr><th>Category</th><th>Recorded on the product</th></tr></thead>
            <tbody>
              {Object.entries(CATEGORY_SPEC_FIELDS).map(([slug, codes]) => (
                <tr key={slug}>
                  <td><strong>{label(slug)}</strong></td>
                  <td>{codes
                    .map(code => SPEC_FIELDS.find(f => f.code === code)?.label ?? code)
                    .join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
