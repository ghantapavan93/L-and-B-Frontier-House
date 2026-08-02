/**
 * THREAD TO TRADE.
 *
 * Vertical integration told as a drawn line rather than as a claim.
 *
 * Every stage below is a VERIFIED FACT from docs/brand-research/00_BRAND_TRUTH.md — the
 * brand's own words: *"we own, operate, and manage all areas of the supply chain… textile,
 * design, manufacturing, distribution, and sales."* Nothing here asserts a manufacturing
 * LOCATION, which is unevidenced (OQ-04), and nothing names a mill or a tannery — those
 * attributions in the design corpus contradict vertical integration and were removed.
 *
 * The stitch line is SVG with `stroke-dasharray`, drawn by a scroll-driven animation behind
 * `@supports` and `prefers-reduced-motion`. Without support it is simply a drawn line: the
 * section is complete and correct with no motion at all.
 */

const STAGES = [
  {
    title: 'Textile',
    body: 'We own the textile stage of the chain rather than buying finished cloth.',
  },
  {
    title: 'Design',
    body: 'Styles are designed in house, which is why the line turns over as fast as it does.',
  },
  {
    title: 'Manufacturing',
    body: 'Production is ours to schedule, so a style can be repeated rather than chased.',
  },
  {
    title: 'Distribution',
    body: '2.64 days average processing. Order by 5pm CST and it ships same or next business day.',
  },
  {
    title: 'Sales',
    body: '100% order fill rate. What you order is what arrives — we are partners in your success.',
  },
] as const

export function ThreadToTrade() {
  return (
    <section className="container section thread" aria-labelledby="thread-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">Thread to trade</p>
          <h2 id="thread-heading">One chain, end to end.</h2>
          <p className="lede">
            We own, operate and manage every area of the supply chain. That is the reason the
            fill rate holds and the reason a style can be repeated.
          </p>
        </div>
      </div>

      {/* Decorative: the stages below carry the meaning. */}
      <svg
        className="thread__line"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 96 C 180 40, 320 140, 500 84 S 820 30, 980 76" />
      </svg>

      <ol className="thread__stages">
        {STAGES.map((stage, index) => (
          <li className="thread__stage" key={stage.title}>
            <span className="thread__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
