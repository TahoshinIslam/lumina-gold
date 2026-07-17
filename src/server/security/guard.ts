import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from '@/server/auth/admin';
import { verifySession } from '@/server/auth/adminSession';
import { isSameOrigin } from './origin';
import { hit, clientKey, LIMITS } from './rateLimit';

/**
 * The gate every admin Route Handler stands behind: same-origin, authenticated,
 * rate-limited — in that order, because there is no reason to do work (or to
 * tell an off-origin caller whether their cookie is any good) before the cheap
 * checks pass.
 *
 * Returns a Response to send back, or null to mean "carry on". One helper
 * rather than five copies, so a new admin route cannot be added with the checks
 * subtly out of step.
 */
export async function guardAdminRoute(req: NextRequest): Promise<NextResponse | null> {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const jar = await cookies();
  if (verifySession(jar.get(ADMIN_COOKIE)?.value) === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gate = hit(await clientKey('admin-upload'), LIMITS.upload.limit, LIMITS.upload.windowSec);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  return null;
}
