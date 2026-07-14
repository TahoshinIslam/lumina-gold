/**
 * The home page's editorial image slots — the single source of truth shared by
 * the admin (Home Models) and the landing page itself.
 *
 * Each section is a *gallery*, not a single image: one upload sits still, more
 * than one cross-fades.
 *
 * `width`/`height` are a BOUNDING BOX, not a crop. An upload is only shrunk
 * until it fits inside them and keeps its own proportions; the page then shapes
 * the frame to the photo. (They used to be a fixed frame that photos were
 * cover-cropped into, which cut the tops off the model shots.)
 */
export type HomeSectionKey =
  | 'hero' | 'hero_phone'
  | 'collections' | 'craft' | 'heritage'
  | 'editorial' | 'editorial_phone';

export interface HomeSection {
  key: HomeSectionKey;
  /** The eyebrow the customer actually sees on the page, so the admin can find it. */
  eyebrow: string;
  heading: string;
  hint: string;
  /** Largest rendition kept on disk — the photo's own proportions are preserved. */
  width: number;
  height: number;
  /**
   * What to shoot/export, in the admin's words. Every section renders at a
   * different size and only two of them crop, so one blanket "upload a big
   * image" is useless — this is the per-section answer.
   */
  recommend: {
    /** e.g. "1200 × 1600 px" */
    size: string;
    /** e.g. "3:4 portrait" */
    ratio: string;
    /** The one thing that will bite them if they ignore it. */
    caution: string;
  };
  /**
   * True for the two sections painted as the viewport itself (the landing
   * photograph and The Editorial). They are the only ones that really crop, and
   * the only ones a phone needs a second, upright rendition of — which the
   * upload derives from the same photograph, at PHONE_CROP below.
   */
  backdrop?: boolean;
  /** Shown until the admin uploads anything, so the page is never blank. */
  fallback: string[];
}

/**
 * The upright rendition made automatically for a backdrop.
 *
 * Cropped by SALIENCE, not by taking the middle: sharp's attention strategy
 * keeps the region a person actually looks at — on the current hero that is the
 * solitaire, which a centre crop cuts in half. Nobody has to prepare a second
 * photograph, and anybody who wants to can still override it by uploading one to
 * the section's "— phone" slot.
 */
export const PHONE_CROP = { width: 1080, height: 1920 };

export const HOME_SECTIONS: HomeSection[] = [
  {
    // The first thing anyone sees, and it was a filename hardcoded in the
    // stylesheet — the one photograph on the site the admin could not change.
    key: 'hero',
    eyebrow: 'Landing page',
    heading: 'The opening photograph',
    hint: 'The full-screen picture behind the brand name. It is a fixed backdrop the page scrolls over, so only the FIRST image is used — a second one will not fade in here.',
    // The backdrop is the VIEWPORT (position: fixed; inset: 0), painted with
    // background-size: cover, so it is the one place a photo really is cropped —
    // and on a phone the viewport is portrait (390 × 844), which crops a
    // landscape shot down to its middle third.
    width: 2560,
    height: 1440,
    recommend: {
      size: '2560 × 1440 px',
      ratio: '16:9 landscape',
      caution: 'A phone screen is tall and narrow, so a wide photograph cannot fill it without losing its sides. An upright crop for phones is made from this image automatically — centred on the piece, not on the middle of the frame. Upload your own below only if you want to overrule it.',
    },
    backdrop: true,
    fallback: ['/uploads/home/Hero.png'],
  },
  {
    // A landscape photograph cannot also be a phone photograph. The backdrop is
    // the viewport, and a phone's viewport is roughly 9:19 — covering it with a
    // 16:9 shot throws away three quarters of the frame's width. This is the
    // separate crop for those screens; with nothing here, phones keep using the
    // wide one exactly as before.
    key: 'hero_phone',
    eyebrow: 'Landing page — phone',
    heading: 'The opening photograph, upright',
    hint: 'OPTIONAL — and only if you want to overrule the automatic one. Phones already get an upright crop made from the wide landing photograph, framed on the piece. Upload here to use your own instead. Only the FIRST image is used.',
    width: 1440,
    height: 2560,
    recommend: {
      size: '1080 × 1920 px',
      ratio: '9:16 upright',
      caution: 'Frame this one for a phone: the piece in the upper half, above where the headline sits. It fills the screen, so a little is still trimmed at the top and bottom — keep the subject away from the very edges.',
    },
    fallback: [],
  },
  {
    key: 'collections',
    eyebrow: 'The Collections',
    heading: 'Three Expressions of Light',
    hint: 'Three cards — Engagement, Wedding, Anniversary. The first three images fill them; any beyond that cross-fade inside the cards, so you can keep adding. Nothing is cropped: each card takes the shape of its photo.',
    // The card renders at most ~411px wide (1920 screen), so 1200px is already
    // twice what a retina screen needs; anything larger is only download weight.
    width: 1200,
    height: 1600,
    recommend: {
      size: '1200 × 1600 px',
      ratio: '3:4 portrait',
      caution: 'Give all three the same shape. A card is shaped by its first photo, and a later one of a different shape is fitted inside that frame whole — which leaves dark bars around it rather than cutting it.',
    },
    fallback: [
      '/uploads/home/collection-eclat.png',
      '/uploads/home/collection-riviere.png',
      '/uploads/home/collection-sculpte.png',
    ],
  },
  {
    key: 'craft',
    eyebrow: 'Savoir-Faire',
    heading: 'One Pair of Hands. Six Hundred Hours.',
    hint: 'The large portrait beside the copy. Add several model shots and they cross-fade. Nothing is cropped — the frame takes the shape of the first photo.',
    // Renders at ~585px wide on a 1920 screen; 1200 covers retina twice over.
    width: 1200,
    height: 1500,
    recommend: {
      size: '1200 × 1500 px',
      ratio: '4:5 portrait',
      caution: 'Shoot every photo in this section the same shape. The frame is set by the first one, and a differently-shaped photo after it is fitted inside whole, leaving bars around it.',
    },
    fallback: ['/uploads/home/craft-artisan.png'],
  },
  {
    key: 'heritage',
    eyebrow: 'Heritage',
    heading: 'Four Decades of Light',
    hint: 'The archive photograph beside the maison story. Add several and they cross-fade. Nothing is cropped — the frame takes the shape of the first photo.',
    width: 1200,
    height: 1500,
    recommend: {
      size: '1200 × 1500 px',
      ratio: '4:5 portrait',
      caution: 'Same shape for every photo in this section. The frame is set by the first one; a differently-shaped photo after it is fitted inside whole and shows bars around it.',
    },
    fallback: ['/uploads/home/heritage-archive.png'],
  },
  {
    key: 'editorial',
    eyebrow: 'The Editorial',
    heading: 'Rings Collections',
    hint: 'The full-width band reading “Rings Collections — one stone, one story”. Like the landing photograph it is a fixed backdrop the page scrolls over, so only the FIRST image is used.',
    width: 2560,
    height: 1440,
    recommend: {
      size: '2560 × 1440 px',
      ratio: '16:9 landscape',
      caution: 'As with the landing photograph, an upright crop for phones is made from this image automatically. The band prints its heading across the middle, so leave the centre of the photograph quiet if you want the words to read.',
    },
    backdrop: true,
    fallback: ['/uploads/home/GZdjz.jpg'],
  },
  {
    key: 'editorial_phone',
    eyebrow: 'The Editorial — phone',
    heading: 'Rings Collections, upright',
    hint: 'OPTIONAL — and only if you want to overrule the automatic one. Phones already get an upright crop made from the wide Editorial photograph. Upload here to use your own instead. Only the FIRST image is used.',
    width: 1440,
    height: 2560,
    recommend: {
      size: '1080 × 1920 px',
      ratio: '9:16 upright',
      caution: 'The heading and the “Explore the Rings” button sit across the middle of this band, so leave the centre of the photograph quiet.',
    },
    fallback: [],
  },
];

export const HOME_SECTION_KEYS = HOME_SECTIONS.map(s => s.key);

export function homeSection(key: string): HomeSection | undefined {
  return HOME_SECTIONS.find(s => s.key === key);
}

/** One image per card, cross-fading; card n takes every 3rd image from n. */
export function splitAcrossCards<T>(images: T[], cards: number): T[][] {
  return Array.from({ length: cards }, (_, card) =>
    images.filter((_, index) => index % cards === card));
}
