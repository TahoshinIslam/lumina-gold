import { query } from '@/server/db/client';

/**
 * Loyalty (the Rewards tab).
 *
 * DERIVED, never stored: points are recomputed from delivered orders every time
 * they are read. A points *balance* column would be a second source of truth for
 * money already recorded in `orders` — and the moment an order is refunded or a
 * total corrected, the two would disagree, in the customer's favour or the
 * boutique's. Neither is acceptable, and neither is reconciling them nightly.
 *
 * 1 point per ৳100 actually spent, counted only once a piece is DELIVERED —
 * a pending order is not a purchase.
 */
export const POINTS_PER_TAKA = 1 / 100;

export interface Tier {
  name: string;
  from: number;
  perk: string;
}

export const TIERS: Tier[] = [
  { name: 'Guest', from: 0, perk: 'Complimentary cleaning at any boutique' },
  { name: 'Silver', from: 500, perk: 'Free insured delivery, priority appointments' },
  { name: 'Gold', from: 2_000, perk: 'Private viewings and 5% off making charges' },
  { name: 'Platinum', from: 5_000, perk: 'Dedicated concierge, bespoke commissions' },
];

export interface Rewards {
  points: number;
  spent: number;
  tier: Tier;
  next: Tier | null;
  toNext: number;
  progress: number; // 0–1 through the current tier
}

export async function getRewards(userId: number): Promise<Rewards> {
  const rows = await query<{ spent: string | null }>(
    `SELECT SUM(grand_total) spent FROM orders
      WHERE user_id = ? AND status = 'delivered'`,
    [userId],
  );
  const spent = Number(rows[0]?.spent ?? 0);
  const points = Math.floor(spent * POINTS_PER_TAKA);

  const tier = [...TIERS].reverse().find(t => points >= t.from) ?? TIERS[0];
  const next = TIERS[TIERS.indexOf(tier) + 1] ?? null;
  const toNext = next ? next.from - points : 0;
  const progress = next && next.from > tier.from
    ? Math.min(1, (points - tier.from) / (next.from - tier.from))
    : 1;

  return { points, spent, tier, next, toNext, progress };
}
