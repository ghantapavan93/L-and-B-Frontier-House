import { officialMediaForSlot } from '@/content/media/official-media'
import type { MediaRef } from '@/domain/product'
import { EditorialMedia } from './product-media'

/**
 * THREAD TO TRADE.
 *
 * Two renderings of the same verified facts:
 *
 *  - `ThreadToTrade` — the Phase 1 five-column summary (the flag-off state).
 *  - `ThreadToTradeJourney` — the Phase 2 vertical journey: five alternating stages, each
 *    with an image plane or an honest art-directed material swatch, one statement, one
 *    operational proof, and a continuous routing thread down the spine drawn by scroll.
 *
 * Every stage is a VERIFIED FACT from docs/brand-research/00_BRAND_TRUTH.md — the brand's
 * own words: *"we own, operate, and manage all areas of the supply chain… textile, design,
 * manufacturing, distribution, and sales."* Nothing asserts a manufacturing LOCATION
 * (unevidenced, OQ-04), and no mill, factory, supplier or person is named or depicted.
 * Where no honest photograph exists, the plane is an abstract woven or routed swatch that
 * depicts nothing real.
 */

const STAGES = [
  {
    title: 'Textile',
    body: 'We own the textile stage of the chain rather than buying finished cloth.',
    proof: 'Vertically integrated — their words',
    slot: 'craft-detail',
    caption: 'Embroidery at close range',
  },
  {
    title: 'Design',
    body: 'Styles are designed in house, which is why the line turns over as fast as it does.',
    proof: 'Daily drops, in-house design',
    slot: 'homepage-hero-portrait',
    caption: 'A house print, worn',
  },
  {
    title: 'Manufacturing',
    body: 'Production is ours to schedule, so a style can be repeated rather than chased.',
    proof: 'Owned production — no photography yet',
    slot: null,
    swatch: 'weave' as const,
  },
  {
    title: 'Distribution',
    body: '2.64 days average processing. Order by 5pm CST and it ships same or next business day.',
    proof: '2.64-day average processing',
    slot: null,
    swatch: 'route' as const,
  },
  {
    title: 'Boutique · Sales',
    body: '100% order fill rate. What you order is what arrives — we are partners in your success.',
    proof: '100% fill rate · 615 reviews',
    slot: 'new-arrivals',
    caption: 'The line, on its way to boutiques',
  },
] as const

function StageMedia({
  media,
  caption,
  swatch,
}: {
  media?: MediaRef | undefined
  caption?: string
  swatch?: 'weave' | 'route'
}) {
  if (media) {
    return (
      <figure className="journey__media depth-far">
        <EditorialMedia media={media} sizes="(min-width: 62rem) 45vw, 100vw" />
        <figcaption>{caption}</figcaption>
      </figure>
    )
  }
  return (
    <figure className="journey__media">
      <div
        className={`journey__swatch${swatch === 'route' ? ' journey__swatch--route' : ''}`}
        role="img"
        aria-label={
          swatch === 'route'
            ? 'An abstract routed pattern standing in for distribution photography'
            : 'An abstract woven pattern standing in for production photography'
        }
      />
      <figcaption>Photography pending — nothing real is depicted</figcaption>
    </figure>
  )
}

export function ThreadToTradeJourney() {
  return (
    <section className="container section journey" aria-labelledby="thread-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Thread to trade</p>
          <h2 id="thread-heading">One chain, end to end.</h2>
          <p className="lede">
            We own, operate and manage every area of the supply chain. Follow the thread from
            cloth to the boutique floor.
          </p>
        </div>
      </div>

      <div className="journey__spine" aria-hidden="true" />

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {STAGES.map((stage, index) => {
          const media = stage.slot ? officialMediaForSlot(stage.slot) : undefined
          return (
            <li
              key={stage.title}
              className={`journey__stage${index % 2 === 1 ? ' journey__stage--reverse' : ''}`}
            >
              <StageMedia
                media={media}
                {...('caption' in stage && stage.caption ? { caption: stage.caption } : {})}
                {...('swatch' in stage && stage.swatch ? { swatch: stage.swatch } : {})}
              />
              <div className="journey__copy">
                <span className="journey__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
                <p className="journey__proof">{stage.proof}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** The Phase 1 five-column rendering — the flag-off state, unchanged. */
export function ThreadToTrade() {
  return (
    <section className="container section thread" aria-labelledby="thread-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Thread to trade</p>
          <h2 id="thread-heading">One chain, end to end.</h2>
          <p className="lede">
            We own, operate and manage every area of the supply chain. That is the reason the
            fill rate holds and the reason a style can be repeated.
          </p>
        </div>
      </div>

      <svg
        className="thread__line"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M10 84 C 180 24, 340 108, 520 62 S 840 20, 990 66" />
      </svg>

      <ol className="thread__stages">
        {STAGES.map((stage, index) => (
          <li className="thread__stage" key={stage.title}>
            <span className="thread__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
