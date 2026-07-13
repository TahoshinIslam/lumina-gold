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
export type HomeSectionKey = 'collections' | 'craft' | 'heritage';

export interface HomeSection {
  key: HomeSectionKey;
  /** The eyebrow the customer actually sees on the page, so the admin can find it. */
  eyebrow: string;
  heading: string;
  hint: string;
  /** Largest rendition kept on disk — the photo's own proportions are preserved. */
  width: number;
  height: number;
  /** Shown until the admin uploads anything, so the page is never blank. */
  fallback: string[];
}

export const HOME_SECTIONS: HomeSection[] = [
  {
    key: 'collections',
    eyebrow: 'The Collections',
    heading: 'Three Expressions of Light',
    hint: 'Three cards. The first three images fill them; any beyond that cross-fade inside the cards, so you can keep adding. Photos keep their own shape — nothing is cropped.',
    width: 1100,
    height: 1450,
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
    hint: 'The large portrait beside the copy. Add several model shots and they cross-fade.',
    width: 1100,
    height: 1400,
    fallback: ['/uploads/home/craft-artisan.png'],
  },
  {
    key: 'heritage',
    eyebrow: 'Heritage',
    heading: 'Four Decades of Light',
    hint: 'The archive photograph beside the maison story. Add several and they cross-fade.',
    width: 1100,
    height: 1400,
    fallback: ['/uploads/home/heritage-archive.png'],
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
