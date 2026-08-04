'use server'

/**
 * ORDER ACTIONS — authorised only.
 *
 * Every action re-derives the session on the server. None of them accepts a buyer id, an
 * account tier or a price from the client. A quantity is the only client-supplied number,
 * and it is clamped before use.
 */

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSession } from '@/auth/session'
import { listVisibleProducts } from '@/data/catalog-repository'
import {
  addToOrder,
  NotAuthorisedError,
  reorder,
  setOrderLineQuantity,
  submitOrder,
} from '@/data/order-repository'
import { buildAssortment } from '@/domain/assortment'
import { isAuthorisedProduct } from '@/domain/product'
import { readAssortmentParams } from './assortment-params'

function readString(form: FormData, field: string): string {
  const value = form.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function readQuantity(form: FormData, field: string): number {
  const parsed = Number.parseInt(readString(form, field), 10)
  if (!Number.isFinite(parsed)) return 0
  return Math.min(999, Math.max(0, parsed))
}

/** Denial is a designed 403, never a raw error and never a silent no-op. */
function denyToSignIn(): never {
  redirect('/sign-in?error=required&next=/trade/order')
}

export async function addToOrderAction(formData: FormData): Promise<void> {
  const session = await getSession()
  const productId = readString(formData, 'productId')
  const quantity = Math.max(1, readQuantity(formData, 'quantity'))
  const returnTo = readString(formData, 'returnTo')

  try {
    await addToOrder(session, { productId, quantity })
  } catch (error) {
    if (error instanceof NotAuthorisedError) denyToSignIn()
    throw error
  }

  revalidatePath('/trade/order')
  redirect(returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/trade/order')
}

export async function setLineQuantityAction(formData: FormData): Promise<void> {
  const session = await getSession()
  const lineId = readString(formData, 'lineId')
  const quantity = readQuantity(formData, 'quantity')

  try {
    await setOrderLineQuantity(session, lineId, quantity)
  } catch (error) {
    if (error instanceof NotAuthorisedError) denyToSignIn()
    throw error
  }

  revalidatePath('/trade/order')
  redirect('/trade/order')
}

export async function submitOrderAction(): Promise<void> {
  const session = await getSession()

  let orderId: string
  try {
    const order = await submitOrder(session)
    orderId = order.id
  } catch (error) {
    if (error instanceof NotAuthorisedError) denyToSignIn()
    throw error
  }

  revalidatePath('/trade/orders')
  redirect(`/trade/orders/${encodeURIComponent(orderId)}?submitted=1`)
}

/**
 * Adds a whole planned rack to the draft order.
 *
 * The form posts the PLAN INPUTS, not the planned lines, and the action re-derives the plan
 * on the server. That keeps the rule the other actions keep — no quantity, price or product
 * set is taken on the client's word — and it means a tampered form can only ask for a
 * different valid plan, never for a line the planner would not have produced.
 *
 * The result lands in the ordinary draft order, where every line is editable and removable.
 * That is what makes this a starting point rather than a locked recommendation.
 */
export async function addAssortmentToOrderAction(formData: FormData): Promise<void> {
  const session = await getSession()

  const input = readAssortmentParams({
    budget: readString(formData, 'budget'),
    storeSize: readString(formData, 'storeSize'),
    mix: readString(formData, 'mix'),
    band: readString(formData, 'band'),
    launchMonth: readString(formData, 'launchMonth'),
  })

  const products = (await listVisibleProducts(session)).filter(isAuthorisedProduct)
  const plan = buildAssortment(products, input)

  try {
    for (const line of plan.lines) {
      await addToOrder(session, { productId: line.product.id, quantity: line.packs })
    }
  } catch (error) {
    if (error instanceof NotAuthorisedError) denyToSignIn()
    throw error
  }

  revalidatePath('/trade/order')
  redirect('/trade/order')
}

export async function reorderAction(formData: FormData): Promise<void> {
  const session = await getSession()
  const orderId = readString(formData, 'orderId')

  try {
    await reorder(session, orderId)
  } catch (error) {
    if (error instanceof NotAuthorisedError) denyToSignIn()
    throw error
  }

  revalidatePath('/trade/order')
  redirect('/trade/order')
}
