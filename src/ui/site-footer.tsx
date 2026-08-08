import Link from 'next/link'
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
                <Link href="/new-arrivals">New Arrivals</Link>
              </li>
              {navigableCategories().map((category) => (
                <li key={category.slug}>
                  <Link href={`/shop/${category.slug}`}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="eyebrow">Discover</h2>
            <ul className="site-footer__list">
              <li>
                <Link href="/search">Search the line</Link>
              </li>
              <li>
                <Link href="/find-your-denim">Find your denim</Link>
              </li>
              <li>
                <Link href="/size-and-fit/women">Size and fit</Link>
              </li>
              <li>
                <Link href="/warehouse">The Warehouse</Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="eyebrow">Wholesale</h2>
            <ul className="site-footer__list">
              <li>
                <Link href="/wholesale">How wholesale works</Link>
              </li>
              <li>
                <Link href="/wholesale/apply">Apply for an account</Link>
              </li>
              <li>
                <Link href="/sign-in">Buyer sign in</Link>
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
