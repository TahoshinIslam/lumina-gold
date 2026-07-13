'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Stars from '@/features/reviews/components/Stars';
import { deleteReviewAction } from '@/features/reviews/actions';
import type { Review } from '@/server/dal/reviews';
import { runAction } from '@/features/shared/runAction';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Reviews tab: what this customer has written, and what they could write next. */
export default function MyReviews({ reviews, awaiting }: {
  reviews: (Review & { product_name: string; product_slug: string })[];
  awaiting: { id: number; name: string; slug: string; image: string | null }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(0);

  const remove = async (id: number) => {
    setBusy(id);
    const data = new FormData();
    data.set('id', String(id));
    await runAction(() => deleteReviewAction(data));
    setBusy(0);
    router.refresh();
  };

  return (
    <div>
      {awaiting.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 className="lum-cart-summary-title">Pieces you can review</h2>
          <div className="lum-review-await">
            {awaiting.map(piece => (
              // Straight to the reviews block on the product page — the form
              // only exists there, so there is one place a review is written.
              <Link key={piece.id} href={`/products/${piece.slug}#reviews`} className="lum-await-card">
                <span className="lum-order-thumb lum-img-ph">
                  {piece.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={piece.image} alt="" />
                  )}
                </span>
                <span>
                  <span className="lum-sum-name">{piece.name}</span>
                  <span className="lum-addr-lines">Write a review →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="lum-cart-summary-title">Your reviews</h2>
      {reviews.length === 0 ? (
        <div className="lum-empty-results" style={{ marginTop: 20 }}>
          You haven’t reviewed anything yet.
        </div>
      ) : (
        <div className="lum-review-list">
          {reviews.map(review => (
            <article key={review.id} className="lum-review">
              <header className="lum-review-head">
                <div>
                  <Link href={`/products/${review.product_slug}#reviews`} className="lum-review-author">
                    {review.product_name}
                  </Link>
                  <div className="lum-review-date">
                    {DATE.format(new Date(review.created_at))} ·{' '}
                    <span className={`lum-review-state is-${review.status}`}>{review.status}</span>
                  </div>
                </div>
                <Stars value={review.rating} />
              </header>
              {review.title && <h4 className="lum-review-title">{review.title}</h4>}
              <p className="lum-review-body">{review.body}</p>
              {review.reply && (
                <div className="lum-review-reply">
                  <strong>Nahar Jewellers</strong>
                  <p>{review.reply}</p>
                </div>
              )}
              <footer className="lum-review-foot">
                <Link href={`/products/${review.product_slug}#reviews`} className="lum-cta-ghost">Edit</Link>
                <button type="button" className="lum-cta-ghost lum-danger" disabled={busy === review.id}
                  onClick={() => remove(review.id)}>
                  {busy === review.id ? 'Removing…' : 'Delete'}
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
