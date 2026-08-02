/**
 * OWNER-APPROVED MEDIA RESOLUTION.
 *
 * The single place Lucky & Blessed's own photography enters the application. It is
 * deliberately narrow and it fails toward the placeholder.
 *
 * Three rules, all enforced below and all covered by tests:
 *
 *  1. **Only `ownerApproval: 'approved'` and `published: true` assets are returned.** An
 *     asset can be supplied, optimised and manifested and still never render — the withheld
 *     set (a dated sale banner, third-party payment branding, a duplicate, a video) is
 *     exactly that case.
 *  2. **A product only ever receives the photograph mapped to it by hand** in
 *     `scripts/owner-approved-mapping.ts`. Nothing is matched by filename similarity, and
 *     nothing is inferred from a source URL — the live site encodes wholesale cost into its
 *     product slugs (D-00), so a URL-derived mapping would re-import that leak.
 *  3. **Only the local path, dimensions and authored alt text cross into a payload.**
 *     Provenance stays in the manifest.
 *
 * Where there is no approved asset the product keeps its honest photography-pending
 * placeholder. That is the correct outcome, not a fallback to be engineered away.
 */

import type { MediaRef, MediaSource, ProductRecord } from '@/domain/product'
import manifest from './official-media-manifest.json'

type Rendition = { width: number; format: 'avif' | 'webp'; file: string; byteSize: number }

type Placement =
  | { kind: 'product'; productId: string; order: number }
  | { kind: 'editorial'; slot: string }
  | { kind: 'withheld'; reason: string }

type ApprovedAsset = {
  original: string
  slug: string
  styleCode: string | null
  describes: string
  sourceWidth?: number
  sourceHeight?: number
  aspectRatio?: string
  sha256: string
  placement: Placement | 'withheld'
  renditions?: Rendition[]
  needsHigherResolution?: boolean
  published: boolean
  ownerApproval: string
}

const BASE = '/media/catalog/approved'

const ASSETS: ApprovedAsset[] =
  ((manifest as { ownerApproved?: ApprovedAsset[] }).ownerApproved ?? []).filter(
    (asset) => asset.published && asset.ownerApproval === 'approved',
  ) ?? []

function sourcesFor(asset: ApprovedAsset): MediaSource[] {
  const renditions = asset.renditions ?? []
  return (['avif', 'webp'] as const)
    .map((format) => ({
      type: `image/${format}` as MediaSource['type'],
      srcSet: renditions
        .filter((r) => r.format === format)
        .sort((a, b) => a.width - b.width)
        .map((r) => `${BASE}/${r.file} ${r.width}w`)
        .join(', '),
    }))
    .filter((source) => source.srcSet.length > 0)
}

/** The widest WebP is the fallback `src`: universally supported, still well compressed. */
function posterFor(asset: ApprovedAsset): string {
  const webp = (asset.renditions ?? [])
    .filter((r) => r.format === 'webp')
    .sort((a, b) => b.width - a.width)[0]
  return webp ? `${BASE}/${webp.file}` : '/media/fixture-placeholder.svg'
}

function toMediaRef(asset: ApprovedAsset, alt: string): MediaRef {
  return {
    id: `approved-${asset.sha256.slice(0, 12)}`,
    kind: 'image',
    poster: posterFor(asset),
    aspectRatio: asset.aspectRatio ?? '4 / 5',
    alt,
    provenance: 'owner-supplied',
    sources: sourcesFor(asset),
    ...(asset.sourceWidth !== undefined ? { intrinsicWidth: asset.sourceWidth } : {}),
    ...(asset.sourceHeight !== undefined ? { intrinsicHeight: asset.sourceHeight } : {}),
  }
}

function productAssets(productId: string): ApprovedAsset[] {
  return ASSETS.filter(
    (asset) =>
      typeof asset.placement === 'object' &&
      asset.placement.kind === 'product' &&
      asset.placement.productId === productId,
  ).sort((a, b) => {
    const orderA =
      typeof a.placement === 'object' && 'order' in a.placement ? a.placement.order : 0
    const orderB =
      typeof b.placement === 'object' && 'order' in b.placement ? b.placement.order : 0
    return orderA - orderB
  })
}

/**
 * Approved photography for a product, or an empty list.
 *
 * Alt text is composed from the product's own name plus the hand-written description of what
 * the photograph shows — never from a filename, which is not a description.
 */
export function officialMediaForProduct(product: ProductRecord): MediaRef[] {
  return productAssets(product.id).map((asset, index) =>
    toMediaRef(
      asset,
      index === 0
        ? `${product.displayName} — ${asset.describes}`
        : `${product.displayName}, additional view — ${asset.describes}`,
    ),
  )
}

/** Approved editorial imagery for a named slot, or undefined. */
export function officialMediaForSlot(slot: string, alt?: string): MediaRef | undefined {
  const asset = ASSETS.find(
    (candidate) =>
      typeof candidate.placement === 'object' &&
      candidate.placement.kind === 'editorial' &&
      candidate.placement.slot === slot,
  )
  return asset ? toMediaRef(asset, alt ?? asset.describes) : undefined
}

/**
 * Overlays approved photography onto a product record, keeping the placeholder when there is
 * none. Applied in the repository so public and authorised reads resolve media identically —
 * media is content, and content is not gated.
 */
export function withOfficialMedia(product: ProductRecord): ProductRecord {
  const approved = officialMediaForProduct(product)
  return approved.length > 0 ? { ...product, media: approved } : product
}

/** Reported by the progress documentation and by the media-governance tests. */
export function officialMediaStatus(): {
  notice: string
  published: number
  withheld: number
  needingHigherResolution: number
} {
  const all = (manifest as { ownerApproved?: ApprovedAsset[] }).ownerApproved ?? []
  return {
    notice: (manifest as { notice: string }).notice,
    published: all.filter((a) => a.published).length,
    withheld: all.filter((a) => !a.published).length,
    needingHigherResolution: all.filter((a) => a.published && a.needsHigherResolution).length,
  }
}
