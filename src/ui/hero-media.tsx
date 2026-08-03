import type { MediaRef } from '@/domain/product'
import { EditorialMedia } from './product-media'

/**
 * HERO MEDIA — the production-ready slot for the campaign film that does not exist yet.
 *
 * API supports everything docs/production/12 requires of hero film the day it arrives:
 * desktop and mobile sources, a poster that carries the message alone, muted +
 * `playsinline`, captions and transcript hooks, and failure-to-poster.
 *
 * TODAY IT RENDERS THE POSTER PATH ONLY. No film has been produced, "do not autoplay a
 * temporary low-quality video" is a hard instruction, and an auto-starting loop over five
 * seconds would owe a visible pause control (WCAG 2.2.2) — so the `<video>` branch renders
 * exclusively when real sources are supplied, ships a native-controls fallback, and pairs
 * with the visible pause affordance below. Until then: zero video bytes, zero JavaScript,
 * and a structural test asserts no `<video>` exists in any response.
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
        loop
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
