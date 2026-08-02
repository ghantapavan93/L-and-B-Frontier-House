import { SIZE_RANGE_AVAILABILITY_LABELS, SIZE_RANGE_LABELS } from '@/domain/size'
import type { SizeRange } from '@/domain/size'

/**
 * SIZE AND FIT — structured text, always.
 *
 * The live site's size chart is a single JPEG with zero text: a probable WCAG 1.1.1 failure
 * and the thing most directly contradicting the brand's inclusivity claim. This is the fix,
 * and it is a Phase 1 requirement rather than an enhancement.
 *
 * Availability is stated per range so a narrower extended assortment reads honestly instead
 * of implying a parity that does not exist.
 */
export function SizeAndFitTable({ ranges }: { ranges: readonly SizeRange[] }) {
  if (ranges.length === 0) {
    return <p className="meta">Measurements for this style are not yet published.</p>
  }

  return (
    <div className="stack">
      {ranges.map((range) => (
        <section key={range.kind}>
          <div className="cluster">
            <h3 style={{ margin: 0 }}>{SIZE_RANGE_LABELS[range.kind]}</h3>
            <span className="badge badge--quiet">
              {SIZE_RANGE_AVAILABILITY_LABELS[range.availability]}
            </span>
          </div>

          <div className="table-scroll">
            <table>
              <caption>{SIZE_RANGE_LABELS[range.kind]} — body measurements in inches</caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Bust</th>
                  <th scope="col">Waist</th>
                  <th scope="col">Hip</th>
                  <th scope="col">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {range.measurements.map((m) => (
                  <tr key={m.size}>
                    <th scope="row">{m.size}</th>
                    <td>{m.bustIn ?? '—'}</td>
                    <td>{m.waistIn}</td>
                    <td>{m.hipIn ?? '—'}</td>
                    <td>{m.inseamIn ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
