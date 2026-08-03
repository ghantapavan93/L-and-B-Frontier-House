import Link from 'next/link'
import { signOutAction } from '@/auth/actions'
import { navigableCategories } from '@/domain/taxonomy'
import type { Session } from '@/domain/session'

/**
 * The glass header, in two arrangements from the same markup:
 *
 * DESKTOP — V3's quiet centred chrome: wordmark, primary navigation in letterspaced small
 * caps, account row beneath.
 *
 * MOBILE — V3.1 12A/12F's compact bar: Menu · centred wordmark · Account on ONE row. The
 * menu is a native `<details>` disclosure — keyboard-operable, zero JavaScript — opening a
 * full-width panel under the bar. Search is deliberately absent: no search feature exists
 * yet and a dead field would be a lie (recorded in the gap map). A bottom tab bar is
 * deferred for the same honesty — four destinations do not justify one.
 *
 * SESSION-INDEPENDENT BY DEFAULT: public routes render this with no session, keeping every
 * public response byte-identical for every visitor. The account affordance points at
 * /trade, which resolves per session.
 */
export function SiteHeader({ session }: { session?: Session }) {
  const categories = navigableCategories()
  const signedIn = session?.kind === 'buyer'
  const approved = session?.kind === 'buyer' && session.status === 'approved'

  const primaryLinks = (
    <ul>
      <li>
        <Link href="/new-arrivals">New Arrivals</Link>
      </li>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`/shop/${category.slug}`}>{category.label}</Link>
        </li>
      ))}
      <li>
        <Link href="/wholesale">Wholesale</Link>
      </li>
    </ul>
  )

  return (
    <header className="site-header">
      <div className="container site-header__rows">
        <div className="site-header__bar">
          <details className="nav-disclosure">
            <summary>Menu</summary>
            <nav className="site-nav nav-disclosure__panel" aria-label="Menu">
              <ul>
                <li>
                  <Link href="/new-arrivals">New Arrivals</Link>
                </li>
                {categories.map((category) => (
                  <li key={`m-${category.slug}`}>
                    <Link href={`/shop/${category.slug}`}>{category.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/wholesale">Wholesale</Link>
                </li>
                <li>
                  <Link href="/trade">{signedIn ? 'Your account' : 'Buyer account'}</Link>
                </li>
              </ul>
            </nav>
          </details>

          <Link href="/" className="site-header__wordmark">
            Lucky &amp; Blessed
          </Link>

          <Link href="/trade" className="site-header__account-link">
            {approved ? 'Order' : 'Account'}
          </Link>
        </div>

        <nav className="site-nav site-nav--primary" aria-label="Primary">
          {primaryLinks}
        </nav>

        <nav className="site-nav site-nav--secondary" aria-label="Account">
          <ul>
            {approved ? (
              <li>
                <Link href="/trade/order">Order</Link>
              </li>
            ) : null}
            {signedIn ? (
              <>
                <li>
                  <Link href="/trade">Your account</Link>
                </li>
                <li>
                  <form action={signOutAction}>
                    <button type="submit" className="button button--quiet button--small">
                      Sign out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <li>
                <Link href="/trade">Buyer account</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
