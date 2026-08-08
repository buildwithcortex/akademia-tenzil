/**
 * Shared secret for the work-in-progress gate.
 *
 * The cookie never holds the password. It holds an HMAC derived from
 * PAYLOAD_SECRET, so a stolen cookie reveals nothing and changing
 * PAYLOAD_SECRET invalidates every existing session at once.
 *
 * Uses Web Crypto rather than node:crypto so the same function works in the
 * proxy (edge runtime) and in the route handler (node).
 */

export const GATE_COOKIE = 'tz-gate';

/** Bumping this string logs everyone out. */
const GATE_PAYLOAD = 'tz-gate-v1';

export async function gateToken(): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET || '';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(GATE_PAYLOAD),
  );
  return Buffer.from(new Uint8Array(sig)).toString('base64url');
}

/** Constant-time-ish comparison, so a wrong cookie cannot be probed by timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * The gate is opt-in. With no SITE_PASSWORD set it stays open, so a deploy that
 * forgets the variable serves the site normally rather than locking everyone
 * out, including the people who would need to fix it.
 */
export function gateEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD);
}
