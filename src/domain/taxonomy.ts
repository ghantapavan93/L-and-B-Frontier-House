/**
 * TAXONOMY — the one hard gate on Phase 1 (D-04 / D-03 / D-05).
 *
 * This file is the single source of category truth. Routes, navigation, filters and
 * sitemaps all derive from it, so the final owner-approved taxonomy can replace these
 * entries without touching a route file or a component.
 *
 * Rules encoded here:
 *   - Verified categories only. Source: V3.1 Frame 8f, the most brand-accurate taxonomy in
 *     the corpus, matching v3_1_design.md exactly (CLAUDE.md §13a).
 *   - NO menswear. Menswear does not exist (CLAUDE.md §11, D-03).
 *   - NO footwear. Unverified inventory.
 *   - Home is present but `hidden` pending owner confirmation (D-05).
 *   - Plus is NOT a category. Extended sizing is a size range and a facet, never a
 *     duplicated catalogue (CLAUDE.md §11, docs/production/10 §4).
 */

export type CategoryStatus =
  /** Verified and shown in primary navigation. */
  | 'primary'
  /** Real route, reachable by direct link, absent from primary navigation. */
  | 'secondary'
  /** Defined but not routed and not navigable. Awaiting an owner decision. */
  | 'hidden'

export type Category = {
  readonly slug: string
  readonly label: string
  readonly status: CategoryStatus
  /** Public, indexable description. Contains no commercial terms. */
  readonly blurb: string
}

/**
 * Provenance for each entry is recorded here rather than as a data field, so that audit
 * notes stay readable to humans without shipping as strings in the client bundle:
 *
 *   women       VERIFIED — live taxonomy and V3.1 Frame 8f.
 *   girls       VERIFIED — live taxonomy and V3.1 Frame 8f. This is the verified category
 *               that occupies the slot the design corpus filled with an audience gateway
 *               for a product line that does not exist (D-03).
 *   accessories VERIFIED — live taxonomy.
 *   home        D-05 UNRESOLVED — claimed in About Us and the Dallas Market Center listing,
 *               absent from the live taxonomy. Hidden until the owner confirms it is a
 *               real, stocked category.
 */
export const CATEGORIES: readonly Category[] = [
  {
    slug: 'women',
    label: 'Women',
    status: 'primary',
    blurb: 'Western apparel for women, in straight and extended sizing.',
  },
  {
    slug: 'girls',
    label: 'Girls',
    status: 'primary',
    blurb: 'Western apparel for girls.',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    status: 'primary',
    blurb: 'Belts, bags, hats and jewellery.',
  },
  {
    slug: 'home',
    label: 'Home',
    status: 'hidden',
    blurb: 'Home goods.',
  },
] as const

/** Categories that appear in primary navigation. */
export function navigableCategories(): readonly Category[] {
  return CATEGORIES.filter((c) => c.status === 'primary')
}

/** Categories that have a real route. Drives generateStaticParams and the sitemap. */
export function routableCategories(): readonly Category[] {
  return CATEGORIES.filter((c) => c.status === 'primary' || c.status === 'secondary')
}

export function findCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/** A routable category, or undefined. Hidden categories resolve to undefined → 404. */
export function findRoutableCategory(slug: string): Category | undefined {
  const category = findCategory(slug)
  return category && category.status !== 'hidden' ? category : undefined
}

export type CategorySlug = (typeof CATEGORIES)[number]['slug']
