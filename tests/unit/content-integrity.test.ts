import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PRODUCT_RECORDS } from '@/fixtures/products'
import { VERIFIED_PREPACK_UNITS, VERIFIED_WHOLESALE_BAND_MINOR } from '@/domain/money'
import {
  CATEGORIES,
  findRoutableCategory,
  indexableCategories,
  navigableCategories,
  womensLineCategories,
} from '@/domain/taxonomy'

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
  /*
    THE RULE, REWRITTEN 2026-09-16 BY THE OWNER'S DIRECTION.

    This test used to assert that navigation exposed only the three verified categories
    and that no men's category existed at any status: menswear did not exist and must
    not ship as though it did. The owner has directed the house to present men's-first.
    The fact has not changed — the brand sells women's, girls' and accessories — so the
    rule becomes: a men's category may lead, and every one of them is flagged
    `demonstration`, carries the marker on every surface, and never reaches the sitemap.
    The women's line stays routable, verified, and never flagged.
  */
  it("leads with the men's line, every category of it a demonstration", () => {
    const primary = navigableCategories()
    expect(primary.map((c) => c.slug)).toEqual([
      'mens-denim',
      'mens-shirts',
      'mens-outerwear',
      'mens-accessories',
    ])
    for (const category of primary) {
      expect(category.demonstration, `${category.slug} must be flagged`).toBe(true)
      expect(category.line).toBe('mens')
    }
  })

  it("keeps the verified women's line routable, and never flags it", () => {
    expect(womensLineCategories().map((c) => c.slug)).toEqual(['women', 'girls', 'accessories'])
    for (const category of womensLineCategories()) {
      expect(category.demonstration).toBeUndefined()
      expect(findRoutableCategory(category.slug)).toBeDefined()
    }
  })

  it('lists only the published line as indexable', () => {
    expect(indexableCategories().map((c) => c.slug)).toEqual(['women', 'girls', 'accessories'])
  })

  it('holds Home back pending the owner decision', () => {
    expect(CATEGORIES.find((c) => c.slug === 'home')?.status).toBe('hidden')
    expect(findRoutableCategory('home')).toBeUndefined()
  })

  it('has no footwear category at any status, and no audience gateway', () => {
    // Footwear does not exist and is not proposed; "for him" is the design corpus's
    // audience-gateway label (§6) and is never a category. Exact slugs, not substrings.
    const forbidden = new Set(['for-him', 'footwear', 'shoes', 'boots'])

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

/**
 * WITHDRAWN CAMPAIGN PLATES.
 *
 * Four of the twenty-six published Stitch plates were screens rather than photographs —
 * design boards and a device mockup, with the photograph inset inside tool chrome. They were
 * withdrawn on 2026-08-18; the full account is in `scripts/import-campaign-plates.mjs`.
 *
 * The one that matters is `buckle-denim`: a phone mockup rendering an invented product page
 * for an "Artisan Crafted Silver Buckle" at **€245**, against a verified wholesale band of
 * $7–$33. A fabricated product name and a fabricated price, inside an image the site
 * presents as its own campaign imagery.
 *
 * They were cleared by a review that rendered every candidate as a square with
 * `object-fit: cover`, which centre-crops away the caption bar and the gutters — the exact
 * evidence that a frame is a mockup. That review method is the root cause, and a person
 * repeating it would re-add these four in good faith. This test is what stops that.
 */
describe('withdrawn campaign plates never return', () => {
  const WITHDRAWN = ['tooled-leather', 'buckle-denim', 'pearl-snaps', 'snap-macro'] as const

  it('publishes none of them in the generated plate manifest', async () => {
    const { PLATE_ASSETS } = await import('@/content/media/campaign-plates.generated')
    for (const slug of WITHDRAWN) {
      expect(
        Object.keys(PLATE_ASSETS),
        `${slug} is a design-tool mockup, not a photograph`,
      ).not.toContain(slug)
    }
  })

  it('serves no derivative for them under the public campaign directory', () => {
    const files = readdirSync(join('public', 'media', 'campaign'))
    for (const slug of WITHDRAWN) {
      const leaked = files.filter((file) => file.startsWith(`${slug}-`))
      expect(
        leaked,
        `${slug} derivatives are still fetchable at a stable public URL. Removing a plate ` +
          `from the manifest does not unpublish the bytes — the €245 buckle mockup stayed ` +
          `live on the origin until these were deleted.`,
      ).toEqual([])
    }
  })

  it('references none of them anywhere in shippable source', () => {
    const text = shippableText()
    for (const slug of WITHDRAWN) {
      /*
        Match a PLATE reference, not the bare string. `tooled-leather-concho-belt` is a real
        product slug in the fixtures and has nothing to do with the withdrawn plate; a
        substring test fails on it and would teach the next reader that this assertion cries
        wolf. A plate is only ever referenced as a quoted slug passed to `atmospherePlate`,
        or as a path under the campaign media directory.
      */
      const asPlateSlug = new RegExp(`['"\`]${slug}['"\`]`)
      const asMediaPath = new RegExp(`/media/campaign/${slug}-`)
      expect(asPlateSlug.test(text), `${slug} is still referenced as a plate slug`).toBe(false)
      expect(asMediaPath.test(text), `${slug} is still referenced by media path`).toBe(false)
    }
  })
})
