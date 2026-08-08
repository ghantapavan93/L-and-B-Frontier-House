import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_TILE_FALLBACK } from '@/content/media/campaign-plates'
import { officialMediaForSlot } from '@/content/media/official-media'
import { getFacets, listPublicProducts } from '@/data/catalog-repository'
import { findRoutableCategory, routableCategories } from '@/domain/taxonomy'
import { FacetPanel } from '@/ui/facet-panel'
import { FixtureNotice } from '@/ui/notices'
import { ProductGrid } from '@/ui/product-card'
import { EditorialMedia } from '@/ui/product-media'
import { readFacetParams, toProductQuery } from '@/features/discovery/facet-params'

type Params = { category: string }

/**
 * Routes are generated from the typed taxonomy config. When the owner resolves D-04, D-03
 * and D-05, the categories change in one file and every route, nav item, facet and sitemap
 * entry follows — no route file is rewritten.
 *
 * A category with status `hidden` (currently Home, pending D-05) has no route and 404s.
 *
 * `dynamicParams = false` so an unknown or hidden category is an unmatched URL, which is the
 * one 404 path Next server-renders into the initial HTML rather than streaming as RSC.
 */
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return routableCategories().map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = findRoutableCategory(slug)
  if (!category) return {}
  return { title: category.label, description: category.blurb }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { category: slug } = await params
  const category = findRoutableCategory(slug)
  if (!category) notFound()

  const applied = readFacetParams(await searchParams)
  const appliedCount = [
    applied.sizeRange,
    applied.availability,
    applied.fabric,
    applied.detail,
  ].filter(Boolean).length
  const [products, facets] = await Promise.all([
    listPublicProducts({ ...toProductQuery(applied), categorySlug: category.slug }),
    getFacets(category.slug),
  ])
  /* Owner photography when supplied; a cleared material plate until then. */
  const banner =
    officialMediaForSlot(`category-${category.slug}`) ?? CATEGORY_TILE_FALLBACK[category.slug]

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> / {category.label}
        </p>
      </nav>

      <h1>{category.label}</h1>
      <p className="lede">{category.blurb}</p>

      {banner ? (
        <div className="page-banner">
          <EditorialMedia media={banner} priority sizes="100vw" />
        </div>
      ) : null}

      <FixtureNotice detail={false} />

      <a className="facet-trigger" href="#facets">
        Filter &amp; sort
        {appliedCount > 0 ? ` (${appliedCount})` : ''}
      </a>

      <div className="layout-with-facets" id="products" style={{ marginTop: 'var(--space-6)' }}>
        <FacetPanel
          action={`/shop/${category.slug}`}
          facets={facets}
          applied={applied}
          resultCount={products.length}
        />
        <ProductGrid
          products={products}
          quickView
          emptyMessage={`No ${category.label.toLowerCase()} styles match these filters. Clear them to see everything in this category.`}
        />
      </div>
    </div>
  )
}
