# 06 — Domain and Content Models

**Types are illustrative contracts, not implementation.** The governing rule: **a restricted
field is absent from the payload unless the session is authorised** — never present-and-hidden.

---

## Product — the core record

```ts
type Product = {
  id: string
  slug: string                    // name-derived. NEVER contains a price. CI-enforced.
  displayName: string             // editorial: "Midnight Rodeo Short"
  specName: string                // buyer-facing spec string, as the business writes it:
                                  // "Black Rodeo Buck-stitch Printed Stretch Denim Shorts (3in Inseam)"
  category: CategoryRef
  description: string
  attributes: ProductAttributes   // extracted from specName — see below
  media: MediaRef[]
  sizeRanges: SizeRange[]
  availability: 'in-stock' | 'pre-order' | 'waitlist' | 'discontinued'
  preOrder?: { shipWindowStart: string; shipWindowEnd: string; terms: string }
  wholesale?: WholesaleTerms      // ABSENT unless authorised
}
```

> `INFERRED` — **The single highest-leverage data decision in the project** is extracting
> `attributes` from the existing spec strings. Every product name already encodes wash,
> fabric, detail, silhouette, sleeve and inseam — but **only availability is filterable
> today across 235+ seasonal styles.** Extraction unlocks faceted filtering, editorial
> naming, shoppable lookbooks and the Garment Portal simultaneously.

```ts
type ProductAttributes = {
  wash?: 'dark' | 'mid' | 'light' | 'vintage-light' | 'stone' | 'black'
  fabric?: string[]      // stretch denim, suede, liquid leather, velvet burnout,
                         // burnout mesh, lace, faux fur
  detail?: string[]      // rhinestone, buck-stitch, pearl snap, western piping,
                         // embroidery, studded, fringe
  motif?: string[]       // horseshoe, cowboy hat, vintage rodeo, "Howdy", "Yee Haw"
  silhouette?: string    // wide-leg, boyfriend, high-rise trouser, bootcut
  sleeve?: string
  inseam?: string        // "30in", "9in after fold"
  colour: { name: string; hex?: string }[]
}
```

---

## Size — inclusive by construction

```ts
type SizeRange = {
  kind: 'straight' | 'extended' | 'girls'
  sizes: Size[]
  availability: 'available' | 'unavailable' | 'made-to-order'   // per range, stated honestly
  measurements: Measurement[]      // STRUCTURED TEXT — never an image
}

type Measurement = { size: string; bust?: string; waist: string; hip?: string; inseam?: string }
```

**Rules.** One product record spans its size ranges (`10` §4). **Extended sizing is never
`made-to-order` by default** — that value requires verified evidence. Where an assortment
genuinely differs, `availability` is stated per range rather than implying parity.

`VERIFIED FACT` — The live size chart is a single text-free JPEG. **`Measurement[]` is a
Phase 1 requirement**, not an enhancement.

---

## Wholesale terms — restricted

```ts
type WholesaleTerms = {          // present ONLY in an authorised session
  sku: string
  wholesalePrice: Money          // verified band: $7–$33
  msrp?: Money                   // recovered from V2 F6 — buyers need margin maths
  moq: number
  prepack: Prepack
  packPrice: Money
  availability: 'in-stock' | 'pre-order' | 'waitlist'
}

type Prepack = {
  totalUnits: number             // verified default: 6
  breakdown: { size: string; quantity: number }[]   // "2 S | 4 M | 4 L | 2 XL"
  openSizing: boolean            // "Select Sizes at Checkout"
}
```

`OBSERVED` — Every field above is already designed. V3 Frame 11 renders *WHLSL Price*, *MOQ*,
*Pack Breakdown* with real size runs (one is **(6)**), *SKU*, *Add to Order*. V2 Frame 6 adds
**MSRP**. **The commerce layer exists; the gate does not.**

---

## Buyer and approval

```ts
type Buyer = {
  id: string
  retailer: { name: string; address: Address; website?: string }
  salesTaxId: { value: string; verified: boolean }   // value NEVER leaves the server
  status: 'applied' | 'pending' | 'approved' | 'rejected' | 'suspended'
  approvedAt?: string
  terms?: BuyerTerms             // net terms, credit limit — pending OQ-10
  repId?: string
  preferences: { defaultPackSizing?: string; sizeRunNotes?: string }
}
```

`VERIFIED FACT` — Sales tax ID required; approval *"typically less than one business day"*.
Surface that timing in the pending state.

---

## Order

```ts
type Order = {
  id: string
  buyerId: string
  status: 'draft' | 'submitted' | 'in-production' | 'shipped' | 'delivered' | 'cancelled'
  lines: OrderLine[]
  subtotal: Money
  minimumMet: boolean            // verified minimum: $50
  shipWindow?: { start: string; end: string }
  tracking?: string
}

type OrderLine = { productId: string; prepack: Prepack; quantity: number; unitPrice: Money }
```

`OBSERVED` — `status` values are drawn from designed states: V2 F8's **"In Production"**,
V3 F10's *En route*, `12f_4`'s **Waitlist**.

---

## Passport, assortment, line sheet

```ts
type Passport = {                // buyer-first. NO loyalty, NO store credit.
  buyerId: string
  orders: OrderRef[]
  savedAssortments: AssortmentRef[]
  savedProducts: ProductRef[]
  feedback: StyleFeedback[]      // Phase 2 — sell-through and fit, per style
  appointments: AppointmentRef[] // Phase 2
}

type Assortment = { id: string; buyerId: string; name: string; lines: OrderLine[] }
type LineSheet  = { assortmentId: string; format: 'csv' | 'pdf'; generatedAt: string }
```

---

## Campaign, drop and media

```ts
type Drop = { date: string; slug: string; products: ProductRef[]; cover?: MediaRef }
```
`VERIFIED FACT` — the drop is **daily** (`/jul-27/` … `/aug-01/`). Dated, permalinked,
archivable, subscribable.

```ts
type Campaign = { slug: string; title: string; chapters: Chapter[] }
type Chapter  = { index: number; title: string; media: MediaRef[]; products: ProductRef[] }
```
`OBSERVED` — Chapter structure recovered from **V2 F4** (*"Frontier Garments — CHAPTER 02"*),
which is materially stronger than V3 Frame 7.

```ts
type Media = {
  id: string
  kind: 'image' | 'video' | 'sequence'
  poster: string                 // REQUIRED. Poster-first, always.
  aspectRatio: string            // reserved to prevent CLS
  alt: string                    // REQUIRED and meaningful
  captions?: string              // required when video carries information
  provenance: 'photography' | 'generated-placeholder' | 'owner-supplied'
  productRefs?: ProductRef[]     // makes an image shoppable
}
```

> **`provenance` is load-bearing.** Anything marked `generated-placeholder` is visually
> flagged in development and **fails the build if referenced from a production route**. This
> is the mechanism that keeps `CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY` true.

---

## Authorization context

```ts
type Session =
  | { kind: 'anonymous' }
  | { kind: 'buyer'; buyerId: string; status: Buyer['status'] }
  | { kind: 'owner'; userId: string }

// One helper, one call site per data access. Deny by default.
function visibleProduct(p: Product, s: Session): PublicProduct | AuthorisedProduct
```

**A new field is restricted until explicitly marked public.**

---

## Content-management boundary

**Owned by the CMS/authoring layer:** drops, campaigns, chapters, editorial copy, media and
alt text, size-and-fit tables, brand story.
**Owned by the commerce system:** products, variants, SKU, pricing, prepacks, inventory,
orders, buyers, approvals.
**The adapter boundary sits between them** — see `17`. **No commerce provider is selected**
until owner and backend requirements are confirmed.
