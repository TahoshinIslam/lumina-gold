import { Star } from 'lucide-react';
import { listReviewsForAdmin, reviewMetrics } from '@/server/dal/reviews';
import { bulkApproveReviewsAction, bulkHideReviewsAction } from '../actions';
import { BulkActionsBar } from '@/features/admin/components/BulkActionsBar';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';
import { Pagination } from '@/features/admin/components/Pagination';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import ReviewRow from './ReviewRow';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

/**
 * Admin → Reviews (Phase 11).
 *
 * The queue is a moderation tool first: pending reviews are what an admin comes
 * here to clear, so that is the default filter. Everything else — rating,
 * search, approved/rejected — is a narrowing of the same list.
 */
export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rating?: string; status?: string; verified?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? 'all';

  const [{ reviews, total, page }, metrics] = await Promise.all([
    listReviewsForAdmin({
      search: params.q,
      rating: params.rating,
      status,
      verified: params.verified,
      page: Number(params.page) || 1,
      perPage: PAGE_SIZE,
    }),
    reviewMetrics(),
  ]);

  return (
    <>
      <h1 className="adm-h1">Reviews</h1>
      <p className="adm-sub">
        {total} {total === 1 ? 'review' : 'reviews'} matching this filter.
        {metrics.counts.pending > 0 && (
          <> <strong>{metrics.counts.pending} waiting for moderation.</strong></>
        )}
      </p>

      {/* Metrics */}
      <div className="adm-stat-row">
        <div className="adm-stat">
          <div className="adm-stat-num">
            {metrics.average.toFixed(1)} <Star size={15} className="is-on" fill="currentColor" />
          </div>
          <div className="adm-stat-lbl">Average rating</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-num">{metrics.approved}</div>
          <div className="adm-stat-lbl">Published</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-num">{metrics.counts.pending}</div>
          <div className="adm-stat-lbl">Pending</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-num">{metrics.counts.rejected}</div>
          <div className="adm-stat-lbl">Hidden</div>
        </div>
      </div>

      {metrics.mostReviewed.length > 0 && (
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <h2 className="adm-h2">Most reviewed</h2>
          <table className="adm-table">
            <thead><tr><th>Piece</th><th>Reviews</th><th>Average</th></tr></thead>
            <tbody>
              {metrics.mostReviewed.map(item => (
                <tr key={item.slug}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.n}</td>
                  <td>{item.average.toFixed(1)} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filters — a GET form, so the URL is the state. */}
      <form className="adm-toolbar" method="get">
        <DebouncedSearchInput placeholder="Search a review, piece or customer…" defaultValue={params.q} />
        <select name="status" defaultValue={status} className="adm-select">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Hidden</option>
        </select>
        <select name="rating" defaultValue={params.rating ?? 'all'} className="adm-select">
          <option value="all">All ratings</option>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <select name="verified" defaultValue={params.verified ?? 'all'} className="adm-select">
          <option value="all">Verified &amp; not</option>
          <option value="verified">Verified buyers</option>
          <option value="unverified">Unverified</option>
        </select>
        <button className="adm-btn ghost" type="submit">Filter</button>
      </form>

      {reviews.length === 0 ? (
        <AdminEmptyState
          icon={Star}
          title="No reviews here"
          description="Nothing matches this filter yet. Reviews arrive once a delivered piece is reviewed by its buyer."
        />
      ) : (
        <>
          {/* One form carries the checkboxes; the bar submits it. */}
          <form id="review-bulk" />
          <BulkActionsBar
            formId="review-bulk"
            selectAllId="review-select-all"
            label="review"
            actions={[
              { label: 'Approve', formAction: bulkApproveReviewsAction },
              { label: 'Hide', formAction: bulkHideReviewsAction, danger: true, confirm: 'Hide the selected reviews?' },
            ]}
          />

          <div className="adm-review-list">
            {reviews.map(review => (
              <ReviewRow key={review.id} review={review} selectable />
            ))}
          </div>

          <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/reviews"
            params={{ q: params.q, status, rating: params.rating, verified: params.verified }} />
        </>
      )}
    </>
  );
}
