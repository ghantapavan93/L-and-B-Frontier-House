import Link from 'next/link'
import { signOutAction } from '@/auth/actions'
import { liveProgramming } from '@/content/programming'
import { EDITS } from '@/domain/edits'
import { navigableCategories } from '@/domain/taxonomy'
import type { Session } from '@/domain/session'

/**
 * ONE ROW.
 *
 * This header used to stack four: an announcement, the wordmark, a navigation row that
 * wrapped to two lines at common widths, and a third row carrying an inline search field
 * and an account link. Measured at 1440px it was 244px tall, and the first photograph on a
 * category page began 465px down — so a visitor met a quarter-screen of chrome before they
 * met any clothes. Every reference house spends about 60px there and then hits you with
 * the product.
 *
 * So: wordmark left, navigation centred, actions right, on a single line. Search becomes a
 * link to the search page rather than a field parked in the chrome — the field lives on
 * the page that exists for it, and the header gets its height back.
 *
 * MOBILE keeps the compact three-up bar: Menu · wordmark · Account, with the full
 * navigation in a native `<details>` panel. That was already right and is unchanged.
 *
 * SESSION-INDEPENDENT BY DEFAULT: public routes render this with no session, keeping every
 * public response byte-identical for every visitor.
 */
export function SiteHeader({ session }: { session?: Session }) {
  const categories = navigableCategories()
  const signedIn = session?.kind === 'buyer'
  const approved = session?.kind === 'buyer' && session.status === 'approved'
  const market = liveProgramming('market')[0]

  const discoverLinks = [
    { href: '/new-arrivals', label: 'The drop', note: 'Everything new this week' },
    { href: '/find-your-denim', label: 'Find your denim', note: 'Three questions to a fit' },
    { href: '/fit-passport', label: 'Fit Passport', note: 'The House remembers your fit' },
    { href: '/size-and-fit/women', label: 'Size and fit', note: 'Every measurement, as text' },
    { href: '/warehouse', label: 'The Warehouse', note: 'Every rack, one aisle' },
  ]

  return (
    <header className="site-header">
      <div className="site-header__row">
        {/* MOBILE ONLY — the disclosure that carries everything below. */}
        <details className="nav-disclosure">
          <summary>Menu</summary>
          <nav className="site-nav nav-disclosure__panel" aria-label="Menu">
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
              <li>
                <Link href="/mens" className="site-nav__demo">
                  Men&rsquo;s
                  <span className="site-nav__demo-tag">Demo</span>
                </Link>
              </li>
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

        {/* DESKTOP — the one navigation row, centred between wordmark and actions. */}
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
              <Link href="/mens" className="site-nav__demo">
                Men&rsquo;s
                <span className="site-nav__demo-tag">Demo</span>
              </Link>
            </li>
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

        {/*
          Actions, as compact labels rather than a field and a row of links. Search is a
          link to the page that owns the field — parking an input in the chrome cost more
          height than the feature was worth there.
        */}
        {/* A labelled landmark, not a bare div: these are navigation links, and a screen
            reader user jumping by landmark should find the account group. */}
        <nav className="site-header__actions" aria-label="Account">
          <Link href="/search" className="site-header__action">
            Search
          </Link>
          {approved ? (
            <Link href="/trade/order" className="site-header__action">
              Order
            </Link>
          ) : null}
          {/* "Account", not "Buyer account": at 320px the longer label pushed the row
              65px past the viewport. The destination explains itself on arrival. */}
          <Link href="/trade" className="site-header__action site-header__action--account">
            Account
          </Link>
          {signedIn ? (
            <form action={signOutAction}>
              <button type="submit" className="site-header__action">
                Sign out
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
