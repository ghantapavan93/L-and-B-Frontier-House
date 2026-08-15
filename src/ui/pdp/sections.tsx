import type { DemoDetail, DemoImage, DemoSpec } from '@/fixtures/mens-demo'
import { ScrollRail } from '@/ui/scroll-rail'

/**
 * PDP SECTIONS — the shared depth layer beneath the gallery and the buying panel.
 *
 * Each one renders only if it has data. That is the whole governing rule: a product with
 * no fit table gets no fit table, not an empty one, because a heading over nothing is a
 * promise the data has not kept.
 *
 * Facts marked `visible` are provable from the photograph on the page — a snap front, a
 * leg opening, a colour. Everything else is fixture specification and the section says so
 * once, at the foot, rather than hedging every row.
 */

function Picture({
  image,
  sizes,
  className,
}: {
  image: DemoImage
  sizes: string
  className?: string
}) {
  const { asset, alt } = image
  return (
    <picture {...(className ? { className } : {})}>
      <source type="image/avif" srcSet={asset.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={asset.webpSrcSet} sizes={sizes} />
      <img
        src={asset.poster}
        alt={alt}
        width={asset.intrinsicWidth}
        height={asset.intrinsicHeight}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

function SpecTable({ rows }: { rows: readonly DemoSpec[] }) {
  return (
    <dl className="spec-table">
      {rows.map((row) => (
        <div key={row.term}>
          <dt>{row.term}</dt>
          <dd>
            {row.value}
            {row.visible ? (
              <span
                className="spec-table__seen"
                title="Visible in the photographs on this page"
              >
                seen
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * THE STORY — editorial opening, key features, and the specification folds, with a detail
 * photograph carrying the right-hand side rather than a wall of text.
 */
export function PdpStory({
  story,
  features,
  details,
  fit,
  care,
  aside,
  fixtureNote,
}: {
  story?: string | undefined
  features?: readonly string[] | undefined
  details?: readonly DemoSpec[] | undefined
  fit?: readonly DemoSpec[] | undefined
  care?: readonly DemoSpec[] | undefined
  aside?: DemoImage | undefined
  /** Rendered once at the foot when any table carries fixture specification. */
  fixtureNote?: string | undefined
}) {
  const hasTables = Boolean(details?.length || fit?.length || care?.length)
  if (!story && !features?.length && !hasTables) return null

  return (
    <section className="section pdp-story" aria-labelledby="pdp-story-heading">
      <div className="pdp-story__copy">
        <p className="eyebrow">The garment</p>
        <h2 id="pdp-story-heading" className="pdp-story__headline">
          {story ? story.split('.')[0] + '.' : 'The detail'}
        </h2>
        {story ? <p className="lede">{story}</p> : null}

        {features?.length ? (
          <>
            <h3 className="pdp-story__label">Key features</h3>
            <ul className="pdp-story__features">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </>
        ) : null}

        {details?.length ? (
          <details className="pdp-fold" open>
            <summary>Details</summary>
            <div className="pdp-fold__body">
              <SpecTable rows={details} />
            </div>
          </details>
        ) : null}

        {fit?.length ? (
          <details className="pdp-fold">
            <summary>Fit &amp; sizing</summary>
            <div className="pdp-fold__body">
              <SpecTable rows={fit} />
            </div>
          </details>
        ) : null}

        {care?.length ? (
          <details className="pdp-fold">
            <summary>Material &amp; care</summary>
            <div className="pdp-fold__body">
              <SpecTable rows={care} />
            </div>
          </details>
        ) : null}

        {fixtureNote ? <p className="meta pdp-story__note">{fixtureNote}</p> : null}
      </div>

      {aside ? (
        <div className="pdp-story__aside">
          <Picture image={aside} sizes="(min-width: 62rem) 42vw, 100vw" />
        </div>
      ) : null}
    </section>
  )
}

/**
 * PRODUCT ANATOMY — the named detail beside the frame that proves it.
 *
 * The house advantage, and the reason it is honest: a callout may only exist where an
 * image exists to carry it, so the claim and its evidence ship together or not at all.
 */
export function PdpAnatomy({ details }: { details?: readonly DemoDetail[] | undefined }) {
  if (!details?.length) return null

  return (
    <section className="section" aria-labelledby="pdp-anatomy-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Product anatomy</p>
          <h2 id="pdp-anatomy-heading">What you are looking at</h2>
          <p className="meta">
            Every callout is visible in the photograph beside it — nothing is claimed that
            cannot be seen.
          </p>
        </div>
      </div>

      <ul className="anatomy-grid">
        {details.map((detail) => (
          <li key={detail.label}>
            <Picture image={detail.image} sizes="(min-width: 62rem) 30vw, 100vw" />
            <h3 className="anatomy-grid__label">{detail.label}</h3>
            <p className="meta">{detail.note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** HOW IT IS WORN — the garment in context, as a strip of lifestyle frames. */
export function PdpWorn({ frames }: { frames?: readonly DemoImage[] | undefined }) {
  if (!frames?.length) return null

  return (
    <section className="section" aria-labelledby="pdp-worn-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">In context</p>
          <h2 id="pdp-worn-heading">How it is worn</h2>
        </div>
      </div>
      {/* Railed: arrows + progress when JS is present, native scroll always. */}
      <ScrollRail>
        <ul className="worn-strip" data-rail-scroller="">
          {frames.map((frame) => (
            <li key={frame.asset.poster}>
              <Picture image={frame} sizes="(min-width: 62rem) 33vw, 80vw" />
            </li>
          ))}
        </ul>
      </ScrollRail>
    </section>
  )
}
