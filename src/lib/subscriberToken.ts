import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signs a subscriber id for the unsubscribe link.
 *
 * The link carries the id and this signature, never the email address, so
 * nothing personal ends up in a URL, server log, or browser history, and the
 * ids cannot be walked to unsubscribe other people.
 */
export function subscriberToken(id: number | string): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET ?? '')
    .update(`unsubscribe:${id}`)
    .digest('base64url');
}

export function validSubscriberToken(
  id: number | string,
  token: string,
): boolean {
  const expected = Buffer.from(subscriberToken(id));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
