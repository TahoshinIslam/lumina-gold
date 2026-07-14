import { headers } from 'next/headers';
import { query } from '@/server/db/client';

/**
 * The admin audit trail.
 *
 * ONE HONEST LIMITATION, UP FRONT: admin auth is a single shared password, so
 * `admin_user_id` is NULL on every row. This log can tell you WHAT was done,
 * WHEN, and from WHICH IP — it cannot tell you WHO, because the system does not
 * know. Individual admin accounts are the fix; until then, the IP is the only
 * thread back to a person, and that is why it is recorded.
 *
 * What gets logged: anything that moves money, destroys data, changes a price,
 * or lets someone in. Not every mutation — an audit log nobody reads because it
 * is 90% noise is not an audit log.
 */

export type AuditEntry = {
  action: string;                 // 'order.refund', 'product.delete', 'rate.update'
  entityType: string;             // 'order' | 'product' | 'coupon' | ...
  entityId?: number | string | null;
  before?: unknown;               // state before the change
  after?: unknown;                // state after
};

/** Never let a failed audit write take down the operation it was recording —
 *  but never let it fail silently either. */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const h = await headers();
    const fwd = h.get('x-forwarded-for');
    const ip = (fwd ? fwd.split(',')[0]!.trim() : h.get('x-real-ip')) || null;

    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, old_values, new_values, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.action,
        entry.entityType,
        entry.entityId != null ? Number(entry.entityId) || null : null,
        entry.before != null ? JSON.stringify(entry.before).slice(0, 60000) : null,
        entry.after != null ? JSON.stringify(entry.after).slice(0, 60000) : null,
        ip?.slice(0, 45) ?? null,
      ],
    );
  } catch (err) {
    console.error('[audit] failed to record', entry.action, err);
  }
}
