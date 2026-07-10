import { GemstoneKind, Material, Product } from './types';

/**
 * Mock catalog — ~36 sample products spanning every attribute dimension
 * (materials, purities, gold colors, genders, types, collections,
 * occasions, styles, diamond specs, availability, certifications).
 *
 * Swap this file for a database/API later — everything downstream
 * (filters, mega menus, search, product pages) reads only through
 * `CATALOG` and the helpers at the bottom.
 */

let n = 0;
const usedSlugs = new Set<string>();

/** name → URL-safe slug, de-accented and de-duplicated. */
function slugify(name: string): string {
  const base = name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents (Séraphine → Seraphine)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  let slug = base;
  let i = 2;
  while (usedSlugs.has(slug)) slug = `${base}-${i++}`;
  usedSlugs.add(slug);
  return slug;
}

/**
 * Builder input allows the legacy `material: 'Diamond'` written in the data
 * below; it is normalized to a metal (Gold) plus a `gemstones: ['Diamond']`
 * attribute, so "diamond" is a gemstone filter — never a metal.
 */
type ProductInput =
  Omit<Product, 'id' | 'sku' | 'slug' | 'images' | 'material' | 'gemstones'>
  & { sku?: string; material: Material | 'Diamond'; gemstones?: GemstoneKind[] };

/**
 * Small builder: fills id/sku/slug/images so entries below stay readable.
 * Images live in per-product folders — /uploads/products/<SKU>/<size>/<n>.jpg
 * (sizes: original, zoom, large, medium, thumb). Attributes like material,
 * recipient, or purity are DATABASE FILTERS, never folder names.
 */
function p(prod: ProductInput): Product {
  n++;
  const sku = prod.sku ?? `LUM-${String(n).padStart(4, '0')}`;
  const { material: rawMaterial, gemstones: rawGemstones, ...rest } = prod;

  // Legacy 'Diamond' material → real metal (Gold) + Diamond gemstone.
  const material: Material = rawMaterial === 'Diamond' ? 'Gold' : rawMaterial;
  const gemstones: GemstoneKind[] | undefined =
    rawGemstones ??
    (rawMaterial === 'Diamond' || rest.diamond ? ['Diamond'] : undefined);

  return {
    id: String(n),
    sku,
    slug: slugify(prod.name),
    material,
    ...(gemstones ? { gemstones } : {}),
    images: [
      `/uploads/products/${sku}/large/1.jpg`,
      `/uploads/products/${sku}/large/2.jpg`,
    ],
    ...rest,
  };
}

export const CATALOG: Product[] = [
  /* ── Gold — Rings ─────────────────────────────────────────────────── */
  p({
    name: 'Aurelle Wedding Band', description: 'A hand-burnished 22K band with a soft comfort-fit interior — the quiet centerpiece of a lifetime.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Ring',
    collection: 'Wedding', occasions: ['Wedding', 'Engagement'], style: 'Vintage',
    price: 86500, weightGrams: 6.2, availability: 'In Stock', stock: 8, featured: true,
  }),
  p({
    name: 'Séraphine Signet', description: 'A sculpted 18K white gold signet for men, finished with a brushed crest face.',
    material: 'Gold', purity: '18K', goldColor: 'White Gold', gender: 'Men', type: 'Ring',
    collection: 'Classic', occasions: ['Daily Wear', 'Anniversary'], style: 'Designer',
    price: 74200, weightGrams: 9.1, availability: 'Ready to Ship', stock: 5,
  }),
  p({
    name: 'Petit Or Ring', description: 'A whisper-thin 18K rose gold stacking ring from the Minimal collection.',
    material: 'Gold', purity: '18K', goldColor: 'Rose Gold', gender: 'Women', type: 'Ring',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Designer',
    price: 32800, weightGrams: 2.4, availability: 'In Stock', stock: 22, isNew: true,
  }),
  p({
    name: 'Maharani Polki Ring', description: 'Uncut polki diamonds set in 21K gold using the traditional jadau technique.',
    material: 'Gold', purity: '21K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Ring',
    collection: 'Royal Heritage', occasions: ['Wedding', 'Festival'], style: 'Polki',
    price: 168000, weightGrams: 8.8, availability: 'Made To Order', stock: 0,
  }),

  /* ── Gold — Necklaces / Chains / Pendants / Lockets ───────────────── */
  p({
    name: 'Héritage Rani Haar', description: 'A ceremonial 22K seven-strand necklace, three hundred hours in the making.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Necklace',
    collection: 'Royal Heritage', occasions: ['Wedding', 'Festival'], style: 'Vintage',
    price: 486000, weightGrams: 42.6, availability: 'Made To Order', stock: 0, featured: true,
  }),
  p({
    name: 'Lumière Box Chain', description: 'A precision-cut 22K box chain for men — substantial, understated, permanent.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Men', type: 'Chain',
    collection: 'Classic', occasions: ['Daily Wear'], style: 'Designer',
    price: 128500, weightGrams: 14.2, availability: 'In Stock', stock: 6,
  }),
  p({
    name: 'Fil d’Or Chain', description: 'An 18K rose gold cable chain, fine enough to disappear against the skin.',
    material: 'Gold', purity: '18K', goldColor: 'Rose Gold', gender: 'Unisex', type: 'Chain',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Designer',
    price: 44600, weightGrams: 4.1, availability: 'In Stock', stock: 18, isNew: true,
  }),
  p({
    name: 'Cœur Locket', description: 'A hinged 21K heart locket that holds two portraits, engraved by hand.',
    material: 'Gold', purity: '21K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Locket',
    collection: 'Classic', occasions: ['Anniversary', 'Daily Wear'], style: 'Vintage',
    price: 58900, weightGrams: 6.8, availability: 'Ready to Ship', stock: 9,
  }),
  p({
    name: 'Étoile Pendant', description: 'An eight-point star pendant in 18K white gold on a matching fine chain.',
    material: 'Gold', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Pendant',
    collection: 'Minimal', occasions: ['Daily Wear', 'Anniversary'], style: 'Designer',
    price: 39800, weightGrams: 3.6, availability: 'In Stock', stock: 14,
  }),

  /* ── Gold — Earrings / Bangles / Bracelets / Nose Pins ────────────── */
  p({
    name: 'Jhumka Royale', description: 'Cascading 22K jhumkas from the Royal Heritage archive, with hand-strung gold beads.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Earring',
    collection: 'Royal Heritage', occasions: ['Wedding', 'Festival'], style: 'Vintage',
    price: 142000, weightGrams: 16.4, availability: 'In Stock', stock: 4, featured: true,
  }),
  p({
    name: 'Goutte Hoops', description: 'Fluid teardrop hoops in 18K rose gold — the everyday signature.',
    material: 'Gold', purity: '18K', goldColor: 'Rose Gold', gender: 'Women', type: 'Earring',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Designer',
    price: 36400, weightGrams: 3.2, availability: 'In Stock', stock: 20, isNew: true,
  }),
  p({
    name: 'Noor Bangle Pair', description: 'A matched pair of 22K bangles with engraved lotus scrollwork.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Bangle',
    collection: 'Classic', occasions: ['Wedding', 'Festival', 'Daily Wear'], style: 'Vintage',
    price: 218000, weightGrams: 24.8, availability: 'In Stock', stock: 3,
  }),
  p({
    name: 'Première Baby Bangle', description: 'A child’s first gold — a smooth 21K bangle with safety clasp.',
    material: 'Gold', purity: '21K', goldColor: 'Yellow Gold', gender: 'Kids', type: 'Bangle',
    collection: 'Classic', occasions: ['Festival'], style: 'Designer',
    price: 41200, weightGrams: 4.6, availability: 'Ready to Ship', stock: 11,
  }),
  p({
    name: 'Maille Bracelet', description: 'A woven 18K yellow gold mesh bracelet with an invisible magnetic clasp.',
    material: 'Gold', purity: '18K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Bracelet',
    collection: 'Luxury', occasions: ['Anniversary', 'Daily Wear'], style: 'Designer',
    price: 96700, weightGrams: 11.3, availability: 'In Stock', stock: 7,
  }),
  p({
    name: 'Lien Bracelet Homme', description: 'A 14K white gold curb bracelet for men, satin-finished.',
    material: 'Gold', purity: '14K', goldColor: 'White Gold', gender: 'Men', type: 'Bracelet',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Designer',
    price: 52300, weightGrams: 8.9, availability: 'In Stock', stock: 10, isNew: true,
  }),
  p({
    name: 'Kiran Nose Pin', description: 'A single radiant granule of 24K gold on a fine 18K post.',
    material: 'Gold', purity: '24K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Nose Pin',
    collection: 'Minimal', occasions: ['Daily Wear', 'Festival'], style: 'Designer',
    price: 12800, weightGrams: 0.8, availability: 'In Stock', stock: 30,
  }),

  /* ── Diamond — Rings ──────────────────────────────────────────────── */
  p({
    name: "L'Éclat Solitaire", description: 'Our signature one-carat round solitaire, six prongs of 18K white gold holding pure fire.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Ring',
    collection: 'Luxury', occasions: ['Engagement', 'Wedding'], style: 'Solitaire',
    price: 685000, weightGrams: 4.2, availability: 'In Stock', stock: 2, featured: true,
    diamond: { caratWeight: 1.0, shape: 'Round', color: 'D', clarity: 'IF', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Halo Céleste Ring', description: 'A half-carat oval center ringed by a halo of eighteen brilliants in rose gold.',
    material: 'Diamond', purity: '18K', goldColor: 'Rose Gold', gender: 'Women', type: 'Ring',
    collection: 'Wedding', occasions: ['Engagement', 'Anniversary'], style: 'Halo',
    price: 312000, weightGrams: 3.8, availability: 'In Stock', stock: 4, isNew: true,
    diamond: { caratWeight: 0.5, shape: 'Oval', color: 'E', clarity: 'VVS1', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Soirée Cocktail Ring', description: 'An emerald-cut champagne diamond flanked by color stones — made for candlelight.',
    material: 'Diamond', purity: '18K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Ring',
    collection: 'Luxury', occasions: ['Anniversary', 'Festival'], style: 'Cocktail',
    price: 428000, weightGrams: 6.4, availability: 'Made To Order', stock: 0,
    diamond: { caratWeight: 2.0, shape: 'Emerald', color: 'F', clarity: 'VS1', origin: 'Natural', certification: 'HRD' },
  }),
  p({
    name: 'Éclat Vert Ring', description: 'A lab-grown princess diamond beside a Zambian emerald — modern color, ancient craft.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Ring',
    collection: 'Minimal', occasions: ['Daily Wear', 'Anniversary'], style: 'Color Stone',
    price: 148000, weightGrams: 3.1, availability: 'In Stock', stock: 6, isNew: true,
    diamond: { caratWeight: 0.25, shape: 'Princess', color: 'F', clarity: 'VS2', origin: 'Lab Grown', certification: 'IGI' },
  }),
  p({
    name: 'Monsieur Diamond Band', description: 'A men’s 18K band channel-set with a row of princess diamonds.',
    material: 'Diamond', purity: '18K', goldColor: 'Yellow Gold', gender: 'Men', type: 'Ring',
    collection: 'Classic', occasions: ['Wedding', 'Anniversary'], style: 'Designer',
    price: 224000, weightGrams: 7.6, availability: 'Ready to Ship', stock: 3,
    diamond: { caratWeight: 0.5, shape: 'Princess', color: 'G', clarity: 'VS1', origin: 'Natural', certification: 'IGI' },
  }),

  /* ── Diamond — Necklaces / Pendants / Earrings ────────────────────── */
  p({
    name: 'Rivière Éternelle', description: 'Forty-one graduated diamonds in a seamless river of light. Our masterpiece.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Necklace',
    collection: 'Luxury', occasions: ['Wedding', 'Anniversary'], style: 'Designer',
    price: 2260000, weightGrams: 22.4, availability: 'Made To Order', stock: 0, featured: true,
    diamond: { caratWeight: 12.4, shape: 'Round', color: 'D', clarity: 'VVS1', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Solitaire Drop Pendant', description: 'A single pear diamond suspended from an invisible 18K white gold bail.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Pendant',
    collection: 'Minimal', occasions: ['Daily Wear', 'Anniversary'], style: 'Solitaire',
    price: 186000, weightGrams: 2.2, availability: 'In Stock', stock: 8, isNew: true,
    diamond: { caratWeight: 0.5, shape: 'Pear', color: 'E', clarity: 'VVS2', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Lueur Studs', description: 'Twin half-carat rounds in four-prong 18K settings — the first diamonds she’ll never take off.',
    material: 'Diamond', purity: '18K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Earring',
    collection: 'Classic', occasions: ['Daily Wear', 'Engagement'], style: 'Solitaire',
    price: 264000, weightGrams: 2.8, availability: 'In Stock', stock: 5, featured: true,
    diamond: { caratWeight: 1.0, shape: 'Round', color: 'E', clarity: 'VVS2', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Halo Nuit Earrings', description: 'Heart-shaped centers inside pavé halos, in blushing 18K rose gold.',
    material: 'Diamond', purity: '18K', goldColor: 'Rose Gold', gender: 'Women', type: 'Earring',
    collection: 'Wedding', occasions: ['Wedding', 'Anniversary'], style: 'Halo',
    price: 348000, weightGrams: 4.4, availability: 'Made To Order', stock: 0,
    diamond: { caratWeight: 1.2, shape: 'Heart', color: 'F', clarity: 'VS1', origin: 'Natural', certification: 'HRD' },
  }),
  p({
    name: 'Astre Lab Pendant', description: 'A brilliant lab-grown round in a knife-edge bezel — conscious luxury.',
    material: 'Diamond', purity: '14K', goldColor: 'White Gold', gender: 'Unisex', type: 'Pendant',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Solitaire',
    price: 84500, weightGrams: 1.9, availability: 'In Stock', stock: 12, isNew: true,
    diamond: { caratWeight: 0.5, shape: 'Round', color: 'G', clarity: 'VS2', origin: 'Lab Grown', certification: 'IGI' },
  }),

  /* ── Diamond — Bracelets / Bangles / Nose Pins / Chains / Lockets ─── */
  p({
    name: 'Ligne Tennis Bracelet', description: 'Thirty-eight matched rounds in a classic four-prong line, 18K white gold.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Bracelet',
    collection: 'Luxury', occasions: ['Anniversary', 'Wedding'], style: 'Designer',
    price: 745000, weightGrams: 9.8, availability: 'In Stock', stock: 2, featured: true,
    diamond: { caratWeight: 3.8, shape: 'Round', color: 'E', clarity: 'VVS2', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Kada Étoilée', description: 'A rigid 21K kada set with rose-cut polki diamonds in the old Mughal manner.',
    material: 'Diamond', purity: '21K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Bangle',
    collection: 'Royal Heritage', occasions: ['Wedding', 'Festival'], style: 'Polki',
    price: 386000, weightGrams: 18.6, availability: 'Made To Order', stock: 0,
    diamond: { caratWeight: 2.4, shape: 'Round', color: 'H', clarity: 'SI1', origin: 'Natural', certification: 'HRD' },
  }),
  p({
    name: 'Scintille Nose Pin', description: 'A 0.10 carat round diamond on an 18K post — the smallest LUMINA.',
    material: 'Diamond', purity: '18K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Nose Pin',
    collection: 'Minimal', occasions: ['Daily Wear', 'Festival'], style: 'Solitaire',
    price: 28400, weightGrams: 0.6, availability: 'In Stock', stock: 25,
    diamond: { caratWeight: 0.1, shape: 'Round', color: 'F', clarity: 'VS1', origin: 'Natural', certification: 'IGI' },
  }),
  p({
    name: 'Vintage Portrait Locket', description: 'An engraved 18K locket with a rose-cut diamond clasp, in the Victorian style.',
    material: 'Diamond', purity: '18K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Locket',
    collection: 'Royal Heritage', occasions: ['Anniversary'], style: 'Vintage',
    price: 124000, weightGrams: 8.2, availability: 'Ready to Ship', stock: 4,
    diamond: { caratWeight: 0.25, shape: 'Round', color: 'G', clarity: 'VS2', origin: 'Natural', certification: 'IGI' },
  }),
  p({
    name: 'Éclat Station Chain', description: 'Five bezel-set diamonds stationed along an 18K white gold chain.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Chain',
    collection: 'Classic', occasions: ['Daily Wear', 'Anniversary'], style: 'Designer',
    price: 196000, weightGrams: 5.4, availability: 'In Stock', stock: 6,
    diamond: { caratWeight: 0.75, shape: 'Round', color: 'F', clarity: 'VVS2', origin: 'Natural', certification: 'GIA' },
  }),

  /* ── Platinum & Silver ────────────────────────────────────────────── */
  p({
    name: 'Platine Union Bands', description: 'His-and-hers platinum wedding bands, seamless and hypoallergenic.',
    material: 'Platinum', gender: 'Unisex', type: 'Ring',
    collection: 'Wedding', occasions: ['Wedding', 'Engagement'], style: 'Designer',
    price: 158000, weightGrams: 12.4, availability: 'Made To Order', stock: 0,
  }),
  p({
    name: 'Platine Solitaire', description: 'A platinum-set 0.75 carat round — the coolest metal for the whitest stone.',
    material: 'Platinum', gender: 'Women', type: 'Ring',
    collection: 'Luxury', occasions: ['Engagement'], style: 'Solitaire',
    price: 486000, weightGrams: 5.1, availability: 'In Stock', stock: 2,
    diamond: { caratWeight: 0.75, shape: 'Round', color: 'D', clarity: 'VVS1', origin: 'Natural', certification: 'GIA' },
  }),
  p({
    name: 'Argent Cuff', description: 'A sculptural sterling silver cuff from the atelier’s young line.',
    material: 'Silver', gender: 'Unisex', type: 'Bracelet',
    collection: 'Minimal', occasions: ['Daily Wear'], style: 'Designer',
    price: 18600, weightGrams: 22.0, availability: 'In Stock', stock: 15, isNew: true,
  }),
  p({
    name: 'Argent Charm Chain', description: 'A silver charm chain for kids, with a tiny gold-washed star.',
    material: 'Silver', gender: 'Kids', type: 'Chain',
    collection: 'Classic', occasions: ['Festival', 'Daily Wear'], style: 'Designer',
    price: 9400, weightGrams: 6.2, availability: 'In Stock', stock: 28,
  }),

  /* ── Bridal set anchors ───────────────────────────────────────────── */
  p({
    name: 'Nikkah Bridal Set', description: 'The complete 22K bridal parure: necklace, jhumkas, tikka and bangles.',
    material: 'Gold', purity: '22K', goldColor: 'Yellow Gold', gender: 'Women', type: 'Necklace',
    collection: 'Wedding', occasions: ['Wedding'], style: 'Polki',
    price: 892000, weightGrams: 68.4, availability: 'Made To Order', stock: 0, featured: true,
  }),
  p({
    name: 'Voile Bridal Earrings', description: 'Chandelier earrings veiled in diamond pavé for the wedding morning.',
    material: 'Diamond', purity: '18K', goldColor: 'White Gold', gender: 'Women', type: 'Earring',
    collection: 'Wedding', occasions: ['Wedding', 'Engagement'], style: 'Halo',
    price: 428000, weightGrams: 8.8, availability: 'Made To Order', stock: 0, isNew: true,
    diamond: { caratWeight: 2.2, shape: 'Round', color: 'E', clarity: 'VVS2', origin: 'Natural', certification: 'GIA' },
  }),
];

/* ── Lookup helpers ──────────────────────────────────────────────────── */

export function getProductBySku(sku: string): Product | undefined {
  return CATALOG.find(product => product.sku === sku);
}

/** Primary product lookup — /products/[slug] is the canonical URL. */
export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG.find(product => product.slug === slug);
}

/** Related products: same type or same collection, excluding itself. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return CATALOG.filter(
    other =>
      other.sku !== product.sku &&
      (other.type === product.type || other.collection === product.collection),
  ).slice(0, limit);
}
