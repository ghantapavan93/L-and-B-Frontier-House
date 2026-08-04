import type { MediaRef } from '@/domain/product'
import { EditorialMedia } from './product-media'

/**
 * HERO MEDIA — the production-ready slot for the campaign film that does not exist yet.
 *
 * API supports everything docs/production/12 requires of hero film the day it arrives:
 * desktop and mobile sources, a poster that carries the message alone, muted +
 * `playsinline`, captions and transcript hooks, and failure-to-poster.
 *
 * The `<video>` branch renders only when real sources are supplied. It is deliberately
 * NOT autoplaying and NOT looping:
 *
 *   - Autoplay cannot be gated on `prefers-reduced-motion` from the server, and no
 *     amount of CSS stops a video that carries the attribute. Shipping autoplay would
 *     therefore push four seconds of unrequested motion at people who asked for none,
 *     which is the one rule this project treats as non-negotiable. Doing it correctly
 *     needs a few hundred bytes of client JavaScript against a 0 KB budget — a trade
 *     worth making deliberately, not by accident.
 *   - Without `loop`, the clip runs 4.00 s once. Under the WCAG 2.2.2 five-second
 *     threshold, so no pause control is owed — and native `controls` provides one anyway.
 *
 * The poster carries the whole message alone, so a blocked, failed or unsupported video
 * costs nothing.
 */

export type HeroVideoSources = {
  readonly desktopSrc: string
  readonly mobileSrc?: string
  /** WebVTT captions track. Required before any real film ships. */
  readonly captionsSrc: string
  /** Plain-text transcript route. Doubles as the SEO surface for a silent film. */
  readonly transcriptHref: string
}

export function HeroMedia({
  poster,
  posterPortrait,
  video,
}: {
  poster: MediaRef
  posterPortrait?: MediaRef | undefined
  video?: HeroVideoSources | undefined
}) {
  if (!video) {
    return <EditorialMedia media={poster} portrait={posterPortrait} priority sizes="100vw" />
  }

  return (
    <div className="hero-media">
      {/*
        Muted, inline, no autoplay attribute: playback is started by the enhancement layer
        only when `prefers-reduced-motion` is not set, and the poster is always complete on
        its own. Native controls remain as the no-JS fallback, satisfying pause/stop.
      */}
      <video
        className="hero-media__video"
        poster={poster.poster}
        muted
        playsInline
        controls
        preload="metadata"
        aria-label={poster.alt}
      >
        {video.mobileSrc ? (
          <source src={video.mobileSrc} media="(max-width: 47.99rem)" />
        ) : null}
        <source src={video.desktopSrc} />
        <track kind="captions" src={video.captionsSrc} default />
      </video>
      <p className="hero-media__transcript meta">
        <a href={video.transcriptHref}>Read the film transcript</a>
      </p>
    </div>
  )
}
