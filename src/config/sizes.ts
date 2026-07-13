/**
 * Two different things get called "size", and keeping them apart is what keeps
 * the catalogue clean.
 *
 * VARIANT AXES are options a customer SELECTS — ring size, bangle size, chain
 * length. Each selected combination is a real purchasable thing, so it gets its
 * own SKU, price and stock. The values are a shared, admin-managed list, because
 * every ring offers the same sizes.
 *
 * SPEC FIELDS are dimensions the piece HAS — height, width, thickness, pin
 * length, gauge. Nobody picks them; they are measured once and printed on the
 * product page. Making them variant axes would multiply SKUs for no choice at
 * all (a locket with 3 heights × 3 widths × 2 thicknesses = 18 SKUs of an item
 * sold exactly one way), and would pollute the shared option lists with one
 * entry per measurement. So they live per-product in `product_specifications`,
 * never in `variant_attributes`.
 *
 * Rule of thumb: if two values of it are two different things a shopper could
 * buy, it is a variant axis. If it just describes the one thing, it is a spec.
 */

export interface SizeAxis {
  /** attributes.code */
  code: string;
  label: string;
  placeholder: string;
  hint: string;
}

/* ── Variant axes — customer-selectable, generate SKUs ─────────────────── */

export const VARIANT_AXES: SizeAxis[] = [
  { code: 'ring_size', label: 'Ring Size', placeholder: 'e.g. 12',
    hint: 'The finger size a ring is made to.' },
  { code: 'bangle_size', label: 'Bangle Size', placeholder: 'e.g. 2.6',
    hint: 'Inner diameter of a bangle or churi, in inches.' },
  { code: 'chain_length', label: 'Length', placeholder: 'e.g. 20 inch',
    hint: 'End-to-end length. Shared by chains, necklaces and sitahars.' },
];

export const VARIANT_AXIS_CODES = VARIANT_AXES.map(axis => axis.code);

/** Category slug → the axes a shopper chooses from. A category absent here sells
 *  as a single item (Bracelets, Bridal Sets, Traditional Jewellery). */
export const CATEGORY_VARIANT_AXES: Record<string, string[]> = {
  rings: ['ring_size'],
  bangles: ['bangle_size'],
  chains: ['chain_length'],
  necklaces: ['chain_length'],
  sitahar: ['chain_length'],
};

/* ── Spec fields — measured, shown on the product page, never a SKU ────── */

export const SPEC_FIELDS: SizeAxis[] = [
  { code: 'height', label: 'Height', placeholder: 'e.g. 12 mm', hint: 'Top to bottom.' },
  { code: 'width', label: 'Width', placeholder: 'e.g. 8 mm', hint: 'Side to side.' },
  { code: 'thickness', label: 'Thickness', placeholder: 'e.g. 3 mm', hint: 'Front to back.' },
  { code: 'pin_length', label: 'Pin Length', placeholder: 'e.g. 7 mm', hint: 'The post through the piercing.' },
  { code: 'gauge', label: 'Gauge', placeholder: 'e.g. 22G', hint: 'Thickness of that post.' },
];

export const SPEC_FIELD_CODES = SPEC_FIELDS.map(field => field.code);

/** Category slug → the dimensions recorded for it. */
export const CATEGORY_SPEC_FIELDS: Record<string, string[]> = {
  pendants: ['height', 'width'],
  lockets: ['height', 'width', 'thickness'],
  earrings: ['height', 'width'],
  'nose-pins': ['height', 'width', 'pin_length', 'gauge'],
};

/* ── Lookups ───────────────────────────────────────────────────────────── */

export const variantAxesFor = (categorySlug: string): SizeAxis[] =>
  (CATEGORY_VARIANT_AXES[categorySlug] ?? [])
    .map(code => VARIANT_AXES.find(axis => axis.code === code))
    .filter((axis): axis is SizeAxis => !!axis);

export const specFieldsFor = (categorySlug: string): SizeAxis[] =>
  (CATEGORY_SPEC_FIELDS[categorySlug] ?? [])
    .map(code => SPEC_FIELDS.find(field => field.code === code))
    .filter((field): field is SizeAxis => !!field);

/** The categories measured on a given axis — "Chains · Necklaces · Sitahar". */
export function categoriesForAxis(code: string): string[] {
  const map = VARIANT_AXIS_CODES.includes(code) ? CATEGORY_VARIANT_AXES : CATEGORY_SPEC_FIELDS;
  return Object.entries(map)
    .filter(([, codes]) => codes.includes(code))
    .map(([slug]) => slug);
}
