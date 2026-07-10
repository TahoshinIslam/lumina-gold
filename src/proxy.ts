import { NextRequest, NextResponse } from 'next/server';

/**
 * Protect /admin/* behind the session cookie. The expected token is
 * sha256("lumina-admin:" + ADMIN_PASSWORD) — computed with WebCrypto
 * because proxy runs on the edge runtime.
 */
async function expectedToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || 'lumina123';
  const data = new TextEncoder().encode(`lumina-admin:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }
  const cookie = req.cookies.get('lum_admin')?.value;
  if (cookie && cookie === (await expectedToken())) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*'] };
