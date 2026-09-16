import { describe, expect, it, vi } from 'vitest'

/*
  The persistence module imports `next/headers` for the cookie jar. The functions under
  test here — the codec, the seal round-trip and the budget — never touch it, so the import
  is stubbed to a shape that throws if anything reaches for it.
*/
vi.mock('next/headers', () => ({
  cookies: () => {
    throw new Error('cookies() must not be called by the codec')
  },
}))
vi.mock('server-only', () => ({}))

import { openJson, sealJson } from '@/auth/seal'
import {
  COOKIE_BUDGET_BYTES,
  decodeState,
  EMPTY_STATE,
  fitToBudget,
  MAX_ORDER_LINES,
  type FixtureState,
  type StoredOrder,
} from '@/data/adapters/fixture-persistence'
import { PRODUCT_RECORDS } from '@/fixtures/products'

const everyLine = PRODUCT_RECORDS.map((p) => ({ p: p.id, q: 99 }))

function order(n: number, lines = everyLine.slice(0, MAX_ORDER_LINES)): StoredOrder {
  return {
    id: `LB-FIXTURE-${String(n).padStart(4, '0')}`,
    buyerId: 'b-approved',
    createdAt: '2026-09-15',
    submittedAt: '2026-09-15',
    paymentMethod: 'paypal-credit',
    lines,
  }
}

describe('the fixture state cookie', () => {
  it('round-trips through the seal and back to the same state', () => {
    const state: FixtureState = {
      v: 1,
      drafts: { 'b-approved': everyLine.slice(0, 3) },
      orders: [order(1)],
      seq: 1,
    }
    expect(decodeState(openJson(sealJson(state)))).toEqual(state)
  })

  it('reads a tampered seal, a wrong version, and a malformed shape as empty', () => {
    const good = sealJson({ v: 1, drafts: {}, orders: [order(1)], seq: 1 })
    const [body, sig] = good.split('.') as [string, string]
    const flipped = `${body}.${sig.slice(0, -1)}${sig.endsWith('A') ? 'B' : 'A'}`
    expect(decodeState(openJson(flipped))).toEqual(EMPTY_STATE)

    expect(decodeState({ v: 2, drafts: {}, orders: [], seq: 0 })).toEqual(EMPTY_STATE)
    expect(
      decodeState({ v: 1, drafts: { x: [{ p: 'p-1', q: 0 }] }, orders: [], seq: 0 }),
    ).toEqual(EMPTY_STATE)
    expect(
      decodeState({
        v: 1,
        drafts: {},
        orders: [{ ...order(1), paymentMethod: 'affirm' }],
        seq: 0,
      }),
    ).toEqual(EMPTY_STATE)
    expect(decodeState('not an object')).toEqual(EMPTY_STATE)
  })

  it('never stores a price, a SKU or a name — only product ids and pack counts', () => {
    const sealed = sealJson({
      v: 1,
      drafts: { 'b-approved': everyLine },
      orders: [order(1)],
      seq: 1,
    })
    const body = Buffer.from(sealed.split('.')[0]!, 'base64url').toString('utf8')
    expect(body).not.toMatch(/amountMinor|unitPrice|sku|wholesale|displayName|\$\d/)
  })

  it('fits the worst case into one cookie by dropping the oldest orders, never the draft', () => {
    // Every product in two drafts, five orders each at the line cap: over budget on purpose.
    const worst: FixtureState = {
      v: 1,
      drafts: { 'b-approved': everyLine, 'b-pending': everyLine },
      orders: [5, 4, 3, 2, 1].map((n) => order(n)),
      applied: {
        id: 'b-applied-9',
        email: 'someone@example-boutique.com',
        retailerName: 'A Fairly Long Boutique Name LLC',
        city: 'Fort Worth',
        region: 'TX',
        storeUrl: 'https://example-boutique.com',
        appliedAt: '2026-09-15',
      },
      seq: 9,
    }
    expect(
      sealJson(worst).length,
      'the fixture must exceed the budget for the test to mean anything',
    ).toBeGreaterThan(COOKIE_BUDGET_BYTES)

    const fitted = fitToBudget(worst)
    expect(sealJson(fitted).length).toBeLessThanOrEqual(COOKIE_BUDGET_BYTES)
    // A browser's hard ceiling is 4,093 bytes; the budget sits under it with headroom.
    expect(sealJson(fitted).length).toBeLessThan(4093)
    expect(fitted.drafts).toEqual(worst.drafts)
    expect(fitted.applied).toEqual(worst.applied)
    // Newest first: what was dropped is the tail, i.e. the oldest.
    expect(fitted.orders[0]?.id).toBe('LB-FIXTURE-0005')
    expect(fitted.orders.length).toBeLessThan(worst.orders.length)
  })

  it('leaves a realistic state untouched', () => {
    const realistic: FixtureState = {
      v: 1,
      drafts: { 'b-approved': everyLine.slice(0, 3) },
      orders: [5, 4, 3, 2, 1].map((n) => order(n, everyLine.slice(0, 3))),
      seq: 5,
    }
    expect(fitToBudget(realistic)).toEqual(realistic)
  })
})
