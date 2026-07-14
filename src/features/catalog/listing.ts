import type { Product } from '@/types/product';
import type { SortKey } from '@/features/catalog/filtering';

/**
 * The shape of a worked-out listing — what the server hands the browser.
 *
 * These live here, apart from the code that builds them (server/dal/browse.ts),
 * because ShopPage is a client component: importing the type from the DAL would
 * pull the DAL — and mysql2, and `net`, and `tls` — into the browser bundle. The
 * build says so in as many words.
 */

/** How many pieces a shopper is given before they ask for more. */
export const PAGE_SIZE = 12;

export interface RenderFacet {
  key: string;
  label: string;
  options: {
    value: string;
    label: string;
    /** Results if this value were added — the facet-excluded count. */
    count: number;
    checked: boolean;
  }[];
}

export interface QuickPick {
  key: string;
  value: string;
  short: string;
  active: boolean;
  count: number;
}

export interface Chip {
  facetKey: string;
  value: string;
  label: string;
}

export interface Listing {
  /** Only the slice being shown — not the catalogue. */
  products: Product[];
  total: number;
  shown: number;
  hasMore: boolean;
  facets: RenderFacet[];
  quickPicks: QuickPick[];
  chips: Chip[];
  title: string;
  sort: SortKey;
  q: string;
}
