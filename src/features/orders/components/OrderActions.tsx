'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, RotateCcw } from 'lucide-react';
import { cancelOrderAction, requestReturnAction } from '@/features/orders/actions';
import { runAction } from '@/features/shared/runAction';

/**
 * Cancel / return — the two things a customer can still do to an order.
 *
 * Both ask for a reason and confirm before firing: a cancellation puts stock
 * back and cannot be undone from this side, and a return opens a real request
 * a concierge has to act on. Whether either is even offered is decided on the
 * server (canCancel / canReturn); this component only renders what it's given.
 */
export default function OrderActions({ orderNo, cancellable, returnable }: {
  orderNo: string;
  cancellable: boolean;
  returnable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<'cancel' | 'return' | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // A successful cancel removes both buttons — but the confirmation has to
  // survive that, or the shopper's action appears to have done nothing.
  if (!cancellable && !returnable && !message) return null;

  const submit = () => {
    const data = new FormData();
    data.set('order_no', orderNo);
    data.set('reason', reason);
    startTransition(async () => {
      const result = await runAction(() =>
        open === 'cancel' ? cancelOrderAction(data) : requestReturnAction(data));
      setMessage({ ok: result.ok, text: result.message ?? '' });
      if (result.ok) {
        setOpen(null);
        setReason('');
        router.refresh();
      }
    });
  };

  return (
    <div className="lum-order-actions">
      {message && (
        <div className={message.ok ? 'lum-account-notice' : 'lum-pdp-warn'}>{message.text}</div>
      )}

      {open === null ? (
        <div className="lum-order-buttons">
          {cancellable && (
            <button className="lum-cta-ghost" onClick={() => { setMessage(null); setOpen('cancel'); }}>
              <Ban size={15} /> Cancel order
            </button>
          )}
          {returnable && (
            <button className="lum-cta-ghost" onClick={() => { setMessage(null); setOpen('return'); }}>
              <RotateCcw size={15} /> Request a return
            </button>
          )}
        </div>
      ) : (
        <div className="lum-order-reason">
          <label className="lum-field">
            <span>
              {open === 'cancel'
                ? 'Why are you cancelling? (optional)'
                : 'What’s wrong with the piece? *'}
            </span>
            <textarea rows={2} value={reason} maxLength={255}
              onChange={e => setReason(e.target.value)} autoFocus />
          </label>
          <p className="lum-pdp-note">
            {open === 'cancel'
              ? 'Your pieces go back to the boutique and nothing is charged.'
              : 'A concierge will call you to arrange collection. Nothing is refunded until the piece is inspected.'}
          </p>
          <div className="lum-order-buttons">
            <button className="lum-cta-ghost" disabled={pending}
              onClick={() => { setOpen(null); setReason(''); }}>Never mind</button>
            <button className="lum-cta-gold" disabled={pending || (open === 'return' && reason.trim().length < 4)}
              onClick={submit}>
              {pending ? 'Working…' : open === 'cancel' ? 'Cancel this order' : 'Request return'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
