import { GemstoneKind, JewelleryType, Material } from './types';

/**
 * URL taxonomy for the two browse axes: METAL/gemstone (/jewelry/[material])
 * and CATEGORY (/categories/[type]). These are the ONLY hard-coded slugs;
 * everything else is a query filter. Both routes render the same ShopPage
 * with a locked filter, so /jewelry/gold and /categories/rings are just
 * canonical, SEO-friendly landing pages for a preset filter.
 */

export const MATERIAL_SLUGS: Record<string, Material> = {
  gold: 'Gold',
  platinum: 'Platinum',
  silver: 'Silver',
};

/** Diamond is a gemstone, but customers still browse "by diamond", so it is
 *  routed under /jewelry too — as a gemstone filter, not a metal. */
export const GEMSTONE_SLUGS: Record<string, GemstoneKind> = {
  diamond: 'Diamond',
  ruby: 'Ruby',
  emerald: 'Emerald',
  sapphire: 'Sapphire',
  pearl: 'Pearl',
};

export const CATEGORY_SLUGS: Record<string, JewelleryType> = {
  rings: 'Ring',
  necklaces: 'Necklace',
  earrings: 'Earring',
  bracelets: 'Bracelet',
  bangles: 'Bangle',
  chains: 'Chain',
  pendants: 'Pendant',
  lockets: 'Locket',
  'nose-pins': 'Nose Pin',
  'jewelry-sets': 'Jewelry Set',
};

/** Plural display label for a jewellery type, e.g. "Nose Pin" → "Nose Pins". */
export function pluralType(type: JewelleryType): string {
  return `${type}s`;
}
