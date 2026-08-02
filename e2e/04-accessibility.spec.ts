import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { BUYERS, PRODUCT_SLUG, PUBLIC_ROUTES, signIn } from './support/fixtures'

/**
 * ACCESSIBILITY VALIDATION.
 *
 * Automated rules plus targeted structural checks against the real accessibility tree.
 *
 * THIS IS NOT A SCREEN-READER PASS. axe cannot hear anything, and neither can a role
 * assertion. What is verified here is that names, roles, relationships and announcements are
 * present and correct; whether NVDA, JAWS and VoiceOver actually read them usefully is a
 * separate, manual exercise that has not been performed. The progress report says so.
 */

async function axeViolations(page: Page, disable: string[] = []) {
  const builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
    'best-practice',
  ])
  const results = await (disable.length ? builder.disableRules(disable) : builder).analyze()
  return results.violations.map((v) => `${v.id} (${v.impact}) × ${v.nodes.length}: ${v.help}`)
}

test.describe('automated rules — public surfaces', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`axe is clean on ${route}`, async ({ page }) => {
      await page.goto(route)
      const violations = await axeViolations(page)
      expect(violations, `${route}\n${violations.join('\n')}`).toHaveLength(0)
    })
  }

  test('axe is clean on the 404', async ({ page }) => {
    await page.goto('/product/no-such-style')
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  test('axe is clean on the empty-filter state', async ({ page }) => {
    await page.goto('/shop/girls?fabric=velvet%20burnout')
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  test('axe is clean on a form error state', async ({ page }) => {
    await page.goto('/sign-in?error=invalid')
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })
})

test.describe('automated rules — authorised surfaces', () => {
  const routes = ['/trade', '/trade/product/' + PRODUCT_SLUG, '/trade/order', '/trade/orders']

  for (const route of routes) {
    test(`axe is clean on ${route}`, async ({ page }) => {
      await signIn(page, BUYERS.approved)
      await page.goto(route)
      const violations = await axeViolations(page)
      expect(violations, `${route}\n${violations.join('\n')}`).toHaveLength(0)
    })
  }

  test('axe is clean on the pending state', async ({ page }) => {
    await signIn(page, BUYERS.pending)
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  test('axe is clean on the suspended state', async ({ page }) => {
    await signIn(page, BUYERS.suspended)
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })
})

test.describe('landmarks and headings', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} has one main, labelled navigation and a single h1`, async ({ page }) => {
      await page.goto(route)

      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('banner')).toHaveCount(1)
      await expect(page.getByRole('contentinfo')).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

      // Every nav is named, so a screen-reader user can tell them apart.
      const navs = page.getByRole('navigation')
      const count = await navs.count()
      for (let i = 0; i < count; i += 1) {
        const label = await navs.nth(i).getAttribute('aria-label')
        expect(label, `${route}: an unnamed navigation landmark`).toBeTruthy()
      }
    })

    test(`${route} has no skipped heading levels`, async ({ page }) => {
      await page.goto(route)

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
          Number.parseInt(h.tagName.slice(1), 10),
        ),
      )

      expect(levels[0], `${route} does not start at h1`).toBe(1)
      for (let i = 1; i < levels.length; i += 1) {
        const jump = (levels[i] ?? 0) - (levels[i - 1] ?? 0)
        expect(jump, `${route}: h${levels[i - 1]} → h${levels[i]}`).toBeLessThanOrEqual(1)
      }
    })
  }
})

test.describe('forms', () => {
  test('every control on the application form has an accessible name', async ({ page }) => {
    await page.goto('/wholesale/apply')

    for (const name of ['Store name', 'City', 'State', 'Sales tax ID', 'Email']) {
      await expect(page.getByLabel(name)).toBeVisible()
    }

    // The tax-ID hint is programmatically associated, not merely adjacent.
    const describedBy = await page.getByLabel('Sales tax ID').getAttribute('aria-describedby')
    expect(describedBy).toBe('tax-hint')
    await expect(page.locator('#tax-hint')).toContainText('resale certificate')
  })

  test('form errors are announced, not just coloured', async ({ page }) => {
    await page.goto('/sign-in?error=invalid')

    const alert = page.locator('.notice--error')
    await expect(alert).toHaveAttribute('role', 'alert')
    await expect(alert).toContainText('do not match an account')
  })

  test('the prepack quantity field describes the pack size', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)

    const describedBy = await page.getByLabel('Prepacks').getAttribute('aria-describedby')
    expect(describedBy).toBe('quantity-hint')
    await expect(page.locator('#quantity-hint')).toContainText('6 units per pack')
  })
})

test.describe('status and progress announcements', () => {
  test('the filter result count is a live status', async ({ page }) => {
    await page.goto('/shop/women')
    await expect(page.getByRole('status')).toContainText('styles shown')
  })

  test('minimum-order progress exposes a value and a readable description', async ({
    page,
  }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)
    await page.getByRole('button', { name: 'Add to order' }).click()
    await expect(page).toHaveURL('/trade/order')

    const bar = page.getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')
    await expect(bar).toHaveAttribute('aria-valuenow', /\d+/)
    await expect(bar).toHaveAttribute('aria-valuetext', /% of the \$50\.00 minimum/)

    await expect(page.getByRole('status')).toContainText(/Minimum met|to reach the/)
  })
})

test.describe('tables', () => {
  test('size and fit tables carry captions and scoped headers', async ({ page }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)

    const tables = page.getByRole('table')
    const count = await tables.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i += 1) {
      const table = tables.nth(i)
      await expect(table.locator('caption')).toHaveCount(1)
      expect(await table.locator('th[scope="col"]').count()).toBeGreaterThan(0)
      expect(await table.locator('th[scope="row"]').count()).toBeGreaterThan(0)
    }
  })

  test('the prepack table is a table, not an image', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)

    const prepack = page.getByRole('table', { name: /Units per prepack/ })
    await expect(prepack).toBeVisible()
    await expect(prepack.getByRole('rowheader', { name: 'Total' })).toBeVisible()
  })
})

test.describe('images', () => {
  test('every product image has a meaningful alternative', async ({ page }) => {
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route)
      const images = page.locator('img')
      const count = await images.count()

      for (let i = 0; i < count; i += 1) {
        const alt = await images.nth(i).getAttribute('alt')
        expect(alt, `${route}: image ${i} has no alt`).not.toBeNull()
        expect((alt ?? '').length, `${route}: image ${i} has empty alt`).toBeGreaterThan(10)
        expect(alt ?? '', `${route}: alt text contains a price`).not.toMatch(/\$\s?\d/)
      }
    }
  })
})

test.describe('pricing is screen-reader friendly', () => {
  test('every restricted value is text inside a named region', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)

    const panel = page.getByRole('region', { name: 'Your wholesale terms' })
    await expect(panel).toBeVisible()
    await expect(panel).toContainText('$31.00')
    await expect(panel).toContainText('Suggested retail $82.00')

    // Nothing is drawn: no canvas, no image-of-a-price.
    await expect(page.locator('canvas')).toHaveCount(0)

    // Terms are a description list, so each value has a programmatic label.
    await expect(panel.getByRole('term').filter({ hasText: 'SKU' })).toBeVisible()
    await expect(panel.getByRole('definition').filter({ hasText: 'JE334-DW' })).toBeVisible()
  })
})

test.describe('permission-state messaging', () => {
  test('each denial state names itself in a heading', async ({ page }) => {
    const cases: [string, string][] = [
      [BUYERS.pending, 'We have your application'],
      [BUYERS.rejected, 'We could not approve this application'],
      [BUYERS.suspended, 'Ordering is paused on this account'],
    ]

    for (const [email, heading] of cases) {
      await page.context().clearCookies()
      await signIn(page, email)
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    }
  })

  test('the public gate is a named region, not an unlabelled box', async ({ page }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)
    const gate = page.getByRole('region', { name: 'Wholesale pricing' })
    await expect(gate).toBeVisible()
    await expect(gate).toContainText('approved retailers')
  })
})

test.describe('reduced motion', () => {
  /**
   * Emulated explicitly rather than through `test.use`, which the project-level options in
   * playwright.config.ts were overriding — the suite reported reduced motion while the page
   * was still animating. The assertion inside the first test now proves the emulation took.
   */
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('content and capability are identical, and nothing animates', async ({ page }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)

    // Same products, same facts, same actions.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dark Wash Flare')
    await expect(page.getByRole('region', { name: 'Wholesale pricing' })).toBeVisible()
    await expect(page.getByRole('table').first()).toBeVisible()

    // The media query must actually be emulated, or the rest of this proves nothing.
    expect(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    ).toBe(true)

    const offenders = await page.evaluate(() => {
      const found: string[] = []
      for (const el of document.querySelectorAll<HTMLElement>('body *')) {
        const style = getComputedStyle(el)
        for (const [property, value] of [
          ['transition', style.transitionDuration],
          ['animation', style.animationDuration],
        ] as const) {
          // A shorthand can carry several durations; every one of them must be at the floor.
          const seconds = value.split(',').map((part) => Number.parseFloat(part) || 0)
          if (seconds.some((s) => s > 0.001)) {
            found.push(
              `${el.tagName.toLowerCase()}.${el.className || ''} ${property}=${value}`.slice(
                0,
                90,
              ),
            )
          }
        }
      }
      return [...new Set(found)]
    })

    expect(offenders, offenders.join('\n')).toHaveLength(0)
  })

  test('the keyboard journey still works under reduced motion', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)
    await expect(page.getByText('$31.00')).toBeVisible()
    await page.getByRole('button', { name: 'Add to order' }).click()
    await expect(page).toHaveURL('/trade/order')
  })

  test('axe is clean under reduced motion', async ({ page }) => {
    await page.goto('/')
    const violations = await axeViolations(page)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })
})
