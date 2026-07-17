import type { ResultSetHeader } from 'mysql2';
import { db, query } from '@/server/db/client';
import { hashPassword } from '@/server/auth/password';

/**
 * admin_users — the accounts that can sign into the back office.
 *
 * The table and its roles (Super Admin / Manager / Staff) shipped with the very
 * first schema and were then never used: admin auth was a single password in
 * ADMIN_PASSWORD, and admin/layout.tsx read this table only to print a name,
 * always falling back to "Administrator" because no row ever existed. This is
 * the write side that was missing — login verifies against it, and the profile
 * page edits it.
 */

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
  is_active: number;
  last_login_at: string | null;
}

/** Super Admin — the role the bootstrap account is created with. Matches the
 *  seeded roles row; see database/lumina_jewelry.sql. */
const SUPER_ADMIN_ROLE_ID = 1;

/** Email is stored and compared lower-cased and trimmed, so "Admin@x.com " and
 *  "admin@x.com" are the same account and the UNIQUE index means what a person
 *  expects it to. */
export function normaliseEmail(raw: string): string {
  return String(raw || '').trim().toLowerCase();
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const rows = await query<AdminUser>(
    `SELECT id, name, email, password_hash, role_id, is_active, last_login_at
       FROM admin_users WHERE email = ? LIMIT 1`,
    [normaliseEmail(email)],
  );
  return rows[0] ?? null;
}

export async function getAdminById(id: number): Promise<AdminUser | null> {
  const rows = await query<AdminUser>(
    `SELECT id, name, email, password_hash, role_id, is_active, last_login_at
       FROM admin_users WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function countAdmins(): Promise<number> {
  const rows = await query<{ c: number }>(`SELECT COUNT(*) AS c FROM admin_users`);
  return rows[0]?.c ?? 0;
}

export async function updateAdminPassword(id: number, newPlain: string): Promise<void> {
  const hash = await hashPassword(newPlain);
  await db.query(`UPDATE admin_users SET password_hash = ? WHERE id = ?`, [hash, id]);
}

/**
 * Update the editable profile fields. Email is unique, so a collision with
 * another admin surfaces as a thrown ER_DUP_ENTRY — the caller turns that into
 * a friendly "that email is already in use" rather than a 500.
 */
export async function updateAdminProfile(
  id: number,
  fields: { name: string; email: string },
): Promise<void> {
  await db.query(`UPDATE admin_users SET name = ?, email = ? WHERE id = ?`, [
    fields.name.trim(),
    normaliseEmail(fields.email),
    id,
  ]);
}

export async function touchLastLogin(id: number): Promise<void> {
  await db.query(`UPDATE admin_users SET last_login_at = NOW() WHERE id = ?`, [id]);
}

/**
 * Bootstrap the first admin, once, from the environment.
 *
 * The table ships empty; without this the very first login is impossible
 * because there is nothing to verify against. When (and only when) the table is
 * empty, seed one Super Admin from ADMIN_EMAIL + ADMIN_PASSWORD — the same env
 * password that used to BE the auth, now demoted to a one-time bootstrap
 * credential. After first login the password is changed in-app and the env var
 * is irrelevant to logging in.
 *
 * Returns the seeded row, or null if the table was already populated (nothing
 * to do) or ADMIN_PASSWORD is unset (nothing to seed with).
 *
 * Idempotent and race-safe: email is UNIQUE, so if two first-logins run at
 * once the second INSERT throws ER_DUP_ENTRY, which is swallowed — both callers
 * then find the row by email.
 */
export async function ensureAdminSeed(): Promise<AdminUser | null> {
  if ((await countAdmins()) > 0) return null;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  const email = normaliseEmail(process.env.ADMIN_EMAIL || 'admin@naharjewellers.com');
  const hash = await hashPassword(password);

  try {
    const [res] = await db.query<ResultSetHeader>(
      `INSERT INTO admin_users (name, email, password_hash, role_id, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      ['Administrator', email, hash, SUPER_ADMIN_ROLE_ID],
    );
    return {
      id: res.insertId,
      name: 'Administrator',
      email,
      password_hash: hash,
      role_id: SUPER_ADMIN_ROLE_ID,
      is_active: 1,
      last_login_at: null,
    };
  } catch {
    // Lost the race (ER_DUP_ENTRY) — the other caller seeded it. Read it back.
    return getAdminByEmail(email);
  }
}
