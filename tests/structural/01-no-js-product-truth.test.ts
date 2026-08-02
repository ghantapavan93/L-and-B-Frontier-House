import { describe, expect, it } from 'vitest'
import { get, PUBLIC_ROUTES } from '../helpers/http'

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
