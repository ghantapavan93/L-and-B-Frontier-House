# Phase 2 — Cinematic gap map

**Inspection source: Stitch MCP, project `projects/15196412611531097008`.** Fifteen screens
fetched and viewed as images through the MCP screenshot URLs (not filenames, not specs):
V3 Frames 1, 2, 3, 5, 8, 11, 12 · V3.1 Frames 3, 8B, 8C, 8G-6, 12A, 12B, 12F-1 · the
connected desktop hub. Local exports remain the fallback record.

**Visual acceptance checklist, read off the screens themselves:**

- **Ignition (V3.1 F3 / 12B):** near-black field; ghost display headline; a **luminous
  thread that draws the L&B monogram** — fibre-like, glowing, not a flat neon stroke; *Skip
  to Shop* pill; immediate nav.
- **Poster-first (12A):** stacked serif wordmark, "crafted" statement in label-caps, ENTER
  SHOP block action, *Skip Intro* below, menu/search compact chrome.
- **Buckle (8B/8C):** **scalloped rectangular** western buckle; tooled leather, darkened
  silver, brass studs, **turquoise inlays**, denim ground; engraved luminous script; SKIP
  INTRO always visible; stage label (`08: REVEAL`) in label-caps.
- **Four Worlds (F5):** full-height layered vertical panels, adjacent worlds visible at the
  edges; centre editorial card with eyebrow → display title → body → single CTA.
- **Image Becomes Film (F3):** full-width atmospheric image with ghost headline, then a
  **Chapter Progression** strip — numbered thumbnails `01 DESIGN · 02 SOURCE · 03 CRAFT ·
  04 FIT`.
- **Mobile world carousel (12F-1):** full-bleed portrait per world, world name in serif,
  one supporting line, *Enter Collection* pill, **dot indicators**, compact header
  (menu · wordmark · search), bottom tab bar.
- **Wholesale (F11):** virtual rack of garments, label/value commerce rows, operational
  panels.

---

## Route-by-route

### Homepage entry

| | |
| :--- | :--- |
| Current | Opens directly on the photographic hero. Strong, but it is a catalogue opening — no ignition, no artefact, no invitation |
| Stitch reference | V3 F1, V3.1 F3, 12A, 8B/8C |
| Missing depth | The dark entry plane in front of the commerce world |
| Missing motion | The thread drawing the monogram; the buckle's material reveal |
| Missing media | The campaign film (does not exist — poster stands in) |
| Missing interaction | *Enter the Frontier* / *Skip to Shop* / *Wholesale access* |
| Approach | New `FrontierIgnition` section above the hero: ink field + grain, **SVG buckle proof** (scalloped rectangle, engraved L&B, silver/copper/turquoise/denim gradients), **two-layer SVG thread** (blurred glow underlay + dashed fibre core) that draws once via CSS `stroke-dashoffset`, ghost statement, three actions. All server-rendered; anchors, no JS |
| Reduced motion | Thread and engraving fully drawn; zero animation; identical content |
| Performance risk | None measurable — inline SVG ≈2 KB, no script, no image. Draw runs once, under 5 s, no loop → no WCAG 2.2.2 pause obligation |

### Thread-to-Trade

| | |
| :--- | :--- |
| Current | Five columns, one stitch band — informative, static |
| Stitch reference | V3 F3 chapter progression; V3.1 8G-4 routing geometry |
| Missing depth/motion | Stage imagery; a continuous routing line travelling the journey |
| Missing media | Manufacturing/distribution photography (none exists — **and no location may be implied**, OQ-04) |
| Approach | Vertical journey: five alternating stages, each with an image plane (craft detail, swirl-jean back, lineup crop) or an **art-directed woven/route swatch** where no honest photo exists; one statement + one verified proof per stage; a single continuous SVG thread down the spine, drawn by scroll (`animation-timeline: view()` behind `@supports`) |
| Reduced motion | Line fully drawn; stages static; stacked on mobile |
| Performance risk | Images already optimised; swatches are CSS/SVG |

### Living Contact Sheet

| | |
| :--- | :--- |
| Current | Strongest section; frames link straight to PDP |
| Stitch reference | V3 F2 eruption; 8G-8 arrival |
| Missing interaction | Frame **selection** → editorial story → product route |
| Approach | CSS `:target` stories: nine pre-rendered story panels inside the sheet; selecting a frame targets its panel — larger image, story copy from the product's own description, *View product* and *Close*. URL hash is the persistence; anchors are the keyboard path; **zero JavaScript, page stays static** |
| Reduced motion | The panel simply appears (no transition) — "direct expansion" by construction |
| Performance risk | +9 small HTML blocks; images lazy |

### One West — Product Worlds

| | |
| :--- | :--- |
| Current | Flat category cards |
| Stitch reference | V3 F5; V3.1 12F-1 |
| Missing | The gateway feel; adjacent-world visibility; prev/next; mobile depth |
| Approach | Worlds = **Women · Girls · Accessories · Wholesale** (verified only). Desktop: four tall overlapping panels, alternating vertical offsets, serif world names over imagery. Mobile: **scroll-snap 2.5D carousel** — side slides recede via scroll-driven scale behind `@supports`; **prev/next are anchor buttons** and dots are anchor links, so it is never swipe-only and works without JS |
| Reduced motion | No recession; a clean snap carousel; buttons unchanged |
| Performance risk | None — CSS only |

### Product Detail

| | |
| :--- | :--- |
| Current | Correct two-column commerce; arrives like a spec sheet |
| Stitch reference | V3 F8 Garment Portal |
| Missing | Image-led arrival; anatomy callouts; editorial exit |
| Approach | Flagged-off-safe additions: opening editorial band (blurred oversize backdrop + sharp contained image — protects the 360 px sources from soft full-bleed), **Product Anatomy** as a semantic `<ul>` of the product's *own* attributes with SVG leader lines (decorative, `aria-hidden`), *More from the sheet* related frames, *Return to the contact sheet* |
| Reduced motion | It is all static layout |
| Performance risk | One extra render of an already-loaded image |

### Wholesale Showroom

| | |
| :--- | :--- |
| Current | Text-heavy prose page |
| Stitch reference | V3 F11 virtual rack; 12F-4 gated assortment |
| Approach | Visual opening over the approved banner; partnership statement; **four-step approval journey**; **Virtual Rack** — rail-and-hooks SVG over a strip of real product photography, names and availability only, *Enter the showroom* gate (no price, per 12F-4); terms; proof band (100% · 2.64 days · $50 · packs of 6); reorder preview panel |
| Performance risk | Existing optimised images only |

### Mobile chrome

| | |
| :--- | :--- |
| Current | Three stacked header rows eat the first screen |
| Stitch reference | 12A / 12F-1 compact chrome |
| Approach | `<details>` disclosure menu (no JS, keyboard-native): Menu · centred wordmark · Account on one row; full nav inside the disclosure. **Search is not built** — no search feature exists yet and a dead search field would be a lie. **Bottom tab bar deferred** — not justified with four destinations. Both recorded |

### Hero media slot

| Approach | `HeroMedia` component, production-ready API: desktop/mobile sources, poster, muted, `playsinline`, visible pause, captions/transcript hooks, failure→poster. **No film exists, so it renders the poster path and ships zero video and zero JS.** Asserted: no `<video>` in any response today |

---

## Motion system

| Parameter | Value |
| :--- | :--- |
| Entry / exit | 300 ms / 200 ms, `--ease-entrance` / `--ease-exit` |
| Ignition thread draw | 2.8 s once on load, CSS only; **no loop** (< 5 s ⇒ no pause control owed) |
| Scroll behaviour | `animation-timeline: view()` behind `@supports` + `prefers-reduced-motion: no-preference`; **never wheel interception** |
| Image depth | ±2–4% translate drift (existing `depth-*`) |
| Sheet expansion | `:target`; 300 ms fade-rise; none under reduced motion |
| Interruption / skip | Everything is native scroll and anchors — scrolling past *is* the interruption; *Skip to Shop* jumps the whole sequence |
| GSAP | **Not added.** Nothing in this pass needs synchronized timeline choreography; CSS/SVG covers all of it at 0 KB. GSAP remains reserved for the Phase 3 pinned camera passage |

## Explicitly not built

The exported circular/coin buckle geometry · the broken Three.js · any WebGL · the full
camera passage (blocked until the 2D proof is approved) · autoplaying placeholder video ·
menswear, footwear, AR, Home · any invented mill, factory, person or location.

## Feature boundary

`NEXT_PUBLIC_ENABLE_FRONTIER_EXPERIENCE` — read server-side at request time. Unset or `1`:
cinematic homepage (ignition, journey, worlds, sheet stories). `0`: the verified editorial
homepage exactly as shipped in Phase 1. All commerce, authorization and caching identical in
both states; a structural test boots a flag-off server and proves it.

---

## Outcome — implemented 2026-08-02

**360 of 360 tests pass** (156 Vitest, 204 Playwright) · build clean · **First Load JS
unchanged at 103 kB — the entire cinematic layer shipped zero client JavaScript.**

Landed: Frontier Ignition (buckle proof + luminous monogram draw + ghost statement + three
poster-first actions) · Thread-to-Trade journey with scroll-drawn spine and honest material
swatches · contact-sheet stories via `:target` · Four Worlds with offset horizons and an
anchor-driven mobile depth carousel · PDP arrival band, anatomy and related frames ·
wholesale showroom with the gated Virtual Rack · compact disclosure mobile chrome ·
production-ready HeroMedia slot (poster mode; no film exists) · flag-off build tested for
real into `.next-flagoff`.

Fixed along the way, all measured in the browser suite: Next `pushState` does not
re-evaluate CSS `:target` (frame links became native anchors) · the clip checker now skips
descendants of any horizontal scroller · the compact wordmark overflowed 320px · the
flag-off test initially flipped a runtime env that prerendered HTML cannot obey — it now
builds the flag-off variant and boots that, which is the honest test.
