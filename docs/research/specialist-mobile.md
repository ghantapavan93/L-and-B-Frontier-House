# Mobile experience teardown — reference set at 390px, then our own build

**Status: IN PROGRESS — updated site by site so progress survives a crash.**
Measured: Kimes Ranch, Tecovas, Lucchese, Cinch, Sendero, Miss Me (home only).
Not yet measured: Miss Me (PLP/PDP), Ferrell, Schaefer, GANNI, **our build**.
Skipped without retrying (Cloudflare-blocked to automation, found by the previous run):
Cavender's, Sézane, Wrangler.

Method: in-app browser, viewport **390 × 844**, mobile emulation. All numbers are
computed-style / `getBoundingClientRect` measurements, not estimates. Touch-target
counts cover every visible `a, button, [role=button], select, summary, checkbox, radio`
on the loaded page; "u24" = smaller than 24 × 24 CSS px (WCAG 2.5.8 hard fail),
"u44" = 24–43px (fails the 44px comfort bar, passes AA minimum).

Caveats, recorded honestly:
- Cross-origin `transferSize` is 0 without `Timing-Allow-Origin`, so page-weight
  numbers are only reported where measurable. Asset *dimensions* (natural vs rendered)
  are always measurable and are the sharper srcset instrument anyway.
- Two early captures (Kimes home/PDP, Tecovas home) ran at devicePixelRatio 1.25
  before emulation settled at 2.0; srcset math on those is flagged inline.
- A concurrent agent shares this browser pane and closed tabs mid-run three times;
  every number below was re-verified on a tab we controlled at capture time.
- h1/body scale vs desktop is measured for our build only (budget); reference h1/body
  sizes are reported at 390px.

---

## 1. Kimes Ranch — kimesranch.com (Shopify)

### Home
| Metric | Value |
| :--- | :--- |
| Header | Announcement 64px scrolls away; **header 57px sticky, always visible** (no hide-on-scroll) |
| Survives narrow bar | Logo + Menu / Search / Cart icons — each **22×22 (u24 fail)** |
| Hero | `<video>` 375×560 = **0.66 of viewport**, source **1920×1080 landscape centre-cropped** (`object-fit: cover`) into a portrait box; "HD-1080p-4.8Mbps" file name — desktop asset shipped to mobile |
| First product offset | **815px** (one full swipe below the fold) |
| Product links on home | 17 |
| h1 / body | 14px (logo-as-h1) / 14px |
| Horizontal overflow | 0 |
| Touch targets | n=63: **12–24 under 24px** (all three header icons), ~24 more under 44px |

### PLP `/collections/womens-jeans`
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 20, 190), card 164px wide |
| First product offset | **862px — zero cards visible at 844px viewport.** Banner + title + description + toolbar eat the whole first screen |
| Cards before fold | 0 (even partially) |
| Filter pattern | "Filter and sort" 193×54 → **full-screen takeover**; facet rows 64px tall (Sort, Price, Size, Waist Rise, Inseam, Style Type, Color); **sticky `Apply (0)` 335×54 with live pending count**, 28px from bottom — the best apply-model measured |
| Card srcset | `sizes="(max-width: 699px) calc(100vw / 2 - 40px)…"` — correct mobile-first declaration, `loading="lazy"` |
| h1 | 28px |

### PDP `/products/women-jeans-zoey`
| Metric | Value |
| :--- | :--- |
| Gallery | `media-carousel` — **native scroll-snap (`x mandatory`)**, 11 images, scrollWidth 3927 |
| Sticky buy | **None.** ATC 335×54 at 1353px document offset |
| Size control | Full-width select-style row 335×42; auxiliary chips 28×31 (u44) |
| Gallery img | natural 350px for 335 CSS px @dpr 1.25 (≈0.84× — mildly undersized; flagged dpr caveat) |
| h1 / body | 28px / 14px |

---

## 2. Tecovas — tecovas.com (headless React)

### Home
| Metric | Value |
| :--- | :--- |
| Header | Full stack 136px at top; condenses on scroll to **sticky nav 48px, always visible** (no hide-on-scroll) |
| Hero | HLS `<video>` (m3u8) 390×488 = **0.58 of viewport**, source **852×480 landscape cover-cropped** into portrait box |
| First product offset | 725px |
| Product links on home | 33 |
| h1 / body | 36px / 16px |
| Horizontal overflow | document scrollWidth +365px, but page does **not** pan — overflow lives in internal rails (content extends to x=5103 inside clipped carousels) |
| Interruption | Email-signup dialog on first load; its close button is 30×30 (u44) |
| Touch targets | n=215: **57 under 24px** — including 1×47px "expand submenu" strips and 67×20 "Shop Now" links — 67 more under 44px. Noisiest header/footer of the set |

### PLP `/shop/boots/womens`
(`/collections/mens-jeans` redirects to `/shop/jeans/mens`, which is a landing page whose
only product links are one 7-item **horizontal rail** — a PLP-shaped page with no grid.)
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 20, 200), card 175px |
| First product offset | **324px** — 4 cards partially, 2 fully above fold |
| Filter pattern | Trigger is a text button **84×20 (u24 fail)** → **full-screen takeover** with **sticky "See 92 Results" 358×47** + "Clear all" beneath — best results-CTA measured |
| h1 | 26px |

### PDP `/products/the-buck`
| Metric | Value |
| :--- | :--- |
| Gallery | Transform-based carousel (overflow-hidden, 8 images, scrollWidth 3179), no scroll-snap, no dots |
| Sticky buy | None found; buy button is gated behind size selection ("select a size to begin") |
| Size buttons | **48×48 — every one passes 44px.** Best size targets measured |
| Hero img srcset | natural 780 for 390 CSS px = exact 2× for dpr 2; `sizes` mobile-first correct |
| h1 / body | 22px / 16px |

---

## 3. Lucchese — lucchese.com (Shopify)

### Home
| Metric | Value |
| :--- | :--- |
| Header | **64px sticky, always visible**, no hide-on-scroll |
| Hero | `<video>` mp4 **1080×1080 square**, rendered 390×390 (0.46 of viewport) — a deliberate square asset, no crop violence |
| First product offset | 890px |
| Product links on home | 16 |
| h1 / body | 10px logo-as-h1 (!) / 16px |
| Touch targets | **Cleanest of the set: n=114, only 2 under 24px**, 9 under 44px |

### PLP `/collections/womens-boots`
| Metric | Value |
| :--- | :--- |
| Columns | **1 (card 357px wide)** — full-width editorial cards |
| First product offset | **288px**, 2 cards partially above fold |
| Filter pattern | "Filter By" + "Sort By" 171×48 each → **anchored dropdown panel** 307×411 under the control; Shopify facets, auto-apply, no results CTA |
| Semantic bug | The page's first h1 is the hidden search title ("Search", 16px) — the collection title is not an h1 |

### PDP `/products/charles-black`
| Metric | Value |
| :--- | :--- |
| Gallery | Horizontal media strip, 21 images, "Show more media (18)" expander; **document-level scrollWidth 2457 vs 390 viewport (+2067)** — clipped, page does not pan, but the strip overflows the document rather than an inner scroller |
| Sticky buy | None. Flow is size-first: "Choose size" 56px tall → ATC appears after |
| Video | Has a **visible 60px Play control, no autoplay** — the only PDP video with full controls |
| Size chart | 0 `<table>` on page (image-only chart — the known WCAG 1.1.1 pattern) |
| h1 | Product title is not the h1; first h1 is again "Search" |

---

## 4. Cinch — cinchjeans.com (Shopify)

### Home
| Metric | Value |
| :--- | :--- |
| Header | Announcement 40px + header — **no sticky header at all.** Scrolls away and does not return on scroll-up; nav requires scrolling back to top. Worst nav recovery of the set |
| Hero | `<img>` 390×400 (0.47 of viewport), **natural 390×488 portrait mobile asset — correctly sized art direction** |
| First product offset | 649px |
| Product links on home | 34 |
| h1 / body | 32px / 16px |
| Touch targets | n=148: 37 under 24px (header icons 22×22, nav text rows 20px tall), 41 under 44px; card quick-add "Choose options" 32×32 |

### PLP `/collections/mens-denim`
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 10, 200), card 180px |
| First product offset | 651px — 2 partial, 0 full above fold |
| Filter pattern | Filter 149×42 + Sort 148×42 → drawer, facet rows 64px (Price, Color, Size, Fit, Leg Opening), **"View results" 319×47 pinned 16px from bottom** |
| Card srcset | **Undersized: natural 195px for 180 CSS px at dpr 2 (0.54× of need)** — cards render soft on retina |

### PDP `/products/white-label-light-stone-5-26-mb92834064`
| Metric | Value |
| :--- | :--- |
| Size buttons | 45–50 × 45 — all pass 44px |
| Sticky buy | None. ATC 350×47 at 1575px |
| Size chart | 0 `<table>` (image chart) |
| h1 | 21.7px |
| Aside | Cinch slugs legitimately contain `\d-\d\d-` style-code patterns (`…-5-26-mb92834064`) — a reminder that our slug-purity CI regex must anchor on *price* shapes, not any digit-dash-digit |

---

## 5. Sendero — senderopc.com (Shopify)

### Home
| Metric | Value |
| :--- | :--- |
| Header | 143px wrapper absolutely positioned over hero; **no sticky header** — scrolls away, never returns until top |
| Hero | Background-image div (no `<img>`/`<video>` ≥70% width) — hero invisible to the img-based instrument, and to anything else that reads `<img>` semantics |
| First product offset | 618px |
| Product links on home | 28 |
| h1 / body | 48px / **18px** (largest body type of the set) |
| Horizontal overflow | **8px document overflow — real, if minor** |
| Touch targets | n=236: **54 under 24px** (22×22 colour swatches on every card), **139 under 44px** — densest small-target surface measured |

### PLP `/collections/new-product-arrivals`
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 30, 200), card 156px |
| First product offset | **208px — best of the reference set. 4 full cards above the fold** |
| Filter pattern | Trigger 136×29 (u44) → 300px-wide full-height **left slide-in drawer** (magnific-popup), auto-apply; drawer did not respond to a programmatic `.click()` — handler bound elsewhere |
| PLP h1 | none detected |

### PDP `/products/west-texas-municipal-t-shirt-laguna`
| Metric | Value |
| :--- | :--- |
| Size buttons | **30×30 — all 20 of them under 44×44** (pass 24 only). Worst size targets measured |
| Sticky buy | None. ATC 353×**40** (under 44px tall) at 1164px |
| h1 / body | 30px / 18px |

---

## 6. Miss Me — missme.com (Shopify)

### Home
| Metric | Value |
| :--- | :--- |
| Header | 62px |
| Hero | `<video>` 390×567 = 0.67 of viewport |
| First product offset | **2437px — products are three screens deep on the homepage** |
| Product links on home | 22 |
| h1 | **No h1 on the homepage** |
| Touch targets | n=123: 12 under 24px, 21 under 44px; menu/search exactly 24×24 |

### PLP `/collections/shop-all-denim`
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 10, 200), card 185px |
| First product offset | **354px** — 4 partial, 2 full cards above fold |
| Filter pattern | **Inline collapsible facet rows above the grid** (Searchspring-style), "Filter by: Size…" rows 350×34, toggle 182×32 (u44); auto-apply, no results CTA |
| Card srcset | **No `srcset` at all**; natural 300px for 185 CSS px @dpr 2 (0.81× of need) — soft on retina |
| h1 | 24px "Denim" |

### PDP `/products/nocturne-baggy-wide-jeans`
| Metric | Value |
| :--- | :--- |
| Gallery | **Slick carousel** (JS transform, `slick-list`), 7 images, no scroll-snap |
| Sticky buy | None. ATC 358×44 at 1199px |
| Size buttons | 46×38 — **all 12 under 44px** (38px tall) |
| Size chart | 0 `<table>` (image chart — known WCAG 1.1.1 pattern) |
| h1 / body | **16px product title** / 16px |
| Horizontal overflow | 6px document overflow |

---

## 7. Ferrell — ferrellbrand.com (Shopify, Broadcast theme)

### Home
| Metric | Value |
| :--- | :--- |
| Header | 123px static; **no sticky** — vanishes, no return on scroll-up |
| Cookie consent | Full CMP with per-category toggles 38×21 (u24); "Reject All" available (used) |
| Hero | `<img>` 390×443 (0.52 of viewport) inside `<picture>` with **2 art-direction sources** — only reference home hero using true art direction |
| First product offset | **2351px — brand-led home**, closest strategic comp to ours (theirs 2351 vs ours 4112) |
| h1 / body | (no h1 matched) / 14px |
| Touch targets | n=60: 14 under 24px (CMP toggles, 21px menu rows), 13 under 44px |

### PLP `/collections/all`
| Metric | Value |
| :--- | :--- |
| Columns | 2 (x = 20, 200), card 171px |
| First product offset | 478px — 4 partial, 2 full above fold |
| Filter pattern | "Show filters" 113×56 + Sort 90×56 in a **sticky 58px toolbar** (only sticky filter bar in the set); opens an inline 256px filter column, filter-group rows 72px, auto-apply, no results CTA |
| Card srcset | present but **natural 179 for 173 CSS px @dpr 2 = 0.52× of need** — same retina shortfall as Cinch |

### PDP `/products/core-maroon-long-sleeve-snap-shirt-copy`
| Metric | Value |
| :--- | :--- |
| Gallery | Horizontal grid strip, 12 images, no scroll-snap |
| Sticky buy | None. ATC 243×**39** (under 44px tall) at 1142px |
| Size buttons | 39–48×39 — all under 44 |
| Size chart | **1 real `<table>` — the only reference measured that ships one** |
| h1 | 19px |
## 8. Schaefer — schaeferoutfitter.com — NOT YET MEASURED
## 9. GANNI — ganni.com — NOT YET MEASURED

---

## Comparison table (partial — updates as sites land)

| Site | Header @scroll | First product: home | PLP: first card / full cards above fold | PLP cols | Filter pattern | Results CTA | PDP sticky buy | Size targets | u24 count (home) |
| :--- | :--- | ---: | ---: | :---: | :--- | :--- | :---: | :--- | ---: |
| Kimes | sticky 57px always | 815px | 862px / **0** | 2 | full takeover | **Apply (0)** live count, sticky | no | mixed 28×31 chips | 12–24 |
| Tecovas | sticky 48px always | 725px | 324px / 2 | 2 | full takeover | **See 92 Results** sticky | no | **48×48 all pass** | 57 |
| Lucchese | sticky 64px always | 890px | 288px / 1 | **1** | anchored dropdown | auto-apply | no | 48×48 | **2** |
| Cinch | **none — vanishes** | 649px | 651px / 0 | 2 | drawer | View results pinned | no | 45×45 pass | 37 |
| Sendero | **none — vanishes** | 618px | **208px / 4** | 2 | left drawer 300px | auto-apply | no | **30×30 all fail 44** | 54 |
| Miss Me | 62px (behaviour pending) | 2437px | 354px / 2 | 2 | inline facet rows | auto-apply | no | 46×38 all fail 44 | 12 |
| Ferrell | — | — | — | — | — | — | — | — | — |
| Schaefer | — | — | — | — | — | — | — | — | — |
| GANNI | — | — | — | — | — | — | — | — | — |

### The pattern so far
1. **Nobody hides-then-returns the header.** The split is binary: always-sticky compact
   bar (Kimes 57, Tecovas 48, Lucchese 64) or nothing at all (Cinch, Sendero). The
   sticky-compact camp feels strictly better: nav recovery without scroll-to-top.
2. **The fold is where PLPs die.** Sendero puts 4 products on the first screen (208px);
   Kimes puts zero (862px). The difference is entirely self-inflicted chrome: banner
   image + description block + oversized toolbar.
3. **No one ships a sticky add-to-cart on mobile.** Every ATC sits 1.1–1.6k px deep,
   non-sticky. This is the reference set's largest shared gap — and the cheapest edge
   available to us.
4. **Full-screen filter takeovers with a sticky result-count CTA are the premium
   pattern** (Kimes `Apply (0)`, Tecovas `See 92 Results`); 64px facet rows recur as
   the de-facto row height.
5. **Retina discipline is rare.** Tecovas serves exact 2× on the PDP; Cinch serves
   0.54× of need on PLP cards (soft on every retina phone); Kimes hero ships a
   1920×1080 desktop video centre-cropped into a portrait box.
6. **Touch-target hygiene splits the field**: Lucchese 2 sub-24px targets; Sendero 54,
   with every size chip at 30×30. Header icon rows at 22×22 are endemic Shopify-theme
   residue (Kimes, Cinch).

---

## OUR BUILD — measured at 390×844, production `next start` (same instruments)

**Ranked worst-first. Every number below sits beside the reference number it loses (or wins) against.**

### Finding 0 — the stale-server crash (fixed by restart, but it will happen again)
First measurement pass hit the exact trap in project memory: the **reused** production
server served HTML referencing chunk
`/_next/static/chunks/app/(public)/shop/[category]/page-3df2b9678e00efa6.js`, the
chunk 400'd with `text/html` MIME → **ChunkLoadError → the client error boundary
replaced the entire PLP with "We hit a snag on our end"** — while the server HTML was a
healthy 200 with every product present. A restart fixed it. Two implications:
1. The no-JS truth held (products were in the HTML) — the CI Test 1 property is what
   kept this from being a blank page. Good.
2. A **stale `next start` after a rebuild turns every client-routed page into the error
   boundary.** Any long-lived deploy process needs an atomic build-swap or a
   build-id-mismatch reload, and local test scripts must kill old servers (known
   lb-orphaned-test-servers issue, now observed live).

### 1. PLP first-product offset: 1093px — worst of everything measured
| | first card | full cards above 844px fold |
| :--- | ---: | ---: |
| Sendero | 208px | 4 |
| Lucchese | 288px | 1 |
| Tecovas | 324px | 2 |
| Miss Me | 354px | 2 |
| Cinch | 651px | 0 |
| Kimes (set worst) | 862px | 0 |
| **Ours `/shop/women`** | **1093px** | **0** |
| **Ours `/mens`** | **1332px** | **0** |

Fold anatomy on `/shop/women`: announcement 74 + header 65 + **page-hero 480px**
(breadcrumb + title + intro over image) + fixture notice 98 + fit-row 150 → grid at
1063. Even discounting the dev-fixture notice (~130px with margins), we sit ≈960px —
still behind Kimes, the reference set's floor. **Fix:** collapse `page-hero` to a
compact title band (~120px) at ≤768px and let the fit-row ride directly under it;
target ≤450px, which lands us second only to Sendero. The 480px hero is exactly the
self-inflicted chrome this teardown caught Kimes shipping.

### 2. Homepage products at 4112px, behind 0.99-viewport hero
Our first product-shaped card link sits at **4112px** — 1.7× deeper than Miss Me
(2437px), the reference set's worst. The hero is 833px tall (0.99 of viewport) — nothing
else survives the first screen. Header CTAs ("Find your denim", "Everything new") do sit
above the fold, which references lack, but no *product* does for nearly five screens.
Wholesale-first strategy justifies a brand-led home; it does not justify beating the
worst reference by 69%. **Fix:** pull one product rail above 2000px.

### 3. `preload="auto"` downloads a 1.79MB film nobody asked to play
The hero `<video>` is correctly poster-first (art-directed 1080×1920 portrait poster ✓,
`autoplay: false` ✓, explicit "Play the film" control ✓ — better 2.2.2 behaviour than
every reference), but `preload="auto"` pulls **1,793KB of `lb-hero-ignition-mobile.mp4`
on page load**. Total homepage transfer ≈2.1MB — inside the 4MB cinematic budget but
~85% of it is a film the visitor never started. The second film on the page already uses
`preload="none"`. **Fix: one attribute — `preload="none"` (or `metadata`) on the hero
video.** Biggest single-byte win available in the codebase.

### 4. PDP gallery images undersized 0.56× on retina — same defect we caught Cinch shipping
`/mens/everyday-mid-jean` gallery serves natural **390×488 for a 350 CSS px slot at
dpr 2 (need 700px: 0.56× of need)**, `srcset` absent, `sizes` absent. Identical failure
class to Cinch's 0.54× PLP cards, which this report calls "soft on every retina phone."
PLP cards are adequate today (390 natural for 167 CSS = 1.17×) **only because the slot
is small — the same fixed-390px asset pipeline fails wherever the slot exceeds 195 CSS
px.** The homepage poster ships 1080×1920 with no `srcset` (1.38× oversize at dpr 2 —
minor waste, wrong mechanism). **Fix:** generate 2–3 widths per asset and emit
`srcset`/`sizes`; the denim-guide's `next/image`-free pipeline needs this once,
centrally.

### 5. Filter takeover: right pattern, missing the two details the best references prove out
Ours: `#facets` full-screen takeover, CSS-target driven (works no-JS — **no reference
does this; genuinely better**), close button 46×44 ✓. But:
- **"Apply filters" (178×48) sat 469px BELOW the panel's visible bottom** — off-screen
  until the user scrolls inside the sheet. Kimes pins `Apply (0)` and Tecovas pins
  "See 92 Results" to the sheet's bottom edge, always visible.
- **No live result count** on the button ("Apply filters" vs `Apply (0)` / "See 92
  Results"). With 9 facet groups (Size range, Availability, Fabric, Detail, Wash, Leg
  opening, Silhouette, Sleeve, Motif), blind application forces a round-trip per guess.
- Facet group headers are 24px tall rows vs the 64px row height Kimes/Cinch use —
  2.5.8-minimum-passing but far under the 44px comfort bar the whole sheet should meet.
**Fix:** sticky footer inside the sheet with a live count; 44–48px facet rows.

### 6. A 24px-tall text-link system everywhere
u24 = 0–1 per page (only the "Home 39×17" breadcrumb fails 2.5.8 outright — fix it),
but **u44 = 22–43 per page**, nearly all from one source: header/footer/nav text links
computed at exactly 24px tall ("Menu 34×24", "Account 69×24", "Apply for an account
189×24", fit-row chips ×34). References range 9 (Lucchese) to 139 (Sendero); we sit
mid-pack on count but uniquely *systematic* — one line-height/padding token fixes the
entire class. Target: 44px hit area via padding, visual size unchanged.

### 7. What we win outright (keep, and defend in CI)
- **Header:** sticky 65px, always visible, zero hide games — the winning pattern
  (Kimes 57 / Tecovas 48 / Lucchese 64); ours is the tallest of the four, trim to ~56
  if cheap, but the mechanism is right. No layout shift observed on scroll.
- **Horizontal overflow: 0 on all six routes.** Tecovas (+365 clipped), Lucchese PDP
  (+2067 clipped), Sendero (+8 real), Miss Me (+6 real) all fail this in some degree.
- **PDP gallery mechanism:** native scroll-snap `x mandatory` — the same best-in-set
  mechanism as Kimes, against Tecovas/Miss Me's JS transform carousels.
- **Structured fit data:** 3 `<dl>` blocks on the PDP and a real 30-cell `<table>` on
  `/denim-guide` scrolling inside its own `overflow-x: auto` wrapper — **every
  reference measured ships 0 size-chart tables** (image charts: Lucchese, Cinch,
  Miss Me). This is the category's defining accessibility failure and we are clean.
- **Touch-target floor:** 0–1 sub-24px targets per page vs 12–57 on references.
- **JS, gzip (CompressionStream-measured):** `/` = **173KB** (inside the 180KB budget,
  7KB of headroom — watch it), `/shop/women` and PDP = **143KB**. HTML gz: 31 / 22 /
  13KB. References couldn't be byte-measured cross-origin, but none of them is a
  budgetary comparison anyway — ours is contractual.
- **Poster-first hero with a real Play control** — no reference PDP/home autoplays with
  visible pause except Lucchese's PDP video; our pattern is the only 2.2.2-clean hero
  film in the set (once preload is fixed).
- **No sticky ATC anywhere in the reference set** — and none on ours; for us the
  equivalent primary action is the wholesale CTA ("Apply for an account", 24px text
  link at depth on an 8,838px PDP). When commerce lands, ship the sticky bottom bar
  nobody else has; today, promote the wholesale CTA into a persistent, 44px control on
  PDP scroll.

### Type scale (ours, mobile 390 vs desktop 1280)
| Route | h1 mobile | h1 desktop | ratio | body |
| :--- | ---: | ---: | ---: | ---: |
| `/` | 32px | 53.6px | 0.60 | 16px both |
| `/shop/women` | 36px | 66.4px | 0.54 | 16px both |
| PDP | 20px | 24.2px | 0.83 | 16px both |
Fluid and sane; references at 390px run h1 10–48px (chaos), body 14–18px.

### Our fix list, priority order
1. `preload="none"` on the hero film (1 attribute, −1.79MB).
2. Collapse the 480px PLP page-hero on mobile; grid ≤450px. Same for `/mens` (1332px).
3. Sticky apply-with-count footer inside the facet sheet; 44px facet rows.
4. Central `srcset` emission in the image pipeline (PDP gallery is 0.56× on retina).
5. 44px hit-area padding token for the 24px text-link system; fix the 39×17 breadcrumb.
6. A homepage product rail above 2000px.
7. Ops: atomic build swap / kill stale `next start` (Finding 0); keep JS ≤180KB — home
   has 7KB headroom.
