/**
 * Product model — the single source of truth for the catalog.
 *
 * ARCHITECTURAL PRINCIPLE (from the brand IA spec):
 * "Category" is only ONE dimension of a product. Purity, metal color,
 * gender, occasion, collection, style, price, certification and
 * availability are all INDEPENDENT attributes. There is never a category
 * like "Diamond Ladies Color Stone Cocktail Ring" — that's just a
 * combination of attribute filters.
 */

/**
 * Material is a METAL only. A diamond (or any gemstone) is NOT a material —
 * it is an independent `gemstones` attribute, because a diamond piece always
 * has a metal too (e.g. a diamond ring is 18K White Gold set with diamonds).
 */
export type Material = 'Gold' | 'Platinum' | 'Silver';

export type GemstoneKind = 'Diamond' | 'Ruby' | 'Emerald' | 'Sapphire' | 'Pearl';

export type MetalPurity = '24K' | '22K' | '21K' | '18K' | '14K';

export type GoldColor = 'Yellow Gold' | 'White Gold' | 'Rose Gold';

export type Gender = 'Women' | 'Men' | 'Kids' | 'Unisex';

/**
 * A jewellery type is the FORM of the piece — never the metal, the stone, or
 * who it is for. "Gold Ring" is type Ring + material Gold; "Gold Mens" is not a
 * type at all, it is gender Men. Keeping this axis clean is what lets one piece
 * appear under every entry point it legitimately belongs to.
 *
 * Churi is the local name for a bangle, so it maps to `Bangle` and is merely
 * *labelled* "Churi" on the gold and platinum menus.
 *
 * This is a plain `string` (not a closed union) because it is sourced from
 * the admin-editable `categories` table — a fixed union would drift the
 * moment an admin adds a new category. The well-known values below (Ring,
 * Necklace, …) remain the vocabulary the filter engine and product detail
 * page key off of; anything else an admin creates just flows through as-is.
 */
export type JewelleryType = string;

/** Silver sub-type (purity/grade), shown only when browsing Silver. */
export type SilverType = 'Sterling Silver' | 'Fine Silver';

/** Sourced from the admin-editable `collections` table — same reasoning as `JewelleryType`. */
export type CollectionName = string;

export type Occasion =
  | 'Wedding'
  | 'Engagement'
  | 'Anniversary'
  | 'Daily Wear'
  | 'Festival';

/** Sourced from the `styles` lookup table (admin-picked, not admin-CRUD, but has more seed values than the original closed union). */
export type Style = string;

export type DiamondOrigin = 'Natural' | 'Lab Grown';
export type DiamondShape = string;
export type DiamondColor = string;
export type DiamondClarity = string;

export type Availability = 'In Stock' | 'Made To Order' | 'Ready to Ship' | 'Out of Stock';
export type Certification = 'GIA' | 'IGI' | 'HRD' | 'SGL' | 'AGS' | 'Other';
export type DiamondCut = string;

/**
 * Diamond specification — present only on diamond-set pieces.
 *
 * Every grade is optional, carat and shape included. A boutique records what it
 * knows about a piece: a 30-stone chain may be sold on its stone count and
 * clarity with no per-stone carat weight ever measured. Requiring a carat here
 * is what made such a piece carry no diamond spec at all — and so vanish from
 * every diamond facet in the sidebar.
 */
export interface DiamondSpec {
  caratWeight?: number;    // carat weight per stone
  shape?: DiamondShape;
  color?: DiamondColor;
  clarity?: DiamondClarity;
  cut?: DiamondCut;
  origin: DiamondOrigin;
  certification?: Certification;
  certificateNumber?: string;
  quantity?: number;       // number of stones
  caratTotal?: number;     // total diamond weight (CTW)
}

/**
 * A measured dimension of the piece — Height, Width, Thickness, Pin Length,
 * Gauge. Descriptive, NOT selectable: it is shown under Specifications and
 * never creates a variant, which is what stops a 3-height x 3-width x
 * 2-thickness locket from becoming 18 SKUs of an item sold one way.
 */
export interface ProductSpec {
  label: string;
  value: string;
}

/** One purchasable attribute value on a variant, e.g. { code: 'ring_size', label: 'Ring Size', value: '7' }. */
export interface VariantAttribute {
  code: string;
  label: string;
  value: string;
}

/**
 * A real, admin-priced purchasable combination (e.g. 24K + Size 6) — its own
 * price, stock, SKU, weight, barcode and status. `attributes` is generic so a
 * second (or third) variant axis beyond Purity never needs a schema change.
 */
export interface ProductVariant {
  id: string;
  sku: string;
  purity?: MetalPurity;
  price: number;
  comparePrice?: number;     // strike-through "was" price
  stock: number;
  weightGrams?: number;
  barcode?: string;
  status: 'active' | 'inactive';
  attributes: VariantAttribute[];
}

export interface Product {
  id: string;
  sku: string;
  slug: string;              // URL identity: /products/[slug]
  name: string;
  description: string;

  /* Independent attribute dimensions */
  material: Material;        // the METAL
  gemstones?: GemstoneKind[]; // stones set into the piece (Diamond, Ruby, …)
  purity?: MetalPurity;      // metal pieces
  goldColor?: GoldColor;     // gold pieces
  silverType?: SilverType;   // silver pieces
  gender: Gender;
  type: JewelleryType;
  collection: CollectionName;
  occasions: Occasion[];
  style?: Style;

  /* Commerce */
  /**
   * BDT (৳) — WHAT THE CUSTOMER PAYS. Any markdown is already applied, so this
   * is the number the till will charge. It used to mean the pre-discount list
   * price, which is how the homepage came to advertise ৳10,000 for a piece the
   * checkout rang up at ৳20,000. `price` now means one thing everywhere.
   */
  price: number;
  /** The struck-through "was" — only set when it is genuinely above `price`. */
  comparePrice?: number;
  weightGrams: number;       // metal weight
  diamond?: DiamondSpec;
  /** Measured dimensions — display only, never a variant axis. */
  specifications?: ProductSpec[];
  availability: Availability;
  stock: number;

  /* Media */
  images: string[];

  /* Merchandising flags */
  isNew?: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  hasDiscount?: boolean;     // a markdown is applied — `price` already reflects it
  discountPercent?: number;  // 0-100, only set when hasDiscount (drives the -X% badge)

  /* Variants — only populated on the product detail fetch (getProductBySlug).
     `price`/`stock` above stay "the default variant's" for cards/listings. */
  variants?: ProductVariant[];
  priceFrom?: number;        // lowest active-variant price, for "From ৳X" cards
  variantCount?: number;
}

/** Format a BDT price with lakh-style grouping: ৳ 1,25,000 */
export function formatPrice(price: number): string {
  return '৳ ' + new Intl.NumberFormat('en-IN').format(price);
}

/**
 * Which "new arrival" badge/glow treatment a card gets. Diamond takes
 * priority over gold — a new gold ring set with diamonds is more usefully
 * flagged as "Diamond" than a generic "New", since the stone is the more
 * distinctive, higher-value detail a shopper scans for.
 */
export type ProductBadgeKind = 'diamond' | 'gold' | 'new' | null;

export function productBadge(product: Pick<Product, 'isNew' | 'material' | 'gemstones'>): ProductBadgeKind {
  if (!product.isNew) return null;
  if (product.gemstones?.includes('Diamond')) return 'diamond';
  if (product.material === 'Gold') return 'gold';
  return 'new';
}

/**
 * How the metal is named to a shopper.
 *
 * On a plain metal piece the metal IS the piece, so it stands alone ("Gold").
 * On a gemstone piece it is only the setting, and naming it bare reads as if
 * the piece were sold as that metal — a diamond bracelet listed as "Platinum"
 * looks like a platinum bracelet. So it is named as the body it actually is:
 * "Platinum Body", "White Gold Body". The colour wins over the bare metal where
 * the admin set one, since "White Gold" is what the shopper is looking for.
 */
export function metalLabel(product: Pick<Product, 'material' | 'goldColor' | 'gemstones'>): string {
  const metal = product.goldColor ?? product.material;
  return product.gemstones?.length ? `${metal} Body` : metal;
}
