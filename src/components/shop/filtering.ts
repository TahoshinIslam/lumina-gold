import { GemstoneKind, Product } from './types';

/**
 * Filter engine for the product listing.
 *
 * Every facet is one independent product attribute (the core IA principle).
 * Filters live in the URL query string so every filtered view is a
 * shareable, linkable landing page — mega-menu links are just preset
 * filter URLs (e.g. /shop?material=Gold&type=Ring).
 *
 * Multi-select values are comma-separated: ?purity=22K,18K
 */

export type Filters = Record<string, string[]>;

export interface FacetOption {
  value: string;
  label?: string;
}

export interface Facet {
  key: string;            // query-param name
  label: string;          // sidebar heading
  options: FacetOption[];
  /** Does this product match one selected value of this facet? */
  match: (product: Product, value: string) => boolean;
}

/* ── Price buckets (Step 8: Shop by Price) ───────────────────────────── */

export const PRICE_BUCKETS: { value: string; label: string; min: number; max: number }[] = [
  { value: 'under-50k', label: 'Under ৳50,000', min: 0, max: 50_000 },
  { value: '50k-100k', label: '৳50K – ৳100K', min: 50_000, max: 100_000 },
  { value: '100k-250k', label: '৳100K – ৳250K', min: 100_000, max: 250_000 },
  { value: '250k-plus', label: '৳250K+', min: 250_000, max: Infinity },
];

/* ── Carat buckets ───────────────────────────────────────────────────── */

const CARAT_BUCKETS: { value: string; label: string; min: number; max: number }[] = [
  { value: '0.10', label: '0.10 ct', min: 0.05, max: 0.2 },
  { value: '0.25', label: '0.25 ct', min: 0.2, max: 0.4 },
  { value: '0.50', label: '0.50 ct', min: 0.4, max: 0.9 },
  { value: '1.00', label: '1.00 ct', min: 0.9, max: 2 },
  { value: '2.00+', label: '2.00 ct +', min: 2, max: Infinity },
];

/* ── Facet registry (Step 8: Product Listing Filters) ────────────────── */

const opts = (values: string[]): FacetOption[] => values.map(value => ({ value }));

export const FACETS: Facet[] = [
  {
    key: 'material', label: 'Metal',
    options: opts(['Gold', 'Platinum', 'Silver']),
    match: (product, value) => product.material === value,
  },
  {
    key: 'gemstone', label: 'Gemstone',
    options: opts(['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl']),
    match: (product, value) => product.gemstones?.includes(value as GemstoneKind) ?? false,
  },
  {
    key: 'type', label: 'Jewellery Type',
    options: opts(['Ring', 'Necklace', 'Bracelet', 'Pendant', 'Chain', 'Locket', 'Bangle', 'Nose Pin', 'Earring']),
    match: (product, value) => product.type === value,
  },
  {
    key: 'purity', label: 'Gold Purity',
    options: opts(['24K', '22K', '21K', '18K', '14K']),
    match: (product, value) => product.purity === value,
  },
  {
    key: 'color', label: 'Gold Color',
    options: [
      { value: 'Yellow Gold', label: 'Yellow' },
      { value: 'White Gold', label: 'White' },
      { value: 'Rose Gold', label: 'Rose' },
    ],
    match: (product, value) => product.goldColor === value,
  },
  {
    key: 'gender', label: 'Recipient',
    options: opts(['Women', 'Men', 'Kids', 'Unisex']),
    match: (product, value) => product.gender === value,
  },
  {
    key: 'collection', label: 'Collection',
    options: opts(['Royal Heritage', 'Classic', 'Minimal', 'Wedding', 'Luxury']),
    match: (product, value) => product.collection === value,
  },
  {
    key: 'occasion', label: 'Occasion',
    options: opts(['Wedding', 'Engagement', 'Anniversary', 'Daily Wear', 'Festival']),
    match: (product, value) => product.occasions.includes(value as Product['occasions'][number]),
  },
  {
    key: 'style', label: 'Style',
    options: opts(['Solitaire', 'Cocktail', 'Halo', 'Vintage', 'Designer', 'Polki', 'Color Stone']),
    match: (product, value) => product.style === value,
  },
  {
    key: 'price', label: 'Price',
    options: PRICE_BUCKETS.map(bucket => ({ value: bucket.value, label: bucket.label })),
    match: (product, value) => {
      const bucket = PRICE_BUCKETS.find(candidate => candidate.value === value);
      return !!bucket && product.price >= bucket.min && product.price < bucket.max;
    },
  },
  {
    key: 'diamondType', label: 'Diamond Type',
    options: opts(['Natural', 'Lab Grown']),
    match: (product, value) => product.diamond?.origin === value,
  },
  {
    key: 'shape', label: 'Diamond Shape',
    options: opts(['Round', 'Princess', 'Oval', 'Pear', 'Emerald', 'Heart']),
    match: (product, value) => product.diamond?.shape === value,
  },
  {
    key: 'carat', label: 'Carat',
    options: CARAT_BUCKETS.map(bucket => ({ value: bucket.value, label: bucket.label })),
    match: (product, value) => {
      const bucket = CARAT_BUCKETS.find(candidate => candidate.value === value);
      const carat = product.diamond?.caratWeight;
      return !!bucket && carat !== undefined && carat >= bucket.min && carat < bucket.max;
    },
  },
  {
    key: 'dcolor', label: 'Diamond Color',
    options: opts(['D', 'E', 'F', 'G', 'H']),
    match: (product, value) => product.diamond?.color === value,
  },
  {
    key: 'clarity', label: 'Diamond Clarity',
    options: opts(['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1']),
    match: (product, value) => product.diamond?.clarity === value,
  },
  {
    key: 'availability', label: 'Availability',
    options: opts(['In Stock', 'Made To Order', 'Ready to Ship']),
    match: (product, value) => product.availability === value,
  },
  {
    key: 'cert', label: 'Certification',
    options: opts(['GIA', 'IGI', 'HRD']),
    match: (product, value) => product.diamond?.certification === value,
  },
];

/* ── URL ⇄ filters ───────────────────────────────────────────────────── */

export function parseFilters(params: URLSearchParams): Filters {
  const filters: Filters = {};
  for (const facet of FACETS) {
    const raw = params.get(facet.key);
    if (raw) filters[facet.key] = raw.split(',').filter(Boolean);
  }
  return filters;
}

export function serializeFilters(filters: Filters, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const facet of FACETS) {
    const values = filters[facet.key];
    if (values?.length) params.set(facet.key, values.join(','));
  }
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

/* ── Apply ───────────────────────────────────────────────────────────── */

/** Values inside a facet OR together; different facets AND together. */
export function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter(product =>
    FACETS.every(facet => {
      const values = filters[facet.key];
      if (!values?.length) return true;
      return values.some(value => facet.match(product, value));
    }),
  );
}

/* ── Free-text search (?q=) ──────────────────────────────────────────── */

export function searchProducts(products: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return products;
  const words = term.split(/\s+/);
  return products.filter(product => {
    const hay = [
      product.name, product.material, product.type, product.collection,
      product.style, product.gender, product.purity, product.goldColor,
      ...product.occasions,
      ...(product.gemstones ?? []),
    ].filter(Boolean).join(' ').toLowerCase();
    return words.every(w => hay.includes(w));
  });
}

/* ── Material-aware facets ───────────────────────────────────────────────
   Only show facets relevant to the current selection. When "Gold" is the
   material, diamond facets (shape/carat/clarity/…) are hidden; when
   "Diamond", gold purity/color are hidden. With no material chosen, all
   facets appear. */

const GOLD_ONLY = new Set(['purity', 'color']);
const DIAMOND_ONLY = new Set(['diamondType', 'shape', 'carat', 'dcolor', 'clarity', 'cert']);

export function visibleFacets(filters: Filters): Facet[] {
  const materials = filters.material ?? [];
  const gemstones = filters.gemstone ?? [];
  const hasGold = materials.includes('Gold');
  const noMaterial = materials.length === 0;
  const hasDiamond = gemstones.includes('Diamond');
  const noGemstone = gemstones.length === 0;

  return FACETS.filter(facet => {
    // Gold purity/color: only when browsing gold (or no metal chosen).
    if (GOLD_ONLY.has(facet.key)) return noMaterial || hasGold;
    // Diamond 4C facets: only when the Diamond gemstone is in play.
    if (DIAMOND_ONLY.has(facet.key)) return noGemstone || hasDiamond;
    return true;
  });
}

/* ── Sorting ─────────────────────────────────────────────────────────── */

export type SortKey = 'featured' | 'new' | 'price-asc' | 'price-desc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'new':
      return sorted.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
}

/** Human title for the current filter view, e.g. "22K Gold Rings". */
export function filterTitle(filters: Filters): string {
  const purity = filters.purity?.length === 1 ? filters.purity[0] : '';
  const material = filters.material?.length === 1 ? filters.material[0] : '';
  const gemstone = filters.gemstone?.length === 1 ? filters.gemstone[0] : '';
  const type = filters.type?.length === 1 ? `${filters.type[0]}s` : '';
  const collection = filters.collection?.length === 1 ? filters.collection[0] : '';
  // Lead word: metal if chosen, else gemstone (e.g. "Diamond Rings").
  const parts = [purity, material || gemstone, type].filter(Boolean).join(' ');
  if (parts) return parts;
  if (collection) return `${collection} Collection`;
  const occasion = filters.occasion?.length === 1 ? filters.occasion[0] : '';
  if (occasion) return `${occasion} Jewellery`;
  const gender = filters.gender?.length === 1 ? filters.gender[0] : '';
  if (gender) return `For ${gender}`;
  return 'All Jewellery';
}
