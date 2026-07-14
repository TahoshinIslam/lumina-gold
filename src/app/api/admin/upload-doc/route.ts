import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { guardAdminRoute } from '@/server/security/guard';
import { sniffFile } from '@/server/security/fileType';
import { certificateFile, safeSku } from '@/server/documents';

/**
 * POST /api/admin/upload-doc  (multipart: sku, file)
 *
 * Saves a Certificate of Authenticity to private-uploads/products/<SKU>/, which
 * is OUTSIDE public/ and therefore served by nothing. It used to go into
 * public/uploads, where the static handler would hand it to anyone who asked —
 * and since the filename is a fixed convention, "anyone who asked" meant anyone
 * who could guess a SKU. The SKU is printed on the product page.
 *
 * The bytes now come back out only through /api/documents, against a signed,
 * expiring URL minted server-side (@/server/documents).
 */
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const denied = await guardAdminRoute(req);
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const skuRaw = String(form.get('sku') || '').trim();
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!skuRaw) return NextResponse.json({ error: 'SKU required before uploading a certificate' }, { status: 400 });
  // A certificate is served for download, never re-encoded, so this is the
  // only thing standing between an admin session and an arbitrary file on
  // disk with a .pdf name. Check the %PDF signature, not the Content-Type.
  if ((await sniffFile(file)) !== 'pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'PDF is larger than 10 MB' }, { status: 400 });
  }

  // The SKU becomes a path segment, so strip anything that could escape the
  // uploads folder (../, absolute paths) before it ever touches the filesystem.
  const sku = safeSku(skuRaw);
  if (!sku) return NextResponse.json({ error: 'Invalid SKU' }, { status: 400 });

  const dest = certificateFile(sku);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));

  // No path comes back: there is no URL a caller can keep. The product page
  // gets a fresh signed one, minted per render, from the server.
  return NextResponse.json({ ok: true });
}
