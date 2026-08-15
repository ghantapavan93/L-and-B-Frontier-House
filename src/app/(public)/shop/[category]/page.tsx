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
 * `dynamicParams = false` so an unknown or hidden category is an unmatched URL, which is
 * the one 404 path Next server-renders into the initial HTML rather than streaming as RSC.
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
    applied.wash,
    applied.silhouette,
    applied.colour,
  ].filter(Boolean).length
  const [products, facets] = await Promise.all([
    listPublicProducts({ ...toProductQuery(applied), categorySlug: category.slug }),
    getFacets(category.slug),
  ])
  /* Owner photography when supplied; a cleared material plate until then. */
  const banner =
    officialMediaForSlot(`category-${category.slug}`) ?? CATEGORY_TILE_FALLBACK[category.slug]

  return (
    <>
      {/*
        THE PHOTOGRAPH IS THE OPENING.

        This page used to lead with a breadcrumb, a heading and a paragraph, and only then
        an image inset in the container — measured, the first photograph began 465px down.
        The image now runs the full width of the window with the title set on it, which is
        what every reference category page does. Text stays inside the measure; the
        photograph does not.
      */}
      {banner ? (
        <section className="page-hero" aria-labelledby="category-heading">
          <div className="page-hero__media" aria-hidden="true">
            <EditorialMedia media={banner} priority sizes="100vw" />
          </div>
          <div className="page-hero__inner">
            <nav aria-label="Breadcrumb">
              <p className="meta page-hero__crumb">
                <Link href="/">Home</Link> / {category.label}
              </p>
            </nav>
            <h1 id="category-heading">{category.label}</h1>
            <p className="lede">{category.blurb}</p>
          </div>
        </section>
      ) : (
        <div className="container section--tight">
          <nav aria-label="Breadcrumb">
            <p className="meta">
              <Link href="/">Home</Link> / {category.label}
            </p>
          </nav>
          <h1 id="category-heading">{category.label}</h1>
          <p className="lede">{category.blurb}</p>
        </div>
      )}

      <div className="container section--tight">
        <FixtureNotice detail={false} />

        {/*
          FIT AS NAVIGATION, not a questionnaire. The reference set puts the denim cuts in
          a row of real crawlable URLs at the top of the category; our finder stays as the
          guided second path. Text chips, deliberately — each becomes a tile the moment the
          owner supplies a photograph per cut, and it works today without one. Rendered only
          where the result set actually contains denim (the facet is populated), so the
          accessories page never advertises leg cuts it cannot honour.
        */}
        {facets.legOpening.length > 0 ? (
          <nav className="fit-row" aria-label="Denim by leg opening">
            <p className="fit-row__label">Denim, by cut</p>
            <ul className="fit-row__list">
              {facets.legOpening.map((cut) => (
                <li key={cut.value}>
                  <a
                    className={
                      applied.legOpening === cut.value
                        ? 'fit-row__chip fit-row__chip--current'
                        : 'fit-row__chip'
                    }
                    href={`/shop/${category.slug}?legOpening=${cut.value}#products`}
                  >
                    {cut.label}
                    <span className="fit-row__count">{cut.count}</span>
                  </a>
                </li>
              ))}
              <li>
                <a className="fit-row__chip fit-row__chip--quiet" href="/find-your-denim">
                  Not sure? Find your denim
                </a>
              </li>
            </ul>
          </nav>
        ) : null}

        <a className="facet-trigger" href="#facets">
          Filter &amp; sort
          {appliedCount > 0 ? ` (${appliedCount})` : ''}
        </a>

        {/* A11y audit finding #6: cards are <h3> and nothing between them and the h1
            said <h2> — a heading skip on every category page. Real for the
            accessibility tree, silent for the layout. */}
        <h2 className="visually-hidden">The rack</h2>
        <div
          className="layout-with-facets"
          id="products"
          style={{ marginTop: 'var(--space-6)' }}
        >
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
    </>
  )
}
