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
    /*
      Wait for the webfonts before measuring anything.

      Both families load with `font-display: swap`, so a capture taken mid-swap measures
      the fallback's metrics. In the header that moved the search field's line box by a
      pixel, the whole document below it shifted by one, and a baseline recorded and
      immediately re-compared differed in total height — which reads as "the homepage
      changed" when nothing did. `document.fonts.ready` is the supported signal for this
      and it is raced, so a font that never resolves costs a second rather than the run.
    */
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ])

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

    /*
      Freeze film LAST, immediately before the capture.

      `animations: 'disabled'` covers CSS, not <video>. The ignition film starts by itself
      and runs ten seconds, so a capture taken mid-playback lands on whichever frame the
      decoder reached — which made the page height vary by a pixel between two captures of
      the same page. This ran first at one point, which left the whole scroll-and-decode
      pass for playback to resume in; last is the only position that holds.
    */
    for (const video of document.querySelectorAll('video')) {
      video.pause()
      try {
        video.currentTime = 0
      } catch {
        // A film with no loaded metadata cannot be sought; it is already at frame 0.
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  })

  await page.waitForTimeout(300)
}

async function shoot(page: import('@playwright/test').Page, name: string) {
  await stabilise(page)
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
}

/**
 * Captures a named region instead of the whole document.
 *
 * The homepage is now a 25,000-pixel editorial scroll, and a full-page baseline of it is
 * not a useful regression test: ANY one-pixel reflow anywhere changes the canvas size, so
 * the comparison fails without saying what moved, and the true diff is invisible inside a
 * 25k-pixel image. Worse, a full-page capture of a page that tall is inherently racy —
 * a late webfont metric or a decoded image shifts the total by a pixel between two
 * captures of an unchanged page, which is exactly what it did.
 *
 * Section shots are the fix that keeps the value: each one is small enough to read at a
 * glance, stable because its own box is stable, and it names the thing it guards.
 */
async function shootRegion(
  page: import('@playwright/test').Page,
  selector: string,
  name: string,
) {
  await stabilise(page)
  const region = page.locator(selector).first()
  await region.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await expect(region).toHaveScreenshot(`${name}.png`)
}

test.describe('public surfaces — desktop', () => {
  test.use({ viewport: DESKTOP })

  /*
    The homepage is guarded section by section rather than as one enormous canvas — see
    `shootRegion`. Together these cover the opening, the collection grid, the marquee,
    the campaign story and the closing strip: every band this redesign touched.
  */
  test('homepage — the opening', async ({ page }) => {
    await page.goto('/')
    await stabilise(page)
    await expect(page).toHaveScreenshot('desktop-homepage-opening.png')
  })

  test('homepage — the collection grid', async ({ page }) => {
    await page.goto('/')
    await shootRegion(page, '.worlds', 'desktop-homepage-collections')
  })

  test('homepage — the marquee', async ({ page }) => {
    await page.goto('/')
    await shootRegion(page, '.marquee', 'desktop-homepage-marquee')
  })

  test('homepage — the campaign story', async ({ page }) => {
    await page.goto('/')
    await shootRegion(page, '.story', 'desktop-homepage-story')
  })

  test('homepage — the house strip', async ({ page }) => {
    await page.goto('/')
    await shootRegion(page, '.house-strip', 'desktop-homepage-strip')
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
