import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { gateEnabled } from '@/lib/gate';

export default function robots(): MetadataRoute.Robots {
  // While the work-in-progress gate is up there is nothing public worth
  // indexing, and an indexed password screen is worse than no listing at all.
  if (gateEnabled()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // The CMS and the API behind it. Nothing here is for readers, and a
        // crawler only spends its budget on pages that answer with a login.
        '/admin',
        '/payload-api/',
        '/api/',
        // The retired holding page stays reachable but should not be indexed
        // alongside the real homepage. It is a file in public/, so its real URL
        // keeps the extension and the old '/coming-soon' matched nothing.
        '/coming-soon.html',
      ],
      // /hyrje is deliberately not listed. It already carries a noindex tag,
      // and a crawler blocked here would never fetch the page to read it.
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
