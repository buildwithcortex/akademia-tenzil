import { NextResponse } from 'next/server';
import { validate, tooLong, type ApplicationInput } from '@/lib/validation';
import { getPayloadClient } from '@/lib/payload';
import { notify } from '@/lib/delivery';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { ok, retryAfter } = rateLimit(clientKey(req));
  if (!ok) {
    return NextResponse.json(
      { error: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

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
    email: data.email!.trim(),
    telefoni: data.telefoni!.trim(),
    programi: data.programi!,
    pervoja: data.pervoja?.trim() || '',
    mesazhi: data.mesazhi?.trim() || '',
    source: 'akademiatenzil.web',
  };

  // Storing the application is the part that must not fail. The collection
  // blocks create for everyone, so this writes with overrideAccess.
  try {
    const payload = await getPayloadClient();
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
