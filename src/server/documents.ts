import { access } from 'fs/promises';
import path from 'path';
import { signPath } from '@/server/security/signedUrl';

/**
 * Private document storage.
 *
 * `private-uploads/` sits NEXT TO public/, not inside it. Nothing in Next serves
 * it: the static handler only knows about public/, so the only route to these
 * bytes is /api/documents, which demands a valid signature. Moving the folder
 * is the actual fix; the signing is what makes a legitimate link still work.
 */
export const PRIVATE_ROOT = path.join(process.cwd(), 'private-uploads');

/** A SKU becomes a path segment, so it is scrubbed before it can climb out of
 *  the folder with `../` or an absolute path. Same rule as the upload route. */
export function safeSku(raw: string): string | null {
  const sku = String(raw || '').replace(/[^A-Za-z0-9._-]/g, '');
  return sku || null;
}

/** Where a product's certificate lives on disk. */
export function certificateFile(sku: string): string {
  return path.join(PRIVATE_ROOT, 'products', sku, 'certificate.pdf');
}

/** The key that travels in the signed URL — never an absolute path. */
export function certificateKey(sku: string): string {
  return `products/${sku}/certificate.pdf`;
}

export async function certificateExists(sku: string): Promise<boolean> {
  try {
    await access(certificateFile(sku));
    return true;
  } catch {
    return false;
  }
}

/**
 * A short-lived URL for this product's certificate, or null if there isn't one.
 * Call from a SERVER component: the signature is minted with AUTH_SECRET, which
 * must never reach the browser.
 */
export async function certificateUrl(skuRaw: string): Promise<string | null> {
  const sku = safeSku(skuRaw);
  if (!sku) return null;
  if (!(await certificateExists(sku))) return null;
  return signPath(certificateKey(sku));
}

/**
 * Resolve a signed key to a real file, refusing anything that escapes the root.
 *
 * The signature already proves WE minted the key, so this is defence in depth —
 * but it is the check that means a bug in signing can never become arbitrary
 * file read. path.resolve collapses any `..` first; then we insist the result
 * is still inside PRIVATE_ROOT.
 */
export function resolveWithinRoot(key: string): string | null {
  const full = path.resolve(PRIVATE_ROOT, key);
  const root = path.resolve(PRIVATE_ROOT);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}
