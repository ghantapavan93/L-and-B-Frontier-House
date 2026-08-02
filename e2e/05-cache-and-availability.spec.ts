import { expect, test } from '@playwright/test'
import {
  BUYERS,
  expectNoRestrictedValue,
  PRODUCT_SLUG,
  PUBLIC_ROUTES,
  signIn,
  signOut,
} from './support/fixtures'

/**
 * CACHE, SESSION AND THE AVAILABILITY BOUNDARY.
 *
 * The architecture under test: public routes never read the session, public output is
 * byte-identical for every visitor, and restricted responses are private and no-store.
 *
 * `Vary: Cookie` is deliberately not asserted. Next owns that header for RSC negotiation and
 * replaces any value set in next.config; a middleware append was measured as ineffective and
 * removed rather than left in place implying a protection it did not provide. With
 * `no-store` present no cache may store the response at all, which makes Vary moot.
 */

test.describe('public output does not vary by session', () => {
  test('every public route is byte-identical before and after login', async ({
    page,
    context,
  }) => {
    // Compares the raw server response, not the hydrated DOM: the response body is what a
    // cache would store and replay to the wrong person.
    const anonymous = new Map<string, string>()
    for (const route of PUBLIC_ROUTES) {
      anonymous.set(route, await (await context.request.get(route)).text())
    }

    await signIn(page, BUYERS.approved)
    expect((await context.cookies()).some((c) => c.name === 'lb_session')).toBe(true)

    for (const route of PUBLIC_ROUTES) {
      const authenticated = await (await context.request.get(route)).text()
      expect(authenticated, `${route} changed once a buyer signed in`).toBe(
        anonymous.get(route),
      )
    }
  })

  test('buyer pricing never appears after returning to a public route', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)
    await expect(page.getByText('$31.00')).toBeVisible()

    await page.goto(`/product/${PRODUCT_SLUG}`)
    await expectNoRestrictedValue(page, 'public product page while signed in')
    await expect(page.getByRole('region', { name: 'Wholesale pricing' })).toBeVisible()

    // And on every other public surface.
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route)
      await expectNoRestrictedValue(page, `${route} while signed in`)
    }
  })

  test('public routes are cacheable and authorised routes are not', async ({ page }) => {
    const publicResponse = await page.goto(`/product/${PRODUCT_SLUG}`)
    const publicCacheControl = publicResponse?.headers()['cache-control'] ?? ''
    expect(publicCacheControl).not.toContain('no-store')

    await signIn(page, BUYERS.approved)
    const tradeResponse = await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    const tradeCacheControl = tradeResponse?.headers()['cache-control'] ?? ''

    expect(tradeCacheControl).toContain('no-store')
    expect(tradeCacheControl).toContain('private')
    expect(tradeCacheControl).not.toContain('public')
    expect(tradeCacheControl).not.toContain('s-maxage')
    expect(tradeResponse?.headers()['x-robots-tag']).toContain('noindex')
  })
})

test.describe('session teardown', () => {
  test('signing out revokes access to every restricted route', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await page.goto('/trade/orders')
    await expect(page.getByRole('heading', { name: 'Order history' })).toBeVisible()

    // Sign-out lives in the account area: the public header is session-independent by
    // design, so it has no sign-out control to offer.
    await page.goto('/trade')
    await signOut(page)

    for (const route of [
      '/trade',
      '/trade/order',
      '/trade/orders',
      `/trade/product/${PRODUCT_SLUG}`,
    ]) {
      await page.goto(route)
      await expect(page, `${route} still resolved after sign out`).toHaveURL(/\/sign-in/)
      await expectNoRestrictedValue(page, `${route} after sign out`)
    }
  })

  test('a reload after session expiry fails safely rather than showing stale data', async ({
    page,
    context,
  }) => {
    await signIn(page, BUYERS.approved, '/trade/orders')
    await expect(page.getByRole('link', { name: 'LB-2026-0641' })).toBeVisible()

    await context.clearCookies()
    await page.reload()

    await expect(page).toHaveURL(/\/sign-in/)
    await expectNoRestrictedValue(page, 'reload after expiry')
    await expect(page.locator('body')).not.toContainText('LB-2026-0641')
  })

  test('history navigation cannot resurrect a restricted response', async ({
    page,
    context,
  }) => {
    await signIn(page, BUYERS.approved, '/trade/orders')
    await expect(page.getByRole('link', { name: 'LB-2026-0641' })).toBeVisible()

    await page.goto('/')
    await context.clearCookies()

    await page.goBack()
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.locator('body')).not.toContainText('LB-2026-0641')
  })
})

/**
 * THE AVAILABILITY BOUNDARY.
 *
 * Public: the coarse state only — In stock, Pre-order, Waitlist.
 * Authorised: exact quantity, per-size quantity, account-specific terms.
 *
 * This split is an assumption recorded in the progress report, taken because the approval
 * brief lists availability as restricted while CLAUDE.md §11 and acceptance criterion C1
 * require it public, semantic and crawlable. It needs owner confirmation.
 */
test.describe('availability', () => {
  test('public product pages state the coarse status and nothing more', async ({ page }) => {
    const cases: [string, string][] = [
      [PRODUCT_SLUG, 'In stock'],
      ['leopard-print-tie-waist-flare', 'Pre-order'],
      ['silver-horseshoe-drop-earrings', 'Waitlist'],
    ]

    for (const [slug, status] of cases) {
      await page.goto(`/product/${slug}`)
      await expect(page.getByText(status, { exact: true }).first()).toBeVisible()

      const text = await page.locator('body').innerText()
      // No unit counts, no per-size stock, no account language.
      expect(text, `${slug} exposed a stock table`).not.toContain('Stock by size')
      expect(text, `${slug} exposed unit counts`).not.toMatch(
        /\d+\s+units? (available|in stock)/i,
      )
      expect(text, `${slug} exposed buyer terms`).not.toContain('Net 30')
    }
  })

  test('category listings show coarse status only', async ({ page }) => {
    await page.goto('/shop/accessories')
    // Scoped to the grid: 'Waitlist' is also an option in the availability facet.
    await expect(
      page
        .getByRole('article')
        .filter({ hasText: 'Horseshoe Drop Earrings' })
        .getByText('Waitlist'),
    ).toBeVisible()

    const text = await page.locator('body').innerText()
    expect(text).not.toContain('Stock by size')
    expect(text).not.toMatch(/\b\d{2,}\s+units\b/)
  })

  test('an approved buyer sees exact per-size quantities', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)

    const stock = page.getByRole('table', { name: /Units currently available by size/ })
    await expect(stock).toBeVisible()

    // Exact figures, as semantic table cells.
    await expect(stock.getByRole('rowheader', { name: 'S', exact: true })).toBeVisible()
    await expect(stock.getByRole('cell', { name: '38', exact: true })).toBeVisible()
    await expect(stock.getByRole('cell', { name: '17', exact: true })).toBeVisible()

    // And account-specific terms.
    await expect(page.getByText('Net 30 for approved accounts')).toBeVisible()
  })

  test('a waitlisted style disables ordering and says why', async ({ page }) => {
    await signIn(page, BUYERS.approved, '/trade/product/silver-horseshoe-drop-earrings')

    const button = page.getByRole('button', { name: 'Not currently available' })
    await expect(button).toBeVisible()
    await expect(button).toBeDisabled()
    await expect(page.getByText('This style is on waitlist')).toBeVisible()
  })

  test('a pre-order style states its ship window publicly, without quantities', async ({
    page,
  }) => {
    await page.goto('/product/leopard-print-tie-waist-flare')

    await expect(page.getByText('Ships 2026-09-15 to 2026-09-30')).toBeVisible()
    const text = await page.locator('body').innerText()
    expect(text).not.toContain('Stock by size')
  })

  test('an unapproved buyer never sees a quantity', async ({ page }) => {
    await signIn(page, BUYERS.pending)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await expect(page).toHaveURL('/trade')

    const text = await page.locator('body').innerText()
    expect(text).not.toContain('Stock by size')
    expect(text).not.toContain('Net 30')
  })
})
