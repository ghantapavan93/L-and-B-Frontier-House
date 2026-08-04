/**
 * Search-parameter parsing for the assortment builder.
 *
 * Same allowlisting discipline as the facet panel: an unrecognised value is dropped rather
 * than passed through, so a crafted URL cannot reach the planner as an input it never
 * anticipated.
 *
 * One rule is specific to this surface. **No L&B price is read from or written to the query
 * string** — the price band travels as an opaque label (`core`), never as a figure
 * (`priceMax=2700`). The form is a GET form, so its inputs reach browser history, the
 * referrer header and server logs, and CLAUDE.md §11 puts all three out of bounds for a
 * restricted value. The budget is the buyer's own number rather than one of ours, and is
 * the only quantity that appears.
 */

import type { AssortmentInput, MixKey, PriceBand, StoreSize } from '@/domain/assortment'
import { MIXES, PRICE_BANDS, STORE_SIZES } from '@/domain/assortment'

type RawParams = Record<string, string | string[] | undefined>

/** Whole dollars. Floors well above the verified $50 minimum are the buyer's business. */
const BUDGET_MIN_MINOR = 5_000
const BUDGET_MAX_MINOR = 100_000_00
export const DEFAULT_BUDGET_MINOR = 250_000

const LAUNCH_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

function single(params: RawParams, key: string): string | undefined {
  const value = params[key]
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) {
    return value[0]
  }
  return undefined
}

/**
 * Budget arrives as whole dollars and is clamped, not rejected.
 *
 * A buyer who types 40 has stated an intent below the verified $50 minimum; answering with
 * a validation error teaches them nothing, whereas planning at the floor and showing the
 * minimum progress states the real constraint in the place they will act on it.
 */
function readBudgetMinor(params: RawParams): number {
  const raw = single(params, 'budget')
  if (raw === undefined) return DEFAULT_BUDGET_MINOR

  const dollars = Number.parseInt(raw.replace(/[^\d]/g, ''), 10)
  if (!Number.isFinite(dollars)) return DEFAULT_BUDGET_MINOR

  return Math.min(BUDGET_MAX_MINOR, Math.max(BUDGET_MIN_MINOR, dollars * 100))
}

export function readAssortmentParams(params: RawParams): AssortmentInput {
  const storeSize = single(params, 'storeSize')
  const mix = single(params, 'mix')
  const band = single(params, 'band')
  const launchMonth = single(params, 'launchMonth')

  return {
    budgetMinor: readBudgetMinor(params),
    storeSize: storeSize && storeSize in STORE_SIZES ? (storeSize as StoreSize) : 'boutique',
    mix: mix && mix in MIXES ? (mix as MixKey) : 'denim-led',
    band: band && band in PRICE_BANDS ? (band as PriceBand) : 'all',
    ...(launchMonth && LAUNCH_MONTH.test(launchMonth) ? { launchMonth } : {}),
  }
}

/** True when the buyer has actually stated a plan, rather than landing on the defaults. */
export function hasStatedPlan(params: RawParams): boolean {
  return ['budget', 'storeSize', 'mix', 'band', 'launchMonth'].some(
    (key) => single(params, key) !== undefined,
  )
}
