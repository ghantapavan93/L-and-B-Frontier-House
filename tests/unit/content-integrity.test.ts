import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import { VERIFIED_PREPACK_UNITS, VERIFIED_WHOLESALE_BAND_MINOR } from '@/domain/money'
import { CATEGORIES, navigableCategories, findRoutableCategory } from '@/domain/taxonomy'

/**
 * CONTENT INTEGRITY.
 *
 * Every production claim must be a verified fact, owner-confirmed, clearly-labelled campaign
 * fiction, product-data-backed, or a marked development fixture. These assertions encode the
 * removals that have no alternative branch.
 */

const SOURCE_DIRS = ['src']

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) sourceFiles(path, acc)
    else if (/\.(ts|tsx|css)$/.test(entry.name)) acc.push(path)
  }
  return acc
}

/** Source text with comments stripped — the audit trail cites these terms deliberately. */
function shippableText(): string {
  return SOURCE_DIRS.flatMap((dir) => sourceFiles(dir))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

describe('fabricated claims never ship', () => {
  const text = shippableText()

  it.each([
    ['EST. 1865', /EST\.?\s*1865/i],
    ['an 1870s origin claim', /1870s/i],
    ['Kuroki Mill', /kuroki/i],
    ['Leon & Tuscany tanneries', /leon\s*&\s*tuscany|tannery dispatches/i],
    ['vintage shuttle looms', /shuttle loom/i],
    ['a Frontier House workshop claim', /frontier house workshop/i],
    ['invented people', /pendelton|e\.\s*vance|j\.r\.\s*cash/i],
    ['invented loyalty', /frontier trust|store credit/i],
    ['a made-in claim', /made in texas|manufactured in/i],
    ['Goodyear welt construction', /goodyear welt/i],
    ['AR', /view in space|augmented reality/i],
  ])('contains no %s', (_label, pattern) => {
    expect(text).not.toMatch(pattern)
  })

  it('contains no menswear', () => {
    expect(text).not.toMatch(/\bfor him\b/i)
    expect(text).not.toMatch(/men's collection/i)
    expect(text).not.toMatch(/\bmenswear\b/i)
  })

  it('contains no footwear category or product', () => {
    // Bounded on both sides: "bootcut" is a jean silhouette, not a boot.
    const footwear = /\bboots?\b|\bshoes?\b|\bfootwear\b|\bsneakers?\b|\bbootie/
    for (const product of PRODUCT_RECORDS) {
      expect(product.specName.toLowerCase(), product.slug).not.toMatch(footwear)
      expect(product.displayName.toLowerCase(), product.slug).not.toMatch(footwear)
      expect(product.categorySlug).not.toBe('footwear')
    }
  })

  it('states operational metrics exactly, never rounded up', () => {
    expect(text).toContain('100% order fill rate')
    expect(text).toContain('2.64')
    expect(text).not.toMatch(/over 600 five-star/i)
    expect(text).not.toMatch(/100% fill rate guaranteed/i)
  })
})

describe('fixture data respects verified commercial reality', () => {
  it('keeps every wholesale price inside the verified $7–$33 band', () => {
    for (const product of PRODUCT_RECORDS) {
      const price = product.wholesale.wholesalePrice.amountMinor
      expect(price, `${product.slug} wholesale price`).toBeGreaterThanOrEqual(
        VERIFIED_WHOLESALE_BAND_MINOR.min,
      )
      expect(price, `${product.slug} wholesale price`).toBeLessThanOrEqual(
        VERIFIED_WHOLESALE_BAND_MINOR.max,
      )
    }
  })

  it('keeps every MSRP inside the implied $20–$85 retail band', () => {
    for (const product of PRODUCT_RECORDS) {
      const msrp = product.wholesale.msrp.amountMinor
      expect(msrp, `${product.slug} MSRP`).toBeGreaterThanOrEqual(2000)
      expect(msrp, `${product.slug} MSRP`).toBeLessThanOrEqual(8500)
    }
  })

  it('never carries the design corpus $45–$1,250 fixture set', () => {
    for (const product of PRODUCT_RECORDS) {
      expect(product.wholesale.wholesalePrice.amountMinor).not.toBe(4500)
      expect(product.wholesale.wholesalePrice.amountMinor).not.toBe(85000)
      expect(product.wholesale.wholesalePrice.amountMinor).not.toBe(125000)
    }
  })

  it('holds every prepack at the verified 6 units', () => {
    for (const product of PRODUCT_RECORDS) {
      const { prepack } = product.wholesale
      expect(prepack.totalUnits, `${product.slug} prepack`).toBe(VERIFIED_PREPACK_UNITS)

      if (!prepack.openSizing) {
        const sum = prepack.breakdown.reduce((total, row) => total + row.quantity, 0)
        expect(sum, `${product.slug} breakdown sums to ${sum}`).toBe(prepack.totalUnits)
      }
    }
  })

  it('labels every fixture product and every fixture image', () => {
    for (const product of PRODUCT_RECORDS) {
      expect(product.isFixture, `${product.slug}`).toBe(true)
      for (const media of product.media) {
        expect(media.provenance).toBe('generated-placeholder')
        expect(media.alt.length, `${media.id} alt`).toBeGreaterThan(20)
        expect(media.poster.length).toBeGreaterThan(0)
        expect(media.aspectRatio).toMatch(/\d/)
      }
    }
  })

  it('gives every product a size range and honest per-range availability', () => {
    for (const product of PRODUCT_RECORDS) {
      expect(product.sizeRanges.length, `${product.slug}`).toBeGreaterThan(0)
      for (const range of product.sizeRanges) {
        expect(range.sizes.length).toBeGreaterThan(0)
        expect(range.measurements.length).toBeGreaterThan(0)
        // Extended sizing is never made-to-order by default; that value needs evidence.
        if (range.kind === 'extended') {
          expect(range.availability, `${product.slug} extended range`).toBe('available')
        }
      }
    }
  })

  it('never encodes a price into a slug', () => {
    for (const product of PRODUCT_RECORDS) {
      expect(`/${product.slug}`).not.toMatch(/\/\d{1,3}-\d{2}-[a-z]/)
      expect(product.slug).not.toMatch(/\d+-\d+/)
    }
  })
})

describe('taxonomy', () => {
  it('exposes only verified categories in navigation', () => {
    expect(navigableCategories().map((c) => c.slug)).toEqual(['women', 'girls', 'accessories'])
  })

  it('holds Home back pending the owner decision', () => {
    expect(CATEGORIES.find((c) => c.slug === 'home')?.status).toBe('hidden')
    expect(findRoutableCategory('home')).toBeUndefined()
  })

  it('has no menswear or footwear category at any status', () => {
    // "women" legitimately contains "men", so this is an exact-slug denylist rather than a
    // substring match.
    const forbidden = new Set([
      'men',
      'mens',
      'menswear',
      'for-him',
      'footwear',
      'shoes',
      'boots',
    ])

    for (const category of CATEGORIES) {
      expect(forbidden.has(category.slug), `category ${category.slug}`).toBe(false)
    }
  })

  it('treats extended sizing as a range, never as a category', () => {
    for (const category of CATEGORIES) {
      expect(category.slug).not.toBe('plus')
      expect(category.label.toLowerCase()).not.toBe('plus')
    }

    // And it exists as a real, filterable range on real products.
    const withExtended = PRODUCT_RECORDS.filter((p) =>
      p.sizeRanges.some((r) => r.kind === 'extended'),
    )
    expect(withExtended.length).toBeGreaterThan(0)
  })

  it('places every product in a category the taxonomy knows', () => {
    const slugs = new Set(CATEGORIES.map((c) => c.slug))
    for (const product of PRODUCT_RECORDS) {
      expect(slugs.has(product.categorySlug), `${product.slug}`).toBe(true)
    }
  })
})
