import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireApprovedBuyer } from '@/auth/guards'
import { getOrder } from '@/data/order-repository'
import { reorderAction } from '@/features/order/actions'
import { formatMoney } from '@/domain/money'
import { lineTotal, lineUnits, orderSubtotal, orderUnits } from '@/domain/order'
import type { OrderStatus } from '@/domain/order'
import { ORDER_STATUS_LABELS } from '@/domain/order'

export const metadata: Metadata = { title: 'Order', robots: { index: false } }

type Params = { id: string }

/**
 * The fulfilment stages we actually report. Drawn from designed states only — V2 Frame 8's
 * "In Production", V3 Frame 10's "En route". No invented stage.
 */
const TIMELINE: readonly OrderStatus[] = ['submitted', 'in-production', 'shipped', 'delivered']

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const session = await requireApprovedBuyer(`/trade/orders/${id}`)

  const order = await getOrder(session, id)
  if (!order) notFound()

  const justSubmitted = (await searchParams)['submitted'] === '1'
  const reachedIndex = TIMELINE.indexOf(order.status)

  return (
    <div className="container section stack">
      <nav aria-label="Breadcrumb">
        <p className="meta">
          <Link href="/trade">Your account</Link> / <Link href="/trade/orders">Orders</Link> /{' '}
          {order.id}
        </p>
      </nav>

      {justSubmitted ? (
        <div className="notice" role="status">
          <p className="notice__title">Order sent</p>
          <p className="meta">
            We have your order. You will get a confirmation by email, and the status below
            updates as it moves through production.
          </p>
        </div>
      ) : null}

      <h1>Order {order.id}</h1>
      <p className="meta">
        Placed {order.submittedAt ?? order.createdAt} · {ORDER_STATUS_LABELS[order.status]}
      </p>

      {order.status !== 'cancelled' ? (
        <section aria-labelledby="timeline-heading">
          <h2 className="eyebrow" id="timeline-heading">
            Status
          </h2>
          <ol className="status-timeline">
            {TIMELINE.map((stage, index) => {
              const reached = reachedIndex >= index
              return (
                <li key={stage} {...(order.status === stage ? { 'aria-current': 'step' } : {})}>
                  <span aria-hidden="true">{reached ? '●' : '○'}</span>
                  <span>
                    {ORDER_STATUS_LABELS[stage]}
                    {reached ? '' : ' — not yet'}
                  </span>
                </li>
              )
            })}
          </ol>
          {order.shipWindow ? (
            <p className="meta">
              Ship window {order.shipWindow.start} to {order.shipWindow.end}.
            </p>
          ) : null}
          {order.tracking ? <p className="meta">Tracking {order.tracking}</p> : null}
        </section>
      ) : null}

      <div className="table-scroll">
        <table>
          <caption>Styles on this order</caption>
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
                  <Link href={`/trade/product/${line.productSlug}`}>{line.productName}</Link>
                  <br />
                  <span className="meta">{line.sku}</span>
                </th>
                <td>
                  {line.prepack.openSizing
                    ? `Open sizing, ${line.prepack.totalUnits} units`
                    : line.prepack.breakdown.map((b) => `${b.quantity} ${b.size}`).join(' · ')}
                </td>
                <td>{line.quantity}</td>
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

      <section aria-labelledby="reorder-heading" className="stack">
        <h2 className="eyebrow" id="reorder-heading">
          Buy it again
        </h2>
        <div className="cluster">
          <form action={reorderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button type="submit" className="button">
              Reorder the same assortment
            </button>
          </form>
          <Link href="/trade/order" className="button button--secondary">
            Reorder with changes
          </Link>
        </div>
        <p className="meta">
          Reordering adds every style on this order to your current order, where you can change
          pack counts before sending it.
        </p>
      </section>
    </div>
  )
}
