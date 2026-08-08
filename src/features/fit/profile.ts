import 'server-only'

/**
 * FIT PASSPORT — a remembered fit, applied to published measurements. Nothing more.
 *
 * The visitor tells the House their waist and how they wear their denim, once. The
 * passport then reads each style's PUBLISHED size chart — the same structured text the
 * size-and-fit pages render — and names the closest size. That is the entire mechanism:
 * arithmetic over the chart, no fit model, no purchase history, no prediction, and the
 * copy never claims "confidence" it does not have (§12).
 *
 * The profile lives in an httpOnly cookie on the visitor's own browser, read only on the
 * passport's OWN dynamic route — never injected into shared public pages, which must stay
 * byte-identical for every visitor (the cache suite holds this).
 */

import { cookies } from 'next/headers'
import type { PublicProduct } from '@/domain/product'
import type { SizeRange } from '@/domain/size'

const COOKIE_NAME = 'lb-fit-profile'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180

export type FitProfile = {
  /** Inches. Clamped on write. */
  readonly waistIn?: number
  readonly silhouette?: string
}

export async function readFitProfile(): Promise<FitProfile> {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as FitProfile) : {}
  } catch {
    return {}
  }
}

export async function writeFitProfile(profile: FitProfile): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_NAME, JSON.stringify(profile), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function clearFitProfile(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

/** "28", "28.5" or "28–30" (also tolerating a plain hyphen). "—" and junk parse to null. */
function parseWaist(value: string): { min: number; max: number } | null {
  const range = value.match(/^\s*(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*$/)
  if (range && range[1] && range[2]) {
    return { min: Number(range[1]), max: Number(range[2]) }
  }
  const single = Number(value)
  return Number.isFinite(single) && single > 0 ? { min: single, max: single } : null
}

export type SizeSuggestion = {
  readonly size: string
  readonly rangeKind: SizeRange['kind']
  /** The chart figure the suggestion came from — always shown, so the maths is inspectable. */
  readonly chartWaistIn: string
}

/**
 * The smallest published size whose chart waist accommodates the profile. Ranges match
 * inside their band; single figures accept up to one inch under the chart value, which is
 * how the chart itself is worn. Returns null when no published measurement decides it.
 */
export function suggestSize(product: PublicProduct, waistIn: number): SizeSuggestion | null {
  for (const range of product.sizeRanges) {
    if (range.availability === 'unavailable') continue
    for (const row of range.measurements) {
      if (!row.waistIn) continue
      const parsed = parseWaist(row.waistIn)
      if (!parsed) continue
      const fits =
        parsed.min === parsed.max
          ? waistIn <= parsed.max && waistIn >= parsed.min - 1
          : waistIn >= parsed.min && waistIn <= parsed.max
      if (fits) {
        return { size: row.size, rangeKind: range.kind, chartWaistIn: row.waistIn }
      }
    }
  }
  return null
}
