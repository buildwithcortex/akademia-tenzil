import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The retired holding page stays reachable but should not be indexed
      // alongside the real homepage.
      disallow: ['/api/', '/coming-soon'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
