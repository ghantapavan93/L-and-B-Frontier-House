import Link from 'next/link'
import {
  atmospherePlate,
  CATEGORY_TILE_FALLBACK,
  PLACE_PLATE,
} from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { navigableCategories } from '@/domain/taxonomy'
import { frontierEnabled } from '@/features/experience/frontier-flag'
import { populatedEdits } from '@/domain/edits'
import { CampaignFilm } from '@/ui/campaign-film'
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
  /*
    The sizing band takes a campaign plate rather than a catalogue shot.

    The slot wants a full-bleed photograph and was being handed a 360x540 product image
    upscaled to fill it — the single thing the audit says caps perceived quality across the
    whole site. This one is 1408px and was composed as a photograph. It is not a product and
    carries `generated-campaign` provenance. The making band's plates moved into
    `MaterialWall`, which owns them now.
  */
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
      {/*
        THE HOUSE LEADS, THE STORE FOLLOWS.

        The page opens as a men's western house — the collection grid, the marquee, the
        campaign story — and only then becomes a shop. The commerce bands below are
        unchanged and still carry the real, shippable catalogue; what moved is the order,
        because a fashion house that opens on a product row is a catalogue with a hero.
      */}
      {/*
        THE FILM, SECOND ONLY TO THE HERO — and expanding on native scroll.

        The owner asked for the reference scroll-expansion hero. The reference implements
        it by intercepting the wheel (`preventDefault` on every wheel event) and autoplaying
        a looping film — the two things §9 and WCAG 2.2.2 categorically bar. The effect
        ships anyway, legally: the frame scales up as the section travels through the
        viewport via CSS `animation-timeline: view()`, reading native scroll and never
        touching the wheel; the film itself still plays only on a click. No support, no
        motion preference → the frame simply renders at full size.
      */}
      <CampaignFilm />

      {frontier ? <ProductWorlds /> : null}

      <FitGateway />

      <HouseMarquee />

      <MensChapter />

      <ThisWeekBand products={newest} />

      <SplitCampaign />

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
        The making band carries six photographs now instead of one. Burberry runs eight
        images in a 799px editorial band; this ran one in 726px, which is the whole density
        gap in a single measurement (docs/research/teardown-burberry-gstar-vero.md §1.2).
        The claim "legible at close range" is now made by the pictures rather than by the
        sentence above them.
      */}
      <MaterialWall />

      {/*
        TWO BANDS REMOVED HERE, AND NOTHING LOST WITH THEM.

        A "Just landed" feature row stood here, drawing `newest.slice(0, 4)` — the same
        query, the same products and the same "everything new" destination as the This Week
        band six bands above it, rendered as a plainer grid. Below it sat a fit teaser
        offering the two links the Fit Gateway band already carries.

        The measurement that condemned them: three bands were saying "here is new product"
        and three more were saying "here is a way in", against Burberry's two and one, on a
        page running 27.9 screens to their 6.8
        (docs/research/teardown-burberry-gstar-vero.md §0). The reference does not win by
        having better product rows. It wins by having fewer of them, with more photography
        in each.

        `/new-arrivals` keeps every one of these garments, This Week links to it, and the
        Fit Passport link moved into the Fit Gateway head.
      */}

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

      {/*
        The shippable taxonomy moved up into Choose Your West rather than holding a band of
        its own. Identity ("who is it for") and taxonomy ("what is it") are one decision, and
        the reference carries that decision inside a single band with a segmented control
        instead of spending 168px of section rhythm on a second heading. Same three
        crawlable /shop/[category] links, same photography, one band.
      */}

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
