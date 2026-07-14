import { unstable_cache } from 'next/cache';
import { getStorefrontProducts, type MainCategory } from '@/server/dal/catalog';
import {
  FACETS, applyFilters, filterTitle, parseFilters, searchProducts, sortProducts, visibleFacets,
  type Facet, type Filters, type SortKey,
} from '@/features/catalog/filtering';
import { groupForFilters } from '@/features/catalog/presets';
import { PAGE_SIZE, type Chip, type Listing, type QuickPick, type RenderFacet } from '@/features/catalog/listing';
import type { Product } from '@/types/product';

export { PAGE_SIZE };

/**
 * The listing, worked out on the server.
 *
 * It used to be worked out in the browser: every listing route handed the WHOLE
 * catalogue to the client and let it filter, sort, count and paginate in memory.
 * That is fine at fifteen products and indefensible at fifteen hundred — the
 * server would fetch every row, serialise every row into the HTML, and the
 * browser would then throw almost all of them away. /shop actually fetched the
 * catalogue TWICE, because getFacetOptions went and got it again for itself.
 *
 * So the work moves here, and only the page being looked at crosses the wire.
 *
 * The filter engine itself is NOT rewritten into SQL, and that is a deliberate
 * choice rather than a shortcut. Its rules are subtle (a price bucket, a carat
 * bucket, "diamond" meaning a gemstone rather than a metal, facet-excluded
 * counts) and they are already correct and already exercised by the whole shop.
 * Translating nineteen facets into SQL predicates that mean EXACTLY the same
 * thing is a large surface to get subtly wrong, and it would trade one round trip
 * for a dozen COUNT queries per request. Filtering a cached array of a few
 * thousand products takes microseconds. When the catalogue reaches a size where
 * that stops being true — tens of thousands — the answer is a proper search index,
 * not hand-written SQL.
 *
 * What the cache buys: the database is read once a minute per scope, not once per
 * visitor. Listing cards can be a minute stale; the product page a shopper
 * actually buys from is never cached (see dal/productpage.ts).
 */

export const CATALOG_TAG = 'catalog';

/** The whole scoped catalogue, read from the database at most once a minute. */
const cachedCatalog = unstable_cache(
  async (mainCategory?: MainCategory): Promise<Product[]> =>
    getStorefrontProducts(mainCategory ? { mainCategory } : {}),
  ['catalog'],
  { tags: [CATALOG_TAG], revalidate: 60 },
);

export async function getListing({
  searchParams, lockedFilters, mainCategory, heading,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  lockedFilters?: Filters;
  mainCategory?: MainCategory;
  heading?: string;
}): Promise<Listing> {
  // Rebuild the URLSearchParams the client used to read, so parseFilters and the
  // browser stay of one mind about what a query string means.
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }

  const urlFilters = parseFilters(params);
  const lockedKeys = new Set(Object.keys(lockedFilters ?? {}));
  // Effective = route-locked filters + whatever the shopper toggled.
  const filters: Filters = { ...urlFilters, ...(lockedFilters ?? {}) };
  const sort = (params.get('sort') as SortKey) || 'featured';
  const q = params.get('q') ?? '';
  const shown = Math.max(PAGE_SIZE, Number(params.get('show')) || PAGE_SIZE);

  const catalogue = await cachedCatalog(mainCategory);

  const matched = sortProducts(searchProducts(applyFilters(catalogue, filters), q), sort);

  /* Facet counts, the same rule the client used: how many results WOULD there be
   * if this one value were added — every other filter still applied, this facet's
   * own selections replaced. That is what lets a shopper see "Gold (7)" while
   * standing inside Diamond. */
  const optionCount = (facetKey: string, value: string) =>
    applyFilters(catalogue, { ...filters, [facetKey]: [value] }).length;

  const scopedOptions = facetOptionsFor(catalogue);

  const facets: RenderFacet[] = visibleFacets(filters)
    .filter(facet => !lockedKeys.has(facet.key))
    .map(facet => withScopedOptions(facet, scopedOptions[facet.key]))
    .map(facet => ({
      key: facet.key,
      label: facet.label,
      options: facet.options.map(option => ({
        value: option.value,
        label: option.label ?? option.value,
        count: optionCount(facet.key, option.value),
        checked: filters[facet.key]?.includes(option.value) ?? false,
      })),
    }))
    // A facet with nothing in it would otherwise render as a bare heading.
    .filter(facet => facet.options.length > 0);

  /* Quick picks — once a shopper is inside a metal, offer that metal's
   * merchandised entries as one-tap narrowing. */
  const hit = groupForFilters(filters);
  const quickPicks: QuickPick[] = (hit ? hit[1].entries : []).flatMap(entry => {
    const [key, values] = Object.entries(entry.filters)[0];
    const value = values[0];
    if (lockedKeys.has(key)) return [];
    return [{
      key, value,
      short: entry.short,
      active: filters[key]?.includes(value) ?? false,
      count: applyFilters(catalogue, { ...filters, [key]: [value] }).length,
    }];
  });

  const chips: Chip[] = FACETS
    .filter(facet => !lockedKeys.has(facet.key))
    .flatMap(facet => (filters[facet.key] ?? []).map(value => ({
      facetKey: facet.key,
      value,
      label: facet.options.find(option => option.value === value)?.label ?? value,
    })));

  return {
    products: matched.slice(0, shown),
    total: matched.length,
    shown,
    hasMore: matched.length > shown,
    facets,
    quickPicks,
    chips,
    title: q ? `Results for “${q}”` : (heading ?? filterTitle(filters)),
    sort,
    q,
  };
}

/**
 * The values a facet actually HAS within this scope, so the Gold page never
 * offers a jewellery type no gold piece is. Derived from the catalogue we already
 * hold — it used to be a second full fetch of the same rows (getFacetOptions).
 */
function facetOptionsFor(products: Product[]): Partial<Record<string, string[]>> {
  const uniq = (values: (string | undefined)[]) =>
    [...new Set(values.filter((v): v is string => !!v))];

  return {
    type: uniq(products.map(p => p.type)),
    collection: uniq(products.map(p => p.collection)),
    purity: uniq(products.map(p => p.purity)),
    color: uniq(products.map(p => p.goldColor)),
    gender: uniq(products.map(p => p.gender)),
    shape: uniq(products.map(p => p.diamond?.shape)),
    dcolor: uniq(products.map(p => p.diamond?.color)),
    clarity: uniq(products.map(p => p.diamond?.clarity)),
    cert: uniq(products.map(p => p.diamond?.certification)),
    stones: uniq(products.map(p => p.diamond?.quantity?.toString())),
  };
}

/** Replace a facet's static option list with the values present in this scope,
 *  keeping the canonical order the static list declares (best grade first). */
function withScopedOptions(facet: Facet, scoped: string[] | undefined): Facet {
  if (!scoped) return facet;
  const rank = (value: string) => {
    const index = facet.options.findIndex(o => o.value === value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return {
    ...facet,
    options: [...scoped].sort((a, b) => rank(a) - rank(b)).map(value => ({
      value,
      label: facet.options.find(o => o.value === value)?.label,
    })),
  };
}
