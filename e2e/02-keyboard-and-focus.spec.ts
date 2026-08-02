import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import {
  BUYERS,
  clearOrder,
  FIXTURE_PASSWORD,
  PRODUCT_SLUG,
  PUBLIC_ROUTES,
  signIn,
} from './support/fixtures'

/**
 * KEYBOARD AND FOCUS.
 *
 * Phase 1 has no search field, no dialog and no order drawer — the order surface is a route,
 * not an overlay. Those controls are not asserted here because they do not exist; they are
 * recorded as not-yet-applicable in the progress report rather than faked.
 */

type FocusInfo = {
  tag: string
  text: string
  outlineStyle: string
  outlineWidth: number
  outlineColor: string
  inViewport: boolean
  topmostAtCentre: boolean
}

/** Describes what the browser has focused, and whether a sighted keyboard user can see it. */
async function focusInfo(page: Page): Promise<FocusInfo> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) {
      return {
        tag: 'BODY',
        text: '',
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: '',
        inViewport: true,
        topmostAtCentre: true,
      }
    }

    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const centreX = rect.left + rect.width / 2
    const centreY = rect.top + rect.height / 2
    const atCentre = document.elementFromPoint(centreX, centreY)

    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('name') || '')
        .trim()
        .slice(0, 50),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
      outlineColor: style.outlineColor,
      // WCAG 2.2 · 2.4.11 Focus Not Obscured: the focused element must be at least
      // partially visible and not covered by another layer.
      inViewport:
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth,
      topmostAtCentre:
        atCentre === el || el.contains(atCentre) || (atCentre?.contains(el) ?? false),
    }
  })
}

/** Every element the DOM offers to the keyboard, in document order. */
async function focusableCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return [...document.querySelectorAll<HTMLElement>(selector)].filter(
      (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed',
    ).length
  })
}

test.describe('skip link', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`is the first stop and moves focus to main on ${route}`, async ({ page }) => {
      await page.goto(route)
      await page.keyboard.press('Tab')

      const first = await focusInfo(page)
      expect(first.tag, `${route}: first Tab did not reach the skip link`).toBe('a')
      // `innerText` reflects `text-transform`, so compare case-insensitively.
      expect(first.text.toLowerCase()).toContain('skip to main content')

      // Visible once focused — it is not allowed to remain translated off-screen.
      expect(first.inViewport, `${route}: skip link is off-screen when focused`).toBe(true)
      expect(first.outlineStyle).not.toBe('none')

      await page.keyboard.press('Enter')
      const target = await page.evaluate(() => document.activeElement?.id ?? '')
      expect(target, `${route}: activating the skip link did not focus main`).toBe('main')
    })
  }
})

test.describe('focus is visible and unobscured', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`on every control on ${route}`, async ({ page }) => {
      await page.goto(route)

      const total = await focusableCount(page)
      expect(total, `${route} has no focusable controls`).toBeGreaterThan(0)

      const failures: string[] = []
      for (let i = 0; i < total; i += 1) {
        await page.keyboard.press('Tab')
        const info = await focusInfo(page)
        if (info.tag === 'BODY') break

        if (info.outlineStyle === 'none' || info.outlineWidth < 2) {
          failures.push(`no visible ring: <${info.tag}> "${info.text}"`)
        }
        if (!info.inViewport) {
          failures.push(`focused off-screen: <${info.tag}> "${info.text}"`)
        }
        if (!info.topmostAtCentre) {
          failures.push(`obscured (2.4.11): <${info.tag}> "${info.text}"`)
        }
      }

      expect(failures, `${route}\n${failures.join('\n')}`).toHaveLength(0)
    })
  }
})

test.describe('focus order follows the page', () => {
  test('header, then content, then footer on the homepage', async ({ page }) => {
    await page.goto('/')

    const order: string[] = []
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab')
      const region = await page.evaluate(() => {
        const el = document.activeElement
        if (!el) return 'none'
        if (el.closest('.skip-link')) return 'skip'
        if (el.closest('header')) return 'header'
        if (el.closest('main')) return 'main'
        if (el.closest('footer')) return 'footer'
        return 'other'
      })
      order.push(region)
    }

    expect(order[0]).toBe('skip')
    expect(order.slice(1, 4).every((r) => r === 'header')).toBe(true)
    // Regions never interleave: once content starts, the header is finished.
    const firstMain = order.indexOf('main')
    if (firstMain > -1) {
      expect(order.slice(firstMain).includes('header')).toBe(false)
    }
  })

  test('has no keyboard trap on the most control-dense route', async ({ page }) => {
    await page.goto('/shop/women')

    const total = await focusableCount(page)
    const seen = new Set<string>()

    for (let i = 0; i < total + 3; i += 1) {
      await page.keyboard.press('Tab')
      const info = await focusInfo(page)
      const key = `${info.tag}:${info.text}`
      // Reaching the same control repeatedly inside one pass would mean a cycle we cannot
      // escape; reaching BODY means focus left the document, which is correct.
      if (info.tag === 'BODY') return
      seen.add(key)
    }

    expect(seen.size, 'focus appears to be trapped in a small cycle').toBeGreaterThan(5)
  })
})

test.describe('every Phase 1 control is keyboard operable', () => {
  test('filters and sort apply by keyboard alone', async ({ page }) => {
    await page.goto('/shop/women')

    await page.getByLabel('Size range').focus()
    await page.getByLabel('Size range').selectOption('extended')
    await page.getByLabel('Sort by').selectOption('name')
    await page.getByRole('button', { name: 'Apply filters' }).press('Enter')

    await expect(page).toHaveURL(/sizeRange=extended/)
    await expect(page).toHaveURL(/sort=name/)
    await expect(page.getByRole('status')).toContainText('styles shown')
  })

  test('a product card is reachable and activates with Enter', async ({ page }) => {
    await page.goto('/shop/women')

    const card = page.getByRole('link', { name: /Dark Wash Flare/ }).first()
    await card.focus()
    const info = await focusInfo(page)
    expect(info.outlineWidth).toBeGreaterThanOrEqual(2)

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`/product/${PRODUCT_SLUG}`)
  })

  test('the sign-in form completes with the keyboard only', async ({ page }) => {
    await page.goto('/sign-in')

    await page.getByLabel('Email').focus()
    await page.keyboard.type(BUYERS.approved)
    await page.keyboard.press('Tab')
    await page.keyboard.type(FIXTURE_PASSWORD)
    await page.keyboard.press('Tab')

    const submit = await focusInfo(page)
    expect(submit.tag).toBe('button')
    // `innerText` reflects `text-transform: uppercase`, so compare case-insensitively.
    expect(submit.text.toLowerCase()).toContain('sign in')

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/trade')
  })

  test('the buyer application completes with the keyboard only', async ({ page }) => {
    await page.goto('/wholesale/apply')

    await page.getByLabel('Store name').focus()
    await page.keyboard.type('Keyboard Fixture Store')
    await page.keyboard.press('Tab')
    await page.keyboard.type('Fort Worth')
    await page.keyboard.press('Tab')
    await page.keyboard.type('TX')
    await page.keyboard.press('Tab')
    await page.keyboard.type('FIXTURE-KEYBOARD-0001')
    await page.keyboard.press('Tab')
    await page.keyboard.type('keyboard@fixture.test')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL('/trade')
    await expect(page.getByRole('heading', { name: 'We have your application' })).toBeVisible()
  })

  /**
   * ACCEPTANCE CRITERION F1 — an approved buyer completes the whole slice by keyboard alone.
   */
  test('an approved buyer orders end to end using only the keyboard', async ({ page }) => {
    await page.goto('/sign-in')

    await page.getByLabel('Email').focus()
    await page.keyboard.type(BUYERS.approved)
    await page.keyboard.press('Tab')
    await page.keyboard.type(FIXTURE_PASSWORD)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/trade')

    await clearOrder(page)

    // Navigate to the authorised product page by keyboard.
    await page.goto(`/product/${PRODUCT_SLUG}`)
    await page
      .getByRole('link', { name: 'Already approved? Go straight to your pricing' })
      .focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`/trade/product/${PRODUCT_SLUG}`)

    // Prepack quantity, then Add to Order.
    await page.getByLabel('Prepacks').focus()
    await page.keyboard.press('Control+a')
    await page.keyboard.type('3')
    await page.keyboard.press('Tab')

    const addButton = await focusInfo(page)
    expect(addButton.text.toLowerCase()).toContain('add to order')
    expect(addButton.outlineWidth).toBeGreaterThanOrEqual(2)
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL('/trade/order')
    await expect(page.getByText('Minimum met')).toBeVisible()

    // Change a line quantity by keyboard.
    const qty = page.getByLabel(/Packs of Dark Wash Flare/)
    await qty.focus()
    await page.keyboard.press('Control+a')
    await page.keyboard.type('2')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/trade/order')

    // Send the order. Asserted enabled first: focusing a disabled button silently leaves
    // focus on the previous control, and Enter then submits the wrong form — which is how
    // this step failed intermittently under full-suite ordering rather than in isolation.
    const send = page.getByRole('button', { name: 'Send this order' })
    await expect(send).toBeEnabled()
    await send.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/trade\/orders\/LB-FIXTURE-\d+/)
    await expect(page.getByText('Order sent')).toBeVisible()

    // Reorder by keyboard.
    await page.getByRole('button', { name: 'Reorder the same assortment' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/trade/order')
    await expect(page.getByRole('link', { name: 'Dark Wash Flare' })).toBeVisible()
  })

  test('error recovery is reachable by keyboard', async ({ page }) => {
    await page.goto('/product/no-such-style')
    await expect(
      page.getByRole('heading', { name: 'We could not find that page' }),
    ).toBeVisible()

    await page
      .getByRole('main')
      .getByRole('link', { name: 'New arrivals', exact: true })
      .focus()
    const info = await focusInfo(page)
    expect(info.outlineWidth).toBeGreaterThanOrEqual(2)

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/new-arrivals')
  })

  test('the empty-filter state offers a keyboard route out', async ({ page }) => {
    await page.goto('/shop/girls?fabric=velvet%20burnout')
    await expect(page.getByRole('heading', { name: 'Nothing here yet' })).toBeVisible()

    await page.getByRole('link', { name: 'Clear' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/shop/girls')
    await expect(page.getByRole('link', { name: /Ranch Ruffle Short/ })).toBeVisible()
  })

  test('authorised surfaces keep visible focus on every control', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)

    const total = await focusableCount(page)
    const failures: string[] = []

    for (let i = 0; i < total; i += 1) {
      await page.keyboard.press('Tab')
      const info = await focusInfo(page)
      if (info.tag === 'BODY') break
      if (info.outlineStyle === 'none' || info.outlineWidth < 2) {
        failures.push(`no visible ring: <${info.tag}> "${info.text}"`)
      }
      if (!info.topmostAtCentre) {
        failures.push(`obscured: <${info.tag}> "${info.text}"`)
      }
    }

    expect(failures, failures.join('\n')).toHaveLength(0)
  })
})
