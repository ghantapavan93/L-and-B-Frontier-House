import type { Metadata } from 'next'
import Link from 'next/link'
import { signInAction } from '@/auth/actions'
import { BUYER_RECORDS, FIXTURE_PASSWORD } from '@/fixtures/buyers'
import { ErrorNotice } from '@/ui/notices'

export const metadata: Metadata = {
  title: 'Buyer sign in',
  robots: { index: false },
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'That email and password do not match an account.',
  missing: 'Enter both your email and your password.',
  required: 'Sign in to continue to that page.',
}

/**
 * BUYER SIGN IN.
 *
 * The failure message deliberately does not distinguish an unknown account from a wrong
 * password, and it never states an account's approval status — that would let an
 * unauthenticated visitor enumerate the buyer list.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const error = typeof params['error'] === 'string' ? params['error'] : undefined
  const next = typeof params['next'] === 'string' ? params['next'] : '/trade'

  return (
    <div className="container section">
      <p className="eyebrow">Wholesale</p>
      <h1>Buyer sign in</h1>
      <p>Sign in to see your pricing, pack breakdowns and order history.</p>

      {error && ERROR_MESSAGES[error] ? (
        <ErrorNotice>
          <p>{ERROR_MESSAGES[error]}</p>
        </ErrorNotice>
      ) : null}

      <form action={signInAction} className="stack" style={{ marginTop: 'var(--space-6)' }}>
        <input type="hidden" name="next" value={next} />

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="button">
          Sign in
        </button>
      </form>

      <p style={{ marginTop: 'var(--space-5)' }}>
        No account yet? <Link href="/wholesale/apply">Apply for one</Link> — approval typically
        takes less than one business day.
      </p>

      {/*
        Development fixture accounts. These exist because no demo buyer account has been
        provisioned yet, and the authorised path is the most important unseen surface in the
        project. This block is removed when a real identity provider is wired in.
      */}
      <aside
        className="notice notice--fixture"
        aria-labelledby="fixture-accounts-title"
        style={{ marginTop: 'var(--space-6)' }}
      >
        <p className="notice__title" id="fixture-accounts-title">
          Development fixture accounts — not real accounts
        </p>
        <div className="table-scroll">
          <table>
            <caption>Fixture sign-ins, password {FIXTURE_PASSWORD}</caption>
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">State it demonstrates</th>
              </tr>
            </thead>
            <tbody>
              {BUYER_RECORDS.map((buyer) => (
                <tr key={buyer.id}>
                  <th scope="row">{buyer.email}</th>
                  <td>{buyer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  )
}
