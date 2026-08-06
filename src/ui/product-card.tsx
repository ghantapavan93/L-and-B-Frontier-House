import { Fragment } from 'react'
import Link from 'next/link'
import { MATERIAL_PLATE } from '@/content/media/campaign-plates'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import type { PublicProduct, VisibleProduct } from '@/domain/product'
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
 * The card takes the PUBLIC product shape only.
 *
 * That is a deliberate type-level constraint, not a convention: a listing surface cannot
 * render a wholesale price even by mistake, because the value is not in the object it
 * receives. Authorised pricing appears on the authorised detail route, never in a grid.
 *
 * The whole card is one link. Nothing is nested inside it, and no essential information is
 * revealed only on hover.
 */
export function ProductCard({
  product,
  priority = false,
  sizes,
}: {
  product: PublicProduct
  priority?: boolean
  sizes?: string
}) {
  const media = primaryMedia(product)
  const ranges = product.sizeRanges.filter((r) => r.availability !== 'unavailable')

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card__link">
        <ProductMedia media={media} priority={priority} {...(sizes ? { sizes } : {})} />
        <h3 className="product-card__name">{product.displayName}</h3>
      </Link>
      <p className="product-card__spec">{product.specName}</p>
      <div className="badge-row">
        <span className="badge">{AVAILABILITY_LABELS[product.availability]}</span>
        {ranges.map((range) => (
          <span key={range.kind} className="badge badge--quiet">
            {SIZE_RANGE_LABELS[range.kind]}
          </span>
        ))}
      </div>
    </article>
  )
}

export function ProductGrid({
  products,
  emptyMessage = 'No products match these filters.',
}: {
  products: readonly PublicProduct[]
  emptyMessage?: string
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
              <EditorialMedia media={MATERIAL_PLATE} sizes="100vw" />
            </li>
          ) : null}

          <li>
            <ProductCard product={product} />
          </li>
        </Fragment>
      ))}
    </ul>
  )
}

/** Narrows a visible product back to its public fields for a listing surface. */
export function toPublicView(product: VisibleProduct): PublicProduct {
  if (product.access === 'public') return product
  const { wholesale: _wholesale, access: _access, ...base } = product
  return { ...base, access: 'public' }
}
