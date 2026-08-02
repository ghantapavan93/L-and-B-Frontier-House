# 15 — Accessibility Specification

**Target: WCAG 2.2 Level AA.** The European Accessibility Act covers e-commerce and has been
in force since June 2025.

Context for the bar: WebAIM's February 2026 Million found **95.9%** of home pages have
detectable failures, and **shopping sites average 71 errors — 27% worse than the web
average.** Ordinary discipline here is a genuine differentiator.

---

## 1. What the audit measured

`MEASURED` across 48 exported files:

| Signal | Count | Consequence |
| :--- | :--- | :--- |
| `alt=` | 37/48 | Present; quality unverified |
| `<button>`, `<main>`, `<nav>`, `<h1>` | 29–39/48 | **Genuinely good semantic base** |
| **`:focus`** | **0/48** | No focus indicator anywhere |
| **`tabindex`** | **0/48** | No focus management |
| **`aria-live`** | **0/48** | No status announcements |
| **`<form>`** | **0/48** | No forms at all |
| **`prefers-reduced-motion`** | **2/48** | Specified four times, implemented twice |
| **`<video>` / `poster` / `<track>`** | **0/48** | No media, no captions |
| **`env()` / safe-area** | **0/48** | No notch handling |

**The semantic foundation is better than typical; the interaction layer is absent.**

---

## 2. The four criteria that bite this project

| Criterion | Level | Where it bites | Requirement |
| :--- | :--- | :--- | :--- |
| **2.2.2 Pause, Stop, Hide** | **A** | The buckle sequence runs **7.1 s** auto-starting; V3 Frame 4 is a 12-chapter film with a scrubber and **no pause** | **A visible pause/stop/hide on every auto-starting sequence over 5 s**, independent of `prefers-reduced-motion`. `8c`'s ⏸ + 🔊 pattern is the model — apply it everywhere |
| **2.5.7 Dragging Movements** | **AA** | Four mobile carousels; only `12f_4` has **← →** buttons. Any drag-to-rotate viewer | **A single-pointer alternative on every draggable surface.** Systematise `12f_4` |
| **2.4.11 Focus Not Obscured** | **AA** | Pinned campaign sections; overlays | A focused element is never **entirely** hidden behind pinned or fixed content |
| **2.5.8 Target Size** | **AA** | Shoppable-film hotspots (currently tiny and clipped); carousel controls; orbit ring nodes | **≥ 24 × 24 CSS px**, or equivalent spacing |

---

## 3. Focus

**The specified focus ring is non-conformant.** `engineering_export_package.md` requires
*"2px solid Oxidized Silver rings"* — **`#A7A6A2` on `#F5F2EE` = 2.18:1** against a 3:1
requirement — and `:focus` appears in **0 of 48 files**.

**Canonical:** `2px solid #734F36` (Tobacco Leather, **6.49:1**) with a 2px offset. Visible on
**every** interactive element. **Never `outline: none` without a conformant replacement.**

**Focus order** follows DOM order. **Focus moves to the new page's `<h1>` (or a
`tabindex="-1"` main landmark) on route commit** — never gated on an animation completing, or
keyboard users wait for motion they cannot perceive.

---

## 4. Media

- **Poster on every video.** `poster` currently appears in 0 files; only ~3% of web `<video>`
  elements use it — a cheap differentiator, and it is the LCP paint.
- **`muted playsinline`**, audio track **stripped at encode** (`ffmpeg -an`) — the only case
  iOS permits autoplay by policy rather than by exception.
- **Design every poster to survive a centred native play glyph** — iOS Low Power Mode
  disables autoplay and forces a play button that **cannot be hidden by CSS**.
- **Captions** when video carries information; a **descriptive transcript** for narrative
  film. For a silent fashion film the transcript describes garment, fabric, colourway and
  model — which doubles as SEO-indexable product copy.
- **Visible pause and sound controls**, per §2.

---

## 5. Canvas and WebGL

There is effectively **zero assistive-technology exposure of WebGL content**, and no
standards work is close to changing it. The only working pattern is a **parallel DOM** —
real, focusable, labelled elements mirroring the canvas state, with the canvas marked
decorative.

`OBSERVED` — **V3.1 already specifies this**: *"Semantic HTML overlay for all category labels
(Skip Intro, navigation)."* **The correct architecture is already in the approved
direction — it must survive implementation.**

---

## 6. Commerce accessibility

- **Every commerce task completable by keyboard and screen reader** — browse, filter, sort,
  select size, add to order, submit.
- **Sizes as buttons, not a dropdown**, with a visible selected state and a disabled state
  for unavailable sizes. `OBSERVED` — V3 Frame 8 and V3.1 `12h` already do this correctly.
- **Size and fit is structured text**, never an image of a table. The live site's chart is a
  single text-free JPEG — a probable **WCAG 1.1.1** failure and the thing most directly
  contradicting the brand's inclusivity claim.
- **Authorized price announcements:** when a buyer signs in and pricing appears, announce it
  via `aria-live="polite"` — the page content has materially changed.
- **Forms:** visible labels (not placeholder-only), programmatic association, inline errors
  linked via `aria-describedby`, an error summary on submit, and **no error message echoes a
  restricted value**.
- **Route announcements** — every route needs a unique, descriptive `<title>`; Next.js's
  route announcer reads it.
- **Loading announcements** via `aria-live` for filter results, order updates and async state.

---

## 7. Text and contrast

`OBSERVED` — **Text truncation is the most frequent single defect in the corpus** — at least
ten instances across the 56 frames: *"THE COLLECTION"* clipped mid-word, product names and
prices cut, frame labels bleeding into cards, a **white wordmark on a light ground**, and a
**price colliding with a wrapping product title**.

**Requirements:** no clipped text at any supported viewport · headline over media meets
**4.5:1**, with a scrim where photography cannot guarantee it · body text 4.5:1 · non-text UI
and focus indicators 3:1 · **verify computed ratios; never assume a token passes.**

---

## 8. Mobile

**Safe-area insets** (`env(safe-area-inset-*)`) — currently 0 of 48 files. Tab bars and
header controls must not sit at the extreme edge. **Touch targets ≥ 24 × 24 CSS px**, with
44 × 44 preferred for primary actions. **Tab-bar order must be stable across routes** —
`12g` currently differs from `12k` and the mobile hub.

---

## 9. Acceptance criteria

A surface ships only when **all** of these pass:

1. Full keyboard traversal, no traps, visible focus at 3:1 minimum
2. Screen-reader pass: landmarks, heading order, labelled controls, announced state changes
3. Every auto-starting sequence > 5 s has a visible pause/stop/hide
4. Every draggable interaction has a single-pointer alternative
5. No focused element entirely obscured
6. All targets ≥ 24 × 24 CSS px
7. Reduced motion removes uninitiated motion and **preserves content parity**
8. Static fallback has **the same products, prices and actions** as the animated view
9. No clipped text at 320 px, 768 px, 1024 px, 1440 px
10. All computed contrast verified — not assumed
11. Every image has meaningful alt text; decorative images are `alt=""`
12. Automated axe scan clean, **plus** manual keyboard and SR verification

**`prefers-reduced-motion` is never accepted as a substitute for a visible media control.**
