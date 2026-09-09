import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

/**
 * `/support` and `/privacy-policy` are registered with App Store Connect as the
 * iOS app's Support URL and Privacy Policy URL. They are now real pages under
 * src/app, so no rewrite is needed, but the paths must never change.
 *
 * `/coming-soon` is the retired holding page: no longer the front door, still
 * deployed and reachable, served straight from public/.
 */
const nextConfig: NextConfig = {
  /**
   * Ship sharp's native libraries inside every serverless function.
   *
   * payload.config imports sharp, so every Payload route (admin, REST, the
   * apply endpoint) loads it at startup. sharp's .node binary dlopens libvips
   * from a sibling @img package, a dependency file tracing cannot see because
   * it is not a JS require. On Vercel that left the binary in the bundle and
   * the library out of it, and every one of those routes answered 500 with
   * "libvips-cpp.so: cannot open shared object file".
   */
  outputFileTracingIncludes: {
    '/*': ['./node_modules/@img/**/*', './node_modules/sharp/**/*'],
  },

  async rewrites() {
    return [{ source: '/coming-soon', destination: '/coming-soon.html' }];
  },

  async redirects() {
    return [
      // Carried over from the previous deployment.
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      // The holding page used to live at /. Send saved links to its new home.
      { source: '/index.html', destination: '/coming-soon', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      // Article images are served from the Supabase Storage bucket.
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withPayload(nextConfig);
