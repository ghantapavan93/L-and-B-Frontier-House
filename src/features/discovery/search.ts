import type { PublicProduct } from '@/domain/product'
import { AVAILABILITY_LABELS } from '@/domain/product'
import { findCategory } from '@/domain/taxonomy'

/**
 * CATALOGUE SEARCH — public fields only, by construction.
 *
 * The haystack is built from `PublicProduct`, a type with no wholesale field, so a query
 * can never surface a restricted value: there is nothing restricted in the object being
 * searched. Matching is plain substring-per-token over the fields a buyer actually types —
 * name, spec string, category, fabric, detail, motif, colour, silhouette, wash,
 * availability — ranked so whole-name hits beat attribute hits.
 *
 * Pure and synchronous: the route calls it over the repository read, tests call it over
 * fixtures, and no index needs building for a catalogue this size (22 today, 235+ live).
 */

export type SearchHit = {
  readonly product: PublicProduct
  readonly score: number
}

function haystacks(product: PublicProduct): { text: string; weight: number }[] {
  const category = findCategory(product.categorySlug)
  return [
    { text: product.displayName, weight: 5 },
    { text: product.specName, weight: 4 },
    { text: category?.label ?? '', weight: 3 },
    {
      text: [
        ...(product.attributes.fabric ?? []),
        ...(product.attributes.detail ?? []),
        ...(product.attributes.motif ?? []),
        product.attributes.silhouette ?? '',
        product.attributes.wash ?? '',
        product.attributes.sleeve ?? '',
        product.attributes.inseam ?? '',
        ...product.attributes.colour.map((c) => c.name),
        AVAILABILITY_LABELS[product.availability],
      ].join(' '),
      weight: 2,
    },
    { text: product.description, weight: 1 },
  ]
}

/** Tokens of two+ characters; the query is trimmed and lowercased once. */
export function searchTokens(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9&'-]+/)
    .filter((token) => token.length >= 2)
}

export function searchProducts(products: readonly PublicProduct[], query: string): SearchHit[] {
  const tokens = searchTokens(query)
  if (tokens.length === 0) return []

  const hits: SearchHit[] = []
  for (const product of products) {
    const fields = haystacks(product).map((field) => ({
      ...field,
      text: field.text.toLowerCase(),
    }))

    let score = 0
    let matchedAll = true
    for (const token of tokens) {
      const best = fields.reduce(
        (max, field) => (field.text.includes(token) ? Math.max(max, field.weight) : max),
        0,
      )
      if (best === 0) {
        matchedAll = false
        break
      }
      score += best
    }

    // Every token must land somewhere — "denim fringe" means denim AND fringe.
    if (matchedAll) hits.push({ product, score })
  }

  return hits.sort(
    (a, b) => b.score - a.score || a.product.displayName.localeCompare(b.product.displayName),
  )
}
