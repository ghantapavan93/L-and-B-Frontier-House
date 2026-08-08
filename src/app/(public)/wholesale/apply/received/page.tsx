import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/auth/session'
import { getBuyerProfile } from '@/data/buyer-repository'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'

export const metadata: Metadata = {
  title: 'Application received',
  robots: { index: false },
}

/**
 * APPLICATION RECEIVED — a designed state, not a redirect into a dashboard.
 *
 * The moment after submission is where the current business goes silent. This page says
 * exactly what happens next, in order, with the one verified timing fact — and then gives
 * the applicant something to do with the wait. Visited without a session (bookmark, shared
 * link) it degrades to the same explanation, unpersonalised.
 */
export default async function ApplicationReceivedPage() {
  const session = await getSession()
  const profile = session.kind === 'buyer' ? await getBuyerProfile(session) : null

  return (
    <div className="container section stack">
      <p className="eyebrow">Trade access</p>
      <h1>{profile ? `Received, ${profile.retailerName}.` : 'Application received.'}</h1>
      <p className="lede">Here is exactly what happens now.</p>

      <ol className="received-steps">
        <li>
          <h2>We verify your sales tax ID</h2>
          <p className="meta">
            A person checks your resale credential. The value stays on your account and is never
            shown publicly.
          </p>
        </li>
        <li>
          <h2>You&rsquo;re approved — {VERIFIED_APPROVAL_TIMING}</h2>
          <p className="meta">
            We email {profile ? profile.email : 'the address you gave us'} the moment your
            account opens.
          </p>
        </li>
        <li>
          <h2>The line opens to you</h2>
          <p className="meta">
            Your pricing and pack breakdowns on every style, online ordering, one-action
            reorders and the assortment builder.
          </p>
        </li>
      </ol>

      <div className="cluster">
        <Link href="/trade" className="button">
          Your account
        </Link>
        <Link href="/new-arrivals" className="button button--secondary">
          Browse the drop while you wait
        </Link>
      </div>
    </div>
  )
}
