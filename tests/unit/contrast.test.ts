import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

/**
 * COMPUTED CONTRAST.
 *
 * "Verify computed ratios; do not assume a token passes." The design corpus specifies a
 * focus ring — 2px solid Oxidized Silver — that measures 2.18:1 against a 3:1 requirement.
 * It is both non-conformant AND unimplemented (`:focus` appears in 0 of 48 source files).
 *
 * This test reads the shipped token values and computes the ratios rather than trusting the
 * documented ones.
 */

const tokens = readFileSync('src/app/tokens.css', 'utf8')

/** Resolves a token to a literal hex, following `var()` aliases. */
function tokenValue(name: string, depth = 0): string {
  if (depth > 5) throw new Error(`Token --${name} has a circular alias chain`)

  const match = tokens.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!match?.[1]) throw new Error(`Token --${name} is not declared`)

  const raw = match[1].trim()
  if (raw.startsWith('#')) return raw

  const alias = raw.match(/^var\(--([a-z0-9-]+)\)$/)
  if (alias?.[1]) return tokenValue(alias[1], depth + 1)

  throw new Error(`Token --${name} resolves to "${raw}", which is not a colour`)
}

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function ratio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

const BONE = tokenValue('color-bone')
const INK = tokenValue('color-ink')

/**
 * Every light background text can land on.
 *
 * Checking only against `--color-bone` is what let metadata text ship at 4.16:1 in the
 * footer, which sits on `--surface-sunken`. Browser testing caught it; this list is the fix
 * that stops it recurring.
 */
const LIGHT_SURFACES: [string, string][] = [
  ['bone', BONE],
  ['raised', tokenValue('surface-raised')],
  ['sunken', tokenValue('surface-sunken')],
]

describe('computed contrast of shipped tokens', () => {
  it('meets 4.5:1 for body text on every light surface', () => {
    for (const [name, surface] of LIGHT_SURFACES) {
      expect(
        ratio(tokenValue('color-text'), surface),
        `body text on ${name}`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('meets 4.5:1 for metadata text on every light surface', () => {
    for (const [name, surface] of LIGHT_SURFACES) {
      expect(
        ratio(tokenValue('color-text-meta'), surface),
        `metadata text on ${name}`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('meets 3:1 for the focus ring — the criterion the design source fails', () => {
    const focusRatio = ratio(tokenValue('color-focus'), BONE)
    expect(focusRatio).toBeGreaterThanOrEqual(3)
    // Tobacco Leather, 6.49:1.
    expect(focusRatio).toBeGreaterThan(6)
  })

  it('does not use Oxidized Silver as the focus colour', () => {
    expect(tokenValue('color-focus').toLowerCase()).not.toBe('#a7a6a2')
    // Confirms why: the specified value fails the requirement.
    expect(ratio('#a7a6a2', BONE)).toBeLessThan(3)
  })

  it('meets 3:1 for load-bearing borders on every light surface', () => {
    for (const [name, surface] of LIGHT_SURFACES) {
      expect(
        ratio(tokenValue('color-border'), surface),
        `border on ${name}`,
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('meets 4.5:1 for chip and error text on every light surface', () => {
    for (const [name, surface] of LIGHT_SURFACES) {
      expect(
        ratio(tokenValue('color-chip-text'), surface),
        `chip on ${name}`,
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        ratio(tokenValue('color-error'), surface),
        `error on ${name}`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('meets 3:1 for the focus ring on every light surface', () => {
    for (const [name, surface] of LIGHT_SURFACES) {
      expect(
        ratio(tokenValue('color-focus'), surface),
        `focus ring on ${name}`,
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('meets 4.5:1 for text on the inverse surface, including the hero headline', () => {
    expect(ratio(BONE, INK)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(tokenValue('color-error-on-dark'), INK)).toBeGreaterThanOrEqual(4.5)
    // V3 Frame 1 rendered its headline near-invisible dark-grey-on-black; V2 did not.
    expect(ratio(BONE, INK)).toBeGreaterThan(15)
  })

  it('never pairs the two colours the audit measured as failing', () => {
    // Sandstone on Bone White is 1.50:1 and Rust Red on Ink Black is 2.04:1. Both are
    // present as tokens; neither may be used as a text pair.
    expect(ratio(tokenValue('color-sandstone'), BONE)).toBeLessThan(3)
    expect(ratio(tokenValue('color-rust'), INK)).toBeLessThan(3)

    const css = readFileSync('src/app/globals.css', 'utf8')
    expect(css).not.toMatch(
      /color:\s*var\(--color-sandstone\)[^}]*background:\s*var\(--surface-page\)/,
    )
  })
})

describe('motion tokens', () => {
  it('caps interactive duration at 400ms', () => {
    const durations = [...tokens.matchAll(/--duration-[a-z]+:\s*(\d+)ms/g)].map((m) =>
      Number.parseInt(m[1] ?? '0', 10),
    )

    expect(durations.length).toBeGreaterThan(0)
    for (const duration of durations) {
      expect(duration).toBeLessThanOrEqual(400)
    }
  })

  it('ships two easing curves, and no overshoot', () => {
    const curves = [...tokens.matchAll(/--ease-[a-z]+:\s*(cubic-bezier\([^)]+\))/g)]
    expect(curves.length).toBe(2)

    // An overshoot curve returns a value outside 0–1 on the y axis.
    for (const curve of curves) {
      const numbers = (curve[1] ?? '').match(/-?\d*\.?\d+/g)?.map(Number) ?? []
      const [, y1, , y2] = numbers
      expect(y1 ?? 0).toBeGreaterThanOrEqual(0)
      expect(y2 ?? 0).toBeLessThanOrEqual(1)
    }
  })

  it('declares the WCAG 2.2 minimum target size', () => {
    expect(tokens).toMatch(/--target-min:\s*24px/)
  })
})
