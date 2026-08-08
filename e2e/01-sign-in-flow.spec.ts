import { createHmac } from 'node:crypto'
import { expect, test } from '@playwright/test'
import {
  BUYERS,
  clearOrder,
  expectNoRestrictedValue,
  FIXTURE_PASSWORD,
  PRODUCT_SLUG,
  signIn,
  signOut,
} from './support/fixtures'

/**
 * THE REAL BUYER JOURNEY.
 *
 * Every step goes through the actual form: labelled controls, accessible roles, real POST,
 * real server validation, real cookie, real redirect. No minted session, no generated
 * action id.
 *
 * The one exception is the server-side expiry test, which mints a token with a past
 * timestamp because the alternative is waiting eight hours. It is marked where it happens.
 */

/** Matches the secret in playwright.config.ts. */
const TEST_SECRET = 'browser-test-secret'

function expiredToken(buyerId: string): string {
  const body = Buffer.from(
    JSON.stringify({ buyerId, expiresAt: Date.now() - 60_000 }),
  ).toString('base64url')
  const signature = createHmac('sha256', TEST_SECRET).update(body).digest('base64url')
  return `${body}.${signature}`
}

test.describe('approved buyer — full journey', () => {
  test('signs in and reaches authorised pricing, then adds to order', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/product/${PRODUCT_SLUG}`)

    // The public page offers the gate, not a price.
    const gate = page.getByRole('region', { name: 'Wholesale pricing' })
    await expect(gate).toBeVisible()
    await expectNoRestrictedValue(page, 'public product detail')

    await gate.getByRole('link', { name: 'Buyer sign in' }).click()
    await expect(page).toHaveURL(/\/sign-in\?next=/)

    await page.getByLabel('Email').fill(BUYERS.approved)
    await page.getByLabel('Password').fill(FIXTURE_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Intent preserved across authentication.
    await expect(page).toHaveURL(`/trade/product/${PRODUCT_SLUG}`)

    // Authorised pricing, MSRP, MOQ, SKU, prepack — all real text.
    await expect(page.getByText('$31.00')).toBeVisible()
    await expect(page.getByText('Suggested retail $82.00 — 62% margin')).toBeVisible()
    await expect(page.getByText('JE334-DW')).toBeVisible()
    await expect(page.getByText('6 units of this style')).toBeVisible()
    await expect(page.getByRole('table', { name: /Units per prepack/ })).toBeVisible()

    // Add to Order.
    await page.getByLabel('Prepacks').fill('2')
    await page.getByRole('button', { name: 'Add to order' }).click()

    await expect(page).toHaveURL('/trade/order')
    await expect(page.getByRole('heading', { name: 'Your order', level: 1 })).toBeVisible()
    await expect(page.getByRole('cell', { name: '12', exact: true }).first()).toBeVisible()
    await expect(page.getByText('Minimum met')).toBeVisible()

    // Passport reflects the order.
    await page
      .getByRole('navigation', { name: 'Account' })
      .getByRole('link', { name: 'Your account' })
      .click()
    await expect(page).toHaveURL('/trade')
    await expect(page.getByText('1 style · 12 units')).toBeVisible()

    // Order history and reorder.
    await page.getByRole('link', { name: 'All orders' }).click()
    await expect(page).toHaveURL('/trade/orders')
    await page.getByRole('button', { name: /Reorder order LB-2026-0641/ }).click()
    await expect(page).toHaveURL('/trade/order')
    await expect(page.getByRole('link', { name: 'Dark Wash Bootcut' })).toBeVisible()
  })

  test('submits an order and lands on its status', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await clearOrder(page)
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await page.getByRole('button', { name: 'Add to order' }).click()
    await expect(page).toHaveURL('/trade/order')

    await page.getByRole('button', { name: 'Send this order' }).click()

    await expect(page).toHaveURL(/\/trade\/orders\/LB-FIXTURE-\d+\?submitted=1/)
    await expect(page.getByText('Order sent')).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'Submitted' })).toBeVisible()
  })
})

test.describe('credential and account states', () => {
  test('rejects invalid credentials without revealing which field was wrong', async ({
    page,
  }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Email').fill(BUYERS.approved)
    await page.getByLabel('Password').fill('not-the-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/sign-in?error=invalid')

    // Scoped past Next's own route announcer, which also carries role="alert".
    const alert = page.locator('.notice--error')
    await expect(alert).toBeVisible()
    await expect(alert).toHaveAttribute('role', 'alert')
    await expect(alert).toContainText('do not match an account')
    // Must not disclose whether the account exists or what its status is.
    await expect(alert).not.toContainText('approved')
    await expect(alert).not.toContainText('pending')
  })

  test('rejects an unknown account identically', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Email').fill('nobody@fixture.test')
    await page.getByLabel('Password').fill(FIXTURE_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/sign-in?error=invalid')
    await expect(page.locator('.notice--error')).toContainText('do not match an account')
  })

  test('a pending buyer sees status and timing, never pricing', async ({ page }) => {
    await signIn(page, BUYERS.pending)

    await expect(page).toHaveURL('/trade')
    await expect(page.getByRole('heading', { name: 'We have your application' })).toBeVisible()
    await expect(page.getByText('typically less than one business day')).toBeVisible()
    await expectNoRestrictedValue(page, 'pending passport')

    // And cannot reach an authorised route by typing it.
    await page.goto(`/trade/product/${PRODUCT_SLUG}`)
    await expect(page).toHaveURL('/trade')
    await expectNoRestrictedValue(page, 'pending buyer at authorised URL')
  })

  test('a denied buyer gets a route forward, not a dead end', async ({ page }) => {
    await signIn(page, BUYERS.rejected)

    await expect(
      page.getByRole('heading', { name: 'We could not approve this application' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Submit an updated application' }),
    ).toBeVisible()
    await expectNoRestrictedValue(page, 'denied passport')
  })

  test('a suspended buyer is told ordering is paused', async ({ page }) => {
    await signIn(page, BUYERS.suspended)

    await expect(
      page.getByRole('heading', { name: 'Ordering is paused on this account' }),
    ).toBeVisible()
    await expectNoRestrictedValue(page, 'suspended passport')

    await page.goto('/trade/order')
    await expect(page).toHaveURL('/trade')
  })
})

test.describe('session lifecycle', () => {
  test('sets an httpOnly, sameSite, path-scoped session cookie', async ({ page, context }) => {
    await signIn(page, BUYERS.approved)

    const cookies = await context.cookies()
    const session = cookies.find((c) => c.name === 'lb_session')

    expect(session, 'no session cookie was set').toBeDefined()
    expect(session?.httpOnly, 'session cookie must be httpOnly').toBe(true)
    expect(session?.sameSite).toBe('Lax')
    expect(session?.path).toBe('/')
    // Set from NODE_ENV; the production build marks it Secure.
    expect(session?.secure).toBe(true)
    // The cookie carries an identifier and a signature — never a role or an entitlement.
    expect(session?.value).not.toContain('approved')
  })

  test('is not readable from JavaScript', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    const visible = await page.evaluate(() => document.cookie)
    expect(visible).not.toContain('lb_session')
  })

  test('sign out ends access immediately', async ({ page }) => {
    await signIn(page, BUYERS.approved)
    await page.goto('/trade/order')
    await expect(page.getByRole('heading', { name: 'Your order', level: 1 })).toBeVisible()

    await signOut(page)

    await page.goto('/trade/order')
    await expect(page).toHaveURL(/\/sign-in/)
    await expectNoRestrictedValue(page, 'after sign out')
  })

  test('browser back after sign out never reveals restricted data', async ({ page }) => {
    await signIn(page, BUYERS.approved, `/trade/product/${PRODUCT_SLUG}`)
    await expect(page.getByText('$31.00')).toBeVisible()

    await signOut(page)
    await expect(page).toHaveURL('/')

    // The authorised response was `no-store`, so history navigation must revalidate.
    await page.goBack()
    await expect(page).toHaveURL(/\/sign-in/)
    await expectNoRestrictedValue(page, 'history entry after sign out')
  })

  test('a session whose cookie has expired in the browser fails safely', async ({
    page,
    context,
  }) => {
    await signIn(page, BUYERS.approved, '/trade/order')
    await expect(page.getByRole('heading', { name: 'Your order', level: 1 })).toBeVisible()

    // Age the cookie out the way a clock would.
    const [session] = (await context.cookies()).filter((c) => c.name === 'lb_session')
    await context.clearCookies()
    await context.addCookies([
      {
        name: 'lb_session',
        value: session?.value ?? '',
        domain: 'localhost',
        path: '/',
        expires: Math.floor(Date.now() / 1000) - 3600,
        httpOnly: true,
        sameSite: 'Lax',
        secure: true,
      },
    ])

    await page.reload()
    await expect(page).toHaveURL(/\/sign-in/)
    await expectNoRestrictedValue(page, 'browser-expired session')
  })

  test('a server-side expired token is refused even if the cookie survives', async ({
    page,
    context,
  }) => {
    await signIn(page, BUYERS.approved)

    // Minted deliberately: the token's own `expiresAt` is in the past, which cannot be
    // reproduced through the UI without waiting out the eight-hour session lifetime. The
    // signature is genuine, so this isolates expiry from tampering.
    await context.clearCookies()
    await context.addCookies([
      {
        name: 'lb_session',
        value: expiredToken('b-approved'),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        secure: true,
      },
    ])

    await page.goto('/trade/order')
    await expect(page).toHaveURL(/\/sign-in/)
    await expectNoRestrictedValue(page, 'server-expired token')
  })

  test('a tampered cookie is refused', async ({ page, context }) => {
    await signIn(page, BUYERS.approved)

    const [session] = (await context.cookies()).filter((c) => c.name === 'lb_session')
    const [body] = (session?.value ?? '').split('.')

    await context.clearCookies()
    await context.addCookies([
      {
        name: 'lb_session',
        value: `${body}.forged-signature`,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        secure: true,
      },
    ])

    await page.goto('/trade/order')
    await expect(page).toHaveURL(/\/sign-in/)
  })

  test('direct access to every restricted route is denied with intent preserved', async ({
    page,
  }) => {
    for (const route of [
      '/trade',
      '/trade/order',
      '/trade/orders',
      `/trade/product/${PRODUCT_SLUG}`,
    ]) {
      await page.goto(route)
      await expect(page, `${route} did not redirect`).toHaveURL(/\/sign-in/)
      await expect(page).toHaveURL(/next=/)
      await expectNoRestrictedValue(page, `anonymous at ${route}`)
    }
  })
})

test.describe('buyer application', () => {
  test('submits through the four-step flow and lands in the received state', async ({
    page,
  }) => {
    await page.goto('/wholesale/apply')

    // Step 1 — the store.
    await page.getByLabel('Store name').fill('Playwright Fixture Store')
    await page.getByLabel('Your name').fill('Playwright Buyer')
    await page.getByLabel('Email').fill('applicant@fixture.test')
    await page.getByRole('button', { name: 'Continue — credentials' }).click()

    // Step 2 — credentials.
    await expect(page).toHaveURL(/step=2/)
    await page.getByLabel('Sales tax ID').fill('FIXTURE-APPLY-0001')
    await page.getByLabel('State').fill('TX')
    await page.getByLabel('City').fill('Austin')
    await page.getByRole('button', { name: 'Continue — buying profile' }).click()

    // Step 3 — optional throughout; skipping it must be allowed.
    await expect(page).toHaveURL(/step=3/)
    await page.getByRole('button', { name: 'Continue — review' }).click()

    // Step 4 — review masks the tax ID to its last four characters.
    await expect(page).toHaveURL(/step=4/)
    await expect(page.locator('body')).not.toContainText('FIXTURE-APPLY-0001')
    await expect(page.getByText('•••• 0001')).toBeVisible()
    await page.getByLabel(/buying for resale/).check()
    await page.getByRole('button', { name: 'Submit application' }).click()

    // The designed received state, then the pending panel on the account page.
    await expect(page).toHaveURL('/wholesale/apply/received')
    await expect(
      page.getByRole('heading', { name: /Received, Playwright Fixture Store/ }),
    ).toBeVisible()
    // The submitted tax ID is never echoed back to the browser.
    await expect(page.locator('body')).not.toContainText('FIXTURE-APPLY-0001')

    await page.goto('/trade')
    await expect(page.getByRole('heading', { name: 'We have your application' })).toBeVisible()
  })

  test('shows a validation error without JavaScript state', async ({ page }) => {
    await page.goto('/wholesale/apply?error=missing')
    const alert = page.locator('.notice--error')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('A required field on this step is empty')
  })
})
