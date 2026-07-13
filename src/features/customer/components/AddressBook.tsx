'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Address } from '@/server/dal/addresses';
import {
  saveMyAddressAction, deleteMyAddressAction, setMyDefaultAddressAction,
} from '@/features/customer/actions';
import { useRouter } from 'next/navigation';
import { runAction } from '@/features/shared/runAction';

/**
 * The address book, as managed from the account (the checkout has its own,
 * because there the dialog also has to open an account for a guest — see
 * AddressDialog).
 */
export default function AddressBook({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const run = async (action: (data: FormData) => Promise<{ ok: boolean; message: string }>, data: FormData) => {
    setBusy(true);
    const result = await runAction(() => action(data));
    setBusy(false);
    setMessage({ ok: result.ok, text: result.message });
    if (result.ok) {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="lum-orders-head">
        <h2 className="lum-cart-summary-title">Saved addresses</h2>
        <button className="lum-cta-gold" onClick={() => { setEditing(null); setMessage(null); setOpen(true); }}>
          + Add address
        </button>
      </div>

      {message && (
        <div className={message.ok ? 'lum-account-notice' : 'lum-pdp-warn'}>{message.text}</div>
      )}

      {addresses.length === 0 ? (
        <div className="lum-empty-results" style={{ marginTop: 20 }}>
          No addresses saved yet.
        </div>
      ) : (
        <div className="lum-addr-list" style={{ marginTop: 20 }}>
          {addresses.map(address => (
            <div key={address.id} className={`lum-addr${address.is_default ? ' is-on' : ''}`}>
              <div className="lum-addr-body">
                <div className="lum-addr-head">
                  <strong>{address.name}</strong>
                  {address.label && <span className="lum-addr-tag">{address.label}</span>}
                  {!!address.is_default && <span className="lum-addr-tag is-default">Default</span>}
                </div>
                <div className="lum-addr-lines">
                  {[address.line1, address.line2, address.city, address.district, address.postcode]
                    .filter(Boolean).join(', ')}
                </div>
                <div className="lum-addr-lines">{address.phone}</div>
              </div>
              <div className="lum-addr-tools">
                <button type="button" aria-label="Edit address" disabled={busy}
                  onClick={() => { setEditing(address); setMessage(null); setOpen(true); }}>
                  <Pencil size={14} />
                </button>
                <button type="button" aria-label="Remove address" disabled={busy}
                  onClick={() => {
                    const data = new FormData();
                    data.set('id', String(address.id));
                    void run(deleteMyAddressAction, data);
                  }}>
                  <Trash2 size={14} />
                </button>
                {!address.is_default && (
                  <button type="button" className="lum-addr-default" disabled={busy}
                    onClick={() => {
                      const data = new FormData();
                      data.set('id', String(address.id));
                      void run(setMyDefaultAddressAction, data);
                    }}>Make default</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <dialog ref={dialogRef} className="lum-dialog"
        onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
        <form className="lum-dialog-form"
          onSubmit={e => { e.preventDefault(); void run(saveMyAddressAction, new FormData(e.currentTarget)); }}>
          <h2 className="lum-cart-summary-title">{editing ? 'Edit address' : 'Add an address'}</h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="lum-field-row">
            <label className="lum-field">
              <span>Full name *</span>
              <input name="name" defaultValue={editing?.name ?? ''} required />
            </label>
            <label className="lum-field">
              <span>Phone *</span>
              <input name="phone" type="tel" inputMode="numeric" placeholder="01712345678"
                defaultValue={editing?.phone ?? ''} required />
            </label>
          </div>
          <label className="lum-field">
            <span>Street address *</span>
            <input name="line1" defaultValue={editing?.line1 ?? ''} required />
          </label>
          <label className="lum-field">
            <span>Apartment, floor (optional)</span>
            <input name="line2" defaultValue={editing?.line2 ?? ''} />
          </label>
          <div className="lum-field-row">
            <label className="lum-field">
              <span>City *</span>
              <input name="city" defaultValue={editing?.city ?? ''} required />
            </label>
            <label className="lum-field">
              <span>District</span>
              <input name="district" defaultValue={editing?.district ?? ''} />
            </label>
            <label className="lum-field">
              <span>Postcode</span>
              <input name="postcode" defaultValue={editing?.postcode ?? ''} inputMode="numeric" />
            </label>
          </div>
          <div className="lum-field-row">
            <label className="lum-field">
              <span>Label</span>
              <input name="label" defaultValue={editing?.label ?? ''} placeholder="Home, Office…" />
            </label>
            <label className="lum-check">
              <input type="checkbox" name="is_default" defaultChecked={!!editing?.is_default} />
              <span>Use as my default address</span>
            </label>
          </div>

          <div className="lum-dialog-actions">
            <button type="button" className="lum-cta-ghost" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="lum-cta-gold" disabled={busy}>
              {busy ? 'Saving…' : 'Save address'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
