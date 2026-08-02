# 11 — Accessibility Audit

**Target: WCAG 2.2 Level AA.** All counts `MEASURED` across 48 HTML files.
This audits **design sources**, not a running application — several criteria can only be
confirmed at build. Those are marked **UNASSESSABLE**, never assumed passing.

---

## 1. Signal census

| Signal | Files | Assessment |
| :--- | :--- | :--- |
| `alt=` | **37 / 48** | Present, but text quality unverified |
| `<main>` | 39 / 48 | Good landmark discipline |
| `<button>` | 37 / 48 | Real buttons, not divs — genuinely good |
| `<h1>` | 34 / 48 | Heading present |
| `<nav>` | 29 / 48 | Good |
| `aria-label` | 8 / 48 | Sparse |
| **`prefers-reduced-motion`** | **2 / 48** | **Specified globally; near-absent** |
| **`role=`** | **1 / 48** | Near-absent |
| **`tabindex`** | **0 / 48** | No focus management |
| **`:focus`** | **0 / 48** | **No focus indicator anywhere** |
| **`aria-live`** | **0 / 48** | No status announcements |
| **`<form>`** | **0 / 48** | No forms at all |
| **`<track>`** | **0 / 48** | No caption or cue timeline |
| `<video>` / `poster=` / `playsinline` | **0 / 48** | No media elements |
| `env(` / `safe-area` | **0 / 48** | No safe-area handling |

`INFERRED` — The **semantic foundation is better than typical** — real buttons, real
landmarks, real headings, alt attributes on most images. The **interaction layer is
absent** — no focus, no roles, no live regions, no forms.

---

## 2. Critical failures

### 2.1 Focus indicator — specified, non-conformant, unimplemented

> `OBSERVED` — `engineering_export_package.md` §4:
> *"Focus States: 2px solid Oxidized Silver rings for all keyboard navigation."*
>
> `MEASURED` — Oxidized Silver `#A7A6A2` on Bone White `#F5F2EE` computes to **2.18 : 1**
> against a **3 : 1** requirement (WCAG 1.4.11). **The specified indicator fails.**
>
> `MEASURED` — `:focus` appears in **0 of 48 files**. It is also unimplemented.
>
> **Double failure: WCAG 2.4.7 (AA) and 1.4.11 (AA).**

`RECOMMENDATION` — Focus ring `#734F36` Tobacco Leather (**6.49 : 1**) or `#7C7B79`
(**3.79 : 1**). Both are in or adjacent to the approved palette.

### 2.2 Reduced motion — specified twice, implemented twice

`OBSERVED` — V3 `design.md`: *"All transitions replaced with 400ms opacity crossfades."*
`engineering_export_package.md`: *"Global `prefers-reduced-motion` listener."*
V3.1 spec: *"Replace 3D flight with high-fidelity crossfades."* V3.1 has a **dedicated
reduced-motion frame** (`12j`).

`MEASURED` — `prefers-reduced-motion` appears in **2 of 48 files**.

`INFERRED` — Intent is documented four times; implementation is essentially absent. Also
note `CLAUDE.md` §8.2: **nothing in the stack provides this** — it must be budgeted
explicitly at every layer.

### 2.3 Contrast

`MEASURED` — from documented tokens (see [06](06_DESIGN_TOKEN_RECONCILIATION.md) §2):
**four failing pairs**, including the focus ring at 2.18 : 1, Sandstone borders at
1.50 : 1, and Rust Red on Ink Black at 2.04 : 1.

`OBSERVED` — V3.1's own QA flags *"Bone White typography on Electric Cobalt transition
light requires AA check."* `INFERRED` — **Electric Cobalt has no hex value in any source**,
so the check cannot be performed. Owner decision **D-07**.

**UNASSESSABLE** — Text over generated photography is pervasive (Frame 5, Frame 1,
Frame 6). Contrast against a photographic background cannot be computed from tokens; it
must be sampled per composition, and it typically needs a scrim.

---

## 3. The four criteria this project was warned about

| Criterion | Level | Status |
| :--- | :--- | :--- |
| **2.2.2 Pause, Stop, Hide** | **A** | **AT RISK — partially mitigated.** Buckle sequence S2–S8 = **7,100 ms**, auto-starting, in parallel with content. `Skip Intro` exists and plausibly satisfies the *hide* requirement — **if** visible from frame one and keyboard-reachable. Must be verified |
| **2.5.7 Dragging Movements** | **AA** | **FAIL as specified.** Four mobile depth carousels are swipe-driven; **no single-pointer alternative specified**. Product Anatomy drag-to-rotate has the same gap |
| **2.4.11 Focus Not Obscured** | **AA** | **UNASSESSABLE — high risk.** Pinned scroll sections (Frame 7, camera passage) plus 0 focus management. Cannot be confirmed without a build |
| **2.5.8 Target Size** | **AA** | **UNASSESSABLE.** No interactive element in the exports carries measured dimensions. Shoppable-film hotspots and carousel controls are the risk points |

---

## 4. Shoppable video — nothing to undo

`MEASURED` — 0 `<video>`, 0 `<track>`, 0 hotspot implementation.

`OBSERVED` — `engineering_export_package.md` describes hotspots as *"Silver Ring (Pulse) /
Tappable Dot / Static Label."*

`INFERRED` — **Because nothing is implemented, the correct pattern can be adopted from the
start** — `CLAUDE.md` §8: real DOM `<button>` hotspots driven by a
`<track kind="metadata">` cue timeline, never canvas-drawn, plus a **parallel,
always-visible, non-time-gated product list** beneath the film. That list is simultaneously
the accessibility mechanism, the Tier 0 fallback and the SEO surface.

`INFERRED` — Note also that a hotspot appearing for three seconds is unreachable by
keyboard unless the film **pauses on hotspot focus**. Auto-pause on focus and on
`pointerenter` should be treated as a requirement, not a refinement.

---

## 5. Canvas, WebGL and screen readers

`INFERRED` — There is effectively **zero assistive-technology exposure of WebGL content**,
and no standards work is close to changing that. The only working pattern is a **parallel
DOM**: real, focusable, labelled elements mirroring the canvas state, with the canvas
marked decorative.

`OBSERVED` — **V3.1 already specifies this**: *"Accessibility: Semantic HTML overlay for
all category labels (Skip Intro, navigation)."* `INFERRED` — This is the correct
architecture and it is already in the approved direction. It must survive implementation.

---

## 6. Content-level obligations

| Obligation | Status |
| :--- | :--- |
| Meaningful alt text on every image | `alt=` present in 37/48; **quality unverified** |
| **Size and fit as structured text, never an image** | **Not designed anywhere** in V3 or V3.1. The live site's size chart is a single JPEG with zero text — a probable **WCAG 1.1.1** failure and the thing most directly contradicting the brand's inclusivity claim |
| Captions / transcript for film | 0 `<track>`; no film exists |
| No text baked into images | **UNASSESSABLE** — generated imagery may contain rendered text |
| Editorial alt text names the garment | Not addressed |

---

## 7. Route announcement, states, forms

`MEASURED` — `aria-live` **0**; `<form>` **0**; `<input>` **1**.

`INFERRED` — Not designed anywhere: loading announcements, error messages, form labels,
validation, empty-state messaging, pending-approval status. The wholesale gate — the first
thing a prospective retailer meets — has **no accessible form** in any source.

---

## 7a. Visual pass findings (2026-08-01, 12 of 56 frames)

Scale per the brief: **EXACT FAILURE · VISUAL RISK · APPEARS ACCEPTABLE · CANNOT DETERMINE
FROM STATIC FRAME.** No exact ratio is claimed from a rendered pixel.

| Observation | Frame | Verdict |
| :--- | :--- | :--- |
| *"NOT THE WEST"* set in very dark grey on near-black | F1 Ignition | **VISUAL RISK** — appears far below 4.5:1 |
| *"SKIP TO SHOP"* small, grey, bottom-right | F1 | **VISUAL RISK** — but **it exists**, satisfying the one-action exit |
| Subhead in white directly over busy photography, **no scrim** | F6 Homepage | **VISUAL RISK** |
| **No pause / stop / hide control** on a 12-chapter film carrying a scrubber | F4 Shoppable Film | **VISUAL RISK, high confidence — WCAG 2.2.2 (A)** |
| Hotspot dots very small and **clipped at the frame's top edge** | F4 | **VISUAL RISK — WCAG 2.5.8** |
| **No parallel product list** beneath the film | F4 | **VISUAL RISK** — the required non-time-gated equivalent is absent |
| Size selector uses **buttons, not a dropdown**, with a visibly **disabled** out-of-stock size | F8 PDP | **APPEARS ACCEPTABLE** — genuinely good |
| **"Size Guide"** link present at the point of decision | F8 | **APPEARS ACCEPTABLE** |
| Mode pill dark-on-dark and **partially occluded** by the artifact | 8e | **VISUAL RISK** |
| Orbiting category labels with no visible focus affordance or ordering cue | 8f | **CANNOT DETERMINE** — reading order undefined in a static frame |
| *FRONTIER* wordmark runs **behind** photo cards, partially occluded | F2 | **VISUAL RISK** if it is a heading |
| **"THE COLLECTION" clipped mid-word** by a panel edge | 8g_6 | **EXACT FAILURE** — text is truncated, not styled |
| Tab bar, generous touch targets, semantic category rows | 12k Fallback | **APPEARS ACCEPTABLE** |
| *"Static Preview"* subtitle in light grey | 12k | **VISUAL RISK** |
| Fallback **states why 3D is disabled** in plain language | 12k | **APPEARS ACCEPTABLE** — good practice |

### Batch 2 additions (11 further frames)

| Observation | Frame | Verdict |
| :--- | :--- | :--- |
| **Mode labels (`CINEMA MODE`, `BALANCED MODE`, `INSTANT SHOP`) render in near-invisible light grey on white**; only **one** of three radio indicators is visible | `12i` Mode Selector | **CANNOT DETERMINE** whether a contrast failure or a captured mid-entrance animation — **a problem under either reading**, on an accessibility-adjacent surface |
| **Explicit circular ← → carousel buttons** | `12f_4` Wholesale | **APPEARS ACCEPTABLE** — the 2.5.7 alternative, present on 1 of 4 carousels |
| Carousel dots only (position indicator, not an operable control) | `12f_1` Women | **VISUAL RISK — 2.5.7** |
| No carousel affordance at all | `12f_2` Plus, `12f_3` Acc & Home | **VISUAL RISK — 2.5.7** |
| **Progress bar + mode choice + two escape actions during load** | `12a` Poster-first | **APPEARS ACCEPTABLE** — exemplary |
| **SKIP INTRO** prominent, high contrast, top-right | Mobile hub | **APPEARS ACCEPTABLE** |
| Ring category labels small, letter-spaced, low-contrast grey on near-black; ring nodes are tiny dots | Desktop hub | **VISUAL RISK** — contrast and target size |
| Text behind the centre card **clipped** — *"…Detail V3.1"*, *"…LECTED REALM"* | Desktop hub | **EXACT FAILURE** — text truncated, not styled |
| Product name and price **clipped** in the New Arrivals rail — *"Raw Selv…"*, *"Heavy In…"* | `12j` | **EXACT FAILURE** |
| Wordmark **wraps to two lines and overlaps the photo edge** | `12f_1` | **VISUAL RISK** |
| Category labels over photography with no scrim; *Heavy Denim* falls over a bright sky region | `12j` | **VISUAL RISK** |
| *NOT THE WEST* near-invisible dark-grey-on-black, unchanged | V3 prototype | **VISUAL RISK** — recurs |
| Tab bar appears to be **missing the Bag item** | `12f_4` | **CANNOT DETERMINE** — may be cropped |
| No safe-area inset visible anywhere | `12a`, `12k`, hub, carousels | **VISUAL RISK** |

`OBSERVED` — **The reduced-motion path (`12j`) achieves full content parity** — same
categories, same products, same prices, same wholesale link as the animated surfaces.
That is the correct reduced-motion behaviour and it is already designed.

`OBSERVED` — **No focus indicator is visible in any of the 23 frames inspected**, consistent
with `:focus` appearing in 0 of 48 files.

> ### CORRECTION (batch 3) — a pause control **does** exist
> This document previously stated *"no pause, stop, hide or sound control appears in any
> inspected frame."* **That is false.**
>
> `OBSERVED` — **`8c` Material Lighting Reveal carries a ⏸ pause button and a 🔊 sound
> toggle**, both in circular containers, bottom-right. `OBSERVED` — **`12g` carries a ▶ play
> affordance** on its Campaign Film tile.
>
> **Revised: media controls exist but are not systematic.** Of the animated surfaces
> inspected, `8c` has them; `8b`, `8d`, `8e`, `8f`, `8g_1`, V3.1 `frame_3`, V3.1 `frame_5`
> and V3 Frame 4's twelve-chapter film do **not**. **WCAG 2.2.2 is partially satisfied and
> inconsistently applied** — the pattern exists and simply has to be applied everywhere.

### Batch 3 additions

| Observation | Frame | Verdict |
| :--- | :--- | :--- |
| ⏸ pause + 🔊 sound controls present | `8c` | **APPEARS ACCEPTABLE** — the model to systematise |
| ▶ play affordance on the film tile | `12g` | **APPEARS ACCEPTABLE** |
| **"Skip to Shop" as a well-formed pill**, good contrast | V3.1 `frame_3` | **APPEARS ACCEPTABLE** — better than V3 Frame 1's grey text |
| *"NOT THE WEST YOU REMEMBER"* dark grey on black | V3.1 `frame_3` | **VISUAL RISK** — recurs from V3 Frame 1 |
| Circle, spokes and monogram at very low luminance | `8d` | **VISUAL RISK** |
| Faint circle and dots on near-black; ~95% empty frame | `frame_5` | **VISUAL RISK** |
| Category nav grey-on-black, small; *"APERTURE LOCKED"* blue-on-black | `8g_1` | **VISUAL RISK** |
| Caption strip **clipped at both edges** | `8b` | **EXACT FAILURE** |
| Frame label **burned into the artwork** | `8g_2`, `8g_4` | **EXACT FAILURE** — not shippable content |
| Leftover frame label bleeding into a product card | `8g_8` | **EXACT FAILURE** |
| *"Campaign Film"* label clipped/overlapped | `12g` | **EXACT FAILURE** |
| **Price collides with the wrapping product title** | `12h` | **EXACT FAILURE** |
| Size buttons with a **clear selected state** + **Size Guide** link | `12h` | **APPEARS ACCEPTABLE** — good |
| Filter control is **icon-only, unlabelled** | `12g` | **VISUAL RISK** |
| **Tab-bar order differs** between frames (Home-first vs Discover-first) | `12g` vs `12k`/hub | **VISUAL RISK** — navigation instability |
| Search field visible and labelled | `8g_8` | **APPEARS ACCEPTABLE** |

`OBSERVED` — **Text truncation is now the most frequent single defect in the corpus** —
seven instances across 33 inspected frames.

`INFERRED` — **Persistent navigation survives across every inspected surface** — the
wordmark, mode selector, cart and account icons are present on Frames 1, 4, 6, 8, 8e, 8f
and 8g_6. That is a real accessibility asset: a user is never stranded inside the cinema.

---

## 8. Verdict

| Area | Verdict |
| :--- | :--- |
| Semantic structure | **Good** — real buttons, landmarks, headings |
| Focus management | **Critical failure** — 0 implementations, specified colour fails contrast |
| Reduced motion | **Critical gap** — documented four times, implemented twice |
| Contrast | **4 documented failures**, plus one uncheckable (Electric Cobalt) |
| Dragging alternatives | **Fail as specified** — 4 carousels, 0 alternatives |
| Media accessibility | **Not started** — and therefore not yet wrong |
| Forms | **Not designed** |
| Size and fit content | **Not designed** — the brand's stated identity is unserved |

> `INFERRED` — **None of these is a design failure; all are specification gaps.** Stitch
> does not emit focus states or ARIA. The risk is that "V3 is approved" is read as "V3 is
> accessible." It is not assessed as accessible, and four AA criteria are known to bite
> this specific art direction.
>
> The bar worth stating: WebAIM's February 2026 Million found **95.9%** of home pages have
> detectable failures, and **shopping sites average 71 errors — 27% worse than the web
> average.** Ordinary discipline here is a genuine differentiator, not a compliance chore.
