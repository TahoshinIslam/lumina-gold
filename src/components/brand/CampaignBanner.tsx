import Link from 'next/link';
import type { CampaignWithProducts } from '@/server/dal/campaigns';
import { formatPrice } from '@/types/product';

/**
 * The campaign an admin ticked "feature on the home page".
 *
 * That flag has existed all along and did nothing — campaigns were a write-only
 * feature. A campaign shows here only while it is published AND inside its
 * dates, so next month's sale can be prepared today without appearing tonight.
 */
const UNTIL = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });

export default function CampaignBanner({ campaign }: { campaign: CampaignWithProducts | null }) {
  if (!campaign) return null;

  return (
    <section className="lum-campaign" id="campaign">
      <div className="lum-campaign-inner">
        <div className="lum-campaign-copy" data-reveal="left">
          <div className="lum-eyebrow">
            <div className="lum-rule lum-rule--solid" />
            <div className="lum-eyebrow-label">
              {campaign.end_at ? `Until ${UNTIL.format(new Date(campaign.end_at))}` : 'Now on'}
            </div>
          </div>
          <h2 className="lum-h2">{campaign.title}</h2>
          {campaign.description && <p className="lum-body-text">{campaign.description}</p>}
          <Link href={`/campaigns/${campaign.slug}`} className="lum-cta-gold">
            See the {campaign.product_count} {campaign.product_count === 1 ? 'piece' : 'pieces'}
          </Link>
        </div>

        <div className="lum-campaign-pieces" data-reveal="stagger">
          {campaign.products.map(product => (
            <Link key={product.sku} href={`/products/${product.slug}`} className="lum-campaign-piece">
              <span className="lum-campaign-media lum-img-ph">
                {product.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt="" loading="lazy" />
                )}
              </span>
              <span className="lum-campaign-name">{product.name}</span>
              <span className="lum-campaign-price">{formatPrice(product.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
