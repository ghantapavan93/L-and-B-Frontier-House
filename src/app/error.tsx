'use client'

import Link from 'next/link'

/**
 * The designed error state.
 *
 * No error message echoes a restricted value: the digest is an opaque identifier and the
 * underlying error is never rendered. Failing to an error page is failing closed — an
 * unauthorised session cannot learn anything from a crash on an authorised route.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main" className="page-main container section" tabIndex={-1}>
      <p className="eyebrow">Something went wrong</p>
      <h1>We hit a snag on our end</h1>
      <p>
        Nothing about your account has changed. Try again, and if it keeps happening let your
        representative know.
      </p>
      {error.digest ? <p className="meta">Reference {error.digest}</p> : null}
      <div className="cluster">
        <button type="button" className="button" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="button button--secondary">
          Go home
        </Link>
      </div>
    </main>
  )
}
