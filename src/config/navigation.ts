/**
 * Primary navigation + mega-menu structure.
 *
 * Two browse axes sit at the front of the menu:
 *   • "Jewelry"          → by CATEGORY  (/categories/[type])
 *   • "Shop by Material" → by METAL/GEMSTONE (/jewelry/[material] + facets)
 *
 * Category and material landing routes are canonical, SEO-friendly pages;
 * deeper refinements (purity, color, diamond origin, silver type) are just
 * query facets layered on top of a locked landing route. There are never
 * compound categories — only attribute combinations.
 */

export interface MegaLink { label: string; href: string }
export interface MegaColumn { heading: string; links: MegaLink[] }

const shop = (query: string) => `/shop?${query}`;
const category = (slug: string) => `/categories/${slug}`;

/** /jewelry/[material] with optional refinement facets layered on top. */
const jewelry = (material: string, params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `/jewelry/${material}${qs}`;
};

/* ── "Jewelry" — browse by category ──────────────────────────────────── */

export const JEWELRY_MENU: MegaLink[] = [
  { label: 'Rings', href: category('rings') },
  { label: 'Earrings', href: category('earrings') },
  { label: 'Necklaces', href: category('necklaces') },
  { label: 'Pendants', href: category('pendants') },
  { label: 'Bracelets', href: category('bracelets') },
  { label: 'Bangles', href: category('bangles') },
  { label: 'Chains', href: category('chains') },
  { label: 'Jewelry Sets', href: category('jewelry-sets') },
];

/* ── "Shop by Material" — browse by metal / gemstone ─────────────────── */

export const MATERIAL_MENU: MegaColumn[] = [
  {
    heading: 'Gold',
    links: [
      { label: 'All Gold', href: jewelry('gold') },
      { label: '24K Gold', href: jewelry('gold', { purity: '24K' }) },
      { label: '22K Gold', href: jewelry('gold', { purity: '22K' }) },
      { label: '18K Gold', href: jewelry('gold', { purity: '18K' }) },
      { label: 'Yellow Gold', href: jewelry('gold', { color: 'Yellow Gold' }) },
      { label: 'White Gold', href: jewelry('gold', { color: 'White Gold' }) },
      { label: 'Rose Gold', href: jewelry('gold', { color: 'Rose Gold' }) },
    ],
  },
  {
    heading: 'Diamond',
    links: [
      { label: 'All Diamond', href: jewelry('diamond') },
      { label: 'Natural Diamond', href: jewelry('diamond', { diamondType: 'Natural' }) },
      { label: 'Lab-Grown Diamond', href: jewelry('diamond', { diamondType: 'Lab Grown' }) },
    ],
  },
  {
    heading: 'Platinum',
    links: [
      { label: 'All Platinum', href: jewelry('platinum') },
    ],
  },
  {
    heading: 'Silver',
    links: [
      { label: 'All Silver', href: jewelry('silver') },
      { label: 'Sterling Silver', href: jewelry('silver', { silverType: 'Sterling Silver' }) },
      { label: 'Fine Silver', href: jewelry('silver', { silverType: 'Fine Silver' }) },
    ],
  },
];

/* ── Collections dropdown (sells emotion, not products) ──────────────── */

export const COLLECTIONS_MENU: MegaLink[] = [
  { label: 'Royal Heritage', href: shop('collection=Royal+Heritage') },
  { label: 'Classic', href: shop('collection=Classic') },
  { label: 'Minimal', href: shop('collection=Minimal') },
  { label: 'Wedding', href: shop('collection=Wedding') },
  { label: 'Luxury', href: shop('collection=Luxury') },
];

/* ── Primary nav ─────────────────────────────────────────────────────── */

export interface PrimaryNavItem {
  label: string;
  href: string;
  mega?: MegaColumn[];       // full-width mega menu
  dropdown?: MegaLink[];     // simple dropdown
}

export const PRIMARY_NAV_LEFT: PrimaryNavItem[] = [
  { label: 'Jewelry', href: '/categories', dropdown: JEWELRY_MENU },
  { label: 'Shop by Material', href: '/jewelry', mega: MATERIAL_MENU },
  { label: 'Bridal', href: shop('occasion=Wedding,Engagement') },
  { label: 'Collections', href: '/#collections', dropdown: COLLECTIONS_MENU },
];

export const PRIMARY_NAV_RIGHT: PrimaryNavItem[] = [
  { label: 'New Arrivals', href: shop('sort=new') },
  { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
  { label: 'Our Heritage', href: '/#heritage' },
  { label: 'Boutiques', href: '/boutiques' },
  { label: 'Client Services', href: '/client-services' },
];

export const PRIMARY_NAV_ALL: PrimaryNavItem[] = [
  { label: 'Home', href: '/' },
  ...PRIMARY_NAV_LEFT,
  ...PRIMARY_NAV_RIGHT,
];
