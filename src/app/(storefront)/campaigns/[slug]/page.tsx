import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCampaign } from '@/server/dal/campaigns';
import ProductGrid from '@/features/catalog/components/ProductGrid';

export const dynamic = 'force-dynamic';

const WHEN = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  return {
    title: campaign ? `${campaign.title} — Nahar Jewellers` : 'Nahar Jewellers',
    description: campaign?.description ?? undefined,
  };
}

/** /campaigns/[slug] — a running campaign and the pieces in it. */
export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Not published, or outside its dates → it does not exist to a shopper.
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>Campaign</div>
              <h1 className="lum-h2 lum-listing-title">{campaign.title}</h1>
              {campaign.description && (
                <p className="lum-pdp-desc" style={{ maxWidth: 640 }}>{campaign.description}</p>
              )}
              <div className="lum-listing-count">
                {campaign.products.length} {campaign.products.length === 1 ? 'piece' : 'pieces'}
                {campaign.end_at && ` · until ${WHEN.format(new Date(campaign.end_at))}`}
              </div>
            </div>
            <Link href="/shop" className="lum-cta-ghost">All jewellery</Link>
          </div>

          <ProductGrid products={campaign.products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
