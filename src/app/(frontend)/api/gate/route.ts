import { NextResponse } from 'next/server';
import { GATE_COOKIE, gateEnabled, gateToken, safeEqual } from '@/lib/gate';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Checks the work-in-progress password and, on success, sets the cookie the
 * proxy looks for.
 *
 * Rate limited: without it this is an unauthenticated endpoint that will
 * happily accept unlimited password guesses.
 */
export async function POST(req: Request) {
  if (!gateEnabled()) {
    return NextResponse.json({ ok: true });
  }

  const { ok, retryAfter } = rateLimit(`gate:${clientKey(req)}`);
  if (!ok) {
    return NextResponse.json(
      { error: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'BAD_JSON' }, { status: 400 });
  }

  const expected = process.env.SITE_PASSWORD || '';
  if (!password || !safeEqual(password, expected)) {
    return NextResponse.json({ error: 'WRONG_PASSWORD' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: GATE_COOKIE,
    value: await gateToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
