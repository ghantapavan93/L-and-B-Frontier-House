import type { MediaRef } from '@/domain/product'
import { MENS_DEMO_MEDIA } from './mens-demo-media.generated'

/**
 * The men's reference photographs, as catalogue media.
 *
 * `mens-demo-media.generated.ts` is written by `scripts/import-mens-demo.mjs` from the
 * owner-dropped frames in `assets/source/mens-reference/`. The demonstration surfaces
 * read it through `DemoImage`; the catalogue reads `MediaRef`. This is the one place the
 * two shapes meet.
 *
 * THE RECORDS CARRY PLACEHOLDERS; THE OVERLAY CARRIES PHOTOGRAPHY. That is the rule the
 * women's line already runs on: a product record never claims a photograph, the media
 * authority (content/media/official-media.ts) overlays one at read time. The men's
 * records follow it. MENS_REFERENCE_MEDIA is that authority's second source, frames per
 * product id, overlaid by officialMediaForProduct exactly as the official manifest is. A
 * frame that arrives named through the import script appears on a product page with no
 * other change.
 */
export function demoMedia(key: string, alt: string): MediaRef {
  const asset = MENS_DEMO_MEDIA[key]
  if (!asset) throw new Error(`mens media key missing: ${key}`)
  return {
    id: `m-${key}`,
    kind: 'image',
    poster: asset.poster,
    aspectRatio: `${asset.intrinsicWidth} / ${asset.intrinsicHeight}`,
    alt,
    // Owner-dropped reference frames — the same provenance the demonstration declares.
    provenance: 'owner-supplied',
    sources: [
      { type: 'image/avif', srcSet: asset.avifSrcSet },
      { type: 'image/webp', srcSet: asset.webpSrcSet },
    ],
    intrinsicWidth: asset.intrinsicWidth,
    intrinsicHeight: asset.intrinsicHeight,
  }
}

/** Reference frames per men's product id. Alt says what the frame shows, never a price. */
export const MENS_REFERENCE_MEDIA: Readonly<Record<string, readonly MediaRef[]>> = {
  'p-mj101-drk': [
    demoMedia(
      'dark-rigid-jean-flat',
      'Dark Rigid Jean, dark indigo five-pocket jean laid flat',
    ),
    demoMedia('dark-rigid-jean-side', 'Dark Rigid Jean, side view worn with a brown belt'),
    demoMedia('dark-rigid-jean-macro', 'Dark Rigid Jean, close view of the dark indigo weave'),
  ],
  'p-mj102-mid': [
    demoMedia(
      'mid-wash-jean-flat',
      'Everyday Mid-Wash Jean, mid-wash five-pocket jean laid flat',
    ),
    demoMedia('mid-wash-jean-model', 'Everyday Mid-Wash Jean, worn full length'),
    demoMedia(
      'mid-wash-jean-front',
      'Everyday Mid-Wash Jean, front waistband with a brown belt',
    ),
    demoMedia(
      'mid-wash-jean-hem',
      'Everyday Mid-Wash Jean, the hem breaking over a western boot',
    ),
  ],
  'p-mj103-lgt': [
    demoMedia('light-wash-jean-flat', 'Light Wash Jean, light wash five-pocket jean laid flat'),
    demoMedia('light-wash-jean-model', 'Light Wash Jean, worn full length'),
    demoMedia('light-wash-jean-hem', 'Light Wash Jean, the clean uncuffed hem'),
  ],
  'p-mj104-boot': [
    demoMedia(
      'bootcut-jean-model',
      'Dark Bootcut Jean, deep indigo bootcut worn over western boots',
    ),
    demoMedia('bootcut-jean-hem', 'Dark Bootcut Jean, the hem sitting over a boot heel'),
    demoMedia('bootcut-jean-drape', 'Dark Bootcut Jean, the drape of the bootcut leg'),
  ],
  'p-mj105-khk': [
    demoMedia('khaki-jean-flat', 'Khaki Five-Pocket Jean, khaki twill five-pocket laid flat'),
    demoMedia('khaki-jean-model', 'Khaki Five-Pocket Jean, worn full length'),
    demoMedia(
      'khaki-jean-pocket',
      'Khaki Five-Pocket Jean, the back pocket and tonal stitching',
    ),
    demoMedia('khaki-jean-side', 'Khaki Five-Pocket Jean, side view'),
  ],
  'p-ms201-rst': [
    demoMedia(
      'stripe-shirt-flat',
      'Stripe Pearl-Snap Shirt, rust stripe western shirt laid flat',
    ),
    demoMedia(
      'floor-cuffing-barn',
      'Stripe Pearl-Snap Shirt, a cuff being turned back while worn',
    ),
  ],
  'p-mo301-ind': [
    demoMedia(
      'denim-jacket-hero',
      'Indigo Trucker Jacket, worn indigo denim jacket open over a tee',
    ),
    demoMedia('denim-jacket-saddle', 'Indigo Trucker Jacket, worn with a saddle-tan belt'),
  ],
  'p-ma401-tan': [
    demoMedia('saddle-belt-flat', 'Saddle Tan Belt, smooth tan leather belt coiled flat'),
    demoMedia('saddle-belt-worn', 'Saddle Tan Belt, worn with dark denim'),
  ],
  'p-ma402-grn': [
    demoMedia(
      'ostrich-belt-flat',
      'Textured Grain Belt, raised grain brown leather belt coiled flat',
    ),
  ],
  'p-ma403-duf': [
    demoMedia(
      'leather-duffel',
      'Leather Weekend Duffel, brown leather duffel with twin handles',
    ),
  ],
}
