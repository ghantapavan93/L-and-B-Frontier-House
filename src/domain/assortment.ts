/**
 * ASSORTMENT PLANNING — arithmetic over the published line, not a recommendation engine.
 *
 * The distinction is the whole design. A buyer opening a tool called "assortment builder"
 * will reasonably assume it knows what sells. **It does not, and it must never imply that
 * it does.** There is no sales history, no sell-through data, no returns data and no
 * regional performance data in this project — see `EXCLUDED_INPUTS` below. Inventing a
 * weighting from any of them would be a fabricated claim about the buyer's own business.
 *
 * What it legitimately does is the arithmetic a buyer would otherwise do on paper: take a
 * budget, a breadth-and-depth intent and a price band, and fill them against real styles at
 * real wholesale prices in real prepacks. Every rule it applies is stated on the page, every
 * line it produces is editable, and the whole plan is a starting draft order rather than a
 * locked recommendation.
 *
 * Pure by construction — no session, no repository, no `server-only`. The route applies
 * authorisation before any product reaches this module, and it only ever receives
 * `AuthorisedProduct`, which is the type that carries wholesale terms at all.
 */

import { addMoney, compareMoney, multiplyMoney, usd, VERIFIED_ORDER_MINIMUM } from './money'
import type { Money } from './money'
import type { AuthorisedProduct } from './product'

/**
 * Inputs deliberately NOT accepted, and why. Named here rather than omitted silently,
 * because a missing field in a planning tool reads as an oversight unless it is stated.
 *
 *   region          No data exists. Distribution being Texas-concentrated is a verified
 *                   fact about where the brand sells, NOT about what sells where — using
 *                   it to weight an assortment would invent a merchandising claim. The
 *                   blueprint lists it as an input; the constitution's "no invented product
 *                   facts" and "no features without evidence" outrank a creative document.
 *   sell-through    No sales history in this project.
 *   return rate     No returns data.
 *   size curve      Prepack breakdowns are fixed by the manufacturer at 6 units. A buyer
 *                   cannot reweight them, so offering the control would be a false promise.
 */
export const EXCLUDED_INPUTS = ['region', 'sell-through', 'return rate', 'size curve'] as const

/** Breadth and depth intent. Every value is shown to the buyer beside its meaning. */
export type StoreSize = 'boutique' | 'established' | 'multi-door'

export type StoreSizeProfile = {
  readonly label: string
  /** Distinct styles the plan aims for. */
  readonly styles: number
  /** Prepacks per style. Depth. */
  readonly packsPerStyle: number
  readonly description: string
}

export const STORE_SIZES: Record<StoreSize, StoreSizeProfile> = {
  boutique: {
    label: 'Single boutique',
    styles: 6,
    packsPerStyle: 1,
    description: 'Broad and shallow — one pack per style, so the floor reads varied.',
  },
  established: {
    label: 'Established store',
    styles: 12,
    packsPerStyle: 2,
    description: 'Two packs per style on a wider style count.',
  },
  'multi-door': {
    label: 'Multi-door',
    styles: 20,
    packsPerStyle: 3,
    description: 'Depth for several floors — three packs per style.',
  },
}

/**
 * Price bands are OPAQUE LABELS, and that is a security decision rather than a stylistic
 * one. The plan form is a GET form, so every input lands in the URL, in browser history, in
 * the referrer header and in server logs. A wholesale figure must never reach any of those
 * (CLAUDE.md §11). `band=core` carries the buyer's intent; `priceMax=2700` would carry a
 * restricted value out of the authorised session.
 *
 * The bands themselves subdivide the verified $7–$33 wholesale band.
 */
export type PriceBand = 'all' | 'entry' | 'core' | 'elevated'

export type PriceBandProfile = {
  readonly label: string
  readonly minMinor: number
  readonly maxMinor: number
}

export const PRICE_BANDS: Record<PriceBand, PriceBandProfile> = {
  all: { label: 'Every price', minMinor: 700, maxMinor: 3300 },
  entry: { label: 'Entry', minMinor: 700, maxMinor: 1700 },
  core: { label: 'Core', minMinor: 1800, maxMinor: 2700 },
  elevated: { label: 'Elevated', minMinor: 2800, maxMinor: 3300 },
}

/** Category mix presets. Each names its own split so the buyer sees the arithmetic. */
export type MixKey = 'denim-led' | 'balanced' | 'womens-only'

export type MixProfile = {
  readonly label: string
  /** Category slug → share of budget. Shares sum to 1. */
  readonly shares: ReadonlyMap<string, number>
}

export const MIXES: Record<MixKey, MixProfile> = {
  'denim-led': {
    label: 'Denim-led',
    shares: new Map([
      ['women', 0.8],
      ['girls', 0.1],
      ['accessories', 0.1],
    ]),
  },
  balanced: {
    label: 'Balanced',
    shares: new Map([
      ['women', 0.6],
      ['girls', 0.2],
      ['accessories', 0.2],
    ]),
  },
  'womens-only': {
    label: "Women's only",
    shares: new Map([['women', 1]]),
  },
}

export type AssortmentInput = {
  /** Whole dollars. The buyer's own figure, never an L&B price. */
  readonly budgetMinor: number
  readonly storeSize: StoreSize
  readonly mix: MixKey
  readonly band: PriceBand
  /** `YYYY-MM`, or undefined for no launch constraint. */
  readonly launchMonth?: string
}

export type PlannedLine = {
  readonly product: AuthorisedProduct
  readonly packs: number
  readonly units: number
  readonly spend: Money
  readonly retailValue: Money
}

export type CategoryPlan = {
  readonly categorySlug: string
  readonly share: number
  readonly budget: Money
  readonly lines: readonly PlannedLine[]
  readonly spend: Money
  /** Styles that fitted the filters but not the remaining budget. */
  readonly skippedForBudget: number
  /** Styles matching the filters at all. Zero means the filters, not the budget, emptied it. */
  readonly eligible: number
}

export type AssortmentPlan = {
  readonly input: AssortmentInput
  readonly categories: readonly CategoryPlan[]
  readonly lines: readonly PlannedLine[]
  readonly totalUnits: number
  readonly totalSpend: Money
  readonly totalRetailValue: Money
  /** Whole-percent blended margin, or 0 when the plan is empty. */
  readonly blendedMargin: number
  readonly remainingBudget: Money
  readonly sizeDistribution: readonly { readonly size: string; readonly units: number }[]
  readonly colourDistribution: readonly { readonly colour: string; readonly units: number }[]
}

/** A style with no allocation cannot be planned against. Stated, never silently dropped. */
function isPlannable(product: AuthorisedProduct): boolean {
  return product.availability === 'in-stock' || product.availability === 'pre-order'
}

/**
 * Launch month is applied against real pre-order ship windows only.
 *
 * An in-stock style is available now and therefore always feasible. A pre-order style is
 * feasible only if its ship window opens on or before the launch month — that is a sourced
 * exclusion from `preOrder.shipWindowStart`, not a guess about seasonality.
 */
function arrivesBy(product: AuthorisedProduct, launchMonth: string | undefined): boolean {
  if (!launchMonth) return true
  if (!product.preOrder) return true
  return product.preOrder.shipWindowStart.slice(0, 7) <= launchMonth
}

function inBand(product: AuthorisedProduct, band: PriceBandProfile): boolean {
  const price = product.wholesale.wholesalePrice.amountMinor
  return price >= band.minMinor && price <= band.maxMinor
}

/**
 * Deterministic ordering, so the same inputs always produce the same rack and a buyer can
 * re-open a shared plan and see what their rep saw.
 *
 * Newest first is the only ranking the data actually supports — `newArrivalOn` is a real
 * publication date. Price descending then breaks ties toward the styles that carry the
 * budget, and slug makes it total.
 */
function planOrder(a: AuthorisedProduct, b: AuthorisedProduct): number {
  const arrival = (b.newArrivalOn ?? '').localeCompare(a.newArrivalOn ?? '')
  if (arrival !== 0) return arrival

  const price = b.wholesale.wholesalePrice.amountMinor - a.wholesale.wholesalePrice.amountMinor
  if (price !== 0) return price

  return a.slug.localeCompare(b.slug)
}

function lineFor(product: AuthorisedProduct, packs: number): PlannedLine {
  const units = product.wholesale.prepack.totalUnits * packs
  return {
    product,
    packs,
    units,
    spend: multiplyMoney(product.wholesale.wholesalePrice, units),
    retailValue: multiplyMoney(product.wholesale.msrp, units),
  }
}

/**
 * The deepest buy of this style that still fits, or null if even one pack does not.
 *
 * Depth degrades one pack at a time rather than collapsing straight to a single pack. On a
 * budget that runs out mid-rack the difference is visible: dropping 3 → 1 leaves money on
 * the table and a thin back half, where 3 → 2 keeps the buy even. It stays explainable
 * because the rule is still one sentence.
 */
function deepestFit(
  product: AuthorisedProduct,
  maxPacks: number,
  remainingMinor: number,
): PlannedLine | null {
  for (let packs = maxPacks; packs >= 1; packs -= 1) {
    const line = lineFor(product, packs)
    if (line.spend.amountMinor <= remainingMinor) return line
  }
  return null
}

/**
 * Fills one category's budget share.
 *
 * The walk is intentionally simple: take styles in plan order, buy the deepest quantity that
 * fits, and stop at the target style count. It is not an optimiser — a knapsack solution
 * would spend the budget more exactly and would be far harder for a buyer to argue with,
 * which is the wrong trade for a tool whose output is a starting draft.
 */
function planCategory(
  categorySlug: string,
  share: number,
  products: readonly AuthorisedProduct[],
  input: AssortmentInput,
): CategoryPlan {
  const profile = STORE_SIZES[input.storeSize]
  const band = PRICE_BANDS[input.band]
  const budget = usd(Math.round(input.budgetMinor * share))

  const eligible = products
    .filter(
      (p) =>
        p.categorySlug === categorySlug &&
        isPlannable(p) &&
        inBand(p, band) &&
        arrivesBy(p, input.launchMonth),
    )
    .sort(planOrder)

  const targetStyles = Math.max(1, Math.round(profile.styles * share))
  const lines: PlannedLine[] = []
  let spent = usd(0)
  let skippedForBudget = 0

  for (const product of eligible) {
    if (lines.length >= targetStyles) break

    const remaining = budget.amountMinor - spent.amountMinor
    const line = deepestFit(product, profile.packsPerStyle, remaining)

    if (!line) {
      skippedForBudget += 1
      continue
    }

    lines.push(line)
    spent = addMoney(spent, line.spend)
  }

  return {
    categorySlug,
    share,
    budget,
    lines,
    spend: spent,
    skippedForBudget,
    eligible: eligible.length,
  }
}

function tally<T>(
  items: readonly T[],
  key: (item: T) => string,
  units: (item: T) => number,
): { name: string; units: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    counts.set(key(item), (counts.get(key(item)) ?? 0) + units(item))
  }
  return [...counts.entries()]
    .map(([name, u]) => ({ name, units: u }))
    .sort((a, b) => b.units - a.units || a.name.localeCompare(b.name))
}

/**
 * Size distribution, summed from real prepack breakdowns.
 *
 * Open-sizing packs carry no breakdown, so their units are attributed to a named
 * "Selected at checkout" bucket rather than being silently dropped — a distribution that
 * does not sum to the plan's unit count is a distribution a buyer cannot trust.
 */
function sizeDistribution(lines: readonly PlannedLine[]) {
  const rows: { size: string; units: number }[] = []

  for (const line of lines) {
    const { prepack } = line.product.wholesale
    if (prepack.openSizing || prepack.breakdown.length === 0) {
      rows.push({ size: 'Selected at checkout', units: line.units })
      continue
    }
    for (const entry of prepack.breakdown) {
      rows.push({ size: entry.size, units: entry.quantity * line.packs })
    }
  }

  return tally(
    rows,
    (r) => r.size,
    (r) => r.units,
  ).map((r) => ({
    size: r.name,
    units: r.units,
  }))
}

/** Colour distribution from product attributes. A multi-colour style splits its units. */
function colourDistribution(lines: readonly PlannedLine[]) {
  const rows: { colour: string; units: number }[] = []

  for (const line of lines) {
    const colours = line.product.attributes.colour
    if (colours.length === 0) continue
    const per = Math.round(line.units / colours.length)
    for (const colour of colours) rows.push({ colour: colour.name, units: per })
  }

  return tally(
    rows,
    (r) => r.colour,
    (r) => r.units,
  ).map((r) => ({
    colour: r.name,
    units: r.units,
  }))
}

export function buildAssortment(
  products: readonly AuthorisedProduct[],
  input: AssortmentInput,
): AssortmentPlan {
  const mix = MIXES[input.mix]

  const categories = [...mix.shares.entries()].map(([categorySlug, share]) =>
    planCategory(categorySlug, share, products, input),
  )

  const lines = categories.flatMap((category) => category.lines)
  const totalSpend = lines.reduce<Money>((sum, line) => addMoney(sum, line.spend), usd(0))
  const totalRetailValue = lines.reduce<Money>(
    (sum, line) => addMoney(sum, line.retailValue),
    usd(0),
  )
  const totalUnits = lines.reduce((sum, line) => sum + line.units, 0)

  const blendedMargin =
    totalRetailValue.amountMinor > 0
      ? Math.round(
          ((totalRetailValue.amountMinor - totalSpend.amountMinor) /
            totalRetailValue.amountMinor) *
            100,
        )
      : 0

  return {
    input,
    categories,
    lines,
    totalUnits,
    totalSpend,
    totalRetailValue,
    blendedMargin,
    remainingBudget: usd(Math.max(0, input.budgetMinor - totalSpend.amountMinor)),
    sizeDistribution: sizeDistribution(lines),
    colourDistribution: colourDistribution(lines),
  }
}

/** True when the plan clears the verified $50 order minimum. */
export function planMeetsMinimum(plan: AssortmentPlan): boolean {
  return compareMoney(plan.totalSpend, VERIFIED_ORDER_MINIMUM) >= 0
}
