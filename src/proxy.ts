import { NextResponse, type NextRequest } from 'next/server';
import { GATE_COOKIE, gateEnabled, gateToken, safeEqual } from '@/lib/gate';

/**
 * Work-in-progress gate.
 *
 * Everything is hidden behind a password screen except the two documents the
 * iOS app depends on. /support and /privacy-policy are registered with App
 * Store Connect: gating them would break the App Store listing, so they stay
 * public no matter what.
 *
 * /admin is gated on purpose, so the admin login sits behind the site password
 * as well as its own.
 *
 * Note this is a soft gate for a site that is not launched, not a security
 * boundary for the data behind it. What actually protects applications and
 * user accounts is Payload's own access control.
 */

/** Must keep working while the rest of the site is hidden. */
const ALWAYS_PUBLIC = [
  '/support',
  '/privacy-policy',
  '/privacy', // redirects to /privacy-policy
  '/hyrje', // the gate screen itself
  '/api/gate', // the endpoint that checks the password
  '/robots.txt', // so crawlers can be told to stay away
];

function isPublic(pathname: string): boolean {
  return ALWAYS_PUBLIC.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function proxy(request: NextRequest) {
  if (!gateEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const cookie = request.cookies.get(GATE_COOKIE)?.value;
  if (cookie && safeEqual(cookie, await gateToken())) {
    return NextResponse.next();
  }

  // Rewrite rather than redirect: the visitor keeps the URL they asked for, so
  // once they enter the password they can be sent straight back to it.
  const url = request.nextUrl.clone();
  url.pathname = '/hyrje';
  url.searchParams.set('next', pathname);
  return NextResponse.rewrite(url, { status: 401 });
}

export const config = {
  /**
   * Skip Next's own assets and anything that looks like a static file, so the
   * gate screen can still load the logo and fonts.
   */
  matcher: ['/((?!_next/static|_next/image|.*\\.[\\w]+$).*)'],
};
