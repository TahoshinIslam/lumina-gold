'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { addCommentAction, deleteCommentAction } from '@/features/journal/actions';
import { runAction } from '@/features/shared/runAction';
import type { Comment } from '@/server/dal/journal';

const WHEN = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/** The conversation under an article. Signed-in customers only. */
export default function Comments({ slug, comments, viewerId }: {
  slug: string;
  comments: Comment[];
  viewerId: number | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const post = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    data.set('slug', slug);
    const result = await runAction(() => addCommentAction(data));
    setBusy(false);
    if (result.ok) {
      setBody('');
      setMessage(null);
      router.refresh();
    } else {
      setMessage({ ok: false, text: result.message ?? 'Could not post that.' });
    }
  };

  const remove = async (id: number) => {
    setBusy(true);
    const data = new FormData();
    data.set('id', String(id));
    data.set('slug', slug);
    await runAction(() => deleteCommentAction(data));
    setBusy(false);
    router.refresh();
  };

  return (
    <section className="lum-comments">
      <h2 className="lum-h2 lum-listing-title">
        {comments.length === 0 ? 'Join the conversation'
          : `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}
      </h2>

      {viewerId ? (
        <form className="lum-comment-form" onSubmit={post}>
          <textarea name="body" rows={3} maxLength={2000} value={body} required
            onChange={e => setBody(e.target.value)}
            placeholder="What did you make of this?" />
          {message && <div className="lum-pdp-warn">{message.text}</div>}
          <button className="lum-cta-gold" disabled={busy || body.trim().length < 2}>
            {busy ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="lum-pdp-note">
          <Link href="/account/login" className="lum-link-gold">Sign in</Link> to leave a comment.
        </p>
      )}

      <div className="lum-comment-list">
        {comments.map(comment => (
          <article key={comment.id} className="lum-comment">
            <span className="lum-avatar sm" aria-hidden="true">
              {comment.avatar_path
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={comment.avatar_path} alt="" />
                : <span>{comment.author.slice(0, 1).toUpperCase()}</span>}
            </span>
            <div className="lum-comment-body">
              <div className="lum-comment-head">
                <strong>{comment.author}</strong>
                <span className="lum-review-date">{WHEN.format(new Date(comment.created_at))}</span>
                {/* Your own words are yours to take back. */}
                {viewerId === comment.user_id && (
                  <button type="button" className="lum-comment-del" disabled={busy}
                    aria-label="Delete your comment" onClick={() => remove(comment.id)}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <p>{comment.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
