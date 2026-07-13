import { db, query } from '@/server/db/client';
import { getCurrentCustomer, setCustomerSession } from '@/server/auth/customer';

/** What checkout did with the shopper's identity — drives the message they see next. */
export type AccountOutcome =
  | 'created'   // no account existed; we made one from the details they just typed
  | 'signed-in' // a guest account existed (no password of its own) and is now theirs again
  | 'linked'    // they were already signed in
  | 'existing'; // a PASSWORD-protected account owns that phone — we won't hand it over

/**
 * Find or create the account an order belongs to.
 *
 * A phone number is not a credential, so it can't be allowed to open an account
 * that someone has set a password on — anyone who knew the number could type it
 * at checkout and be signed in as them. So:
 *   • no account            → create one, sign them in (nothing to steal, it's theirs)
 *   • account, no password  → a previous guest order under the same phone; it holds
 *                             nothing a password protects, so sign them in
 *   • account WITH password → link the order to it, but make them sign in to see it
 */
export async function resolveAccount(
  name: string, phone: string, email: string,
): Promise<{ userId: number; outcome: AccountOutcome }> {
  const signedIn = await getCurrentCustomer();
  if (signedIn) return { userId: signedIn.id, outcome: 'linked' };

  const found = await query<{ id: number; password_hash: string | null }>(
    'SELECT id, password_hash FROM users WHERE phone = ?', [phone],
  );
  const user = found[0];

  if (user?.password_hash) return { userId: user.id, outcome: 'existing' };

  if (user) {
    await setCustomerSession(user.id);
    return { userId: user.id, outcome: 'signed-in' };
  }

  // email is UNIQUE: if it already belongs to someone else's account, keep the
  // email on the order only — better an email-less account than a failed order.
  const emailTaken = email
    ? await query<{ id: number }>('SELECT id FROM users WHERE email = ?', [email])
    : [];
  const [res] = await db.query(
    'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, emailTaken[0] || !email ? null : email],
  );
  const userId = (res as { insertId: number }).insertId;
  await setCustomerSession(userId);
  return { userId, outcome: 'created' };
}

/** Adopt orders placed as a guest under the same phone, so history isn't split. */
export async function adoptGuestOrders(userId: number, phone: string): Promise<void> {
  await query(
    'UPDATE orders SET user_id = ? WHERE user_id IS NULL AND shipping_phone = ?',
    [userId, phone],
  );
}
