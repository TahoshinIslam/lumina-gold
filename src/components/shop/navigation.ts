/**
 * Primary navigation + mega-menu structure (IA spec Steps 2–4).
 *
 * Every mega-menu link is just a preset filter URL on /shop — the
 * storefront never has compound categories, only attribute combinations.
 */

export interface MegaLink { label: string; href: string }
export interface MegaColumn { heading: string; links: MegaLink[] }

const shop = (query: string) => `/shop?${query}`;

/* ── Gold mega menu (Step 3) ─────────────────────────────────────────── */

export const GOLD_MENU: MegaColumn[] = [
  {
    heading: 'Shop by Category',
    links: [
      { label: 'Rings', href: shop('material=Gold&type=Ring') },
      { label: 'Earrings', href: shop('material=Gold&type=Earring') },
      { label: 'Necklaces', href: shop('material=Gold&type=Necklace') },
      { label: 'Pendants', href: shop('material=Gold&type=Pendant') },
      { label: 'Bracelets', href: shop('material=Gold&type=Bracelet') },
      { label: 'Bangles', href: shop('material=Gold&type=Bangle') },
      { label: 'Chains', href: shop('material=Gold&type=Chain') },
      { label: 'Lockets', href: shop('material=Gold&type=Locket') },
      { label: 'Nose Pins', href: shop('material=Gold&type=Nose+Pin') },
      { label: 'Bridal Sets', href: shop('material=Gold&occasion=Wedding') },
      { label: 'Traditional Jewellery', href: shop('material=Gold&style=Polki,Vintage') },
    ],
  },
  {
    heading: 'Shop by Purity',
    links: [
      { label: '24K', href: shop('material=Gold&purity=24K') },
      { label: '22K', href: shop('material=Gold&purity=22K') },
      { label: '21K', href: shop('material=Gold&purity=21K') },
      { label: '18K', href: shop('material=Gold&purity=18K') },
      { label: '14K', href: shop('material=Gold&purity=14K') },
    ],
  },
  {
    heading: 'Shop by Gold Color',
    links: [
      { label: 'Yellow Gold', href: shop('material=Gold&color=Yellow+Gold') },
      { label: 'White Gold', href: shop('material=Gold&color=White+Gold') },
      { label: 'Rose Gold', href: shop('material=Gold&color=Rose+Gold') },
    ],
  },
  {
    heading: 'Shop by Recipient',
    links: [
      { label: 'Women', href: shop('material=Gold&gender=Women') },
      { label: 'Men', href: shop('material=Gold&gender=Men') },
      { label: 'Kids', href: shop('material=Gold&gender=Kids') },
    ],
  },
  {
    heading: 'Shop by Occasion',
    links: [
      { label: 'Wedding', href: shop('material=Gold&occasion=Wedding') },
      { label: 'Engagement', href: shop('material=Gold&occasion=Engagement') },
      { label: 'Anniversary', href: shop('material=Gold&occasion=Anniversary') },
      { label: 'Festival', href: shop('material=Gold&occasion=Festival') },
    ],
  },
  {
    heading: 'Shop by Price',
    links: [
      { label: 'Under ৳50,000', href: shop('material=Gold&price=under-50k') },
      { label: '৳50K – ৳100K', href: shop('material=Gold&price=50k-100k') },
      { label: '৳100K – ৳250K', href: shop('material=Gold&price=100k-250k') },
      { label: '৳250K+', href: shop('material=Gold&price=250k-plus') },
    ],
  },
];

/* ── Diamond mega menu (Step 4) ──────────────────────────────────────── */

export const DIAMOND_MENU: MegaColumn[] = [
  {
    heading: 'Shop by Category',
    links: [
      { label: 'Rings', href: shop('gemstone=Diamond&type=Ring') },
      { label: 'Necklaces', href: shop('gemstone=Diamond&type=Necklace') },
      { label: 'Bracelets', href: shop('gemstone=Diamond&type=Bracelet') },
      { label: 'Earrings', href: shop('gemstone=Diamond&type=Earring') },
      { label: 'Pendants', href: shop('gemstone=Diamond&type=Pendant') },
      { label: 'Bangles', href: shop('gemstone=Diamond&type=Bangle') },
      { label: 'Lockets', href: shop('gemstone=Diamond&type=Locket') },
      { label: 'Chains', href: shop('gemstone=Diamond&type=Chain') },
      { label: 'Nose Pins', href: shop('gemstone=Diamond&type=Nose+Pin') },
    ],
  },
  {
    heading: 'Shop by Diamond Style',
    links: [
      { label: 'Solitaire', href: shop('gemstone=Diamond&style=Solitaire') },
      { label: 'Halo', href: shop('gemstone=Diamond&style=Halo') },
      { label: 'Cocktail', href: shop('gemstone=Diamond&style=Cocktail') },
      { label: 'Color Stone', href: shop('gemstone=Diamond&style=Color+Stone') },
      { label: 'Designer', href: shop('gemstone=Diamond&style=Designer') },
      { label: 'Polki', href: shop('gemstone=Diamond&style=Polki') },
    ],
  },
  {
    heading: 'Shop by Recipient',
    links: [
      { label: 'Women', href: shop('gemstone=Diamond&gender=Women') },
      { label: 'Men', href: shop('gemstone=Diamond&gender=Men') },
      { label: 'Kids', href: shop('gemstone=Diamond&gender=Kids') },
    ],
  },
  {
    heading: 'Shop by Price',
    links: [
      { label: 'Under ৳100K', href: shop('gemstone=Diamond&price=under-50k,50k-100k') },
      { label: '৳100K – ৳250K', href: shop('gemstone=Diamond&price=100k-250k') },
      { label: '৳250K+', href: shop('gemstone=Diamond&price=250k-plus') },
    ],
  },
  {
    heading: 'Shop by Collection',
    links: [
      { label: 'Royal Heritage', href: shop('gemstone=Diamond&collection=Royal+Heritage') },
      { label: 'Luxury', href: shop('gemstone=Diamond&collection=Luxury') },
      { label: 'Wedding', href: shop('gemstone=Diamond&collection=Wedding') },
      { label: 'Minimal', href: shop('gemstone=Diamond&collection=Minimal') },
    ],
  },
];

/* ── Collections dropdown (Step 5 — sells emotion, not products) ─────── */

export const COLLECTIONS_MENU: MegaLink[] = [
  { label: 'Royal Heritage', href: shop('collection=Royal+Heritage') },
  { label: 'Classic', href: shop('collection=Classic') },
  { label: 'Minimal', href: shop('collection=Minimal') },
  { label: 'Wedding', href: shop('collection=Wedding') },
  { label: 'Luxury', href: shop('collection=Luxury') },
];

/* ── Primary nav (Step 2 — 8–10 items, no more) ──────────────────────── */

export interface PrimaryNavItem {
  label: string;
  href: string;
  mega?: MegaColumn[];       // full-width mega menu
  dropdown?: MegaLink[];     // simple dropdown
}

export const PRIMARY_NAV_LEFT: PrimaryNavItem[] = [
  { label: 'New Arrivals', href: shop('sort=new') },
  { label: 'Gold', href: shop('material=Gold'), mega: GOLD_MENU },
  { label: 'Diamond', href: shop('gemstone=Diamond'), mega: DIAMOND_MENU },
  { label: 'Bridal', href: shop('occasion=Wedding,Engagement') },
];

export const PRIMARY_NAV_RIGHT: PrimaryNavItem[] = [
  { label: 'Collections', href: shop('collection=Luxury'), dropdown: COLLECTIONS_MENU },
  { label: 'Gifts', href: shop('occasion=Anniversary,Festival') },
  { label: 'About', href: '/#craft' },
  { label: 'Contact', href: '/#appointment' },
];

export const PRIMARY_NAV_ALL: PrimaryNavItem[] = [
  { label: 'Home', href: '/' },
  ...PRIMARY_NAV_LEFT,
  ...PRIMARY_NAV_RIGHT,
];
