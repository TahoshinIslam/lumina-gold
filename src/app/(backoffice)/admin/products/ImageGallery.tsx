'use client';

import { useRef, useState, useTransition } from 'react';
import { deleteProductImageAction, setPrimaryImageAction } from '../actions';
import { ConfirmButton, useAdminToast } from '@/features/admin/components/AdminFeedback';
import { ImagePlus, LoaderCircle } from 'lucide-react';

export interface GalleryImage {
  id: number;
  path: string;
  isPrimary: boolean;
}

/**
 * ImageGallery — multi-image upload/delete/reorder-primary for a product.
 *
 * Existing (already-persisted) images are deleted/re-primaried immediately
 * via server actions called directly (not through a nested <form> — this
 * component always renders inside the outer product <form>, and HTML forms
 * can't nest). Newly uploaded images are staged client-side as hidden
 * `name="new_images"` inputs and only become `product_images` rows when the
 * surrounding product form is submitted, mirroring how the single-image
 * version of this component used to hold its one `name="image"` value.
 */
export default function ImageGallery({ initial }: { initial: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initial);
  const [newPaths, setNewPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

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
    setUploadProgress(0);
    const preview = URL.createObjectURL(file);
    setPendingPreview(preview);
    try {
      const body = new FormData();
      body.append('sku', sku);
      body.append('file', file);
      const data = await new Promise<{ path: string }>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/admin/upload');
        request.upload.onprogress = event => {
          if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };
        request.onload = () => {
          let response: { path?: string; error?: string } = {};
          try { response = JSON.parse(request.responseText); } catch { /* invalid response handled below */ }
          if (request.status >= 200 && request.status < 300 && response.path) resolve({ path: response.path });
          else reject(new Error(response.error || 'Upload failed'));
        };
        request.onerror = () => reject(new Error('Upload failed'));
        request.send(body);
      });
      setNewPaths(prev => [...prev, data.path]);
      toast('Image uploaded successfully');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setError(message);
      toast(message, 'error');
    } finally {
      URL.revokeObjectURL(preview);
      setPendingPreview(null);
      setBusy(false);
      setUploadProgress(0);
    }
  };

  const removeNew = (imagePath: string) => setNewPaths(prev => prev.filter(p => p !== imagePath));

  const remove = (id: number) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', String(id));
      await deleteProductImageAction(fd);
      setImages(prev => prev.filter(img => img.id !== id));
      toast('Image deleted successfully');
    });
  };

  const makePrimary = (id: number) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', String(id));
      await setPrimaryImageAction(fd);
      setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
      toast('Primary image updated');
    });
  };

  return (
    <div className="adm-field">
      <label>Product images</label>
      {newPaths.map(p => <input key={p} type="hidden" name="new_images" value={p} />)}

      {(images.length > 0 || newPaths.length > 0) && (
        <div className="adm-gallery-grid">
          {images.map(img => (
            <div key={img.id} className="adm-gallery-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt="" loading="lazy" decoding="async" />
              {img.isPrimary && <span className="adm-gallery-badge">Primary</span>}
              <div className="adm-gallery-actions">
                {!img.isPrimary && (
                  <button type="button" disabled={isPending} onClick={() => makePrimary(img.id)}>Set primary</button>
                )}
                <ConfirmButton
                  title="Delete this image?"
                  description="The image and all resized versions will be permanently removed."
                  confirmLabel="Delete image"
                  className="adm-gallery-action"
                  disabled={isPending}
                  onConfirm={() => remove(img.id)}
                >Delete</ConfirmButton>
              </div>
            </div>
          ))}
          {newPaths.map(p => (
            <div key={p} className="adm-gallery-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" decoding="async" />
              <span className="adm-gallery-badge">New</span>
              <div className="adm-gallery-actions">
                <ConfirmButton title="Remove this image?" description="This staged image will not be saved with the product."
                  confirmLabel="Remove image" className="adm-gallery-action" onConfirm={() => removeNew(p)}>
                  Remove
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="adm-drop"
        style={{ minHeight: 90 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
      >
        {pendingPreview ? (
          <div className="adm-upload-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pendingPreview} alt="Image awaiting upload" />
            <div><LoaderCircle className="adm-spin" size={18} /> Uploading {uploadProgress}%</div>
          </div>
        ) : (
          <div className="adm-drop-hint"><ImagePlus size={20} /> Drag an image here, or click to add another</div>
        )}
        {busy && <div className="adm-upload-progress" aria-label={`Upload ${uploadProgress}%`}>
          <span style={{ width: `${uploadProgress}%` }} />
        </div>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
      {error && <div className="adm-error" style={{ marginTop: 8 }}>{error}</div>}
      <p style={{ fontSize: 12, color: '#687168', marginTop: 6 }}>
        Saved to <code>/uploads/products/&lt;SKU&gt;/</code> with thumb, medium, large &amp; zoom sizes.
        No images yet? The storefront shows a placeholder until one is added.
      </p>
    </div>
  );
}
