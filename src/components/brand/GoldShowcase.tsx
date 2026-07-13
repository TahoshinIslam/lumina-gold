import ShowcaseSection, { ShowcaseData } from '@/components/brand/ShowcaseSection';

/** "Luxury Gold Jewellery" — Gold-only homepage showcase, directly below the general showcase. */
export default function GoldShowcase({ data }: { data: ShowcaseData }) {
  return (
    <ShowcaseSection
      id="gold-showcase"
      heading="Luxury Gold Jewellery"
      subtitle="New arrivals & the pieces our collectors return for"
      data={data}
    />
  );
}
