import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getPayloadClient, PUBLISHED_ONLY } from '@/lib/payload';
import type { Article } from '@/payload-types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}/artikuj`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Carried over from the app's site. These two are the App Store Connect URLs.
    {
      url: `${SITE_URL}/support`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // A sitemap must never advertise a draft.
  let articles: MetadataRoute.Sitemap = [];
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'articles',
      overrideAccess: false,
      where: PUBLISHED_ONLY,
      limit: 500,
      sort: '-publishedAt',
    });
    articles = (docs as Article[])
      .filter((a) => Boolean(a.slug))
      .map((a) => ({
        url: `${SITE_URL}/artikuj/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : lastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      }));
  } catch {
    // If the database is unreachable at build time, still ship a valid sitemap
    // of the static routes rather than failing the whole build.
  }

  return [...staticEntries, ...articles];
}
