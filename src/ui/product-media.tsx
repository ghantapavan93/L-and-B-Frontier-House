import type { MediaRef } from '@/domain/product'

/**
 * Poster-first. Every media slot renders a still that carries the message alone.
 *
 * Responsive by construction: optimised assets ship AVIF and WebP at every width the source
 * supports, and `sizes` tells the browser which one to fetch. Sources are never upscaled, so
 * a 360px original simply has one width — the honest ceiling of what was supplied.
 *
 * The aspect ratio comes from the model and is applied to the box, so layout is reserved
 * before the bytes arrive and nothing shifts. Alt text is required and meaningful.
 *
 * `next/image` is deliberately not used: the optimisation already happened at build time,
 * there is no CDN or loader decision, and a plain `<picture>` keeps the client bundle at
 * zero for what is a static image.
 */
export function ProductMedia({
  media,
  sizes = '(min-width: 62rem) 33vw, (min-width: 48rem) 50vw, 100vw',
  priority = false,
  className = 'product-card__media',
  transitionName,
}: {
  media: MediaRef | undefined
  sizes?: string
  priority?: boolean
  className?: string
  /**
   * Cross-document view-transition identity. The same name on a card image and its
   * product page's opening image makes the click a morph instead of a page swap —
   * pure CSS (`@view-transition` in globals), no JavaScript, ignored by browsers
   * without support and disabled under reduced motion.
   */
  transitionName?: string
}) {
  if (!media) {
    return (
      <div className={className} role="img" aria-label="No image available">
        <span className="fixture-flag">No image</span>
      </div>
    )
  }

  const isPlaceholder = media.provenance === 'generated-placeholder'
  const loading = priority ? 'eager' : 'lazy'

  return (
    <div className={className}>
      {isPlaceholder ? <span className="fixture-flag">Fixture</span> : null}

      <picture>
        {(media.sources ?? []).map((source) => (
          <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
        ))}
        <img
          src={media.poster}
          alt={media.alt}
          width={media.intrinsicWidth ?? 600}
          height={media.intrinsicHeight ?? 750}
          style={{
            aspectRatio: media.aspectRatio,
            ...(transitionName ? { viewTransitionName: transitionName } : {}),
          }}
          loading={loading}
          decoding={priority ? 'sync' : 'async'}
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
      </picture>
    </div>
  )
}

/**
 * A full-bleed editorial image behind a scrim — the hero and section-banner treatment.
 *
 * Two art directions are supported: a wide landscape crop for desktop and a portrait crop
 * for narrow viewports, which is what stops a 1.8:1 lineup shot from becoming a letterbox
 * sliver on a phone.
 */
export function EditorialMedia({
  media,
  portrait,
  sizes = '100vw',
  priority = false,
}: {
  media: MediaRef
  portrait?: MediaRef | undefined
  sizes?: string
  priority?: boolean
}) {
  return (
    <picture>
      {portrait
        ? (portrait.sources ?? []).map((source) => (
            <source
              key={`portrait-${source.type}`}
              media="(max-width: 47.99rem)"
              type={source.type}
              srcSet={source.srcSet}
              sizes={sizes}
            />
          ))
        : null}
      {(media.sources ?? []).map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        src={media.poster}
        alt={media.alt}
        width={media.intrinsicWidth ?? 1920}
        height={media.intrinsicHeight ?? 1066}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  )
}
