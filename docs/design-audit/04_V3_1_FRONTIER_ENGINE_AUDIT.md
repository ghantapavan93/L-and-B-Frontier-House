# 04 — V3.1 Frontier Engine Audit

**Source:** `stitch-export/v3-1-frontier-engine/` — five modules, 33 HTML files, 29 PNG,
14 Markdown. All counts `MEASURED` against the 33-file V3.1 corpus.

---

## 1. Module 01 — Frontier Engine Core

**Contents:** `v3.1_frame_3_cinematic_ignition`,
`v3.1_frame_5_impossible_frontier_engine_reveal`, `shader/`, `three.js/`,
`v3_1_design.md`, `v3_1_engineering_handoff.md`.

### 1.1 The narrative is the strongest idea in the corpus

`OBSERVED` — `v3_1_design.md` states the brand foundation as:

> *Textile → Design → Manufacturing → Warehouse → Distribution → Boutique → Customer*

`INFERRED` — This is **verbatim the brand's verified vertical integration** — *"we own,
operate, and manage all areas of the supply chain. This includes textile, design,
manufacturing, distribution, and sales."* V3.1 takes a `VERIFIED FACT` and makes it the
spine of the navigation. **This is the correct relationship between research and design,
and it is the single best decision in the design corpus.**

### 1.2 "Impossible Warehouse" — meaning depends on documentation

`OBSERVED` — Defined as *"A spatial machine that transforms industrial operational
elements into high-fashion editorial frames."*

`INFERRED` — **The warehouse meaning is carried by the specification, not by the visuals.**
Nothing in the frame names, the rendered screens, or the markup labels the space as a
warehouse or connects it to distribution. A viewer who has not read `v3_1_design.md` sees
an abstract dark environment. The supply-chain story — the most defensible brand asset
available — is currently legible only to the team.

`RECOMMENDATION` — The warehouse must **say what it is** in semantic text. This costs
nothing, it is the SEO surface, it is the screen-reader experience, and it converts the
project's best idea from an internal rationale into a customer-visible brand claim.

### 1.3 A third palette appears

`MEASURED` — `v3_1_design.md` declares a palette that **conflicts with V3's**:

| Role | V3 `design.md` | V3.1 `v3_1_design.md` | Status |
| :--- | :--- | :--- | :--- |
| Black | Ink Black `#0A0A0A` | **Obsidian Black `#050505`** | **CONFLICT** |
| Leather | Tobacco Leather `#734F36` | **Weathered Leather `#5E4033`** | **CONFLICT** |
| Bone | Bone White `#F5F2EE` | Warm Bone `#F5F2EE` | Agrees |
| Indigo | Dark Denim Indigo `#1B2B45` | Deep Indigo `#1B2B45` | Agrees |
| — | — | **Carbon `#121212`** (new) | Addition |

Per `CLAUDE.md` §2, **V3 wins**. Registered as conflict **C-06**.

> `OBSERVED` — V3.1 also introduces accents **"Electric Cobalt, Hot Magenta, Molten
> Amber"** for portal and transition lighting — **with no hex values given.**
>
> `INFERRED` — Two problems. They are unspecified, so they cannot be reconciled or
> contrast-checked. And **Hot Magenta and Electric Cobalt have no western equity
> whatsoever** — they are the palette of a technology brand. The research corpus is
> explicit that colour should be *"carried by the garment, not the interface."* This is
> the one place V3.1's art direction pulls against the Creative North Star. Owner decision
> **D-07**.

### 1.4 The tier model has no Tier 0

`OBSERVED` — `v3_1_engineering_handoff.md` defines *Technical Layer Ownership*: Tier 1
CSS/GSAP, Tier 2 Shader, Tier 3 Three.js, Tier 4 Video.

`INFERRED` — **This is a layer stack, not a capability ladder.** It describes what renders
each element, not what happens when WebGL is unavailable. `CLAUDE.md` §9 requires
*"Tier 0 must not require a GPU."* Every tier in this model assumes a working GPU or a
video decoder. **There is no defined no-WebGL path in the engineering handoff.** Module 04
supplies fallback *screens*, but the handoff does not bind them to a capability tier.

---

## 2. Module 02 — Belt Buckle Aperture

**Contents:** main board + 5 state frames (`8b`–`8f`), spec, updated handoff, `three.js/`.

### 2.1 Does the buckle read as a coin? — three answers, and they disagree

This is the question the brief raises explicitly. `OBSERVED` — the corpus answers it three
different ways:

| Representation | Geometry | Reads as |
| :--- | :--- | :--- |
| **The rendered design board** | Rounded **rectangles** across all six states (Dormant → Camera Passage) | **A buckle or portal. Correct.** |
| **`v3_1_belt_buckle_aperture_spec.md`** | *"High-poly chamfered rectangle (seg: 64×64)"*, `MeshPhysicalMaterial`, roughness 0.2, metalness 0.9, displacement map | **A buckle. Correct.** |
| **`three.js/code.html` — the actual code** | Three concentric `TorusGeometry` rings + a `CylinderGeometry` centre, flat `MeshPhongMaterial` | **A coin, a target, or a dartboard.** |

> ### FINAL RESOLUTION (batch 3) — the coin problem is **conditional**
> Batch 1 said the board solved it; batch 2 reversed that on `8e`. **Batch 3 shows the
> answer depends on whether a frame is photographic or geometric.**
>
> | Photographic → **reads as a buckle** | Geometric → **reads as a coin/lens** |
> | :--- | :--- |
> | `8b` Dormant — scalloped, **chamfered**, rectangular inset | `8d` — circle with six radial spokes |
> | `8c` Reveal — photorealistic buckle on denim | `8e` — flat grey circle |
> | Mobile prototype hub | `8f` — circular photo mask |
> | `8g_6`, `12f_3` belt photography | `8g_1` — concentric rings + crosshair (**rifle scope / lens iris**) |
> | | Three.js code — concentric tori |
>
> **The chamfered geometry *does* appear outside the documentation board — in `8b`.**
> **Implementation rule: model the object from `8b` and `8c`. Never from `8e`, `8f`,
> `8g_1` or the code.**
>
> ### Material credibility — fully delivered, in photography
> `OBSERVED` — `8c` visibly contains **every** specified material: darkened/brushed silver,
> **copper**, tooled leather, denim, **turquoise** (two stones), engraving, brass studs and
> stitching, plus a silver longhorn skull. The *"materials are 0% implemented"* finding in
> [08](08_3D_SHADER_AND_RUNTIME_FEASIBILITY.md) holds **for the Three.js code only.**
>
> ### The L&B identity is physically integrated
> `OBSERVED` — `8d` places the **glowing L&B monogram at the centre of the aperture**.
> Answers the brief's question affirmatively.
>
> ### Two fabricated origin dates
> `OBSERVED` — `8b` captions *"Origin: 1870s American West"*; the mobile hub engraves
> **"EST. 1865"**. Two mutually inconsistent fabrications. **C-25 / D-15.**

> ### CORRECTION (visual pass, 2026-08-01) — prior finding reversed
> This section previously concluded *"the design has solved the coin problem; the code has
> not."* **Visual inspection of the state frames reverses that.**
>
> `OBSERVED` — **`v3.1_frame_8e_concentric_ring_separation` renders the artifact as a
> single flat grey circle** on black, captioned *"08: SEPARATION / THE FRONTIER ENGINE
> INITIATES."* No chamfer. No rings. No separation. No material. No engraving.
>
> **Revised finding: the chamfered rectangle exists only as six small thumbnails on the
> documentation board and in prose. The actual state frame renders a circle, and so does
> the code.** Two of three representations build a coin.
>
> **The buckle has not yet been designed as an object — it has been described.** Anyone
> starting from either the code or the state frames will rebuild the coin.
>
> A further reinforcement: the board's *"Brushed Silver"* material study is a photograph of
> a **camera iris**, which is circular by definition. The "aperture" metaphor pulls toward
> a circle every time it is taken literally.
>
> **Verdict: the buckle does not currently risk reading as a coin in the approved visual
> direction, but it will if the Three.js file is used as a starting point.** Registered as
> conflict **C-08**.

### 2.2 The Three.js file is broken

> `OBSERVED` — **`02-belt-buckle-aperture/three.js/code.html` cannot run.**
>
> It contains a **nested IIFE with mismatched container IDs**. The outer scope resolves
> `threejs-container-ANIMATION_44` — which exists. The inner scope, which contains the
> entire scene, resolves **`threejs-container-BUCKLE_APERTURE`** — which **does not exist
> in the document**. `container` is therefore `null`, and `container.clientWidth` throws a
> `TypeError` on the first line of the scene.
>
> **Status: BROKEN.** Not degraded — non-executing. Per the brief, no source file was
> altered to make it appear functional.

### 2.3 Material credibility is specified but not implemented

`OBSERVED` — the spec names **Brushed Silver, Oxidized Copper, Dark Indigo Selvedge Denim,
Tooled Leather, Prismatic Glass in Gunmetal, Mineral Turquoise, Bone Enamel.**

`MEASURED` — the code implements **four flat colours** on `MeshPhongMaterial`:
`0xa7a6a2` silver, `0x5E4033` leather, `0x1B2B45` denim, `0x0a0a0a` centre.

**Absent from the implementation:** copper · turquoise · bone enamel · prismatic glass ·
stitching · engraving · every texture, normal, roughness and environment map.

`INFERRED` — `MeshPhongMaterial` is a legacy non-PBR model. **Brushed metal, tooled leather
and selvedge denim cannot be expressed in it at all** — they require PBR plus normal and
roughness maps, which is precisely V1's lost *"material texture over flat colour"*
principle. The material credibility the brief asks about is **0% implemented**.

### 2.4 The narrative geometry is excellent and must survive

`OBSERVED` — the spec maps each engraving to a link in the supply chain: *Textile* →
loom hatch marks; *Design* → pattern-drafting vectors; *Manufacturing* → stitch paths;
*Warehouse* → radial aisle routing; *Distribution* → kinetic flow arrows;
*Boutique/Customer* → high-polish contact points.

`INFERRED` — This is the best-argued detail in the entire corpus. It is derived from
verified brand truth, it is original, and it is unimitable by a competitor because no
competitor owns the chain. **Whatever happens to the geometry, this survives.**

### 2.5 The sequence exceeds the WCAG 2.2.2 threshold

`MEASURED` — S2–S8 durations sum to **7,100 ms**: 1200 + 800 + 1500 + 1000 + 600 + 1200 +
800.

`INFERRED` — Auto-starting, longer than five seconds, presented in parallel with other
content. **WCAG 2.2.2 (Level A) requires a visible pause, stop or hide control.** The spec
provides *"Skip Intro"* — which is a **hide** mechanism and plausibly satisfies 2.2.2,
provided it is visible from the first frame and keyboard-reachable. This is close to
correct already; it must be verified, not assumed.

---

## 3. Module 03 — Inner Frontier Camera Passage

**Contents:** 5 frames (`8g_1`, `8g_2`, `8g_4`, `8g_6`, `8g_8`), spec, `three.js/`.

`OBSERVED` — The frame numbering is **non-contiguous: 1, 2, 4, 6, 8.** Frames 3, 5 and 7
were never exported.

> `INFERRED` — **The passage is represented as five discrete key frames, not as a
> continuous journey.** The gaps are the transitions, and they are exactly the parts that
> must be invented at build time. The rendered screens are keyframes of a camera move that
> does not exist in any file.

**Transitions requiring full reconstruction — none of which exist in any source:**

| # | From → To | Nature |
| :--- | :--- | :--- |
| T1 | Category selection → aperture lock | UI state → 3D state binding |
| T2 | Aperture lock → camera entering rings | **Z-axis camera flight** |
| T3 | Rings → engraved routing geometry | Material/scale morph |
| T4 | Routing geometry → warehouse architecture | **Scale metaphor shift** — the hardest |
| T5 | Warehouse aisle → fashion runway | **Semantic reframe** — industrial to editorial |
| T6 | Runway → Living Contact Sheet | 3D → DOM handoff |

`INFERRED` — T4 and T5 carry the entire narrative thesis (industry becomes fashion) and are
the two with no visual documentation of their midpoints. **Implementable, but as original
animation direction — not as reconstruction.**

### 3.1 The passage specifies wheel interception

> `OBSERVED` — `v3_1_route_and_state_map.md`: *"**Desktop:** `Wheel/Scroll` maps to Camera
> Z-axis."*
>
> `INFERRED` — Mapping the wheel to a camera axis **is scroll interception**. `CLAUDE.md`
> §9: *"Never intercept the wheel. Read native scroll to drive animation."* Research
> measures scroll-jacking at roughly **5.6× more errors (p<0.001)** with no time saving,
> and worse on mobile.
>
> **This is the single most consequential interaction conflict in V3.1.** It is also
> resolvable without losing the effect: drive the same camera value from **native scroll
> position** rather than from wheel deltas. The choreography survives; the hijack does not.
> Registered as conflict **C-09**.

---

## 4. Module 04 — Native Mobile

**14 frames** — the most complete module, and the only place the project designs failure.

`OBSERVED` — Coverage: poster-first loading → thread ignition → seal material reveal →
compressed ring opening → vertical depth stack → **four depth carousels** → contact-sheet
landing → commerce arrival → **mode selector** → **reduced-motion journey** → **fallback
states**.

`INFERRED` — **This is genuinely native thinking, not a reduced desktop translation.** Four
pieces of evidence: poster-first loading is designed as a *state*, not a placeholder; the
ring opening is *"compressed"* for a vertical viewport; depth is expressed as a **vertical
stack and horizontal carousels** rather than a scaled camera flight; and mode selection,
reduced motion and fallbacks each get their own frame. Very few projects design the
failure path at all.

### 4.1 Where the mobile module falls short

| Issue | Evidence |
| :--- | :--- |
| **Carousels imply drag** | `MEASURED` — *"Horizontal Swipe on Depth Carousel."* WCAG **2.5.7** requires a single-pointer non-drag alternative. No prev/next control is specified |
| **No safe-area handling** | `MEASURED` — `env(` / `safe-area` appear in **0 of 48** files |
| **Prices are consumer-scale** | `MEASURED` — `12e`, `12h`, `12j` contain `$150.00`–`$1,250`. See §6 |
| **Plus as a peer world** | Conflicts with `CLAUDE.md` §11. See [15](15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md) **C-05** |
| **Reduced-motion frame carries prices but no pause control** | `MEASURED` — `prefers-reduced-motion` appears in only 2 of 48 files total |

---

## 5. Module 05 — Connected Handoff

**Contents:** desktop + mobile prototype hubs, route/state map, connected prototype map,
export manifest.

### 5.0 Visual verdict on the hubs (batch 2)

`OBSERVED` — **Both V3.1 hubs are genuine navigation surfaces**, unlike V3's prototype.

**Desktop hub** — an orbit ring carrying four labelled nodes (**WOMEN · PLUS · GIRLS ·
WHOLESALE**) around an oval-masked preview of *Accessories & Home*, with **START JOURNEY**
and **SKIP TO SHOP**. **Wholesale sits on the ring at equal weight** — better prominence
than the category orbit (8f) gives it.

**Mobile hub** — a full-bleed photograph of a real engraved western buckle, **SKIP INTRO**,
a large segmented mode control, **ENTER SHOP**, and a five-item tab bar. **Better hierarchy
and contrast than the desktop hub.**

> `INFERRED` — **The V3.1 hubs demonstrate connected navigation; V3's prototype does not.**
> V3's `v3_connected_flagship_prototype` is the Ignition screen with a four-item nav bar
> added (*Ignition · Homepage · Custom Atelier · Wholesale*) — a board, not a prototype.
> **The claim "connected prototype" is true of V3.1 and false of V3.**

> `OBSERVED` — **The buckle reads unmistakably as a buckle on the mobile hub** — engraved
> silver, rope edge, animal motif, mounted on topstitched denim. Combined with the tooled-leather
> buckle photographs in `8g_6` and `12f_3`, this establishes that **the buckle concept works
> as photography and fails only as geometry.** See §2.1.

**Defect:** the desktop hub clips text behind its centre card (*"…Detail V3.1"*,
*"…LECTED REALM"*). **Fabrication:** the mobile hub's buckle is engraved **"EST. 1865"** —
see **C-21 / D-15**.

### 5.1 The route map does not resolve

> `MEASURED` — `v3_1_route_and_state_map.md` §3 lists every route as an **unsubstituted
> template placeholder**:
> `{{DATA:SCREEN:SCREEN_38}}`, `{{DATA:SCREEN:SCREEN_34}}`, `{{DATA:SCREEN:SCREEN_23}}`,
> `{{DATA:SCREEN:SCREEN_14}}`, `{{DATA:SCREEN:SCREEN_9}}`, `{{DATA:SCREEN:SCREEN_5}}`.
>
> `INFERRED` — These are Stitch template variables that were never resolved at export.
> **The route map cannot be followed** — no `SCREEN_n` identifier maps to any filename on
> disk. `v3_1_export_manifest.md` §4 has the same problem, listing prototype paths as
> `SCREEN_38 -> SCREEN_37 -> SCREEN_34 -> …`.
>
> **Status: BROKEN as a navigation artefact; useful as a statement of intended sequence.**
> Registered as conflict **C-10**.

### 5.2 The export manifest names six assets; none exist

`MEASURED` — 3 GLB + 3 GLSL required. Filesystem search returns **0 `.glb`, 0 `.gltf`,
0 `.glsl`** anywhere in `stitch-export/`. See
[01_SOURCE_INVENTORY_AND_INTEGRITY.md](01_SOURCE_INVENTORY_AND_INTEGRITY.md) §2.1.

### 5.3 The QA report is honest and should be preserved

`OBSERVED` — `v3_1_route_and_state_map.md` §2 self-reports: **[High]** mobile WebGL
initialisation risk on older devices, with a stated mitigation (delay init);
**[Medium]** *"Bone White typography on Electric Cobalt transition light requires AA
check"*; **[Medium]** S04→S05 easing *"pop"*; **[Low]** menu clipping on 13" laptops.

`INFERRED` — A design export that flags its own contrast risk and its own performance risk
is unusually disciplined. **Every one of these four is confirmed by this audit as a real
risk**, and the contrast item is now doubly flagged because the accent colour has no hex
value to check against.

---

## 6. The pricing finding — V3.1 and V3 both

> ### `MEASURED` — Prices in the markup run **$45 to $1,250**
>
> Extracted from 11 files across both generations: `$1,250`, `$850` ×3, `$495`, `$480`,
> `$450` ×2, `$450.00`, `$345`, `$340.00`, `$320` ×2, `$285.00`, `$280`, `$220.00`,
> `$195`, `$185.00`, `$180` ×2, `$180.00`, `$150.00`, `$145.00`, `$95.00`, `$45`.

`VERIFIED FACT` (research corpus) — Lucky & Blessed wholesale is **$7–$33 per item**, with
implied retail of roughly **$20–$85**.

`INFERRED` — **The designs price the brand 10–40× above its actual product.** `$1,250`
against a top implied retail of `$85` is not a rounding difference; it is a different
company. This is precisely the failure the Creative North Star names —
*"a luxury imitation disconnected from the actual merchandise"* — and it is now
quantified rather than asserted.

The consequence is not cosmetic. Layout, whitespace, type scale, image density and product
count per screen are all calibrated to a $1,250 object. A $38 dress in that composition
reads as either mispriced or dishonest. **Owner decision D-05.**

---

## 7. Verdict on V3.1

**Is the Frontier Engine visually coherent?** `INFERRED` — **Yes, as narrative; not yet as
object.** The Thread → Warehouse → Buckle → Passage → Contact Sheet arc is coherent,
original, and grounded in verified brand truth. The buckle itself is specified three ways
that disagree, the warehouse's meaning lives only in documentation, and the accent palette
pulls away from the brand.

**What V3.1 improved:** the mobile system, the fallback and reduced-motion thinking, the
supply-chain narrative, and an honest self-QA — all absent from V3.

**What V3.1 leaves conceptual:** every 3D asset, every shader, every transition in the
camera passage, all material credibility, and the entire route map.
