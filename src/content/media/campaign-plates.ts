import type { MediaRef } from '@/domain/product'
import { PLATE_ASSETS } from './campaign-plates.generated'
import type { PlateSlug } from './campaign-plates.generated'

/**
 * CAMPAIGN PLATES — atmosphere and place, never product.
 *
 * Twenty-eight of the 112 mirrored Stitch plates are published, each reviewed by eye
 * against §12 before inclusion: MATERIAL, HARDWARE, PLACE or MAKING only. No generated
 * person presented as a person, no garment presented as product, no menswear, no
 * footwear-as-merchandise, no mockup chrome. The clearance reasoning for every plate is
 * recorded in `public/media/campaign/manifest.json` beside the files.
 *
 * Why they are here at all: the catalogue's own photography is 360x540, and the audit is
 * blunt that this "caps the perceived quality of every surface on the site and no render or
 * grade fixes it". These are 1408px and were composed as photographs — they are what lets
 * the pages run reference-grade media density while the real photography is commissioned.
 *
 * `provenance: 'generated-campaign'` is load-bearing. The media integrity suite treats it
 * as not-photography, so a plate can never quietly become a product image. Every rendering
 * carries a campaign caption at the point of use.
 */

function plate(
  slug: string,
  widths: readonly number[],
  alt: string,
  aspectRatio: string,
  intrinsicWidth: number,
  intrinsicHeight: number,
): MediaRef {
  const srcSet = (format: string) =>
    widths.map((w) => `/media/campaign/${slug}-${w}.${format} ${w}w`).join(', ')

  return {
    id: `campaign-${slug}`,
    kind: 'image',
    poster: `/media/campaign/${slug}-${widths[0]}.webp`,
    aspectRatio,
    alt,
    provenance: 'generated-campaign',
    sources: [
      { type: 'image/avif', srcSet: srcSet('avif') },
      { type: 'image/webp', srcSet: srcSet('webp') },
    ],
    intrinsicWidth,
    intrinsicHeight,
  }
}

/** Alt text per plate. Mirrors the manifest entries — the manifest is the audit record. */
const PLATE_ALTS: Record<PlateSlug, string> = {
  'leather-bench': 'A leatherworker’s bench covered in cut hides, tools and hardware',
  'tooled-leather': 'Floral hand-tooling carved into saddle-tan leather, photographed close',
  'indigo-thread': 'A wooden spool wound with indigo thread',
  'embossed-leather': 'Concentric western tooling embossed into near-black leather',
  'denim-weave': 'Heavyweight indigo denim, the twill line legible',
  'selvedge-beam': 'A raking beam of light across dark denim weave',
  'buckle-denim': 'An engraved silver buckle on worn leather over indigo denim',
  'hardware-bench': 'Rows of silver hardware laid out on a workbench',
  'longhorn-buckle': 'A longhorn buckle with turquoise points on a tooled belt over denim',
  'high-dunes': 'Wind-carved dunes under low desert light',
  'pearl-snaps': 'Loose pearl snaps and a spool of thread on denim',
  'selvedge-stitch': 'A selvedge seam with contrast stitching, photographed close',
  'night-set': 'A film crew lighting a wet street at night',
  'khaki-twill': 'Khaki cotton twill, the diagonal weave legible',
  'warehouse-aisle': 'A high warehouse aisle receding in black and white',
  'felt-hat': 'A dark felt hat resting on boarded wood',
  'tan-belt': 'A saddle-tan belt coiled on a pale ground',
  'engraved-buckle': 'An engraved silver buckle standing on blackened wood',
  'rawhide-tools': 'Rawhide unrolled beside stitching tools',
  'denim-slub': 'Washed denim weave, slubs legible',
  'rack-aisle': 'A garment rack aisle receding in cool light',
  'saddle-stitch': 'Saddle stitching along a leather edge, photographed close',
  'tooled-belt-rock': 'A tooled belt with a silver buckle laid over weathered rock',
  'showroom-bench': 'A woven blanket over a bench in an empty showroom',
  'snap-macro': 'A mother-of-pearl snap set into indigo denim',
  'denim-blue': 'Bright indigo denim weave, photographed close',
}

/** A MediaRef from the generated atmosphere manifest. */
export function atmospherePlate(slug: PlateSlug): MediaRef {
  const asset = PLATE_ASSETS[slug]
  return {
    id: `campaign-${slug}`,
    kind: 'image',
    poster: asset.poster,
    aspectRatio: `${asset.intrinsicWidth} / ${asset.intrinsicHeight}`,
    alt: PLATE_ALTS[slug],
    provenance: 'generated-campaign',
    sources: [
      { type: 'image/avif', srcSet: asset.avifSrcSet },
      { type: 'image/webp', srcSet: asset.webpSrcSet },
    ],
    intrinsicWidth: asset.intrinsicWidth,
    intrinsicHeight: asset.intrinsicHeight,
  }
}

/**
 * The material thesis, as a photograph. Worn denim, a scratched buckle, a hand — the
 * "weave and topstitch are legible" image the North Star asks for and the 360px catalogue
 * cannot produce.
 */
export const MATERIAL_PLATE = plate(
  'material-denim-buckle',
  [1408, 1024, 768, 480],
  'A hand resting on a worn leather belt with a scratched silver buckle, over heavyweight indigo denim, photographed close in black and white',
  '1408 / 700',
  1408,
  700,
)

/**
 * Place. Cropped to the left of the source frame so the walking figure is gone entirely —
 * it reads male, and menswear does not exist (D-03). Landscape and light claim nothing.
 */
export const PLACE_PLATE = plate(
  'place-high-desert',
  [820, 640, 480],
  'A high desert at golden hour, low sun raking across pale rock and scrub toward distant hills',
  '820 / 700',
  820,
  700,
)

/**
 * The grid-break rotation. A long product run pauses on a different macro each time, the
 * way a contact sheet interleaves detail frames — instead of the same plate repeated,
 * which read as a stuck carousel by the third break.
 */
export const GRID_BREAK_PLATES: readonly MediaRef[] = [
  MATERIAL_PLATE,
  atmospherePlate('denim-weave'),
  atmospherePlate('pearl-snaps'),
  atmospherePlate('tooled-leather'),
  atmospherePlate('selvedge-stitch'),
  atmospherePlate('longhorn-buckle'),
  atmospherePlate('khaki-twill'),
  atmospherePlate('saddle-stitch'),
]

/** The campaign register band: cinema, land, warehouse. */
export const REGISTER_TRIPTYCH: readonly MediaRef[] = [
  atmospherePlate('night-set'),
  atmospherePlate('high-dunes'),
  atmospherePlate('warehouse-aisle'),
]

/**
 * Category tiles while photography is pending: material and hardware stand in for the
 * category without depicting a garment that does not exist. Replaced by owner photography
 * per slot the day it lands.
 */
export const CATEGORY_TILE_FALLBACK: Record<string, MediaRef> = {
  women: atmospherePlate('denim-blue'),
  girls: atmospherePlate('snap-macro'),
  accessories: atmospherePlate('longhorn-buckle'),
}
