import { expect, test } from '@playwright/test'
import { PRODUCT_SLUG } from './support/fixtures'

/**
 * PHASE 2 — the cinematic layer, exercised the way a person uses it.
 *
 * Everything here is anchors, `:target` and a native disclosure — so every behaviour is
 * asserted through real keyboard and click interaction, and none of it needs JavaScript.
 */

test.describe('ignition and skip', () => {
  test('skip to shop jumps the sequence by keyboard', async ({ page }) => {
    await page.goto('/')

    const skip = page.getByRole('link', { name: 'Skip to shop' })
    await skip.focus()
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/#sheet$/)
    await expect(page.getByRole('heading', { name: /This week/ })).toBeInViewport()
  })

  test('enter the frontier lands on the campaign hero', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Enter the frontier' }).click()

    await expect(page).toHaveURL(/#hero$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
  })

  test('the ignition film is user-started, one-shot and pausable', async ({ page }) => {
    await page.goto('/')

    const video = page.locator('video')
    await expect(video).toHaveCount(1)

    // WCAG 2.2.2 binds motion the user did not start. This starts on request, runs
    // 4.00s once, and exposes native controls — so no obligation is owed and none is
    // faked. Autoplay would also be unstoppable for a reduced-motion visitor, since
    // the attribute cannot be gated from the server.
    await expect(video).not.toHaveAttribute('autoplay', /.*/)
    await expect(video).not.toHaveAttribute('loop', /.*/)
    await expect(video).toHaveAttribute('controls', /.*/)
    await expect(video).toHaveAttribute('poster', /lb-buckle-poster/)
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)

    // The film is an enhancement: the poster and the SVG proof carry the section alone.
    await expect(page.locator('.ignition__buckle')).toBeVisible()
    await expect(page.locator('a[href="/transcript/buckle-ignition"]')).toBeVisible()

    // The one-shot draw finishes; nothing on the page loops indefinitely.
    const infinite = await page.evaluate(() => {
      return [...document.querySelectorAll<HTMLElement>('.ignition *')].some(
        (el) => getComputedStyle(el).animationIterationCount === 'infinite',
      )
    })
    expect(infinite).toBe(false)
  })
})

test.describe('contact-sheet stories', () => {
  test('a frame opens its story by keyboard and resolves to the product', async ({ page }) => {
    await page.goto('/')

    const frame = page.getByRole('link', { name: `Open the story for Dark Wash Flare` })
    await frame.focus()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(new RegExp(`#story-${PRODUCT_SLUG}$`))
    const story = page.locator(`#story-${PRODUCT_SLUG}`)
    await expect(story).toBeVisible()
    await expect(story.getByRole('heading', { name: 'Dark Wash Flare' })).toBeVisible()

    // Story → product route.
    const view = story.getByRole('link', { name: 'View product' })
    await view.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`/product/${PRODUCT_SLUG}`)
  })

  test('closing a story returns to the sheet and hides the panel', async ({ page }) => {
    await page.goto(`/#story-${PRODUCT_SLUG}`)
    const story = page.locator(`#story-${PRODUCT_SLUG}`)
    await expect(story).toBeVisible()

    await story.getByRole('link', { name: 'Close story' }).click()
    await expect(page).toHaveURL(/#sheet$/)
    await expect(story).toBeHidden()
  })

  test('the selected frame persists through a reload', async ({ page }) => {
    await page.goto(`/#story-${PRODUCT_SLUG}`)
    await page.reload()
    await expect(page.locator(`#story-${PRODUCT_SLUG}`)).toBeVisible()
  })

  test('under reduced motion the story appears directly, fully usable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await page.getByRole('link', { name: 'Open the story for Dark Wash Flare' }).click()
    await expect(page.locator(`#story-${PRODUCT_SLUG}`)).toBeVisible()
    await expect(
      page.locator(`#story-${PRODUCT_SLUG}`).getByRole('link', { name: 'View product' }),
    ).toBeVisible()
  })
})

test.describe('product worlds', () => {
  test('the four verified worlds render with keyboard-operable navigation', async ({
    page,
  }) => {
    await page.goto('/')

    for (const name of ['Women', 'Girls', 'Accessories', 'Wholesale']) {
      await expect(
        page.locator('.worlds__card').filter({ hasText: name }).first(),
      ).toBeAttached()
    }

    // A world card is a link and reaches its destination.
    await page.locator('#world-girls .worlds__card').click()
    await expect(page).toHaveURL('/shop/girls')
  })

  test('mobile world navigation moves the carousel without swiping', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const nav = page.getByRole('navigation', { name: 'Product worlds' })
    await expect(nav).toBeVisible()

    await nav.getByRole('link', { name: 'Go to the Accessories world' }).click()
    await expect(page.locator('#world-accessories')).toBeInViewport()

    await nav.getByRole('link', { name: 'Go to the Women world' }).click()
    await expect(page.locator('#world-women')).toBeInViewport()
  })
})

test.describe('mobile chrome', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the disclosure menu opens and navigates by keyboard alone', async ({ page }) => {
    await page.goto('/')

    const summary = page.locator('.nav-disclosure summary')
    await expect(summary).toBeVisible()
    await summary.focus()
    await page.keyboard.press('Enter')

    const menu = page.getByRole('navigation', { name: 'Menu' })
    await expect(menu).toBeVisible()

    await menu.getByRole('link', { name: 'New Arrivals' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/new-arrivals')
  })

  test('the compact bar keeps wordmark and account on one row', async ({ page }) => {
    await page.goto('/')

    const bar = page.locator('.site-header__bar')
    await expect(bar.locator('.site-header__wordmark')).toBeVisible()
    await expect(bar.locator('.site-header__account-link')).toBeVisible()

    const menuBox = await page.locator('.nav-disclosure summary').boundingBox()
    const markBox = await bar.locator('.site-header__wordmark').boundingBox()
    expect(Math.abs((menuBox?.y ?? 0) - (markBox?.y ?? 99))).toBeLessThan(20)
  })

  test('the cinematic homepage still has no horizontal overflow on mobile', async ({
    page,
  }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => {
      window.scrollTo(999_999, 0)
      const x = window.scrollX
      window.scrollTo(0, 0)
      return x
    })
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('wholesale showroom', () => {
  test('the rack scrolls in its own container and gates pricing', async ({ page }) => {
    await page.goto('/wholesale')

    await expect(page.getByRole('heading', { name: 'The line, on the rail' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Enter the showroom' })).toBeVisible()

    const rackOverflow = await page
      .locator('.rack__row')
      .evaluate((el) => getComputedStyle(el).overflowX)
    expect(rackOverflow).toBe('auto')

    const text = await page.locator('body').innerText()
    expect(text).not.toMatch(/\$\s?\d[\d,]*\.\d{2}/)
  })
})
