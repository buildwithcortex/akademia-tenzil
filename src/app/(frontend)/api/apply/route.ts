import { NextResponse } from 'next/server';
import { validate, tooLong, type ApplicationInput } from '@/lib/validation';
import { getPayloadClient } from '@/lib/payload';
import { readApplicationState } from '@/lib/applicationState';
import { notify } from '@/lib/delivery';
import { clientKey, rateLimit } from '@/lib/rateLimit';
import {
  applicationsForEmail,
  MAX_PER_EMAIL,
  throttleAddress,
} from '@/lib/applyThrottle';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function rateLimited(retryAfter: number) {
  return NextResponse.json(
    { error: 'RATE_LIMITED' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}

export async function POST(req: Request) {
  // First line: free, per instance. Stops a tight loop against one warm
  // function before it costs a database round trip. The real limit is the
  // shared one below.
  const local = rateLimit(clientKey(req));
  if (!local.ok) return rateLimited(local.retryAfter);

  let data: Partial<ApplicationInput> & { website?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'BAD_JSON' }, { status: 400 });
  }

  // Honeypot: a real person never fills this. Accept and drop silently so bots
  // get no signal about which field gave them away.
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  if (tooLong(data)) {
    return NextResponse.json({ error: 'TOO_LONG' }, { status: 413 });
  }

  // Same rules as the client, imported rather than duplicated.
  const errors = validate(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const application = {
    emri: data.emri!.trim(),
    mosha: data.mosha!.trim(),
    gjinia: data.gjinia! as 'mashkull' | 'femer',
    // Lower-cased so the per-email cap cannot be dodged by changing case.
    email: data.email!.trim().toLowerCase(),
    telefoni: data.telefoni!.trim(),
    programi: data.programi!,
    pervoja: data.pervoja?.trim() || '',
    mesazhi: data.mesazhi?.trim() || '',
    source: 'akademiatenzil.web',
  };

  const payload = await getPayloadClient();

  // Closed means closed here too, not just on the page: a hidden form still
  // accepts a hand-written POST unless the server says no.
  if (!(await readApplicationState(payload)).open) {
    return NextResponse.json({ error: 'CLOSED' }, { status: 403 });
  }

  // Shared limits, checked only once the input is valid so junk requests never
  // reach the database. A failure here is logged and lets the request through:
  // if the database is genuinely down the save below fails anyway, and a
  // hiccup in the counter should not turn away a real applicant.
  try {
    const shared = await throttleAddress(payload, clientKey(req));
    if (!shared.ok) return rateLimited(shared.retryAfter);

    if ((await applicationsForEmail(payload, application.email)) >= MAX_PER_EMAIL) {
      return NextResponse.json(
        {
          errors: {
            email: `Me këtë email janë dërguar tashmë ${MAX_PER_EMAIL} aplikime.`,
          },
        },
        { status: 429 },
      );
    }
  } catch (err) {
    console.error('[apply] limit check failed, letting the request through:', err);
  }

  // Storing the application is the part that must not fail. The collection
  // blocks create for everyone, so this writes with overrideAccess.
  try {
    await payload.create({
      collection: 'applications',
      data: { ...application, status: 'i_ri' },
      overrideAccess: true,
    });
  } catch (err) {
    console.error('[apply] could not save application:', err);
    return NextResponse.json({ error: 'SAVE_FAILED' }, { status: 502 });
  }

  // Notification is best-effort. The application is already safely stored, so a
  // missing or broken email provider must never make the applicant think their
  // submission failed.
  try {
    await notify({ ...application, ts: new Date().toISOString() });
  } catch (err) {
    console.error('[apply] saved, but notification failed:', err);
  }

  return NextResponse.json({ ok: true });
}
