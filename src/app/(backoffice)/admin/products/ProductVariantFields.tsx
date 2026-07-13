'use client';

import { useMemo, useState } from 'react';
import ProductVariantsEditor, { InitialVariant, PurityOption, SizeOption } from './ProductVariantsEditor';
import { ConfirmButton } from '@/features/admin/components/AdminFeedback';
import { specFieldsFor, variantAxesFor } from '@/config/sizes';
import { Check } from 'lucide-react';

type Option = { id: number; name: string };
type CategoryOption = Option & { slug: string };

const CERT_ISSUERS = ['GIA', 'IGI', 'HRD', 'SGL', 'AGS', 'Other'];

/** Multi-select rendered as a compact wrapping choice array. */
function Picker({ label, name, options, selected, onToggle, hint }: {
  label: string; name: string; options: { id: number; label: string }[]; selected: Set<number>;
  onToggle?: (id: number) => void; hint?: string;
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {hint && <p className="adm-sub" style={{ marginTop: -2, marginBottom: 8 }}>{hint}</p>}
      {options.length === 0 ? (
        <p className="adm-sub" style={{ marginTop: 4 }}>None available yet.</p>
      ) : (
        <div className="adm-choice-array">
          {options.map(o => (
            <label key={o.id} className="adm-choice-chip">
              <input
                type="checkbox"
                name={name}
                value={o.id}
                defaultChecked={selected.has(o.id)}
                onChange={onToggle ? () => onToggle(o.id) : undefined}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ label, name, options, value, required }: {
  label: string; name: string; options: Option[]; value?: number | null; required?: boolean;
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      <select name={name} defaultValue={value ?? ''} required={required}
        className={value ? 'adm-select--selected' : ''}>
        <option value="">—</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </div>
  );
}

export interface ProductVariantFieldsProps {
  categories: CategoryOption[];
  selectedCategoryIds: Set<number>;
  productSku: string;
  purityOptions: PurityOption[];
  /** Values for every selectable size axis, keyed by attributes.code. */
  sizeOptionsByCode: Record<string, SizeOption[]>;
  /** Existing measured dimensions, keyed by attributes.code (edit only). */
  initialSpecs: Record<string, string>;
  initialVariants: InitialVariant[];
  stoneTypes: Option[];
  diamondShapes: Option[];
  diamondColors: Option[];
  diamondClarities: Option[];
  diamondCuts: Option[];
  initialHasDiamonds: boolean;
  initialStoneTypeId?: number | null;
  initialDiamondType: 'natural' | 'lab_grown';
  initialShapeId?: number | null;
  initialColorId?: number | null;
  initialClarityId?: number | null;
  initialCutId?: number | null;
  initialCaratEach?: number | null;
  initialCaratTotal?: number | null;
  initialQuantity?: number | null;
  initialCertIssuer?: string | null;
  initialCertNumber?: string | null;
}

/**
 * Category checkbox picker plus everything that depends on which categories
 * are checked: the Variants & Pricing table (Ring Size axis for Rings, Chain
 * & Necklace Length axis for Chains/Necklaces) and the optional Diamond
 * Information section. These have to live in one client component so
 * toggling a category checkbox can instantly show/hide the sections below it
 * — the rest of the product form stays server-rendered.
 */
export default function ProductVariantFields({
  categories, selectedCategoryIds,
  productSku, purityOptions, sizeOptionsByCode, initialSpecs, initialVariants,
  stoneTypes, diamondShapes, diamondColors, diamondClarities, diamondCuts,
  initialHasDiamonds, initialDiamondType,
  initialStoneTypeId,
  initialShapeId, initialColorId, initialClarityId, initialCutId,
  initialCaratEach, initialCaratTotal, initialQuantity,
  initialCertIssuer, initialCertNumber,
}: ProductVariantFieldsProps) {
  const [checkedCategoryIds, setCheckedCategoryIds] = useState<Set<number>>(selectedCategoryIds);
  const [hasDiamonds, setHasDiamonds] = useState(initialHasDiamonds);
  const diamondTypeId = stoneTypes.find(s => s.name.toLowerCase() === 'diamond')?.id ?? null;
  const [stoneTypeId, setStoneTypeId] = useState<number | null>(initialStoneTypeId ?? diamondTypeId);

  const toggleCategory = (id: number) => {
    setCheckedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const checkedSlugs = useMemo(
    () => categories.filter(c => checkedCategoryIds.has(c.id)).map(c => c.slug),
    [categories, checkedCategoryIds],
  );

  /* What the checked categories imply — driven by config/sizes.ts, not by
     guessing from the category NAME (which is what previously made "Rings"
     work but left Bangles and Sitahar with no size at all). */
  const sizeAxis = useMemo(() => {
    const axis = checkedSlugs.flatMap(variantAxesFor)[0];
    if (!axis) return null;
    return { code: axis.code, label: axis.label, options: sizeOptionsByCode[axis.code] ?? [] };
  }, [checkedSlugs, sizeOptionsByCode]);

  // Dimensions are measured, never chosen — so they are plain inputs here and
  // are stored per product, not multiplied into the variant table.
  const specFields = useMemo(() => {
    const seen = new Map<string, ReturnType<typeof specFieldsFor>[number]>();
    for (const slug of checkedSlugs) for (const f of specFieldsFor(slug)) seen.set(f.code, f);
    return [...seen.values()];
  }, [checkedSlugs]);
  const selectedStoneName = stoneTypes.find(s => s.id === stoneTypeId)?.name;
  const isDiamond = selectedStoneName?.toLowerCase() === 'diamond';

  return (
    <>
      <Picker
        label="Category" name="category_ids"
        options={categories.map(c => ({ id: c.id, label: c.name }))}
        selected={selectedCategoryIds}
        onToggle={toggleCategory}
      />

      <ProductVariantsEditor
        productSku={productSku}
        purityOptions={purityOptions}
        sizeAxis={sizeAxis}
        initialVariants={initialVariants}
      />

      {specFields.length > 0 && (
        <div className="adm-field">
          <label>Specifications</label>
          <p className="adm-sub" style={{ marginTop: -2, marginBottom: 8 }}>
            Measured dimensions for this piece. Shown to customers under Specifications — they do
            not create variants or SKUs.
          </p>
          <div className="adm-grid3">
            {specFields.map(field => (
              <div className="adm-field" key={field.code}>
                <label>{field.label}</label>
                <input
                  name={`spec_${field.code}`}
                  placeholder={field.placeholder}
                  defaultValue={initialSpecs[field.code] ?? ''}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="adm-choice-array adm-choice-array--flags">
        {hasDiamonds ? (
          <ConfirmButton title="Remove gemstone information?"
            description="Stone specifications and certificate metadata will be removed when the product is saved."
            confirmLabel="Remove information" className="adm-choice-button is-selected" ariaPressed
            onConfirm={() => setHasDiamonds(false)}>
            <Check size={14} /> Gemstone details
          </ConfirmButton>
        ) : (
          <button type="button" className="adm-choice-button" aria-pressed={false} onClick={() => setHasDiamonds(true)}>
            Gemstone details
          </button>
        )}
        {hasDiamonds && <input type="hidden" name="has_diamonds" value="1" />}
      </div>

      {hasDiamonds && (
        <div className="adm-diamond-panel">
          <h3 className="adm-h2" style={{ fontSize: 15, marginBottom: 12 }}>Gemstone information</h3>

          <div className="adm-grid3">
            <div className="adm-field">
              <label>Stone Type</label>
              <select name="stone_type_id" value={stoneTypeId ?? ''}
                className={stoneTypeId ? 'adm-select--selected' : ''}
                onChange={e => setStoneTypeId(Number(e.target.value) || null)}>
                <option value="">—</option>
                {stoneTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            {isDiamond && (
              <div className="adm-field">
                <label>Diamond Type</label>
                <select name="diamond_type" defaultValue={initialDiamondType} className="adm-select--selected">
                  <option value="natural">Natural</option>
                  <option value="lab_grown">Lab-Grown</option>
                </select>
              </div>
            )}
            <Select label="Shape" name="diamond_shape_id" options={diamondShapes} value={initialShapeId} />
            <div className="adm-field">
              <label>Carat weight (per stone)</label>
              <input name="diamond_carat_each" type="number" step="0.01" min="0" defaultValue={initialCaratEach ?? ''} />
            </div>
          </div>

          <div className="adm-grid3">
            <Select label="Color grade" name="diamond_color_id" options={diamondColors} value={initialColorId} />
            <Select label="Clarity grade" name="diamond_clarity_id" options={diamondClarities} value={initialClarityId} />
            <Select label="Cut grade" name="diamond_cut_id" options={diamondCuts} value={initialCutId} />
          </div>

          <div className="adm-grid3">
            <div className="adm-field">
              <label>Number of stones</label>
              <input name="diamond_quantity" type="number" min="1" step="1" defaultValue={initialQuantity ?? 1} />
            </div>
            <div className="adm-field">
              <label>Total diamond weight (CTW)</label>
              <input name="diamond_carat_total" type="number" step="0.01" min="0" defaultValue={initialCaratTotal ?? ''} />
            </div>
            <div className="adm-field">
              <label>Certification</label>
              <select name="diamond_cert_issuer" defaultValue={initialCertIssuer || ''}>
                <option value="">— none —</option>
                {CERT_ISSUERS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="adm-field">
            <label>Certificate number</label>
            <input name="diamond_cert_number" placeholder="e.g. GIA 2141438212" defaultValue={initialCertNumber || ''} />
          </div>
        </div>
      )}
    </>
  );
}
