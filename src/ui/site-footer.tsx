import Link from 'next/link'
import { BuyNowPayLater } from '@/ui/payment-methods'
import { navigableCategories } from '@/domain/taxonomy'

/**
 * Dark footer with the wordmark centred, per V3.
 *
 * Every figure below is a VERIFIED FACT from docs/brand-research/00_BRAND_TRUTH.md, stated
 * exactly and never rounded up. These operational numbers are true, differentiating, and
 * currently surfaced nowhere on the brand's own site.
 *
 * The copyright year is generated. The design corpus carries a stale © 2024 throughout.
 */
/**
 * `prefetch={false}` on every footer link, and it is a budget decision, not a taste.
 *
 * The footer is on every page and links every route. Next prefetches a static route's
 * full RSC payload the moment its link scrolls into view, so reaching the bottom of ANY
 * page on a phone fetched eleven pages nobody had tapped — 453 KB, 109 KB of it the men's
 * demonstration — against a 1.5 MB shop-surface budget. The footer is a directory; a
 * directory is read, not pre-loaded. The paths that sell — product cards, categories, the
 * drop, the wholesale gate — keep their prefetch where they appear in the page body.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="site-footer__wordmark">Lucky &amp; Blessed</p>

        <div className="site-footer__grid">
          <section>
            <h2 className="eyebrow">Shop</h2>
            <ul className="site-footer__list">
              <li>
                <Link prefetch={false} href="/new-arrivals">
                  New Arrivals
                </Link>
              </li>
              {navigableCategories().map((category) => (
                <li key={category.slug}>
                  <Link prefetch={false} href={`/shop/${category.slug}`}>
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="eyebrow">Discover</h2>
            <ul className="site-footer__list">
              <li>
                <Link prefetch={false} href="/search">
                  Search the line
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/find-your-denim">
                  Find your denim
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/fit-passport">
                  Fit Passport
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/mens">
                  Men&rsquo;s — the demonstration
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/size-and-fit/women">
                  Size and fit
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/warehouse">
                  The Warehouse
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="eyebrow">Wholesale</h2>
            <ul className="site-footer__list">
              <li>
                <Link prefetch={false} href="/wholesale">
                  How wholesale works
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/wholesale/apply">
                  Apply for an account
                </Link>
              </li>
              <li>
                <Link prefetch={false} href="/sign-in">
                  Buyer sign in
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="eyebrow">How we ship</h2>
            <p className="meta">
              100% order fill rate. 2.64-day average processing. Orders placed by 5pm CST ship
              the same or next business day.
            </p>
          </section>

          <section>
            <h2 className="eyebrow">Where to find us</h2>
            <p className="meta">
              Permanent showroom #13656, Dallas Market Center.
              <br />
              Markets: August 18–21 and October 20–23, 2026.
            </p>
            <p className="meta">
              <a href="mailto:customerservice@landbapparel.com">
                customerservice@landbapparel.com
              </a>
              <br />
              <a href="tel:+12148501109">214-850-1109</a>
            </p>
          </section>
        </div>

        {/* The live site's footer carries this as a JPEG with no alt (S-20). Ours is text
            and a list, with the marks as images that say their names. */}
        <BuyNowPayLater />

        <div className="site-footer__colophon">
          <p className="meta">
            © {year} Lucky &amp; Blessed. We are a manufacturer and designer selling to approved
            retailers.
          </p>
        </div>
      </div>
    </footer>
  )
}
