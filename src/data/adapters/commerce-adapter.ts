/**
 * THE ADAPTER BOUNDARY.
 *
 * VERIFIED FACT — the existing platform is CS-Cart, holding the catalogue, account
 * approvals and order history. No headless-commerce provider is selected, and the migration
 * strategy is an open question (OQ-15).
 *
 * So: define the interface, implement it against fixtures, and let the owner decision
 * resolve later without restructuring. Nothing outside `src/data` may import an adapter
 * directly — repositories are the single place authorisation is applied.
 */

import type { Buyer } from '@/domain/buyer'
import type { Order } from '@/domain/order'
import type { ProductRecord } from '@/domain/product'
import type { SizeRangeKind } from '@/domain/size'

export type ProductSort = 'newest' | 'name'

export type ProductQuery = {
  readonly categorySlug?: string
  /** Facet: only products offering this size range. */
  readonly sizeRange?: SizeRangeKind
  readonly availability?: ProductRecord['availability']
  readonly fabric?: string
  readonly detail?: string
  readonly wash?: string
  /** ISO date. Only products first offered on or after it. */
  readonly newArrivalSince?: string
  readonly sort?: ProductSort
}

export type BuyerApplication = {
  readonly email: string
  readonly retailerName: string
  readonly salesTaxId: string
  readonly city: string
  readonly region: string
}

export type AddLineInput = {
  readonly productId: string
  /** Number of prepacks. */
  readonly quantity: number
}

export interface CommerceAdapter {
  listProducts(query: ProductQuery): Promise<readonly ProductRecord[]>
  getProduct(slug: string): Promise<ProductRecord | null>
  getProductById(id: string): Promise<ProductRecord | null>

  getBuyerById(id: string): Promise<Buyer | null>
  authenticateBuyer(email: string, password: string): Promise<Buyer | null>
  createBuyerApplication(application: BuyerApplication): Promise<Buyer>

  getDraftOrder(buyerId: string): Promise<Order>
  addDraftOrderLine(buyerId: string, input: AddLineInput): Promise<Order>
  setDraftOrderLineQuantity(buyerId: string, lineId: string, quantity: number): Promise<Order>
  submitDraftOrder(buyerId: string): Promise<Order>

  listOrders(buyerId: string): Promise<readonly Order[]>
  getOrder(buyerId: string, orderId: string): Promise<Order | null>
  reorder(buyerId: string, orderId: string): Promise<Order>
}
