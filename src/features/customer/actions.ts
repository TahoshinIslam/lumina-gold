'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db, query } from '@/server/db/client';
import {
  getAddress, createAddress, updateAddress, deleteAddress, setDefaultAddress,
} from '@/server/dal/addresses';
import {
  hashPassword, verifyPassword, setCustomerSession, clearCustomerSession, getCurrentCustomer,
} from '@/server/auth/customer';

/** BD phone: 11 digits starting 01, optionally +880 prefix. Normalise to 01XXXXXXXXX. */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, '').replace(/^8801/, '01');
  return /^01\d{9}$/.test(digits) ? digits : null;
}

export async function registerCustomerAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const phoneRaw = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '').trim() || null;
  const password = String(formData.get('password') || '');

  const phone = normalizePhone(phoneRaw);
  if (!name || !phone) redirect('/account/register?error=missing');
  if (password.length < 6) redirect('/account/register?error=weak');

  const existing = await query<{ id: number }>('SELECT id FROM users WHERE phone = ?', [phone]);
  if (existing[0]) redirect('/account/register?error=exists');

  const [res] = await db.query(
    'INSERT INTO users (name, phone, email, password_hash) VALUES (?, ?, ?, ?)',
    [name, phone, email, hashPassword(password)],
  );
  await setCustomerSession((res as { insertId: number }).insertId);
  redirect('/account');
}

export async function loginCustomerAction(formData: FormData) {
  const phone = normalizePhone(String(formData.get('phone') || ''));
  const password = String(formData.get('password') || '');
  if (!phone) redirect('/account/login?error=invalid');

  const rows = await query<{ id: number; password_hash: string | null }>(
    'SELECT id, password_hash FROM users WHERE phone = ? AND is_active = 1', [phone],
  );
  const user = rows[0];
  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    redirect('/account/login?error=invalid');
  }
  await setCustomerSession(user.id);
  redirect('/account');
}

export async function logoutCustomerAction() {
  await clearCustomerSession();
  redirect('/account/login');
}

/**
 * Set (or change) the password on the account.
 *
 * An account created at checkout has no password — the shopper is signed in on
 * that device and nothing more. This is how they turn it into an account they
 * can come back to. Changing an EXISTING password requires the current one:
 * without that check, anyone borrowing an unlocked phone could lock the owner
 * out of their own account.
 */
export async function setPasswordAction(formData: FormData) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');

  const current = String(formData.get('current') || '');
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');

  if (password.length < 6) redirect('/account?error=weak');
  if (password !== confirm) redirect('/account?error=mismatch');

  const rows = await query<{ password_hash: string | null }>(
    'SELECT password_hash FROM users WHERE id = ?', [customer.id],
  );
  const existing = rows[0]?.password_hash;
  if (existing && !verifyPassword(current, existing)) redirect('/account?error=current');

  await query('UPDATE users SET password_hash = ? WHERE id = ?', [hashPassword(password), customer.id]);
  redirect(existing ? '/account?ok=changed' : '/account?ok=set');
}

/* ── Profile (Phase 8) ────────────────────────────────────────────────────
 * "Do not modify authentication" — none of this touches the session or the
 * password hashing; it edits the row the session already points at. */

export type ProfileResult = { ok: boolean; message: string };

/** Name, email, phone, avatar. Phone and email are UNIQUE, so a clash is a real
 *  answer ("that number is already on another account"), not a 500. */
export async function updateProfileAction(formData: FormData): Promise<ProfileResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim() || null;
  const phone = normalizePhone(String(formData.get('phone') || ''));
  const avatar = String(formData.get('avatar') || '').trim() || null;

  if (name.length < 2) return { ok: false, message: 'Enter your full name.' };
  if (!phone) return { ok: false, message: 'Enter a valid 11-digit mobile number.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, message: 'That email address doesn’t look right.' };
  }

  const clash = await query<{ id: number; phone: string | null; email: string | null }>(
    'SELECT id, phone, email FROM users WHERE (phone = ? OR (email IS NOT NULL AND email = ?)) AND id <> ?',
    [phone, email, customer.id],
  );
  if (clash[0]) {
    return {
      ok: false,
      message: clash[0].phone === phone
        ? 'That number is already on another account.'
        : 'That email is already on another account.',
    };
  }

  await query(
    'UPDATE users SET name = ?, email = ?, phone = ?, avatar_path = COALESCE(?, avatar_path) WHERE id = ?',
    [name, email, phone, avatar, customer.id],
  );
  revalidatePath('/account');
  return { ok: true, message: 'Profile updated' };
}

export async function updateNotificationsAction(formData: FormData): Promise<ProfileResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  // Unchecked boxes simply aren't submitted, so absence means off.
  const on = (key: string) => (formData.get(key) ? 1 : 0);
  await query(
    'UPDATE users SET notify_order = ?, notify_offers = ?, notify_sms = ? WHERE id = ?',
    [on('notify_order'), on('notify_offers'), on('notify_sms'), customer.id],
  );
  revalidatePath('/account');
  return { ok: true, message: 'Notification preferences saved' };
}

/** The address book, edited from the account rather than mid-checkout. */
export async function saveMyAddressAction(formData: FormData): Promise<ProfileResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const input = {
    label: String(formData.get('label') || '').trim() || undefined,
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').replace(/[^\d]/g, '').replace(/^880/, '0'),
    line1: String(formData.get('line1') || '').trim(),
    line2: String(formData.get('line2') || '').trim() || undefined,
    city: String(formData.get('city') || '').trim(),
    district: String(formData.get('district') || '').trim() || undefined,
    postcode: String(formData.get('postcode') || '').trim() || undefined,
    country: 'BD',
    isDefault: !!formData.get('is_default'),
  };
  if (input.name.length < 2) return { ok: false, message: 'Enter the recipient’s name.' };
  if (!/^01[3-9]\d{8}$/.test(input.phone)) return { ok: false, message: 'Enter a valid 11-digit mobile number.' };
  if (input.line1.length < 4) return { ok: false, message: 'Enter the street address.' };
  if (input.city.length < 2) return { ok: false, message: 'Enter the city.' };

  const id = Number(formData.get('id')) || null;
  if (id) {
    const owned = await getAddress(customer.id, id);
    if (!owned) return { ok: false, message: 'That address is no longer in your book.' };
    await updateAddress(customer.id, id, input);
  } else {
    await createAddress(customer.id, input);
  }
  revalidatePath('/account');
  revalidatePath('/checkout');
  return { ok: true, message: id ? 'Address updated' : 'Address saved' };
}

export async function deleteMyAddressAction(formData: FormData): Promise<ProfileResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };
  await deleteAddress(customer.id, Number(formData.get('id')));
  revalidatePath('/account');
  revalidatePath('/checkout');
  return { ok: true, message: 'Address removed' };
}

export async function setMyDefaultAddressAction(formData: FormData): Promise<ProfileResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };
  await setDefaultAddress(customer.id, Number(formData.get('id')));
  revalidatePath('/account');
  revalidatePath('/checkout');
  return { ok: true, message: 'Default address updated' };
}
