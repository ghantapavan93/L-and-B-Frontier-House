import { describe, expect, it } from 'vitest'
import { asBuyer, extractUrls, get } from '../helpers/http'

/**
 * THE ASSORTMENT BUILDER.
 *
 * Two properties matter here beyond the ordinary authorisation sweep that `TRADE_ROUTES`
 * already applies.
 *
 * First, this is the one restricted surface driven by a GET form, so its inputs become a
 * URL — and a URL reaches browser history, the referrer header and every access log between
 * here and the buyer. No L&B price may travel that way, which is why the price band submits
 * an opaque label.
 *
 * Second, the surface makes a claim about its own basis. A tool that fills a budget from a
 * catalogue is indistinguishable from one that predicts demand unless it says otherwise, so
 * the statement that it uses no sales or regional data is load-bearing product truth and is
 * asserted like any other.
 */

const PLAN = '/trade/assortment?budget=2500&storeSize=established&mix=balanced&band=core'
const MONEY_WITH_CENTS = /\$\s?\d[\d,]*\.\d{2}/
const SKU_PATTERN = /\b[A-Z]{2,4}\d{2,4}-[A-Z]{1,3}\b/

describe('assortment builder — the surface', () => {
  it('serves an approved buyer the plan form as real, labelled GET controls', async () => {
    const { status, body } = await get('/trade/assortment', asBuyer('b-approved'))

    expect(status).toBe(200)
    expect(body).toMatch(/<form[^>]+method="get"/)

    for (const field of ['budget', 'storeSize', 'mix', 'band', 'launchMonth']) {
      expect(body, `missing control ${field}`).toContain(`name="${field}"`)
      expect(body, `missing label for ${field}`).toContain(`for="${field}"`)
    }

    expect(body).toMatch(/<button[^>]*type="submit"[^>]*>Build the rack<\/button>/)
  })

  it('builds a rack with wholesale figures as semantic text', async () => {
    const { status, body } = await get(PLAN, asBuyer('b-approved'))

    expect(status).toBe(200)
    expect(body).toContain('Suggested rack')
    expect(body).toContain('<table')
    expect(body).toContain('scope="row"')

    // Restricted values are present because this session is entitled to them, and they are
    // text rather than pixels.
    expect(body).toMatch(MONEY_WITH_CENTS)
    expect(body).not.toContain('<canvas')
    expect(body).toContain('Blended margin')
  })

  it('states what it does not know, so the rack cannot read as a prediction', async () => {
    const { body } = await get(PLAN, asBuyer('b-approved'))

    expect(body).toContain('How this rack was built')
    expect(body).toContain('Not used, because we do not have it')
    // Region is the input a buyer is most likely to assume was applied.
    expect(body).toContain('region')
    expect(body).toContain('not a recommendation')
  })

  it('puts no wholesale figure in any URL the page emits', async () => {
    const { body } = await get(PLAN, asBuyer('b-approved'))

    for (const url of extractUrls(body)) {
      expect(url, `emitted a money-bearing URL: ${url}`).not.toMatch(MONEY_WITH_CENTS)
      expect(url, `emitted a SKU-bearing URL: ${url}`).not.toMatch(SKU_PATTERN)
      // The band travels as a label. A raw bound would be a restricted value in a log line.
      expect(url, `emitted a raw price bound: ${url}`).not.toMatch(
        /(priceM(in|ax)|minMinor|maxMinor)=/,
      )
    }
  })

  it('offers every line as an editable quantity, not a locked recommendation', async () => {
    const { body } = await get(PLAN, asBuyer('b-approved'))

    // A per-row pack input bound to its own form by `form=`, in whichever attribute order
    // React emits, plus a per-row submit targeting the same form.
    const packInputs = [...body.matchAll(/<input\b[^>]*>/g)]
      .map((match) => match[0])
      .filter((tag) => tag.includes('name="quantity"') && /form="add-[^"]+"/.test(tag))

    expect(packInputs.length, 'no editable pack input is bound to a row form').toBeGreaterThan(
      0,
    )
    expect(body).toMatch(/<button[^>]*form="add-[^"]+"[^>]*>Add/)
    // And the bulk action, which re-derives the plan server-side from the inputs.
    expect(body).toMatch(/Add all \d+ styles to your order/)
  })

  it('keeps a plan shareable — the same URL rebuilds the same rack', async () => {
    const first = await get(PLAN, asBuyer('b-approved'))
    const second = await get(PLAN, asBuyer('b-approved'))

    expect(first.body).toBe(second.body)
  })

  it('renders a recoverable empty state when nothing fits the plan', async () => {
    // A launch month before every pre-order window, in a band with no in-stock style.
    const { status, body } = await get(
      '/trade/assortment?budget=50&storeSize=boutique&mix=womens-only&band=entry',
      asBuyer('b-approved'),
    )

    expect(status).toBe(200)
    expect(body).toContain('Nothing fits this plan yet')
    expect(body).toContain('Start again')
  })
})

describe('assortment builder — the boundary', () => {
  it('is refused to a pending application', async () => {
    const { status, body } = await get(PLAN, asBuyer('b-pending'))

    expect([307, 308]).toContain(status)
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })

  it('is refused to a suspended account', async () => {
    const { status, body } = await get(PLAN, asBuyer('b-suspended'))

    expect([307, 308]).toContain(status)
    expect(body).not.toMatch(MONEY_WITH_CENTS)
  })

  it('is never stored by a shared cache', async () => {
    const { headers } = await get(PLAN, asBuyer('b-approved'))
    const cacheControl = headers.get('cache-control') ?? ''

    expect(cacheControl).toContain('no-store')
    expect(cacheControl).toContain('private')
    expect(headers.get('x-robots-tag')).toContain('noindex')
  })
})
