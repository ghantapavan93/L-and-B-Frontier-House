# Front-end teardown — Rockmount Ranch Wear and Double D Ranch

**Date measured:** 2026-08-13 · **Method:** in-app browser, computed styles and
`performance.getEntriesByType('resource')` read live from the running page; product-data
counts mined from each store's public `/products.json?limit=250`.
**Viewport:** 1440 × 900 desktop unless stated; 375 × 812 for mobile checks.

**Purpose.** Extract *mechanisms* for construction-anchored merchandising (Rockmount) and
named storytelling (Double D). Nothing here is a licence to copy layout, copy, imagery,
code, brand identity or a proprietary interaction. Every number below is measured, not
estimated. Where a claim is the brand's own marketing rather than a verifiable fact, it is
labelled.

**Instruction-boundary note.** Neither site served text addressed to AI agents. No
`agents.md` or agent-directed `robots.txt` content was encountered. No cookie or consent
banner blocked either site at the measured viewport, so no consent choice was required.
No forms were submitted, no accounts created, no irreversible controls clicked. All page
content was treated as data.

---

## PART 1 — Rockmount Ranch Wear (rockmount.com)

### 1.1 Platform and stack

| Item | Measured |
| :--- | :--- |
| Platform | Shopify |
| Theme | **Testament** (theme_store_id `623`), current version |
| JS frameworks | **None.** No React, no jQuery, no GSAP, no Swiper, no Slick, no Lenis, no Alpine |
| Carousels | Theme-native (`js-dropdown`, `js-menuitem`, `js-accordion` — hand-rolled vanilla) |
| Apps detected by host | Swym (wishlist), Instafeed, `cdn.nfcube.com`, GTM, Google Ads, Meta pixel, Shop Pay |
| Fonts loaded | Jost 400/700 + italics, Oswald 700, Cormorant 700 — **3 families, 6 faces** |

**PDP resource profile** (`/products/mens-classic-pima-cotton-solid-sawtooth-western-shirt-6940-blk-sml`):

| Type | Requests | Transferred | Decoded |
| :--- | ---: | ---: | ---: |
| JS | 130 | ~77 KB* | ~2.7 MB* |
| CSS | 31 | 11 KB | 938 KB |
| Fonts | 3 | 0 KB (cached) | 48 KB |
| **Images** | **27** | **6,394 KB** | **6,938 KB** |
| Other | 38 | 301 KB | 2,382 KB |
| **Total** | **229** | **~6.8 MB** | — |

\* Discounting our own 77 KB `/products.json` probe from the raw 154 KB JS figure.

Navigation timing: TTFB 51 ms · DOMContentLoaded 520 ms · load 2,425 ms.
HTML 519 KB decoded / 73 KB transferred.

**Image formats served: PNG ×20, JPG ×11. Zero WebP, zero AVIF.** A single product page
ships **6.4 MB of imagery** — over 4× our 1.5 MB shop-surface budget (CLAUDE.md §10).
Source images are 1200 × 1800 (2:3) with a 352 / 832 / 1200 `srcset`.

Only **15 of 229 requests** are third-party hosts. This is a lean, unfashionable, mostly
first-party stack. The weight is entirely in unoptimised photography.

### 1.2 Header, nav, sticky behaviour

| Item | Desktop 1440 | Mobile 375 |
| :--- | ---: | ---: |
| Announcement bar | 48 px | 54 px |
| Header block | **324 px** | **114 px** |
| Combined chrome | **372 px** | 168 px |
| `position` | **`static`** | `static` |

**The header is not sticky.** Scrolling 1,200 px moves the header to `top: -1152` — it
leaves entirely. Nothing replaces it. The only persistent affordance is a 40 px
scroll-to-top link. Logo is a 315 × 154 px raster wordmark inside the header block, which
is what makes the header 324 px tall.

**Mega-menu mechanics.** Top level is 13 items: `NEW ARRIVALS · MENS · WOMENS · KIDS ·
HATS · ACCESSORIES · HOME GOODS · COMING SOON · CUSTOM · CELEBRITY · OUR STORY ·
GIFT CARD · WHOLESALE`.

- MENS and WOMENS open a **multi-column `ul.megamenu`** grouped under headed columns
  (`SHIRTS`, `JACKETS`) — 25 and 18 links respectively.
- The other eight open a single-column `ul.dropdown`, `min-width: 220px`, background
  `#c60808` (brand red), links `#ffffff`.
- Mechanism is `display: none` → shown by a JS class (`js-open-dropdown`,
  `js-doubletap-to-open`), not CSS `:hover` alone. `transition: all`.
- Contrast: white on `#c60808` = **6.11 : 1** — passes AA.

**Taxonomy is fabric-, pattern-, sleeve- and fit-led, never construction-led:**

> Men's: New Arrivals · All Shirts · Big & Tall · Checks, Plaids & Stripes · Denims and
> Chambrays · Embroidered · Flannels · Fleece · Fringe · Leather · Prints · Short Sleeves ·
> Slim Fits · Solids · T-Shirts · Matching Adults & Children · Matching Adults
> Jackets: All · Blazers · Bolero Jackets · Fleece · Ponchos · Vests

`WHOLESALE` is a top-level nav item at parity with product categories.

### 1.3 Typography (computed)

Design tokens are exposed as CSS custom properties on `:root`:

```
--main-family: Jost        --main-weight: 400   --main-spacing: 0em
--nav-family: Oswald       --nav-weight: 700    --nav-spacing: 0.025em
--heading-family: Cormorant --heading-weight: 700 --heading-spacing: 0.050em
--font-size: 16px  --nav-size: 16px  --h1-size: 32px  --h2-size: 25px  --h3-size: 19px
```

| Level | Family | Size | Line-height | Letter-spacing | Weight | Case |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| Body / `p` | Jost | 16 px | 25.6 px (1.60) | normal | 400 | none |
| Nav link | Jost | 16 px | 25.6 px | normal | 400 | none |
| H1 (PDP title) | Cormorant | 32 px | `normal` | 1.6 px (0.05em) | 700 | none |
| H2 (hero) | Cormorant | 30 px | `normal` | 1.5 px | 700 | none |
| H2 (section) | Cormorant | 25 px | `normal` | 1.25 px | 700 | none |
| H3 (category tile) | Cormorant | 29 px | `normal` | 1.45 px | 700 | none |
| H3 (small) | Cormorant | 19 px | `normal` | 0.95 px | 700 | none |
| Hero eyebrow | Jost | 20 px | `normal` | normal | 400 | none |
| Price (PDP) | Jost | 18 px | — | — | 400 | — |
| Card title / price | Jost | 16 px | — | — | 400 | none |
| Unit-price note | Jost | 12.8 px | — | — | 400 | — |

Two observations that matter for us:

1. **Every heading uses `line-height: normal`.** Nothing is set. The 32 px H1 renders at
   whatever Cormorant's metrics dictate. That is why the multi-line H1 measures 307 px
   tall in a 580 px column — the rhythm is accidental, not designed.
2. **`Oswald` is declared as `--nav-family` and loaded, but no measured nav element uses
   it.** Nav links compute to Jost. One of three loaded families is paying a network cost
   for nothing.

**Mobile scales the whole system by 0.85** — body 16 → 13.6 px, H1 32 → 27.2 px,
letter-spacing 1.6 → 1.36 px. Confirmed in the token itself:
`--announcement-text-size: calc(12px - (12px * 0.15))`. Body text at **13.6 px on mobile
is below the 16 px comfortable-reading floor.**

### 1.4 Colour (computed)

| Role | Value | Note |
| :--- | :--- | :--- |
| Page background | `#ffffff` | |
| Body text / links | `#000000` | 21 : 1 |
| Sale / error / accent | `#c60808` | 6.11 : 1 on white |
| Dropdown background | `#c60808` | white links, 6.11 : 1 |
| Nav background | `#000000` | |
| Announcement text | `#6f6c6c` on white | **5.20 : 1** — passes AA at 12 px |
| Primary button | `#b7d8d5` bg, `#000000` text | pale teal |
| Button hover | `#90bcb8` | |
| Footer | `#000000` bg, `#ffffff` text | |
| Backorder badge | `#b72d2d` bg, white text | |
| Keyboard focus | `#f3f3f3`, 1 px solid | **near-invisible on white** |

**The interface is achromatic — pure black, pure white, one red, one anomalous pale teal.**
All colour on the page comes from the garments. That is precisely our North Star position
("colour carried by the garment, not the interface"), executed to an extreme.

The pale teal `#b7d8d5` is the one discordant note: it is the Add-to-Cart colour, and it
belongs to no other part of the palette. It reads as an unchanged theme default.

`--keyboard-focus-color: #f3f3f3` at 1 px on a white page is effectively **no visible focus
indicator**. Direct precedent for our §8.6 rule.

### 1.5 Homepage band-by-band (1440 × 900, document height 5,697 px)

Content column: **1339 px** inside a 1425 px viewport (scrollbar-adjusted). Grid is
**12 columns × 86.4 px with a 30 px gutter**, `gap: 0px 30px`.

| # | Band | Height | Bleed | Carrier | Content |
| ---: | :--- | ---: | :--- | :--- | :--- |
| 0 | Announcement | 48 | full | text | rotating notice |
| 0 | Header | 324 | full | logo + nav | static |
| 1 | Split hero | 820 | **full-bleed** | 4 images, 448 px inner text | Two half-width panels: "THE WEST IS NOT A PLACE / IT'S A STATE OF MIND" → *Shop Men's Western Shirts*; "THE ORIGINAL / SNAP SHIRT / SINCE 1946" → *Shop Women's Western Shirts* |
| 2 | Category triptych | 706 | **full-bleed** | 3 images | MEN'S / WOMEN'S / KID'S WESTERN SHIRTS |
| 3 | Men's New Arrivals | 773 | contained 1339 | 8 images | 4-up product row |
| 4 | Women's New Arrivals | 773 | contained 1339 | 8 images | 4-up product row |
| 5 | Our Story | 550 | contained 1339 | 1 image | 60-word founding paragraph + *Learn More* |
| 6 | Founder quote | 550 | contained 1339 | 1 image | attributed pull-quote (Steve Weil) |
| 7 | See Who's Wearing Rockmount | 600 | contained 1339 | 3 images | 3 blog cards: Elvis Presley, Jorma Kaukonen, Bob Dylan |
| 8 | Instafeed | 0 | — | — | renders empty |
| 9 | Footer | 412 | full | — | 4 link columns + newsletter |

**Rhythm.** Bands are 550 / 600 / 706 / 773 / 820 px. `--section-margins: 40px`. Section
`padding-top`/`padding-bottom` compute to `0px` on every band — spacing is carried by inner
elements, so there is no external vertical rhythm to speak of. The two full-bleed bands sit
at the top; everything below is contained. The page moves **hero → category → product →
story → proof → footer**: commerce is band 3 of 9, and the story bands come *after* the
products.

### 1.6 CONSTRUCTION VOCABULARY — the deep finding

This is the most useful thing in the teardown. Measured across the **250 products** returned
by `/products.json?limit=250`.

#### Frequency of construction terms — product title vs description body

| Term | In **title** | In **description** | Filterable? |
| :--- | ---: | ---: | :--- |
| snap (any) | 2 | **119** | No |
| **shotgun cuff** | **0** | **71** | No |
| **smile pocket** | **0** | **71** | No |
| piping | 1 | **67** | No |
| gabardine | 0 | **64** | No |
| relaxed fit | 0 | 65 | No |
| **sawtooth** (pocket) | 2 | **58** | No |
| **diamond snap** | 1 | **37** | No |
| cuff (any) | 0 | 81 | No |
| **yoke** | **0** | 14 | No |
| shadow plaid | 6 | 8 | No |
| blanket stitch | 1 | 4 | No |
| chain stitch | 1 | 1 | No |
| flap pocket | 0 | 1 | No |
| chambray | 2 | 2 | Yes (as a *fabric* collection) |
| pima | 2 | 2 | No |
| fringe | 5 | 5 | **Yes** (as a *style* facet) |

**The pattern is unambiguous.** Rockmount owns a rich, specific, genuinely differentiating
construction vocabulary — *shotgun cuffs*, *smile pockets*, *sawtooth pockets*, *diamond
snaps*, *piping*, *yokes*, *gabardine* — and **buries all of it in unstructured prose.**
The words appear on 24–48% of the catalogue and are reachable by **zero** filters.

#### What *is* structured

Shopify tags drive the facets. All 250 products' tags, ranked:

```
accessories 54 · embroidered 52 · New Arrival 45 · Made in USA 44 · coming soon 31 ·
bandana 28 · print 21 · hats 18 · denims-and-chambrays 15 · felt 15 ·
plaid-stripe-and-check 14 · belts 14 · checks-and-plaids 13 · Short Sleeve 13 · denim 12 ·
long sleeve 9 · t-shirts 9 · fleece-and-flannel 9 · solids 8 · Leather 7 · Wool 6 ·
steer skull 6 · Vintage 5 · native american 5 · buckle 5 · horses 4 · floral 4 · skull 4 ·
big-and-tall 2 · 100-cotton 2
```

**Not one tag is a construction term.** Tags are category, colour, motif, pattern, fabric
group, sleeve length, provenance claim and season. The resulting PLP facets are exactly two
groups:

```
Availability : Ships Immediately (276) · Coming Soon (3) · Backorder (200)
Style        : Denim (25) · Embroidered (133) · Flannel (14) · Fleece (15) · Fringe (9) ·
               Long Sleeve (237) · Plaid (31) · Print (53) · Solid (55) · Short Sleeve (57)
```

"Style" is really *pattern + fabric + sleeve*. There is no construction facet, no fit facet,
no closure facet, no pocket facet.

#### Where construction *does* surface

1. **SEO metadata, not the visible page.** The men's shirt PLP has
   `<title>Men's **Pearl Snap** Western Shirts – Rockmount</title>` and a meta description
   naming "**sawtooth pockets**, embroidery & snap shirts" — while the visible page copy is
   the single line "THE WORLD DOESN'T NEED ANOTHER BORING SHIRT". The construction language
   is doing search work and no merchandising work.
2. **URL slugs.** `mens-classic-pima-cotton-solid-sawtooth-western-shirt-6940-blk-sml`,
   `mens-shadow-plaid-sawtooth-pocket-cotton-western-shirt-693-blue-sml`,
   `mens-stonewashed-denim-blanket-stitch-shirt-6804-den-sml`,
   `mens-black-vintage-cactus-stars-chain-stitch-embroidery-western-shirt`.
3. **Site search.** Querying `sawtooth` returns **212 results** — the term is a *de facto*
   category that the navigation refuses to acknowledge. A shopper who knows the word is
   served; a shopper who doesn't will never learn it.
4. **A "Product Details" bullet list inside the description.** Example PDP:

   > Feel the wonderful hand of the finest Pima cotton poplin… Finely tailored with
   > removable collar stays. This comfortable relaxed fit shirt features signature Rockmount
   > **Diamond snaps** and **Sawtooth pockets**. Made in USA.
   >
   > **Product Details:** 100% pima cotton · Relaxed fit · Removable collar stays ·
   > Diamond snaps · Sawtooth pockets · Machine wash cold · Made in USA

   Seven attributes, cleanly enumerated — and stored as a `<ul>` in `body_html`. Not
   metafields. Not machine-readable. Not queryable.

#### Does naming a construction detail change how the garment reads?

Yes, measurably, in three ways:

- **It converts a decoration into a decision.** "Sawtooth pockets" is not an adjective; it
  is a named part with a shape, and a shopper can prefer it or not. Compare the same shirt
  described as "classic western styling", which offers nothing to prefer.
- **It transfers authorship to the maker.** "Signature Rockmount **Diamond** snaps" claims a
  specific component as the brand's own. The claim is checkable — you can look at the snap.
  This is proof by *inspectable detail*, which needs no history at all.
- **It creates vocabulary the shopper carries.** The 212-result `sawtooth` search is
  evidence that shoppers arrive already using the word. Naming the detail once teaches a
  term the shopper then uses to search, filter and compare — the brand's language becomes
  the shopper's query.

**Verdict for us:** the vocabulary is the asset; Rockmount's information architecture wastes
it. Every one of these terms should be a structured attribute, not a sentence.

### 1.7 Heritage and proof mechanics — verifiable vs atmosphere

| Claim | Where | Class |
| :--- | :--- | :--- |
| "Founded in 1946 by Jack A. Weil in Downtown Denver" | Homepage, /pages/about-us | **Verifiable** — date, person, place |
| "He was the oldest CEO in the world, working daily until age 107" | Homepage, About | **Verifiable** — checkable public record |
| "Papa Jack made the first Western shirts with snaps" | Homepage, About | **Contestable priority claim** — first-mover assertions in apparel are rarely provable |
| "the first to commercialize bolo ties" | About | **Contestable priority claim** |
| "still a family business… 80 years of Western fashion worldwide" | Homepage | **Verifiable** (ownership) + **atmosphere** ("influencing … worldwide") |
| "He is to Western wear what Henry Ford is to the car" | About | **Pure atmosphere** — a simile, not a claim |
| "Est. 1946 · Denver, Colorado" set in artwork | About page hero | **Verifiable** — but baked into an image |
| Elvis Presley, Bob Dylan, Jorma Kaukonen wore Rockmount | Homepage band 7, /blogs/celebrity-gallery | **Verifiable third-party proof** — dated, photographable |
| "Made in USA" | 44 of 250 products, as a **tag** | **Verifiable and structured** — per product, not brand-wide |

**The three mechanisms, separated from the heritage content:**

1. **Cultural proof by named third party.** A dedicated `/blogs/celebrity-gallery` route and
   a homepage band of three dated posts. The proof is *someone else wearing the garment*,
   with a date and a photograph. Requires no company history — only a real customer and
   their permission.
2. **Construction as authorship.** "Signature Rockmount Diamond snaps" asserts ownership of
   a component. Requires no history — only that the component actually be distinctive.
3. **Honest per-product provenance.** "Made in USA" is a **tag on 44 of 250 products**, not
   a banner. Where the item is imported, the PDP says *Imported*. This is the single most
   transferable mechanic: state origin **per product, as data**, and the absence of the
   claim on the other 206 products is itself informative and never dishonest.

**A quote on the homepage attributes the design philosophy to a named living executive**
(Steve Weil), not to an anonymous brand voice. That is a proof pattern — a person who can be
contradicted — available to any company of any age.

### 1.8 PLP and PDP

**PLP** (`/collections/mens-western-shirts`, 72 rendered items, 279 in collection):

| Item | Measured |
| :--- | :--- |
| Grid | 12-col CSS grid, cards span 3 → **4-up**, `gap: 0 30px` |
| Card | 225 × 481 px |
| Image | source 1200 × 1800 (2:3), rendered box 337 px tall, `object-fit: cover` |
| Images per card | **2** — primary + hover-swap alternate |
| Card fields | title (Jost 16/400) · Regular Price · Sale Price (`#c60808`) · **`Style No: 6710-DEN`** |
| Filters | 2 groups (Availability, Style) in a left sidebar, `<a>`-based, counts shown |
| Sort | **None.** No `<select name="sort_by">` exists |
| Collection copy | one line: "THE WORLD DOESN'T NEED ANOTHER BORING SHIRT" |

**`Style No:` on the product card is the most buyer-literate detail on the site.** A
retail-facing card carrying the line-sheet style number is a wholesale affordance living in
a consumer surface — directly relevant to our dual-audience problem.

**PDP** (1440 × 900):

| Item | Measured |
| :--- | :--- |
| Layout | **640 px gallery + 600 px info**, 12-col grid, 30 px gutter, 1396 px content |
| Gallery | **10 images stacked vertically**, `position: sticky; top: 120px`, 1,185 px tall column |
| Large images | 18 total ≥ 300 px; up to 1440 × 2167 |
| Size run | **XS · S · M · L · XL · XXL · XXXL · XXXXL · MEDT · LGT · XLT · XXLT · XXXLT** — 15 options including 5 tall grades |
| Variant options | **Size only.** Colour is a separate product (`6710-DEN` vs `6710-RED`) |
| Add to Cart | 600 × 50 px, `#b7d8d5` bg, `#000` text, Jost 16 px, 3 px radius, sentence case |
| Description | prose paragraph + "Product Details" bullet list, both in `body_html` |
| Structured data | `schema.org/Product` present with name, brand, description, image |
| Mobile | gallery 345 px, `position: static`, header 114 px |

**Defect worth recording:** the price block renders the string `Save -Infinity` in the DOM
on a product with no compare-at price. A division by zero reaching production copy.

**Colour-as-separate-product is a real architectural choice with a real cost.** It gives
every colourway its own URL, its own style number and its own photography — excellent for a
line sheet and for search. It also means the PDP has no colour switcher, the customer cannot
see the range from one page, and the 64-colour problem Double D has (§2.6) is replaced by a
72-product problem.

---

## PART 2 — Double D Ranch (doubledranch.com)

`ddranchwear.com` 301-redirects to `doubledranch.com`.

### 2.1 Platform and stack

| Item | Measured |
| :--- | :--- |
| Platform | Shopify |
| Theme | **Turbo** (Out of the Sandbox), published as `F1-26_RoughneckRodeo_CG_[OOTS]turboTN-24` |
| JS | **jQuery 3.7.1** + **Flickity** carousels. No React, no GSAP, no Lenis |
| Page builder | **Shogun** (`window.SHOGUN_IMAGE_ELEMENTS`) on editorial pages |
| Apps by host | Yotpo, Klaviyo, Sezzle (BNPL), Privy, Swym, Sendlane, Square, accessiBe, unpkg, GTM, Google Ads |
| Fonts | **Playfair Display** 400/700 + italics, **Source Sans Pro** 300/400 + italics — plus turbo, GTStandard-M, Inter, Satoshi, InterVariable, swym-font, fcicons **injected by third-party widgets** |

**The theme name encodes the current collection.** `F1-26_RoughneckRodeo_CG_…` means the
published theme is versioned per season and per named collection. That is a merchandising
process visible in the deployment artefact.

**PDP resource profile** (`/products/jacket-roustabout`):

| Type | Requests | Transferred | Decoded |
| :--- | ---: | ---: | ---: |
| **JS** | **264** | **412 KB** | **8,080 KB** |
| CSS | 46 | 6 KB | 1,054 KB |
| Images | 22 | 265 KB | 464 KB |
| Video | 11 | 3 KB | — |
| Fonts | 4 | 87 KB | 86 KB |
| Other | 77 | 85 KB | 359 KB |
| **Total** | **424** | **858 KB** | — |

TTFB 139 ms · DCL **1,932 ms** · load **3,399 ms** · HTML 551 KB decoded / 64 KB transferred.

**412 KB of compressed JavaScript across 264 files from ~20 third-party hosts is 2.3× our
180 KB budget** — and the site runs no animation library at all. The weight is entirely
marketing and app tags. This is the failure mode to avoid: not a heavy framework, but a
hundred small vendors.

### 2.2 Header, nav, sticky behaviour

| Item | Measured |
| :--- | :--- |
| Promo bar | `#FBD896` bg, `#3A2E2D` text at **10 px** Playfair, 1 px tracking — contrast **9.55 : 1**, but 10 px is below any comfortable floor |
| Utility bar | 40 px — phone number `1-800-899-3379`, Login, cart |
| Header block | **216 px**, `position: static` |
| Sticky | **None.** Scrolling 1,500 px moves it to `top: -1500`. `mobile_nav-fixed--true` class exists but no desktop equivalent |

**Both brands independently chose a tall, non-sticky header.** Rockmount 372 px of chrome,
Double D 216 px. Neither keeps navigation on screen. This is worth noting as a *shared
industry habit that is probably wrong* rather than a pattern to adopt.

**Top-level nav (10 items):**

```
Home | SHOP (43 links, grid mega-menu) | SHOP BY COLLECTION (15) | BOOTS (11) |
NECKLACES (14) | GIFTS (10) | SALE & WAREHOUSE WEDNESDAY (11) | OUR STORY (12) |
BLOG: DOUBLE TALK | CONTACT US (2)
```

**The critical structural finding.** The SHOP mega-menu runs **two parallel taxonomies in
one panel**:

| Narrative axis — "SHOP BY COLLECTION" | Functional axis |
| :--- | :--- |
| ROUGHNECK RODEO | APPAREL → Jackets · Tops · Vests · Bottoms · Dresses |
| NU PATRIOT | ACCESSORIES → Boots · Hats · Belts · Bags · Scarves · Socks |
| HERITAGE COLLECTION | JEWELRY → Necklaces · Earrings · Rings · Bolos · Cuffs, Bracelets & Ketohs · Charms · Collars & Tips |
| SILVER LABEL | GIFTS → Furniture · Bedding · Pillows · Posters & Art · By The Yard |
| COLLECTION ACCESSORIES | SALE → same categories, `-sale` suffixed |
| THE TRAVEL SERIES | |

Both axes are `/collections/*` routes at identical depth, in the same panel, one click from
any page. **A shopper who wants the story and a shopper who wants a jacket take the same
number of clicks.** That is the whole mechanism, and it costs nothing.

`OUR STORY` opens a 12-item subtree — About Us, **Events Calendar**, **Cultural Impact**,
**Cultural Council**, **Artisans**, **Product Disclaimers**, Contact, Return Policy, Size
Chart, View the Catalog, Order Catalog, **Stockists**. Note that "Product Disclaimers" and
"Stockists" are given navigation parity with the brand story.

### 2.3 Typography (computed)

The theme exposes almost no design tokens — only `--color-body-text: #333333`,
`--color-body: #eeeee6`, `--color-bg: #eeeee6`. Everything else is hard-coded in the
stylesheet. (The remaining `:root` variables belong to Swym and FullCalendar.)

| Level | Family | Size | Line-height | Ratio | Tracking | Weight | Case |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | :--- |
| Body | Source Sans Pro | 16 px | 25.6 px | 1.60 | normal | **300** | none |
| Hero H1 | Playfair Display | 36.67 px | 51.33 px | 1.40 | 1 px | 400 | none |
| H2 section | Playfair Display | 25 px | 37.5 px | 1.50 | 1 px | 400 | none |
| H3 blog card | Playfair Display | 22 px | 33 px | 1.50 | normal | 400 | none |
| PDP H1 / PLP H1 | Playfair Display | 28 px | — | — | 1 px | 400 | none |
| Nav link | Playfair Display | 13 px | — | — | 1 px | 400 | **uppercase** |
| Card title | Playfair Display | 16 px | — | — | — | 400 | none |
| Card price | Source Sans Pro | 16 px | — | — | — | 300 | none |
| "Quick View" | Playfair Display | 13 px | — | — | — | **700** | uppercase |
| Add to Cart | Playfair Display | 13 px | — | — | 1 px | — | uppercase |
| Promo bar | Playfair Display | **10 px** | 10 px | 1.00 | 1 px | 400 | none |

Two disciplined choices worth stealing:

1. **Every line-height is set explicitly** (1.40 / 1.50 / 1.60). Contrast with Rockmount's
   universal `line-height: normal`. Double D's vertical rhythm is intentional.
2. **A serif display face is used at 13 px uppercase for navigation and buttons.** Playfair
   Display is doing both the 36 px hero and the 13 px Add-to-Cart. One family carries
   headline *and* interface; the sans carries only body and price. That is a two-typeface
   system used more aggressively than most brands dare, and it is why the site reads as one
   voice.

**Body copy at weight 300 in Source Sans Pro on `#EEEEE6`** is the weakest link — a light
weight on a warm off-white loses stroke contrast at 16 px.

### 2.4 Colour (computed, ranked by element count)

| Value | Uses | Role |
| :--- | ---: | :--- |
| `#333333` | 481 | body text |
| `#3A2E2D` | 402 | dark warm brown — headings, promo-bar text |
| `#EEEEE6` | 17 | page background (bone) |
| `#FFFFFF` | 9 | cards, reverse text |
| `#BD3A30` | 6 | **brand red** — links, Add to Cart, price accents |
| `#A31027` | 4 | deeper red |
| `#FBD896` | 2 | promo-bar background (butter yellow) |

Contrast checks computed from these values:

- `#BD3A30` on `#EEEEE6` = **4.72 : 1** — passes AA for normal text, **fails AAA**, and
  fails AA for anything treated as large text needing 3 : 1 with a graphical component.
- `#3A2E2D` on `#FBD896` = **9.55 : 1** — comfortable.
- `#333333` on `#EEEEE6` = ~11.4 : 1.

**The interface is a warm neutral ground with a single red.** Same principle as Rockmount —
colour comes from the clothes — but executed with a bone background rather than white, which
flatters the earth-toned photography. Worth noting for our own ground colour.

**`accessiBe` is installed** (`accessibe.com/blog/knowledgebase/screen-reader-guide` appears
in the DOM). Overlay widgets of this class are widely held to mask rather than fix
conformance failures. **This is an anti-pattern for us, not a pattern** — record it as a
thing observed, not a thing to copy.

### 2.5 Homepage band-by-band (1440 × 900, document height 7,887 px)

Content column **1200 px**; full-bleed bands run the full 1440 px.

| # | Band | Height | Bleed | Carrier | Content |
| ---: | :--- | ---: | :--- | :--- | :--- |
| 0 | Promo + utility + header | 216 | full | — | static |
| 1 | **Video hero** | **810** | **full-bleed** | `<video>` with native controls | `TRANSITION 2026: ROUGHNECK RODEO` → H1 *"A tale as old as Texas."* → **62-word narrative** → **`SHOP THE COLLECTION`** |
| 2 | Category tiles | 917 | contained 1200 | 8 images | APPAREL & ACCESSORIES: Jackets, Boots, Dresses, Jewelry, Accessories, Bottoms, Belts, Tops |
| 3 | Featured collection | 677 | contained 1200 | **50 images + 17 videos** | `ROUGHNECK RODEO, TRANSITION 2026 COLLECTION` — product row, cards autoplay video |
| 4 | Image + text overlay | 810 | **full-bleed** | 1 image | editorial still |
| 5 | **Featured product** | **1,159** | contained 1200 | 13 images + 2 videos | *Jacket, Roustabout* $995 + headline + full description — **a single product given an editorial spread** |
| 6 | Banner | 185 | **full-bleed** | 1 image | thin divider image |
| 7 | **DOUBLE TALK** (blog) | 630 | contained 1200 | 3 images | dated posts w/ read-time: "IT STARTED WITH A HAT BOX", "BLACK GOLD IN THE BUCKLE", "STYLE FOR YOUR SCREEN: ROUGHNECK RODEO" |
| 8 | **Upcoming Events** | 782 | contained 1200 | table | real dates, event type, venue — *Strike It Rich* (Yoakum/Round Top/Fort Worth), *The Run For A Million* (South Point, Las Vegas) |
| 9 | Divider | 24 | contained | — | rule |
| 10 | Slideshow | 431 | **full-bleed** | 3 images | `INTRODUCING THE SILVER LABEL / INDULGE YOURSELF` |
| 11 | Silver Label tiles | 447 | contained 1200 | 4 images | sub-collection entry points |
| 12 | Newsletter | 284 | full | — | "Our emails are the prettiest." |
| 13 | Footer | 497 | contained 1200 | 1 image | Customer Care · **Disclaimers** · Size Chart · **Stockists** · Blog · **Shop By Collection** repeated |

Rhythm: 185 / 284 / 431 / 447 / 630 / 677 / 782 / **810 / 810** / 917 / 1,159. The two
full-bleed editorial bands are both exactly **810 px**; contained commerce bands are
630–917 px. **Full-bleed is reserved for atmosphere; contained is reserved for product.**
That is a clean, legible rule, and it is the opposite of gradually fusing the two layers.

**The hero video ships with native `<video>` controls exposed** — Pause, buffered, Unmute,
Enter fullscreen. WCAG 2.2.2 is satisfied by the browser's own UI rather than a custom
control. Cheap, and it works.

### 2.6 NAMED STORYTELLING — the deep finding

#### The naming grammar

**207 of 250 products (83%) follow `Noun, Name`.** Leading nouns, ranked:

```
Jacket 36 · Belt 32 · Miscellaneous 18 · Cuff 16 · Top 12 · Necklace 12 · Bag 11 ·
Patch 10 · Vest 8 · Bolo 7 · Necktie 6 · Hat 6 · Pant 5 · Scarf 5 · Skirt 4 · Dress 3 ·
Ring 2 · Blouse 2 · Earrings 2 · Cap 1 · Pin 1 · Cape 1 · Short 1 · Legging 1 ·
Poncho 1 · Overalls 1
```

The garment type comes **first**, the story comes **second**: `Jacket, Roustabout` ·
`Dress, Benito` · `Belt, Rig Runner` · `Bag, Tex-Oyl Bag` · `Cap, Cowboy Bait` ·
`Top, Benito Sheer`.

This is a deliberately unglamorous, catalogue-first construction with four properties:

1. **It sorts.** Alphabetical A–Z groups every jacket together automatically.
2. **It answers "what is it?" before "what is it called?"** — no shopper has to decode a
   name to know they are looking at a jacket.
3. **It survives truncation.** Cut at 20 characters and the category still reads.
4. **It leaves the second slot free for pure story** with zero functional cost.

#### The collection theme propagates into every name

Within `ROUGHNECK RODEO` (49 products), the second slot is entirely oil-field and West Texas
vocabulary:

```
Roustabout · Crude Oil · Wellhead Blues · Texas Tea · Tex-Oyl · Rig Runner · Bit Boss ·
Eagle Ford · Petro Plaid · Oil Camp · Lease Lady · Greasewood · Madame Midland ·
Odessa · Borger · Electra · Spew · Well Watched · Seen In Texas · Hitch Haul
```

**Odessa, Midland, Borger and Electra are real Texas oil towns; Eagle Ford is a real
geological formation.** The romance is built from real-world referents, not invented lore.
No date is claimed, no founder is invented, no lineage is asserted. **This is the single
most important transferable observation in the whole teardown:** a collection can be deeply
evocative while making zero historical claims, because it borrows resonance from *places and
work that actually exist*.

#### Where the story lives, relative to the product

| Surface | Narrative present? | Distance to buy |
| :--- | :--- | :--- |
| Homepage hero | **Yes** — 62-word collection story | `SHOP THE COLLECTION` CTA **in the same band** |
| `/collections/roughneck-rodeo` | **No.** H1 only. `collectionCopy` measured empty | **Product grid starts at y = 369 px** |
| PDP | **Yes** — headline + ~62-word paragraph | Add to Cart at y = 1,304 px |
| `/blogs/double-talk` | Yes — long-form, separate route | link out to products |
| Homepage "featured product" band | Yes — 1,159 px editorial spread for one $995 jacket | inline buy |

**The named-collection landing page carries no narrative at all.** The story is told on the
homepage hero and on the blog; the `/collections/<name>` route is pure commerce, with
products beginning 369 px down the page. **Narrative never sits between the shopper and the
grid.** It sits *beside* it, on parallel routes, and the mega-menu offers both.

#### PDP anatomy — the one place narrative does cost something

Measured DOM order in the 460 px right column of `/products/jacket-roustabout`:

| y (px) | Element |
| ---: | :--- |
| 261 | H1 `Jacket, Roustabout` |
| 536–1040 | Description block (504 px tall) |
| 1060 | Colour `<select>` |
| 1152 | Size `<select>` |
| 1243 | *Measurements* link |
| 1294 | Pre-order notice + checkbox **"I understand this item is a pre-order."** |
| **1304** | **Add to Cart** — 230 × 44 px, transparent bg, `#BD3A30` uppercase Playfair 13 px |
| 1364 | Shop Pay wallet + *More payment options* |
| 1388 | Add to Wishlist |

**Add to Cart sits 404 px below the 900 px fold, behind 504 px of description.** On a
375 × 812 mobile viewport that gap is worse. This is the *one* place Double D lets narrative
gate commerce, and it is a defect, not a feature — the fix is to move the buy box above the
description and leave the story below it, which changes nothing about the storytelling.

**The pre-order checkbox is a genuinely good pattern** and directly serves our §11
"Pre-order is a first-class state": an explicit, blocking acknowledgement rather than a
footnote.

#### The description contains a labelled spec block — the single most reusable artefact here

**229 of 250 products (92%)** carry a `key: value` block in `body_html`, immediately after
one narrative paragraph. Measured key frequencies across the catalogue:

| Key | Products | Key | Products |
| :--- | ---: | :--- | ---: |
| `content` | 97 | `hallmarks` | **44** |
| `color` | 96 | `artist` | **44** |
| `materials` | 93 | `affiliation` | **34** |
| `size` | 84 | `fit` | 30 |
| `style` | 83 | `dimensions` | 21 |
| `measurements` | 82 | `closure` | 18 |
| **`embellishments`** | **81** | `buckle dimensions` | 16 |
| `collection` | 74 | `concho dimensions` | 12 |
| `weight` | 71 | `strap` | 4 |
| `style number` | 63 | `fur` / `maker` / `provenance` | 3 / 2 / 1 |

Live example (`Jacket, Roustabout`):

> FALL IN LOVE WITH THE SEASON'S STATEMENT BIKER.
> The Roustabout Jacket is serving up two-tone perfection… a classic biker with a chic
> cropped fit, boasting a pair of front flap pockets and custom concho buttons.
>
> `color: black, butter` · `content: 100% sheep` ·
> `embellishments: lacing, fringe, button closure` ·
> `fit: relaxed fit, length top of hip` · `size: XS-2X` · `C3529` ·
> `collection: Roughneck Rodeo` · `In stock`

**`embellishments` is Double D's construction field.** Values across the catalogue:

```
fringe 14 · zipper closure 11 · embroidery 10 · studding 8 · custom print 8 ·
custom DD buttons 5 · snap closure 5 · pearl snaps 5 · contrast leather 5 · printing 5 ·
rhinestone studding 3 · chainstitch embroidery 3 · buckstitch 3 · hand-tooled 3 ·
custom Double D findings 3 · horn snaps 2 · applique 2 · button closure 2 · piping 2 ·
beading 2 · rhinestones 2 · underlay 2 · magnetic closure 2 · contrast lacing 2 ·
string suede applique 2 · self tie · scarf slide · zip front · fur lined collar ·
zippers on cuffs · asymmetrical zipper pocket · snaps on collar
```

Construction terms appearing anywhere in descriptions, by product count: `concho` 39,
`embroidery` 29, `suede` 27, `snap` 23, `fringe` 21, `pearl snap` 11, `scallop` 9,
`lacing` 8, `applique` 6, `sheepskin` 6, `lambskin` 5, `beading` 5, `yoke` 4, `piping` 4,
`sawtooth` 3, `horn snap` 2, `placket` 2, `godet` 1. Only `concho` (19) reaches product
titles.

**And none of it is filterable.** The facets on `/collections/roughneck-rodeo` are exactly:

```
Availability : In stock (84) · Out of stock (33)
Size         : 39 values — XXS/XS/S/M/L/XL/1X/2X mixed with boot sizes 0, 2, 4, 5, 5.5, 6, 6.5, 7…
Color        : 64 values — After Midnight (1) · Alfalfa Field (1) · Bison (3) · Black (31) ·
               Bone (12) · Bridle (3) · Bronco (8) · Buckskin (1) · Buff (6) · Butter (7)…
Price        : range
```

**Both stores independently arrive at the same failure: a rich, structured-in-spirit
attribute vocabulary stored as prose, and facets built from tags that carry none of it.**

Two opposite colour failures are also instructive: Rockmount has **no colour option at all**
(each colourway is its own product), Double D has **64 poetic colour values** in one facet
with 44 of them matching a single product. Neither is usable. A **display name + structured
colour family** pair solves both.

### 2.7 Heritage and proof mechanics — verifiable vs atmosphere

| Claim | Where | Class |
| :--- | :--- | :--- |
| "designed and manufactured women's apparel **since 1989**" | /pages/about-us ¶1 | **Verifiable — and contradicted below** |
| "**Since 1990**, the women of Double D Ranch…" | /pages/about-us ¶2 | **Contradicts ¶1** |
| "a **34 year** company" | /pages/about-us ¶2 | **Implies 1992** — a third date |
| "introduction of their famed Native American blanket coat" | About | Verifiable product claim |
| "worn by rock stars… such as Aerosmith's Steven Tyler" | About | **Verifiable third-party proof** — named person |
| "**Western Couture's First Family**" | About | Atmosphere — self-conferred title |
| "From a long line of revolutionaries and outlaws" | About | **Pure atmosphere** |
| "like finding a Prada store in the middle of the Great Plains" | About | Pure atmosphere — simile |
| Named **Artisans**: Chili Rose/Adannah Langer, Alan Eby, Angela Swedberg, Buffalo, Dave Chavarria, Dennis Hogan, Elvira Bill, Federico Jimenez, Joe Eby, Lauren Good Day, Nicolás Amato, Pilar Lovato | /pages/artisans | **Verifiable — real, contactable people** |
| Named **Cultural Council**: Angela Swedberg, Betsy Talermo, JiSan Lopez, Martina Real Bird, Rachna Mehta, Tanya Jones, Tex & Tiffiany Johnson | /pages/cultural-council | **Verifiable — a standing body with named members** |
| `artist:` and `affiliation:` on **44** and **34** products | product data | **Verifiable, per item** |
| `hallmarks:` on 44 products, including **"Sans Hallmark"** | product data | **Verifiable — and states the absence** |
| Indian Arts and Crafts Act disclaimer | /pages/disclaimers, **linked from top nav and footer** | **Legal, checkable, and disclaims rather than claims** |
| Vintage / old pawn disclaimer: items "may show evidence of that previous life; signs of wear, dents, scratches, oxidation, broken stones" | /pages/disclaimers | **Verifiable honesty about condition** |
| Events calendar with real dates and venues | Homepage band 8 | **Verifiable — falsifiable next week** |

**Three brand-age numbers on one page (1989, 1990, "34 years") is the cautionary finding.**
The moment a brand starts trading on its age, every restatement is an opportunity to
contradict itself, and the contradiction is trivially discoverable. L&B, with a verified
2015 origin, should state the year **once, as data**, and never as a rhetorical asset.

**The genuinely excellent mechanism is Double D's proof-by-disclaimer.** They have a
top-level nav item called PRODUCT DISCLAIMERS whose content says, in effect, *here is what
this product is not*: not certified Indian-made under the IACA; not photographed to scale;
not free of wear. **Stating limits is a stronger credibility signal than stating virtues,
and it requires no history whatsoever.** It is available to a company founded last year.

**Named artisans with named tribal affiliations, plus a standing Cultural Council with named
members, is cultural proof done as verifiable attribution.** The structure is: *do not claim
the culture — name the individual people you work with, and let them be checkable.* Note the
`affiliation:` field is per-product data, not a page-level assertion.

### 2.8 PLP and PDP

**PLP** (`/collections/roughneck-rodeo`, 49 products):

| Item | Measured |
| :--- | :--- |
| Layout | 300 px filter sidebar + 880 px product column |
| Grid | flexbox `wrap`, `.one-third` cards → **3-up** |
| Card | 280 × 490 px, margins `0 10px 25px` |
| Image | 280 × 420 (2:3), **`object-fit: contain`** (letterboxes, does not crop) |
| Hover swap | present (`thumbnail-hover-enabled--false` on this collection) |
| Card video | some cards embed an autoplaying `<video>` with native controls |
| Card fields | *Quick View* overlay · title (Playfair 16/400) · price (Source Sans 16/300) |
| Sort | **9 options** — Featured, Most relevant, Best selling, A–Z, Z–A, Price ↑↓, Date ↑↓ |
| Facets | Availability, Size (39), Color (64), Price — native Shopify `faceted-filter-form` with `<details>`/`<summary>` |
| First product | y = **369 px** |
| Doc height | 9,462 px |

**Data-hygiene defect worth recording.** Each card renders its full tag string into the DOM
at `font-size: 0` and `color: rgba(0,0,0,0)`:
`apparelbagsbest-selling-productscollection-accessoriesnewest-productsnot-on-sale-productsover-100promo-collectionroughneck-rodeo`.
Invisible to sighted users, present to a screen reader and to search engines. Exactly the
class of leak our unauthenticated-crawl assertion (CLAUDE.md §11) exists to catch — here it
leaks merchandising internals rather than price, but the mechanism is identical.

**PDP** measured in §2.6 above. Gallery 700 × 1250 px, **30 images + 2 videos**, source
files up to 667 × 1000, JPEG only (no WebP/AVIF). `position: static` — no sticky gallery.
Options are **Colour + Size on all 250 products**.

**Catalogue price spread (variant level, 250 products):** min **$18**, median **$650**, max
**$14,000**. Product types are unset on **212 of 250** products. Tags are dominated by
internal season codes (`FS26`, `F1-26`, `ASIL26`, `AP26`, `vegas25`, `beltjuly21`,
`ABELT26`) and a size hack (`size:38(XXL)`, `size:36(XL)`) — operational metadata leaking
into a shopper-facing field.

---

## PART 3 — What Frontier House should take

### 3.0 The one-line summary

**Rockmount owns the vocabulary and wastes it in prose. Double D owns the narrative and
keeps it off the commerce path. Take Rockmount's words, put them in Double D's structure,
and never claim either brand's history.**

### 3.1 (a) A proposed construction vocabulary as structured attributes

These become **product-data fields with controlled vocabularies** — therefore facets,
therefore Product Anatomy callouts, therefore line-sheet columns. They are **not** prose.
Every one is a physically inspectable property of a garment, so **naming it never asserts a
fact about the company** — only about the object, which the photograph corroborates.

**Field 1 — `closure` (single-select).** The highest-value facet in western apparel.

```
pearl snap · diamond snap · horn snap · plain snap · button · concealed placket ·
zip front · half-zip · pullover · tie · hook-and-eye
```
*Rockmount evidence: `snap` in 119/250 descriptions, `diamond snap` in 37, zero filters.*
*Double D evidence: `snap closure`, `pearl snaps`, `horn snaps`, `zipper closure`,
`button closure`, `magnetic closure`, `tie closure` already exist as `embellishments:`
values — already a controlled vocabulary in all but name.*

**Field 2 — `pocket` (multi-select).**

```
sawtooth · smile (crescent) · flap · patch · slash · welt · zip · none
```
*Rockmount: `smile pocket` in 71/250 and `sawtooth` in 58/250 — the two most distinctive
terms in the catalogue and neither is filterable. `sawtooth` returns 212 site-search hits.*

**Field 3 — `cuff` (single-select).**

```
shotgun · barrel · French · snap · button · zip · elastic · raw
```
*Rockmount: `shotgun cuff` appears in **71 of 250** descriptions — 28% of the catalogue —
and in **zero** titles, zero tags, zero filters. This is the single largest unclaimed
merchandising asset found in the teardown.*

**Field 4 — `yoke` (single-select).**

```
pointed western · smile · plain · scalloped · contrast · none
```
*Rockmount: `yoke` in 14/250. Double D: 4/250. Under-used by both, and it is the silhouette
line a western shirt is recognised by.*

**Field 5 — `trim` (multi-select).** The decoration layer, distinct from closure/structure.

```
piping · contrast piping · fringe · buckstitch · chain-stitch embroidery ·
chenille embroidery · machine embroidery · applique · underlay · concho ·
studding · rhinestone · lacing · contrast lacing · hand-tooled · beading · none
```
*Combines Rockmount's `piping` (67/250) and `fringe` with Double D's `embellishments:`
values verbatim — `buckstitch`, `underlay`, `chainstitch embroidery`, `hand-tooled`,
`string suede applique`, `contrast lacing`. These are real, established western-trade terms
that neither brand invented and neither owns.*

**Field 6 — `fabric` (single-select) + `fabric_weight`.**

```
cotton gabardine twill · poplin · chambray · denim · stonewashed denim · Tencel denim ·
flannel · fleece · satin · crepe · viscose · sheepskin · lambskin · suede · leather · wool
```
*Rockmount: `gabardine` 64/250, `pima` and `chambray` present; **all invisible to filters**.
Note `content: 100% cotton gabardine twill` is already how Double D writes it.*

**Field 7 — `fit` (single-select) + `length` (single-select).**

```
fit:    relaxed · classic · slim · tailored · oversized
length: cropped · hip · tunic · midi · maxi
```
*Rockmount: `relaxed fit` in 65/250 descriptions, plus a dedicated `Slim Fits` collection —
proving fit is already a shopping axis, just an inconsistently-expressed one.
Double D: `fit: relaxed fit, length top of hip` — two facts in one free-text string.*

**Field 8 — `sleeve` (single-select).** `long · short · three-quarter · sleeveless · cap`

**Field 9 — `colour_family` (single-select) + `colour_name` (display string).**
```
family: black · white/ivory · denim/indigo · brown/tan · red · green · blue · yellow ·
        pink · purple · grey · multi · print
```
*This is the fix for both observed failures at once. Double D's 64 free-text colour values
(44 of them matching one product) become a shoppable 13-value facet while
`After Midnight`, `Buckskin` and `Alfalfa Field` survive as display names. Rockmount's
one-product-per-colourway model becomes a single product record with real swatches — which
is also what our "one garment, one product record" rule (CLAUDE.md §11) requires.*

**Field 10 — `origin` (single-select).** `Made in USA · Imported · Not stated`
*Rockmount's most transferable move: a per-product `Made in USA` tag on **44 of 250**
products and "Imported" written plainly on the rest. Per-product, as data, with honest
absence. This is the mechanism that lets us say nothing at all about manufacturing location
until OQ-04 is answered, without the silence looking evasive.*

**Field 11 — `style_number` (string, public).**
*Rockmount prints `Style No: 6710-DEN` on the **product card**, not just the PDP. For a
wholesale-first launch this is free buyer literacy. It is safe to expose publicly — it is an
identifier, not a price — and it directly serves our §13b slug-purity rule by giving the
catalogue a stable non-price identifier to key on.*

**Field 12 — `size_range` (structured) + `size_chart` (structured table).**
*Rockmount runs XS–XXXXL plus five tall grades (MEDT, LGT, XLT, XXLT, XXXLT) in one option
list; Double D mixes apparel sizes and boot sizes into one 39-value facet. Both are the
consequence of a single unstructured size field. Our §8.4 rule already requires the size
chart to be structured text — the size **range** needs the same treatment, with apparel and
footwear scales kept as separate typed fields.*

**Implementation rule.** These are **product-data fields with enumerated values**, validated
at import. Prose descriptions may repeat them for readability but are never the source of
truth. The Product Anatomy callouts render from the same fields the facets query, so a
callout can never describe a detail the filter cannot find — which is exactly the divergence
both teardown sites exhibit.

**Cost of not doing this, measured:** Rockmount has 71 shotgun-cuff shirts, 71 smile-pocket
shirts and 58 sawtooth-pocket shirts that **no shopper can filter to**, on a site whose own
search shows 212 people-scale hits for one of those words.

### 3.2 (b) Named collections and storytelling without gating commerce

Adopt Double D's structure; reject its PDP ordering.

**1. Two parallel taxonomies in one menu panel, at equal depth.**
Named collections (`/collections/<story-name>`) and functional categories
(`/collections/<garment-type>`) both live one click from anywhere, side by side. Neither is
a sub-branch of the other. *Measured: Double D's SHOP panel exposes 6 named collections and
5 functional groups simultaneously; a story shopper and a jacket shopper take the same
number of clicks.*

**2. The named-collection landing page carries no narrative.**
*Measured: `/collections/roughneck-rodeo` has an H1 and nothing else — `collectionCopy` is
empty and the first product sits at y = 369 px.* The story lives on the homepage hero and on
the editorial route. **The collection URL is a shopping route that happens to have a
beautiful name.** This is the mechanism that lets the naming be as evocative as we like at
zero commerce cost — and it satisfies our §11 rule that every cinematic surface has a
one-action exit to shop, because there is nothing to exit from.

**3. The story band carries the CTA inside it.**
*Measured: the homepage hero is 810 px of video + a 62-word narrative + `SHOP THE
COLLECTION`, all in one band.* Story and commerce action are never in separate bands where
one can be scrolled past without the other.

**4. `Noun, Name` product titles.**
`Shirt, Sabine` · `Blouse, Caddo` · `Jacket, Big Thicket`. Garment first, story second.
*Measured: 83% of Double D's catalogue.* It sorts, it truncates safely, it answers "what is
it" before "what is it called", and the second slot is free for pure evocation. **Store the
two halves as separate fields** (`garment_type`, `style_name`) so the display title is
composed, never parsed.

**5. Draw the story from real referents, never invented lineage.**
*Measured: Roughneck Rodeo's names are real Texas oil towns (Odessa, Midland, Borger,
Electra), a real geological formation (Eagle Ford) and real trade jargon (roustabout, bit
boss, wellhead).* Texas gives us rivers, counties, ranch roads, grasses, weather, county
fairs, Dallas Market Center itself. **A place name is not a heritage claim.** Naming a shirt
for the Sabine River asserts nothing about when the company started or where it sews.

**6. `collection` is a product field, not a page.**
*Measured: 74 of 250 Double D products carry `collection: <name>` in the description.* Make
it a real field. The PDP then shows one line — "Part of ⟨Collection⟩" — linking to the
collection route, and the atmosphere layer becomes removable without breaking the product
record, which is precisely our §11 "one server-rendered product truth" requirement.

**7. Reverse Double D's PDP order.**
*Measured defect: description occupies y = 536–1040, variant selectors start at 1060, Add to
Cart sits at y = **1,304** — 404 px below a 900 px fold, and worse on mobile.* Our order:
**title → price → variants → Add to Cart → spec block → narrative → collection link.** The
story loses nothing by sitting below the buy box; the buy box loses a great deal by sitting
below the story.

**8. Keep an editorial route with dates and read-times.**
*Measured: "DOUBLE TALK", 3 cards, each with a publication date and "1 min read".* Dated,
timed, honest. It also gives campaign fiction a home that is unmistakably editorial — which
is how our §13b "a campaign may be evocative; it may never be evidentiary" rule gets enforced
by architecture instead of by discipline.

**9. Expose the pre-order acknowledgement as a blocking control.**
*Measured: a required checkbox, "I understand this item is a pre-order," directly above Add
to Cart.* This is our §11 "pre-order is a first-class state" already solved.

**10. Reserve full-bleed for atmosphere, contained for product.**
*Measured: Double D's two editorial bands are both exactly 810 px full-bleed; every commerce
band is contained to 1200 px.* A visible, enforceable rule that keeps the atmosphere layer
and the commerce layer visually distinct — the structural defence our §11 asks for, expressed
as a layout constraint anyone can check.

### 3.3 (c) Warning list — mechanisms that would require invented history

**L&B has a verified 2015 origin on FashionGo. Everything in this column is off-limits, and
the adaptation is given for each.**

| # | Mechanism observed | Why it is unsafe for L&B | Adapt to |
| ---: | :--- | :--- | :--- |
| 1 | **"SINCE 1946" / "Est. 1946" as a hero graphic** (Rockmount hero band and About page artwork) | Any year-as-badge invites the same treatment for us, and 2015 does not carry it. **CLAUDE.md §13b already forbids fabricated founding dates baked into artwork ("EST. 1865").** | State the founding year **once, in an About page fact list, as data.** Never in artwork, never in a hero, never as a badge. |
| 2 | **Founder mythology** ("Papa Jack", "the oldest CEO in the world", "he is to Western wear what Henry Ford is to the car") | We have no founder narrative and no owner-confirmed biography. **§12 forbids invented people.** | Attribute philosophy to a **named, living, real person who can be contradicted** — Rockmount's own Steve Weil pull-quote pattern. Only with owner sign-off, and only their real words. |
| 3 | **Priority claims** ("made the first Western shirts with snaps", "first to commercialize bolo ties") | We can claim no first. Unprovable priority is the easiest claim to be publicly wrong about. | Claim **capability, not primacy**: full vertical integration is verified (§3) and is a stronger, checkable claim than being first. |
| 4 | **"Western Couture's First Family", "a long line of revolutionaries and outlaws"** (Double D) | Invented lineage. Nothing in our brand truth supports a family narrative. | Use **operational proof**, which we actually have and which is stronger: **100% fill rate · 2.64-day processing · 4.76/5 across 262 reviews · 4.7/5 across 353 reviews · permanent Dallas Market Center showroom #13656.** Real numbers, never rounded up (§12). |
| 5 | **Three conflicting brand-age claims on one page** (1989 / 1990 / "34 years") | The failure mode of trading on age. Every restatement is a new chance to contradict. | Single source of truth for the founding year; render it from one field everywhere it appears. |
| 6 | **Celebrity-worn galleries** (Elvis, Dylan, Kaukonen, Steven Tyler) | We have no such archive and cannot invent one. **§12: no invented people, no fabricated testimonials.** | **Named stockists and named boutiques** — verified: boutique-led Texas distribution plus Cavender's. "Where to find us" is real third-party proof requiring zero history. Double D's own **Stockists** nav item is the model. |
| 7 | **Sourcing attribution to named mills and tanneries** (already flagged in §13a as *Kuroki Mill*, *Leon & Tuscany* in the Stitch designs) | **Contradicts verified vertical integration** — L&B owns its textile production. Neither teardown site does this; the risk is inherited from our own design corpus. | Say what is true: **the brand owns textile, design, manufacturing, distribution and sales.** That is a rarer claim than a famous mill. |
| 8 | **"Made in USA" as a brand-level banner** | **OQ-04 is unanswered; §12 says "Made in Texas" is not evidenced.** | Rockmount's actual implementation is safe and should be copied exactly: **a per-product `origin` field on 44 of 250 items**, "Imported" written plainly on the rest, and **no brand-level claim anywhere.** Absence of the field is honest; a banner is not. |
| 9 | **Native American motif and cultural framing** (Double D's Cultural Impact page, `artist:` / `affiliation:` fields, blanket-coat heritage; also Rockmount's `native american` tag and "Native Pattern Embroidery" product titles) | Double D backs this with a **standing Cultural Council, a named artisan roster and an Indian Arts and Crafts Act disclaimer.** **Without that apparatus the motif is appropriation.** L&B has none of it and no evidence it works with any tribal artisan. | **Do not use the motif.** If the owner ever wants to, the prerequisites are the apparatus first: named artisans, named affiliations as per-product data, and the IACA disclaimer — in that order, never the motif first. |
| 10 | **A collection called "HERITAGE COLLECTION"** (Double D top-level nav) | The word asserts inherited lineage. | Name collections for **places, work, weather and materials** — real referents that carry romance without asserting a past. Roughneck Rodeo is the proof this works. |
| 11 | **Prices in the design corpus** ($45–$1,250 fixtures; Double D's real $18–$14,000 spread; Rockmount's $105–$160) | **§13a: the Stitch prices are fiction against verified wholesale $7–$33.** Neither comparator's price architecture is ours. | Fixtures marked as fixtures. Restricted wholesale pricing **absent, not hidden**, per §13b. |
| 12 | **accessiBe overlay** (Double D) | An overlay is not conformance. Our §8 target is WCAG 2.2 AA in the markup. | Build it correctly. No overlay, ever. |
| 13 | **Tag strings rendered invisibly into product cards** (Double D: `font-size: 0`, `color: rgba(0,0,0,0)`) | Same class of leak our unauthenticated-crawl assertion exists to catch (§11, §13b). Merchandising internals today; a price tomorrow. | **CI Test 2 must assert against invisible text nodes in product cards**, not just against visible price patterns. |
| 14 | **Internal season codes as public tags** (`FS26`, `ASIL26`, `beltjuly21`, `vegas25`, `size:38(XXL)`) | Operational metadata in a shopper-facing field; also leaks buying-calendar information. | Typed fields with controlled vocabularies. Internal codes stay internal. |
| 15 | **Non-sticky 216–372 px headers** (both sites) | A shared habit, not a validated pattern. Rockmount's 372 px of chrome plus a 114 px mobile header eats the fold. | Our own decision on evidence. Do not inherit it because both comparators do it. |

### 3.4 Two mechanisms to take verbatim — both require zero history

1. **Proof by disclaimer.** Double D gives **PRODUCT DISCLAIMERS** a top-level nav slot and
   footer parity, and its content says what the product *is not*: not IACA-certified, not
   photographed to scale, may show wear and oxidation. **Stating limits is a stronger
   credibility signal than stating virtues, and a company founded in 2015 can do it on day
   one.** For us the equivalents are exact and already required by our own rules: pack
   structure and minimums stated plainly, pre-order ship windows, honest per-size-range
   availability (§11, OQ-08), "Imported" where true, and no claim about manufacturing
   location while OQ-04 is open.

2. **The labelled spec block, promoted to real fields.** Double D's
   `color / content / materials / embellishments / fit / measurements / size / style number /
   collection` (on 229 of 250 products) is already the right *shape* — it is just stored as
   prose. Promote those exact keys to typed fields, merge in Rockmount's vocabulary from
   §3.1, and the same data serves **the filter, the Product Anatomy callout, the line sheet,
   the structured-data block and the no-JS fallback** from one source. That single move is
   what turns construction vocabulary from decoration into navigation — and it is the thing
   both of these brands, between them, have all the raw material for and neither has done.

---

## Appendix — measurement index

| Measurement | Rockmount | Double D |
| :--- | :--- | :--- |
| Platform / theme | Shopify · Testament (623) | Shopify · Turbo (`F1-26_RoughneckRodeo_CG_[OOTS]turboTN-24`) |
| JS libraries | none | jQuery 3.7.1 · Flickity · Shogun |
| PDP requests | 229 | **424** |
| PDP JS transferred | ~77 KB | **412 KB / 264 files** |
| PDP JS decoded | ~2.7 MB | **8.08 MB** |
| PDP images transferred | **6,394 KB** | 265 KB |
| PDP total transferred | ~6.8 MB | 858 KB |
| Third-party hosts | 15 | ~20 |
| Image formats | PNG / JPG only | JPG only |
| TTFB / DCL / load | 51 / 520 / 2,425 ms | 139 / **1,932** / **3,399** ms |
| Header height (desktop / mobile) | 324 + 48 / 114 + 54 | 216 / — |
| Sticky header | **No** | **No** |
| Display face | Cormorant 700 | Playfair Display 400 |
| Text face | Jost 400 | Source Sans Pro 300 |
| Ground / text | `#FFFFFF` / `#000000` | `#EEEEE6` / `#333333` |
| Accent | `#C60808` (6.11 : 1) | `#BD3A30` (4.72 : 1) |
| Homepage height | 5,697 px | 7,887 px |
| Content column | 1339 px | 1200 px |
| PLP grid | 4-up, card 225 × 481, img 2:3 `cover` | 3-up, card 280 × 490, img 2:3 `contain` |
| PLP facets | 2 groups (Availability, Style) | 4 groups (Availability, Size 39, Color 64, Price) |
| PLP sort | **none** | 9 options |
| PDP gallery | 640 px, **sticky**, 10 images | 700 px, static, 30 images + 2 videos |
| PDP variant options | **Size only** | Colour + Size |
| Catalogue sampled | 250 products | 250 products |
| Products with spec block | ~PDP-level bullet lists, unstructured | **229 / 250 (92%)**, unstructured |
| Construction terms filterable | **0** | **0** |
