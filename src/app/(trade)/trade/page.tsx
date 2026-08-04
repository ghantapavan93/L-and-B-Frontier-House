import type { Metadata } from 'next'
import Link from 'next/link'
import { requireSignedIn } from '@/auth/guards'
import { getBuyerProfile } from '@/data/buyer-repository'
import { getDraftOrder, listOrders } from '@/data/order-repository'
import { formatMoney } from '@/domain/money'
import { ORDER_STATUS_LABELS, orderSubtotal, orderUnits } from '@/domain/order'
import { isAuthorisedBuyer } from '@/domain/session'
import { BuyerStatusPanel } from '@/ui/buyer-status'
import { StateBlock } from '@/ui/notices'

export const metadata: Metadata = { title: 'Your account', robots: { index: false } }

/**
 * BUYER PASSPORT.
 *
 * A buyer relationship surface: orders, status, terms, saved work. Deliberately NOT a
 * loyalty programme — V3 Frame 10's "Frontier Trust 4,250" and "$150 store credit" are a
 * V3 invention that does not exist in V2 and has no basis in verified brand truth.
 *
 * This route serves every signed-in state, because the states between applying and ordering
 * are where a buyer is most likely to be lost.
 */
export default async function PassportPage() {
  const session = await requireSignedIn('/trade')
  const profile = await getBuyerProfile(session)

  if (!profile) {
    return (
      <div className="container section">
        <StateBlock title="We could not load your account">
          <p>Something went wrong on our end. Try again, or sign in once more.</p>
          <Link href="/sign-in" className="button button--secondary">
            Sign in again
          </Link>
        </StateBlock>
      </div>
    )
  }

  if (!isAuthorisedBuyer(session)) {
    return (
      <div className="container section stack">
        <p className="eyebrow">Your account</p>
        <h1>{profile.retailerName}</h1>
        <BuyerStatusPanel profile={profile} />
      </div>
    )
  }

  const [orders, draft] = await Promise.all([listOrders(session), getDraftOrder(session)])
  const draftUnits = orderUnits(draft)

  return (
    <div className="container section stack">
      <p className="eyebrow">Your account</p>
      <h1>{profile.retailerName}</h1>
      <p className="meta">Approved {profile.approvedAt}. Sales tax ID on file and verified.</p>

      <section aria-labelledby="current-heading" className="price-panel">
        <h2 className="eyebrow" id="current-heading">
          Current order
        </h2>
        {draft.lines.length === 0 ? (
          <>
            <p>No order in progress.</p>
            <div className="cluster">
              <Link href="/new-arrivals" className="button button--secondary">
                Start with new arrivals
              </Link>
              {/* The other way in: a budget rather than a style. */}
              <Link href="/trade/assortment" className="button button--secondary">
                Build an assortment
              </Link>
            </div>
          </>
        ) : (
          <>
            <p>
              {draft.lines.length} {draft.lines.length === 1 ? 'style' : 'styles'} ·{' '}
              {draftUnits} units · {formatMoney(orderSubtotal(draft))}
            </p>
            <div className="cluster">
              <Link href="/trade/order" className="button">
                Continue your order
              </Link>
              <Link href="/trade/assortment" className="button button--secondary">
                Build an assortment
              </Link>
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="terms-heading">
        <h2 className="eyebrow" id="terms-heading">
          Your terms
        </h2>
        <dl className="definition-list">
          <dt>Payment</dt>
          <dd>{profile.terms?.paymentTerms ?? 'Not set'}</dd>
          <dt>Shipping</dt>
          <dd>{profile.terms?.shippingTerms ?? 'Not set'}</dd>
        </dl>
      </section>

      <section aria-labelledby="orders-heading">
        <div className="cluster" style={{ justifyContent: 'space-between' }}>
          <h2 className="eyebrow" id="orders-heading">
            Recent orders
          </h2>
          <Link href="/trade/orders">All orders</Link>
        </div>

        {orders.length === 0 ? (
          <p className="meta">No orders yet.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <caption>Your most recent orders</caption>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Status</th>
                  <th scope="col">Units</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <th scope="row">
                      <Link href={`/trade/orders/${encodeURIComponent(order.id)}`}>
                        {order.id}
                      </Link>
                    </th>
                    <td>{order.submittedAt ?? order.createdAt}</td>
                    <td>{ORDER_STATUS_LABELS[order.status]}</td>
                    <td>{orderUnits(order)}</td>
                    <td>{formatMoney(orderSubtotal(order))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
