import type { PoolConnection } from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

/**
 * The stock ledger — every write to inventory in one place, so the rules cannot
 * drift between the checkout, the admin panel and the booking flow.
 *
 * THE ONE RULE: stock is decremented by a CONDITIONAL update, never by reading a
 * number and writing it back. The old code did this —
 *
 *     if (line.inStock) { ... }                          // read
 *     UPDATE inventory SET quantity_available =          // write, much later
 *       GREATEST(0, quantity_available - qty) ...
 *
 * — and it oversells. Two customers buy the last ring: both read stock = 1, both
 * pass the check, both run the UPDATE, GREATEST floors the second one at 0, and
 * TWO orders exist for ONE ring. GREATEST() stops the number going negative; it
 * does NOT stop the second sale. The shelf reads 0 and the boutique is short a
 * ring.
 *
 * `deductStock` closes that: the decrement only happens if the stock is STILL
 * there at write time, and it reports whether it did. The caller rolls the whole
 * transaction back when it didn't.
 */

/**
 * The warehouse the storefront sells from.
 *
 * Boutique and online share ONE inventory table, keyed by (variant, warehouse).
 * "Synchronized" is therefore structural: there is a single authoritative row
 * per piece per location, not an online copy that drifts from a boutique copy.
 * The online storefront sells warehouse 1; the Dhaka/Chittagong boutiques are
 * warehouses 2 and 3 (see the `warehouses` seed). A transfer between them is an
 * inventory_movement of type transfer_in/out, so the ledger stays balanced.
 *
 * It was a bare `1` in a dozen queries; naming it is how a second selling
 * location gets added without a find-and-replace across the codebase.
 */
export const ONLINE_WAREHOUSE_ID = 1;

/**
 * Atomically remove `qty` from a variant's available stock — but only if that
 * much is actually there. Returns true if the stock moved, false if it wasn't
 * available (which is the caller's signal to abort the sale).
 *
 * Runs inside the caller's transaction: the row is locked for the rest of it, so
 * a second buyer racing for the same piece blocks here and then finds the stock
 * already gone.
 */
export async function deductStock(
  conn: PoolConnection,
  variantId: number,
  qty: number,
  warehouseId: number = ONLINE_WAREHOUSE_ID,
): Promise<boolean> {
  const [res] = await conn.query<ResultSetHeader>(
    `UPDATE inventory
        SET quantity_available = quantity_available - ?
      WHERE variant_id = ? AND warehouse_id = ? AND quantity_available >= ?`,
    [qty, variantId, warehouseId, qty],
  );
  // affectedRows is 0 when the WHERE matched nothing — i.e. the guard
  // `quantity_available >= qty` failed because the stock is no longer there.
  return res.affectedRows > 0;
}

/** Put `qty` back — a cancellation or an intended restock. Always succeeds. */
export async function restoreStock(
  conn: PoolConnection,
  variantId: number,
  qty: number,
  warehouseId: number = ONLINE_WAREHOUSE_ID,
): Promise<void> {
  await conn.query(
    `UPDATE inventory SET quantity_available = quantity_available + ?
       WHERE variant_id = ? AND warehouse_id = ?`,
    [qty, variantId, warehouseId],
  );
}

export type MovementType =
  | 'purchase' | 'sale' | 'return' | 'damage'
  | 'transfer_in' | 'transfer_out' | 'reservation' | 'release'
  | 'adjustment' | 'production';

/**
 * The audit line for one stock change. EVERY movement of stock writes one — a
 * quantity_available that changed with no matching row here is exactly the
 * "who took this off the shelf?" question nobody can answer.
 *
 * `quantity` is signed: negative leaves the shelf (sale, damage), positive
 * returns to it (return, purchase).
 */
export async function recordMovement(
  conn: PoolConnection,
  m: {
    variantId: number;
    type: MovementType;
    quantity: number;
    referenceType?: string | null;
    referenceId?: number | null;
    note?: string | null;
    warehouseId?: number;
  },
): Promise<void> {
  await conn.query(
    `INSERT INTO inventory_movements
       (variant_id, warehouse_id, movement_type, quantity, reference_type, reference_id, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      m.variantId, m.warehouseId ?? ONLINE_WAREHOUSE_ID, m.type, m.quantity,
      m.referenceType ?? null, m.referenceId ?? null, m.note ?? null,
    ],
  );
}

export type SerialClaim =
  | { tracked: false }                 // variant has no serials — qty gate governs
  | { tracked: true; serials: string[] } // claimed exactly what was asked
  | { tracked: true; serials: null };    // serial-tracked but not enough free → oversell

/**
 * If a variant is tracked by individual serials, claim `qty` of them for an
 * order — atomically, so the same physical piece can never leave twice.
 *
 * The distinction the caller needs:
 *   { tracked: false }         → not serial-tracked; quantity_available alone
 *                                governs, exactly as before. The common case.
 *   { tracked, serials: [...] }→ claimed; stamp them on the order line.
 *   { tracked, serials: null } → serial-tracked but fewer than `qty` free. That
 *                                is an oversell of a unique piece; the caller
 *                                must abort even if quantity_available somehow
 *                                disagreed.
 *
 * SELECT ... FOR UPDATE locks the candidate rows for the rest of the
 * transaction, so a racing order waits and then finds them already sold.
 */
export async function claimSerials(
  conn: PoolConnection,
  variantId: number,
  qty: number,
  orderId: number,
): Promise<SerialClaim> {
  const [existing] = await conn.query<ResultSetHeader & Array<{ id: number }>>(
    `SELECT id FROM product_serials WHERE variant_id = ? LIMIT 1`,
    [variantId],
  );
  if ((existing as unknown as unknown[]).length === 0) return { tracked: false };

  const [free] = await conn.query<ResultSetHeader & Array<{ id: number; serial_number: string }>>(
    `SELECT id, serial_number FROM product_serials
      WHERE variant_id = ? AND status = 'in_stock'
      ORDER BY id
      LIMIT ?
      FOR UPDATE`,
    [variantId, qty],
  );
  const rows = free as unknown as Array<{ id: number; serial_number: string }>;
  if (rows.length < qty) return { tracked: true, serials: null };

  const ids = rows.map(r => r.id);
  await conn.query(
    `UPDATE product_serials SET status = 'sold', order_id = ?
      WHERE id IN (${ids.map(() => '?').join(',')})`,
    [orderId, ...ids],
  );
  return { tracked: true, serials: rows.map(r => r.serial_number) };
}

/** Return an order's claimed serials to stock (a cancellation or intended
 *  restock). Flips them back to in_stock and detaches the order. */
export async function releaseSerials(conn: PoolConnection, orderId: number): Promise<void> {
  await conn.query(
    `UPDATE product_serials SET status = 'in_stock', order_id = NULL
      WHERE order_id = ? AND status = 'sold'`,
    [orderId],
  );
}
