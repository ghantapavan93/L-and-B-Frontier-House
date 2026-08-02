/**
 * DEVELOPMENT FIXTURE ADAPTER.
 *
 * In-memory implementation of `CommerceAdapter`. Draft orders and new applications live in
 * a process-local store, so they do not survive a server restart. That is acceptable for
 * the first vertical slice and is recorded as a known limitation in the progress report.
 */

import { BUYER_RECORDS, FIXTURE_PASSWORD } from '@/fixtures/buyers'
import { ORDER_RECORDS } from '@/fixtures/orders'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import type { Buyer } from '@/domain/buyer'
import type { Order, OrderLine } from '@/domain/order'
import type { ProductRecord } from '@/domain/product'
import { findCategory } from '@/domain/taxonomy'
import type {
  AddLineInput,
  BuyerApplication,
  CommerceAdapter,
  ProductQuery,
} from './commerce-adapter'

/**
 * Next.js reloads modules in development. Anchoring mutable state on globalThis keeps a
 * draft order alive across a hot reload, which otherwise makes the order surface untestable.
 */
type MutableStore = {
  drafts: Map<string, Order>
  applications: Buyer[]
  submitted: Order[]
  sequence: number
}

const STORE_KEY = Symbol.for('lb.fixture-commerce-store')

function store(): MutableStore {
  const holder = globalThis as typeof globalThis & { [STORE_KEY]?: MutableStore }
  if (!holder[STORE_KEY]) {
    holder[STORE_KEY] = { drafts: new Map(), applications: [], submitted: [], sequence: 0 }
  }
  return holder[STORE_KEY]
}

function nextId(prefix: string): string {
  const s = store()
  s.sequence += 1
  return `${prefix}-${s.sequence}`
}

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

function emptyDraft(buyerId: string): Order {
  return {
    id: `draft-${buyerId}`,
    buyerId,
    status: 'draft',
    createdAt: new Date().toISOString().slice(0, 10),
    lines: [],
  }
}

function lineFromProduct(product: ProductRecord, quantity: number): OrderLine {
  return {
    id: nextId('line'),
    productId: product.id,
    productSlug: product.slug,
    productName: product.displayName,
    sku: product.wholesale.sku,
    prepack: product.wholesale.prepack,
    quantity,
    unitPrice: product.wholesale.wholesalePrice,
  }
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
    return store().applications.find((b) => b.id === id) ?? null
  }

  async authenticateBuyer(email: string, password: string): Promise<Buyer | null> {
    if (password !== FIXTURE_PASSWORD) return null
    const normalised = email.trim().toLowerCase()
    const seeded = BUYER_RECORDS.find((b) => b.email === normalised)
    if (seeded) return seeded
    return store().applications.find((b) => b.email === normalised) ?? null
  }

  async createBuyerApplication(application: BuyerApplication): Promise<Buyer> {
    const buyer: Buyer = {
      id: nextId('b-applied'),
      email: application.email.trim().toLowerCase(),
      retailer: {
        name: application.retailerName,
        address: {
          line1: '—',
          city: application.city,
          region: application.region,
          postalCode: '—',
          country: 'US',
        },
      },
      salesTaxId: { value: application.salesTaxId, verified: false },
      status: 'pending',
      appliedAt: new Date().toISOString().slice(0, 10),
      isFixture: true,
    }
    store().applications.push(buyer)
    return buyer
  }

  async getDraftOrder(buyerId: string): Promise<Order> {
    const existing = store().drafts.get(buyerId)
    if (existing) return existing
    const draft = emptyDraft(buyerId)
    store().drafts.set(buyerId, draft)
    return draft
  }

  async addDraftOrderLine(buyerId: string, input: AddLineInput): Promise<Order> {
    const product = await this.getProductById(input.productId)
    if (!product) throw new Error(`Unknown product: ${input.productId}`)

    const draft = await this.getDraftOrder(buyerId)
    const existing = draft.lines.find((l) => l.productId === product.id)

    const lines = existing
      ? draft.lines.map((l) =>
          l.id === existing.id ? { ...l, quantity: l.quantity + input.quantity } : l,
        )
      : [...draft.lines, lineFromProduct(product, input.quantity)]

    const updated: Order = { ...draft, lines }
    store().drafts.set(buyerId, updated)
    return updated
  }

  async setDraftOrderLineQuantity(
    buyerId: string,
    lineId: string,
    quantity: number,
  ): Promise<Order> {
    const draft = await this.getDraftOrder(buyerId)
    const lines =
      quantity <= 0
        ? draft.lines.filter((l) => l.id !== lineId)
        : draft.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l))
    const updated: Order = { ...draft, lines }
    store().drafts.set(buyerId, updated)
    return updated
  }

  async submitDraftOrder(buyerId: string): Promise<Order> {
    const draft = await this.getDraftOrder(buyerId)
    const today = new Date().toISOString().slice(0, 10)
    const submitted: Order = {
      ...draft,
      id: `LB-FIXTURE-${String(store().submitted.length + 1).padStart(4, '0')}`,
      status: 'submitted',
      submittedAt: today,
    }
    store().submitted.push(submitted)
    store().drafts.set(buyerId, emptyDraft(buyerId))
    return submitted
  }

  async listOrders(buyerId: string): Promise<readonly Order[]> {
    const seeded = ORDER_RECORDS.filter((o) => o.buyerId === buyerId)
    const created = store().submitted.filter((o) => o.buyerId === buyerId)
    return [...created, ...seeded].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getOrder(buyerId: string, orderId: string): Promise<Order | null> {
    const orders = await this.listOrders(buyerId)
    return orders.find((o) => o.id === orderId) ?? null
  }

  async reorder(buyerId: string, orderId: string): Promise<Order> {
    const source = await this.getOrder(buyerId, orderId)
    if (!source) throw new Error(`Unknown order: ${orderId}`)

    const draft = await this.getDraftOrder(buyerId)
    let next = draft
    for (const line of source.lines) {
      next = await this.addDraftOrderLine(buyerId, {
        productId: line.productId,
        quantity: line.quantity,
      })
    }
    return next
  }
}
