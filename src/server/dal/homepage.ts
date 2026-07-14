import { unstable_cache } from 'next/cache';
import { getHomepageShowcases } from '@/server/dal/catalog';
import { getCategoryTiles, getHomeMedia } from '@/server/dal/home';
import { getLatestArticles } from '@/server/dal/journal';
import { getFeaturedCampaign } from '@/server/dal/campaigns';
import { getTestimonials } from '@/server/dal/testimonials';

/**
 * Everything the home page reads, fetched once and then cached.
 *
 * The page is the same for every visitor and changes only when an admin edits
 * it, so re-querying the database on every hit was pure waste: at 500 concurrent
 * users its p95 was 2 seconds while the rest of the site stayed fast.
 *
 * The DATA is cached, not the page — and that distinction is the whole point.
 * Marking the route `revalidate = 60` would cache the rendered HTML, but it also
 * makes Next PRERENDER it at build time, which means the build needs a reachable
 * database. It does not have one in CI, and a deploy pipeline generally cannot
 * reach production MySQL either; the build broke exactly there. Caching at this
 * level keeps the build free of the database (nothing here runs until a request
 * arrives) while still sparing the database the per-request load.
 *
 * Tagged, so an admin edit invalidates it immediately rather than leaving the
 * shop an minute out of date — see HOME_TAG below. The 60s window is only a
 * backstop for anything that forgets to.
 */
export const HOME_TAG = 'home';

export const getHomePageData = unstable_cache(
  async () => {
    const [showcases, categories, media, articles, campaign, testimonials] = await Promise.all([
      getHomepageShowcases(),
      getCategoryTiles(),
      getHomeMedia(),
      getLatestArticles(3),
      getFeaturedCampaign(),
      getTestimonials(),
    ]);
    return { showcases, categories, media, articles, campaign, testimonials };
  },
  ['home-page-data'],
  { tags: [HOME_TAG], revalidate: 60 },
);
