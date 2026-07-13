'use client';

import { memo, useCallback, useState } from 'react';
import { ConfirmButton } from '@/features/admin/components/AdminFeedback';
import { Trash2 } from 'lucide-react';

/**
 * ProductVariantsEditor — real, admin-priced purchasable combinations
 * (e.g. 24K + Size 6), each with its own price/compare/cost/stock/weight/
 * barcode/SKU/status. Replaces the old "which sizes does this product come
 * in" tag picker (that only tagged the single default variant, price never
 * changed) with real per-combination rows.
 *
 * The whole table is serialized into one hidden `variants_json` field on
 * submit — simplest way to move a variable-length structured array through
 * this form's plain `<form action={serverAction}>` submission.
 */

export interface PurityOption { id: number; code: string; label: string }
export interface SizeOption { id: number; value: string }

export interface InitialVariant {
  id?: number;
  purityId: number | null;
  sizeValueId: number | null;
  sku: string;
  price: number | null;
  making_charge?: number | null;
  wastage_percent?: number | null;
  comparePrice: number | null;
  costPrice: number | null;
  stock: number | null;
  weight: number | null;
  barcode: string | null;
  status: 'active' | 'inactive';
}

interface VariantRow {
  key: string;
  id?: number;
  purityId: number | null;
  sizeValueId: number | null;
  sku: string;
  price: string;
  makingCharge: string;
  wastagePercent: string;
  comparePrice: string;
  costPrice: string;
  stock: string;
  weight: string;
  barcode: string;
  status: 'active' | 'inactive';
  selected: boolean;
}

/**
 * One variant row, memoized so typing in one row's price/SKU/etc. doesn't
 * re-render every other row — with dozens of generated variants, re-running
 * the whole table's JSX (and re-diffing every input) on each keystroke was
 * the actual re-render cost in this editor.
 */
const VariantRowView = memo(function VariantRowView({
  variant, purityLabel, sizeValue, hasSizeAxis, canRemove, onUpdate, onRemove,
}: {
  variant: VariantRow;
  purityLabel: string;
  sizeValue: string;
  hasSizeAxis: boolean;
  canRemove: boolean;
  onUpdate: (key: string, patch: Partial<VariantRow>) => void;
  onRemove: (key: string) => void;
}) {
  const v = variant;
  return (
    <tr>
      <td><input type="checkbox" checked={v.selected} onChange={e => onUpdate(v.key, { selected: e.target.checked })} /></td>
      <td>{purityLabel}</td>
      {hasSizeAxis && <td>{sizeValue}</td>}
      <td><input value={v.sku} onChange={e => onUpdate(v.key, { sku: e.target.value })} style={{ width: 130 }} /></td>
      <td><input type="number" step="0.01" min="0" value={v.price} onChange={e => onUpdate(v.key, { price: e.target.value })} style={{ width: 100 }} required /></td>
      {/* Used when the product is priced by the gold rate; harmless when it isn't. */}
      <td><input type="number" step="0.01" min="0" value={v.makingCharge} onChange={e => onUpdate(v.key, { makingCharge: e.target.value })} style={{ width: 90 }} /></td>
      <td><input type="number" step="0.01" min="0" max="100" value={v.wastagePercent} onChange={e => onUpdate(v.key, { wastagePercent: e.target.value })} style={{ width: 80 }} /></td>
      <td><input type="number" step="0.01" min="0" value={v.comparePrice} onChange={e => onUpdate(v.key, { comparePrice: e.target.value })} style={{ width: 100 }} /></td>
      <td><input type="number" step="0.01" min="0" value={v.costPrice} onChange={e => onUpdate(v.key, { costPrice: e.target.value })} style={{ width: 100 }} /></td>
      <td><input type="number" min="0" value={v.stock} onChange={e => onUpdate(v.key, { stock: e.target.value })} style={{ width: 70 }} /></td>
      <td><input type="number" step="0.001" min="0" value={v.weight} onChange={e => onUpdate(v.key, { weight: e.target.value })} style={{ width: 80 }} /></td>
      <td><input value={v.barcode} onChange={e => onUpdate(v.key, { barcode: e.target.value })} style={{ width: 100 }} /></td>
      <td>
        <select value={v.status} onChange={e => onUpdate(v.key, { status: e.target.value as 'active' | 'inactive' })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>
      <td>
        {canRemove && (
          <ConfirmButton title="Remove this variant?"
            description="This variant will be deleted when you save the product."
            confirmLabel="Remove variant" className="adm-btn danger sm"
            onConfirm={() => onRemove(v.key)}><Trash2 size={14} /></ConfirmButton>
        )}
      </td>
    </tr>
  );
});

let tempKeySeq = 0;
const tempKey = () => `new-${++tempKeySeq}`;

const toRow = (v: InitialVariant): VariantRow => ({
  key: v.id ? `db-${v.id}` : tempKey(),
  id: v.id,
  purityId: v.purityId,
  sizeValueId: v.sizeValueId,
  sku: v.sku,
  price: v.price != null ? String(v.price) : '',
  makingCharge: v.making_charge != null ? String(v.making_charge) : '',
  wastagePercent: v.wastage_percent != null ? String(v.wastage_percent) : '',
  comparePrice: v.comparePrice != null ? String(v.comparePrice) : '',
  costPrice: v.costPrice != null ? String(v.costPrice) : '',
  stock: v.stock != null ? String(v.stock) : '0',
  weight: v.weight != null ? String(v.weight) : '',
  barcode: v.barcode ?? '',
  status: v.status,
  selected: false,
});

/** The one customer-selectable size axis this product's category sells on —
 *  Ring Size, Bangle Size or Length. Null when the category has none (a
 *  bracelet), in which case the product is a single un-sized variant. Only
 *  selectable axes reach here: dimensions are specs, never a variant. */
export interface SizeAxisDef { code: string; label: string; options: SizeOption[] }

export default function ProductVariantsEditor({
  productSku,
  purityOptions,
  sizeAxis,
  initialVariants,
}: {
  productSku: string;
  purityOptions: PurityOption[];
  sizeAxis: SizeAxisDef | null;
  initialVariants: InitialVariant[];
}) {
  const [variants, setVariants] = useState<VariantRow[]>(
    initialVariants.length
      ? initialVariants.map(toRow)
      : [toRow({
          id: undefined, purityId: null, sizeValueId: null, sku: `${productSku}-01`,
          price: null, comparePrice: null, costPrice: null, stock: 0, weight: null, barcode: null, status: 'active',
        })],
  );
  const [genPurityIds, setGenPurityIds] = useState<Set<number>>(
    new Set(initialVariants.map(v => v.purityId).filter((id): id is number => id != null)),
  );
  const [genSizeIds, setGenSizeIds] = useState<Set<number>>(
    new Set(initialVariants.map(v => v.sizeValueId).filter((id): id is number => id != null)),
  );
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkPct, setBulkPct] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [bulkWeight, setBulkWeight] = useState('');
  const [bulkStatus, setBulkStatus] = useState<'active' | 'inactive'>('active');

  const sizeOptions = sizeAxis?.options ?? [];
  const hasSizeAxis = !!sizeAxis;

  const toggle = (set: Set<number>, setSet: (s: Set<number>) => void, id: number) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSet(next);
  };

  const updateRow = useCallback((key: string, patch: Partial<VariantRow>) => {
    setVariants(prev => prev.map(v => (v.key === key ? { ...v, ...patch } : v)));
  }, []);

  const removeRow = useCallback((key: string) => {
    setVariants(prev => prev.filter(v => v.key !== key));
  }, []);

  const generate = () => {
    const purities = genPurityIds.size ? purityOptions.filter(p => genPurityIds.has(p.id)) : [null];
    const sizes = hasSizeAxis && genSizeIds.size ? sizeOptions.filter(s => genSizeIds.has(s.id)) : [null];
    if (purities[0] === null && sizes[0] === null) return; // nothing picked to generate from

    setVariants(prev => {
      const existingKeys = new Set(prev.map(v => `${v.purityId ?? ''}:${v.sizeValueId ?? ''}`));
      const added: VariantRow[] = [];
      for (const purity of purities) {
        for (const size of sizes) {
          const comboKey = `${purity?.id ?? ''}:${size?.id ?? ''}`;
          if (existingKeys.has(comboKey)) continue;
          existingKeys.add(comboKey);
          const skuParts = [productSku, purity?.code, size?.value].filter(Boolean);
          added.push(toRow({
            id: undefined,
            purityId: purity?.id ?? null,
            sizeValueId: size?.id ?? null,
            sku: skuParts.join('-'),
            price: null, comparePrice: null, costPrice: null, stock: 0, weight: null, barcode: null, status: 'active',
          }));
        }
      }
      // Drop the single blank placeholder row if we just generated real ones.
      const base = prev.length === 1 && !prev[0].id && !prev[0].price && prev[0].purityId == null && prev[0].sizeValueId == null
        ? []
        : prev;
      return [...base, ...added];
    });
  };

  const selectedKeys = variants.filter(v => v.selected).map(v => v.key);
  const anySelected = selectedKeys.length > 0;
  const applyToSelected = (fn: (v: VariantRow) => Partial<VariantRow>) => {
    setVariants(prev => prev.map(v => (v.selected ? { ...v, ...fn(v) } : v)));
  };

  // Explicit, not a spread — so a field added to the row type but forgotten here
  // is silently dropped on save. (Making charge and wastage were.)
  const payload = variants.map(v => ({
    id: v.id,
    purityId: v.purityId,
    sizeValueId: v.sizeValueId,
    sku: v.sku,
    price: v.price,
    makingCharge: v.makingCharge,
    wastagePercent: v.wastagePercent,
    comparePrice: v.comparePrice,
    costPrice: v.costPrice,
    stock: v.stock,
    weight: v.weight,
    barcode: v.barcode,
    status: v.status,
  }));

  return (
    <div className="adm-field">
      <input type="hidden" name="variants_json" value={JSON.stringify(payload)} />
      <label>Variants &amp; Pricing</label>

      <div className="adm-variant-generator">
        <div>
          <div className="adm-compact-label">Metal Purity</div>
          <div className="adm-choice-array">
            {purityOptions.map(p => (
              <label key={p.id} className="adm-choice-chip">
                <input type="checkbox" checked={genPurityIds.has(p.id)} onChange={() => toggle(genPurityIds, setGenPurityIds, p.id)} />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </div>
        {hasSizeAxis && (
          <div>
            <div className="adm-compact-label">{sizeAxis.label}</div>
            <div className="adm-choice-array">
              {sizeOptions.map(s => (
                <label key={s.id} className="adm-choice-chip">
                  <input type="checkbox" checked={genSizeIds.has(s.id)} onChange={() => toggle(genSizeIds, setGenSizeIds, s.id)} />
                  <span>{s.value}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <button type="button" className="adm-btn ghost sm adm-generate-btn" onClick={generate}>
        Generate Variants
      </button>

      {anySelected && (
        <div className="adm-card" style={{ background: 'var(--surface-secondary)', padding: 12, marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <strong style={{ fontSize: 12.5 }}>{selectedKeys.length} selected:</strong>
          <input placeholder="Price ৳" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} style={{ width: 90 }} />
          <button type="button" className="adm-btn ghost" onClick={() => { if (bulkPrice) applyToSelected(() => ({ price: bulkPrice })); }}>Set price</button>
          <input placeholder="%" value={bulkPct} onChange={e => setBulkPct(e.target.value)} style={{ width: 60 }} />
          <button type="button" className="adm-btn ghost" onClick={() => {
            const pct = Number(bulkPct); if (!pct) return;
            applyToSelected(v => ({ price: v.price ? String(Math.round(Number(v.price) * (1 + pct / 100))) : v.price }));
          }}>+%</button>
          <button type="button" className="adm-btn ghost" onClick={() => {
            const pct = Number(bulkPct); if (!pct) return;
            applyToSelected(v => ({ price: v.price ? String(Math.round(Number(v.price) * (1 - pct / 100))) : v.price }));
          }}>−%</button>
          <input placeholder="Stock" value={bulkStock} onChange={e => setBulkStock(e.target.value)} style={{ width: 70 }} />
          <button type="button" className="adm-btn ghost" onClick={() => { if (bulkStock !== '') applyToSelected(() => ({ stock: bulkStock })); }}>Set stock</button>
          <input placeholder="Weight g" value={bulkWeight} onChange={e => setBulkWeight(e.target.value)} style={{ width: 80 }} />
          <button type="button" className="adm-btn ghost" onClick={() => { if (bulkWeight) applyToSelected(() => ({ weight: bulkWeight })); }}>Set weight</button>
          <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value as 'active' | 'inactive')} style={{ width: 100 }}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="button" className="adm-btn ghost" onClick={() => applyToSelected(() => ({ status: bulkStatus }))}>Set status</button>
          <ConfirmButton title="Remove selected variants?"
            description="The selected variant rows will be removed when you save the product."
            confirmLabel="Remove variants" className="adm-btn danger sm"
            onConfirm={() => setVariants(prev => prev.filter(v => !v.selected))}>
            <Trash2 size={14} /> Remove selected
          </ConfirmButton>
        </div>
      )}

      <div className="adm-variant-table-wrap">
        <table className="adm-table adm-variant-table">
          <thead>
            <tr>
              <th></th>
              <th>Purity</th>
              {sizeAxis && <th>{sizeAxis.label}</th>}
              <th>SKU</th>
              <th>Price (৳)</th>
              <th>Making (৳)</th>
              <th>Wastage %</th>
              <th>Compare (৳)</th>
              <th>Cost (৳)</th>
              <th>Stock</th>
              <th>Weight (g)</th>
              <th>Barcode</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <VariantRowView
                key={v.key}
                variant={v}
                purityLabel={purityOptions.find(p => p.id === v.purityId)?.label ?? '—'}
                sizeValue={sizeOptions.find(s => s.id === v.sizeValueId)?.value ?? '—'}
                hasSizeAxis={hasSizeAxis}
                canRemove={variants.length > 1}
                onUpdate={updateRow}
                onRemove={removeRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
