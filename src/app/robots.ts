import type { MetadataRoute } from 'next'

/**
 * robots.txt is a courtesy, never a control. The authorisation layer is the control.
 *
 * These disallow rules exist so a well-behaved crawler does not waste requests on routes it
 * will be denied anyway — not to keep restricted data secret. Nothing here is load-bearing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/trade', '/trade/', '/sign-in', '/wholesale/apply'],
      },
    ],
  }
}
