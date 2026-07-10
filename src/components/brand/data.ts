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
};

export const COLLECTIONS: Collection[] = [
  {
    number: 'No. 01',
    name: "L'Éclat",
    description: 'Solitaire diamonds of exceptional fire, set in hand-burnished 24k gold.',
    src: '/uploads/home/collection-eclat.png',
    alt: 'Solitaire diamond ring',
  },
  {
    number: 'No. 02',
    name: "Rivière d'Or",
    description: 'Cascading necklaces where every stone is chosen for flawless clarity.',
    src: '/uploads/home/collection-riviere.png',
    alt: 'Diamond rivière necklace',
  },
  {
    number: 'No. 03',
    name: 'Or Sculpté',
    description: 'Sculptural gold forms, shaped by master hands over hundreds of hours.',
    src: '/uploads/home/collection-sculpte.png',
    alt: 'Sculptural gold cuff',
  },
];

export type CraftFeature = { title: string; description: string };

export const CRAFT_FEATURES: CraftFeature[] = [
  { title: 'Hand-Selected Diamonds', description: 'Fewer than 1% of stones meet our standard.' },
  { title: 'Master Artisans', description: 'One artisan, one creation, start to finish.' },
  { title: 'Ethical Sourcing', description: 'Fully traceable gold and conflict-free stones.' },
  { title: 'Lifetime Craftsmanship', description: 'Every piece guaranteed for a lifetime of wear.' },
];

export type Product = { sku: string; name: string; price: string; src: string };

export const PRODUCTS: Product[] = [
  { sku: 'eclat-solitaire', name: "L'Éclat Solitaire", price: '$48,500', src: '/uploads/home/GZdjz.jpg' },
  { sku: 'riviere-eternelle', name: 'Rivière Éternelle', price: '$186,000', src: '/uploads/home/fSg1p.jpg' },
  { sku: 'manchette-or', name: 'Manchette d’Or', price: '$62,300', src: '/uploads/home/bvE3z.jpg' },
  { sku: 'lueur-pendants', name: 'Lueur Pendants', price: '$34,900', src: '/uploads/home/9v96v.jpg' },
];

export type HeritageStat = { value: number; label: string };

export const HERITAGE_STATS: HeritageStat[] = [
  { value: 41, label: 'Years' },
  { value: 27, label: 'Master Artisans' },
  { value: 3, label: 'Maisons' },
];

export type Testimonial = { quote: string; name: string; city: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The rivière necklace I commissioned took eight months. When it arrived, my wife wept. Nothing we own compares to it.',
    name: 'A. de Villiers',
    city: 'Genève',
  },
  {
    quote:
      'Their private salon experience is unlike anything in Paris. Three generations of my family now wear LUMINA.',
    name: 'M. Hartwell',
    city: 'New York',
  },
  {
    quote:
      "I have collected high jewelry for twenty years. LUMINA's gold work is the finest I have ever held.",
    name: 'S. Al-Rashid',
    city: 'Paris',
  },
  {
    quote:
      'From the first sketch to the final polish, they treated my mother\u2019s heirloom stones with reverence. The reset bangles are breathtaking.',
    name: 'N. Rahman',
    city: 'Dhaka',
  },
  {
    quote:
      'The engagement ring was ready before the promised date, with a certificate for every stone. Service as flawless as the diamond.',
    name: 'E. Whitmore',
    city: 'London',
  },
];

export const APPOINTMENT_FEATURES = [
  'Personal Consultation',
  'Diamond Selection',
  'Bespoke Design',
];
