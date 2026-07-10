'use client';

import { useRef, useState } from 'react';

/**
 * ImageUpload — drag/drop or click to upload the product's primary image.
 * Reads the SKU from the sibling `name="sku"` input, POSTs to
 * /api/admin/upload (which resizes into the per-SKU folders), then writes
 * the returned `large` path into the hidden `name="image"` field the
 * product save action already reads.
 */
export default function ImageUpload({ initial }: { initial?: string | null }) {
  const [preview, setPreview] = useState(initial || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError('');
    const skuInput = document.querySelector<HTMLInputElement>('input[name="sku"]');
    const sku = skuInput?.value.trim();
    if (!sku) {
      setError('Enter the SKU first, then upload.');
      skuInput?.focus();
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append('sku', sku);
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPreview(data.path);
      const hidden = document.querySelector<HTMLInputElement>('input[name="image"]');
      if (hidden) hidden.value = data.path;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-field">
      <label>Primary image</label>
      <input type="hidden" name="image" defaultValue={initial || ''} />
      <div
        className="adm-drop"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="adm-drop-preview" />
        ) : (
          <div className="adm-drop-hint">{busy ? 'Uploading…' : 'Drag an image here, or click to choose'}</div>
        )}
        {busy && preview && <div className="adm-drop-busy">Uploading…</div>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
      {error && <div className="adm-error" style={{ marginTop: 8 }}>{error}</div>}
      <p style={{ fontSize: 12, color: '#9A8668', marginTop: 6 }}>
        Saved to <code>/uploads/products/&lt;SKU&gt;/</code> with thumb, medium, large &amp; zoom sizes.
      </p>
    </div>
  );
}
