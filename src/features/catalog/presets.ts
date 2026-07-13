import type { Filters } from '@/features/catalog/filtering';

/**
 * Merchandised entry points — "Gold Ring", "Diamond Nosepin", "Platinum Churi".
 *
 * These are NOT taxonomy nodes. Each one is a named preset over facets that
 * already exist, so a single piece surfaces under every entry it belongs to
 * without being duplicated: a men's 22K gold ring is reachable from Gold Ring,
 * Gold Mens, 22K Gold and Rings all at once, because those are four filters over
 * one product — not four categories it had to be filed into.
 *
 * Two labels in the list are deliberately not types:
 *   Mens / Baby → the `gender` facet (Men / Kids)
 *   Churi       → the `Bangle` type, just named for the local market
 *
 * This registry is the single source of truth for the mega menu, the SEO
 * landing routes (/jewelry/<material>/<entry>) and the shop-page quick chips.
 */

export interface Preset {
  /** URL segment: /jewelry/gold/<slug> */
  slug: string;
  /** Full label, as merchandised — page <h1> and <title>. */
  label: string;
  /** Short label for use inside a column already headed by the material. */
  short: string;
  /** Facets layered on top of the material's base filter. */
  filters: Filters;
}

export interface MaterialGroup {
  /** Heading, e.g. "Gold". */
  label: string;
  /** The filter every entry in this group inherits. Diamond is a GEMSTONE. */
  base: Filters;
  entries: Preset[];
}

const type = (t: string): Filters => ({ type: [t] });
const gender = (g: string): Filters => ({ gender: [g] });

export const MATERIAL_GROUPS: Record<string, MaterialGroup> = {
  gold: {
    label: 'Gold',
    base: { material: ['Gold'] },
    entries: [
      { slug: 'ring', label: 'Gold Ring', short: 'Ring', filters: type('Ring') },
      { slug: 'earring', label: 'Gold Earring', short: 'Earring', filters: type('Earring') },
      { slug: 'locket', label: 'Gold Locket', short: 'Locket', filters: type('Locket') },
      { slug: 'bracelet', label: 'Gold Bracelet', short: 'Bracelet', filters: type('Bracelet') },
      { slug: 'churi', label: 'Gold Churi', short: 'Churi', filters: type('Bangle') },
      { slug: 'chain', label: 'Gold Chain', short: 'Chain', filters: type('Chain') },
      { slug: 'mens', label: 'Gold Mens', short: 'Mens', filters: gender('Men') },
      { slug: 'pendant-set', label: 'Gold Pendant Set', short: 'Pendant Set', filters: type('Pendant Set') },
      { slug: 'baby', label: 'Gold Baby', short: 'Baby', filters: gender('Kids') },
      { slug: 'necklace-set', label: 'Gold Necklace Set', short: 'Necklace Set', filters: type('Necklace Set') },
      { slug: 'others', label: 'Gold Others', short: 'Others', filters: type('Other') },
      { slug: 'coin', label: 'Gold Coin', short: 'Coin', filters: type('Coin') },
    ],
  },

  diamond: {
    label: 'Diamond',
    // A diamond piece still has a metal — so this is a gemstone filter, never a
    // material one. That is why /jewelry/diamond/ring can also be 18K gold.
    base: { gemstone: ['Diamond'] },
    entries: [
      { slug: 'nosepin', label: 'Diamond Nosepin', short: 'Nosepin', filters: type('Nose Pin') },
      { slug: 'ring', label: 'Diamond Ring', short: 'Ring', filters: type('Ring') },
      { slug: 'earring', label: 'Diamond Earring', short: 'Earring', filters: type('Earring') },
      { slug: 'locket', label: 'Diamond Locket', short: 'Locket', filters: type('Locket') },
      { slug: 'tanmaniya', label: 'Diamond Tanmaniya', short: 'Tanmaniya', filters: type('Tanmaniya') },
      { slug: 'bangle', label: 'Diamond Bangle', short: 'Bangle', filters: type('Bangle') },
      { slug: 'bracelet', label: 'Diamond Bracelet', short: 'Bracelet', filters: type('Bracelet') },
      { slug: 'mens', label: 'Diamond Mens', short: 'Mens', filters: gender('Men') },
      { slug: 'chain', label: 'Diamond Chain', short: 'Chain', filters: type('Chain') },
      { slug: 'pendant-set', label: 'Diamond Pendant Set', short: 'Pendant Set', filters: type('Pendant Set') },
      { slug: 'neckset-earring', label: 'Diamond Neckset Earring', short: 'Neckset Earring', filters: type('Necklace Set') },
      { slug: 'jewellery-acc', label: 'Diamond Jewellery Acc', short: 'Jewellery Acc', filters: type('Accessory') },
      { slug: 'baby', label: 'Diamond Baby', short: 'Baby', filters: gender('Kids') },
    ],
  },

  platinum: {
    label: 'Platinum',
    base: { material: ['Platinum'] },
    entries: [
      { slug: 'mens', label: 'Platinum Mens', short: 'Mens', filters: gender('Men') },
      { slug: 'ring', label: 'Platinum Ring', short: 'Ring', filters: type('Ring') },
      { slug: 'locket', label: 'Platinum Locket', short: 'Locket', filters: type('Locket') },
      { slug: 'earring', label: 'Platinum Earring', short: 'Earring', filters: type('Earring') },
      { slug: 'bracelet', label: 'Platinum Bracelet', short: 'Bracelet', filters: type('Bracelet') },
      { slug: 'necklace', label: 'Platinum Necklace', short: 'Necklace', filters: type('Necklace') },
      { slug: 'pendant-set', label: 'Platinum Pendant Set', short: 'Pendant Set', filters: type('Pendant Set') },
      { slug: 'chain', label: 'Platinum Chain', short: 'Chain', filters: type('Chain') },
      { slug: 'churi', label: 'Platinum Churi', short: 'Churi', filters: type('Bangle') },
    ],
  },
};

/** Merge the group's base filter with the entry's own. */
export function presetFilters(group: MaterialGroup, preset: Preset): Filters {
  return { ...group.base, ...preset.filters };
}

/** Resolve /jewelry/<material>/<entry>; null when either segment is unknown. */
export function findPreset(materialSlug: string, entrySlug: string) {
  const group = MATERIAL_GROUPS[materialSlug];
  const preset = group?.entries.find(e => e.slug === entrySlug);
  if (!group || !preset) return null;
  return { group, preset, filters: presetFilters(group, preset) };
}

/** Every (material, entry) pair — used to pre-render the landing routes. */
export function allPresetParams() {
  return Object.entries(MATERIAL_GROUPS).flatMap(([material, group]) =>
    group.entries.map(entry => ({ material, entry: entry.slug })),
  );
}

/** The group whose base filter the current selection matches, for the chips. */
export function groupForFilters(filters: Filters): [string, MaterialGroup] | null {
  const entry = Object.entries(MATERIAL_GROUPS).find(([, group]) => {
    const [key, values] = Object.entries(group.base)[0];
    return values.every(v => filters[key]?.includes(v));
  });
  return entry ?? null;
}
