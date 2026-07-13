'use client';

import { useState } from 'react';
import { setPasswordAction, updateNotificationsAction } from '@/features/customer/actions';
import { runAction } from '@/features/shared/runAction';

/**
 * Security tab: password and notification preferences.
 *
 * The password form posts straight to the existing setPasswordAction (which
 * redirects with ?ok= / ?error=) — authentication is deliberately untouched.
 */
export default function SecurityPanel({ hasPassword, prefs }: {
  hasPassword: boolean;
  prefs: { notify_order: number; notify_offers: number; notify_sms: number };
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <form action={setPasswordAction} className="lum-checkout-form" style={{ maxWidth: 460 }}>
        <h2 className="lum-cart-summary-title">
          {hasPassword ? 'Change your password' : 'Set a password'}
        </h2>
        <p className="lum-pdp-desc" style={{ margin: 0 }}>
          {hasPassword
            ? 'Choose a new password for signing in with your phone number.'
            : 'Your account was created from your order details, so it has no password yet. Set one and you can sign in from any device.'}
        </p>
        {hasPassword && (
          <label className="lum-field">
            <span>Current password *</span>
            <input name="current" type="password" autoComplete="current-password" required />
          </label>
        )}
        <label className="lum-field">
          <span>{hasPassword ? 'New password *' : 'Password *'}</span>
          <input name="password" type="password" autoComplete="new-password" minLength={6} required />
        </label>
        <label className="lum-field">
          <span>Confirm password *</span>
          <input name="confirm" type="password" autoComplete="new-password" minLength={6} required />
        </label>
        <button className="lum-cta-gold" style={{ justifyContent: 'center' }} type="submit">
          {hasPassword ? 'Update password' : 'Set password'}
        </button>
      </form>

      <form className="lum-checkout-form" style={{ maxWidth: 460 }}
        onSubmit={async event => {
          event.preventDefault();
          setBusy(true);
          const result = await runAction(() => updateNotificationsAction(new FormData(event.currentTarget)));
          setBusy(false);
          setMessage({ ok: result.ok, text: result.message ?? '' });
        }}>
        <h2 className="lum-cart-summary-title">Notifications</h2>
        <label className="lum-check">
          <input type="checkbox" name="notify_order" defaultChecked={!!prefs.notify_order} />
          <span>Email me about my orders</span>
        </label>
        <label className="lum-check">
          <input type="checkbox" name="notify_sms" defaultChecked={!!prefs.notify_sms} />
          <span>Text me delivery updates</span>
        </label>
        <label className="lum-check">
          <input type="checkbox" name="notify_offers" defaultChecked={!!prefs.notify_offers} />
          <span>New collections and private offers</span>
        </label>
        {message && (
          <div className={message.ok ? 'lum-account-notice' : 'lum-pdp-warn'}>{message.text}</div>
        )}
        <button className="lum-cta-ghost" style={{ justifyContent: 'center' }} disabled={busy}>
          {busy ? 'Saving…' : 'Save preferences'}
        </button>
      </form>
    </div>
  );
}
