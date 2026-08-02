/**
 * OWNER-APPROVED MEDIA OPTIMISER.
 *
 * Reads the untouched originals in `assets/source/owner-approved/`, emits responsive AVIF and
 * WebP derivatives into `public/media/catalog/approved/`, and records every asset — published
 * or withheld — in the official media manifest.
 *
 * Rules this enforces:
 *   - **Originals are never modified.** They are read-only inputs.
 *   - **Never upscale.** A width is emitted only if the source is at least that wide, and
 *     the source's own width is always the ceiling.
 *   - **Filenames come from the mapping, never from a URL or page slug.** The live site
 *     encodes wholesale cost into its product slugs; a name derived from one would import
 *     that leak. Generated names are asserted price-free.
 *   - **Every asset is listed in the mapping or the run fails.** An unmapped file cannot be
 *     silently published, and cannot be silently dropped either.
 *
 * Run: npm run media:optimize
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { APPROVED_ASSETS } from './owner-approved-mapping.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = join(ROOT, 'assets', 'source', 'owner-approved')
const OUTPUT_DIR = join(ROOT, 'public', 'media', 'catalog', 'approved')
const MANIFEST_PATH = join(ROOT, 'src', 'content', 'media', 'official-media-manifest.json')

/** Candidate widths. Only those at or below the source width are emitted. */
const WIDTHS = [360, 480, 640, 960, 1280, 1920]

/** A price pattern in a generated filename would re-import the D-00 leak. */
const PRICE_PATTERN = /\d{1,3}-\d{2}(-|$)/

type Rendition = { width: number; format: 'avif' | 'webp'; file: string; byteSize: number }

async function main(): Promise<void> {
  const originals = (await readdir(SOURCE_DIR)).filter((f) => !f.startsWith('.'))
  const mapped = new Set(APPROVED_ASSETS.map((a) => a.original))

  const unmapped = originals.filter((f) => !mapped.has(f))
  const missing = [...mapped].filter((f) => !originals.includes(f))

  if (unmapped.length > 0 || missing.length > 0) {
    for (const f of unmapped) console.error(`UNMAPPED original, refusing to guess: ${f}`)
    for (const f of missing) console.error(`MAPPED but not present on disk: ${f}`)
    process.exitCode = 1
    return
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  const assets: Record<string, unknown>[] = []
  const withheld: { original: string; reason: string }[] = []

  for (const entry of APPROVED_ASSETS) {
    const sourcePath = join(SOURCE_DIR, entry.original)
    const bytes = await readFile(sourcePath)
    const sha256 = createHash('sha256').update(bytes).digest('hex')

    if (entry.placement.kind === 'withheld') {
      withheld.push({ original: entry.original, reason: entry.placement.reason })
      assets.push({
        original: entry.original,
        slug: entry.slug,
        styleCode: entry.styleCode,
        describes: entry.describes,
        sha256,
        byteSize: bytes.length,
        placement: 'withheld',
        withheldReason: entry.placement.reason,
        published: false,
        ownerApproval: 'approved',
        note: 'OWNER APPROVED — WITHHELD FROM PUBLICATION',
      })
      continue
    }

    if (PRICE_PATTERN.test(entry.slug)) {
      console.error(`Generated slug contains a price pattern, refusing: ${entry.slug}`)
      process.exitCode = 1
      return
    }

    const image = sharp(sourcePath)
    const metadata = await image.metadata()
    const sourceWidth = metadata.width ?? 0
    const sourceHeight = metadata.height ?? 0

    // Never upscale: the source's own width is the ceiling.
    const widths = [...new Set([...WIDTHS.filter((w) => w < sourceWidth), sourceWidth])].sort(
      (a, b) => a - b,
    )

    const renditions: Rendition[] = []
    for (const width of widths) {
      for (const format of ['avif', 'webp'] as const) {
        const file = `${entry.slug}-${width}.${format}`
        const pipeline = sharp(sourcePath).resize({ width, withoutEnlargement: true })
        const buffer =
          format === 'avif'
            ? await pipeline.avif({ quality: 62, effort: 4 }).toBuffer()
            : await pipeline.webp({ quality: 80 }).toBuffer()
        await writeFile(join(OUTPUT_DIR, file), buffer)
        renditions.push({ width, format, file, byteSize: buffer.length })
      }
    }

    assets.push({
      original: entry.original,
      slug: entry.slug,
      styleCode: entry.styleCode,
      describes: entry.describes,
      sourcePath: `assets/source/owner-approved/${entry.original}`,
      provenance: 'owner-provided',
      addedOn: new Date().toISOString().slice(0, 10),
      sourceWidth,
      sourceHeight,
      aspectRatio: `${sourceWidth} / ${sourceHeight}`,
      byteSize: bytes.length,
      sha256,
      placement: entry.placement,
      renditions,
      // 4:5 cards want roughly 660px on the long edge at 2x on a 1440 grid.
      needsHigherResolution: Math.max(sourceWidth, sourceHeight) < 900,
      suitable: true,
      published: true,
      ownerApproval: 'approved',
      note: 'OWNER APPROVED — SUPPLIED BY LUCKY & BLESSED FOR THIS PROJECT',
    })

    const total = renditions.reduce((sum, r) => sum + r.byteSize, 0)
    console.log(
      `${entry.slug.padEnd(42)} ${sourceWidth}x${sourceHeight}  ` +
        `${renditions.length} renditions  ${(total / 1024).toFixed(0)}KB`,
    )
  }

  const previous = existsSync(MANIFEST_PATH)
    ? JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
    : {}

  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        ...previous,
        $schema: 'official-media-manifest/v2',
        notice: 'OWNER APPROVED — SUPPLIED BY LUCKY & BLESSED FOR THIS PROJECT',
        generatedOn: new Date().toISOString().slice(0, 10),
        originalsPreservedAt: 'assets/source/owner-approved/',
        optimisedTo: 'public/media/catalog/approved/',
        ownerApproved: assets,
        withheld,
      },
      null,
      2,
    )}\n`,
  )

  console.log(
    `\n${assets.filter((a) => a.published).length} published, ${withheld.length} withheld.`,
  )
  console.log(`Manifest: ${MANIFEST_PATH}`)
}

await main()
