import { query, db } from '@/server/db/client';

/** A shopper's address book. Orders keep their own copy — see 009_orders_commerce.sql. */
export interface Address {
  id: number;
  user_id: number;
  label: string | null;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  district: string | null;
  postcode: string | null;
  country: string;
  is_default: number;
}

export async function getAddresses(userId: number): Promise<Address[]> {
  return query<Address>(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [userId],
  );
}

export async function getAddress(userId: number, id: number): Promise<Address | null> {
  const rows = await query<Address>(
    'SELECT * FROM addresses WHERE id = ? AND user_id = ?', [id, userId],
  );
  return rows[0] ?? null;
}

export interface AddressInput {
  label?: string; name: string; phone: string; line1: string; line2?: string;
  city: string; district?: string; postcode?: string; country?: string; isDefault?: boolean;
}

/** One default per user — set inside the same connection so two can't both win. */
async function clearOtherDefaults(userId: number, keepId: number | null) {
  await query(
    'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id <> ?',
    [userId, keepId ?? 0],
  );
}

export async function createAddress(userId: number, input: AddressInput): Promise<number> {
  const existing = await query<{ n: number }>(
    'SELECT COUNT(*) n FROM addresses WHERE user_id = ?', [userId],
  );
  // The first address a shopper saves is their default, whatever they ticked —
  // a checkout with no default selected would otherwise start with nothing.
  const isDefault = input.isDefault || existing[0].n === 0 ? 1 : 0;

  const [res] = await db.query(
    `INSERT INTO addresses (user_id, label, name, phone, line1, line2, city, district, postcode, country, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, input.label || null, input.name, input.phone, input.line1, input.line2 || null,
     input.city, input.district || null, input.postcode || null, input.country || 'BD', isDefault],
  );
  const id = (res as { insertId: number }).insertId;
  if (isDefault) await clearOtherDefaults(userId, id);
  return id;
}

export async function updateAddress(userId: number, id: number, input: AddressInput): Promise<void> {
  await query(
    `UPDATE addresses SET label=?, name=?, phone=?, line1=?, line2=?, city=?, district=?, postcode=?, country=?, is_default=?
      WHERE id=? AND user_id=?`,
    [input.label || null, input.name, input.phone, input.line1, input.line2 || null,
     input.city, input.district || null, input.postcode || null, input.country || 'BD',
     input.isDefault ? 1 : 0, id, userId],
  );
  if (input.isDefault) await clearOtherDefaults(userId, id);
}

export async function deleteAddress(userId: number, id: number): Promise<void> {
  const address = await getAddress(userId, id);
  if (!address) return;
  await query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  // Never leave the book without a default.
  if (address.is_default) {
    const next = await query<{ id: number }>(
      'SELECT id FROM addresses WHERE user_id = ? ORDER BY id LIMIT 1', [userId],
    );
    if (next[0]) await query('UPDATE addresses SET is_default = 1 WHERE id = ?', [next[0].id]);
  }
}

export async function setDefaultAddress(userId: number, id: number): Promise<void> {
  const address = await getAddress(userId, id);
  if (!address) return;
  await query('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);
  await clearOtherDefaults(userId, id);
}
