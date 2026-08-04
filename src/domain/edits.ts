/**
 * EDITS — merchandising groupings over verified product. Never categories.
 *
 * "Choose your west" sells an identity rather than a garment type, and that is the right
 * instinct: someone who does not consider themselves a cowboy can still see themselves in
 * "the modern west". But an identity label is the easiest place in this whole platform to
 * smuggle in a claim, so two rules bind every entry below.
 *
 *   1. AN EDIT IS A QUERY, NOT A CATEGORY. It owns no URL under /shop, appears in no
 *      taxonomy, and adds nothing to a product record. Deleting this file removes five
 *      routes and changes not one product fact. Taxonomy is the one hard gate on Phase 1
 *      (D-04) and every category slug is a permanent URL commitment; an edit is neither.
 *
 *   2. EVERY EDIT DECLARES ITS OWN RULE, AND THE PAGE SHOWS IT. `matches` below is the
 *      whole definition — no hand-picked slugs, no editorial override, no hidden ordering.
 *      A buyer can read what put a garment in front of them. The moment an edit becomes a
 *      list of product ids someone curated, it stops being a query and starts being a claim
 *      about the clothes.
 *
 * The names are OURS, not the brand's. They are campaign language over a verified
 * catalogue — which §13b permits as "clearly-labelled campaign fiction" — and they describe
 * how a garment reads, never what it is made of or where it came from.
 */

import type { PublicProduct } from './product'

export type Edit = {
  readonly slug: string
  readonly name: string
  /** One line, shown on the card. */
  readonly line: string
  /** The full editorial statement, shown on the edit's own page. */
  readonly blurb: string
  /** Plain-English statement of `matches`, rendered verbatim to the buyer. */
  readonly rule: string
  readonly matches: (product: PublicProduct) => boolean
}

const has = (values: readonly string[] | undefined, wanted: readonly string[]): boolean =>
  (values ?? []).some((value) => wanted.includes(value))

/**
 * Every rule is expressed against attributes extracted from the spec string — the same
 * source the facet panel filters on. Nothing here reads a field the catalogue does not
 * already publish.
 */
export const EDITS: readonly Edit[] = [
  {
    slug: 'working-west',
    name: 'The Working West',
    line: 'Denim that expects a full day.',
    blurb:
      'Denim, chambray and pearl snaps — the pieces that go on before the day starts and are still right at the end of it.',
    rule: 'Denim or chambray, or a pearl snap, cuffed hem or raw hem.',
    matches: (p) =>
      has(p.attributes.fabric, ['denim', 'stretch denim', 'chambray']) ||
      has(p.attributes.detail, ['pearl snap', 'cuffed hem', 'raw hem']),
  },
  {
    slug: 'modern-west',
    name: 'The Modern West',
    line: 'Western as a note, not a costume.',
    blurb:
      'Clean lines and quiet silhouettes. Western enough to read, restrained enough to wear anywhere.',
    rule: 'A straight, wide-leg, bootcut or regular silhouette, and no fringe, studding or tooling.',
    matches: (p) =>
      ['straight', 'wide-leg', 'bootcut', 'regular'].includes(p.attributes.silhouette ?? '') &&
      !has(p.attributes.detail, ['fringe', 'studded', 'tooled', 'concho']),
  },
  {
    slug: 'rodeo-edit',
    name: 'The Rodeo Edit',
    line: 'Made to be seen from the stands.',
    blurb:
      'Fringe, conchos, tooling and serape. The pieces that are the outfit rather than part of one.',
    rule: 'Fringe, concho, studding, tooling or serape stripe, or a horse, horseshoe or Aztec motif.',
    matches: (p) =>
      has(p.attributes.detail, ['fringe', 'concho', 'studded', 'tooled', 'serape stripe']) ||
      has(p.attributes.motif, ['horse', 'horseshoe', 'aztec']),
  },
  {
    slug: 'after-dark',
    name: 'After Dark',
    line: 'Black wash, late set.',
    blurb:
      'Black denim and evening pieces, for the part of the night the photographs are from.',
    rule: 'A black wash, or a mini, midi or one-shoulder silhouette.',
    matches: (p) =>
      p.attributes.wash === 'black' ||
      ['collared mini', 'one-shoulder mini', 'strapless midi'].includes(
        p.attributes.silhouette ?? '',
      ),
  },
]

export function findEdit(slug: string): Edit | undefined {
  return EDITS.find((edit) => edit.slug === slug)
}

/** Products in an edit, in catalogue order. The rule is the only ranking. */
export function productsInEdit(
  edit: Edit,
  products: readonly PublicProduct[],
): PublicProduct[] {
  return products.filter((product) => edit.matches(product))
}

/**
 * Edits carrying at least one published style.
 *
 * An empty edit is not shown. A merchandising grouping that leads to nothing is worse than
 * no grouping at all — it reads as a broken shop rather than as an honest gap, and unlike a
 * category there is no owner decision pending behind it to explain the emptiness.
 */
export function populatedEdits(products: readonly PublicProduct[]): Edit[] {
  return EDITS.filter((edit) => products.some((product) => edit.matches(product)))
}
