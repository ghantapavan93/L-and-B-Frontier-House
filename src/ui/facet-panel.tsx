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
  /**
   * Applied filters, as removable chips.
   *
   * A buyer narrowing a category filters destructively and needs a cheap undo. Reading the
   * `<select>` values back is not that: it requires opening each control to learn what is
   * on. Naming each applied filter and giving it its own removal link makes the state
   * countable at a glance and reversible one facet at a time — and because every chip is a
   * plain link to the same URL minus one parameter, it works with JavaScript disabled and
   * keeps the whole filter state shareable.
   */
  // Fabric and detail facets carry no `label` — their value is already the human string.
  const labelFor = (
    options: readonly { readonly value: string; readonly label?: string }[],
    value: string,
  ) => options.find((option) => option.value === value)?.label ?? value

  const appliedChips = (
    [
      ['sizeRange', 'Size range', applied.sizeRange, facets.sizeRanges],
      ['availability', 'Availability', applied.availability, facets.availability],
      ['fabric', 'Fabric', applied.fabric, facets.fabric],
      ['detail', 'Detail', applied.detail, facets.detail],
    ] as const
  ).flatMap(([key, label, value, options]) => {
    if (!value) return []
    const rest = new URLSearchParams()
    for (const [otherKey, otherValue] of Object.entries(applied)) {
      if (otherKey !== key && otherValue) rest.set(otherKey, otherValue)
    }
    const query = rest.toString()
    return [
      {
        key,
        label,
        value: labelFor(options, value),
        href: query ? `${action}?${query}` : action,
      },
    ]
  })
  const hasFilters = appliedChips.length > 0

  return (
    /*
      `id` + `tabIndex` make the panel a `:target` destination: on phones the "Filter &
      sort" trigger opens it as a full-height sheet with no JavaScript, and Close returns
      to the grid anchor. On desktop the same element is the ordinary rail and the sheet
      CSS never applies.
    */
    <div className="facet-panel" id="facets" tabIndex={-1}>
      <a className="facet-panel__close" href="#products">
        Close<span className="visually-hidden"> filters and return to results</span>
      </a>
      <form method="get" action={action}>
        <h2 className="eyebrow">
          Filter
          {hasFilters ? <span className="facet-count">{appliedChips.length}</span> : null}
        </h2>

        {hasFilters ? (
          <ul className="facet-applied" aria-label="Applied filters">
            {appliedChips.map((chip) => (
              <li key={chip.key}>
                <Link href={chip.href} className="facet-chip">
                  <span className="facet-chip__label">{chip.label}:</span> {chip.value}
                  <span className="visually-hidden"> — remove this filter</span>
                  <span aria-hidden="true" className="facet-chip__x">
                    ×
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

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
