/**
 * BUYER — the authorisation subject.
 *
 * VERIFIED FACT: a sales tax ID is required, and approval is "typically less than one
 * business day". That timing is surfaced in the pending state, which must read as an
 * invitation rather than a failure (CLAUDE.md §11).
 */

export type BuyerStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type Address = {
  readonly line1: string
  readonly line2?: string
  readonly city: string
  readonly region: string
  readonly postalCode: string
  readonly country: string
}

export type BuyerTerms = {
  readonly paymentTerms: string
  readonly shippingTerms: string
}

export type Buyer = {
  readonly id: string
  readonly email: string
  readonly retailer: {
    readonly name: string
    readonly address: Address
    readonly website?: string
  }
  /**
   * RESTRICTED. The value never leaves the server and is never rendered, logged or
   * serialised — not even to the buyer's own page. Only `verified` crosses the boundary.
   */
  readonly salesTaxId: { readonly value: string; readonly verified: boolean }
  readonly status: BuyerStatus
  readonly appliedAt: string
  readonly approvedAt?: string
  readonly statusNote?: string
  readonly terms?: BuyerTerms
  readonly isFixture: boolean
}

/** What a buyer's own session may see about itself. No tax-ID value. */
export type BuyerProfile = {
  readonly id: string
  readonly email: string
  readonly retailerName: string
  readonly status: BuyerStatus
  readonly appliedAt: string
  readonly approvedAt?: string
  readonly statusNote?: string
  readonly terms?: BuyerTerms
  readonly salesTaxIdVerified: boolean
}

export function toBuyerProfile(buyer: Buyer): BuyerProfile {
  return {
    id: buyer.id,
    email: buyer.email,
    retailerName: buyer.retailer.name,
    status: buyer.status,
    appliedAt: buyer.appliedAt,
    ...(buyer.approvedAt !== undefined ? { approvedAt: buyer.approvedAt } : {}),
    ...(buyer.statusNote !== undefined ? { statusNote: buyer.statusNote } : {}),
    ...(buyer.terms !== undefined ? { terms: buyer.terms } : {}),
    salesTaxIdVerified: buyer.salesTaxId.verified,
  }
}

/** VERIFIED FACT — surfaced verbatim in the pending state. */
export const VERIFIED_APPROVAL_TIMING = 'typically less than one business day'
