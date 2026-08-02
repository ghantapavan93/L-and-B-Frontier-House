import type { Metadata } from 'next'
import { getFacets, listPublicProducts } from '@/data/catalog-repository'
import type { ProductQuery } from '@/data/adapters/commerce-adapter'
import { FacetPanel } from '@/ui/facet-panel'
import { FixtureNotice } from '@/ui/notices'
import { ProductGrid } from '@/ui/product-card'
import { readFacetParams, toProductQuery } from '@/features/discovery/facet-params'

export const metadata: Metadata = {
  title: 'New arrivals',
  description: 'The newest western apparel styles from Lucky & Blessed.',
}

/**
 * NEW ARRIVALS.
 *
 * The daily drop is the brand's real operating rhythm. This is the listing form of it; a
 * dated permalink per drop is the next slice.
 */
export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const applied = readFacetParams(params)
  const query: ProductQuery = { ...toProductQuery(applied), sort: 'newest' }

  const [products, facets] = await Promise.all([listPublicProducts(query), getFacets()])
  const withArrivalDate = products.filter((p) => p.newArrivalOn !== undefined)

  return (
    <div className="container section">
      <p className="eyebrow">The drop</p>
      <h1>New arrivals</h1>
      <p>
        Everything published most recently, newest first. Sign in for your pricing and pack
        breakdowns.
      </p>

      <FixtureNotice detail={false} />

      <div className="layout-with-facets" style={{ marginTop: 'var(--space-6)' }}>
        <FacetPanel
          action="/new-arrivals"
          facets={facets}
          applied={applied}
          resultCount={withArrivalDate.length}
        />
        <ProductGrid
          products={withArrivalDate}
          emptyMessage="No new arrivals match these filters. Clear them to see everything."
        />
      </div>
    </div>
  )
}
