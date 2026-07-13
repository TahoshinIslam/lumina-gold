'use client';

import { useEffect, useRef, useState } from 'react';
import type { Address } from '@/server/dal/addresses';
import { saveAddressAction } from '@/app/(checkout)/checkout/actions';
import { runAction } from '@/features/shared/runAction';

/**
 * Add / edit a delivery address.
 *
 * A native <dialog> rather than a hand-rolled overlay: it gets focus trapping,
 * Escape-to-close and inert background for free, which a div with a z-index
 * does not.
 *
 * `askEmail` is on for a guest — saving their first address is also what opens
 * their account (see saveAddressAction), and an order with no email has no way
 * to send a confirmation.
 */
export default function AddressDialog({ open, address, askEmail, onClose, onSaved }: {
  open: boolean;
  address: Address | null;
  askEmail: boolean;
  onClose: () => void;
  onSaved: (id: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clear a stale error the moment the dialog is reopened. React's documented
  // "adjust state during render" pattern — an effect that setStates on a prop
  // change costs an extra render pass and trips react-hooks/set-state-in-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setError('');
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(event.currentTarget);
    const result = await runAction(() => saveAddressAction(data));
    setBusy(false);
    if (!result.ok || !('id' in result) || !result.id) {
      setError(result.message ?? 'Could not save that address.');
      return;
    }
    onSaved(result.id);
  };

  return (
    <dialog ref={ref} className="lum-dialog" onCancel={onClose} onClose={onClose}>
      <form className="lum-dialog-form" onSubmit={submit}>
        <h2 className="lum-cart-summary-title">{address ? 'Edit address' : 'Add a delivery address'}</h2>
        {address && <input type="hidden" name="id" value={address.id} />}

        <div className="lum-field-row">
          <label className="lum-field">
            <span>Full name *</span>
            <input name="name" defaultValue={address?.name ?? ''} autoComplete="name" required />
          </label>
          <label className="lum-field">
            <span>Phone *</span>
            <input name="phone" type="tel" inputMode="numeric" placeholder="01712345678"
              defaultValue={address?.phone ?? ''} autoComplete="tel" required />
          </label>
        </div>

        {askEmail && (
          <label className="lum-field">
            <span>Email *</span>
            <input name="email" type="email" autoComplete="email" required />
            <em className="lum-field-hint">
              We’ll create your account with these details so you can track this order.
            </em>
          </label>
        )}

        <label className="lum-field">
          <span>Street address *</span>
          <input name="line1" defaultValue={address?.line1 ?? ''} autoComplete="address-line1"
            placeholder="House 12, Road 5, Gulshan" required />
        </label>
        <label className="lum-field">
          <span>Apartment, floor (optional)</span>
          <input name="line2" defaultValue={address?.line2 ?? ''} autoComplete="address-line2" />
        </label>

        <div className="lum-field-row">
          <label className="lum-field">
            <span>City *</span>
            <input name="city" defaultValue={address?.city ?? ''} autoComplete="address-level2" required />
          </label>
          <label className="lum-field">
            <span>District</span>
            <input name="district" defaultValue={address?.district ?? ''} autoComplete="address-level1" />
          </label>
          <label className="lum-field">
            <span>Postcode</span>
            <input name="postcode" defaultValue={address?.postcode ?? ''} autoComplete="postal-code" inputMode="numeric" />
          </label>
        </div>

        <div className="lum-field-row">
          <label className="lum-field">
            <span>Label</span>
            <input name="label" defaultValue={address?.label ?? ''} placeholder="Home, Office…" />
          </label>
          <label className="lum-check">
            <input type="checkbox" name="is_default" defaultChecked={!!address?.is_default} />
            <span>Use as my default address</span>
          </label>
        </div>

        {error && <div className="lum-pdp-warn">{error}</div>}

        <div className="lum-dialog-actions">
          <button type="button" className="lum-cta-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="lum-cta-gold" disabled={busy}>
            {busy ? 'Saving…' : address ? 'Save changes' : 'Save address'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
