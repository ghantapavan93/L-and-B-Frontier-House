import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * THE EXPORT-LEAK GATE — the fourth assertion, from finding W-2.
 *
 * The wholesale-platform teardown identified the one price leak our three CI gates cannot
 * see: a FILE. A line sheet at `/exports/linesheet.pdf` or a data drop at
 * `/media/feed.json` is served verbatim from `public/`, never passes through a route, and
 * therefore sails past the unauthenticated-crawl and slug-purity assertions entirely.
 *
 * So this gate walks `public/` itself: every text-bearing file is scanned for restricted
 * price vocabulary and dollar-amount patterns. Media bytes (images, video, fonts) are
 * exempt by extension — a JPEG is not a data channel this gate can read; the media
 * integrity suite owns those. When real exports exist they must be served through an
 * authorised, signed, session-scoped route — never from `public/` — and this test is the
 * reason a shortcut cannot ship quietly.
 */

const PUBLIC_DIR = join(__dirname, '..', '..', 'public')

/** Extensions a leak can hide in as text. */
const TEXT_EXTENSIONS = new Set([
  '.json',
  '.txt',
  '.csv',
  '.tsv',
  '.xml',
  '.svg',
  '.html',
  '.js',
  '.css',
  '.md',
  '.vtt',
  '.webmanifest',
])

/** Restricted vocabulary and price shapes. Word-bounded to avoid matching prose like
 *  "wholesale showroom"; the JSON-key forms are the ones that actually leak. */
const RESTRICTED_PATTERNS: readonly { pattern: RegExp; why: string }[] = [
  { pattern: /"(wholesale_?price|unit_?price|price_?cents)"/i, why: 'price key' },
  { pattern: /"(msrp|moq|margin)"/i, why: 'restricted term key' },
  { pattern: /\$\s?\d{1,4}\.\d{2}\b/, why: 'dollar amount' },
  { pattern: /\bprepack[_ ]?price\b/i, why: 'pack price' },
]

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

describe('no restricted data ships as a static file', () => {
  const files = walk(PUBLIC_DIR).filter((file) =>
    TEXT_EXTENSIONS.has(file.slice(file.lastIndexOf('.')).toLowerCase()),
  )

  it('finds text-bearing files to scan (the gate is not vacuously green)', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files.map((file) => [file.slice(PUBLIC_DIR.length + 1), file]))(
    'public/%s carries no restricted price data',
    (_label, file) => {
      const body = readFileSync(file as string, 'utf8')
      for (const { pattern, why } of RESTRICTED_PATTERNS) {
        expect(
          pattern.test(body),
          `${file} matches restricted pattern (${why}): ${pattern}`,
        ).toBe(false)
      }
    },
  )

  it('no export- or linesheet-named file exists in public/ at all', () => {
    const suspicious = walk(PUBLIC_DIR).filter((file) =>
      /linesheet|line-sheet|export|pricelist|price-list/i.test(file),
    )
    expect(
      suspicious,
      'exports must be served through an authorised signed route, never from public/',
    ).toEqual([])
  })
})
