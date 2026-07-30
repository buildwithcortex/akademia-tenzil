import type { NextConfig } from 'next';

/**
 * `/support` and `/privacy-policy` are registered with App Store Connect as the
 * iOS app's Support URL and Privacy Policy URL. They are now real pages under
 * src/app, so no rewrite is needed, but the paths must never change.
 *
 * `/coming-soon` is the retired holding page: no longer the front door, still
 * deployed and reachable, served straight from public/.
 */
const nextConfig: NextConfig = {
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
};

export default nextConfig;
