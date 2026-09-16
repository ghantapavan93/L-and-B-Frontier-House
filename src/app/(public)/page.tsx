import Link from 'next/link'
import { atmospherePlate, CATEGORY_TILE_FALLBACK } from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import {
  navigableCategories,
  routableCategories,
  womensLineCategories,
} from '@/domain/taxonomy'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { FitGateway } from '@/ui/fit-gateway'
import { ContactSheet } from '@/ui/contact-sheet'
import { FrontierIgnition } from '@/ui/frontier-ignition'
import { HouseMarquee } from '@/ui/house-marquee'
import { HouseStrip } from '@/ui/house-strip'
import { FixtureNotice } from '@/ui/notices'
import { EditorialMedia } from '@/ui/product-media'
import { ThreadToTrade } from '@/ui/thread-to-trade'
import { LineRail } from '@/ui/line-rail'
import { OperationsCards } from '@/ui/operations-cards'
import { WaysIn } from '@/ui/ways-in'

/**
 * PUBLIC HOMEPAGE — cinematic, poster-first.
 *
 * Composed against V3 Frame 6 and the applied Stitch theme: full-viewport hero with the
 * headline at `display-xl` over the photograph, 120px section rhythm, asymmetric editorial
 * blocks that deliberately break the grid, and a Living Contact Sheet where a conventional
 * catalogue would put a uniform product row.
 *
 * Everything here is server-rendered semantic HTML. No canvas, no WebGL, no autoplaying
 * media. Depth is CSS plus two Framer Motion islands (the motion-stack rule, CLAUDE.md
 * section 9) that publish spring values as CSS vars above unchanged server children.
 * Remove the motion entirely and the page is complete — the invariant that must not break.
 */
export default async function HomePage() {
  const frontier = frontierEnabled()
  const newest = await listPublicProducts({ sort: 'newest' })
  const sheet = newest.slice(0, 9)

  /*
    The second rail carries what the first does not. Every garment in the sheet is
    excluded from every panel, so the two rails together put the most distinct product on
    the front page the catalogue allows — the reference's two rails are two different
    groupings, never the same eight twice.
  */
  const inSheet = new Set(sheet.map((product) => product.slug))
  const line = routableCategories().map((category) => {
    const all = newest.filter((product) => product.categorySlug === category.slug)
    return {
      category,
      products: all.filter((product) => !inSheet.has(product.slug)).slice(0, 8),
      total: all.length,
    }
  })

  const hero = officialMediaForSlot(
    'homepage-hero',
    'Five models photographed side by side in Lucky & Blessed western looks',
  )
  const heroPortrait = officialMediaForSlot(
    'homepage-hero-portrait',
    'A model in a cream western-scenic printed midi dress with a concho belt and straw hat',
  )
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
        THE FRONT PAGE, NOT THE WHOLE JOURNEY.

        This page was twenty-five screens long at 1440 wide — 22,241 px against Burberry's
        6,150 — and the first product link sat 6,200 px down, behind five bands and nearly
        seven screens of "the house". The comments above each band said the right things
        about density; the measurement said the page was still built as length.

        The constitution's own rule is the fix: "most visitors arrive from search or social
        into the middle of this journey. Every surface must stand alone" (§6). The approved
        journey is a SET of surfaces, and this page had been built as all of them stacked.
        So the film has its own route (/film), the five-stage chain has its own route
        (/thread-to-trade), the men's collection index moved onto /mens where its anchors
        resolve, and the sizing band went — the Fit Gateway already carries the link.

        What is left is the reference's rhythm — story · shop · story · shop — with the
        densest product band second, one screen under the hero, where Burberry puts theirs.
        Every band that left the page kept every pixel of itself; it just gained a URL.
      */}

      {/* Shop first: nine garments, two frames each, before any more of the house. */}
      <ContactSheet
        products={sheet}
        eyebrow="The drop"
        title="This week's sheet"
        href="/new-arrivals"
        linkLabel="Open the full sheet"
        stories={frontier}
      />

      <FitGateway />

      <HouseMarquee />

      {/*
        The second shop rail. Story · shop · story · shop: the sheet was the first, the fit
        gateway and the marquee sat between, and this is the second — different garments,
        grouped by the shippable taxonomy, with the switch inside the rail.
      */}
      <LineRail panels={line} />

      {/*
        The five-column summary says the verified fact in one band. The journey — five
        stages, a routing thread, a sticky chapter rail, 3,450 px of it — lives at
        /thread-to-trade, where someone who wants it can arrive at it directly.
      */}
      <ThreadToTrade />

      {/*
        FOUR BANDS BECAME ONE LINK GARDEN, AND EACH OF THE FOUR KEPT ITS PAGE.

        The identity edits, the material wall, the five-frame drop and the two-frame
        campaign story — 6,400 px between them — each said "here is a way in" at the length
        of a destination. They are destinations now: /edit, /material, /film. What the front
        page keeps is what Burberry keeps at the bottom of theirs — the category tiles and
        a column of plain links — because a front page that has already shown fourteen
        garments has done its job, and the rest of the house is one click, not one scroll.
      */}
      <WaysIn
        womens={womensLineCategories().map((category) => ({
          ...category,
          media:
            officialMediaForSlot(`category-${category.slug}`) ??
            CATEGORY_TILE_FALLBACK[category.slug],
        }))}
        categories={navigableCategories().map((category) => ({
          ...category,
          /* Owner photography when it exists; a cleared material plate until then — an
             imageless tile reads as a broken one, and material claims no garment. */
          media:
            officialMediaForSlot(`category-${category.slug}`) ??
            CATEGORY_TILE_FALLBACK[category.slug],
        }))}
      />

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

      <OperationsCards />

      <HouseStrip />

      <section className="container section--tight">
        <FixtureNotice />
      </section>
    </>
  )
}
