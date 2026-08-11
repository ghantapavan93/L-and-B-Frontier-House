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

/**
 * One row of a specification table. `visible` marks a fact the photograph itself proves —
 * a colour, a snap front, a leg opening you can see. Everything else is fixture
 * specification, rendered under a fixture heading, and never presented as stock truth.
 */
export type DemoSpec = {
  readonly term: string
  readonly value: string
  readonly visible?: boolean
}

/** A named detail with the frame that shows it — the anatomy callout. */
export type DemoDetail = {
  readonly label: string
  readonly note: string
  readonly image: DemoImage
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
  /** The editorial opening on the product page. Register, never specification. */
  readonly story?: string
  /** What the photographs show, in a line each. */
  readonly features?: readonly string[]
  /** Construction and material rows. */
  readonly details?: readonly DemoSpec[]
  /** Fit and sizing rows — cut, rise, leg opening, size run. */
  readonly fit?: readonly DemoSpec[]
  /** Material and care rows. */
  readonly care?: readonly DemoSpec[]
  /** Colour names with a swatch value — the swatch is a CSS colour, never a claim. */
  readonly colours?: readonly { readonly name: string; readonly swatch: string }[]
  /** Selectable sizes for the demo size control. */
  readonly sizes?: readonly string[]
  /** Anatomy callouts, each tied to the frame that proves it. */
  readonly anatomy?: readonly DemoDetail[]
  /** Lifestyle frames for "how it is worn". */
  readonly worn?: readonly DemoImage[]
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
    story:
      'The pair you stop thinking about. Mid indigo with the whiskering a season of wear puts in on its own, cut straight enough to sit over a boot without pooling at the ankle.',
    features: [
      'Straight through the thigh and knee',
      'Light whiskering at the hip and seat',
      'Five-pocket western cut',
      'Hem breaks clean over a boot',
    ],
    colours: [{ name: 'Mid Indigo', swatch: '#3f5b7d' }],
    sizes: ['30', '32', '34', '36', '38'],
    details: [
      { term: 'Cut', value: 'Five-pocket, straight leg', visible: true },
      { term: 'Closure', value: 'Button fly with belt loops', visible: true },
      { term: 'Pockets', value: 'Two front, two back patch', visible: true },
    ],
    fit: [
      { term: 'Fit', value: 'Straight' },
      { term: 'Rise', value: 'Mid' },
      { term: 'Leg opening', value: 'Straight to the hem', visible: true },
      { term: 'Waist run', value: '30–38 · fixture run' },
      { term: 'Wash', value: 'Mid indigo', visible: true },
    ],
    care: [
      { term: 'Material', value: 'Denim', visible: true },
      { term: 'Care', value: 'Wash cold, hang dry' },
    ],
    anatomy: [
      {
        label: 'The waistband',
        note: 'Belt loops set wide enough for a full western belt and buckle.',
        image: img('mid-wash-jean-front', 'The waistband and belt of the mid-wash jean'),
      },
      {
        label: 'The hem',
        note: 'Cut to break once over a boot instead of stacking at the ankle.',
        image: img('mid-wash-jean-hem', 'The hem breaking over a western boot'),
      },
    ],
    worn: [
      img('floor-dark-jean-street', 'The straight leg worn on a paved street'),
      img('floor-waist-detail', 'The waistband and belt, worn'),
      img('floor-back-pocket', 'The back pocket of worn denim'),
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
    story:
      'Cut for a heel. The leg opens from the knee so the boot sits under the denim rather than fighting it — the reason the shape has never actually gone anywhere out here.',
    features: [
      'Opens from the knee over a western heel',
      'Deep, even indigo with no fading at the seat',
      'Five-pocket western cut',
    ],
    colours: [{ name: 'Deep Indigo', swatch: '#20304a' }],
    sizes: ['30', '32', '34', '36', '38'],
    details: [
      { term: 'Cut', value: 'Five-pocket, bootcut', visible: true },
      { term: 'Closure', value: 'Button fly with belt loops', visible: true },
    ],
    fit: [
      { term: 'Fit', value: 'Bootcut' },
      { term: 'Rise', value: 'Mid' },
      { term: 'Leg opening', value: 'Opens from the knee', visible: true },
      { term: 'Waist run', value: '30–38 · fixture run' },
      { term: 'Wash', value: 'Deep indigo, unfaded', visible: true },
    ],
    care: [
      { term: 'Material', value: 'Denim', visible: true },
      { term: 'Care', value: 'Wash cold, hang dry' },
    ],
    anatomy: [
      {
        label: 'The opening',
        note: 'The leg widens from the knee, so the boot shaft sits beneath the denim.',
        image: img('bootcut-jean-hem', 'The bootcut hem over a western boot'),
      },
      {
        label: 'The drape',
        note: 'Weight enough to hold a line off the body rather than cling to it.',
        image: img('bootcut-jean-drape', 'The jean draped over a wooden ladder'),
      },
    ],
    worn: [
      img('floor-black-toe', 'A boot toe beneath the dark leg'),
      img('floor-boot-floorboards', 'The hem and boot on floorboards'),
      img('floor-cuffing-barn', 'Cuffing the leg over a boot in a barn'),
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
    story:
      'A shirt that opens with one hand. The stripe is quiet enough for a working week and loud enough to read as western across a room.',
    features: [
      'Snap front, no buttons to lose',
      'Two flap chest pockets, both snapped',
      'Long sleeve with a snapped cuff',
      'Red-brown stripe on a pale ground',
    ],
    colours: [{ name: 'Rust Stripe', swatch: '#9c5a49' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: [
      { term: 'Front', value: 'Snap placket', visible: true },
      { term: 'Pockets', value: 'Two flap chest pockets, snapped', visible: true },
      { term: 'Collar', value: 'Pointed western collar', visible: true },
      { term: 'Sleeve', value: 'Long, snapped cuff', visible: true },
    ],
    fit: [
      { term: 'Fit', value: 'Regular' },
      { term: 'Size run', value: 'S–XXL · fixture run' },
    ],
    care: [
      { term: 'Pattern', value: 'Woven stripe', visible: true },
      { term: 'Care', value: 'Wash cold, warm iron' },
    ],
    anatomy: [
      {
        label: 'The snap front',
        note: 'A placket of pearl snaps — the western fastening, opened with one pull.',
        image: img('stripe-shirt-flat', 'The snap placket and chest pockets of the shirt'),
      },
    ],
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
    story:
      'The layer that goes on last and comes off never. Worn indigo, a pointed yoke across the chest, and a fit that takes a shirt underneath without pulling at the shoulder.',
    features: [
      'Button front with a pointed western yoke',
      'Two chest pockets with flaps',
      'Worn indigo with natural fade at the seams',
      'Cut to layer over a shirt',
    ],
    colours: [{ name: 'Worn Indigo', swatch: '#4a6a8f' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: [
      { term: 'Front', value: 'Button through', visible: true },
      { term: 'Yoke', value: 'Pointed western yoke', visible: true },
      { term: 'Pockets', value: 'Two flap chest pockets', visible: true },
    ],
    fit: [
      { term: 'Fit', value: 'Regular, cut to layer' },
      { term: 'Size run', value: 'S–XXL · fixture run' },
    ],
    care: [
      { term: 'Material', value: 'Denim', visible: true },
      { term: 'Care', value: 'Wash cold, hang dry' },
    ],
    anatomy: [
      {
        label: 'The yoke',
        note: 'The pointed chest yoke — the line that makes a denim jacket a western one.',
        image: img('denim-jacket-hero', 'The chest yoke and button front of the jacket'),
      },
      {
        label: 'In the round',
        note: 'Shown against tooled leather: the register the jacket was cut for.',
        image: img('denim-jacket-saddle', 'The jacket worn beside a tooled western saddle'),
      },
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
    story:
      'Saddle tan, one prong, no ornament. The belt you stop noticing because it never asks for anything.',
    features: [
      'Smooth saddle-tan leather',
      'Brass-tone single-prong buckle',
      'Stitched edge along the full length',
    ],
    colours: [{ name: 'Saddle Tan', swatch: '#a9713f' }],
    sizes: ['32', '34', '36', '38', '40', '42'],
    details: [
      { term: 'Buckle', value: 'Brass-tone, single prong', visible: true },
      { term: 'Edge', value: 'Stitched', visible: true },
      { term: 'Material', value: 'Smooth leather', visible: true },
    ],
    fit: [{ term: 'Size run', value: '32–42 · fixture run' }],
    care: [{ term: 'Care', value: 'Wipe clean, condition as needed' }],
    anatomy: [
      {
        label: 'The buckle',
        note: 'A single prong in brass tone — the plain fastening, not a trophy.',
        image: img('saddle-belt-flat', 'The brass-tone single-prong buckle'),
      },
      {
        label: 'Worn',
        note: 'Through dark denim loops, where the leather does its actual work.',
        image: img('saddle-belt-worn', 'The belt worn through denim loops'),
      },
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

/**
 * THE FLOOR — every remaining frame from the owner's drop, as an editorial contact sheet.
 *
 * The rack above carries the frames that read as product. These are the rest: worn looks,
 * hems breaking over boots, hardware, texture. Several are footwear — not an approved demo
 * category, so they appear here as how the trousers are worn rather than as entries to buy.
 * Nothing in this group carries a name, a size or a price, and the section says what it is.
 */
export const MENS_DEMO_FLOOR: readonly DemoImage[] = [
  img('floor-white-jean-worn', 'Cream jeans worn full length with brown western boots'),
  img('floor-dark-jean-back', 'Dark jeans seen from behind, worn with boots'),
  img('floor-dark-jean-street', 'Dark jeans and boots on a paved street'),
  img('floor-light-jean-side', 'Light blue jeans worn full length, standing'),
  img('floor-light-jean-worn', 'Light-wash jeans worn with a white tee'),
  img('floor-cream-seated', 'Cream trousers and brown boots, seated'),
  img('floor-dark-hem-boot', 'A dark jean hem breaking over a brown boot mid-stride'),
  img('floor-black-toe', 'A black boot toe beneath a dark jean leg'),
  img('floor-boot-floorboards', 'A red-brown boot and jean hem on floorboards'),
  img('floor-boot-rocks', 'A hand adjusting a boot among rocks'),
  img('floor-cuffing-barn', 'A hand cuffing a jean over a boot in a barn'),
  img('floor-boot-crate', 'A boot resting on a wooden crate'),
  img('floor-back-pocket', 'The back pocket of worn dark denim'),
  img('floor-waist-detail', 'A jean waistband and belt, worn'),
  img('floor-denim-texture', 'Light denim weave, photographed close'),
  img('floor-black-boots', 'A pair of black western boots'),
  img('floor-tan-boots', 'A pair of tan western boots'),
  img('floor-brown-boots', 'A pair of brown western boots'),
  img('floor-light-jean-flat', 'Light-wash jeans laid flat'),
  img('floor-pale-jean-flat', 'Pale-wash jeans laid flat'),
]
