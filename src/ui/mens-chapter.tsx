import Link from 'next/link'
import { MENS_DEMO_FLOOR, MENS_DEMO_PRODUCTS } from '@/fixtures/mens-demo'
import type { DemoImage } from '@/fixtures/mens-demo'

/**
 * THE CAMPAIGN STORY — asymmetric, overlapping, photography-led.
 *
 * The composition principle of a current campaign page rather than a boxed ecommerce
 * component: one tall frame off the left edge, a second frame overlapping it from below
 * and right, the headline set across both at display scale, and two lines of copy under a
 * single action. Nothing is centred, nothing is boxed, and the type sits ON the
 * composition instead of beside it.
 *
 * The overlap is CSS grid area sharing — no absolute positioning, so it reflows to a clean
 * stack on a phone rather than collapsing into a pile.
 *
 * The safeguards are unchanged and visible: DEMONSTRATION in the eyebrow, a badge under
 * the copy, no product name, no price, and the only link goes to the `/mens` page that
 * states what it is. This is a proposal for a men's business, presented as one.
 */

function frame(key: string): DemoImage | undefined {
  return MENS_DEMO_FLOOR.find((f) => f.asset.poster.includes(key))
}

function Frame({
  image,
  className,
  sizes,
}: {
  image: DemoImage
  className: string
  sizes: string
}) {
  return (
    <div className={className}>
      <picture>
        <source type="image/avif" srcSet={image.asset.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={image.asset.webpSrcSet} sizes={sizes} />
        <img
          src={image.asset.poster}
          alt={image.alt}
          width={image.asset.intrinsicWidth}
          height={image.asset.intrinsicHeight}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  )
}

export function MensChapter() {
  const lead = MENS_DEMO_PRODUCTS.find((p) => p.slug === 'indigo-trucker-jacket')?.media[1]
  const inset = frame('floor-cuffing-barn')

  if (!lead) return null

  return (
    <section className="container section" aria-labelledby="mens-chapter-heading">
      <div className="story">
        <Frame image={lead} className="story__lead" sizes="(min-width: 62rem) 55vw, 100vw" />

        {inset ? (
          <Frame image={inset} className="story__inset" sizes="(min-width: 62rem) 28vw, 60vw" />
        ) : null}

        <div className="story__copy">
          <p className="eyebrow">The direction · demonstration</p>
          <h2 id="mens-chapter-heading" className="story__headline">
            The West,
            <br />
            worn plainly.
          </h2>
          <p className="story__lede">
            Denim that expects a full day. Snaps that take a knock. A jacket that goes on last
            and comes off never.
          </p>
          <p className="story__badge">Not a published line · fixtures · no prices</p>
          <Link href="/mens" className="button story__cta">
            Walk the men&rsquo;s floor
          </Link>
        </div>
      </div>
    </section>
  )
}
