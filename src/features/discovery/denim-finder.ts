/**
 * FIND YOUR DENIM — honest fit discovery, which is filtering with better questions.
 *
 * The reference pattern (Myntra/AJIO efficiency without the marketplace feel) asks how you
 * wear yours, then shows the pairs that match. The implementation is deliberately nothing
 * more than an allowlisted filter over published attributes — the same fields the facet
 * panel uses — because anything more would be a prediction this platform has no data to
 * make. The results page says "match your choices", never "built for you": no sales
 * history, no fit model, no AI claim. Selection, not judgement.
 *
 * GET form, so an answer set is a shareable URL and the whole surface works without
 * JavaScript. No price ever enters the query string; these are garment facts only.
 */

import type { PublicProduct } from '@/domain/product'

export type DenimAnswers = {
  readonly legOpening?: string
  readonly wash?: string
  /** True when the buyer asked for stretch. Matches fabric containing stretch denim. */
  readonly stretch?: boolean
}

/**
 * The leg openings that exist in the published line. An unknown value is dropped.
 * Renamed from DENIM_LEG_OPENINGS when the facet study split silhouette in two: this module
 * had the right four values under the wrong name, and the facet had the wrong values under
 * the right one. Cinch and Ariat both call this axis the leg opening.
 */
export const DENIM_LEG_OPENINGS = [
  { value: 'straight', label: 'Straight' },
  { value: 'bootcut', label: 'Bootcut' },
  { value: 'flare', label: 'Flare' },
  { value: 'wide-leg', label: 'Wide leg' },
] as const

export const DENIM_WASHES = [
  { value: 'dark', label: 'Dark wash' },
  { value: 'mid', label: 'Mid wash' },
  { value: 'light', label: 'Light wash' },
  { value: 'black', label: 'Black wash' },
] as const

type RawParams = Record<string, string | string[] | undefined>

function single(params: RawParams, key: string): string | undefined {
  const value = params[key]
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) {
    return value[0]
  }
  return undefined
}

export function readDenimAnswers(params: RawParams): DenimAnswers {
  /* `legOpening` is canonical; `silhouette` still reads as an alias so pre-split
     bookmarks and shared finder URLs keep working. Writes always use the new name. */
  const legOpening = single(params, 'legOpening') ?? single(params, 'silhouette')
  const wash = single(params, 'wash')

  return {
    ...(legOpening && DENIM_LEG_OPENINGS.some((s) => s.value === legOpening)
      ? { legOpening }
      : {}),
    ...(wash && DENIM_WASHES.some((w) => w.value === wash) ? { wash } : {}),
    ...(single(params, 'stretch') === 'yes' ? { stretch: true } : {}),
  }
}

/** True when the visitor has answered at least one question. */
export function hasAnswers(answers: DenimAnswers): boolean {
  return Boolean(answers.legOpening || answers.wash || answers.stretch)
}

/** Denim only, then each answered question narrows. Unanswered questions exclude nothing. */
export function matchDenim(
  products: readonly PublicProduct[],
  answers: DenimAnswers,
): PublicProduct[] {
  return products.filter((product) => {
    const fabrics = product.attributes.fabric ?? []
    if (!fabrics.some((fabric) => fabric.includes('denim'))) return false

    if (answers.legOpening && product.attributes.legOpening !== answers.legOpening) {
      return false
    }
    if (answers.wash && product.attributes.wash !== answers.wash) return false
    if (answers.stretch && !fabrics.includes('stretch denim')) return false

    return true
  })
}
