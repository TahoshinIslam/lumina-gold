import mysql from 'mysql2/promise';

/**
 * Shared MariaDB pool (XAMPP defaults: root / no password / port 3306).
 * Override via env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 */
const globalForDb = globalThis as unknown as { _luminaPool?: mysql.Pool };

export const db =
  globalForDb._luminaPool ??
  mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lumina_jewelry',
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  });

if (process.env.NODE_ENV !== 'production') globalForDb._luminaPool = db;

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await db.query(sql, params as (string | number | null)[]);
  return rows as T[];
}
