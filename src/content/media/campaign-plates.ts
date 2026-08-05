import type { MediaRef } from '@/domain/product'

/**
 * CAMPAIGN PLATES — atmosphere and place, never product.
 *
 * These are the only two images from the 112-plate Stitch mirror that are published, and
 * the ratio is deliberate. Most of that set depicts merchandise that does not exist — a
 * men's collection, an $850 boot, a bespoke atelier — and §12 forbids generated imagery
 * being presented as real product. A plate ships only when it shows MATERIAL or PLACE.
 *
 * Why they are here at all: the catalogue's own photography is 360x540, and the audit is
 * blunt that this "caps the perceived quality of every surface on the site and no render or
 * grade fixes it". The editorial bands were carrying upscaled product shots in slots that
 * wanted a full-bleed photograph. These are 1408px wide and were composed as photographs.
 *
 * `provenance: 'generated-campaign'` is load-bearing. The media integrity suite treats it
 * as not-photography, so a plate can never quietly become a product image, and the
 * reasoning that cleared each one is recorded in `public/media/campaign/manifest.json`
 * beside the files.
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
