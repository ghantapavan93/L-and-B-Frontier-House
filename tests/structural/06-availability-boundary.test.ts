import { describe, expect, it } from 'vitest'
import { asBuyer, get } from '../helpers/http'
import { publicProduct, visibleProduct } from '@/auth/authorize'
import { PRODUCT_RECORDS } from '@/fixtures/products'

/**
 * THE AVAILABILITY BOUNDARY.
 *
 *   PUBLIC — the coarse state only: In stock · Pre-order · Waitlist.
 *   AUTHORISED — exact quantity, per-size quantity, account-specific terms.
 *
 * This split resolves a genuine conflict: the approval brief lists availability as
 * restricted, while CLAUDE.md §11 and acceptance criterion C1 require it public, semantic
 * and crawlable. Coarse-public / precise-restricted satisfies both. It is an assumption and
 * needs owner confirmation — recorded in the progress report.
 */

const COARSE_STATES = ['In stock', 'Pre-order', 'Waitlist']

describe('the public side of the boundary', () => {
  it('carries no per-size stock on the public product type', () => {
    for (const record of PRODUCT_RECORDS) {
      const view = publicProduct(record)
      expect('wholesale' in view, `${record.slug}`).toBe(false)
      expect(JSON.stringify(view)).not.toContain('stockBySize')
    }
  })

  it('still states the coarse status, because it must stay crawlable', async () => {
    const cases: [string, string][] = [
      ['/product/dark-wash-high-rise-flare-jean', 'In stock'],
      ['/product/leopard-print-tie-waist-flare', 'Pre-order'],
      ['/product/silver-horseshoe-drop-earrings', 'Waitlist'],
    ]

    for (const [route, state] of cases) {
      const { body } = await get(route)
      expect(body, `${route} lost its availability status`).toContain(state)
    }
  })

  it('publishes a pre-order ship window without quantities', async () => {
    const { body } = await get('/product/leopard-print-tie-waist-flare')

    expect(body).toContain('2026-09-15')
    expect(body).toContain('2026-09-30')
    expect(body).not.toContain('Stock by size')
  })

  it('exposes no unit count on any public route', async () => {
    for (const route of [
      '/',
      '/new-arrivals',
      '/shop/women',
      '/shop/girls',
      '/shop/accessories',
      '/product/dark-wash-high-rise-flare-jean',
    ]) {
      const { body } = await get(route)
      expect(body, `${route} exposed a stock table`).not.toContain('Stock by size')
      expect(body, `${route} exposed per-size units`).not.toContain('Units currently available')
      expect(body, `${route} exposed buyer terms`).not.toContain('Net 30')
    }
  })

  it('never emits the stock table or its field name in a public payload', async () => {
    /*
      Asserted by identity, not by value.

      A value-level scan cannot work here and it is worth saying why: stock counts and body
      measurements are both small integers in the same `<th scope="row">S</th><td>42</td>`
      shape, so they collide by coincidence — XL stock is 39 and a size-M hip is 39; jacket L
      stock is 38 and a size-L bust is 38. Two earlier versions of this test failed on
      exactly those collisions, reporting leaks that were not leaks.

      What is actually restricted is the stock table as a thing: its caption, its heading and
      its field name. Those are unambiguous, and the type-level test above already proves the
      values cannot reach a public payload at all.
    */
    const publicRoutes = [
      '/product/dark-wash-high-rise-flare-jean',
      '/product/black-wash-wide-leg-jean',
      '/product/silver-horseshoe-drop-earrings',
      '/shop/women',
      '/new-arrivals',
    ]

    for (const route of publicRoutes) {
      const { body } = await get(route)
      expect(body, `${route} emitted the stock caption`).not.toContain(
        'Units currently available by size',
      )
      expect(body, `${route} emitted the stock heading`).not.toContain('Stock by size')
      // Covers inline JSON and the RSC flight payload, not only rendered markup.
      expect(body, `${route} emitted the restricted field name`).not.toContain('stockBySize')
    }
  })
})

describe('the authorised side of the boundary', () => {
  it('carries exact per-size quantities on the authorised type', () => {
    const record = PRODUCT_RECORDS[0]!
    const view = visibleProduct(record, {
      kind: 'buyer',
      buyerId: 'b-approved',
      status: 'approved',
    })

    expect(view.access).toBe('authorised')
    expect('wholesale' in view).toBe(true)
    if (view.access === 'authorised') {
      expect(view.wholesale.stockBySize.length).toBeGreaterThan(0)
    }
  })

  it('renders per-size stock as a semantic table for an approved buyer', async () => {
    const { status, body } = await get(
      '/trade/product/dark-wash-high-rise-flare-jean',
      asBuyer('b-approved'),
    )

    expect(status).toBe(200)
    expect(body).toContain('Units currently available by size')
    expect(body).toContain('<table')
    expect(body).toMatch(/<th scope="row">S<\/th><td>38<\/td>/)
    expect(body).toContain('Net 30 for approved accounts')
  })

  it('withholds quantities from a buyer who is not approved', async () => {
    for (const buyer of ['b-pending', 'b-rejected', 'b-suspended']) {
      const { body } = await get(
        '/trade/product/dark-wash-high-rise-flare-jean',
        asBuyer(buyer),
      )
      expect(body, `${buyer} saw stock`).not.toContain('Units currently available')
      expect(body, `${buyer} saw terms`).not.toContain('Net 30')
    }
  })

  it('keeps the coarse state visible on both sides', async () => {
    const authorised = await get(
      '/trade/product/dark-wash-high-rise-flare-jean',
      asBuyer('b-approved'),
    )
    const anonymous = await get('/product/dark-wash-high-rise-flare-jean')

    for (const state of COARSE_STATES.slice(0, 1)) {
      expect(authorised.body).toContain(state)
      expect(anonymous.body).toContain(state)
    }
  })
})
