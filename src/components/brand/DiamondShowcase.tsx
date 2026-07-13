import ShowcaseSection, { ShowcaseData } from '@/components/brand/ShowcaseSection';

/** "Luxury Diamond Jewellery" — Diamond-only homepage showcase, directly below the Gold showcase. */
export default function DiamondShowcase({ data }: { data: ShowcaseData }) {
  return (
    <ShowcaseSection
      id="diamond-showcase"
      heading="Luxury Diamond Jewellery"
      subtitle="New arrivals & the pieces our collectors return for"
      data={data}
    />
  );
}
