/**
 * ROUTE-LEVEL LOADING PRIMITIVES.
 *
 * Every `loading.tsx` in the App Router composes these. They are server
 * components and add zero client JavaScript — the budget for this work is 0 KB,
 * and a loading state that ships a bundle delays the thing it is apologising for.
 *
 * Three rules they exist to enforce:
 *
 *   1. RESERVE THE REAL BOXES. Each skeleton mirrors the container, section
 *      rhythm, grid tracks and media aspect ratios of the page it stands in for,
 *      so arriving content replaces it without moving anything. CLS is a
 *      contractual budget; a centred spinner on an empty page guarantees a shift.
 *
 *   2. ANNOUNCE ONCE. The `role="status"` region carries a single human sentence.
 *      The blocks beneath it are `aria-hidden` — a screen reader should hear
 *      "Loading order history", not forty empty divs.
 *
 *   3. INVENT NOTHING. A block is a dimension. It is never a garment silhouette,
 *      never a placeholder price, never a fake row of data. Restricted values in
 *      particular are absent here, exactly as they are absent from an
 *      unauthorised response.
 */

type SkeletonProps = {
  /** Sentence announced to assistive technology. Describes the route, not the mechanic. */
  label: string
  children: React.ReactNode
}

/**
 * The announced wrapper. `aria-busy` marks the region as in-flight; `polite`
 * means it never interrupts whatever the user is already hearing.
 *
 * The label is an `h1`, not a `span`, and that is load-bearing. A route-level
 * fallback replaces the page's own `h1`, so while it is on screen the document
 * would otherwise have no level-one heading at all — and the streamed shell
 * flushes the footer's `h2`s before the resolved page content arrives, which
 * makes the first heading in the document an `h2`. The accessibility suite
 * catches exactly that ("/wholesale does not start at h1"). Carrying the heading
 * here keeps the outline valid at every moment of the load, and it is a truthful
 * heading: it names the route being fetched.
 */
export function LoadingRegion({ label, children }: SkeletonProps) {
  return (
    <div className="container section" role="status" aria-live="polite" aria-busy="true">
      <h1 className="visually-hidden">{label}</h1>
      <div aria-hidden="true">{children}</div>
    </div>
  )
}

/** A text stand-in. `width` is a percentage so lines rag like real copy. */
export function Line({
  width = '100%',
  style,
}: {
  width?: string
  style?: React.CSSProperties
}) {
  return <div className="skeleton skeleton--line" style={{ width, ...style }} />
}

/** The eyebrow + h1 pair that opens almost every route in this system. */
export function PageHeading({ lede = false }: { lede?: boolean }) {
  return (
    <div style={{ marginBottom: 'var(--space-7)' }}>
      <Line width="7rem" style={{ height: 'var(--label-caps)' }} />
      <Line width="min(24rem, 70%)" style={{ height: 'var(--headline-lg-mobile)' }} />
      {lede ? <Line width="min(38rem, 90%)" style={{ marginTop: 'var(--space-4)' }} /> : null}
    </div>
  )
}

/**
 * A product tile placeholder: the 4:5 media box the real card reserves, then two
 * short lines for name and meta. No third line — a public card carries no price,
 * and drawing one would rehearse a leak.
 */
export function ProductTile() {
  return (
    <div className="product-card">
      <div className="skeleton skeleton--media" />
      <div>
        <Line width="80%" />
        <Line width="45%" />
      </div>
    </div>
  )
}

/** A grid of tiles on the same tracks as `.product-grid`. */
export function ProductGrid({ count = 8 }: { count?: number }) {
  return (
    <ul className="product-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ProductTile />
        </li>
      ))}
    </ul>
  )
}

/** Label-over-control pairs, matching `.field` spacing. */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="loading-rows" style={{ maxWidth: '32rem' }}>
      {Array.from({ length: fields }, (_, i) => (
        <div className="loading-field" key={i}>
          <Line width="8rem" style={{ height: 'var(--label-caps)' }} />
          <div className="skeleton" style={{ height: '2.75rem' }} />
        </div>
      ))}
      <div className="skeleton" style={{ height: '2.75rem', width: '12rem' }} />
    </div>
  )
}

/**
 * Tabular rows for order history and the order builder. Rendered as divs rather
 * than a `<table>`: an empty table is announced as a table with no data, which
 * is a claim about content that has not loaded.
 */
export function RowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="loading-rows">
      <div className="skeleton skeleton--rule" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)',
              gap: 'var(--space-4)',
              alignItems: 'center',
              paddingBlock: 'var(--space-3)',
            }}
          >
            <Line width="70%" />
            <Line width="55%" />
            <Line width="40%" />
          </div>
          <div className="skeleton skeleton--rule" />
        </div>
      ))}
    </div>
  )
}

/** A raised panel — the shape this system uses for summaries and status blocks. */
export function PanelSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="skeleton skeleton--panel">
      <Line width="9rem" style={{ height: 'var(--label-caps)' }} />
      <div style={{ marginTop: 'var(--space-4)' }}>
        {Array.from({ length: lines }, (_, i) => (
          <Line key={i} width={i % 2 === 0 ? '100%' : '72%'} />
        ))}
      </div>
    </div>
  )
}
