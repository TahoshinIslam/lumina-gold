import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';

/**
 * POST /api/admin/upload-doc  (multipart: sku, file)
 * Saves a Certificate of Authenticity to
 * public/uploads/products/<SKU>/certificate.pdf and returns its public path.
 * The product page finds it by that convention, so no DB column is needed —
 * which is also why the filename is fixed: re-uploading replaces the old one.
 * Admin-cookie guarded, same as the image route.
 */
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const jar = await cookies();
  if (jar.get(ADMIN_COOKIE)?.value !== adminToken()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const skuRaw = String(form.get('sku') || '').trim();
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!skuRaw) return NextResponse.json({ error: 'SKU required before uploading a certificate' }, { status: 400 });
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'PDF is larger than 10 MB' }, { status: 400 });
  }

  // The SKU becomes a path segment, so strip anything that could escape the
  // uploads folder (../, absolute paths) before it ever touches the filesystem.
  const sku = skuRaw.replace(/[^A-Za-z0-9._-]/g, '');
  if (!sku) return NextResponse.json({ error: 'Invalid SKU' }, { status: 400 });

  const dir = path.join(process.cwd(), 'public', 'uploads', 'products', sku);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'certificate.pdf'), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ ok: true, path: `/uploads/products/${sku}/certificate.pdf` });
}
