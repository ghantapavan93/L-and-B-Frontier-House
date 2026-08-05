/**
 * MIRROR THE GENERATED STITCH IMAGERY.
 *
 * Every image in the Stitch export is a remote reference to Google's `aida-public` CDN.
 * The design-source audit recorded this as a standing risk — "all imagery is remote,
 * generated, and hosted outside project control — mirror it before the URLs expire" — and
 * this is that mirror. Nothing in the export survives the day those URLs stop resolving,
 * including the frames the visual direction is judged against.
 *
 * Two things this deliberately does NOT do:
 *
 *   It does not publish. Files land in `assets/source/stitch-plates/`, which is source
 *   material, not `public/`. Moving a plate into the application is a separate, deliberate
 *   act per surface, because §12 forbids generated imagery being presented as real product
 *   and most of these frames contain garments that do not exist.
 *
 *   It does not rewrite the export. `stitch-export/` is read-only reference (§13).
 *
 * Native size is 1376x768 and the CDN will not serve larger — `=w3840` returns the same
 * bytes as `=d`. That is the ceiling on how sharp any surface built from these can be, and
 * it is worth knowing before anyone designs a 4K hero around one.
 */

import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const EXPORT_ROOT = 'stitch-export'
const OUT_DIR = path.join('assets', 'source', 'stitch-plates')
const MANIFEST = path.join(OUT_DIR, 'manifest.json')

/** `=d` asks the CDN for the stored original rather than a display-sized derivative. */
const NATIVE = '=d'
const URL_PATTERN = /https:\/\/lh3\.googleusercontent\.com\/aida-public\/[A-Za-z0-9_-]+/g

type Plate = {
  readonly id: string
  readonly url: string
  /** Every frame that references this image. The same plate is reused across frames. */
  readonly frames: string[]
  readonly file: string
  readonly bytes: number
  readonly sha256: string
}

async function htmlFiles(dir: string): Promise<string[]> {
  const found: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)))
    else if (entry.name.endsWith('.html')) found.push(full)
  }
  return found
}

/** The frame a file belongs to, as a readable slug rather than a path. */
function frameOf(file: string): string {
  const parts = file.split(path.sep)
  return parts[parts.length - 2] ?? 'unknown'
}

async function main(): Promise<void> {
  const files = await htmlFiles(EXPORT_ROOT)

  // url -> frames referencing it. Order is stable so ids do not churn between runs.
  const byUrl = new Map<string, Set<string>>()
  for (const file of files.sort()) {
    const html = await readFile(file, 'utf8')
    for (const match of html.matchAll(URL_PATTERN)) {
      const url = match[0]
      if (!byUrl.has(url)) byUrl.set(url, new Set())
      byUrl.get(url)?.add(frameOf(file))
    }
  }

  await mkdir(OUT_DIR, { recursive: true })
  console.log(`${byUrl.size} unique plates referenced across ${files.length} frames`)

  const plates: Plate[] = []
  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const [url, frames] of byUrl) {
    // The CDN key is long and opaque; its tail is unique enough to name a file by and
    // keeps the mapping back to the source URL obvious.
    const id = url.slice(-16)
    const file = path.join(OUT_DIR, `plate-${id}.jpg`)

    if (existsSync(file)) {
      const bytes = await readFile(file)
      plates.push({
        id,
        url,
        frames: [...frames].sort(),
        file,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })
      skipped += 1
      continue
    }

    try {
      const response = await fetch(url + NATIVE)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const type = response.headers.get('content-type') ?? ''
      // Fail closed on anything that is not an image rather than writing the bytes and
      // finding out later what they were.
      if (!type.startsWith('image/')) throw new Error(`not an image: ${type}`)

      const bytes = Buffer.from(await response.arrayBuffer())
      await writeFile(file, bytes)

      plates.push({
        id,
        url,
        frames: [...frames].sort(),
        file,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })
      downloaded += 1
      if (downloaded % 20 === 0) console.log(`  ${downloaded} downloaded…`)
    } catch (error) {
      failed += 1
      console.warn(`  FAILED ${id}: ${(error as Error).message}`)
    }
  }

  await writeFile(
    MANIFEST,
    `${JSON.stringify(
      {
        note: 'Generated imagery mirrored from the Stitch export. NOT licensed for publication until D-09 is answered, and never to be presented as real product photography (§12).',
        nativeResolution: '1376x768 — the CDN serves no larger',
        mirroredCount: plates.length,
        plates: plates.sort((a, b) => a.id.localeCompare(b.id)),
      },
      null,
      2,
    )}\n`,
  )

  console.log(`downloaded ${downloaded}, already present ${skipped}, failed ${failed}`)
  console.log(`manifest: ${MANIFEST}`)
}

await main()
