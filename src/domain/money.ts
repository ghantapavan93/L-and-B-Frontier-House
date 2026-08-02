/**
 * Money is integer minor units. Never a float, never a formatted string in the model.
 *
 * Formatting lives here so that a restricted value can never be accidentally
 * stringified into markup by an ad-hoc template elsewhere in the tree.
 */

export type Money = {
  readonly amountMinor: number
  readonly currency: 'USD'
}

export function usd(amountMinor: number): Money {
  if (!Number.isInteger(amountMinor)) {
    throw new TypeError(`Money must be integer minor units, received ${amountMinor}`)
  }
  return { amountMinor, currency: 'USD' }
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new TypeError('Cannot add money of differing currencies')
  }
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency }
}

export function multiplyMoney(m: Money, factor: number): Money {
  if (!Number.isInteger(factor)) {
    throw new TypeError(`Money multiplier must be an integer, received ${factor}`)
  }
  return { amountMinor: m.amountMinor * factor, currency: m.currency }
}

export function compareMoney(a: Money, b: Money): number {
  return a.amountMinor - b.amountMinor
}

const USD_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(m: Money): string {
  return USD_FORMAT.format(m.amountMinor / 100)
}

/**
 * Verified wholesale band: $7–$33 per item (docs/brand-research/00_BRAND_TRUTH.md).
 * Enforced by the product-data integrity test, not by the renderer.
 */
export const VERIFIED_WHOLESALE_BAND_MINOR = { min: 700, max: 3300 } as const

/** Verified order minimum: $50. */
export const VERIFIED_ORDER_MINIMUM: Money = { amountMinor: 5000, currency: 'USD' }

/** Verified default prepack size: 6 units. */
export const VERIFIED_PREPACK_UNITS = 6
