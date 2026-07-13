/**
 * Primary navigation — every top-level item opens a full-width horizontal
 * mega menu. Each mega link is a preset filter URL or a real landing route;
 * there are never compound categories, only attribute combinations.
 *
 * Diamond, Gold and Platinum are top-level items in their own right. They used
 * to be columns inside one "Shop by Material" menu, which buried the three
 * things shoppers actually come for behind a generic label. The maison pages
 * (Boutiques, Our Heritage, Client Services) moved the other way — out of the
 * nav and into the footer (FOOTER_COLUMNS), since they are read once, not
 * shopped. That trade keeps the bar short enough to scan.
 */

import { MATERIAL_GROUPS } from '@/features/catalog/presets';

export interface MegaLink { label: string; href: string }
export interface MegaColumn { heading: string; links: MegaLink[] }

const shop = (query: string) => `/shop?${query}`;
const category = (slug: string) => `/categories/${slug}`;
const jewelry = (material: string, params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `/jewelry/${material}${qs}`;
};
const col = (heading: string, links: MegaLink[]): MegaColumn => ({ heading, links });

/* ── Diamond · Gold · Platinum ───────────────────────────────────────────
 * The entry columns are generated from MATERIAL_GROUPS, so the menu, the
 * /jewelry/<material>/<entry> landing routes and the shop-page quick chips can
 * never drift apart — add an entry once and all three pick it up. */

/**
 * A material's menu: its entries split across exactly two columns, plus any
 * refinement columns. Two columns, not chunks of N, so the headings — which are
 * the React keys — stay unique however many entries a group grows to.
 */
function materialMega(materialSlug: string, ...refine: MegaColumn[]): MegaColumn[] {
  const group = MATERIAL_GROUPS[materialSlug];
  const links: MegaLink[] = group.entries.map(entry => ({
    label: entry.label,
    href: `/jewelry/${materialSlug}/${entry.slug}`,
  }));
  const half = Math.ceil(links.length / 2);
  return [
    col(`Shop ${group.label}`, [
      { label: `All ${group.label}`, href: jewelry(materialSlug) },
      ...links.slice(0, half),
    ]),
    col(`More ${group.label}`, links.slice(half)),
    ...refine,
  ];
}

/* Purity, colour and origin are a separate axis — they stack on top of any
 * entry (Gold Ring → then 22K), so they get their own column instead of being
 * multiplied into the entry list. */
export const DIAMOND_MENU: MegaColumn[] = materialMega(
  'diamond',
  col('Diamond Origin', [
    { label: 'Natural Diamond', href: jewelry('diamond', { diamondType: 'Natural' }) },
    { label: 'Lab-Grown Diamond', href: jewelry('diamond', { diamondType: 'Lab Grown' }) },
  ]),
  col('Featured', [
    { label: 'New Diamond', href: shop('sort=new&gemstone=Diamond') },
    { label: 'Engagement Rings', href: shop('gemstone=Diamond&occasion=Engagement&type=Ring') },
    { label: 'Diamond Bridal', href: shop('gemstone=Diamond&occasion=Wedding,Engagement') },
  ]),
);

export const GOLD_MENU: MegaColumn[] = materialMega(
  'gold',
  col('Gold Purity', [
    { label: '24K Gold', href: jewelry('gold', { purity: '24K' }) },
    { label: '22K Gold', href: jewelry('gold', { purity: '22K' }) },
    { label: '18K Gold', href: jewelry('gold', { purity: '18K' }) },
  ]),
  col('Gold Colour', [
    { label: 'Yellow Gold', href: jewelry('gold', { color: 'Yellow Gold' }) },
    { label: 'White Gold', href: jewelry('gold', { color: 'White Gold' }) },
    { label: 'Rose Gold', href: jewelry('gold', { color: 'Rose Gold' }) },
  ]),
);

export const PLATINUM_MENU: MegaColumn[] = materialMega(
  'platinum',
  col('Featured', [
    { label: 'New Platinum', href: shop('sort=new&material=Platinum') },
    { label: 'Platinum Bridal', href: shop('material=Platinum&occasion=Engagement,Wedding') },
    { label: 'Platinum Gifts', href: shop('material=Platinum&occasion=Anniversary') },
  ]),
);

/* ── Jewelry — by category. Also the only home Silver has now that it is not a
 * top-level material (it has no merchandised entries of its own). ────────── */
export const JEWELRY_MENU: MegaColumn[] = [
  col('Shop by Category', [
    { label: 'Rings', href: category('rings') },
    { label: 'Earrings', href: category('earrings') },
    { label: 'Necklaces', href: category('necklaces') },
    { label: 'Pendants', href: category('pendants') },
    { label: 'Bracelets', href: category('bracelets') },
    { label: 'Bangles', href: category('bangles') },
    { label: 'Chains', href: category('chains') },
    { label: 'Jewelry Sets', href: category('jewelry-sets') },
  ]),
  col('By Material', [
    { label: 'Diamond', href: jewelry('diamond') },
    { label: 'Gold', href: jewelry('gold') },
    { label: 'Platinum', href: jewelry('platinum') },
    { label: 'Silver', href: jewelry('silver') },
    { label: 'Sterling Silver', href: jewelry('silver', { silverType: 'Sterling Silver' }) },
  ]),
  col('Featured', [
    { label: 'New Arrivals', href: shop('sort=new') },
    { label: 'Bridal', href: shop('occasion=Wedding,Engagement') },
    { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
    { label: 'For Women', href: shop('gender=Women') },
  ]),
];

/* ── Bridal ──────────────────────────────────────────────────────────── */
export const BRIDAL_MENU: MegaColumn[] = [
  col('Bridal Jewellery', [
    { label: 'Engagement Rings', href: shop('occasion=Engagement&type=Ring') },
    { label: 'Wedding Bands', href: shop('occasion=Wedding&type=Ring') },
    { label: 'Bridal Sets', href: shop('occasion=Wedding') },
    { label: 'Anniversary', href: shop('occasion=Anniversary') },
  ]),
  col('By Material', [
    { label: 'Diamond Bridal', href: shop('gemstone=Diamond&occasion=Wedding,Engagement') },
    { label: 'Gold Bridal', href: shop('material=Gold&occasion=Wedding') },
    { label: 'Platinum Bridal', href: shop('material=Platinum&occasion=Engagement') },
  ]),
  col('For the Bride', [
    { label: 'Necklaces', href: shop('occasion=Wedding&type=Necklace') },
    { label: 'Earrings', href: shop('occasion=Wedding&type=Earring') },
    { label: 'Bangles', href: shop('occasion=Wedding&type=Bangle') },
  ]),
];

/* ── New Arrivals ────────────────────────────────────────────────────── */
export const NEW_MENU: MegaColumn[] = [
  col('New In', [
    { label: 'All New Arrivals', href: shop('sort=new') },
    { label: 'New Rings', href: shop('sort=new&type=Ring') },
    { label: 'New Necklaces', href: shop('sort=new&type=Necklace') },
    { label: 'New Earrings', href: shop('sort=new&type=Earring') },
  ]),
  col('By Material', [
    { label: 'New Diamond', href: shop('sort=new&gemstone=Diamond') },
    { label: 'New Gold', href: shop('sort=new&material=Gold') },
    { label: 'New Platinum', href: shop('sort=new&material=Platinum') },
    { label: 'New Silver', href: shop('sort=new&material=Silver') },
  ]),
  col('Highlights', [
    { label: 'Bridal', href: shop('occasion=Wedding,Engagement') },
    { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
    { label: 'Collections', href: shop('collection=Luxury') },
  ]),
];

/* ── Collections ─────────────────────────────────────────────────────── */
export const COLLECTIONS_MENU: MegaColumn[] = [
  col('The Collections', [
    { label: 'Royal Heritage', href: shop('collection=Royal+Heritage') },
    { label: 'Classic', href: shop('collection=Classic') },
    { label: 'Minimal', href: shop('collection=Minimal') },
    { label: 'Wedding', href: shop('collection=Wedding') },
    { label: 'Luxury', href: shop('collection=Luxury') },
  ]),
  col('Explore', [
    { label: 'Craftsmanship', href: '/#craft' },
    { label: 'Our Heritage', href: '/#heritage' },
    { label: 'New Arrivals', href: shop('sort=new') },
  ]),
];

/* ── Gifts ───────────────────────────────────────────────────────────── */
export const GIFTS_MENU: MegaColumn[] = [
  col('Shop by Recipient', [
    { label: 'For Her', href: shop('gender=Women') },
    { label: 'For Him', href: shop('gender=Men') },
    { label: 'For Kids', href: shop('gender=Kids') },
  ]),
  col('By Occasion', [
    { label: 'Anniversary', href: shop('occasion=Anniversary') },
    { label: 'Festival', href: shop('occasion=Festival') },
    { label: 'Wedding', href: shop('occasion=Wedding') },
    { label: 'Engagement', href: shop('occasion=Engagement') },
  ]),
  col('By Price', [
    { label: 'Under ৳50,000', href: shop('price=under-50k') },
    { label: '৳50K – ৳100K', href: shop('price=50k-100k') },
    { label: '৳100K – ৳250K', href: shop('price=100k-250k') },
    { label: '৳250K and above', href: shop('price=250k-plus') },
  ]),
];

/* ── Primary nav — every item has a full-width mega ──────────────────── */

export interface PrimaryNavItem {
  label: string;
  href: string;
  mega: MegaColumn[];
}

export const PRIMARY_NAV_LEFT: PrimaryNavItem[] = [
  { label: 'Jewelry', href: '/categories', mega: JEWELRY_MENU },
  { label: 'Diamond', href: jewelry('diamond'), mega: DIAMOND_MENU },
  { label: 'Gold', href: jewelry('gold'), mega: GOLD_MENU },
  { label: 'Platinum', href: jewelry('platinum'), mega: PLATINUM_MENU },
];

export const PRIMARY_NAV_RIGHT: PrimaryNavItem[] = [
  { label: 'Bridal', href: shop('occasion=Wedding,Engagement'), mega: BRIDAL_MENU },
  { label: 'New Arrivals', href: shop('sort=new'), mega: NEW_MENU },
  { label: 'Collections', href: '/#collections', mega: COLLECTIONS_MENU },
  { label: 'Gifts', href: shop('occasion=Anniversary,Festival'), mega: GIFTS_MENU },
];

export const PRIMARY_NAV_ALL: PrimaryNavItem[] = [
  { label: 'Home', href: '/', mega: [] },
  ...PRIMARY_NAV_LEFT,
  ...PRIMARY_NAV_RIGHT,
];

/* ── Footer — the maison pages the nav no longer carries ─────────────────
 * Boutiques, Our Heritage and Client Services live here now. They are
 * reference reading, not shopping paths, so the footer is where people look
 * for them — and the nav bar gets its room back. */
export const FOOTER_COLUMNS: MegaColumn[] = [
  col('Our Heritage', [
    { label: 'Our Story', href: '/#heritage' },
    { label: 'Craftsmanship', href: '/#craft' },
    { label: 'The Collections', href: '/#collections' },
    { label: 'Book an Appointment', href: '/#appointment' },
  ]),
  col('Boutiques', [
    { label: 'All Boutiques', href: '/boutiques' },
    { label: 'Paris', href: '/boutiques' },
    { label: 'London', href: '/boutiques' },
    { label: 'Dubai', href: '/boutiques' },
    { label: 'Dhaka', href: '/boutiques' },
  ]),
  col('Client Services', [
    { label: 'Personal Styling', href: '/client-services' },
    { label: 'Engraving', href: '/client-services' },
    { label: 'Resizing & Repairs', href: '/client-services' },
    { label: 'Care & Cleaning', href: '/client-services' },
    { label: 'Certificates', href: '/client-services' },
    { label: 'Shipping & Returns', href: '/client-services' },
  ]),
  col('Shop', [
    { label: 'Diamond', href: jewelry('diamond') },
    { label: 'Gold', href: jewelry('gold') },
    { label: 'Platinum', href: jewelry('platinum') },
    { label: 'Silver', href: jewelry('silver') },
    { label: 'New Arrivals', href: shop('sort=new') },
    { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
  ]),
];
