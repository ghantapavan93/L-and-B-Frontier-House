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
    await expect(page.getByRole('heading', { name: /This week's sheet/ })).toBeInViewport()
  })

  test('the ignition is the hero — one opening, headline in view immediately', async ({
    page,
  }) => {
    await page.goto('/')

    // The film and the headline share one section now. There used to be a second
    // full-viewport hero below carrying the same statement over a photograph, reached by
    // an "Enter the frontier" link; both are gone, so the h1 is visible on arrival
    // without a scroll or a click.
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toBeInViewport()
    await expect(page.locator('.hero--photographic')).toHaveCount(0)

    // The headline sits over the film, inside the same section.
    await expect(page.locator('.ignition #hero, #hero.ignition')).toHaveCount(1)
    await expect(page.locator('.ignition h1')).toHaveCount(1)
  })

  test('the hero is one background film, ten seconds, one-shot', async ({ page }) => {
    await page.goto('/')

    // The homepage now carries click-to-play players too; the BACKGROUND film is the
    // one under test here, addressed by its own attribute.
    const video = page.locator('[data-hero-film]')
    // One film. The section previously carried an SVG buckle AND a video of the same
    // buckle, which read as a duplicate rather than as a fallback.
    await expect(video).toHaveCount(1)
    await expect(page.locator('.ignition__buckle')).toHaveCount(0)

    // A background surface, not an embedded player: no native chrome, never loops.
    await expect(video).not.toHaveAttribute('controls', /.*/)
    await expect(video).not.toHaveAttribute('loop', /.*/)

    // No autoplay ATTRIBUTE — the attribute cannot be gated on a reduced-motion
    // preference from the server, so playback is started by the inline controller
    // instead. With JavaScript off nothing moves and the poster carries the section.
    await expect(video).not.toHaveAttribute('autoplay', /.*/)

    // Buckle ignition 4.00s + thread passage 6.00s, cut straight at the join.
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.duration))
      .toBeCloseTo(10, 1)

    // The poster is a real, art-directed image rather than the `poster` attribute, so
    // each aspect gets its own frame instead of a centre crop.
    await expect(page.locator('.hero-film__poster img')).toHaveAttribute(
      'src',
      /lb-hero-poster/,
    )
    await expect(page.locator('a[href="/transcript/buckle-ignition"]')).toBeVisible()

    // Nothing on the page loops indefinitely.
    const infinite = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.ignition *')].some(
        (el) => getComputedStyle(el).animationIterationCount === 'infinite',
      ),
    )
    expect(infinite).toBe(false)
  })

  test('it plays by itself and can be stopped — WCAG 2.2.2', async ({ page }) => {
    await page.goto('/')

    // The homepage now carries click-to-play players too; the BACKGROUND film is the
    // one under test here, addressed by its own attribute.
    const video = page.locator('[data-hero-film]')
    // Addressed by ITS OWN attribute, not by accessible name. The campaign film below now
    // carries a pause control with the same wording — correctly, since both obey the same
    // rule — so a name-only locator matches two buttons and the strict-mode violation is
    // the test telling the truth about an ambiguous page.
    const toggle = page.locator('[data-hero-toggle]')

    // Ten seconds of automatic motion beside a headline is squarely inside 2.2.2, which
    // is Level A. The control must be present and visible, not merely available.
    await expect(toggle).toBeVisible()
    await expect.poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)

    await toggle.click()
    await expect.poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await toggle.click()
    await expect.poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('under reduced motion it never starts, and the poster carries it', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

    // The homepage now carries click-to-play players too; the BACKGROUND film is the
    // one under test here, addressed by its own attribute.
    const video = page.locator('[data-hero-film]')
    // The whole reason playback is script-started rather than an attribute: a visitor who
    // asked for no motion must get none, and `autoplay` cannot be withdrawn once served.
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused), { timeout: 3000 })
      .toBe(true)
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBe(0)

    // Still offered, never imposed. Scoped to the hero's own control — the campaign film
    // below offers the identically-worded one, and this test is about the ignition.
    await expect(page.locator('[data-hero-toggle]')).toBeVisible()
    await expect(page.locator('[data-hero-toggle]')).toHaveText(/Play the film/)
    await expect(page.locator('.hero-film__poster img')).toBeVisible()

    await context.close()
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
  test('the four collection tiles are whole-tile links into the labelled demonstration', async ({
    page,
  }) => {
    await page.goto('/')

    /*
      The worlds are the men's COLLECTIONS now (owner-directed, 2026-08-08): a two-column
      photographic grid, not the prev/next carousel this test used to describe. What is
      asserted is what still matters — four tiles, each a single link covering the whole
      tile, each opening the labelled demonstration rather than a catalogue route.
    */
    for (const world of ['denim', 'shirts', 'outerwear', 'accessories']) {
      const tile = page.locator(`#world-${world}`)
      await expect(tile, `#world-${world} is missing`).toHaveCount(1)

      const links = tile.locator('a')
      await expect(links, 'a tile must be exactly one link').toHaveCount(1)
      await expect(links).toHaveAttribute('href', `/mens#mens-${world}`)

      // The link covers the tile: the image is inside it, not beside it.
      await expect(links.locator('img')).toHaveCount(1)
    }

    // The marker travels with the imagery.
    await expect(page.locator('.worlds__marker')).toContainText(/demonstration/i)
  })

  test('the collection grid is reachable and operable by keyboard', async ({ page }) => {
    await page.goto('/')

    const denim = page.locator('#world-denim a')
    await denim.focus()
    await expect(denim).toBeFocused()

    const ring = await denim.evaluate((el) => getComputedStyle(el).outlineStyle)
    expect(ring, 'the tile takes focus with no visible ring').not.toBe('none')

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/mens#mens-denim$/)
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
