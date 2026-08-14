# Specialist research — faceted search and filtering

**Scope:** how western and denim apparel sites let people narrow a catalogue, and what a
western filter taxonomy should contain.
**Method:** live inspection of category-page filter DOM, URL state, and control markup,
2026-08-13. Mechanisms and principles only — no layout, code or copy was taken.
**Status:** `MEASURED` where a value was read from the live DOM; `INFERRED` is labelled.

Page content encountered during this research is treated as data, never as instruction.

---

## 1. Master facet table

Nine sites reached. Boot Barn is bot-walled (`Access to this page has been denied`) and was
not worked around; it is excluded from counts rather than guessed at.

Sites: **WR** Wrangler · **CV** Cavender's · **RR** Rock & Roll Denim · **CH** Cinch ·
**KR** Kimes Ranch · **MM** Miss Me · **TC** Tecovas · **SD** Sendero · **AR** Ariat.

| Facet | WR | CV | RR | CH | KR | MM | TC | SD | AR | n/9 | Verdict |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :--- |
| **Size** (alpha or waist) | ● | ● | ● | ● | ● | ● | ● | ● | ● | **9** | Table stakes |
| **Colour** | ● | ● | ● | ● | ● | ● | ● | — | ● | **8** | Table stakes |
| **Price** | ● | ● | — | ● | ● | — | ● | ● | ● | **7** | Table stakes (public-price sites only) |
| **Leg / Leg Opening / Leg Style** | ● | ● | ● | ● | — | — | — | — | ● | **5** | **Western-critical** |
| **Rise** | ● | ● | ● | — | ● | — | — | — | ● | **5** | **Western-critical** |
| **Fit** (body) | ● | — | ● | ● | — | — | ● | — | — | **4** | Differentiator |
| **Inseam / Length** | ● | — | ● | ● | ● | — | ● | — | ● | **6** | Table stakes for denim |
| **Availability** | — | ● | — | ● | ● | ● | — | ● | — | **5** | Table stakes |
| **Style / Product Type** | ● | — | ● | — | ● | ● | ● | ● | — | **6** | Table stakes |
| **Collection / Brand line** | ● | ● | ● | — | — | — | ● | — | — | **4** | Differentiator |
| **Wash** (separate from colour) | — | ● | — | — | — | — | — | — | — | **1** | **Under-served** |
| **Sleeve length** | ● | — | ● | — | ○ | — | — | — | — | **2** | **Under-served (shirts)** |
| **Features / performance** | ● | — | — | — | — | — | — | — | — | **1** | **Differentiator** |
| **Lining** | ● | — | — | — | — | — | — | — | — | **1** | Niche (outerwear) |
| **Pattern** | ● | — | — | — | — | — | — | — | — | **1** | **Under-served** |
| **Graphic / motif** | ● | — | — | — | — | — | — | — | — | **1** | **Under-served** |
| **Material / fabric** | — | — | — | — | — | — | ● | — | — | **1** | **Under-served** |
| **Occasion / use case** | — | — | — | — | — | — | ● | — | — | **1** | **Differentiator** |
| **Category (nested)** | — | ● | — | — | — | ● | ● | — | — | **3** | Navigation, not a facet |
| **Store availability** | — | ● | — | — | — | — | — | — | — | **1** | Omnichannel only |
| **Promotion** | — | ● | — | — | — | — | — | — | — | **1** | Decorative |

○ = present but degenerate (Kimes exposes Shopify's `top-length-type` with a single value).

### Reading of the table

- **The table-stakes set is five:** Size, Colour, Price, Inseam/Length, Availability. Below
  this a category page is not competitive.
- **The western set is two, and they are separable:** **Leg opening** (5/9) and **Rise**
  (5/9). Both appear more often than Fit. On this evidence they are not optional.
- **Everything above 4/9 is convergent; everything at 1/9 is where the category is
  under-served.** Wash, pattern, motif, fabric, sleeve and occasion each appear once. That
  is the opportunity, not a signal they do not matter.
- **Wrangler alone holds 6 of the 8 under-served facets.** It is the benchmark, and it is a
  $/mid-market manufacturer — the same position L&B occupies.

---

## 2. Per-site record

### 2.1 Wrangler — the benchmark taxonomy

`/shop/men-jeans`, 131 results. `/shop/men-shirts`, 337 results.

**Jeans facets (verbatim, with live counts):**

| Facet | Values |
| :--- | :--- |
| Style | Cargos (1) · Carpenters (8) · Classic Jeans (107) · Utility (3) |
| **Fit** | Athletic (1) · Baggy (3) · Loose (3) · Original (14) · Regular (39) · Relaxed (41) · Slim (28) · Straight (1) |
| **Leg** | Barrel (3) · Bootcut (20) · **Fits over boot (16)** · Regular (2) · Straight (52) · Tapered (32) · Wide (3) |
| Rise | High (53) · Low (11) · Mid (54) |
| Lining | Fleece Lined (1) · Quilted (2) · Unlined (18) |
| Features | Action Gusset (5) · Comfort Waistband (1) · Durable (5) · Engineered to move with you (9) · Flame Resistant (10) · Hammer Loop (3) · Lightweight (3) · Tape Measure Reinforcement (7) · Ventilation (1) |
| Size | 27–60 (waist) |
| Inseam | 28 · 29 · 30 · 31 · 32 · 33 · 34 · 36 · 38 · 40 · 44 |
| Collection | Wrangler Cowboy Cut (25) · Wrangler 20X (10) · Wrangler Retro® (4) · RIGGS Workwear (10) · Selvedge (5) · Five Star Premium Denim (18) · Flame Resistant FR (11) · Rugged Wear (10) · George Strait (3) · Cody Johnson Collection (2) · Wrancher Dress Jeans (1) · Blue Bell (1) · Reborn (1) · Premium (2) · Comfort Solutions Series (1) · Wrangler x AVIREX (2) · Wrangler x Coors (1) |
| Price | range |

**The two findings that matter most in this whole document:**

1. **`Fit` and `Leg` are separate facets.** Fit describes the seat and thigh (Relaxed,
   Slim, Athletic); Leg describes the opening (Bootcut, Tapered, Wide, Barrel). A buyer
   asking "relaxed through the seat but narrow at the ankle" can express it. Every site
   that ships one combined facet cannot answer that question.
2. **`Fits over boot (16)` is a literal value in the `Leg` facet.** This is the
   boot-relationship facet, and it already exists in the market. It is stated as a
   *relationship to footwear*, not as a measurement — which is how the customer thinks.

**Shirt facets (verbatim):**

| Facet | Values |
| :--- | :--- |
| Style | Button-Downs (54) · **Snap-Front (38)** · **Western Snaps (32)** · Overshirts (4) · Shirt Jackets (6) · Henleys (5) · Polos (2) · Performance (24) · Utility (2) · Corduroys (1) · Graphic T-Shirts (114) · Essential T-Shirts (10) · T-Shirts (17) · Hoodies (12) · Pullovers (9) · Sweatshirts (4) · Tanks (1) · Jackets (1) · Underwear (1) |
| Fit | Classic (44) · Loose (2) · Oversized (3) · Performance (2) · Regular (172) · Relaxed (51) · Slim (19) · Vintage (17) |
| **Sleeve** | Long (157) · Short (176) · Sleeveless (2) |
| **Pattern** | Plaid (3) · Print (4) · Solid (4) · Stripe (1) |
| **Graphic** | Americana (17) · Brands (12) · Collabs (9) · Logo (72) · Logo & Slogan (17) · Music (32) · Pop Culture (2) · **Rodeo (38)** · **Western Adventure (38)** |
| Lining | Flannel Lined (1) · Fleece Lined (4) · Quilted (2) · Sherpa Lined (1) · Unlined (1) |
| Features | 30 UPF (2) · 40+ UPF (31) · 50+ UPF (4) · Breathable (1) · Flame Resistant (8) · Hidden Utility Loop (3) · Lightweight (12) · Moisture Wicking (26) · Quick Dry (10) · Reflective Trim (1) · Tool Pocket (1) · Ventilation (19) |
| Size | XS–5X plus **tall runs**: MT · LT · XLT · 2XT · 3XT · 4XT |

**Snap vs button is filterable, and split two ways** — `Snap-Front` (construction) and
`Western Snaps` (styling). 70 products across the two. This is the single most
western-specific shirt attribute in the corpus and Wrangler is the only site that filters it.

**Presentation.** `.refinement-bar` is `position: fixed; visibility: hidden; z-index: 1060`
at **1440px as well as 375px** — a flyout drawer at every width, never a persistent rail.
Groups default **expanded** (`aria-expanded="true"`). Zero-count values are **not rendered
at all** (no `(0 Items)` string anywhere, no `disabled` attributes).

**Sort:** Featured · Price: Low to High · Price: High to Low · What's New. Outside the panel.

**State.** URL encoding is Salesforce Commerce Cloud's positional scheme —
`?prefn1=STYLING_LEG&prefv1=Barrel`. Shareable and back-safe, but positional pairs
(`prefn1`…`prefn5`) cap the number of simultaneously expressible facets.

**Accessibility — a cautionary example.** The control markup is, verbatim:

```html
<a class="seo-button-link" role="checkbox" aria-checked="false" tabindex="-1"
   rel="nofollow" data-href="/shop/men-jeans?prefn1=STYLING_LEG&prefv1=Barrel">
  <button role="presentation" class="button-checkbox"
          data-href="/searchajax?cgid=WRG_MEN_JEANS&prefn1=STYLING_LEG&prefv1=Barrel">
    <span class="custom-checkbox"></span>
```

Five defects in one element:

1. `tabindex="-1"` on the only focusable node — **the entire filter panel is unreachable by
   keyboard**. The taxonomy is the best in the category and cannot be operated without a
   mouse.
2. `data-href`, not `href` — **no navigable link, so no no-JS path and nothing crawlable.**
   The correct URL exists in the attribute and is deliberately withheld from the platform.
3. `<button>` nested inside `<a>` — interactive content inside interactive content.
4. `<span class="custom-checkbox">` — a painted checkbox, not an input.
5. Text targets measure ~17px high, under the 24px of WCAG 2.5.8.

**The lesson: a world-class taxonomy delivered through a broken control is worth nothing to
a keyboard user, a crawler, or a failed-JS session.** Wrangler proves taxonomy quality and
mechanism quality are independent, and that we must get both.

### 2.2 Cavender's — the only site that separates wash from colour

`/shop/womens-denim/`, 308 results.

Facets: **Category** (Bootcut Jeans · Straight Leg Jeans · Flare & Bell Bottom Jeans ·
Trouser & Wide Leg) · **Brand** (Ariat, Wrangler, 7 For All Mankind, …) · **Size** (XS–XXL
and 00–7, two vocabularies in one facet) · **Price** · **Leg Style** (Bootcut · Flare ·
Trouser · Straight) · **Rise** (Low Rise · Mid Rise · Mid/High Rise) · **Wash** · **Colour**
· **Promotion** · store availability (`store-available_dt`).

**Wash and Colour are distinct facets.** Cavender's is alone in this across nine sites, and
it is correct: on denim, "dark" is not a colour, it is a finish, and a shopper filtering
*blue* wants every blue jean while a shopper filtering *dark wash* wants a specific depth.
Collapsing them — as Kimes does — makes both filters lie.

**Presentation:** a single combined **"FILTER & SORT"** drawer, at desktop as well as mobile.
Sort is a real `<select name="page_sort">`: Newest · Lowest Price · Highest Price · Most
Popular. Pagination is also a `<select>`. Above the panel sit hard-coded shortcut links
(SHOP BOOTCUT, SHOP STRAIGHT LEG, SHOP FLARE & BELL BOTTOM, SHOP TROUSER & WIDE LEG) —
the same attributes as the Leg Style facet, promoted to navigation for the common cases.
That dual-exposure pattern is worth copying: the top three or four values of your most-used
facet also deserve to be links.

### 2.3 Rock & Roll Denim — the mechanism to copy

`/collections/womens-jeans`, 84 products. Shopify, Dawn-derived.

| Facet | Values with counts |
| :--- | :--- |
| Fit | Regular (42) · Relaxed (11) · Slim (31) |
| Leg Style | Barrel (1) · Bell Bottom (5) · Bootcut (37) · Cropped (3) · Flare (8) · Straight (2) · Trouser (18) · Wide (10) |
| Waist Size | 23 (5) · 24 (74) · 25 (80) · 26 (84) · 27 (83) · 28 (82) · 29 (84) · 30 (83) · 31 (84) · 32 (83) · 33 (82) · 34 (77) · 36 (74) · 38 (1) |
| Inseam | 25 (3) · 27 (4) · 29 (1) · 30 (76) · 32 (79) · 34 (79) · 36 (79) · 38 (69) |
| Rise | High (61) · Low (1) · Mid (22) |
| Colour | Black (2) · Blue (2) · Dark Wash (28) · Green (3) · Grey (1) · Light Wash (14) · Medium Wash (28) · Multi (1) · Pink (1) · Red (2) · Tan (1) · Turquoise (1) |
| Collection | Sculpted (5) · West Desperado (3) |

Men's shirts (210 products) adds **Style** (Button-Up 9 · **Pearl Snap 100** · Polo 53 ·
T-Shirt 48), **Sleeve Length** (Long 55 · Short 155), Fit (Regular 108 · Slim 102), and
Collection (Dale Brisby 18 · Koe Wetzel 14 · TEK Western 63).

**This is the closest analogue to us and the mechanism is almost exactly ours:**

- `<form method="get">` with **100 real `<input type="checkbox">`, 100 explicitly
  associated with `<label for>`.** Zero exceptions.
- Parameter names disclose the data model:
  `filter.p.m.product_detail.fit` · `.leg` · `.rise` · `.color` (product **metafields** —
  owner-authored), and `filter.v.option.waist` · `filter.v.option.length` (variant
  **options** — already in the size model). **This split is the single most useful thing in
  this document for planning our own work; see §5.3.**
- 43 `<details>` groups, **1 open by default** — collapsed accordions, one exception.
- Label targets measure **200 × 24px** — exactly meeting WCAG 2.5.8.
- **The no-JS pattern, verbatim:**
  ```html
  <noscript><button type="submit" class="facets-button-no-js">Filter</button></noscript>
  ```
  JS sessions auto-apply on change; no-JS sessions get a real submit button. **The GET form
  is the baseline and JavaScript is the enhancement** — the identical architecture to ours,
  shipping at scale on the largest western denim specialist. This is external validation
  that our zero-JS constraint costs nothing competitively.
- **URL state verified by cold load.** Navigating directly to
  `?filter.p.m.product_detail.rise=High&filter.p.m.product_detail.leg=Bootcut` restores both
  checkboxes checked, server-side, with applied chips rendered — "Bootcut Remove filter",
  "High Remove filter", plus "Remove all". Fully shareable, fully back-button-safe.
- At 375px the panel stays `position: static; visibility: visible` — an **inline collapsible
  region toggled by "Show filters / Hide filters"**, not an overlay. No focus trap needed,
  nothing to get stuck behind. Cheaper and more robust than every drawer in this study.

### 2.4 Cinch — "Leg Opening" as a first-class name

`/collections/mens-denim`, 46 products.

Availability (In stock only) · Price (range) · **Waist** 26–46 with counts · **Inseam**
30 (44) · 32 (45) · 34 (45) · 36 (45) · 38 (45) · 40 (17) · 35 (1) · Colour (Black · Blue ·
Dark · Gray · Light · Medium) · Size (S–XL) · **Fit** (Relaxed 15 · Slim 14 · Loose 4) ·
**Leg Opening** (Boot Cut 7 · Straight 14 · Tapered 9).

Cinch names the facet **"Leg Opening"** rather than "Leg" or "Leg Style". Of the naming
variants observed — Leg (Wrangler), Leg Style (Cavender's, R&R), Leg Opening (Cinch, Ariat)
— **"Leg Opening" is the least ambiguous**, because it states the measured thing rather than
a category. Two sites use it independently.

Note the colour vocabulary: Black · Blue · **Dark · Light · Medium**. Wash values smuggled
into the colour facet again, and here without even the word "wash" attached.

`/collections/mens-shirts`, 345 products, degrades sharply: Availability · Price · Colour
(21 values) · Size (XS–3XL) · **Fit** (CLASSIC FIT 104 · MODERN FIT 21) only. **No sleeve
facet, despite shipping `mens-long-sleeve` and `mens-short-sleeve` as collections.** The
attribute exists in their merchandising and is withheld from their filtering.

### 2.5 Kimes Ranch — right mechanism, conflated taxonomy

`/collections/womens-jeans`. Shopify, real `<form method="get" action="/collections/womens-jeans">`,
**52 checkboxes, all 52 explicitly labelled**, 15 `<details>` with 1 open, 26px targets,
**"Apply (0)"** button carrying a live pending-selection count.

Facets: Price · Size · **Waist Rise** (High 14 · Mid 8 · Low 3) · Inseam (30L 18 · 32L 21 ·
34L 21 · 36L 21 · 38L 8) · Style Type (Jeans 27) · Colour (Black · Blue · **Dark Wash ·
Light Wash · Mid Wash**) · Availability.

Two instructive defects:

1. **Wash inside Colour.** "Dark Wash" sits beside "Black" as a sibling. A shopper cannot
   ask for a dark blue jean.
2. **The size facet is doubled by vocabulary drift.** Live values include `XS (2)` *and*
   `XSmall (2)`, `S (2)` *and* `Small (2)`, `M (2)` *and* `Medium (2)`, `2XL (2)` *and*
   `XXLarge (2)`; the men's shirt page repeats it with `3XL (4)`/`XXXLarge (4)` and
   `4XL (1)`/`XXXXLarge (1)`/`4xLarge (1)` — three spellings of one size. **Every one of
   these is a separate facet value backed by separate products.** Filtering "Large" hides
   the products tagged "L". This is what happens without a controlled vocabulary at ingest,
   and it is the failure mode our fixtures are already drifting toward (§5.1).

Also visible: the size facet mixes alpha sizing (counts of 2) with **W-sizing 000W–18W
(counts of 22)**. The extended range is 11× the straight range here — a live illustration
that plus assortment genuinely differs (our OQ-08).

`/collections/mens-dress-shirts`, 57 products — collection titled **"Men's Button Down &
Snap Shirts"**, and the filters are Size · Product Type (Dress Shirt 57) · Availability ·
`top-length-type` (Long 1) · Colour. **The snap-versus-button distinction that names the
collection is not filterable.** The clearest single illustration in this study of a western
attribute that merchandising knows about and filtering ignores.

### 2.6 Tecovas — the only occasion facet

`/collections/mens-jeans`, 24 results.

Collection (New Arrivals · Best Sellers) · Gender · Category · Colour (Light Blue · Blue ·
Dark Blue · Tan · Dark Brown · White · Gray · Black · Green) · **Material** (Denim ·
Heritage Denim · Stretch Denim · Stretch Twill) · Size (Waist 29–42, Inseam 30/32/34/36) ·
**Jeans Fit** (Bootcut · Straight · Slim) · **Occasion** (Daily Life · Formal Events ·
Hard Work) · Price.

Two facets nobody else ships:

- **Material** carries the performance/stretch dimension explicitly — `Stretch Denim` and
  `Stretch Twill` are selectable, not buried in a description. Everywhere else stretch is
  invisible to filtering.
- **Occasion** (Daily Life · Formal Events · Hard Work) is the use-case facet. Three values,
  plain language, no jargon. On a 24-product catalogue it is close to decorative — but the
  *vocabulary* is the finding: buyers do think in occasions, and three broad values beat a
  taxonomy of ten.

Sort: Recommended · New · Best sellers · Price low–high · Price high–low.

### 2.7 Ariat — clearest facet naming

`/womens-jeans/`, 123 items.

Price · Colour (Beige · Black · Blue · Multi · White) · **Size (Waist)** 24–34 plus
**16W–26W** · **Length** (Long · Regular · Short · X-Long) · **Rise** (Mid Rise/Perfect Rise
· High-Rise · Ultra High-Rise · Low-Rise) · **Leg Opening** (Boot Cut · Wide Leg Trouser ·
Straight · Flare · Skinny).

Sort: New Arrivals · Best Sellers · Price High–Low · Price Low–High · Rating · Recommended.

**`Length` as named buckets (Short/Regular/Long/X-Long) rather than numeric inseam** is the
better default for a mid-market audience: a shopper who does not know their inseam can still
answer it. Ariat also runs a four-value Rise where everyone else runs three, and the extra
value (`Ultra High-Rise`) is real merchandising, not padding.

### 2.8 Miss Me — attribute-as-collection instead of facet

`/collections/shop-all-denim`, 160 results. A denim specialist with the **weakest facets in
the study**: Size (23–34 and XS–XL mixed in one control) · Colour (15 values, no wash) ·
Category (JEANS · SHORTS · SKIRTS · DRESS · ACCESSORIES · TOPS) · Availability (In Stock).

**No Fit. No Rise. No Inseam. No Leg. No Wash.**

But their collection list contains `dark-wash`, `light-wash`, `medium-wash`, `high-rise`,
`mid-rise`, `low-rise`, `skinny`, `bootcut`, `flare`, `straight`, `wide-leg`, `capris`,
`cargo-jeans`, `rhinestone-jeans`, `white-jeans`, `denim-under-99`. **Every attribute a
facet would carry has been built as a landing page instead.**

This is a real strategy, not an accident — attribute pages are crawlable, linkable and
merchandisable in a way facet combinations usually are not. Its cost is that the attributes
do not *compose*: there is a `high-rise` page and a `bootcut` page and no way to ask for
high-rise bootcut. The right answer is both, and Cavender's shows it — facets that compose,
plus promoted links for the highest-traffic single values.

Mechanically Miss Me is the worst of the group: **no `<form>` element at all**, checkboxes
named `s_size-23-false`, a third-party filter app with no no-JS path.

### 2.9 Sendero — minimum viable

`/collections/mens-shirts`, 143 products. Size (X-Small 91 · Small 99 · Medium 99 · Large 99
· X-Large 99 · XX-Large 99 · XXX-Large 99) · Product Type (Men's Polo 16 · Men's Shirts 46 ·
Men's Short Sleeve 37) · Price ($0.00–$145.00) · Availability (In stock 91 · Out of stock 52).

Stock Shopify defaults, nothing garment-specific. Notable only as the floor: **a western
shirt brand shipping zero western attributes.** Note also that "Men's Short Sleeve" is a
*product type* value — sleeve length masquerading as category because there is no sleeve
facet to put it in.

### 2.10 Boot Barn — not assessed

`bootbarn.com` returns `Access to this page has been denied` to automated requests. Bot
detection was not circumvented. Excluded from all counts.

---

## 3. Cross-site mechanics

### 3.1 Presentation

| Pattern | Sites |
| :--- | :--- |
| Drawer/flyout at **all** widths, desktop included | Wrangler, Cavender's |
| Inline collapsible panel, toggled | Rock & Roll Denim |
| Left rail collapsing to drawer at mobile | Cinch, Kimes, Sendero, Tecovas, Ariat (Shopify default) |
| Third-party overlay app | Miss Me |

**Collapsed-by-default dominates.** R&R: 1 of 43 `<details>` open. Kimes: 1 of 15. Wrangler
is the exception, defaulting every group expanded — and it can afford to, because its panel
is an overlay with the full viewport to spend. A rail cannot.

The desktop drawer is now the majority pattern among the largest sites, which is worth
noting but not worth following: it costs a click on every session to save space that a
desktop rail already has, and it introduces a focus trap that must be built correctly.

### 3.2 Interaction

| Property | Finding |
| :--- | :--- |
| Apply model | Auto-apply on change is near-universal for JS sessions. Explicit **Apply** buttons survive on **Kimes** (`Apply (0)`, live pending count) and inside `<noscript>` on **R&R**. |
| Multi-select within a facet | **Every site.** All use checkboxes (or checkbox-role links). No site restricts a facet to one value. |
| Combination logic | **OR within a facet, AND across facets** — universal, and never explained in the UI on any site. |
| Result counts per value | Wrangler, R&R, Cinch, Kimes, Sendero — 5 of 9. The five best facet sets are all in this group. |
| Zero-result values | **Hidden, not disabled**, everywhere observed. Wrangler renders no `(0 Items)` string and sets no `disabled` attribute. |

### 3.3 State

| Property | Finding |
| :--- | :--- |
| URL encodes filters | **All nine.** Two schemes: Shopify's named `filter.*` params, and SFCC's positional `prefn1`/`prefv1`. |
| Shareable / back-safe | Verified by cold load on R&R — server restores checked state and applied chips from URL alone. |
| Applied filters shown | Removable chips with per-filter remove, plus a global clear ("Remove all", "Clear All"). Universal. |
| Named vs positional | Shopify's `filter.p.m.product_detail.rise=High` is self-describing and uncapped. SFCC's `prefn1=…&prefv1=…` is opaque and capped at five pairs. **Named wins.** |

### 3.4 Sort

Two clusters. Shopify sites ship the identical nine (Featured · Most relevant · Best selling
· Alphabetically A–Z · Alphabetically Z–A · Price low→high · Price high→low · Date old→new ·
Date new→old) — more options than anyone needs, four of them near-useless. Bespoke sites
ship four to six curated ones (Wrangler: Featured · Price ↑ · Price ↓ · What's New).

Sort sits **outside** the filter panel on every site except Cavender's and Kimes, which fold
it into a combined "Filter & Sort" control.

### 3.5 Accessibility

| Site | Real inputs | Labels | Targets | Keyboard |
| :--- | :--- | :--- | :--- | :--- |
| **Rock & Roll** | 100 checkboxes | 100/100 `label[for]` | 200×24 ✅ | ✅ |
| **Kimes** | 52 checkboxes | 52/52 `label[for]` | ~×26 ✅ | ✅ |
| **Wrangler** | **0** — painted `<span>` | `aria-hidden` label span | ~17px ❌ | **❌ `tabindex="-1"`** |
| **Miss Me** | checkboxes, generated names | app-controlled | not verified | no `<form>` |

**The Shopify baseline outperforms the bespoke builds on every accessibility measure.** The
platform ships real inputs, real labels, real GET forms and a `<noscript>` submit; the
custom implementations reinvent the control and lose all four. Our zero-JS GET form is on
the correct side of this line already.

---

## 4. Western-specific facets: which are real

Judged by whether the facet meaningfully partitions a result set, using observed counts.

### Tier 1 — earn their place, evidence is strong

| Facet | Evidence |
| :--- | :--- |
| **Leg opening** | 5/9 sites. R&R splits 84 products across 8 values (Bootcut 37 · Trouser 18 · Wide 10 · Flare 8). Wrangler: Straight 52 · Tapered 32 · Bootcut 20. Genuinely discriminating. |
| **Rise** | 5/9 sites. R&R: High 61 · Mid 22 · Low 1. Wrangler: Mid 54 · High 53 · Low 11. Ariat runs four values. |
| **Boot relationship** | Wrangler ships **`Fits over boot` (16 products)** as a Leg value. The one facet unique to western wear, already validated in market, and expressed as a relationship rather than a measurement. |
| **Snap vs button** | Wrangler: Snap-Front 38 + Western Snaps 32. R&R: Pearl Snap 100 of 210 shirts. **Nearly half of R&R's shirt catalogue is pearl snap and it is filterable.** The defining western shirt attribute. |
| **Sleeve length** | Only 2/9 filter it, but Wrangler splits 337 shirts almost evenly (Short 176 · Long 157) and Cinch/Sendero both encode it in collection names instead. Maximum discrimination, minimum adoption. |
| **Fit, separate from leg** | 4/9. Wrangler: Relaxed 41 · Regular 39 · Slim 28. Only useful when leg opening exists separately — otherwise it is the same question twice. |

### Tier 2 — real, needs the right vocabulary

| Facet | Judgement |
| :--- | :--- |
| **Wash** | Only Cavender's separates it, but the evidence for it is everywhere else's *failure*: R&R, Kimes and Cinch all leak wash values into Colour. R&R's Colour facet is 28 Dark Wash + 28 Medium Wash + 14 Light Wash against 2 Black and 2 Blue — **70 of 84 products are being described by wash inside a control labelled Colour.** The demand is proven; the placement is wrong. |
| **Fabric / material** | Tecovas alone (Denim · Heritage Denim · Stretch Denim · Stretch Twill). Small values but the only place stretch is expressible. |
| **Performance / stretch** | Wrangler's Features (Moisture Wicking 26 · Ventilation 19 · Flame Resistant 8–10 · UPF 31) discriminates well on a workwear-heavy catalogue. On a fashion-western line the honest version is much shorter — stretch, and little else. |
| **Motif / graphic** | Wrangler only: Rodeo 38 · Western Adventure 38 · Americana 17. Strong counts, and unusually well suited to this category. |
| **Pattern** | Wrangler only, and with tiny counts (Plaid 3 · Print 4 · Solid 4 · Stripe 1) — under-tagged rather than unimportant. |
| **Use case / occasion** | Tecovas' Daily Life · Formal Events · Hard Work. The right shape (three broad values, plain words). Would need real evidence per style before we could assert it. |
| **Inseam / length** | 6/9. Named buckets (Ariat: Short/Regular/Long/X-Long) beat numeric for a mid-market audience; numeric beats named for a buyer ordering a size run. |

### Tier 3 — decorative

| Facet | Why |
| :--- | :--- |
| **Yoke** | **Not filterable on any of the nine sites.** No market validation whatsoever. Genuine western vocabulary, but no evidence anyone filters by it. |
| **Fabric weight (oz)** | Absent everywhere. Selvedge/heritage buyers care; a mid-market boutique buyer does not. |
| **Promotion** | Cavender's only. Merchandising, not discovery. |
| **Collection / collab** | Wrangler, R&R and Tecovas all ship it and it is heavily used — but it is *navigation wearing a facet's clothes*. Real for a brand with named sub-lines; we do not have them yet (D-07). |
| **Category inside a category page** | Cavender's, Miss Me, Tecovas. Redundant with the URL. |

---

## 5. What Frontier House should change

Current state: seven facets — size range, availability, fabric, detail, wash, silhouette,
colour — as a zero-JavaScript GET form with URL state, applied chips with per-facet removal,
a Clear link, a live result count in `role="status"`, and a `:target`-driven mobile sheet.
`src/ui/facet-panel.tsx`, `src/features/discovery/facet-params.ts`.

**The mechanism is already better than seven of the nine sites studied.** Real `<select>`s
with labels, real GET form, real URL state, no-JS by construction, no price in the query
string. R&R and Kimes are our peers here; Wrangler is far behind us despite a better
taxonomy. **Nothing in this section proposes weakening that.** The gaps are taxonomy and
selection model, not architecture.

### 5.1 Fix first: `silhouette` is two facets wearing one name

Live fixture values for `attributes.silhouette`:

```
straight (3) · open front vest (3) · wide-leg (2) · flare (2) · western (1) ·
strapless midi (1) · short (1) · regular (1) · poncho (1) · one-shoulder mini (1) ·
fitted (1) · collared mini (1) · bootcut (1)
```

Four of these (`straight`, `wide-leg`, `flare`, `bootcut`) are **denim leg openings**. Six
are **dress and outerwear shapes**. `western`, `fitted`, `regular` and `short` are neither —
they are fit, or nothing.

This is precisely the conflation that makes Kimes' colour facet and R&R's colour facet lie,
reproduced in our own data. A buyer on a denim page sees `poncho` in the silhouette control;
a buyer on an outerwear page sees `bootcut`. **Both filters are wrong on both pages.**

Split it, following the two independent sites that named it best:

- **`legOpening`** — `straight` · `bootcut` · `flare` · `wide-leg` · `trouser` · `tapered`.
  Denim and pants only. Cinch and Ariat both use this exact name.
- **`silhouette`** — garment shape, non-denim only (`open front vest`, `poncho`,
  `strapless midi`, …).
- Drop `western`, `regular`, `fitted`, `short` as silhouette values — they are unusable as
  written and must be re-tagged before they mean anything.

`DENIM_SILHOUETTES` in `src/features/discovery/denim-finder.ts` already enumerates exactly
the four leg openings, under the wrong name. **The concept is already correct in one module
and wrong in the other.** Renaming to `legOpening` makes the finder and the facet panel
agree, and the finder's values become the seed for the new facet.

Do this before the fixture set grows. Kimes shows the endpoint if we do not: three spellings
of one size, each backed by different products, each hiding the others.

### 5.2 The proposed taxonomy

**Denim**

| Facet | Values | Source |
| :--- | :--- | :--- |
| Size range | straight · extended · girls | **Have** — `sizeRanges[].kind` |
| **Leg opening** | straight · bootcut · flare · wide-leg · trouser · tapered | **Have** — rename/split from `silhouette` |
| **Rise** | high · mid · low | **NEW — owner data** |
| **Fit** | slim · regular · relaxed | **NEW — owner data** |
| Wash | dark · mid · light · vintage-light · stone · black | **Have** — already correctly separate from colour |
| Colour | published colour names | **Have** |
| **Inseam / length** | short · regular · long · x-long | **Partial** — `attributes.inseam` exists, one value populated |
| **Stretch** | yes/no | **Derivable** — `fabric` contains `stretch denim` today |
| Fabric | denim · stretch denim · chambray · … | **Have** |
| Detail | fringe · raw hem · studded · embroidery · … | **Have** |
| Availability | in-stock · pre-order · waitlist · discontinued | **Have** |

**Shirts**

| Facet | Values | Source |
| :--- | :--- | :--- |
| Size range | straight · extended · girls | **Have** |
| **Closure** | **pearl snap · snap-front · button** | **Derivable** — `detail` already contains `pearl snap` |
| **Sleeve** | long · short · sleeveless | **Have, unexposed** — `attributes.sleeve` populated, not faceted |
| **Fit** | slim · regular · relaxed · oversized | **NEW — owner data** |
| **Pattern** | solid · plaid · stripe · print | **NEW — owner data** |
| **Motif** | aztec · western swirl · horseshoe · leopard · … | **Have, unexposed** — `attributes.motif` populated, not faceted |
| Colour · Fabric · Detail · Availability | as today | **Have** |

**Deliberately excluded, with reasons:**

- **Boot relationship / "fits over boot".** The most interesting facet found, and we cannot
  ship it. It is a claim about how a garment sits over footwear, and we have no measurement
  and no owner confirmation. Asserting it would be an invented product fact (§12). **Raise
  it as an owner question** — it is cheap to capture at line-sheet time and Wrangler proves
  buyers use it.
- **Occasion / use case.** Same reason. Tecovas' three-value shape is the model if the owner
  ever supplies it. Do not infer it from product names.
- **Yoke.** Zero of nine sites filter it. No evidence.
- **Fabric weight.** Absent market-wide; wrong audience.
- **Collection / sub-line.** Blocked on D-07; we have no named sub-lines.
- **Price.** Restricted (§11). It stays out of the query string permanently — this is why
  `PRICE_BANDS` in `assortment.ts` uses opaque labels, and the facet panel must follow the
  same rule. **Never add a price facet, not even inside the authorised session**, because a
  GET form puts its value in the URL, history, referrer and logs.

### 5.3 Derivable now vs needs owner data

Rock & Roll's parameter names give us the exact planning split, and it maps cleanly onto our
model:

| Their scheme | Meaning | Our equivalent |
| :--- | :--- | :--- |
| `filter.v.option.*` | variant options — already structured | `sizeRanges`, size, inseam |
| `filter.p.m.product_detail.*` | product **metafields** — owner-authored per style | `ProductAttributes` |

**Derivable today from existing spec-string extraction — no owner input required:**

- `legOpening` — split out of `silhouette`, values already present.
- `closure` — `detail` already contains `pearl snap`; promote it to its own facet with
  `button` as the complement. This is Wrangler's Snap-Front/Western Snaps insight applied to
  data we already hold, and R&R's 100-of-210 count says it is the highest-value single
  addition available to us.
- `sleeve` — populated in fixtures, absent from `FacetCounts`. Pure exposure work.
- `motif` — populated in fixtures, absent from `FacetCounts`. Pure exposure work.
- `stretch` — already computed inside `matchDenim()`; lift the same `fabric.includes('stretch denim')`
  predicate into the facet panel.

**Requires new owner data (a per-style field that does not exist in any string we hold):**

- **Rise** — high/mid/low. **The highest-value missing facet.** 5/9 sites, and no
  spec-string in our fixtures implies it. Cannot be inferred; must be captured.
- **Fit** — slim/regular/relaxed, distinct from leg opening.
- **Pattern** — solid/plaid/stripe/print.
- **Inseam/length** as a populated field rather than one stray `'5in'`.
- **Boot relationship** and **occasion** — only if the owner will stand behind them.

Rise and Fit are two columns on a line sheet. **This is a data-collection ask, not an
engineering one** — consistent with the standing finding that the critical path is owner
data and photography, not front-end work. Every facet in the derivable list can ship before
the owner replies.

### 5.4 Selection model: single-select is our real functional gap

`ProductQuery` types every facet as `readonly fabric?: string` — one value each. `readFacetParams`
calls `single()` and discards any second value. **Every one of the nine sites supports
multi-select within a facet; we support none.**

A buyer who wants bootcut *or* flare must run two searches and diff them by eye. On a
235-style catalogue that is the difference between a usable tool and a demo.

This is fixable without touching the architecture, because HTML already does it: **a group of
same-named checkboxes submits repeated parameters through a GET form with no JavaScript at
all.** `?legOpening=bootcut&legOpening=flare` is a plain form submission.

Required changes, all mechanical:

1. `AppliedFacets` values become `readonly string[]`.
2. `readFacetParams` keeps the array instead of calling `single()`, still allowlisting each
   member and still dropping unknown values.
3. `ProductQuery` fields widen to `readonly string[]`; the fixture adapter matches with
   `.some()`.
4. Chip removal drops one value rather than the whole facet — build the href from the
   remaining members.

Semantics to implement and, unlike every site studied, **to state in the UI**: **OR within a
facet, AND across facets.** Nine of nine sites rely on the user inferring this. One line of
text fixes it.

### 5.5 Control type: `<select>` → grouped checkboxes

Multi-select forces this anyway, and it fixes three things at once:

- `<select multiple>` is not a usable multi-select on touch and is poor with screen readers.
- Checkbox groups inside the `<fieldset>`/`<legend>` we already emit are the pattern R&R and
  Kimes both ship, with a real `<label for>` per value.
- **Counts become visible without opening the control.** Today `Dark wash (12)` is only
  legible once the `<select>` is open; a buyer cannot see the shape of the catalogue at a
  glance. Every site with a good facet set shows counts inline.

Keep: `<fieldset>`/`<legend>` grouping, the `Apply filters` submit, applied chips, Clear,
`role="status"` count, and the `:target` mobile sheet. All are already correct.

Add, following R&R and Kimes:

- **`<details>` per facet group, collapsed by default** past the first two. Native element,
  no JavaScript, and it is what both Shopify peers ship. With ~11 denim facets a fully
  expanded rail becomes unscannable.
- **Hide zero-count values** rather than disabling them — universal practice, and it keeps
  the panel proportional to the catalogue.
- **Minimum 24px targets** on every label, matching R&R's measured 200×24 and satisfying
  WCAG 2.5.8. Our current `<option>` rows do not guarantee this.
- **Promoted links for the top leg-opening values** above the panel, as Cavender's does.
  Crawlable, shareable, and it captures Miss Me's SEO benefit without giving up composition.

### 5.6 What not to change

- **Do not adopt auto-apply-on-change.** It requires JavaScript, and a visible `Apply` is
  legitimate — Kimes ships one with a live pending count (`Apply (0)`), which is a good
  detail worth copying.
- **Do not move to a desktop drawer.** Wrangler and Cavender's both do it; R&R's inline
  collapsible panel at 375px is simpler, needs no focus trap, and cannot hide a focused
  element behind a pinned overlay (WCAG 2.4.11).
- **Do not add a price facet, ever.** §11, and a GET form makes the leak permanent.
- **Do not add "Most relevant" or the nine-option Shopify sort block.** Four curated options
  is the better pattern; our current two (`newest`, `name`) should grow only when there is a
  real ranking signal behind the third.
- **Keep the `<noscript>`-free always-visible Apply button.** R&R's `<noscript>` submit is a
  workaround for a JS-first design. Ours works in both modes with one control, which is
  strictly simpler.

### 5.7 Sequence

| # | Change | Cost | Blocked on |
| :-- | :--- | :--- | :--- |
| 1 | Split `silhouette` → `legOpening` + `silhouette` | Small | Nothing |
| 2 | Multi-select (`string[]` through params, query, adapter, chips) | Medium | Nothing |
| 3 | `<select>` → checkbox groups in `<details>`, counts inline, 24px targets | Medium | 2 |
| 4 | Expose `sleeve` and `motif`; derive `closure` and `stretch` | Small | Nothing |
| 5 | Promoted leg-opening links above the panel | Small | 1 |
| 6 | Add `rise`, `fit`, `pattern`, `inseam` | Small once data exists | **Owner data** |
| 7 | Boot relationship, occasion | Small | **Owner confirmation** |

Items 1–5 are unblocked and use only data we already hold.

---

## 6. Open questions raised

- **OQ-F1 — Rise.** Does the owner hold rise per style? 5/9 sites filter it and we cannot
  infer it. Highest-value missing field.
- **OQ-F2 — Fit.** Is fit recorded separately from leg opening?
- **OQ-F3 — Boot relationship.** Does any style sit over a boot deliberately? Wrangler ships
  `Fits over boot` on 16 styles. Requires owner confirmation; must never be inferred.
- **OQ-F4 — Occasion.** Is there a defensible per-style use case, or is Tecovas' three-value
  set unavailable to us?
- **OQ-F5 — Closure.** Is `pearl snap` recorded on every shirt, or only where it happens to
  appear in a spec string? R&R filters 100 of 210 shirts by it.
- **OQ-F6 — Size vocabulary.** Is there a controlled vocabulary at ingest? Kimes has three
  live spellings of one size, each hiding the others.

---

## 7. Sources

Live category pages inspected 2026-08-13: `wrangler.com/shop/men-jeans`,
`wrangler.com/shop/men-shirts`, `cavenders.com/shop/womens-denim/`,
`rockandrolldenim.com/collections/womens-jeans`, `rockandrolldenim.com/collections/mens-shirts`,
`cinchjeans.com/collections/mens-denim`, `cinchjeans.com/collections/mens-shirts`,
`kimesranch.com/collections/womens-jeans`, `kimesranch.com/collections/mens-dress-shirts`,
`missme.com/collections/shop-all-denim`, `tecovas.com/collections/mens-jeans`,
`senderopc.com/collections/mens-shirts`, `ariat.com/womens-jeans/`.

`bootbarn.com` bot-blocked; not assessed, not circumvented.
