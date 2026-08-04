import Link from 'next/link'
import type { MediaRef } from '@/domain/product'
import { HeroMedia, type HeroVideoSources } from './hero-media'

/**
 * The ignition film's media, declared here rather than fetched.
 *
 * Provenance is `owner-supplied`: this is a Blender master of an object we designed and
 * rendered ourselves, so there is no third party to license and nothing generative to
 * disclose. Alt text describes the artifact — never a date, never a slogan, never a price.
 */
const IGNITION_POSTER: MediaRef = {
  id: 'buckle-ignition-poster',
  kind: 'video',
  poster: '/media/buckle/lb-buckle-poster-desktop.webp',
  aspectRatio: '16 / 9',
  alt: 'A scalloped rectangular western belt buckle in darkened silver, oxidised copper and tooled leather, its engraved L and B monogram lit from within in turquoise, resting on indigo denim',
  provenance: 'owner-supplied',
  intrinsicWidth: 1920,
  intrinsicHeight: 1080,
}

const IGNITION_POSTER_PORTRAIT: MediaRef = {
  ...IGNITION_POSTER,
  id: 'buckle-ignition-poster-portrait',
  poster: '/media/buckle/lb-buckle-poster-mobile.webp',
  aspectRatio: '9 / 16',
  intrinsicWidth: 1080,
  intrinsicHeight: 1920,
}

const IGNITION_FILM: HeroVideoSources = {
  desktopSrc: '/media/buckle/lb-buckle-ignition-desktop.mp4',
  mobileSrc: '/media/buckle/lb-buckle-ignition-mobile.mp4',
  captionsSrc: '/media/buckle/lb-buckle-ignition.vtt',
  transcriptHref: '/transcript/buckle-ignition',
}

/**
 * FRONTIER IGNITION — the cinematic entry.
 *
 * Composed from the MCP-inspected screens: V3.1 Frame 3 (a luminous thread drawing the L&B
 * identity through a ghost headline on an ink field), 8B/8C (the scalloped rectangular
 * buckle in darkened silver, copper, denim and restrained turquoise), and 12A (poster-first
 * actions: enter, skip, and immediate access).
 *
 * Entirely server-rendered SVG and CSS. The thread is two stacked strokes — a blurred glow
 * underlay and a dashed fibre core — drawn once by `stroke-dashoffset`, ≈2.8s, no loop, so
 * no pause control is owed (WCAG 2.2.2 binds auto-motion over five seconds). Under reduced
 * motion everything is simply already drawn.
 *
 * The engraving reads L&B — the brand's initials. It does not read "L&B Frontier House"
 * anywhere customer-facing (D-10), and it carries no date (the corpus's "EST. 1865" is a
 * fabrication and stays dead).
 *
 * Scrolling past is the interruption model; "Skip to shop" jumps the sequence entirely.
 */
export function FrontierIgnition() {
  return (
    <section className="ignition" aria-label="Introduction">
      <div className="ignition__grain" aria-hidden="true" />

      {/* Ghost statement — display texture, not a heading; the page's h1 lives below. */}
      <p className="ignition__ghost" aria-hidden="true">
        Not the west
        <br />
        you remember
      </p>

      <figure className="ignition__artifact">
        <svg
          className="ignition__buckle"
          viewBox="0 0 320 240"
          role="img"
          aria-label="A scalloped rectangular western belt buckle engraved with the initials L and B, drawn in silver, copper and turquoise thread"
        >
          <defs>
            <linearGradient id="ig-silver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d8d6d1" />
              <stop offset="0.45" stopColor="#8f8d88" />
              <stop offset="1" stopColor="#4e4c49" />
            </linearGradient>
            <linearGradient id="ig-copper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c98a5e" />
              <stop offset="1" stopColor="#6e4226" />
            </linearGradient>
            <linearGradient id="ig-denim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#22344f" />
              <stop offset="1" stopColor="#131f31" />
            </linearGradient>
            <filter id="ig-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
          </defs>

          {/* Scalloped rectangular silhouette — the 8B/8C form, never the coin. */}
          <path
            className="ignition__rim"
            d="M42 30 Q26 30 24 46 Q10 50 12 66 L12 174 Q10 190 24 194 Q26 210 42 210 L278 210 Q294 210 296 194 Q310 190 308 174 L308 66 Q310 50 296 46 Q294 30 278 30 Z"
            fill="url(#ig-denim)"
            stroke="url(#ig-silver)"
            strokeWidth="5"
          />
          <path
            d="M54 46 Q42 46 42 58 L42 182 Q42 194 54 194 L266 194 Q278 194 278 182 L278 58 Q278 46 266 46 Z"
            fill="none"
            stroke="url(#ig-copper)"
            strokeWidth="2.5"
            opacity="0.9"
          />
          {/* Stitch row inside the copper frame. */}
          <path
            d="M60 56 L260 56 M60 184 L260 184"
            stroke="#d9c5b2"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.55"
            fill="none"
          />
          {/* Turquoise inlays — restrained, four points. */}
          <g fill="#3d8f8a" stroke="#9adbd4" strokeWidth="0.8">
            <circle cx="42" cy="120" r="5" />
            <circle cx="278" cy="120" r="5" />
            <circle cx="160" cy="52" r="4" />
            <circle cx="160" cy="188" r="4" />
          </g>

          {/* The engraved monogram: glow underlay, then the drawn fibre core. */}
          <g className="ignition__thread">
            <path
              className="ignition__thread-glow"
              d="M96 158 C92 108 128 84 150 104 C168 120 150 152 122 150 M178 86 L178 158 M178 118 C204 104 226 118 214 134 C204 146 188 140 178 132 M178 132 C206 138 232 150 216 160 C204 167 188 160 178 152"
              filter="url(#ig-glow)"
            />
            <path
              className="ignition__thread-core"
              d="M96 158 C92 108 128 84 150 104 C168 120 150 152 122 150 M178 86 L178 158 M178 118 C204 104 226 118 214 134 C204 146 188 140 178 132 M178 132 C206 138 232 150 216 160 C204 167 188 160 178 152"
            />
          </g>

          {/* The thread leaves the buckle and heads for the page below. */}
          <path
            className="ignition__thread-exit"
            d="M216 160 C250 178 240 206 200 214 C168 220 150 228 160 240"
          />
        </svg>
        <figcaption className="ignition__stage">01 · Ignition</figcaption>
      </figure>

      {/*
        THE IGNITION FILM.

        The SVG above remains the structural floor: it is what renders with no network,
        no codec and no JavaScript, and it is what a reduced-motion visitor sees. The
        film sits beneath it as the richer telling of the same four seconds, offered
        rather than imposed — poster-first, user-started, with captions and a transcript.

        Its own materials, not a product claim: the buckle is an object we designed and
        rendered, so it carries no garment, no price and no date. It stays decorative,
        and the section's real content is the actions below.
      */}
      <HeroMedia
        poster={IGNITION_POSTER}
        posterPortrait={IGNITION_POSTER_PORTRAIT}
        video={IGNITION_FILM}
      />

      <div className="ignition__actions">
        <a className="button button--secondary" href="#hero">
          Enter the frontier
        </a>
        <a className="button button--quiet ignition__skip" href="#sheet">
          Skip to shop
        </a>
        <Link className="text-link" href="/wholesale">
          Wholesale access
        </Link>
      </div>
    </section>
  )
}
