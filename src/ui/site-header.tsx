import Link from 'next/link'
import { signOutAction } from '@/auth/actions'
import { navigableCategories } from '@/domain/taxonomy'
import type { Session } from '@/domain/session'

/**
 * V3 centres the wordmark and keeps the chrome quiet. This is that arrangement: wordmark
 * on its own line, primary navigation centred beneath it in letterspaced small caps, account
 * links in a lighter secondary row.
 *
 * Navigation is generated from the typed taxonomy config, so the owner-approved taxonomy
 * replaces these links without touching this component.
 *
 * SESSION-INDEPENDENT BY DEFAULT. Public routes render this with no session, which keeps
 * every public response byte-identical for every visitor — a CDN cannot serve one buyer's
 * chrome to another if the chrome never varied. The account link points at /trade, which is
 * dynamic and resolves per session.
 */
export function SiteHeader({ session }: { session?: Session }) {
  const categories = navigableCategories()
  const signedIn = session?.kind === 'buyer'
  const approved = session?.kind === 'buyer' && session.status === 'approved'

  return (
    <header className="site-header">
      <div className="container site-header__rows">
        <Link href="/" className="site-header__wordmark">
          Lucky &amp; Blessed
        </Link>

        <nav className="site-nav" aria-label="Primary">
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
