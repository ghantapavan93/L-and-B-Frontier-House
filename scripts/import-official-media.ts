/**
 * OFFICIAL MEDIA IMPORTER — Lucky & Blessed owned properties only.
 *
 * Downloads publicly served product and editorial imagery from official origins into
 * `public/media/catalog/imported/`, and records full provenance for every file in
 * `src/content/media/official-media-manifest.json`.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * THIS SCRIPT REFUSES TO RUN TODAY, AND THE REFUSAL IS THE POINT.
 *
 * Both official origins publish a robots.txt that disallows this agent by name:
 *
 *     User-agent: ClaudeBot        landbapparel.com
 *     Disallow: /
 *     User-agent: claudebot        landbapparel.com and landbw.co
 *     Disallow: /
 *
 * and landbapparel.com additionally sets:
 *
 *     Content-Signal: search=yes,ai-train=no,use=reference
 *
 * That is the site operator stating, in the standard machine-readable place, that automated
 * agents of this kind may not collect from the site. Bulk-copying their product photography
 * into another application is not "reference".
 *
 * The preflight below reads those files live and stops on the disallow. It is not a
 * decoration and it must not be edited around: the correct way to unblock this is an
 * explicit authorisation from Lucky & Blessed, recorded in AUTHORISATION below.
 * ────────────────────────────────────────────────────────────────────────────────────────
 *
 * Run:  npm run import:media          (preflight only, safe)
 *       npm run import:media -- --write   (downloads, once authorised)
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_DIR = join(ROOT, 'public', 'media', 'catalog', 'imported')
const MANIFEST_PATH = join(ROOT, 'src', 'content', 'media', 'official-media-manifest.json')

/**
 * Set this ONLY when Lucky & Blessed have given explicit, recorded permission for this
 * project to reproduce their photography, and the robots directive has been updated or
 * formally waived in writing. Note who authorised it and when.
 */
const AUTHORISATION: {
  granted: boolean
  grantedBy: string | null
  grantedOn: string | null
  evidence: string | null
} = {
  granted: false,
  grantedBy: null,
  grantedOn: null,
  evidence: null,
}

/** Only Lucky & Blessed owned origins. No retailer, marketplace or image-search source. */
const OFFICIAL_ORIGINS = ['https://landbapparel.com', 'https://landbw.co'] as const

/** The token this agent must match itself against when reading robots.txt. */
const AGENT_TOKENS = ['claudebot', 'claude-user', '*']

const USER_AGENT =
  'LBFrontierHouseImporter/1.0 (+official-asset-ingestion; contact: project owner)'

/** Anything smaller than this is chrome, not merchandise. */
const MIN_DIMENSION = 400
const MIN_BYTES = 12_000

type Candidate = {
  /** The image file as served. */
  readonly sourceUrl: string
  /** The public page the image was seen on. */
  readonly sourcePageUrl: string
  /** Verified product or category this asset belongs to. */
  readonly relatedTo: string
  readonly kind: 'product' | 'editorial' | 'category'
}

type ManifestEntry = Candidate & {
  readonly originalFilename: string
  readonly localFilename: string
  readonly downloadedOn: string
  readonly width: number
  readonly height: number
  readonly byteSize: number
  readonly sha256: string
  readonly suitable: boolean
  readonly needsHigherResolution: boolean
  readonly ownerApproval: 'pending' | 'approved' | 'rejected'
  readonly note: string
}

type RejectionEntry = {
  readonly sourceUrl: string
  readonly reason: string
}

/* ───────────────────────────── robots preflight ───────────────────────────── */

type RobotsVerdict = {
  readonly origin: string
  readonly allowed: boolean
  readonly matchedAgent: string | null
  readonly contentSignal: string | null
  readonly reason: string
}

/**
 * Minimal robots parser, deliberately strict: any group whose user-agent matches one of our
 * tokens and which disallows `/` blocks the origin outright. When in doubt it blocks.
 */
function evaluateRobots(origin: string, body: string): RobotsVerdict {
  const lines = body.split(/\r?\n/).map((l) => l.replace(/#.*$/, '').trim())

  const contentSignal =
    lines
      .find((l) => /^content-signal:/i.test(l))
      ?.split(/:(.+)/)[1]
      ?.trim() ?? null

  let currentAgents: string[] = []
  let sawDirective = false

  for (const line of lines) {
    if (!line) continue
    const [rawKey, ...rest] = line.split(':')
    const key = (rawKey ?? '').toLowerCase().trim()
    const value = rest.join(':').trim()

    if (key === 'user-agent') {
      if (sawDirective) {
        currentAgents = []
        sawDirective = false
      }
      currentAgents.push(value.toLowerCase())
      continue
    }

    if (key === 'disallow' || key === 'allow') {
      sawDirective = true
      const applies = currentAgents.some((a) => AGENT_TOKENS.includes(a))
      if (applies && key === 'disallow' && (value === '/' || value === '')) {
        if (value === '/') {
          return {
            origin,
            allowed: false,
            matchedAgent: currentAgents.find((a) => AGENT_TOKENS.includes(a)) ?? null,
            contentSignal,
            reason: `robots.txt disallows "/" for user-agent "${currentAgents.join(', ')}"`,
          }
        }
      }
    }
  }

  if (contentSignal && /ai-train\s*=\s*no/i.test(contentSignal)) {
    return {
      origin,
      allowed: false,
      matchedAgent: '*',
      contentSignal,
      reason: `Content-Signal declares "${contentSignal}" — copying photography into another application is not "reference" use`,
    }
  }

  return { origin, allowed: true, matchedAgent: null, contentSignal, reason: 'permitted' }
}

async function preflight(): Promise<RobotsVerdict[]> {
  const verdicts: RobotsVerdict[] = []

  for (const origin of OFFICIAL_ORIGINS) {
    try {
      const response = await fetch(`${origin}/robots.txt`, {
        headers: { 'user-agent': USER_AGENT },
      })
      if (!response.ok) {
        verdicts.push({
          origin,
          allowed: false,
          matchedAgent: null,
          contentSignal: null,
          reason: `robots.txt returned ${response.status} — treating as blocked`,
        })
        continue
      }
      verdicts.push(evaluateRobots(origin, await response.text()))
    } catch (error) {
      verdicts.push({
        origin,
        allowed: false,
        matchedAgent: null,
        contentSignal: null,
        reason: `robots.txt unreachable (${(error as Error).message}) — treating as blocked`,
      })
    }
  }

  return verdicts
}

/* ───────────────────────────── candidate handling ───────────────────────────── */

/**
 * D-00 defence. The live site encodes wholesale cost into product URL slugs
 * (`/30-00-rust-vintage-…`), so a source URL carried straight into a filename would import
 * the leak. Every derived name is stripped of price patterns.
 */
function sanitiseName(value: string): string {
  return value
    .replace(/^\/+/, '')
    .replace(/\d{1,3}-\d{2}-/g, '')
    .replace(/\.(html?|php)$/i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function localFilenameFor(candidate: Candidate, originalFilename: string): string {
  const extension = originalFilename.match(/\.(jpe?g|png|webp|avif)$/i)?.[0] ?? '.jpg'
  const base = sanitiseName(`${candidate.relatedTo}-${originalFilename.replace(extension, '')}`)
  return `${base}${extension.toLowerCase()}`
}

/** Reads intrinsic dimensions from the file header. No image library, no decode. */
function readDimensions(buffer: Buffer): { width: number; height: number } | null {
  // PNG
  if (buffer.length > 24 && buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }
  // JPEG: walk the segment chain to the first SOF marker.
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1
        continue
      }
      const marker = buffer[offset + 1] ?? 0
      const length = buffer.readUInt16BE(offset + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        }
      }
      offset += 2 + length
    }
  }
  return null
}

function rejectionReason(
  buffer: Buffer,
  dimensions: { width: number; height: number } | null,
  seenHashes: Set<string>,
  hash: string,
): string | null {
  if (buffer.length < MIN_BYTES) return 'file too small — icon, tracking pixel or spacer'
  if (!dimensions) return 'unreadable or broken image file'
  if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
    return `thumbnail too small (${dimensions.width}×${dimensions.height})`
  }
  if (seenHashes.has(hash)) return 'duplicate of an already-imported file'
  return null
}

/* ───────────────────────────── main ───────────────────────────── */

/**
 * Candidates are supplied by a human-reviewed reconnaissance pass, never by an automated
 * crawl: every entry must already be tied to a verified product or category, which is what
 * makes "reject anything that cannot be tied to a verified product" enforceable.
 */
const CANDIDATES: readonly Candidate[] = []

async function main(): Promise<void> {
  const write = process.argv.includes('--write')
  const verdicts = await preflight()
  const blocked = verdicts.filter((v) => !v.allowed)

  console.log('Official media import — preflight\n')
  for (const verdict of verdicts) {
    console.log(`  ${verdict.allowed ? 'ALLOWED' : 'BLOCKED'}  ${verdict.origin}`)
    console.log(`           ${verdict.reason}`)
    if (verdict.contentSignal)
      console.log(`           Content-Signal: ${verdict.contentSignal}`)
  }

  const entries: ManifestEntry[] = []
  const rejected: RejectionEntry[] = []
  const seenHashes = new Set<string>()
  let ran = false

  if (blocked.length > 0 && !AUTHORISATION.granted) {
    console.log(
      '\nNo images downloaded.\n' +
        'The site operator has disallowed this agent, and no owner authorisation is recorded.\n' +
        'Set AUTHORISATION in this file once Lucky & Blessed have given explicit permission.',
    )
  } else if (!write) {
    console.log('\nPreflight only. Re-run with --write to download.')
  } else {
    ran = true
    await mkdir(OUTPUT_DIR, { recursive: true })

    for (const candidate of CANDIDATES) {
      const originalFilename = decodeURIComponent(
        new URL(candidate.sourceUrl).pathname.split('/').pop() ?? 'unnamed',
      )
      try {
        const response = await fetch(candidate.sourceUrl, {
          headers: { 'user-agent': USER_AGENT, referer: candidate.sourcePageUrl },
        })
        if (!response.ok) {
          rejected.push({ sourceUrl: candidate.sourceUrl, reason: `HTTP ${response.status}` })
          continue
        }

        const buffer = Buffer.from(await response.arrayBuffer())
        const hash = createHash('sha256').update(buffer).digest('hex')
        const dimensions = readDimensions(buffer)
        const reason = rejectionReason(buffer, dimensions, seenHashes, hash)

        if (reason || !dimensions) {
          rejected.push({ sourceUrl: candidate.sourceUrl, reason: reason ?? 'unreadable' })
          continue
        }

        seenHashes.add(hash)
        const localFilename = localFilenameFor(candidate, originalFilename)
        await writeFile(join(OUTPUT_DIR, localFilename), buffer)

        entries.push({
          ...candidate,
          originalFilename,
          localFilename,
          downloadedOn: new Date().toISOString().slice(0, 10),
          width: dimensions.width,
          height: dimensions.height,
          byteSize: buffer.length,
          sha256: hash,
          suitable: true,
          // 4:5 product cards at 2× on a 1440 grid want ~1400px on the long edge.
          needsHigherResolution: Math.max(dimensions.width, dimensions.height) < 1400,
          ownerApproval: 'pending',
          note: 'OFFICIAL SITE IMPORT — OWNER APPROVAL PENDING',
        })
      } catch (error) {
        rejected.push({ sourceUrl: candidate.sourceUrl, reason: (error as Error).message })
      }
    }

    console.log(`\nImported ${entries.length}, rejected ${rejected.length}.`)
  }

  const previous = existsSync(MANIFEST_PATH)
    ? JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
    : null

  await mkdir(dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        $schema: 'official-media-manifest/v1',
        notice: 'OFFICIAL SITE IMPORT — OWNER APPROVAL PENDING',
        generatedOn: new Date().toISOString().slice(0, 10),
        officialOrigins: OFFICIAL_ORIGINS,
        authorisation: AUTHORISATION,
        preflight: verdicts,
        importRan: ran,
        assets: ran ? entries : (previous?.assets ?? []),
        rejected: ran ? rejected : (previous?.rejected ?? []),
      },
      null,
      2,
    )}\n`,
  )

  console.log(`\nManifest written: ${MANIFEST_PATH}`)
}

await main()
