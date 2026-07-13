import type { Product } from '@/types/product';
import { serializeFilters } from '@/features/catalog/filtering';
import { MATERIAL_GROUPS } from '@/features/catalog/presets';
import { pluralType } from '@/features/catalog/taxonomy';

/**
 * Breadcrumb trails, derived from the same merchandising model as the mega menu
 * and the /jewelry/<material>/<entry> landing routes (see presets.ts).
 *
 * The trail follows how a shopper actually arrives at a piece, NOT how the row
 * is stored: a diamond ring is set in gold, but nobody browses to it via Gold —
 * they browse Diamond → Diamond Ring. So the first crumb is the merchandised
 * GROUP (Diamond wins over the metal), and the second is the entry preset. Both
 * are real pages, which is what makes the trail crawlable.
 */

export interface Crumb {
  label: string;
  /** Absent on the last crumb — the page you are already on. */
  href?: string;
}

const HOME: Crumb = { label: 'Home', href: '/' };

/**
 * The group a product is merchandised under. Diamond takes precedence over the
 * metal, because `material` is only ever the METAL (a diamond ring's material is
 * Gold) and the diamond is the reason the shopper is looking at it.
 * Returns null for a metal with no merchandised group (Silver).
 */
export function groupSlugForProduct(product: Pick<Product, 'material' | 'gemstones'>): string | null {
  if (product.gemstones?.includes('Diamond')) return 'diamond';
  const slug = product.material.toLowerCase();
  return MATERIAL_GROUPS[slug] ? slug : null;
}

/** Home / Diamond — the group landing page. */
export function groupCrumbs(groupSlug: string): Crumb[] {
  const group = MATERIAL_GROUPS[groupSlug];
  if (!group) return [HOME];
  return [HOME, { label: group.label, href: `/jewelry/${groupSlug}` }];
}

/** Home / Diamond / Diamond Earring — the preset landing page. */
export function presetCrumbs(groupSlug: string, presetSlug: string): Crumb[] {
  const group = MATERIAL_GROUPS[groupSlug];
  const preset = group?.entries.find(entry => entry.slug === presetSlug);
  const trail = groupCrumbs(groupSlug);
  if (preset) trail.push({ label: preset.label });
  return trail;
}

/** Home / Diamond / Diamond Ring / Diamond Ladies Generic Ring. */
export function productCrumbs(product: Product): Crumb[] {
  const groupSlug = groupSlugForProduct(product);
  const group = groupSlug ? MATERIAL_GROUPS[groupSlug] : null;

  const trail = group && groupSlug
    ? groupCrumbs(groupSlug)
    // Silver, or any metal without a merchandised group: the metal still stands
    // in as the first crumb.
    : [HOME, { label: product.material, href: `/jewelry/${product.material.toLowerCase()}` }];

  const base = group?.base ?? { material: [product.material] };

  // Only the TYPE entries can name a piece. The gender entries (Mens, Baby) are
  // a different axis — "Diamond Mens" is not what a ring *is*. An uncategorised
  // product has no type at all, and gets no type crumb rather than a fake one.
  const preset = groupSlug && product.type
    ? group?.entries.find(entry => entry.filters.type?.includes(product.type))
    : undefined;

  if (preset && groupSlug) {
    trail.push({ label: preset.label, href: `/jewelry/${groupSlug}/${preset.slug}` });
  } else if (product.type) {
    // A type with no merchandised entry (e.g. a Gold Necklace) still gets a
    // crumb — the equivalent filtered listing, so the trail is never a stub.
    trail.push({
      label: pluralType(product.type),
      href: `/shop${serializeFilters({ ...base, type: [product.type] })}`,
    });
  }

  trail.push({ label: product.name });
  return trail;
}
