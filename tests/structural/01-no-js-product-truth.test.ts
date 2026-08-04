import { describe, expect, it } from 'vitest'
import { asBuyer, get, PUBLIC_ROUTES, TRADE_ROUTES } from '../helpers/http'

/**
 * TEST 1 — PUBLIC CONTENT WITHOUT JAVASCRIPT.
 *
 * A raw HTTP fetch IS the no-JavaScript view: no client bundle has run. Everything asserted
 * below must therefore be present in server-rendered HTML.
 *
 * This is the structural defence against the atmosphere layer swallowing the commerce
 * layer — the failure where the hero becomes a canvas for a smoother dissolve, then the grid
 * joins it, then the type joins to avoid relayout. Nobody decides to remove the products.
 * Code review will not catch it. This test will.
 */

const PRODUCT_ROUTE = '/product/dark-wash-high-rise-flare-jean'

describe('Test 1 — product truth is present without JavaScript', () => {
  it('renders every public product fact in server HTML', async () => {
    const { status, body } = await get(PRODUCT_ROUTE)

    expect(status).toBe(200)

    // Name, both editorial and spec.
    expect(body).toContain('Dark Wash Flare')
    expect(body).toContain('Dark Wash High Rise Flare Jeans')

    // Description, materials, detail, colour.
    expect(body).toContain('high-rise flare cut in dark wash denim')
    expect(body).toContain('denim')
    expect(body).toContain('flare')
    expect(body).toContain('Dark Wash')

    // Size range, in full.
    for (const size of ['S', 'M', 'L', 'XL', '1X', '2X', '3X']) {
      expect(body).toMatch(new RegExp(`>${size}<`))
    }

    // Availability.
    expect(body).toContain('In stock')
  })

  it('renders the size chart as a real table, never as an image', async () => {
    const { body } = await get(PRODUCT_ROUTE)

    expect(body).toContain('<table')
    expect(body).toContain('<caption')
    expect(body).toContain('scope="row"')
    expect(body).toContain('scope="col"')

    // The live site ships a text-free JPEG. Measurements must be readable text.
    expect(body).toMatch(/Waist/)
    expect(body).toMatch(/Inseam/)
  })

  it('renders category navigation and product links as real anchors', async () => {
    const { body } = await get('/shop/women')

    expect(body).toMatch(/<a[^>]+href="\/product\/dark-wash-high-rise-flare-jean"/)
    expect(body).toMatch(/<a[^>]+href="\/new-arrivals"/)
  })

  it('lists every product on its category page without JavaScript', async () => {
    const { body } = await get('/shop/girls')

    expect(body).toContain('Ranch Ruffle Short')
    expect(body).toContain('Yee Haw Tee')
  })

  it('never renders a product name into a canvas', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      expect(body, `${route} must not use canvas for content`).not.toContain('<canvas')
    }
  })

  it('serves every public route successfully', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { status } = await get(route)
      expect(status, `${route} returned ${status}`).toBe(200)
    }
  })
})

/**
 * TEST 1B — NO CONTENT PARKED BEHIND A SUSPENSE FALLBACK.
 *
 * "Present in the HTML" and "visible without JavaScript" are not the same property, and the
 * gap between them is wide enough to drive the whole failure mode through. A streaming
 * `<Suspense>` boundary serves this, measured on this build:
 *
 *     <h1>…</h1><!--$?--><template id="B:0"></template>THE FALLBACK<!--/$-->
 *     …
 *     <div hidden id="S:0">THE REAL CONTENT</div><script>$RC("B:0","S:0")</script>
 *
 * The real content IS in the bytes — so every assertion above it still passes — but it is
 * inside `hidden`, and the swap is performed by `$RC`, which is JavaScript. With JavaScript
 * off, the visitor keeps the fallback for good: no product name, nothing to Ctrl-F, nothing
 * a screen reader will announce. That is precisely the state Test 1 exists to forbid, and a
 * byte-level assertion cannot see it.
 *
 * So the boundary markers themselves are the thing to assert on. `<!--$?-->` marks a
 * boundary still pending when the shell flushed; `<div hidden id="S:` marks content parked
 * for a client-side swap. A *resolved* boundary streams as `<!--$-->…<!--/$-->` with its
 * content inline and is entirely fine — this only fails deferral, not `<Suspense>`.
 *
 * The trade routes are covered too. They are session-gated, not JavaScript-gated: the order
 * surface is deliberately built to work with scripting disabled.
 */
describe('Test 1B — nothing is deferred behind a fallback JavaScript must replace', () => {
  const PENDING_BOUNDARY = '<!--$?-->'
  const PARKED_CONTENT = '<div hidden id="S:'

  it('flushes no pending boundary on any public route', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)

      expect(
        body.includes(PENDING_BOUNDARY),
        `${route} serves a pending Suspense fallback — without JavaScript that fallback is ` +
          `the final state of the page`,
      ).toBe(false)

      expect(
        body.includes(PARKED_CONTENT),
        `${route} parks content in a hidden container for a client-side swap`,
      ).toBe(false)
    }
  })

  it('flushes no pending boundary on any authorised route', async () => {
    for (const route of TRADE_ROUTES) {
      const { body } = await get(route, asBuyer('b-approved'))

      expect(
        body.includes(PENDING_BOUNDARY),
        `${route} serves a pending Suspense fallback`,
      ).toBe(false)
      expect(
        body.includes(PARKED_CONTENT),
        `${route} parks content in a hidden container`,
      ).toBe(false)
    }
  })
})
