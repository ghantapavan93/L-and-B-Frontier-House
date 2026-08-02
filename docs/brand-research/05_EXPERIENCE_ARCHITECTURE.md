# 05 — Experience Architecture

**Research date:** 2026-08-01

Covers the approved journey, the three experience modes, and how audiences enter.
Screen-level visual design is **not** decided here — that comes from Stitch V3.

---

## 1. The approved journey

Supplied in the brief and treated as approved intent:

```
Cinematic Ignition
  → Living Contact Sheet
  → Image Becomes Film
  → Shoppable Film
  → One West, Four Worlds
  → Definitive Flagship Homepage
  → Midnight Rodeo Campaign Journey
  → Garment Portal and Product Anatomy
  → Built By You Custom Atelier
  → Living Cart and Frontier Passport
```

Plus: Wholesale Showroom · Owner Operating World · Native Mobile Cinematic Commerce.

`OBSERVATION` — The "Four Worlds" names are deliberately not invented here, per the
brief. They must be extracted from V3.

### 1.1 Which steps are grounded in evidence

Assessing each step against verified brand facts — because a journey that assumes a
business that does not exist will fail regardless of execution quality.

| Step | Evidence status | Note |
| :--- | :--- | :--- |
| Cinematic Ignition | **Neutral** | Justifiable as a first-visit moment; must be skippable and must never repeat for returning buyers |
| Living Contact Sheet | **Strongly grounded** | A real daily drop cadence exists (`/jul-27/`…`/aug-01/`). This is the single best-evidenced concept in the journey |
| Image Becomes Film | **Grounded** | Monthly lookbook photography already exists |
| Shoppable Film | **Grounded, blocked on assets** | The *shoppable* half is the unlock. Film assets are unverified (OQ-13) |
| One West, Four Worlds | **Unknown** | Depends entirely on what the four worlds are. If they map to real audiences or categories, strong; if invented, decorative |
| Flagship Homepage | **Required** | Every audience passes through it |
| Midnight Rodeo Campaign | **Grounded** | *"rodeo season, NFR"* is evidenced merchandising language |
| Garment Portal / Anatomy | **Grounded** | Vertical integration and tactile motifs justify it |
| Custom Atelier | **Not evidenced** | No evidence bespoke production is offered (OQ-12) |
| Living Cart / Passport | **Not evidenced for consumers** | No consumer business exists (OQ-01). *Re-read as a **buyer** cart, it is strongly grounded* |

> `RECOMMENDATION` — **Reinterpret "Living Cart and Frontier Passport" for the wholesale
> buyer before building it for a consumer who does not yet exist.** A buyer's cart that
> remembers pack quantities, tracks progress to the $50 minimum, retains an order
> history for reordering, and carries a market-appointment record *is* a living cart and
> a passport. It serves a real, paying audience today with the same concept.

---

## 2. Entry points by audience

`RECOMMENDATION` — The journey above is one path. It must not be the only door.

| Audience | Entry | Sees |
| :--- | :--- | :--- |
| First-time visitor | Root | Full cinematic ignition |
| Returning buyer | Root, authenticated | **Straight to the drop.** No ignition, ever again |
| Rep at market | Deep link / QR from showroom | Linesheet mode, no cinema |
| Consumer from Instagram | Campaign deep link | Campaign → product, no ignition |
| Shopper via search | Product or category URL | Product page, fully functional standalone |
| Retailer prospect | Wholesale landing | Partnership story, then application |

`OBSERVATION` — Search and social traffic lands on **deep links**, not the homepage.
A journey designed only as a linear sequence from ignition will be experienced by most
visitors from the middle. Every surface must therefore stand alone.

---

## 3. The three experience modes

The brief defines CINEMA, BALANCED and INSTANT SHOP, and asks how they should differ,
how they are chosen, and how all three preserve the same product truth.

### 3.1 What differs

| | CINEMA | BALANCED *(default)* | INSTANT SHOP |
| :--- | :--- | :--- | :--- |
| Ignition sequence | Full | Abbreviated, skippable | None |
| Scroll choreography | Full scroll-directed narrative | Entrance transitions only | None |
| WebGL / 3D | Where justified | Off by default | Off |
| Video | Autoplay film, scrubbed sequences | Poster-first, play on intent | Posters only |
| Contact sheet | Spatial, animated eruption | Animated entrance, static after | Plain responsive grid |
| Transitions | Full choreography | Short cross-fades | Instant |
| Grid density | Editorial, generous | Balanced | Dense, information-first |
| Image loading | Progressive, high resolution | Standard responsive | Aggressively optimised |

### 3.2 What must never differ

`RECOMMENDATION` — This is the integrity rule that makes modes acceptable rather than
deceptive:

- **The same products.** No item visible in one mode and absent in another.
- **The same prices, packs, availability and sizes.**
- **The same product truth** — every attribute, measurement and material fact.
- **The same commerce actions.** Anything buyable in CINEMA is buyable in INSTANT SHOP.
- **The same URLs.** Mode is a presentation layer, never a separate site or route tree.
- **The same accessibility guarantees.** INSTANT SHOP is not the accessible version;
  all three are accessible.

> Modes change **how much choreography wraps the content**. They never change the
> content. If a mode changes what a person can buy or know, it has become a different
> store, and that is a trust failure.

### 3.3 How a mode is chosen

`RECOMMENDATION` — Resolution order, first match wins:

1. **Explicit user choice**, persisted. Always wins.
2. **`prefers-reduced-motion: reduce`** → never CINEMA. See the rule below.
3. **Save-Data header or a known-slow connection** → INSTANT SHOP.
4. **Device capability** — low core count, low memory, no WebGL → not CINEMA.
5. **Audience** — an authenticated wholesale buyer defaults to INSTANT SHOP; they are
   at work.
6. **Otherwise** → BALANCED.

`RECOMMENDATION` — Persist the choice in a first-party cookie or local storage, keyed
per device rather than per account, since the same buyer uses a phone on the floor and a
desktop at night with different needs. Always leave a visible, permanent control to
change mode — a preference a user cannot find is a trap.

### 3.4 Reduced motion is not a mode

`RECOMMENDATION` — **`prefers-reduced-motion` is an accessibility obligation that
applies inside every mode**, not a fourth mode and not a synonym for INSTANT SHOP.

A user may want the full editorial experience *and* not want vestibular triggers. The
correct behaviour is CINEMA's layout and imagery with its parallax, scrubbing, spatial
eruption and auto-playing film replaced by opacity cross-fades and static posters. It
must never silently downgrade them to a plain grid — that removes content they asked
for on the basis of a health setting.

---

## 4. Mobile

`RECOMMENDATION` — The brief asks for a native cinematic mobile experience rather than
a compressed desktop page. Two evidence-driven constraints shape it:

1. **The real device is a mid-range Android on a rural Texas connection**, not a flagship
   iPhone on office wifi. Stockists are in Mineral Wells, Weatherford and small-town
   Texas.
2. **Mobile is the buyer's browsing device and often the rep's selling device.**

Consequences:

- Vertical-first choreography. No horizontally scrubbed desktop sequences reflowed.
- Thumb-reachable primary actions; commerce controls in the lower third.
- Video is poster-first and `playsinline`, never autoplaying with sound.
- Touch targets sized for use while standing in a shop.
- INSTANT SHOP must be reachable in one tap from anywhere.

---

## 5. The Wholesale Showroom

`RECOMMENDATION` — This is the highest-value surface in the entire platform, because it
serves the only audience that currently pays.

It should contain: the current drop, the seasonal linesheet, market appointments for
August 18–21 and October 20–23, reorder from history, pack and minimum clarity, and
operational proof — 100% fill rate, 2.64-day processing, 615 combined marketplace
reviews.

`OBSERVATION` — It should be the **least animated surface in the project**, and that is
not a compromise. Respecting a buyer's time is the brand promise *"We are partners in
your success"* expressed as interface.

---

## 6. The Owner Operating World

`VERIFIED FACT` — Current publishing produces `april-2026-clone.html`,
`may-2026-clone.html`, and a "JANUARY 2026" link pointing at `january-2025.html`.

`REASONABLE INFERENCE` — Content is published by duplicating pages. This works and it
accumulates errors.

`RECOMMENDATION` — The operator surface is a **launch requirement, not a phase two**.
It must make publishing the daily drop faster than duplicating an HTML page, or the new
platform will be abandoned in favour of the old habit. Minimum: publish a dated drop,
build a lookbook with product links, schedule, and preview.

---

## 7. Architectural implications

`RECOMMENDATION` — Consequences for the eventual build, to be validated in the V3 audit:

- **One route tree, three presentations.** Mode is a context, not a routing branch.
- **Server-rendered content, progressively enhanced choreography.** Product data must
  render without JavaScript; motion is the enhancement.
- **Content and commerce data are shared across modes by construction**, so divergence
  is impossible rather than merely discouraged.
- **Every immersive surface has a non-immersive equivalent route state** reachable in one
  action.
- **Media is declared, never assumed.** Each slot names its poster, aspect ratio and
  fallback — see [07_CONTENT_AND_MEDIA_STRATEGY.md](07_CONTENT_AND_MEDIA_STRATEGY.md).

---

## Cross-references

- [02_AUDIENCE_AND_JOURNEYS.md](02_AUDIENCE_AND_JOURNEYS.md) · [04_CREATIVE_NORTH_STAR.md](04_CREATIVE_NORTH_STAR.md) · [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md) · [08_TECHNICAL_PRINCIPLES.md](08_TECHNICAL_PRINCIPLES.md) · [10_OPEN_QUESTIONS.md](10_OPEN_QUESTIONS.md)
