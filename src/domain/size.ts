/**
 * SIZE — inclusive by construction.
 *
 * One product record spans its size ranges. Extended sizing is a range and a facet on the
 * same product, never a separate catalogue and never routed to a bespoke or enquiry flow
 * while straight sizes shop normally (CLAUDE.md §11, docs/production/10 §4).
 *
 * Measurements are STRUCTURED TEXT. The live site's size chart is a single text-free JPEG —
 * a probable WCAG 1.1.1 failure and the thing most directly contradicting the brand's
 * inclusivity claim. `Measurement[]` is a Phase 1 requirement, not an enhancement.
 */

export type SizeRangeKind = 'straight' | 'extended' | 'girls'

/**
 * Stated honestly per range. `made-to-order` requires verified evidence and is never a
 * default for extended sizing.
 */
export type SizeRangeAvailability = 'available' | 'unavailable' | 'made-to-order'

export type Measurement = {
  readonly size: string
  readonly bustIn?: string
  readonly waistIn: string
  readonly hipIn?: string
  readonly inseamIn?: string
}

export type SizeRange = {
  readonly kind: SizeRangeKind
  readonly sizes: readonly string[]
  readonly availability: SizeRangeAvailability
  readonly measurements: readonly Measurement[]
}

export const SIZE_RANGE_LABELS: Record<SizeRangeKind, string> = {
  straight: 'Straight sizing',
  extended: 'Extended sizing',
  girls: 'Girls sizing',
}

export const SIZE_RANGE_AVAILABILITY_LABELS: Record<SizeRangeAvailability, string> = {
  available: 'Available',
  unavailable: 'Not available in this range',
  'made-to-order': 'Made to order',
}

export function hasExtendedSizing(ranges: readonly SizeRange[]): boolean {
  return ranges.some((r) => r.kind === 'extended' && r.availability !== 'unavailable')
}

/** Every size offered across every range, in declaration order, de-duplicated. */
export function allSizes(ranges: readonly SizeRange[]): string[] {
  const seen = new Set<string>()
  for (const range of ranges) {
    for (const size of range.sizes) seen.add(size)
  }
  return [...seen]
}
