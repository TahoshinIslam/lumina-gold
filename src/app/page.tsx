import LuminaPage from "@/components/brand/LuminaPage";
import { getHomepageSection } from "@/server/dal/catalog";
import { getCategoryTiles, getHomeMedia, sectionImages } from "@/server/dal/home";

// The homepage renders live admin data (new/best-seller/discount flags, the
// category tiles, and the Home Models photography) — never statically
// optimized, so anything changed in the admin shows up on the next request
// with no rebuild or manual revalidation.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    goldNew, goldBest, goldDiscount,
    diamondNew, diamondBest, diamondDiscount,
    categories, media,
  ] = await Promise.all([
    getHomepageSection("gold", "new"),
    getHomepageSection("gold", "best"),
    getHomepageSection("gold", "discount"),
    getHomepageSection("diamond", "new"),
    getHomepageSection("diamond", "best"),
    getHomepageSection("diamond", "discount"),
    getCategoryTiles(),
    getHomeMedia(),
  ]);

  return (
    <LuminaPage
      goldShowcase={{ newArrivals: goldNew, bestSellers: goldBest, discounts: goldDiscount }}
      diamondShowcase={{ newArrivals: diamondNew, bestSellers: diamondBest, discounts: diamondDiscount }}
      categories={categories}
      collectionImages={sectionImages(media, "collections")}
      craftImages={sectionImages(media, "craft")}
      heritageImages={sectionImages(media, "heritage")}
    />
  );
}
