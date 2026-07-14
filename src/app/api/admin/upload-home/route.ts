import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import sharp from 'sharp';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';
import { homeSection, PHONE_CROP } from '@/config/home';

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
  const stem = `${section.key}-${randomBytes(5).toString('hex')}`;
  await writeFile(path.join(dir, `${stem}.jpg`), data);

  /* A backdrop is painted as the viewport itself, and a phone's viewport is about
   * 9:19 — a 16:9 photograph covering that keeps only the middle quarter of its
   * width, so the piece the shot was built around ends up out of frame and what
   * is left is blown up. Rather than ask for a second photograph, derive one.
   *
   * `sharp.strategy.attention` crops to the region a person's eye goes to, not to
   * the geometric middle: on the current hero that is the solitaire, which a
   * centre crop cuts clean in half. The admin can still overrule it by uploading
   * their own into the section's "— phone" slot.
   *
   * Cropped from the ORIGINAL, not from the resized copy — the wide rendition is
   * only 1440px tall and this needs 1920. */
  let phonePath: string | null = null;
  if (section.backdrop) {
    const original = Buffer.from(await file.arrayBuffer());
    const source = sharp(original).rotate();
    const meta = await source.metadata();

    // The SHAPE is what matters, and it must survive a small source. Asking for
    // 1080×1920 with `withoutEnlargement` does not do that — sharp clamps the
    // height to whatever the photo has and hands back 1080×940, which is a
    // landscape crop wearing a portrait's name and fixes nothing. So take the
    // largest 9:16 rectangle the photo can actually give, and no bigger.
    const aspect = PHONE_CROP.width / PHONE_CROP.height;
    let width = Math.min(PHONE_CROP.width, meta.width ?? PHONE_CROP.width);
    let height = Math.round(width / aspect);
    if (height > (meta.height ?? height)) {
      height = meta.height ?? height;
      width = Math.round(height * aspect);
    }

    const phone = await sharp(original)
      .rotate()
      .resize({ width, height, fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 86 })
      .toBuffer();
    await writeFile(path.join(dir, `${stem}-phone.jpg`), phone);
    phonePath = `/uploads/home/${stem}-phone.jpg`;
  }

  return NextResponse.json({
    ok: true,
    path: `/uploads/home/${stem}.jpg`,
    phonePath,
    width: info.width,
    height: info.height,
  });
}
