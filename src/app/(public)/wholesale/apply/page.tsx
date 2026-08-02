import type { Metadata } from 'next'
import { applyAction } from '@/auth/actions'
import { VERIFIED_APPROVAL_TIMING } from '@/domain/buyer'
import { ErrorNotice, FixtureNotice } from '@/ui/notices'

export const metadata: Metadata = {
  title: 'Apply for a wholesale account',
  description: 'Apply to buy Lucky & Blessed wholesale. A sales tax ID is required.',
  robots: { index: false },
}

/**
 * BUYER APPLICATION.
 *
 * A plain server-action form: it submits and works with JavaScript disabled. Errors travel
 * as a search parameter so the no-JS path shows the same message as the enhanced one.
 *
 * The gate reads as an invitation, not a failure, and states the verified approval timing.
 *
 * The sales tax ID is transmitted to the server and stored on the buyer record; its value
 * is never rendered back, never logged, and never leaves the server (docs/production/06).
 */
export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const error = typeof params['error'] === 'string' ? params['error'] : undefined

  return (
    <div className="container section">
      <p className="eyebrow">Wholesale</p>
      <h1>Apply for an account</h1>
      <p>
        Hey y&apos;all. Tell us where you sell and give us your sales tax ID, and we will get
        you approved — {VERIFIED_APPROVAL_TIMING}.
      </p>

      {error === 'missing' ? (
        <ErrorNotice>
          <p>Every field below is required. Please complete the form and submit again.</p>
        </ErrorNotice>
      ) : null}

      <form action={applyAction} className="stack" style={{ marginTop: 'var(--space-6)' }}>
        <fieldset>
          <legend>Your store</legend>

          <div className="field">
            <label htmlFor="retailerName">Store name</label>
            <input
              id="retailerName"
              name="retailerName"
              type="text"
              required
              autoComplete="organization"
            />
          </div>

          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" type="text" required autoComplete="address-level2" />
          </div>

          <div className="field">
            <label htmlFor="region">State</label>
            <input
              id="region"
              name="region"
              type="text"
              required
              autoComplete="address-level1"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Verification</legend>

          <div className="field">
            <label htmlFor="salesTaxId">Sales tax ID</label>
            {/* The hint is associated with the field, not merely adjacent to it: without
                aria-describedby a screen reader announces the label and nothing else. */}
            <input
              id="salesTaxId"
              name="salesTaxId"
              type="text"
              required
              aria-describedby="tax-hint"
            />
            <span className="field__hint" id="tax-hint">
              Your state resale certificate number. We use it to verify you are a retailer. It
              is stored on your account and is never shown publicly.
            </span>
          </div>
        </fieldset>

        <fieldset>
          <legend>How we reach you</legend>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
        </fieldset>

        <button type="submit" className="button">
          Submit application
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FixtureNotice />
      </div>
    </div>
  )
}
