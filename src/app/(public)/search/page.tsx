import type { Metadata } from 'next'
import Link from 'next/link'
import { atmospherePlate } from '@/content/media/campaign-plates'
import { liveProgramming } from '@/content/programming'
import { EditorialMedia } from '@/ui/product-media'
import { listPublicProducts } from '@/data/catalog-repository'
import { populatedEdits } from '@/domain/edits'
import { navigableCategories } from '@/domain/taxonomy'
import { searchProducts } from '@/features/discovery/search'
import { ProductGrid } from '@/ui/product-card'

/**
 * SEARCH — a page, not a widget, so it is the same feature with JavaScript disabled.
 *
 * The header form GETs here; the page re-renders the query, the count and the results as
 * server HTML with the state in the URL — shareable, crawl-safe and back-button-correct.
 * With no query it is the opening of the search layer the brief asks for: categories, the
 * edits and the live programming as starting points, since "recent searches" would need
 * storage this build deliberately does not have.
 *
 * Restricted data cannot appear here: the search runs over `PublicProduct` only.
 */
export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Lucky & Blessed line by name, fabric, detail, colour or fit.',
  robots: { index: false },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = typeof params['q'] === 'string' ? params['q'].trim() : ''

  const products = await listPublicProducts()
  const hits = query ? searchProducts(products, query) : []
  const results = hits.map((hit) => hit.product)
  const edits = populatedEdits(products)
  const programming = liveProgramming()

  return (
    <div className="container section">
      <p className="eyebrow">Search</p>
      <h1>{query ? `“${query}”` : 'Search the line'}</h1>

      <form action="/search" method="get" className="search-page__form" role="search">
        <label htmlFor="search-q" className="visually-hidden">
          Search the line
        </label>
        {/* No autofocus: the skip link stays the first Tab stop on every route. */}
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Denim, fringe, pearl snap, turquoise…"
          autoComplete="off"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      {query ? (
        <>
          <p className="meta" role="status">
            {results.length} {results.length === 1 ? 'style matches' : 'styles match'}
          </p>
          {results.length > 0 ? (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <ProductGrid products={results} quickView />
            </div>
          ) : (
            <div className="state-block">
              <h2>Nothing matches that</h2>
              <p>
                Search looks across names, fabrics, details, colours and fit. Try one word — or
                start from a category below.
              </p>
              <Link href="/new-arrivals" className="button button--secondary">
                See everything new instead
              </Link>
            </div>
          )}
        </>
      ) : null}

      <section className="section--tight" aria-labelledby="search-starts-heading">
        {/* Decorative material strip — the words a visitor might type, as pictures. */}
        {!query ? (
          <div className="search-strip" aria-hidden="true">
            <EditorialMedia media={atmospherePlate('denim-weave')} sizes="33vw" />
            <EditorialMedia media={atmospherePlate('tan-belt')} sizes="33vw" />
            <EditorialMedia media={atmospherePlate('felt-hat')} sizes="33vw" />
          </div>
        ) : null}
        <h2 className="eyebrow" id="search-starts-heading">
          {query ? 'Or start somewhere' : 'Start somewhere'}
        </h2>
        <div className="search-starts">
          <div>
            <p className="nav-group-label">Categories</p>
            <ul className="search-starts__list">
              <li>
                <Link href="/new-arrivals">New Arrivals</Link>
              </li>
              {navigableCategories().map((category) => (
                <li key={category.slug}>
                  <Link href={`/shop/${category.slug}`}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="nav-group-label">The edits</p>
            <ul className="search-starts__list">
              {edits.map((edit) => (
                <li key={edit.slug}>
                  <Link href={`/edit/${edit.slug}`}>{edit.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="nav-group-label">On now</p>
            <ul className="search-starts__list">
              {programming.map((entry) => (
                <li key={entry.id}>
                  <Link href={entry.href}>{entry.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
