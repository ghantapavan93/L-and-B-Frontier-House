import Link from 'next/link'
import { atmospherePlate, CATEGORY_TILE_FALLBACK } from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { navigableCategories } from '@/domain/taxonomy'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { populatedEdits } from '@/domain/edits'
import { FitGateway } from '@/ui/fit-gateway'
import { ChooseYourWest } from '@/ui/choose-your-west'
import { ContactSheet } from '@/ui/contact-sheet'
import { FrontierIgnition } from '@/ui/frontier-ignition'
import { HouseMarquee } from '@/ui/house-marquee'
import { MaterialWall } from '@/ui/material-wall'
import { HouseStrip, SplitCampaign } from '@/ui/house-strip'
import { MensChapter } from '@/ui/mens-chapter'
import { FixtureNotice } from '@/ui/notices'
import { EditorialMedia } from '@/ui/product-media'
import { ThisWeekBand } from '@/ui/this-week'
import { ThreadToTrade } from '@/ui/thread-to-trade'

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

      <SplitCampaign />

      <FitGateway />

      {/*
        The making band carries six photographs now instead of one. Burberry runs eight
        images in a 799px editorial band; this ran one in 726px, which is the whole density
        gap in a single measurement (docs/research/teardown-burberry-gstar-vero.md §1.2).
        The claim "legible at close range" is now made by the pictures rather than by the
        sentence above them.
      */}
      <MaterialWall />

      {/*
        The second product band draws the NEXT five, not the same five. It and the sheet
        used to overlap on newest[0..5] — two bands, nine distinct garments, five of them
        shown twice. Burberry's two rails carry different product. Now fourteen distinct
        garments reach the front page instead of nine, for no extra length.
      */}
      <ThisWeekBand products={newest.slice(9)} />

      <HouseMarquee />

      {/* The demonstration, after the commerce it must never be mistaken for. */}
      <MensChapter />

      {/*
        Identity before taxonomy. Someone arriving from a search or a post is asking "is
        this for me", and a row of category tiles cannot answer that. The category grid
        still ships below — this is a way in, never a replacement for it.
      */}
      <ChooseYourWest
        edits={populatedEdits(newest)}
        products={newest}
        categories={navigableCategories().map((category) => ({
          ...category,
          /* Owner photography when it exists; a cleared material plate until then — an
             imageless tile reads as a broken one, and material claims no garment. */
          media:
            officialMediaForSlot(`category-${category.slug}`) ??
            CATEGORY_TILE_FALLBACK[category.slug],
        }))}
      />

      {/*
        The five-column summary says the verified fact in one band. The journey — five
        stages, a routing thread, a sticky chapter rail, 3,450 px of it — lives at
        /thread-to-trade now, where someone who wants it can arrive at it directly instead
        of finding it on screen nineteen.
      */}
      <ThreadToTrade />
      <section className="container section--tight" aria-label="The full chain">
        <p className="meta">
          <Link href="/thread-to-trade" className="text-link">
            Walk the whole chain, stage by stage
          </Link>
          {' · '}
          <Link href="/film" className="text-link">
            The house, on film
          </Link>
        </p>
      </section>

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

      <HouseStrip />

      <section className="container section--tight">
        <FixtureNotice />
      </section>
    </>
  )
}
