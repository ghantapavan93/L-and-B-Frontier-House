import Link from 'next/link'
import { MENS_DEMO_FLOOR, MENS_DEMO_PRODUCTS } from '@/fixtures/mens-demo'
import type { DemoImage } from '@/fixtures/mens-demo'

/**
 * ONE WEST — FOUR WORLDS, rebuilt as the men's collection grid.
 *
 * The section keeps its name and its slot on the page; what changed is what it is FOR.
 * Frontier House is the men's direction, so the four worlds are now the four men's
 * collections — Denim, Shirts, Outerwear, Accessories — presented the way a fashion house
 * presents a collection: two columns, photography edge to edge, a single word of type over
 * it, the whole tile interactive.
 *
 * What keeps it honest, and what must not be edited away: every tile opens the `/mens`
 * demonstration (a `noindex` page, outside the catalogue, no prices), the section carries a
 * visible DEMONSTRATION marker, and no tile states a price, a size or availability. The
 * real, shippable taxonomy — Women, Girls, Accessories — keeps its own grid lower on the
 * page. This proposes a business; it does not claim one.
 */

type World = {
  readonly id: string
  readonly href: string
  readonly name: string
  readonly line: string
  readonly image: DemoImage | undefined
}

function productFrame(slug: string, index = 0): DemoImage | undefined {
  return MENS_DEMO_PRODUCTS.find((p) => p.slug === slug)?.media[index]
}

function floorFrame(key: string): DemoImage | undefined {
  return MENS_DEMO_FLOOR.find((frame) => frame.asset.poster.includes(key))
}

const WORLDS: readonly World[] = [
  {
    id: 'world-denim',
    href: '/mens#mens-denim',
    name: 'Denim',
    line: 'Rigid, washed, cut for a boot.',
    /* A full-length look leads the grid — the lower-body crops read as detail, and the
       first tile has to carry a person. */
    image: floorFrame('floor-light-jean-worn'),
  },
  {
    id: 'world-shirts',
    href: '/mens#mens-shirts',
    name: 'Shirts',
    line: 'Snap fronts and long sleeves.',
    image: productFrame('stripe-pearl-snap-shirt'),
  },
  {
    id: 'world-outerwear',
    href: '/mens#mens-outerwear',
    name: 'Outerwear',
    line: 'Denim that goes on last.',
    image: productFrame('indigo-trucker-jacket'),
  },
  {
    id: 'world-accessories',
    href: '/mens#mens-accessories',
    name: 'Accessories',
    line: 'Leather, hardware, weight.',
    image: floorFrame('floor-waist-detail'),
  },
]

export function ProductWorlds() {
  return (
    <section className="container section worlds" aria-labelledby="worlds-heading">
      <div className="section-head worlds__head">
        <div>
          <p className="eyebrow">One west</p>
          <h2 id="worlds-heading">Four worlds</h2>
        </div>
        {/* The label travels with the imagery — the photography is persuasive and the
            line is not published (D-03). */}
        <p className="worlds__marker">Men&rsquo;s · demonstration · no prices</p>
      </div>

      <ul className="worlds__grid">
        {WORLDS.map((world) => (
          <li className="worlds__world" key={world.id} id={world.id}>
            <Link href={world.href} className="worlds__card">
              {world.image ? (
                <picture>
                  <source
                    type="image/avif"
                    srcSet={world.image.asset.avifSrcSet}
                    sizes="(min-width: 48rem) 50vw, 100vw"
                  />
                  <source
                    type="image/webp"
                    srcSet={world.image.asset.webpSrcSet}
                    sizes="(min-width: 48rem) 50vw, 100vw"
                  />
                  <img
                    src={world.image.asset.poster}
                    alt={world.image.alt}
                    width={world.image.asset.intrinsicWidth}
                    height={world.image.asset.intrinsicHeight}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              ) : null}
              <span className="worlds__label">
                <span className="worlds__name">{world.name}</span>
                <span className="worlds__line">{world.line}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
