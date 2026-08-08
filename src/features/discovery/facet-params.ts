/**
 * Search-parameter parsing for the facet panel.
 *
 * Values are allowlisted before they reach the data layer. An unrecognised value is
 * dropped rather than passed through, so a crafted URL cannot become a query the adapter
 * did not anticipate. No price value is ever read from or written to the query string.
 */

import type { ProductQuery, ProductSort } from '@/data/adapters/commerce-adapter'
import type { Availability } from '@/domain/product'
import type { SizeRangeKind } from '@/domain/size'
import type { AppliedFacets } from '@/ui/facet-panel'

type RawParams = Record<string, string | string[] | undefined>

const SIZE_RANGES: readonly SizeRangeKind[] = ['straight', 'extended', 'girls']
const AVAILABILITIES: readonly Availability[] = [
  'in-stock',
  'pre-order',
  'waitlist',
  'discontinued',
]
const SORTS: readonly ProductSort[] = ['newest', 'name']

function single(params: RawParams, key: string): string | undefined {
  const value = params[key]
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) {
    return value[0]
  }
  return undefined
}

export function readFacetParams(params: RawParams): AppliedFacets {
  const sizeRange = single(params, 'sizeRange')
  const availability = single(params, 'availability')
  const fabric = single(params, 'fabric')
  const detail = single(params, 'detail')
  const wash = single(params, 'wash')
  const silhouette = single(params, 'silhouette')
  const colour = single(params, 'colour')
  const sort = single(params, 'sort')

  return {
    ...(sizeRange && SIZE_RANGES.includes(sizeRange as SizeRangeKind) ? { sizeRange } : {}),
    ...(availability && AVAILABILITIES.includes(availability as Availability)
      ? { availability }
      : {}),
    ...(fabric ? { fabric } : {}),
    ...(detail ? { detail } : {}),
    ...(wash ? { wash } : {}),
    ...(silhouette ? { silhouette } : {}),
    ...(colour ? { colour } : {}),
    ...(sort && SORTS.includes(sort as ProductSort) ? { sort } : {}),
  }
}

export function toProductQuery(applied: AppliedFacets): ProductQuery {
  return {
    ...(applied.sizeRange ? { sizeRange: applied.sizeRange as SizeRangeKind } : {}),
    ...(applied.availability ? { availability: applied.availability as Availability } : {}),
    ...(applied.fabric ? { fabric: applied.fabric } : {}),
    ...(applied.detail ? { detail: applied.detail } : {}),
    ...(applied.wash ? { wash: applied.wash } : {}),
    ...(applied.silhouette ? { silhouette: applied.silhouette } : {}),
    ...(applied.colour ? { colour: applied.colour } : {}),
    ...(applied.sort ? { sort: applied.sort as ProductSort } : {}),
  }
}
