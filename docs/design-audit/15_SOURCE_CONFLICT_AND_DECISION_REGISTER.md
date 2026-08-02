# 15 — Source Conflict and Decision Register

Every conflict found between sources, with the hierarchy applied.
**Resolved** = the hierarchy settles it. **Open** = needs an owner (see
[18](18_OWNER_DECISIONS_REQUIRED.md)).

---

## C-01 — V3.1 ships the V2 design system · **RESOLVED**

`MEASURED` — All five V3.1 modules contain `modern_frontier_v2/DESIGN.md`, byte-identical
(`b85c8d30…`) to the archived V2 system. V3's own system (`ab11ac29…`) exists only in
`v3-production`.

**Resolution:** Stitch export residue. **V3 wins** per `CLAUDE.md` §2. Disregard all five
copies. No token may be sourced from them.

---

## C-02 — V3 contradicts itself on the UI typeface · **RESOLVED**

`MEASURED` — `design.md` prose says **Inter**; `modern_frontier_v3/DESIGN.md` says
**Hanken Grotesk**; **Inter is loaded in 0 of 48 files**; four text families ship (Playfair
Display, Hanken Grotesk, Chivo, JetBrains Mono) against a two-family rule.

**Resolution:** The machine-readable `DESIGN.md` wins — **Hanken Grotesk**. Chivo is V2
residue; JetBrains Mono is acceptable for technical labels only. *The display face remains
an open decision — see D-06.*

---

## C-03 — V3 contradicts itself on the type scale · **RESOLVED**

`MEASURED` — `design.md` claims 140 px / 96 px / 16 px. `DESIGN.md` tops out at **84 px**;
actual steps are 12 / 14 / 16 / 18 / 32 / 48 / 84.

**Resolution:** `DESIGN.md` wins. The prose figures are aspirational.

---

## C-04 — `FOR HIM` is menswear, which does not exist · **OPEN — D-03**

`MEASURED` — `FOR HIM` appears in V3 Frame 5's markup as one of the four gateway worlds.
`CLAUDE.md` §11: *"Menswear does not exist. Never design as though it ships."*

`INFERRED` — Inherited verbatim from V1's storyboard
(`FOR HER | FOR HIM | BUILT BY YOU | WHOLESALE`) and never re-examined across three
generations. **A quarter of the primary gateway advertises a category the business does
not make.**

**Cannot be resolved by hierarchy** — Level 1 (verified truth) says no menswear; Level 3
(V3) shows menswear. Level 1 wins on fact, but *what replaces the fourth world* is a design
decision the owner must make.

---

## C-05 — Three incompatible taxonomies · **OPEN — D-04**

| Source | Segments |
| :--- | :--- |
| V3 Frame 5 | For Her · **For Him** · Built By You · Wholesale |
| V3.1 mobile carousels | Women · **Plus** · Accessories & Home · Wholesale |
| `v3_1_design.md` audience | Women · Plus · Accessories/Home · **Girls** · Wholesale (**five**) |

`MEASURED` — Only **Wholesale** is common to all three.

`INFERRED` — Two distinct problems bundled together: *(a)* V3 and V3.1 disagree on what the
worlds are; *(b)* V3.1's version makes **Plus** a peer world, which contradicts
`CLAUDE.md` §11's *"One garment, one product record, one full size range. Plus is a filter
and a fit story, never a separate catalog."*

**Note:** V3.1's structure mirrors the **live site's existing** separate plus catalogue —
so it is not an invention, it is an inherited pattern. Research identifies fixing it as the
largest unclaimed strategic position in western denim.

---

## C-06 — V3 and V3.1 palettes disagree · **RESOLVED**

| Role | V3 | V3.1 |
| :--- | :--- | :--- |
| Black | Ink Black `#0A0A0A` | Obsidian `#050505` |
| Leather | Tobacco `#734F36` | Weathered `#5E4033` |

**Resolution:** **V3 wins.** V3.1's Carbon `#121212` may be adopted as an additional
surface step (non-conflicting). *V3.1's unspecified accents remain open — D-07.*

---

## C-07 — Competitor validation without a reject test · **OPEN — process**

`OBSERVED` — V3's `engineering_export_package.md` §3 "Reference Validation Audit" validates
five frames against named competitor sites (*Drop Edition*, *Aigle RainPack*, *Hotel
Jägerhof*, *Oflyn/Nike*, *Talia*) and records **only what was borrowed**.

`OBSERVED` — V1's research matrix handled the same references correctly, with explicit
**Reject** and *"Reinterpretation for L&B"* columns.

`INFERRED` — A loss of discipline between generations. `CLAUDE.md` §13 prohibits copying a
competitor's layout, motion sequence or proprietary interaction.

**Resolution:** No frame is presumed infringing. Before implementing any of those five,
re-run V1's three-column test — *what principle, what must not be copied, what is the
original L&B expression.* Cheap check, real exposure.

---

## C-08 — The buckle is specified three ways · **RESOLVED on direction, OPEN on execution**

| Representation | Geometry | Material | Reads as |
| :--- | :--- | :--- | :--- |
| Design board | Rounded **rectangles** | Photographic studies | Buckle / portal ✔ |
| Written spec | *"Chamfered rectangle 64×64"*, `MeshPhysicalMaterial` | 7 named materials + displacement | Buckle ✔ |
| **Three.js code** | 3× `TorusGeometry` + cylinder | 4 flat `MeshPhongMaterial` colours | **Coin / dartboard ✘** |

**Resolution:** The board and the spec agree and are authoritative — **chamfered
rectangle, PBR materials**. The Three.js file is a non-conforming sketch and must not be
used as a starting point.

`INFERRED` — **The design has solved the coin problem; the code has not.** Anyone starting
from the code will rebuild the coin.

---

## C-09 — Wheel interception versus the no-scroll-jacking rule · **RESOLVED**

`OBSERVED` — `v3_1_route_and_state_map.md`: *"Desktop: `Wheel/Scroll` maps to Camera
Z-axis."*
`CLAUDE.md` §9: *"Never intercept the wheel."*

**Resolution:** **`CLAUDE.md` wins** (Level 2 over Level 3.1). Drive the same camera value
from **native scroll position**, not wheel deltas. The choreography survives; the hijack
does not.

---

## C-10 — The route map does not resolve · **RESOLVED as broken**

`MEASURED` — `v3_1_route_and_state_map.md` §3 and `v3_1_export_manifest.md` §4 reference
screens as unsubstituted template variables (`{{DATA:SCREEN:SCREEN_38}}`, `SCREEN_34`, …).
No identifier maps to any file on disk.

**Resolution:** Export defect. Useful as a statement of intended sequence; unusable as a
navigation artefact.

---

## C-11 — Fictional prices · **OPEN — D-05**

`MEASURED` — Markup contains **$45 – $1,250**. `VERIFIED FACT` — wholesale $7–$33, implied
retail $20–$85.

`INFERRED` — The designs price the brand **10–40× above its actual product**. This is not
only a fixture problem: layout, whitespace, type scale and image density are calibrated to
a $1,250 object, and a $38 dress in that composition reads as mispriced.

**Cannot be resolved by hierarchy** — Level 1 sets the real prices, but *how the visual
system adapts to a $20–$85 product* is a design decision.

---

## C-12 — Every manifest asset is missing · **RESOLVED as a production fact**

`MEASURED` — 0 of 3 V3 assets and 0 of 6 V3.1 assets exist. 0 GLB, 0 GLSL, 0 video, 0
textures, 0 local fonts anywhere.

**Resolution:** Not a conflict — a production fact. The manifests describe what a build
needs, not what was delivered. Every asset must be originated. See
[07](07_ASSET_MEDIA_AND_PROVENANCE_MANIFEST.md).

---

## C-13 — The brand voice is absent · **OPEN — D-06**

`OBSERVED` — Design copy reads *"Craft Your Legacy"*, *"Every stitch is a deliberate act of
creation"*, *"Crafted for the Modern Horizon."*
`VERIFIED FACT` — The brand's own voice is *"Howdy"*, *"Hey y'all"*, *"a dash of sass"*,
*"We are partners in your success."*

`INFERRED` — The designs adopt a silent luxury register the brand does not use. The
Creative North Star is explicit that *"the warmth in the words stays"* and that premium
must come from photography, type and motion craft rather than from deleting personality.

---

## C-14 — "L&B Frontier House" used as a public brand · **OPEN — D-10**

`OBSERVED` — Rendered footers read *"© 2024 L&B Frontier House. Crafted for the Modern
Horizon."*
`CLAUDE.md` §1: it is a **working internal name**, not approved for customer-facing copy
(OQ-17).

`OBSERVED` — The copyright year is also **2024** — stale.

---

---

# Conflicts added by the visual pass (2026-08-01)

## C-15 — A fifth taxonomy · **OPEN — D-14**

`OBSERVED` — V3 Frame 2's render carries a left-rail world list: **The High Plains · Dust &
Denim · Silver & Silk · The Bespoke Atelier**. It matches none of the four previously
recorded systems. **Five now exist.**

`OBSERVED` — V3.1 Frame 8f's category orbit renders **WOMEN · PLUS · GIRLS · ACCESSORIES
AND HOME**, plus **NEW ARRIVALS** and a bordered **WHOLESALE** pill — which **matches
`v3_1_design.md`'s stated audience exactly**.

> `INFERRED` — **On category truth, V3.1 is more accurate than V3.** 8f maps cleanly onto
> verified L&B taxonomy (Women, Plus, Girls, Accessories, Wholesale) and contains **no
> menswear**. Frame 5's `FOR HER / FOR HIM` is the less correct artefact. This does not
> overturn the source hierarchy — Level 1 verified truth resolves it in V3.1's favour.

## C-16 — Frame render does not match folder name · **RESOLVED as an export defect**

`OBSERVED` — `v3_frame_2_living_contact_sheet_eruption/screen.png` renders a **Frontier
Passport** screen, not a contact-sheet eruption. **V3 folder names are not reliable labels.**
44 frames remain uninspected, so further mismatches are possible.

## C-17 — The homepage hero product is a men's boot at $850 · **OPEN — D-03, D-05**

`OBSERVED` — Frame 6 leads with *"The Heritage Boot — $850 USD"* beneath a hero photograph
of a lone man. Footwear is unverified inventory; menswear does not exist; $850 is ~25× the
top verified wholesale price.

## C-18 — Invented sourcing claims contradict vertical integration · **OPEN — D-12**

`OBSERVED` — Frame 8: *"Sourced from the **Kuroki Mill**, dyed deeply with natural indigo."*
Frame 11: *"Tannery Dispatches: **Leon & Tuscany**."*

`VERIFIED FACT` — L&B *"owns, operates, and manages all areas of the supply chain… textile,
design, manufacturing, distribution, and sales."*

> `INFERRED` — These attribute the brand's materials to named third-party mills and
> tanneries, **directly contradicting the single strongest verified brand asset.** They also
> undercut the Texas identity. Must be removed, not softened.

## C-19 — The Frontier Engine is rendered as a literal engine · **OPEN — D-07**

`OBSERVED` — `v3.1_frame_12k` illustrates *"Frontier Engine — Static Preview"* with a
photograph of an **automotive/industrial engine block**.

> `INFERRED` — The Frontier Engine was specified as the *supply-chain machine*. The
> fallback renders it as a car part. **This is the strongest evidence that the
> warehouse/engine metaphor lives only in documentation** — the design misread its own
> central idea.

## C-20 — Invented people in the approvals queue · **OPEN — D-13**

`OBSERVED` — Frame 11 lists *Arthur Pendelton*, *E. Vance Holdings* and *J.R. Cash*.
`CLAUDE.md` §12 forbids invented people. **J.R. Cash is Johnny Cash's birth name.**

---

# Conflicts added by visual batch 2 (2026-08-01)

## C-21 — "EST. 1865" — an invented heritage date, rendered into artwork · **OPEN — D-15**

`OBSERVED` — `v3.1_connected_mobile_prototype_hub` is a full-bleed photograph of a belt
buckle engraved **"FRONTIER SEAL"** and **"EST. 1865"**.

`VERIFIED FACT` — Lucky & Blessed dates to approximately **2015** (FashionGo member since
2015-09-23).

> `INFERRED` — A fabricated **160-year heritage claim**, and unlike a copy error it is
> **baked into the image**, so it cannot be corrected by editing text. `CLAUDE.md` §12
> forbids fabricated brand claims. **The asset must be reshot or replaced.**

## C-22 — Four carousels, four design systems · **RESOLVED as a consistency defect**

`OBSERVED` — The four "depth carousel" frames differ in ground (dark full-bleed / dark card
/ light / light-no-hero), header treatment, carousel affordance (dots / none / none /
prev-next buttons), mode-pill presence, active tab and CTA styling.

> `INFERRED` — **They do not read as siblings in one carousel.** A carousel implies
> consistent siblings; these read as four unrelated screens. The "depth carousel" premise is
> undermined by its own inconsistency. Not an owner decision — a design-system defect.

## C-23 — Plus is routed to a bespoke lane · **OPEN — D-04 (refined)**

`OBSERVED` — `12f_2` tags Plus **"BESPOKE SIZING"**, renders it as an inset card rather than
full-bleed, gives it **no carousel dots**, and files it under the **Custom** tab while Women
sits under **Discover**.

> `INFERRED` — Batch 1 found Plus *typographically equal* in the desktop orbit. The mobile
> carousel contradicts that structurally. **Routing plus sizing to a bespoke/made-to-order
> lane is a subtler and more damaging separation than a separate catalogue** — it implies
> plus is special-order rather than stock.
>
> The *representation* is excellent — the photography and the line *"Every world, every
> silhouette"* are the best inclusive work in the corpus. **The placement undoes it.**

## C-24 — Tagline and season inconsistencies · **RESOLVED as content debt**

`OBSERVED` — *"Crafted for the Modern Horizon"* (V3 footers) vs **"Crafted for the Modern
West"** (12a, 12j). Season tags read **"FALL '24"** and **"AW24"**; copyright reads
**© 2024** throughout. All stale against 2026.

---

# Conflicts added by visual batch 3 (2026-08-01)

## C-25 — A *second*, different fabricated founding date · **OPEN — D-15 (escalated)**
`OBSERVED` — `8b`'s caption strip reads *"Origin: **1870s American West**"*. The mobile hub's
buckle is engraved **"EST. 1865"**. `VERIFIED FACT` — L&B dates to ~2015.
> `INFERRED` — Not one fabrication but **two mutually inconsistent ones**, in different
> media (caption text vs engraved artwork). D-15 widens from a single asset to a pattern.
> `8b` also lists **"Neon Thread"** as a material — not western.

## C-26 — Six different "Enter …" CTA verbs · **RESOLVED as a consistency defect**
`OBSERVED` — *Enter Shop* · *Enter Collection* · *Enter Showroom* · *Enter Gallery* ·
*Enter Distribution* · *Enter the Archive*. The primary action is renamed on almost every
surface. Not an owner decision — a design-system defect.

## C-27 — "MEN" appears in V3.1's navigation · **OPEN — D-03 (escalated)**
`OBSERVED` — `8g_1`'s category nav reads **WOMEN · MEN · ACCESSORIES AND HOME · PLUS ·
WHOLESALE**.
> ### This overturns a batch-1 conclusion
> Batch 1 recorded that **V3.1's taxonomy contained no menswear** and that V3.1 was
> therefore *more brand-accurate* than V3 on category truth. **`8g_1` disproves it.**
> Menswear is now confirmed in **both** generations, and this is a **sixth** taxonomy
> variant — it swaps **GIRLS → MEN** relative to `8f`.
>
> **Revised: no generation is reliably free of menswear, and V3.1 is internally
> inconsistent with itself.** D-04 and D-03 both harden.

## C-28 — An AR feature appears in no specification · **OPEN — new scope**
`OBSERVED` — `8g_8` includes a **"View in Space"** card: *"Experience the materiality in
your own environment before acquiring."*
> `INFERRED` — AR appears in **no manifest, no handoff, no design document**, and has no
> supporting research. **Unjustified scope**, and it would carry significant device,
> asset-pipeline and accessibility cost. Classify **NOT CURRENTLY JUSTIFIED** pending owner
> input.

## C-29 — Tab-bar order is unstable · **RESOLVED as a defect**
`OBSERVED` — `12k` and the mobile hub show **Home · Discover · Custom · Passport · Bag**;
`12g` shows **Discover · Home · Custom · Passport · Bag**. Persistent navigation must not
reorder between routes.

## C-30 — Two frames carry their own labels burned into the artwork · **RESOLVED as export defect**
`OBSERVED` — `8g_2` embeds a window title bar reading *"8G-2: Camera Entering Separated
Material Rings"*; `8g_4` renders *"V3.1 Frame 8G-4: Engraved Routing Geometry becoming
Warehouse Architecture"* as large type across the image. **These are design-board mockups,
not screens**, and cannot be used as visual reference without removing content that is part
of the pixels.

---

# Conflicts added by visual batch 4 (2026-08-01)

## C-31 — "Midnight Rodeo" contains no rodeo · **RESOLVED as conceptual**
`OBSERVED` — V3 Frame 7 shows **a man walking a wet neon city street**, with a belt and a
felt hat as insets. No arena, no horse, no rodeo. **~75% of the frame is empty black.**
> `INFERRED` — Campaign name and imagery disagree; the scroll story was never designed.
> **Classify as conceptual mood only.** No verified campaign exists.

## C-32 — "Image Becomes Film" contains no film · **RESOLVED as a naming defect**
`OBSERVED` — V3 Frame 3 is a **static craft editorial** (*"THE PROCESS"*, a leather artisan,
a four-step *Chapter Progression*). `MEASURED` — no `<video>`, `poster`, `<track>` or media
control exists in any V3 file.
> **Reproducible with CSS and static images.** No video, canvas or WebGL required.
> **Also a business conflict:** *"SOURCE"* implies external sourcing and the artisan is a
> **one-man leather-goods maker**, contradicting verified vertically-integrated apparel
> manufacturing.

## C-33 — Frontier Passport is a consumer account with invented loyalty · **OPEN — D-01**
`OBSERVED` — V3 Frame 10 shows **"FRONTIER TRUST ◆ 4,250"** points and **"AVAILABLE CREDIT
$150.00"**, a personal **MONOGRAM: J.D.**, and *"your acquisitions… your fit preferences."*
`CLAUDE.md` §11 classifies loyalty **NOT JUSTIFIED**.
> `INFERRED` — **But the underlying mechanics transfer to a buyer almost unchanged:** order
> tracking, **fit feedback per garment**, an **alterations record**, and **REORDER SAME
> SPEC / REORDER WITH ALTERATIONS**. Reorder is the highest-frequency buyer action and it
> is already designed. **Preserve the mechanics; replace the audience and delete the
> loyalty layer.**

## C-34 — The mobile transformation is not a sequence · **RESOLVED as a defect**
`OBSERVED` — `12b` black + neon line → `12c` navy + metal disc → `12d` bone + product photo
→ `12e` light editorial page. **Three different grounds in three consecutive frames**, and
`12d` shows **no rings, no compression and no opening** despite its name.
> Transitions: **12b→12c DISCONNECTED · 12c→12d CONTRADICTORY · 12d→12e PLAUSIBLE WITH
> MISSING INTERPOLATION.**

## C-35 — Mode-selector composition is unstable · **RESOLVED as a defect**
`OBSERVED` — `12b` shows **only two peers** (Cinema, Balanced) with Instant demoted to a
text link. V1 Direction B names the third mode **"Grid"**, not *Instant*. `8d` shows a
different two-item nav entirely (**THE CINEMA | OPERATIONAL**).

## C-36 — `12e` proves the warehouse narrative needs no 3D · **RESOLVED — positive**
`OBSERVED` — `12e` renders **Textile → product → Distribution** as a flat scroll page with
photographs, chapter captions (*"Chapter 08: Operational"*, *"Phase II / Distribution"*),
the line **"from loom to ledger"**, and **"Add to Cart"** embedded in the narrative.
> `INFERRED` — **This single 2D frame achieves what the entire 3D Frontier Engine sequence
> does not.** It materially strengthens the case against real-time 3D for the warehouse.

---

## Summary

| Status | Count | IDs |
| :--- | :--- | :--- |
| **Resolved by hierarchy or as defect** | 24 | C-01, C-02, C-03, C-06, C-08 *(rev.)*, C-09, C-10, C-12, C-15 *(on fact)*, C-16, C-22, C-24, C-26, C-29, C-30, C-31, C-32, C-34, C-35, C-36 |
| **Open — owner decision** | 16 | C-04, C-05, C-07, C-11, C-13, C-14, C-17, C-18, C-19, C-20, C-21, C-23, C-25, C-27, C-28, C-33 |

`INFERRED` — The hierarchy did most of the work. The six that remain are all cases where
**verified business truth and approved visual direction genuinely disagree** — exactly the
category the constitution reserves for the owner.
