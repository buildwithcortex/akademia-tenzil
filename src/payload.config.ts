import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';

import { Articles } from '@/collections/Articles';
import { Categories } from '@/collections/Categories';
import { Media } from '@/collections/Media';
import { Users } from '@/collections/Users';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Only pin serverURL when the real origin is actually known.
 *
 * Payload's CSRF protection compares the browser's origin against serverURL
 * and the csrf allowlist. Hardcoding a localhost fallback breaks every write
 * with "You are not allowed to perform this action" the moment the dev server
 * picks a different port, which it does whenever 3000 is taken. Left unset,
 * Payload infers the origin from the request, which is correct in dev.
 */
const siteURL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

export default buildConfig({
  ...(siteURL ? { serverURL: siteURL, csrf: [siteURL] } : {}),

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Akademia Tenzil',
    },
  },

  // The public site already owns /api (see /api/apply), so Payload's REST API
  // is moved aside rather than relying on Next's static-beats-dynamic ordering.
  routes: {
    api: '/payload-api',
  },

  collections: [Articles, Categories, Media, Users],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Keep Payload's tables out of `public`. Supabase's Data API exposes the
    // public schema to the anon role, and the users table holds password
    // hashes, so it must not be reachable that way.
    schemaName: 'payload',
    migrationDir: path.resolve(dirname, 'migrations'),
    // Never let the adapter silently alter a live schema. Changes go through
    // an explicit, reviewable migration.
    push: false,
  }),

  sharp,

  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      acl: 'public-read',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        // Supabase's S3-compatible endpoint is path-style, not virtual-host.
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
});
