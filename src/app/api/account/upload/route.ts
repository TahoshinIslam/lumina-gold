import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import sharp from 'sharp';
import { getCurrentCustomer } from '@/server/auth/customer';
import { isSameOrigin } from '@/server/security/origin';
import { hit, clientKey, LIMITS as RL } from '@/server/security/rateLimit';
import { sniffFile, IMAGE_TYPES as SIG_IMAGE, VIDEO_TYPES as SIG_VIDEO } from '@/server/security/fileType';

/**
 * POST /api/account/upload  (multipart: kind = 'avatar' | 'review', file)
 *
 * The only upload route a CUSTOMER may call, so it is deliberately strict: it
 * is authenticated as a customer, the destination folder is chosen here (never
 * sent by the client), and the filename is generated — a caller cannot write
 * outside public/uploads/{avatars,reviews}.
 *
 * Images are re-encoded through sharp rather than copied. That is the security
 * point, not just the size: a re-encode strips EXIF (a customer's photo carries
 * their GPS location) and anything hiding in a file that merely claims to be an
 * image.
 */
const LIMITS = {
  avatar: { bytes: 5 * 1024 * 1024, width: 400, height: 400, dir: 'avatars' },
  review: { bytes: 8 * 1024 * 1024, width: 1400, height: 1400, dir: 'reviews' },
} as const;

/**
 * Video is accepted for a review, but on a short leash.
 *
 * It is NOT re-encoded — there is no transcoder here — so the bytes a customer
 * uploads are the bytes served. The guard is therefore: an allow-list of
 * container formats every browser can play natively, identified by their MAGIC
 * BYTES (this used to trust `file.type`, which is just a string the client
 * chose); a hard 25 MB ceiling (a phone clip of a ring catching the light, not
 * a film); and a generated filename, so the extension can never be `.php` or
 * `.html` — which is what would turn an upload folder into a way to execute
 * code or serve a phishing page from your own domain.
 *
 * `X-Content-Type-Options: nosniff` (next.config.ts) is the other half of this:
 * even if something slipped through, the browser will not sniff it into being
 * executable.
 */
const VIDEO_MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: NextRequest) {
  // A Route Handler gets no CSRF protection from Next (Server Actions do), so
  // a POST from evil.com would otherwise ride the user's cookie.
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  const gate = hit(await clientKey('upload'), RL.upload.limit, RL.upload.windowSec);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const kindRaw = String(form.get('kind') || 'review');
  const kind = kindRaw === 'avatar' ? 'avatar' : 'review';
  const limits = LIMITS[kind];

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // What the file IS, from its magic bytes — not the Content-Type the caller
  // typed. Everything below branches on this, never on file.type.
  const kindOnDisk = await sniffFile(file);

  const dir = path.join(process.cwd(), 'public', 'uploads', limits.dir);
  await mkdir(dir, { recursive: true });

  // ── Video (reviews only) ────────────────────────────────────────────────
  if (kindOnDisk && SIG_VIDEO.includes(kindOnDisk)) {
    const videoExt = kindOnDisk === 'mov' ? 'mov' : kindOnDisk; // mp4 | webm | mov
    if (kind !== 'review') {
      return NextResponse.json({ error: 'A profile picture must be an image.' }, { status: 400 });
    }
    if (file.size > VIDEO_MAX_BYTES) {
      return NextResponse.json(
        { error: `Video is larger than ${VIDEO_MAX_BYTES / 1024 / 1024} MB. Please trim it.` },
        { status: 400 },
      );
    }
    const name = `${customer.id}-${randomBytes(6).toString('hex')}.${videoExt}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true, path: `/uploads/${limits.dir}/${name}`, kind: 'video' });
  }

  // ── Image ───────────────────────────────────────────────────────────────
  if (!kindOnDisk || !SIG_IMAGE.includes(kindOnDisk)) {
    return NextResponse.json(
      { error: 'Upload a photo (JPG, PNG) or a short video (MP4, WebM, MOV).' }, { status: 400 },
    );
  }
  if (file.size > limits.bytes) {
    return NextResponse.json(
      { error: `Image is larger than ${Math.round(limits.bytes / 1024 / 1024)} MB.` }, { status: 400 },
    );
  }

  const resized = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate() // honour the EXIF orientation before we discard the EXIF
    .resize({
      width: limits.width, height: limits.height,
      fit: kind === 'avatar' ? 'cover' : 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 86 })
    .toBuffer();

  const name = `${customer.id}-${randomBytes(6).toString('hex')}.jpg`;
  await writeFile(path.join(dir, name), resized);

  return NextResponse.json({ ok: true, path: `/uploads/${limits.dir}/${name}`, kind: 'image' });
}
