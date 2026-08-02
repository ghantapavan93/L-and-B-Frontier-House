# 13 — Frontier Engine Redesign

**The narrative survives. The implementation does not.**

> **FROM THREAD TO TRADE · FROM WAREHOUSE TO FRONTIER WORLD**

---

## 1. Why the narrative is worth keeping

`OBSERVED` — V3.1 encodes the brand's **verified vertical integration** — *Textile → Design →
Manufacturing → Warehouse → Distribution → Boutique → Customer* — into the geometry of a
navigational object, and into the buckle's engraving.

`INFERRED` — This is **the strongest single idea in the entire design corpus**. It takes a
`VERIFIED FACT` and makes it the spine of the experience. It is original, it is unimitable —
no competitor owns the chain — and it is the correct relationship between research and
design. **Whatever happens to the geometry, this survives.**

---

## 2. What the audit found

| Finding | Evidence |
| :--- | :--- |
| **Thread ignition works** — but reads electronic | V3.1 `frame_3` and `12b`: a single glowing line traces the L&B monogram, exactly as specified. **But it is neon blue** — uniform width, no needle, no tension, no fabric |
| **The warehouse is captioned, not shown** | `frame_5` — named *"Impossible Frontier Engine Reveal"* — is ~95% empty black with *"FROM THREAD TO TRADE"* set in type. `8g_2` shows a **derelict** warehouse; `8g_4` a **sci-fi megastructure** with logistics language |
| **The camera passage is four unrelated artefacts** | `8g_1` a category selector · `8g_2` a screenshot-of-a-window · `8g_4` an environment board · `8g_8` a finished commerce page. Camera, scale, lighting, palette and **medium** change between every pair. Two carry their own frame titles **burned into the artwork**. Three of eight steps were never exported |
| **A literal automotive engine** | `12k` illustrates *"Frontier Engine"* with a **photograph of a car engine block** |
| **Flat 2D tells it better** | **`12e`** renders *raw denim rolls → product → distribution aisle* with chapter captions, the line **"from loom to ledger"**, and **"Add to Cart" embedded in the narrative** |

> ### `12e` is the model
> A single flat scroll page does what the entire 3D sequence does not. **It is the strongest
> argument in the corpus against real-time 3D — and it comes from the design itself.**

---

## 3. The revised strategy

**Build the Frontier Engine as an editorial scroll narrative, not a 3D environment.**

| Layer | Technology |
| :--- | :--- |
| Structure and content | **Semantic HTML** — headings, sections, real product links |
| Layout | **CSS Grid**, layered 2.5D via `transform` and `opacity` |
| Routing lines, thread, engraving paths | **SVG** — scalable, animatable, tiny, semantic |
| Choreography | **GSAP + ScrollTrigger**, driven by **native scroll position** |
| Imagery | **High-quality photography** — the warehouse, the rolls, the aisle |
| Film | **Pre-rendered video only after a coherent storyboard exists** |
| Fallback | **Static and reduced-motion equivalents, always** |

**No real-time WebGL in Phase 1 or Phase 2.** WebGL remains an experimental future option
requiring a separate proof, its own performance budget, demonstrated accessibility
equivalence, and owner approval (**D-08**).

---

## 4. Chapter structure

Recovered from `12e` (*"Chapter 08: Operational"*, *"Phase II / Distribution"*) and V2 F4
(*"Frontier Garments — CHAPTER 02"*):

| Chapter | Content | Asset |
| :--- | :--- | :--- |
| **I — Thread** | The L&B mark drawn by a single stitch | **SVG path**, textile-coloured |
| **II — Textile** | Raw selvedge rolls, *"The Foundation Rolls"* | Photography |
| **III — Design & Manufacture** | Pattern, cut, stitch — the parts that are verifiably owned | Photography |
| **IV — Warehouse** | Racks, aisles, order picking — **a real apparel facility** | Photography |
| **V — Distribution** | *"Phase II / Distribution"* — the aisle, the dispatch | Photography |
| **VI — Boutique** | Named stockists, the store locator, Cavender's | Photography |

**Commerce is embedded in each chapter**, as `12e` already does — an *Add to Order* or a
product rail inside the story, not after it.

---

## 5. The thread — material, not neon

`OBSERVED` — The thread currently renders as **electric blue neon**.

**Correction:** a stitch should look like thread. Use **indigo, bone, gold topstitch or
oxidized silver** — colours already in the verified material palette and already visible in
the buckle photography. **Retire Electric Cobalt from the thread entirely** (D-07).

`INFERRED` — This is not a small point. The Thread-to-Trade narrative claims the brand makes
its own textiles. A thread that looks like a fibre-optic cable undercuts the exact claim it
exists to make.

---

## 6. The warehouse — say what it is

`INFERRED` — The warehouse's meaning currently lives **only in documentation**. A viewer who
has not read `v3_1_design.md` sees an abstract dark environment; `12k` misreads it as a car
engine.

**Requirement: the warehouse must state what it is in semantic text.** Headings, captions and
alt text naming textile, manufacturing, warehouse, distribution and boutique. This costs
nothing, it is the SEO surface, it is the screen-reader experience, and **it converts the
project's best idea from an internal rationale into a customer-visible brand claim.**

**Reject:** the literal automotive engine · the sci-fi megastructure · the derelict empty
warehouse. **The warehouse is a working apparel facility, and the brand owns one.**

---

## 7. Tier ladder — with a real floor

`OBSERVED` — V3.1's *Technical Layer Ownership* (Tier 1 CSS/GSAP · Tier 2 Shader · Tier 3
Three.js · Tier 4 Video) is a **layer stack, not a capability ladder**. Every tier assumes a
GPU or a video decoder. **There is no Tier 0.**

| Tier | Condition | Delivered |
| :--- | :--- | :--- |
| **0** | No WebGL · JS failed · Instant Shop | **Static images, full commerce, no canvas** |
| 1 | Low-memory mobile | Minimal motion, smallest assets, capped DPR |
| 2 | Mid-tier device | Reduced media, fewer frames |
| 3 | Capable desktop | Full quality |

**Tier 0 must render fully without a GPU.** A fallback that needs WebGL is not a fallback.

---

## 8. What must be produced before any animation is planned

1. **A coherent storyboard** — see `15_CAMERA_PASSAGE` specification in this document's
   companion section below.
2. **Warehouse photography** of a real apparel facility.
3. **Material macro photography** — denim slub, buck-stitch, pearl snap, suede nap, silver.
4. **The buckle asset** — per `14` and the buckle direction in `00`.

**No animation work begins before the storyboard is coherent.**

---

## 9. Camera passage — storyboard specification

**The exported passage is rejected as a connected sequence.** It cannot be pre-rendered
because there is nothing coherent to render. A new storyboard must be authored first.

For **every** stage, the storyboard must define: starting composition · ending composition ·
**continuity anchor** · camera direction · scale · lighting · palette · material · product
context · **semantic HTML relationship** · reduced-motion substitute · static fallback ·
**commerce escape** · required asset · production risk.

| # | Stage | Continuity anchor (the thing that must persist) |
| :--- | :--- | :--- |
| 1 | Selection lock | The chosen category label |
| 2 | Buckle material scale shift | The engraved surface |
| 3 | Engraving becomes routing line | **The line itself** — SVG path continuity |
| 4 | Routing line becomes warehouse structure | Line → rail geometry |
| 5 | Product and textile operations appear | Rails → racks → garments |
| 6 | Warehouse becomes runway | The aisle's vanishing point |
| 7 | Runway becomes contact-sheet grid | Frame edges → grid cells |
| 8 | Contact sheet becomes product discovery | **The products themselves** |

`INFERRED` — Stages **4 and 6** carry the entire thesis (industry becomes fashion) and are
the two with no documented midpoints. They are original art direction, not reconstruction.

**Recommended delivery, once coherent:**

| Mode | Form |
| :--- | :--- |
| **Cinema** | Pre-rendered video with poster, captions and a visible pause control |
| **Balanced** | **Shortened layered 2.5D** — CSS/GSAP/SVG, 3–4 stages, ≤ 400 ms each |
| **Instant Shop / reduced motion** | **Static editorial transition** — a single composed still into the contact sheet |

**Every mode reaches the same destination — product discovery — and none may block it.**
