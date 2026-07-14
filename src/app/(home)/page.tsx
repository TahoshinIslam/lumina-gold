import LuminaPage from "@/components/brand/LuminaPage";
import { sectionImages } from "@/server/dal/home";
import { getHomePageData } from "@/server/dal/homepage";
import { optimized, BACKDROP_WIDTH, BACKDROP_PHONE_WIDTH } from "@/features/shared/optimized";

// Rendered per request, but NOT re-queried per request: everything it reads is
// behind a cache (see server/dal/homepage.ts), invalidated the moment an admin
// changes anything. The route stays dynamic on purpose — `revalidate` here would
// cache the HTML but also prerender the page at BUILD time, and the build has no
// database to talk to (that is exactly how it broke in CI). Caching the data
// instead keeps the build database-free and still spares MySQL the load.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { showcases, categories, media, articles, campaign, testimonials } =
    await getHomePageData();

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
