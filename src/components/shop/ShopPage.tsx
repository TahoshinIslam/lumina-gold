'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CATALOG } from './catalog';
import {
  FACETS,
  Filters,
  SORT_OPTIONS,
  SortKey,
  applyFilters,
  filterTitle,
  parseFilters,
  searchProducts,
  serializeFilters,
  sortProducts,
  visibleFacets,
} from './filtering';
import ProductCard from './ProductCard';
import { useWishlist } from './useWishlist';

/**
 * ShopPage — the single product-listing experience (IA spec Step 8).
 *
 * All state lives in the URL query string, so every mega-menu link,
 * shared link, and back/forward step is a real filtered landing page.
 * Facets whose options have no matches under the OTHER active filters
 * are shown disabled with a zero count.
 */
/**
 * @param lockedFilters filters forced by the route (e.g. /jewelry/gold locks
 *   material=Gold). They are ALWAYS applied, never shown as removable chips,
 *   and their facet is hidden — the URL only carries the *other* facets, so
 *   the clean path stays canonical while every other filter still works.
 * @param heading overrides the auto-generated listing title.
 */
export default function ShopPage(
  { lockedFilters, heading }: { lockedFilters?: Filters; heading?: string } = {},
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlFilters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const lockedKeys = useMemo(
    () => new Set(Object.keys(lockedFilters ?? {})),
    [lockedFilters],
  );
  // Effective = route-locked filters + whatever the user toggled (URL).
  const filters = useMemo(
    () => ({ ...urlFilters, ...(lockedFilters ?? {}) }),
    [urlFilters, lockedFilters],
  );
  const sort = (searchParams.get('sort') as SortKey) || 'featured';
  const q = searchParams.get('q') ?? '';
  const { wished, toggleWish } = useWishlist();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const facets = useMemo(
    () => visibleFacets(filters).filter(facet => !lockedKeys.has(facet.key)),
    [filters, lockedKeys],
  );

  const products = useMemo(
    () => sortProducts(searchProducts(applyFilters(CATALOG, filters), q), sort),
    [filters, sort, q],
  );

  const navigate = (nextFilters: Filters, nextSort: SortKey = sort) => {
    const extra: Record<string, string> = {};
    if (nextSort !== 'featured') extra.sort = nextSort;
    if (q) extra.q = q;
    // Never serialize route-locked filters — they live in the path.
    const urlOnly: Filters = Object.fromEntries(
      Object.entries(nextFilters).filter(([key]) => !lockedKeys.has(key)),
    );
    const query = serializeFilters(urlOnly, extra);
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const toggleValue = (facetKey: string, value: string) => {
    const current = filters[facetKey] ?? [];
    const next = current.includes(value)
      ? current.filter(candidate => candidate !== value)
      : [...current, value];
    navigate({ ...filters, [facetKey]: next });
  };

  const clearAll = () => navigate({});

  /** Count of results if `value` were added to `facetKey` (facet-excluded). */
  const optionCount = (facetKey: string, value: string) => {
    const others: Filters = { ...filters, [facetKey]: [value] };
    return applyFilters(CATALOG, others).length;
  };

  const activeChips = FACETS.filter(facet => !lockedKeys.has(facet.key)).flatMap(facet =>
    (filters[facet.key] ?? []).map(value => ({
      facetKey: facet.key,
      value,
      label: facet.options.find(option => option.value === value)?.label ?? value,
    })),
  );

  return (
    <div className="lum-listing">
      {/* Page head: title, count, sort */}
      <div className="lum-listing-head">
        <div>
          <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>The Boutique</div>
          <h1 className="lum-h2 lum-listing-title">{q ? `Results for “${q}”` : (heading ?? filterTitle(filters))}</h1>
          <div className="lum-listing-count">
            {products.length} {products.length === 1 ? 'creation' : 'creations'}
          </div>
        </div>
        <div className="lum-listing-tools">
          <button className="lum-filter-toggle" onClick={() => setDrawerOpen(true)}>
            ☰ Filters
          </button>
          <label className="lum-sort">
            Sort
            <select
              value={sort}
              onChange={e => navigate(filters, e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="lum-chips">
          {activeChips.map(chip => (
            <button
              key={`${chip.facetKey}:${chip.value}`}
              className="lum-chip"
              onClick={() => toggleValue(chip.facetKey, chip.value)}
            >
              {chip.label} <span aria-hidden>×</span>
            </button>
          ))}
          <button className="lum-chip lum-chip--clear" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}

      <div className="lum-listing-body">
        {/* Mobile drawer scrim */}
        <div
          className={`lum-drawer-scrim${drawerOpen ? ' is-open' : ''}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Filter sidebar — always-expanded groups. On small screens it
            becomes a slide-in card drawer (lum-filters--drawer). */}
        <aside className={`lum-filters${drawerOpen ? ' is-open' : ''}`} aria-label="Product filters">
          <div className="lum-filters-head">
            <span>Filters</span>
            <button className="lum-drawer-close" aria-label="Close filters" onClick={() => setDrawerOpen(false)}>✕</button>
          </div>
          {facets.map(facet => (
            <div key={facet.key} className="lum-filter-group is-open">
              <div className="lum-filter-heading">{facet.label}</div>
              <div className="lum-filter-options">
                {facet.options.map(option => {
                  const checked = filters[facet.key]?.includes(option.value) ?? false;
                  const count = optionCount(facet.key, option.value);
                  return (
                    <label
                      key={option.value}
                      className={`lum-filter-option${count === 0 && !checked ? ' is-empty' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={count === 0 && !checked}
                        onChange={() => toggleValue(facet.key, option.value)}
                      />
                      <span>{option.label ?? option.value}</span>
                      <span className="lum-filter-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <button className="lum-cta-gold lum-filters-apply" onClick={() => setDrawerOpen(false)}>
            Show {products.length} results
          </button>
        </aside>

        {/* Results grid */}
        <section className="lum-results">
          {products.length === 0 ? (
            <div className="lum-empty-results">
              <div className="lum-breathe-diamond" style={{ width: 18, height: 18, margin: '0 auto 20px' }} />
              No creations match this combination.
              <button className="lum-chip lum-chip--clear" style={{ marginTop: 18 }} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="lum-results-grid">
              {products.map(product => (
                <ProductCard
                  key={product.sku}
                  product={product}
                  wished={!!wished[product.sku]}
                  onToggleWish={toggleWish}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
