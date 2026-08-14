import { Fragment } from 'react'
import Link from 'next/link'
import { GRID_BREAK_PLATES } from '@/content/media/campaign-plates'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import type { MediaRef, PublicProduct, VisibleProduct } from '@/domain/product'
import { SIZE_RANGE_LABELS } from '@/domain/size'
import { EditorialMedia, ProductMedia } from './product-media'

/**
 * How many garments run before the grid is interrupted.
 *
 * Twelve is three full rows at the four-column desktop width and six at the two-column
 * phone width — far enough to feel like a run, short enough that the break still lands
 * on the first screen or two of scrolling.
 */
const GRID_BREAK_EVERY = 12

/**
 * The second photograph, if the product honestly has one.
 *
 * Every reference card swaps to an alternate view on hover. This build shows the swap ONLY
 * where a real second image exists — a placeholder behind a hover would be fake motion, and
 * most of the catalogue is one 360×540 shot deep. The capability ships now; it lights up
 * per product as the owner's photography arrives.
 */
function hoverMedia(product: PublicProduct): MediaRef | undefined {
  const alt = product.media[1]
  if (!alt || alt.kind !== 'image') return undefined
  if (alt.provenance === 'generated-placeholder') return undefined
  return alt
}

/**
 * The card takes the PUBLIC product shape only.
 *
 * That is a deliberate type-level constraint, not a convention: a listing surface cannot
 * render a wholesale price even by mistake, because the value is not in the object it
 * receives. Authorised pricing appears on the authorised detail route, never in a grid.
 *
 * The media and name are one link. Quick view is a sibling anchor — never nested inside
 * the product link — and renders only when the surrounding grid actually carries the
 * overlay it points at. No essential information is revealed only on hover.
 */
export function ProductCard({
  product,
  priority = false,
  sizes,
  quickView = false,
}: {
  product: PublicProduct
  priority?: boolean
  sizes?: string
  quickView?: boolean
}) {
  const media = primaryMedia(product)
  const alt = hoverMedia(product)
  const ranges = product.sizeRanges.filter((r) => r.availability !== 'unavailable')

  return (
    <article className="product-card">
      {/*
        A plain <a>, not <Link>, deliberately: a real document navigation is what lets the
        cross-document view transition fire, so the card's photograph MORPHS into the
        product page's opening image (`@view-transition` in globals, zero JavaScript).
        Client-side routing would need an experimental React integration to do the same;
        a full navigation to a prerendered static page costs almost nothing here.
      */}
      <a href={`/product/${product.slug}`} className="product-card__link">
        {alt ? (
          <span className="product-card__swap">
            <ProductMedia
              media={media}
              priority={priority}
              transitionName={`p-${product.slug}`}
              {...(sizes ? { sizes } : {})}
            />
            {/* Decorative duplicate view — announcing it twice would be noise. */}
            <span aria-hidden="true" className="product-card__alt">
              <ProductMedia media={alt} {...(sizes ? { sizes } : {})} />
            </span>
          </span>
        ) : (
          <ProductMedia
            media={media}
            priority={priority}
            transitionName={`p-${product.slug}`}
            {...(sizes ? { sizes } : {})}
          />
        )}
        <h3 className="product-card__name">{product.displayName}</h3>
      </a>
      <p className="product-card__spec">{product.specName}</p>
      {/*
        DELIBERATELY ABSENT: the style number. Both trade-serving reference houses print
        it on the card, and the live business exposes its codes publicly in names and
        URLs — but OUR type files `sku` inside WholesaleTerms, the restricted shape, so
        rendering it here is impossible without moving a field across the security
        boundary. That relocation is a real decision (logged as W-5 in the wholesale
        teardown's register), not a rider on a card tweak. When it is made, the line is
        one element: `Style {product.styleCode}`.
      */}
      <div className="badge-row">
        <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
        {ranges.map((range) => (
          <span key={range.kind} className="badge badge--quiet">
            {SIZE_RANGE_LABELS[range.kind]}
          </span>
        ))}
      </div>
      {quickView ? (
        <a className="product-card__quick" href={`#qv-${product.slug}`}>
          Quick view<span className="visually-hidden"> — {product.displayName}</span>
        </a>
      ) : null}
    </article>
  )
}

/**
 * QUICK VIEW — the sheet-story mechanism pointed at the grid.
 *
 * Selection state is the URL hash, anchors are the keyboard path, and the page stays
 * static: `#qv-slug` shows the overlay via `:target`, Close returns to the card's own
 * anchor so scroll position survives. Zero JavaScript, so it cannot fail closed over the
 * content — a no-JS or failed-JS visitor gets the same overlay, and the product page
 * remains one click away throughout.
 */
function QuickView({ product }: { product: PublicProduct }) {
  const media = primaryMedia(product)
  const ranges = product.sizeRanges.filter((r) => r.availability !== 'unavailable')

  return (
    <article
      className="quick-view"
      id={`qv-${product.slug}`}
      tabIndex={-1}
      aria-label={`${product.displayName} — quick view`}
    >
      {/* Click-away close. Redundant with the Close control, hidden from the tree. */}
      <a
        className="quick-view__backdrop"
        href={`#p-${product.slug}`}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="quick-view__panel">
        <div className="quick-view__media">
          <ProductMedia media={media} sizes="(min-width: 62rem) 24rem, 90vw" />
        </div>
        <div className="quick-view__copy">
          <p className="eyebrow">{AVAILABILITY_LABELS[product.availability]}</p>
          <h3>{product.displayName}</h3>
          <p className="product-card__spec">{product.specName}</p>
          <p>{product.description}</p>
          <div className="badge-row">
            {ranges.map((range) => (
              <span key={range.kind} className="badge badge--quiet">
                {SIZE_RANGE_LABELS[range.kind]}
              </span>
            ))}
          </div>
          <div className="cluster">
            {/* Plain <a> so the document navigation carries the view-transition morph. */}
            <a href={`/product/${product.slug}`} className="button">
              View product
            </a>
            <a href={`#p-${product.slug}`} className="button button--secondary">
              Close
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({
  products,
  emptyMessage = 'No products match these filters.',
  quickView = false,
}: {
  products: readonly PublicProduct[]
  emptyMessage?: string
  /** Renders `:target` quick-view overlays after the grid and the per-card triggers. */
  quickView?: boolean
}) {
  if (products.length === 0) {
    return (
      <div className="state-block">
        <h2>Nothing here yet</h2>
        <p>{emptyMessage}</p>
        <Link href="/new-arrivals" className="button button--secondary">
          See all new arrivals
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul className="product-grid">
        {products.map((product, index) => (
          <Fragment key={product.id}>
            {/*
              An editorial break every twelve garments.

              Straight from the teardown: Sézane runs 953 products on one 48,199px scroll and
              it does not read as endless, because the run is interrupted. An uninterrupted
              grid past about a dozen rows stops being browsing and becomes a spreadsheet —
              the eye has nothing to land on and no sense of having travelled.

              It spans the full row rather than occupying a cell, so it reads as a pause in
              the run rather than as a garment that failed to load. Rendered from a campaign
              plate, so it carries no product claim — and it is skipped entirely when there is
              not enough behind it to be worth interrupting.
            */}
            {index > 0 && index % GRID_BREAK_EVERY === 0 ? (
              <li className="product-grid__break" aria-hidden="true">
                {/* A different macro each pause — repeated identical breaks read as a bug. */}
                <EditorialMedia
                  media={
                    GRID_BREAK_PLATES[
                      (index / GRID_BREAK_EVERY - 1) % GRID_BREAK_PLATES.length
                    ] ?? GRID_BREAK_PLATES[0]!
                  }
                  sizes="100vw"
                />
              </li>
            ) : null}

            <li id={quickView ? `p-${product.slug}` : undefined}>
              <ProductCard product={product} quickView={quickView} />
            </li>
          </Fragment>
        ))}
      </ul>
      {quickView
        ? products.map((product) => <QuickView key={product.id} product={product} />)
        : null}
    </>
  )
}

/** Narrows a visible product back to its public fields for a listing surface. */
export function toPublicView(product: VisibleProduct): PublicProduct {
  if (product.access === 'public') return product
  const { wholesale: _wholesale, access: _access, ...base } = product
  return { ...base, access: 'public' }
}
