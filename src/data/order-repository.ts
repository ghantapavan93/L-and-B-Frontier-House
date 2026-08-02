import 'server-only'

/**
 * ORDER ACCESS — restricted in its entirety.
 *
 * Every function requires an approved buyer session and re-derives the buyer id from the
 * session rather than accepting one from the caller. A client-supplied buyer id is never
 * trusted, so one buyer can never read another's orders by changing a parameter.
 */

import { isAuthorisedBuyer } from '@/domain/session'
import type { Session } from '@/domain/session'
import type { Order } from '@/domain/order'
import { commerce } from './index'
import type { AddLineInput } from './adapters/commerce-adapter'

export class NotAuthorisedError extends Error {
  constructor() {
    super('Not an approved buyer session')
    this.name = 'NotAuthorisedError'
  }
}

function requireBuyerId(session: Session): string {
  if (!isAuthorisedBuyer(session)) throw new NotAuthorisedError()
  return session.buyerId
}

export async function getDraftOrder(session: Session): Promise<Order> {
  return commerce.getDraftOrder(requireBuyerId(session))
}

export async function addToOrder(session: Session, input: AddLineInput): Promise<Order> {
  return commerce.addDraftOrderLine(requireBuyerId(session), input)
}

export async function setOrderLineQuantity(
  session: Session,
  lineId: string,
  quantity: number,
): Promise<Order> {
  return commerce.setDraftOrderLineQuantity(requireBuyerId(session), lineId, quantity)
}

export async function submitOrder(session: Session): Promise<Order> {
  return commerce.submitDraftOrder(requireBuyerId(session))
}

export async function listOrders(session: Session): Promise<readonly Order[]> {
  return commerce.listOrders(requireBuyerId(session))
}

export async function getOrder(session: Session, orderId: string): Promise<Order | null> {
  return commerce.getOrder(requireBuyerId(session), orderId)
}

export async function reorder(session: Session, orderId: string): Promise<Order> {
  return commerce.reorder(requireBuyerId(session), orderId)
}
