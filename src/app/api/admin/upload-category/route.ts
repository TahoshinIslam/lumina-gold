import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';

/**
 * POST /api/admin/upload-category  (multipart: slug, file)
 * Saves a category tile image to public/uploads/categories/<slug>.jpg and
 * returns its public path, which the category form stores in categories.image.
 *
 * One fixed filename per category — re-uploading replaces it, so a category
 * can't accumulate orphaned files. A single rendition, not the five the product
 * gallery needs.
 *
 * NOT cropped: this used to resize to a fixed 900×600 tile with fit:'cover',
 * which cut the top and bottom off a portrait product shot. The image keeps its
 * own proportions and the tile/circle fits it whole instead.
 */
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const jar = await cookies();
  if (jar.get(ADMIN_COOKIE)?.value !== adminToken()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const slugRaw = String(form.get('slug') || '').trim();
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 8 MB' }, { status: 400 });
  }

  // The slug becomes a filename, so strip anything that could escape the folder.
  const slug = slugRaw.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!slug) return NextResponse.json({ error: 'Name the category first' }, { status: 400 });

  const dir = path.join(process.cwd(), 'public', 'uploads', 'categories');
  await mkdir(dir, { recursive: true });
  const resized = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86 })
    .toBuffer();
  await writeFile(path.join(dir, `${slug}.jpg`), resized);

  // Cache-buster: the filename never changes, so without this the browser keeps
  // showing the previous image after a re-upload.
  return NextResponse.json({ ok: true, path: `/uploads/categories/${slug}.jpg?v=${Date.now()}` });
}
