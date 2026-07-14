import { NextRequest } from 'next/server';

/**
 * Same-origin check for Route Handlers.
 *
 * Server Actions get this from the framework: Next compares Origin against Host
 * and aborts on a mismatch. Route Handlers get NOTHING — a POST to
 * /api/account/upload from evil.com rides the user's cookies exactly like a
 * genuine one. So every state-changing route handler calls this.
 *
 * Browsers always send Origin on a POST, including a same-origin one, and a
 * page cannot forge it. A request with no Origin at all is not a browser
 * (curl, a bot) and is refused too — every one of these endpoints exists to
 * serve our own front-end.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  // Prefer the proxy's forwarded host, falling back to Host. This is the same
  // pair Next itself compares for Server Actions.
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
