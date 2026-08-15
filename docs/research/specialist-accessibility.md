# Specialist: Accessibility Benchmark — Reference Set vs. Frontier House

**Status: IN PROGRESS (rerun).** Kimes Ranch and **Frontier House (all 8 routes)** measured.
Remaining reference sites being added as budget allows. Sections marked *not yet measured* are
pending, not passing.

Date: 2026-08-14/15 · Viewport: desktop pane (~924px wide), Chromium (in-app browser) · Auditor:
accessibility benchmark specialist agent

---

## 1. Method — what was measured, and how

Everything below is **computed, not estimated**. Instruments run in-page JavaScript against live
computed styles.

| Measure | Instrument |
| :--- | :--- |
| Text contrast | WCAG relative-luminance ratio of computed `color` against the **resolved backdrop**: alpha-composited walk of the `elementsFromPoint` stack (in-viewport) or ancestor chain (off-viewport), with a scroll-into-view recheck pass for every candidate failure. Thresholds 4.5:1, or 3:1 for large text (≥24px, or ≥18.66px bold). |
| Over-media text | Text whose backdrop resolves to an `<img>`/`<video>`/`background-image` is **excluded from the numeric failure count** and flagged separately. If a scrim (solid rgba overlay or gradient) is present, it is evaluated **worst-case**: the minimum-alpha stop composited over both pure white and pure black; only an **opaque** scrim that still fails counts as a numeric failure. `scrimA=0` means no scrim exists at all. |
| Focus visibility | One real `Tab` keypress (sets keyboard modality) then a programmatic walk of the first 15 tab stops, reading computed `outline`/`box-shadow`/`border`/`background` deltas. Ring contrast is computed against the resolved backdrop. Note: this Chromium build renders the UA-default `outline: auto` ring at a computed `rgb(229,151,0)` ≈ **2.40:1** on white; reported as "UA-default" rather than a site choice. |
| Target size (SC 2.5.8) | Every visible link/button/input measured. **Spacing exception applied honestly**: an undersized target passes if a 24px circle centred on it intersects no other target (rect-circle test) and no other undersized target's centre is within 24px. Inline-text exception also applied. |
| Keyboard completeness | Real key events (`Tab`, `Enter`, `Space`) against nav triggers and filter drawers; product reachability = products are real `<a href>` elements. |
| Alt text | First 20 rendered images ≥40px wide: missing `alt` attr / empty (decorative) / junk (filename-like, `#color_*` swatch dumps) / quality of the rest. |
| Headings | Visible h1–h6 sequence; skips counted; h1 count. |
| Size chart | Activated on each PDP; inspected for `<table>`/`<tr>`/`<th>` vs `<img>` (a size chart shipped only as an image is a WCAG 1.1.1 failure — the live L&B site's known failure mode). |
| Motion | `<video>` autoplay/loop/duration/controls; presence of a visible pause/stop control (SC 2.2.2 requires one for >5s auto-playing motion); `document.getAnimations()` for infinite/>5s animations; count of `prefers-reduced-motion` rules across reachable stylesheets. |
| Forms | Programmatic label presence (label[for], wrapping label, aria-label/labelledby); placeholder-only flagged; unnamed icon buttons flagged. |

Method notes recorded during calibration: underline-reveal `background-image` gradients with
`background-size ≤ 4px` are decoration, not scrims (excluded); `sr-only` (≤2px clipped) text is
excluded from contrast; results were re-validated after every instrument change.

**Instrument limitation discovered mid-run (affects one earlier finding).** The browser pane's key
injection delivers `keydown`+`keyup` with **no char event and no synthesized click** — verified by
instrumenting a native link with listeners and pressing Enter (`evts: keydown, keyup` only). Native
Enter/Space activation therefore *cannot fire in this environment*, on any site. Keyboard
activation is consequently assessed **by construction**: a native `<a href>`/`<button>`/`<summary>`
with no `preventDefault` key handler activates under real keyboards. The earlier "Kimes filter
keyboard FAIL" is **retracted as inconclusive** under this correction (their drawer opens on
`click`, which a real Enter press synthesizes on a native button).

---

## 2. Reference site scorecards

### 2.1 Kimes Ranch (kimesranch.com) — Shopify — MEASURED

**Homepage**

- Text contrast failures: **1** — Instagram-feed widget "See More" `#9E9B9B` on white = **2.76:1** (needs 4.5).
- Over-media flags (excluded from count): **2**, both `scrimA=0` — hero "AUGUST TEE DROP" (40px white
  directly on photograph, no scrim) and "NEW STYLES!" (16px bold white on photograph).
- Targets: **1 failure** — carousel "Previous" arrow **7×44px** (of 89 targets; 28 passed only via the
  spacing exception).
- Headings: h1 → h3 skip.
- Alt (20 sampled): 0 missing, 2 decorative-empty, **5 junk swatch alts** (`#color_mini stripe`, `#color_indigo`…).
- Motion: two auto-playing looping videos (33.4s, 34.5s, no native controls) **with dedicated visible
  pause buttons** — "Pause announcements", "Pause video" — **SC 2.2.2 pass**. 7 `prefers-reduced-motion`
  CSS rules present.
- Focus: all 15 stops visible. Mostly UA-default auto ring (computed 2.40:1); custom 1.6px rings on
  pause buttons (**11.73:1**); the "Pause video" white ring resolves ~1.0:1 against its backdrop.
- Skip link: yes. Zoom not blocked. `lang="en"`.

**PLP `/collections/womens-jeans`**

- Text contrast failures: **0**. Over-media flags: 3 (all `scrimA=0` — 32px banner title, 16px subtitle,
  26px category-card labels ×10).
- Targets: 1 failure (same 7×44 arrow). Headings clean. Product alts are genuinely descriptive
  ("Woman wearing Kimes Ranch high-rise jeans in a dark indigo wash…"); swatch alts junk.
- Keyboard filter: real `Enter` and `Space` on the focused "Filter and sort" button left
  `aria-expanded="false"`; a programmatic `click()` opened it. **Reclassified inconclusive** — the
  instrument cannot deliver activation char events (see method note); the control is a native
  `<button>` whose click handler real Enter would reach.
- Products are real links — reachable by keyboard.

**PDP `/products/olivia-dark-wash`**

- Text contrast failures: **1** — review-widget location text ("Paducah, TX") `#7B7B7B` = **4.23:1** (×6 instances).
- Over-media flags: 2 (unscrimmed white editorial text on fabric photography).
- Targets: 0 failures. Headings 1→2 clean. Forms: all 5 controls labelled.
- **Size chart: structured HTML `<table>`, 12 rows of real measurements — passes 1.1.1** (weakness: 0
  `<th>` header cells).
- Newsletter interrupt modal: hero image (390px) has **no alt attribute**.
- PDP video: has controls, does not autoplay.

**Kimes verdict.** The strongest discipline measured so far: pause controls for both marquee and
video, reduced-motion CSS, skip links, a real table size chart, descriptive PLP alt text. Its
failures: unscrimmed hero/editorial text (5 flags), 7px carousel arrows, swatch-alt junk, and
sub-4.5 review-widget grays.

### 2.2 Tecovas (www.tecovas.com) — headless custom — MEASURED

**Homepage.** Text failures: **0**. Over-media flags: 5 — hero "Lucky in Love" (42px white,
`scrimA=0`), two campaign lines (16–18px, `scrimA=0`), and a store banner whose 0.4-alpha scrim
still computes a worst case of **2.85–2.97:1** against 4.5 needed. Targets: 1 failure — "Open help
chat" **16×40px** (215 targets; 53 spacing-exempt). Headings: 2 skips; alt text is the best
measured in the study (full narrative scene descriptions). **Motion risk: a 10s `autoplay loop`
video with no pause control anywhere on the page** (it was paused at measurement — possibly
IntersectionObserver-gated — but the attributes commit it to autoplay; if it runs, SC 2.2.2 fails).
7 reduced-motion rules; skip link present. Focus: 15/15 visible; 11 stops ride the UA auto ring,
2 get a custom **3px solid rgb(2,95,204)** ring, and **one stop's outline is 2px solid
transparent — an invisible ring**.

**PLP `/shop/boots/womens`.** Text failures: 0 (1 flag: a white tile label measuring 1.05:1
against the cream it lands on where its image undershoots it). Targets: **2 failures** — help chat
16×40 and the product-card **"Quick Add" button at 89×20px** (444 targets, 93 needed the spacing
exception). Headings clean. Alt structured ("View of The Annie Hearts - Wine Cowhide").
**No filter affordance matching filter/sort/refine was visible at 924px** and zero visible
checkboxes/radios — filtering could not be located, let alone operated.

**PDP (Longhaul work boot).** Text failures: **1** — overlay label white-on-cream **1.05:1**
(14px). Headings clean. **Alt: 10 of 20 gallery images carry empty `alt`** — half the product
gallery is marked decorative. "Fit Guide" opens a dialog with a real 15-row table (2 `<th>`) plus
advice images whose alt text carries the complete sizing advice — **structured-text pass**. PDP
video: controls, no autoplay.

**Tecovas verdict.** The best alt-text culture measured and a real fit-guide table; undone in
places by unscrimmed hero text, an attribute-committed autoplay loop with no pause control, a
20px-tall Quick Add target, one transparent focus outline, and a half-decorative product gallery.

### 2.3 Lucchese (www.lucchese.com) — Shopify + Tailwind — MEASURED

**Homepage.** Counted text failures: 0 after reclassification — the two 1.0:1 candidates ("MEN'S"
31px, "BOOTS" button) are white type over category photography with **no scrim at all**
(chain-walk resolves the page ground behind them; classified over-media, `scrimA=0`). Over-media
flags: 3. **No `<h1>` on the homepage** (ladder starts at h2). Targets: 1 failure — the revealed
"Skip to Main Content" link measures **32×16px**. Alt: name-only style ("Priscilla :: Glitz
Cream"), 1 missing, 3 empty. Motion: three 30s loop videos (one with `autoplay` attribute), a
"Play video" control exists; 4 reduced-motion rules. **Focus: not reliably measurable — 13 of 15
candidates rejected programmatic focus** (site JS interferes); the 2 measurable stops showed only
the UA auto ring.

**PLP `/collections/mens-cowboy-boots`.** Text failures: **0**. Targets: 1 (the same 32×16 skip
link). Headings clean with a real h1. Filters: a native `<summary>` "Sort By" plus **6 visible
checkbox/radio inputs — native disclosure filtering, keyboard-operable by construction**. Products
are real links.

**PDP `/products/the-varsity-cognac`.** Text failures: **0**. Headings clean. Alt name+index
("The Varsity :: Cognac 1"), 1 missing. Forms labelled. **No size-chart or fit-guide affordance
found anywhere on the PDP, and 0 size tables in the DOM** — for a bootmaker, sizing help simply
isn't there (or hides behind unconventional wording). Videos have controls.

**Lucchese verdict.** Quietly clean measured surfaces (0 text failures on all three pages) but
structurally thin: no h1 on the home page, a 32×16 skip link, name-only alt text, no locatable
size guidance on the PDP, and a front-end that fights focus instrumentation.
### 2.4 Cinch (cinchjeans.com) — Shopify — MEASURED

**Homepage.** Text failures: **2** — the "Lead, Don't Follow." scrolling strip (26px, `#B3B3B3` on
white = **2.10:1**, needs 3) and the announcement bar ("FREE SHIPPING…", 11px white on gold
`rgb(179,136,8)` = **3.26:1**, needs 4.5). Over-media flags: 4 (unscrimmed CTAs over imagery).
Targets: 0 failures. Headings clean. 12 reduced-motion rules; skip link present. Focus: 15/15
visible, all UA auto ring. Three 25.7s loop videos (not auto-playing when measured; no pause
control exists if they do).

**PLP `/collections/mens-denim`.** Text failures: **2** — the same announcement bar (3.26:1), and
**sale prices in red `rgb(227,44,43)` on cream `rgb(243,241,232)` = 3.98:1** at 17px (needs 4.5) —
a classic sale-price contrast failure repeated across the grid. **No `<h1>` on the PLP.** Filter
and Sort are native buttons (keyboard-operable by construction). Targets: 0 failures.

**PDP (White Label 064).** Text failures: **2** — announcement bar again, plus **size option
labels at `rgba(0,0,0,0.5)` on cream = 3.88:1** (17px). Headings clean.

**Size chart: the worst measured in the study.** "Men's Fit Guide" navigates to
`/pages/mens-fit-guide`, which contains **zero `<table>` elements and three 680px images with no
alt attribute at all** — the entire sizing system is pictures of numbers. This is a WCAG 1.1.1
failure and it is *exactly* the live L&B site's failure mode (single-JPEG size chart), reproduced
by a major competitor.

**Cinch verdict.** A persistent announcement-bar failure on every page, sub-threshold sale prices
and size options, and an image-only fit guide. The scorecard's cautionary tale: clean-looking
brand pages, systemic small-text failures.
### 2.5 Sendero — *not yet measured*
### 2.6 Miss Me — *not yet measured*
### 2.7 Rockmount — *not yet measured*

---

## 3. Scorecard table (interim)

Context: WebAIM Million (Feb 2026) — 95.9% of home pages have detectable WCAG failures; shopping
sites average **71 errors/page**, 27% worse than the web average. Scores below count only
**measured** failures under this method (deduplicated by style signature, over-media text excluded).

| Site | Text fails (H/PLP/PDP) | Over-media flags | Focus visible | Keyboard: nav/filter/product | Target fails | Size chart | 2.2.2 pause | Reduced motion | Alt quality |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kimes Ranch | 1 / 0 / 1 | 7 | 15/15 (UA ring) | yes / inconcl.¹ / yes | 1 (7×44 arrow) | **HTML table** | **pass** (buttons) | 7 CSS rules | good products, junk swatches |
| **Frontier House** | **0 / 0 / 0** | 11² | 15/15 (6.49:1)³ | yes / **yes (by construction)** / yes | **0** | **table + th scope + caption** | **pass (no autoplay at all)** | 27 CSS rules | descriptive, honest generated-art labels |
| Tecovas | — | — | — | — | — | — | — | — | — |
| Lucchese | — | — | — | — | — | — | — | — | — |
| Cinch | — | — | — | — | — | — | — | — | — |
| Sendero | — | — | — | — | — | — | — | — | — |
| Miss Me | — | — | — | — | — | — | — | — | — |
| Rockmount | — | — | — | — | — | — | — | — | — |

¹ Instrument cannot deliver activation keys (method note); native button + click handler = passes
under a real keyboard. ² Over-media flags are excluded from fail counts on both sides; ours are
itemised in §4.2 because they are ours to fix. ³ Announcement-bar stop measures 2.73:1 — see §4.2.

---

## 4. Frontier House — audited with identical instruments

Routes measured: `/`, `/shop/women`, `/mens`, `/mens/everyday-mid-jean`, `/wholesale`,
`/wholesale/apply`, `/denim-guide`, `/calendar` (production build via `next start`). Plus
component-level probes of the marquee pause checkbox, scroll-rail arrows, fit-gateway tiles, the
image-filled hero headline, and the campaign stage — including pixel-sampling the actual hero film.

### 4.1 Where Frontier House genuinely leads

- **Zero counted text-contrast failures on all eight routes** (Kimes: 2 across three pages; WebAIM
  Million context: low-contrast text appears on ~79% of home pages). Every solid-background pairing
  passes 4.5:1/3:1.
- **Zero SC 2.5.8 target failures out of 395 targets measured across routes** — without leaning on
  the spacing exception (0 spacing-exempt on our pages vs 28–62 on Kimes'). Marquee pause control:
  the checkbox itself and its label both measure **44×44px**. Scroll-rail arrows: **44×44px**,
  labelled "Scroll back"/"Scroll forward". Fit-gateway tiles: real `<a>` elements, 389×224px.
- **SC 2.2.2 passes by construction, not by pause-button retrofit**: neither film autoplays (hero
  10s and campaign 18s are poster-first with a "Play the film" toggle); the only >5s motion, the
  42s marquee, is paused by a **CSS-only `:checked` checkbox** that works with JavaScript disabled
  and sits in the tab order. Kimes needed two JS pause buttons to pass; most sites ship neither.
- **Focus indicators are designed, not UA-default**: 1.6px solid Tobacco `#734F36` ring, offset
  1.6px, measured **6.49:1** against the page ground on 14 of 15 stops (Kimes rides the UA auto
  ring at a computed 2.40:1). `:focus-visible`-scoped — keyboard users get rings, mouse users
  don't.
- **The facet system is the strongest keyboard/no-JS filtering measured anywhere in this study**:
  a native anchor opens a `:target` CSS sheet (no JS in the chain, nothing to break); 11 `<select>`
  controls each carry a programmatic `<label>`; the form is a **GET** whose state lives in a
  shareable URL with no price parameters; applied filters render as removable chip links; a
  `role="status"` region announces "18 styles shown". Verified end-to-end.
- **Size and fit is structured text at last**: `/size-and-fit/women` serves 2 real tables, **17
  `<th>` cells all carrying `scope`**, 2 `<caption>`s — against the live L&B site's single-JPEG
  chart (WCAG 1.1.1 failure) and Kimes' table-with-no-`<th>`.
- **Alt text discipline**: 0 missing across every sampled route, product alts are descriptive
  prose, and generated imagery is labelled as such in the alt itself ("Generated campaign
  artwork: …") — content-integrity §12 enforced at the attribute level.
- **Heading order**: perfect ladder on `/` (1→2…), clean on 6 of 8 routes.
- **27 `prefers-reduced-motion` rules**; no zoom blocking; skip links on every route; the reduced
  motion / no-JS hero renders solid bone glyphs at **18.82:1**.
- **No restricted-price leakage on `/wholesale`**: the only dollar figure is the public $50
  minimum; the gate reads as invitation ("Approved typically within a business day").

### 4.2 Where Frontier House still fails

The section that matters. Element → measured value → the fix.

1. **The hero headline's "contrast guarantee" is a lightness guarantee, not a contrast
   guarantee — and it measurably fails mid-film.** Verified: `background-blend-mode: screen,
   screen` with floor `linear-gradient(115deg #e4c391, #c89a62)` is present and load-bearing (the
   corral plate contains true-black pixels, sampled min luminance 0.0000, which screen-blend
   rescues to #c89a62). But the floor only guarantees the *fill* never goes dark. Sampling the
   actual film frames behind the headline band, composited with the section's radial scrim
   (`rgb(22,19,15)`, decaying to transparent at 70% radius), fill-vs-backdrop contrast bottoms out
   at **1.43:1 (t=0.2s), 1.65 (2.5s), 1.40 (5s), 1.90 (7.5s)** — only the final frame (9.5s)
   clears 3:1 (3.26). Need: 3:1 (38.8px text). **Fix:** make the backdrop deterministic where the
   headline sits — extend the radial to hold ≥0.6 alpha across the whole headline box (floor CR
   rises to ≥ ~4.3:1 against `rgb(22,19,15)`), or grade the film asset to cap luminance ≤ L0.088
   in the headline safe area. File: `src/ui/frontier-ignition.tsx` + the `.ignition` radial in
   `src/app/globals.css`.
2. **Contact-sheet captions: the scrim starts at zero exactly where the text starts.** The
   `linear-gradient(0deg, rgba(0,0,0,0.78), rgba(0,0,0,0))` box coincides with the caption box
   (68px; caption spans rel 0→1), so the **top caption line sits at alpha ≈ 0**; worst-case over a
   light image region **1.67:1**, at **10px** type, ×20 tiles. **Fix:** extend the scrim to reach
   ≥0.6 alpha at the caption's first line (start it ~40px above the caption box), and raise 10px →
   11–12px. Component: the contact-sheet tile caption.
3. **Announcement-bar focus ring fails non-text contrast on every page.** "Plan your visit" sits
   on a `rgb(10,10,10)` band; the site-wide Tobacco `#734F36` ring measures **2.73:1** there
   (needs 3:1; text itself is fine at 11.86:1). **Fix:** a light ring variant on dark bands — tan
   `#D9C5B2` measures 11.9:1.
4. **Unscrimmed interactive text over the hero film**: "Read the film transcript" (12px tan,
   scrim 0, worst **1.67:1**, ×3) and the secondary "See new arrivals" button (14px bone on
   transparent button ground, scrim 0, worst **1.12:1**); the "Play the film" label's own scrim is
   0.55 alpha → worst **3.97:1** against 4.5 needed at 12px. **Fix:** give these three a solid or
   ≥0.6-alpha pill ground (the film is 10s and dark-graded, but nothing *guarantees* it under
   them).
5. **PLP banner text over photography with no scrim at all**: `/shop/women` h1 "Women" (48px bone,
   worst **1.12:1**) and breadcrumb "Home" (14px tan, worst **1.67:1**, ×3). Same class of failure
   we flagged on Kimes' category banners. **Fix:** the same scrim floor the campaign stage already
   uses, or set the banner text on the solid ground above the image.
6. **Heading skips**: `/shop/women` jumps h1→h3 (product cards are `<h3>` with no `<h2>` between);
   `/calendar` opens h1→h3. **Fix:** demote cards to `<h2>` or insert the section `<h2>`.
7. **The men's demo PDP borrows the women's size tables.** `/mens/everyday-mid-jean` links "Size
   and fit" → `/size-and-fit/women`; `/size-and-fit/men` (and `/mens`) return **404**. The
   measurements shown are factually wrong for the garment. Also: no compare affordance exists on
   this PDP (0 matches), so "the PDP compares" does not hold on the men's route. **Fix:** ship a
   men's size page for the demo or label the link honestly; extend compare to the demo PDP.
8. **The apply form pre-declares no error mechanics.** `/wholesale/apply` (4 fields — a
   measured-ly humane counter to the live site's 25) has labels, autocomplete, fieldset/legend —
   but **zero `role="alert"`, `aria-live`, or `aria-describedby`** anywhere in the DOM. If
   server-side validation re-renders with unassociated error text, SC 3.3.1/4.1.3 fail on the
   first mistake a buyer makes. (Submission not exercised; static inspection only.) **Fix:** error
   summary with `role="alert"` + per-field `aria-describedby`, server-rendered.
9. **Gallery "Enlarge" links say their name twice** — accessible name computes to
   "EnlargeEnlarge the front view…". Harmless visually, noisy in a screen reader. **Fix:** make
   the visible word `aria-hidden` or drop the visually-hidden duplicate.
10. **`/calendar` marks up no dates as `<time datetime>`** (0 on a page that exists to state
    market dates; 16 plain lists). Not a WCAG failure; it is a semantics/machine-readability miss
    on the page most likely to be read by an assistant or calendar tool. **Fix:** wrap the August
    18–21 and October 20–23 ranges in `<time>`.

**Honest scope notes:** the video-fallback paragraph inside `<video>` on `/mens` is only rendered
by non-supporting browsers (benign flag); keyboard *activation* was assessed by construction
everywhere (instrument cannot inject char events); the form was not submitted, so server-side
error rendering remains unverified.
