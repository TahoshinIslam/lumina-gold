/**
 * All static content for the LUMINA page lives here.
 * Components stay purely presentational; edit copy/prices/images in one place.
 */

export type NavLink = { label: string; href: string };

export const NAV_LINKS_LEFT: NavLink[] = [
  { label: 'Collections', href: '#collections' },
  { label: 'Savoir-Faire', href: '#craft' },
];

export const NAV_LINKS_RIGHT: NavLink[] = [
  { label: 'Heritage', href: '#heritage' },
  { label: 'Appointments', href: '#appointment' },
];

export const MOBILE_LINKS: NavLink[] = [...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT];

export const MARQUEE_ITEMS = [
  'Haute Joaillerie',
  'Paris',
  'Genève',
  'New York',
  'Est. 1985',
  '24K Gold',
  'Rare Diamonds',
];

export type Collection = {
  number: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  /** Where "Explore" goes — a real, filtered listing, not a dead link. */
  href: string;
};

/**
 * The three cards under "Three Expressions of Light".
 *
 * They are OCCASIONS, not invented collection names: a shopper arrives at this
 * page because something is happening in their life, and "Or Sculpté" answers a
 * question nobody asked. Each card is a live filter on the shop — the occasion
 * facet already exists, and every one of these has pieces behind it.
 */
export const COLLECTIONS: Collection[] = [
  {
    number: 'No. 01',
    name: 'Engagement',
    description: 'Solitaires of exceptional fire, cut to hold the light of the moment you ask.',
    src: '/uploads/home/collection-eclat.png',
    alt: 'Solitaire diamond engagement ring',
    href: '/shop?occasion=Engagement',
  },
  {
    number: 'No. 02',
    name: 'Wedding',
    description: 'Bands and bridal sets in hand-burnished gold, made to be worn every day after.',
    src: '/uploads/home/collection-riviere.png',
    alt: 'Gold wedding band',
    href: '/shop?occasion=Wedding',
  },
  {
    number: 'No. 03',
    name: 'Anniversary',
    description: 'Pieces for the years that follow — every stone chosen for flawless clarity.',
    src: '/uploads/home/collection-sculpte.png',
    alt: 'Diamond anniversary necklace',
    href: '/shop?occasion=Anniversary',
  },
];

export type CraftFeature = { title: string; description: string };

export const CRAFT_FEATURES: CraftFeature[] = [
  { title: 'Hand-Selected Diamonds', description: 'Fewer than 1% of stones meet our standard.' },
  { title: 'Master Artisans', description: 'One artisan, one creation, start to finish.' },
  { title: 'Ethical Sourcing', description: 'Fully traceable gold and conflict-free stones.' },
  { title: 'Lifetime Craftsmanship', description: 'Every piece guaranteed for a lifetime of wear.' },
];

export type HeritageStat = { value: number; label: string };

export const HERITAGE_STATS: HeritageStat[] = [
  { value: 41, label: 'Years' },
  { value: 27, label: 'Master Artisans' },
  { value: 3, label: 'Maisons' },
];

export const APPOINTMENT_FEATURES = [
  'Personal Consultation',
  'Diamond Selection',
  'Bespoke Design',
];
