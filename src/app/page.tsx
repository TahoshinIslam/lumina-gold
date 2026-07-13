import LuminaPage from "@/components/brand/LuminaPage";
import { getHomepageSection } from "@/server/dal/catalog";

// The homepage renders live admin data (new/best-seller/discount flags) —
// never statically optimized, so a product added in the admin shows up
// on the next request with no rebuild or manual revalidation.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    goldNew, goldBest, goldDiscount,
    diamondNew, diamondBest, diamondDiscount,
  ] = await Promise.all([
    getHomepageSection("gold", "new"),
    getHomepageSection("gold", "best"),
    getHomepageSection("gold", "discount"),
    getHomepageSection("diamond", "new"),
    getHomepageSection("diamond", "best"),
    getHomepageSection("diamond", "discount"),
  ]);

  return (
    <LuminaPage
      goldShowcase={{ newArrivals: goldNew, bestSellers: goldBest, discounts: goldDiscount }}
      diamondShowcase={{ newArrivals: diamondNew, bestSellers: diamondBest, discounts: diamondDiscount }}
    />
  );
}
