'use client';

import { useRef, useState } from 'react';
import { useAdminToast } from '@/features/admin/components/AdminFeedback';
import { ImageIcon } from 'lucide-react';

/**
 * The tile image shown for this category on /categories.
 *
 * Uploads to /api/admin/upload-category, then carries the returned path in a
 * CONTROLLED hidden input so the category action saves it. (An uncontrolled
 * input written to via document.querySelector is how the product image upload
 * once silently dropped the path on save — React just re-rendered over it.)
 *
 * The filename is derived from the category's slug, so the name must be typed
 * first: on a brand-new category there is no slug to upload under yet.
 */
export default function CategoryImageUpload({ initial, slug }: {
  initial?: string | null;
  slug?: string | null;
}) {
  const [path, setPath] = useState(initial ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

  const upload = async (file: File) => {
    setError('');
    // On a new category the slug doesn't exist yet — derive it from the name
    // field the admin is filling in right now.
    const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
    const effectiveSlug = slug
      || nameInput?.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!effectiveSlug) {
      setError('Enter the category name first, then add an image.');
      nameInput?.focus();
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append('slug', effectiveSlug);
      body.append('file', file);
      const res = await fetch('/api/admin/upload-category', { method: 'POST', body });
      const data: { path?: string; error?: string } = await res.json();
      if (!res.ok || !data.path) throw new Error(data.error || 'Upload failed');
      setPath(data.path);
      toast('Category image uploaded');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setError(message);
      toast(message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-field">
      <label>Tile image</label>
      <p className="adm-sub" style={{ marginTop: -2, marginBottom: 8 }}>
        Shown on the Shop by Category page. Without one the tile keeps its gold-on-dark gradient.
      </p>
      <div className="adm-drop" onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}>
        {path
          // eslint-disable-next-line @next/next/no-img-element
          ? <img className="adm-drop-preview" src={path} alt="" />
          : <div className="adm-drop-hint"><ImageIcon size={20} /> Drag an image here, or click to choose</div>}
        {busy && <div className="adm-drop-busy">Uploading…</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      <input type="hidden" name="image" value={path} readOnly />
      {path && (
        <button type="button" className="adm-btn ghost sm" style={{ marginTop: 8 }}
          onClick={() => setPath('')}>Remove image</button>
      )}
      {error && <div className="adm-error" style={{ marginTop: 8 }}>{error}</div>}
    </div>
  );
}
