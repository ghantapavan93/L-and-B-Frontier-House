# 02 — V1 → V2 → V3 → V3.1 Design Evolution

**Purpose: traceability, not revival.** V1 and V2 remain historical evidence only. Nothing
here authorises restoring a V1 or V2 treatment.

---

## 1. V1 — Exploration

`OBSERVED` — Six frames: three desktop directions and three mobile counterparts —
**Monochrome Editorial (A)**, **Warm Modern Luxury (B)**, **Experimental Future (C)** —
plus `l_b_research_matrix_strategy.md`.

### 1.1 The research matrix is the most methodologically sound artefact in the project

`OBSERVED` — V1 analysed seven references in a table with explicit **Borrow** and
**Reject** columns, then a **"Reinterpretation for L&B"** column. Examples verbatim:

| Reference | Borrow | Reject |
| :--- | :--- | :--- |
| Aigle RainPack | Product anatomy & depth | **"Over-reliance on 3D"** |
| Studio Karo | "Cinema/Balanced/Instant" modes | "Overly abstract navigation" |
| Hotel Jägerhof | Image-to-video continuity | "Visible page reloads" |
| Tecovas | Material & fit education | "Lack of experimental motion" |
| Talia | Separate catalog/buyer states | "Weak visual storytelling" |

`INFERRED` — This is exactly the discipline `CLAUDE.md` §13 requires: principles
extracted, specifics rejected, original expression named. **The Reject column is the part
that later generations lost** — V3's `engineering_export_package.md` reduces the same
references to a "Reference Validation Audit" that records only what was borrowed. See
conflict **C-07**.

`OBSERVED` — V1 §3 "Weaknesses to Avoid" already names *Cowboy Clichés*, *Shopify
Sameness*, and **"Motion Fatigue: avoid over-animation that slows down the actual purchase
intent."** The anti-cliché contract in the research corpus was independently arrived at,
and V1 got there first.

### 1.1a Visual confirmation (batch 4 — Directions A and B inspected)

`OBSERVED` — Both V1 desktop directions carry the nav **Women · Men · Custom · Wholesale**
and a mode selector. **Direction B names the third mode "Grid", not "Instant."**

**Direction A — Monochrome Editorial.** A black-and-white macro of a thumb fastening a
**pearl snap**; *"NOT THE WEST YOU REMEMBER."*; an editorial grid of denim weave, a
workshop bench, **an ornate circular concho**, a woman mid-stride in sharp black tailoring
— and **the Dallas skyline**. Footer: *"…timeless design **from the heart of Texas**."*

> `OBSERVED` — **The Dallas skyline is the only verified real geography in the entire
> corpus**, across all four generations. `INFERRED` — a genuine loss: it grounded the
> Texas claim in a real place rather than in an invented ranch.
> `OBSERVED` — *"from the heart of Texas"* asserts Texas identity **without** a
> manufacturing claim. Careful, correct, and worth re-adopting verbatim (OQ-04).
> `OBSERVED` — **The circular concho is where the coin geometry originates.**

**Direction B — Warm Modern Luxury.** A warm macro of hand-stitched tooled leather;
the same headline; *"**Precision tailoring meets rugged authenticity**…"*; a section titled
**"Tobacco & Indigo — the essential textures of the modern west"**; and two product cards:
**The Frontier Boot $495 / Tobacco Leather** and **Raw Selvedge Jacket $285 / Indigo Denim**.

> `INFERRED` — **Direction B is where the warm palette actually lives**, and V3 Frame 6's
> subhead *"Precision tailoring meets raw materiality"* is a direct descendant.
> **It is also where boots and the inflated price band originate** — $495 and $285 in V1
> against verified wholesale $7–$33.
> **Lost and worth recovering:** *material-led collection naming* (Tobacco & Indigo), the
> clean **product card with a material descriptor**, and **"Grid"** — arguably a clearer
> label than *Instant Shop*.

### 1.2 What V1 originated that still governs the project

| V1 origin | Survives in |
| :--- | :--- |
| Palette: Ink Black `#0A0A0A`, Bone White `#F5F2EE`, Tobacco Leather `#734F36`, Sandstone `#D9C5B2`, Indigo `#1B2B45` | V3's documented palette verbatim (V3 adds Oxidized Silver and Rust Red) |
| Experience modes Cinema / Balanced / Instant | V3 `ExperienceSelector`, V3.1 mode selector — **the single most durable idea in the project** |
| Image-to-film continuity | V3 Frame 3 |
| Product anatomy / depth reveal | V3 Frame 8 |
| Wholesale buyer-aware states | V3 Frame 11 |
| Living Contact Sheet (9 photos erupting) | V3 Frame 2, V3.1 arrival states |
| "Pearl Snap" toggle — western shirt hardware as signature UI | V3's Three.js scene renders a pearl snap; **V3.1 replaces it with the Belt Buckle** |

### 1.3 Two V1 ideas that were lost, and one that must stay lost

`OBSERVED` — **Lost, and worth reconsidering:** V1 §4 specifies
*"Materiality: CSS backdrops using subtle 'denim grain' or 'leather texture' noise rather
than flat hex colors."*

`INFERRED` — This principle is **absent from V3.1's implementation**, whose Three.js
materials are flat `MeshPhongMaterial` colours with no maps of any kind (§4 of
[08_3D_SHADER_AND_RUNTIME_FEASIBILITY.md](08_3D_SHADER_AND_RUNTIME_FEASIBILITY.md)).
V1 identified material texture as the mechanism for "premium through material honesty"
five generations before the research corpus reached the same conclusion independently.
**This is the clearest example of a valuable concept lost between generations**, and it
can be restored without touching V3's visual authority — it is a rendering technique, not
a layout.

`OBSERVED` — **Must stay lost:** V1 §5 storyboard specifies the gateway as
**`FOR HER | FOR HIM | BUILT BY YOU | WHOLESALE`**, and describes the hero at 7–12s as
*"a man in a denim jacket."*

> `INFERRED` — **This is where menswear entered the project.** `CLAUDE.md` §11 is
> explicit: *"Menswear does not exist. Never design as though it ships."* V1's Four Worlds
> assumed a men's category the brand does not have. Any later artefact inheriting this
> structure inherits a false premise. Tracked as conflict **C-04**.

---

## 2. V2 — Synthesis

`OBSERVED` — Eight frames covering the journey end to end: cinematic opening → contact
sheet → desktop homepage → campaign scroll story → PDP and customisation studio →
wholesale and owner intelligence → mobile homepage → mobile product and passport.

`INFERRED` — **V2's contribution is architectural, not visual.** It collapsed three
competing V1 directions into one journey and established the frame sequence V3 inherits
almost unchanged. Every V3 frame has a V2 antecedent except the Belt Buckle work, which is
V3.1-only.

`MEASURED` — **V2 set the type system that V3 still uses.** V1 used *Libre Caslon Text +
Inter*. V2 switched to **Playfair Display + Chivo + JetBrains Mono**. V3 kept Playfair
Display, swapped Chivo for **Hanken Grotesk**, and dropped nothing else — JetBrains Mono
still loads across the corpus.

`INFERRED` — **V2 chose Playfair Display and the project never revisited it.** V1's matrix
called for *"a modified Caslon or modern Roman"*; V2 substituted Playfair, and V3's own
`design.md` still flags it as a *"Substitute for high-contrast editorial."* Three
generations later the substitute is functioning as the brand face. See
[06_DESIGN_TOKEN_RECONCILIATION.md](06_DESIGN_TOKEN_RECONCILIATION.md) §3.

`OBSERVED` — V2 rejected V1's three-direction fork, its Libre Caslon display face, and its
separate desktop/mobile direction pairs, consolidating to one system with mobile as an
adaptation.

---

## 2a. V2 inspected in full (batch 5) — four regressions V3 introduced

`OBSERVED` — Seven of eight V2 frames were inspected at full fidelity. V2 is stronger than
V3 in four specific, evidenced ways. These are **recoveries**, not revivals: each is a
mechanic or a treatment, not a visual style.

**1. The escape hatch had CTA parity.** V2 Frame 1 places **"ENTER THE FRONTIER"** and
**"SKIP TO SHOP"** side by side as equal buttons, with the headline in high-contrast white
over a dark portrait. V3 Frame 1 demotes *Skip to Shop* to small grey text and renders
*"NOT THE WEST"* in near-invisible dark grey. **V3 lost both parity and legibility.**

**2. The wholesale catalogue showed MSRP.** V2 Frame 6 lists **`$185 WHSL / MSRP $395`**,
**`$210 / $450`**, **`$85 / $180`** — roughly 2.1× keystone. **V3 Frame 11 has no MSRP at
all.** Margin maths is the buyer's core decision, and V3 removed it.

**3. Owner intelligence was operational.** V2 Frame 6 surfaces a **sourcing delay with
quantified impact** (*"Impacts Fall '24 Collection • 3 Weeks"*) and a **photography gap with
a SKU count and an *Assign* action** (*"Missing detail shots for 4 SKUs"*). V3 Frame 11's
equivalent — a campaign percentage and pending voice notes — is decorative by comparison.

**4. The campaign was complete.** **V2 Frame 4 is "MIDNIGHT RODEO"** — a title, a craft
story with real construction specs, a named chapter, three linked products with prices, and
a campaign CTA. **V3 Frame 7 strips it to roughly 75% empty black** and **replaces V2's
woman protagonist ("Midwest Rider") with a man.**

### Two V2 mechanics worth recovering outright

`OBSERVED` — **V2 Frame 2 annotates every contact-sheet cell with its motion**: *ENTER:
LEFT · ASSEMBLE: DOWN · RECEDE: UP · ANCHOR: BASE ·* and, on the centre cell, **"EXPAND:
BECOME FILM" with a play button.** It is a genuine motion specification, it is a CSS Grid,
and **it has stronger continuity than V3.1's entire camera passage** because the transitions
are stated rather than implied. **"Image Becomes Film" is legibly designed here and lost in
V3 Frame 3.**

`OBSERVED` — **V2 Frame 5 puts customization inside the PDP**, in 2D, with an explicit
**lead time and human-review gate** (*"Custom embroidery requires an artisan review. Lead
times are currently 3-4 weeks."*), a separate **"Add to Atelier Bag"**, and **"View
Anatomy" as a video**. Simpler and more operationally honest than V3's separate three-step
Atelier route — and it confirms **Product Anatomy's origin is film, not 3D.**

### Where V2 began the fabrications

`OBSERVED` — **Invented sourcing originates in V2 Frame 3**: *"vintage shuttle looms"* and
*"Sourced ethically, milled for resilience"* — predating Kuroki Mill and Leon & Tuscany.
V2 Frame 4 adds *"Hand-tooled in the Frontier House workshop"*. **The invented customer
"J.D." originates in V2 Frame 5's monogram field** and reappears in V3 Frame 10.

## 3. What V3 preserved, transformed, and omitted

| | Detail |
| :--- | :--- |
| **Preserved** | The V2 journey sequence; Playfair Display; experience modes; the V1 colour names and hex values in documentation; the Living Contact Sheet; wholesale as a first-class frame |
| **Transformed** | Chivo → Hanken Grotesk; the V1 gateway `FOR HER / FOR HIM / BUILT BY YOU / WHOLESALE` became Frame 5 *"One West, Four Worlds"* — and dropped the explicit `FOR HIM` label from the visible design (`OBSERVED` in the Frame 5 render, §3 of [03_V3_PLATFORM_AUDIT.md](03_V3_PLATFORM_AUDIT.md)) |
| **Added** | Frames 7–12: Midnight Rodeo campaign, Garment Portal, Custom Atelier, Living Cart + Frontier Passport, Wholesale Showroom + Owner Operating World, Native Mobile |
| **Omitted** | V1's material-texture principle; V1's Reject discipline; any resolution of the menswear question |

---

## 4. What V3.1 added

`OBSERVED` — V3.1 is a genuine extension, not a redesign. It adds:

- The **Frontier Thread → Impossible Warehouse → Belt Buckle Aperture** narrative, which
  encodes the brand's **verified vertical-integration chain** (Textile → Design →
  Manufacturing → Warehouse → Distribution → Boutique → Customer) into the geometry of a
  navigational object. **This is the strongest single idea in the entire design corpus**
  and it is grounded in verified brand truth rather than invented.
- A 14-frame native mobile system including a mode selector, a reduced-motion journey and
  explicit fallback states — none of which V3 had.
- An honest QA report (`v3_1_route_and_state_map.md` §2) that self-flags performance,
  contrast and continuity risks.

`OBSERVED` — V3.1 also **replaces V1's Pearl Snap signature with the Belt Buckle**. The
pearl snap survives only in V3's Three.js file. `INFERRED` — The buckle is the better
choice: it can carry engraving, it separates into rings, and it justifies a portal
metaphor. The pearl snap could not.

---

## 5. The Material Design substrate — present from V1, never removed

`MEASURED` — All three design systems (`V1 8232a1c8…`, `V2 b85c8d30…`, `V3 ab11ac29…`) are
**Material Design 3 token sets**: `surface`, `surface-container-*`, `on-surface`,
`primary`, `secondary`, `tertiary`, `error`, `inverse-*`, `*-fixed-dim`.

`MEASURED` — Their base colours drift but never become the brand palette:
V1 `#fcf9f5` → V2 `#fcf9f8` → V3 `#fdf8f8`. **None is Bone White `#F5F2EE`.**

> `INFERRED` — **The warm western palette has never been the implemented palette in any
> generation.** It lives in the prose layer (`design.md`, the research matrix) while the
> machine-readable layer stays a Material 3 default theme. This is a Stitch platform
> characteristic inherited from V1, not a V3 regression — which makes it a tooling
> artefact to correct at implementation, not a design decision to respect.
> Quantified in [06_DESIGN_TOKEN_RECONCILIATION.md](06_DESIGN_TOKEN_RECONCILIATION.md).

---

## 6. Evolution verdict

`INFERRED` —

- **V1 contributed the strategy.** The reference matrix, the anti-cliché contract, the
  experience modes, the palette vocabulary, and the material-texture principle.
- **V2 contributed the architecture.** One journey, one type system, desktop and mobile
  reconciled.
- **V3 contributed the platform.** Twelve complete surfaces including commerce, wholesale
  and owner operations — the parts a business actually runs on.
- **V3.1 contributed the signature.** A navigational object that encodes the brand's real
  supply chain, plus the first genuine mobile and fallback thinking in the project.

**One concept should be recovered from V1** — material texture over flat colour.
**One concept must stay rejected** — `FOR HIM`, and the menswear premise underneath it.
Everything else in V1 and V2 is superseded and should remain archived.
