import Link from 'next/link'
import type { MediaRef } from '@/domain/product'
import { EditorialMedia } from '@/ui/product-media'

/**
 * WAYS IN — the front page's link garden.
 *
 * Burberry closes its homepage with a 754 px band of three photographs and a column of
 * plain links: every route into the site, once, at the bottom, after the shopping is done
 * (docs/research/teardown-burberry-gstar-vero.md §1.2). This is that band.
 *
 * It replaces four: the identity edits (1,771 px), the material wall (1,834 px), the
 * five-frame drop (1,553 px) and the two-frame campaign story (1,269 px) — 6,400 px of
 * the front page that each said "here is a way in" at the length of a destination. Each of
 * them still exists in full, on the route this band links to. The front page's job is to
 * reach a garment in one screen and then hand off; this is the hand-off.
 *
 * The category tiles are the shippable taxonomy and stay real, crawlable
 * `/shop/[category]` links — the flag-off homepage assertion, the no-JS assertion and the
 * sitemap all depend on them being here. The text links are every editorial surface,
 * named by what a person finds there rather than by what the component is called.
 */
export function WaysIn({
  categories,
  womens,
}: {
  womens: readonly {
    slug: string
    label: string
    blurb: string
    media?: MediaRef | undefined
  }[]
  categories: readonly {
    slug: string
    label: string
    blurb: string
    media?: MediaRef | undefined
  }[]
}) {
  return (
    <section className="container section ways-in" aria-labelledby="ways-in-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">The line</p>
          <h2 id="ways-in-heading">Shop by category</h2>
        </div>
      </div>

      {/*
        THE FOUR MEN'S CARDS. One owner-generated render per category, placed under the
        names `shop-category-mens-*` and mounted here one to one, nowhere else. The picture
        fills the card; the title, line and destination stay live HTML on a scrim; the
        image drifts a few percent on hover and not at all under reduced motion. Same card
        box for all four, each image's own composition inside it — `object-position` per
        card is deliberate, the figure or the object sits where the render put it.
      */}
      <ul className="line-cards">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/shop/${category.slug}`} className="line-card">
              {category.media ? (
                <span className="line-card__media">
                  <EditorialMedia
                    media={category.media}
                    sizes="(min-width: 62rem) 25vw, 50vw"
                  />
                </span>
              ) : null}
              <span className="line-card__body">
                <span className="line-card__name">{category.label}</span>
                <span className="line-card__line">{category.blurb}</span>
              </span>
              <span className="plate-note plate-note--card" aria-hidden="true">
                Generated artwork
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Editorial destinations prefetch on demand; the category tiles above are shop
          paths and keep theirs. See site-footer for the measurement. */}
      {/* The business today: the verified women's line, on its own owner-approved
          photography — never the men's renders. */}
      <div className="west-taxonomy">
        <h3 className="west-taxonomy__title">Women&rsquo;s line — the business today</h3>
        <ul className="west-taxonomy__list">
          {womens.map((category) => (
            <li key={category.slug}>
              <Link href={`/shop/${category.slug}`} className="west-taxonomy__link">
                {category.media ? (
                  <span className="west-taxonomy__media">
                    <EditorialMedia
                      media={category.media}
                      sizes="(min-width: 62rem) 25vw, 33vw"
                    />
                  </span>
                ) : null}
                <span className="west-taxonomy__name">{category.label}</span>
                <span className="meta">{category.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <nav className="ways-in__routes" aria-label="More of the house">
        <ul>
          <li>
            <Link prefetch={false} href="/edit">
              Choose your west — the edits
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/film">
              The house, on film
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/material">
              Legible at close range
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/thread-to-trade">
              One chain, end to end
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/warehouse">
              Walk the Warehouse
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/denim-guide">
              The denim guide
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  )
}
