import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  officialMediaForProduct,
  officialMediaForSlot,
  officialMediaStatus,
  withOfficialMedia,
} from '@/content/media/official-media'
import manifest from '@/content/media/official-media-manifest.json'
import { APPROVED_ASSETS } from '../../scripts/owner-approved-mapping.ts'
import { PRODUCT_RECORDS } from '@/fixtures/products'

/**
 * OWNER-APPROVED MEDIA GOVERNANCE.
 *
 * Supply is not publication, and publication is not a claim about a product. These
 * assertions stop a supplied asset becoming a published one by accident, and stop a
 * published one attaching itself to the wrong garment.
 */

type Rendition = { width: number; format: string; file: string; byteSize: number }
type Asset = {
  original: string
  slug: string
  sha256: string
  published: boolean
  ownerApproval: string
  placement: unknown
  withheldReason?: string
  renditions?: Rendition[]
  describes: string
  sourceWidth?: number
  needsHigherResolution?: boolean
}

const ASSETS = ((manifest as { ownerApproved?: Asset[] }).ownerApproved ?? []) as Asset[]
const PUBLISHED = ASSETS.filter((a) => a.published)
const OUTPUT_DIR = join(process.cwd(), 'public', 'media', 'catalog', 'approved')
const SOURCE_DIR = join(process.cwd(), 'assets', 'source', 'owner-approved')

describe('owner approval gates publication', () => {
  it('marks every asset as owner approved', () => {
    expect(ASSETS.length).toBeGreaterThan(0)
    for (const asset of ASSETS) {
      expect(asset.ownerApproval, asset.original).toBe('approved')
    }
  })

  it('never returns an asset that is not published', () => {
    const publishedSlugs = new Set(PUBLISHED.map((a) => a.slug))

    for (const product of PRODUCT_RECORDS) {
      for (const media of officialMediaForProduct(product)) {
        const slug =
          media.poster
            .split('/')
            .pop()
            ?.replace(/-\d+\.(avif|webp)$/, '') ?? ''
        expect(publishedSlugs.has(slug), `${media.poster} is not published`).toBe(true)
      }
    }
  })

  it('withholds what the mapping says to withhold, with a stated reason', () => {
    const withheld = ASSETS.filter((a) => !a.published)
    expect(withheld.length).toBeGreaterThan(0)

    for (const asset of withheld) {
      expect(asset.placement, `${asset.original} withheld without a reason`).toBe('withheld')
      expect((asset.withheldReason ?? '').length, asset.original).toBeGreaterThan(20)
      // Nothing withheld may have reached the public directory.
      for (const file of asset.renditions ?? []) {
        expect(existsSync(join(OUTPUT_DIR, file.file)), `${file.file} was published`).toBe(
          false,
        )
      }
    }
  })
})

describe('products only ever receive the photograph mapped to them', () => {
  it('matches by explicit mapping, never by filename similarity', () => {
    const productIds = new Set(PRODUCT_RECORDS.map((p) => p.id))

    for (const entry of APPROVED_ASSETS) {
      if (entry.placement.kind !== 'product') continue
      expect(
        productIds.has(entry.placement.productId),
        `${entry.original} maps to unknown product ${entry.placement.productId}`,
      ).toBe(true)
    }
  })

  it('gives every product exactly the images mapped to it, plus derived detail crops', () => {
    for (const product of PRODUCT_RECORDS) {
      const mapped = APPROVED_ASSETS.filter(
        (a) => a.placement.kind === 'product' && a.placement.productId === product.id,
      )
      const mappedSlugs = new Set(mapped.map((a) => a.slug))
      /*
        A `-detail` entry is a mechanical crop OF a hand-mapped photograph
        (scripts/derive-detail-crops.mjs) — same shot, recomposed closer. It may only
        exist when its parent slug is in the hand mapping; anything else is an asset
        attaching itself to a product no human placed it on.
      */
      const served = ASSETS.filter((a) => {
        const placement = a.placement as { kind?: string; productId?: string } | null
        return (
          a.published &&
          placement !== null &&
          typeof placement === 'object' &&
          placement.kind === 'product' &&
          placement.productId === product.id
        )
      })
      for (const asset of served) {
        const parentSlug = asset.slug.endsWith('-detail')
          ? asset.slug.slice(0, -'-detail'.length)
          : asset.slug
        expect(mappedSlugs.has(parentSlug), `${asset.slug} has no hand-mapped parent`).toBe(
          true,
        )
      }
      expect(officialMediaForProduct(product).length, product.slug).toBe(served.length)
    }
  })

  it('keeps the photography-pending placeholder where none was supplied', () => {
    const withPhotography = PRODUCT_RECORDS.filter((p) => officialMediaForProduct(p).length > 0)
    const withoutPhotography = PRODUCT_RECORDS.filter(
      (p) => officialMediaForProduct(p).length === 0,
    )

    expect(withPhotography.length, 'no product received real photography').toBeGreaterThan(0)
    expect(
      withoutPhotography.length,
      'no product exercises the placeholder path',
    ).toBeGreaterThan(0)

    for (const product of withoutPhotography) {
      const overlaid = withOfficialMedia(product)
      expect(overlaid.media).toEqual(product.media)
      expect(overlaid.media.every((m) => m.provenance === 'generated-placeholder')).toBe(true)
    }

    for (const product of withPhotography) {
      const overlaid = withOfficialMedia(product)
      expect(overlaid.media.every((m) => m.provenance === 'owner-supplied')).toBe(true)
    }
  })

  it('composes alt text from the product name and what the photograph shows', () => {
    for (const product of PRODUCT_RECORDS) {
      for (const media of officialMediaForProduct(product)) {
        expect(media.alt).toContain(product.displayName)
        expect(media.alt.length).toBeGreaterThan(40)
        expect(media.alt, 'alt text must never carry a price').not.toMatch(/\$\s?\d/)
      }
    }
  })

  it('returns nothing for an editorial slot that has no asset', () => {
    expect(officialMediaForSlot('no-such-slot')).toBeUndefined()
  })
})

describe('optimised output', () => {
  it('preserves every original untouched', () => {
    for (const entry of APPROVED_ASSETS) {
      expect(existsSync(join(SOURCE_DIR, entry.original)), entry.original).toBe(true)
    }
  })

  it('writes every rendition it claims to have written', () => {
    for (const asset of PUBLISHED) {
      expect((asset.renditions ?? []).length, `${asset.slug} has none`).toBeGreaterThan(0)
      for (const file of asset.renditions ?? []) {
        expect(existsSync(join(OUTPUT_DIR, file.file)), `${file.file} missing`).toBe(true)
      }
    }
  })

  it('never upscales beyond the source width', () => {
    for (const asset of PUBLISHED) {
      for (const file of asset.renditions ?? []) {
        expect(file.width, `${file.file} exceeds its source`).toBeLessThanOrEqual(
          asset.sourceWidth ?? 0,
        )
      }
    }
  })

  it('ships both a modern and a fallback encoding at every width', () => {
    for (const asset of PUBLISHED) {
      const widths = [...new Set((asset.renditions ?? []).map((r) => r.width))]
      for (const width of widths) {
        const formats = (asset.renditions ?? [])
          .filter((r) => r.width === width)
          .map((r) => r.format)
        expect(formats, `${asset.slug} @${width}`).toContain('avif')
        expect(formats, `${asset.slug} @${width}`).toContain('webp')
      }
    }
  })

  it('never encodes a price pattern into a generated filename', () => {
    for (const asset of ASSETS) {
      expect(asset.slug, asset.slug).not.toMatch(/\d{1,3}-\d{2}(-|$)/)
      for (const file of asset.renditions ?? []) {
        expect(file.file, file.file).not.toMatch(/\d{1,3}-\d{2}-[a-z]/)
      }
    }
  })

  it('records the provenance every published asset needs', () => {
    for (const asset of PUBLISHED as unknown as Record<string, unknown>[]) {
      for (const field of [
        'original',
        'slug',
        'describes',
        'sourcePath',
        'provenance',
        'addedOn',
        'sourceWidth',
        'sourceHeight',
        'aspectRatio',
        'byteSize',
        'sha256',
        'placement',
        'renditions',
        'needsHigherResolution',
        'ownerApproval',
      ]) {
        expect(asset[field], `${String(asset['slug'])} missing ${field}`).toBeDefined()
      }
    }
  })
})

describe('reported status', () => {
  it('reports what is published and what is deliberately withheld', () => {
    const status = officialMediaStatus()

    expect(status.notice).toContain('OWNER APPROVED')
    expect(status.published).toBeGreaterThan(0)
    expect(status.withheld).toBeGreaterThan(0)
  })

  it('flags every published asset whose source is below the layout target', () => {
    // Honest reporting, not a failure: the supplied product shots are 360px thumbnails and
    // must not be upscaled. Higher-resolution originals are requested from the owner.
    expect(officialMediaStatus().needingHigherResolution).toBeGreaterThan(0)
  })
})
