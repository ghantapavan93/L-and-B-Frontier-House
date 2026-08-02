import Link from 'next/link'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'
import type { BuyerProfile } from '@/domain/buyer'

/**
 * The states between applying and ordering.
 *
 * The pending state matters more than it appears: it is the first thing a prospective
 * retailer sees after applying, and the gate is required to read as an invitation rather
 * than a failure. None of these states is ever a dead end.
 */
export function BuyerStatusPanel({ profile }: { profile: BuyerProfile }) {
  if (profile.status === 'pending') {
    return (
      <section className="gate stack" aria-labelledby="status-heading">
        <h2 id="status-heading">We have your application</h2>
        <p>
          Thanks for applying, {profile.retailerName}. We received it on {profile.appliedAt} and
          we are checking your resale certificate now. Approval {VERIFIED_APPROVAL_TIMING} — we
          will email you either way.
        </p>
        <p className="meta">
          In the meantime, everything in the line is browsable. Your pricing, pack breakdowns
          and ordering appear here the moment you are approved.
        </p>
        <div className="cluster">
          <Link href="/new-arrivals" className="button button--secondary">
            Browse new arrivals
          </Link>
        </div>
      </section>
    )
  }

  if (profile.status === 'rejected') {
    return (
      <section className="gate stack" aria-labelledby="status-heading">
        <h2 id="status-heading">We could not approve this application</h2>
        <p>{profile.statusNote ?? 'We were not able to verify this application.'}</p>
        <p className="meta">
          This is not final. Send us an updated resale certificate and we will look again.
        </p>
        <div className="cluster">
          <Link href="/wholesale/apply" className="button">
            Submit an updated application
          </Link>
          <Link href="/wholesale" className="button button--secondary">
            How wholesale works
          </Link>
        </div>
      </section>
    )
  }

  if (profile.status === 'suspended') {
    return (
      <section className="gate stack" aria-labelledby="status-heading">
        <h2 id="status-heading">Ordering is paused on this account</h2>
        <p>{profile.statusNote ?? 'This account is on hold.'}</p>
        <p className="meta">
          Your order history stays available. Contact your representative to restore ordering.
        </p>
        <div className="cluster">
          <Link href="/trade/orders" className="button button--secondary">
            View order history
          </Link>
        </div>
      </section>
    )
  }

  return null
}
