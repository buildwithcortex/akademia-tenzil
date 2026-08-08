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

type MediaLike = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  sizes?: {
    [k: string]: { url?: string | null; width?: number | null; height?: number | null } | undefined;
  } | null;
};

/**
 * Pick a resized variant, largest-first from the names given, falling back to
 * the original.
 *
 * This matters more than it looks: Payload generates thumbnail/card/wide on
 * upload, but rendering `media.url` serves the untouched original. A 2048px
 * 6 MB PNG dropped into an article was being sent in full as a list thumbnail.
 */
export function pickImage(media: MediaLike | null | undefined, prefer: string[]) {
  if (!media) return null;
  for (const name of prefer) {
    const size = media.sizes?.[name];
    if (size?.url) {
      return {
        url: size.url,
        width: size.width ?? media.width ?? 1200,
        height: size.height ?? media.height ?? 800,
        alt: media.alt ?? '',
      };
    }
  }
  if (!media.url) return null;
  return {
    url: media.url,
    width: media.width ?? 1200,
    height: media.height ?? 800,
    alt: media.alt ?? '',
  };
}

/** Albanian long-form date, e.g. "7 gusht 2026". */
export function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
