/**
 * ORDER — restricted in its entirety.
 *
 * Order status values are drawn from designed states: V2 Frame 8's "In Production",
 * V3 Frame 10's "En route", V3.1 12f_4's "Waitlist". No invented fulfilment stage.
 */

import { addMoney, compareMoney, multiplyMoney, usd, VERIFIED_ORDER_MINIMUM } from './money'
import type { Money } from './money'
import type { Prepack } from './product'

export type OrderStatus =
  'draft' | 'submitted' | 'in-production' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'in-production': 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export type OrderLine = {
  readonly id: string
  readonly productId: string
  readonly productSlug: string
  readonly productName: string
  readonly sku: string
  readonly prepack: Prepack
  /** Number of prepacks. */
  readonly quantity: number
  readonly unitPrice: Money
}

export type Order = {
  readonly id: string
  readonly buyerId: string
  readonly status: OrderStatus
  readonly lines: readonly OrderLine[]
  readonly createdAt: string
  readonly submittedAt?: string
  readonly shipWindow?: { readonly start: string; readonly end: string }
  readonly tracking?: string
}

/** Units in one line: prepack size × number of prepacks. */
export function lineUnits(line: OrderLine): number {
  return line.prepack.totalUnits * line.quantity
}

export function lineTotal(line: OrderLine): Money {
  return multiplyMoney(line.unitPrice, lineUnits(line))
}

export function orderSubtotal(order: Pick<Order, 'lines'>): Money {
  return order.lines.reduce<Money>((total, line) => addMoney(total, lineTotal(line)), usd(0))
}

export function orderUnits(order: Pick<Order, 'lines'>): number {
  return order.lines.reduce((units, line) => units + lineUnits(line), 0)
}

export function minimumMet(order: Pick<Order, 'lines'>): boolean {
  return compareMoney(orderSubtotal(order), VERIFIED_ORDER_MINIMUM) >= 0
}

/** Remaining spend to reach the verified $50 minimum. Never negative. */
export function remainingToMinimum(order: Pick<Order, 'lines'>): Money {
  const shortfall = VERIFIED_ORDER_MINIMUM.amountMinor - orderSubtotal(order).amountMinor
  return usd(Math.max(0, shortfall))
}

/** 0–100, clamped. Drives the progress indicator's numeric attributes. */
export function minimumProgressPercent(order: Pick<Order, 'lines'>): number {
  const ratio = orderSubtotal(order).amountMinor / VERIFIED_ORDER_MINIMUM.amountMinor
  return Math.min(100, Math.round(ratio * 100))
}
