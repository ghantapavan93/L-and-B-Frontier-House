import Link from 'next/link'
import {
  atmospherePlate,
  CATEGORY_TILE_FALLBACK,
  MATERIAL_PLATE,
  PLACE_PLATE,
} from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { navigableCategories } from '@/domain/taxonomy'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { populatedEdits } from '@/domain/edits'
import { ChooseYourWest } from '@/ui/choose-your-west'
import { ContactSheet } from '@/ui/contact-sheet'
import { FrontierIgnition } from '@/ui/frontier-ignition'
import { FixtureNotice } from '@/ui/notices'
import { ProductCard, ProductGrid } from '@/ui/product-card'
import { EditorialMedia } from '@/ui/product-media'
import { ProductWorlds } from '@/ui/product-worlds'
import { ThisWeekBand, MotionClipBand } from '@/ui/this-week'
import { ThreadToTrade, ThreadToTradeJourney } from '@/ui/thread-to-trade'

/**
 * PUBLIC HOMEPAGE — cinematic, poster-first.
 *
 * Composed against V3 Frame 6 and the applied Stitch theme: full-viewport hero with the
 * headline at `display-xl` over the photograph, 120px section rhythm, asymmetric editorial
 * blocks that deliberately break the grid, and a Living Contact Sheet where a conventional
 * catalogue would put a uniform product row.
 *
 * Everything here is server-rendered semantic HTML. No canvas, no WebGL, no client
 * JavaScript, no autoplaying media. Depth is CSS; the stitch line is SVG. Remove the motion
 * entirely and the page is complete — which is the invariant Phase 3 must not break.
 */
export default async function HomePage() {
  const frontier = frontierEnabled()
  const newest = await listPublicProducts({ sort: 'newest' })
  const featured = newest.slice(0, 4)
  const [lead, ...supporting] = featured
  const sheet = newest.slice(0, 9)

  const hero = officialMediaForSlot(
    'homepage-hero',
    'Five models photographed side by side in Lucky & Blessed western looks',
  )
  const heroPortrait = officialMediaForSlot(
    'homepage-hero-portrait',
    'A model in a cream western-scenic printed midi dress with a concho belt and straw hat',
  )
  /*
    The editorial bands take campaign plates rather than catalogue shots.

    Both slots wanted a full-bleed photograph and were being handed a 360x540 product image
    upscaled to fill it — which is the single thing the audit says caps perceived quality
    across the whole site. These are 1408px and were composed as photographs. Neither is a
    product; both carry `generated-campaign` provenance.
  */
  const craftDetail = MATERIAL_PLATE
  const extendedSizing = PLACE_PLATE

  return (
    <>
      {/*
        ONE opening statement, not two.

        These were previously stacked: the ignition ran full-viewport, then handed over to
        a second full-viewport hero carrying the headline over a photograph. Both said the
        same thing, one after the other, and the photograph loaded eagerly behind a film
        that covered it. The cinematic path now carries the headline itself; the
        photographic hero is what ships when the flag is off, unchanged.
      */}
      {frontier ? (
        <FrontierIgnition />
      ) : (
        <section id="hero" className={hero ? 'hero hero--photographic' : 'hero'}>
          {hero ? (
            <div className="hero__media depth-far" aria-hidden="true">
              <EditorialMedia media={hero} portrait={heroPortrait} priority sizes="100vw" />
            </div>
          ) : (
            <>
              <div className="hero__atmosphere" aria-hidden="true" />
              <div className="hero__grain" aria-hidden="true" />
            </>
          )}

          <div className="hero__inner depth-near">
            <p className="eyebrow">Wholesale · Texas</p>
            <h1>Western apparel, made for the boutiques that sell it.</h1>
            <p>
              Howdy. We are a manufacturer and designer from the heart of Texas, and we sell to
              approved retailers. Sign in to see your pricing, or apply for an account and be
              approved in typically less than one business day.
            </p>
            <div className="cluster">
              <Link href="/new-arrivals" className="button button--secondary">
                See new arrivals
              </Link>
              <Link href="/wholesale" className="button button--secondary">
                How wholesale works
              </Link>
            </div>
          </div>

          {hero ? null : <p className="hero__pending">Campaign photography pending</p>}
        </section>
      )}

      {/*
        The measured homepage cadence: film, then the drop as five frames at five scales,
        then reserved motion, then the sheet, then identity. Imagery leads every band and
        the type stays quiet — that is the whole finding of the teardown.
      */}
      <ThisWeekBand products={newest} />

      <MotionClipBand />

      <ContactSheet
        products={sheet}
        eyebrow="The drop"
        title="This week's sheet"
        href="/new-arrivals"
        linkLabel="Open the full sheet"
        stories={frontier}
      />

      {/*
        Identity before taxonomy. Someone arriving from a search or a post is asking "is
        this for me", and a row of category tiles cannot answer that. The category grid
        still ships below — this is a way in, never a replacement for it.
      */}
      <ChooseYourWest edits={populatedEdits(newest)} products={newest} />

      {craftDetail ? (
        <section className="container section" aria-labelledby="craft-heading">
          <div className="editorial-split">
            <figure className="editorial-split__figure depth-far">
              <EditorialMedia media={craftDetail} sizes="(min-width: 62rem) 55vw, 100vw" />
              {/* Names what the plate actually shows, and that it is generated. The old
                  caption described a garment — which this image is not, and must not be
                  read as. */}
              <figcaption>Denim, leather and hardware · campaign imagery</figcaption>
            </figure>
            <div>
              <p className="eyebrow">The making</p>
              <h2 id="craft-heading">Legible at close range.</h2>
              <p className="lede">
                Buck stitch, pearl snaps, a swirl worked into the leg. The detail is the
                argument, so we photograph close enough that you can see the thread.
              </p>
              <Link href="/new-arrivals" className="text-link">
                See what just landed
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container section" aria-labelledby="new-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">New arrivals</p>
            <h2 id="new-heading">Just landed</h2>
          </div>
          <Link href="/new-arrivals" className="text-link">
            View all
          </Link>
        </div>

        {lead ? (
          <div className="feature-row">
            <div className="feature-row__lead">
              <ProductCard product={lead} priority sizes="(min-width: 62rem) 50vw, 100vw" />
            </div>
            <ul className="product-grid product-grid--supporting">
              {supporting.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} sizes="(min-width: 62rem) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ProductGrid products={featured} emptyMessage="No new arrivals are published yet." />
        )}
      </section>

      {/*
        FIT AS A FEATURE — the finder's front door. Three questions instead of seventy
        thumbnails; the page behind it is honest filtering over published garment facts.
      */}
      <section className="container section--tight" aria-labelledby="fit-heading">
        <div className="panel fit-teaser">
          <div>
            <p className="eyebrow">Fit</p>
            <h2 id="fit-heading">Find your denim</h2>
            <p className="meta">
              Silhouette, wash, stretch — answer what you know and see the pairs that match.
            </p>
          </div>
          <Link href="/find-your-denim" className="button">
            Start
          </Link>
        </div>
      </section>

      {extendedSizing ? (
        <section className="container section" aria-labelledby="sizing-heading">
          <div className="editorial-split editorial-split--reverse">
            <figure className="editorial-split__figure depth-far">
              <EditorialMedia media={extendedSizing} sizes="(min-width: 62rem) 45vw, 100vw" />
              <figcaption>The high desert · campaign imagery</figcaption>
            </figure>
            <div>
              <p className="eyebrow">Sizing</p>
              <h2 id="sizing-heading">One garment. One size range.</h2>
              <p className="lede">
                Extended sizing is a range on the same style, not a separate catalogue. Every
                measurement is published as text you can read, search and hear.
              </p>
              <Link href="/size-and-fit/women" className="text-link">
                Size and fit
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {frontier ? <ThreadToTradeJourney /> : <ThreadToTrade />}

      {frontier ? (
        <ProductWorlds />
      ) : (
        <section className="container section" aria-labelledby="shop-heading">
          <div className="section-head">
            <div>
              <p className="eyebrow">The line</p>
              <h2 id="shop-heading">Shop by category</h2>
            </div>
          </div>
          <ul className="category-grid">
            {navigableCategories().map((category) => {
              /* Owner photography when it exists; a cleared material plate until then —
                 an imageless tile reads as a broken one, and material claims no garment. */
              const tile =
                officialMediaForSlot(`category-${category.slug}`) ??
                CATEGORY_TILE_FALLBACK[category.slug]
              return (
                <li key={category.slug}>
                  <article className="category-card">
                    <Link href={`/shop/${category.slug}`} className="category-card__link">
                      {tile ? (
                        <div className="category-card__media">
                          <EditorialMedia
                            media={tile}
                            sizes="(min-width: 62rem) 33vw, (min-width: 48rem) 50vw, 100vw"
                          />
                        </div>
                      ) : null}
                      <h3>{category.label}</h3>
                    </Link>
                    <p className="meta">{category.blurb}</p>
                  </article>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* The door to the signature interaction: one aisle, every rack, native scroll. */}
      <section className="container section--tight" aria-labelledby="warehouse-heading">
        <div className="warehouse-teaser">
          {/* The aisle itself, behind the invitation — a door you can see through. */}
          <div className="warehouse-teaser__media" aria-hidden="true">
            <EditorialMedia media={atmospherePlate('warehouse-aisle')} sizes="100vw" />
          </div>
          <div>
            <p className="eyebrow" style={{ color: 'var(--text-meta-on-inverse)' }}>
              One aisle
            </p>
            <h2 id="warehouse-heading">Walk the Warehouse</h2>
            <p className="meta">
              Every rack in the line, hung in one horizontal aisle. Hover a garment and it comes
              forward.
            </p>
          </div>
          <Link href="/warehouse" className="button button--secondary">
            Enter
          </Link>
        </div>
      </section>

      <section className="container section" aria-labelledby="ops-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">Operations</p>
            <h2 id="ops-heading">How we ship</h2>
          </div>
        </div>

        <div className="panel">
          <dl className="definition-list">
            <dt>Fill rate</dt>
            <dd>100% of orders filled complete.</dd>

            <dt>Processing</dt>
            <dd>
              2.64 days on average. Order by 5pm CST and we ship same or next business day.
            </dd>

            <dt>Minimum</dt>
            <dd>$50 per order. Prepacks of 6.</dd>

            <dt>Showroom</dt>
            <dd>#13656, Dallas Market Center. Markets August 18–21 and October 20–23, 2026.</dd>
          </dl>
        </div>
      </section>

      <section className="container section--tight">
        <FixtureNotice />
      </section>
    </>
  )
}
