/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The frontier flag is a BUILD-TIME boundary (public routes are prerendered), so the
  // flag-off structural test builds into its own dist and boots that. See
  // tests/structural/07-frontier-experience.test.ts.
  distDir: process.env.LB_DIST_DIR ?? '.next',

  // The permission boundary is enforced per-request in `src/auth`. These headers are
  // defence in depth, not the control. See docs/production/08.
  async headers() {
    return [
      {
        // Every authorised surface. Never CDN-cached, never indexed.
        source: '/trade/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Vary', value: 'Cookie' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
