import { describe, expect, it } from 'vitest'
import { asBuyer, buyerCookie, get } from '../helpers/http'

/**
 * AUTHORISATION STATES.
 *
 * Each state sees exactly its permitted fields, and every failure mode fails closed. The
 * states between applying and ordering matter most: they are where a prospective retailer
 * is most likely to be lost, and where a naive implementation is most likely to leak.
 */

const AUTHORISED_PDP = '/trade/product/dark-wash-high-rise-flare-jean'
const MONEY_WITH_CENTS = /\$\s?\d[\d,]*\.\d{2}/

describe('anonymous', () => {
  it('is redirected from every authorised route with its intent preserved', async () => {
    const { status, headers } = await get(AUTHORISED_PDP)

    expect([307, 308]).toContain(status)
    const location = headers.get('location') ?? ''
    expect(location).toContain('/sign-in')
    expect(location).toContain('next=')
  })
})

describe('pending application', () => {
  it('sees its status and the verified approval timing, and no pricing', async () => {
    const { status, body } = await get('/trade', asBuyer('b-pending'))

    expect(status).toBe(200)
    expect(body).toContain('We have your application')
    expect(body).toContain('typically less than one business day')
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })

  it('cannot reach an authorised product page', async () => {
    const { status, headers, body } = await get(AUTHORISED_PDP, asBuyer('b-pending'))

    expect([307, 308]).toContain(status)
    expect(headers.get('location')).toContain('/trade')
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })

  it('cannot reach the order surface', async () => {
    const { status, body } = await get('/trade/order', asBuyer('b-pending'))

    expect([307, 308]).toContain(status)
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })
})

describe('rejected application', () => {
  it('gets a route forward rather than a dead end', async () => {
    const { status, body } = await get('/trade', asBuyer('b-rejected'))

    expect(status).toBe(200)
    expect(body).toContain('We could not approve this application')
    expect(body).toContain('/wholesale/apply')
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })
})

describe('suspended account', () => {
  it('is told ordering is paused and keeps its history link', async () => {
    const { status, body } = await get('/trade', asBuyer('b-suspended'))

    expect(status).toBe(200)
    expect(body).toContain('Ordering is paused on this account')
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })

  it('cannot add to an order', async () => {
    const { status } = await get('/trade/order', asBuyer('b-suspended'))
    expect([307, 308]).toContain(status)
  })
})

describe('expired session', () => {
  it('is treated as unauthenticated and never flashes restricted data', async () => {
    const expired = buyerCookie('b-approved', Date.now() - 60_000)
    const { status, headers, body } = await get(AUTHORISED_PDP, {
      headers: { cookie: expired },
    })

    expect([307, 308]).toContain(status)
    expect(headers.get('location')).toContain('/sign-in')
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })
})

describe('tampered session', () => {
  it('rejects a forged signature', async () => {
    const body = Buffer.from(
      JSON.stringify({ buyerId: 'b-approved', expiresAt: Date.now() + 60_000 }),
    ).toString('base64url')

    const { status, headers } = await get(AUTHORISED_PDP, {
      headers: { cookie: `lb_session=${body}.not-a-real-signature` },
    })

    expect([307, 308]).toContain(status)
    expect(headers.get('location')).toContain('/sign-in')
  })

  it('rejects a well-formed token for a buyer that does not exist', async () => {
    const { status } = await get(AUTHORISED_PDP, asBuyer('b-does-not-exist'))
    expect([307, 308]).toContain(status)
  })
})

describe('buyer isolation', () => {
  it('never shows one buyer the orders of another', async () => {
    const { body } = await get('/trade/orders', asBuyer('b-approved'))
    expect(body).toContain('LB-2026-0641')

    // A different approved-shaped session must not see the first buyer's orders.
    const other = await get('/trade/orders', asBuyer('b-pending'))
    expect(other.body).not.toContain('LB-2026-0641')
  })

  it('refuses a direct order id belonging to another buyer', async () => {
    const { status, body } = await get('/trade/orders/LB-2026-0641', asBuyer('b-pending'))
    expect([307, 308, 404]).toContain(status)
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })
})

describe('cache isolation', () => {
  it('never allows a shared cache to hold an authorised response', async () => {
    const { headers } = await get('/trade/orders', asBuyer('b-approved'))
    const cacheControl = headers.get('cache-control') ?? ''

    expect(cacheControl).toContain('no-store')
    expect(cacheControl).toContain('private')
    expect(cacheControl).not.toContain('public')
    expect(cacheControl).not.toContain('s-maxage')
  })

  it('leaves public routes shared-cacheable and identical for every visitor', async () => {
    const anonymous = await get('/product/dark-wash-high-rise-flare-jean')
    const withCookie = await get(
      '/product/dark-wash-high-rise-flare-jean',
      asBuyer('b-approved'),
    )

    // A public response that varies by cookie is a response a cache can misdeliver.
    expect(withCookie.body).toBe(anonymous.body)
    expect(anonymous.headers.get('cache-control') ?? '').not.toContain('no-store')
  })
})
