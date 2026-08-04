# L&B Frontier House — Storyboard and Motion Specification

**Deliverable B (opening storyboard) and D (motion specification).**

**The opening runs 10 seconds, not 20.** The brief's own restriction list forbids
"mandatory 20-second intros", and its performance section requires an immediate
hero. Twenty seconds of pre-commerce is a bounce, not a brand. Ten seconds holds
every beat the brief asks for; the beats are compressed, not cut. It is skippable
at every moment, runs once per session, and remembers the choice.

---

## B. The signature opening — frame by frame

Timings are absolute. `A` = already built and shipping. `P` = producible now.
`M` = blocked on owner media.

### 0.0 – 4.0 s · IGNITION `A`

| | |
| :--- | :--- |
| **Camera** | Locked three-quarter on the artifact. A 12° bank enters over the final 0.9 s |
| **Image** | Scalloped rectangular buckle on indigo denim in near-darkness. Darkened silver, oxidised copper, tooled leather, four turquoise cabochons |
| **Typography** | Ghost statement *"Not the west / you remember"* at low contrast, behind the artifact. It is display texture; the page's `h1` lives below |
| **Beats** | 0.0–0.3 dormant · 0.3–1.3 warm key rises **and the engraved L&B monogram draws on, left to right** · 1.3–1.9 held · 1.45–3.1 the frame parts · 1.9–3.3 the leather plate sinks into a dark well · 2.6–3.9 **a turquoise thread grows from the monogram terminal** · 3.7 the thread crosses the bottom edge |
| **Controls** | *Enter the frontier* · *Skip to shop* · *Wholesale access* — three real anchors, present from frame 1, at CTA parity. V2 had parity; V3 demoted skip to grey text and lost it. Parity is recovered here |
| **Sound** | None. No autoplay sound, ever |
| **Mobile** | A separate 9:16 composition, not a crop: further back, subject low, upper 50% deliberate negative space for the headline |
| **Reduced motion** | The SVG proof renders fully drawn. No `<video>` element is rendered at all. Content identical |

**Status: shipping.** 4.00 s, 24 fps, MP4 + WebM, desktop and mobile, poster,
captions track, transcript route, native controls. Under the WCAG 2.2.2
five-second threshold, non-looping, user-started — no pause control owed.

### 4.0 – 10.0 s · THREAD PASSAGE `P`

| | |
| :--- | :--- |
| **Camera** | Follows the thread down through a suspended field of loose warp-and-weft strands. 90 mm character, shallow focus, no shake |
| **Image** | Abstract fibre only. **Never fabric made into an article** — no seam, pocket or hardware exists in the scene |
| **Beats** | 4.0–5.4 falls through near-darkness · 5.4–7.5 passes between strands under a 3200 K rake and cool rim · 7.5–9.2 the field separates · 9.2–10.0 clean editorial opening, thread settles lower-centre |
| **Join** | **Straight cut at 4.00 s. No dissolve** — a dissolve softens the one element that must stay continuous |
| **Ends on** | Deep black negative space sized for HTML copy and controls |

**Status: rendered, `ownerApproval: 'pending'`.** 6.000 s both aspects, native
1920×1080 and 1080×1920 from separate cameras.

### Beats folded in, not cut

The brief's contact sheet, grid eruption, campaign film, shop-the-film and four
worlds all survive — **as homepage sections below the fold**, not as a pre-roll.
That is the whole compression: the sequence becomes the page rather than a gate in
front of it.

- **Living Contact Sheet** `A` — nine frames; selecting one opens a story panel via
  CSS `:target`; URL hash is the persistence; zero JS.
- **Grid eruption** `A` — offset horizons and depth drift on the worlds band.
- **Campaign film → shop the film** `M` — blocked on owner photography. Hotspots
  must be real DOM `<button>`s driven by a `<track kind="metadata">` cue timeline,
  never canvas-drawn, with a parallel always-visible product list beneath.
- **Four worlds** `A` — Women · Girls · Accessories · Wholesale. **Verified only.**

---

## D. Motion specification

Nine systems. Each states trigger, timeline, layers, scroll relationship,
reversal, fallback, mobile, reduced motion and commercial purpose.

### Global law

| Rule | Value |
| :--- | :--- |
| Interactive motion | 100–400 ms. Over 500 ms reads as a drag |
| Curves | Two total: `--ease-entrance`, `--ease-exit` |
| Entry / exit | 300 ms / 200 ms |
| **Scroll** | **Never intercept the wheel.** Scroll-*linked* animation reading native position is a different, acceptable thing |
| Scroll-driven CSS | Only inside `@supports (animation-timeline: scroll())` **and** `prefers-reduced-motion: no-preference`, with a JS-free static fallback |
| Auto-motion > 5 s or looping | Owes a **visible** pause control, ≥ 24 × 24 px |
| Client JS budget | **0 KB.** Everything below is CSS, SVG or pre-rendered video |

**Why no scroll-jacking.** Measured: ~**5.6× more errors** (p<0.001) with no time
saving, and worse on mobile — where most of this audience is.

**Why no GSAP in Phases 1–2.** Nothing here needs synchronised timeline
choreography. CSS and SVG cover all of it at 0 KB. GSAP is reserved for the Phase 3
pinned camera passage, which is blocked on assets that do not exist.

### M1 · Contact sheet eruption `A`
Trigger: section enters viewport. 9 frames, staggered 40 ms, 300 ms each, three
depth planes. Scroll-linked drift ±2–4%. Reverses by scrolling back. Fallback:
static grid. Mobile: 3-up, no drift. Reduced motion: assembled immediately.
**Purpose:** turns a category grid into a campaign, and every frame is a product link.

### M2 · Western time tunnel `A`
Trigger: journey stage crosses centre. Outgoing stage scales to 0.94, drifts back,
desaturates; incoming enters laterally; type passes between planes. Fallback:
stacked stages. Mobile: vertical, no lateral. Reduced motion: all stages static and
legible. **Purpose:** makes vertical integration felt rather than asserted.

### M3 · Garment portal `A`
Trigger: product selected. Image expands, material fills viewport, becomes the PDP
background, information resolves out of texture. **Uses the blurred-oversize-backdrop
technique — this is what protects 360 px sources from soft full-bleed.** Fallback:
plain navigation. Reduced motion: PDP renders directly.
**Purpose:** communicates material and craftsmanship, not decoration.

### M4 · Layered typography `A`
Three planes: behind subject, beside, in front. Scroll-linked horizontal drift while
the product stays pinned. Fallback: static. Mobile: two planes.
**Purpose:** the editorial signature that separates this from a catalogue.

### M5 · Scroll-scrubbed film `M`
Native scroll position drives frame index — **never wheel capture**. ≤ 60 frames,
WebP/AVIF, ≤ 80 KB/frame. Fallback: poster. Mobile: 24 frames or poster only.
Reduced motion: poster only. Blocked on owner film.
**Purpose:** product education at the pace the customer chooses.

### M6 · Product anatomy `A`
Trigger: scroll within a pinned section. Garment → fabric → stitching → hardware →
fit → reassembled. **Semantic `<ul>` of the product's own attributes**; SVG leader
lines are `aria-hidden` decoration. **2.4.11: the pinned section must never obscure
a focused element.** Reduced motion: the list, static.
**Purpose:** the fit and construction confidence that reduces returns.

### M7 · Outfit transformation `M`
One model, one core garment, changing context. Blocked on owner photography.
**Purpose:** demonstrates versatility, raises units per order.

### M8 · Living cart `P`
Product scales down, follows a restrained curved path to the bag, bag responds,
totals and minimum-order progress update. 320 ms. **Not childish, not cartoon.**
Mobile: light haptic. Reduced motion: totals update, nothing travels.
**Purpose:** confirms the action without a page change.

### M9 · Horizontal collection story `A`
Vertical scroll drives horizontal travel inside a bounded track, `@supports`-gated.
**Prev/next are real anchor buttons and dots are anchor links — never swipe-only.**
Reduced motion: a clean snap carousel. **Purpose:** editorial pacing that stays operable.

---

## Where motion is forbidden

Cinema belongs to discovery. **Never to checkout.** No M1–M9 on: order builder,
order history, reorder, sign-in, buyer application, any denial state, any error
state. Operational screens are where clarity dominates — and a denial state is the
worst possible place to be cinematic.
