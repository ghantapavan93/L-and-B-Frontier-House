# Motion and transition teardown — specialist report

**Date:** 2026-08-14 · **Method:** live in-browser measurement of eight reference sites —
`document.getAnimations()` (running animations, WAAPI timings), computed
`transition-duration` / `timing-function` distributions across ~7,000 elements per page,
stylesheet walks for `@keyframes` and `prefers-reduced-motion` media rules, library
globals and resource-name detection, scroll-integrity checks (overflow state,
`scrollY` response, scroll containers). Values are declared timings read from computed
style and live animation objects, not stopwatch estimates.

**Caveats.** A concurrent agent repeatedly closed browser tabs mid-run; every site was
still fully probed except one gap noted inline. Sézane sat behind a "verifying the
device" wall that cleared itself (no CAPTCHA was touched). Cookie banners were dismissed
with the most privacy-preserving control (GANNI: "Decline all"; Sézane: "Continue without
Accepting"). Cross-origin stylesheets that blocked CORS are counted as "opaque" — the
`prefers-reduced-motion` counts are therefore floors, not ceilings. Mechanisms and
timings only; no choreography is reproduced here.

---

## 1. Per-site findings

### Kimes Ranch — kimesranch.com (Shopify, Impact theme 7.2.0)

- **Libraries: none.** No GSAP, Framer, Lenis, Swiper, jQuery, three.js. 248 script
  requests, all theme modules. Motion is native WAAPI.
- **Native scroll preserved.** `overflow: clip visible`, `scroll-behavior: auto`, no
  wheel interception, `scrollY` responds natively.
- **Entrances: none fire.** Eight `[reveal-on-scroll]` elements exist, but scrolling the
  full page produced zero entrance animations. Content simply appears.
- **The one running animation** is the announcement marquee: a WAAPI `Animation` on a
  `<scrolling-text>` element with `duration: auto`, `linear`, transform-only —
  a **native ScrollTimeline-driven marquee**, no library. It has a visible pause button.
- **Hover:** buttons 150ms ease-in-out (background/color/shadow); links 200ms opacity;
  underlines 300ms `background-size`; **product image zoom 1.5s transform** on
  `cubic-bezier(0.22, …)` — the one deliberate luxe flourish.
- **Video:** hero muted/loop/playsinline/poster, with a **visible centred pause control**;
  8 pause buttons on the page (videos + marquee). Model 2.2.2 behaviour.
- **Reduced motion:** 7 media rules in accessible CSS. Respected at theme level.
- **Characteristic range: 150–300ms interactions; 1.5s image zoom; everything else static.**

### Tecovas — tecovas.com (headless storefront, Tailwind)

- **Libraries: none for motion.** jQuery 3.7.1 arrives inside a third-party marketing
  widget (`bx-`), not site code. 133 script requests.
- **Native scroll preserved** (`overflow: visible`, `auto`).
- **Entrances: none.** Scrolling two full viewports produced only 200ms opacity
  `CSSTransition`s on lazy-loaded `IMG`s (fade-in on load) — no reveal choreography.
- **Hover:** 150ms (25 els) and 200ms (14 els) opacity/color on Tailwind's
  `cubic-bezier(0.4, 0, 0.2, 1)`. Card hover is a **200ms opacity crossfade between two
  images** — no scale, no lift.
- **Video:** hero muted/loop/playsinline/poster with an explicit `aria-label="Pause"`
  button.
- **Reduced motion:** 7 media rules present.
- **Characteristic range: 70–200ms. Total motion vocabulary is two fade timings.**

### Lucchese — lucchese.com (Shopify, agency build, Tailwind `tw-` prefix)

- **Libraries:** jQuery 3.3.1 (~85 KB decoded) only. 173 script requests.
- **Native scroll preserved**; CSS `scroll-behavior: smooth`.
- **Entrances: none.** Scrolling fired nothing but a Klaviyo popup's own 350ms fades.
- **Hover/UI:** the heaviest default durations of the set — **300ms × 445 elements,
  400ms × 152** (opacity on `cubic-bezier(0.25, …)`), drawers 500–700ms. A carousel
  animates `left` (layout property) at 500ms — the one engineering wart.
- **Video:** three 30s muted loops; **6 visible `pause-icon` controls.** Videos stay
  paused until in view.
- **Reduced motion: the strongest of all eight.** 160 Tailwind `motion-reduce:` class
  usages compiled into the CSS — deliberate, per-element engineering, not a blanket rule.
- **Characteristic range: 300–400ms — proof the "premium = slower" ceiling is 400ms, not 700ms.**

### Sendero — senderopc.com (Shopify, Kalles-family theme)

- **Libraries:** jQuery 3.6.0 **loaded twice** (87 + 85 KB decoded). 213 requests.
- **Native scroll preserved.**
- **Entrances:** `ani-fadeIn` — **1250ms linear opacity on every lazy image** (8 running
  at once on load). The definitive "mush" datum: over a second of linear fade, applied
  indiscriminately.
- **Hover:** 200ms × 148 (card overlays), 300ms × 62, buttons 150ms. Swatch strips use
  **native `scroll-snap-type: x`** — the only native-snap carousel in the set.
- **Video:** none on the homepage.
- **Reduced motion: 1 rule. Effectively ignored.**
- **Characteristic range: 150–300ms UI over 1.25s ambient image fades.**

### Miss Me — missme.com (Shopify, custom theme)

- **Libraries: Swiper (~140 KB decoded) + jQuery 3.5.1 + Flickity — three carousel/DOM
  libraries on one page.** 343 script requests, the heaviest of the set.
- **Native scroll preserved.**
- **Entrances:** 19 `[data-cc-animate]` elements; scrolling fired a **500ms `ease`
  opacity transition** — fade-only reveals.
- **Hover/UI:** 0.1s × 566 (mostly an accessibility-overlay widget), 0.2s × 72,
  0.5s × 226 (drawer fades), nav links 240ms opacity+transform.
- **Video:** hero is a **9-second loop, playing, with no pause control — a straight
  WCAG 2.2.2 failure.** Swiper carousels auto-advance (4 autoplay flags).
- **Reduced motion: 2 rules, both vendor. Ignored by the theme.**
- **Characteristic range: 100–500ms, `ease` everywhere.**

### Sézane — sezane.com (custom stack)

- **Libraries: none. Ten script files total on the homepage.** No jQuery, no GSAP, no
  Swiper. 720 KB of CSS contains **six `@keyframes` total** (three per bundle) — the
  most disciplined motion budget measured.
- **Scroll:** native. `html { overflow: hidden }` observed is **modal scroll-lock**
  (stacked country-confirm + newsletter dialogs on first visit), not hijack; the menu's
  `data-scroll-container` is its own drawer scroller, not LocomotiveScroll (no
  `window.LocomotiveScroll`, no scrollbar proxy). A concurrent agent killed the tab
  before a final post-modal scroll assert; library absence and native scrolling element
  (`HTML`) were confirmed directly.
- **Entrances: none.** The only running animation on load was the cookie banner's own fade.
- **Hover/UI:** **100ms × 154** (header, links), 200ms × 51 (underline/color), 150ms
  buttons; dialogs 400ms/800ms transform on `cubic-bezier(0.19, …)` (easeOutExpo family).
- **Reduced motion:** 2 rules. Their real strategy is having almost nothing to reduce.
- **Characteristic range: 100–200ms interactions; 400ms overlays. Premium as near-total stillness.**

### GANNI — ganni.com (Salesforce Commerce Cloud)

- **Libraries:** jQuery 3.7.1 + slick carousel. 43 script requests.
- **Native scroll preserved** once the consent banner (scroll-lock) is declined.
- **Entrances: none.** Scrolling fired only **150ms `ease-in`** border/underline
  micro-transitions and the **400ms blur-up (`filter`) on lazy images**.
- **Marquee:** a text marquee band exists; during probing its container carried no
  running keyframe animation (likely finished/paused offscreen). Slick drives carousels
  via JS transforms, buttons, no auto-advance observed on the homepage.
- **Video:** none on homepage at probe time. No pause controls found (nothing to pause).
- **Reduced motion:** 7 media rules — present at platform level.
- **Characteristic range: 150ms micro-transitions, 250–400ms media fades, 800ms nav overlay.**

### Ferrell — ferrellbrand.com (Shopify, Broadcast theme)

- **Libraries:** jQuery **loaded twice** (85 + 86 KB decoded) + an AOS-style reveal
  system (7 `[data-aos]` elements, kinds `fade`/`hero`).
- **Native scroll preserved.**
- **Entrances:** `fadeInUp` **300ms linear** (opacity+transform) on reveal; **1.6s
  infinite `shimmer`** skeletons on lazy images; the announcement bar **auto-rotates six
  items on 500ms opacity crossfades with no pause control** (2.2.2 failure).
- **Hover/UI:** 0.25s × 207, 0.3s × 71, 0.4s/0.75s dropdown image fades on
  `cubic-bezier(0.215, …)` (easeOutCubic).
- **Reduced motion: zero rules. Fully ignored.** The AOS pattern also means JS-hidden
  content: `[data-aos]` elements start invisible and depend on JS to appear — the exact
  no-JS failure our CI Test 1 exists to prevent.
- **Characteristic range: 250–400ms UI, 300ms reveals, 1.6s ambient shimmer.**

---

## 2. Comparison table

| Site | Platform | Motion libraries | Motion-lib weight (decoded) | Scroll-jacked? | Reduced-motion? | Typical durations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kimes Ranch | Shopify (Impact) | none — native WAAPI + ScrollTimeline | 0 | No | Yes (7 rules) | 150–300ms; 1.5s img zoom |
| Tecovas | Headless | none (jQuery is 3rd-party baggage) | 0 | No | Yes (7 rules) | 70–200ms |
| Lucchese | Shopify (agency) | jQuery only | 85 KB (not motion) | No | **Yes — 160 `motion-reduce` usages** | 300–400ms |
| Sendero | Shopify (Kalles) | jQuery ×2 | 172 KB (not motion) | No | No (1 rule) | 150–300ms; 1.25s img fades |
| Miss Me | Shopify (custom) | **Swiper + jQuery + Flickity** | ~225 KB+ | No | **No** (2 vendor rules) | 100–500ms |
| Sézane | Custom | **none — 10 script files, 6 keyframes total** | 0 | No | Minimal (2 rules) — little to reduce | 100–200ms; 400ms overlays |
| GANNI | SFCC | jQuery + slick | ~85 KB+ | No | Yes (7 rules) | 150ms; 400ms blur-up |
| Ferrell | Shopify (Broadcast) | jQuery ×2 + AOS-style reveals | 171 KB | No | **No (0 rules)** | 250–400ms; 300ms reveals |

**Zero of eight sites intercept the wheel. Zero run GSAP, Framer Motion, Lenis,
Locomotive, or three.js. Zero animate a headline.**

---

## 3. The pattern

1. **Premium is stillness plus one flourish.** The three most upmarket presences —
   Sézane, Tecovas, Lucchese — ship **no entrance choreography at all**. Their entire
   motion identity is hover micro-transitions (100–400ms) plus media (video, image
   crossfade, one slow zoom). The downmarket tells are the opposite: Sendero's 1.25s
   linear image fades, Miss Me's three carousel libraries, Ferrell's shimmer-and-reveal
   kit.
2. **Zero-library is how the best do it.** Sézane (10 scripts, 6 keyframes) and Kimes
   (native WAAPI + ScrollTimeline, zero libraries) achieve the category's most
   composed feel with no motion dependency whatsoever. Every library found on any site
   was carousel plumbing or legacy jQuery, never expressive motion.
3. **The duration band is 100–400ms, hard.** Fast fashion-adjacent sites cluster at
   100–200ms (Sézane, Tecovas, GANNI); the leather-goods end sits at 300–400ms
   (Lucchese, Ferrell). Nothing interactive exceeds 400ms anywhere. Long durations exist
   only as ambient media effects (1.25–1.6s fades/zooms), never on UI.
4. **Reveals, where they exist at all, are cheap fades** — 300ms linear (Ferrell), 500ms
   ease (Miss Me) — and they read cheap. The premium sites' refusal to reveal is the
   stronger statement.
5. **Compliance divides on 2.2.2, not taste.** Kimes, Tecovas and Lucchese ship visible
   pause controls on every loop; Miss Me (9s hero loop) and Ferrell (rotating
   announcement) do not, and fail. Reduced-motion honesty follows the same line:
   Lucchese engineers it per-element; Ferrell has literally zero rules.

## 4. The two or three mechanisms genuinely worth having

1. **The 100–300ms micro-transition vocabulary** — opacity/color/underline on hover and
   focus, one entrance easing. This is 100% of Sézane's and Tecovas's interactive motion.
   It is cheap, universal, and reads premium precisely because nothing else moves.
2. **Media-carried motion with visible pause** — a muted, poster-first loop with a real
   pause button (Kimes/Tecovas/Lucchese pattern). The film does the cinematic work; the
   DOM stays still.
3. **One slow ambient zoom as the single luxe flourish** — Kimes's 1.5s transform-only
   image zoom on hover is the only long duration in the corpus that reads expensive.
   At most one such effect per surface, always inside `no-preference`.

Honourable mention: **native `scroll-snap` strips** (Sendero's swatches) — the only
carousel mechanism observed that needs no library, no wheel work, and keeps keyboard and
scrollbar semantics for free.

---

## 5. Audit of OUR motion system

Inventory audited: `src/app/globals.css` (all `@keyframes`, `animation-timeline`,
transitions, reduced-motion and `scripting: none` blocks), `src/app/tokens.css`
(duration/easing tokens), `src/ui/motion/depth-field.tsx`, `src/ui/motion/aisle-depth.tsx`,
`src/ui/scroll-rail.tsx`. Our motion JS: one Framer chunk, **83 KB raw / 29 KB gzip**
(`.next/static/chunks/269-*.js`), plus the ~1.4 KB inline scroll-rail element.

### Verdicts, feature by feature

| Ours | Reference comparison | Verdict |
| :--- | :--- | :--- |
| Tokens: 200/300/400ms, two easings | Corpus band 100–400ms; premium cluster 100–300; Lucchese proves 400 cap | **Correct. No change.** Exactly inside the premium band, and the 400ms hard cap is validated by the most premium site measured |
| Button/link transitions at `--duration-fast` 200ms | Sézane 100–200, Tecovas 150–200, GANNI 150 | **Correct.** Mid-cluster |
| Card hover breath: straighten + shadow + img scale 1.03 @ 300ms ease-out-expo | Tecovas 200ms crossfade; Kimes 1.5s zoom; Sendero 200ms overlay | **Correct.** Richer than Tecovas, far quieter than Kimes. Transform-only where references animate opacity. Keep |
| Section-head rise: 16px, scroll-driven `view()`, transform-only, 0 opacity | References' reveals are 300–500ms opacity fades, or nothing | **Better than every reveal measured.** Scroll-linked (reversible, velocity-honest) where theirs are one-shot fades; no opacity, so a frozen timeline still shows text. Keep |
| Film expansion scale 0.8→1 + backdrop recede, `view()` timelines | The reference component we translated scroll-jacks; **zero live sites do anything comparable** | **Keep — this is our one signature the corpus lacks**, and it is legal machinery: native scroll, base state = finished |
| Marquee 42s linear + **checkbox pause, no JS** | Kimes: scroll-linked marquee, JS pause button. GANNI: marquee, no pause found. Ferrell: rotating bar, no pause — fails 2.2.2 | **Exceeds all eight.** Only pause control in the category that works with JavaScript off |
| Framer islands ×2 (pointer spring; sprung scroll read), CSS-var contract, reduced→zero/unsprung | **Zero references ship a spring or any motion library** | **Acceptable, at the ceiling.** 29 KB gzip is spent where the corpus spends 0. The CSS-var/server-children contract is what makes it defensible. **Freeze at two islands**; any third needs a measured case a spring alone can justify |
| Scroll-driven inventory: 8 keyframe families (stitch, depth-drift, journey-grow, arrive ×3, rack-approach, film-expand, backdrop-recede, head-rise) | Maximum observed on any reference: **one** scroll-linked animation (Kimes marquee) | **Too many families, not too much motion.** Each is individually sound (supports-gated, transform-only, base=finished). Declare the vocabulary closed: no ninth family without retiring one |
| Hero sequence: word rise 0.55s ×8 @70ms stagger → shutter 0.9s → line 1.5s → image sweep 0.9s + travel 3.4s; automatic settle ≈ **4.55s** | **No reference animates a headline at all.** Longest automatic decorative motion anywhere: 1.6s (ambient shimmer). Longest choreographed: 500ms | **Too long. The one place we overshoot the entire corpus.** See correction 1 |
| Ignition CTA rise: transform-only 10px, 0.6s @ 2.2s delay | n/a | **Already repaired** (was opacity-hidden; now legible at every frame). The 2.2s delay now only delays a 10px settle — harmless |

### Exact corrections

1. **`image-travel`: 3.4s → 1.8s** (`globals.css` ~line 7042). The travel alone lasts
   longer than any reference's entire choreography vocabulary, and it is the sole reason
   the hero's automatic settle is 4.55s. At 1.8s the sequence lands at ≈ 2.95s total —
   still triple anything measured, but the composition keeps both beats and stays
   comfortably under the 5s that would oblige a pause control. Keep `image-sweep` at
   0.9s unchanged.
2. **Optional, same key: `shutter-line` 1.5s → 1.2s** (~line 6932). Pure decoration; at
   1.2s it finishes inside the shutter's own window instead of trailing it. Cosmetic,
   low priority.
3. **Declare the scroll-driven vocabulary closed at eight families and the island count
   closed at two.** Not a code change — a rule to add to the motion section of the
   constitution when it is next edited. The corpus shows category-premium is achieved
   with one scroll-linked effect or none; our margin over that is already spent.
4. **Never adopt from references:** Sendero's 1.25s linear lazy-image fades, Miss Me's
   9s pauseless hero loop, Ferrell's rotating announcement without pause, and
   AOS-style JS-dependent reveals (`[data-aos]` opacity:0 without JS = hidden product —
   Ferrell ships this today and it is the exact failure our CI Test 1 blocks).

### Where we already exceed every reference — state it plainly

- **Reduced motion.** ~20+ `prefers-reduced-motion` blocks in `globals.css`, token
  collapse to 1ms in `tokens.css`, `useReducedMotion` zeroing/unspringing both islands,
  the rail swapping smooth for auto, and designed reduced states (marquee becomes a
  static line; image-text overlay yields to the solid headline). Best reference:
  Lucchese's 160 `motion-reduce` utilities; four of eight sites have effectively or
  literally zero. Nobody else *designs* the reduced state; they at best mute the animated one.
- **No-JS completeness.** The `scripting: none` floor (~line 2234) resolves every
  entrance to its finished state; islands publish CSS vars over untouched server
  children, so no JS means calc() zeroes and a complete page; the rail's arrows ship
  `hidden` until upgrade. No reference measured today has an accessible-CSS
  `scripting: none` rule, and Ferrell demonstrably hides content without JS.
- **Pause semantics without JS.** The marquee checkbox is the only no-JS pause control
  in the corpus; Kimes/Tecovas/Lucchese need their scripts for theirs.
- **Opacity discipline.** Our entrances are transform/clip only (the no-opacity-on-text
  ban); every reference reveal measured is an opacity fade, which is precisely the
  mechanism that hides content when a trigger fails.
- **Motion-JS honesty.** 29 KB gzip buys two springs the platform cannot express.
  Miss Me spends ~7× that (Swiper + jQuery + Flickity, decoded) on carousels that
  auto-advance without pause controls.

### One-line verdict

The corpus proves the constitution right: premium western/contemporary retail is
**native scroll, 100–400ms, no motion library, and one flourish**. Our system already
sits above the category on every accessibility axis; its only genuine excess is the
hero's 3.4s image travel, and its only structural risk is vocabulary creep — cap the
families, trim the travel, ship.
