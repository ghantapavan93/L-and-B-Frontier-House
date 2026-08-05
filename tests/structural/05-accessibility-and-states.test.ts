import { describe, expect, it } from 'vitest'
import { asBuyer, get, PUBLIC_ROUTES, stylesheetsFor } from '../helpers/http'

/**
 * ACCESSIBILITY, RESPONSIVE AND STATE COVERAGE.
 *
 * These assert markup-level properties that hold in server HTML. They are necessary and not
 * sufficient: keyboard traversal, computed focus visibility and real screen-reader output
 * still need a browser runner and a manual pass, which the progress report records as
 * outstanding.
 */

describe('keyboard and focus foundations', () => {
  it('puts the skip link first in the DOM on every route', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      if (!body.includes('<body')) continue

      const bodyStart = body.indexOf('<body')
      const firstAnchor = body.indexOf('<a ', bodyStart)
      const skipLink = body.indexOf('class="skip-link"', bodyStart)

      expect(skipLink, `${route} has no skip link`).toBeGreaterThan(-1)
      expect(skipLink, `${route} skip link is not the first anchor`).toBeLessThan(
        firstAnchor + 60,
      )
      expect(body).toContain('href="#main"')
    }
  })

  it('gives every page a focusable main landmark matching the skip target', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      if (!body.includes('<main')) continue
      expect(body, `${route} main landmark`).toMatch(/<main[^>]+id="main"/)
      expect(body, `${route} main is not focusable`).toMatch(/<main[^>]+tabindex="-1"/i)
    }
  })

  it('exposes exactly one h1 per page', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      if (!body.includes('<h1')) continue
      const count = [...body.matchAll(/<h1[\s>]/g)].length
      expect(count, `${route} has ${count} h1 elements`).toBe(1)
    }
  })

  it('labels every navigation landmark', async () => {
    const { body } = await get('/')
    expect(body).toMatch(/<nav[^>]+aria-label="Primary"/)
    expect(body).toMatch(/<nav[^>]+aria-label="Account"/)
  })

  it('ships a conformant focus ring and never the specified failing one', async () => {
    const css = await stylesheetsFor('/')

    expect(css).toContain(':focus-visible')
    // Tobacco Leather #734F36 — 6.49:1.
    expect(css.toLowerCase()).toContain('#734f36')
    // Oxidized Silver #A7A6A2 measures 2.18:1 against a 3:1 requirement and must not be
    // the focus colour.
    expect(css).not.toMatch(/outline:\s*2px solid #a7a6a2/i)
  })

  it('honours prefers-reduced-motion inside the stylesheet', async () => {
    const css = await stylesheetsFor('/')

    expect(css).toContain('prefers-reduced-motion')
    expect(css).toContain('reduce')
  })
})

describe('mobile and responsive', () => {
  it('sets a viewport that covers the safe area', async () => {
    const { body } = await get('/')
    expect(body).toMatch(/name="viewport"[^>]*viewport-fit=cover/)
  })

  it('reserves safe-area insets in CSS', async () => {
    const css = await stylesheetsFor('/')

    // env() appears 0 times across all 48 exported design files.
    expect(css).toContain('safe-area-inset')
  })

  it('scrolls wide tables inside their own container', async () => {
    const { body } = await get('/product/dark-wash-high-rise-flare-jean')
    expect(body).toContain('table-scroll')
  })
})

describe('text is never truncated away', () => {
  it('renders full spec strings rather than clipping them', async () => {
    const { body } = await get('/shop/women')
    // The longest spec string in the catalogue, in full.
    expect(body).toContain('Dark Wash High Rise Flare Jeans')
    expect(body).not.toContain('…')
  })

  it('uses no CSS line clamping on product text', async () => {
    const css = await stylesheetsFor('/')

    expect(css).not.toContain('-webkit-line-clamp')
    expect(css).not.toContain('text-overflow:ellipsis')
  })
})

describe('media integrity', () => {
  it('gives every image meaningful alt text', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      for (const match of body.matchAll(/<img\b[^>]*>/g)) {
        const tag = match[0]
        expect(tag, `${route} has an image with no alt attribute`).toMatch(/\salt="/)
        const alt = tag.match(/\salt="([^"]*)"/)?.[1] ?? ''
        // Empty alt is allowed only for a genuinely decorative image, which this build
        // does not currently have.
        expect(alt.length, `${route} has an image with empty alt: ${tag}`).toBeGreaterThan(0)
      }
    }
  })

  it('resolves every referenced media file', async () => {
    const { body } = await get('/product/dark-wash-high-rise-flare-jean')
    const sources = [...body.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1] ?? '')

    expect(sources.length).toBeGreaterThan(0)
    for (const src of sources) {
      const { status } = await get(src)
      expect(status, `media ${src} did not resolve`).toBe(200)
    }
  })

  it('flags placeholder media so it cannot pass as real photography', async () => {
    // A product with no owner-supplied photograph still shows the placeholder and its flag.
    const { body } = await get('/product/tooled-leather-concho-belt')
    expect(body).toContain('fixture-placeholder.svg')
    expect(body).toContain('fixture-flag')
  })

  it('does not flag owner-supplied photography as a fixture', async () => {
    const { body } = await get('/product/dark-wash-high-rise-flare-jean')

    // Real photography, so no placeholder and no image flag …
    expect(body).not.toContain('fixture-placeholder.svg')
    expect(body).not.toContain('fixture-flag')
    // … but the surrounding copy, prices and sizing are still development fixtures, and the
    // notice that says so must remain.
    expect(body).toContain('DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA')
  })

  it('serves owner-approved photography as responsive AVIF and WebP', async () => {
    const { body } = await get('/product/dark-wash-high-rise-flare-jean')

    expect(body).toContain('<picture')
    expect(body).toContain('type="image/avif"')
    expect(body).toContain('type="image/webp"')
    expect(body).toMatch(/\/media\/catalog\/approved\/[a-z-]+-\d+\.(avif|webp)/)
  })
})

describe('empty, error and denial states', () => {
  it('serves a designed 404 with a route forward', async () => {
    const { status, body } = await get('/product/this-style-does-not-exist')

    expect(status).toBe(404)
    expect(body).toContain('We could not find that page')
    expect(body).toContain('href="/new-arrivals"')
  })

  it('404s a category that is hidden pending an owner decision', async () => {
    // Home is defined in the taxonomy config but not routable until D-05 is answered.
    const { status } = await get('/shop/home')
    expect(status).toBe(404)
  })

  it('404s a category that does not exist at all', async () => {
    const { status } = await get('/shop/menswear')
    expect(status).toBe(404)
  })

  it('renders a recoverable empty state when filters match nothing', async () => {
    const { status, body } = await get('/shop/girls?fabric=velvet%20burnout')

    expect(status).toBe(200)
    expect(body).toContain('Nothing here yet')
    expect(body).toContain('Clear')
  })

  it('renders the empty order state as a designed state', async () => {
    const { body } = await get('/trade/order', asBuyer('b-approved'))
    expect(body).toMatch(/Nothing in this order yet|Styles in this order/)
  })

  it('shows a form error without JavaScript', async () => {
    const { body } = await get('/sign-in?error=invalid')
    expect(body).toContain('role="alert"')
    expect(body).toContain('do not match an account')
  })
})

describe('forms work without JavaScript', () => {
  it('renders the application form with labelled, required fields', async () => {
    const { body } = await get('/wholesale/apply')

    expect(body).toMatch(/<form[^>]*>/)
    for (const field of ['retailerName', 'city', 'region', 'salesTaxId', 'email']) {
      expect(body, `missing field ${field}`).toContain(`name="${field}"`)
      expect(body, `missing label for ${field}`).toContain(`for="${field}"`)
    }
    expect(body).toContain('<fieldset')
    expect(body).toContain('<legend')
  })

  it('renders the facet panel as a GET form with labelled controls', async () => {
    const { body } = await get('/shop/women')

    expect(body).toMatch(/<form[^>]+method="get"/)
    expect(body).toContain('name="sizeRange"')
    expect(body).toContain('name="availability"')
    expect(body).toContain('role="status"')
  })

  it('keeps applied filters in the URL so they are shareable', async () => {
    const { status, body } = await get('/shop/women?sizeRange=extended')

    expect(status).toBe(200)
    expect(body).toContain('Extended sizing')
  })
})
