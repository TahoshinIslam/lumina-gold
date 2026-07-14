import { NextRequest, NextResponse } from 'next/server';
import { expireStaleBookings } from '@/server/dal/bookings';

/**
 * GET /api/cron/expire-holds
 *
 * Releases reservations whose window has passed. The sweep also runs lazily
 * whenever an admin or customer opens their orders — but "lazily on a page
 * view" means a hold on the last piece can sit expired-but-unreleased for hours
 * if nobody happens to look, blocking a sale that should be possible. This
 * endpoint lets a real scheduler run it on a fixed cadence (e.g. every minute)
 * so expiry does not depend on someone loading a page.
 *
 * Guarded by CRON_SECRET (Bearer token or ?key=). Without one set, the route is
 * closed in production and open in dev — it only releases expired holds, so the
 * blast radius is nil, but there is no reason to leave it callable in prod.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    const key = bearer || req.nextUrl.searchParams.get('key');
    if (key !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
  }

  const released = await expireStaleBookings();
  return NextResponse.json({ ok: true, released });
}
