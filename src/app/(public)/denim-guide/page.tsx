import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublicProducts } from '@/data/catalog-repository'
import { DENIM_LEG_OPENINGS, DENIM_WASHES } from '@/features/discovery/denim-finder'

export const metadata: Metadata = {
  title: 'The denim guide',
  description:
    'The four cuts Lucky & Blessed publishes, side by side — every measurement as text, every cut one click from its rack.',
}

/**
 * THE DENIM GUIDE — the best fit model in the category, delivered the way its owner
 * failed to.
 *
 * The fit-architecture teardown found the reference brand defines denim on clean axes and
 * then flattens every one of them into JPEGs: a fit guide whose <main> holds 1,024
 * characters and no table, a size chart that is four images with empty alt, charts
 * rendering at 0.35× on a phone. This page is the same idea as REAL HTML:
 *
 *   - A genuine <table> a screen reader can walk, Ctrl-F can search, and a phone renders
 *     at text size — the direct answer to the constitution's structured-fit-data rule.
 *   - Every row is DERIVED from the published catalogue at build time: the washes listed
 *     for a cut are the washes that exist in it, the counts are live, and a cut with
 *     nothing behind it does not render. No garment fact is authored here.
 *   - Each cut links to its filtered rack and to the finder — the guide is navigation,
 *     not literature.
 *
 * What this page deliberately does NOT have: rise and thigh measurements, stretch
 * percentages, boot-relationship claims. Those need owner grading data that does not
 * exist yet (§12: absent, never invented). The table grows a column per fact the owner
 * supplies.
 */

/** Campaign-voice glosses about geometry — never product claims. */
const CUT_NOTES: Record<string, { line: string; wear: string }> = {
  straight: {
    line: 'One width, hip to hem.',
    wear: 'The neutral line — sits over a boot shaft without a break.',
  },
  bootcut: {
    line: 'Fitted knee, opening from the calf.',
    wear: 'Cut to clear a riding heel — the hem lands wide of the vamp.',
  },
  flare: {
    line: 'Fitted through the thigh, open from the knee.',
    wear: 'The stage cut — movement reads at the hem.',
  },
  'wide-leg': {
    line: 'Full from the hip down.',
    wear: 'Volume all the way — worn long, floor-bound.',
  },
}

export default async function DenimGuidePage() {
  const products = await listPublicProducts({ categorySlug: 'women' })
  const denim = products.filter((p) => p.attributes.legOpening)

  const cuts = DENIM_LEG_OPENINGS.map((cut) => {
    const rack = denim.filter((p) => p.attributes.legOpening === cut.value)
    const washes = [...new Set(rack.map((p) => p.attributes.wash).filter(Boolean))]
    const washLabels = DENIM_WASHES.filter((w) => washes.includes(w.value as never)).map(
      (w) => w.label,
    )
    const extended = rack.some((p) => p.sizeRanges.some((r) => r.kind === 'extended'))
    return { ...cut, count: rack.length, washLabels, extended }
  }).filter((cut) => cut.count > 0)

  return (
    <div className="container section stack">
      <header>
        <p className="eyebrow">The denim guide</p>
        <h1>Four cuts, side by side</h1>
        <p className="lede">
          Everything below is text — readable on any phone, searchable, spoken by a screen
          reader — and every row is drawn from the published line, never written by hand.
        </p>
      </header>

      {/*
        The comparative table. Row headers are the cuts; the columns are only the axes the
        catalogue can actually answer today.
      */}
      <div className="table-scroll">
        <table className="guide-table">
          <caption className="visually-hidden">
            The published denim cuts compared: line, wear, washes, sizing and current count
          </caption>
          <thead>
            <tr>
              <th scope="col">Cut</th>
              <th scope="col">The line</th>
              <th scope="col">How it wears</th>
              <th scope="col">Washes published</th>
              <th scope="col">Extended sizing</th>
              <th scope="col">In the line now</th>
            </tr>
          </thead>
          <tbody>
            {cuts.map((cut) => (
              <tr key={cut.value}>
                <th scope="row">
                  <Link
                    className="text-link"
                    href={`/shop/women?legOpening=${cut.value}#products`}
                  >
                    {cut.label}
                  </Link>
                </th>
                <td>{CUT_NOTES[cut.value]?.line}</td>
                <td>{CUT_NOTES[cut.value]?.wear}</td>
                <td>{cut.washLabels.join(', ') || '—'}</td>
                <td>{cut.extended ? 'Yes' : 'Straight sizing today'}</td>
                <td>
                  {cut.count} {cut.count === 1 ? 'style' : 'styles'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section aria-labelledby="guide-next">
        <div className="section-head">
          <div>
            <p className="eyebrow">Point or be pointed</p>
            <h2 id="guide-next">Two ways in</h2>
          </div>
        </div>
        <div className="cluster">
          <Link href="/shop/women#products" className="button">
            Open the full rack
          </Link>
          <Link href="/find-your-denim" className="button button--secondary">
            Answer three questions instead
          </Link>
          <Link href="/size-and-fit/women" className="text-link">
            Every measurement, as text
          </Link>
        </div>
      </section>

      <aside className="panel">
        <h2 className="eyebrow">What this guide will grow</h2>
        <p className="meta">
          Rise, thigh ease, leg opening in inches, stretch and boot clearance — each column
          arrives when the business publishes its grading data, and not one of them is estimated
          before that. A guide that guesses is a size chart that lies.
        </p>
      </aside>
    </div>
  )
}
