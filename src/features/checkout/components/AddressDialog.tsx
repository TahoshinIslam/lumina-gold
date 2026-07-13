'use client';

import { useEffect, useRef, useState } from 'react';
import type { Address } from '@/server/dal/addresses';
import { saveAddressAction } from '@/app/(checkout)/checkout/actions';
import { runAction } from '@/features/shared/runAction';

/**
 * Add / edit a delivery address.
 *
 * A native <dialog> rather than a hand-rolled overlay: it gets focus trapping,
 * Escape-to-close and an inert background for free, which a div with a z-index
 * does not.
 *
 * `askEmail` is on for a guest — saving their first address is also what opens
 * their account (see saveAddressAction), and an order with no email has no way
 * to send a confirmation.
 *
 * VALIDATION runs here, on every field at once, because the server answers with
 * the FIRST problem it finds: with a bad name, a bad phone and a bad email, a
 * server-only form makes the customer submit three times to learn three things.
 * The server still re-checks all of it — this is for the customer's benefit, not
 * for the data's safety.
 */

type Field = 'name' | 'phone' | 'email' | 'line1' | 'city';
type Errors = Partial<Record<Field, string>>;

/** Phone is stored as a plain 11-digit local number; accept the shapes people type. */
function normalisePhone(raw: string) {
  const digits = (raw || '').replace(/[^\d]/g, '');
  return digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
}

/** The same rules the server enforces, said sooner. */
function validate(values: Record<Field, string>, askEmail: boolean): Errors {
  const errors: Errors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Please tell us who to deliver to.';
  else if (name.length < 2) errors.name = 'That name looks too short.';

  const phone = normalisePhone(values.phone);
  if (!phone) errors.phone = 'We need a number for the courier to call.';
  else if (!/^\d{11}$/.test(phone)) errors.phone = 'Enter an 11-digit number, e.g. 01712345678.';
  else if (!/^01[3-9]/.test(phone)) errors.phone = 'That isn’t a valid Bangladeshi mobile number.';

  if (askEmail) {
    const email = values.email.trim();
    if (!email) errors.email = 'We’ll send your order confirmation here.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = 'That email address doesn’t look right.';
    }
  }

  const line1 = values.line1.trim();
  if (!line1) errors.line1 = 'Where should we bring it?';
  else if (line1.length < 4) errors.line1 = 'Please give a little more detail.';

  const city = values.city.trim();
  if (!city) errors.city = 'Which city?';
  else if (city.length < 2) errors.city = 'That city name looks too short.';

  return errors;
}

const FIELD_ORDER: Field[] = ['name', 'phone', 'email', 'line1', 'city'];

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
  const [errors, setErrors] = useState<Errors>({});
  // Don't shout at someone about a field they haven't reached yet.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Reopening starts clean. React's documented "adjust state during render"
  // pattern — an effect that setStates on a prop change costs an extra render
  // pass and trips react-hooks/set-state-in-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) { setError(''); setErrors({}); setTouched({}); }
  }

  const readForm = (form: HTMLFormElement): Record<Field, string> => {
    const data = new FormData(form);
    return {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      email: String(data.get('email') ?? ''),
      line1: String(data.get('line1') ?? ''),
      city: String(data.get('city') ?? ''),
    };
  };

  const recheck = (form: HTMLFormElement, field: Field) => {
    const found = validate(readForm(form), askEmail);
    setErrors(prev => ({ ...prev, [field]: found[field] }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const found = validate(readForm(form), askEmail);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, line1: true, city: true });
    if (Object.keys(found).length) {
      setError('');
      // Put the cursor on the first thing that needs fixing.
      const first = FIELD_ORDER.find(f => found[f]);
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setBusy(true);
    setError('');
    const result = await runAction(() => saveAddressAction(new FormData(form)));
    setBusy(false);
    if (!result.ok || !('id' in result) || !result.id) {
      setError(result.message ?? 'Could not save that address.');
      return;
    }
    onSaved(result.id);
  };

  const show = (field: Field) => (touched[field] ? errors[field] : undefined);
  const fieldProps = (field: Field) => ({
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(t => ({ ...t, [field]: true }));
      recheck(e.currentTarget.form!, field);
    },
    // Once a field has been complained about, clear the complaint the moment
    // it's fixed — not on the next submit.
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched[field]) recheck(e.currentTarget.form!, field);
    },
    'aria-invalid': !!show(field),
    className: show(field) ? 'is-bad' : undefined,
  });

  return (
    <dialog ref={ref} className="lum-dialog" onCancel={onClose} onClose={onClose}>
      {/* noValidate: we render our own messages. The browser's bubbles show one
          field at a time, can't be styled, and vanish on the next click. */}
      <form className="lum-dialog-form" onSubmit={submit} noValidate>
        <h2 className="lum-cart-summary-title">{address ? 'Edit address' : 'Add a delivery address'}</h2>
        {address && <input type="hidden" name="id" value={address.id} />}

        <div className="lum-field-row">
          <label className="lum-field">
            <span>Full name *</span>
            <input name="name" defaultValue={address?.name ?? ''} autoComplete="name"
              autoFocus {...fieldProps('name')} />
            {show('name') && <em className="lum-field-error">{show('name')}</em>}
          </label>
          <label className="lum-field">
            <span>Phone *</span>
            <input name="phone" type="tel" inputMode="numeric" placeholder="01712345678"
              defaultValue={address?.phone ?? ''} autoComplete="tel" {...fieldProps('phone')} />
            {show('phone') && <em className="lum-field-error">{show('phone')}</em>}
          </label>
        </div>

        {askEmail && (
          <label className="lum-field">
            <span>Email *</span>
            <input name="email" type="email" autoComplete="email" {...fieldProps('email')} />
            {show('email')
              ? <em className="lum-field-error">{show('email')}</em>
              : (
                <em className="lum-field-hint">
                  We’ll create your account with these details so you can track this order.
                </em>
              )}
          </label>
        )}

        <label className="lum-field">
          <span>Street address *</span>
          <input name="line1" defaultValue={address?.line1 ?? ''} autoComplete="address-line1"
            placeholder="House 12, Road 5, Gulshan" {...fieldProps('line1')} />
          {show('line1') && <em className="lum-field-error">{show('line1')}</em>}
        </label>
        <label className="lum-field">
          <span>Apartment, floor (optional)</span>
          <input name="line2" defaultValue={address?.line2 ?? ''} autoComplete="address-line2" />
        </label>

        <div className="lum-field-row">
          <label className="lum-field">
            <span>City *</span>
            <input name="city" defaultValue={address?.city ?? ''} autoComplete="address-level2"
              {...fieldProps('city')} />
            {show('city') && <em className="lum-field-error">{show('city')}</em>}
          </label>
          <label className="lum-field">
            <span>District</span>
            <input name="district" defaultValue={address?.district ?? ''} autoComplete="address-level1" />
          </label>
          <label className="lum-field">
            <span>Postcode</span>
            <input name="postcode" defaultValue={address?.postcode ?? ''} autoComplete="postal-code"
              inputMode="numeric" />
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

        {/* Whatever the SERVER still refuses — a phone already on another account, say. */}
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
