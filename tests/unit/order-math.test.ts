import { describe, expect, it } from 'vitest'
import { usd, VERIFIED_ORDER_MINIMUM, VERIFIED_PREPACK_UNITS } from '@/domain/money'
import {
  lineTotal,
  lineUnits,
  minimumMet,
  minimumProgressPercent,
  orderSubtotal,
  orderUnits,
  remainingToMinimum,
} from '@/domain/order'
import type { OrderLine } from '@/domain/order'

function line(overrides: Partial<OrderLine> = {}): OrderLine {
  return {
    id: 'l-1',
    productId: 'p-1',
    productSlug: 'p-1',
    productName: 'Test Style',
    sku: 'LB-TST-ONE',
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
    quantity: 1,
    unitPrice: usd(1200),
    ...overrides,
  }
}

describe('prepack and minimum arithmetic', () => {
  it('counts units as prepack size times pack count', () => {
    expect(lineUnits(line({ quantity: 3 }))).toBe(18)
  })

  it('prices a line by unit, not by pack', () => {
    expect(lineTotal(line({ quantity: 2 })).amountMinor).toBe(12 * 1200)
  })

  it('sums an order across lines', () => {
    const order = { lines: [line({ quantity: 1 }), line({ id: 'l-2', quantity: 2 })] }

    expect(orderUnits(order)).toBe(18)
    expect(orderSubtotal(order).amountMinor).toBe(18 * 1200)
  })

  it('treats the verified $50 minimum as the threshold', () => {
    expect(VERIFIED_ORDER_MINIMUM.amountMinor).toBe(5000)

    const below = { lines: [line({ quantity: 1, unitPrice: usd(700) })] }
    expect(orderSubtotal(below).amountMinor).toBe(4200)
    expect(minimumMet(below)).toBe(false)
    expect(remainingToMinimum(below).amountMinor).toBe(800)

    const above = { lines: [line({ quantity: 1, unitPrice: usd(1200) })] }
    expect(minimumMet(above)).toBe(true)
    expect(remainingToMinimum(above).amountMinor).toBe(0)
  })

  it('clamps minimum progress to 100', () => {
    const empty = { lines: [] }
    expect(minimumProgressPercent(empty)).toBe(0)

    const huge = { lines: [line({ quantity: 50 })] }
    expect(minimumProgressPercent(huge)).toBe(100)
  })

  it('holds the verified prepack size at 6', () => {
    expect(VERIFIED_PREPACK_UNITS).toBe(6)
  })

  it('refuses fractional money', () => {
    expect(() => usd(12.5)).toThrow(TypeError)
  })
})
