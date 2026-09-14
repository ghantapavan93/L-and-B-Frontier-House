/**
 * MEN'S DEMO MEDIA IMPORT.
 *
 * Reads the owner-dropped reference photographs in `assets/source/mens-reference/`, transcodes the
 * frames the demo rack uses into responsive AVIF + WebP at grid-honest widths, and writes
 * a typed manifest to `src/fixtures/mens-demo-media.generated.ts`.
 *
 * Re-run with `npm run import:mens-demo` whenever the source folder changes — e.g. when
 * reference imagery is replaced with owned photography (D-09).
 *
 * ── RESOLUTION ORDER: FILENAME FIRST, INDEX ONLY AS A REMNANT ────────────────────────
 *
 * A key resolves to a source file by NAME. Drop `dark-rigid-jean-flat.jpg` into the source
 * folder and it becomes the `dark-rigid-jean-flat` asset — no code change, no re-indexing,
 * nothing to remember.
 *
 * It did not used to work that way, and the old behaviour was a trap. Every key mapped to a
 * POSITIONAL INDEX into the alphabetically sorted directory listing. That is stable only
 * while the directory never changes, which is the one thing guaranteed to stop being true:
 * the moment a real men's shoot lands in this folder, every index shifts and every men's
 * image on the site silently becomes a different photograph. No error, no missing file, no
 * failing test — the rack would simply show the wrong clothes. It is the exact shape of bug
 * that survives code review because the code is correct and the assumption is not.
 *
 * The index map is kept, because the current reference drop genuinely has no meaningful
 * filenames and re-indexing it by hand would be a second chance to get it wrong. It is now
 * a documented remnant rather than the mechanism: as photography arrives named, entries
 * resolve by name instead and the fallback drains. The run prints the split every time, so
 * the remnant cannot quietly become permanent.
 *
 * A key that resolves NEITHER way is a hard failure. Rendering a placeholder or skipping the
 * entry would put the decision back where it was — in a silent default.
 */

import { mkdirSync, readdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = join(process.cwd(), 'assets', 'source', 'mens-reference')
const OUT_DIR = join(process.cwd(), 'public', 'media', 'mens-demo')
const MANIFEST = join(process.cwd(), 'src', 'fixtures', 'mens-demo-media.generated.ts')

const WIDTHS = [480, 960]

/*
 * LEGACY INDEX MAP — the fallback, not the mechanism. See the header.
 *
 * Positions into the alphabetically sorted, de-duplicated source list. The de-duplication
 * rule matches the contact sheet this selection was made against: files with a " (n)"
 * suffix are byte-duplicates and are skipped.
 *
 * Every entry here is a frame waiting to be shot. Delete the line when a named file for
 * that key lands — the shot list is docs/assets/LB_MENSWEAR_PHOTOGRAPHY_BRIEF.md.
 */
const LEGACY_INDEX = {
  'denim-jacket-hero': 5,
  'denim-jacket-saddle': 1,
  'dark-rigid-jean-flat': 23,
  'dark-rigid-jean-side': 41,
  'dark-rigid-jean-macro': 12,
  'mid-wash-jean-flat': 31,
  'mid-wash-jean-model': 22,
  'mid-wash-jean-front': 15,
  'mid-wash-jean-hem': 38,
  'light-wash-jean-flat': 40,
  'light-wash-jean-model': 13,
  'light-wash-jean-hem': 14,
  'bootcut-jean-model': 25,
  'bootcut-jean-hem': 20,
  'bootcut-jean-drape': 33,
  'khaki-jean-flat': 4,
  'khaki-jean-model': 27,
  'khaki-jean-pocket': 17,
  'khaki-jean-side': 29,
  'stripe-shirt-flat': 44,
  'saddle-belt-flat': 0,
  'saddle-belt-worn': 6,
  'ostrich-belt-flat': 9,
  'leather-duffel': 26,
  'campaign-boot-pull': 28,
  'campaign-gravel': 16,
  /*
   * THE FLOOR — the rest of the owner's drop, every remaining unique frame.
   *
   * These are campaign and editorial reference: worn looks, hems over boots, hardware and
   * texture. Several are footwear, which is why they live here rather than in the rack —
   * boots are not an approved demo category, but they are how the trousers are worn, and
   * the owner sent them. Nothing in this group is presented as a purchasable entry.
   */
  'floor-white-jean-worn': 2,
  'floor-dark-jean-back': 3,
  'floor-black-boots': 7,
  'floor-dark-hem-boot': 8,
  'floor-tan-boots': 10,
  'floor-cream-seated': 11,
  'floor-light-jean-side': 18,
  'floor-dark-jean-street': 19,
  'floor-denim-texture': 21,
  'floor-black-toe': 24,
  'floor-cuffing-barn': 30,
  'floor-light-jean-worn': 32,
  'floor-brown-boots': 34,
  'floor-boot-floorboards': 35,
  'floor-back-pocket': 36,
  'floor-waist-detail': 37,
  'floor-boot-rocks': 39,
  'floor-light-jean-flat': 42,
  'floor-boot-crate': 43,
  'floor-pale-jean-flat': 45,
}

/** Anything sharp can decode. The shoot will not arrive as .avif. */
const SOURCE_EXT = /\.(avif|webp|jpe?g|png|tiff?)$/i

const all = readdirSync(SRC).filter((f) => SOURCE_EXT.test(f))

/* The index map's positions were taken against this exact filter — .avif only, byte
   duplicates removed. It has to keep seeing the same list to keep meaning the same thing. */
const indexed = all
  .filter((f) => f.endsWith('.avif') && !/\(\d\)/.test(f))
  /*
    A file that resolves BY NAME is not part of the indexed list. Without this line a
    correctly-named .avif drop joined the alphabetical list and shifted every legacy
    position after it — the exact trap the header describes, reintroduced by the fix.
    Caught in review, before a drop.
  */
  .filter((f) => !KEY_SHAPE.test(f.replace(SOURCE_EXT, '').toLowerCase()))
  .sort()

/** A file whose basename IS the key, ignoring extension and case. */
function byName(key) {
  return all.find((f) => f.replace(SOURCE_EXT, '').toLowerCase() === key)
}

/**
 * Every key to publish: the ones the fixtures already reference, plus any correctly-named
 * file that has been dropped in since.
 *
 * The second half is what makes the shoot self-serving. Frame 6 of the per-style pattern is
 * `dark-rigid-jean-back`; nothing references it yet, so a stricter list would silently
 * ignore the file and the photographer would be told their shot "didn't work". Naming a file
 * to the convention is the whole act of publishing it — the fixture can start using it
 * whenever, and until then it is encoded, in the manifest and ready.
 */
/*
  Deliberately narrow. The current reference drop is named by content hash —
  `e8c25a7676c18b5fcc27d44ae3bfe16a09030982-2000x2500.avif` — and a loose
  "lowercase words joined by hyphens" pattern matches every one of them, which on the first
  run published 46 hash-named assets beside the 46 real ones. A key is words: each segment
  starts sensibly, none runs longer than a word, and the first must begin with a letter.
*/
const KEY_SHAPE = /^[a-z][a-z0-9]{1,13}(?:-[a-z0-9]{1,13}){1,4}$/

const KEYS = [
  ...new Set([
    ...Object.keys(LEGACY_INDEX),
    ...all.map((f) => f.replace(SOURCE_EXT, '').toLowerCase()).filter((n) => KEY_SHAPE.test(n)),
  ]),
]

/*
  Resolve EVERY key before touching the output directory. The old order wiped the
  directory first and then resolved; one unresolvable key threw halfway and left the
  committed manifest pointing at files that no longer existed. Resolve, then replace.
*/
const resolvedByName = []
const resolvedByIndex = []
const plan = KEYS.map((key) => {
  const named = byName(key)
  const source = named ?? indexed[LEGACY_INDEX[key]]
  if (!source) {
    throw new Error(
      `No source for '${key}'. Drop a file named '${key}.<ext>' into ${SRC}, ` +
        `or give it a LEGACY_INDEX position. Refusing to render a placeholder.`,
    )
  }
  ;(named ? resolvedByName : resolvedByIndex).push(key)
  return { key, source }
})

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

const entries = []

for (const { key, source } of plan) {
  const image = sharp(join(SRC, source))
  const meta = await image.metadata()
  const { width, height } = meta
  /*
   * Never upscale (a source's width is its honest ceiling), and always emit at least the
   * native width — several files carry -2000x2500 names but hold 400px thumbnails.
   */
  const usable = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, 960)])].sort(
    (a, b) => a - b,
  )

  const srcsets = { avif: [], webp: [] }
  for (const w of usable) {
    for (const format of ['avif', 'webp']) {
      const name = `${key}-${w}.${format}`
      await sharp(join(SRC, source))
        .resize(w)
        [format]({ quality: format === 'avif' ? 55 : 78 })
        .toFile(join(OUT_DIR, name))
      srcsets[format].push(`/media/mens-demo/${name} ${w}w`)
    }
  }

  const posterW = usable[usable.length - 1]
  entries.push({
    key,
    poster: `/media/mens-demo/${key}-${posterW}.webp`,
    avif: srcsets.avif.join(', '),
    webp: srcsets.webp.join(', '),
    width,
    height,
  })
  console.log('done', key, `${width}x${height}`)
}

const lines = entries
  .map(
    (e) => `  '${e.key}': {
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
 * GENERATED by scripts/import-mens-demo.mjs — do not edit by hand.
 * Responsive encodings of the men's demo reference imagery in assets/source/mens-reference/.
 */

export type MensDemoAsset = {
  readonly poster: string
  readonly avifSrcSet: string
  readonly webpSrcSet: string
  readonly intrinsicWidth: number
  readonly intrinsicHeight: number
}

export const MENS_DEMO_MEDIA: Record<string, MensDemoAsset> = {
${lines}
}
`,
)

console.log(`manifest written with ${entries.length} assets`)
console.log(
  `  by filename: ${resolvedByName.length}   by legacy index: ${resolvedByIndex.length}`,
)
if (resolvedByIndex.length) {
  console.log(
    `  still unshot — a named file for any of these replaces it with zero code changes:
` + `  ${resolvedByIndex.join(', ')}`,
  )
}
