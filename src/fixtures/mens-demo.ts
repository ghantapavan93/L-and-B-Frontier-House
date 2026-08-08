/**
 * MEN'S DEMO RACK — fixture products for the Frontier House demonstration surface.
 *
 * D-03 is unresolved: the business sells no men's product today, and nothing here may
 * become a capability claim. This module therefore lives OUTSIDE the catalogue entirely —
 * these are not ProductRecords, they enter no repository, no search index, no facet, no
 * sitemap and no product route. They render on the /mens demonstration page only, flagged
 * as fixtures, with reference imagery that is replaced before anything ships (D-09).
 *
 * Two content rules bind every entry (CLAUDE.md §12):
 *   - The description states only what is visible in the photographs.
 *   - No price exists here in any form — not wholesale, not MSRP, not a fixture figure.
 *
 * Boots appear in several reference photographs. Footwear is not an approved demo
 * category (the brief gates it on owner approval), so boots occur only inside campaign
 * frames — never as a product entry.
 */

import { MENS_DEMO_MEDIA } from './mens-demo-media.generated'
import type { MensDemoAsset } from './mens-demo-media.generated'

export type DemoCategory = 'Denim' | 'Shirts' | 'Outerwear' | 'Accessories'

export type DemoImage = {
  readonly asset: MensDemoAsset
  readonly alt: string
}

export type DemoProduct = {
  readonly slug: string
  readonly name: string
  readonly category: DemoCategory
  /** Visible facts only. */
  readonly description: string
  /** Clearly a fixture run, never a stocked claim. */
  readonly sizesNote: string
  /** First image is the card face; second, when present, is the hover swap. */
  readonly media: readonly DemoImage[]
}

function img(key: string, alt: string): DemoImage {
  const asset = MENS_DEMO_MEDIA[key]
  if (!asset) throw new Error(`mens-demo media key missing: ${key}`)
  return { asset, alt }
}

const DENIM_SIZES = 'Waist 30–38 · fixture run'

export const MENS_DEMO_PRODUCTS: readonly DemoProduct[] = [
  {
    slug: 'dark-rigid-jean',
    name: 'Dark Rigid Jean',
    category: 'Denim',
    description:
      'Five-pocket jean in a dark, even indigo with a straight leg and contrast stitching.',
    sizesNote: DENIM_SIZES,
    media: [
      img('dark-rigid-jean-flat', 'Dark indigo five-pocket jean, laid flat'),
      img('dark-rigid-jean-side', 'Side view of the dark jean worn with a brown belt'),
      img('dark-rigid-jean-macro', 'Close weave of the dark indigo denim'),
    ],
  },
  {
    slug: 'everyday-mid-jean',
    name: 'Everyday Mid-Wash Jean',
    category: 'Denim',
    description:
      'Mid-wash jean with light whiskering at the hip, worn with a leather belt. Straight through the leg.',
    sizesNote: DENIM_SIZES,
    media: [
      img('mid-wash-jean-flat', 'Mid-wash five-pocket jean, laid flat'),
      img('mid-wash-jean-model', 'Mid-wash jean worn full length'),
      img('mid-wash-jean-front', 'Front waistband of the mid-wash jean with a brown belt'),
      img('mid-wash-jean-hem', 'Mid-wash hem breaking over a western boot'),
    ],
  },
  {
    slug: 'light-wash-jean',
    name: 'Light Wash Jean',
    category: 'Denim',
    description: 'Pale, even light wash with a straight leg and a clean, uncuffed hem.',
    sizesNote: DENIM_SIZES,
    media: [
      img('light-wash-jean-flat', 'Light-wash five-pocket jean, laid flat'),
      img('light-wash-jean-model', 'Light-wash jean worn full length'),
      img('light-wash-jean-hem', 'Light-wash hems stacked over brown western boots'),
    ],
  },
  {
    slug: 'dark-bootcut-jean',
    name: 'Dark Bootcut Jean',
    category: 'Denim',
    description:
      'Deep-wash jean cut to sit over a western heel, with a wider opening at the hem.',
    sizesNote: DENIM_SIZES,
    media: [
      img('bootcut-jean-model', 'Dark bootcut jean worn full length'),
      img('bootcut-jean-hem', 'Bootcut hem draped over an exotic-grain western boot'),
      img('bootcut-jean-drape', 'The dark jean draped over a wooden ladder'),
    ],
  },
  {
    slug: 'khaki-five-pocket-jean',
    name: 'Khaki Five-Pocket Jean',
    category: 'Denim',
    description:
      'Five-pocket cut in a warm khaki twill, with tonal stitching and a straight leg.',
    sizesNote: DENIM_SIZES,
    media: [
      img('khaki-jean-flat', 'Khaki five-pocket jean, laid flat'),
      img('khaki-jean-model', 'Khaki jean worn full length'),
      img('khaki-jean-pocket', 'Back-pocket stitching on the khaki twill'),
      img('khaki-jean-side', 'Side of the khaki jean worn with a dark belt'),
    ],
  },
  {
    slug: 'stripe-pearl-snap-shirt',
    name: 'Stripe Pearl-Snap Shirt',
    category: 'Shirts',
    description:
      'Long-sleeve western shirt in a red-brown stripe with a snap front and two flap chest pockets.',
    sizesNote: 'S–XXL · fixture run',
    media: [img('stripe-shirt-flat', 'Striped snap-front western shirt, laid flat')],
  },
  {
    slug: 'indigo-trucker-jacket',
    name: 'Indigo Trucker Jacket',
    category: 'Outerwear',
    description:
      'Button-front denim jacket in a worn indigo, shown open over a tee with a felt hat.',
    sizesNote: 'S–XXL · fixture run',
    media: [
      img('denim-jacket-hero', 'Indigo denim trucker jacket worn open, with a cream hat'),
      img('denim-jacket-saddle', 'The denim jacket worn beside a tooled western saddle'),
    ],
  },
  {
    slug: 'saddle-tan-belt',
    name: 'Saddle Tan Belt',
    category: 'Accessories',
    description: 'Smooth tan leather belt with a brass-tone single-prong buckle.',
    sizesNote: '32–42 · fixture run',
    media: [
      img('saddle-belt-flat', 'Tan leather belt with a brass-tone buckle, coiled flat'),
      img('saddle-belt-worn', 'The tan belt worn through dark denim loops'),
    ],
  },
  {
    slug: 'textured-grain-belt',
    name: 'Textured Grain Belt',
    category: 'Accessories',
    description: 'Brown belt in a raised exotic-grain leather with a silver-tone buckle.',
    sizesNote: '32–42 · fixture run',
    media: [img('ostrich-belt-flat', 'Textured brown leather belt with a silver-tone buckle')],
  },
  {
    slug: 'leather-weekend-duffel',
    name: 'Leather Weekend Duffel',
    category: 'Accessories',
    description: 'Brown leather duffel with twin carry handles, held waist-high.',
    sizesNote: 'One size',
    media: [img('leather-duffel', 'Brown leather duffel bag held by its handles')],
  },
] as const

export const MENS_DEMO_CATEGORIES: readonly DemoCategory[] = [
  'Denim',
  'Shirts',
  'Outerwear',
  'Accessories',
]

/** Campaign frames — context imagery only, never a product entry (footwear is not a demo category). */
export const MENS_DEMO_CAMPAIGN: readonly DemoImage[] = [
  img('campaign-gravel', 'Work boot mid-step on gravel — campaign reference frame'),
  img(
    'campaign-boot-pull',
    'Figure in a plaid shirt pulling on a boot — campaign reference frame',
  ),
]
