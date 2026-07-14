'use client';

import { useRef } from 'react';
import '@/app/lumina.css';

import { useLuminaEffects } from '@/hooks/useLuminaEffects';
import Preloader from '@/components/brand/Preloader';
import Header from '@/components/layout/Header';
import Hero from '@/components/brand/Hero';
import ShopByCategory from '@/components/brand/ShopByCategory';
import Marquee from '@/components/brand/Marquee';
import Collections from '@/components/brand/Collections';
import ParallaxShowcase from '@/components/brand/ParallaxShowcase';
import Craftsmanship from '@/components/brand/Craftsmanship';
import GoldShowcase from '@/components/brand/GoldShowcase';
import DiamondShowcase from '@/components/brand/DiamondShowcase';
import { ShowcaseData } from '@/components/brand/ShowcaseSection';
import type { CategoryTile, SlideImage } from '@/server/dal/home';
import type { Article } from '@/server/dal/journal';
import type { CampaignWithProducts } from '@/server/dal/campaigns';
import type { Testimonial } from '@/server/dal/testimonials';
import Quote from '@/components/brand/Quote';
import Heritage from '@/components/brand/Heritage';
import Testimonials from '@/components/brand/Testimonials';
import LatestNews from '@/components/brand/LatestNews';
import CampaignBanner from '@/components/brand/CampaignBanner';
import Appointment from '@/components/brand/Appointment';
import Footer from '@/components/layout/Footer';

/**
 * LuminaPage — composition root for the LUMINA landing page.
 *
 * Page order:  Preloader → Header/Nav → Hero → Categories → Marquee → Campaign →
 *              Gold → Diamond → Collections → Craftsmanship → Quote → Heritage →
 *              Parallax → Testimonials → Journal → Appointment → Footer
 *
 * All interactive behavior (particles, cursor, tilt, magnetic, spotlight,
 * reveals, count-ups, smooth scroll, nav shrink, hero parallax) lives in
 * useLuminaEffects — section components are purely presentational and just
 * carry data-* attributes the hook picks up.
 */
export interface LuminaPageProps {
  goldShowcase: ShowcaseData;
  diamondShowcase: ShowcaseData;
  /** Live category rows — the tiles under the hero (Admin → Categories). */
  categories: CategoryTile[];
  /** Editorial photography per section (Admin → Home Models). */
  collectionImages: SlideImage[];
  craftImages: SlideImage[];
  heritageImages: SlideImage[];
  /** The two fixed backdrops — the opening photograph and the Rings band. Both
   *  are scrolled-over background layers rather than galleries, so each takes a
   *  single image; undefined leaves the shipped photograph in the stylesheet. */
  heroImage?: string;
  editorialImage?: string;
  /** Optional upright crops for phones and portrait tablets — a 16:9 photograph
   *  covering a 9:19 screen keeps only the middle quarter of its width. */
  heroPhoneImage?: string;
  editorialPhoneImage?: string;
  /** The quotes in "Cherished by Collectors" (Admin → Testimonials). */
  testimonials: Testimonial[];
  /** The three most recent published articles (Admin → Journal). */
  articles: Article[];
  /** The running campaign the admin featured, if any (Admin → Campaigns). */
  campaign: CampaignWithProducts | null;
}

export default function LuminaPage({
  goldShowcase, diamondShowcase, categories,
  collectionImages, craftImages, heritageImages,
  heroImage, editorialImage, heroPhoneImage, editorialPhoneImage,
  testimonials, articles, campaign,
}: LuminaPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useLuminaEffects(rootRef);

  return (
    <div ref={rootRef} className="lum-root">
      {/* Fixed overlays */}
      <canvas className="lum-canvas" />
      <div className="lum-cursor-dot" />
      <div className="lum-cursor-ring" />
      <Preloader />
      <Header />

      {/* Page content. The <main> is what a screen reader jumps to, so it holds
          the content and NOT the footer — every other route already does this
          via .lum-page-main; the landing page was the one that never did. */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <main>
          <Hero image={heroImage} phoneImage={heroPhoneImage} />
          <ShopByCategory categories={categories} />
          <Marquee />
          <CampaignBanner campaign={campaign} />
          {/* The two showcases are the only place on this page a shopper can reach
              a piece and its price. They sat below Collections and Savoir-Faire —
              two long editorial sections — so on a phone the first product was
              thousands of pixels down. They now come first, and the editorial
              follows for whoever keeps reading. */}
          <GoldShowcase data={goldShowcase} />
          <DiamondShowcase data={diamondShowcase} />
          <Collections images={collectionImages} />
          <Craftsmanship images={craftImages} />
          <Quote />
          <Heritage images={heritageImages} />
          <ParallaxShowcase image={editorialImage} phoneImage={editorialPhoneImage} />
          <Testimonials items={testimonials} />
          <LatestNews articles={articles} />
          <Appointment />
        </main>
        <Footer />
      </div>
    </div>
  );
}
