import LuminaPage from "@/components/brand/LuminaPage";
import { getHomepageShowcases } from "@/server/dal/catalog";
import { getCategoryTiles, getHomeMedia, sectionImages } from "@/server/dal/home";
import { getLatestArticles } from "@/server/dal/journal";
import { getFeaturedCampaign } from "@/server/dal/campaigns";
import { getTestimonials } from "@/server/dal/testimonials";
import { optimized, BACKDROP_WIDTH, BACKDROP_PHONE_WIDTH } from "@/features/shared/optimized";

// The home page is the same for every visitor and changes only when an admin
// edits it — not per request. So it is cached, not re-rendered from thirteen-plus
// database queries on every hit: under load that fan-out against a small
// connection pool was the page's p95 climbing to two seconds while everything
// else stayed fast.
//
// It stays fresh two ways. Every admin action that can change it already calls
// revalidatePath('/') (product flags, categories, home media, testimonials,
// journal, gold rates and campaigns — the last two only after this change), so
// an edit shows on the very next request. `revalidate` is the safety net: a
// backstop for anything not explicitly revalidated, so the page can never be
// more than a minute stale even if a path is missed.
export const revalidate = 60;

export default async function Home() {
  // All eight showcases in one trip instead of eight. Each of the old calls was
  // three queries (rows, then images, then stones), so this alone was 24 of the
  // page's 47 round trips — for a couple of dozen products out of one small table.
  const [
    showcases, categories, media, articles, campaign, testimonials,
  ] = await Promise.all([
    getHomepageShowcases(),
    getCategoryTiles(),
    getHomeMedia(),
    getLatestArticles(3),
    getFeaturedCampaign(),
    getTestimonials(),
  ]);

  // The opening photograph and the Rings band are fixed backdrops the page
  // scrolls over, not galleries — the first upload is the one that shows.
  const heroImage = sectionImages(media, "hero")[0]?.src;
  const editorialImage = sectionImages(media, "editorial")[0]?.src;

  /* The upright crop phones get. Two ways it can exist, and the admin's own
   * always wins: a photograph they uploaded to the "— phone" slot, or, failing
   * that, the crop the upload derived from the wide photograph itself. Undefined
   * only when nothing has been uploaded at all, and phones then keep the shipped
   * wide picture exactly as before. */
  const heroPhoneImage = sectionImages(media, "hero_phone")[0]?.src
    ?? media.hero[0]?.image_phone
    ?? undefined;
  const editorialPhoneImage = sectionImages(media, "editorial_phone")[0]?.src
    ?? media.editorial[0]?.image_phone
    ?? undefined;

  /* The hero backdrop is the page's largest image and it is a CSS background —
   * which the browser's preload scanner cannot see. It is only discovered once
   * the stylesheet has been fetched and the rule matched, so it starts late.
   * Preloading it hands the browser the URL in the HTML itself.
   *
   * `media` on each link so a phone fetches only the upright crop and a desktop
   * only the wide one — the same two conditions the stylesheet switches on. A
   * preload with no media would download both and waste the one it did not use. */
  const heroPreload = optimized(heroImage, BACKDROP_WIDTH);
  const heroPhonePreload = optimized(heroPhoneImage, BACKDROP_PHONE_WIDTH);

  return (
    <>
      {heroPreload && (
        <link
          rel="preload" as="image" href={heroPreload} fetchPriority="high"
          media="(min-aspect-ratio: 3/4)"
        />
      )}
      {heroPhonePreload && (
        <link
          rel="preload" as="image" href={heroPhonePreload} fetchPriority="high"
          media="(max-aspect-ratio: 3/4)"
        />
      )}
    <LuminaPage
      goldShowcase={{
        newArrivals: showcases.gold.new, bestSellers: showcases.gold.best,
        featured: showcases.gold.featured, discounts: showcases.gold.discount,
      }}
      diamondShowcase={{
        newArrivals: showcases.diamond.new, bestSellers: showcases.diamond.best,
        featured: showcases.diamond.featured, discounts: showcases.diamond.discount,
      }}
      categories={categories}
      collectionImages={sectionImages(media, "collections")}
      craftImages={sectionImages(media, "craft")}
      heritageImages={sectionImages(media, "heritage")}
      heroImage={heroImage}
      heroPhoneImage={heroPhoneImage}
      editorialImage={editorialImage}
      editorialPhoneImage={editorialPhoneImage}
      testimonials={testimonials}
      articles={articles}
      campaign={campaign}
    />
    </>
  );
}
