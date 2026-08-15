import type { DemoImage } from '@/fixtures/mens-demo'

/**
 * THE PRODUCT GALLERY — inspect the garment as closely as you would holding it.
 *
 * Every mechanism here is native, so the whole gallery works with JavaScript disabled:
 *
 *   - THE FRAMES are a scroll-snap strip. Trackpads and touch move it, the scrollbar is
 *     honest, and each frame is a fragment target — so a thumbnail is a plain anchor and
 *     the browser does the scrolling itself. No carousel state to get wrong.
 *   - THE THUMBNAILS are those anchors. They are keyboard-reachable in order and each one
 *     names the view it opens, so a screen reader hears "Back view", not "image 3".
 *   - THE ENLARGED VIEW is `:target`. Clicking a frame opens it full-bleed over the page;
 *     Close returns to the frame's own anchor, so the strip keeps its position.
 *
 * The gallery renders whatever media exists and nothing more — no placeholder slots
 * padding the count, because an empty frame is a promise the catalogue has not kept.
 */

export type GalleryImage = {
  readonly id: string
  readonly image: DemoImage
  /** Short view name: Front, Back, Detail, Worn. Announced with the thumbnail. */
  readonly label: string
}

function Picture({
  image,
  sizes,
  loading = 'lazy',
}: {
  image: DemoImage
  sizes: string
  loading?: 'lazy' | 'eager'
}) {
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
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}

export function PdpGallery({ frames }: { frames: readonly GalleryImage[] }) {
  if (frames.length === 0) return null

  return (
    <div className="gallery">
      {/* Thumbnails: anchors, in view order, each naming what it opens. */}
      {frames.length > 1 ? (
        <nav className="gallery__rail" aria-label="Product views">
          {frames.map((frame, index) => (
            <a key={frame.id} href={`#${frame.id}`} className="gallery__thumb">
              <Picture image={frame.image} sizes="6rem" />
              <span className="visually-hidden">
                {frame.label} — view {index + 1} of {frames.length}
              </span>
            </a>
          ))}
        </nav>
      ) : null}

      {/*
        NOT a tab stop. On desktop the strip is a stack and scrolls nothing, so a
        `tabIndex` here would be a focus stop with no action — and a tall container whose
        centre sits off-screen reports as obscured under 2.4.11. Every frame already
        contains its own focusable link, so the keyboard reaches all of them and the
        browser scrolls the container itself on mobile.
      */}
      <div className="gallery__strip">
        {frames.map((frame, index) => (
          <figure className="gallery__frame" id={frame.id} key={frame.id}>
            {/* The frame links to its own enlarged view. */}
            <a href={`#zoom-${frame.id}`} className="gallery__open">
              <Picture
                image={frame.image}
                sizes="(min-width: 62rem) 46vw, 100vw"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* One accessible name, not two — the audit caught this pair computing
                  to "EnlargeEnlarge the front view". */}
              <span className="gallery__open-hint" aria-hidden="true">
                Enlarge
              </span>
              <span className="visually-hidden">
                Open the {frame.label.toLowerCase()} enlarged
              </span>
            </a>
            <figcaption className="gallery__caption">{frame.label}</figcaption>
          </figure>
        ))}
      </div>

      {/* The enlarged views. Hidden until targeted; Close returns to the frame. */}
      {frames.map((frame) => (
        <div
          className="zoom"
          id={`zoom-${frame.id}`}
          key={`zoom-${frame.id}`}
          tabIndex={-1}
          aria-label={`${frame.label} — enlarged`}
        >
          <a
            className="zoom__backdrop"
            href={`#${frame.id}`}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="zoom__panel">
            {/* Eager: a lazy image inside a hidden overlay does not begin loading until
                the overlay is revealed, which opens onto an empty panel. */}
            <Picture image={frame.image} sizes="92vw" loading="eager" />
            <a href={`#${frame.id}`} className="button button--secondary zoom__close">
              Close
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
