import type { Metadata } from 'next'
import Link from 'next/link'
import { requireApprovedBuyer } from '@/auth/guards'
import { listOrders } from '@/data/order-repository'
import { reorderAction } from '@/features/order/actions'
import { formatMoney } from '@/domain/money'
import { ORDER_STATUS_LABELS, orderSubtotal, orderUnits } from '@/domain/order'

export const metadata: Metadata = { title: 'Order history', robots: { index: false } }

/**
 * ORDER HISTORY.
 *
 * Reorder sits directly in the table because repeat wholesale ordering is the business.
 * It appears in no design source, which is a gap in the corpus rather than a decision.
 */
export default async function OrderHistoryPage() {
  const session = await requireApprovedBuyer('/trade/orders')
  const orders = await listOrders(session)

  return (
    <div className="container section stack">
      <p className="eyebrow">Wholesale</p>
      <h1>Order history</h1>

      {orders.length === 0 ? (
        <div className="state-block">
          <h2>No orders yet</h2>
          <p>Your first order will appear here, with its production and shipping status.</p>
          <Link href="/new-arrivals" className="button">
            Browse new arrivals
          </Link>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <caption>Every order on this account</caption>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Placed</th>
                <th scope="col">Status</th>
                <th scope="col">Styles</th>
                <th scope="col">Units</th>
                <th scope="col">Total</th>
                <th scope="col">Reorder</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row">
                    <Link href={`/trade/orders/${encodeURIComponent(order.id)}`}>
                      {order.id}
                    </Link>
                  </th>
                  <td>{order.submittedAt ?? order.createdAt}</td>
                  <td>{ORDER_STATUS_LABELS[order.status]}</td>
                  <td>{order.lines.length}</td>
                  <td>{orderUnits(order)}</td>
                  <td>{formatMoney(orderSubtotal(order))}</td>
                  <td>
                    <form action={reorderAction}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <button type="submit" className="button button--secondary button--small">
                        Reorder
                        <span className="visually-hidden"> order {order.id}</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
