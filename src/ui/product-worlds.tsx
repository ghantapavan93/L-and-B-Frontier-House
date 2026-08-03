import Link from 'next/link'
import { officialMediaForSlot } from '@/content/media/official-media'
import { EditorialMedia } from './product-media'

/**
 * ONE WEST — PRODUCT WORLDS.
 *
 * V3 Frame 5's gateway and V3.1 12F's depth carousel, inspected over MCP, rebuilt without
 * their one fatal flaw: the exported Frame 5 gates on FOR HIM, and menswear does not exist.
 * The worlds here are the four verified launch destinations only — Women, Girls,
 * Accessories, Wholesale (D-03, D-04). No Men, no footwear, no AR, no Home.
 *
 * Desktop: four tall panels on offset horizons, adjacent worlds visible, per Frame 5.
 * Mobile: a scroll-snap 2.5D carousel per 12F — side slides recede via scroll-driven scale
 * behind `@supports`, and previous/next/dots are ANCHOR LINKS, so navigation is keyboard
 * and tap operable and never swipe-only. All of it works with JavaScript disabled.
 */

const WORLDS = [
  {
    id: 'world-women',
    slug: 'women',
    href: '/shop/women',
    name: 'Women',
    line: 'The line, in straight and extended sizing.',
    slot: 'category-women',
    alt: 'A model in a light-wash denim mini skirt and horseshoe-print tank against a dark brick wall',
  },
  {
    id: 'world-girls',
    slug: 'girls',
    href: '/shop/girls',
    name: 'Girls',
    line: 'Western apparel for girls.',
    slot: 'category-girls',
    alt: 'A young model photographed full length in a western look on a storefront street',
  },
  {
    id: 'world-accessories',
    slug: 'accessories',
    href: '/shop/accessories',
    name: 'Accessories',
    line: 'Belts, bags, bows and jewellery.',
    slot: 'category-accessories',
    alt: 'A model photographed full length in a western look with accessories',
  },
  {
    id: 'world-wholesale',
    slug: 'wholesale',
    href: '/wholesale',
    name: 'Wholesale',
    line: 'Pricing, packs and ordering for approved retailers.',
    slot: 'wholesale',
    alt: 'A model photographed full length in a western look on a storefront street',
  },
] as const

export function ProductWorlds() {
  return (
    <section className="container section worlds" aria-labelledby="worlds-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">One west</p>
          <h2 id="worlds-heading">Four worlds</h2>
        </div>
      </div>

      <ul className="worlds__track">
        {WORLDS.map((world) => {
          const media = officialMediaForSlot(world.slot, world.alt)
          return (
            <li className="worlds__world" key={world.id} id={world.id}>
              <Link href={world.href} className="worlds__card">
                <div className="worlds__media">
                  {media ? (
                    <EditorialMedia media={media} sizes="(min-width: 62rem) 25vw, 84vw" />
                  ) : null}
                </div>
                <span className="worlds__label">
                  <span className="worlds__name">{world.name}</span>
                  <span className="worlds__line">{world.line}</span>
                  <span className="worlds__enter">Enter</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/*
        Mobile navigation: one anchor per world into the scroll-snap track — a superset of
        previous/next, since any adjacent world is one tap or one Tab away, and it needs no
        JavaScript to know which slide is current. Never swipe-only.
      */}
      <nav className="worlds__nav" aria-label="Product worlds">
        {WORLDS.map((world) => (
          <a key={world.id} href={`#${world.id}`} aria-label={`Go to the ${world.name} world`}>
            {world.name}
          </a>
        ))}
      </nav>
    </section>
  )
}
