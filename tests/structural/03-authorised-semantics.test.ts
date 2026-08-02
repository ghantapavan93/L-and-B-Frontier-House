import { describe, expect, it } from 'vitest'
import { asBuyer, get } from '../helpers/http'

/**
 * TEST 3 — AUTHORISED BUYER PRICING AND CONTROLS EXIST AS SEMANTIC, ACCESSIBLE HTML.
 *
 * The security rule and the accessibility rule point the same way: a price drawn into a
 * canvas or baked into an image is unreachable by a screen reader AND unverifiable by this
 * test. Restricted values must be server-rendered text inside the authorised session.
 */

const AUTHORISED_PDP = '/trade/product/dark-wash-high-rise-flare-jean'

describe('Test 3 — authorised commerce is real HTML', () => {
  it('renders wholesale price, MSRP, MOQ, SKU and terms as text', async () => {
    const { status, body } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    expect(status).toBe(200)
    expect(body).toContain('$31.00')
    expect(body).toContain('$82.00')
    expect(body).toContain('JE334-DW')
    expect(body).toContain('6 units of this style')
    expect(body).toContain('Net 30')
  })

  it('renders the prepack composition as a table with a real size run', async () => {
    const { body } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    expect(body).toContain('Units per prepack (6 total)')
    expect(body).toContain('<table')
    expect(body).toContain('scope="row"')
    // The verified prepack structure is 6 units.
    expect(body).toMatch(/Total<\/th><td>6<\/td>/)
  })

  it('renders Add to Order as a real button in a real form', async () => {
    const { body } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    expect(body).toMatch(/<form[^>]*>/)
    expect(body).toMatch(/<button[^>]*type="submit"[^>]*>Add to order<\/button>/)
    expect(body).toContain('<label')
    expect(body).toContain('id="quantity"')
  })

  it('draws no restricted value into a canvas or an image', async () => {
    const { body } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    expect(body).not.toContain('<canvas')
    // No price may appear in alt text.
    for (const match of body.matchAll(/alt="([^"]*)"/g)) {
      expect(match[1] ?? '').not.toMatch(/\$\s?\d/)
    }
  })

  it('marks every authorised response private and non-indexable', async () => {
    const { headers } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    // `no-store` is the operative control: no cache, shared or private, may store the
    // response at all. `Vary: Cookie` is not asserted because Next owns the Vary header for
    // RSC negotiation and replaces any value declared in next.config — a middleware append
    // was tried and measured as ineffective. With `no-store` present, Vary is moot.
    expect(headers.get('cache-control')).toContain('no-store')
    expect(headers.get('cache-control')).toContain('private')
    expect(headers.get('cache-control')).not.toContain('public')
    expect(headers.get('x-robots-tag')).toContain('noindex')
  })

  it('shows a running order with minimum progress as accessible markup', async () => {
    const { body } = await get('/trade/order', asBuyer('b-approved'))

    expect(body).toContain('Your order')
    // The empty state is a designed state, not a blank page.
    expect(body).toMatch(/Nothing in this order yet|Styles in this order/)
  })

  it('renders order history with reorder as real form controls', async () => {
    const { body } = await get('/trade/orders', asBuyer('b-approved'))

    expect(body).toContain('LB-2026-0641')
    expect(body).toContain('In production')
    expect(body).toMatch(/<button[^>]*type="submit"[^>]*>Reorder/)
  })

  it('exposes MSRP beside wholesale so a buyer can do margin maths', async () => {
    const { body } = await get(AUTHORISED_PDP, asBuyer('b-approved'))

    // Recovered from V2 Frame 6; V3 Frame 11 dropped it.
    expect(body).toMatch(/Suggested retail \$82\.00 — 62% margin/)
  })
})
