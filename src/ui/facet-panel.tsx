import Link from 'next/link'
import type { FacetCounts } from '@/data/catalog-repository'

export type AppliedFacets = {
  readonly sizeRange?: string
  readonly availability?: string
  readonly fabric?: string
  readonly detail?: string
  readonly sort?: string
}

/**
 * FACETED FILTERING built on attributes extracted from spec strings.
 *
 * Today only availability is filterable across 235+ live styles, which is the largest
 * usability gap on the current site.
 *
 * The panel is a plain GET form: it works with JavaScript disabled, the filter state is in
 * the URL and therefore shareable, and no price value ever enters the query string.
 */
export function FacetPanel({
  action,
  facets,
  applied,
  resultCount,
}: {
  action: string
  facets: FacetCounts
  applied: AppliedFacets
  resultCount: number
}) {
  const hasFilters = Boolean(
    applied.sizeRange ?? applied.availability ?? applied.fabric ?? applied.detail,
  )

  return (
    <div className="facet-panel">
      <form method="get" action={action}>
        <h2 className="eyebrow">Filter</h2>

        <fieldset className="facet-group">
          <legend>Size range</legend>
          <div className="field">
            <label htmlFor="facet-size-range" className="visually-hidden">
              Size range
            </label>
            <select
              id="facet-size-range"
              name="sizeRange"
              defaultValue={applied.sizeRange ?? ''}
            >
              <option value="">All size ranges</option>
              {facets.sizeRanges.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {facet.label} ({facet.count})
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Availability</legend>
          <div className="field">
            <label htmlFor="facet-availability" className="visually-hidden">
              Availability
            </label>
            <select
              id="facet-availability"
              name="availability"
              defaultValue={applied.availability ?? ''}
            >
              <option value="">Any availability</option>
              {facets.availability.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {facet.label} ({facet.count})
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Fabric</legend>
          <div className="field">
            <label htmlFor="facet-fabric" className="visually-hidden">
              Fabric
            </label>
            <select id="facet-fabric" name="fabric" defaultValue={applied.fabric ?? ''}>
              <option value="">Any fabric</option>
              {facets.fabric.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {facet.value} ({facet.count})
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Detail</legend>
          <div className="field">
            <label htmlFor="facet-detail" className="visually-hidden">
              Detail
            </label>
            <select id="facet-detail" name="detail" defaultValue={applied.detail ?? ''}>
              <option value="">Any detail</option>
              {facets.detail.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {facet.value} ({facet.count})
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="facet-group">
          <legend>Sort</legend>
          <div className="field">
            <label htmlFor="facet-sort" className="visually-hidden">
              Sort by
            </label>
            <select id="facet-sort" name="sort" defaultValue={applied.sort ?? 'newest'}>
              <option value="newest">Newest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </fieldset>

        <div className="cluster">
          <button type="submit" className="button">
            Apply filters
          </button>
          {hasFilters ? (
            <Link href={action} className="button button--secondary">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {/* Announced politely on filter change; never steals focus from the control. */}
      <p className="meta" role="status" style={{ marginTop: 'var(--space-4)' }}>
        {resultCount} {resultCount === 1 ? 'style' : 'styles'} shown
      </p>
    </div>
  )
}
