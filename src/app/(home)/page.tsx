import LuminaPage from "@/components/brand/LuminaPage";
import { getHomepageSection } from "@/server/dal/catalog";
import { getCategoryTiles, getHomeMedia, sectionImages } from "@/server/dal/home";
import { getLatestArticles } from "@/server/dal/journal";
import { getFeaturedCampaign } from "@/server/dal/campaigns";
import { getTestimonials } from "@/server/dal/testimonials";

// The homepage renders live admin data (new/best-seller/discount flags, the
// category tiles, and the Home Models photography) — never statically
// optimized, so anything changed in the admin shows up on the next request
// with no rebuild or manual revalidation.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    goldNew, goldBest, goldFeatured, goldDiscount,
    diamondNew, diamondBest, diamondFeatured, diamondDiscount,
    categories, media, articles, campaign, testimonials,
  ] = await Promise.all([
    getHomepageSection("gold", "new"),
    getHomepageSection("gold", "best"),
    getHomepageSection("gold", "featured"),
    getHomepageSection("gold", "discount"),
    getHomepageSection("diamond", "new"),
    getHomepageSection("diamond", "best"),
    getHomepageSection("diamond", "featured"),
    getHomepageSection("diamond", "discount"),
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

  return (
    <LuminaPage
      goldShowcase={{
        newArrivals: goldNew, bestSellers: goldBest,
        featured: goldFeatured, discounts: goldDiscount,
      }}
      diamondShowcase={{
        newArrivals: diamondNew, bestSellers: diamondBest,
        featured: diamondFeatured, discounts: diamondDiscount,
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
  );
}
