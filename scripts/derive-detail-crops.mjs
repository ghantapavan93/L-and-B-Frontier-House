/**
 * DETAIL CROPS — a second, honest frame for every product from its own photograph.
 *
 * The reference PDPs all carry a close-range frame; this catalogue has one photograph per
 * style. A crop of that same photograph at native pixels is the one second angle that
 * invents nothing: same garment, same shot, recomposed closer on the fabric. Each crop is
 * appended to the official-media manifest as a `product` placement at order 2 — so the
 * card hover swap and the PDP gallery light up everywhere — with provenance inherited from
 * its parent and `describes` naming it a crop.
 *
 * Idempotent: existing `-detail` entries are skipped. Never upscales.
 * Run: node scripts/derive-detail-crops.mjs
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SOURCE_DIR = join(ROOT, 'assets', 'source', 'owner-approved')
const OUTPUT_DIR = join(ROOT, 'public', 'media', 'catalog', 'approved')
const MANIFEST = join(ROOT, 'src', 'content', 'media', 'official-media-manifest.json')

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const assets = manifest.ownerApproved ?? []
const existing = new Set(assets.map((a) => a.slug))

const parents = assets.filter(
  (a) =>
    a.published &&
    a.ownerApproval === 'approved' &&
    typeof a.placement === 'object' &&
    a.placement.kind === 'product' &&
    !a.slug.endsWith('-detail'),
)

let added = 0

for (const parent of parents) {
  const slug = `${parent.slug}-detail`
  if (existing.has(slug)) continue

  const sourceFile = join(SOURCE_DIR, parent.original)
  let meta
  try {
    meta = await sharp(sourceFile).metadata()
  } catch {
    console.log('skip (unreadable source):', parent.original)
    continue
  }
  const { width, height } = meta
  // Portrait product shots only — a landscape lineup is not a garment to crop into.
  if (!width || !height || height <= width) {
    console.log('skip (not portrait):', parent.slug)
    continue
  }

  // Full-width square, anchored at the torso: the print, stitch and hardware zone.
  const cropSize = width
  const top = Math.min(Math.round(height * 0.18), height - cropSize)

  const widths = [...new Set([Math.min(480, cropSize), cropSize])].sort((a, b) => a - b)
  const renditions = []
  for (const w of widths) {
    for (const format of ['avif', 'webp']) {
      const file = `${slug}-${w}.${format}`
      await sharp(sourceFile)
        .extract({ left: 0, top, width: cropSize, height: cropSize })
        .resize(w)
        [format]({ quality: format === 'avif' ? 55 : 80 })
        .toFile(join(OUTPUT_DIR, file))
      renditions.push({
        width: w,
        format,
        file,
        byteSize: statSync(join(OUTPUT_DIR, file)).size,
      })
    }
  }

  const largestWebp = renditions
    .filter((r) => r.format === 'webp')
    .sort((a, b) => b.width - a.width)[0]
  const sha256 = createHash('sha256')
    .update(readFileSync(join(OUTPUT_DIR, largestWebp.file)))
    .digest('hex')

  assets.push({
    ...parent,
    original: parent.original,
    slug,
    describes: `a close crop of the same photograph — fabric, print and hardware`,
    sourceWidth: cropSize,
    sourceHeight: cropSize,
    aspectRatio: '1 / 1',
    byteSize: largestWebp.byteSize,
    sha256,
    addedOn: '2026-08-08',
    placement: { kind: 'product', productId: parent.placement.productId, order: 2 },
    renditions,
    published: true,
  })
  added += 1
  console.log('derived', slug, `${cropSize}x${cropSize}`)
}

manifest.ownerApproved = assets
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`manifest updated: ${added} detail crops added`)
