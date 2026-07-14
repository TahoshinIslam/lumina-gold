'use server';

import { revalidatePath } from 'next/cache';
import { db, query } from '@/server/db/client';
import { getCurrentCustomer } from '@/server/auth/customer';
import { hit, clientKey } from '@/server/security/rateLimit';
import { recordEnquiry } from '@/server/analytics';

/**
 * A request for a private viewing, or for a bespoke commission.
 *
 * The homepage's "Reserve Your Appointment" button used to be
 * `<a href="#appointment">` — it linked to the section it was already in, so the
 * most prominent call to action on the site did nothing. This is what it does
 * now.
 *
 * Guest-first on purpose: most people asking for a private viewing have never
 * made an account, and forcing one on them is how the enquiry is lost. The
 * user_id is recorded only if they happened to be signed in already.
 */

export type EnquiryKind = 'appointment' | 'bespoke';
export type EnquiryResult = { ok: boolean; message: string };

/** BD mobile: 11 digits starting 01, tolerant of +880 / spaces / dashes. */
function normalisePhone(raw: string): string | null {
  const digits = (raw || '').replace(/[^\d]/g, '').replace(/^8801/, '01');
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}

export async function submitEnquiryAction(formData: FormData): Promise<EnquiryResult> {
  // A public, unauthenticated form that writes a row is a spam target. The same
  // limiter that guards login guards this.
  const gate = hit(await clientKey('enquiry'), 5, 30 * 60);
  if (!gate.ok) {
    return { ok: false, message: 'Too many requests. Please try again shortly, or call the boutique.' };
  }

  const kindRaw = String(formData.get('kind') || 'appointment');
  const kind: EnquiryKind = kindRaw === 'bespoke' ? 'bespoke' : 'appointment';

  const name = String(formData.get('name') || '').trim().slice(0, 120);
  const phone = normalisePhone(String(formData.get('phone') || ''));
  const email = String(formData.get('email') || '').trim().slice(0, 190) || null;
  const message = String(formData.get('message') || '').trim().slice(0, 1000) || null;
  const boutiqueId = Number(formData.get('boutique_id')) || null;
  const preferredRaw = String(formData.get('preferred_at') || '').trim();

  if (name.length < 2) return { ok: false, message: 'Please tell us your name.' };
  if (!phone) return { ok: false, message: 'Enter a valid 11-digit mobile number, e.g. 01712345678.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, message: 'That email address doesn’t look right.' };
  }
  // A bespoke commission with no brief is not a brief.
  if (kind === 'bespoke' && (!message || message.length < 10)) {
    return { ok: false, message: 'Tell us a little about the piece you have in mind.' };
  }

  // A date in the past is a typo, not a request. Empty is fine — plenty of
  // people would rather the boutique suggested a time.
  let preferredAt: string | null = null;
  if (preferredRaw) {
    const when = new Date(preferredRaw);
    if (Number.isNaN(when.getTime())) return { ok: false, message: 'That date doesn’t look right.' };
    if (when.getTime() < Date.now() - 60_000) {
      return { ok: false, message: 'Please choose a date in the future.' };
    }
    preferredAt = preferredRaw.slice(0, 19).replace('T', ' ');
  }

  // The boutique must be a real, active store — not any warehouse id a form
  // could be edited to contain.
  let boutique: number | null = null;
  if (boutiqueId) {
    const rows = await query<{ id: number }>(
      `SELECT id FROM warehouses WHERE id = ? AND type = 'store' AND is_active = 1`, [boutiqueId],
    );
    boutique = rows[0]?.id ?? null;
  }

  const customer = await getCurrentCustomer();

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.query(
      `INSERT INTO appointments (kind, name, phone, email, user_id, boutique_id, preferred_at, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [kind, name, phone, email, customer?.id ?? null, boutique, preferredAt, message],
    );
    const id = (res as { insertId: number }).insertId;

    // The analytics event is written HERE, in the same transaction as the row —
    // so an event means a request that actually exists, and a rolled-back
    // submission books nothing. The browser is not asked to report it.
    await recordEnquiry(conn, {
      event: kind === 'bespoke' ? 'submit_bespoke_request' : 'book_appointment',
      enquiryId: id,
    });

    await conn.commit();
  } catch {
    await conn.rollback();
    return { ok: false, message: 'Could not send your request. Please call the boutique.' };
  } finally {
    conn.release();
  }

  revalidatePath('/admin/appointments');
  return {
    ok: true,
    message: kind === 'bespoke'
      ? 'Thank you — our design team will call you to discuss your commission.'
      : 'Thank you — the boutique will call you shortly to confirm your visit.',
  };
}
