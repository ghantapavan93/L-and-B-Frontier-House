import Link from 'next/link'
import type { PublicProduct } from '@/domain/product'
import { primaryMedia } from '@/domain/product'
import { MediaSlot } from './media-slot'
import { ProductMedia } from './product-media'

/**
 * THIS WEEK — the spatial band. Five frames at five scales, entering from beyond the edges.
 *
 * The owner's brief, almost verbatim: "one slides from left, another crosses behind it, a
 * tall portrait drops down, a detail expands" — photography as storytelling and product
 * grid at the same time. The entrance itself is the existing scroll-driven CSS (the same
 * `arrive-*` keyframes the product grid uses), so this adds zero JavaScript.
 *
 * Composition over uniformity: each of the five cells has its own span on an asymmetric
 * grid, which is what separates an editorial opening from a row of cards. The cells are
 * REAL products — newest first — so every frame is a working link into commerce.
 *
 * What the reference spec asked for that is deliberately absent: the hover price and
 * "Quick Buy". A public product record has no price field at all — the wholesale boundary
 * is expressed in the type — so the hover carries name and newness and the click goes to
 * the product page, where the gate does its work.
 *
 * Cells without a product (catalogue shorter than the composition) render as named, empty
 * media slots: the owner pastes photography in later and the layout is already true.
 */
export function ThisWeekBand({ products }: { products: readonly PublicProduct[] }) {
  const cells = products.slice(0, 5)
  if (cells.length === 0) return null

  return (
    <section className="container section" aria-labelledby="this-week-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The drop</p>
          <h2 id="this-week-heading">This week</h2>
        </div>
        <Link href="/new-arrivals" className="text-link">
          Everything new
        </Link>
      </div>

      <div className="week-band">
        {Array.from({ length: 5 }, (_, index) => {
          const product = cells[index]
          if (!product) {
            return (
              <div className={`week-band__cell week-band__cell--${index + 1}`} key={index}>
                <MediaSlot
                  label="Campaign photograph"
                  aspectRatio={index === 2 ? '3 / 4' : '2 / 3'}
                />
              </div>
            )
          }

          const media = primaryMedia(product)
          return (
            <div className={`week-band__cell week-band__cell--${index + 1}`} key={product.id}>
              <Link href={`/product/${product.slug}`} className="week-band__frame">
                <ProductMedia
                  media={media}
                  sizes="(min-width: 62rem) 33vw, 50vw"
                  priority={index === 0}
                />
                <span className="week-band__caption">
                  <span className="week-band__name">{product.displayName}</span>
                  {product.newArrivalOn ? (
                    <span className="week-band__new">New this week</span>
                  ) : null}
                </span>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/**
 * PRODUCT IN MOTION — three reserved film slots.
 *
 * Double D Ranch's single strongest mechanism is nineteen short vertical garment clips on
 * one homepage. We have the container architecture and zero clips, so the band ships as
 * three labelled 9:16 slots at the exact dimensions the owner's footage should arrive in
 * (short, muted, portrait, one garment moving). The section explains itself rather than
 * shimmering, and the day clips exist they drop straight in.
 */
export function MotionClipBand() {
  return (
    <section className="container section" aria-labelledby="motion-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">In motion</p>
          <h2 id="motion-heading">Fabric moves. Photographs don&rsquo;t.</h2>
          <p className="meta">
            Three film slots reserved for short garment clips — drape, walk, turn. Portrait, a
            few seconds each, no sound.
          </p>
        </div>
      </div>

      <div className="motion-band">
        <MediaSlot label="Garment in motion · film slot 01" aspectRatio="9 / 16" kind="video" />
        <MediaSlot label="Garment in motion · film slot 02" aspectRatio="9 / 16" kind="video" />
        <MediaSlot label="Garment in motion · film slot 03" aspectRatio="9 / 16" kind="video" />
      </div>
    </section>
  )
}
