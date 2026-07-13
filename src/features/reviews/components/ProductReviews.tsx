import { getCurrentCustomer } from '@/server/auth/customer';
import {
  getProductReviews, getRatingSummary, getMyReview, purchasedOrder,
} from '@/server/dal/reviews';
import Stars from './Stars';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

/**
 * The reviews block on a product page (Phase 9): average, star breakdown, the
 * approved reviews, and — for someone who has actually received the piece — the
 * form to write one.
 *
 * A server component, so the eligibility check ("has this person had this piece
 * delivered?") happens where it cannot be spoofed, and the form simply isn't
 * rendered for anyone else.
 */
export default async function ProductReviews({ productId }: { productId: number }) {
  const customer = await getCurrentCustomer();

  const [summary, reviews, mine, canReview] = await Promise.all([
    getRatingSummary(productId),
    getProductReviews(productId, customer?.id),
    customer ? getMyReview(productId, customer.id) : Promise.resolve(null),
    customer ? purchasedOrder(productId, customer.id) : Promise.resolve(null),
  ]);

  return (
    <section className="lum-reviews" id="reviews">
      <h2 className="lum-h2 lum-listing-title">Reviews</h2>

      <div className="lum-review-summary">
        <div className="lum-review-score">
          <div className="lum-review-avg">{summary.average.toFixed(1)}</div>
          <Stars value={summary.average} size={17} />
          <div className="lum-addr-lines">
            {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="lum-review-bars">
          {[5, 4, 3, 2, 1].map(stars => {
            const n = summary.breakdown[stars] ?? 0;
            const pct = summary.count ? (n / summary.count) * 100 : 0;
            return (
              <div key={stars} className="lum-review-bar">
                <span>{stars}★</span>
                <span className="lum-bar-track">
                  <span className="lum-bar-fill" style={{ width: `${pct}%` }} />
                </span>
                <span className="lum-bar-n">{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Only a verified buyer sees a form. Everyone else is told why. */}
      {canReview ? (
        <ReviewForm productId={productId} existing={mine} />
      ) : (
        <p className="lum-pdp-note">
          {customer
            ? 'Only customers who have received this piece can review it.'
            : 'Sign in to review a piece you’ve received.'}
        </p>
      )}

      <ReviewList reviews={reviews} signedIn={!!customer} />
    </section>
  );
}
