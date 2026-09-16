import { FIXTURE_NOTICE, FIXTURE_NOTICE_DETAIL } from '@/fixtures/notice'
import { officialMediaForSlot } from '@/content/media/official-media'
import { EditorialMedia } from '@/ui/product-media'

/**
 * The fixture notice is rendered wherever fixture data is shown. It is deliberately
 * unmissable: a placeholder that can pass as real is the mechanism by which unverified
 * claims ship.
 */
export function FixtureNotice({ detail = true }: { detail?: boolean }) {
  /*
    The development table, as a picture: swatches, pattern paper, oxblood thread, coloured
    acrylic — cobalt, teal, graphite and silver, a different world from the ranch, on
    purpose. Owner-generated (slot `development-fixture-notice`, 2026-09-16), mounted only
    here, never elsewhere. The heading and paragraph stay live HTML beside it; nothing is
    written into the image. Absent from the manifest → the notice is text alone.
  */
  const plate = officialMediaForSlot(
    'development-fixture-notice',
    'A development table: fabric swatches, pattern paper, thread and coloured acrylic — generated artwork',
  )
  return (
    <aside
      className={
        plate ? 'notice notice--fixture notice--fixture-plate' : 'notice notice--fixture'
      }
      aria-labelledby="fixture-notice-title"
    >
      {plate ? (
        <div className="notice__plate" aria-hidden="true">
          <EditorialMedia media={plate} sizes="(min-width: 62rem) 22rem, 100vw" />
        </div>
      ) : null}
      <div className="notice__body">
        <p className="notice__title" id="fixture-notice-title">
          {FIXTURE_NOTICE}
        </p>
        {detail ? <p className="meta">{FIXTURE_NOTICE_DETAIL}</p> : null}
      </div>
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
