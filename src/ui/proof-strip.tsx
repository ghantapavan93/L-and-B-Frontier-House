/**
 * PROOF STRIP — the numbers that are actually true.
 *
 * This platform ships no consumer reviews: none exist, and invented ones are §12's
 * clearest violation. What DOES exist is verified operational proof
 * (docs/brand-research/00_BRAND_TRUTH.md): marketplace ratings of the house itself and
 * fulfilment numbers most brands could not print. Stated exactly, never rounded up, and
 * attributed to what they measure — the house, not the style on the page.
 */
export function ProofStrip() {
  return (
    <aside className="proof-strip" aria-label="Verified house record">
      <dl>
        <div>
          <dt>Marketplace rating</dt>
          <dd>4.76 / 5 · 262 reviews</dd>
        </div>
        <div>
          <dt>Second marketplace</dt>
          <dd>4.7 / 5 · 353 reviews</dd>
        </div>
        <div>
          <dt>Order fill rate</dt>
          <dd>100%</dd>
        </div>
        <div>
          <dt>Processing</dt>
          <dd>2.64 days average</dd>
        </div>
      </dl>
      <p className="meta">
        Retailers rating the house across two wholesale marketplaces — the record behind every
        style, not per-style reviews.
      </p>
    </aside>
  )
}
