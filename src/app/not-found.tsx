import Link from 'next/link'
import { navigableCategories } from '@/domain/taxonomy'
import { SiteFooter } from '@/ui/site-footer'
import { SiteHeader } from '@/ui/site-header'

/**
 * The designed 404.
 *
 * It renders its own chrome because a root not-found sits outside the route groups. That is
 * deliberate: this boundary is the one Next server-renders into the initial HTML, so it is
 * the one that survives with JavaScript disabled.
 *
 * Unknown product and category slugs reach here rather than a segment boundary, because
 * those routes declare `dynamicParams = false` — see the note on each page.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main container section" tabIndex={-1}>
        <p className="eyebrow">404</p>
        <h1>We could not find that page</h1>
        <p>
          The link may be old, or the style may have sold through. Here is where to pick the
          trail back up.
        </p>
        <ul className="cluster" style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link href="/" className="button button--secondary">
              Home
            </Link>
          </li>
          <li>
            <Link href="/new-arrivals" className="button button--secondary">
              New arrivals
            </Link>
          </li>
          {navigableCategories().map((category) => (
            <li key={category.slug}>
              <Link href={`/shop/${category.slug}`} className="button button--secondary">
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  )
}
