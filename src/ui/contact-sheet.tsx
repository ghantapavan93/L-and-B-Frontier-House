import Link from 'next/link'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import type { PublicProduct } from '@/domain/product'
import { SIZE_RANGE_LABELS } from '@/domain/size'

function FrameLink({
  stories,
  slug,
  displayName,
  children,
}: {
  stories: boolean
  slug: string
  displayName: string
  children: React.ReactNode
}) {
  if (stories) {
    return (
      <a href={`#story-${slug}`} aria-label={`Open the story for ${displayName}`}>
        {children}
      </a>
    )
  }
  return <Link href={`/product/${slug}`}>{children}</Link>
}

/**
 * THE LIVING CONTACT SHEET.
 *
 * V3 Frame 2, built in the stronger V2 Frame 2 expression the audit identified: a
 * photographer's contact sheet rather than a catalogue grid. Frames are numbered, two break
 * scale, and the strip is bracketed by sprockets.
 *
 * The composition IS the navigation — every frame is a real `<a>` to a real product, so this
 * is a discovery surface rather than decoration, and it survives with images disabled.
 *
 * It takes `PublicProduct`, so a wholesale price cannot reach it even by mistake.
 */
export function ContactSheet({
  products,
  title,
  eyebrow,
  href,
  linkLabel = 'Open the full sheet',
  stories = false,
}: {
  products: readonly PublicProduct[]
  title: string
  eyebrow: string
  href: string
  linkLabel?: string
  /**
   * Phase 2: frames resolve into an inline editorial story via `:target` — the URL hash is
   * the selection state, anchors are the keyboard path, and the page stays static with zero
   * JavaScript. Off, frames link straight to the product (the Phase 1 behaviour).
   */
  stories?: boolean
}) {
  if (products.length === 0) return null

  return (
    <section className="contact-sheet" id="sheet" aria-labelledby="contact-sheet-heading">
      <div className="contact-sheet__perf" aria-hidden="true" />

      <div className="container">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--text-meta-on-inverse)' }}>
              {eyebrow}
            </p>
            <h2 id="contact-sheet-heading" style={{ color: 'var(--text-on-inverse)' }}>
              {title}
            </h2>
          </div>
          <Link href={href} className="text-link" style={{ color: 'var(--text-on-inverse)' }}>
            {linkLabel}
          </Link>
        </div>

        {/*
          The word behind the sheet.

          Frame 2's signature composition is an oversized display word running the width of
          the frame with the photographs laid across it — type as a graphic object rather
          than as a label. It was the clearest thing missing from this build, and the one
          piece of it that existed got deleted when the hero merged, because there it sat
          behind a real headline and became a second one.

          Here there is no headline to compete with: the section's own heading is small and
          set to the left, and this runs beneath the collage as texture. `aria-hidden`
          because it is a shape, not a reading order — the section is already titled.
        */}
        <p className="contact-sheet__word" aria-hidden="true">
          Frontier
        </p>

        <ul className="contact-sheet__grid">
          {products.map((product, index) => {
            const media = primaryMedia(product)
            return (
              <li className="contact-sheet__cell" key={product.id}>
                {/* A native <a> when selecting a story: Next's client navigation uses
                    pushState, which does NOT re-evaluate CSS :target — measured in the
                    browser suite. A real hash navigation does. */}
                <FrameLink
                  stories={stories}
                  slug={product.slug}
                  displayName={product.displayName}
                >
                  <div className="contact-sheet__frame">
                    {media ? (
                      <picture>
                        {(media.sources ?? []).map((source) => (
                          <source
                            key={source.type}
                            type={source.type}
                            srcSet={source.srcSet}
                            sizes="(min-width: 62rem) 22vw, (min-width: 48rem) 25vw, 50vw"
                          />
                        ))}
                        <img
                          src={media.poster}
                          alt={media.alt}
                          width={media.intrinsicWidth ?? 600}
                          height={media.intrinsicHeight ?? 750}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : null}
                  </div>
                  <p className="contact-sheet__caption">
                    <span>
                      {String(index + 1).padStart(2, '0')} · {product.displayName}
                    </span>
                    <span>{AVAILABILITY_LABELS[product.availability]}</span>
                  </p>
                </FrameLink>
              </li>
            )
          })}
        </ul>
        {stories
          ? products.map((product) => {
              const media = primaryMedia(product)
              const ranges = product.sizeRanges
                .filter((r) => r.availability !== 'unavailable')
                .map((r) => SIZE_RANGE_LABELS[r.kind])
                .join(' · ')
              return (
                <article
                  className="sheet-story"
                  id={`story-${product.slug}`}
                  key={`story-${product.id}`}
                  aria-label={`${product.displayName} — editorial story`}
                >
                  <figure className="sheet-story__frame">
                    {media ? (
                      <picture>
                        {(media.sources ?? []).map((source) => (
                          <source
                            key={source.type}
                            type={source.type}
                            srcSet={source.srcSet}
                            sizes="(min-width: 62rem) 30vw, 80vw"
                          />
                        ))}
                        <img
                          src={media.poster}
                          alt={media.alt}
                          width={media.intrinsicWidth ?? 600}
                          height={media.intrinsicHeight ?? 750}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : null}
                  </figure>
                  <div className="sheet-story__copy">
                    <p className="sheet-story__meta">
                      {AVAILABILITY_LABELS[product.availability]}
                      {ranges ? ` · ${ranges}` : ''}
                    </p>
                    <h3>{product.displayName}</h3>
                    <p>{product.description}</p>
                    <div className="cluster">
                      <Link
                        href={`/product/${product.slug}`}
                        className="button button--secondary"
                      >
                        View product
                      </Link>
                      <a href="#sheet" className="text-link">
                        Close story
                      </a>
                    </div>
                  </div>
                </article>
              )
            })
          : null}
      </div>

      <div className="contact-sheet__perf" aria-hidden="true" />
    </section>
  )
}
