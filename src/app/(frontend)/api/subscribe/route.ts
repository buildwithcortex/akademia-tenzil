import { NextResponse } from 'next/server';
import { EMAIL_RE, MAX_LEN } from '@/lib/validation';
import { getPayloadClient } from '@/lib/payload';
import { readApplicationState } from '@/lib/applicationState';
import { clientKey, rateLimit } from '@/lib/rateLimit';
import { throttleAddress } from '@/lib/applyThrottle';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function rateLimited(retryAfter: number) {
  return NextResponse.json(
    { error: 'RATE_LIMITED' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}

/**
 * Joins the waitlist that hears when applications reopen.
 *
 * An address already on the list gets the same answer as a new one. Saying
 * "you are already subscribed" would let anyone test whether a given person
 * had signed up.
 */
export async function POST(req: Request) {
  const local = rateLimit(`subscribe:${clientKey(req)}`);
  if (!local.ok) return rateLimited(local.retryAfter);

  let data: { email?: unknown; website?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'BAD_JSON' }, { status: 400 });
  }

  // Honeypot, as on the application form: accept and drop silently.
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email =
    typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (email.length > MAX_LEN.email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { errors: { email: 'Shkruani një email të vlefshëm.' } },
      { status: 400 },
    );
  }

  const payload = await getPayloadClient();

  // The page showing this form can be a few minutes stale. If applications
  // have reopened since, the honest answer is "go and apply".
  if ((await readApplicationState(payload)).open) {
    return NextResponse.json({ error: 'OPEN' }, { status: 409 });
  }

  try {
    const shared = await throttleAddress(payload, clientKey(req), 'subscribe');
    if (!shared.ok) return rateLimited(shared.retryAfter);
  } catch (err) {
    console.error('[subscribe] limit check failed, letting it through:', err);
  }

  const onList = async () =>
    (
      await payload.count({
        collection: 'subscribers',
        where: { email: { equals: email } },
        overrideAccess: true,
      })
    ).totalDocs > 0;

  try {
    if (!(await onList())) {
      await payload.create({
        collection: 'subscribers',
        data: { email, source: 'akademiatenzil.web' },
        overrideAccess: true,
      });
    }
  } catch (err) {
    // Two requests for the same address can race past the check; the unique
    // index rejects the second, and for the visitor that is still a success.
    if (!(await onList().catch(() => false))) {
      console.error('[subscribe] could not save subscriber:', err);
      return NextResponse.json({ error: 'SAVE_FAILED' }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
