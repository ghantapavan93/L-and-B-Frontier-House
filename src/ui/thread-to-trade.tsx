import Link from 'next/link'
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
 * (unevidenced, OQ-04), and no mill, factory, supplier or person is NAMED.
 *
 * THE PLANES, SINCE 2026-09-16: five owner-generated renders, one per stage, placed by the
 * owner under the names `thread-to-trade-01-textile` … `05-boutique-sales` and mounted
 * one to one. They depict a loom, a pattern bench, a sewing machine, a packing floor and a
 * boutique counter, each with a figure at work. That is campaign fiction on the side of
 * D-09 the owner's own decision refuses for generated media — manufacturing and facility
 * depictions — and the owner placed them knowingly. So each plane carries the plate
 * marker in its caption, its provenance is `generated-campaign`, and the statement beside
 * it stays the verified fact. Evocative, never evidentiary: the picture illustrates the
 * sentence; the sentence is what is true.
 */

const STAGES = [
  {
    id: 'stage-textile',
    title: 'Textile',
    body: 'We own the textile stage of the chain rather than buying finished cloth.',
    proof: 'Vertically integrated — their words',
    slot: 'thread-to-trade-01-textile',
    caption: 'Textile — generated campaign artwork, not photography',
  },
  {
    id: 'stage-design',
    title: 'Design',
    body: 'Styles are designed in house, which is why the line turns over as fast as it does.',
    proof: 'Daily drops, in-house design',
    slot: 'thread-to-trade-02-design',
    caption: 'Design — generated campaign artwork, not photography',
  },
  {
    id: 'stage-manufacturing',
    title: 'Manufacturing',
    body: 'Production is ours to schedule, so a style can be repeated rather than chased.',
    proof: 'Owned production — their words',
    slot: 'thread-to-trade-03-manufacturing',
    caption: 'Manufacturing — generated campaign artwork; no place or person is real',
  },
  {
    id: 'stage-distribution',
    title: 'Distribution',
    body: '2.64 days average processing. Order by 5pm CST and it ships same or next business day.',
    proof: '2.64-day average processing',
    slot: 'thread-to-trade-04-distribution',
    caption: 'Distribution — generated campaign artwork, not photography',
  },
  {
    id: 'stage-boutique',
    title: 'Boutique · Sales',
    body: '100% order fill rate. What you order is what arrives — we are partners in your success.',
    proof: '100% fill rate · 615 reviews',
    slot: 'thread-to-trade-05-boutique-sales',
    caption: 'Boutique — generated campaign artwork, not photography',
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

/**
 * A band's heading is an `h2` when it sits among other bands and an `h1` when the band IS
 * the page. The route decides; the markup stays otherwise identical. Without this, a
 * surface promoted to its own URL ships with no level-one heading — which axe reports,
 * the landmark suite fails on, and a screen-reader user notices first.
 */
type HeadingLevel = 'h1' | 'h2'

export function ThreadToTradeJourney({
  heading: Heading = 'h2',
}: { heading?: HeadingLevel } = {}) {
  // Stages sit one level under the band heading, wherever the band heading sits.
  const Stage = Heading === 'h1' ? 'h2' : 'h3'
  return (
    <section className="container section journey" aria-labelledby="thread-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Thread to trade</p>
          <Heading id="thread-heading">One chain, end to end.</Heading>
          <p className="lede">
            We own, operate and manage every area of the supply chain. Follow the thread from
            cloth to the boutique floor.
          </p>
        </div>
      </div>

      {/*
        THE CHAPTER RAIL — G-Star's one genuinely transferable structural device.

        Their story page pins a 55px topic rail under the header for its full 6,403px, so a
        long read always carries its own map (docs/research/teardown-burberry-gstar-vero.md
        §2.2). This band is our longest by a wide margin, and it was asking the reader to
        scroll five screens with no sense of how many stages remained.

        Built as five real anchors to five real ids: it is a table of contents without
        JavaScript, it works with scripting disabled, it is keyboard-native, and a screen
        reader gets it as a labelled navigation landmark. `scroll-margin-top` on the stages
        keeps the sticky site header from covering the target — the 2.4.11 trap.
      */}
      <nav className="journey__rail" aria-label="Supply chain stages">
        <ol className="journey__rail-list">
          {STAGES.map((stage, index) => (
            <li key={stage.id}>
              <a href={`#${stage.id}`} className="journey__rail-link">
                <span className="journey__rail-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {stage.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="journey__spine" aria-hidden="true" />

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {STAGES.map((stage, index) => {
          const media = stage.slot ? officialMediaForSlot(stage.slot) : undefined
          return (
            <li
              key={stage.title}
              id={stage.id}
              className={`journey__stage${index % 2 === 1 ? ' journey__stage--reverse' : ''}`}
            >
              {/* Every stage has a slot now; the swatch path stays for a slot that is
                  ever unmapped, so a missing render shows an honest abstract, not a hole. */}
              <StageMedia media={media} caption={stage.caption} swatch="weave" />
              <div className="journey__copy">
                <span className="journey__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Stage>{stage.title}</Stage>
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

      {/* Each stage links to its full plane on the journey route, which also makes the
          phone's sideways scroller keyboard-reachable — every card is a tab stop. */}
      <ol className="thread__stages">
        {STAGES.map((stage, index) => (
          <li className="thread__stage" key={stage.title}>
            <Link
              prefetch={false}
              href={`/thread-to-trade#${stage.id}`}
              className="thread__stage-link"
            >
              <span className="thread__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
