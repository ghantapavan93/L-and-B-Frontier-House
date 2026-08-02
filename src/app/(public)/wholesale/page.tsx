import type { Metadata } from 'next'
import Link from 'next/link'
import { officialMediaForSlot } from '@/content/media/official-media'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'
import { EditorialMedia } from '@/ui/product-media'

export const metadata: Metadata = {
  title: 'Wholesale',
  description:
    'Lucky & Blessed sells to approved retailers. Apply with your sales tax ID and see ' +
    'pricing, prepacks and minimums inside your account.',
}

/**
 * PUBLIC WHOLESALE INFORMATION.
 *
 * Terms, minimum and process are public. Prices, pack prices and MOQ are not, and none
 * appears anywhere on this page — not in copy, not in an example, not in a table.
 *
 * The $50 minimum and the prepack-of-6 structure are verified public facts and are stated
 * plainly; the per-unit cost that would let a competitor derive margin is not.
 */
export default function WholesalePage() {
  const banner = officialMediaForSlot('wholesale')

  return (
    <div className="container section">
      <p className="eyebrow">For retailers</p>
      <h1>We are partners in your success.</h1>

      {banner ? (
        <div className="page-banner">
          <EditorialMedia media={banner} priority sizes="100vw" />
        </div>
      ) : null}

      <p className="lede">
        Lucky &amp; Blessed is a manufacturer and designer. We sell to approved retailers, not
        directly to consumers. We own and operate the whole supply chain — textile, design,
        manufacturing, distribution and sales — which is why our fill rate is what it is.
      </p>

      <section className="section" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className="stack">
          <li>
            <strong>Apply with your sales tax ID.</strong> We need a valid resale certificate
            for the state you sell in.
          </li>
          <li>
            <strong>We review it — {VERIFIED_APPROVAL_TIMING}.</strong> You will hear from us
            either way.
          </li>
          <li>
            <strong>Sign in and your pricing appears.</strong> Wholesale cost, suggested retail,
            pack breakdowns and minimums, all in your account.
          </li>
          <li>
            <strong>Build an order and send it.</strong> Reorder the same assortment in one
            action next season.
          </li>
        </ol>
      </section>

      <section className="section" aria-labelledby="terms-heading">
        <h2 id="terms-heading">Ordering terms</h2>
        <dl className="definition-list">
          <dt>Minimum order</dt>
          <dd>$50.</dd>

          <dt>Pack structure</dt>
          <dd>Prepacks of 6. Some styles are open sizing.</dd>

          <dt>Required</dt>
          <dd>A sales tax ID for your state.</dd>

          <dt>Approval time</dt>
          <dd>Typically less than one business day.</dd>

          <dt>Fill rate</dt>
          <dd>100% of orders filled complete.</dd>

          <dt>Processing</dt>
          <dd>2.64 days on average.</dd>
        </dl>
      </section>

      <section className="section" aria-labelledby="market-heading">
        <h2 id="market-heading">Come see the line</h2>
        <p>
          We keep a permanent showroom at #13656, Dallas Market Center. Markets run August 18–21
          and October 20–23, 2026.
        </p>
      </section>

      <div className="cluster">
        <Link href="/wholesale/apply" className="button">
          Apply for an account
        </Link>
        <Link href="/sign-in" className="button button--secondary">
          Buyer sign in
        </Link>
      </div>
    </div>
  )
}
