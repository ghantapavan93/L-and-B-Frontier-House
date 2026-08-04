import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Shared helpers for the browser pass.
 *
 * Sign-in goes through the real form every time — labelled controls and accessible roles,
 * never a generated action id, never a minted cookie. That is the whole point of this suite:
 * the structural tests prove the wire format, these prove the journey.
 */

export const FIXTURE_PASSWORD = 'frontier-dev'

export const BUYERS = {
  approved: 'approved@fixture.test',
  pending: 'pending@fixture.test',
  rejected: 'rejected@fixture.test',
  suspended: 'suspended@fixture.test',
} as const

export const PRODUCT_SLUG = 'dark-wash-high-rise-flare-jean'

/** Every Phase 1 public route. */
export const PUBLIC_ROUTES = [
  '/',
  '/new-arrivals',
  '/shop/women',
  '/shop/girls',
  '/shop/accessories',
  '/mens',
  '/edit/working-west',
  '/edit/rodeo-edit',
  `/product/${PRODUCT_SLUG}`,
  '/size-and-fit/women',
  '/wholesale',
  '/wholesale/apply',
  '/sign-in',
] as const

export const VIEWPORTS = [
  { name: '320', width: 320, height: 640 },
  { name: '375', width: 375, height: 667 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
] as const

/** Signs in through the real form. Fails loudly if the journey does not complete. */
export async function signIn(page: Page, email: string, next?: string): Promise<void> {
  await page.goto(next ? `/sign-in?next=${encodeURIComponent(next)}` : '/sign-in')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(FIXTURE_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).not.toHaveURL(/\/sign-in/)
}

export async function signOut(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL('/')
}

/**
 * Empties the signed-in buyer's draft order through the UI.
 *
 * The fixture adapter holds drafts in the server process, so state carries between specs.
 * Rather than adding a reset hook to the application — a test-only mutation endpoint is a
 * real attack surface — tests that assert exact totals clear the order the way a buyer
 * would: set each line to zero.
 */
export async function clearOrder(page: Page): Promise<void> {
  for (let guard = 0; guard < 20; guard += 1) {
    // Re-navigate each pass. Counting rows and then filling one without reloading raced
    // against the redirect that follows an update, leaving a detached locator.
    await page.goto('/trade/order')

    const inputs = page.locator('input[name="quantity"]')
    if ((await inputs.count()) === 0) return

    await inputs.first().fill('0')
    await page.getByRole('button', { name: 'Update' }).first().click()
    await page.waitForURL('**/trade/order')
  }

  throw new Error('clearOrder could not empty the draft order')
}

/** Any precise money amount. No public surface states one. */
export const MONEY_WITH_CENTS = /\$\s?\d[\d,]*\.\d{2}/

/** Restricted vocabulary that must never reach an unauthorised viewport. */
const RESTRICTED_TEXT = [/LB-[A-Z]{3}-[A-Z]{3}/, /Suggested retail/, /Your wholesale terms/]

/**
 * Asserts no restricted value is rendered.
 *
 * Deliberately reads `innerText` and matches against it, rather than using
 * `expect(locator).not.toHaveText(regex)` — that form requires the regex to match the WHOLE
 * string, so a negated partial pattern passes vacuously and proves nothing.
 */
export async function expectNoRestrictedValue(page: Page, context = ''): Promise<void> {
  const text = await page.locator('body').innerText()
  expect(text, `${context}: a money value was rendered`).not.toMatch(MONEY_WITH_CENTS)
  for (const pattern of RESTRICTED_TEXT) {
    expect(text, `${context}: restricted text ${pattern} was rendered`).not.toMatch(pattern)
  }
}

/** The element the browser currently has focused, described the way a user perceives it. */
export async function focusedDescriptor(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return 'BODY'
    const tag = el.tagName.toLowerCase()
    const label =
      el.getAttribute('aria-label') ??
      (el as HTMLElement).innerText?.trim().split('\n')[0] ??
      el.getAttribute('name') ??
      ''
    return `${tag}:${label.slice(0, 40)}`
  })
}

/** Walks forward with Tab, returning what received focus at each step. */
export async function tabThrough(page: Page, steps: number): Promise<string[]> {
  const seen: string[] = []
  for (let i = 0; i < steps; i += 1) {
    await page.keyboard.press('Tab')
    seen.push(await focusedDescriptor(page))
  }
  return seen
}
