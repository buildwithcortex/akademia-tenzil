import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { resendAdapter } from '@payloadcms/email-resend';
import sharp from 'sharp';

import { Applications } from '@/collections/Applications';
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

/**
 * Runtime and migrations want different Supabase poolers.
 *
 * Serving the site means many short-lived serverless connections, which is what
 * the transaction pooler on :6543 exists for. Migrations are the only thing here
 * that issues DDL, and that wants a real session, so they take DIRECT_URL (the
 * session pooler on :5432) when it is set.
 *
 * The fallback matters: with no DIRECT_URL this returns the runtime URL rather
 * than an empty string, so a deploy that never set it still migrates instead of
 * failing on a blank connection string.
 */
function connectionString(): string {
  const runtime = process.env.DATABASE_URL || '';
  const migrating = process.argv.some((arg) => arg.startsWith('migrate'));
  return migrating ? process.env.DIRECT_URL || runtime : runtime;
}

/**
 * Email is wired only when both a key and a verified sender exist.
 *
 * Without it Payload logs "No email adapter provided" and writes mail to the
 * console, which means a password reset from /admin silently never arrives.
 * The sender domain must be verified in Resend or every send is rejected.
 */
const email =
  process.env.RESEND_API_KEY && process.env.EMAIL_FROM
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM,
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Akademia Tenzil',
      })
    : undefined;

export default buildConfig({
  ...(siteURL ? { serverURL: siteURL, csrf: [siteURL] } : {}),

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Akademia Tenzil',
      icons: [{ url: '/app-icon.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      // Home / view-site / theme toggle, above the collection list.
      beforeNavLinks: ['@/components/admin/AdminNavExtras#AdminNavExtras'],
    },
  },

  // The public site already owns /api (see /api/apply), so Payload's REST API
  // is moved aside rather than relying on Next's static-beats-dynamic ordering.
  routes: {
    api: '/payload-api',
  },

  collections: [Articles, Categories, Media, Applications, Users],

  // Nothing in this app uses GraphQL: the site reads through the local API and
  // the admin uses REST. Left on, it publishes a browsable schema explorer at
  // /payload-api/graphql-playground that advertises every collection and field
  // to anyone who looks. Access control still applied, but there is no reason
  // to expose the surface at all.
  graphQL: {
    disable: true,
  },

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: connectionString(),
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

  ...(email ? { email } : {}),

  plugins: [
    s3Storage({
      collections: {
        media: {
          // Serve straight from the public Supabase bucket rather than
          // proxying every image through /payload-api/media/file/*, which
          // costs a function invocation per request. Article images are
          // public anyway, so there is no access control to preserve.
          disablePayloadAccessControl: true,
          // Required. Left to itself the adapter builds the S3 API URL
          // (/storage/v1/s3/...), which needs a signed request and returns 403
          // in a browser. Supabase serves public objects from a different
          // path, and that is the one an <img> can actually load.
          generateFileURL: ({ filename, prefix }) => {
            const base = (process.env.S3_ENDPOINT || '').replace(
              /\.storage\.supabase\.co\/storage\/v1\/s3\/?$/,
              '.supabase.co/storage/v1/object/public',
            );
            const bucket = process.env.S3_BUCKET || '';
            return [base, bucket, prefix, filename].filter(Boolean).join('/');
          },
        },
      },
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
