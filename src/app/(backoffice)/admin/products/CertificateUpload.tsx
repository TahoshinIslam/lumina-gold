'use client';

import { useRef, useState } from 'react';
import { useAdminToast } from '@/features/admin/components/AdminFeedback';
import { FileText } from 'lucide-react';

/**
 * CertificateUpload — uploads a Certificate of Authenticity PDF for the
 * product. Reads the SKU from the sibling `name="sku"` input and POSTs to
 * /api/admin/upload-doc, which saves it as
 * /uploads/products/<SKU>/certificate.pdf. The product page picks it up by
 * convention, so no DB column is needed. Uses XHR (not fetch) so upload
 * progress is observable, mirroring ImageGallery's upload technique.
 *
 * `sku` is reserved (and passed) even for a brand-new, unsaved product so
 * uploads land in a stable folder — but that doesn't mean a certificate
 * already exists there. `hasExisting` marks the "editing a real, previously
 * saved product" case, which is the only time a pre-existing file is a
 * reasonable guess; without it the "View current certificate" link would
 * point at a file for a product/certificate that was never created.
 */
export default function CertificateUpload({ sku, hasExisting }: { sku?: string | null; hasExisting?: boolean }) {
  const [url, setUrl] = useState<string | null>(
    hasExisting && sku ? `/uploads/products/${sku}/certificate.pdf` : null,
  );
  const [uploaded, setUploaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

  const upload = async (file: File) => {
    setError('');
    const skuInput = document.querySelector<HTMLInputElement>('input[name="sku"]');
    const s = skuInput?.value.trim();
    if (!s) { setError('Enter the SKU first, then upload the certificate.'); skuInput?.focus(); return; }
    setBusy(true);
    setUploadProgress(0);
    try {
      const body = new FormData();
      body.append('sku', s);
      body.append('file', file);
      const data = await new Promise<{ path: string }>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/admin/upload-doc');
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
      setUrl(data.path);
      setUploaded(true);
      toast('Certificate uploaded successfully');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setError(message);
      toast(message, 'error');
    } finally {
      setBusy(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="adm-field">
      <label>Certificate of Authenticity (PDF)</label>
      <div className="adm-drop" onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}>
        <div className="adm-drop-hint">
          <FileText size={20} />
          {busy ? `Uploading… ${uploadProgress}%` : uploaded ? '✓ Certificate uploaded' : 'Drag a PDF here, or click to choose'}
        </div>
        {busy && <div className="adm-upload-progress" aria-label={`Upload ${uploadProgress}%`}>
          <span style={{ width: `${uploadProgress}%` }} />
        </div>}
      </div>
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      {error && <div className="adm-error" style={{ marginTop: 8 }}>{error}</div>}
      {url && (uploaded || hasExisting) && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#A8863D', marginTop: 6, display: 'inline-block' }}>
          View current certificate ↗
        </a>
      )}
    </div>
  );
}
