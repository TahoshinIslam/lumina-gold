'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SORT_OPTIONS, type SortKey } from '@/features/catalog/filtering';
import type { Crumb } from '@/features/catalog/breadcrumbs';
import { PAGE_SIZE, type Listing } from '@/features/catalog/listing';
import Breadcrumbs from '@/features/catalog/components/Breadcrumbs';
import ProductCard from '@/features/catalog/components/ProductCard';
import Select from '@/features/shared/Select';
import { useWishlist } from '@/features/wishlist/useWishlist';

/**
 * ShopPage — the single product-listing experience.
 *
 * It no longer decides ANYTHING about what to show. It used to be handed the
 * whole catalogue and do the filtering, sorting, counting and paging itself,
 * which meant every listing route serialised every product in the shop into the
 * page — fine at fifteen pieces, hopeless at fifteen hundred. All of that now
 * happens on the server (server/dal/browse.ts) and only the pieces actually on
 * screen come down the wire.
 *
 * What is left here is what genuinely belongs in the browser: the URL is still
 * the state, so every filter is a real, shareable, back-button-able landing page;
 * the drawer opens and closes; the wishlist heart is device-local. Toggling a
 * filter now navigates, and `useTransition` keeps the old results on screen,
 * greyed, while the new ones are fetched — instead of blanking the page.
 */
export default function ShopPage({ listing, crumbs }: {
  listing: Listing;
  crumbs?: Crumb[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { wished, toggleWish } = useWishlist();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { products, total, shown, hasMore, facets, quickPicks, chips, title, sort } = listing;

  /** Rewrite the query string and let the server work out the new listing. */
  const navigate = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    // Any change to the results puts the shopper back on the first page — they
    // are looking at a different set now.
    if (!params.has('__keepShow')) params.delete('show');
    params.delete('__keepShow');
    const query = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    });
  };

  const toggleValue = (facetKey: string, value: string) => navigate(params => {
    const current = params.getAll(facetKey);
    params.delete(facetKey);
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    next.forEach(v => params.append(facetKey, v));
  });

  const setSort = (next: SortKey) => navigate(params => {
    if (next === 'featured') params.delete('sort');
    else params.set('sort', next);
  });

  const clearAll = () => navigate(params => {
    const q = params.get('q');
    const sortValue = params.get('sort');
    [...params.keys()].forEach(key => params.delete(key));
    if (q) params.set('q', q);
    if (sortValue) params.set('sort', sortValue);
  });

  // "Load more" is the one navigation that must NOT reset the page window.
  const loadMore = () => navigate(params => {
    params.set('show', String(shown + PAGE_SIZE));
    params.set('__keepShow', '1');
  });

  return (
    <div className="lum-listing">
      {crumbs && <Breadcrumbs items={crumbs} />}

      {/* Page head: title, count, sort */}
      <div className="lum-listing-head">
        <div>
          <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>The Boutique</div>
          <h1 className="lum-h2 lum-listing-title">{title}</h1>
          <div className="lum-listing-count">
            {total} {total === 1 ? 'creation' : 'creations'}
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
              onChange={next => setSort(next as SortKey)}
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
      {chips.length > 0 && (
        <div className="lum-chips">
          {chips.map(chip => (
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
            becomes a slide-in card drawer. */}
        <aside className={`lum-filters${drawerOpen ? ' is-open' : ''}`} aria-label="Product filters">
          <div className="lum-filters-head">
            <span>Filters</span>
            <button className="lum-drawer-close" aria-label="Close filters" onClick={() => setDrawerOpen(false)}>✕</button>
          </div>
          {facets.map(facet => (
            <div key={facet.key} className="lum-filter-group is-open">
              <div className="lum-filter-heading">{facet.label}</div>
              <div className="lum-filter-options">
                {facet.options.map(option => (
                  <label
                    key={option.value}
                    className={`lum-filter-option${option.count === 0 && !option.checked ? ' is-empty' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={option.checked}
                      disabled={option.count === 0 && !option.checked}
                      onChange={() => toggleValue(facet.key, option.value)}
                    />
                    <span>{option.label}</span>
                    <span className="lum-filter-count">{option.count}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="lum-cta-gold lum-filters-apply" onClick={() => setDrawerOpen(false)}>
            Show {total} results
          </button>
        </aside>

        {/* Results grid. Kept on screen, greyed, while the next set is fetched —
            blanking it on every checkbox would be worse than a moment's wait. */}
        <section className="lum-results" style={pending ? { opacity: 0.55, transition: 'opacity .2s' } : undefined}>
          {total === 0 ? (
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
                {products.map(product => (
                  <ProductCard
                    key={product.sku}
                    product={product}
                    wished={!!wished[product.sku]}
                    onToggleWish={toggleWish}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="lum-loadmore">
                  <div className="lum-loadmore-count">
                    Showing {products.length} of {total}
                  </div>
                  <button
                    type="button"
                    className="lum-cta-gold lum-loadmore-btn"
                    onClick={loadMore}
                    disabled={pending}
                  >
                    {pending ? 'Loading…' : 'Load more products'}
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
