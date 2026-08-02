import Link from 'next/link'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import type { PublicProduct } from '@/domain/product'

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
}: {
  products: readonly PublicProduct[]
  title: string
  eyebrow: string
  href: string
  linkLabel?: string
}) {
  if (products.length === 0) return null

  return (
    <section className="contact-sheet" aria-labelledby="contact-sheet-heading">
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

        <ul className="contact-sheet__grid">
          {products.map((product, index) => {
            const media = primaryMedia(product)
            return (
              <li className="contact-sheet__cell" key={product.id}>
                <Link href={`/product/${product.slug}`}>
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
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="contact-sheet__perf" aria-hidden="true" />
    </section>
  )
}
