/**
 * FRONTIER CAMPAIGN PLATES — import, crop, encode, manifest.
 *
 * Source: four generated campaign renders the owner supplied on 2026-08-13 (ChatGPT
 * images, dropped in Downloads). They are GENERATED ARTWORK, never photography, and every
 * surface that renders them says so. Provenance: `generated-campaign`.
 *
 * Two integrity excisions happen HERE, at import, so the offending pixels never reach
 * `public/` at all:
 *
 *   1. `ranch-road` is cropped to remove "FRONTIER HOUSE EST. 2024" — a fabricated
 *      founding date baked into the artwork (the brand's verifiable record begins on
 *      FashionGo in 2015; CLAUDE.md §13b bars invented heritage outright) — and the
 *      painted "SHOP NOW" button, which is a control that controls nothing.
 *   2. The "Built For More" collage ships ONLY as its three right-hand tiles. The left
 *      panel bakes a fake button, and the bottom strip claims "TRUSTED BY GENERATIONS" —
 *      an invented heritage claim for an eleven-year-old business. Neither is publishable
 *      under any label.
 *
 * Idempotent: re-running overwrites outputs. Never upscales — widths above the source
 * are skipped.
 */
import { createHash } from 'node:crypto'
import { cp, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'assets', 'source', 'frontier-campaign')
const OUT_DIR = path.join(ROOT, 'public', 'media', 'frontier')
const MANIFEST_TS = path.join(ROOT, 'src', 'fixtures', 'frontier-plates.generated.ts')

/** Downloads → stable names inside the repo. Mirrored before anything else happens. */
const DOWNLOADS = 'C:/Users/Pavan Kalyan/Downloads'
const MIRROR = [
  ['ChatGPT Image Aug 13, 2026, 05_55_26 PM.png', 'frontier-corral-wide.png'],
  ['ChatGPT Image Aug 13, 2026, 05_54_58 PM.png', 'frontier-storefront.png'],
  ['ChatGPT Image Aug 13, 2026, 05_55_11 PM.png', 'frontier-ranch-road-full.png'],
  ['ChatGPT Image Aug 13, 2026, 05_55_19 PM.png', 'frontier-built-collage-full.png'],
  ['ChatGPT Image Aug 13, 2026, 06_43_58 PM.png', 'frontier-campaign-backdrop.png'],
]

/**
 * What gets published. `extract` crops in source pixels; absence means the full frame.
 * Crop boundaries were verified against debug renders before being committed here.
 */
const PLATES = [
  {
    key: 'corral-wide',
    source: 'frontier-corral-wide.png',
    widths: [640, 960, 1440, 1672],
    note: 'Full frame. Baked type is the campaign title itself.',
  },
  {
    key: 'storefront',
    source: 'frontier-storefront.png',
    widths: [480, 720, 1122],
    note: 'Full frame. Baked "Discover the drop." reads as campaign copy; the wrapping link is the real control.',
  },
  {
    key: 'ranch-road',
    source: 'frontier-ranch-road-full.png',
    extract: { left: 0, top: 0, width: 960, height: 828 },
    widths: [480, 720, 960],
    note: 'Cropped to excise "EST. 2024" (fabricated founding date) and the painted SHOP NOW control.',
  },
  {
    key: 'craft-detail',
    source: 'frontier-built-collage-full.png',
    extract: { left: 975, top: 10, width: 550, height: 310 },
    widths: [480, 550],
    note: 'Right-column tile. The fake button panel and "TRUSTED BY GENERATIONS" strip are excluded at import.',
  },
  {
    key: 'heritage-truck',
    source: 'frontier-built-collage-full.png',
    extract: { left: 975, top: 342, width: 550, height: 282 },
    widths: [480, 550],
    note: 'Right-column tile, same exclusions.',
  },
  {
    key: 'campaign-backdrop',
    source: 'frontier-campaign-backdrop.png',
    widths: [768, 1280, 1672],
    note: 'Full frame. The campaign stage backdrop behind the Fall 2026 film.',
  },
  {
    key: 'legacy-boots',
    source: 'frontier-built-collage-full.png',
    extract: { left: 975, top: 636, width: 550, height: 262 },
    widths: [480, 550],
    note: 'Right-column tile, same exclusions. Ends above the badge strip.',
  },
]

await mkdir(SOURCE_DIR, { recursive: true })
await mkdir(OUT_DIR, { recursive: true })

for (const [from, to] of MIRROR) {
  await cp(path.join(DOWNLOADS, from), path.join(SOURCE_DIR, to))
}
console.log(`mirrored ${MIRROR.length} sources into assets/source/frontier-campaign/`)

const entries = []
const manifestPlates = []

for (const plate of PLATES) {
  const input = path.join(SOURCE_DIR, plate.source)
  const base = plate.extract ? sharp(input).extract(plate.extract) : sharp(input)
  const meta = await base.clone().metadata()
  const sourceWidth = plate.extract ? plate.extract.width : meta.width
  const sourceHeight = plate.extract ? plate.extract.height : meta.height

  /* Never upscale: publish only widths the source actually has. */
  const widths = plate.widths.filter((w) => w <= sourceWidth)
  const avif = []
  const webp = []
  let poster = ''
  let posterWidth = 0

  for (const width of widths) {
    const height = Math.round((sourceHeight / sourceWidth) * width)
    const stem = `${plate.key}-${width}`
    await base
      .clone()
      .resize(width)
      .avif({ quality: 60 })
      .toFile(path.join(OUT_DIR, `${stem}.avif`))
    await base
      .clone()
      .resize(width)
      .webp({ quality: 78 })
      .toFile(path.join(OUT_DIR, `${stem}.webp`))
    avif.push(`/media/frontier/${stem}.avif ${width}w`)
    webp.push(`/media/frontier/${stem}.webp ${width}w`)
    if (width >= posterWidth) {
      poster = `/media/frontier/${stem}.webp`
      posterWidth = width
    }
    void height
  }

  entries.push(
    `  '${plate.key}': {\n` +
      `    poster: '${poster}',\n` +
      `    avifSrcSet: '${avif.join(', ')}',\n` +
      `    webpSrcSet: '${webp.join(', ')}',\n` +
      `    intrinsicWidth: ${sourceWidth},\n` +
      `    intrinsicHeight: ${sourceHeight},\n` +
      `  },`,
  )
  manifestPlates.push({
    key: plate.key,
    source: `assets/source/frontier-campaign/${plate.source}`,
    provenance: 'generated-campaign',
    supplied: '2026-08-13, owner drop (generated renders)',
    extract: plate.extract ?? null,
    note: plate.note,
  })
  console.log(`${plate.key}: ${widths.length} widths from ${sourceWidth}x${sourceHeight}`)
}

const hash = createHash('sha256').update(JSON.stringify(manifestPlates)).digest('hex')

await writeFile(
  path.join(OUT_DIR, 'manifest.json'),
  JSON.stringify(
    {
      generatedBy: 'scripts/import-frontier-plates.mjs',
      provenance:
        'generated-campaign: owner-supplied generated renders. Artwork, never photography, never product truth. Excisions: fabricated founding date (EST. 2024) cropped out; "TRUSTED BY GENERATIONS" strip and painted UI controls excluded entirely.',
      contentHash: hash,
      plates: manifestPlates,
    },
    null,
    2,
  ) + '\n',
)

await writeFile(
  MANIFEST_TS,
  `/**\n` +
    ` * GENERATED by scripts/import-frontier-plates.mjs — do not edit by hand.\n` +
    ` *\n` +
    ` * Generated campaign artwork (provenance: generated-campaign), owner-supplied\n` +
    ` * 2026-08-13. Artwork, never photography. The fabricated "EST. 2024" date and the\n` +
    ` * "TRUSTED BY GENERATIONS" strip were excised at import and exist in no output.\n` +
    ` * Full provenance: public/media/frontier/manifest.json\n` +
    ` */\n\n` +
    `import type { MensDemoAsset } from './mens-demo-media.generated'\n\n` +
    `export const FRONTIER_PLATE_MEDIA: Record<string, MensDemoAsset> = {\n` +
    entries.join('\n') +
    `\n}\n`,
)

console.log('wrote manifest.json and frontier-plates.generated.ts')
