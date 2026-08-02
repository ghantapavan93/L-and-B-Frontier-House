import { expect, test } from '@playwright/test'
import { BUYERS, clearOrder, PRODUCT_SLUG, signIn } from './support/fixtures'

/**
 * VISUAL REGRESSION BASELINE.
 *
 * These are INTENTIONAL baselines of the current implementation, captured once and then
 * defended. They are not a diff against the V3 renders: V3 is a set of static images of a
 * different, unbuilt design, so it cannot be compared programmatically.
 *
 * V3 remains the comparison authority for judgement, and every deliberate deviation from it
 * is recorded in docs/progress/PHASE_1_IMPLEMENTATION_REPORT.md rather than absorbed
 * silently into a snapshot. When a snapshot changes, the rule is: explain the change or
 * revert the code — never re-record blindly.
 */

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

async function stabilise(page: import('@playwright/test').Page) {
  await page.waitForLoadState('load')

  /*
    Settle lazy and responsive images without ever hanging.

    `img.decode()` on a `<picture>` whose sources are art-directed can stay pending forever
    when the matched source is not the one the element resolved from — which is exactly what
    it did on the mobile hero. Scrolling triggers the lazy images, and the decode is raced
    against a timeout so a stuck image costs a few hundred milliseconds rather than the test.
  */
  await page.evaluate(async () => {
    // Step down the page rather than jumping: a single jump to the bottom skips past
    // mid-page lazy images, which is how the category tiles landed in a baseline unloaded.
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
    window.scrollTo(0, 0)
    await new Promise((resolve) => setTimeout(resolve, 200))

    await Promise.race([
      Promise.all(
        [...document.images].map((image) =>
          image.complete ? null : image.decode().catch(() => null),
        ),
      ),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ])
  })

  await page.waitForTimeout(300)
}

async function shoot(page: import('@playwright/test').Page, name: string) {
  await stabilise(page)
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
}

test.describe('public surfaces — desktop', () => {
  test.use({ viewport: DESKTOP })

  test('homepage', async ({ page }) => {
    await page.goto('/')
    await shoot(page, 'desktop-homepage')
  })

  test('new arrivals', async ({ page }) => {
    await page.goto('/new-arrivals')
    await shoot(page, 'desktop-new-arrivals')
  })

  test('product listing', async ({ page }) => {
    await page.goto('/shop/women')
    await shoot(page, 'desktop-product-listing')
  })

  test('public product detail', async ({ page }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)
    await shoot(page, 'desktop-product-detail-public')
  })

  test('size and fit', async ({ page }) => {
    await page.goto('/size-and-fit/women')
    await shoot(page, 'desktop-size-and-fit')
  })

  test('wholesale information', async ({ page }) => {
    await page.goto('/wholesale')
    await shoot(page, 'desktop-wholesale')
  })

  test('buyer application', async ({ page }) => {
    await page.goto('/wholesale/apply')
    await shoot(page, 'desktop-buyer-application')
  })

  test('sign in', async ({ page }) => {
    await page.goto('/sign-in')
    await shoot(page, 'desktop-sign-in')
  })
})

test.describe('states — desktop', () => {
  test.use({ viewport: DESKTOP })

  test('permission denied', async ({ page }) => {
    // Denial redirects to sign-in carrying the reason and the original intent.
    await page.goto('/trade/order')
    await expect(page).toHaveURL(/\/sign-in/)
    await shoot(page, 'desktop-permission-denied')
  })

  test('empty filter result', async ({ page }) => {
    await page.goto('/shop/girls?fabric=velvet%20burnout')
    await shoot(page, 'desktop-empty-state')
  })

  test('not found', async ({ page }) => {
    await page.goto('/product/no-such-style')
    await shoot(page, 'desktop-error-not-found')
  })

  test('form error', async ({ page }) => {
    await page.goto('/sign-in?error=invalid')
    await shoot(page, 'desktop-error-form')
  })

  test('pending approval', async ({ page }) => {
    await signIn(page, BUYERS.pending)
    await shoot(page, 'desktop-pending-approval')
  })

  test('application denied', async ({ page }) => {
    await signIn(page, BUYERS.rejected)
    await shoot(page, 'desktop-application-denied')
  })

  test('account suspended', async ({ page }) => {
    await signIn(page, BUYERS.suspended)
    await shoot(page, 'desktop-account-suspended')
  })
})

test.describe('authorised surfaces — desktop', () => {
  test.use({ viewport: DESKTOP })

  test('approved buyer product detail', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await shoot(page, 'desktop-product-detail-authorised')
  })

  test('wholesale order surface — empty', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await shoot(page, 'desktop-order-empty')
  })

  test('wholesale order surface — with lines', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await page.getByRole('button', { name: 'Add to order' }).click()
    await expect(page).toHaveURL('/trade/order')
    await shoot(page, 'desktop-order-with-lines')
  })

  test('buyer passport', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto('/trade')
    await shoot(page, 'desktop-passport')
  })

  test('order history', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await page.goto('/trade/orders')
    await shoot(page, 'desktop-order-history')
  })
})

test.describe('critical routes — mobile', () => {
  test.use({ viewport: MOBILE })

  test('homepage', async ({ page }) => {
    await page.goto('/')
    await shoot(page, 'mobile-homepage')
  })

  test('new arrivals', async ({ page }) => {
    await page.goto('/new-arrivals')
    await shoot(page, 'mobile-new-arrivals')
  })

  test('product listing', async ({ page }) => {
    await page.goto('/shop/women')
    await shoot(page, 'mobile-product-listing')
  })

  test('public product detail', async ({ page }) => {
    await page.goto(`/product/${PRODUCT_SLUG}`)
    await shoot(page, 'mobile-product-detail-public')
  })

  test('sign in', async ({ page }) => {
    await page.goto('/sign-in')
    await shoot(page, 'mobile-sign-in')
  })

  test('buyer application', async ({ page }) => {
    await page.goto('/wholesale/apply')
    await shoot(page, 'mobile-buyer-application')
  })

  test('approved buyer product detail', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await shoot(page, 'mobile-product-detail-authorised')
  })

  test('wholesale order surface', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await page.getByRole('button', { name: 'Add to order' }).click()
    await expect(page).toHaveURL('/trade/order')
    await shoot(page, 'mobile-order-with-lines')
  })

  test('order history', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await page.goto('/trade/orders')
    await shoot(page, 'mobile-order-history')
  })

  test('buyer passport', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await page.goto('/trade')
    await shoot(page, 'mobile-passport')
  })
})
