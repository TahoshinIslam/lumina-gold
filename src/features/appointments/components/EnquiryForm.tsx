'use client';

import { useRef, useState } from 'react';
import { submitEnquiryAction, type EnquiryKind } from '@/features/appointments/actions';
import { runAction } from '@/features/shared/runAction';

/**
 * The form behind "Reserve Your Appointment" — which, until now, was a link that
 * pointed at the section it was already inside.
 *
 * Two modes on one form, because a private viewing and a bespoke commission are
 * the same conversation with the boutique. Switching to Bespoke asks for a brief
 * and drops the "which boutique" question a commission doesn't need answered yet.
 *
 * Deliberately guest-first: no account, no sign-in wall. Somebody who wants to
 * be shown diamonds should not first have to choose a password.
 */
export default function EnquiryForm({
  boutiques,
}: {
  boutiques: { id: number; name: string; address: string | null }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<EnquiryKind>('appointment');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const bespoke = kind === 'bespoke';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setResult(null);

    const data = new FormData(e.currentTarget);
    data.set('kind', kind);

    // runAction, so an unexpected failure still gives the button its state back
    // rather than leaving it spinning on "Sending…" for ever.
    const res = await runAction(() => submitEnquiryAction(data));
    setBusy(false);
    setResult({ ok: res.ok, text: res.message ?? 'Something went wrong.' });
    if (res.ok) formRef.current?.reset();
  }

  // The confirmation replaces the form: there is nothing left to do, and leaving
  // the fields there invites a second identical request.
  if (result?.ok) {
    return (
      <div className="lum-appt-form lum-appt-done" role="status">
        <div className="lum-breathe-diamond" style={{ width: 22, height: 22, margin: '0 auto 18px' }} />
        <p className="lum-body-text">{result.text}</p>
        <button type="button" className="lum-cta-ghost" onClick={() => setResult(null)}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="lum-appt-form" onSubmit={onSubmit}>
      {/* Which conversation is this? */}
      <div className="lum-appt-kind" role="tablist" aria-label="Request type">
        {(['appointment', 'bespoke'] as const).map(k => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            className={`lum-appt-tab${kind === k ? ' is-active' : ''}`}
            onClick={() => { setKind(k); setResult(null); }}
          >
            {k === 'appointment' ? 'Private Viewing' : 'Bespoke Commission'}
          </button>
        ))}
      </div>

      <div className="lum-appt-fields">
        <label className="lum-appt-field">
          <span>Your name</span>
          <input name="name" type="text" required autoComplete="name" maxLength={120} placeholder="Ayesha Rahman" />
        </label>

        <label className="lum-appt-field">
          <span>Mobile</span>
          <input
            name="phone" type="tel" required autoComplete="tel"
            inputMode="numeric" maxLength={20} placeholder="01712345678"
          />
        </label>

        <label className="lum-appt-field">
          <span>Email <em>(optional)</em></span>
          <input name="email" type="email" autoComplete="email" maxLength={190} placeholder="you@example.com" />
        </label>

        {/* A commission has no boutique to visit yet — the design team calls first. */}
        {!bespoke && (
          <label className="lum-appt-field">
            <span>Boutique</span>
            <select name="boutique_id" defaultValue="">
              <option value="">No preference</option>
              {boutiques.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}{b.address ? ` — ${b.address}` : ''}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="lum-appt-field">
          <span>Preferred date <em>(optional)</em></span>
          <input name="preferred_at" type="datetime-local" />
        </label>

        <label className="lum-appt-field lum-appt-field--wide">
          <span>
            {bespoke ? 'The piece you have in mind' : 'Anything we should know?'}
            {bespoke && <em> (required)</em>}
          </span>
          <textarea
            name="message"
            rows={bespoke ? 4 : 2}
            maxLength={1000}
            required={bespoke}
            placeholder={bespoke
              ? 'A ring for an engagement — emerald cut, around 2 carats, platinum band…'
              : 'A particular collection you would like to see…'}
          />
        </label>
      </div>

      {result && !result.ok && (
        <div className="lum-pdp-warn" role="alert" style={{ marginTop: 4 }}>{result.text}</div>
      )}

      <button type="submit" className="lum-cta-gold" disabled={busy} data-magnetic="">
        {busy ? 'Sending…' : bespoke ? 'Request a Commission' : 'Reserve Your Appointment'}
      </button>

      <p className="lum-appt-note">
        We will call you to confirm. Your details are used only to arrange this visit.
      </p>
    </form>
  );
}
