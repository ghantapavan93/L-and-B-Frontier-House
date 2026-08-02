# 07 — Component Contracts

Every component below carries the same contract shape. **Where a behaviour is not listed, the
global rules in `12` (motion/modes), `15` (accessibility) and `08` (authorisation) apply — they
are not restated per component.**

**Three global rules bind every entry:**

1. **Authorisation is absence, not concealment.** A component that never receives restricted
   data cannot leak it. No component hides a price with CSS.
2. **Poster-first.** Every motion component renders complete and correct with zero motion.
3. **Reduced motion removes uninitiated motion only.** It never removes content, controls or
   capability.

Legend — **Phase**: 1 wholesale · 2 brand · 3 cinema. **Auth**: `pub` public · `buy` authorised
buyer · `own` owner.

---

## 1. Global chrome

### `SiteHeader`
**Phase 1 · pub/buy/own.** Wordmark, primary navigation, search, account/sign-in, order
indicator (authorised only).
**Data:** `{ nav: NavNode[]; session: Session; orderSummary?: OrderSummary }` — `orderSummary`
**absent** for anonymous.
**States:** default · scrolled/condensed · mobile collapsed · menu open · pending-approval
banner.
**Keyboard:** skip link first in DOM order; menus arrow-navigable; `Escape` closes and restores
focus to the trigger.
**Screen reader:** `<nav aria-label>`; current page `aria-current="page"`.
**Mobile:** respects `env(safe-area-inset-top)`.
**Motion:** condense ≤200ms; none under reduced motion.
**Source:** V3 F6 · **Note:** V3's header carries *SHOP · COLLECTIONS · JOURNAL · ATELIER* — an
editorial nav for a business whose primary user is buying a prepack. Nav is taxonomy-gated
(D-04).

### `SiteFooter`
**Phase 1 · pub.** Navigation, wholesale invitation, showroom #13656, market dates, policies,
contact.
**Rule:** the **verified operational facts** — 100% fill rate, 2.64-day processing — belong here
and nowhere fabricated. **© year is generated, never hardcoded** (the corpus carries © 2024).

### `ModeSelector`
**Phase 2 · pub/buy.** CINEMA · BALANCED · INSTANT SHOP.
**Contract:** `{ current: Mode; resolvedBy: 'user'|'reduced-motion'|'save-data'|'capability'|
'role'|'default' }`.
**Rules:** always visible, never a modal-on-load, choice persists. **Never changes content,
price, availability, URL, or accessibility guarantees.** Under `prefers-reduced-motion` the
selector **stays operable** — the user is not locked out of a preference by a health setting.
**Source:** V3.1 `8g_5`. **Correction:** V3.1 shows it as a full-screen entry gate; it becomes a
persistent control.

### `SkipLink` · `FocusRing` (token) · `LiveRegion`
**Phase 1 · all.** `:focus` appears in **0 of 48 source files** — the entire focus system is new
work. Ring is **Tobacco Leather `#734F36`, 6.49:1** (`11`). One polite live region per surface
for cart, filter and authorisation announcements.

---

## 2. Product and catalogue — Phase 1

### `ProductCard`
**pub/buy.** Image, name, category, colourway, size-range badge, availability.
**Data:** `PublicProduct` **or** `AuthorisedProduct` — the union from `06`. **The public variant
has no price field at all.**
**States:** default · hover · focus · loading skeleton · image error · pre-order · sold out ·
waitlist.
**Keyboard:** the **card is one link**; secondary actions are separate controls, not nested
anchors.
**Target size:** every control ≥24×24 CSS px (**2.5.8**).
**Motion:** image scale ≤1.02 over ≤200ms; none under reduced motion.
**Never:** render price for an anonymous session · draw the name into canvas · rely on hover to
reveal essential information.

### `ProductGrid` · `CategoryHeader` · `Pagination`
**pub/buy.** Grid announces result count via live region on filter change. Pagination is real
`<a href>` — crawlable and no-JS traversable.

### `FacetPanel`
**Phase 1 · pub/buy.** Filter by colour, fabric, silhouette, embellishment, size range,
availability, pre-order.
**Data:** facets derived from **attributes extracted from product names** — today only
availability is filterable across 235+ styles, which is the largest usability gap on the live
site.
**States:** default · applied · zero-results (**with a recovery path, never a dead end**) ·
loading.
**Keyboard:** each facet is a labelled `<input>`; a filter group is a `<fieldset>`; applying
does not move focus away from the control.
**Screen reader:** result count announced politely; applied filters listed as removable chips.
**URL:** filters serialise to the URL and are shareable. **Never a price value in the query
string.**

### `SizeRangeSelector`
**Phase 1 · pub/buy.** One product record, full size range.
**Rule:** availability is stated **honestly per size range** (OQ-08). If the extended range is
genuinely narrower, say so — never imply a parity that does not exist, and **never route Plus to
a bespoke or enquiry flow** while standard sizes shop normally.

### `SizeAndFitTable`
**Phase 1 · pub.** **Structured text, always.** The current site's size chart is a single JPEG
with zero text — a probable **WCAG 1.1.1** failure and the thing most directly contradicting the
brand's inclusivity claim.
**Contract:** `<table>` with `<caption>`, `<th scope>`, units switchable in/cm.
**Never:** an image of a table. **Never** a PDF as the only format.

### `ProductDetail`
**Phase 1 · pub/buy.** Composes gallery, name, description, materials, colourways,
`SizeAndFitTable`, availability, and — **only when authorised** — `WholesalePricePanel`,
`PrepackTable`, `AddToOrder`.
**Data:** `visibleProduct(product, session)`. The unauthorised return type **has no wholesale
field to omit**.
**States:** loading · error · pre-order · sold out · waitlist · anonymous · pending approval ·
approved.
**Must:** be complete and shoppable with JavaScript disabled (Test 1).

### `ProductGallery`
**Phase 1 · pub.** Thumbnails, zoom, garment motion clip (Phase 2).
**Keyboard:** thumbnails are a roving-tabindex list; zoom has a button alternative to drag
(**2.5.7**).
**Never:** a canvas-only viewer. **Never** pinch-only zoom.

### `ProductAnatomy`
**Phase 2 · pub.** High-resolution photography with **SVG callouts** — buck stitch, pearl snap,
yoke, cuff.
**Explicitly not 3D.** Real photography at high resolution communicates weave and topstitch
better than a mid-tier GPU can, at a fraction of the cost.
**Keyboard:** each callout is a `<button>` toggling a description; ≥24×24px.

---

## 3. Wholesale commerce — Phase 1, authorised only

### `WholesalePricePanel`
**buy only.** WHLSL price · **MSRP** · margin.
**Server-rendered inside the authorised session.** Never client-fetched into a public shell.
**Never** in HTML, URL, slug, title, meta, JSON-LD, static asset, client bundle, log, analytics
event, third-party widget, alt text or sitemap.
**Screen reader:** the region announces via `aria-live="polite"` when it appears after sign-in.
**Source:** V3 F11 renders *WHLSL Price* and *MOQ* — **the commerce layer is designed; the
authorisation layer is what was never drawn.** MSRP is recovered from V2 F6.

### `PrepackTable`
**buy only.** Size run and quantities.
**Verified:** prepacks of **6**. V3 F11 renders a real size run including **(6)**.
**Contract:** `Prepack = { totalUnits; breakdown: {size, quantity}[]; openSizing }`.
**Structured text table** — never an image, never canvas.

### `MinimumOrderProgress`
**buy only.** Progress toward the verified **$50 minimum**.
**States:** below · met · exceeded.
**Screen reader:** `role="status"`; announces on crossing the threshold, not on every keystroke.
**Never:** block browsing before the minimum is met — it is a checkout condition, not a gate.

### `AddToOrder`
**buy only.** Adds a prepack or open-sizing quantity.
**States:** idle · pending · added · error · out of stock · pre-order.
**Keyboard:** a real `<button>`; the result is announced; focus does not jump to a drawer
without the user asking.
**Never:** a canvas-drawn or pointer-only control.

### `OrderBuilder` · `OrderSummary` · `LineSheetExport`
**buy only.** Persistent assortment with per-line prepack breakdowns, running total, minimum
progress. **Export Line Sheet** is designed in V3 F11 and is genuinely valuable — buyers work
from line sheets.
**Rule:** an exported line sheet is **restricted content**; it is generated server-side inside
the session and never cached publicly.

### `ReorderControl`
**Phase 1 · buy.** *Reorder same assortment* / *Reorder with changes*.
`INFERRED` — the highest-value buyer feature in the blueprint and it appears in no design source.
Repeat wholesale ordering is the business.

### `BuyerApplicationForm`
**Phase 1 · pub.** Business name, sales tax ID, document upload, contact.
**States:** empty · validating · submitted · pending · approved · rejected · expired ·
suspended.
**Copy rule:** the gate reads as an **invitation**, not a failure. State the verified
**under-one-business-day** approval time.
**Never:** ask for a password on the same screen as a tax ID upload without an explicit security
explanation. **Never** echo an uploaded document to a public URL.

### `AuthGate` / `PendingApprovalNotice` / `PermissionDenied`
**Phase 1 · all.** Fail closed on any lookup error. A denial explains what access exists and how
to obtain it — never a bare 403.

---

## 4. Buyer continuity — Phase 1

### `BuyerPassport`
**buy.** Order history, production and shipment status, saved assortments, reorder, terms,
documents, showroom appointment.
**Correction:** V3 F10 renders *"Frontier Trust 4,250"* and *"$150 store credit"* — **invented
loyalty that does not exist in V2.** The Passport survives as a **buyer relationship surface**;
the points economy does not.

### `OrderHistoryTable` · `OrderStatusTimeline` · `SavedAssortments`
**buy.** All structured text. Status vocabulary must match what the business actually reports —
no invented fulfilment stages.

---

## 5. Editorial and brand — Phase 2

### `EditorialHero`
**pub.** Full-bleed image or film, headline, one-action exit to shop.
**Rule (2.2.2, Level A):** a hero film that auto-starts and loops **over 5 seconds** under a
headline **requires a visible pause control** — independent of `prefers-reduced-motion`.
**Poster-first:** the still frame carries the full message alone, and must survive a **centred
native play glyph** (iOS Low Power Mode forces one and CSS cannot hide it).

### `MediaPlayer`
**Phase 2 · pub.** Wraps every video.
**Controls:** visible play/pause · mute · captions. **Never** autoplay with sound.
**Captions and a transcript are required.** For silent film the transcript describes garment,
fabric and colourway — which doubles as the SEO surface.

### `ShoppableFilm`
**Phase 3 · pub.**
**Hotspots are real DOM `<button>` elements driven by a `<track kind="metadata">` cue
timeline** — never canvas-drawn, which is unreachable by keyboard by construction.
**Each hotspot ≥24×24 CSS px (2.5.8).**
**A parallel, always-visible, non-time-gated product list ships beneath the film.** That list is
simultaneously the accessibility mechanism, the static fallback, and the SEO surface.

### `LivingContactSheet`
**Phase 2 · pub.** Nine-cell editorial grid.
**Source:** V2 F2 is the strongest expression. **Note:** the folder
`v3_frame_2_living_contact_sheet_eruption` renders a *Frontier Passport* screen — **folder names
in V3 are not reliable labels; always open the image.**

### `CampaignChapter`
**Phase 2 · pub.** Named chapter, editorial imagery, product row with a commerce exit.
**Source:** **V2 F4, not V3 F7** — V2 carries the title, craft story, named chapter, three
priced products and a campaign CTA, and its protagonist is a woman. It is materially stronger.
**Removals:** *"Hand-tooled in the Frontier House workshop"* and every fabricated date.

### `StoreLocator` · `MarketAndShowroom`
**Phase 1 · pub.** Real, verified, already public: showroom **#13656**, Dallas Market Center,
markets **Aug 18–21** and **Oct 20–23, 2026**, and the Cavender's stockist relationship.

---

## 6. Cinema — Phase 3, blocked on D-08/D-11

### `FrontierIgnition` · `BuckleArtifact` · `CameraPassage`
**pub.**
- **Deterministic, non-branching sequences ship as pre-rendered video, not real-time 3D.**
- **Tier 0 must not require a GPU.** A fallback that needs WebGL is not a fallback.
- **Never intercept the wheel.** V3.1's wheel-to-camera mapping is scroll interception and is
  overruled — drive the same camera value from **native scroll position**.
- **Drag-to-rotate requires a single-pointer alternative** (rotate buttons) — **2.5.7**.
- **A pinned section must not entirely obscure a focused element** — **2.4.11**.
- **Buckle geometry comes from `8b`/`8c` only** — scalloped, chamfered, rectangular. **Never
  from the code**, whose nested IIFE resolves a container ID that does not exist and throws on
  its first line, and which builds concentric rings instead.
- **"EST. 1865" is engraved into the mobile hub's buckle and must not ship.**

### `ExperienceModeFallback`
**pub.** The always-correct floor: server-rendered products, real images, no canvas.
**Rule:** removing the atmosphere layer entirely must leave a **complete, correct, shoppable
store.**

---

## 7. Owner-internal — Phase 1

### `DropPublisher` · `ProductCompletenessAlert` · `ApplicationsQueue`
**own.** The daily drop is the brand's real operating rhythm and has no tooling in any design
source. Completeness alerts flag a product missing a size range, alt text, or a measurement
table **before** it can be published.
**Correction:** V3 F11's approvals queue names *Arthur Pendelton*, *E. Vance Holdings* and *J.R.
Cash* — **invented people; J.R. Cash is Johnny Cash's birth name.** The queue mechanic is sound;
the names are fixtures and must be labelled as such.

---

## 8. States every component must define

`loading` · `empty` · `error` · `offline` · `unauthenticated` · `pending approval` ·
`permission denied` · `reduced motion` · `no JavaScript` · `image failed` · `text at 200% zoom`
· `320px viewport`.

> **A failed animation must never hide a product.** Scope every hidden state under a JS-set
> attribute so a JavaScript failure leaves content visible — not under a bare CSS default.
