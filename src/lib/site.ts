/**
 * Single source of truth for the production origin.
 *
 * OPEN ITEM: the academy has not confirmed a final domain. Set
 * NEXT_PUBLIC_SITE_URL in the deployment environment before launch. It drives
 * metadataBase, the canonical URL, sitemap.xml and robots.txt.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://akademiatenzil.com';
