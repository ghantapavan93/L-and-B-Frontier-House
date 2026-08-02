import { FIXTURE_NOTICE, FIXTURE_NOTICE_DETAIL } from '@/fixtures/notice'

/**
 * The fixture notice is rendered wherever fixture data is shown. It is deliberately
 * unmissable: a placeholder that can pass as real is the mechanism by which unverified
 * claims ship.
 */
export function FixtureNotice({ detail = true }: { detail?: boolean }) {
  return (
    <aside className="notice notice--fixture" aria-labelledby="fixture-notice-title">
      <p className="notice__title" id="fixture-notice-title">
        {FIXTURE_NOTICE}
      </p>
      {detail ? <p className="meta">{FIXTURE_NOTICE_DETAIL}</p> : null}
    </aside>
  )
}

export function ErrorNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice notice--error" role="alert">
      {children}
    </div>
  )
}

export function StateBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="state-block">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
