import type { Metadata } from 'next'
import Link from 'next/link'
import { requireApprovedBuyer } from '@/auth/guards'
import { getDraftOrder } from '@/data/order-repository'
import { setLineQuantityAction, submitOrderAction } from '@/features/order/actions'
import { formatMoney } from '@/domain/money'
import { lineTotal, lineUnits, minimumMet, orderSubtotal, orderUnits } from '@/domain/order'
import { MinimumOrderProgress } from '@/ui/wholesale'

export const metadata: Metadata = { title: 'Your order', robots: { index: false } }

/**
 * THE WHOLESALE ORDER SURFACE.
 *
 * Every line shows its prepack composition, because a buyer's real question is not "how
 * many packs" but "what sizes am I getting". Quantities are plain forms — the surface works
 * with JavaScript disabled.
 *
 * Submission is blocked below the verified $50 minimum, but browsing never is: the minimum
 * is a checkout condition, not a gate.
 */
export default async function OrderPage() {
  const session = await requireApprovedBuyer('/trade/order')
  const order = await getDraftOrder(session)

  const empty = order.lines.length === 0
  const canSubmit = !empty && minimumMet(order)

  return (
    <div className="container section stack">
      <p className="eyebrow">Wholesale</p>
      <h1>Your order</h1>

      {empty ? (
        <div className="state-block">
          <h2>Nothing in this order yet</h2>
          <p>
            Add a style from the line and it will appear here with its pack breakdown and
            running total.
          </p>
          <div className="cluster">
            <Link href="/new-arrivals" className="button">
              Browse new arrivals
            </Link>
            <Link href="/trade/orders" className="button button--secondary">
              Reorder from history
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="table-scroll">
            <table>
              <caption>Styles in this order</caption>
              <thead>
                <tr>
                  <th scope="col">Style</th>
                  <th scope="col">Pack</th>
                  <th scope="col">Packs</th>
                  <th scope="col">Units</th>
                  <th scope="col">Unit price</th>
                  <th scope="col">Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id}>
                    <th scope="row">
                      <Link href={`/trade/product/${line.productSlug}`}>
                        {line.productName}
                      </Link>
                      <br />
                      <span className="meta">{line.sku}</span>
                    </th>
                    <td>
                      {line.prepack.openSizing
                        ? `Open sizing, ${line.prepack.totalUnits} units`
                        : line.prepack.breakdown
                            .map((b) => `${b.quantity} ${b.size}`)
                            .join(' · ')}
                    </td>
                    <td>
                      <form action={setLineQuantityAction} className="cluster">
                        <input type="hidden" name="lineId" value={line.id} />
                        <label htmlFor={`qty-${line.id}`} className="visually-hidden">
                          Packs of {line.productName}
                        </label>
                        <input
                          id={`qty-${line.id}`}
                          name="quantity"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={999}
                          step={1}
                          defaultValue={line.quantity}
                          style={{ width: '5rem' }}
                        />
                        <button
                          type="submit"
                          className="button button--secondary button--small"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                    <td>{lineUnits(line)}</td>
                    <td>{formatMoney(line.unitPrice)}</td>
                    <td>{formatMoney(lineTotal(line))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={3}>
                    Total
                  </th>
                  <td>{orderUnits(order)}</td>
                  <td />
                  <td>{formatMoney(orderSubtotal(order))}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <MinimumOrderProgress order={order} />

          <form action={submitOrderAction}>
            <button type="submit" className="button" disabled={!canSubmit}>
              Send this order
            </button>
            {!canSubmit ? (
              <p className="meta" style={{ marginTop: 'var(--space-2)' }}>
                Orders send once they reach the $50 minimum. Keep adding — nothing is lost.
              </p>
            ) : null}
          </form>

          <p className="meta">Set a quantity to 0 to remove a style. Prepacks ship complete.</p>
        </>
      )}
    </div>
  )
}
