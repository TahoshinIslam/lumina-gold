import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import sharp from 'sharp';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';

/**
 * POST /api/admin/upload-blog  (multipart: file)
 * The cover image of an article. Re-encoded through sharp — which strips EXIF
 * and anything hiding in a file that merely claims to be an image — and given a
 * generated filename, so the extension can never be `.html` or `.php`.
 *
 * Not cropped: a 1600px rendition keeping the photo's own proportions.
 */
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const jar = await cookies();
  if (jar.get(ADMIN_COOKIE)?.value !== adminToken()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 8 MB' }, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'journal');
  await mkdir(dir, { recursive: true });

  const resized = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86 })
    .toBuffer();

  const name = `${randomBytes(6).toString('hex')}.jpg`;
  await writeFile(path.join(dir, name), resized);

  return NextResponse.json({ ok: true, path: `/uploads/journal/${name}` });
}
