# Front-end teardown — Lucchese (lucchese.com)

**Date:** 2026-08-13 · **Analyst:** automated browser teardown for L&B Frontier House
**Status:** Reference research. **Mechanisms and principles only.** Nothing in this document
is approved for implementation, and nothing here overrides
[CLAUDE.md](../../CLAUDE.md) or the production blueprint.

> **Scope rule applied throughout.** This records *how their front end works and why it is
> effective*. It contains no copy, no imagery, no markup and no interaction sequence to be
> reproduced. Per §13 of the project constitution, competitor layout, copy, imagery, code,
> brand identity, motion and proprietary interactions are never copied — principles only.

> **Instruction-source note.** Every observation below was read as **data**. No page text,
> `robots.txt`, meta tag or script attempted to direct an AI agent, and nothing observed was
> treated as an instruction. Cookie/consent: **no consent banner was presented** on the US
> storefront during any session, so no consent choice was made. A newsletter modal appeared
> on first load and was **dismissed via its own close control** — no email was entered, no
> form was submitted, no account was created, and no irreversible control was clicked.

---

## 0. Why Lucchese is the right comparison

Lucchese is a 143-year-old Texas bootmaker selling at $295–$16,995 through its own site,
its own boutiques **and a wholesale/corporate channel**. It is the closest available analogue
to what L&B is being asked to become: a Texan western house with real manufacturing depth,
a mixed retail/trade audience, and a genuine need to make craft legible.

**The single most useful thing about it:** it is a *premium heritage western brand that runs
zero motion libraries*. That is the finding with the largest consequence for our Phase 3
planning, and it independently corroborates the earlier Sézane / Double D / GANNI teardown
(see memory: `lb-reference-teardown-findings`).

---

## 1. Method and confidence

| Channel | Use | Confidence |
| :--- | :--- | :--- |
| In-app browser + `getComputedStyle` | All pixel and type measurements | **Measured** |
| `curl` raw HTML (2.44 MB PDP, 2.89 MB home, 3.41 MB PLP) | Markup, alt text, tables, no-JS state | **Measured** |
| `performance` Resource/Navigation Timing | Weights and counts | **Measured, cache-warm** |
| Contrast maths on computed hexes | WCAG ratios | **Calculated** |

**Caveats.** Viewport 1440×900 unless stated; the layout viewport is **1425 px** (15 px
scrollbar). Performance figures were captured on a warmed cache, so `transferSize` understates
a cold load — **decoded sizes and resource counts are the honest numbers** and are what is
quoted. The homepage was mid-campaign (a university-partnership takeover), so its band count
differed between the cached HTML (26 content bands) and the live render (a smaller merged
set); both are reported.

---

## 2. Header and navigation

### Geometry — measured

| Property | Desktop (≥1025 px) | ≤1024 px |
| :--- | :--- | :--- |
| Total header height | **117–118 px** | **64 px** |
| Rows | **2** | 1 |
| Sticky | Yes — wrapper `position: sticky; top: 0; z-index: 30` | Yes |
| Height on scroll | **Unchanged at 117 px** — does not shrink | — |
| Logo | **Absolutely centred**, 170 × 50 px, `left: 50%` + `translateX(-50%)` | Centred |
| Nav row height | 44 px | — |
| Search field | 282 × 30 px, borderless, 13.3 px | Icon only |

**Row 1 (≈70 px)** carries, left to right: a **Men / Women pair**, a store-locator control
naming the visitor's nearest city, the centred wordmark, then account / wishlist / cart.
**Row 2 (44 px)** carries 10 top-level category links.

### The structural decision worth stealing

The Men/Women switch is a real **`role="tab"` pair with `aria-selected` and `aria-controls`**,
not two nav links. Gender is modelled as a *view state over one catalogue*, and flipping it
swaps the entire second row. Two consequences:

1. The category row stays at 10 items instead of 20, so it never wraps.
2. There is exactly one product taxonomy underneath; audience is a lens onto it.

This is directly relevant to **D-04**. It demonstrates a third option beyond "audience
gateways" and "product categories": *audience as a persistent tab, category as the nav*.

### Mega-menu mechanics — the headline mechanism

- **Trigger: hover, via pure CSS.** The parent `<li>` carries a group class; the child `<ul>`
  is `position: absolute; top: 100%` and flips from `visibility: hidden; opacity: 0` to
  visible under a `group-hover` variant.
- **Zero JavaScript.** No listeners, no ARIA, no `aria-expanded`, no `aria-haspopup`.
- **Transition: 100 ms**, `all`.
- **Panel is a plain link list**, 256 px wide, ~344 px tall, 6 links, no imagery inside.
- **Every panel is server-rendered in the HTML**, present at load, merely hidden.

That last point matters more than the visual: the full ~60-link category tree ships in the
document, so it is crawlable and survives a JS failure. The panels are text-only — **no
imagery in the menus at all**, which is why the header costs nothing to open.

### The defect in it (see §11)

The theme author *wrote* `group-focus-within` variants alongside `group-hover` on the panel,
but they **do not take effect**. Verified: with the trigger focused, `li.matches(':focus-within')`
is `true` and the panel still computes `visibility: hidden; opacity: 0` after 400 ms. Because
`visibility: hidden` removes descendants from the tab order, **the sub-category links are not
keyboard reachable from the header.** Each top-level link is a real `href`, so it is a
degradation rather than a dead end.

---

## 3. Typography

### The finding: one sans, no serif, weight 300

| Role | Family | Size | Line-height | Tracking | Weight | Case |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| Hero display | brandon-grotesque | **56 px** | 58.8 px (1.05) | **−0.56 px** | **300** | UPPER |
| Secondary display | brandon-grotesque | 48 px | 52.8 px | −0.48 px | 300 | UPPER |
| Section heading | brandon-grotesque | 42 px | 46.2 px | +1.68 px | 300 | UPPER |
| Band heading (dominant) | brandon-grotesque | **28 px** | 34 px (1.21) | +0.31 px | 300 | UPPER |
| Sub-band heading | brandon-grotesque | 31.2 / 32 px | 40 px | +0.36–2 px | 300 | UPPER |
| PDP product title (h1) | brandon-grotesque | **28 px** | 34 px | +0.31 px | **300** | UPPER |
| Body / description | brandon-grotesque | **16–18 px** | 22 px | normal | 400 | sentence |
| Card title | brandon-grotesque | 16 px | 20 px | +0.32 px | 400 | UPPER |
| **Price** | brandon-grotesque | **16 px** | 20 px | +0.32 px | **400** | — |
| Nav link | brandon-grotesque | **12 px** | 22 px | **+2 px** | 500 | UPPER |
| Button / CTA label | brandon-grotesque | **11–14 px** | — | **+1.32–2 px** | 400–500 | UPPER |
| Meta / SKU | brandon-grotesque | 14 px | 21 px | normal | 400 | — |

- **Root font-size 16 px.** No fluid `clamp()` display type detected.
- **One family does everything: Brandon Grotesque**, served from Adobe Typekit. A second face
  (Futura PT) is loaded by the stylesheet but is used by **2 elements** on a page — effectively
  unused residue.
- Weights actually loaded: **300, 400, 500, 700**. Display type is **300 throughout**.

### Three transferable rules

1. **Display type is smaller than you think.** The largest type on the site is 56 px on a
   1440 px viewport — the hero headline occupies **38.4 % of viewport width**. The *dominant*
   heading across all bands is **28 px**. Premium here is not type scale.
2. **Tracking does the work that size doesn't.** Small type is spaced wide (nav 12 px/+2 px;
   CTA 11 px/+1.32 px), large type is spaced tight (56 px/−0.56 px). One optical rule,
   consistently applied, and it reads as a designed system without a second typeface.
3. **The price is deliberately quiet.** On a **$3,995** boot the price renders at **16 px,
   weight 400, in grey `#4D4D4D`**, while the product name renders at **28 px in navy**. The
   name outranks the number. Restraint, not shouting, is what signals the tier.

---

## 4. Colour

### Computed palette — the whole thing

| Token | Hex | Role | Contrast vs. white |
| :--- | :--- | :--- | ---: |
| Primary navy | **`#002855`** | All headings, nav, links, dark bands | **14.64 : 1** |
| Navy (2nd) | `#0C2752` | Product text, prices | 14.71 : 1 |
| **Image bed** | **`#F0EDE9`** | Warm bone behind every product photo | 1.17 : 1 |
| Page ground | `#FAFAFA` | Largest painted area | 1.04 : 1 |
| Card / surface | `#FFFFFF` | — | — |
| Secondary text | `#4D4D4D` | Price, meta | 8.45 : 1 |
| Disabled text | `#B3B3B3` | 6 elements | **2.10 : 1** ✗ |

Navy on the bone image bed measures **12.54 : 1**.

### The mechanism that matters most to us

`--collection_image-background-color: #f0ede9`

Every product photograph sits on a **dedicated warm bone bed**, not on the white page ground.
The bed is only **1.17 : 1** against white — almost invisible as a colour — but it is the
reason tan, cognac and chocolate leather read *warm* instead of grey. The interface contributes
navy and neutrals only; **every chromatic value on screen comes from the goods.**

This is §5 of our constitution — *"Colour carried by the garment, not the interface"* —
implemented as a single CSS custom property. It is the cheapest high-value idea in the teardown.

Also noted: the theme ships an entire **unused default palette** (orange, yellow, green,
turquoise, cyan, purple, red) inherited from a CSS framework, sitting dead in `:root` alongside
the real tokens. Structurally identical to the Material 3 residue our own audit found in the
Stitch exports (§13a) — tooling defaults survive into production unless someone deletes them.

---

## 5. Homepage — band structure

Measured live at 1440 × 900: **document height 4,718 px ≈ 5.2 viewports**.
The cached template carried **26 content bands** between header and footer; the live campaign
render collapsed to a smaller set. Band inventory from the template, in order:

| # | Band type | Carried by |
| ---: | :--- | :--- |
| 1 | Video hero | autoplay video |
| 2 | **Split hero** | 50 / 50 video + solid panel |
| 3–4 | Video hero ×2 | autoplay video |
| 5–8 | Collection tiles ×4 | photography |
| 9 | Text + image columns | editorial |
| 10–11 | Featured collection ×2 | **product rows** |
| 12 | Image with text overlay | photography |
| 13, 15 | Collection slider ×2 | product carousel |
| 14 | Collection list with buttons | photography |
| 16, 21 | Image with text overlay ×2 | photography |
| 17, 23 | Image columns / images in row | photography |
| 18 | Bestsellers | **product row** |
| 19–20 | Collection list + featured collection | product |
| 22 | Image with text | editorial |
| 24 | **Store locator** | map / list |
| 25 | Newsletter | form |

### The split hero — measured, and the best idea on the page

| Property | Value |
| :--- | ---: |
| Total | 1425 × **522 px** (**0.58 viewport heights**) |
| Copy half | 713 px wide, solid **`#002855`** |
| Media half | 713 px wide, autoplay video |
| Headline | 56 px / 300 / white / uppercase / −0.56 px |
| CTA | 185 × **48 px**, white fill, navy label, 11 px / +1.32 px, **0 radius** |

Two decisions to take:

1. **The hero is 0.58 viewport heights, not 100vh.** Content is visibly cut off at the fold,
   so scrolling is invited rather than commanded. No "full-screen statement" tax.
2. **Type never sits on the photograph.** The copy lives on a solid navy panel *beside* the
   video. This removes the scrim/legibility problem entirely rather than mitigating it — white
   on `#002855` measures **14.64 : 1** with zero overlay trickery, and the imagery is never
   darkened to make text work. Full-bleed photography still appears, but as its own band.

### Video handling — WCAG-correct

Hero videos are `autoplay muted loop playsinline`, `aria-hidden="true"` where decorative,
`preload="auto"` on the first and **`loading="lazy"` on subsequent ones**. The theme renders
its own **48 × 48 px Play and Unmute buttons** — comfortably over the 24 × 24 px floor of
WCAG **2.5.8**, and satisfying **2.2.2 Pause, Stop, Hide** for a >5 s auto-starting loop.
The heaviest asset seen is an HD-1080p ≈4.8 Mbps MP4.

---

## 6. PLP (category page) — `/collections/mens-boots`, 209 products

### Grid — measured across breakpoints

| Viewport | Columns | Card | Image | Ratio |
| ---: | ---: | :--- | :--- | ---: |
| **1440** | **3** | 475 × 690 | 473 × 557 | 0.850 |
| **1024** | **3** | 336 × 511 | 334 × 393 | 0.850 |
| **768** | **1** | 753 × 998 | 751 × 884 | 0.850 |
| **390** | **1** | 390 × 570 | full-bleed, **0 gutter** | 0.850 |

**Three columns at desktop, one on mobile.** Most e-commerce runs 4→3→2→2; Lucchese never
shows more than three products across, and on a phone shows exactly one, edge to edge with no
side gutter. Aspect ratio is **locked at 0.850 (17:20) at every breakpoint** and reserved with
a `--ratio-percent: 117.647%` padding box, so images cannot shift layout.

A **grid-density toggle** sits beside the sort control, letting the user switch to a denser
grid. Generous by default, compressible on request.

### Card anatomy

- **Bare image.** No frame, no border, no radius, transparent card background; the warm bone
  bed is on the ratio box beneath the photo.
- **Hover:** a second image, pre-rendered at `opacity: 0`, cross-fades in. No layout change.
- Metadata, in order: status badge (plain outlined rectangle) → title (16 px, uppercase,
  navy) → price (16 px) → colourway count.
- **No quick-shop, no add-to-cart, no size selector on the card.** The only control is a
  wishlist heart, which is `opacity: 0` on desktop until hover, **always visible below the
  large breakpoint**, and revealed by `:has(button:focus)` for keyboard users.

The card sells the photograph. Every commerce decision is deferred to the PDP — appropriate
when fit and material are the decision, which is exactly our situation.

### Filtering — the mechanism to copy verbatim in spirit

Filters are **native `<details>` / `<summary>` disclosures in a horizontal chip row** across
the top of the grid (not a sidebar, not a drawer), 40 px tall, `0.8 px` navy border, **0 radius**.
The form is `method="get"`; facet inputs are checkboxes whose names become query parameters.

**This means the entire filter system works with JavaScript disabled and is keyboard-operable
by construction.** No listeners, no focus trap, no ARIA to get wrong.

Facets offered, with live result counts on every option:

| Facet | Options | Notable values |
| :--- | ---: | :--- |
| Availability | 2 | In stock (209) / Out of stock (160) |
| Size | 15 | 8 → 14, half sizes |
| **Width** | 4 | **D, EE, M, W** |
| **Material** | 15 | Alligator, Caiman, Ostrich, Lizard, Crocodile, Suede, Smooth, Cowhide… |
| Colour | 10 | swatch layout |
| Price | range | From / To |
| **Toe shape** | 4 | Round, Snip, Square, Wide Square |
| Style | 8 | Cowboy (112), Roper (38), All Weather (25)… |

Two layouts exist — `--text` and `--swatch` — so colour, toe and style render visually while
size and material render as text.

**Data-quality warning we should heed.** The Material facet contains **"Purple (1)"** and
**"Tan (1)"** — colour values leaking into a material dimension. This is what attribute
extraction from product names produces when unsupervised, and our §11 explicitly plans to
build facets that way. Budget a curation pass.

### Pagination and sort

- **"Load More" is a real `<a href="?page=2">`**, wrapped with a progress bar and a
  "Showing 1–24 of 209" count. Not infinite scroll, not a JS button — a crawlable URL that
  degrades to plain navigation. 24 products per page.
- **Sort: 9 options** — Featured, Most relevant, Best selling, A–Z, Z–A, price ↑, price ↓,
  date ↑, date ↓.

### URL hygiene — relevant to our CI Test 3

Product slugs are **`/products/<name>-<colourway>`**. Digits appear only as part of a product
name, **never as a price**. Filters live in query parameters, never in the path. Their slug
scheme would pass our slug-purity assertion unchanged — a working proof that name+colourway
is sufficient and that D-00's failure mode is avoidable by convention alone.

---

## 7. PDP — `/products/the-varsity-cognac`

### Page depth — measured

**5,641 px total = 6.3 viewport heights.** Section breakdown:

| Section | Height | Share |
| :--- | ---: | ---: |
| Header | 117 px | 2 % |
| **Product (gallery + buying panel)** | **989 px** | **18 %** |
| Accordion (collapsed) | 71 px | 1 % |
| Customer reviews | 622 px | 11 % |
| "You may be interested in" | 795 px | 14 % |
| Bestsellers | 845 px | 15 % |
| Recently viewed | 815 px | 14 % |
| Footer | 831 px | 15 % |

**2,455 px — 44 % of the page — is three stacked product-recommendation carousels.** The
product itself gets 18 %. This is the clearest *anti-pattern* in the teardown: the PDP is
merchandising-heavy and story-light, and the craft narrative that justifies the price lives
somewhere else entirely (§8).

### Gallery

- **Two-up grid**, not a single large image with thumbnails. 712 px column, slides
  **352 × 414 px**, ratio **0.850** — identical to the PLP card, so the image reads as the
  same object at both scales.
- **8 images** per product, shot to a repeated protocol: `_Right`, `_Pair`, `_Front`, `_Back`,
  plus detail frames. Named by view, not by sequence number.
- Zoom via a lightbox; a thumbnail rail exists in markup but is collapsed at desktop.
- Alt text is populated and product-specific (pattern: name, colourway, index).

### Buying panel — measured order, top to bottom

The panel is exactly **50 % of the content width** (712 px, starting at x = 712).

| y | Element | Type treatment |
| ---: | :--- | :--- |
| 170 | **Price** | 16 px / 400 / grey `#4D4D4D` |
| 193 | **Product name (h1)** | 28 px / 300 / navy / uppercase |
| 239 | **Style number (SKU)** | 14 px / grey — publicly exposed |
| 257 | Star rating + review count | 14 px |
| 330 | Selected colourway + swatch | 16 px |
| 468 | Description, truncated to ~3 lines | 18 px |
| 544 | "Read more" → jumps to the accordion | 18 px |
| 609 | Selected-size readout | 14 / 18 px |
| 668 | **Choose size** (opens size panel) | 14 px / +2 px / uppercase |
| 748 | **Primary CTA** — navy fill, white label, full width | 14 px / +2 px / uppercase |
| 820 | Three suggested-question chips (AI search) | 14.24 px |
| 906 | **Store availability check** | 14 px / +2 px / uppercase |
| 990 | Shipping threshold | 12 px / +2 px / uppercase |
| 1038 | Returns window | 12 px / +2 px / uppercase |

**Price above name, and quieter than it.** The SKU is surfaced to the customer — trade-buyer
behaviour surfacing in a DTC layout.

**The CTA is gated on size, and says so.** Until a size is chosen the primary button reads as
a size prompt, not "Add to cart". For a fit-critical product this converts an error state into
an instruction, and there is a separate size-opening control above it. Variants: **12 sizes
(8–14, half sizes) × 2 widths (D, EE)**.

### Craft storytelling on the PDP

Exactly **one** accordion — a description panel containing:

1. A prose paragraph.
2. **A specification list attributing material per garment component** — vamp, quarters,
   pull straps, shaft height, sole edge, welt, construction.
3. A short craft note, with a video that has **`controls`, no autoplay**.

Point 2 is the transferable one. Materials are named **per component**, not as a single
"Materials: leather" line. That is *material honesty at high resolution* (§5) expressed as
plain structured text — no image, no diagram required.

**There is no size chart, no fit guidance and no heritage content on the PDP.** Zero `<table>`
elements exist on the page. All of it lives in a separate content system.

---

## 8. "Boot 101" — the education system (the most valuable finding)

Product education is **not** crammed into the PDP. It is a five-page reference suite, given
its **own footer column ranked alongside Help and Contact**:

| Page | Contains |
| :--- | :--- |
| **Boot Fit** | How boots should feel · rule-of-thumb sizing note · **two size-conversion tables** · a 4-step try-on sequence with images · common fit problems · break-in guidance |
| **Boot Anatomy** | Labelled boot diagram · glossary of construction terms · **the same two size tables repeated in context** |
| **Boot Materials** | **12+ named leathers**, each with photography — alligator, caiman, crocodile, ostrich, lizard, shark, hippo, elephant, cowhide, suede, goat |
| **Boot Toe & Heel Options** | **13 toe shapes**, each with a code, an illustration and per-gender availability icons |
| **Our Process** | **11 named manufacturing steps** — pegging, hand-stitching, lasting, cutting and dies, skin matching, hand tooling, stonewashing, pattern cutting, burnishing |

### Three mechanisms to take

**1. The size chart is real HTML `<table>` markup.** Verified: two tables, ~9.2 KB of markup
each, columns **US · Euro · UK · Inches · CM**, one per gender, every cell live text.

This is the direct answer to our §8.4 blocker. Our current live site ships its size chart as a
**single JPEG with zero text** — a probable WCAG 1.1.1 failure and the thing most directly
contradicting the brand's inclusivity claim. Lucchese proves the accessible version is neither
exotic nor expensive: it is a table.

**2. The education taxonomy and the filter taxonomy are the same vocabulary.** The 12 materials
documented on Boot Materials are the values in the PLP Material facet. The 13 toe shapes are
the Toe facet. A customer who reads the education page learns the exact words that filter the
catalogue. One vocabulary, two surfaces — teaching and merchandising reinforce rather than
compete.

**3. Reference content is repeated where it is needed.** The size tables appear on both Boot
Fit and Boot Anatomy rather than being centralised behind a link. Contextual duplication beats
a navigational round-trip.

Diagram alt text is written for meaning (e.g. describing an anatomical diagram and its labelled
parts) rather than as a filename — though many photographic content images carry `alt=""`,
which is a miss (§11).

---

## 9. Motion and transitions

### Measured census across a live page

| Duration | Easing | Property | Elements |
| ---: | :--- | :--- | ---: |
| **300 ms** | ease-in-out | **color** | **446** |
| 300 ms | ease-in-out | all | 84 |
| 400 ms | cubic-bezier(.25,.46,.45,.94) | opacity | 44 |
| 150 ms | cubic-bezier(.4,0,.2,1) | all | 28 |
| 200 ms | ease | transform, opacity | 28 |
| **100 ms** | ease | all (mega-menu) | 16 |
| 700 ms | cubic-bezier(.4,0,.2,1) | transform | 9 |
| 800 ms | ease-in-out | all | 6 |
| 500 ms | ease | max-height (accordion) | 5 |

Keyframe animations are all short one-shot fades (300 ms–1 s) plus two infinite spinners. There
is **no entrance choreography, no stagger, no reveal-on-scroll**.

### What is absent — and this is the finding

- **No GSAP, no ScrollTrigger, no Lenis, no Locomotive, no Framer Motion, no three.js.**
- `scroll-behavior: auto` — **no smooth-scroll hijack**.
- **0 parallax elements.** 3 scroll-driven CSS rules total, all inert framework residue.
- No scroll-linked animation of any kind.

A 143-year-old heritage brand selling boots up to **$16,995** ships a site whose entire motion
vocabulary is **hover colour fades, opacity cross-fades and a 100 ms menu**. The premium signal
is carried by photography density, image scale and typographic restraint — not by motion.

### Reduced motion

Handled, but thinly: **4 `prefers-reduced-motion` blocks out of 6,558 CSS rules.** Two are
inert theme residue, one belongs to a payment widget, and Tailwind's `motion-reduce:` variant
generates only two utilities that must be opted into per element. There is no global
motion-suppression rule. Since almost nothing moves, the exposure is small — but the pattern
confirms our §8.2 warning: **nothing in the stack provides reduced-motion handling for you.**

---

## 10. Tech stack and performance

### Stack

| Layer | Detected |
| :--- | :--- |
| Platform | **Shopify** (`lucchese-inc.myshopify.com`) |
| Theme | Fully custom, agency-built (`theme_store_id: null`) |
| CSS | **Tailwind**, `tw-` prefixed, ~179 CSS custom properties |
| JS framework | **Alpine.js** (small islands) + **jQuery** |
| Search & filter | Boost AI Search & Discovery + Shopify native storefront filters + an AI search overlay |
| Fonts | **Adobe Typekit** |
| Carousel | Swiper (PDP gallery only) |
| Email | Klaviyo | 
| Other apps | Affirm, variant-swatch app, form builder, returns, appointments, A/B testing, password gate |
| **Motion libraries** | **None** |

**Alpine.js is the whole interactivity story.** Small islands (`x-data`) mounted on
server-rendered markup — architecturally the same shape as our own island rule in §9
("server-rendered children pass through untouched"), just with a different library.

### Weight — measured (cache-warm; decoded figures are the honest ones)

| Metric | Value |
| :--- | ---: |
| HTML document, decoded | **2.44 MB** (PDP) · 2.89 MB (home) · **3.41 MB** (PLP) |
| **JavaScript, decoded** | **≈8.78 MB across 271 files** |
| Total resources | **506** |
| Script tags in document | **118** |
| `load` event | **6,027 ms** |
| `domInteractive` / DCL | 608 ms / 1,403 ms |
| Image formats served | **41 WebP**, 3 JPG, 1 PNG, 4 SVG |

Third-party hosts observed include six analytics/ad platforms, two session-recording tools,
affiliate, financing, returns, forms and A/B testing. Part of the JS total is Shopify
prefetching its own checkout bundles from the PDP.

### The lesson for us

**Against our budget of ≤180 KB compressed initial JS, this site is off by more than an order
of magnitude** — and it is a successful premium retailer. Two readings, both true:

1. Their weight is **almost entirely third-party marketing tags and platform overhead**, not
   experience code. The *front-end they designed* is cheap: Tailwind, Alpine, no motion
   library, one webfont family.
2. It is nonetheless a real cost, and the reason a 2.4 MB document and a 6-second load are
   tolerable here is that **the product is already sold before the page finishes** — heritage
   demand carries it. L&B has no such buffer.

The actionable version: **their design system is affordable; their tag manager is not.** Adopt
the first, and treat every third-party script as a budget line.

---

## 11. Accessibility observations

### Good

| Item | Evidence |
| :--- | :--- |
| Skip link | Present, targets a real `#main-content` |
| Landmarks | 1 `<main>`, 1 `<header>`, 1 `<footer>`, 3 `<nav>` |
| `lang` | `en` |
| Filters | Native `<details>` — keyboard-operable by construction, works with no JS |
| Pagination | Real `<a href>` |
| Gender switch | Correct `role="tab"` / `aria-selected` / `aria-controls` |
| Video controls | **48 × 48 px** Play + Unmute — passes **2.2.2** and **2.5.8** |
| Size data | **Real `<table>` markup**, US/Euro/UK/inches/cm |
| Product alt text | Populated and product-specific on PLP and PDP |
| Wishlist control | Revealed by `:has(button:focus)` for keyboard users |
| Touch targets | At 390 px, only **3** interactive elements under 24 px, all text links |
| Statement | A published accessibility statement exists |

### Defects — each one is a lesson we can price

**1. Sub-navigation is not keyboard reachable.** The `group-focus-within` variants are present
in the class list but do not win the cascade; with the trigger focused and
`:focus-within` matching, the panel still computes `visibility: hidden` after 400 ms. Roughly
60 sub-category links sit outside the tab order.
→ **Writing the focus variant is not the same as shipping it.** Assert computed styles under
real focus in CI.

**2. The focus indicator fails non-text contrast.** The theme's own focus treatment is a
`0.125em` ring of navy at **25 % alpha**. Blended over white that is **`#BFC9D5`**, measuring
**1.68 : 1** against a **3 : 1** requirement (WCAG 1.4.11). Product-grid links and nav links
get no custom treatment at all and fall back to the UA default; 21 `outline: none` rules exist,
mostly from third-party widgets.
→ Precisely the failure our audit already found in our own spec (Oxidized Silver at 2.18 : 1).
**Two independent systems, same mistake.** Compute the ratio; never trust the token.

**3. Disabled/meta text at `#B3B3B3` on white = 2.10 : 1** — fails 4.5 : 1.

**4. Heading order is incoherent.** The PLP exposes **2 `<h1>`s**; a visually-hidden `<h1>`
precedes the real page `<h1>`, and an `<h3>` precedes an `<h2>`. On the homepage the only `<h1>`
is a 10 px visually-hidden wordmark, so **every visible display heading is an `<h2>`**.

**5. Alt text is inconsistent.** 194 images on the PLP: **58 with `alt=""`**, 1 with no `alt`
attribute. Correct for decorative art, but material and editorial photographs are also empty.

**6. The B2B enquiry page is empty without JavaScript.** `/pages/lucchese-corporate-sales`
server-renders its body as the literal placeholder string `{formbuilder:126620}`; a
third-party app swaps in the form client-side.
→ **This is our no-JS assertion (CI Test 1) failing in the wild, on the exact page type our
Phase 1 depends on.** Their whole trade channel is inaccessible to a no-JS visitor.

Also observed: a Liquid template error leaked into a `<picture><source>` element in production
markup.

### The pattern they got right that we already require

The theme ships a rule of the shape *"hide the variant selector only when a JS-set class is
present on `<html>`"* — hidden states scoped under a JS-set hook, so **a JavaScript failure
leaves the content visible**. That is §8.7 of our constitution, implemented. Worth citing as
precedent when we write ours.

---

## 12. What Frontier House should take

Opinionated, specific, and tied to what each item would cost us.

### A. Take directly — cheap, proven, and already inside our constitution

**1. The warm image bed as a single token.**
*Their evidence:* one custom property puts every product photo on `#F0EDE9` instead of white,
at 1.17 : 1 against the page — invisible as colour, decisive for how leather reads.
*So we should:* define one `--product-image-bed` token in the Phase 1 design system and apply
it to every product ratio box. It delivers §5's "colour carried by the garment" for the price
of one declaration, and it works on day one with fixture photography.
*Needs:* nothing. **Do this first.**

**2. Native `<details>` filter disclosures in a horizontal chip row.**
*Their evidence:* 8 facets, ~120 options, live counts, zero JavaScript, keyboard-operable by
construction, `method="get"` so state lives in the URL.
*So we should:* build our §11 faceted filtering the same way rather than as a React drawer. It
passes our no-JS assertion for free, needs no focus-trap work, and every filter state becomes a
shareable, crawlable URL. A horizontal chip row also leaves the full grid width to product —
which matters more for us than for them, because wholesale buyers scan.
*Needs:* facet vocabulary, which is blocked only on **D-04**, not on this mechanism.

**3. "Load More" as a real paginated `<a href="?page=n">`.**
*Their evidence:* 209 products, 24 per page, a progress bar and an explicit "showing X of Y".
*So we should:* never ship infinite scroll. A buyer working a 235-style seasonal assortment
needs to know where they are and be able to send a colleague a link to page 3.
*Needs:* nothing.

**4. Slug = name + colourway. Never a number that could be a price.**
*Their evidence:* `/products/<name>-<colourway>` across the catalogue; digits only ever appear
as part of a product name.
*So we should:* adopt this as the slug contract. It is a working, at-scale proof that our
**CI Test 3** is satisfiable by convention, and it is the direct structural fix for **D-00**.
*Needs:* nothing.

**5. Locked image aspect ratio reserved with a padding box.**
*Their evidence:* **0.850 at every one of four breakpoints**, on both card and PDP slide, held
by a `--ratio-percent` box.
*So we should:* pick one ratio and hold it everywhere, reserved before load. This is how a CLS
budget of ≤0.05 is actually met, and it makes a garment read as the same object in grid and
detail. **Choose a ratio that flatters apparel on a body, not footwear on a shelf** — 0.85 is
tuned to a boot silhouette; a shirt or dress wants taller, likely 3:4 or 2:3.
*Needs:* a photography protocol decision — which is on the critical path anyway
(`lb-media-supply-blockers`).

**6. The size chart as an HTML `<table>`, repeated in context.**
*Their evidence:* two live tables, US/Euro/UK/inches/cm, present on two different pages rather
than centralised behind a link.
*So we should:* close §8.4 with a table, and place it on both the fit page and the PDP size
panel. Our current JPEG chart is the single most cited accessibility defect in our own audit;
this is the whole fix.
*Needs:* **real size and grade data from the owner.** Currently missing (`24_PRODUCTION_READINESS_REGISTER`).

### B. Take the principle, change the execution

**7. Materials named per garment component — but ours must be honest.**
*Their evidence:* the spec list attributes material to vamp, quarters, pull straps, sole edge
and welt separately, as plain text. It is the most convincing thing on their PDP and it costs
nothing to render.
*So we should:* build the PDP spec block as a **component → material map** (yoke, placket,
cuff, topstitch, hardware, lining) rather than one "Materials" line. This is literally §5's
"material honesty at high resolution."
*But:* our §13a is explicit — the Stitch designs invented *Kuroki Mill* and *Leon & Tuscany*
attributions that **contradict verified vertical integration**. Lucchese can name a component's
leather because it is true of their supply chain. **We may name components and construction
only where product data supports it, and must never invent a mill.** The structure is
transferable; the specificity must be earned.
*Needs:* per-component product data. **This is a data request, not a design task.**

**8. Education as a first-class content system, not PDP accordions.**
*Their evidence:* five reference pages with their own footer column, and — critically — the
education vocabulary *is* the filter vocabulary. Twelve documented materials are the twelve
material facet values; thirteen documented toe shapes are the toe facet.
*So we should:* build our equivalent (fit and grading, fabric and weave, construction, care,
prepack and minimums) as routed pages whose headings are the exact facet values we filter on.
One vocabulary, two surfaces. For a wholesale-first launch this doubles as **buyer education**:
a boutique owner who understands our fabric names writes better orders and returns less.
*But:* their PDP gives 44 % of its height to three recommendation carousels and **0 % to
craft**. Do not copy that ratio — see (D).
*Needs:* D-04 for the vocabulary; owner content for the substance.

**9. Audience as a persistent tab over one catalogue.**
*Their evidence:* a real ARIA tablist swaps the entire category row, keeping it at 10 items and
guaranteeing a single underlying taxonomy.
*So we should:* treat this as a live option for **D-04**. It resolves the tension our audit
found between "audience gateways" and "product categories" without choosing one: **audience is
a lens, category is the navigation.** It also models §11's "one garment, one product record"
cleanly — Plus becomes a filter or a lens, never a second catalogue.
*But:* our audience axis is not gender. Ours is plausibly **buyer vs. consumer** (blocked on
D-01) or **Women / Plus / Girls** (D-04). And the pattern only works if the two sides are
near-symmetrical; our menswear does not exist (**D-03**), so a two-tab structure must never
imply a menswear side.
*Needs:* **D-04, D-03, D-01.** Do not implement before they are answered.

**10. The split hero — type beside the image, not on it.**
*Their evidence:* 50/50, 522 px, headline on solid navy at **14.64 : 1**, video in the other
half, and the band deliberately ends at 0.58 viewport heights.
*So we should:* make this our default editorial band. It removes the scrim problem structurally
rather than mitigating it, keeps contrast trivially compliant, and — decisively for us — it
**works with a still frame and no film at all**, which is the situation we are actually in
(**D-11**, zero production assets). It is a poster-first band by construction (§9).
*Needs:* one good still per campaign. Nothing else.

### C. Take as a warning — the same mistake, twice, independently

**11. Compute the focus ring; never trust the token.**
Their focus ring is navy at 25 % alpha = `#BFC9D5` = **1.68 : 1** against a 3 : 1 requirement.
Our own audit found our specified ring at **2.18 : 1**. Two teams, same failure mode.
*So we should:* add a CI assertion that computes the actual contrast of the focus indicator
against every surface it can land on, and fails the build. Our audit already names the fix —
Tobacco Leather `#734F36` at 6.49 : 1.

**12. Writing the focus variant is not shipping it.**
Their menu carries `group-focus-within` classes that lose the cascade, so ~60 links leave the
tab order. Code review would pass this; only a computed-style check catches it.
*So we should:* if we build a CSS-only hover menu — and we should, it is elegant and free — the
acceptance test must **focus the trigger and assert the panel computes visible**, not assert
the class exists.

**13. Third-party tags, not experience code, are what break the budget.**
118 script tags, ≈8.8 MB decoded JS, 506 resources, 6.0 s load — on a site whose own front end
is Tailwind + Alpine + no motion library.
*So we should:* budget third-party scripts explicitly in CI alongside our ≤180 KB first-party
figure. The design system Lucchese uses would fit our budget comfortably. Their tag manager
would consume it forty times over.

**14. A JS-dependent trade form is a broken trade channel.**
Their B2B page server-renders as the literal string `{formbuilder:126620}`.
*So we should:* treat this as the canonical failure our **CI Test 1** exists to prevent, and
extend that test beyond product pages to **the registration and tax-ID gate** — the surface
Phase 1 depends on most. A wholesale gate that needs JavaScript to render is a wholesale gate
that is closed.

**15. Curate extracted facets.**
Their Material facet contains "Purple" and "Tan". Our §11 plans to extract facets from product
names by the same method.
*So we should:* treat extraction as a first draft and budget a human curation pass, plus a
CI check that no facet value appears in two dimensions.

### D. Do NOT take

**16. Do not copy their PDP proportions.** 44 % recommendation carousels, 18 % product, 0 %
craft. Their price is justified by 143 years of reputation the visitor already holds; ours must
be justified **on the page**. Our PDP should invert it — product and craft dominant, at most one
recommendation row. Their own best content (Boot 101) proves they know this and simply put it
elsewhere.

**17. Do not copy the 117 px two-row sticky header.** It never shrinks on scroll and eats 13 %
of a 900 px viewport permanently. Our last commit deliberately went the other way — *"one-row
header, bare photography"* — and that was the right call. Take their *centred-logo, tabbed-audience,
text-only-mega-menu* ideas; reject the height.

**18. Do not adopt three desktop columns as our default.** Three columns × 475 px suits a boot
photographed alone on a bed. Apparel on a body reads well smaller, and a **wholesale buyer
scanning 235 seasonal styles needs density, not grandeur.** Their grid-density toggle is the
right idea — but our Phase 1 default should be the *denser* setting with a generous option,
which is the opposite of their default. This is the clearest place where their DTC-luxury
posture is wrong for our paying audience.

**19. Do not exposed-SKU-by-default.** They print the style number publicly at 14 px. For us a
style number is fine, but our §11 permission boundary means **anything that could reconstruct
pack structure, MOQ or unit price must be absent, not merely quiet**. Keep public identifiers
free of any encoding of price or pack.

**20. Do not take their reduced-motion posture.** 4 blocks in 6,558 rules works only because
almost nothing on their site moves. The moment we add Phase 2 or 3 choreography, §8.1 requires
motion suppression to be designed in from the first band, not retrofitted.

---

## 13. Three sentences for the owner

Lucchese sells $4,000 boots with **one sans-serif at weight 300, a two-colour interface, no
motion library, and photography on a warm bone bed** — proof that the premium signal our brief
asks for is bought with image quality and typographic restraint, not with cinema.

Their most valuable idea is **"Boot 101"**: a five-page education suite whose vocabulary is
literally the filter vocabulary, including a **real HTML size table** — which is exactly the
gap our own audit flags as the thing most contradicting our inclusivity claim.

Their most instructive failure is that **their trade enquiry page renders as an empty
placeholder without JavaScript** — the precise failure our three CI tests exist to prevent, on
the precise page type our wholesale-first launch depends on.

---

## Appendix — measurement index

| Measurement | Value |
| :--- | :--- |
| Layout viewport at 1440 window | 1425 px |
| Header height desktop / ≤1024 | 117–118 px / 64 px |
| Logo | 170 × 50 px, absolutely centred |
| Mega-menu panel | 256 × 344 px, 6 links, 100 ms, no imagery |
| Hero (split) | 1425 × 522 px = 0.58 vh; halves 713 px each |
| Hero headline | 56 px / 300 / −0.56 px / uppercase, 38.4 % of vw |
| Primary CTA | 185 × 48 px, 11 px / +1.32 px, 0 radius |
| Homepage depth | 4,718 px = 5.2 vh (live) · 26 bands (template) |
| PLP columns | 1440→3 · 1024→3 · 768→1 · 390→1 |
| PLP card | 475 × 690 px (desktop) |
| Product image ratio | **0.850 at every breakpoint** |
| Products per page | 24 of 209, real `?page=n` link |
| Facets | 8, all with live counts, native `<details>` |
| Sort options | 9 |
| PDP depth | 5,641 px = 6.3 vh |
| PDP product share / carousel share | 18 % / 44 % |
| PDP gallery slide | 352 × 414 px, 8 images, two-up |
| Buying panel | 712 px, 50 % of content width |
| Variants | 12 sizes × 2 widths |
| Navy on white | 14.64 : 1 |
| Navy on image bed | 12.54 : 1 |
| Focus ring (theme) | **1.68 : 1** ✗ (needs 3 : 1) |
| Meta grey `#B3B3B3` | **2.10 : 1** ✗ |
| Reduced-motion blocks | 4 of 6,558 rules |
| Dominant transition | 300 ms ease-in-out on `color`, 446 elements |
| Motion libraries | **0** |
| Script tags / JS decoded / files | 118 / ≈8.78 MB / 271 |
| HTML decoded (home/PLP/PDP) | 2.89 / 3.41 / 2.44 MB |
| Resources / load event | 506 / 6,027 ms |
| Image formats | 41 WebP · 3 JPG · 1 PNG · 4 SVG |
| Touch targets < 24 px at 390 px | 3 (all text links) |
