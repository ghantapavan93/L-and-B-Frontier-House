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
        disallow: [
          '/trade',
          '/trade/',
          '/sign-in',
          '/wholesale/apply',
          /*
            Facet permutations. Seven orthogonal facets generate thousands of URL
            combinations of the same 22 (eventually 235+) products — crawl noise that
            dilutes the clean pages, and the correct posture per the strongest PDP
            reference: disallow every facet query, let curated combinations be plain
            links. The clean category and product URLs remain fully open. A courtesy,
            never a control: the authorisation layer is the control, and no restricted
            value is in any URL to begin with.
          */
          '/shop/*?*',
          '/search?*',
          '/new-arrivals?*',
          '/find-your-denim?*',
        ],
      },
    ],
  }
}
