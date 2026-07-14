'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import {
  FACETS,
  FacetOption,
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
} from '@/features/catalog/filtering';
import { groupForFilters } from '@/features/catalog/presets';
import type { Crumb } from '@/features/catalog/breadcrumbs';
import Breadcrumbs from '@/features/catalog/components/Breadcrumbs';
import ProductCard from '@/features/catalog/components/ProductCard';
import Select from '@/features/shared/Select';
import { useWishlist } from '@/features/wishlist/useWishlist';

/** How many pieces a shopper gets before they ask for more. */
const PAGE_SIZE = 12;

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
 * @param initialProducts the scoped, DB-backed product set for this route
 *   (fetched server-side — see e.g. src/app/(storefront)/shop/page.tsx).
 *   Filtering/sorting/facet-counts all run client-side over this array for
 *   instant checkbox toggling, same as the old in-memory mock did.
 * @param crumbs breadcrumb trail for this route (e.g. Home / Diamond / Diamond
 *   Earring). Omitted on /shop, which has no single place in the hierarchy.
 * @param facetOptions DB-scoped option lists for facets whose values are
 *   admin-editable (type/collection/purity/color/gender) — e.g. so the Gold
 *   page's Jewellery Type facet never lists a type with zero Gold products.
 *   Facets not present here keep their static option list from FACETS.
 */
export default function ShopPage(
  { lockedFilters, heading, crumbs, initialProducts, facetOptions }: {
    lockedFilters?: Filters;
    heading?: string;
    crumbs?: Crumb[];
    initialProducts: Product[];
    facetOptions?: Partial<Record<string, string[]>>;
  },
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
    () => visibleFacets(filters)
      .filter(facet => !lockedKeys.has(facet.key))
      .map(facet => {
        const scoped = facetOptions?.[facet.key];
        if (!scoped) return facet;
        // The DB hands these back in row order, which for a graded facet reads
        // as nonsense (SI1, VVS1, IF). Re-sort into the canonical order the
        // static list declares — best grade first — and park anything the
        // static list doesn't know about at the end, in the order given.
        const rank = (value: string) => {
          const index = facet.options.findIndex(o => o.value === value);
          return index === -1 ? Number.MAX_SAFE_INTEGER : index;
        };
        const options: FacetOption[] = [...scoped]
          .sort((a, b) => rank(a) - rank(b))
          .map(value => ({
            value,
            label: facet.options.find(o => o.value === value)?.label,
          }));
        return { ...facet, options };
      })
      // A DB-scoped facet with nothing in it (no diamond piece in this scope has
      // a recorded clarity, say) would otherwise render as a bare heading.
      .filter(facet => facet.options.length > 0),
    [filters, lockedKeys, facetOptions],
  );

  const products = useMemo(
    () => sortProducts(searchProducts(applyFilters(initialProducts, filters), q), sort),
    [initialProducts, filters, sort, q],
  );

  /* Paging. The whole scoped set is already here, so "load more" is just how
   * much of it we render: 100+ cards on first paint is a lot of images to pull
   * over a phone connection for pieces nobody has scrolled to yet.
   *
   * The count resets during render rather than from an effect, because a reader
   * who changes a filter must never see the previous page count applied to the
   * new results, not even for one frame. Keyed on the query string, not on
   * `filters` or `products` — those are fresh objects on every render and would
   * reset the count on the spot. Any change to a filter, the sort or the search
   * rewrites the URL, and that is exactly when the results are a different set
   * and the reader belongs back on page one. */
  const paramsKey = searchParams.toString();
  const [shown, setShown] = useState(PAGE_SIZE);
  const [shownFor, setShownFor] = useState(paramsKey);
  if (shownFor !== paramsKey) {
    setShownFor(paramsKey);
    setShown(PAGE_SIZE);
  }

  const visible = products.slice(0, shown);
  const remaining = products.length - visible.length;

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
    return applyFilters(initialProducts, others).length;
  };

  const activeChips = FACETS.filter(facet => !lockedKeys.has(facet.key)).flatMap(facet =>
    (filters[facet.key] ?? []).map(value => ({
      facetKey: facet.key,
      value,
      label: facet.options.find(option => option.value === value)?.label ?? value,
    })),
  );

  /* Quick picks — once a shopper is inside a material (Gold/Diamond/Platinum),
   * offer that material's merchandised entries as one-tap narrowing. Each is
   * just a preset over the same facets, so it toggles like any other filter and
   * an empty one is disabled rather than leading to a dead end. */
  const quickPicks = useMemo(() => {
    const hit = groupForFilters(filters);
    if (!hit) return [];
    const [, group] = hit;
    return group.entries.map(entry => {
      const [key, values] = Object.entries(entry.filters)[0];
      const value = values[0];
      return {
        key, value,
        short: entry.short,
        active: filters[key]?.includes(value) ?? false,
        count: applyFilters(initialProducts, { ...filters, [key]: [value] }).length,
        locked: lockedKeys.has(key),
      };
    }).filter(pick => !pick.locked);
  }, [filters, lockedKeys, initialProducts]);

  return (
    <div className="lum-listing">
      {crumbs && <Breadcrumbs items={crumbs} />}

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
          <div className="lum-sort">
            <span>Sort</span>
            <Select
              options={SORT_OPTIONS}
              value={sort}
              ariaLabel="Sort products"
              onChange={next => navigate(filters, next as SortKey)}
            />
          </div>
        </div>
      </div>

      {/* Quick picks for the current material — Gold Ring, Gold Churi, … */}
      {quickPicks.length > 0 && (
        <div className="lum-quickpicks" aria-label="Quick filters">
          {quickPicks.map(pick => (
            <button
              key={`${pick.key}:${pick.value}`}
              className={`lum-quickpick${pick.active ? ' is-active' : ''}`}
              disabled={pick.count === 0 && !pick.active}
              aria-pressed={pick.active}
              onClick={() => toggleValue(pick.key, pick.value)}
            >
              {pick.short}
              <span className="lum-quickpick-n">{pick.count}</span>
            </button>
          ))}
        </div>
      )}

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
            <>
              <div className="lum-results-grid">
                {visible.map(product => (
                  <ProductCard
                    key={product.sku}
                    product={product}
                    wished={!!wished[product.sku]}
                    onToggleWish={toggleWish}
                  />
                ))}
              </div>

              {remaining > 0 && (
                <div className="lum-loadmore">
                  <div className="lum-loadmore-count">
                    Showing {visible.length} of {products.length}
                  </div>
                  <button
                    type="button"
                    className="lum-cta-gold lum-loadmore-btn"
                    onClick={() => setShown(count => count + PAGE_SIZE)}
                  >
                    Load more products
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
