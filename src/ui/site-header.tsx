import Link from 'next/link'
import { signOutAction } from '@/auth/actions'
import { liveProgramming } from '@/content/programming'
import { EDITS } from '@/domain/edits'
import { navigableCategories } from '@/domain/taxonomy'
import type { Session } from '@/domain/session'

/**
 * The glass header, in two arrangements from the same markup:
 *
 * DESKTOP — V3's quiet centred chrome: wordmark, primary navigation in letterspaced small
 * caps, account row beneath. Categories stay flat links — three categories do not justify a
 * mega menu — while DISCOVER and TRADE open as native `<details>` panels: grouped the way
 * the brief's references group them, keyboard-operable, zero JavaScript. The panels carry
 * one line of context per destination, which is the useful part of a mega menu without the
 * novelty.
 *
 * SEARCH is a real GET form posting to /search — a working feature with JavaScript
 * disabled, not a dead field. (Its previous absence was honest; the feature now exists.)
 *
 * MOBILE — V3.1 12A/12F's compact bar: Menu · centred wordmark · Account on ONE row. The
 * menu is a native `<details>` disclosure opening a full-width panel with the same three
 * groups flattened under small-caps labels, search first.
 *
 * SESSION-INDEPENDENT BY DEFAULT: public routes render this with no session, keeping every
 * public response byte-identical for every visitor. The account affordance points at
 * /trade, which resolves per session.
 */
export function SiteHeader({ session }: { session?: Session }) {
  const categories = navigableCategories()
  const signedIn = session?.kind === 'buyer'
  const approved = session?.kind === 'buyer' && session.status === 'approved'
  const market = liveProgramming('market')[0]

  const discoverLinks = [
    { href: '/new-arrivals', label: 'The drop', note: 'Everything new this week' },
    { href: '/find-your-denim', label: 'Find your denim', note: 'Three questions to a fit' },
    { href: '/size-and-fit/women', label: 'Size and fit', note: 'Every measurement, as text' },
    { href: '/warehouse', label: 'The Warehouse', note: 'Every rack, one aisle' },
  ]

  return (
    <header className="site-header">
      <div className="container site-header__rows">
        <div className="site-header__bar">
          <details className="nav-disclosure">
            <summary>Menu</summary>
            <nav className="site-nav nav-disclosure__panel" aria-label="Menu">
              <p className="nav-group-label">Search</p>
              <ul>
                <li>
                  <Link href="/search">Search the line</Link>
                </li>
              </ul>
              <p className="nav-group-label">Shop</p>
              <ul>
                <li>
                  <Link href="/new-arrivals">New Arrivals</Link>
                </li>
                {categories.map((category) => (
                  <li key={`m-${category.slug}`}>
                    <Link href={`/shop/${category.slug}`}>{category.label}</Link>
                  </li>
                ))}
              </ul>
              <p className="nav-group-label">Discover</p>
              <ul>
                {discoverLinks.map((link) => (
                  <li key={`m-${link.href}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                {EDITS.map((edit) => (
                  <li key={`m-edit-${edit.slug}`}>
                    <Link href={`/edit/${edit.slug}`}>{edit.name}</Link>
                  </li>
                ))}
              </ul>
              <p className="nav-group-label">Trade</p>
              <ul>
                <li>
                  <Link href="/wholesale">How wholesale works</Link>
                </li>
                <li>
                  <Link href="/wholesale/apply">Apply for an account</Link>
                </li>
                <li>
                  <Link href="/trade">{signedIn ? 'Your account' : 'Buyer sign in'}</Link>
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
              <details className="nav-drop">
                <summary>Discover</summary>
                <div className="nav-drop__panel">
                  <ul className="nav-drop__list">
                    {discoverLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                        <p className="nav-drop__note">{link.note}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="nav-drop__aside">
                    <p className="nav-group-label">The edits</p>
                    <ul className="nav-drop__list nav-drop__list--plain">
                      {EDITS.map((edit) => (
                        <li key={edit.slug}>
                          <Link href={`/edit/${edit.slug}`}>{edit.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </li>
            <li>
              <details className="nav-drop">
                <summary>Trade</summary>
                <div className="nav-drop__panel">
                  <ul className="nav-drop__list">
                    <li>
                      <Link href="/wholesale">How wholesale works</Link>
                      <p className="nav-drop__note">Tax ID · $50 minimum · prepacks of 6</p>
                    </li>
                    <li>
                      <Link href="/wholesale/apply">Apply for an account</Link>
                      <p className="nav-drop__note">Approved typically within a business day</p>
                    </li>
                    <li>
                      <Link href="/trade">{signedIn ? 'Your account' : 'Buyer sign in'}</Link>
                    </li>
                  </ul>
                  {market ? (
                    <div className="nav-drop__aside">
                      <p className="nav-group-label">In person</p>
                      <p className="nav-drop__note">{market.title}</p>
                      <p className="nav-drop__note">Showroom #13656, Dallas Market Center</p>
                    </div>
                  ) : null}
                </div>
              </details>
            </li>
          </ul>
        </nav>

        <nav className="site-nav site-nav--secondary" aria-label="Account">
          <ul>
            <li>
              <form action="/search" method="get" className="header-search" role="search">
                <label htmlFor="header-search-q" className="visually-hidden">
                  Search the line
                </label>
                <input
                  id="header-search-q"
                  type="search"
                  name="q"
                  placeholder="Search"
                  autoComplete="off"
                />
                <button type="submit" className="button button--quiet button--small">
                  Search
                </button>
              </form>
            </li>
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
