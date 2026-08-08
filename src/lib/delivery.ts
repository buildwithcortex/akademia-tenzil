import type { ApplicationInput } from './validation';
import { getPayloadClient } from './payload';

export type ApplicationPayload = ApplicationInput & {
  source: string;
  ts: string;
};

/**
 * Optional heads-up that an application arrived.
 *
 * Applications are stored in the Applications collection and reviewed at
 * /admin, so this is a convenience only: it must never decide whether a
 * submission succeeded. The caller treats a throw here as non-fatal.
 *
 * Email goes through Payload's own adapter rather than a second Resend client,
 * so there is one place that knows how mail leaves this app and one sender
 * address to keep verified. Configure:
 *
 *   RESEND_API_KEY + EMAIL_FROM   enables email at all (see payload.config.ts)
 *   APPLY_TO_EMAIL                who gets told about new applications
 *
 * Separately, APPLY_WEBHOOK_URL POSTs the raw JSON somewhere, for a Google
 * Sheet or similar. Both, either, or neither.
 */
export async function notify(application: ApplicationPayload): Promise<void> {
  const webhook = process.env.APPLY_WEBHOOK_URL?.trim();
  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.APPLY_WEBHOOK_SECRET
          ? { 'X-Tenzil-Secret': process.env.APPLY_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(application),
    });
    if (!res.ok) {
      throw new Error(`WEBHOOK_${res.status}`);
    }
  }

  const to = process.env.APPLY_TO_EMAIL?.trim();
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM,
  );
  if (!to || !emailConfigured) return;

  const payload = await getPayloadClient();
  await payload.sendEmail({
    to,
    subject: `Aplikim i ri: ${application.emri} (${application.programi})`,
    text: asText(application),
  });
}

function asText(p: ApplicationPayload): string {
  return [
    `Emri dhe mbiemri: ${p.emri}`,
    `Mosha: ${p.mosha}`,
    `Email: ${p.email}`,
    `Numri i telefonit: ${p.telefoni}`,
    `Programi: ${p.programi}`,
    `Përvoja e mëparshme: ${p.pervoja || '-'}`,
    `Mesazhi: ${p.mesazhi || '-'}`,
    '',
    'Shikoje te paneli: /admin/collections/applications',
    '',
    `Burimi: ${p.source}`,
    `Data: ${p.ts}`,
  ].join('\n');
}
