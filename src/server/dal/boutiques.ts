import { cache } from 'react';
import { query } from '@/server/db/client';

/**
 * The boutiques a customer can ask to visit.
 *
 * They are `warehouses` of type 'store' — the same rows the inventory ledger
 * uses as stock locations, because a boutique IS a place with stock in it. One
 * table, so opening a third shop makes it both stockable and bookable without a
 * second list to keep in step.
 */
export interface Boutique {
  id: number;
  name: string;
  address: string | null;
}

/** Cached per request: the homepage renders this once, and it changes rarely. */
export const getBoutiques = cache(async (): Promise<Boutique[]> =>
  query<Boutique>(
    `SELECT id, name, address FROM warehouses
      WHERE type = 'store' AND is_active = 1
      ORDER BY id`,
  ),
);
