import Link from 'next/link';
import { Eye, EyeOff, MessageSquare, Newspaper, Pencil } from 'lucide-react';
import { listArticlesForAdmin, listCommentsForAdmin } from '@/server/dal/journal';
import {
  deleteArticleAction, toggleArticleStatusAction,
  moderateCommentAction, deleteCommentAdminAction,
} from '../actions';
import { AdminActionButton, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';

export const dynamic = 'force-dynamic';

const WHEN = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Admin → Journal: the articles, and the conversation underneath them. */
export default async function AdminJournal({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [articles, comments] = await Promise.all([
    listArticlesForAdmin(q),
    listCommentsForAdmin(),
  ]);

  return (
    <>
      <div className="adm-detail-head">
        <div>
          <h1 className="adm-h1">Journal</h1>
          <p className="adm-sub">
            Articles for the storefront. A draft is invisible until you publish it.
          </p>
        </div>
        <Link className="adm-btn" href="/admin/journal/new">Write an article</Link>
      </div>

      <form className="adm-toolbar" method="get">
        <DebouncedSearchInput placeholder="Search articles…" defaultValue={q} />
      </form>

      {articles.length === 0 ? (
        <AdminEmptyState
          icon={Newspaper}
          title="No articles yet"
          description="Write the first one — it appears on the Journal and in Latest News on the home page."
        />
      ) : (
        <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Article</th><th>Tag</th><th>Published</th><th>Comments</th><th>Status</th><th />
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td>
                  <strong>{article.title}</strong>
                  <div className="adm-sub">{article.read_minutes} min read · /journal/{article.slug}</div>
                </td>
                <td>{article.tag ?? '—'}</td>
                <td>{article.published_at ? WHEN.format(new Date(article.published_at)) : '—'}</td>
                <td>{article.comment_count}</td>
                <td>
                  <span className={`adm-pill ${article.status === 'published' ? 'ok' : 'warn'}`}>
                    {article.status}
                  </span>
                </td>
                <td>
                  <div className="adm-row-actions">
                    <Link className="adm-btn ghost sm" href={`/admin/journal/${article.id}/edit`}>
                      <Pencil size={13} /> Edit
                    </Link>
                    <AdminActionButton action={toggleArticleStatusAction} values={{ id: article.id }}
                      message="Status updated" className="adm-btn ghost sm">
                      {article.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                      {article.status === 'published' ? 'Unpublish' : 'Publish'}
                    </AdminActionButton>
                    <ConfirmActionButton action={deleteArticleAction} values={{ id: article.id }}
                      title={`Delete “${article.title}”?`}
                      description="The article and its comments are removed for good. Unpublishing hides it without losing it."
                      confirmLabel="Delete article"
                      className="adm-btn danger sm"
                      successMessage="Article deleted">
                      Delete
                    </ConfirmActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      <h2 className="adm-h2" style={{ marginTop: 34 }}>
        <MessageSquare size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
        Comments
      </h2>
      <p className="adm-sub">
        Customers comment as themselves, signed in. A comment appears at once — hide anything that
        shouldn’t be there.
      </p>

      {comments.length === 0 ? (
        <p className="adm-sub" style={{ marginTop: 14 }}>No comments yet.</p>
      ) : (
        <div className="adm-table-wrap" style={{ marginTop: 14 }}>
        <table className="adm-table">
          <thead><tr><th>Comment</th><th>Article</th><th>When</th><th>Status</th><th /></tr></thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id}>
                <td>
                  <strong>{comment.author}</strong>
                  <div className="adm-sub">{comment.body}</div>
                </td>
                <td>
                  <Link className="adm-link" href={`/journal/${comment.article_slug}`} target="_blank">
                    {comment.article}
                  </Link>
                </td>
                <td>{WHEN.format(new Date(comment.created_at))}</td>
                <td>
                  <span className={`adm-pill ${comment.status === 'visible' ? 'ok' : 'err'}`}>
                    {comment.status}
                  </span>
                </td>
                <td>
                  <div className="adm-row-actions">
                    <AdminActionButton action={moderateCommentAction}
                      values={{ id: comment.id, status: comment.status === 'visible' ? 'hidden' : 'visible' }}
                      message="Comment updated" className="adm-btn ghost sm">
                      {comment.status === 'visible' ? 'Hide' : 'Restore'}
                    </AdminActionButton>
                    <ConfirmActionButton action={deleteCommentAdminAction} values={{ id: comment.id }}
                      title="Delete this comment?"
                      description="Removed for good. Hiding it is usually enough."
                      confirmLabel="Delete comment"
                      className="adm-btn danger sm"
                      successMessage="Comment deleted">
                      Delete
                    </ConfirmActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
}
