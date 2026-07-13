import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import sharp from 'sharp';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';
import { homeSection } from '@/config/home';

/**
 * POST /api/admin/upload-home  (multipart: section, file)
 * Saves a home page model/editorial photo and returns its public path; the
 * caller then records it against the section via addHomeMediaAction.
 *
 * Unlike the category tile (one fixed filename per category, re-upload
 * replaces), a section holds MANY images, so each gets a unique name and a
 * row of its own — that's what makes the cross-fade possible.
 */
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const jar = await cookies();
  if (jar.get(ADMIN_COOKIE)?.value !== adminToken()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const section = homeSection(String(form.get('section') || ''));

  if (!section) return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 10 MB' }, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'home');
  await mkdir(dir, { recursive: true });

  // NOT cropped. `fit: 'inside'` only shrinks the photo until it fits inside the
  // bounding box, keeping its own proportions — an earlier version cropped to the
  // frame with fit:'cover' and cut the tops off the model shots. The page adapts
  // its frame to these dimensions instead (see MediaSlideshow).
  const resized = sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({
      width: section.width, height: section.height,
      fit: 'inside', withoutEnlargement: true,
    })
    .jpeg({ quality: 88 });

  const { data, info } = await resized.toBuffer({ resolveWithObject: true });
  const name = `${section.key}-${randomBytes(5).toString('hex')}.jpg`;
  await writeFile(path.join(dir, name), data);

  return NextResponse.json({
    ok: true,
    path: `/uploads/home/${name}`,
    width: info.width,
    height: info.height,
  });
}
