/**
 * CAMPAIGN PLATE IMPORT — the curated atmosphere set from the 112-plate Stitch mirror.
 *
 * Every plate below was reviewed by eye against §12 before inclusion: MATERIAL, HARDWARE,
 * PLACE or MAKING only. No generated person presented as a person, no garment presented as
 * product, no menswear, no footwear-as-merchandise, no mockup chrome. Provenance stays
 * `generated-campaign` at the point of use, and every rendering carries a campaign caption.
 *
 * ── HOW THAT REVIEW FAILED, 2026-08-18 ────────────────────────────────────────────────
 *
 * Four of the twenty-six were not photographs at all. They were SCREENS — design-board and
 * device mockups from the Stitch renderer, with the photograph inset inside tool chrome:
 *
 *   tooled-leather   a board captioned "V3.1 Frame 8: The Belt Buckle Aperture"
 *   pearl-snaps      a board captioned "Garment Portal and Product Anatomy"
 *   snap-macro       a board captioned "Product Anatomy"
 *   buckle-denim     a PHONE MOCKUP rendering an invented product page —
 *                    "Artisan Crafted Silver Buckle · €245 · Add to Bag"
 *
 * Two of them were live: snap-macro was the Girls category tile on the homepage, and
 * pearl-snaps and tooled-leather were in the grid-break rotation on every long product run.
 * The last one is the serious one — a fabricated product name and a €245 price, against a
 * verified wholesale range of $7–$33, inside an image the site presents as its own campaign
 * imagery. §12 forbids invented product facts and fabricated prices; the audit is explicit
 * that "prices in the designs are fiction".
 *
 * WHY IT WAS MISSED, which is the part worth remembering: the 2026-08-07 review contact
 * sheet rendered every plate as a square with `object-fit: cover`. Centre-cropping a 16:9
 * board to a square removes the caption bar at the top and the gutters at the sides — it
 * removes exactly the evidence that the frame is a mockup. The review looked at cropped
 * thumbnails and saw four convincing macros.
 *
 * SO: review plates at their NATURAL ASPECT RATIO, on a mid-grey ground so light gutters
 * are visible, never square-cropped. A plate with a flat border, a caption bar, a device
 * frame or any UI is a screen, not a photograph, and does not ship.
 *
 * Re-run with `node scripts/import-campaign-plates.mjs` if the selection changes. Output:
 * responsive AVIF/WebP under public/media/campaign/ plus a typed manifest.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = join(process.cwd(), 'assets', 'source', 'stitch-plates')
const OUT_DIR = join(process.cwd(), 'public', 'media', 'campaign')
const MANIFEST = join(process.cwd(), 'src', 'content', 'media', 'campaign-plates.generated.ts')

const WIDTHS = [480, 960, 1408]

/*
  WITHDRAWN 2026-08-18 — screens, not photographs. Kept here as a record so nobody
  re-adds them from the mirror. See the header for what each one actually contains.

    'tooled-leather': 'plate-0jPoMEhhtD2S7JnA.jpg',
    'buckle-denim':   'plate-8pCfKpGiMZNgUUtw.jpg',
    'pearl-snaps':    'plate-PcRtH72Y6thHTjJQ.jpg',
    'snap-macro':     'plate-wntCegdQvJ_JaFew.jpg',
*/
const SELECTION = {
  'leather-bench': 'plate--OnVgrCXbWXmRfYw.jpg',
  'indigo-thread': 'plate-2seOHmOtrnx3xk-g.jpg',
  'embossed-leather': 'plate-59ec8k39kJS_gYRg.jpg',
  'denim-weave': 'plate-5nGTkWlNlZfscMBQ.jpg',
  'selvedge-beam': 'plate-7lZiJCgL-RCDu3sA.jpg',
  'hardware-bench': 'plate-I8Xun1NpegaGA7jQ.jpg',
  'longhorn-buckle': 'plate-MD9QplUIvZBJMh7A.jpg',
  'high-dunes': 'plate-Oq6inNPmh2jMUMRA.jpg',
  'selvedge-stitch': 'plate-QN_UhW9FSphDL2dQ.jpg',
  'night-set': 'plate-QQYIQDfhi4DjzhXg.jpg',
  'khaki-twill': 'plate-RrOla5d1dxOZNBxA.jpg',
  'warehouse-aisle': 'plate-RsZY5uymg7ByrydQ.jpg',
  'felt-hat': 'plate-XClfvNstZT7MaHoQ.jpg',
  'tan-belt': 'plate-ady6QXgSMAflOrxg.jpg',
  'engraved-buckle': 'plate-fXPyV1pO4cUbfQvA.jpg',
  'rawhide-tools': 'plate-gOtTtfec7lTinRsw.jpg',
  'denim-slub': 'plate-jMu9KfH-Wmkv0a8w.jpg',
  'rack-aisle': 'plate-q8NQ9SbVDhv8lD8g.jpg',
  'saddle-stitch': 'plate-qw9G5DZy39J-WoMQ.jpg',
  'tooled-belt-rock': 'plate-smK8aPGxR10Y3kSQ.jpg',
  'showroom-bench': 'plate-wXEVhzeFk-w80CiA.jpg',
  'denim-blue': 'plate-yAcHZNNq9AKOypNw.jpg',
}

mkdirSync(OUT_DIR, { recursive: true })

const entries = []

for (const [slug, file] of Object.entries(SELECTION)) {
  const source = join(SRC, file)
  const meta = await sharp(source).metadata()
  const { width, height } = meta
  const usable = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, 1408)])].sort(
    (a, b) => a - b,
  )

  const srcsets = { avif: [], webp: [] }
  for (const w of usable) {
    for (const format of ['avif', 'webp']) {
      const name = `${slug}-${w}.${format}`
      await sharp(source)
        .resize(w)
        [format]({ quality: format === 'avif' ? 55 : 78 })
        .toFile(join(OUT_DIR, name))
      srcsets[format].push(`/media/campaign/${name} ${w}w`)
    }
  }

  const posterW = usable[Math.min(1, usable.length - 1)]
  entries.push({
    slug,
    poster: `/media/campaign/${slug}-${posterW}.webp`,
    avif: srcsets.avif.join(', '),
    webp: srcsets.webp.join(', '),
    width,
    height,
  })
  console.log('done', slug, `${width}x${height}`)
}

const lines = entries
  .map(
    (e) => `  '${e.slug}': {
    poster: '${e.poster}',
    avifSrcSet: '${e.avif}',
    webpSrcSet: '${e.webp}',
    intrinsicWidth: ${e.width},
    intrinsicHeight: ${e.height},
  },`,
  )
  .join('\n')

writeFileSync(
  MANIFEST,
  `/**
 * GENERATED by scripts/import-campaign-plates.mjs — do not edit by hand.
 * Curated atmosphere plates from the Stitch mirror; see the script for the review rules.
 */

export type PlateAsset = {
  readonly poster: string
  readonly avifSrcSet: string
  readonly webpSrcSet: string
  readonly intrinsicWidth: number
  readonly intrinsicHeight: number
}

export const PLATE_ASSETS = {
${lines}
} as const

export type PlateSlug = keyof typeof PLATE_ASSETS
`,
)

console.log(`manifest written with ${entries.length} plates`)
