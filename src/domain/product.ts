/**
 * PRODUCT — the permission boundary expressed in types.
 *
 * `ProductRecord` is the complete record. It exists only inside `src/data`.
 * `PublicProduct` HAS NO WHOLESALE FIELD AT ALL — not optional, not null, absent. TypeScript
 * then makes it impossible to render a restricted value on a public surface.
 *
 * See docs/production/06 and docs/production/08.
 */

import type { Money } from './money'
import type { SizeRange } from './size'

export type Availability = 'in-stock' | 'pre-order' | 'waitlist' | 'discontinued'

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  'in-stock': 'In stock',
  'pre-order': 'Pre-order',
  waitlist: 'Waitlist',
  discontinued: 'Discontinued',
}

/**
 * Attributes extracted from the spec string. Today only availability is filterable across
 * 235+ seasonal styles; extraction is what unlocks faceted filtering.
 */
export type ProductAttributes = {
  readonly wash?: 'dark' | 'mid' | 'light' | 'vintage-light' | 'stone' | 'black'
  readonly fabric?: readonly string[]
  readonly detail?: readonly string[]
  readonly motif?: readonly string[]
  /*
    SPLIT, after the nine-site facet study found this field lying on every page it
    appeared on. `silhouette` held thirteen values of which four were denim LEG OPENINGS
    (straight, bootcut, flare, wide-leg), six were dress and outerwear SHAPES, and four
    (western, regular, fitted, short) were neither — fit words, or nothing. A buyer on a
    denim page saw "poncho" in the control; a buyer on outerwear saw "bootcut". Two of the
    reference sites (Cinch, Ariat) name the denim axis `leg opening`, and our own denim
    finder already enumerated exactly those four values — under the wrong name. One
    concept, one name, per axis:
  */
  /** Denim and trousers only: the leg's cut. */
  readonly legOpening?: 'straight' | 'bootcut' | 'flare' | 'wide-leg' | 'trouser' | 'tapered'
  /** Non-denim garment shape (open front vest, poncho, strapless midi, …). */
  readonly silhouette?: string
  readonly sleeve?: string
  readonly inseam?: string
  readonly colour: readonly { readonly name: string; readonly hex?: string }[]
}

/**
 * `provenance` is load-bearing. Anything marked `generated-placeholder` is visually flagged
 * in development and fails the media-integrity test if referenced from a production route.
 *
 * `generated-campaign` is a distinct thing and the distinction matters. A placeholder is an
 * apology for a photograph that has not been taken; a campaign plate is generated imagery
 * published ON PURPOSE, as atmosphere or place, because it says something the catalogue
 * cannot. It is never flagged as pending — but it may never carry a garment, a price or a
 * product name either. §12: generated imagery is never presented as real product.
 *
 * A product's own media may only ever be `photography` or `owner-supplied`. The type does
 * not enforce that; `campaign-plates.ts` is the only module that mints this value, and it
 * is used exclusively by editorial bands.
 */
export type MediaProvenance =
  'photography' | 'generated-placeholder' | 'generated-campaign' | 'owner-supplied'

/** One responsive encoding of an image, newest format first. */
export type MediaSource = {
  readonly type: 'image/avif' | 'image/webp'
  /** `path 360w, path 640w, …` */
  readonly srcSet: string
}

export type MediaRef = {
  readonly id: string
  readonly kind: 'image' | 'video' | 'sequence'
  /** REQUIRED. Poster-first, always. The widest fallback encoding. */
  readonly poster: string
  /** Reserved to prevent CLS. */
  readonly aspectRatio: string
  /** REQUIRED and meaningful. Never contains a price. */
  readonly alt: string
  readonly captions?: string
  readonly provenance: MediaProvenance
  /** Responsive encodings, when the asset has been optimised. */
  readonly sources?: readonly MediaSource[]
  /** Intrinsic size of the source, so width/height can be set and CLS avoided. */
  readonly intrinsicWidth?: number
  readonly intrinsicHeight?: number
}

export type PreOrderTerms = {
  readonly shipWindowStart: string
  readonly shipWindowEnd: string
  readonly terms: string
}

export type Prepack = {
  /** Verified default: 6. */
  readonly totalUnits: number
  readonly breakdown: readonly { readonly size: string; readonly quantity: number }[]
  /** "Select sizes at checkout". */
  readonly openSizing: boolean
}

/** RESTRICTED. Present only inside an authorised session. */
export type WholesaleTerms = {
  readonly sku: string
  /** Verified band: $7–$33. */
  readonly wholesalePrice: Money
  /** Recovered from V2 Frame 6 — buyers need margin maths. */
  readonly msrp: Money
  /** Minimum units of this style per order. */
  readonly moq: number
  readonly prepack: Prepack
  readonly packPrice: Money
  /** Per-size stock detail. Restricted; the coarse public state lives on the base record. */
  readonly stockBySize: readonly { readonly size: string; readonly units: number }[]
  readonly terms: string
}

/** Fields that are public, semantic and crawlable — always. */
type ProductBase = {
  readonly id: string
  readonly slug: string
  /** Editorial name. */
  readonly displayName: string
  /** Buyer-facing spec string, as the business writes it. */
  readonly specName: string
  readonly categorySlug: string
  readonly description: string
  readonly attributes: ProductAttributes
  readonly media: readonly MediaRef[]
  readonly sizeRanges: readonly SizeRange[]
  /** Coarse state only. Unit counts are restricted and live on WholesaleTerms. */
  readonly availability: Availability
  readonly preOrder?: PreOrderTerms
  readonly newArrivalOn?: string
  /** Development fixtures are flagged so a placeholder cannot silently ship. */
  readonly isFixture: boolean
}

/** The complete record. NEVER leaves `src/data`. */
export type ProductRecord = ProductBase & {
  readonly wholesale: WholesaleTerms
}

/** What an anonymous or unapproved session may receive. No wholesale field exists. */
export type PublicProduct = ProductBase & {
  readonly access: 'public'
}

/** What an approved, authenticated buyer may receive. */
export type AuthorisedProduct = ProductBase & {
  readonly access: 'authorised'
  readonly wholesale: WholesaleTerms
}

export type VisibleProduct = PublicProduct | AuthorisedProduct

export function isAuthorisedProduct(p: VisibleProduct): p is AuthorisedProduct {
  return p.access === 'authorised'
}

export function primaryMedia(p: ProductBase): MediaRef | undefined {
  return p.media[0]
}
