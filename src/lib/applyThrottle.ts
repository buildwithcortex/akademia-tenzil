import { createHash } from 'node:crypto';
import { sql } from '@payloadcms/db-postgres';
import type { Payload } from 'payload';

/**
 * Flood protection for the public application form, kept in Postgres.
 *
 * The in-memory limiter in rateLimit.ts only ever sees one warm serverless
 * instance, so on Vercel a flood spread across instances sails past it. This
 * counter lives in the same database as the applications, so every instance
 * sees the same numbers.
 *
 * Two limits:
 *   - per address (a one-way hash of it): MAX_PER_WINDOW submissions per hour
 *   - per email: MAX_PER_EMAIL applications, ever
 *
 * The address is never stored. Only a SHA-256 of address + PAYLOAD_SECRET is,
 * and rows older than the window are swept on the next new window, so the
 * table holds a few dozen short-lived hashes at most. The privacy policy
 * describes exactly this.
 */

const WINDOW_SECONDS = 60 * 60;
export const MAX_PER_WINDOW = 5;
export const MAX_PER_EMAIL = 5;

type ThrottleRow = { hits: number; retry_after: number };

function hashAddress(address: string): string {
  return createHash('sha256')
    .update(`${address}:${process.env.PAYLOAD_SECRET ?? ''}`)
    .digest('hex');
}

/**
 * Records one attempt from `address` and says whether it is still within the
 * hourly allowance. One atomic upsert, so two simultaneous submissions cannot
 * both read the same count and both slip through.
 */
export async function throttleAddress(
  payload: Payload,
  address: string,
): Promise<{ ok: boolean; retryAfter: number }> {
  const key = hashAddress(address);

  const result = (await payload.db.execute({
    drizzle: payload.db.drizzle,
    sql: sql`
      insert into "payload"."apply_throttle" ("key", "hits", "window_start")
      values (${key}, 1, now())
      on conflict ("key") do update set
        "hits" = case
          when "payload"."apply_throttle"."window_start"
               < now() - make_interval(secs => ${WINDOW_SECONDS})
          then 1
          else "payload"."apply_throttle"."hits" + 1
        end,
        "window_start" = case
          when "payload"."apply_throttle"."window_start"
               < now() - make_interval(secs => ${WINDOW_SECONDS})
          then now()
          else "payload"."apply_throttle"."window_start"
        end
      returning
        "hits",
        greatest(
          0,
          extract(epoch from (
            "window_start" + make_interval(secs => ${WINDOW_SECONDS}) - now()
          ))
        )::int as "retry_after"
    `,
  })) as { rows?: ThrottleRow[] };

  const row = result.rows?.[0];
  if (!row) return { ok: true, retryAfter: 0 };

  // A fresh window is a cheap moment to drop everyone else's expired rows.
  if (row.hits === 1) {
    await payload.db.execute({
      drizzle: payload.db.drizzle,
      sql: sql`
        delete from "payload"."apply_throttle"
        where "window_start" < now() - make_interval(secs => ${WINDOW_SECONDS * 2})
      `,
    });
  }

  return {
    ok: row.hits <= MAX_PER_WINDOW,
    retryAfter: row.hits <= MAX_PER_WINDOW ? 0 : row.retry_after,
  };
}

/** How many applications already exist for this (lower-cased) email. */
export async function applicationsForEmail(
  payload: Payload,
  email: string,
): Promise<number> {
  const { totalDocs } = await payload.count({
    collection: 'applications',
    where: { email: { equals: email } },
    overrideAccess: true,
  });
  return totalDocs;
}
