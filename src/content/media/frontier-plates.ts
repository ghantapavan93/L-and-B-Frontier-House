import { FRONTIER_PLATE_MEDIA } from '@/fixtures/frontier-plates.generated'
import type { DemoImage } from '@/fixtures/mens-demo'

/**
 * FRONTIER CAMPAIGN PLATES — generated artwork, named as such everywhere it appears.
 *
 * Six plates from the owner's 2026-08-13 drop of generated renders. They carry the
 * campaign register for the men's demonstration: the house name, the tone, the light.
 * They are NOT photography, NOT product truth, and NOT evidence of anything — every
 * surface that mounts one says "generated campaign artwork" in visible text, and every
 * alt below opens with the same words so a screen reader hears the provenance before
 * the description.
 *
 * Two fabrications baked into the source renders never reached `public/`: the invented
 * "EST. 2024" founding date and the "TRUSTED BY GENERATIONS" claim were excised at
 * import (scripts/import-frontier-plates.mjs, public/media/frontier/manifest.json).
 *
 * The "Frontier House" name on the artwork remains a working title pending the owner's
 * decision (D-10) — one more reason these plates live only on demonstration surfaces.
 */

function plate(key: string, alt: string): DemoImage {
  const asset = FRONTIER_PLATE_MEDIA[key]
  if (!asset) throw new Error(`Unknown frontier plate: ${key}`)
  return { asset, alt }
}

/** Wide 16:9 — the campaign title card. Desktop hero of the men's demonstration. */
export const PLATE_CORRAL_WIDE = plate(
  'corral-wide',
  'Generated campaign artwork: "Frontier House by Lucky & Blessed — old materials, new interface." A man in a denim jacket and jeans leans on a corral fence at sunset, a saddle over the rail beside him.',
)

/** Portrait — the storefront title card. Mobile hero, and the homepage split half. */
export const PLATE_STOREFRONT = plate(
  'storefront',
  'Generated campaign artwork: "Frontier House by Lucky & Blessed — old materials, new interface. Discover the drop." A man in a denim shirt and jeans stands on a boardwalk under a Frontier House sign at dusk.',
)

/** Editorial crop — the fabricated founding date was removed from this frame at import. */
export const PLATE_RANCH_ROAD = plate(
  'ranch-road',
  'Generated campaign artwork: a man in a denim jacket and hat leans against an old pickup truck under a stormy sky, with the line "clothing that lives worn, not replaced."',
)

/** The three campaign tiles rescued from the collage render. */
export const PLATE_TILES: readonly DemoImage[] = [
  plate(
    'craft-detail',
    'Generated campaign artwork: a close crop of dark denim back pockets with contrast topstitching, captioned "authentic craftsmanship."',
  ),
  plate(
    'heritage-truck',
    'Generated campaign artwork: a man in a sand-coloured western shirt beside a truck at golden hour, captioned "western heritage."',
  ),
  plate(
    'legacy-boots',
    'Generated campaign artwork: a pair of worn brown western boots on weathered boards, captioned "live your legacy."',
  ),
]

/** The stage behind the Fall 2026 film — recedes as the frame expands over it. */
export const PLATE_CAMPAIGN_BACKDROP = plate(
  'campaign-backdrop',
  'Generated campaign artwork: a man in a dark denim shirt and jeans leans against a weathered barn door beside hay bales, with a ranch fence and mountains under a wide sky.',
)

/** The visible provenance line every mounting surface shows beside a plate. */
export const PLATE_MARKER = 'Generated campaign artwork — not photography'
