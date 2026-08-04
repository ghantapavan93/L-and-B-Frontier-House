import { describe, expect, it } from 'vitest'
import { usd } from '@/domain/money'
import {
  buildAssortment,
  MIXES,
  planMeetsMinimum,
  PRICE_BANDS,
  STORE_SIZES,
} from '@/domain/assortment'
import type { AssortmentInput } from '@/domain/assortment'
import type { AuthorisedProduct } from '@/domain/product'

/**
 * The planner's contract is that it is ARITHMETIC, not advice. These assert the arithmetic
 * exactly, and assert the boundaries it must not cross — no waitlisted style, no style
 * outside the stated band, no pre-order that lands after the launch month, and never more
 * spend than the buyer gave it.
 */

function product(overrides: Partial<AuthorisedProduct> = {}): AuthorisedProduct {
  const base: AuthorisedProduct = {
    id: 'p-1',
    slug: 'test-style',
    displayName: 'Test Style',
    specName: 'Test Style Spec',
    categorySlug: 'women',
    description: 'A test style.',
    attributes: { colour: [{ name: 'Indigo' }] },
    media: [],
    sizeRanges: [],
    availability: 'in-stock',
    isFixture: true,
    access: 'authorised',
    wholesale: {
      sku: 'LB-TST-1',
      wholesalePrice: usd(2000),
      msrp: usd(5000),
      moq: 6,
      prepack: {
        totalUnits: 6,
        breakdown: [
          { size: 'S', quantity: 1 },
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 2 },
          { size: 'XL', quantity: 1 },
        ],
        openSizing: false,
      },
      packPrice: usd(12000),
      stockBySize: [],
      terms: 'Net 30',
    },
  }
  return { ...base, ...overrides }
}

/** Distinct styles that all pass the default filters. */
function catalogue(count: number, categorySlug = 'women'): AuthorisedProduct[] {
  return Array.from({ length: count }, (_, i) =>
    product({
      id: `p-${i}`,
      slug: `style-${i}`,
      displayName: `Style ${i}`,
      categorySlug,
      newArrivalOn: `2026-08-${String(i + 1).padStart(2, '0')}`,
    }),
  )
}

const input = (overrides: Partial<AssortmentInput> = {}): AssortmentInput => ({
  budgetMinor: 500_000,
  storeSize: 'boutique',
  mix: 'womens-only',
  band: 'all',
  ...overrides,
})

describe('assortment arithmetic', () => {
  it('spends units at the wholesale price, in whole prepacks', () => {
    const plan = buildAssortment(catalogue(1), input())
    const line = plan.lines[0]

    expect(line).toBeDefined()
    // 1 pack × 6 units × $20.00
    expect(line?.units).toBe(6)
    expect(line?.spend.amountMinor).toBe(12_000)
    expect(line?.retailValue.amountMinor).toBe(30_000)
  })

  it('buys the depth its store size states when the budget allows', () => {
    // 20 styles × 3 packs × 6 units × $20.00 = $7,200.
    const plan = buildAssortment(
      catalogue(20),
      input({ storeSize: 'multi-door', budgetMinor: 800_000 }),
    )

    expect(plan.lines).toHaveLength(STORE_SIZES['multi-door'].styles)
    for (const line of plan.lines) {
      expect(line.packs).toBe(STORE_SIZES['multi-door'].packsPerStyle)
    }
  })

  it('degrades depth one pack at a time rather than collapsing to a single pack', () => {
    // Room for eleven styles at full depth and part of a twelfth: 11 × $360 = $3,960 of
    // $4,000, leaving $40 — under one pack, so the twelfth style is skipped entirely.
    const plan = buildAssortment(
      catalogue(20),
      input({ storeSize: 'multi-door', budgetMinor: 400_000 }),
    )

    expect(plan.totalSpend.amountMinor).toBeLessThanOrEqual(400_000)
    // Nothing sits at a depth the budget could have improved on.
    for (const line of plan.lines) {
      expect(line.packs).toBeGreaterThanOrEqual(1)
      expect(line.packs).toBeLessThanOrEqual(STORE_SIZES['multi-door'].packsPerStyle)
    }

    // A budget that admits exactly two packs of one style buys two, never one.
    const tight = buildAssortment(
      catalogue(1),
      input({ storeSize: 'multi-door', budgetMinor: 30_000 }),
    )
    expect(tight.lines[0]?.packs).toBe(2)
  })

  it('never plans more styles than the store size targets', () => {
    const plan = buildAssortment(catalogue(50), input({ storeSize: 'boutique' }))
    expect(plan.lines.length).toBeLessThanOrEqual(STORE_SIZES.boutique.styles)
  })

  it('never spends more than the budget', () => {
    const plan = buildAssortment(catalogue(50), input({ budgetMinor: 30_000 }))

    expect(plan.totalSpend.amountMinor).toBeLessThanOrEqual(30_000)
    expect(plan.remainingBudget.amountMinor).toBe(30_000 - plan.totalSpend.amountMinor)
  })

  it('falls back to a single pack when the target depth does not fit', () => {
    // Two packs of one style is $240; the budget admits one pack only.
    const plan = buildAssortment(
      catalogue(1),
      input({ storeSize: 'established', budgetMinor: 15_000 }),
    )

    expect(plan.lines).toHaveLength(1)
    expect(plan.lines[0]?.packs).toBe(1)
  })

  it('skips a style entirely when not even one pack fits', () => {
    // One pack is $120; $100 buys nothing at all.
    const plan = buildAssortment(catalogue(3), input({ budgetMinor: 10_000 }))

    expect(plan.lines).toHaveLength(0)
    expect(plan.categories[0]?.skippedForBudget).toBe(3)
  })

  it('computes blended margin from retail against spend', () => {
    const plan = buildAssortment(catalogue(1), input())
    // ($300.00 − $120.00) / $300.00 = 60%
    expect(plan.blendedMargin).toBe(60)
  })

  it('reports an empty plan rather than throwing when nothing qualifies', () => {
    const plan = buildAssortment([], input())

    expect(plan.lines).toHaveLength(0)
    expect(plan.totalSpend.amountMinor).toBe(0)
    expect(plan.blendedMargin).toBe(0)
    expect(planMeetsMinimum(plan)).toBe(false)
  })
})

describe('what the planner refuses to buy', () => {
  it('excludes a style with no allocation', () => {
    const products = [
      product({ id: 'ok', slug: 'ok', availability: 'in-stock' }),
      product({ id: 'waitlisted', slug: 'waitlisted', availability: 'waitlist' }),
      product({ id: 'gone', slug: 'gone', availability: 'discontinued' }),
    ]
    const plan = buildAssortment(products, input())

    expect(plan.lines.map((l) => l.product.id)).toEqual(['ok'])
  })

  it('excludes a style outside the stated price band', () => {
    const products = [
      product({
        id: 'cheap',
        slug: 'cheap',
        wholesale: { ...product().wholesale, wholesalePrice: usd(900) },
      }),
      product({
        id: 'dear',
        slug: 'dear',
        wholesale: { ...product().wholesale, wholesalePrice: usd(3200) },
      }),
    ]
    const plan = buildAssortment(products, input({ band: 'entry' }))

    expect(plan.lines.map((l) => l.product.id)).toEqual(['cheap'])
    expect(PRICE_BANDS.entry.maxMinor).toBeLessThan(3200)
  })

  it('excludes a pre-order whose ship window opens after the launch month', () => {
    const late = product({
      id: 'late',
      slug: 'late',
      availability: 'pre-order',
      preOrder: {
        shipWindowStart: '2026-11-01',
        shipWindowEnd: '2026-11-30',
        terms: 'Allocation confirmed at production.',
      },
    })
    const ready = product({ id: 'ready', slug: 'ready' })

    const plan = buildAssortment([late, ready], input({ launchMonth: '2026-09' }))
    expect(plan.lines.map((l) => l.product.id)).toEqual(['ready'])

    // With no launch month stated, the pre-order is back in play.
    const unconstrained = buildAssortment([late, ready], input())
    expect(unconstrained.lines.map((l) => l.product.id)).toContain('late')
  })
})

describe('mix and distribution', () => {
  it('splits the budget across the categories its mix names', () => {
    const products = [...catalogue(10, 'women'), ...catalogue(10, 'girls')]
    const plan = buildAssortment(products, input({ mix: 'balanced' }))

    const women = plan.categories.find((c) => c.categorySlug === 'women')
    const girls = plan.categories.find((c) => c.categorySlug === 'girls')

    expect(women?.share).toBe(MIXES.balanced.shares.get('women'))
    expect(women?.budget.amountMinor).toBe(300_000)
    expect(girls?.budget.amountMinor).toBe(100_000)
    expect(women?.spend.amountMinor).toBeLessThanOrEqual(300_000)
    expect(girls?.spend.amountMinor).toBeLessThanOrEqual(100_000)
  })

  it('reports a category that its filters emptied, so the gap is legible', () => {
    // Nothing in girls at all, so the shortfall is the filter and not the budget.
    const plan = buildAssortment(catalogue(10, 'women'), input({ mix: 'balanced' }))
    const girls = plan.categories.find((c) => c.categorySlug === 'girls')

    expect(girls?.eligible).toBe(0)
    expect(girls?.lines).toHaveLength(0)
  })

  it('sums the size distribution to exactly the plan unit count', () => {
    const plan = buildAssortment(catalogue(6), input({ storeSize: 'established' }))
    const distributed = plan.sizeDistribution.reduce((sum, row) => sum + row.units, 0)

    expect(distributed).toBe(plan.totalUnits)
  })

  it('attributes open-sizing units rather than dropping them', () => {
    const open = product({
      id: 'open',
      slug: 'open',
      wholesale: {
        ...product().wholesale,
        prepack: { totalUnits: 6, breakdown: [], openSizing: true },
      },
    })
    const plan = buildAssortment([open], input())

    expect(plan.sizeDistribution).toEqual([{ size: 'Selected at checkout', units: 6 }])
  })

  it('is deterministic — the same inputs produce the same rack', () => {
    const products = catalogue(20)
    const a = buildAssortment(products, input({ storeSize: 'established' }))
    const b = buildAssortment(products, input({ storeSize: 'established' }))

    expect(a.lines.map((l) => l.product.id)).toEqual(b.lines.map((l) => l.product.id))
  })
})
