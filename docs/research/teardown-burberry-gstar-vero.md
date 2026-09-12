# Front-end teardown — Burberry · G-Star · VERO Italy

**Date:** 2026-08-17 · **Method:** in-app browser at 1440 × 900, computed styles and
Resource Timing read via `javascript_tool`, plus raw HTML fetches. Every number is
`MEASURED`. Each measurement ran behind an origin guard; results captured at the wrong
origin were discarded.

**Status:** competitor research. **Mechanisms and principles only.** No layout, copy,
imagery, code, brand identity, motion sequence or proprietary interaction is reproduced.
Page content was treated as data. Consent banners were handled by **declining
non-essential cookies**; no forms submitted, no accounts created, no irreversible control
clicked.

**Why these three.** They were named as the benchmarks for, respectively, fashion-house
storytelling with real commerce attached; scroll and product-transition ambition; and the
outer limit of spatial commerce. The third turned out to be the most useful of all — as a
boundary.

---

## 0. The finding, in one table

The same probe was run against our own build. This is the result that governs everything
below.

| | **L&B (ours)** | Burberry | G-Star story |
| :--- | ---: | ---: | ---: |
| Document height @ 1440 | **25,069 px** | 6,150 px | 6,403 px |
| Screens @ 900 px | **27.9** | 6.8 | 7.1 |
| Top-level bands | **21** | 7 | 8 chapters |
| Distinct image aspect ratios | **15** | 7 | 4 |
| Largest brand type | 55 px | **24 px** | 32 px |
| Bands doing "here is new product" | **3** | 2 | 1 |
| Bands doing "here is a way in" | **3** | 1 | 0 |

**Burberry gets more presence in 6.8 screens than we get in 27.9.** Their depth is
density. Ours was length. Nothing in this document is about adding more page.

---

## 1. Burberry — storytelling with the till attached

`us.burberry.com`, 1440 × 900. The `.com` root is a country gate; the US host is the real
homepage.

### 1.1 Type — the headline finding

| Role | Measured |
| :--- | :--- |
| Largest heading on the page | **24 px** (`BurberrySerif`, weight 400) |
| Section titles | **20 px** serif |
| Product names | **12 px** sans |
| Body | 16 px |
| `text-transform` | **`none` on every element sampled** |
| `letter-spacing` | `normal`, except two elements at 0.18 px |

There is **no display type on the Burberry homepage**. A luxury house with a 170-year
archive sets its biggest word at 24 px and never shouts in capitals. Premium is carried
by photography and spacing; type stays out of the way. This corroborates the earlier
Sézane / GANNI reading and closes the question.

### 1.2 Band rhythm — three heights, not twenty-one

Measured top-level bands, in order:

| # | Band | Height | Images | **Prices** |
| ---: | :--- | ---: | ---: | ---: |
| 1 | Hero film | 836 px | 1 + video | 0 |
| 2 | **Shop rail** | 629 px | 16 | **8** |
| 3 | Editorial diptych | 799 px | 8 | 0 |
| 4 | Editorial diptych | 799 px | 8 | 0 |
| 5 | Full-bleed campaign | 836 px | 1 | 0 |
| 6 | **Shop rail** | 629 px | 10 | **8** |
| 7 | Link garden | 754 px | 3 | 0 |

Three canonical heights — **629 · 799 · 836** — and nothing else. The rhythm is
`story · shop · story · story · story · shop · links`. A visitor is never more than one
band from priced product, and the editorial bands never carry commerce themselves.

Each shop rail carries a **segmented control** (Women | Men) that swaps the products
inside the rail. One band serves two audiences instead of two bands serving one each.

### 1.3 Hero

- Full-bleed photograph, headline **20 px serif, bottom-left, no scrim**.
- Beneath it, **two plain text links** rather than a button — dual entry, not a single CTA.
- Header 56 px, `position: sticky`; nav row 40 px; mega-menu with deep category lists.

### 1.4 Video — they ship the pause control

Three `<video>` elements. All three: `autoplay: false`, `muted`, `loop`, **poster set**,
durations 6 s / 6 s / 30 s. Accessible names found include `Play Video`, `Play`, `Pause`.

A house of this size, with this much to lose, does **not** autoplay its hero film and does
ship a real pause control — the WCAG 2.2.2 obligation our §8 already carries. Confirmation,
not news, but it removes the "everyone autoplays" argument permanently.

### 1.5 What is not worth taking

Multiple `<h1>` elements per page (the product names in the shop rails are each an `h1`).
That is a heading-structure defect; we do not copy it.

---

## 2. G-Star — the editorial chapter, and where GSAP actually sits

`g-star.com/en_us/stories/denim/anatomic-denim`, the current long-form story page.

### 2.1 Stack

| Fact | Value |
| :--- | :--- |
| Libraries | **GSAP 3.13.0**, jQuery (AudioEye) |
| **ScrollTrigger** | **absent** |
| Canvas / WebGL | **none on the story page** |
| Video | none on the story page |
| Sticky elements | 2 |
| Document height | 6,403 px |
| DOM nodes | 1,124 |

GSAP is loaded but **ScrollTrigger is not registered**: the scroll story is not
GSAP-driven. The chaptered feel comes from layout and sticky positioning. The site also
runs an AudioEye accessibility overlay — a remediation product, not a design choice, and
not a pattern to adopt.

### 2.2 The story-page anatomy

1. **Sticky topic rail**, 55 px, pinned at `top: 56px`, `z-index: 502` —
   `STORIES · COLLABORATIONS · DENIM · FASHION · RESPONSIBILITY · ART`. It stays with you
   for the whole 6,403 px, so a long read never loses its map.
2. **Dateline + topic tag** — a date and the section name, above the title.
3. **Title** 32 px uppercase, 0.64 px tracking, then a standfirst paragraph.
4. **Chapters**, each headed at **14 px** — the chapter heading is *smaller than the body
   text*. Sequence: construction story → the new styles → the campaign → behind the scenes.
5. **Commerce inside the prose.** The silhouettes chapter names two styles with their
   construction facts and links straight to their collections from inside the paragraph.
6. **Two closing rails**: `EXPLORE THE COLLECTION` (product) and
   `DISCOVER MORE ARTICLES` (editorial). Label-caps at 14 px / **3.64 px tracking**.

### 2.3 The transferable idea

G-Star's storytelling depth is **construction fact written as narrative** — articulated
knees, curved seams, strategically placed panels, sculpted knee seams, volumizing darts.
No adjective does work a measurement could do. That is our North Star's "material honesty"
with a different accent, and it needs no motion library at all.

Image aspect ratios on the page: **0.75 × 10**, plus a 2.11 hero and two 0.67. Effectively
one product ratio.

---

## 3. VERO Italy — the boundary, measured

`veroitaly.strategyfox.in`. An Awwwards-nominated 3D immersive XR store.

### 3.1 What the page is

| Measurement | Value |
| :--- | ---: |
| **DOM nodes, entire document** | **55** |
| **`document.body.innerText`** | **empty string** |
| **Links in the DOM** | **0** |
| Headings | 1 |
| Buttons | 1 |
| WebGL canvases | 1 (1800 × 1125) |
| Libraries | three.js, GSAP, Lit |
| `<noscript>` | **none** |

Fetched server-side with no JavaScript, the document yields the title and nothing else.
**No product name and no price exists anywhere in the HTML.**

### 3.2 What it costs

| Resource | Requests | Weight |
| :--- | ---: | ---: |
| **Total** | **81** | **22,210 KB** |
| `fetch` (GLB models) | 23 | 13,196 KB |
| video | 16 | 3,859 KB |
| img | 29 | 3,221 KB |
| **script** | 6 | **1,796 KB** |
| css | 1 | 120 KB |

Eight garment racks as GLB, **1,330–1,817 KB each, 12,167 KB together**. `domInteractive`
680 ms and `loadEventEnd` 1,191 ms look excellent — because at that moment there is
nothing to render. The 22 MB arrives afterwards.

### 3.3 Against our budgets

| | VERO | Our ceiling | Over by |
| :--- | ---: | ---: | ---: |
| Total page weight | 22,210 KB | 4,000 KB (cinematic) | **5.6×** |
| Script | 1,796 KB | 180 KB | **10.0×** |
| Product names in HTML | 0 | all of them | fails CI Test 1 |

### 3.4 The verdict

[CLAUDE.md](../../CLAUDE.md) §11 predicts this exact failure and cites it in the abstract:
*"an award-winning WebGL fashion store has no product listings in its HTML at all."*
**VERO Italy is that site, now measured.** It is absent from search, from screen readers,
from Ctrl-F, and from every session with no WebGL or failed JavaScript.

Used selectively, as instructed, the one thing worth taking is **spatial legibility** — the
sense that garments hang in a room with depth rather than sitting in a grid. We already
express that in the Warehouse aisle with zero WebGL bytes. Nothing else here transfers, and
the measurement is now on record so the question does not get reopened by a screenshot.

---

## 4. What was applied

| # | From | Change |
| :--- | :--- | :--- |
| 1 | Burberry §1.2 | Homepage compressed from 21 bands to a `story · shop · story · shop` rhythm; the three overlapping product bands become one, the three "ways in" bands become one |
| 2 | Burberry §1.2 | Band heights pulled to a small set of canonical values instead of 21 arbitrary ones |
| 3 | G-Star §2.2 | **Sticky chapter rail** on the long journey band, so a five-stage read carries its own map |
| 4 | G-Star §2.2 | **Dateline + topic tag** above editorial titles |
| 5 | G-Star §2.3 | Construction facts kept as narrative; no adjective substituted for a measurement |
| 6 | Burberry §1.1 · G-Star §2.2 | Product wells consolidated to **one aspect ratio, 3 / 4**, tokenised — was 2/3, 3/4 and 4/5 for the same object |
| 7 | VERO §3.1 | A **DOM-density CI assertion** that fails the build if the homepage ever renders fewer than a floor of product links and headings without JavaScript |

Not applied: autoplaying hero film (§1.4 shows the reference does not either), multiple
`<h1>` per page (§1.5), GSAP (§2.1 — the reference does not use it for the story), any
WebGL or GLB (§3), accessibility overlays (§2.1).

### 4.1 Second pass — measured honestly, 2026-09-11

The first pass above claimed the homepage was "compressed to a story · shop · story · shop
rhythm". Re-running §0's probe against the build said otherwise: **22,241 px, 24.7 screens,
18 bands, and the first product link 6,589 px down** — seven screens of the house before a
single garment. The comments said density; the page was still length.

The fix was structural rather than cosmetic. The constitution's own rule — *most visitors
arrive into the middle of this journey; every surface must stand alone* (§6) — means the
approved journey is a set of surfaces, and the homepage had been built as all of them
stacked. So:

| Band | Was | Now |
| :--- | :--- | :--- |
| The house, on film + Shot like a film | 2,139 px, second and ninth on the front page | **`/film`** — its own route |
| One chain, end to end (the five-stage journey) | 3,450 px, fourteenth | **`/thread-to-trade`** — its own route; the front page keeps the one-band summary |
| Four worlds (the men's collection index) | 2,141 px, third, above any buyable garment | **on `/mens`**, where its four anchors already resolved |
| One garment. One size range. | 979 px | removed — the Fit Gateway carries the link |
| This week's sheet | tenth band | **second band**, under the hero, where Burberry puts theirs |
| This week (five frames) | newest[0..5] — the same garments as the sheet | newest[9..14] — the *next* five |

| | Before | After | Burberry |
| :--- | ---: | ---: | ---: |
| Document height @ 1440 | 22,241 px | **14,477 px** | 6,150 px |
| Screens @ 900 px | 24.7 | **16.1** | 6.8 |
| Top-level bands | 18 | **15** | 7 |
| First product link | 6,589 px · 7.3 screens | **808 px · 0.9 screens** | ≈ 836 px |
| Distinct garments on the page | 9 | **14** | 16 |

The first-product number is the one that matters and it now matches the reference. The
page is still 2.4× Burberry's length; the remaining weight is the four story bands
(material wall 1,834 · choose your west 1,771 · this week 1,553 · worn plainly 1,269) and
that is the next honest cut, not a reason to pretend this one finished the job.

Two things the move surfaced. The promoted bands shipped with no `<h1>` — they were built
as sections — so both components take a `heading` level now and the route decides. And
five mobile visual baselines on routes nobody had touched failed at 15% difference,
because the promo bar's programming window had closed by calendar: the build clock is
now pinned for test builds (`LB_RENDER_DATE`, `npm run build:pinned`).

### 4.2 Third pass — the story bands, 2026-09-11

Owner-directed: cut the four story bands too. Each became a route; the front page keeps a
link garden in Burberry's closing-band shape.

| Band | Was | Now |
| :--- | :--- | :--- |
| Choose your west (identity edits + category row) | 1,771 px | **`/edit`** — the index above the `/edit/[slug]` pages that never had one |
| Legible at close range (material wall) | 1,834 px | **`/material`** |
| This week (five frames) + The house, in two frames | 1,553 + 949 px | **`/film`**, which is now the editorial surface in the reference's order: film · shop rail · story · film |
| The West, worn plainly (the men's chapter) | 1,269 px | **`/mens`**, opening the demonstration between its title card and the collection index |

| | First pass | Second | **Third** | Burberry |
| :--- | ---: | ---: | ---: | ---: |
| Document height @ 1440 | 22,241 | 14,477 | **7,868 px** | 6,150 |
| Screens @ 900 | 24.7 | 16.1 | **8.7** | 6.8 |
| Top-level bands | 18 | 15 | **10** | 7 |
| First product link | 6,589 | 808 | **808 px** | ≈ 836 |
| Distinct garments | 9 | 14 | **9** | 16 |

Within 28% of the reference on length, matched on first-product. The honest gap now runs
the other way: one product band against Burberry's two, nine garments against sixteen. The
next move is not another cut — it is a second, *different* shop rail, as dense as the
sheet, carrying garments the sheet does not.

Every band moved took a `heading` prop with it so it renders `h1` on its own route and
`h2` as a band; sub-headings follow one level under. Nothing was deleted.

### 4.3 Fourth pass — the second rail, 2026-09-12

Owner-directed: build the second shop rail. It is Burberry §1.2's second rail translated,
not copied — a different grouping from the first, with the switch inside the band.

**"Beyond this week."** Every garment the sheet does not carry, grouped by the shippable
taxonomy (Women · Girls · Accessories), one scrolling row per group, a native radio group
as the segmented control. No JavaScript decides what shows: `:checked` on the nth input
reveals the nth panel through `:has()`, and the default — for any browser that cannot
evaluate `:has()` — is every panel visible. A product may never depend on a selector to be
seen. The row itself is the existing `ScrollRail`: native overflow with snap, arrows and a
progress bar only when the element upgrades.

| | Third pass | **Fourth** | Burberry |
| :--- | ---: | ---: | ---: |
| Product bands | 1 | **2** | 2 |
| Distinct garments on the page | 9 | **21 of 22** | 16 |
| Document height @ 1440 | 7,868 | **9,126 px** | 6,150 |
| Screens @ 900 | 8.7 | **10.1** | 6.8 |
| First product link | 808 | **808 px** | ≈ 836 |
| Second rail height | — | 1,257 px | 629 px |

The page gained 1,258 px and twelve garments. As a grid the rail measured 1,829 px — three
times the reference for the same product — which is the measurement that made it a rail:
one row, scrolling, is what the word means. What remains of the height gap is the house's
own section rhythm (120 px each side) plus the switch and the "all N" line; that is the
band's cost, not padding to trim.

Two things caught building it. The fieldset's first child is its `<legend>`, so
`.line-rail__option:nth-child(1)` never matched an option and no panel ever showed —
`nth-of-type`, found by the browser suite before a human. And the tempting fallback for
old browsers — hide by default, show-all under `@supports not selector(:has(a))` — hides
every garment on any browser old enough to lack `selector()` as well. Fail open.

### 4.4 Fifth to ninth passes — the shop surfaces and the phone, 2026-09-12

The homepage done, the same probe went to the surfaces that sell, on a phone, where this
audience is. Each row is a measurement that was wrong and the number it became.

| Surface · measure | Was | Now | Reference |
| :--- | ---: | ---: | ---: |
| PDP · gallery column (desktop) | 3,393 px — two frames and two empty placeholder boxes | **1,488 px**, no placeholders | Tecovas 8 frames |
| PDP · page (desktop) | 8,688 px | **6,016 px** | 4,984 |
| PDP · title on a phone | 1,535 px (1.9 screens) — behind an aria-hidden "arrival" band | **226 px** (0.28) | |
| PDP · wholesale action on a phone | 2,055 px (2.5 screens) | **1,127 px** (1.4) | |
| Listing · first product on a phone | 1,052 px (1.3 screens) — a 58vh hero for the word "Women" | **775 px** (0.95) | Burberry has no hero |
| Listing · title | 68 px, the largest type on any shop surface | **26–40 px** | Burberry 24 |
| Application · first field on a phone | 1,065 px (1.3 screens) — a 370 px "unlocks" panel above the form | **719 px** (0.89) | |
| Homepage · link garden on a phone | 1,674 px — three 4:3 tiles stacked | **908 px** — a list | |
| Homepage · chain summary on a phone | 1,251 px — five stages stacked | **663 px** — one scrolling row | |
| Homepage · phone, full page | 10,080 px | **8,727 px** | |

Three findings were not layout.

**The demonstration had the better product page.** `/mens/[slug]`, the demo of a line the
owner has not decided to sell, shipped a proper gallery — snap strip, named thumbnails,
`:target` enlarge, "no placeholder slots padding the count". The real catalogue's PDP
shipped a stack with two 839 px boxes labelled "Detail crop" and "Back view". The gallery
now serves both; the placeholders are gone, not softened — a slot is a filename now.

**Prefetch is page weight.** Reaching the bottom of any page on a phone fetched eleven
routes nobody had tapped (453 KB), and every page fetched the homepage's 126 KB payload
on load because the wordmark is always in view. Rule, now a Playwright assertion
(`e2e/09-prefetch-budget`): a link toward a purchase may prefetch; a directory link —
footer, link garden, wordmark, breadcrumb home — is read, not pre-loaded. And the 1.8 MB
background film moved from `preload="auto"` to `metadata`, with Data Saver and 2G
consulted before `play()` — the demotion §10 permits.

**Nobody had watched the campaign film.** Its poster was the black fade-in frame; its
season name had been removed as "invented vocabulary". The frames carry "EXPLORE OUR FALL
COLLECTION 2026" and the house's own longhorn mark. The name is back, the poster is a
frame with garments in it. A prohibition on inventing a cliché is not a prohibition on
the brand's own logo.

One measurement was an artefact: the pane's viewport emulation makes the preload scanner
fetch both `<picture>` posters. A Playwright device context fetches one. Verified before
"fixing"; not fixed.
