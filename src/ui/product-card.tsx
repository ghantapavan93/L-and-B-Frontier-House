import Link from 'next/link'
import { AVAILABILITY_LABELS, primaryMedia } from '@/domain/product'
import type { PublicProduct, VisibleProduct } from '@/domain/product'
import { SIZE_RANGE_LABELS } from '@/domain/size'
import { ProductMedia } from './product-media'

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
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
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
