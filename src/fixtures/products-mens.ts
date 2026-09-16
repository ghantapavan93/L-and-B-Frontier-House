/**
 * THE MEN'S LINE — catalogue records for the proposed line.
 *
 * Owner-directed 2026-09-16: the house presents men's-first. Until then the ten men's
 * styles lived in `mens-demo.ts` as a separate demonstration outside the catalogue — no
 * SKU, no pack, no price, unreachable by search, filters, the line sheet or an order. A
 * platform is those things. So the same ten styles are catalogue records now, and every
 * piece of machinery the women's line runs on — facets, rails, the gallery, the buyer's
 * price panel, the line sheet, the assortment builder, the order — runs on them unchanged.
 *
 * What keeps this honest, and what the tests hold:
 *
 *   - Every record is `isFixture: true` and sits in a category flagged `demonstration`.
 *     Every surface that renders one carries the DEMONSTRATION marker, and none is in
 *     the sitemap or the index. The line is proposed, not published (D-03).
 *   - Wholesale figures are fixtures INSIDE the verified $7–$33 band, in verified 6-unit
 *     prepacks, on the verified terms. They are not prices for garments that exist; they
 *     are the shape a price would take, so the buyer's flow can be walked end to end.
 *   - Descriptions state only what the photographs show. No fabric origin, no mill, no
 *     construction claim a photograph does not carry.
 *   - A record carries a placeholder, never a photograph. That is the rule the women's
 *     line runs on: the media authority overlays the owner-dropped reference frames at
 *     read time from MENS_REFERENCE_MEDIA (mens-media.ts), exactly as the official
 *     manifest overlays the women's line.
 */

import type { MediaRef, ProductRecord } from '@/domain/product'
import { usd } from '@/domain/money'
import type { SizeRange } from '@/domain/size'
import { FIXTURE_MEDIA_PROVENANCE } from './notice'

const TERMS = 'Net 30 for approved accounts. Prepacks ship complete.'

function placeholder(id: string, alt: string): MediaRef {
  return {
    id,
    kind: 'image',
    poster: '/media/fixture-placeholder.svg',
    aspectRatio: '4 / 5',
    alt,
    provenance: FIXTURE_MEDIA_PROVENANCE,
  }
}

/** Men's waist run, on the straight-sizing axis the facets and size page already know. */
const MENS_WAIST: SizeRange = {
  kind: 'straight',
  sizes: ['30', '32', '34', '36', '38'],
  availability: 'available',
  measurements: [
    { size: '30', waistIn: '30', hipIn: '37', inseamIn: '32' },
    { size: '32', waistIn: '32', hipIn: '39', inseamIn: '32' },
    { size: '34', waistIn: '34', hipIn: '41', inseamIn: '32' },
    { size: '36', waistIn: '36', hipIn: '43', inseamIn: '32' },
    { size: '38', waistIn: '38', hipIn: '45', inseamIn: '32' },
  ],
}

const MENS_ALPHA: SizeRange = {
  kind: 'straight',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  availability: 'available',
  measurements: [
    { size: 'S', bustIn: '36', waistIn: '30' },
    { size: 'M', bustIn: '40', waistIn: '34' },
    { size: 'L', bustIn: '44', waistIn: '38' },
    { size: 'XL', bustIn: '48', waistIn: '42' },
    { size: 'XXL', bustIn: '52', waistIn: '46' },
  ],
}

const MENS_BELT: SizeRange = {
  kind: 'straight',
  sizes: ['32', '34', '36', '38', '40', '42'],
  availability: 'available',
  measurements: [
    { size: '32', waistIn: '32' },
    { size: '34', waistIn: '34' },
    { size: '36', waistIn: '36' },
    { size: '38', waistIn: '38' },
    { size: '40', waistIn: '40' },
    { size: '42', waistIn: '42' },
  ],
}

const ONE_SIZE: SizeRange = {
  kind: 'straight',
  sizes: ['One size'],
  availability: 'available',
  measurements: [{ size: 'One size', waistIn: 'One size' }],
}

const WAIST_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: '30', quantity: 1 },
    { size: '32', quantity: 2 },
    { size: '34', quantity: 2 },
    { size: '36', quantity: 1 },
  ],
  openSizing: false,
} as const

const ALPHA_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: 'S', quantity: 1 },
    { size: 'M', quantity: 2 },
    { size: 'L', quantity: 2 },
    { size: 'XL', quantity: 1 },
  ],
  openSizing: false,
} as const

const BELT_PREPACK = {
  totalUnits: 6,
  breakdown: [
    { size: '32', quantity: 1 },
    { size: '34', quantity: 2 },
    { size: '36', quantity: 2 },
    { size: '38', quantity: 1 },
  ],
  openSizing: false,
} as const

const OPEN_PREPACK = { totalUnits: 6, breakdown: [], openSizing: true } as const

const WAIST_STOCK = [
  { size: '30', units: 22 },
  { size: '32', units: 48 },
  { size: '34', units: 51 },
  { size: '36', units: 34 },
  { size: '38', units: 18 },
] as const

const ALPHA_STOCK = [
  { size: 'S', units: 26 },
  { size: 'M', units: 44 },
  { size: 'L', units: 47 },
  { size: 'XL', units: 30 },
  { size: 'XXL', units: 14 },
] as const

const BELT_STOCK = [
  { size: '32', units: 12 },
  { size: '34', units: 20 },
  { size: '36', units: 22 },
  { size: '38', units: 16 },
  { size: '40', units: 9 },
  { size: '42', units: 6 },
] as const

/** Pack price is unit price × six, always — the arithmetic is the claim. */
const pack = (unitMinor: number) => usd(unitMinor * 6)

export const MENS_PRODUCT_RECORDS: readonly ProductRecord[] = [
  /* ── Denim ───────────────────────────────────────────────────────────── */
  {
    id: 'p-mj101-drk',
    slug: 'dark-rigid-jean',
    displayName: 'Dark Rigid Jean',
    specName: "Men's Dark Rigid Straight Leg Jean",
    categorySlug: 'mens-denim',
    description:
      'Five-pocket jean in a dark, even indigo with a straight leg and contrast stitching.',
    attributes: {
      wash: 'dark',
      fabric: ['denim'],
      legOpening: 'straight',
      detail: ['five-pocket', 'contrast stitching'],
      colour: [{ name: 'Dark Indigo', hex: '#1f2a3d' }],
    },
    media: [placeholder('m-mj101-drk', 'Dark Rigid Jean, photography pending')],
    sizeRanges: [MENS_WAIST],
    availability: 'in-stock',
    newArrivalOn: '2026-09-16',
    isFixture: true,
    wholesale: {
      sku: 'MJ101-DRK',
      wholesalePrice: usd(3100),
      msrp: usd(8200),
      moq: 6,
      prepack: WAIST_PREPACK,
      packPrice: pack(3100),
      stockBySize: [...WAIST_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-mj102-mid',
    slug: 'everyday-mid-jean',
    displayName: 'Everyday Mid-Wash Jean',
    specName: "Men's Mid-Wash Straight Leg Jean",
    categorySlug: 'mens-denim',
    description:
      'Mid-wash jean with light whiskering at the hip, worn with a leather belt. Straight ' +
      'through the leg.',
    attributes: {
      wash: 'mid',
      fabric: ['denim'],
      legOpening: 'straight',
      detail: ['five-pocket', 'whiskering', 'button fly'],
      colour: [{ name: 'Mid Indigo', hex: '#3f5b7d' }],
    },
    media: [placeholder('m-mj102-mid', 'Everyday Mid-Wash Jean, photography pending')],
    sizeRanges: [MENS_WAIST],
    availability: 'in-stock',
    newArrivalOn: '2026-09-16',
    isFixture: true,
    wholesale: {
      sku: 'MJ102-MID',
      wholesalePrice: usd(2900),
      msrp: usd(7800),
      moq: 6,
      prepack: WAIST_PREPACK,
      packPrice: pack(2900),
      stockBySize: [...WAIST_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-mj103-lgt',
    slug: 'light-wash-jean',
    displayName: 'Light Wash Jean',
    specName: "Men's Light Wash Straight Leg Jean",
    categorySlug: 'mens-denim',
    description: 'Pale, even light wash with a straight leg and a clean, uncuffed hem.',
    attributes: {
      wash: 'light',
      fabric: ['denim'],
      legOpening: 'straight',
      detail: ['five-pocket'],
      colour: [{ name: 'Light Wash', hex: '#8fa6bd' }],
    },
    media: [placeholder('m-mj103-lgt', 'Light Wash Jean, photography pending')],
    sizeRanges: [MENS_WAIST],
    availability: 'in-stock',
    newArrivalOn: '2026-09-15',
    isFixture: true,
    wholesale: {
      sku: 'MJ103-LGT',
      wholesalePrice: usd(2900),
      msrp: usd(7800),
      moq: 6,
      prepack: WAIST_PREPACK,
      packPrice: pack(2900),
      stockBySize: [...WAIST_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-mj104-boot',
    slug: 'dark-bootcut-jean',
    displayName: 'Dark Bootcut Jean',
    specName: "Men's Deep Indigo Bootcut Jean",
    categorySlug: 'mens-denim',
    description:
      'Deep-wash jean cut to sit over a western heel, with a wider opening at the hem.',
    attributes: {
      wash: 'dark',
      fabric: ['denim'],
      legOpening: 'bootcut',
      detail: ['five-pocket'],
      colour: [{ name: 'Deep Indigo', hex: '#20304a' }],
    },
    media: [placeholder('m-mj104-boot', 'Dark Bootcut Jean, photography pending')],
    sizeRanges: [MENS_WAIST],
    availability: 'in-stock',
    newArrivalOn: '2026-09-15',
    isFixture: true,
    wholesale: {
      sku: 'MJ104-BOOT',
      wholesalePrice: usd(3100),
      msrp: usd(8200),
      moq: 6,
      prepack: WAIST_PREPACK,
      packPrice: pack(3100),
      stockBySize: [...WAIST_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-mj105-khk',
    slug: 'khaki-five-pocket-jean',
    displayName: 'Khaki Five-Pocket Jean',
    specName: "Men's Khaki Twill Five-Pocket Straight Leg",
    categorySlug: 'mens-denim',
    description:
      'Five-pocket cut in a warm khaki twill, with tonal stitching and a straight leg.',
    attributes: {
      fabric: ['twill'],
      legOpening: 'straight',
      detail: ['five-pocket', 'tonal stitching'],
      colour: [{ name: 'Khaki', hex: '#b8a37c' }],
    },
    media: [placeholder('m-mj105-khk', 'Khaki Five-Pocket Jean, photography pending')],
    sizeRanges: [MENS_WAIST],
    availability: 'in-stock',
    newArrivalOn: '2026-09-14',
    isFixture: true,
    wholesale: {
      sku: 'MJ105-KHK',
      wholesalePrice: usd(2700),
      msrp: usd(7400),
      moq: 6,
      prepack: WAIST_PREPACK,
      packPrice: pack(2700),
      stockBySize: [...WAIST_STOCK],
      terms: TERMS,
    },
  },

  /* ── Shirts ──────────────────────────────────────────────────────────── */
  {
    id: 'p-ms201-rst',
    slug: 'stripe-pearl-snap-shirt',
    displayName: 'Stripe Pearl-Snap Shirt',
    specName: "Men's Long Sleeve Stripe Pearl Snap Western Shirt",
    categorySlug: 'mens-shirts',
    description:
      'Long-sleeve western shirt in a red-brown stripe with a snap front and two flap chest ' +
      'pockets.',
    attributes: {
      fabric: ['cotton'],
      detail: ['pearl snaps', 'flap chest pockets', 'western yoke'],
      sleeve: 'long sleeve',
      colour: [{ name: 'Rust Stripe', hex: '#9c5a49' }],
    },
    media: [placeholder('m-ms201-rst', 'Stripe Pearl-Snap Shirt, photography pending')],
    sizeRanges: [MENS_ALPHA],
    availability: 'in-stock',
    newArrivalOn: '2026-09-14',
    isFixture: true,
    wholesale: {
      sku: 'MS201-RST',
      wholesalePrice: usd(2400),
      msrp: usd(6400),
      moq: 6,
      prepack: ALPHA_PREPACK,
      packPrice: pack(2400),
      stockBySize: [...ALPHA_STOCK],
      terms: TERMS,
    },
  },

  /* ── Outerwear ───────────────────────────────────────────────────────── */
  {
    id: 'p-mo301-ind',
    slug: 'indigo-trucker-jacket',
    displayName: 'Indigo Trucker Jacket',
    specName: "Men's Worn Indigo Denim Trucker Jacket",
    categorySlug: 'mens-outerwear',
    description:
      'Button-front denim jacket in a worn indigo, shown open over a tee with a felt hat.',
    attributes: {
      wash: 'mid',
      fabric: ['denim'],
      silhouette: 'trucker jacket',
      detail: ['button front', 'chest pockets'],
      sleeve: 'long sleeve',
      colour: [{ name: 'Worn Indigo', hex: '#4a6a8f' }],
    },
    media: [placeholder('m-mo301-ind', 'Indigo Trucker Jacket, photography pending')],
    sizeRanges: [MENS_ALPHA],
    availability: 'in-stock',
    newArrivalOn: '2026-09-13',
    isFixture: true,
    wholesale: {
      sku: 'MO301-IND',
      wholesalePrice: usd(3300),
      msrp: usd(8500),
      moq: 6,
      prepack: ALPHA_PREPACK,
      packPrice: pack(3300),
      stockBySize: [...ALPHA_STOCK],
      terms: TERMS,
    },
  },

  /* ── Accessories ─────────────────────────────────────────────────────── */
  {
    id: 'p-ma401-tan',
    slug: 'saddle-tan-belt',
    displayName: 'Saddle Tan Belt',
    specName: "Men's Smooth Leather Belt, Saddle Tan",
    categorySlug: 'mens-accessories',
    description: 'Smooth tan leather belt with a brass-tone single-prong buckle.',
    attributes: {
      fabric: ['leather'],
      detail: ['single-prong buckle'],
      colour: [{ name: 'Saddle Tan', hex: '#a9713f' }],
    },
    media: [placeholder('m-ma401-tan', 'Saddle Tan Belt, photography pending')],
    sizeRanges: [MENS_BELT],
    availability: 'in-stock',
    newArrivalOn: '2026-09-13',
    isFixture: true,
    wholesale: {
      sku: 'MA401-TAN',
      wholesalePrice: usd(1400),
      msrp: usd(3800),
      moq: 6,
      prepack: BELT_PREPACK,
      packPrice: pack(1400),
      stockBySize: [...BELT_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-ma402-grn',
    slug: 'textured-grain-belt',
    displayName: 'Textured Grain Belt',
    specName: "Men's Raised Grain Leather Belt, Brown",
    categorySlug: 'mens-accessories',
    description: 'Brown belt in a raised exotic-grain leather with a silver-tone buckle.',
    attributes: {
      fabric: ['leather'],
      detail: ['raised grain', 'single-prong buckle'],
      colour: [{ name: 'Brown', hex: '#5a3d2b' }],
    },
    media: [placeholder('m-ma402-grn', 'Textured Grain Belt, photography pending')],
    sizeRanges: [MENS_BELT],
    availability: 'in-stock',
    newArrivalOn: '2026-09-12',
    isFixture: true,
    wholesale: {
      sku: 'MA402-GRN',
      wholesalePrice: usd(1600),
      msrp: usd(4200),
      moq: 6,
      prepack: BELT_PREPACK,
      packPrice: pack(1600),
      stockBySize: [...BELT_STOCK],
      terms: TERMS,
    },
  },
  {
    id: 'p-ma403-duf',
    slug: 'leather-weekend-duffel',
    displayName: 'Leather Weekend Duffel',
    specName: "Men's Leather Weekend Duffel, Brown",
    categorySlug: 'mens-accessories',
    description: 'Brown leather duffel with twin carry handles, held waist-high.',
    attributes: {
      fabric: ['leather'],
      detail: ['twin carry handles'],
      colour: [{ name: 'Brown', hex: '#6b4a33' }],
    },
    media: [placeholder('m-ma403-duf', 'Leather Weekend Duffel, photography pending')],
    sizeRanges: [ONE_SIZE],
    availability: 'in-stock',
    newArrivalOn: '2026-09-12',
    isFixture: true,
    wholesale: {
      sku: 'MA403-DUF',
      wholesalePrice: usd(3300),
      msrp: usd(8500),
      moq: 6,
      prepack: OPEN_PREPACK,
      packPrice: pack(3300),
      stockBySize: [{ size: 'One size', units: 11 }],
      terms: TERMS,
    },
  },
]
