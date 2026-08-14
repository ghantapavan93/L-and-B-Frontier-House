# Front-end teardown — Miss Me & Rock & Roll Denim

**Date:** 2026-08-13 · **Method:** in-app browser, computed styles via `javascript_tool`,
desktop viewport 1440 × 900 unless stated · **Status:** `MEASURED` unless marked
`INFERRED`.

**Why these two.** Both sell women's western/contemporary denim at a price tier adjacent to
L&B's implied retail ($20–$85). Miss Me's observed retail runs **$82–$149**; Rock & Roll's
observed retail is **$82.99** on the tested style. That is one tier above L&B's implied
ceiling but far closer than any luxury reference — see §C.3 for the calibration note.

**Scope rules honoured.** Mechanisms and measurements only. No layout, copy, imagery,
motion sequence or proprietary interaction is transcribed for reuse. Category and facet
labels are recorded as *functional taxonomy evidence* — they are the object of the study,
not text to copy. Both sites' consent banners were handled by declining non-essential
cookies. No forms submitted, no accounts created, no irreversible controls clicked.

**Agent-directed content:** none found on either domain. Miss Me serves an accessibility
overlay widget that injects the string `Press Alt+1 for screen-reader mode, Alt+0 to
cancel` into `document.body.innerText`. That is a user-facing instruction from a
third-party widget, not an instruction to an agent, and it was not acted on.

**Tooling caveat.** The shared browser pane repeatedly reassigned tab IDs to unrelated
domains mid-session. Every measurement below was taken behind an origin guard
(`if (!/rockandrolldenim/.test(location.href)) return WRONG_SITE`) and any result captured
at the wrong origin was discarded and re-run. Figures are trustworthy; the session was not
efficient.

---

# PART A — MISS ME (missme.com)

## A.1 Tech stack

| Property | Value |
| :--- | :--- |
| Platform | Shopify, custom theme `miss-me-theme/production` (id 124520202298) |
| Libraries | jQuery **3.5.1**, Swiper. No GSAP, no Lenis, no Locomotive, no React, no three.js |
| Search/merch app | "Frenzy" (`frenzy_*` classes) — owns the PLP grid, filters and sort |
| Other apps | Rivo (loyalty), Gorgias (chat), Pandectes (consent, shadow DOM), an accessibility overlay (`ACCESS-WIDGET-UI`), Yotpo-style reviews (`ss__rating__*`) |
| Total page weight (homepage, settled) | **12,824 KB** across **558 requests** |
| JS | **~2,004 KB** |
| Video | **8,456 KB** across 8 requests — 66% of total weight |
| Images | 1,897 KB / 38 requests |
| CSS | 217 KB / 7 requests |
| TTFB | 156 ms · FCP **712 ms** · DOMContentLoaded 1,073 ms · load 1,686 ms |
| DOM nodes | 4,200 |
| Image formats | jpg 17, png 19, **avif 1**, rest unresolvable. **No WebP.** Shopify CDN `_{width}x` srcset, `sizes` set per slot |

**Read:** fast to first paint, very heavy in total. The weight is video, not craft. Initial
JS alone is **11× our 180 KB budget** and total weight is **3.2× our 4 MB cinematic
ceiling**. This is the Shopify-app-stack tax, and it is exactly what our budgets exist to
refuse.

## A.2 Header, promo bar, nav

| Element | Measurement |
| :--- | :--- |
| Announcement bar | **37 px**, `#000` bg, `#fff` text, 13 px / 300, z-index 401. **Not sticky** — scrolls away |
| Announcement behaviour | Rotating carousel with real `Previous`/`Next` buttons. Three messages observed (shipping threshold, loyalty signup, new-styles) |
| Header | **65 px single row**, `position: sticky`, `top: 0`, z-index 400 (inner `#pageheader` z-4000), bg `#fff` |
| Total sticky chrome | **65 px** (announcement does not stick) |
| Logo | Raster PNG **160 × 35**, left inset 40 px, `alt="Miss Me"` |
| Nav | Absolutely positioned at left 264, width 890. Items 13 px / 400, `#505050`, **sentence case, no letter-spacing**, 32 px inter-item gap, 22 px vertical padding → 62 px hit height |
| Nav items | New Arrivals · Denim · Clothing · Best Sellers · Accessories · Sale · Discover |
| Mobile nav tree | Separate DOM tree at 17 px / 500 `#212121`, with an extra `Collections` item and `Sale` in red `#B61D0F` |

**Mega-menu (Denim), measured open:**

- Panel **1350 × 344**, positioned `top: 102` (directly under the 37 + 65 stack), left 37.
- Padding `32px 0 12px`. Flex, **5 columns × 270 px**.
- Column heads **14 px / 600, uppercase, `#222222`**.
- Three link columns + **two 240 × 176 image tiles** with captioned links.
- Image tiles carry `alt=""` — correct here, since the caption is itself the link.

Columns:

| Column | Members |
| :--- | :--- |
| **SHOP BY FIT** | All Denim · Bootcut · Baggy & Wide · Shorts · Skinny · Capris · Straight · Flare · Jorts |
| **SHOP BY RISE** | Low Rise · Mid Rise · High Rise |
| **FEATURED** | Light Wash · Medium Wash · Stitched · Embellished · Classic Denim · Wings · Cross · Dark Wash · Back in Stock |

**The important structural fact:** fit and rise get named axes. **Wash does not.** Light /
Medium / Dark Wash are dumped into "Featured" alongside embellishment motifs. Wash is
treated as a campaign, not a property — and §A.6 shows the consequence.

## A.3 Typography

Single family throughout: **Inter**. No display face. The script wordmark in the hero is
**baked into the video file**, not DOM text (see §A.4).

| Level | Computed |
| :--- | :--- |
| Body base | Inter 16 px / 25.6 px (1.6), `#565656` on `#fff` |
| Announcement | 13 px / 300, `#fff` |
| Nav | 13 px / 400, `#505050`, sentence case |
| Mega-menu head | 14 px / 600, uppercase, `#222` |
| Section title (`h2.hometitle`) | **25.6 px / 700, uppercase**, lh 35.84, `#212121` |
| Campaign eyebrow | 12.8 px / 700, uppercase, **letter-spacing 3.84 px (0.3 em)**, `#fff` |
| Campaign headline | 30 px / 700, `#fff`, no letter-spacing |
| Product card title | 14 px / 500, `#212121` |
| PLP card title/price | 13 px / 500 and 13 px / 400 |
| PDP h1 | **18 px / 500** |
| CTA | 16 px / 400, uppercase, ls 1.28 px |

**Note the restraint.** The largest type on the entire homepage is **30 px**. The PDP h1 is
18 px — *smaller than the body base*. This corroborates the existing
`lb-reference-teardown-findings` memory: at this tier premium is signalled by media
density, not type scale.

## A.4 Colour

Almost no colour in the interface. The palette is monochrome; the garment supplies all hue.

| Token | Value |
| :--- | :--- |
| Page bg | `#FFFFFF` |
| Body text | `#565656` |
| Emphasis text | `#212121` |
| Announcement | `#000000` / `#FFFFFF` |
| Footer bg | `#F7F7F7` |
| Hairline | `#C2C3C5` |
| Sale accent (mobile nav only) | `#B61D0F` |
| PLP pill border | `#111111` at 0.8 px |

## A.5 CAMPAIGN RHYTHM — the deep read

Nine bands. **Container `#content > .container.cf`**, full-bleed at 1425 px content width
(1440 minus scrollbar). Every band is `padding: 0`, `margin: 0`.

### The band ledger (exact, at 1440 × 900)

| # | Band type | Top | Height | **Gap above** | vh | Carries |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| 0 | video-banner (hero) | 102 | **803** | — | 0.89 | Full-bleed film, AR 1.775 |
| 1 | gallery-columns | 905 | **674** | **0** | 0.75 | 3-up mosaic, fit gateways |
| 2 | featured-collection | 1579 | **601** | **0** | 0.67 | Product row + title |
| 3 | video-banner | 2180 | **631** | **0** | 0.70 | Full-bleed film, AR 2.258, DOM text overlay |
| 4 | gallery-columns | 2811 | **674** | **0** | 0.75 | 3-up mosaic, category gateways |
| 5 | featured-collection | 3486 | **601** | **1** | 0.67 | Product row + title |
| 6 | gallery-columns | 4087 | **724** | **0** | 0.80 | **2-up split**, square halves |
| 7 | collection-product-grid | 4811 | **1671** | **0** | 1.86 | 4 × 3 full-bleed contact sheet |
| 8 | apps (social) | 6482 | **394** | **0** | 0.44 | UGC strip |

Document height **7,304 px** = 8.1 viewports.

### Five mechanisms worth naming

**1. Zero inter-band spacing.** Every gap is 0 (one 1 px rounding artefact). There is no
whitespace, no rule, no colour change between bands. The rhythm is carried **entirely by
band height and by alternating what kind of thing the band is**. Breathing room lives
*inside* bands, never between them.

**2. Heights cluster in a narrow register.** Seven of nine bands sit between **0.67 vh and
0.89 vh**. Nothing is full-viewport — even the hero stops at 0.89 vh, so the next band's
top edge is always visible. Two bands break the register deliberately: the contact-sheet
grid at 1.86 vh (the only band that asks you to stop and browse) and the social strip at
0.44 vh (the only band that reads as a footer note).

**3. The cadence is a strict A-B-A-B-A alternation of atmosphere and merchandise.**

```
FILM → MOSAIC → PRODUCTS → FILM → MOSAIC → PRODUCTS → SPLIT → GRID → SOCIAL
 atm     nav       shop     atm     nav       shop      atm    shop   proof
```

Nothing atmospheric appears twice in a row. A shopper is never more than one band from a
product or a route to one. That is the discipline our §11 demands, achieved by scheduling
rather than by rule.

**4. Mosaic geometry is exact and cheap.**

| Variant | Tiles | Tile size | AR | Gutter | Band height |
| :--- | ---: | :--- | ---: | ---: | ---: |
| 3-up (bands 1, 4) | 3 | **467 × 650** | 0.72 | **12 px** | 674 (= 650 + 12 + 12) |
| 2-up split (band 6) | 2 | **706 × 706** | **1.00** | **12 px** | 724 |

Full-bleed to the viewport edge — no page margin at all. The 3-up uses a portrait 0.72 tile;
the 2-up split uses a **perfect square**. Each tile is one link with one label; there is no
card chrome, no border, no shadow.

**5. Text sits on imagery two different ways, and only one is honest.**

- **Band 3 (good):** eyebrow + headline + CTA are **real DOM elements** over the video —
  `overlay-text__subheading` 12.8 px / 700 with 0.3 em tracking, `overlay-text__title` 30 px
  / 700, both `#fff`, container inset 45 px each side (1335 of 1425).
- **Band 0 (bad):** the hero band contains **one link and zero text nodes**. The headline
  and the quotation-mark styling are **rendered inside the video file**. It is invisible to
  search, to screen readers, to Ctrl-F, and to anyone whose video fails.

Band 0 is a live example of exactly the failure mode our §11 anti-fusion clause exists to
prevent. It did not happen by decision — it happened because the campaign headline was
easier to art-direct in the edit than in CSS.

**Product grid band (7)** is worth its own note: 12 tiles, **4 columns × 356 px with
zero column gap** and zero row gap, images AR 0.667, and the product name + price
**absolutely positioned bottom-left inside the image**, 16 px inset, white, transparent
background. It reads as a contact sheet rather than a grid of cards. Title 15.2 px / 400.

**Social strip (8):** 12 square tiles **228 × 228**, 11 px gutter, heading `#MissMe` at
32 px / 400. Alt text is auto-generated from the post caption
(`Instagram post with the caption: …`) — mechanically correct, editorially meaningless.

### What we already borrowed, assessed

We have taken the **split-campaign** and **social-strip** ideas. Against this measurement:

| Mechanism | Their execution | Our gap |
| :--- | :--- | :--- |
| Split campaign | 2-up, **square** halves, 12 px gutter, full-bleed, one link + one label per half | We should verify our halves are square and our gutter is a single small constant, not a section-level spacing token |
| Social strip | 0.44 vh, 12 squares, 11 px gutter, one heading | Ours should be the *shortest* band on the page. It is a proof band, not a content band |
| **Zero inter-band gaps** | Universal, all 9 bands | **Not borrowed.** This is the single biggest rhythm lever and we have not taken it |
| **Height register (0.67–0.89 vh)** | 7 of 9 bands | **Not borrowed.** Likely our bands vary too freely |
| **Strict atmosphere/merchandise alternation** | Never two atmosphere bands adjacent | **Not borrowed as a rule.** We should encode it as a lint, not a habit |
| 3-up fit-gateway mosaic | 467 × 650 tiles, AR 0.72 | **Not borrowed.** This is the cheapest denim-fit entry point that exists |

## A.6 PLP — `/collections/shop-all-denim`

**160 results.** Title "Denim" at 24 px / 600.

**Two-layer narrowing, and they do not compose:**

1. **Pill sub-nav** above the grid (template suffix `vis-nav-pills`): 9 pills, each 33 px
   tall, `padding: 9px 16px`, **6 px radius**, 0.8 px `#111` border, 13 px uppercase,
   ls 0.26 px, 12 px apart. Members: BOOTCUT · WIDE LEG · SKINNY · SHORTS · LOW RISE ·
   MID RISE · WINGS · STITCHED · CROSS.
   **Each pill is a link to a different collection URL.** They are not toggles.
2. **Left sidebar facets** (312 px wide, revealed by a `Filter` / `Hide Filters` button):
   **Size** (23–34, L, M, OS) · **Color** (22 px circular image swatches) ·
   **Category** (JEANS/SHORTS/SKIRTS/DRESS/ACCESSORIES/TOPS) · **Price** (min/max,
   $0–$150) · **Availability** (In Stock).

**The finding that matters: there is no fit facet, no rise facet and no wash facet.** Fit
and rise exist only as *collections*. A shopper who wants **bootcut + high rise + dark
wash** cannot express it — she must choose one of the three and browse the rest by eye
across 160 products. The mega-menu promises three merchandising axes; the PLP delivers
none of them as filters.

Grid geometry:

| State | Columns | Tile | Column gap | Row gap |
| :--- | ---: | :--- | ---: | ---: |
| Filters hidden | **4** | 339 × 616 | **0** | 12 px |
| Filters shown | **3** | 319 × 586 | **0** | 12 px |

**Card anatomy** (image 327 × 492, **AR 0.665**):

- Two stacked absolutely-positioned images, **opacity crossfade, 0.1 s ease-in-out**. Both
  images carry the **same** alt text — the second should be `alt=""` or describe the
  alternate view.
- `SHOP NOW` overlay on hover: 13 px, uppercase, ls 1.4 px, white.
- Title 13 px / 500 `#212121` · price 13 px / 400 (`.money`).
- **A wash name printed on the card** — `Light Wash`, 13 px, `.product-block-options__item__text`,
  absolutely positioned. This is the one place wash is exposed as a property.
- Rating + review count (12.8 px).
- **Quick-add**: `Add to Cart` button, 14 px uppercase, ls 1.12 px.
- Badges: `New in` and `BEST SELLER`, absolutely positioned, **16 px / 400, no background,
  no padding, no radius** — set in the body colour `#565656`. Extremely quiet.

Sort: a custom dropdown defaulting to `Best Match`.

Colour swatches in the sidebar are 22 px, `border-radius: 50%`, backed by images, and carry
**no `title`, no `aria-label`, no `data-value`** — unnamed to a screen reader.

## A.7 PDP — `/products/nocturne-baggy-wide-jeans`

Template suffix `inseam` — a dedicated PDP template for length-varianted products.

**Gallery:** main image **694 × 1041 (AR 0.667)** in a swiper; **7 thumbnails 64 × 97** in a
vertical rail at left inset 49. No video. **Every gallery image has `alt=""`.**

**Buying panel order, top to bottom:**

1. `h1` **18 px / 500** `#212121`
2. Price 18 px / 400
3. Rating `4.7 | 3 reviews` (12 px)
4. **Size** label 13 px + `Size Guide` button, then size chips **46 × 38, 2 px radius**
   — available `0.8px solid #DDD` on white; selected filled `#212121`; unavailable greyed
   to `#F1F1F1` text
5. Scarcity line — `Only 1 left!` 14 px
6. **Inseam** — a first-class second variant axis, options labelled **`30" / Short`** and
   **`32" / Regular`** (measurement *and* plain word)
7. **Wash as named text** — `Light Wash` (`.label__value`)
8. `ADD TO CART` 16 px uppercase ls 1.28 px, white on dark
9. Reassurance — free-shipping threshold, 12 px
10. `You Might Also Like` related row

**Size guide (modal).** Genuinely mixed:

- **Text that exists:** ~1,784 characters of real prose — how to measure waist, hips and
  inseam, and what rise means. Plus an FAQ block on how each fit runs.
- **Text that does not:** the **numeric measurement tables are images** —
  `Waist_Hips_Chart.jpg`, `inseam.jpg`, `rise.jpg` and four `…_Desktop_1000X1310` PNGs —
  **all with `alt=""`**. A regex for adjacent size numbers in the modal text returns false.

This is the **same WCAG 1.1.1 failure our CLAUDE.md §8.4 flags on L&B's own live site**, in
a direct competitor, in 2026. It is not an industry solved problem; it is an industry
habit.

## A.8 Motion

- No animation library beyond Swiper. **No scroll-jacking.**
- Scroll-reveal infrastructure exists (`[data-cc-animate]`, 19 elements) but the enabling
  class `cc-animate-enabled` is **absent** — **reveals are switched off**. Nothing on the
  homepage animates on scroll.
- Transition census (1,179 animatable elements): dominant signatures are
  `color 0.2s ease` (68), `color/border/opacity 0.1s ease` (63), `opacity 0.5s ease` (54),
  `opacity/transform 0.24s ease` (15), `transform 0.35s cubic-bezier(0.55,0.03,0.3,…)` (5).
  **Everything sits inside our 100–400 ms rule** except one 0.5 s opacity fade.
- **Video: all four `<video>` elements are `autoplay=false`, `preload="none"`, `loop=true`,
  `controls=false`, `muted=true`, `playsInline=true`, poster set.** Playback is
  JS-triggered on view. Hero duration **9.39 s**.
- **There is no play/pause control anywhere on the page** — a DOM-wide search for one
  returns zero. A looping 9.4 s hero film under a headline with no pause control is a
  **WCAG 2.2.2 (Level A) failure**, exactly the trap our §8 table names.
- `prefers-reduced-motion`: **2 media blocks**, both real — one forces
  `transition: opacity 0.7s !important` on the reveal system, one kills the marquee
  animation. Better than nothing, narrower than the site's motion surface.

## A.9 Accessibility summary

| Item | Finding |
| :--- | :--- |
| Focus | 5 `:focus-visible` rules vs 22 `:focus` rules — legacy-weighted |
| PDP gallery alt | **All empty** |
| PLP card alt | Present but **duplicated across both hover images** |
| Size-chart numerics | **Images with empty alt** — WCAG 1.1.1 |
| Colour swatches | **Unnamed** — no title/aria-label/data-value |
| Hero campaign copy | **Baked into video** — invisible to AT, search, Ctrl-F |
| Video pause control | **Absent** — WCAG 2.2.2 (A) |
| Mega-menu images | `alt=""` with adjacent link caption — **correct** |
| Social strip alt | Auto-derived from caption — mechanically present |
| Third-party overlay | An accessibility overlay widget is installed. Overlays are widely held not to remedy underlying failures, and the failures above are all still present with it running |

---

# PART B — ROCK & ROLL DENIM (rockandrolldenim.com)

## B.1 Tech stack

| Property | Value |
| :--- | :--- |
| Platform | Shopify, custom theme `Production` |
| Libraries | **GSAP**. **No jQuery**, no Swiper, no Lenis, no React, no three.js |
| Reviews | Yotpo |
| Cart | Rebuy drawer |
| Total page weight (PDP, settled) | **5,057 KB** across **487 requests** |
| JS | **~1,053 KB** |
| **CSS** | **3,767 KB across 26 requests** — 74% of total weight |
| Images (PDP, lazy) | 63 KB / 8 requests at capture |
| TTFB | 202 ms · DOMContentLoaded 1,756 ms · load 3,116 ms |
| DOM nodes | 3,008 |
| Image formats | WebP present, plus jpg/png/svg; Shopify `&width=` srcset with `sizes="100vw"`, `loading="lazy"` |

**Read:** less than half Miss Me's weight and half the JS, but a **3.7 MB CSS payload** is
its own pathology — bigger than our entire cinematic page budget, in stylesheets alone.
Both sites fail our budgets; they fail them in different directions.

## B.2 Header, promo bar, nav

| Element | Measurement |
| :--- | :--- |
| Announcement bar | **44 px**, white text, 16 px / 400, z-index 600 |
| Header | **149 px**, bg **`#1A1818`**, `position: relative` — **not sticky at any scroll position** |
| Logo | **Inline SVG 201 × 45**, left inset 80 px |
| Top-level nav | **MEN · WOMEN · KIDS · COLLECTIONS**, 20 px / **900**, uppercase, work-sans, `#fff` |
| Mega-menu mechanism | **Native `<details>` / `<summary>`** (`details.mega-menu`), 4-column layout, `theme-light` panel under a `theme-dark` bar |
| Mobile menu | Separate `menu-drawer-accordion-details` tree, also `<details>` |

**The `<details>` mega-menu is the notable engineering choice.** It is keyboard-operable,
works without JavaScript, and needs no ARIA emulation. It is the exact pattern our §9
motion-stack rewrite prescribes ("CSS and native platform features first — view
transitions, scroll-driven animation, `<details>`, `:target`"), shipped in production by a
brand in our own category.

**A 149 px non-sticky header** is a deliberate trade: it gives the campaign the full
viewport once you scroll, at the cost of always scrolling back for navigation.

## B.3 Typography

**Two typefaces**, which is precisely our North Star's constraint.

| Family | Role | Weights loaded |
| :--- | :--- | :--- |
| **americane** | Display — headings, PDP h1, accordion titles | 300/400/700/900 + italics (8 faces) |
| **work-sans** | Body, nav, UI, price | 100–600 + 900 in use |

| Level | Computed |
| :--- | :--- |
| Body base | work-sans 16 px / 24 px (1.5), `#1A1818` |
| Top nav | work-sans **20 px / 900**, uppercase |
| PLP `h1` | **americane 43.2 px / 900**, uppercase |
| PDP `h1` | **americane 32 px / 900**, uppercase |
| Section `h2` | americane 24 px / 900, uppercase, lh 22.32 (**0.93 — tighter than 1**) |
| Accordion title | americane 18 px / 900, uppercase |
| Card title | work-sans 14 px / 500, capitalize |
| Card price | work-sans 14 px / **600** |
| PDP price | work-sans **24 px / 900** |
| Badge | work-sans 16 px / 600, uppercase |
| CTA | work-sans 22 px / 900, uppercase |

**Contrast with Miss Me:** Rock & Roll runs a display face at 900 weight with **sub-1.0
line-height** on headings, and puts real weight on price (600–900). Miss Me runs one
neutral family and treats price as body text. Same tier, opposite register — Rock & Roll
sounds like a brand; Miss Me sounds like a catalogue.

## B.4 Colour

| Token | Value | Use |
| :--- | :--- | :--- |
| Ink / header bg | **`#1A1818`** | Header, body text, `NEW` badge |
| Paper | `#FFFFFF` | Page |
| **Brick** | **`#7D2321`** | `SALE` badge, link accent |
| Review text | `#121212` | Yotpo |

A three-value system. The brick red is the only chromatic accent and it is spent
exclusively on markdown. Everything else is ink on paper with the photography carrying
colour — the same principle as Miss Me, executed with one deliberate accent instead of
none.

## B.5 Campaign rhythm (secondary focus)

Eight rendered bands, document height **5,561 px** = 6.2 viewports.

| # | Band | Top | Height | Gap above | vh | Heading |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| 0 | carousel (hero) | 149 | **700** | — | 0.78 | 3 slides |
| 1 | featured_collection | 849 | **796** | **0** | 0.88 | BEST SELLERS |
| 2 | two_up_callout | 1645 | **371** | **0** | 0.41 | — |
| 3 | two_up_callout | 2016 | **371** | **0** | 0.41 | — |
| 4 | two_up_callout | 2387 | **371** | **0** | 0.41 | — |
| 5 | image_banner | 2758 | **425** | **0** | 0.47 | SALE & CLEARANCE |
| 6 | UGC | 3183 | **294** | **0** | 0.33 | #LIVEBOLDLY |
| 7 | behind_the_brand | 3477 | **934** | **0** | 1.04 | BEHIND THE BRAND |

**Same zero-gap discipline as Miss Me** — every band flush. But a different shape: instead
of alternating, Rock & Roll **stacks three identical 0.41 vh two-up callout bands in a
row**, producing a six-tile campaign block that reads as one unit. Callout geometry:

- Two halves **617 × 347, AR 1.78 (16:9)**, at left 80 and left 729.
- **Page margin 80 px; gutter 32 px.** (Miss Me: margin 0, gutter 12 px.)

So Rock & Roll's campaign is **inset and landscape**; Miss Me's is **full-bleed and
portrait**. Miss Me's reads as film; Rock & Roll's reads as catalogue spread.

**Hero carousel:** 700 px, AR 2.036, 3 slides, autoplay attribute present. Controls are
properly labelled: `Previous slide`, `Next slide`, and **numbered slide links
`Load slide 1 of 3`** — real buttons, not dots-with-no-name. Alt text on the hero image is
descriptive.

**Alt text across campaign bands is genuinely written** — e.g. `Close-up back view of men's
jeans`, `woman wearing sleeveless denim vest`, `Man casting fishing net wearing TEK Western
p…`. This is the clearest single quality gap between the two sites.

## B.6 DENIM MERCHANDISING — the deep read

### B.6.1 How jeans are organised in navigation

**Women's Jeans** (10 links, one flat list):

> Trousers · Bootcut · Riding · Flares · Wide Leg · Bell Bottoms · Cropped ·
> **High-Rise · Mid-Rise** · All Women's Jeans

**Men's Jeans** (9 links, one flat list):

> **Regular – Pistol · Relaxed – Double Barrel · Slim – Revolver · Skinny – Rifle ·
> Loose – Cannon** · Bootcut · Stackable Boot · Straight Leg · All Men's Jeans

**Two mechanisms live here.**

**(a) Dual-labelled fit names — generic word first, proprietary name second.**
`Regular – Pistol`. `Slim – Revolver`. `Loose – Cannon`. The generic word does the
comprehension work; the proprietary name does the brand work; the proprietary name
**never travels alone**. A shopper who has never heard of a "Cannon" still knows it is
loose. A returning shopper learns the name for free. This solves the exact problem every
heritage denim brand creates for itself by naming fits after things.

**(b) Fit (how it sits on the body) and leg opening (what the hem does) are separate
axes.** `Regular` and `Bootcut` are different questions, and both appear in the same list
because navigation is flat — but they resolve as orthogonal facets on the PLP (below).

**The asymmetry is glaring and worth flagging:** the women's list gets **no dual-labelled
fit names at all** and mixes **rise** (High-Rise, Mid-Rise) into the same flat list as
**silhouette** (Trousers, Bootcut, Flares…). Men get a designed vocabulary; women get a
list. Since L&B's core category *is* women's denim, this is the half of the site to learn
from by contrast, not by imitation.

### B.6.2 Is fit filterable? — **Yes, and this is the headline finding**

Women's jeans PLP (`/collections/womens-jeans`, **84 products**), full facet set with live
counts:

| Facet | n | Values (count) |
| :--- | ---: | :--- |
| **Fit** | 3 | Regular (42) · Relaxed (11) · Slim (31) |
| **Leg Style** | 8 | Barrel (1) · Bell Bottom (5) · **Bootcut (37)** · Cropped (3) · Flare (8) · Straight (2) · Trouser (18) · Wide (10) |
| **Waist Size** | 14 | 23 (5) · 24 (74) · 25 (80) · 26 (84) · 27 (83) · 28 (82) · 29 (84) · 30 (83) · 31 (84) · 32 (83) · 33 (82) · 34 (77) · 36 (74) · 38 (1) |
| **Inseam** | 8 | 25 (3) · 27 (4) · 29 (1) · 30 (76) · 32 (79) · 34 (79) · 36 (79) · 38 (69) |
| **Rise** | 3 | High (61) · Low (1) · Mid (22) |
| **Color** | 12 | Black (2) · Blue (2) · **Dark Wash (28)** · Green (3) · Grey (1) · **Light Wash (14)** · **Medium Wash (28)** · Multi (1) · Pink (1) · Red (2) · Tan (1) · Turquoise (1) |
| **Collection** | 2 | Sculpted (5) · West Desperado (3) |

All checkbox inputs. **Fit, Leg Style and Rise are three independent, combinable facets**,
each showing a product count before you click. Sidebar is **344 px, persistent** (not a
drawer) at desktop; a `Show filters / Hide filters` toggle exists but the default is open.

Sort: Featured · Most relevant · Best selling · A–Z · Z–A · Price ↑ · Price ↓ · Date ↑ ·
Date ↓.

**Direct comparison on the central question:**

| Axis | Miss Me | Rock & Roll |
| :--- | :--- | :--- |
| Fit | Collection link only | **Filterable facet + counts** |
| Leg opening | Collection link only | **Filterable facet + counts** |
| Rise | Collection link only | **Filterable facet + counts** |
| Inseam / length | PDP variant only | **Filterable facet + counts** |
| Wash | Card label + collection link | **Inside the Color facet** |
| Combinable? | **No** | **Yes, all of them** |

### B.6.3 How wash is merchandised

Rock & Roll folds wash into **Color**: `Dark Wash (28)`, `Medium Wash (28)`,
`Light Wash (14)` sit alongside `Black`, `Blue`, `Green`, `Pink`, `Turquoise`.

This is a pragmatic compromise, not an elegant one — it conflates "how the denim was
finished" with "what colour the fabric is", and it means a shopper cannot ask for
*dark wash* and *black* as different kinds of question. But it beats Miss Me's
arrangement, where wash is a marketing collection under "Featured" and cannot be
combined with anything.

**Both sites agree on the vocabulary: Light / Medium / Dark Wash.** That three-step scale
is the category standard and should be treated as settled.

### B.6.4 How fit is shown on the card

It largely **isn't** — and this is the weak link on both sites.

Rock & Roll card (238 × 474; image 238 × 334, **AR 0.714**):

- Two stacked absolute images, **opacity crossfade 0.4 s
  `cubic-bezier(0.215, 0.61, 0.355, 1)`** (ease-out-cubic).
- Title 14 px / 500 capitalize — fit information reaches the card **only because it is
  written into the product name** (`Low Rise Bootcut Jeans`).
- Yotpo rating + `127 Reviews` at 12 px.
- Price 14 px / 600.
- Badges: `NEW` (white on `#1A1818`) and `SALE` (white on `#7D2321`), 16 px / 600,
  uppercase, `padding: 4px 8px`, **0 radius**, absolutely positioned.
- A `card-swatches-row` container exists but rendered **0 px tall** on this collection — no
  colour/wash swatches surfaced on the card.
- Card images carry **`alt=""`**, relying on the adjacent heading link.

Grid geometry at 1440: **4 columns × 238 px, column gap 16 px, row gap 40 px**, grid width
1001, left inset 344 (the sidebar). At narrow widths it collapses to **2 columns × 177 px,
column gap 8 px, row gap 24 px**.

So: **the PLP knows fit, leg style and rise as structured data — and the card shows none of
it as a labelled attribute.** The shopper filters by fit, then loses the fit signal the
moment results render. Miss Me is marginally better here: it prints the **wash name** on
the card (`Light Wash`) as a real field.

### B.6.5 How a shopper narrows a large range

Rock & Roll's funnel, in order: **gender → jeans → (facet stack) → product**, with the
facet stack doing the real work and every facet showing its yield first.

Miss Me's funnel: **denim → pick one collection (fit *or* rise *or* motif) → size/colour/
price**. The first choice is exclusive and unrecoverable without going back.

For 84 products Rock & Roll's model is generous. For **160** products Miss Me's model is
the one that actually needed facets and does not have them.

## B.7 PDP — `/products/low-rise-bootcut-jeans`

**Gallery:** a **stacked mosaic, not a carousel** — pairs of **403 × 538 (AR 0.75)** images
in a 2-up grid at left 80 / left 499, plus a large **800 × 1120 (AR 0.714)** hero image, plus
340 × 340 square lifestyle tiles. Three 120 × 168 thumbnails appear far down the page
(related module). No video.

**Alt text is descriptive and product-specific** — e.g. `Low Rise Bootcut Jeans in medium
wash with decorat…`, `Low Rise Bootcut Jeans with stylish back pockets i…`. Different alt
per image. This is a real, measurable quality difference from Miss Me's empty alts.

**Buying panel order:**

1. `h1` **americane 32 px / 900** uppercase
2. Rating + `127 Reviews`
3. Price **24 px / 900**
4. `Size Guide` link
5. **`Waist:`** — label 16 px / 600 with a `Please Select` state, then chips 14 px / 900
   uppercase (24–36)
6. **`Length:`** — same treatment (30 · 32 · 34 · 36 · 38)
7. CTA in disabled state reading **`PLEASE SELECT OPTIONS`** (22 px / 900 uppercase) —
   the button *names what is missing* rather than greying out silently
8. Three reassurance items: free-shipping threshold · `Easy Returns & Exchanges` ·
   `Buy Now, Pay Later`
9. **`DETAILS` accordion (open by default)**
10. **`Description` accordion (open by default)**

**The single most transferable mechanism on either site — the DETAILS block:**

> style: Bootcut · fit: Regular · color: Dark Wash · rise: Low · closure: Zip Fly ·
> detail: Extra room in thigh and knee · materials: 98% Cotton, 2% Spandex ·
> stretch level: Minimal · style number: …

**This is the same controlled vocabulary that powers the facets, printed on the PDP as a
labelled attribute list, as text.** `fit: Regular` is the same token as the `Fit → Regular
(42)` facet. `rise: Low` is the same token as `Rise → Low (1)`. There is one dataset behind
both the filter and the product truth — and `stretch level: Minimal` shows the vocabulary
extends to properties nobody filters on yet.

Note also the naming: **Waist and Length**, not "Size" and "Inseam". Miss Me reaches the
same place from the other side, labelling its inseam options **`32" / Regular`** —
measurement *and* plain word together.

## B.8 Motion

- **GSAP is loaded** but the observable motion is CSS transitions; no scroll-jacking, no
  wheel interception detected.
- Transition census (507 animatable elements): `color 0.25s ease-out` (241),
  `opacity 0.25s ease-out` (39), `transform/opacity/visibility 0.15s ease` (36),
  `all 0.15s linear` (25), **`opacity 0.4s cubic-bezier(0.215,0.61,0.355,1)` (20)** — the
  card image crossfade — and `all 0.25s ease-out` (10).
- **Every duration falls within our 100–400 ms interactive rule.** Effectively two easing
  curves in use (`ease-out` and one cubic-bezier), which is our §9 two-curve budget met.
- `prefers-reduced-motion`: **1 block**, and it is **opt-in by class**:
  `.motion-reduce { transition: none !important; animation: none !important }`. It only
  disarms elements that carry `.motion-reduce`. This is a Tailwind-style utility, **not** a
  global guarantee — it looks like reduced-motion support and is materially narrower.

## B.9 Accessibility summary

Materially stronger than Miss Me.

| Item | Finding |
| :--- | :--- |
| Focus | **655 `:focus-visible` rules** vs 35 `:focus` — modern, comprehensive |
| Skip link | **Present** (`#MainContent`) |
| Screen-reader text | **224** `.sr-only` / `.visually-hidden` elements, including rating text (`4.8 out 5 stars rating in total`) and `Regular price` |
| Mega-menu | **Native `<details>`** — keyboard-operable, works without JS |
| Carousel controls | Named buttons: `Previous slide`, `Next slide`, `Load slide 1 of 3` |
| Facets | Real `<fieldset>` + `<legend>` + checkbox inputs, each option labelled with its count |
| Campaign alt text | **Descriptive and per-image** |
| Product card alt | `alt=""` (48 of 51 images) — defensible, adjacent heading carries the name |
| Disabled CTA | Names the blocker (`PLEASE SELECT OPTIONS`) rather than greying out |
| Reduced motion | **Class-scoped only** — the one real weakness |
| Header | Non-sticky — no `2.4.11 Focus Not Obscured` risk by construction |

---

# PART C — WHAT FRONTIER HOUSE SHOULD TAKE

## C.1 Campaign-rhythm mechanisms to add to our homepage

Ordered by leverage. All are principles, none require copying a layout.

**1. Adopt zero inter-band spacing as a rule, and delete section-level vertical margins.**
Both sites, independently, ship **every band flush** — 17 measured gaps across the two
homepages, all zero. Breathing room belongs inside a band's own padding. This is the
cheapest, highest-impact change available to us and we have not made it.

**2. Constrain band height to a register.** Miss Me holds 7 of 9 bands between **0.67 and
0.89 vh**. Nothing is 100 vh — the next band's edge is always visible, which is what makes
a long page feel composed rather than sectional. Break the register **only** for the one
band that asks the visitor to stop (Miss Me: a 1.86 vh grid) and the one that is a
footnote (0.44 vh social). Encode it as a test over rendered band heights.

**3. Encode the alternation as a lint, not a habit.** Miss Me never places two atmosphere
bands adjacently: `film → mosaic → products → film → mosaic → products → split → grid →
social`. Given our §11 anti-fusion risk, a CI check asserting *no two consecutive
non-commerce bands* is a structural defence that costs almost nothing and directly serves
"every cinematic surface has a one-action exit to shop".

**4. Add a 3-up fit-gateway mosaic — the band we are missing.** Miss Me: three tiles
**467 × 650, AR 0.72, 12 px gutter, full-bleed**, one link and one label each, routing
straight to fit collections. It is the cheapest possible denim-fit entry point and it costs
three photographs. Given denim is L&B's core category, this band earns its place above
almost anything cinematic.

**5. Fix our split-campaign geometry to a decision.** Miss Me's 2-up split uses **perfect
squares (706 × 706), 12 px gutter, full-bleed**. Rock & Roll's uses **16:9 landscape
(617 × 347), 32 px gutter, 80 px page margin**. These are two coherent registers — bleeding
and cinematic vs inset and editorial. We should pick one deliberately and apply it
everywhere, rather than letting each band drift.

**6. Make the social strip the shortest band on the page.** Measured at **0.44 vh**
(Miss Me) and **0.33 vh** (Rock & Roll). It is a proof band. If ours is taller than every
campaign band, it is over-weighted.

**7. Campaign copy is DOM text. Always.** Miss Me's hero band contains **one link and zero
text nodes** because the headline lives inside the video file. That is our §11 failure mode
happening in public. Our no-JS assertion (CI Test 1) already catches missing *product*
text; it will **not** catch a missing campaign headline. Extend it: assert that every
campaign band exposes its eyebrow, headline and CTA as text in the no-JS HTML.

**8. Budget the pause control into the art direction now.** Miss Me runs a **9.39 s
looping** hero film with `controls=false` and **no pause control anywhere in the DOM** —
a WCAG 2.2.2 Level A failure. Our §8 already warns that a pause control cannot be
retrofitted into finished art direction. Here is the measured proof that a well-resourced
competitor did exactly that and shipped the failure.

## C.2 How our women's denim PLP should express fit and wash

L&B's core category is women's denim. The evidence points to one model, and it is Rock &
Roll's — with two corrections.

**Take: three orthogonal, combinable facets with live counts.**

| Facet | Vocabulary evidenced | Note |
| :--- | :--- | :--- |
| **Fit** (how it sits on the body) | Regular · Relaxed · Slim | Rock & Roll's women's set. Add only what the assortment supports |
| **Leg style** (what the hem does) | Bootcut · Straight · Flare · Bell Bottom · Wide · Trouser · Cropped · Barrel | Rock & Roll's set; Miss Me adds Skinny · Capris · Shorts |
| **Rise** | High · Mid · Low | **Identical on both sites.** Settled vocabulary |

Plus **Waist size**, **Inseam/Length**, **Wash**, **Availability**. Every option shows its
product count *before* the click — both the yield signal and the "don't strand the shopper"
guard.

**Correction 1 — give wash its own facet.** Rock & Roll buries Light/Medium/Dark Wash
inside `Color` next to Pink and Turquoise; Miss Me makes wash a marketing collection that
combines with nothing. Neither is right. **Wash is a finish, colour is a fabric fact.**
Separate them. The three-step scale **Light · Medium · Dark** is agreed across both sites
and should be adopted as-is.

**Correction 2 — put fit, rise and wash on the card as labelled data.** This is the gap on
*both* sites. Rock & Roll filters by fit and then shows nothing but a product name; Miss Me
prints only the wash. If a shopper filtered to `Bootcut + High Rise + Dark Wash`, the cards
should confirm it. Miss Me's `.product-block-options__item__text` treatment — a small
13 px text field under the title — is the right weight; it just needs to carry three fields
instead of one.

**Take the PDP attribute block wholesale as a pattern.** Rock & Roll's DETAILS accordion
prints `style · fit · colour · rise · closure · detail · materials · stretch level · style
number` as labelled text — **the same tokens that power the facets**. One controlled
vocabulary, two surfaces. For us this satisfies three separate constitutional requirements
at once:

- §11 "faceted filtering built on attributes" — as **real structured data**, not names
  parsed with a regex, which is what our current wording risks.
- §8 "size and fit data is structured text" — the attribute list *is* the fit story.
- §11 no-JS assertion — labelled text in the server-rendered HTML passes by construction.

**Take dual-labelled fit names — if and only if we invent fit names at all.**
`Regular – Pistol`, `Slim – Revolver`: generic word first, proprietary name second, and the
proprietary name never appears alone. Note carefully that Rock & Roll applies this to
**men's denim only** — the women's list gets silhouette words and no designed vocabulary.
Since our core category is women's, we should apply the mechanism to the half of the market
they neglected. Any fit names are a **D-07 (brand voice)** matter and cannot be invented
here.

**Take plain-language length labelling.** Miss Me: `30" / Short`, `32" / Regular`. Rock &
Roll: `Waist:` and `Length:` rather than "Size" and "Inseam". Both pair the number with the
word. Cheap, and it removes the single most common denim sizing error.

**Take the disabled-CTA pattern.** `PLEASE SELECT OPTIONS` names the blocker instead of
greying out silently. Directly serves our §11 "design every state" requirement.

**Take the persistent desktop facet sidebar (344 px, open by default).** Miss Me hides
filters behind a toggle *and* reflows the grid from 4 columns to 3 when you open them —
a layout shift as the direct cost of filtering. Rock & Roll keeps the sidebar open and the
grid stable at 4 × 238 px.

**Reject:** review counts on cards (§11 — consumer reviews are unjustified for L&B, and
both sites lean on them heavily); scarcity messaging (`Only 1 left!`); and any wash or fit
value not backed by real product data (§12).

## C.3 Price-tier calibration — an honest note

**These brands sit above L&B, not at it.** Observed retail: Miss Me **$82–$149** (grid
sample: $114, $119, $124, $129, $134, $144, $149); Rock & Roll **$82.99**. L&B's implied
retail is **$20–$85** — derived from verified wholesale $7–$33 at standard keystone. So
Miss Me's *floor* is roughly L&B's *ceiling*, and Rock & Roll sits at the ceiling.

That said, their **visual register is far more transferable than any luxury reference**,
and three things calibrate directly:

**1. Type stays small. Both of them.** Miss Me's largest homepage type is **30 px** and its
PDP `h1` is **18 px** — smaller than its own 16 px body base. Rock & Roll runs bigger
(43.2 px PLP `h1`) but only in a **display face at 900 weight**, never in body type. This
corroborates the existing `lb-reference-teardown-findings` memory across a second price
tier: **at $20–$150, premium is signalled by media density and photographic quality, not by
type scale.** Our D-06 visual-calibration decision should record this as measured evidence.

**2. The interface is monochrome; the garment carries all colour.** Miss Me spends
literally zero chroma on UI. Rock & Roll spends exactly one accent (`#7D2321` brick) and
spends it only on markdown. This is our §5 North Star — "colour carried by the garment, not
the interface" — independently confirmed twice in our own category and price band. It also
suggests that when D-07 resolves our accent palette, **one accent with one job** is the
category-correct answer.

**3. Two typefaces is the working number.** Rock & Roll: americane + work-sans. Miss Me:
Inter alone — and it reads flatter, more catalogue than brand. This is mild evidence that
our §5 two-typeface rule is correct and that one is too few, not that three would be
better.

**Where the tier difference genuinely bites:** these brands can afford full-bleed video
heroes (Miss Me spends **8.4 MB** on homepage video alone) and shoot enough product to fill
7 PDP images plus 2 hover states per card. **L&B has zero production assets.** Their
rhythm is achievable at our tier; their *media appetite* is not, yet. Which is why the
band-structure lessons (§C.1) matter more to us than the media lessons — structure is free,
photography is the critical path.

**Both fail our engineering budgets, in opposite directions.** Miss Me: **12.8 MB / 558
requests / 2.0 MB JS**. Rock & Roll: **5.1 MB / 487 requests / 1.05 MB JS / 3.8 MB CSS**.
Against our ceilings (180 KB JS, 1.5 MB shop pages, 4 MB cinematic), *neither site would
pass a single one of our budget gates*. Our §10 note that "a bespoke build landing below a
stock Shopify theme is a measurable regression" should be read alongside this: the
**commercial floor is Shopify's 76% CWV-good rate**, not these two implementations of it.
Beating them on weight is not ambitious; it is the baseline.

## C.4 What data we lack

Blocking or materially limiting, in priority order:

1. **L&B's actual women's denim attribute data.** Every recommendation in §C.2 assumes
   fit / leg style / rise / wash / inseam exist as **structured per-product fields**. We
   have never seen L&B product data. If these attributes only exist inside product *names*,
   the facet model is a data-entry project before it is a front-end one — and §24's
   "critical path is data and photography" is the governing constraint.
2. **Whether L&B women's denim even spans multiple fits.** Rock & Roll needs 3 fits × 8 leg
   styles because it has 84 women's jeans. If L&B's denim assortment is a handful of
   styles, a facet stack is over-engineering and the 3-up mosaic gateway (§C.1.4) is the
   whole answer. **Unknown.**
3. **Inseam/length availability.** Both sites treat length as a real variant axis. Whether
   L&B ships multiple inseams — or a single length — is unknown and changes both the PDP
   and the facet set.
4. **Whether prepacks of 6 break the size-facet model.** Both reference sites are DTC with
   single-unit sizes. L&B's verified wholesale model is **prepacks of 6**. A "Waist size"
   facet may be meaningless to an approved buyer purchasing a size run. **This is a real
   structural unknown for our Phase 1 wholesale-first launch** and nothing in this teardown
   addresses it — both sites are the wrong shape for that question.
5. **D-04 / D-03 / D-05 taxonomy remain unresolved.** Rock & Roll's `MEN · WOMEN · KIDS ·
   COLLECTIONS` is a reminder that gender-first taxonomies are the category norm, but
   §11 forbids menswear for us and the taxonomy cluster is still the one hard gate on
   Phase 1.
6. **Photography volume.** Miss Me: 7 PDP images + 2 per card. Rock & Roll: ~8 PDP images
   with per-image descriptive alt. Our hover-swap and gallery patterns assume **at least 2
   images per product and ~6 per PDP**. Against zero production assets, this is a
   commissioning brief, not a build task.
7. **Mobile.** Everything above is desktop at 1440. Rock & Roll's grid was observed
   collapsing to 2 × 177 px (8 px column gap, 24 px row gap) at ~375 px, but a proper
   mobile pass on both sites was not completed. Given §10's "test on a mid-range Android",
   this is a genuine gap in the evidence.
8. **Real INP / LCP under throttling.** Only lab-ish `PerformanceNavigationTiming` figures
   were captured on a fast desktop connection. Field CWV data for either site is unknown,
   and our §10 budgets are field-p75 budgets.
