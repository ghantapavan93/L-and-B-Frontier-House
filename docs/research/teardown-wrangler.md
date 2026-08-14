# Front-end teardown — Wrangler (wrangler.com)

**Subject:** `https://www.wrangler.com` — US storefront
**Focus:** catalogue depth and discoverability at scale
**Date measured:** 2026-08-13
**Method:** in-app browser (computed styles, live DOM, Performance API) + direct HTTP
fetches of server-rendered HTML parsed offline. Desktop viewport 1440×900 unless stated.
**Status:** `MEASURED` where a number is given. Inferences are labelled.

> **Handling rules observed.** No accounts created, no forms submitted, no personal data
> entered, no irreversible controls clicked. Page content was treated as data throughout.
> **No text addressing AI agents was found** — `robots.txt` contains only conventional
> crawler directives, and `agents.md`, `llms.txt`, `ai.txt` and `.well-known/ai.txt` all
> return 404. The US storefront presented no cookie/consent banner in this session
> (OneTrust is loaded but did not surface a gate).
>
> **Extraction is mechanism-only.** No layout, copy, imagery, code, brand identity or
> proprietary interaction is reproduced here. Facet *value* names are quoted because the
> taxonomy is the object of study and the terms are industry-standard garment vocabulary.
> Marketing prose is described structurally, never reproduced.

---

## 0. Why this reference matters to us

Wrangler is the only reference in our set operating a **western catalogue in the high
hundreds** on a single storefront. It is not a style reference — the visual system is
plain to the point of being generic. It is a **structural** reference: it is the clearest
available answer to "what happens to a western apparel site when the catalogue gets big."

The headline: **their product data model is far richer than their filter set, and the
gap between the two is where the shopping experience leaks.** Everything useful in this
document follows from that one observation.

---

## 1. The scale being managed

`MEASURED` — result counts read from the server-rendered result counter and grid tiles.

| Surface | URL | Styles |
| :--- | :--- | ---: |
| All men's | `/shop/men-clothing` | **770** |
| All men's shirts | `/shop/men-shirts` | **337** |
| Men's jeans | `/shop/men-jeans` | **131** |
| Women's jeans | `/shop/women-jeans` | **106** |
| Men's western snap shirts | `/shop/men-shirts-western-snaps` | **72** |
| Cowboy Cut jeans | `/shop/denim-mens-jeans-cowboy-cut` | ~30 |

Page size is fixed at **36** everywhere (`sz=36`). One style carries up to **11
colourways**, each with **7 stills + 1 video**. So the men's jeans category alone is on
the order of ~1,000 colourway-level image assets behind 131 style records.

**Relevance to us.** L&B has 235+ seasonal styles — squarely inside this band. Wrangler's
mechanisms are therefore proportionate to our problem; Sézane's or GANNI's are not.

---

## 2. Navigation — how a very large catalogue is organised

### 2.1 Measured structure

`MEASURED` at 1440×900:

| Property | Value |
| :--- | :--- |
| Header total height | **153.8 px**, `position: fixed`, `z-index: 10` |
| — utility strip + logo/nav band | 106 px (`.header-sticky`) |
| — promotional carousel slot | 47.8 px (rotating, 4 messages) |
| Behaviour on scroll | **No shrink, no hide.** Full 153.8 px stays pinned |
| Top-level nav items | **10** mega-menu roots + Store Locator + locale |
| Total links inside main nav | **295** |
| Largest single mega-menu | MEN — 49 links |

The header consumes **17% of a 900 px viewport, permanently**. That is a deliberate
trade: constant access to a 295-link index, paid for with vertical space on every screen.

### 2.2 The organising principle: three orthogonal indexes over one catalogue

This is the single most transferable idea on the site. The same products are reachable
through three different top-level logics, all present simultaneously:

| Axis | Top-level entries | Answers the question |
| :--- | :--- | :--- |
| **Product type** | DENIM | "I want jeans" |
| **Audience** | MEN · WOMEN · KIDS | "I'm shopping for him" |
| **Use / world** | WESTERN · WORK · OUTDOOR | "I need it for the arena" |
| Temporal / commercial | NEW · SALE | "What's changed" |
| Adjacency | HOME & ACCESSORIES | "What else" |

A single Cowboy Cut jean is reachable via DENIM → Men's Jeans → Cowboy Cut, via MEN →
Jeans, and via WESTERN → Men → Jeans. **They do not pick one taxonomy and force it.**
They accept the redundancy because arrival intent varies.

`INFERENCE` — this is a direct answer to our **D-04** deadlock. The audit frames taxonomy
as a single choice between three candidate schemes. Wrangler's evidence is that a large
catalogue does not require one winner; it requires **one canonical URL per product** plus
several curated entry indexes that all resolve to it.

### 2.3 Mega-menu mechanics

- **Three levels.** L1 = the ten roots. L2 = garment type (Jeans, Shorts, Pants, Shirts,
  Jackets & Outerwear, Accessories…). L3 = the discriminating attribute inside that type.
- **Column control is authored, not automatic.** Empty `<li class="menu-column-break">`
  sentinels sit in the list and CSS breaks columns on them. A merchandiser controls where
  the panel wraps without touching code. Cheap, robust, no JS.
- **Same markup serves desktop and mobile.** Desktop renders L3 lists inline in columns;
  below `xl` the same nested lists become drill-down panels, each gaining a "Back" control
  and a "Shop All <category>" link that are `display:none` on desktop (`d-xl-none`).
  **One DOM, two interaction models.**
- Roots carry `role="menuitem"`, `aria-haspopup="true"`, `aria-expanded` toggling.
- Every branch terminates in an explicit **"Shop All"** escape. No dead ends.

### 2.4 The L3 layer is where the taxonomy gets interesting

DENIM → MEN'S JEANS exposes eleven L3 entries. Read carefully, they are **not one
taxonomy** — they are four different kinds of thing merged into one visual list:

| Kind | Entries |
| :--- | :--- |
| Silhouette / fit | Bootcut · Relaxed · Slim & Tapered · Original & Regular · Straight Leg |
| Icon style | Cowboy Cut |
| Sub-brand / collection | Five Star · 20X · Retro |
| Use context | Work · Western |

`INFERENCE` — this is honest merchandising, not sloppiness. A shopper looking for jeans
genuinely arrives with any of those four intents, and forcing them into a pure attribute
hierarchy would hide the ones that convert. But it means **the navigation label is not
the facet**, which matters for our routing: the nav is an editorial surface, the facets
are the data surface, and they must be allowed to disagree.

---

## 3. Typography

`MEASURED` — computed values.

**Families loaded:** `Futura PT Book` (400), `Futura PT Medium` (600), `Futura PT Bold`
(700), plus `Roboto` (400/500/600/700, from Google Fonts) and Font Awesome 7 Pro/Brands.
`Dosis` also present. Body default resolves to `Futura PT Medium` at `16px`.

| Level | Family | Size | Weight | Letter-spacing | Case |
| :--- | :--- | ---: | ---: | ---: | :--- |
| Wordmark | Futura PT Bold | 30 px | 400 | 0.75 px | upper |
| Nav L1 | Futura PT Bold | 13 px | 400 | 0.75 px | upper |
| Nav L2 heading | Futura PT Bold | 13 px | 400 | 0.75 px | upper |
| Nav L3 link | Futura PT Medium | 14 px | 400 | 0.75 px | sentence |
| PLP `h1` | Futura PT Bold | 30 px | 400 | 0.75 px | upper |
| Product name (card) | Futura PT Medium | **16 px** | **700** | 0.75 px | sentence |
| Price (card) | Futura PT Bold | **13 px** | 400 | 0.75 px | upper |
| Eyebrow (card) | Futura PT Bold | 11 px | 400 | 0.75 px | upper |
| Section head | Futura PT Bold | 30 px | 700 | −0.5 px | upper |
| Promo display | Futura PT Bold | 48 px | 400 | 1 px | upper |

**Three observations worth carrying:**

1. **A geometric sans does all the work.** One family, three weights. No serif, no display
   face. The "premium" signal is not typographic.
2. **Positive letter-spacing (0.75 px) is applied almost universally**, including at
   11–14 px. On uppercase small text this is correct and readable; it is the single
   consistent typographic decision on the site.
3. **Price is set smaller than the product name** (13 px vs 16 px) and in a lighter
   optical weight. Deliberate de-emphasis — the garment is named loudly, costed quietly.
   This directly supports our §11 permission-boundary work: a layout where price is
   typographically subordinate degrades gracefully when price is *absent* for
   unauthorised sessions.

**Loading four typeface families including a Google-hosted `Roboto` on a site that
visually uses one is waste.** `MEASURED`: `Roboto` is fetched from `fonts.googleapis.com`
as a render-blocking stylesheet, on a page whose visible type is entirely Futura PT.

---

## 4. Colour — UI colour versus photography

`MEASURED` — computed values.

| Role | Value | Contrast on white |
| :--- | :--- | ---: |
| Page background | `#FFFFFF` | — |
| Body text | `#000000` | **21.0 : 1** |
| Primary CTA fill | `rgb(159,43,37)` = **`#9F2B25`** | **7.38 : 1** (white on it) |
| Secondary CTA fill | `#000000` | 21.0 : 1 |
| Eyebrow accent (authored) | `rgb(41,60,93)` = `#293C5D` | 11.06 : 1 |
| Footer rule | `#D9D9D9` | — |

**The interface is achromatic.** Black type, white ground, grey rules. Exactly **one**
brand colour appears in the chrome — a brick red reserved for the primary CTA. Every
other colour on screen is photographic. Denim blue, tan, sage, black — all of it comes
from the garments.

This is our §5 principle already in production: *"Colour carried by the garment, not the
interface."* Wrangler proves it survives a 770-product catalogue. When forty tiles sit in
a viewport, an achromatic chrome is not restraint — it is the only thing that keeps forty
different washes from fighting each other.

**Contrast is not their problem.** Every measured pair clears AA comfortably, and the
brick red clears AAA for normal text. Their accessibility failures are structural (§11),
not chromatic.

### 4.1 There is no design-token layer

`MEASURED`: 68 CSS custom properties on `:root`. **Every one of them is third-party.**
Bootstrap 4 defaults (`--blue: #0070d2`, `--indigo`, `--pink`, `--yellow: #fb0`,
`--gray-dark: #666`), Font Awesome font stacks, and a checkout widget's positioning vars.
There is **no `--brand-*` namespace, no colour scale, no spacing scale.** Brand colour is
hardcoded in compiled Sass.

`INFERENCE` — the practical cost shows up in the eyebrow system (§6.5), where a
merchandiser sets `style="color: #293c5d"` inline per label because there is no token to
reference. Every future rebrand is a find-and-replace across compiled CSS *and* CMS
content. **A token layer is not a nicety at this catalogue size; it is the only way
colour stays consistent across content authored by non-engineers.**

---

## 5. The filter system

This is the deepest section because it is the reason to study this site.

### 5.1 Complete facet enumeration — men's jeans (131 styles)

`MEASURED` — parsed from server-rendered HTML. Counts are Wrangler's own, shown inline
next to each value.

| UI label | URL parameter | Values | Value list |
| :--- | :--- | ---: | :--- |
| **Style** | `PRODUCT_SUBCATEGORY` | 4 | Cargos (1) · Carpenters (8) · Classic Jeans (107) · Utility (3) |
| **Fit** | `STYLING_FIT` | 8 | Athletic (1) · Baggy (3) · Loose (3) · Original (14) · Regular (39) · Relaxed (41) · Slim (28) · Straight (1) |
| **Leg** | `STYLING_LEG` | 7 | Barrel (3) · Bootcut (20) · **Fits over boot (16)** · Regular (2) · Straight (52) · Tapered (32) · Wide (3) |
| **Rise** | `STYLING_RISE` | 3 | High (53) · Low (11) · Mid (54) |
| **Lining** | `STYLING_LINING` | 3 | Fleece Lined (1) · Quilted (2) · Unlined (18) |
| **Features** | `PRODUCT_FEATURES_WRG` | 9 | Action Gusset (5) · Comfort Waistband (1) · Durable (5) · Engineered to move with you (9) · Flame Resistant (10) · Hammer Loop (3) · Lightweight (3) · Tape Measure Reinforcement (7) · Ventilation (1) |
| **Size** (waist) | `SIZE1_FACET` | 27 | 27–40 in 1" steps, then 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66 |
| **Inseam** | `SIZE2_FACET` | 11 | 28 · 29 · 30 · 31 · 32 · 33 · 34 · 36 · 38 · 40 · 44 |
| **Collection** | `PRODUCT_COLLECTION` | 19 | Cody Johnson · Comfort Solutions Series · George Strait · Premium Performance · RIGGS Workwear · Selvedge · Wrancher Dress Jeans · 20X · Blue Bell · Cowboy Cut · Five Star Premium Denim · Flame Resistant FR · Premium · Reborn · Retro · Retro Premium · Rugged Wear · x AVIREX · x Coors |
| **Price** | `pmin` / `pmax` | range | min/max numeric inputs + an "Apply" custom range |

**Nine facets. And there is no colour facet and no wash facet.**

### 5.2 The most important finding in this teardown

**You cannot filter 131 pairs of jeans by wash.**

`MEASURED` — no `refinement-color`, `refinement-wash`, `refinement-material` or
`refinement-fabric` block exists in the HTML of any category page fetched (men's jeans,
women's jeans, all men's shirts, snap shirts, cowboy cut, all men's, all western).

And yet — `MEASURED` from the analytics payload attached to every product tile — the
product record carries:

```
color_family      : "Blue - Medium"        <- a normalised wash family, already exists
fabric            : "100% Cotton Heavyweight Twill Denim, 14.5 oz."
leg_opening       : "16 1/2\""
leg_style         : "Tapered"
rise              : "High"
fit               : "Slim"
size_department   : "Mens"
size_dimension_1  , size_dimension_2
department        : "Mens"
lbu               : "WESTERN"
product_flag_*    : top_rated | sale | new | exclusive | bestseller
```

**`color_family` is a clean, normalised, filter-ready value sitting in the data model,
piped to Google Analytics, and never exposed to a shopper.** Same for `fabric` (which
carries denim weight in ounces) and `leg_opening` (a measured dimension).

`INFERENCE` — this is what happens when facets are configured by whoever owns the search
platform and attributes are configured by whoever owns the PIM, and nobody owns the join.
It is the most likely way our own build fails at scale, and it is invisible in code
review because nothing is broken — a field simply never becomes a filter.

### 5.3 Fit and Leg are two axes, and that is correct

The best structural decision on the site: **`STYLING_FIT` and `STYLING_LEG` are separate
facets.**

- **Fit** = how the garment sits through seat and thigh — Athletic, Baggy, Loose,
  Original, Regular, Relaxed, Slim.
- **Leg** = the shape from knee to hem — Barrel, Bootcut, Straight, Tapered, Wide.

A shopper can ask for *relaxed through the seat but tapered at the ankle*, which a single
merged "fit" list cannot express. For western denim this is not a nicety: the whole
category lives on the seat/thigh-versus-hem distinction.

**Two flaws in the execution, both instructive:**

1. **"Straight" and "Regular" appear in both facets.** `Fit = Straight (1)` and
   `Leg = Straight (52)`; `Fit = Regular (39)` and `Leg = Regular (2)`. The low counts
   (1 and 2) are the tell: those are mis-tagged records, not a real dual meaning. When two
   facets share a vocabulary, data entry drifts between them.
2. **Boot relationship is smuggled into the Leg facet.** `Fits over boot (16)` is not a
   leg *shape* — it is a compatibility claim. It sits alongside Bootcut (20), which
   overlaps but is not identical (a bootcut jean is cut to go over a boot; a "fits over
   boot" straight leg is cut wide enough to). Merging them into one facet makes both
   values ambiguous.

### 5.4 Where the taxonomy actually collapses — 337 shirts

`MEASURED` — the **Fit** facet on `/shop/men-shirts` (337 styles) has **18 values**:

> Classic (44) · Loose (2) · Oversized (3) · Performance (2) · Regular (172) · Relaxed
> (51) · Slim (19) · Vintage (17) · **Americana (17) · Brands (12) · Collabs (9) · Logo
> (72) · Logo & Slogan (17) · Logo & Slogans (2) · Music (32) · Pop Culture (2) · Rodeo
> (38) · Western Adventure (38)**

The first eight are fits. **The last ten are graphic-tee themes.** They are in the Fit
facet because `styling_fit` was the nearest available free-text attribute when 114 graphic
T-shirts needed a subject taxonomy, and nobody added a field.

Note also `Logo & Slogan (17)` and `Logo & Slogans (2)` — the same value entered twice,
splitting the result set.

**This is the failure mode to design against.** It is not a bug anyone filed. It is what a
shared attribute does when the catalogue outgrows the schema: a facet silently stops
meaning one thing, and the shopper filtering for "Slim" gets a list that excludes 72
products tagged "Logo". At 72 products this never happens. At 337 it is inevitable unless
the schema is closed.

**Rule for us: every facet gets a closed enumeration, validated at ingest. A merchandiser
must not be able to type a new value into a fit field.**

### 5.5 Facet sets scale with the result set

`MEASURED` — the facet list is not fixed. It adapts:

| Category | Styles | Facets offered |
| :--- | ---: | ---: |
| All men's | 770 | **11** — gains a top-level **Category** facet (`PRODUCT_CATEGORY`, 10 values) |
| All men's shirts | 337 | 8 |
| Men's jeans | 131 | 9 |
| Western snap shirts | 72 | **7** — Style and Rise/Leg/Inseam dropped |
| Cowboy Cut | ~30 | **7** — Style and Lining dropped |

Two rules are visibly in force: **a facet with only one possible value is suppressed**,
and **breadth adds a coarse facet rather than a longer list**. At 770 products you are
first asked *what kind of thing*; at 30 you are never asked at all.

Facets are also **category-scoped by garment type** — jeans get Leg / Rise / Inseam,
shirts get Sleeve / Pattern, and Fit / Lining / Features / Size / Collection are shared.
There is no global facet set.

### 5.6 Presentation — a drawer, not a sidebar

`MEASURED` at 1440×900. This surprised me and is worth stating plainly:

- `.refinement-bar` is `position: fixed`, **650 px wide**, and **`visible: false` by
  default**. There is **no persistent filter sidebar on desktop.**
- It is opened by a single **"All Filters"** button, visible at all widths.
- The grid runs full-bleed (`full-width-grid`).
- The drawer footer shows a **live result preview before applying**: a primary button
  reading `View <n> items` (`data-product-count`, `data-selectedfilter-count`) beside a
  **Clear All** secondary.
- All nine groups are **accordions, all expanded by default** (`aria-expanded="true"`),
  each wrapped in a `<fieldset>` — but **no `<legend>`**; the group name is supplied via
  `aria-labelledby` pointing at the header `<div>`.
- Desktop and mobile use the **same component**. There is no separate mobile filter UI.

`INFERENCE` — collapsing desktop and mobile into one drawer halves the filter surface
area to build, test and keep accessible. The cost is discoverability: filters are one
click away rather than zero, and the applied-state is not permanently visible. Given they
also ship the fit-family carousel (§5.9) as an always-visible pre-filter, the trade looks
deliberate rather than lazy.

### 5.7 Multi-select, counts, and applied state

`MEASURED`:

- **Counts are shown on every value** as `Label (n)` — e.g. `Bootcut (20)`, with an
  `sr-only` companion string for screen readers.
- **Multi-select within a facet is OR**, encoded with a pipe. Verified:
  `STYLING_LEG=Bootcut` → 20 results; `STYLING_LEG=Bootcut%7CTapered` → **52** results
  (20 + 32 exactly).
- **Across facets it is AND.** `Leg=Bootcut` (20) + `Rise=High` → **6**.
- **Applied filters are grouped by facet, not shown as a flat chip row.** The panel renders
  `Leg: [Bootcut ×]` then `Rise: [High ×]` under a "Your selected filters" heading. Each
  chip's × carries an `sr-only` label naming both the facet and the value.
- Removing one chip resolves to a URL with that facet dropped **and the remaining facets
  renumbered** — a direct consequence of the URL scheme below.
- Empty state exists: an impossible combination returns 0 tiles and a 436 KB page (versus
  ~2.9 MB populated), so the empty branch is genuinely rendered, not an error.

### 5.8 URL encoding — the pattern to avoid

`MEASURED`. Filter state is fully in the URL, which is right. **The encoding is not.**

```
/shop/men-jeans?prefn1=STYLING_LEG&prefv1=Bootcut&prefn2=STYLING_RISE&prefv2=High
```

Facets are **positional numbered pairs**: `prefn<i>` names the attribute, `prefv<i>`
carries the value(s). Consequences, all real:

- **The URL is order-dependent.** The same filter set has many valid spellings depending
  on click order. Caching, analytics and dedupe all suffer.
- **Removing a middle facet forces server-side renumbering** of everything after it.
- **It leaks the internal PIM attribute names** (`STYLING_LEG`, `PRODUCT_FEATURES_WRG`)
  into public URLs, permanently coupling the URL contract to the schema.
- It is unreadable and unshareable in a human sense.

**A named-parameter scheme (`?leg=bootcut&rise=high`) has none of these properties and
costs nothing extra to build.** This is a free win we should take.

**SEO handling of facet URLs is, by contrast, exemplary — a three-layer defence:**

1. `robots.txt` disallows `/*prefn1=` … `/*prefn4=` and `/*prefv1=` … `/*prefv4=`.
2. Filtered pages emit `<meta name="robots" content="noindex">`.
3. Filtered pages emit `<link rel="canonical">` back to the unfiltered category.

Unfiltered category pages carry no robots meta and self-canonicalise. Clean.

Two gaps worth noting so we do not copy them: the robots rules **stop at `prefn4`**, so a
five-facet combination is crawlable (and being robots-disallowed elsewhere, the `noindex`
on those pages can't be seen anyway — the classic disallow/noindex conflict); and
`Disallow: /*sz=*` blocks the "Load more" pagination URLs, so **products beyond position
36 are not reachable by crawl** and depend entirely on the sitemap.

### 5.9 Fit families — a separate, visual, pre-filter layer

**This is the mechanism I would most want to adapt.**

Above the grid, before any filter UI, sits a carousel of **12 photographed fit tiles**
under a two-state toggle: **STYLE** and **COLLECTION**. Each tile is a full-length model
photograph, a short name, and **one sentence defining the fit in plain language** —
roughly of the form *"cut to fit over a boot"*, *"more room through the leg"*, *"straight
from hip to ankle"*.

`MEASURED` — tile box 297 × 470.5 px; carousel track 1265 px; Slick Carousel; 12
non-cloned slides in a single track, the toggle switching which subset is shown (6 style,
6 collection).

**What the tiles actually link to is the point.** They are not a parallel taxonomy — they
are **pre-built filter URLs and curated category pages, mixed freely**:

| Tile | Resolves to |
| :--- | :--- |
| Bootcut | `?prefn1=STYLING_LEG&prefv1=Bootcut` — a single facet value |
| Straight | `?prefn1=STYLING_LEG&prefv1=Straight` |
| Slim | `?prefn1=STYLING_FIT&prefv1=Slim` |
| Relaxed | `?prefn1=STYLING_FIT&prefv1=Relaxed%7CLoose` — **two values merged under one label** |
| Carpenter | `?prefn1=PRODUCT_SUBCATEGORY&prefv1=Carpenters` — a different facet entirely |
| 20X | `?prefn1=PRODUCT_COLLECTION&prefv1=Wrangler 20X%7CCody Johnson Collection` |
| Selvedge | `?prefn1=PRODUCT_COLLECTION&prefv1=Selvedge` |
| Cowboy Cut | a hand-built category page, not a filter |
| Retro / Workwear | hand-built category pages |

Three principles fall out of this, and all three transfer directly:

1. **An editorial label may span several data values.** "Relaxed" means
   `Relaxed OR Loose` because shoppers do not distinguish them. The data stays precise;
   the label is merciful.
2. **The visual layer is not obliged to respect facet boundaries.** One row mixes a leg
   value, a fit value, a subcategory and a collection — because a shopper's mental model
   mixes them too.
3. **Escalation to a hand-built page is available for anything that deserves it.** Cowboy
   Cut is too important to be a query string, so it isn't one.

**And critically: every tile is a plain `<a href>` to a real, server-rendered URL.** The
whole layer works with JavaScript disabled. It is a set of links wearing photographs.

### 5.10 Filtering speed — a server round-trip, and it shows

`MEASURED`, from the live page, hitting the endpoint the UI itself uses:

| Metric | Value |
| :--- | ---: |
| Filter apply → response | **950 ms** |
| Response size | **1.31 MB** of HTML |
| Response contains | 20 product tiles **and** the full re-rendered facet list |
| Full page? | No — an HTML partial (`/searchajax?cgid=…&prefn1=…`) |

Full-page fetches with the same filters measured **0.50–1.46 s** server-side.

So: **a filter click costs about a second and about 1.3 MB.** It is not client-side. The
upside is that facet counts are always correct because the server recomputes them; the
downside is that exploratory filtering — clicking four things to see what happens — costs
four seconds and 5 MB.

`INFERENCE` — for our INP budget of ≤150 ms this is not a model to copy directly. But note
*what* they get for the round-trip: recomputed counts on every remaining facet. That is
the expensive, correct behaviour. A client-side filter that shows stale counts is worse
than a slow one that shows true ones. **The right answer is a small JSON round-trip that
returns counts and IDs, with rendering done locally — not a 1.3 MB HTML partial, and not
client-only filtering over a partial dataset.**

### 5.11 Sorting

`MEASURED` — four options only:

| Label | Rule ID |
| :--- | :--- |
| Featured (default) | `CP+ Bestsellers (365D)` |
| Price: Low to High | `price low to high` |
| Price: High to Low | `price high to low` |
| What's New | `ALG NEWNESS` |

Default sort is **bestsellers over a trailing 365-day window** — a commercial rule, not
recency and not manual. Sorting is the same AJAX round-trip as filtering, and each option
carries both an AJAX `url` and a crawlable `urlSEO`.

No rating sort (there are no ratings), no "most reviewed", no relevance control.

---

## 6. PLP mechanics

### 6.1 Grid

`MEASURED`:

| Property | Value |
| :--- | :--- |
| Columns ≥ 768 px | **4** (`.col-md-3` → `flex: 0 0 25%`) |
| Columns < 768 px | **2** (`.col-6`) |
| Grid item box at 1440 | 343.5 × 666.1 px |
| Image box | 338.5 × 451.3 px, **aspect-ratio 3 : 4** |
| Items per page | **36** |
| Breakpoints | sm 576 · md 768 · lg 992 · xl 1200 · xxl 1600 |

A **user-controlled density switcher** exists (`.grid-filter` buttons: `two-in-row` /
`three-in-row` on desktop, `two-in-row` / `one-in-row` on mobile, with `aria-label`s such
as "Three Column Gridview"). It was not exposed at the viewport measured, so I can only
confirm the control exists in the DOM with two options per breakpoint — I could not verify
its rendered effect.

**One image flaw worth flagging because it is easy to repeat.** The tile image carries
`style="aspect-ratio: 0.75; object-fit: fill;"`. **`object-fit: fill` distorts** any asset
whose intrinsic ratio is not exactly 3:4 — it stretches rather than crops. The correct
value for a fixed-ratio product tile is `cover` (or `contain` on a neutral ground). On a
garment catalogue, stretching is the one image error a shopper will notice.

### 6.2 Card anatomy

Top to bottom, `MEASURED` from markup and computed styles:

1. **Badge slot** (top) — driven by `data-badges-info` with `defaultBadges`, `top`,
   `bottom` and `mobileBadges` arrays. Empty on most tiles.
2. **Image** — a Swiper carousel, **7 slides** per colourway (hero + 6 alternates),
   `fetchpriority="high"` on the first tile. Swiper is **not initialised at load**
   (`swiperInit: false`); it hydrates on interaction.
3. **Colour label** — `Color: <name>` (quick-view region).
4. **Swatch row** — `role="radiogroup"` containing `role="radio"` `aria-checked` buttons.
   Each swatch carries the **entire image manifest** for its colourway as a JSON
   attribute, including video renditions, so hovering a swatch can repaint the tile with
   zero network cost. Square swatches (`border-radius: 0`).
5. **Product name** — 16 px, weight 700.
6. **Eyebrow** — merchandiser-authored contextual label with an **inline colour**
   (`style="color: #293c5d"`), 11 px uppercase. Used for endorsement and campaign context.
7. **Price** — 13 px, with a `<del class="item-on-sale d-none">` element **always present
   and hidden**, ready to be unhidden for markdowns without a layout shift.
8. **Promotional message** — cart-level promo line, separate from price.

`MEASURED`: the first tile exposed **22 swatch nodes** for 11 colourways (the set is
rendered twice — once for the tile, once for the quick-view). No "+n more colours"
overflow affordance was found; the row appears to render all colourways.

### 6.3 Hover and quick-shop

- Hover swaps hero → `data-alt-img` (ALT1), pre-declared as an attribute so no request is
  needed.
- **Quick view exists** — `button.quickview-trigger` per tile opening a modal with image,
  name, colour swatches and a "View Details" link.
- **There is no add-to-cart and no size selector on the tile itself** (`MEASURED`: 0
  matching nodes). Quick-shop stops at the modal; buying requires the PDP.

`INFERENCE` — sensible for a product with a **three-axis variant matrix** (colour × waist
× inseam). A tile-level add-to-cart would need to resolve 11 × 13 × 6 combinations in a
hover card. They correctly declined.

### 6.4 Pagination

**A "Load more" button — not infinite scroll.** `MEASURED`, and the implementation is the
best single piece of engineering on the site:

```
<a class="btn btn-show-more-products"
   data-url="…/searchupdate?cgid=WRG_MEN_JEANS&start=36&sz=36"   <- AJAX append
   href="…/shop/men-jeans?start=36&sz=36">Load more</a>          <- real, works with no JS
```

Plus `data-seo-pagination="true"`, `data-page-size="36"`, `data-page-number="0"`, and a
progress line reading **"36 of 131 results"**.

**It is a real anchor with a real paginated URL, progressively enhanced into an AJAX
append.** JavaScript off: it is a link to page 2. JavaScript on: it appends in place.
Scroll position is never hijacked, the footer is always reachable, and the user always
knows how much is left.

This is exactly the pattern our **CI Test 1 (no-JS product assertion)** demands, and it is
worth copying almost verbatim in shape.

### 6.5 Merchandising layers on the grid

Three independent authored layers ride on top of the algorithmic grid:

| Layer | Mechanism | Purpose |
| :--- | :--- | :--- |
| **Eyebrow** | `data-eyebrows-info` — text + hex colour + optional icon | Campaign / endorsement context above the name |
| **Badge** | `data-badges-info` — four positional arrays incl. a separate mobile set | New / exclusive / bestseller flags |
| **Promo line** | separate node below price | Cart-level offers |

All three are **data-driven and separately positioned**, including a distinct mobile badge
set. `INFERENCE` — this is what lets a merchandiser respond to a drop without an engineer,
and it is the layer L&B's daily-drop model will need most.

---

## 7. PDP

Reference product: a Cowboy Cut slim fit jean (`/shop/…-0936.html`).

### 7.1 Gallery

`MEASURED`: **17 images** in the gallery region, **8 thumbnails**, **5 video elements**,
zoom present. Per colourway the manifest is **7 stills (hero + ALT1–ALT6) + 1 video**,
with the video delivered in three renditions (≈360p/800k, 480p/1400k, 720p/2600k).

Scene7 responsive ladder on PDP: `PDP24-SMALL`, `PDP24-LARGE`, `PDP24-XLARGE`,
`PDP24-XXLARGE`, `PDP24-SWATCH`. **This is a real ladder** — unlike the PLP, where the
`<picture>` element declares five `<source>` breakpoints that all resolve to the *identical*
URL and preset. Five media queries, one image. Pure markup weight for zero benefit; worth
naming because it is the kind of thing that survives review by looking correct.

**Alt text is the best thing on the site.** `MEASURED`:

- `"… in Antique Wash main view"`
- `"… in Antique Wash alternative view"`
- `"… in Antique Wash alternative view 2"`

**Product name + colourway name + view role + index**, generated systematically. This
satisfies our §8.5 requirement and is trivially reproducible from structured data. Adopt
the pattern.

### 7.2 Fit and cut — how it is actually explained

The "Product Information" block is a **narrative paragraph followed by a spec table**, and
the division of labour is exactly right.

**The paragraph** does four things: names the construction details by their trade names
(yokes, pocket flaps, stitch motif, patch, closure type); states the silhouette in body
terms (through the seat, thigh and knee); **positions the garment against its sibling
style by model number**; and closes on occasion. It is roughly 90 words. It is specific
about construction and vague about nothing.

**The spec table** — label/value pairs — is where the fit data lives:

*Jeans:*

| Field | Example value |
| :--- | :--- |
| Fit | Slim |
| Rise | High |
| **Front Rise** | **11"** |
| Leg | Tapered |
| **Leg Opening** | **16 1/2"** |
| Front Closure | Zip-Fly with button closure |
| *(badge)* | **No Stretch**, with an icon keyed `PRODUCT_MATERIAL_STRETCH` |

*Snap shirts:*

| Field | Example value |
| :--- | :--- |
| Fit | Classic |
| Sleeve Length | Long |
| **Front Closure** | **Snaps** |
| Front Pockets | Two spade with snaps |
| **Back** | **Authentic Western Back Yoke** |
| Collar | Spread |
| Cuff | Three Snap Closure |

**The pattern to steal — every fit dimension is expressed twice: once as a filterable
category, once as a measured number.** Rise is both `High` and `11"`. Leg is both
`Tapered` and `16 1/2"`. The category is for filtering and scanning; the measurement is
for deciding. Neither substitutes for the other.

**And note what is here that is not a facet.** Yoke, collar, cuff, pocket construction,
front closure, stretch — all structured PDP fields, **none of them filterable**. On a
site selling 337 shirts including 72 western snaps, *you cannot filter by snap versus
button, and you cannot filter by yoke.* The data exists. The join does not.

### 7.3 Size selection

**Not a 2D matrix — three independent selectors**, `MEASURED`:

| Axis | Control | Values |
| :--- | :--- | ---: |
| Colour | swatch radiogroup | 11 (4 marked unavailable) |
| **Size** (waist) | button group | 13 (1 unavailable) |
| **Length** (inseam) | button group | 6 (2 unavailable) |

Unavailable combinations are **marked, not hidden** — the shopper sees that a size exists
and is out, rather than silently losing it. This is the correct choice and it is the one
most often got wrong.

**Size chart is a real HTML `<table>`**, not an image — three columns (jean size, waist
measurement, hip measurement) plus a numbered measuring-tips section, opened in a modal.

This is worth stating loudly for our purposes: **our §8.4 non-negotiable — "size and fit
data is structured text, never an image of a table" — is met here, by a mass-market brand,
in a modal, with zebra striping and measuring instructions.** L&B's current single-JPEG
size chart is behind a $20 jeans brand on the criterion our own constitution calls a
probable WCAG 1.1.1 failure.

### 7.4 Commerce states and related products

Present: `Add to bag`; a country-restriction state (*not available in your country*);
`NOTIFY ME WHEN IN STOCK` backed by `data-backinstockeligible` and a dedicated modal;
favourites toggle with add/remove labels; Klarna widget.

Related products come from two systems: a **Stylitics** outfitting widget headed
*"How to wear it"* (complete-the-look, styled sets) and a **CQuotient/Einstein**
recommendation carousel. `MEASURED`: recommendation tiles were still 0 at measurement time
— both are lazy-loaded below the fold.

### 7.5 Structured data — a real gap

`MEASURED` on the PDP:

- `<meta name="robots">` — **absent** (indexable)
- **`"@type":"Product"` JSON-LD — absent**
- **`itemtype="schema.org/Product"` microdata — absent**
- `AggregateRating` — absent (there are no ratings anywhere on the site)
- Only `BreadcrumbList` JSON-LD is present

A national apparel brand is shipping product pages with **no Product structured data**.
No price, availability, brand, SKU or image is exposed to search engines in machine
form. `INFERENCE` — this is an oversight, not a strategy, and it is a cheap thing for us
to get right from commit one. (Note the interaction with our §11 permission boundary:
structured data is exactly where restricted wholesale pricing must **never** appear. Our
Product JSON-LD must be built from the *public* projection only.)

---

## 8. Motion

**There is almost none, and that is the finding.**

`MEASURED` on a fully loaded PLP: **0 running animations** (`document.getAnimations()`).
No scroll-linked effects, no parallax, no entrance choreography, no reveal-on-scroll. The
only declared transitions:

| Element | Transition |
| :--- | :--- |
| Nav link | `opacity 0.15s linear` |
| Primary button | `color / background-color / border-color 0.15s ease-in-out` |
| Tile, tile image, swatch | `transition: all` (unbounded — a performance smell) |

Movement on the page comes from three carousels (Slick for the fit families and promo
strip, Swiper for tile and PDP galleries) — all **user-driven or auto-advancing text**, not
animation of the interface itself.

**Reduced motion is not handled.** `MEASURED`: 14 `prefers-reduced-motion` media blocks
exist in the CSS, and **every one belongs to a vendor** — Font Awesome's spin utilities,
Bootstrap's `.fade` / `.collapsing` / `.custom-switch`, an Adyen checkout input, a
Bloomreach widget. **There is zero first-party reduced-motion handling**, and the promo
carousel auto-advances regardless.

This is precisely the situation our §8.2 warns about: *"nothing in the stack provides
reduced-motion handling for you."* Here is a live, large, professionally-built storefront
where the only reduced-motion support came free with third-party dependencies — and where
the one thing that actually moves without user intent (the auto-rotating promo bar) is not
covered by any of it. That bar also has **no pause control**, which is a **WCAG 2.2.2
(Level A)** issue for auto-advancing content over 5 seconds.

**The transferable point for L&B:** a 770-product catalogue is legible and commercially
successful with essentially no interface motion. Motion is not what makes a catalogue feel
considered — image quality, grid rhythm and type discipline are. Our cinematic ambitions
belong on discovery surfaces, never on the grid.

---

## 9. Technology and performance

### 9.1 Stack

`MEASURED` from markup and network:

| Layer | Technology |
| :--- | :--- |
| Platform | **Salesforce Commerce Cloud (Demandware / SFRA)** — `/on/demandware.static/`, `Sites-Wrangler-Site`, `dwvar_*`, `prefn/prefv` |
| Rendering | **Server-rendered HTML.** No React, Vue, Next or hydration framework |
| CSS | Bootstrap 4 + compiled Sass, 7 stylesheets |
| Carousels | Slick (guided nav, promo) + Swiper (tiles, PDP gallery) |
| Imaging / DAM | **Adobe Scene7** (`images.wrangler.com/is/image/…?$PRESET$`) |
| CMS / video | **Amplience** + video.js |
| Search / merch rules | Sort rules prefixed `ALG`; `Attraqt-GenerateSegmentId` in robots.txt |
| Recommendations | **CQuotient / Einstein** (`gretel.min.js`) |
| Outfitting | **Stylitics** |
| Personalisation | **Dynamic Yield** |
| Consent | **OneTrust** |
| Accessibility | **UsableNet overlay** (`a42cdn.usablenet.com`; `body.usable-net-js`) |
| Payments/other | Klarna, reCAPTCHA v3, Criteo, DoubleClick, Rakuten, SFMC |

### 9.2 Weight and timing

`MEASURED`, desktop, warm cache except where noted:

| Metric | PLP (men's jeans, 1440px) | PDP (775px) |
| :--- | ---: | ---: |
| TTFB | 501 ms | 683 ms |
| DOMContentLoaded | 1,546 ms | 1,469 ms |
| **Load event** | **4,810 ms** | **6,233 ms** |
| HTML decoded | **2.91 MB** | 639 KB |
| HTML transferred (gzip) | 109 KB | 66 KB |
| Total resources | 295 | **305** |
| **Total transfer** | 838 KB | **3.72 MB** |
| Images transferred | 340 KB | **3.37 MB** |
| Script resources | 74 | **134** |
| **Script decoded** | — | **3.31 MB** |

Raw HTTP fetches of category pages: **2.1–3.5 MB of HTML** per page, served in 0.6–1.5 s.

**Image format:** Scene7 content-negotiates — a PLP hero requested without an extension
returned `content-type: image/webp` at **62,858 bytes**. Good. No AVIF observed.

### 9.3 What is actually wrong here

Three specific, avoidable costs, all of which we can design out:

1. **2.9 MB of HTML for 36 products.** The document contains **136 inline `<script>`
   blocks** (~90 KB) — one analytics capture call *per product tile* — plus the five
   redundant `<picture><source>` declarations per image, plus the entire nine-group facet
   list **rendered twice** (once for the desktop panel, once for the mobile drawer; 18
   facet blocks where 9 exist). Gzip hides this from a network waterfall but not from the
   parser, and parsing is where mid-range Android pays.

2. **3.31 MB of decoded JavaScript on the PDP.** Against our contractual **≤180 KB
   compressed** initial-JS budget, that is roughly an order of magnitude beyond. It is
   accumulated third-party tags, not application code.

3. **3.37 MB of images on a single PDP.** The page eagerly loads galleries for all 11
   colourways rather than the selected one.

`INFERENCE` — none of this is a platform limitation. It is what happens when tag
management, personalisation, outfitting and recommendation vendors each add a script and
nobody holds a budget. Our §10 budgets exist precisely to prevent this, and they are only
enforceable if they are in CI from the first commit.

---

## 10. Accessibility

Mixed, and the pattern of what is right versus wrong is instructive.

### 10.1 What is done well

- **Facet counts have `sr-only` companions**: *"Refine by Fit: Athletic (1 Items)"* —
  grammar aside, the information reaches a screen reader.
- **Applied-filter chips announce both dimension and value** on their remove control.
- **Colour swatches use a correct `radiogroup` / `radio` / `aria-checked` pattern.**
- **Facet groups are wrapped in `<fieldset>`** with `aria-labelledby` to the group header.
- **Alt text is systematic and genuinely descriptive** (§7.1) — product, colourway, view.
- **The size chart is a real table**, not an image.
- **Unavailable variants are marked rather than hidden.**
- **Pagination is a real link** — the catalogue is navigable without JavaScript.
- **Contrast passes everywhere measured** (§4).

### 10.2 What is broken

**1. There is no designed focus indicator.** `MEASURED`: of 14 CSS rules matching
`:focus` with an outline/shadow, **every one belongs to Bootstrap validation states or the
Adyen checkout SDK.** There is no first-party focus style. Worse:

```css
[tabindex="-1"]:focus { outline: 0 !important; }
button:focus        { outline: -webkit-focus-ring-color auto 5px; }  /* UA default only */
```

Measured on a focused primary navigation link: `outline-style: none`. **The main
navigation has no visible focus indicator.** That is a **WCAG 2.4.7 (AA)** failure on the
site's most-used control. (Our own §13a note — that the specified L&B focus ring fails at
2.18:1 and `:focus` appears in 0 of 48 design files — describes the same disease at an
earlier stage.)

**2. The filter controls have a role conflict.** Each facet value is an `<a role="checkbox"
aria-checked="…" tabindex="-1">` wrapping a `<button role="presentation">`. `MEASURED`
in the live DOM: the inner button **is** focusable (tabindex 0; 106 tabbable controls in
the panel), so **filters are keyboard-reachable** — the static markup is misleading on
this point. But the element that receives focus has its role stripped to `presentation`,
while the checkbox role and the `aria-checked` state live on its **non-focusable** parent.
A screen-reader user therefore tabs to a control with no announced role and no announced
checked state. `role="presentation"` on a focusable element is invalid per ARIA.

**3. The heading outline is destroyed.** `MEASURED` on the PDP: **2 `<h1>` elements and
258 `<h2>` elements.** The cause is the mega-menu, which wraps every navigation link in an
`<h2>`. On the PLP, `main` contains exactly **one** heading (`h1: Men's Jeans`) — the 36
product names are not headings at all. Heading navigation, the primary way screen-reader
users skim, is useless in both directions: 258 meaningless landmarks in the chrome, one
in the content.

**4. Accordion headers are `<div tabindex="0" role="button">`**, not buttons.

**5. The auto-advancing promo carousel has no pause control** — **WCAG 2.2.2 (Level A)**.

**6. Zero first-party reduced-motion support** (§8).

**7. An accessibility overlay is shipped instead of fixes.** The site loads UsableNet and
offers an "Enable Accessibility" link as the first focusable element on the page.
`INFERENCE` — this is the tell. An overlay is what a team buys when the underlying markup
has the problems catalogued above. It does not fix a stripped focus outline or a
258-`<h2>` outline; it layers a second interface over them. Overlays are widely criticised
by disability advocates for exactly this reason.

**For L&B: the overlay is the anti-pattern. Our §8 non-negotiables are the alternative,
and this site is the argument for why they must be met in the markup rather than bought
as a widget.**

---

## 11. Content-integrity observations

Two findings relevant to our §12 discipline, offered as cautions rather than criticism:

1. **Analytics payloads drift from product truth.** `MEASURED`: the `data-ga4gtmdata`
   attribute on the first men's jeans tile — repeated on two separate nodes within the
   same tile — describes a **boys' 4–7 jean** (`item_category: WRG_KIDS_BOYS`, a different
   SKU, different fit, different rise, different fabric) while the tile renders an adult
   Cowboy Cut slim jean. The correct payload appears on a third node. Product facts
   duplicated into an analytics layer will diverge from the product record, and nothing
   surfaces the divergence. **One source of truth, projected — never copied.**

2. **A malformed permalink value** is emitted on every PLP
   (`?https%3A%2F%2Fwww.wrangler.com%2Fshop%2Fmen-jeans=undefined&start=0&sz=36`) — a
   template variable that never resolved, shipped to production and invisible because
   nothing reads it.

---

# What Frontier House should take

Ordered by how much they change what we build.

## A. Structural decisions

**A1. Stop treating D-04 as a single choice.** Wrangler runs product-type, audience and
use-case indexes concurrently over one catalogue and lets them overlap. The decision we
actually owe the owner is narrower and answerable: **what is the canonical URL of a
product?** Everything else — Women / Plus / Girls / Accessories & Home / Wholesale, the
Four Worlds, a use-case index — becomes a curated entry surface that resolves to that
canonical URL. This unblocks Phase 1 routing without pre-empting the owner's taxonomy call.

**A2. Adopt the fit-family layer, and make it our answer to the plus-size question.** A
row of photographed tiles above the grid, each a plain `<a href>` to a pre-built filter
URL, each carrying one plain-language sentence defining the fit. It is the highest-value,
lowest-risk mechanism on the site: server-rendered, no-JS-safe, editorially controlled,
and it lets an editorial label span several data values (their "Relaxed" = `Relaxed OR
Loose`). This is also the cleanest expression of *"Plus is a filter and a fit story, never
a separate catalog"* (§11) — **Plus becomes a fit-family tile with a fit story, sitting in
the same row as every other fit, resolving to the same grid.**

**A3. Facet URLs use named parameters, decided now.** `?leg=bootcut&rise=high`, not
positional `prefn1/prefv1`. Order-independent, human-readable, decoupled from PIM
attribute names, no renumbering on removal. Free to do on day one; expensive to retrofit.

**A4. Copy the Load-more pattern verbatim in shape.** A real `<a href="?page=2">`
progressively enhanced into an AJAX append, with a live "36 of 131" progress line. It
satisfies CI Test 1 by construction and never hijacks scroll.

**A5. Every facet is a closed enumeration, validated at ingest.** The 337-shirt Fit facet
— eight fits plus ten graphic-tee themes plus a singular/plural duplicate — is what an
open text attribute becomes at scale. A merchandiser must not be able to introduce a new
fit value by typing one.

**A6. Suppress single-value facets; add a coarse facet as breadth grows.** Their rule,
and it is correct: at 770 products ask "what kind of thing" first; at 30, do not ask at
all.

**A7. Filter round-trips return counts, not markup.** Their 950 ms / 1.31 MB HTML partial
is the wrong trade for our ≤150 ms INP budget — but the thing they buy with it,
**server-recomputed counts on every remaining facet**, is non-negotiable. Return JSON
(ids + counts), render locally.

## B. Product data model — the real lesson

**B1. Every fit dimension is expressed twice: a filterable category and a measured
number.** Rise = `High` *and* `11"`. Leg = `Tapered` *and* `16 1/2"`. The category filters
and scans; the measurement decides. This is the single best idea on their PDP.

**B2. Do not let the data model outrun the facet set.** Their `color_family`, `fabric` and
`leg_opening` are clean, normalised, filter-ready, and shipped only to Google Analytics.
Make the join an explicit, reviewed artefact: **a table mapping every product attribute to
either "is a facet", "is PDP-only", or "is internal", with no unassigned rows.** Review it
whenever the schema changes. This is the cheapest possible defence against the most
expensive silent failure.

**B3. Alt text is generated, never authored.** `{product} in {colourway} — {view role}
{index}`. Systematic, correct, and it satisfies §8.5 for free.

**B4. Size chart is a real table with measuring instructions.** They do this; our current
live site ships a single JPEG. This is §8.4 and it is not optional.

**B5. Mark unavailable variants; never hide them.**

## C. Visual and motion

**C1. Achromatic chrome, one accent, colour from the garment.** Proven at 770 products.
Reserve exactly one brand colour for the primary commerce action.

**C2. Price typographically subordinate to product name.** Theirs is 13 px against a 16 px
name. This is aesthetically right *and* it means a card degrades gracefully when price is
**absent** for unauthorised sessions — which is our §11 requirement, not merely a hidden
field.

**C3. Ship a design-token layer.** Their 68 CSS variables are 100% third-party defaults,
which is why campaign colour ends up as inline hex on individual labels. Tokens are how
merchandiser-authored content stays on-brand.

**C4. The grid needs no motion.** Zero running animations on a 131-product PLP. Our
cinema belongs on discovery surfaces; the catalogue should be still.

**C5. `object-fit: cover`, never `fill`.** They stretch. On garment photography a shopper
will see it.

## D. Accessibility — treat this site as the counter-example

**D1. Design the focus ring before anything else.** Their main nav resolves to
`outline-style: none`, and their only `:focus` rules are vendor defaults. Ours is already
specified wrong (2.18:1); §13a gives us Tobacco Leather `#734F36` at 6.49:1. **Put it in
the token layer and assert its computed contrast in CI.**

**D2. The focusable element carries the role and the state.** Their filter puts
`role="checkbox"` + `aria-checked` on a `tabindex="-1"` anchor and focus on a
`role="presentation"` button inside it. Use a real `<input type="checkbox">` with a
`<label>`, or a `<button role="checkbox" aria-checked>` that is itself focusable. Nothing
in between.

**D3. Reserve headings for content.** Their nav emits 258 `<h2>`s and their PLP `main`
contains one heading. Navigation links are links. Product names on a grid are headings.

**D4. No overlay.** They ship UsableNet as the first focusable element on the page. That
is the visible symptom of the four failures above. Our §8 list is the alternative.

**D5. Auto-advancing content gets a pause control** (WCAG 2.2.2, Level A). Their promo bar
does not have one.

**D6. Budget first-party reduced-motion work explicitly.** All 14 of their
`prefers-reduced-motion` blocks came free with vendors and none covers the one thing that
actually moves.

## E. SEO and the permission boundary

**E1. Three-layer facet defence, adopted wholesale:** `robots.txt` disallow on facet
params + `noindex` on filtered pages + `canonical` to the unfiltered category. **Fix their
two gaps:** cover *all* facet parameters (theirs stops at `prefn4`), and **do not disallow
pagination URLs** (theirs blocks `sz=`, orphaning everything past position 36).

**E2. Ship Product structured data — they do not.** And build it from the **public
projection only**. Structured data is named explicitly in §11 as a place restricted
wholesale pricing must never appear; the JSON-LD builder must take the unauthorised type,
which has no wholesale field to omit.

**E3. Project, never copy, product facts.** Their analytics attribute describes a
different product from the tile it sits on, in two places. One source of truth.

---

# Proposed facet taxonomy for L&B

Concrete and opinionated, per the brief. Facets are grouped by **whether we can build them
today**.

## Denim

| # | Facet | Values | Status |
| :--- | :--- | :--- | :--- |
| 1 | **Fit** (seat & thigh) | Skinny · Slim · Straight · Regular · Relaxed · Loose | **Needs data** |
| 2 | **Leg** (knee to hem) | Skinny · Straight · Tapered · Bootcut · Flare · Wide · Trouser · Barrel | **Needs data** |
| 3 | **Rise** | Low · Mid · High · Super High | **Needs data** |
| 4 | **Wash** | Light · Medium · Dark · Black · White · Coloured · Distressed | **Needs data** |
| 5 | **Stretch** | Rigid · Comfort stretch · Performance stretch | **Needs data** |
| 6 | **Boot relationship** | Sits over a boot · Sits inside a boot · Not boot-specific | **Needs data — and needs a decision** |
| 7 | **Size** (waist or numeric) | full range, one record | Derivable from variants |
| 8 | **Inseam** | full range | Derivable from variants |
| 9 | **Use** | Everyday · Arena / rodeo · Work · Occasion | **Needs data** |
| 10 | Price / pack | wholesale unit, pack, MOQ | **Authorised sessions only** |

**Opinionated calls, with reasons:**

- **Fit and Leg stay separate — non-negotiable.** Western denim is defined by the
  seat-versus-hem relationship. Merging them destroys the category's only meaningful
  distinction. But **the two vocabularies must not overlap**: their "Straight" and
  "Regular" appear in both facets with counts of 1 and 2, which is drift, not meaning.
  Reserve *Regular* for Fit only and *Straight* for Leg only, and enforce it at ingest.

- **Boot relationship is its own facet, not a Leg value.** Wrangler puts *"Fits over
  boot" (16)* inside Leg, next to *Bootcut (20)*, and the two are neither synonyms nor
  alternatives — a bootcut jean is *shaped* to clear a boot; a wide straight leg merely
  *accommodates* one. For a western house this is the single most valuable filter we could
  offer and the one no competitor has got right. It is also the one **most likely to
  require a garment-by-garment judgement call**, because it is a claim about how the jean
  wears, not a measurement. Treat it as a **merchandiser-assigned attribute with a written
  rubric**, not a derived one.

- **Wash is mandatory and is our clearest differentiator.** Wrangler sells 131 pairs of
  jeans and cannot filter by wash. Neither can we, today. A six-to-seven-value normalised
  wash family — the equivalent of their unused `color_family` — is the highest-return
  facet in the denim set.

- **Stretch is a three-value enumeration, never a free-text fabric string.** Wrangler
  encodes stretch only inside prose (`"99% Cotton/1% Elastane"`) and a PDP badge. It is
  unfilterable as a result. Ours ships as an enum from day one.

- **Leg opening and front rise are PDP-only measurements, not facets.** Nobody filters by
  16½ inches. Everybody decides by it. Follow their PDP pattern: category *and* number.

- **Fabric weight in ounces belongs on the PDP** and is a strong material-honesty signal
  (§5) — Wrangler carries it inside the fabric string and never surfaces it as a field.
  Make it a field.

- **Do not build a "Collection" facet yet.** Wrangler's has 19 values on 131 products,
  many with counts of 1–3. It is a sub-brand and licensing artefact. We have no evidenced
  equivalent, and building one invites the invented-collection problem §12 forbids.

## Shirts

| # | Facet | Values | Status |
| :--- | :--- | :--- | :--- |
| 1 | **Closure** | **Snap · Button · Pullover / no placket** | **Needs data — highest priority** |
| 2 | **Fit** | Slim · Classic · Relaxed · Oversized | **Needs data** |
| 3 | **Sleeve** | Short · Long · Sleeveless · 3/4 | **Needs data** |
| 4 | **Fabric** | Denim · Chambray · Twill · Poplin / broadcloth · Flannel · Knit · Satin · Corduroy | **Needs data** |
| 5 | **Pattern** | Solid · Plaid · Stripe · Print · Embroidered · Aztec / woven motif | **Needs data** |
| 6 | **Yoke** | **Western (front & back) · Western (back only) · Plain** | **Needs data** |
| 7 | **Detail** | Pearl snaps · Smile pockets · Fringe · Piping · Contrast stitch · Embroidery | **Needs data** |
| 8 | **Size** | full range, one record | Derivable |
| 9 | **Use** | Everyday · Arena / rodeo · Occasion · Work | **Needs data** |

**Opinionated calls:**

- **Closure is the first facet, above Fit.** Wrangler's Style facet carries both
  *Snap-Front (38)* and *Western Snaps (32)* as separate near-duplicate values alongside
  *Button-Downs (54)* — three values expressing two concepts. Collapse it: closure is a
  binary-plus-one (snap / button / neither), it is the most western-specific attribute a
  shirt has, and a customer who wants pearl snaps wants **only** pearl snaps.

- **Yoke is a facet, and this is where we can genuinely lead.** Wrangler carries
  *"Authentic Western Back Yoke"* as a structured PDP field on every snap shirt and offers
  **no way to filter by it** across 337 shirts. The western yoke is the defining visual
  element of the category. Three values are enough.

- **Fabric is a facet for shirts even though it is PDP-only for denim.** Shirt shoppers
  choose by hand-feel and season — flannel in October, chambray in June — in a way denim
  shoppers do not.

- **Pattern must include a motif value.** Wrangler's Pattern facet is *Plaid / Print /
  Solid / Stripe* with counts of 1–4 on 337 shirts — the attribute is populated on barely
  1% of the catalogue and is therefore useless. **A facet populated on 1% of records is
  worse than no facet**: it silently discards 99% of the catalogue when applied. Any facet
  we ship must be **mandatory at ingest** or must not ship.

- **"Detail" is a multi-select feature facet, modelled on their `PRODUCT_FEATURES_WRG`** —
  but with a closed list. Theirs contains *"Engineered to move with you"*, which is a
  slogan, not an attribute. **A facet value that reads like marketing copy is a schema
  failure.**

## Cross-catalogue

- **Availability / pre-order state** — §11 makes pre-order a first-class state.
- **Pack structure and MOQ progress** — authorised sessions only.
- **New / drop date** — supports the daily-drop model.
- **Never a "Sale" facet built from a price pattern in a slug.** This is the D-00 failure
  and the slug-purity CI test exists to prevent it.

## What we cannot build yet — the honest list

Every facet marked "Needs data" above requires **structured product attributes that do not
exist**. Per §15 and the readiness register, there are zero production assets: no product
data, no size tables, no photography.

Ranked by cost to acquire:

| Tier | Attributes | Why |
| :--- | :--- | :--- |
| **Derivable from a variant table** | Size, inseam, availability, pack, price | Falls out of the commerce data we need regardless |
| **One-time merchandiser pass, mechanical** | Fit, Leg, Rise, Sleeve, Closure, Pattern, Fabric, Stretch | Judgement-light; a spreadsheet per style |
| **One-time merchandiser pass, judgement + rubric** | **Boot relationship**, **Yoke**, Use, Detail | Needs a written definition before anyone tags a garment, or it drifts exactly as their Fit facet did |
| **Requires measurement** | Front rise, leg opening, fabric weight (oz) | PDP-only, but needs a tape measure and a spec sheet per style |
| **Blocked on owner decision** | Any wholesale price/pack facet (D-01), taxonomy roots (D-04/03/05) | §15 |

**The critical path is unchanged and this teardown confirms it: the constraint is product
data and photography, not front-end work.** Wrangler's most valuable mechanisms — the fit
families, the two-axis fit/leg split, category-plus-measurement on the PDP — are all
*data* mechanisms wearing a thin front-end. We can build the front-end for all of them in
Phase 1. We cannot populate any of them without an owner-supplied attribute pass.

**One recommendation follows directly.** Before any merchandiser tags a single garment,
write the **facet rubric** — the closed value list for every facet, with a one-sentence
definition per value and a worked example. Wrangler's 337-shirt Fit facet, their duplicate
`Logo & Slogan` / `Logo & Slogans`, and their `Straight` appearing in two facets are all
the same failure: **tagging began before the vocabulary was closed.** That document costs
a day and it is the difference between a filter system that works at 235 styles and one
that quietly stops meaning anything at 400.
