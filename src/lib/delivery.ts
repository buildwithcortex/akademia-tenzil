import type { ApplicationInput } from './validation';

export type ApplicationPayload = ApplicationInput & {
  source: string;
  ts: string;
};

export class NoEndpointError extends Error {
  code = 'NO_ENDPOINT' as const;
  constructor() {
    super('NO_ENDPOINT');
  }
}

/**
 * OPEN ITEM: where applications are delivered is still the academy's call.
 *
 * Rather than pick for them, delivery is configured at deploy time. Set ONE of:
 *
 *   RESEND_API_KEY + APPLY_TO_EMAIL [+ APPLY_FROM_EMAIL]
 *       → emails the academy via Resend.
 *
 *   APPLY_WEBHOOK_URL [+ APPLY_WEBHOOK_SECRET]
 *       → POSTs the JSON payload anywhere that accepts a webhook: a Google
 *         Apps Script bound to a Sheet, Airtable/Notion via a proxy, Zapier,
 *         Make, n8n, or your own database endpoint. The secret, if set, is sent
 *         as the `X-Tenzil-Secret` header.
 *
 * With neither configured this throws NO_ENDPOINT and the form shows its error
 * state. That is deliberate: the site must never fake a successful application.
 */
export async function deliver(payload: ApplicationPayload): Promise<void> {
  const webhook = process.env.APPLY_WEBHOOK_URL?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.APPLY_TO_EMAIL?.trim();

  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.APPLY_WEBHOOK_SECRET
          ? { 'X-Tenzil-Secret': process.env.APPLY_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`WEBHOOK_${res.status}`);
    }
    return;
  }

  if (resendKey && to) {
    const from =
      process.env.APPLY_FROM_EMAIL?.trim() || 'Akademia Tenzil <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((a) => a.trim()),
        reply_to: payload.email,
        subject: `Aplikim i ri: ${payload.emri} (${payload.programi})`,
        text: applicationAsText(payload),
      }),
    });
    if (!res.ok) {
      throw new Error(`RESEND_${res.status}`);
    }
    return;
  }

  throw new NoEndpointError();
}

function applicationAsText(p: ApplicationPayload): string {
  return [
    `Emri dhe mbiemri: ${p.emri}`,
    `Mosha: ${p.mosha}`,
    `Email: ${p.email}`,
    `Numri i telefonit: ${p.telefoni}`,
    `Programi: ${p.programi}`,
    `Përvoja e mëparshme: ${p.pervoja || '-'}`,
    `Mesazhi: ${p.mesazhi || '-'}`,
    '',
    `Burimi: ${p.source}`,
    `Data: ${p.ts}`,
  ].join('\n');
}
