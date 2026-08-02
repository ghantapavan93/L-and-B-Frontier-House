# 03 — V3 Platform Audit

**Source:** `stitch-export/v3-production/stitch_l_b_frontier_house_platform_synthesis/`
**Scope:** 12 frames + connected prototype + design system + shader + Three.js + 2 spec docs
**Corpus:** 15 HTML files. All counts `MEASURED` against that set.

---

## 1. The Four Worlds — resolved

> ### `MEASURED` — The Four Worlds are **FOR HER · FOR HIM · BUILT BY YOU · WHOLESALE**
>
> Extracted directly from `v3_frame_5_one_west_four_worlds/code.html`. All four labels are
> present in the markup. The rendered screen shows a four-panel gateway with **BUILT BY
> YOU** expanded and a `close` control top-right.

This settles the question the constitution deferred. Three consequences, and two are
serious:

**1. They are audience gateways, not product categories.** `INFERRED` — "Built by You" is
a service and "Wholesale" is a channel. This is a **segmentation overlay**, not a taxonomy.
It should be classified as an **overlay/modal state**, not a route tree — the `close`
control confirms the design already treats it as dismissible.

**2. `FOR HIM` is menswear, and menswear does not exist.**

> `CLAUDE.md` §11: *"Menswear does not exist. Never design as though it ships."*
>
> `MEASURED` — `FOR HIM` appears in exactly one production file: Frame 5's markup. It is
> not merchandised anywhere else in V3 or V3.1.
>
> `INFERRED` — This is inherited directly from V1's storyboard, which specified the
> gateway as `FOR HER | FOR HIM | BUILT BY YOU | WHOLESALE` and described the hero as
> *"a man in a denim jacket."* The premise was never re-examined across three generations.
> **A quarter of the primary gateway advertises a category the business does not make.**
> Registered as conflict **C-04**; owner decision **D-03**.

**3. It contradicts V3.1 and the V3.1 spec.** Three different taxonomies now exist:

| Source | Segments |
| :--- | :--- |
| **V3 Frame 5** | For Her · For Him · Built By You · Wholesale |
| **V3.1 mobile carousels** | Women · Plus · Accessories & Home · Wholesale |
| **`v3_1_design.md` stated audience** | Women · Plus · Accessories/Home · **Girls** · Wholesale (five) |

`INFERRED` — Only **Wholesale** is common to all three. Registered as conflict **C-05**.

---

## 2. Per-frame audit

Classification uses the brief's scale. "Route/state" is the audit's recommended
classification, not an approved decision.

### Frame 1 — Cinematic Ignition
**Route/state:** Entry route + first-visit-only overlay · **STATIC VISUAL REFERENCE with working shader**
`OBSERVED` — Contains **real GLSL simplex-noise code** (`permute`, `dot(x12.xy,x12.xy)`) —
the only genuine shader implementation in V3. Nav carries `Cinema | Balanced | Instant`.
Headline `NOT THE WEST…` — inherited from V1's *"NOT THE WEST YOU REMEMBER."*
**Risks:** LCP-critical surface carrying a shader; no `<video>`, no `poster` — the
"cinematic" hero has no film asset and no still fallback. `prefers-reduced-motion` absent.
**Business:** Brand entry. No commerce. Needs a one-action exit to shop per `CLAUDE.md` §11.

### Frame 2 — Living Contact Sheet Eruption
**Route/state:** Route · **STATIC VISUAL REFERENCE**
`OBSERVED` — CSS comments confirm intent: *"Texture overlay to hint at denim while staying
in light mode"*, *"3D Eruption Layout specifics."* Grid-based, DOM-rendered.
**Assessment:** `INFERRED` — The strongest-evidenced concept in the project. The live
brand runs a **genuine daily drop cadence** (`/jul-27/`…`/aug-01/`), which is exactly what a
dated, ever-refreshing contact sheet expresses. Highest confidence to build.
**Risks:** The 800 ms "Eruption" exceeds the 400 ms interactive budget. Products must
remain in the DOM.

### Frame 3 — Image Becomes Film
**Route/state:** Transition between 2 and 4 · **CONCEPTUAL SPECIFICATION**
`MEASURED` — **No `<video>` element exists in any V3 file.** The transition that defines
this frame has no media to transition into.
**Blocked on OQ-13** (does any film exist?).

### Frame 4 — Shoppable Film
**Route/state:** Route · **CONCEPTUAL SPECIFICATION**
`MEASURED` — No `<video>`, no `<track kind="metadata">`, no `poster`. Hotspots are
described in `engineering_export_package.md` as *"Silver Ring (Pulse) / Tappable Dot /
Static Label"* but not implemented.
**Accessibility:** `CLAUDE.md` §8 requires DOM `<button>` hotspots on a metadata cue
timeline plus a parallel non-time-gated product list. **None of that exists yet** — which
is an opportunity, since nothing has to be undone.

### Frame 5 — One West, Four Worlds
**Route/state:** **Overlay/modal** (has `close`) · **STATIC VISUAL REFERENCE**
Covered in §1. `OBSERVED` — Copy is consumer-facing: *"Step into the digital atelier…
Every stitch is a deliberate act of creation."* Panel is a light surface over dark
generated imagery; side panels are dimmed and low-contrast.

### Frame 6 — Definitive Flagship Homepage
**Route/state:** Primary route · **STATIC VISUAL REFERENCE**
`OBSERVED` — *"The Modern Horizon"*, *"Cinematic Western Craftsmanship for the untamed…"*.
Mode selector present. CSS comments: *"Hide scrollbar for clean aesthetic"* —
`INFERRED` a minor accessibility smell; hiding scrollbars removes a position affordance.
**Business:** Must carry navigation, merchandising and SEO weight. Highest performance
contention.

### Frame 7 — Midnight Rodeo Campaign Journey
**Route/state:** Route with pinned scroll sequence · **PARTIALLY FUNCTIONAL**
`OBSERVED` — Contains real JS referencing `scene-1`, `scene-2`, `scene-3`; copy
`MIDNIGHT / RODEO / SCROLL TO EXPLORE`.
**Assessment:** `INFERRED` — Campaign framing is well-evidenced; the brand's own Faire copy
names *"rodeo season, NFR."* Genuinely ownable.
**Risks:** Scroll-pinned narrative is the highest INP-risk surface in V3, and pinning
implicates WCAG 2.4.11.

### Frame 8 — Garment Portal and Product Anatomy
**Route/state:** Route + overlay · **STATIC VISUAL REFERENCE**
`OBSERVED` — Title is `Midnight Pearl Snap` — a specific product.
`MEASURED` — Its named 3D asset `midnight_pearl_snap_3D.glb` **does not exist**.
**Assessment:** The one V3 surface with a plausible WebGL case, and it is blocked on assets
that were never produced. `SPEC-ONLY`.

### Frame 9 — Built By You Custom Atelier
**Route/state:** Route · **STATIC VISUAL REFERENCE**
`MEASURED` — **No `<form>` and no `<input>`** in this frame. A configurator with no form
controls.
**Business:** `INFERRED` — No evidence the business offers bespoke production (OQ-12).
Classify **OWNER DECISION REQUIRED**.

### Frame 10 — Living Cart and Frontier Passport
**Route/state:** Route + persistent overlay · **STATIC VISUAL REFERENCE**
`OBSERVED` — *"Frontier Passport / Digital Wardrobe Profile."*
**Business:** `INFERRED` — A **consumer** account concept. No consumer business exists
(OQ-01). See [14](14_BRAND_COMMERCE_AND_OPERATIONAL_GAPS.md) for the recommended
reinterpretation as a **buyer** passport, which serves a real paying audience today.

### Frame 11 — Wholesale Showroom and Owner Operating World
**Route/state:** Authenticated route · **STATIC VISUAL REFERENCE**
`OBSERVED` — CSS comment: *"Custom scrollbar for horizontal racks to mimic a physical
rail."* Contains `Frontier Passport` and `The High Plains`.
**The most commercially important surface in V3 — and, on visual inspection, the most
complete.**

> ### CORRECTION (visual pass, 2026-08-01) — prior finding withdrawn
> This section previously read *"This frame depicts a wholesale showroom without
> wholesale,"* based on `MEASURED` string absence of `MSRP` and `prepack`. **Visual
> inspection contradicts that.** The mechanics are present under different labels:
>
> | Mechanic | As rendered |
> | :--- | :--- |
> | Wholesale price | **"WHLSL Price"** — $145.00, $95.00 |
> | Minimum order | **"MOQ"** — 24 Units, 36 Units |
> | Prepack | **"Pack Breakdown (12): 2 S \| 4 M \| 4 L \| 2 XL"** and **"(6): 1×30 \| 2×32 \| 2×34 \| 1×36"** |
> | SKU | AW24-CC-01, AW24-DN-05, AW24-SW-12 |
> | Buyer action | **"Add to Order"** |
> | Linesheet | **"Export Line Sheet"** button |
> | Authorised view | **"Wholesale View"** toggle |
> | Inventory states | *In Stock* · **Waitlist** (disabled) · *Open Sizing* |
>
> One pack breakdown is **(6)** — matching L&B's verified prepack of six exactly.
>
> **Revised finding: the wholesale design is structurally excellent and factually wrong.**

`OBSERVED` — Factual defects requiring replacement: prices $95–$145 are **3–5× verified
wholesale**; MOQ of 24/36 units contradicts the verified **$50** minimum; the rack is
men's/unisex workwear rather than women's western; *"Tannery Dispatches: Leon & Tuscany"*
contradicts verified vertical integration and Texas identity; and the Bespoke Approvals
queue names **invented people** — *Arthur Pendelton*, *E. Vance Holdings*, *J.R. Cash* —
in breach of `CLAUDE.md` §12.

`OBSERVED` — The frame also carries an owner-operations layer: a *Sourcing Diary*, a
*Campaign Launch Status* tracker at 80% post-production with pending voice notes, and a
three-item approvals queue. This is a genuine Owner Operating World, not a mock-up.

**Still absent:** sales-tax-ID gating, buyer registration, login, and any unauthenticated
or pending-approval state. **The showroom is designed; the gate is not.**

### Frame 12 — Native Mobile Cinematic Commerce
**Route/state:** Mobile route set · **STATIC VISUAL REFERENCE**
Superseded in depth by V3.1 Module 04 (14 frames vs 1). See
[10_MOBILE_RESPONSIVE_AND_FALLBACK_AUDIT.md](10_MOBILE_RESPONSIVE_AND_FALLBACK_AUDIT.md).

### Connected Flagship Prototype
**PARTIALLY FUNCTIONAL**
`OBSERVED` — Contains CSS for *"Experience Modes"*, *"Screen transitions"*, and screen
labels `Ignition · Homepage · Custom Atelier · Wholesale` plus `Cinema | Balanced |
Instant`.
`INFERRED` — A **four-screen** demonstration. `engineering_export_package.md` documents
only four transitions (1→2, 2→4, 4→5, 5→9). **Frames 3, 6, 7, 8, 10, 11 and 12 are absent
from the prototype map.** The prototype demonstrates the concept; it does not connect the
platform.

---

## 3. Design system, shader and Three.js

### 3.1 `design.md` contradicts `modern_frontier_v3/DESIGN.md`

`MEASURED` — Two internal V3 conflicts, independent of anything V3.1 does:

| Claim in `design.md` (prose) | Reality in `DESIGN.md` (machine-readable) |
| :--- | :--- |
| UI Sans: **Inter** | **Hanken Grotesk**. `MEASURED` — Inter is loaded in **0 of 48** files |
| Type scale: 140 px, 96 px, 16 px | Scale tops out at **84 px**; steps are 12/14/16/18/32/48/84 |

Registered as conflicts **C-02** and **C-03**.

`OBSERVED` — `design.md` labels both faces *"Substitute"* — Playfair Display for
*"high-contrast editorial"*, Inter for *"precision modern grotesk."* `INFERRED` — **The
brand has no committed typeface.** Playfair Display is among the most-used Google fonts
and carries no western equity. This is a live open decision, not a settled token.

### 3.2 Three.js — `three.js/code.html`
**FUNCTIONAL but skeletal.**
`OBSERVED` — Renders a **pearl snap** from primitives: `CylinderGeometry` base +
half-`SphereGeometry` dome, `MeshPhongMaterial`, one ambient + one spot light, infinite
`requestAnimationFrame` with `group.rotation.y += 0.005`.
`MEASURED` — three.js **r125** (Jan 2021) from a Google CDN. No textures, no maps, no GLB,
no visibility gating, no `dispose()`, no context-loss handling, no reduced-motion check.
`INFERRED` — It runs. It is a **primitive demo**, not a production scene, and its material
model (Phong, flat colour) cannot express the material honesty the brand strategy requires.

### 3.3 Shader — `shader/code.html`
`OBSERVED` — 5,085 bytes; simplex-noise GLSL consistent with the noise in Frame 1.
**PARTIALLY FUNCTIONAL** — real shader code, no scene integration, no uniforms bound to
scroll or state.

---

## 4. The competitor-validation finding

`OBSERVED` — `engineering_export_package.md` §3 is titled **"Reference Validation Audit"**
and validates V3 frames against named competitor sites: *Drop Edition* (Frame 6),
*Aigle RainPack* (Frame 10), *Hotel Jägerhof* (Frames 2→3), *Oflyn/Nike* (Frame 9),
*Talia* (Frame 11).

`INFERRED` — V1's matrix handled these references correctly, with explicit **Reject**
columns and a *"Reinterpretation for L&B"* column. **V3's export records only what was
borrowed.** That is a meaningful loss of discipline, and `CLAUDE.md` §13 prohibits copying
a competitor's layout, motion sequence or proprietary interaction.

`RECOMMENDATION` — Before any of these five frames is implemented, re-run V1's
three-column test on it: *what principle, what must not be copied, what is the original
L&B expression.* No frame is presumed infringing; the check is cheap and the exposure is
real. Registered as conflict **C-07**.

---

## 5. What V3 does exceptionally well

`INFERRED` —

1. **Platform completeness.** Twelve surfaces including wholesale and owner operations.
   Most cinematic concepts never model the boring, revenue-bearing parts. V3 does.
2. **The experience-mode selector**, present in the nav of multiple frames. It is the
   project's most durable idea, traceable to V1, and it directly implements
   `CLAUDE.md` §7.
3. **Editorial composition.** The Frame 5 render shows genuine restraint — one light
   surface, generous margins, a single display face, colour carried by photography rather
   than interface.
4. **Wholesale treated as a designed surface**, not a spreadsheet — matching the brand's
   own *"We are partners in your success."*

## 6. What V3 omits

> **Revised after the visual pass.** The row previously reading *"Every wholesale
> mechanic… absent"* was wrong and has been corrected — see Frame 11 above. What remains
> absent is the **authorisation layer**, not the commerce layer.

| Omission | Severity |
| :--- | :--- |
| **The wholesale gate** — tax-ID capture, registration, login, pending-approval and unauthenticated states | **Critical.** The showroom exists; nothing controls who sees it |
| **All video** — 0 `<video>`, 0 `poster`, 0 `<track>` across 48 files | **Critical.** Three frames depend on film |
| **All forms** — 0 `<form>`, 1 `<input>` | **Critical.** No registration, login, size selection or configuration |
| **Focus states** — `:focus` in **0 of 48** files, though specified as *"2px solid Oxidized Silver rings"* | **Critical.** WCAG 2.4.7 |
| **`prefers-reduced-motion`** — **2 of 48** files, though specified as a global listener | **High** |
| Size, fit and inclusive-sizing content | **High** — the brand's stated identity |
| Pre-order state, filters, sort, search results | **High** |
| Loading, empty, error, pending-approval states | **High** |

`INFERRED` — The pattern is consistent: **V3 is a complete visual specification and an
empty functional one.** That is the appropriate output of a design tool, and it is exactly
why this audit exists — but it means "V3 is approved" describes the look, not the build.
