import { devices, expect, test } from '@playwright/test'
import { PRODUCT_SLUG } from './support/fixtures'

/**
 * PREFETCH IS PAGE WEIGHT. Only the paths that sell may spend it.
 *
 * Next prefetches a static route's full RSC payload the moment its link scrolls into
 * view. Measured on a phone before this suite existed: reaching the bottom of the
 * homepage fetched eleven pages nobody had tapped — 453 KB, 109 KB of it the men's
 * demonstration — and every other page fetched the homepage's 126 KB payload on load,
 * because the wordmark is always in view and the homepage embeds both product rails.
 * Against a 1.5 MB shop-surface budget (CLAUDE.md §10) that is not a rounding error.
 *
 * The rule: a link that leads toward a purchase may prefetch — categories, the drop, a
 * product, the wholesale gate, sign-in. A directory link — the footer, the link garden,
 * the wordmark, a breadcrumb home — is read, not pre-loaded. This test is the rule as
 * code, so the next footer link or breadcrumb does not quietly reinstate the cost.
 */
// The phone, in Chromium: the device descriptor's own browser is WebKit, which this
// project does not install. Viewport, touch and user agent are what matter here.
const phone = devices['iPhone 13']
test.use({
  viewport: phone.viewport,
  isMobile: true,
  hasTouch: true,
  userAgent: phone.userAgent,
})

const SELLING_PATHS = [
  /^\/shop\//,
  /^\/new-arrivals$/,
  /^\/product\//,
  /** Every rack in one aisle — a browsing surface, and the homepage's primary door. */
  /^\/warehouse$/,
  /^\/wholesale(\/apply)?$/,
  /^\/sign-in$/,
  /^\/trade(\/.*)?$/,
]

/** Budget for speculative RSC bytes across a full scroll of one page, on a phone. */
const PREFETCH_BUDGET_KB = 160

async function prefetchesAcrossScroll(page: import('@playwright/test').Page, route: string) {
  const seen = new Map<string, number>()
  page.on('response', async (response) => {
    const url = new URL(response.url())
    if (!url.searchParams.has('_rsc')) return
    try {
      seen.set(url.pathname, (await response.body()).length)
    } catch {
      /* a cancelled prefetch has no body; it also cost nothing */
    }
  })
  await page.goto(route, { waitUntil: 'networkidle' })
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(150)
  }
  await page.waitForLoadState('networkidle')
  return seen
}

for (const route of ['/', '/shop/women', '/new-arrivals', `/product/${PRODUCT_SLUG}`]) {
  test(`${route} prefetches only selling paths, inside budget`, async ({ page }) => {
    const seen = await prefetchesAcrossScroll(page, route)

    const strays = [...seen.keys()].filter((path) => !SELLING_PATHS.some((re) => re.test(path)))
    expect(strays, `directory links prefetched from ${route}: ${strays.join(', ')}`).toEqual([])

    const kb = Math.round([...seen.values()].reduce((sum, bytes) => sum + bytes, 0) / 1024)
    expect(kb, `${route} prefetched ${kb} KB across a scroll`).toBeLessThanOrEqual(
      PREFETCH_BUDGET_KB,
    )
  })
}

/**
 * THE FILM IS OWED ONLY TO A PLAY THAT HAPPENS.
 *
 * The background film is 1.8 MB on a phone. Two visitors must never be handed it: the
 * one whose reduced-motion setting means it will never play, and the one who has asked
 * Chrome for less data or is on a 2G-class link. §10 permits the Network Information API
 * for exactly this — demoting — and forbids it for tiering.
 */
test.describe('the hero film on a thrifty phone', () => {
  test('reduced motion: the poster shows and no film bytes are fetched', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.locator('.hero-film__poster img')).toBeVisible()
    await expect(page.locator('[data-hero-toggle]')).toHaveText(/Play the film/)
    // `preload="metadata"` may fetch headers and a first chunk; it must not fetch the film.
    const videoBytes = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .filter((e) => /ignition.*\.(mp4|webm)$/.test(e.name))
        .reduce((sum, e) => sum + ((e as PerformanceResourceTiming).transferSize || 0), 0),
    )
    expect(
      videoBytes,
      `film bytes transferred under reduced motion: ${videoBytes}`,
    ).toBeLessThan(64 * 1024)
  })

  test('Data Saver: the film is never started', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        value: { saveData: true, effectiveType: '4g' },
      })
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    const video = page.locator('[data-hero-film]')
    await expect(page.locator('[data-hero-toggle]')).toBeVisible()
    await page.waitForTimeout(600)
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    await expect(page.locator('[data-hero-toggle]')).toHaveText(/Play the film/)
    // The visitor can still choose it.
    await page.locator('[data-hero-toggle]').click()
    await expect.poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)
  })
})
