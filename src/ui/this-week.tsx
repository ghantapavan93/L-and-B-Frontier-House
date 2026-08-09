import Link from 'next/link'
import { REGISTER_TRIPTYCH } from '@/content/media/campaign-plates'
import type { PublicProduct } from '@/domain/product'
import { primaryMedia } from '@/domain/product'
import { MediaSlot } from './media-slot'
import { DepthField } from './motion/depth-field'
import { EditorialMedia, ProductMedia } from './product-media'

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

      {/*
        The DepthField island: pointer position, sprung, published as --depth-x/--depth-y.
        The stylesheet moves each frame a few pixels at its own rate — the five photographs
        separate into planes under the cursor. Server cells pass through untouched; no
        JavaScript, no vars, no movement, same band.
      */}
      <DepthField className="week-band">
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
      </DepthField>
    </section>
  )
}

/**
 * THE REGISTER — the campaign triptych where the empty film slots stood.
 *
 * Double D Ranch's strongest mechanism is many short garment clips, and that band returns
 * the day the owner's footage exists (the media request is recorded). Until then, three
 * grey boxes labelled "film slot" were the single flattest moment on the page — reserved
 * space read as missing content. The band now runs three cleared campaign plates instead:
 * cinema, land, warehouse — the registers the house shoots in. Still imagery, deliberately:
 * the references Ken-Burns nothing, and a drifting still would re-enter WCAG 2.2.2 for no
 * gain. Every frame is captioned as campaign imagery (§12).
 */
export function MotionClipBand() {
  return (
    <section className="container section" aria-labelledby="register-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The register</p>
          <h2 id="register-heading">Shot like a film. Run like a warehouse.</h2>
          <p className="meta">
            The three rooms this house works in — the set, the land, the racks.
          </p>
        </div>
      </div>

      <div className="register-band">
        {REGISTER_TRIPTYCH.map((media, index) => (
          <figure className="register-band__cell" key={media.id}>
            <EditorialMedia
              media={media}
              sizes="(min-width: 62rem) 33vw, 100vw"
              priority={false}
            />
            <figcaption className="register-band__caption">
              {String(index + 1).padStart(2, '0')} · Campaign imagery
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
