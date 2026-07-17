import mysql from 'mysql2/promise';

/**
 * Shared MariaDB pool (XAMPP defaults: root / no password / port 3306).
 * Override via env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 */
const globalForDb = globalThis as unknown as { _luminaPool?: mysql.Pool };

/**
 * How many connections ONE instance of this module may hold.
 *
 * This used to be a flat 25, which was measured and correct for a VPS: one Node
 * process, one pool, a MariaDB allowing 151 connections, 51 in use at peak.
 *
 * Serverless invalidates the arithmetic rather than the reasoning. There is no
 * single process — every warm function instance loads this module and opens its
 * own pool, and Vercel runs as many instances as it likes. At 25 apiece, ten
 * concurrent instances ask for 250 connections and a hosted MySQL starts
 * refusing them. The failure looks like a database problem and is not one.
 *
 * So the pool is sized per-instance, and concurrency is the platform's job:
 * a few connections each, multiplied by however many instances are warm.
 */
const SERVERLESS = !!process.env.VERCEL;
const CONNECTION_LIMIT = SERVERLESS ? 3 : 25;

export const db =
  globalForDb._luminaPool ??
  mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lumina_jewelry',
    waitForConnections: true,
    /* Raised from 10 — but only AFTER cutting the work, not instead of it.
     *
     * A bigger pool is the tempting first move and it is mostly a way of hiding
     * the real problem: at 500 concurrent users the home page's p95 was two
     * seconds because it fired 47 queries per render, not because ten connections
     * was a cruel limit. Caching that page and folding its eight showcase queries
     * into one took it to ~50ms with the pool untouched.
     *
     * Measured afterwards, going 10 -> 25 bought a further ~18% on the product
     * page (p95 9.7s -> 7.9s), which is worth having and is safe: MariaDB allows
     * 151 connections here and never came close (0 connection errors, 51 in use
     * at peak). It is not a licence to keep climbing — every connection is memory
     * and a scheduling slot on a database with finite CPU, and the product page's
     * real fault is that it still asks 26 questions to draw one product. */
    connectionLimit: CONNECTION_LIMIT,
    namedPlaceholders: true,
  });

/**
 * Reuse the pool across invocations — in every environment, production included.
 *
 * This was `NODE_ENV !== 'production'`, which is the standard Next incantation
 * and means "stop HMR spawning a pool per reload in dev". On a VPS the exclusion
 * costs nothing: the module is evaluated once for the life of the process, so
 * there is exactly one pool whether or not it is cached.
 *
 * On a serverless platform that assumption is simply false. A warm instance
 * survives between requests and re-evaluates modules on a cold start, and
 * skipping the cache in production is precisely where a pool leaks — a fresh set
 * of connections each time, none of them reclaimed, against a hosted database
 * with a hard connection ceiling.
 *
 * globalThis is the one thing that outlives a module evaluation on a warm
 * instance, so the pool belongs there in all environments.
 */
globalForDb._luminaPool = db;

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await db.query(sql, params as (string | number | null)[]);
  return rows as T[];
}
