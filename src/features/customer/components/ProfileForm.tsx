'use client';

import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { updateProfileAction } from '@/features/customer/actions';
import { runAction } from '@/features/shared/runAction';

/** Profile tab: name, email, phone, avatar. */
export default function ProfileForm({ customer }: {
  customer: { name: string; email: string | null; phone: string | null; avatar_path: string | null };
}) {
  const [avatar, setAvatar] = useState(customer.avatar_path ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append('kind', 'avatar');
      body.append('file', file);
      const res = await fetch('/api/account/upload', { method: 'POST', body });
      const data: { path?: string; error?: string } = await res.json();
      if (!res.ok || !data.path) throw new Error(data.error || 'Upload failed');
      // Held in a hidden field and saved with the form: uploading a picture and
      // then abandoning the form shouldn't change the account.
      setAvatar(data.path);
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Upload failed' });
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const result = await runAction(() => updateProfileAction(new FormData(event.currentTarget)));
    setBusy(false);
    setMessage({ ok: result.ok, text: result.message ?? '' });
  };

  return (
    <form className="lum-checkout-form" style={{ maxWidth: 520 }} onSubmit={submit}>
      <h2 className="lum-cart-summary-title">Profile</h2>

      <div className="lum-avatar-row">
        <button type="button" className="lum-avatar" onClick={() => fileRef.current?.click()}
          aria-label="Change your picture">
          {avatar
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={avatar} alt="" />
            : <span>{customer.name.slice(0, 1).toUpperCase()}</span>}
          <span className="lum-avatar-badge"><Camera size={13} /></span>
        </button>
        <div>
          <div className="lum-sum-name">{customer.name}</div>
          <div className="lum-addr-lines">
            {busy ? 'Uploading…' : 'JPG or PNG, up to 5 MB. Click the picture to change it.'}
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      <input type="hidden" name="avatar" value={avatar} readOnly />

      <label className="lum-field">
        <span>Full name *</span>
        <input name="name" defaultValue={customer.name} autoComplete="name" required />
      </label>
      <label className="lum-field">
        <span>Email</span>
        <input name="email" type="email" defaultValue={customer.email ?? ''} autoComplete="email" />
      </label>
      <label className="lum-field">
        <span>Phone *</span>
        <input name="phone" type="tel" inputMode="numeric" defaultValue={customer.phone ?? ''}
          autoComplete="tel" required />
      </label>

      {message && (
        <div className={message.ok ? 'lum-account-notice' : 'lum-pdp-warn'}>{message.text}</div>
      )}
      <button className="lum-cta-gold" style={{ justifyContent: 'center' }} disabled={busy}>
        {busy ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
