/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

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
