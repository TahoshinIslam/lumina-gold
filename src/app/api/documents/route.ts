import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { verify } from '@/server/security/signedUrl';
import { resolveWithinRoot } from '@/server/documents';

/**
 * GET /api/documents?file=<key>&exp=<unix>&sig=<hmac>
 *
 * The only way to a file in private-uploads/. Three gates, in order:
 *
 *   1. The signature must be ours (HMAC over file+expiry, constant-time).
 *   2. It must not have expired.
 *   3. The resolved path must still be inside the private root — so even a
 *      forged-but-somehow-valid key cannot walk out with `../../.env`.
 *
 * Deliberately NOT origin-checked: a signed URL is meant to survive being
 * opened in a new tab or handed to a PDF viewer, neither of which sends an
 * Origin we would recognise. The signature IS the credential.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const verdict = verify(params.get('file'), params.get('exp'), params.get('sig'));

  if (!verdict.ok) {
    // One status for every failure. "Expired" vs "bad signature" would tell an
    // attacker which half of the token they got right.
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const full = resolveWithinRoot(verdict.file);
  if (!full) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let bytes: Buffer;
  try {
    bytes = await readFile(full);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="certificate.pdf"',
      // Never let a browser sniff this into something executable, and never let
      // a shared cache keep a document that was served against a signed URL.
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  });
}
