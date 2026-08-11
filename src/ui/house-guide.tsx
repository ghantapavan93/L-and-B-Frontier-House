import Link from 'next/link'

/**
 * HOUSE GUIDE — the bottom-right help entry, honestly.
 *
 * The live business runs a chat bubble there, so the slot is proven for this audience. What
 * this build will not do is fake the assistant behind it: no bot exists, and a glowing "AI"
 * launcher over a contact form is a lie in the place trust matters most. So the Guide is a
 * native `<details>` panel — zero JavaScript, keyboard-operable — carrying the answers a
 * buyer actually asks for (fit, sizing, wholesale, application) plus the verified, human
 * ways to reach the business. When a staffed channel or real assistant exists, it mounts
 * here without moving the furniture.
 *
 * Contact details are VERIFIED from the business's own site (2026-08-07): email, phone,
 * showroom. No response-time promise is made — none is verified.
 */
export function HouseGuide() {
  return (
    <details className="house-guide">
      {/* The name lives on the control itself, so the visible word can be dropped on a
          phone without the button ever losing its accessible name. */}
      <summary aria-label="House Guide">
        <span aria-hidden="true" className="house-guide__mark">
          ?
        </span>
        {/* Dropped on a phone so the closed chip stops covering content. */}
        <span className="house-guide__label">House Guide</span>
      </summary>
      <div className="house-guide__panel">
        <p className="eyebrow">House Guide</p>
        <p className="meta">Quick answers first. A person after that — never a bot.</p>

        <p className="nav-group-label">Ask it plainly</p>
        {/* Honest presets: each is a real search the engine can already answer. */}
        <ul className="house-guide__list">
          <li>
            <Link href="/search?q=dark+bootcut">&ldquo;Dark bootcut&rdquo;</Link>
          </li>
          <li>
            <Link href="/search?q=fringe">&ldquo;Something with fringe&rdquo;</Link>
          </li>
          <li>
            <Link href="/search?q=pre-order">&ldquo;What&rsquo;s on pre-order?&rdquo;</Link>
          </li>
        </ul>

        <p className="nav-group-label">Find it</p>
        <ul className="house-guide__list">
          <li>
            <Link href="/search">Search the line</Link>
          </li>
          <li>
            <Link href="/find-your-denim">Find your denim</Link>
          </li>
          <li>
            <Link href="/fit-passport">Fit Passport — the House remembers</Link>
          </li>
          <li>
            <Link href="/size-and-fit/women">Size and fit</Link>
          </li>
        </ul>

        <p className="nav-group-label">Wholesale</p>
        <ul className="house-guide__list">
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

        <p className="nav-group-label">Talk to us</p>
        <ul className="house-guide__list">
          <li>
            <a href="mailto:customerservice@landbapparel.com">
              customerservice@landbapparel.com
            </a>
          </li>
          <li>
            <a href="tel:+12148501109">214-850-1109</a>
          </li>
          <li>Showroom #13656, Dallas Market Center</li>
        </ul>
      </div>
    </details>
  )
}
