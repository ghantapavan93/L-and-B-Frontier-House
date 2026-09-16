/**
 * DEVELOPMENT FIXTURE ADAPTER.
 *
 * Implements `CommerceAdapter` over the fixture catalogue and buyers. The catalogue and the
 * seeded buyers and orders are static modules; everything a buyer CHANGES — their draft,
 * the orders they submit, an application they file — is held in a sealed cookie on their
 * own browser (./fixture-persistence.ts), because this adapter runs on serverless hosting
 * where process memory is per-instance and short-lived. The comment at the top of that
 * file says why in full. The short version: memory looked like it worked and then lost the
 * order.
 *
 * Every line here is re-derived from the catalogue at read time. The cookie holds product
 * ids and pack counts; the price, SKU, name and prepack come from `PRODUCT_RECORDS` on
 * every call, so a stored line can never carry a stale or forged figure.
 */

import { BUYER_RECORDS, FIXTURE_PASSWORD } from '@/fixtures/buyers'
import { ORDER_RECORDS } from '@/fixtures/orders'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import type { Buyer } from '@/domain/buyer'
import type { PaymentMethodId } from '@/domain/payment'
import type { Order, OrderLine } from '@/domain/order'
import type { ProductRecord } from '@/domain/product'
import { findCategory } from '@/domain/taxonomy'
import type {
  AddLineInput,
  BuyerApplication,
  CommerceAdapter,
  ProductQuery,
} from './commerce-adapter'
import {
  MAX_DRAFT_LINES,
  MAX_ORDER_LINES,
  MAX_RECENT_ORDERS,
  readFixtureState,
  writeFixtureState,
  type FixtureState,
  type StoredApplication,
  type StoredLine,
  type StoredOrder,
} from './fixture-persistence'

function matchesQuery(product: ProductRecord, query: ProductQuery): boolean {
  if (query.categorySlug && product.categorySlug !== query.categorySlug) return false
  if (query.availability && product.availability !== query.availability) return false
  if (query.sizeRange) {
    const offered = product.sizeRanges.some(
      (range) => range.kind === query.sizeRange && range.availability !== 'unavailable',
    )
    if (!offered) return false
  }
  if (query.fabric && !product.attributes.fabric?.includes(query.fabric)) return false
  if (query.detail && !product.attributes.detail?.includes(query.detail)) return false
  if (query.wash && product.attributes.wash !== query.wash) return false
  if (query.legOpening && product.attributes.legOpening !== query.legOpening) return false
  if (query.silhouette && product.attributes.silhouette !== query.silhouette) return false
  if (query.sleeve && product.attributes.sleeve !== query.sleeve) return false
  if (query.motif && !(product.attributes.motif ?? []).includes(query.motif)) return false
  if (query.colour && !product.attributes.colour.some((c) => c.name === query.colour)) {
    return false
  }
  if (query.newArrivalSince) {
    if (!product.newArrivalOn || product.newArrivalOn < query.newArrivalSince) return false
  }
  return true
}

function sortProducts(products: ProductRecord[], sort: ProductQuery['sort']): ProductRecord[] {
  if (sort === 'name') {
    return [...products].sort((a, b) => a.displayName.localeCompare(b.displayName))
  }
  if (sort === 'newest') {
    return [...products].sort((a, b) =>
      (b.newArrivalOn ?? '').localeCompare(a.newArrivalOn ?? ''),
    )
  }
  return products
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Line ids are derived, not sequenced: the same product is the same line on every read. */
function lineId(productId: string): string {
  return `line-${productId}`
}

function lineFromProduct(product: ProductRecord, quantity: number): OrderLine {
  return {
    id: lineId(product.id),
    productId: product.id,
    productSlug: product.slug,
    productName: product.displayName,
    sku: product.wholesale.sku,
    prepack: product.wholesale.prepack,
    quantity,
    unitPrice: product.wholesale.wholesalePrice,
  }
}

/**
 * Stored lines → order lines, priced from the catalogue now. A line whose product has left
 * the catalogue is dropped rather than rendered with a guessed price.
 */
function hydrateLines(stored: readonly StoredLine[]): OrderLine[] {
  const lines: OrderLine[] = []
  for (const { p, q } of stored) {
    const product = PRODUCT_RECORDS.find((record) => record.id === p)
    if (product) lines.push(lineFromProduct(product, q))
  }
  return lines
}

function hydrateDraft(buyerId: string, state: FixtureState): Order {
  return {
    id: `draft-${buyerId}`,
    buyerId,
    status: 'draft',
    createdAt: today(),
    lines: hydrateLines(state.drafts[buyerId] ?? []),
  }
}

function hydrateOrder(stored: StoredOrder): Order {
  return {
    id: stored.id,
    buyerId: stored.buyerId,
    status: 'submitted',
    createdAt: stored.createdAt,
    submittedAt: stored.submittedAt,
    paymentMethod: stored.paymentMethod,
    lines: hydrateLines(stored.lines),
  }
}

/**
 * A pending applicant, as a Buyer. The sales tax ID is the one field the application
 * carried that the cookie does not: `Buyer` says that value never leaves the server, so
 * the fixture receives it, uses it for nothing, and does not keep it. What the fixture
 * shows the applicant — their store, their status — never needed it.
 */
function buyerFromApplication(applied: StoredApplication): Buyer {
  return {
    id: applied.id,
    email: applied.email,
    retailer: {
      name: applied.retailerName,
      address: {
        line1: '—',
        city: applied.city,
        region: applied.region,
        postalCode: '—',
        country: 'US',
      },
      ...(applied.storeUrl ? { website: applied.storeUrl } : {}),
    },
    salesTaxId: { value: '', verified: false },
    status: 'pending',
    appliedAt: applied.appliedAt,
    isFixture: true,
  }
}

function withDraft(state: FixtureState, buyerId: string, lines: readonly StoredLine[]) {
  return { ...state, drafts: { ...state.drafts, [buyerId]: lines.slice(0, MAX_DRAFT_LINES) } }
}

export class FixtureCommerceAdapter implements CommerceAdapter {
  async listProducts(query: ProductQuery): Promise<readonly ProductRecord[]> {
    const matched = PRODUCT_RECORDS.filter((p) => {
      // A product in a category that is hidden pending an owner decision is not listable.
      const category = findCategory(p.categorySlug)
      if (!category || category.status === 'hidden') return false
      return matchesQuery(p, query)
    })
    return sortProducts(matched, query.sort)
  }

  async getProduct(slug: string): Promise<ProductRecord | null> {
    const product = PRODUCT_RECORDS.find((p) => p.slug === slug)
    if (!product) return null
    const category = findCategory(product.categorySlug)
    if (!category || category.status === 'hidden') return null
    return product
  }

  async getProductById(id: string): Promise<ProductRecord | null> {
    return PRODUCT_RECORDS.find((p) => p.id === id) ?? null
  }

  async getBuyerById(id: string): Promise<Buyer | null> {
    const seeded = BUYER_RECORDS.find((b) => b.id === id)
    if (seeded) return seeded
    const { applied } = await readFixtureState()
    return applied && applied.id === id ? buyerFromApplication(applied) : null
  }

  async authenticateBuyer(email: string, password: string): Promise<Buyer | null> {
    if (password !== FIXTURE_PASSWORD) return null
    const normalised = email.trim().toLowerCase()
    const seeded = BUYER_RECORDS.find((b) => b.email === normalised)
    if (seeded) return seeded
    const { applied } = await readFixtureState()
    return applied && applied.email === normalised ? buyerFromApplication(applied) : null
  }

  async createBuyerApplication(application: BuyerApplication): Promise<Buyer> {
    const state = await readFixtureState()
    const applied: StoredApplication = {
      id: `b-applied-${state.seq + 1}`,
      email: application.email.trim().toLowerCase(),
      retailerName: application.retailerName,
      city: application.city,
      region: application.region,
      ...(application.storeUrl ? { storeUrl: application.storeUrl } : {}),
      appliedAt: today(),
    }
    await writeFixtureState({ ...state, applied, seq: state.seq + 1 })
    return buyerFromApplication(applied)
  }

  /** Read-only: a page may render the draft; only an action may change it. */
  async getDraftOrder(buyerId: string): Promise<Order> {
    return hydrateDraft(buyerId, await readFixtureState())
  }

  async addDraftOrderLine(buyerId: string, input: AddLineInput): Promise<Order> {
    const product = await this.getProductById(input.productId)
    if (!product) throw new Error(`Unknown product: ${input.productId}`)

    const state = await readFixtureState()
    const current = state.drafts[buyerId] ?? []
    const existing = current.find((line) => line.p === product.id)
    const lines = existing
      ? current.map((line) =>
          line.p === product.id ? { ...line, q: line.q + input.quantity } : line,
        )
      : [...current, { p: product.id, q: input.quantity }]

    const next = withDraft(state, buyerId, lines)
    await writeFixtureState(next)
    return hydrateDraft(buyerId, next)
  }

  async setDraftOrderLineQuantity(
    buyerId: string,
    lineId: string,
    quantity: number,
  ): Promise<Order> {
    const state = await readFixtureState()
    const current = state.drafts[buyerId] ?? []
    const lines =
      quantity <= 0
        ? current.filter((line) => `line-${line.p}` !== lineId)
        : current.map((line) => (`line-${line.p}` === lineId ? { ...line, q: quantity } : line))

    const next = withDraft(state, buyerId, lines)
    await writeFixtureState(next)
    return hydrateDraft(buyerId, next)
  }

  async submitDraftOrder(buyerId: string, paymentMethod: PaymentMethodId): Promise<Order> {
    const state = await readFixtureState()
    const seq = state.seq + 1
    const submitted: StoredOrder = {
      id: `LB-FIXTURE-${String(seq).padStart(4, '0')}`,
      buyerId,
      createdAt: today(),
      submittedAt: today(),
      // Recorded, not acted on: the fixture collects nothing. See domain/payment.ts.
      paymentMethod,
      // History keeps a sample of the lines so five orders fit beside a full draft.
      lines: (state.drafts[buyerId] ?? []).slice(0, MAX_ORDER_LINES),
    }
    const next: FixtureState = {
      ...withDraft(state, buyerId, []),
      orders: [submitted, ...state.orders].slice(0, MAX_RECENT_ORDERS),
      seq,
    }
    await writeFixtureState(next)
    return hydrateOrder(submitted)
  }

  async listOrders(buyerId: string): Promise<readonly Order[]> {
    const seeded = ORDER_RECORDS.filter((o) => o.buyerId === buyerId)
    const state = await readFixtureState()
    const created = state.orders.filter((o) => o.buyerId === buyerId).map(hydrateOrder)
    return [...created, ...seeded].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getOrder(buyerId: string, orderId: string): Promise<Order | null> {
    const orders = await this.listOrders(buyerId)
    return orders.find((o) => o.id === orderId) ?? null
  }

  async reorder(buyerId: string, orderId: string): Promise<Order> {
    const source = await this.getOrder(buyerId, orderId)
    if (!source) throw new Error(`Unknown order: ${orderId}`)

    let next = await this.getDraftOrder(buyerId)
    for (const line of source.lines) {
      next = await this.addDraftOrderLine(buyerId, {
        productId: line.productId,
        quantity: line.quantity,
      })
    }
    return next
  }
}
