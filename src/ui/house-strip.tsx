import Link from 'next/link'
import { PLATE_MARKER, PLATE_STOREFRONT } from '@/content/media/frontier-plates'
import { MENS_DEMO_FLOOR } from '@/fixtures/mens-demo'
import type { DemoImage } from '@/fixtures/mens-demo'

/**
 * THE SPLIT CAMPAIGN and THE HOUSE STRIP — the closing movements of the homepage.
 *
 * SPLIT: two campaign frames side by side, each with one word over it and a short action.
 * Full-bleed, no container, no card — the section is the photography.
 *
 * STRIP: the page ends on a horizontal run of lifestyle frames under the house tag, the
 * way a brand ends on its own feed. It is a REAL horizontal scroller (native scroll, honest
 * scrollbar, keyboard-reachable), never an auto-advancing carousel — §9 forbids taking the
 * wheel, and a strip that moves on its own would take the reader's place in it too.
 *
 * Both carry the demonstration marker: this is the owner's reference photography for a
 * line that is proposed rather than published (D-03).
 */

function frame(key: string): DemoImage | undefined {
  return MENS_DEMO_FLOOR.find((f) => f.asset.poster.includes(key))
}

function Picture({ image, sizes }: { image: DemoImage; sizes: string }) {
  const { asset, alt } = image
  return (
    <picture>
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

export function SplitCampaign() {
  const right = frame('floor-boot-crate')
  if (!right) return null

  return (
    <section className="split" aria-labelledby="split-heading">
      <h2 id="split-heading" className="visually-hidden">
        The house, in two frames
      </h2>

      {/*
        The left half is the storefront title card from the owner's generated-plate drop —
        it carries its own typography, so no overlay word competes with it, and the scrim
        that serves the labelled half is suppressed. The marker chip keeps it honest, and
        the plate is exactly 4:5, so the split's frame shows it whole.
      */}
      <Link
        href="/mens"
        className="split__half split__half--plate"
        aria-label="Frontier House — the men's demonstration. Generated campaign artwork."
      >
        <Picture image={PLATE_STOREFRONT} sizes="(min-width: 48rem) 50vw, 100vw" />
        <span className="plate-note">{PLATE_MARKER}</span>
      </Link>

      <Link href="/mens" className="split__half">
        <Picture image={right} sizes="50vw" />
        <span className="split__label">
          <span className="split__word">Worn in, not out</span>
          <span className="split__cta">The floor</span>
        </span>
      </Link>
    </section>
  )
}

/** The frames that close the page — looks, details and hardware, in a run. */
const STRIP_KEYS = [
  'floor-dark-jean-street',
  'floor-cuffing-barn',
  'floor-back-pocket',
  'floor-boot-rocks',
  'floor-light-jean-worn',
  'floor-waist-detail',
  'floor-boot-floorboards',
  'floor-denim-texture',
  'floor-cream-seated',
  'floor-dark-hem-boot',
]

export function HouseStrip() {
  const frames = STRIP_KEYS.map(frame).filter((f): f is DemoImage => f !== undefined)
  if (frames.length === 0) return null

  return (
    <section className="house-strip" aria-labelledby="house-strip-heading">
      <div className="container">
        <div className="house-strip__head">
          <h2 id="house-strip-heading" className="house-strip__tag">
            #FrontierHouse
          </h2>
          <p className="meta">
            Reference photography for a proposed men&rsquo;s line — a demonstration, not a
            published collection.
          </p>
        </div>
      </div>

      {/*
        A real scroller. Native panning, an honest scrollbar, and every frame reachable by
        keyboard — not an auto-advancing carousel, which would move the page under a reader
        who did not ask it to.
      */}
      {/*
        The REGION is the scroller, not the list. Putting `role="region"` on the <ul>
        replaces its list semantics, which orphans every <li> — axe reports it as a
        serious failure, and a screen reader loses the count. The wrapper takes the role
        and the focus; the list stays a list.
      */}
      {/*
        THE STRIP DRIFTS — owner-directed, on the marquee's exact legal machinery.

        The frames travel right-to-left continuously, like film through a gate. Three
        controls keep it legitimate, all CSS, zero JavaScript:
          - A real 44px checkbox pause (2.2.2 binds ANY motion over 5s beside content).
            Checked = paused; the input itself is the target, per the marquee fix.
          - Hover or focus pauses the track, so a reader can actually look at a frame.
          - `prefers-reduced-motion` removes the animation entirely and the strip
            reverts to exactly what it was: a native hand-scrolled run — duplicates
            hidden, scrollbar back, nothing moving uninvited.
        The second set of frames exists only for the seamless loop and is aria-hidden;
        assistive tech hears ten photographs, not twenty.
      */}
      <div className="house-strip__stage">
        <input
          type="checkbox"
          id="house-strip-pause"
          className="house-strip__state"
          aria-label="Pause the moving photography strip"
        />
        <label className="house-strip__toggle" htmlFor="house-strip-pause">
          <svg
            className="house-strip__glyph house-strip__glyph--pause"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="2" y="1" width="3.5" height="12" fill="currentColor" />
            <rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" />
          </svg>
          <svg
            className="house-strip__glyph house-strip__glyph--play"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 1l9 6-9 6z" fill="currentColor" />
          </svg>
        </label>

        <div
          className="house-strip__run"
          tabIndex={0}
          role="region"
          aria-label="Campaign photography"
        >
          <div className="house-strip__track">
            <ul className="house-strip__list">
              {frames.map((image) => (
                <li key={image.asset.poster}>
                  <Picture image={image} sizes="(min-width: 62rem) 22vw, 55vw" />
                </li>
              ))}
            </ul>
            <ul className="house-strip__list" aria-hidden="true">
              {frames.map((image) => (
                <li key={`dup-${image.asset.poster}`}>
                  <Picture image={image} sizes="(min-width: 62rem) 22vw, 55vw" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
