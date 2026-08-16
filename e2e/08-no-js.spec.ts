import { expect, test } from '@playwright/test'

/*
 * NO-JAVASCRIPT VISIBILITY — the browser-level half of CI Test 1.
 *
 * The structural no-JS assertion proves content is present and reachable in the served
 * bytes. It cannot prove content is VISIBLE, because visibility is a rendered property —
 * and the reference audit caught us shipping exactly that failure: the hero's primary CTA
 * row held at `opacity: 0` waiting for an animation that a no-JS/frozen context would
 * never run. These tests render the page with JavaScript disabled and assert the things a
 * reader must be able to see and use.
 *
 * This is a REAL browser context with `javaScriptEnabled: false` — inline scripts,
 * controllers and custom elements all stay dead, which is the point.
 */

test.use({ javaScriptEnabled: false })

test.describe('with JavaScript disabled', () => {
  test('the hero is complete: headline, copy, and all three CTAs visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()

    // The three exits — §11's one-action exit to shop must be VISIBLE, not merely present.
    const actions = page.locator('.ignition__actions')
    await expect(actions).toBeVisible()
    const opacity = await actions.evaluate((el) => getComputedStyle(el).opacity)
    expect(Number.parseFloat(opacity)).toBeGreaterThanOrEqual(1)

    await expect(page.getByRole('link', { name: 'See new arrivals' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Skip to shop' })).toBeVisible()
  })

  test('film surfaces degrade to click-to-play with native controls', async ({ page }) => {
    await page.goto('/')

    // No script ran, so nothing may autoplay and no script-revealed toggle may show.
    const campaign = page.locator('[data-campaign-film]')
    await campaign.scrollIntoViewIfNeeded()
    expect(await campaign.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    expect(await campaign.getAttribute('controls')).not.toBeNull()
    await expect(page.locator('[data-campaign-toggle]')).toBeHidden()
  })

  test('the marquee pause control still works — it is a checkbox, not a script', async ({
    page,
  }) => {
    await page.goto('/')
    const marquee = page.locator('.marquee')
    await marquee.scrollIntoViewIfNeeded()

    // The CHECKBOX is the control — a transparent 44px input sitting exactly over the
    // drawn circle (the target-size fix). Clicking the label underneath is intercepted
    // by the input, which is correct: one element takes the click, the tap, the focus
    // and the measurement. The test clicks what a finger hits.
    await page.locator('.marquee__state').click()
    await expect(page.locator('.marquee__state')).toBeChecked()
  })

  test('the category page filters as a plain GET form', async ({ page }) => {
    await page.goto('/shop/women')

    // The fit row is server markup: real anchors with real hrefs.
    const chip = page.locator('.fit-row__chip').first()
    await expect(chip).toBeVisible()

    // Submitting the facet form is a full-page GET — no script required.
    await page.locator('#facet-legOpening').selectOption('bootcut')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page).toHaveURL(/legOpening=bootcut/)
    await expect(page.locator('.product-card').first()).toBeVisible()
  })

  test('scroll-rail decoration stays dead: no arrows, no progress bar', async ({ page }) => {
    // The house strip now drifts by CSS and carries no rail; the warehouse aisle is the
    // surface that still does.
    await page.goto('/warehouse')
    const strip = page.locator('.warehouse__aisle')
    await strip.scrollIntoViewIfNeeded()

    // Zero-by-default: the custom element never upgraded, so the arrows keep `hidden`
    // and the native scrollbar remains the affordance.
    await expect(page.locator('.scroll-rail__arrow--next')).toBeHidden()
    const bar = await page
      .locator('.scroll-rail')
      .first()
      .evaluate((el) => getComputedStyle(el, '::after').transform)
    // scaleX(0) — the progress bar has no width without the published property.
    expect(bar).toContain('matrix(0')
  })
})
