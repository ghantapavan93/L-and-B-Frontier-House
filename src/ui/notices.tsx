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

/**
 * THE DEMONSTRATION MARKER — on every surface that touches a proposed line.
 *
 * The brand sells women's, girls' and accessories; a men's line is owner decision D-03,
 * unanswered. The house presents men's-first by the owner's direction, and this marker
 * is what keeps that presentation from becoming a claim: fixture data, fixture figures,
 * out of the sitemap and the index, said in one line the reader cannot miss.
 */
export function DemonstrationNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="notice notice--demonstration" aria-label="Demonstration line">
      <p className="notice__title">Demonstration · a proposed line · fixture data</p>
      {compact ? null : (
        <p className="meta">
          Lucky &amp; Blessed sells women&rsquo;s, girls&rsquo; and accessories today. A
          men&rsquo;s line is a decision the owner has not made; this is a working proposal of
          one, on the same machinery the published line runs on. Nothing here is a stocked style
          or a published price.
        </p>
      )}
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
