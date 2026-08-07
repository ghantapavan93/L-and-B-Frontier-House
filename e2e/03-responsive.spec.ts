import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import {
  BUYERS,
  clearOrder,
  PRODUCT_SLUG,
  PUBLIC_ROUTES,
  signIn,
  VIEWPORTS,
} from './support/fixtures'

/**
 * RESPONSIVE BEHAVIOUR at 320 · 375 · 390 · 768 · 1024 · 1440.
 *
 * Phase 1 has no sticky header, no dialog and no drawer — the order surface is a route.
 * Those are asserted absent rather than assumed: a sticky region introduced later would
 * immediately break the 2.4.11 check in the keyboard suite, and the assertion here records
 * the current state honestly.
 */

/**
 * How far the page can actually be scrolled sideways.
 *
 * Measured by trying to scroll rather than by comparing `scrollWidth` to `clientWidth`: the
 * arithmetic form under-reports. A table clipped inside a scroll container still grew the
 * root scroller, and only attempting the scroll revealed it.
 */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const before = window.scrollX
    window.scrollTo(999_999, window.scrollY)
    const reachable = window.scrollX
    window.scrollTo(before, window.scrollY)
    return Math.max(
      reachable,
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
  })
}

/**
 * Text that is cut off by its own container.
 *
 * Deliberately ignores containers that scroll on purpose (`.table-scroll`) — wide content is
 * allowed to scroll inside its own box; the page body is not.
 */
async function clippedText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const offenders: string[] = []
    const elements = document.querySelectorAll<HTMLElement>(
      'p, h1, h2, h3, td, th, li, label, span, a, button, caption, dd, dt',
    )

    const inHorizontalScroller = (el: HTMLElement): boolean => {
      let node: HTMLElement | null = el.parentElement
      while (node) {
        const overflowX = getComputedStyle(node).overflowX
        if (overflowX === 'auto' || overflowX === 'scroll') return true
        node = node.parentElement
      }
      return false
    }

    for (const el of elements) {
      // A deliberate horizontal scroller (tables, the worlds carousel, the rack) clips its
      // off-screen slides by design; the page-level scroll check still guards the page.
      if (inHorizontalScroller(el)) continue
      // `.visually-hidden` clips on purpose — it is the standard screen-reader-only
      // technique, and its 1px box always reports scrollWidth > clientWidth.
      if (el.closest('.visually-hidden')) continue
      const style = getComputedStyle(el)
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') continue
      if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
        if (el.scrollWidth > el.clientWidth + 1) {
          offenders.push(`${el.tagName.toLowerCase()}: ${el.innerText.trim().slice(0, 40)}`)
        }
      }
      // Text wider than the viewport is clipped by the window regardless of overflow rules.
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.right > window.innerWidth + 1 && el.innerText?.trim()) {
        offenders.push(
          `${el.tagName.toLowerCase()} extends past the viewport: ${el.innerText.trim().slice(0, 40)}`,
        )
      }
    }
    return [...new Set(offenders)]
  })
}

/**
 * WCAG 2.2 · 2.5.8 Target Size (Minimum), 24 × 24 CSS px.
 *
 * Applies the standard's inline exception: a link inside a sentence is measured by the
 * sentence's line box, not by its own, so inline-displayed links are excluded.
 */
async function smallTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const offenders: string[] = []
    const controls = document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([type="hidden"]), select',
    )

    for (const el of controls) {
      const style = getComputedStyle(el)
      if (style.display === 'inline') continue
      if (style.visibility === 'hidden' || style.opacity === '0') continue

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue
      if (rect.width < 24 || rect.height < 24) {
        const label = (el.innerText || el.getAttribute('aria-label') || el.tagName).trim()
        offenders.push(
          `${Math.round(rect.width)}×${Math.round(rect.height)}: ${label.slice(0, 40)}`,
        )
      }
    }
    return [...new Set(offenders)]
  })
}

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('no public route scrolls horizontally', async ({ page }) => {
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route)
        const overflow = await horizontalOverflow(page)
        expect(
          overflow,
          `${route} at ${viewport.name}px overflows by ${overflow}px`,
        ).toBeLessThanOrEqual(1)
      }
    })

    test('no text is clipped on any public route', async ({ page }) => {
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route)
        const clipped = await clippedText(page)
        expect(clipped, `${route} at ${viewport.name}px:\n${clipped.join('\n')}`).toHaveLength(
          0,
        )
      }
    })

    test('every target meets the 24px minimum', async ({ page }) => {
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route)
        const small = await smallTargets(page)
        expect(small, `${route} at ${viewport.name}px:\n${small.join('\n')}`).toHaveLength(0)
      }
    })

    test('product cards keep image, name, spec and badges', async ({ page }) => {
      await page.goto('/shop/women')

      const card = page.getByRole('article').filter({ hasText: 'Dark Wash Flare' }).first()
      await expect(card.getByRole('img')).toBeVisible()
      await expect(card.getByRole('heading', { name: 'Dark Wash Flare' })).toBeVisible()
      await expect(card.getByText(/Dark Wash High Rise Flare/)).toBeVisible()
      await expect(card.getByText('In stock')).toBeVisible()

      const box = await card.boundingBox()
      expect(box?.width ?? 0).toBeGreaterThan(0)
      expect(box?.width ?? 0, 'card is wider than the viewport').toBeLessThanOrEqual(
        viewport.width,
      )
    })

    test('filters and sort stay usable', async ({ page }) => {
      await page.goto('/shop/women')

      await expect(page.getByLabel('Size range')).toBeVisible()
      await expect(page.getByLabel('Sort by')).toBeVisible()
      await page.getByLabel('Size range').selectOption('extended')
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page).toHaveURL(/sizeRange=extended/)
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
    })

    test('size and fit tables scroll inside their own container', async ({ page }) => {
      await page.goto(`/product/${PRODUCT_SLUG}`)

      // The size table now lives in a closed <details> fold, the way the reference PDPs
      // collapse specification. Open it the way a reader would — the property under test
      // is the open state's layout, and a native summary needs no JavaScript to open.
      await page.getByText('Size and fit', { exact: true }).click()

      const container = page.locator('.table-scroll').first()
      await expect(container).toBeVisible()

      const measured = await container.evaluate((el) => ({
        clientWidth: el.clientWidth,
        overflowX: getComputedStyle(el).overflowX,
      }))
      expect(measured.overflowX).toBe('auto')
      expect(measured.clientWidth).toBeLessThanOrEqual(viewport.width)

      // The table may be wider than its box; the page must still not scroll sideways.
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
    })

    test('the size range list wraps rather than overflowing', async ({ page }) => {
      await page.goto(`/product/${PRODUCT_SLUG}`)
      const sizes = page.getByRole('definition').filter({ hasText: /^S, M, L, XL/ })
      await expect(sizes).toBeVisible()

      const box = await sizes.boundingBox()
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width + 1)
    })
  })
}

test.describe('authorised surfaces are responsive', () => {
  for (const viewport of [VIEWPORTS[0], VIEWPORTS[2], VIEWPORTS[5]]) {
    test(`pricing, prepack, order and passport at ${viewport?.name}px`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport?.width ?? 320,
        height: viewport?.height ?? 640,
      })
      await signIn(page, BUYERS.approved)
      await clearOrder(page)
      await page.goto(`/trade/product/${PRODUCT_SLUG}`)

      // Buyer pricing block.
      await expect(page.getByText('$31.00')).toBeVisible()
      await expect(page.getByText('Suggested retail $82.00 — 62% margin')).toBeVisible()
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await clippedText(page)).toHaveLength(0)

      // Prepack table.
      await expect(page.getByRole('table', { name: /Units per prepack/ })).toBeVisible()

      // Order surface.
      await page.getByRole('button', { name: 'Add to order' }).click()
      await expect(page).toHaveURL('/trade/order')
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await smallTargets(page)).toHaveLength(0)
      await expect(page.getByRole('progressbar')).toBeVisible()

      // Passport.
      await page.goto('/trade')
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await clippedText(page)).toHaveLength(0)

      // Order history.
      await page.goto('/trade/orders')
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await smallTargets(page)).toHaveLength(0)
    })
  }

  /*
    The assortment builder gets its own pass because it is the only surface with a
    multi-column control grid, and a `<select>` there sizes itself to its longest
    `<option>` — text that carries the category split in full. That intrinsic width
    ignores a `minmax(0, 1fr)` track and put a horizontal scrollbar on the document
    until the control was told to shrink. Measured, not theorised.
  */
  for (const viewport of [VIEWPORTS[0], VIEWPORTS[2], VIEWPORTS[5]]) {
    test(`assortment builder at ${viewport?.name}px`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport?.width ?? 320,
        height: viewport?.height ?? 640,
      })
      await signIn(page, BUYERS.approved)

      // The empty form, then a built rack — the grid and the tables are different risks.
      await page.goto('/trade/assortment')
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await clippedText(page)).toHaveLength(0)
      expect(await smallTargets(page)).toHaveLength(0)

      await page.goto('/trade/assortment?budget=2500&storeSize=established&mix=balanced')
      await expect(page.getByRole('heading', { name: 'Suggested rack' })).toBeVisible()
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await clippedText(page)).toHaveLength(0)
      expect(await smallTargets(page)).toHaveLength(0)

      // Wide rack, narrow screen: the table scrolls in its own box, never the page.
      const container = page.locator('.table-scroll').first()
      await expect(container).toBeVisible()
      expect(await container.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto')
    })
  }
})

test.describe('layout invariants', () => {
  test('the glass header is the only sticky layer, and it reserves scroll room', async ({
    page,
  }) => {
    await page.goto('/')

    const positioned = await page.evaluate(() => {
      const found: string[] = []
      for (const el of document.querySelectorAll<HTMLElement>('body *')) {
        const position = getComputedStyle(el).position
        if (position === 'sticky' || position === 'fixed') {
          found.push(`${el.tagName.toLowerCase()}.${el.className}`)
        }
      }
      return found
    })

    /*
      The Design DNA requires a backdrop-blurred header so photography bleeds behind the UI,
      which means it is sticky. The earlier version of this test asserted nothing was sticky —
      that recorded the state at the time, not a requirement.

      The requirement is WCAG 2.4.11, and it is verified where it can actually be measured:
      the keyboard suite walks every control and checks the focused element is the topmost
      thing at its own centre. What is asserted here is the two things that make that hold —
      only the header is sticky, and scroll room is reserved beneath it.
    */
    expect(positioned.filter((p) => !p.includes('site-header'))).toHaveLength(0)
    expect(positioned.some((p) => p.includes('site-header'))).toBe(true)

    const scrollMargin = await page
      .getByRole('link', { name: 'New Arrivals' })
      .first()
      .evaluate((el) => Number.parseFloat(getComputedStyle(el).scrollMarginTop))
    expect(scrollMargin).toBeGreaterThan(100)
  })

  test('the grain overlay never intercepts a click', async ({ page }) => {
    await page.goto('/')
    const pointerEvents = await page.evaluate(
      () => getComputedStyle(document.body, '::before').pointerEvents,
    )
    expect(pointerEvents).toBe('none')
  })

  test('reserves the safe-area insets', async ({ page }) => {
    await page.goto('/')

    const usesSafeArea = await page.evaluate(() => {
      const styles = [...document.styleSheets]
        .flatMap((sheet) => {
          try {
            return [...sheet.cssRules].map((rule) => rule.cssText)
          } catch {
            return []
          }
        })
        .join('\n')
      return styles.includes('safe-area-inset')
    })

    expect(usesSafeArea).toBe(true)
  })

  test('the first product image reserves its aspect ratio to prevent shift', async ({
    page,
  }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)

    const ratio = await page
      .getByRole('img')
      .first()
      .evaluate((el) => getComputedStyle(el).aspectRatio)

    expect(ratio).not.toBe('auto')
  })
})
