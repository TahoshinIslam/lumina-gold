'use client';

import { useState } from 'react';
import { BadgeCheck, ThumbsUp } from 'lucide-react';
import Stars from './Stars';
import { toggleHelpfulAction } from '@/features/reviews/actions';
import type { Review } from '@/server/dal/reviews';
import { runAction } from '@/features/shared/runAction';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** The approved reviews on a product page, with the boutique's replies. */
export default function ReviewList({ reviews, signedIn }: { reviews: Review[]; signedIn: boolean }) {
  // Votes are echoed optimistically so the count moves under the cursor; the
  // server's own count replaces it as soon as it answers.
  const [votes, setVotes] = useState<Record<number, { voted: boolean; count: number }>>(
    Object.fromEntries(reviews.map(r => [r.id, { voted: !!r.voted, count: r.helpful_count }])),
  );
  const [error, setError] = useState('');

  const vote = async (id: number) => {
    if (!signedIn) { setError('Sign in to mark a review as helpful.'); return; }
    setError('');
    const current = votes[id];
    setVotes(v => ({
      ...v,
      [id]: { voted: !current.voted, count: current.count + (current.voted ? -1 : 1) },
    }));
    const data = new FormData();
    data.set('id', String(id));
    const result = await runAction(() => toggleHelpfulAction(data));
    if (result.ok && 'count' in result && typeof result.count === 'number') {
      setVotes(v => ({ ...v, [id]: { voted: !!result.voted, count: result.count! } }));
    } else {
      setVotes(v => ({ ...v, [id]: current })); // the optimistic vote goes back
      if (result.message) setError(result.message);
    }
  };

  if (!reviews.length) {
    return <p className="lum-pdp-desc">No reviews yet — the first one will appear here.</p>;
  }

  return (
    <div className="lum-review-list">
      {error && <div className="lum-pdp-warn">{error}</div>}
      {reviews.map(review => {
        const state = votes[review.id] ?? { voted: false, count: review.helpful_count };
        return (
          <article key={review.id} className="lum-review">
            <header className="lum-review-head">
              <div className="lum-review-who">
                <span className="lum-avatar sm" aria-hidden="true">
                  {review.avatar_path
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={review.avatar_path} alt="" />
                    : <span>{review.author.slice(0, 1).toUpperCase()}</span>}
                </span>
                <div>
                  <div className="lum-review-author">
                    {review.author}
                    {/* Every review here is from a delivered order — the badge is
                        a fact about the data, not a label anyone can set. */}
                    <span className="lum-verified"><BadgeCheck size={13} /> Verified buyer</span>
                  </div>
                  <div className="lum-review-date">{DATE.format(new Date(review.created_at))}</div>
                </div>
              </div>
              <Stars value={review.rating} />
            </header>

            {review.title && <h4 className="lum-review-title">{review.title}</h4>}
            <p className="lum-review-body">{review.body}</p>

            {review.media.length > 0 && (
              <div className="lum-review-media">
                {review.media.map(item => (
                  item.kind === 'video'
                    // Controls, but no autoplay: a wall of reviews that all start
                    // playing at once is a page nobody can read.
                    ? <video key={item.id} className="lum-review-thumb is-video"
                        src={item.path} controls playsInline preload="metadata" />
                    : (
                      <a key={item.id} href={item.path} target="_blank" rel="noreferrer" className="lum-review-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.path} alt="" loading="lazy" />
                      </a>
                    )
                ))}
              </div>
            )}

            {review.reply && (
              <div className="lum-review-reply">
                <strong>Nahar Jewellers</strong>
                <p>{review.reply}</p>
              </div>
            )}

            <footer className="lum-review-foot">
              <button type="button" className={`lum-helpful${state.voted ? ' is-on' : ''}`}
                onClick={() => vote(review.id)}>
                <ThumbsUp size={13} /> Helpful{state.count > 0 ? ` (${state.count})` : ''}
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
