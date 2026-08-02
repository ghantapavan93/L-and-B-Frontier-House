import { describe, expect, it } from 'vitest'
import { publicProduct, visibleProduct } from '@/auth/authorize'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import type { Session } from '@/domain/session'

/**
 * THE AUTHORISATION SEAM.
 *
 * The property under test is absence, not concealment: an unauthorised caller receives an
 * object on which `wholesale` is not a key at all.
 */

const record = PRODUCT_RECORDS[0]!

const SESSIONS: readonly { name: string; session: Session }[] = [
  { name: 'anonymous', session: { kind: 'anonymous' } },
  { name: 'expired', session: { kind: 'expired' } },
  { name: 'pending buyer', session: { kind: 'buyer', buyerId: 'b', status: 'pending' } },
  { name: 'rejected buyer', session: { kind: 'buyer', buyerId: 'b', status: 'rejected' } },
  { name: 'suspended buyer', session: { kind: 'buyer', buyerId: 'b', status: 'suspended' } },
  { name: 'owner', session: { kind: 'owner', userId: 'o' } },
]

describe('visibleProduct', () => {
  it.each(SESSIONS)('omits wholesale entirely for $name', ({ session }) => {
    const result = visibleProduct(record, session)

    expect(result.access).toBe('public')
    expect('wholesale' in result).toBe(false)
    expect(Object.keys(result)).not.toContain('wholesale')
    expect(JSON.stringify(result)).not.toContain(record.wholesale.sku)
  })

  it('includes wholesale only for an approved buyer', () => {
    const result = visibleProduct(record, {
      kind: 'buyer',
      buyerId: 'b-approved',
      status: 'approved',
    })

    expect(result.access).toBe('authorised')
    expect('wholesale' in result).toBe(true)
  })

  it('never serialises a restricted value in the public shape', () => {
    const serialised = JSON.stringify(publicProduct(record))

    expect(serialised).not.toContain('wholesalePrice')
    expect(serialised).not.toContain('msrp')
    expect(serialised).not.toContain('packPrice')
    expect(serialised).not.toContain('stockBySize')
    expect(serialised).not.toContain(String(record.wholesale.wholesalePrice.amountMinor))
  })

  it('keeps every public field intact', () => {
    const result = publicProduct(record)

    expect(result.displayName).toBe(record.displayName)
    expect(result.specName).toBe(record.specName)
    expect(result.description).toBe(record.description)
    expect(result.sizeRanges).toEqual(record.sizeRanges)
    expect(result.availability).toBe(record.availability)
  })
})
