# Front-end teardown — Tecovas

**Target:** https://www.tecovas.com
**Date:** 2026-08-13
**Method:** in-app Chromium at 1440 × 900 (DPR 1.25) and 375 × 812, computed styles read via
`getComputedStyle` / `getBoundingClientRect`; plus raw HTML, CSS and asset fetches over HTTP for
race-free static analysis. Every number below is measured, not estimated.
**Surfaces covered:** homepage, PLP (`/shop/boots/mens/cowboy-boots`), PDP (`/products/the-buck`),
footer, `robots.txt` / `llms.txt` / `agents.md`.

> **Scope discipline.** This document records *mechanisms and measurements only*. No Tecovas copy,
> layout, imagery, code, motion sequence or brand identity is reproduced for reuse. Quoted strings
> appear solely as evidence of a mechanism (e.g. that a CTA label states the next required action).
> Nothing here is intended to be pasted into L&B.

---

## 0. Executive summary

Tecovas is not an art-direction site. It is a **merchandising system with unusually deep product
truth**, wrapped in the quietest chrome it can get away with. Three facts define it:

1. **The type is small and the photography is enormous.** The largest heading rendered anywhere on
   the homepage is **42 px**. The hero is **665.6 px** tall — 74 % of a 900 px viewport. Every
   product well on the site is the same **0.8 (4:5) aspect ratio**. Premium reads as image density
   and image discipline, not display type.
2. **The PDP is the product.** 4 984 px tall, 8 gallery images with a sticky left thumb rail, a
   buying panel whose CTA states the next required action, 10 construction facts, a structured fit
   guide whose diagrams carry the rule *in the alt text*, three collapsed accordions, and an
   accessory cross-sell placed inside the care content.
3. **The chrome is themeable data, not code.** Nav, border, button and background colours are
   `--twc-theme-*` HSL triples set on `<body>` (a `tailwindcss-themer` setup), and the hero's
   headline colour, body colour and CTA background/foreground arrive as **inline styles from the
   CMS**. One component serves any campaign palette with no code change.

The costs: **~350 KB gzip of first-party JS on the homepage, ~384 KB on the PDP** (roughly 2× the
L&B budget); a homepage where **six of nine bands are client-rendered only**; and a hero where white
type sits on video with **no scrim of any kind**.

---

## 1. Header and navigation

### 1.1 Geometry (measured)

| Viewport | Total header | Row 1 (promo) | Row 2 (utility) | Row 3 (nav) |
| :--- | ---: | ---: | ---: | ---: |
| 1440 × 900 | **156 px** | 44 px | 64 px | 47.2 px |
| 375 × 812 | **88 px** | 40 px | 48 px | — (drawer) |

- Row 1 (`h-10 lg:h-11`) — background **`#F3E9DF`** (`bg-desert-fade`), text `#191A19`.
  Centred promotional sentence (16 px `mundial` 400 / 22.4 px) with an inline bold underlined link.
  Right-aligned utility pair (Help · Find Stores) at **14 px `lorimer-no-2` 600, uppercase,
  0.28 px tracking**. This row **scrolls away**.
- Row 2 — background **`#FCF9F4`** (`bg-theme-nav`), `border-b-theme-border`. Hamburger 30 × 30 at
  x = 56; wordmark **176 × 32** at x = 91 (120 × 18 on mobile); right cluster at x = 1208.8:
  an AI-search control (`bsai-control`, 32 × 32), search, Save-For-Later, account, cart —
  each a **48 px** column.
- Row 3 — the desktop nav: 9 top-level items (New Arrivals · Men · Women · Kids · Work · Denim ·
  Explore · Resale · Last Call), each 64–134 px wide, 47.2 px tall.

**Sticky behaviour.** Only the nav block is `sticky top-0 z-30`. The promo row scrolls off, the nav
stays. No shrink-on-scroll, no hide-on-scroll-down, no backdrop blur, no transform. On the PDP at
740 px the sticky nav measured 96 px because the search field expands inline.

### 1.2 Mega-menu mechanics

Trigger is **hover on the list item, with a real disclosure button for keyboard**:

```
<a href="/shop/mens">Men</a>
<button aria-haspopup="true" aria-expanded="false" aria-controls="desktop-submenu-…"
        class="flex w-px items-center justify-center overflow-hidden focus:w-8">
```

The disclosure button is **1 px wide** and expands to **32 px on `:focus`**. Mouse users never see
it; keyboard users tab into a proper `aria-expanded` control. This is the single best pattern on the
site — it resolves the classic hover-menu keyboard trap without adding a visible chevron to every
nav item.

Panel: `absolute left-0 top-12 w-full bg-theme-background-alt px-10 pb-10 pt-8`, i.e. **full-bleed
below the nav row**, not a dropdown box. Closed state is
`opacity-0 pointer-events-none animate-delay-visibility-off`, where:

```
@keyframes delay-visibility-off { 0% { visibility: auto } to { visibility: hidden } }
.animate-delay-visibility-off { animation: .3s linear both delay-visibility-off }
```

A 300 ms linear animation holds `visibility: visible` long enough for the opacity fade to be seen,
then flips to `hidden` — so the closed panel is genuinely out of the tab order without transitioning
`visibility` (which is not animatable). Clean, zero-JS-per-frame.

A full-viewport scrim sits under it: `fixed left-0 top-11 h-full w-full bg-black transition-opacity
lg:block pointer-events-none opacity-0` — desktop only.

**Panel layout (Men, measured at 1440):**

| Column | x | Content |
| :--- | ---: | :--- |
| 1 | 40 | Shop All · New Arrivals · Best Sellers · Shop by Collection (+4 nested) · Gift Cards |
| 2 | 236.7 | Boots (+7 nested: Cowboy, Work, Exotic, Ranch, Roper, Zip, Horseman) · Shoes |
| 3 | 406.2 | Apparel (+6 nested) · Bags |
| 4 | 539.2 | Accessories (+7 nested) |
| 5 | 984.8 | **Promo tile 192 × 263.4** (0.73 aspect) |
| 6 | 1192.8 | **Promo tile 192 × 263.4** |

Link rows are 16.1 px tall on a **24.1 px** pitch; group headers sit on a 40.1 px pitch. Two image
tiles are right-anchored — imagery inside menus, but only two, and only at the far right where they
never compete with the link columns.

Hover feedback on a top-level item is an underline reveal:
`absolute -bottom-px left-4 w-[calc(100%-2rem)] border-b-2 opacity-0 group-hover:opacity-100` —
the rule is **inset 16 px each side**, so it reads as an underline of the word, not of the hit area.

### 1.3 Search, account, cart

- Search is a **dialog** ("Open the search dialog"), not an inline field. Backed by Algolia
  (`/api/collection-products?search=` is Algolia-backed per their own `agents.md`).
- Account link goes to Shopify's hosted login.
- Cart is a dialog with the item count in the accessible name (`"Open cart dialog, 0 items"`).
- Save-For-Later is a first-class header slot, gated behind login on every card
  (`"Login to add this product to your save for later list"`).

---

## 2. Typography system

### 2.1 Families — three, from Adobe Typekit

| Utility | Family | Weights loaded | Role |
| :--- | :--- | :--- | :--- |
| `font-serif` | **borax-variable** | variable **400–1000**, used at **550** and **750** | Display: h1, quote band, tile labels |
| `font-alt` | **lorimer-no-2** | 600, 700 | Labels, product names, prices, eyebrows, section h2 |
| `font-sans` | **mundial** | 400, 600 | Body, UI, promo bar |

Not a serif/sans binary — it is **one variable display serif plus two sans**, one of which
(`lorimer-no-2`) is reserved almost entirely for uppercase label work at +0.02 em tracking.

Five `.woff2` faces are `<link rel="preload" as="font" fetchpriority="high">`.
**Defect found:** three of the five preload hrefs are **double-escaped** (`&amp;amp;` instead of
`&amp;`), so the URLs do not match what the CSS requests. The two `mundial` faces preload correctly;
**`borax-variable` and both `lorimer-no-2` faces do not** — the display face and the product-name
face are the two that miss the optimisation. 18 font requests were observed on the PDP.

### 2.2 Scale — the actual token table

Read directly from the compiled CSS. rem values converted at a 16 px root.

| Token | Desktop | Mobile | Tracking |
| :--- | ---: | ---: | ---: |
| `text-d1` | 56 px / 110 % | 48 px / 95 % | — |
| `text-h1` | **42 px / 120 %** (50.4 px) | 36 px / 120 % | — |
| `text-h2` | 32 px / 106 % (33.92 px) | 26 px / 106 % | — |
| `text-h3` | 26 px / 120 % (31.2 px) | 24 px / 105 % | — |
| `text-h4` | 22 px / 120 % | 20 px / 105 % | — |
| `text-h5` | 24 px / 110 % | 22 px / 110 % | — |
| `text-b1` | 20 px / 120 % | 18 px / 125 % | — |
| `text-b2` | 18 px / 140 % | 16 px / 110 % | — |
| `text-b3` | 16 px / 140 % (22.4 px) | 14 px / 120 % | — |
| `text-b4` | 18 px / 110 % (19.8 px) | — | — |
| `text-l1` | 18 px / 112 % | 16 px / 112 % | 0.02 em |
| `text-l2` | 16 px / 115 % | — | 0.02 em |
| `text-l3` | 14 px / 115 % (16.1 px) | 13 px / 115 % | 0.02 em (mob 0.04) |
| `text-l4` | **11 px / 115 %** (12.65 px) | — | 0.02 em |
| `text-c1/c2/c3` | 18 / 16 / 14 px, 110 % | — | 0.02 em |

### 2.3 How large is the display type, really

**42 px.** That is it. `text-d1` (56 px) exists in the system but was not used on the homepage.

- Hero h1 — 42 px `borax-variable` **weight 550**, line-height 50.4 px, white, in a **640 px** text
  block at x = 160 (`md:px-40`), vertically centred. At a 1440 viewport that headline is
  **2.9 % of viewport width**.
- Editorial quote band h2 — 42 px / 50.4 px `borax-variable` 550, **centred**, measure **576 px**.
- Section h2 (e.g. the SEO heading above the reviews rail) — **32 px `lorimer-no-2` 600**, line-height
  33.92 px (106 %), left-aligned at the 160 px gutter.
- Category tile label — **26 px `borax-variable` weight 750**, black, sitting **below** its image.
- PLP h1 — 32 px `lorimer-no-2` 600.
- PDP h1 — 42 px `borax-variable` 550.

Mobile→desktop growth is deliberately tiny: h1 goes 36 → 42 px (**1.17×**). There is no fluid
`clamp()` anywhere; the scale is a two-step token pair per level.

### 2.4 Product metadata typography — the important part

The card text block is three sizes, all `lorimer-no-2` 600:

| Line | Size / LH | Tracking | Case | Colour |
| :--- | ---: | ---: | :--- | :--- |
| Product name | **18 px / 19.8 px** | normal | Title | `#000000` |
| Descriptor line | **11 px / 12.65 px** | 0.22 px (0.02 em) | UPPERCASE | `#656563` |
| Price | **14 px / 16.1 px** | 0.28 px | UPPERCASE | `#000000` |

The descriptor is machine-composable from attributes: *gender + colour + material + silhouette*
("Men's Cafe Goat Cowboy Boot"). Every card on the site carries it. This is the mechanism that
makes a grid of near-identical brown boots legible — **the differentiator is stated in words, at
11 px, under every image**.

Price is preceded by a 1 × 1 px visually-hidden `Price:` label for screen readers.

### 2.5 Buttons and nav

- Primary CTA text: **14 px `lorimer-no-2` 600 uppercase, 0.02 em, centred** (`text-c3`).
- Nav top-level: **16 px `lorimer-no-2` 600 uppercase, 0.32 px tracking**.
- Mega-menu links: 14 px `lorimer-no-2`, 700 for group headers, underlined with
  `hover:no-underline` (inverted — the default state is underlined).
- Body copy: 16 px / 22.4 px `mundial` 400.

---

## 3. Colour

### 3.1 Recovered palette (from compiled utilities, not eyeballed)

| Token | Hex | Where |
| :--- | :--- | :--- |
| `bg-web-beige` | `#FCF9F4` | Page background, nav |
| `bg-desert-fade` | `#F3E9DF` | Promo bar |
| `bg-tan-light` | `#F0ECE7` | **Image wells** behind every product photo |
| `bg-web-ranch-light` | `#EFE6DB` | Soft surfaces |
| `bg-clay` | **`#A75742`** | **Footer** — the only saturated block on the page |
| theme button | **`#A94619`** | Primary CTA (`hsl(18.8 74.2% 38%)`) |
| theme button hover | `#A75842` | CTA hover |
| `bg-web-ranch` | `#975B11` | "Best Seller" badge fill (at 93 % alpha) |
| `bg-green-200` | `#696F42` | Olive accent, wordmark hover |
| `bg-green-400` | `#314838` | Deep pine |
| `bg-green-100` | `#E3EBE5` | Pale sage surface |
| `border-desert-dusk` | `#E9A877` | Warm rule |
| `text-*` grey | `#656563` | Descriptor line |
| nav-link-alt | `#69757C` | Muted/inactive |
| `border-theme-border` | ≈ `#E0E0DB` | Hairlines |
| `bg-web-error-red` | `#EB0000` | Error |

### 3.2 The themer

Colours are **not** on `:root`. They are `--twc-theme-*` HSL triples set on **`<body>`**
(`tailwindcss-themer`), consumed as `hsl(var(--twc-theme-nav) / …)`:

```
--twc-theme-nav:            37.5 57.1% 97.3%   → #FCF9F4
--twc-theme-color:          0 0% 0%
--twc-theme-border:         60 6.2% 87.5%
--twc-theme-button:         18.8 74.2% 38%     → #A94619
--twc-theme-button-hover:   12.5 43.3% 45.7%
--twc-theme-background-alt: 37.5 57.1% 97.3%
--twc-theme-color-lighter:  68 25.4% 34.7%     → olive
--twc-theme-nav-alert:      18.8 74.2% 38%     (used for "Last Call")
--twc-theme-nav-link-alt:   202.1 8.3% 44.9%   → #69757C
```

A campaign or seasonal template swaps a class on `<body>` and the entire chrome — nav fill, borders,
button fill, hover, alert accent — recolours. Components never name a colour.

**Second layer:** the hero component takes colour as **CMS data via inline style**:
`h1 style="color:#FFFFFF"`, sub-copy `style="color:#ffffff"`, CTA
`style="background:rgba(246,149,125,1);color:#000000"`. The current campaign CTA is a peach fill with
**black** label — a value that exists nowhere in the token set. So: tokens govern the chrome,
inline data governs the campaign slot.

### 3.3 UI colour vs photographic colour

Count the coloured pixels on the homepage: one 44 px promo bar, one ~358 × 46 CTA, one badge, one
479 px footer. **Everything else is cream, black, and photographs.** Total chrome colour is well
under 15 % of the 4 653 px page height. Category tiles put a 26 px black label *under* the image
rather than over it. There is exactly one full-bleed dark section (the 280 px store band) and one
saturated block (the footer).

### 3.4 Computed contrast (calculated, not assumed)

| Pair | Ratio | Verdict |
| :--- | ---: | :--- |
| `#000000` on `#FCF9F4` | ≈ 20.4 : 1 | Pass |
| `#656563` descriptor on `#FCF9F4` | **5.56 : 1** | Pass AA at 11 px |
| White on `#A94619` (primary CTA) | **5.87 : 1** | Pass AA |
| White on `#A75742` (footer) | **5.14 : 1** | Pass AA |
| `#69757C` inactive tab on `#FCF9F4` | **4.50 : 1** | Exactly at threshold |
| Focus ring `#000000` on `#FCF9F4` | ≈ 20.4 : 1 | Far exceeds the 3 : 1 non-text requirement |

For contrast with the L&B blueprint: the audit found L&B's specified Oxidized Silver focus ring at
**2.18 : 1**. Tecovas' answer is simply *black*.

---

## 4. Homepage — band by band

Measured at 1440 × 900. Header occupies 0–156. Document height **4 653 px**.

| # | Band | Top | Height | Carried by | Bleed |
| ---: | :--- | ---: | ---: | :--- | :--- |
| 0 | Campaign hero | 156 | **665.6** | HLS video + overlaid text | Full-bleed `w-screen` |
| 1 | Tabbed product rail (New Arrivals / Best Sellers) | 821.6 | 525.8 | 29-slide carousel | Edge-bleed, gutter-aligned |
| 2 | Collection rail with editorial lead tile | 1347.4 | 614 | 440 × 550 photo + 8 product slides | Contained (160 px gutter) |
| 3 | Audience tiles — Mens / Womens / Kids | 1961.4 | 565.6 | 3 photos 360.3 × 450.4 | Contained |
| 4 | Editorial quote | 2527 | 285.2 | **Type only** | Contained, 576 px measure |
| 5 | Category tiles — Boots / Apparel / Accessories | 2812.2 | 565.6 | 3 photos (same component as #3) | Contained |
| 6 | SEO heading + review carousel | 3377.8 | 448.4 | 7 review slides | Edge-bleed |
| 7 | Retail-store band | 3826.2 | 280 | 1 full-bleed photo + centred white type | Full-bleed |
| — | Footer | 4106.2 | 479.1 | `bg-clay` + newsletter + 49 links | Full-bleed |

### 4.1 Rhythm

Bands **butt directly against each other** — band 1 ends at 1347.4, band 2 begins at 1347.4. All
breathing comes from internal padding: `py-7 lg:py-8` (**28 px mobile / 32 px desktop**). Effective
inter-band gap is therefore ~64 px. There is no `space-y`, no divider rules, no alternating
background colours.

Horizontal gutters ladder as `px-4 lg:px-16 xl:px-40 3xl:px-0` with `max-w-9xl`:
**16 px → 64 px (≥1024) → 160 px (≥1280) → 0 with a max-width cap (≥1920)**.

### 4.2 The hero, in detail

```
aspect-[0.8] md:aspect-[1.442] lg:aspect-[1.803] xl:aspect-[2.163]
2xl:aspect-[2.704] 3xl:aspect-[3.194]
```

**The hero is never sized in `vh`.** It is an aspect-ratio ladder: 4:5 portrait on phones widening to
3.19:1 letterbox on very wide screens. Consequences worth stealing: zero CLS, a predictable crop
target for the art director at each breakpoint, and no `100vh` mobile-toolbar bug.

Video: `<video autoplay muted loop playsinline preload="auto" aria-hidden="true" crossorigin>` with
**four sources in priority order** — HLS `.m3u8` first, then MP4 1080p @ 4.8 Mbps, 720p @ 3.0 Mbps,
480p @ 1.2 Mbps. Poster is a **540 px-wide** JPEG with `crop=center`. Clip length 10 s, source
852 × 480 on the served rendition.

**Pause control (WCAG 2.2.2):** a single `<button aria-label="Pause">` with
`absolute z-10 inset-0` — **the entire 1440 × 665.6 hero is the pause target** — carrying a visible
64 × 64 white glyph at `right-6 top-6` with
`drop-shadow-[2px_2px_20px_rgba(0,0,0,0.9)]`. Compliance at zero layout cost and a target size
roughly 750× the 24 × 24 minimum.
*Trade-off:* the hero is also wrapped in an `<a>` to the collection, so a click on the imagery
**pauses rather than navigates**; only the explicit CTA navigates.

**No scrim.** There is no gradient, no overlay, no `bg-black/40`. White type sits directly on video.
The only legibility defence is art direction (dark asphalt behind the headline) plus a drop-shadow
on the icon. This is a deliberate but genuinely risky choice — one campaign asset with a bright sky
in the lower-left breaks the h1.

Text block: `absolute inset-0 flex px-4 py-6 md:px-40 md:py-20 justify-start items-center` with
`min-w-[640px]` — left-aligned, vertically centred, at the 160 px gutter.

CTA: `rounded` (4 px), `py-3`, `max-w-[358px] min-w-[270px]`, label 14 px uppercase.

### 4.3 The product rail

`<section aria-live="polite" aria-roledescription="carousel">` with slides marked
`role="group" aria-roledescription="slide" aria-label="Slide 1 of 29"`. Tabs above are correct ARIA:
`role="tablist"` / `role="tab"` with `aria-selected`, `aria-controls` and **roving `tabindex`
(0 / −1)**. Active tab = solid black bottom border overlapping the tablist hairline via `-mb-[1px]`;
inactive = transparent border + muted `#69757C` text.

Slide width is a named token per breakpoint —
`w-carousel-mobile md:w-carousel-tablet lg:w-carousel-desktop xl:w-carousel-xl` — and the first and
last slides take the page gutter as margin
(`first:ml-4 lg:first:ml-16 xl:first:ml-40`). Net effect: **the rail bleeds to the viewport edge but
its first card aligns exactly with the page grid.**

**The homepage rail shows no price.** Name + descriptor + save. Price appears only on the PLP and PDP.

### 4.4 Editorial quote band

285.2 px tall, no background colour, no image. A single 42 px / 50.4 px `borax-variable` 550
sentence, centred, in a **576 px** measure. This is the site's only pure-typography moment and it is
given a full band. Cheap, and it does the work that a $200k film would otherwise be asked to do.

### 4.5 Review band

Not a testimonial wall. Each of the 7 slides carries: 5 stars → **"5/5"** → **the exact product and
colourway** ("The Cartwright – Scotch") → a review title → the verbatim → a first-name + initial.
Attaching every review to a named colourway turns social proof into a merchandising surface.

### 4.6 Store band

1425 × 280 full-bleed photograph, centred white 26 px `borax-variable` h2, one line of body copy, and
a **text-only underlined CTA** (18 px `lorimer-no-2` uppercase). Again no scrim.

### 4.7 Footer

`bg-clay #A75742`, white text, padding **32 px / 80 px / 40 px**, 49 links.
Layout `grid-cols-1 xl:grid-cols-[minmax(33%,550px)_minmax(0,1fr)] xl:gap-12` — newsletter form on
the left, four link columns on the right. Input is `h-12` with `rounded`, label is `sr-only`, and the
subscribe button starts `aria-disabled="true"`.

---

## 5. PLP — `/shop/boots/mens/cowboy-boots`

### 5.1 Page frame

```
mx-auto grid grid-cols-1 lg:grid-cols-[342px_minmax(0,1fr)] gap-10
```

At 1440: page x-inset **80 px**, total 1264.8 px, **342 px filter rail + 882.8 px results**, 40 px
gap. Document height **10 436 px** desktop / **11 721 px** mobile for 56 results.

`<h1>` "Cowboy Boots" at y = 212.1, 32 px `lorimer-no-2` 600.

### 5.2 Grid

```
grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4
gap-x-2 sm:gap-x-4  gap-y-6 md:gap-y-10
```

| Viewport | Columns | Card width | Column gap | Row gap |
| :--- | ---: | ---: | ---: | ---: |
| 375 | **2** | 167.5 px | 8 px | 24 px |
| 1440 | **3** | 283.6 px | 16 px | 40 px |
| ≥1920 | 4 | — | 16 px | 40 px |

**Two columns on mobile, never one.** Breakpoint ladder is custom: 320, 400, **536**, 768, 1024,
1280, 1536, 1920, 2268 (`sm` is 536, not Tailwind's default 640).

### 5.3 Card anatomy — 283.6 × 496.1 at 1440

1. **Media well** — `overflow-hidden rounded-none bg-tan-light` with inline `style="aspect-ratio:0.8"`.
   Image 283.6 × 354.5, `object-fit: cover`, source **2000 × 2500 PNG** from Sanity served as
   `?w=500&fit=max&auto=format` (content-negotiated WebP/AVIF). First card is `loading="eager"
   fetchpriority="high"`; the rest lazy.
   *The well is a filled rectangle with square corners — the image is **bare, not framed**; the tan
   fill exists only so a transparent-background PNG reads as an object on a surface.*
2. **Badge** — top-left, `m-1.5 md:m-2 rounded-sm border`, colours delivered as **inline style from
   the CMS** (`background: rgba(151,91,17,0.93); border-color:#975B11; color:white`). 14 px
   `lorimer-no-2` uppercase.
3. **In-card image carousel** — 11 images, `aria-roledescription="carousel"`, prev/next 32 × 32
   `bg-white/80` buttons at 50 % height, `opacity-0 group-hover:opacity-100
   focus-visible:opacity-100`. Their accessible names **announce the destination image's alt text**
   ("Next: Show Person wearing a brown jacket, light blue jeans, brown cowboy boots…").
4. **Save-for-later** — 24 × 40, right-aligned, top of the text block.
5. Product name 18 px, descriptor 11 px, price 14 px (see §2.4).
6. **Colour swatches** — 32 × 32 buttons, `rounded-[5px]`, `p-0.5`, **36 px pitch** (4 px gap),
   border shown on the selected swatch only, `active:top-px` for a 1 px press. Overflow indicator
   "+ 5" at 28 × 28. Fourth swatch is `max-[400px]:hidden`.
   Selecting a swatch retargets the card link to `/products/the-doc?color=cafe-goat` — **colour is a
   query parameter, not a separate URL**.
7. **Quick Add** — 89 × 20 text button, always visible (`opacity-100`), opens a dialog.

Metadata occupies **141.6 px** of the 496.1 px card. The image is 71 % of the card.

**Hover** does three things only: reveal the carousel arrows, reveal the underline on links, and swap
image opacity within the carousel. No lift, no shadow, no scale, no zoom. Everything is a 150 ms
opacity transition.

### 5.4 Filters

- **Desktop: a static 342 px sidebar** (`hidden h-auto lg:block`). Notably **not sticky** — it
  scrolls with the page over its 3 028 px height.
- **Mobile: a modal** — one control, `"Open the Filter products dialog"`, an 84.6 × **20 px** text
  button. *That 20 px height fails WCAG 2.2 SC 2.5.8 (24 × 24 minimum).*
- Applied filters render as removable pills, **40 px tall**, labelled with facet **and** value
  (`Gender: Men ✕`, `Category: Boots ✕`, `Style: Cowboy ✕`) plus a "Clear All".
- Each facet group is a `<fieldset>` with a **visually-hidden `<legend>`** ("Filter by Toe Shape")
  and a 50 px `<button aria-expanded>` accordion header. Values are `<button>` pills (40 px) rather
  than checkboxes — one exception, the in-stock toggle, is a 247.4 × 60 control at the top.

**Facet inventory (14 groups, extracted in full):**

| Group | n | Values |
| :--- | ---: | :--- |
| Available | 1 | Show in-stock items only |
| Collection | 2 | New Arrivals, Best Sellers |
| Gender | 1 | Men |
| Category | 1 | Boots |
| **Style** | 6 | Cowboy, Work, Ranch, Zip, Horseman, Roper |
| **Toe** | 5 | *Shape*: Round, Cutter, Square, Snip · *Protection*: Composite Toe |
| **Material** | 12 | Alligator/Crocodile, Caiman, Lizard, Ostrich, Python, Bison, Calfskin, Carpincho, Cowhide, Deerskin, Goat, Suede |
| **Sole** | 3 | Leather, Hybrid, Rubber |
| **Occasion** | 3 | Daily Life, Formal Events, Hard Work |
| **Feature** | 6 | Exotic, Removable Footbed, Slip Resistant, TEC, Waterproof, Water Resistant |
| Colour | 8 | Blue, Dark Blue, Tan, Brown, Dark Brown, Gray, Black, Green |
| Size | 15 | 7 → 13 in halves, then 14, 15 |
| **Width** | 2 | D-Average, EE-Wide |
| Price | 2 | $250–$500, $500+ |

Three of these are the interesting ones:

- **Toe Shape ships as SVG silhouettes**, one 48 × 48 icon per value, `sizes="48px"`, with the shape
  name as alt. A visual facet for a visual attribute.
- **Occasion** is not a product attribute — it is a merchandiser-assigned use case. It is the only
  facet that answers "what am I buying this *for*".
- **Material at 12 values, 8 of them exotic hides**, is the material-honesty principle expressed as
  navigation rather than as prose.

### 5.5 Sort and pagination

Sort is a **native `<select>`**, 135 × 40, top-right of the results column at y = 337.6. Five options:
Recommended (default) · New · Best sellers · Price: low–high · Price: high–low. Native = zero JS,
correct on every mobile OS, free accessibility.

Results count renders as "56 Results". **No pagination and no "Load More" control** — all results are
rendered into one grid (49 items measured in the DOM node). Grid height 8 585.8 px desktop.

### 5.6 SEO block

Below the grid: `<h2>Related Searches</h2>` followed by `<h3>` internal links —
"Mens Black Cowboy boots", "Suede Cowboy Boots", "Ostrich Cowboy Boots" etc. These are pre-built
facet combinations promoted to crawlable links, which is the counterpart to the `robots.txt` rule
that **blocks every raw facet query string** (see §8.4).

---

## 6. PDP — `/products/the-buck` (the depth benchmark)

Total document height **4 984 px** at 1440 × 900 (**7 358 px** at 740). Layout: gallery **710 px**,
buying panel **450 px**, content x-range 112.5 → 1312.5.

### 6.1 Gallery

- Container 710 × 766.3, **`sticky top-[128px]`** — the gallery pins while the buying panel scrolls.
- **Vertical thumbnail rail on the left**: 8 thumbs at **80 × 97** on a 97 px pitch (no gap),
  x = 112.5, plus a "Scroll to the next set of thumbnails" control at 80 × 26.
- Main stage **613 × 766.3**, aspect 0.8, images laid on a horizontal track at a 625 px pitch.
- **8 images for this product** (16 `<img>` in DOM = 8 stage + 8 thumbs). Sources are
  **2000 × 2500 PNG** served at `?w=920&fit=max&auto=format`.
- Thumb accessible names carry position and state:
  `"Scroll the gallery to image 1 of 8. The Buck. Selected."`
- **Fullscreen control** — 30 × 30 "Expand slide to full screen" at the bottom-right of the stage.
  There is no hover-zoom / magnifier; zoom is an explicit, keyboard-reachable mode.
- Product **video is not in the gallery**. Video appears only inside the fit guide (see §6.4).

### 6.2 Buying panel — exact order

1. **h1** — 42 px `borax-variable` 550.
2. **Rating** — "4.6" + 5 stars + "232", anchoring to the reviews section.
3. **Price** — `$275`, preceded by a visually-hidden `Price:`.
4. **`Color: Light Tobacco`** — attribute : value pair.
5. **`Material: Cowhide`** — material named *above the fold*, before the swatches.
6. **Colour swatch group** (`"Select a color for The Buck"`), 6 colourways.
7. **Construction line** — "Rubber / Hybrid Outsoles".
8. **`Size:`** row carrying, on the same line, **"Size sold out? Select size to get notified."** and a
   **Fit Guide** link. The out-of-stock path is offered *before* the shopper hits the dead end.
9. **Size grid** — 15 buttons, **46.4 × 46.4** (`aspect-square rounded-[10px] border-gray-300`),
   50.4 px pitch.
10. **`Width:`** — D-Average / EE-Wide.
11. **Primary CTA** — 450 × 51.4, `rounded` (4 px), `#A94619` on white text, `cursor-not-allowed`,
    labelled **"Select Your Size"**. The button's label *is the next required action*; it becomes
    Add-to-Cart only once the selection is valid. No error state is ever needed.
12. **A single verbatim review, inline in the buying panel** — 5 stars, the quote, "Jack B. /
    Verified Buyer". Social proof above the fold, not 4 000 px down.
13. **Save** (login-gated) and **Share → Copy Link**.
14. **Shipping promise** with a box icon.
15. **Store availability** — "Check store availability" → "Select a size to begin". Local inventory
    is bound to the size selection.

**There is no sticky add-to-cart bar** on desktop or at 740 px. The CTA sits inline at y ≈ 672
(desktop) / 1 024 (740 px) and scrolls away.

### 6.3 Craft and material storytelling — below the panel

| Block | Content measured |
| :--- | :--- |
| `<h2>` product story | ~110 words: material, break-in behaviour, footbed, lining, outsole, shaft height, stitching, pull straps |
| `<h3>` Key Features | Icon chips — Removable Footbed, Rubber Outsole |
| `<h3>` Details | **10 construction bullets**: vamp/counter material · heel height *and* composition (“1½″ leather compound heel with a solid recycled leather base”) · toe shape · footbed · shaft lining + 11″ height · stitching · sole · lining · **Goodyear leather-welt construction** · pull straps |
| Disclaimer | Natural-hide variation notice, italic |
| Link | Gendered fit guide |

Then three **collapsed** accordions (`aria-expanded="false"`, 343 × 40 each):

- **Material & Care** — the material name, a ~60-word essay on that specific leather, three care
  instructions (each naming their own care product), a one-line summary, and a "read full care guide"
  link. **A cross-sell sits inside this accordion**: a care kit with its own Add-to-Cart and price.
  The accessory attach happens at the exact moment the shopper is being told the boot needs care.
- **Design Process** — four hand-process bullets.
- **Shipping & Returns** — free-shipping threshold, expedited options, PO Box exclusion, 30-day
  window, condition requirements, and the practical instruction to try boots on carpet.

### 6.4 Fit guidance — structured, not a JPEG

From the route payload, `fitGuide` is a Sanity document with:

- Intro paragraph, then `<h4>` "Determining Your Size".
- **`fitDetails[]` — four entries**, each a heading plus a 1074 × ~370 diagram:
  1. *Discomfort in the Toes / Heels* — alt: "No/slight heel lift: correct fit. Excessive heel lift:
     half-size down. Cramped toes: half-size up."
  2. *High Arch or High Instep* — alt: "High Instep: half size up. High Arch: half-size up. If you
     have both high instep and high arch, order half size up."
  3. *Narrow or Wide Foot Width* — alt: "Average Width (D): Order usual size. Wide Width (E or EE),
     +0.5 inch: Order EE-Width"
  4. *In-between Sizes* — plain text: "If you're in between sizes, order the smaller size."

**The rule lives in the alt text, not only in the picture.** A screen-reader user gets the identical
advice a sighted user gets. This is precisely the remedy for the L&B failure recorded in the
constitution (§8.4: the current size chart is a single JPEG with zero text).

- **Fit-guide video** with a **`.vtt` transcript file**, delivered in four renditions: HLS m3u8, MP4
  1080p, MP4 720p, MP4 480p @ 0.9 Mbps, plus a preview JPEG.

### 6.5 Product data model (recovered from the route payload)

**Product:** `id` (`tecovas_product_M10090`) · `slug` · `gender` · `productType` · `silhouette` ·
`toeShape {value:'round-toe', label:'Round'}` · `categories[]` with `parent` · `details[]` ·
`primaryText[]` · `fitGuide` · `fitDetails[]` · `secondaryAssets[]` · `reviewSummary
{ratingAverage: 4.5603, ratingCount: 232}` · `shopifyParentId` · `colorways[]`.

**Colorway:** `stylecolorId` (`M11214CLA`) · `colorwayId` · `material` · `bootSole` · `swatch` ·
`badge {value:'New'}` · `keyFeatures[]` · `occasions[]` · `mediaCount` · `launchDate`
(`2026-08-13T08:00:00-05:00`) · `finalSale` · `promotions[]` · `afterpay` · `assortmentRole` ·
`colorwayType` · **`outOfStockStatus: "waitlist"`** · `status: "Active"` · `variants[30]`.

Structured data is `ProductGroup` with `variesBy: [color, material]`, six `hasVariant` `Product`
entries each with its own `?color=` URL, image, material and description, and an
`AggregateOffer { lowPrice: 275, highPrice: 295, offerCount: 180 }`.
**180 offers = 6 colours × 15 sizes × 2 widths, under one product record.** Plus `BreadcrumbList`
(5 levels), `AggregateRating`, five embedded `Review`s, `MerchantReturnPolicy` and
`OfferShippingDetails`.

SEO description is templated from attributes: *"[Name] [gender] [toe] [type] in [colour] [material] —
[construction], [sole], and [footbed]."*

### 6.6 Server rendering split

| Surface | Raw HTML | Deferral markers | Verdict |
| :--- | ---: | ---: | :--- |
| Homepage | 574 145 B (`<main>` only **51 730 B**) | 0 | **Hero + one product rail only.** Bands 2–7 are client-rendered; the server HTML ends in a loading spinner. Rail cards have names + descriptors but **no images and no prices**. |
| PLP | 949 388 B | **0** | Fully server-rendered — names, descriptors, prices, images, all 14 facet groups, sort. |
| PDP | 1 247 950 B | **3** (`<!--$?-->` + `<div hidden id="S:`) | Shell = first **46 %** of the document and contains h1, price, gallery, sizes, details, accordions. Deferred: `completeTheLookFetcher`, `recommendedProductFetcher`, `careGuideFetcher`, `pdpSettingsFetcher`. |

**The split is the right one on the commerce surfaces and the wrong one on the homepage.** Product
truth is never behind a Suspense boundary on the PDP; only recommendations, complete-the-look and the
care guide are. But a JavaScript-disabled visitor to the homepage gets a hero, one rail of untitled
image wells, and a spinner.

---

## 7. Motion and transitions

The entire motion system, read out of the compiled CSS:

| Property | Value |
| :--- | :--- |
| Transition durations in use | **150 ms** (×12 — the default), 200 ms (×1), 300 ms (×1), 500 ms (×1) |
| Easing curves | **`cubic-bezier(.4,0,.2,1)`** (×12) and `cubic-bezier(0,0,.2,1)` (×1) — **two, total** |
| Keyframes defined | 11: `fade-in`, `fade-out`, `slide-up`, `slide-down`, `spin`, `pulse`, `loading`, `shake`, `bounce-down-subtle`, `delay-visibility-off`, `marquee-scroll` |
| Scroll mechanics | `scroll-snap-type: x` on carousels; `scroll-pt-16 lg:scroll-pt-36` on `<html>` for anchor offset |
| Scroll-driven animation | **None.** No `animation-timeline`, no `view-transition`, no `@scroll-timeline` |
| Libraries | **None.** No GSAP, no ScrollTrigger, no Framer Motion, no three.js, no Lenis, no Locomotive, no Swiper, no Barba. (jQuery 3.7.1 is present, loaded by a third-party tag, not by the storefront.) |

**What actually animates:**

- Opacity fades on hover — carousel arrows, nav underline, card image crossfade (150 ms).
- Mega-menu panel — opacity + the 300 ms `delay-visibility-off` visibility hand-off.
- Nav scrim — opacity.
- Swatch press — `active:top-px`, a 1 px nudge.
- Loading states — `spin`, `pulse`, `loading` shimmer.
- A marquee, where used.

**No parallax. No scroll-jacking. No pinned sections. No entrance animations on scroll.** The page is
static until you touch it.

**`prefers-reduced-motion`** — Tecovas' own CSS ships **two** blocks:

```
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\:animate-none    { animation: none }
  .motion-reduce\:transition-none { transition-property: none }
}
@media (prefers-reduced-motion: reduce) {
  .animate-marquee-scroll { animation-play-state: paused }
  .transition-opacity     { transition: none !important }
}
```

A further five blocks come from the support-chat vendor. This is thin but honest: the only
uninitiated motion on the site is the marquee and the hero video, and the marquee is paused. **The
hero video is not paused by the media query** — it relies on the pause button instead, which is the
letter of 2.2.2 but not the spirit of a reduced-motion preference.

---

## 8. Technology

### 8.1 Stack (confirmed by their own `agents.md` and by asset paths)

| Layer | Technology |
| :--- | :--- |
| Storefront | **Shopify Hydrogen, React Router 7**, deployed on **Shopify Oxygen** (`cdn.shopify.com/oxygen-v2/…`), bundled with **rolldown** |
| Commerce / checkout | Shopify, checkout at `checkout.tecovas.com` |
| CMS | **Sanity** (`cdn.sanity.io/images/v8kybopt/production/…`) — product copy, media, fit guide, page-builder modules |
| Styling | **Tailwind** + `tailwindcss-themer` |
| Search / facets | **Algolia** |
| Reviews | **Junip** (`--junip-*` custom properties) |
| Support | Gladly / Atlas widget |
| Email capture | **Klaviyo** + **Wunderkind** (`bx-slab` overlays; three offer variants preloaded) |
| Analytics / RUM | GTM, Google Ads, **Heap**, **SpeedCurve** |
| Store locator | `locator.tcvs.io` |
| Fonts | Adobe Typekit (`use.typekit.net`) |

### 8.2 Page-builder module taxonomy

The bundle names expose a **lettered, numbered, versioned module library** that merchandisers compose
pages from: `PageBuilder`, `B2.1_ContentBlocks`, `B3.1_ContentCarousel`, `C4_BlogTileCarousel`,
`C4.2_FlipCards`, `ModuleText`, `Tabs`, `QAndA`, `UGCCarousel`, `ProductReviews`, `AccountBanner`,
`U_CustomComponent`. The homepage is **data**, not code — which is why bands can be reordered and
recoloured per campaign without a deploy.

### 8.3 Weight (measured)

| Page | First-party JS modules | Raw | **gzip** | CSS |
| :--- | ---: | ---: | ---: | :--- |
| Homepage | 31 | 1 167.1 KB | **350.6 KB** | 11.1 KB raw / 2.5 KB gzip external + **105 KB inlined `<style>`** |
| PDP | 45 | 1 267.6 KB | **384.1 KB** | same |

The PDP session showed **133 JS resources totalling 2 640 KB decoded** once third-party tags are
included. Third parties observed: doubleclick, googleadservices, google, GTM, Heap, SpeedCurve,
armanet, Square CDN, Gladly, `locator.tcvs.io`.

CSS strategy is good: critical CSS **inlined** (105 KB in the HTML), 2.5 KB gzip external, five
`woff2` faces preloaded `fetchpriority="high"` (three with the escaping bug of §2.1).

**Against L&B's contract:** the budget is **≤ 180 KB compressed initial JS**. Tecovas is at roughly
**1.9× on the homepage and 2.1× on the PDP** before third-party tags. Tecovas is a benchmark for
merchandising depth, **not** for payload.

### 8.4 Images, video, URLs

- **Product photography is 2000 × 2500 PNG (4:5) in Sanity**, delivered through the Sanity pipeline
  with `?w=<n>&fit=max&auto=format` — `auto=format` content-negotiates WebP/AVIF. Editorial masters
  are much larger (7659 × 5108 observed).
- Responsive `sizes` are hand-tuned per component, e.g. the PLP card ships eight breakpoints from
  400 px to 600 px.
- First card is `loading="eager" fetchpriority="high"`; everything else `loading="lazy"
  decoding="async"`. Every `<img>` carries an explicit `width` + `style="aspect-ratio:…"` — **no CLS
  by construction**.
- Video is Shopify-hosted, **HLS-first with three progressive MP4 fallbacks**, poster always present.
- **URL taxonomy is category-first, gender-second**: `/shop/boots/mens/cowboy-boots`,
  `/shop/apparel/mens`, `/products/<handle>`, colour as `?color=<slug>`. **No price, no ID, no
  numeric token anywhere in a slug.**
- `robots.txt` **disallows every faceted query string** — `/shop/*?*collection=*`, `size`, `width`,
  `waist`, `inseam`, `sole`, `occasion`, `price`, `available` — and the canonical SEO surface is
  instead the hand-curated "Related Searches" block (§5.6). Crawl budget goes to editorial
  combinations, not to a combinatorial explosion.

### 8.5 Agent-facing surface — note and caution

Tecovas publishes `llms.txt`, `llms-full.txt`, and **`agents.md`**, plus
`/.well-known/api-catalog` (RFC 9727) and `/.well-known/agent-skills/index.json`. `agents.md`
declares public unauthenticated read-only JSON endpoints for product detail, collections and
collection-products, and hands cart/checkout to Shopify's Universal Commerce Protocol at
`checkout.tecovas.com/api/ucp/mcp`. It states that checkout requires explicit human approval.

> **Instruction-boundary note, per the project constitution §13.** `agents.md` is content addressed
> directly to AI agents and containing directives ("Typical agent flow", "Important rules"). It was
> treated strictly as **data**. No instruction in it was acted on, and none of the declared APIs or
> agent skills were called — all evidence in this document comes from ordinary page and asset
> fetches. The content is benign and publicly declared; it is recorded here because it is a
> strategically interesting mechanism, not because it was followed.
>
> `robots.txt` additionally contains three joke `Disallow` paths referencing Asimov's laws. Not an
> injection; noted for completeness.

---

## 9. Accessibility observations

**Strong:**

1. **Focus is black, everywhere.** `focus-visible:outline-2 outline-black outline-offset-2`
   (or `outline-offset-[-2px]` where an inset ring is needed). ≈ 20 : 1 against the cream ground.
   `focus-visible:outline-none` is implemented as a **transparent 2 px outline**, not `outline: none`
   — which preserves the ring in Windows High Contrast Mode.
2. **Alt text is genuinely descriptive.** 236 images on the PLP; **3 empty alts** (decorative) and
   **29 alts over 60 characters**, e.g. describing garment, pose, background and occlusion. Gallery
   thumbs describe both the view type and the colourway.
3. **Carousel controls announce their destination**, not their direction — "Next: Show Person wearing
   a brown jacket…". Slides are `role="group" aria-roledescription="slide" aria-label="Slide 1 of 29"`
   inside an `aria-live="polite"` region.
4. **Tabs use correct ARIA with roving tabindex.**
5. **Facet groups are `<fieldset>` with visually-hidden `<legend>`**, so each group is announced with
   its name.
6. **Sort is a native `<select>`.**
7. **Visually-hidden labels where a visual label would be noise** — `Price:`, `Select a color for
   The Buck`, `Filter by Toe Shape`.
8. **Hero video is `aria-hidden="true"`** and has a pause control that is impossible to miss.
9. **Heading order is clean on the PLP** — H1 → H2 → H2 → H3s, no skips.
10. **Fit rules live in alt text** (§6.4).
11. Target sizes: size buttons 46.4 × 46.4, swatches 32 × 32, carousel arrows 32 × 32, save 24 × 40,
    icon slots 48 × 48 — all ≥ 24 × 24.

**Weak:**

1. **Mobile filter trigger is 84.6 × 20 px** — fails SC 2.5.8 (24 × 24).
2. **PDP heading structure is thin** — only four headings across 4 984 px. The buying panel has no
   heading at all, and the reviews region's headings live inside the third-party widget.
3. **No scrim under hero text.** White on video with no guaranteed contrast floor; SC 1.4.3 depends
   entirely on the campaign asset. Same on the store band.
4. **The whole hero is a pause button that sits above a link**, so clicking the imagery does not
   navigate. Discoverable, but surprising.
5. **`prefers-reduced-motion` does not pause the hero video** — only the marquee.
6. **Homepage is not usable without JavaScript** (§6.6).
7. Inactive tab colour lands at exactly **4.50 : 1** — no margin.

---

## 10. What Frontier House should take

Ordered by value to a **wholesale-first Texan house**, and explicit about what does *not* transfer.

### 10.1 Take, in Phase 1

**1. The aspect-ratio hero ladder, not a `vh` hero.**
Adopt the pattern: `aspect-[0.8] md:aspect-[1.44] lg:aspect-[1.80] xl:aspect-[2.16] 2xl:aspect-[2.70]`.
It costs nothing, guarantees CLS ≈ 0, tells the photographer exactly which crops to deliver per
breakpoint, and sidesteps the mobile-toolbar `100vh` bug. This is a **poster-first** hero by
construction, which is what §9 of the constitution already demands.
*Data needed:* one campaign still per breakpoint band, art-directed for a left-anchored text block.

**2. The descriptor line under every product name.**
`Women's Wine Cowhide Cowgirl Boot` at 11 px uppercase, 0.02 em, `#656563`. Compose it from
`gender + colour + material + silhouette`. For L&B this becomes something like
*"Women's · Turquoise · Embroidered Yoke Shirt"* — it is the single cheapest thing that makes a
grid of 235+ seasonal styles legible, and it is generated, not written. It also doubles as the
`ProductGroup` SEO description template (§6.5).
*Data needed:* four clean attributes per style. This is the **first thing to demand from the owner's
product data**, ahead of photography.

**3. Faceted filtering built on real garment attributes, and the visual facet.**
Tecovas' 14 groups map almost one-to-one onto what a boutique buyer needs from a western apparel
manufacturer. Translate:

| Tecovas facet | L&B equivalent | Why it matters to a buyer |
| :--- | :--- | :--- |
| Toe Shape (SVG icons) | **Sleeve / neckline / yoke silhouette, as icons** | The visual attribute buyers actually scan for |
| Material (12) | Fabric + finish | Material honesty as navigation, not prose |
| Occasion (3) | **Sell-through occasion** — rodeo, market, everyday, event | The only facet that answers "what am I buying this *for*" |
| Style (6) | Category within a class | |
| Feature (6) | Construction features — snap, embroidery, stretch, fringe | |
| Width (D / EE) | **Size range: standard / plus** | Directly serves D-04 without prejudging it |
| Size (15) | Size run | |
| Available | In-stock only | |
| — | **Prepack composition, MOQ progress, ship window** | Restricted; buyer-only |

The constitution already requires faceted filtering (§11). Tecovas proves the shape. **Copy the
information architecture, never the values.** The icon facet is the one to build first — it is
distinctive, it is cheap (one SVG per silhouette), and no wholesale platform does it.

**4. `robots.txt` disallows every facet query string; curated combinations become links.**
This is the correct SEO posture for a faceted PLP and it is *also* a security posture for L&B: it
keeps buyer-relevant query permutations out of the index. Pair it with a curated "Related" block of
hand-approved combinations. Note this is a courtesy, not a control — the authorisation boundary still
does the real work (§13b).

**5. Native `<select>` for sort. Native `<fieldset>`/`<legend>` for facet groups. Removable chips
labelled `Facet: Value ✕`.**
Zero JS, zero accessibility debt, correct on a mid-range Android, and the chips make an applied
wholesale filter set self-documenting when a buyer returns to a saved view.

**6. The 1 px disclosure button that expands to 32 px on focus.**
The best single idea on the site. It gives a hover mega-menu a real keyboard path without adding a
chevron to every nav item. Use it wherever L&B has a hover-revealed panel.

**7. `delay-visibility-off` for panel dismissal.**
A 300 ms linear `visibility: auto → hidden` animation so the opacity fade completes and the closed
panel leaves the tab order. Pure CSS, no JS timer, no `setTimeout` leak.

**8. Carousel controls that announce the destination image's alt text.**
`"Next: Show a woman in a turquoise yoke shirt against adobe"` rather than `"Next slide"`. Costs
nothing once alt text exists — and L&B already requires meaningful alt on every image (§8.5).

**9. Fit and size guidance as structured content, with the rule in the alt text.**
This is the direct fix for the constitution's §8.4 failure. Model it as Tecovas does: an array of
`{heading, diagram, altText, body}` where **`altText` states the actual rule** ("If you are between
sizes, order the smaller size"). The diagram becomes an enhancement; the rule is always readable,
always in the DOM, always crawlable, always Ctrl-F-able.
*Data needed:* a real size table per garment class from the owner, plus 3–5 fit rules. **This is a
data ask, not a design task.**

**10. Themeable chrome via CSS custom properties on `<body>`, plus CMS-supplied inline colours for
campaign slots.**
Two layers: `--twc-theme-*` for nav/border/button/background so a seasonal template recolours the
whole shell with one class; inline `style` from the CMS for the hero headline, body and CTA so a
campaign can use a colour that is not in the token set. This resolves the tension in D-06/D-07 —
you can ship a neutral, defensible chrome now and let campaigns diverge later **without new
components**.

**11. The CTA label states the next required action.**
"Select Your Size" → becomes Add-to-Order once valid. For L&B's wholesale panel this generalises
beautifully: *"Choose a prepack"* → *"Add to order"* → *"$50 minimum — add $18 more"*. It removes an
entire class of error states, and it is the single clearest way to make prepacks and minimums
unambiguous, as §11 requires.

**12. State the out-of-stock path before the shopper hits it.**
"Size sold out? Select size to get notified." sits *above* the size grid. `outOfStockStatus:
"waitlist"` is a first-class field on the colourway. L&B needs the same for **pre-order** — a
first-class state with ship windows and terms, surfaced before selection, not after failure.

**13. The two-block reduced-motion CSS, plus the whole-surface pause target.**
`animation-play-state: paused` on any marquee and `transition: none !important` on opacity, inside
`@media (prefers-reduced-motion: reduce)`. And make the entire hero the pause control. **But go
further than Tecovas** — L&B's §8.1 requires that reduced motion apply *inside every mode*, so the
hero film must also pause under the media query, not merely offer a button.

**14. Contrast discipline.** Black focus ring. Descriptor grey verified at 5.56 : 1 at 11 px. Every
brand colour checked against the cream ground before it ships. The constitution already names
Tobacco Leather `#734F36` at 6.49 : 1 for focus — that is the same instinct.

### 10.2 Take, but adapt hard

**15. Server-render everything that is a product fact; defer only recommendations.**
Tecovas gets the PDP split exactly right — shell contains h1, price, gallery, sizes and details;
deferred are `recommendedProductFetcher`, `completeTheLookFetcher`, `careGuideFetcher`. **Copy the
split. Do not copy the homepage**, where six of nine bands render only under JavaScript. L&B's CI
Test 1 would fail Tecovas' homepage outright. Use their PDP as the reference implementation and
their homepage as the cautionary example — it is the clearest available proof that this failure mode
arrives one reasonable-looking module at a time.

**16. The module library, renamed for merchandisers.**
A lettered, numbered, versioned set of page modules that a merchandiser composes. Extremely valuable
for a daily-drop wholesale business. But keep the count small: Tecovas ships at least a dozen module
types and pays ~350 KB gzip for it. L&B should target **six to eight** modules, all server-rendered,
inside the 180 KB budget.

**17. The image well.**
`bg-tan-light #F0ECE7` behind a transparent-background PNG at `aspect-ratio: 0.8` — the garment reads
as an object on a surface rather than a cut-out floating on the page. **Only works if the photography
is shot on white/transparent and cut out.** For L&B this is a real production decision: it forces a
studio pipeline and it excludes on-figure lifestyle from the grid. Recommend adopting the 4:5 well
for the *primary* card image and reserving lifestyle for position 2 in the in-card carousel — exactly
what Tecovas does.

**18. The in-card image carousel with hover-revealed arrows.**
Good, and cheap. But note it costs 11 `<img>` elements per card × 49 cards. On a mid-range Android
that is real. Cap it at **3 images per card** and lazy-load beyond the first.

### 10.3 Do NOT take

**19. The JS budget.** 350–384 KB gzip is more than double L&B's contractual 180 KB and Tecovas is
not a cinematic site — that weight buys a page builder, an in-card carousel, and a reviews widget.
L&B's blueprint spends nothing on WebGL in Phases 1–2 precisely so this budget stays intact. Do not
adopt Hydrogen's client footprint as a benchmark; adopt its *rendering split* only.

**20. The unscrimmed hero.** Tecovas can put white 42 px type on video with no overlay because they
control a large, expensive, purpose-shot library and can reject any frame with a bright lower-left.
**L&B has zero production assets** (§13a) and will be working with owner-supplied photography of
unknown consistency. Ship a token-driven scrim (a low-opacity linear gradient in the lower third, or
a solid text panel) that can be dialled to zero per campaign once the library proves it can carry
type unaided.

**21. Consumer social proof anywhere.** Tecovas' review architecture is excellent — product-attributed
verbatims on the homepage rail, one inline in the buying panel, 232 reviews on a single boot, five
embedded in `ProductGroup` JSON-LD. **None of it transfers.** §11 forbids building consumer reviews
without evidence, and §12 forbids invented people. The wholesale equivalent that L&B *does* have
verified is **operational proof**: 100 % fill rate, 2.64-day processing, 4.76/5 across 262 reviews
and 4.7/5 across 353 on two marketplaces. Put *those* numbers where Tecovas puts a verbatim — inline
in the buying panel, next to the pack and the minimum. That is the single highest-value substitution
in this document.

**22. Public pricing on a PLP.** Tecovas is DTC; prices are public and correctly indexed. L&B is
wholesale-first and every price on a category page is **restricted data** (§11). Take the *card
layout* and delete the price row for unauthorised sessions — and delete it from the type, not hide it
with CSS. The unauthorised card should have no price field to omit.

**23. The mobile filter trigger.** 20 px tall. Fails SC 2.5.8. Build a ≥ 44 px control.

**24. Menswear, footwear, kids as navigation.** Tecovas' entire IA is Men / Women / Kids / Work /
Denim. L&B's verified taxonomy (V3.1 Frame 8f) is **Women · Plus · Girls · Accessories & Home ·
Wholesale**, with no menswear (§6, §13a). Do not let the shape of a boot site's nav leak into the
D-04 decision.

**25. Third-party popup layers.** Three preloaded Wunderkind overlay variants plus a Klaviyo capture
plus a chat launcher. On a wholesale surface where the primary action is *apply for an account*, an
interstitial offering a consumer discount is actively wrong.

**26. Non-sticky filter rail.** Tecovas' 342 px sidebar is 3 028 px tall and static — a buyer
refining a 235-style assortment will scroll a long way back to change a facet. Make L&B's sticky
with an internal scroll.

### 10.4 What this teardown says we need before any of it can ship

Confirming the constitution's §15 conclusion — **the critical path is data, not front-end work**:

1. **Four attributes per style** (gender/size-range, colour, material, silhouette) — without these
   the descriptor line, the facets, and the SEO template all collapse. *Highest priority.*
2. **A silhouette taxonomy with an SVG per value** — the icon facet is the distinctive move and it
   needs a named, closed list.
3. **A real size table plus 3–5 fit rules in text**, per garment class. Replaces the current JPEG.
4. **Product photography shot for a 4:5 well**, cut out, at ≥ 2000 × 2500, with a second lifestyle
   frame per style. Plus meaningful alt text authored alongside — Tecovas' alt text is 60+ characters
   and describes garment, pose and background.
5. **Prepack composition, MOQ, ship window and pre-order terms** as structured fields, not prose —
   so the CTA can state the next required action.
6. **The verified operational metrics** as first-class content objects, to occupy the slot where a
   DTC site would put a review.
7. **One campaign still per breakpoint band** for the aspect-ladder hero, plus a decision on whether
   the scrim token starts above zero.

---

## Appendix A — measurement index

| Fact | Value |
| :--- | :--- |
| Header height, desktop / mobile | 156 px / 88 px |
| Sticky element | nav only, `top-0 z-30` |
| Hero height @1440 | 665.6 px (aspect 2.163) |
| Homepage document height | 4 653 px |
| PLP document height | 10 436 px (desktop) / 11 721 px (mobile) |
| PDP document height | 4 984 px |
| Largest heading rendered | 42 px |
| Body copy | 16 px / 22.4 px |
| Smallest metadata | 11 px / 12.65 px, 0.02 em |
| PLP columns | 2 / 2 / 3 / 4 at 375 / 768 / 1440 / ≥1920 |
| PLP card | 283.6 × 496.1; image 283.6 × 354.5 |
| Product well aspect | 0.8 (4:5) everywhere |
| PDP gallery / panel | 710 px / 450 px |
| PDP images | 8 (16 `<img>` incl. thumbs); thumbs 80 × 97 |
| Size button | 46.4 × 46.4, `rounded-[10px]` |
| Primary CTA | 450 × 51.4, `#A94619`, 4 px radius |
| Colour swatch | 32 × 32, 36 px pitch, `rounded-[5px]` |
| Section padding | `py-7 lg:py-8` (28 / 32 px) |
| Page gutters | 16 / 64 / 160 / 0 + max-width |
| Breakpoints | 320, 400, 536, 768, 1024, 1280, 1536, 1920, 2268 |
| Transition durations | 150 ms (default), 200, 300, 500 |
| Easing curves | 2 |
| First-party JS gzip | 350.6 KB (home) / 384.1 KB (PDP) |
| Inlined critical CSS | ~105 KB |
| Facet groups | 14 |
| Sort options | 5, native `<select>` |
| Pagination | none — full render |
| Reduced-motion blocks (first-party) | 2 |
