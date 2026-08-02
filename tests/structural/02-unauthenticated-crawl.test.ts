import { describe, expect, it } from 'vitest'
import { extractUrls, get, PUBLIC_ROUTES, TRADE_ROUTES } from '../helpers/http'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import { BUYER_RECORDS } from '@/fixtures/buyers'

/**
 * TEST 2 — RESTRICTED PRICING IS ABSENT FROM EVERY UNAUTHENTICATED SURFACE.
 *
 * Absent, not hidden. The public product type has no wholesale field, so the assertions
 * below should hold by construction — this test is what proves the construction held.
 *
 * Assertion B (slug purity) is the test that prevents D-00 from recurring: the live site
 * leaks wholesale cost through price-bearing URL slugs on 17 homepage products and 14 on a
 * drop page.
 */

/** Any precise money amount. No public surface states one. */
const MONEY_WITH_CENTS = /\$\s?\d[\d,]*\.\d{2}/

/** The SKU shape used across the catalogue. */
const SKU_PATTERN = /LB-[A-Z]{3}-[A-Z]{3}/

/** D-00: a price baked into a URL path segment. */
const PRICE_IN_SLUG = /\/\d{1,3}-\d{2}-[a-z]/

const RESTRICTED_TERMS = [
  'WHLSL',
  'wholesalePrice',
  'Your wholesale terms',
  'Pack breakdown',
  'Suggested retail',
  'Add to order',
  'stockBySize',
  'Stock by size',
]

describe('Test 2A — no restricted value on any public surface', () => {
  it('never states a precise money amount on a public route', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      expect(body, `${route} exposed a money value`).not.toMatch(MONEY_WITH_CENTS)
    }
  })

  it('never exposes a SKU on a public route', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      expect(body, `${route} exposed a SKU`).not.toMatch(SKU_PATTERN)
    }
  })

  it('never exposes restricted vocabulary on a public route', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      for (const term of RESTRICTED_TERMS) {
        expect(body, `${route} exposed "${term}"`).not.toContain(term)
      }
    }
  })

  it('never exposes an exact wholesale, pack or MSRP figure', async () => {
    const figures = PRODUCT_RECORDS.flatMap((product) => [
      (product.wholesale.wholesalePrice.amountMinor / 100).toFixed(2),
      (product.wholesale.msrp.amountMinor / 100).toFixed(2),
      (product.wholesale.packPrice.amountMinor / 100).toFixed(2),
    ])

    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      for (const figure of figures) {
        expect(body, `${route} exposed the figure ${figure}`).not.toContain(figure)
      }
    }
  })

  it('never exposes a sales tax ID', async () => {
    const taxIds = BUYER_RECORDS.map((buyer) => buyer.salesTaxId.value)

    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      for (const taxId of taxIds) {
        expect(body, `${route} exposed a sales tax ID`).not.toContain(taxId)
      }
    }
  })

  it('emits Product structured data with no offers block', async () => {
    const { body } = await get('/product/dark-wash-high-rise-flare-jean')

    expect(body).toContain('application/ld+json')
    expect(body).toContain('"@type":"Product"')
    // Omitted entirely rather than zeroed: `offers` is the most aggressively crawled field
    // on the page and must never carry a restricted figure.
    expect(body).not.toContain('"offers"')
    expect(body).not.toContain('"price"')
  })

  it('keeps restricted values out of titles, meta and Open Graph', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { body } = await get(route)
      const head = body.slice(0, body.indexOf('</head>') + 7)
      expect(head, `${route} head exposed a money value`).not.toMatch(MONEY_WITH_CENTS)
      expect(head, `${route} head exposed a SKU`).not.toMatch(SKU_PATTERN)
    }
  })

  it('excludes authorised routes from the sitemap', async () => {
    const { body } = await get('/sitemap.xml')
    expect(body).not.toContain('/trade')
  })

  it('serves no restricted value in response headers', async () => {
    for (const route of PUBLIC_ROUTES) {
      const { headers } = await get(route)
      const serialised = [...headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
      expect(serialised, `${route} headers exposed a money value`).not.toMatch(MONEY_WITH_CENTS)
      expect(serialised, `${route} headers exposed a SKU`).not.toMatch(SKU_PATTERN)
    }
  })

  it('denies every authorised route to an anonymous session', async () => {
    for (const route of TRADE_ROUTES) {
      const { status, headers, body } = await get(route)

      expect([307, 308], `${route} returned ${status} to anonymous`).toContain(status)
      expect(headers.get('location')).toContain('/sign-in')
      expect(body, `${route} leaked a money value while redirecting`).not.toMatch(
        MONEY_WITH_CENTS,
      )
    }
  })
})

describe('Test 2B — slug purity', () => {
  it('emits no URL containing a price pattern', async () => {
    for (const route of [...PUBLIC_ROUTES]) {
      const { body } = await get(route)
      for (const url of extractUrls(body)) {
        expect(url, `${route} emitted a price-bearing URL: ${url}`).not.toMatch(PRICE_IN_SLUG)
      }
    }
  })

  it('has no price pattern in any product slug', () => {
    for (const product of PRODUCT_RECORDS) {
      expect(`/${product.slug}`, `slug ${product.slug}`).not.toMatch(PRICE_IN_SLUG)
    }
  })

  it('has no price pattern in the sitemap', async () => {
    const { body } = await get('/sitemap.xml')
    for (const url of extractUrls(body)) {
      expect(url, `sitemap emitted ${url}`).not.toMatch(PRICE_IN_SLUG)
    }
  })
})
