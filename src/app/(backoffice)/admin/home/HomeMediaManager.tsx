'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, Trash2 } from 'lucide-react';
import { useAdminToast, ConfirmActionButton, AdminActionButton } from '@/features/admin/components/AdminFeedback';
import { addHomeMediaAction, deleteHomeMediaAction, moveHomeMediaAction } from '../actions';
import type { HomeSection } from '@/config/home';
import type { HomeMediaItem } from '@/server/dal/home';

/**
 * One home page section's gallery: upload, reorder, remove.
 *
 * The upload is two steps on purpose — the file goes to /api/admin/upload-home
 * (which resizes it to the frame this section renders at), and only the
 * returned path is recorded through the server action. That keeps the
 * multipart body out of the action and lets the same route serve every section.
 */
export default function HomeMediaManager({ section, images }: {
  section: HomeSection;
  images: HomeMediaItem[];
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

  const upload = async (files: FileList | File[]) => {
    setError('');
    setBusy(true);
    try {
      // Uploaded one at a time so a single bad file doesn't lose the whole batch.
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('section', section.key);
        body.append('file', file);
        const res = await fetch('/api/admin/upload-home', { method: 'POST', body });
        const data: { path?: string; width?: number; height?: number; error?: string } = await res.json();
        if (!res.ok || !data.path) throw new Error(data.error || 'Upload failed');

        const record = new FormData();
        record.set('section', section.key);
        record.set('image', data.path);
        record.set('width', String(data.width ?? ''));
        record.set('height', String(data.height ?? ''));
        record.set('alt', `${section.eyebrow} — ${file.name.replace(/\.[^.]+$/, '')}`);
        const result = await addHomeMediaAction(record);
        if (!result.ok) throw new Error(result.message);
      }
      toast(`Added to ${section.eyebrow}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setError(message);
      toast(message, 'error');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="adm-card" style={{ marginBottom: 24 }}>
      <h2 className="adm-h2" style={{ marginBottom: 4 }}>{section.eyebrow}</h2>
      <p className="adm-sub" style={{ marginBottom: 4 }}>
        <strong>{section.heading}</strong>
      </p>
      <p className="adm-sub" style={{ marginBottom: 16, fontSize: 12 }}>{section.hint}</p>

      {images.length > 0 && (
        <div className="adm-home-grid">
          {images.map((item, index) => (
            <figure key={item.id} className="adm-home-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.alt ?? ''} />
              <figcaption>
                <span className="adm-home-pos">{index + 1}</span>
                <span className="adm-home-tools">
                  <AdminActionButton
                    action={moveHomeMediaAction} values={{ id: item.id, dir: 'up' }}
                    message="Order updated" className="adm-home-btn"
                    ariaLabel={`Move image ${index + 1} earlier`}
                  ><ChevronLeft size={14} /></AdminActionButton>
                  <AdminActionButton
                    action={moveHomeMediaAction} values={{ id: item.id, dir: 'down' }}
                    message="Order updated" className="adm-home-btn"
                    ariaLabel={`Move image ${index + 1} later`}
                  ><ChevronRight size={14} /></AdminActionButton>
                  <ConfirmActionButton
                    action={deleteHomeMediaAction} values={{ id: item.id }}
                    title="Remove this image?"
                    description="It is deleted from the home page and from disk. The section falls back to its original photograph if you remove them all."
                    confirmLabel="Remove image"
                    className="adm-home-btn danger"
                    ariaLabel={`Remove image ${index + 1}`}
                    successMessage="Image removed"
                  ><Trash2 size={14} /></ConfirmActionButton>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="adm-drop" style={{ marginTop: images.length ? 16 : 0 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files; if (f?.length) upload(f); }}>
        <div className="adm-drop-hint">
          <ImageIcon size={20} /> Drag model photos here, or click to choose
        </div>
        {busy && <div className="adm-drop-busy">Uploading…</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => { const f = e.target.files; if (f?.length) upload(f); }} />

      {images.length === 0 && (
        <p className="adm-sub" style={{ marginTop: 10, fontSize: 12 }}>
          Nothing uploaded — the page is still showing its original photograph.
        </p>
      )}
      {error && <div className="adm-error" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
