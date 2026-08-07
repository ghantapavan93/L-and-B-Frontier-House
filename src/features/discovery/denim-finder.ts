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
  readonly silhouette?: string
  readonly wash?: string
  /** True when the buyer asked for stretch. Matches fabric containing stretch denim. */
  readonly stretch?: boolean
}

/** The silhouettes that exist in the published line. An unknown value is dropped. */
export const DENIM_SILHOUETTES = [
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
  const silhouette = single(params, 'silhouette')
  const wash = single(params, 'wash')

  return {
    ...(silhouette && DENIM_SILHOUETTES.some((s) => s.value === silhouette)
      ? { silhouette }
      : {}),
    ...(wash && DENIM_WASHES.some((w) => w.value === wash) ? { wash } : {}),
    ...(single(params, 'stretch') === 'yes' ? { stretch: true } : {}),
  }
}

/** True when the visitor has answered at least one question. */
export function hasAnswers(answers: DenimAnswers): boolean {
  return Boolean(answers.silhouette || answers.wash || answers.stretch)
}

/** Denim only, then each answered question narrows. Unanswered questions exclude nothing. */
export function matchDenim(
  products: readonly PublicProduct[],
  answers: DenimAnswers,
): PublicProduct[] {
  return products.filter((product) => {
    const fabrics = product.attributes.fabric ?? []
    if (!fabrics.some((fabric) => fabric.includes('denim'))) return false

    if (answers.silhouette && product.attributes.silhouette !== answers.silhouette) {
      return false
    }
    if (answers.wash && product.attributes.wash !== answers.wash) return false
    if (answers.stretch && !fabrics.includes('stretch denim')) return false

    return true
  })
}
