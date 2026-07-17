'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useAdminToast } from '@/features/admin/components/AdminFeedback';
import { saveArticleAction } from '../actions';
import type { Article } from '@/server/dal/journal';

/**
 * Write an article.
 *
 * The body is PLAIN TEXT — blank line between paragraphs — and is rendered as
 * paragraphs, never as HTML. A rich-text editor here would mean storing markup
 * and putting it on the storefront, which is a script-injection hole that no
 * amount of "we trust the admin" closes.
 */
export default function ArticleForm({ article, error }: {
  article?: Partial<Article>;
  error?: string;
}) {
  const [cover, setCover] = useState(article?.cover_image ?? '');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload-blog', { method: 'POST', body });
      const data: { path?: string; error?: string } = await res.json();
      if (!res.ok || !data.path) throw new Error(data.error || 'Upload failed');
      setCover(data.path);
      toast('Cover image uploaded');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form action={saveArticleAction} className="adm-form">
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      {error === 'title' && <div className="adm-error">An article needs a title.</div>}
      {error === 'body' && <div className="adm-error">Write at least a paragraph.</div>}

      <div className="adm-field">
        <label>Title</label>
        <input name="title" defaultValue={article?.title ?? ''} required autoFocus
          placeholder="How a 22K bangle is drawn by hand" />
      </div>

      <div className="adm-classification-grid">
        <div className="adm-field">
          <label>Tag</label>
          <input name="tag" defaultValue={article?.tag ?? ''} placeholder="Craft, Gold, Bridal…" />
        </div>
        <div className="adm-field">
          <label>Status</label>
          <select name="status" defaultValue={article?.status ?? 'draft'}>
            <option value="draft">Draft — only you can see it</option>
            <option value="published">Published — live on the Journal</option>
          </select>
        </div>
      </div>

      <div className="adm-field">
        <label>Cover image</label>
        <div className="adm-drop" onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}>
          {cover
            // eslint-disable-next-line @next/next/no-img-element
            ? <img className="adm-drop-preview" src={cover} alt="" />
            : <div className="adm-drop-hint"><ImageIcon size={20} /> Drag an image here, or click to choose</div>}
          {busy && <div className="adm-drop-busy">Uploading…</div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        <input type="hidden" name="cover_image" value={cover} readOnly />
        {cover && (
          <button type="button" className="adm-btn ghost sm" style={{ marginTop: 8 }}
            onClick={() => setCover('')}>Remove image</button>
        )}
      </div>

      <div className="adm-field">
        <label>Excerpt</label>
        <textarea name="excerpt" rows={2} defaultValue={article?.excerpt ?? ''} maxLength={500}
          placeholder="One or two lines for the Journal card. Left empty, the opening of the article is used." />
      </div>

      <div className="adm-field">
        <label>Article</label>
        <textarea name="body" rows={18} defaultValue={article?.body ?? ''} required
          placeholder={'Plain text. Leave a blank line between paragraphs.\n\nNo HTML — it is printed as written.'} />
      </div>

      <div className="adm-form-actions">
        <button className="adm-btn" type="submit" disabled={busy}>
          {article?.id ? 'Save article' : 'Create article'}
        </button>
        <Link className="adm-btn ghost" href="/admin/journal">Cancel</Link>
      </div>
    </form>
  );
}
