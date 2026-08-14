import 'server-only'

/**
 * CATALOGUE ACCESS — the only place a product crosses the authorisation boundary.
 *
 * Every function here returns `PublicProduct` or `VisibleProduct`. `ProductRecord` never
 * escapes this module, so no route or component can reach a wholesale price by accident.
 *
 * Fail closed: if the session lookup or the adapter throws, callers receive the public
 * shape. An error never widens access.
 */

import {
  publicProduct,
  publicProducts,
  visibleProduct,
  visibleProducts,
} from '@/auth/authorize'
import { withOfficialMedia } from '@/content/media/official-media'
import type { PublicProduct, VisibleProduct } from '@/domain/product'
import type { Session } from '@/domain/session'
import { commerce } from './index'
import type { ProductQuery } from './adapters/commerce-adapter'

/**
 * Approved official photography is overlaid here, before authorisation is applied, so public
 * and authorised reads resolve identical imagery. Media is content; content is not gated.
 * Products with no approved asset keep their photography-pending placeholder.
 */

export async function listPublicProducts(query: ProductQuery = {}): Promise<PublicProduct[]> {
  try {
    const records = await commerce.listProducts(query)
    return publicProducts(records.map(withOfficialMedia))
  } catch {
    return []
  }
}

export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  try {
    const record = await commerce.getProduct(slug)
    return record ? publicProduct(withOfficialMedia(record)) : null
  } catch {
    return null
  }
}

/**
 * The authorised read. Returns the authorised shape only for an approved buyer session;
 * every other session — and every failure — receives the public shape.
 */
export async function getVisibleProduct(
  slug: string,
  session: Session,
): Promise<VisibleProduct | null> {
  try {
    const record = await commerce.getProduct(slug)
    return record ? visibleProduct(withOfficialMedia(record), session) : null
  } catch {
    return null
  }
}

/**
 * The authorised LIST read. Same seam as `getVisibleProduct`, same fail-closed rule: an
 * unapproved session, or any thrown error, yields public shapes with no wholesale field.
 *
 * Assortment planning is the caller that needs this — it prices a whole rack at once, and
 * fetching each style individually would be one authorisation decision per product where
 * one decision is correct.
 */
export async function listVisibleProducts(
  session: Session,
  query: ProductQuery = {},
): Promise<VisibleProduct[]> {
  try {
    const records = await commerce.listProducts(query)
    return visibleProducts(records.map(withOfficialMedia), session)
  } catch {
    return []
  }
}

export type FacetCounts = {
  readonly sizeRanges: readonly {
    readonly value: string
    readonly label: string
    readonly count: number
  }[]
  readonly availability: readonly {
    readonly value: string
    readonly label: string
    readonly count: number
  }[]
  readonly fabric: readonly { readonly value: string; readonly count: number }[]
  readonly detail: readonly { readonly value: string; readonly count: number }[]
  readonly wash: readonly {
    readonly value: string
    readonly label: string
    readonly count: number
  }[]
  readonly legOpening: readonly {
    readonly value: string
    readonly label: string
    readonly count: number
  }[]
  readonly silhouette: readonly {
    readonly value: string
    readonly label: string
    readonly count: number
  }[]
  readonly sleeve: readonly { readonly value: string; readonly count: number }[]
  readonly motif: readonly { readonly value: string; readonly count: number }[]
  readonly colour: readonly { readonly value: string; readonly count: number }[]
}

/**
 * Facets derived from attributes extracted from spec strings. Today only availability is
 * filterable across 235+ live styles; this is the gap that extraction closes.
 */
export async function getFacets(categorySlug?: string): Promise<FacetCounts> {
  const products = await listPublicProducts(categorySlug !== undefined ? { categorySlug } : {})

  const tally = (values: readonly string[]) => {
    const counts = new Map<string, number>()
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value))
  }

  const sizeRangeLabels: Record<string, string> = {
    straight: 'Straight sizing',
    extended: 'Extended sizing',
    girls: 'Girls sizing',
  }
  const availabilityLabels: Record<string, string> = {
    'in-stock': 'In stock',
    'pre-order': 'Pre-order',
    waitlist: 'Waitlist',
    discontinued: 'Discontinued',
  }

  return {
    sizeRanges: tally(
      products.flatMap((p) =>
        p.sizeRanges.filter((r) => r.availability !== 'unavailable').map((r) => r.kind),
      ),
    ).map((entry) => ({
      ...entry,
      label: sizeRangeLabels[entry.value] ?? entry.value,
    })),
    availability: tally(products.map((p) => p.availability)).map((entry) => ({
      ...entry,
      label: availabilityLabels[entry.value] ?? entry.value,
    })),
    fabric: tally(products.flatMap((p) => p.attributes.fabric ?? [])),
    detail: tally(products.flatMap((p) => p.attributes.detail ?? [])),
    wash: tally(products.flatMap((p) => (p.attributes.wash ? [p.attributes.wash] : []))).map(
      (entry) => ({
        ...entry,
        label: `${entry.value.charAt(0).toUpperCase()}${entry.value.slice(1)} wash`,
      }),
    ),
    legOpening: tally(
      products.flatMap((p) => (p.attributes.legOpening ? [p.attributes.legOpening] : [])),
    ).map((entry) => ({
      ...entry,
      label: `${entry.value.charAt(0).toUpperCase()}${entry.value.slice(1).replace('-', ' ')}`,
    })),
    silhouette: tally(
      products.flatMap((p) => (p.attributes.silhouette ? [p.attributes.silhouette] : [])),
    ).map((entry) => ({
      ...entry,
      label: `${entry.value.charAt(0).toUpperCase()}${entry.value.slice(1).replace('-', ' ')}`,
    })),
    sleeve: tally(products.flatMap((p) => (p.attributes.sleeve ? [p.attributes.sleeve] : []))),
    motif: tally(products.flatMap((p) => p.attributes.motif ?? [])),
    colour: tally(products.flatMap((p) => p.attributes.colour.map((c) => c.name))),
  }
}
