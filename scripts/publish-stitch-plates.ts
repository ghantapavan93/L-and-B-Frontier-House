/**
 * PUBLISH CURATED STITCH PLATES INTO THE APPLICATION.
 *
 * The mirror script rescues everything; this publishes almost nothing. That asymmetry is
 * the point. 112 plates were saved because they were about to disappear, but most of them
 * depict things that do not exist — a men's collection, an $850 boot, a bespoke atelier —
 * and §12 forbids generated imagery being presented as real product.
 *
 * So every entry below is named, cropped and justified by hand. A plate earns publication
 * only if it shows MATERIAL or PLACE rather than merchandise: denim weave, worn leather,
 * a landscape. Those carry the brand's "material honesty at high resolution" thesis without
 * asserting a garment anyone can buy.
 *
 * Each published plate keeps `generated-campaign` provenance, which the media layer already
 * knows how to flag. None of them is ever a product image.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = path.join('assets', 'source', 'stitch-plates')
const OUT = path.join('public', 'media', 'campaign')

/**
 * The Stitch renderer stamps a title bar across the top of every frame — "V3 Frame 6:
 * Definitive Flagship Homepage", a mode switch, icons. It is chrome from the design tool,
 * not part of the photograph, and it has to come off before anything ships.
 */
const CHROME_HEIGHT = 68

type Curated = {
  readonly plate: string
  readonly slug: string
  /** Why this one is safe to publish. Read before adding an entry. */
  readonly justification: string
  readonly alt: string
  /** Crop applied after the chrome strip, in source pixels. */
  readonly crop?: { left: number; width: number }
  readonly widths: number[]
}

const CURATED: readonly Curated[] = [
  {
    plate: 'plate-4USxxx7M9BuzbO0g.jpg',
    slug: 'material-denim-buckle',
    justification:
      'Monochrome macro: worn denim, a scratched belt buckle, a hand. Material and wear, no garment offered for sale, no price, no name. This is precisely the "weave and topstitch are legible" photograph the Creative North Star asks for and the catalogue cannot supply at 360px.',
    alt: 'A hand resting on a worn leather belt with a scratched silver buckle, over heavyweight indigo denim, photographed close in black and white',
    widths: [1408, 1024, 768, 480],
  },
  {
    plate: 'plate-CzexXg9Te6b53ItA.jpg',
    slug: 'place-high-desert',
    justification:
      'High desert at golden hour. Cropped to the LEFT of frame to remove the walking figure entirely — the figure reads male, and menswear does not exist (D-03). What remains is landscape and light: place, not product, and no capability claim of any kind.',
    alt: 'A high desert at golden hour, low sun raking across pale rock and scrub toward distant hills',
    crop: { left: 0, width: 820 },
    widths: [820, 640, 480],
  },
]

async function main(): Promise<void> {
  await mkdir(OUT, { recursive: true })
  const published: Record<string, unknown>[] = []

  for (const entry of CURATED) {
    const src = path.join(SOURCE, entry.plate)
    const meta = await sharp(src).metadata()
    const fullHeight = (meta.height ?? 0) - CHROME_HEIGHT

    const base = sharp(src).extract({
      left: entry.crop?.left ?? 0,
      top: CHROME_HEIGHT,
      width: entry.crop?.width ?? meta.width ?? 0,
      height: fullHeight,
    })

    const renditions: string[] = []
    for (const width of entry.widths) {
      for (const format of ['avif', 'webp'] as const) {
        const file = path.join(OUT, `${entry.slug}-${width}.${format}`)
        const pipeline = base.clone().resize({ width, withoutEnlargement: true })
        await (
          format === 'avif' ? pipeline.avif({ quality: 55 }) : pipeline.webp({ quality: 78 })
        ).toFile(file)
        renditions.push(path.basename(file))
      }
    }

    const widest = await sharp(
      path.join(OUT, `${entry.slug}-${entry.widths[0]}.webp`),
    ).metadata()

    published.push({
      slug: entry.slug,
      sourcePlate: entry.plate,
      provenance: 'generated-campaign',
      justification: entry.justification,
      alt: entry.alt,
      intrinsicWidth: widest.width,
      intrinsicHeight: widest.height,
      renditions,
    })
    console.log(`${entry.slug}: ${widest.width}x${widest.height}, ${renditions.length} files`)
  }

  await writeFile(
    path.join(OUT, 'manifest.json'),
    `${JSON.stringify(
      {
        note: 'Generated campaign plates. Atmosphere and place only — never presented as real product (§12). Each entry carries the reason it was cleared.',
        plates: published,
      },
      null,
      2,
    )}\n`,
  )
}

await main()
