import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Payload's local API: queries the database in-process, with no HTTP hop.
 *
 * IMPORTANT: local API calls default to `overrideAccess: true`, which skips
 * access control entirely. A public page must therefore pass
 * `overrideAccess: false` AND filter on `_status` explicitly — relying on the
 * collection's access rule alone silently leaks drafts.
 */
export const getPayloadClient = async () => getPayload({ config });

/** Only published articles are ever visible to the public. */
export const PUBLISHED_ONLY = { _status: { equals: 'published' } } as const;

/** Albanian long-form date, e.g. "7 gusht 2026". */
export function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
