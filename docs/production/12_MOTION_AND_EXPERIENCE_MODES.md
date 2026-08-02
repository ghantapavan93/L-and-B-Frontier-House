# 12 — Motion and Experience Modes

---

## 1. The three modes

**Mode changes how much choreography wraps the content. It never changes the content.**

| | **INSTANT SHOP** | **BALANCED** *(default, first visit)* | **CINEMA** *(opt-in)* |
| :--- | :--- | :--- | :--- |
| Entry | Straight to catalogue | Poster-first, skippable | Full ignition |
| Choreography | None | Entrance transitions only | Full scroll-linked narrative |
| Media | Posters only | Muted loop + poster | Film, sequences |
| Contact sheet | Plain responsive grid | Animated entrance, static after | Spatial reveal |
| 3D | Never | Never *(Phase 1–2)* | Only if D-08 approves, Phase 3 |
| Route transitions | None | View Transitions, default cross-fade | View Transitions, custom |
| **JS budget** | **≤ 90 KB** | ≤ 220 KB | ≤ 300 KB critical + lazy chunks |
| **Target LCP p75** | **≤ 1.0 s** | ≤ 1.6 s | ≤ 2.0 s |

**Never differs across modes:** products · prices · packs · availability · sizes · product
truth · commerce actions · **URLs** · accessibility guarantees.

**Default for an authenticated buyer: INSTANT SHOP.** They are at work.

---

## 2. Mode resolution

First match wins:

1. **Explicit user choice**, persisted in a **first-party cookie** so it is available
   **server-side on the first render**. A mode decided client-side is a mode that flashes.
2. **`prefers-reduced-motion: reduce`** → never Cinema. See §3.
3. **Save-Data header or a known-slow connection** → Instant Shop.
4. **Direct feature detection** — WebGL context probe, `MAX_TEXTURE_SIZE`, a **first-frame
   timing measurement**. Fail → not Cinema.
5. **Viewport + `hardwareConcurrency`.**
6. **Authenticated buyer** → Instant Shop.
7. Otherwise → **Balanced**.

> **Never gate on `navigator.deviceMemory` or the Network Information API.** Neither is
> supported in any version of Safari or Firefox, so a tiering system built on them silently
> promotes every iPhone to the top tier. **Use them only to demote, never to promote.**

**Persist per device**, not per account — the same buyer uses a phone on the shop floor and a
desktop at night with different needs. **Always leave a visible, permanent control.** A
preference a user cannot find is a trap.

`OBSERVED` — The mode selector's composition is currently unstable across the corpus: `12b`
shows only two peers with Instant demoted to a text link; V1 Direction B names the third mode
**"Grid"**; `8d` shows a different two-item nav entirely. **One composition, three peers,
everywhere.**

---

## 3. Reduced motion — not a fourth mode

**`prefers-reduced-motion` applies *inside* every mode.** It is not a synonym for Instant
Shop.

**Correct behaviour:** keep **user-initiated** interaction responsive; remove motion the user
**did not initiate**. Pointer and tap response stays; scroll-driven parallax, scrubbing and
spatial reveals go.

**Never silently downgrade someone to a plain grid because of a health setting** — that
removes content they asked for.

**Substitute, don't delete.** Swap the animated property (transform → opacity), keep timing
and easing. **No overshoot easing anywhere in a reduced-motion path.**

`OBSERVED` — **V3.1 `12j` is the strongest reduced-motion design in the corpus** — a
complete, editorial, fully shoppable catalogue with real products, prices, categories, a
wholesale link and a tab bar. **Content parity is already achieved.** Use it as the reference.

> **Nothing in the stack provides this for you.** The dominant smooth-scroll library ships
> **zero `matchMedia` calls**. Budget the work explicitly, at every layer.

---

## 4. Technology ownership — one mechanism per effect

| Mechanism | Owns | Rationale |
| :--- | :--- | :--- |
| **CSS / WAAPI** | Hovers, mode switches, cart feedback, reveals, cross-fades | Compositor-friendly; cheapest INP |
| **View Transitions (same-document)** | Route and world changes, category gateway | Baseline across all four engines; near-zero bundle |
| **GSAP + ScrollTrigger** | Pinned campaign sequences, contact-sheet reveal | Needs pinning and progress callbacks — CSS scroll-driven animation provides neither |
| **Native `<video>`** | Campaign film, buckle sequence, camera passage *(after redesign)* | Deterministic, non-branching, universally supported, colour-managed |
| **Canvas 2D** | Frame-sequence scrub, if one survives | ≤ 60 frames, ≤ 80 KB/frame, WebP/AVIF |
| **SVG** | Routing lines, product-anatomy callouts, the Frontier Thread | Scalable, semantic, animatable, tiny |
| **Static imagery** | Every Tier 0 equivalent | A fallback that needs a GPU is not a fallback |
| **Three.js** | **Nothing in Phase 1 or 2.** Phase 3 only, behind D-08 and a separate proof | R3F alone (~250 KB gzip) exceeds the entire 180 KB JS budget |

**CSS scroll-driven animation is progressive enhancement only** — Baseline **Limited**;
**Firefox has not shipped it**; Safari only since 26. Use inside
`@supports (animation-timeline: scroll())` with a JS path as the interoperable fallback.
Verify against MDN browser-compat-data or webstatus.dev — **caniuse projects a fictional
"Firefox 156."**

**Do not adopt a smooth-scroll library.** Nothing in the corpus requires one.

---

## 5. Motion rules

1. **Interactive motion ≤ 400 ms.** 66 current values exceed it.
2. **Two easing curves.** Entrance `cubic-bezier(0.16, 1, 0.3, 1)`; exit slightly faster.
3. **Never intercept the wheel.** V3.1 maps `Wheel/Scroll` to a camera Z-axis — that is
   scroll interception, measured at ~**5.6× more errors (p<0.001)** with no time saving, and
   worse on mobile. **Drive the same value from native scroll position.**
4. **Poster-first, always.** Every sequence has a still that carries the full message alone.
5. **Any sequence over 5 seconds carries a visible pause/stop/hide.** The buckle sequence is
   **7.1 s**.
6. **Every sequence is interruptible**, and browser Back exits rather than replays.
7. **No blocking animation on any path to product.**
8. **A failed animation must never hide a product** — scope hidden states under a JS-set
   attribute so a JS failure leaves content visible.

---

## 6. Media controls — exist, but inconsistently

`OBSERVED` — **`8c` carries a ⏸ pause and a 🔊 sound toggle; `12g` carries a ▶ play
affordance.** But `8b`, `8d`, `8e`, `8f`, `8g_1`, V3.1 `frame_3`, `frame_5` and **V3 Frame
4's twelve-chapter film** have none.

**WCAG 2.2.2 is partially satisfied and inconsistently applied. The pattern exists — apply it
everywhere.** `8c` is the model.

**`prefers-reduced-motion` is never a substitute for a visible pause control.**

---

## 7. Shoppable video

Hotspots are **real DOM `<button>` elements** driven by a **`<track kind="metadata">` cue
timeline** — never canvas-drawn, which is keyboard-unreachable by construction. Minimum
**24 × 24 CSS px** (WCAG 2.5.8). **Auto-pause on hotspot focus and pointer-enter** — a
three-second hotspot is otherwise unreachable by keyboard.

**Always ship a parallel, always-visible, non-time-gated product list beneath the film.**
That list is simultaneously the accessibility mechanism, the Tier 0 fallback and the SEO
surface.

`MEASURED` — V3 Frame 4 currently has hotspot dots that are **very small and clipped at the
frame edge**, a 12-chapter scrubber, **no pause control** and **no parallel list**. Nothing
is implemented, so the correct pattern can be adopted from the start.
