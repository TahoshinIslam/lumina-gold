import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir, readdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { ADMIN_COOKIE, adminToken } from '../../../../lib/adminAuth';

/**
 * POST /api/admin/upload  (multipart: sku, file)
 * Saves the upload into public/uploads/products/<SKU>/<size>/<n>.jpg for
 * every rendition (original, zoom, large 1200, medium 600, thumb 240) and
 * returns the `large` path. Admin-cookie guarded. The product save action
 * persists the returned path into product_images.
 */
const SIZES: Record<string, number | null> = {
  original: null, zoom: null, large: 1200, medium: 600, thumb: 240,
};

export async function POST(req: NextRequest) {
  const jar = await cookies();
  if (jar.get(ADMIN_COOKIE)?.value !== adminToken()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const skuRaw = String(form.get('sku') || '').trim();
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!skuRaw) return NextResponse.json({ error: 'SKU required before uploading an image' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  const sku = skuRaw.replace(/[^A-Za-z0-9._-]/g, '');
  const base = path.join(process.cwd(), 'public', 'uploads', 'products', sku);
  const input = Buffer.from(await file.arrayBuffer());

  // Next image number = (existing files in large/) + 1
  let n = 1;
  try {
    const existing = await readdir(path.join(base, 'large'));
    n = existing.filter(f => f.endsWith('.jpg')).length + 1;
  } catch { /* folder doesn't exist yet → 1 */ }

  for (const [size, width] of Object.entries(SIZES)) {
    await mkdir(path.join(base, size), { recursive: true });
    const pipeline = sharp(input).rotate();
    const out = width ? pipeline.resize({ width, withoutEnlargement: true }) : pipeline;
    await writeFile(path.join(base, size, `${n}.jpg`), await out.jpeg({ quality: 86 }).toBuffer());
  }

  return NextResponse.json({
    ok: true,
    n,
    path: `/uploads/products/${sku}/large/${n}.jpg`,
  });
}
