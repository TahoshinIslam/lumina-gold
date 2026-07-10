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

export type Material = 'Gold' | 'Diamond' | 'Platinum' | 'Silver';

export type MetalPurity = '24K' | '22K' | '21K' | '18K' | '14K';

export type GoldColor = 'Yellow Gold' | 'White Gold' | 'Rose Gold';

export type Gender = 'Women' | 'Men' | 'Kids' | 'Unisex';

export type JewelleryType =
  | 'Ring'
  | 'Necklace'
  | 'Bracelet'
  | 'Pendant'
  | 'Chain'
  | 'Locket'
  | 'Bangle'
  | 'Nose Pin'
  | 'Earring';

export type CollectionName =
  | 'Royal Heritage'
  | 'Classic'
  | 'Minimal'
  | 'Wedding'
  | 'Luxury';

export type Occasion =
  | 'Wedding'
  | 'Engagement'
  | 'Anniversary'
  | 'Daily Wear'
  | 'Festival';

export type Style =
  | 'Solitaire'
  | 'Cocktail'
  | 'Halo'
  | 'Vintage'
  | 'Designer'
  | 'Polki'
  | 'Color Stone';

export type DiamondOrigin = 'Natural' | 'Lab Grown';
export type DiamondShape = 'Round' | 'Princess' | 'Oval' | 'Pear' | 'Emerald' | 'Heart';
export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H';
export type DiamondClarity = 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1';

export type Availability = 'In Stock' | 'Made To Order' | 'Ready to Ship';
export type Certification = 'GIA' | 'IGI' | 'HRD';

/** Diamond specification — present only on diamond-set pieces. */
export interface DiamondSpec {
  caratWeight: number;
  shape: DiamondShape;
  color: DiamondColor;
  clarity: DiamondClarity;
  origin: DiamondOrigin;
  certification: Certification;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;

  /* Independent attribute dimensions */
  material: Material;
  purity?: MetalPurity;      // metal pieces
  goldColor?: GoldColor;     // gold pieces
  gender: Gender;
  type: JewelleryType;
  collection: CollectionName;
  occasions: Occasion[];
  style?: Style;

  /* Commerce */
  price: number;             // BDT (৳)
  weightGrams: number;       // metal weight
  diamond?: DiamondSpec;
  availability: Availability;
  stock: number;

  /* Media */
  images: string[];

  /* Merchandising flags */
  isNew?: boolean;
  featured?: boolean;
}

/** Format a BDT price with lakh-style grouping: ৳ 1,25,000 */
export function formatPrice(price: number): string {
  return '৳ ' + new Intl.NumberFormat('en-IN').format(price);
}
