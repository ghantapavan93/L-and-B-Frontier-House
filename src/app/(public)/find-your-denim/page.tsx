import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublicProducts } from '@/data/catalog-repository'
import {
  DENIM_LEG_OPENINGS,
  DENIM_WASHES,
  hasAnswers,
  matchDenim,
  readDenimAnswers,
} from '@/features/discovery/denim-finder'
import { FixtureNotice } from '@/ui/notices'
import { ProductGrid } from '@/ui/product-card'

export const metadata: Metadata = {
  title: 'Find your denim',
  description:
    'Answer three questions about how you wear your jeans and see the styles that match.',
}

/**
 * FIND YOUR DENIM.
 *
 * The difference from the category page is the question, not the machinery: /shop/women
 * asks "what is it", this asks "how do you wear yours". Underneath it is the same
 * allowlisted filtering over the same published attributes, stated plainly on the page so
 * the result can never read as a prediction the platform is not entitled to make.
 */
export default async function FindYourDenimPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const answers = readDenimAnswers(await searchParams)
  const answered = hasAnswers(answers)
  const denim = matchDenim(await listPublicProducts({ categorySlug: 'women' }), answers)

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/">Home</Link> / Find your denim
        </p>
      </nav>

      <p className="eyebrow">Fit</p>
      <h1>Find your denim</h1>
      <p className="lede">
        How do you wear yours? Answer what you know, skip what you don&rsquo;t — each answer
        narrows the rack.
      </p>

      <form method="get" action="/find-your-denim" className="denim-finder">
        <fieldset className="facet-group">
          <legend>Silhouette</legend>
          <div className="denim-finder__options">
            {DENIM_LEG_OPENINGS.map((option) => (
              <label className="denim-finder__option" key={option.value}>
                <input
                  type="radio"
                  name="legOpening"
                  value={option.value}
                  defaultChecked={answers.legOpening === option.value}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Wash</legend>
          <div className="denim-finder__options">
            {DENIM_WASHES.map((option) => (
              <label className="denim-finder__option" key={option.value}>
                <input
                  type="radio"
                  name="wash"
                  value={option.value}
                  defaultChecked={answers.wash === option.value}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Stretch</legend>
          <div className="denim-finder__options">
            <label className="denim-finder__option">
              <input
                type="checkbox"
                name="stretch"
                value="yes"
                defaultChecked={answers.stretch}
              />
              <span>Stretch denim only</span>
            </label>
          </div>
        </fieldset>

        <div className="cluster">
          <button type="submit" className="button">
            Show my denim
          </button>
          {answered ? (
            <Link href="/find-your-denim" className="button button--secondary">
              Start over
            </Link>
          ) : null}
        </div>
      </form>

      {/* The basis, stated. Same discipline as the assortment builder: a filter that will
          not say it is a filter reads as a prediction, and no data behind one exists. */}
      <p className="meta" role="status" style={{ marginTop: 'var(--space-5)' }}>
        {answered
          ? `${denim.length} ${denim.length === 1 ? 'pair matches' : 'pairs match'} your choices — matched on the garment facts above, nothing else.`
          : `${denim.length} denim styles in the published line.`}
      </p>

      <FixtureNotice detail={false} />

      {/* A real heading before the grid: product cards are h3, and without this the
          outline jumps h1 → h3 — the same fault the edit pages had. */}
      <section aria-labelledby="denim-results-heading" style={{ marginTop: 'var(--space-6)' }}>
        <h2 id="denim-results-heading">{answered ? 'Your rack' : 'Every denim style'}</h2>
        <ProductGrid
          products={denim}
          emptyMessage="No published pair matches all of these choices together. Drop one answer and the rack widens."
        />
      </section>
    </div>
  )
}
