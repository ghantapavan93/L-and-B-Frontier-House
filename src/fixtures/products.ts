/**
 * CATALOGUE FIXTURES, BUILT AROUND OWNER-APPROVED PHOTOGRAPHY.
 *
 * Each women's entry corresponds to one real garment in the photography Lucky & Blessed
 * supplied for this project, identified by the style code in their own filename. That
 * pairing is the point: a real photograph next to an unrelated invented product would be a
 * false claim about what is being sold, which is exactly what CLAUDE.md §12 forbids.
 *
 * What is REAL here: the photograph, the style code, and the garment description — every
 * description states only what is visible in the image, verified in scripts/owner-approved-mapping.ts.
 *
 * What is still a DEVELOPMENT FIXTURE, labelled as such at every point of render: prices,
 * MSRP, pack composition, SKU suffixes, size runs, measurements and availability. None of
 * that came from Lucky & Blessed and none of it may be treated as real.
 *
 * PRODUCT_RECORDS carries restricted wholesale terms and must only ever be imported by
 * `src/data`. The lint config enforces this; the authorisation seam enforces the rest.
 *
 * Constraints held by test, not by convention:
 *   - Wholesale prices inside the VERIFIED $7–$33 band; MSRP inside the implied $20–$85 band.
 *   - Prepacks total 6 units — the verified prepack structure.
 *   - No menswear, no footwear, no fabricated heritage, sourcing attribution or named person.
 *   - Slugs are name-derived and contain no numeric price pattern.
 */

import { usd } from '@/domain/money'
import type { MediaRef, ProductRecord } from '@/domain/product'
import { FIXTURE_MEDIA_PROVENANCE } from './notice'
import { GIRLS_RANGE, ONE_SIZE, WOMENS_EXTENDED, WOMENS_STRAIGHT } from './size-ranges'

/**
 * The fallback every product carries. Owner-approved photography is overlaid on top of it in
 * the catalogue repository; where none exists, this honest placeholder is what ships.
 */
function placeholderMedia(id: string, alt: string): MediaRef {
  return {
    id,
    kind: 'image',
    poster: '/media/fixture-placeholder.svg',
    aspectRatio: '4 / 5',
    alt,
    provenance: FIXTURE_MEDIA_PROVENANCE,
  }
}

/** Standard 6-unit prepack for a four-size straight run. */
const STRAIGHT_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: 'S', quantity: 1 },
    { size: 'M', quantity: 2 },
    { size: 'L', quantity: 2 },
    { size: 'XL', quantity: 1 },
  ],
  openSizing: false,
} as const

const EXTENDED_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: '1X', quantity: 2 },
    { size: '2X', quantity: 2 },
    { size: '3X', quantity: 2 },
  ],
  openSizing: false,
} as const

const GIRLS_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: '7', quantity: 1 },
    { size: '8', quantity: 1 },
    { size: '10', quantity: 2 },
    { size: '12', quantity: 1 },
    { size: '14', quantity: 1 },
  ],
  openSizing: false,
} as const

const OPEN_SIZING_PREPACK = { totalUnits: 6, breakdown: [], openSizing: true } as const

const STANDARD_STOCK = [
  { size: 'S', units: 38 },
  { size: 'M', units: 62 },
  { size: 'L', units: 64 },
  { size: 'XL', units: 35 },
  { size: '1X', units: 29 },
  { size: '2X', units: 24 },
  { size: '3X', units: 17 },
] as const

const TERMS = 'Net 30 for approved accounts. Prepacks ship complete.'

export const PRODUCT_RECORDS: readonly ProductRecord[] = [
  /* ── Jeans ───────────────────────────────────────────────────────────── */
  {
    id: 'p-je334-dw',
    slug: 'dark-wash-high-rise-flare-jean',
    displayName: 'Dark Wash Flare',
    specName: 'Dark Wash High Rise Flare Jeans',
    categorySlug: 'women',
    description:
      'A high-rise flare cut in dark wash denim, clean through the hip and opening from the ' +
      'knee. Photographed on a straight-size fit model at full length.',
    attributes: {
      wash: 'dark',
      fabric: ['denim'],
      legOpening: 'flare',
      colour: [{ name: 'Dark Wash' }],
    },
    media: [placeholderMedia('m-je334', 'Dark Wash Flare jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'JE334-DW',
      wholesalePrice: usd(3100),
      msrp: usd(8200),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(18600),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je322-dw',
    slug: 'dark-wash-bootcut-jean',
    displayName: 'Dark Wash Bootcut',
    specName: 'Dark Wash Bootcut Jeans',
    categorySlug: 'women',
    description:
      'A bootcut leg in dark wash denim, cut to sit over a boot shaft. Shown styled with a ' +
      'white pearl-snap western shirt.',
    attributes: {
      wash: 'dark',
      fabric: ['denim'],
      legOpening: 'bootcut',
      colour: [{ name: 'Dark Wash' }],
    },
    media: [placeholderMedia('m-je322', 'Dark Wash Bootcut jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-01',
    isFixture: true,
    wholesale: {
      sku: 'JE322-DW',
      wholesalePrice: usd(3000),
      msrp: usd(7800),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(18000),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je305-dw',
    slug: 'black-wash-wide-leg-jean',
    displayName: 'Black Wash Wide Leg',
    specName: 'Black Wash Wide Leg Jeans',
    categorySlug: 'women',
    description:
      'A wide leg in a deep black wash, falling straight from the hip. Photographed from ' +
      'behind to show the rear yoke and pocket stitching.',
    attributes: {
      wash: 'black',
      fabric: ['denim'],
      legOpening: 'wide-leg',
      colour: [{ name: 'Black Wash' }],
    },
    media: [placeholderMedia('m-je305', 'Black Wash Wide Leg jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-01',
    isFixture: true,
    wholesale: {
      sku: 'JE305-DW',
      wholesalePrice: usd(3000),
      msrp: usd(7800),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(18000),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je587-mw',
    slug: 'mid-wash-cuffed-wide-leg-jean',
    displayName: 'Mid Wash Cuffed Wide Leg',
    specName: 'Mid Wash Wide Leg Jeans with Turned Cuff',
    categorySlug: 'women',
    description:
      'A wide leg in mid wash denim finished with a turned-up cuff at the hem. Shown from ' +
      'behind over a pale graphic tee.',
    attributes: {
      wash: 'mid',
      fabric: ['denim'],
      detail: ['cuffed hem'],
      legOpening: 'wide-leg',
      colour: [{ name: 'Mid Wash' }],
    },
    media: [placeholderMedia('m-je587', 'Mid Wash Cuffed Wide Leg jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'JE587-MW',
      wholesalePrice: usd(2900),
      msrp: usd(7600),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(17400),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je274-lw',
    slug: 'light-wash-straight-leg-jean',
    displayName: 'Light Wash Straight Leg',
    specName: 'Light Wash Straight Leg Jeans with Raw Hem',
    categorySlug: 'women',
    description:
      'A straight leg in light wash denim with a raw, unfinished hem. Photographed from ' +
      'behind against a brick wall.',
    attributes: {
      wash: 'light',
      fabric: ['denim'],
      detail: ['raw hem'],
      legOpening: 'straight',
      colour: [{ name: 'Light Wash' }],
    },
    media: [placeholderMedia('m-je274', 'Light Wash Straight Leg jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'JE274-LW',
      wholesalePrice: usd(2800),
      msrp: usd(7400),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(16800),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je386-leo',
    slug: 'leopard-print-jean',
    displayName: 'Leopard Print Jean',
    specName: 'Leopard Print Denim Jeans',
    categorySlug: 'women',
    description:
      'An all-over leopard print on denim, cut straight through the leg. Shown from behind ' +
      'with a plain white top.',
    attributes: {
      fabric: ['denim'],
      motif: ['leopard'],
      legOpening: 'straight',
      colour: [{ name: 'Leopard' }],
    },
    media: [placeholderMedia('m-je386', 'Leopard Print jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'JE386-LEO',
      wholesalePrice: usd(3100),
      msrp: usd(8000),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(18600),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-je384-leo',
    slug: 'leopard-print-tie-waist-flare',
    displayName: 'Leopard Tie-Waist Flare',
    specName: 'Leopard Print Flare Trousers with Drawstring Waist',
    categorySlug: 'women',
    description:
      'A soft flare in leopard print with a drawstring tie at the waist. Photographed from ' +
      'behind with a ribbed top.',
    attributes: {
      motif: ['leopard'],
      detail: ['drawstring waist'],
      legOpening: 'flare',
      colour: [{ name: 'Leopard' }],
    },
    media: [placeholderMedia('m-je384', 'Leopard Tie-Waist Flare, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'pre-order',
    preOrder: {
      shipWindowStart: '2026-09-15',
      shipWindowEnd: '2026-09-30',
      terms:
        'Pre-order quantities are confirmed at production. Cancellation is available until ' +
        'the ship window opens.',
    },
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'JE384-LEO',
      wholesalePrice: usd(2700),
      msrp: usd(7000),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(16200),
      stockBySize: [],
      terms: 'Net 30 for approved accounts. Pre-order — production allocation applies.',
    },
  },
  {
    id: 'p-je393-btst',
    slug: 'western-swirl-printed-jean',
    displayName: 'Western Swirl Printed Jean',
    specName: 'Tonal Western Swirl Printed Jeans',
    categorySlug: 'women',
    description:
      'An all-over tonal western swirl print on dark denim. Shown full length with a white ' +
      'shirt and boots.',
    attributes: {
      wash: 'dark',
      fabric: ['denim'],
      motif: ['western swirl'],
      legOpening: 'straight',
      colour: [{ name: 'Dark Wash' }],
    },
    media: [placeholderMedia('m-je393', 'Western Swirl Printed jean, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'JE393-BTST',
      wholesalePrice: usd(3200),
      msrp: usd(8400),
      moq: 6,
      prepack: EXTENDED_PREPACK,
      packPrice: usd(19200),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },

  /* ── Dresses ─────────────────────────────────────────────────────────── */
  {
    id: 'p-dr047-blk',
    slug: 'black-one-shoulder-fringe-mini-dress',
    displayName: 'One-Shoulder Fringe Mini',
    specName: 'Black One Shoulder Mini Dress with Sleeve Fringe',
    categorySlug: 'women',
    description:
      'A fitted black mini dress cut on one shoulder, with long fringe falling the length ' +
      'of the single sleeve.',
    attributes: {
      wash: 'black',
      detail: ['fringe'],
      silhouette: 'one-shoulder mini',
      sleeve: 'one long sleeve',
      colour: [{ name: 'Black' }],
    },
    media: [placeholderMedia('m-dr047', 'One-Shoulder Fringe Mini dress, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'DR047-BLK',
      wholesalePrice: usd(2600),
      msrp: usd(6800),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(15600),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-dr381-aw',
    slug: 'chambray-asymmetric-ruffle-midi-dress',
    displayName: 'Asymmetric Ruffle Midi',
    specName: 'Chambray Strapless Tiered Ruffle Midi Dress',
    categorySlug: 'women',
    description:
      'A strapless midi in pale chambray, tiered with asymmetric ruffles and finished with ' +
      'a high-low hem. Shown belted.',
    attributes: {
      wash: 'light',
      fabric: ['chambray'],
      detail: ['ruffle', 'tiered'],
      silhouette: 'strapless midi',
      colour: [{ name: 'Chambray' }],
    },
    media: [placeholderMedia('m-dr381', 'Asymmetric Ruffle Midi dress, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-01',
    isFixture: true,
    wholesale: {
      sku: 'DR381-AW',
      wholesalePrice: usd(2900),
      msrp: usd(7600),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(17400),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-dr505-blk',
    slug: 'black-fringe-sleeve-embroidered-mini-dress',
    displayName: 'Fringe Sleeve Mini',
    specName: 'Black Collared Mini Dress with Fringe Sleeves and Embroidered Hem',
    categorySlug: 'women',
    description:
      'A black collared mini dress with fringed short sleeves and a white embroidered ' +
      'swirl motif running across the hem.',
    attributes: {
      wash: 'black',
      detail: ['fringe', 'embroidery'],
      silhouette: 'collared mini',
      sleeve: 'short sleeve',
      colour: [{ name: 'Black' }],
    },
    media: [placeholderMedia('m-dr505', 'Fringe Sleeve Mini dress, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'DR505-BLK',
      wholesalePrice: usd(2500),
      msrp: usd(6600),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(15000),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },

  /* ── Outerwear and vests ─────────────────────────────────────────────── */
  {
    id: 'p-jo390-blk',
    slug: 'black-long-fringe-vest',
    displayName: 'Long Fringe Vest, Black',
    specName: 'Black Long Fringe Vest',
    categorySlug: 'women',
    description:
      'An open-front vest with fringe falling well below the knee. Shown in black over a ' +
      'tan top with a concho belt.',
    attributes: {
      wash: 'black',
      detail: ['fringe'],
      silhouette: 'open front vest',
      colour: [{ name: 'Black' }],
    },
    media: [placeholderMedia('m-jo390blk', 'Long Fringe Vest in black, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'JO390-BLK',
      wholesalePrice: usd(3300),
      msrp: usd(8500),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(19800),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-jo390-cml',
    slug: 'camel-long-fringe-vest',
    displayName: 'Long Fringe Vest, Camel',
    specName: 'Camel Long Fringe Vest',
    categorySlug: 'women',
    description:
      'The same open-front long fringe vest in camel, photographed close to show the full ' +
      'drop of the fringe.',
    attributes: {
      detail: ['fringe'],
      silhouette: 'open front vest',
      colour: [{ name: 'Camel' }],
    },
    media: [placeholderMedia('m-jo390cml', 'Long Fringe Vest in camel, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'JO390-CML',
      wholesalePrice: usd(3300),
      msrp: usd(8500),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(19800),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-jo632',
    slug: 'studded-fringe-poncho',
    displayName: 'Studded Fringe Poncho',
    specName: 'Fringed Poncho with Horse Appliqué and Stud Detail',
    categorySlug: 'women',
    description:
      'A deep brown fringed poncho with a horse-head appliqué across the back and studded ' +
      'detailing along the seams.',
    attributes: {
      detail: ['fringe', 'studded', 'appliqué'],
      motif: ['horse'],
      silhouette: 'poncho',
      colour: [{ name: 'Brown' }],
    },
    media: [placeholderMedia('m-jo632', 'Studded Fringe Poncho, photography pending')],
    sizeRanges: [ONE_SIZE],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'JO632',
      wholesalePrice: usd(3300),
      msrp: usd(8500),
      moq: 6,
      prepack: OPEN_SIZING_PREPACK,
      packPrice: usd(19800),
      stockBySize: [{ size: 'One size', units: 46 }],
      terms: 'Net 30 for approved accounts. Open sizing — select quantities at checkout.',
    },
  },
  {
    id: 'p-kd039-ser',
    slug: 'serape-stripe-fringe-vest',
    displayName: 'Serape Fringe Vest',
    specName: 'Serape Stripe Woven Fringe Vest',
    categorySlug: 'women',
    description:
      'A woven serape-stripe vest with suede fringe, photographed from behind to show the ' +
      'full stripe pattern across the back.',
    attributes: {
      fabric: ['woven'],
      detail: ['fringe', 'serape stripe'],
      silhouette: 'open front vest',
      colour: [{ name: 'Multi' }],
    },
    media: [placeholderMedia('m-kd039', 'Serape Fringe Vest, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'KD039-SER',
      wholesalePrice: usd(3200),
      msrp: usd(8200),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(19200),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },

  /* ── Tops ────────────────────────────────────────────────────────────── */
  {
    id: 'p-to1069-cmlazt',
    slug: 'camel-aztec-print-long-sleeve-top',
    displayName: 'Aztec Long Sleeve',
    specName: 'Camel Aztec Print Long Sleeve Top',
    categorySlug: 'women',
    description:
      'A fitted long sleeve top in a camel aztec print. Shown styled with turquoise ' +
      'jewellery and a coin belt.',
    attributes: {
      motif: ['aztec'],
      sleeve: 'long sleeve',
      colour: [{ name: 'Camel' }],
    },
    media: [placeholderMedia('m-to1069', 'Aztec Long Sleeve top, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-01',
    isFixture: true,
    wholesale: {
      sku: 'TO1069-CMLAZT',
      wholesalePrice: usd(1600),
      msrp: usd(4200),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(9600),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-to588-s',
    slug: 'aztec-print-graphic-tee',
    displayName: 'Aztec Graphic Tee',
    specName: 'Cream Aztec Geometric Print Short Sleeve Tee',
    categorySlug: 'women',
    description:
      'A soft cream tee carrying a large aztec geometric print in teal, orange and black ' +
      'across the chest.',
    attributes: {
      motif: ['aztec'],
      sleeve: 'short sleeve',
      colour: [{ name: 'Cream' }],
    },
    media: [placeholderMedia('m-to588', 'Aztec Graphic Tee, photography pending')],
    sizeRanges: [WOMENS_STRAIGHT, WOMENS_EXTENDED],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'TO588-S',
      wholesalePrice: usd(1200),
      msrp: usd(3200),
      moq: 6,
      prepack: STRAIGHT_PREPACK,
      packPrice: usd(7200),
      stockBySize: [...STANDARD_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-pearl-snap-sleeveless',
    slug: 'sleeveless-pearl-snap-western-top',
    displayName: 'Sleeveless Pearl Snap',
    specName: 'Sleeveless Pearl Snap Western Top, Aztec Print',
    categorySlug: 'women',
    description:
      'A sleeveless western top with pearl snap closures in a pink and grey aztec print. ' +
      'Photographed on an extended-size fit model.',
    attributes: {
      motif: ['aztec'],
      detail: ['pearl snap'],
      sleeve: 'sleeveless',
      colour: [{ name: 'Pink Aztec' }],
    },
    media: [placeholderMedia('m-pearlsnap', 'Sleeveless Pearl Snap top, photography pending')],
    // The owner's own filename records this as a curvy-size photograph.
    sizeRanges: [WOMENS_EXTENDED],
    availability: 'in-stock',
    newArrivalOn: '2026-08-02',
    isFixture: true,
    wholesale: {
      sku: 'TO-PSSL-AZT',
      wholesalePrice: usd(1800),
      msrp: usd(4800),
      moq: 6,
      prepack: EXTENDED_PREPACK,
      packPrice: usd(10800),
      stockBySize: [
        { size: '1X', units: 31 },
        { size: '2X', units: 26 },
        { size: '3X', units: 19 },
      ],
      terms: TERMS,
    },
  },

  /* ── Girls and Accessories — no owner photography supplied yet ────────── */
  {
    id: 'p-ranch-ruffle-short',
    slug: 'ranch-ruffle-hem-denim-short',
    displayName: 'Ranch Ruffle Short',
    specName: 'Light Wash Stretch Denim Ruffle Hem Shorts (5in Inseam)',
    categorySlug: 'girls',
    description:
      'A pull-on denim short with a gathered ruffle at the hem. Soft stretch denim with a ' +
      'covered elastic waist.',
    attributes: {
      wash: 'light',
      fabric: ['stretch denim'],
      detail: ['ruffle'],
      inseam: '5in',
      colour: [{ name: 'Light Indigo' }],
    },
    media: [
      placeholderMedia(
        'm-ruffle-1',
        'Placeholder for a photograph of the Ranch Ruffle Short in light-wash denim, showing the gathered ruffle hem.',
      ),
    ],
    sizeRanges: [GIRLS_RANGE],
    availability: 'in-stock',
    newArrivalOn: '2026-08-01',
    isFixture: true,
    wholesale: {
      sku: 'LB-RRS-LTI',
      wholesalePrice: usd(900),
      msrp: usd(2600),
      moq: 6,
      prepack: GIRLS_PREPACK,
      packPrice: usd(5400),
      stockBySize: [
        { size: '7', units: 30 },
        { size: '8', units: 34 },
        { size: '10', units: 46 },
        { size: '12', units: 31 },
        { size: '14', units: 25 },
      ],
      terms: TERMS,
    },
  },
  {
    id: 'p-yee-haw-tee',
    slug: 'yee-haw-motif-short-sleeve-tee',
    displayName: 'Yee Haw Tee',
    specName: 'Black Yee Haw Motif Short Sleeve Tee',
    categorySlug: 'girls',
    description:
      'A soft cotton tee with a screen-printed "Yee Haw" motif across the chest. Regular ' +
      'fit with a ribbed neck.',
    attributes: {
      wash: 'black',
      fabric: ['cotton jersey'],
      motif: ['Yee Haw'],
      sleeve: 'short sleeve',
      colour: [{ name: 'Black' }],
    },
    media: [
      placeholderMedia(
        'm-yee-haw-1',
        'Placeholder for a photograph of the Yee Haw Tee in black, showing the screen-printed chest motif.',
      ),
    ],
    sizeRanges: [GIRLS_RANGE],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'LB-YHT-BLK',
      wholesalePrice: usd(700),
      msrp: usd(2000),
      moq: 6,
      prepack: GIRLS_PREPACK,
      packPrice: usd(4200),
      stockBySize: [
        { size: '7', units: 61 },
        { size: '8', units: 66 },
        { size: '10', units: 74 },
        { size: '12', units: 52 },
        { size: '14', units: 40 },
      ],
      terms: TERMS,
    },
  },
  {
    id: 'p-concho-belt',
    slug: 'tooled-leather-concho-belt',
    displayName: 'Concho Belt',
    specName: 'Tooled Leather Concho Belt',
    categorySlug: 'accessories',
    description:
      'A tooled leather belt with antiqued conchos set along the strap and a rectangular ' +
      'buckle. Finished edges, single prong.',
    attributes: {
      fabric: ['leather'],
      detail: ['tooled', 'concho'],
      colour: [{ name: 'Tobacco' }],
    },
    media: [
      placeholderMedia(
        'm-belt-1',
        'Placeholder for a photograph of the Concho Belt in tobacco tooled leather, showing the antiqued conchos and rectangular buckle.',
      ),
    ],
    sizeRanges: [
      {
        kind: 'straight',
        sizes: ['S', 'M', 'L'],
        availability: 'available',
        measurements: [
          { size: 'S', waistIn: '28–30' },
          { size: 'M', waistIn: '32–34' },
          { size: 'L', waistIn: '36–38' },
        ],
      },
    ],
    availability: 'in-stock',
    isFixture: true,
    wholesale: {
      sku: 'LB-CNB-TOB',
      wholesalePrice: usd(2100),
      msrp: usd(5800),
      moq: 6,
      prepack: {
        totalUnits: 6,
        breakdown: [
          { size: 'S', quantity: 2 },
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 2 },
        ],
        openSizing: false,
      },
      packPrice: usd(12600),
      stockBySize: [
        { size: 'S', units: 18 },
        { size: 'M', units: 24 },
        { size: 'L', units: 20 },
      ],
      terms: TERMS,
    },
  },
  {
    id: 'p-horseshoe-earrings',
    slug: 'silver-horseshoe-drop-earrings',
    displayName: 'Horseshoe Drop Earrings',
    specName: 'Silver Horseshoe Drop Earrings',
    categorySlug: 'accessories',
    description:
      'A lightweight drop earring with a brushed silver horseshoe and a hook fitting.',
    attributes: {
      fabric: ['brushed silver'],
      motif: ['horseshoe'],
      colour: [{ name: 'Silver' }],
    },
    media: [
      placeholderMedia(
        'm-earrings-1',
        'Placeholder for a photograph of the Horseshoe Drop Earrings in brushed silver, shown at close range against a plain ground.',
      ),
    ],
    sizeRanges: [ONE_SIZE],
    availability: 'waitlist',
    isFixture: true,
    wholesale: {
      sku: 'LB-HDE-SLV',
      wholesalePrice: usd(800),
      msrp: usd(2400),
      moq: 6,
      prepack: OPEN_SIZING_PREPACK,
      packPrice: usd(4800),
      stockBySize: [{ size: 'One size', units: 0 }],
      terms: 'Net 30 for approved accounts. Waitlist — no allocation currently available.',
    },
  },
] as const
