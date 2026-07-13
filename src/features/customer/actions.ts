'use server';

import { redirect } from 'next/navigation';
import { db, query } from '@/server/db/client';
import {
  hashPassword, verifyPassword, setCustomerSession, clearCustomerSession,
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
