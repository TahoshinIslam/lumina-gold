'use client';

import { useState } from 'react';
import { Check, EyeOff, MessageSquare, Star, Trash2 } from 'lucide-react';
import {
  moderateReviewAction, replyToReviewAction, deleteReviewAdminAction,
} from '../actions';
import { AdminActionButton, ConfirmActionButton, AdminInlineForm } from '@/features/admin/components/AdminFeedback';
import type { AdminReview } from '@/server/dal/reviews';

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/**
 * One review in the moderation queue.
 *
 * Approve / hide / delete, and the boutique's public reply. The reply form is
 * collapsed by default — the common action is a verdict, not an essay.
 */
export default function ReviewRow({ review, selectable }: {
  review: AdminReview;
  selectable?: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <article className="adm-review">
      <header className="adm-review-head">
        <div className="adm-review-who">
          {selectable && (
            <input type="checkbox" name="ids" value={review.id} form="review-bulk"
              aria-label={`Select review by ${review.author}`} />
          )}
          <div>
            <div className="adm-review-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={13}
                  fill={n <= review.rating ? 'currentColor' : 'none'}
                  className={n <= review.rating ? 'is-on' : ''} />
              ))}
              <span className="adm-sub">{DATE.format(new Date(review.created_at))}</span>
              {/* Verified = the review carries the id of a delivered order. */}
              {review.verified
                ? <span className="adm-pill ok">Verified</span>
                : <span className="adm-pill warn">Unverified</span>}
              <span className={`adm-pill ${review.status === 'approved' ? 'ok'
                : review.status === 'rejected' ? 'err' : 'warn'}`}>{review.status}</span>
            </div>
            <div className="adm-review-product">{review.product_name}</div>
          </div>
        </div>

        <div className="adm-review-tools">
          {review.status !== 'approved' && (
            <AdminActionButton action={moderateReviewAction}
              values={{ id: review.id, status: 'approved' }}
              message="Review published" className="adm-btn sm">
              <Check size={13} /> Approve
            </AdminActionButton>
          )}
          {review.status !== 'rejected' && (
            <AdminActionButton action={moderateReviewAction}
              values={{ id: review.id, status: 'rejected' }}
              message="Review hidden" className="adm-btn ghost sm">
              <EyeOff size={13} /> Hide
            </AdminActionButton>
          )}
          <button type="button" className="adm-btn ghost sm" onClick={() => setReplying(r => !r)}>
            <MessageSquare size={13} /> {review.reply ? 'Edit reply' : 'Reply'}
          </button>
          <ConfirmActionButton action={deleteReviewAdminAction} values={{ id: review.id }}
            title="Delete this review?"
            description="The review and its photos are removed for good. Hiding it is usually enough."
            confirmLabel="Delete review"
            className="adm-btn danger sm"
            successMessage="Review deleted">
            <Trash2 size={13} />
          </ConfirmActionButton>
        </div>
      </header>

      {review.title && <h3 className="adm-review-title">{review.title}</h3>}
      <p className="adm-review-body">{review.body}</p>

      {review.media.length > 0 && (
        <div className="adm-review-media">
          {review.media.map(item => (
            <a key={item.id} href={item.path} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.path} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      )}

      <footer className="adm-review-foot">
        <span className="adm-sub">
          by {review.author}{review.author_email ? ` (${review.author_email})` : ''} ·{' '}
          {review.helpful_count} found it helpful
        </span>
      </footer>

      {/* Shown even while the form is open: publishing a reply revalidates the
          server component but leaves the form expanded, and the admin needs to
          see that their words actually landed. */}
      {review.reply && (
        <div className="adm-review-reply">
          <strong>Your reply</strong>
          <p>{review.reply}</p>
        </div>
      )}

      {replying && (
        <AdminInlineForm action={replyToReviewAction} successMessage="Reply saved">
          <input type="hidden" name="id" value={review.id} />
          <div className="adm-field" style={{ width: '100%' }}>
            <label>Public reply</label>
            <textarea name="reply" rows={2} defaultValue={review.reply ?? ''}
              placeholder="Thank you — we're delighted it arrived safely." />
          </div>
          <button className="adm-btn" type="submit" style={{ marginTop: 8 }}>Publish reply</button>
        </AdminInlineForm>
      )}
    </article>
  );
}
