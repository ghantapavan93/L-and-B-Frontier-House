# 03 — Phased Product Strategy

**Principle: build for the business that exists, then the brand it wants to be, then the
cinema it can afford.**

---

## Phase 1 — Wholesale platform

**Serves:** boutique owners, chain buyers, sales reps, brand operators — the only audience
that pays today.
**Requires:** no WebGL · no video · no Custom Atelier · no consumer checkout · **no owner
answer that is not yet available.**

### Public
Home · brand story · new arrivals · **the daily drop** (dated, permalinked) · collections ·
product discovery with **faceted filtering and sort** · product detail **without restricted
pricing** · **size and fit as structured text** · wholesale information (terms, minimum,
process) · buyer application · showroom and market calendar · store locator · contact ·
accessibility statement · privacy and legal.

### Authorised buyer
Sign-in · approval status · **permission-gated wholesale pricing** · **MSRP** · **MOQ** ·
**prepack composition** · SKU · availability including pre-order · **Add to Order** ·
order builder with live minimum progress · **saved assortments** · **line sheets (export)** ·
order history · **reorder** · production and shipment states · buyer profile.

### Owner / internal
Daily-drop publishing · product-data completeness · **photography-gap alerts with SKU
counts** · size-and-fit completeness · availability · buyer applications queue · order
alerts · **pricing-security alerts**.

### Cross-cutting
Every state — loading, empty, error, unavailable, **pending approval**, **permission
denied**, offline · privacy and consent · accessibility · SEO · analytics ·
**the three CI tests**.

> **Why this is the right Phase 1.** It is the only phase that serves a paying audience, it
> is unblocked by every owner decision except taxonomy, and it addresses the largest
> evidenced commerce gaps: no filtering across 235+ seasonal styles, a size chart that is a
> single text-free JPEG, and no authorisation boundary anywhere.

---

## Phase 2 — Brand and editorial

**Serves:** boutique buyers evaluating the brand, and prospective retailers.

Living Contact Sheet (using **V2 F2's per-cell motion annotations**) · campaign routes ·
**shoppable editorial** — lookbook images that know their SKUs · **Midnight Rodeo redesign**,
recovering V2 F4's structure · **Product Anatomy** in semantic HTML, CSS, SVG and photography
· **buyer-first Frontier Passport** · richer owner intelligence (V2 F6's alert pattern) ·
material and supply-chain storytelling (using **`12e` as the model**) · stronger mobile
editorial journeys.

**Unblocks on:** photography, D-01 (Passport audience), D-06/D-07 (price tier, voice).

---

## Phase 3 — Cinema (optional)

**Serves:** first-time visitors who opt in. **Never required to reach anything.**

Frontier Thread ignition · buckle cinematic sequence · **redesigned** Frontier Engine
transitions · warehouse narrative · campaign film · advanced image-to-motion · Cinema mode.

**Hard preconditions:** a coherent storyboard exists (`13`) · assets are produced (`14`) ·
D-08 and D-11 are answered · Phases 1 and 2 are stable · **every sequence has a static and a
reduced-motion equivalent** · **no real-time WebGL without a separate proof, budget,
accessibility equivalence and owner approval.**

---

## What each phase must never do

| | |
| :--- | :--- |
| **Phase 1** | Ship a consumer price, cart or checkout · imply menswear, footwear or bespoke capability · publish a fabricated claim · render a restricted price publicly |
| **Phase 2** | Let editorial ambition remove a product from the DOM · introduce a category the owner has not confirmed |
| **Phase 3** | Block, delay or gate any commerce path · require a GPU for a fallback · autoplay >5s without a visible pause control |

---

## Sequencing rationale

`INFERRED` — Three facts set the order:

1. **The wholesale mechanics already exist as design.** V3 Frame 11 renders WHLSL price, MOQ,
   pack breakdown with real size runs, SKU, Add to Order, Export Line Sheet and stock states.
   **What is missing is the gate, not the commerce** — which makes Phase 1 a smaller build
   than it first appears.
2. **The brand story works in flat 2D.** `12e` proves it. Phase 2 needs photography and
   copy, not an engine.
3. **Phase 3 has no assets and no storyboard.** Sequencing it last is not caution, it is
   arithmetic.

**Phase 1 can begin once D-04, D-03 and D-05 are answered.** Everything else waits without
blocking it.
