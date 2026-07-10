/**
 * Primary navigation — every top-level item opens a full-width horizontal
 * mega menu. Each mega link is a preset filter URL or a real landing route;
 * there are never compound categories, only attribute combinations.
 */

export interface MegaLink { label: string; href: string }
export interface MegaColumn { heading: string; links: MegaLink[] }

const shop = (query: string) => `/shop?${query}`;
const category = (slug: string) => `/categories/${slug}`;
const jewelry = (material: string, params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `/jewelry/${material}${qs}`;
};
const col = (heading: string, links: MegaLink[]): MegaColumn => ({ heading, links });

/* ── Jewelry — by category ───────────────────────────────────────────── */
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
    { label: 'Gold', href: jewelry('gold') },
    { label: 'Diamond', href: jewelry('diamond') },
    { label: 'Platinum', href: jewelry('platinum') },
    { label: 'Silver', href: jewelry('silver') },
  ]),
  col('Featured', [
    { label: 'New Arrivals', href: shop('sort=new') },
    { label: 'Bridal', href: shop('occasion=Wedding,Engagement') },
    { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
    { label: 'For Women', href: shop('gender=Women') },
  ]),
];

/* ── Shop by Material — by metal / gemstone ──────────────────────────── */
export const MATERIAL_MENU: MegaColumn[] = [
  col('Gold', [
    { label: 'All Gold', href: jewelry('gold') },
    { label: '24K Gold', href: jewelry('gold', { purity: '24K' }) },
    { label: '22K Gold', href: jewelry('gold', { purity: '22K' }) },
    { label: '18K Gold', href: jewelry('gold', { purity: '18K' }) },
    { label: 'Yellow Gold', href: jewelry('gold', { color: 'Yellow Gold' }) },
    { label: 'White Gold', href: jewelry('gold', { color: 'White Gold' }) },
    { label: 'Rose Gold', href: jewelry('gold', { color: 'Rose Gold' }) },
  ]),
  col('Diamond', [
    { label: 'All Diamond', href: jewelry('diamond') },
    { label: 'Natural Diamond', href: jewelry('diamond', { diamondType: 'Natural' }) },
    { label: 'Lab-Grown Diamond', href: jewelry('diamond', { diamondType: 'Lab Grown' }) },
  ]),
  col('Platinum', [
    { label: 'All Platinum', href: jewelry('platinum') },
  ]),
  col('Silver', [
    { label: 'All Silver', href: jewelry('silver') },
    { label: 'Sterling Silver', href: jewelry('silver', { silverType: 'Sterling Silver' }) },
    { label: 'Fine Silver', href: jewelry('silver', { silverType: 'Fine Silver' }) },
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
    { label: 'New Gold', href: shop('sort=new&material=Gold') },
    { label: 'New Diamond', href: shop('sort=new&gemstone=Diamond') },
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

/* ── Our Heritage ────────────────────────────────────────────────────── */
export const HERITAGE_MENU: MegaColumn[] = [
  col('The Maison', [
    { label: 'Our Story', href: '/#heritage' },
    { label: 'Craftsmanship', href: '/#craft' },
    { label: 'Book an Appointment', href: '/#appointment' },
  ]),
  col('Materials', [
    { label: 'Gold', href: jewelry('gold') },
    { label: 'Diamond', href: jewelry('diamond') },
    { label: 'Platinum', href: jewelry('platinum') },
    { label: 'Silver', href: jewelry('silver') },
  ]),
  col('Discover', [
    { label: 'Collections', href: shop('collection=Luxury') },
    { label: 'Boutiques', href: '/boutiques' },
    { label: 'Client Services', href: '/client-services' },
  ]),
];

/* ── Boutiques ───────────────────────────────────────────────────────── */
export const BOUTIQUES_MENU: MegaColumn[] = [
  col('Visit Us', [
    { label: 'All Boutiques', href: '/boutiques' },
    { label: 'Book an Appointment', href: '/#appointment' },
  ]),
  col('Our Salons', [
    { label: 'Paris', href: '/boutiques' },
    { label: 'London', href: '/boutiques' },
    { label: 'Dubai', href: '/boutiques' },
    { label: 'Dhaka', href: '/boutiques' },
  ]),
];

/* ── Client Services ─────────────────────────────────────────────────── */
export const SERVICES_MENU: MegaColumn[] = [
  col('Services', [
    { label: 'Personal Styling', href: '/client-services' },
    { label: 'Engraving', href: '/client-services' },
    { label: 'Resizing & Repairs', href: '/client-services' },
    { label: 'Care & Cleaning', href: '/client-services' },
    { label: 'Certificates', href: '/client-services' },
  ]),
  col('Support', [
    { label: 'Shipping & Returns', href: '/client-services' },
    { label: 'Contact', href: '/#appointment' },
    { label: 'Appointments', href: '/#appointment' },
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
  { label: 'Shop by Material', href: '/jewelry', mega: MATERIAL_MENU },
  { label: 'Bridal', href: shop('occasion=Wedding,Engagement'), mega: BRIDAL_MENU },
  { label: 'New Arrivals', href: shop('sort=new'), mega: NEW_MENU },
];

export const PRIMARY_NAV_RIGHT: PrimaryNavItem[] = [
  { label: 'Collections', href: '/#collections', mega: COLLECTIONS_MENU },
  { label: 'Gifts', href: shop('occasion=Anniversary,Festival'), mega: GIFTS_MENU },
  { label: 'Our Heritage', href: '/#heritage', mega: HERITAGE_MENU },
  { label: 'Boutiques', href: '/boutiques', mega: BOUTIQUES_MENU },
  { label: 'Client Services', href: '/client-services', mega: SERVICES_MENU },
];

export const PRIMARY_NAV_ALL: PrimaryNavItem[] = [
  { label: 'Home', href: '/', mega: [] },
  ...PRIMARY_NAV_LEFT,
  ...PRIMARY_NAV_RIGHT,
];
