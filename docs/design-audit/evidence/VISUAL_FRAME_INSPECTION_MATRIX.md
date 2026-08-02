# Visual Frame Inspection Matrix

**Pass date:** 2026-08-01 · Read-only. No source image was altered, moved or downsampled.

---

## Inspection status field

Every frame carries one of:
**`FULL_FIDELITY_INSPECTED`** · **`CONTACT_SHEET_ONLY`** ·
**`INVENTORIED_NOT_VISUALLY_INSPECTED`** · **`UNREADABLE`** · **`MISSING`**

All 56 frames appear on a contact sheet, so `CONTACT_SHEET_ONLY` is the floor state for
anything not yet inspected at full fidelity.

## Inspection completeness

| Metric | Count |
| :--- | :--- |
| **Total unique image files** | **56** |
| Duplicates (by md5) | **0** — all 56 hashes unique |
| `UNREADABLE` | **0** |
| `MISSING` | **0** image files; **9 non-image manifest assets** — see `07` |
| **`FULL_FIDELITY_INSPECTED` — batch 1** | **12** (entries A1–A12) |
| **`FULL_FIDELITY_INSPECTED` — batch 2** | **10** (entries B1–B6 + four carousels B7–B10) |
| **`FULL_FIDELITY_INSPECTED` — batch 3** | **11** (entries C1–C11) |
| **`FULL_FIDELITY_INSPECTED` — batch 4** | **11** (entries D1–D11) |
| **`FULL_FIDELITY_INSPECTED` — batch 5** | **11** (entries E1–E11) |
| **`FULL_FIDELITY_INSPECTED` — closure** | **1** (entry F1) |
| **Cumulative inspected** | **56 of 56 — COMPLETE** |
| **`CONTACT_SHEET_ONLY` (remaining)** | **0** |
| **`INVENTORIED_NOT_VISUALLY_INSPECTED`** | **0** |
| Requiring owner review | **35** |

Reconciliation: 12 + 10 + 11 + 11 + 11 + 1 = **56**; 56 + 0 = **56**. ✔

> ### The ledger is closed. Every one of the 56 unique visual files has been opened and
> inspected at full fidelity. No frame is counted twice; no frame is marked inspected from
> a thumbnail, a filename or an adjacent frame.

**Verification method** — reproducible:

```bash
# 56 unique visual files on disk, excluding the _source-zips backup
find archive stitch-export -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \
  -o -iname "*.webp" -o -iname "*.svg" -o -iname "*.gif" \) \
  -not -path "*/_source-zips/*" | wc -l                      # -> 56

# 56 distinct md5 hashes (zero duplicates)
find archive stitch-export -type f -iname "*.png" -not -path "*/_source-zips/*" \
  -exec md5sum {} \; | awk '{print $1}' | sort -u | wc -l     # -> 56

# zero corrupted files (PNG magic bytes present in all)
# contact sheets reconcile: 6+8+13+2+6+5+14+2 = 56
grep -c '<figure>' docs/design-audit/evidence/contact-sheets/*.html
```

> **Count correction (batch 3 reconciliation).** Batch 2 was reported as 11 frames and
> 23 cumulative. **It was 10 frames and 22 cumulative.** The matrix's *entries* were always
> correct — B1–B6 plus the four carousels — but the summary figure above and the batch-2
> response both overstated by one. Corrected here and in
> [`20_VISUAL_EVIDENCE_COMPLETION_REPORT.md`](../20_VISUAL_EVIDENCE_COMPLETION_REPORT.md) §1a.
> Every `FULL_FIDELITY_INSPECTED` entry now carries a unique path; no frame is counted
> twice; no `CONTACT_SHEET_ONLY` frame is counted as inspected.

> **Honest status: this pass did not close the visual gap completely.** 12 of 56 frames
> were inspected at full fidelity. Those 12 were selected as the decision-critical set —
> they answer all 16 validation questions in `20_VISUAL_EVIDENCE_COMPLETION_REPORT.md` §4
> and they produced **four corrections to earlier conclusions**. The remaining 44 are
> inventoried below with path, generation, hash, dimensions and file size, and are marked
> `NOT YET INSPECTED`. **No conclusion in this corpus rests on an uninspected frame.**

Reconciliation: 12 inspected + 44 pending = **56**, matching the filesystem inventory in
`file-inventory.txt` and the 56 frames across the eight contact sheets.

---

## Part A — Frames inspected in full

### A1 · `v3_frame_1_cinematic_ignition` — V3 · desktop · ROUTE + first-visit overlay
`9f5cf9ba` · 1600×1280 · 31,635 B (smallest V3 file — the frame is almost entirely black)

**Directly visible:** Near-black field. Wordmark *L&B Frontier House* in high-contrast
display serif, top-left. Nav **Cinema | Balanced | Instant** with Cinema underlined; cart
and account icons right. Headline **"YOU REMEMBER."** in white serif. Beneath it
**"NOT THE WEST"** in very dark grey, barely legible. Bottom-left: **"→ ENTER THE
FRONTIER"** with rule. Bottom-right: **"SKIP TO SHOP"**, small, grey.

**Purpose / audience:** Brand entry; first-time visitor. **Composition:** vast negative
space, two type anchors on a left axis, controls pinned to corners. **Typography:**
genuinely premium — high-contrast serif display against monospaced-feeling nav.
**Dominant colour:** Ink Black. **Accents:** bone white type only.

> **CORRECTION — `SKIP TO SHOP` is visible and present.** The prior audit stated Frame 1
> "needs a one-action exit to shop." **It has one.** `CLAUDE.md` §11 is satisfied at the
> ignition surface.

**Contrast:** "NOT THE WEST" grey-on-black — **VISUAL RISK**, appears well below 4.5:1.
"SKIP TO SHOP" small and grey — **VISUAL RISK**. Exact ratios undeterminable (rendered
values, not tokens).
**Motion implied:** the two headline lines suggest a sequential reveal; no pause control
visible. **Commerce:** exit only. **Verdict:** **RESOLVED, PREMIUM.**
**Disposition:** **PRESERVE CLOSELY** — raise the secondary type contrast.

---

### A2 · `v3_frame_2_living_contact_sheet_eruption` — V3 · desktop · ROUTE
`18943025` · 1579×1600 · 469,636 B

**Directly visible:** **The frame does not render a contact-sheet eruption.** It renders a
**Frontier Passport** screen. Left rail: *Frontier Passport / Digital Wardrobe Profile*,
then **THE HIGH PLAINS · DUST & DENIM · SILVER & SILK · THE BESPOKE ATELIER** with icons;
**"View My Collection"** black CTA; SUPPORT / ATELIERS. Right: overlapping photo cards
(woman in white pearl-snap shirt; embroidered denim; a **man and woman** in desert;
workshop table) over the word **FRONTIER** set very large in display serif. Card labels
**ASSEMBLE** and **ENTER**. Footer: *THE CINEMA · BESPOKE SERVICES · TERMS OF CRAFT ·
PRIVACY · © 2024*.

> **NEW FINDING — a fifth taxonomy.** *The High Plains · Dust & Denim · Silver & Silk ·
> The Bespoke Atelier* are **editorial world names**, and they match neither V3 Frame 5's
> gateway nor V3.1's category orbit. Registered as **C-15**.

> **NEW FINDING — filename/render mismatch.** The folder claims *Living Contact Sheet
> Eruption*; the render is a Passport surface with a decorative contact-sheet cluster.
> Treat V3 folder names as unreliable labels. Registered as **C-16**.

**Typography:** premium and confident. **Colour:** warm bone ground, black type.
**Commerce visible:** none — no price, no product name, no add action.
**Accessibility:** *FRONTIER* wordmark runs **behind** photo cards, partially occluded —
if it is a heading, reading order will be confusing. **VISUAL RISK.**
**Verdict:** **PREMIUM but commercially empty.**
**Disposition:** **PRESERVE INTENT, REBUILD EXECUTION.**

---

### A3 · `v3_frame_4_shoppable_film` — V3 · desktop · ROUTE
`011b63e2` · 1532×1600 · 1,567,285 B

**Directly visible:** Full-bleed image of **a man and a woman** at a modernist desert
house — man in denim jacket, white shirt, dark jeans; woman in **tan suede fringe jacket**,
jeans, boots. **Two small circular hotspot dots at the very top edge**, partially clipped.
Bottom-left: **"SHOP THIS FRAME"** (cart icon) and **"SAVE THE LOOK"** (bookmark) — solid,
high-contrast buttons. Bottom-right: *"View The Story"* italic link. Above them a
**chapter scrubber reading `04` … six dots … `12`**.

**Commerce:** strong — two real CTAs, clearly legible.
**Accessibility:**
- **No pause / stop / hide control anywhere.** A 12-chapter film with a scrubber and no
  pause is a **WCAG 2.2.2 (Level A)** risk — **VISUAL RISK, high confidence.**
- Hotspot dots are **very small and clipped at the frame edge** — **WCAG 2.5.8 VISUAL
  RISK.**
- **No parallel product list** beneath the film. Products exist only as hotspots.
**Business:** the male model is co-equal in the hero. **Menswear again.**
**Verdict:** **RESOLVED visually, non-compliant structurally.**
**Disposition:** **REVISE FOR ACCESSIBILITY** + **REVISE FOR BUSINESS ACCURACY.**

---

### A4 · `v3_frame_5_one_west_four_worlds` — V3 · desktop · **OVERLAY**
`f89f86dc` · 1600×1280 · 1,301,980 B *(inspected in prior pass; carried forward)*

Four vertical panels with **BUILT BY YOU** expanded; `close` control top-right confirms
overlay. Markup labels: **FOR HER · FOR HIM · BUILT BY YOU · WHOLESALE**. Copy *"Craft
Your Legacy… Every stitch is a deliberate act of creation."* Consumer register.
**Disposition:** **OWNER DECISION REQUIRED** (D-03, D-04).

---

### A5 · `v3_frame_6_definitive_flagship_homepage` — V3 · desktop · ROUTE
`9032828f` · 939×1600 · 860,987 B

**Directly visible:** Hero photograph — desert at dusk, modernist glass house, **a lone
man walking**. Headline **"THE MODERN HORIZON"**. Subhead *"Cinematic Western
Craftsmanship for the untamed spirit. Precision tailoring meets raw materiality."*
CTA **"EXPLORE THE COLLECTION →"**. Below: **"PRODUCT ANATOMY / The Heritage Boot"**,
body copy about *"hand-selected tobacco leather"* and *"oxidized silver buckle"*, two
ticked features, *View Details*, and a product card reading **"THE HERITAGE BOOT /
$850 USD"** with a **[+]** add control.

> **NEW FINDING — the homepage hero product is a men's boot at $850.** Footwear is
> unverified inventory; menswear does not exist; and $850 is ~25× the top verified
> wholesale price. Registered as **C-17**.

**Colour:** genuinely **warm** — tobacco, tan, dusty rose sky.
> **REFINEMENT.** The token audit found the CSS palette is Material 3 grey. Visually the
> pages read warm **because the photography carries the colour**, exactly as the Creative
> North Star prescribes (*"colour carried by the garment, not the interface"*). The
> palette finding stands mechanically; the *perceived* warmth is real and comes from
> imagery.

**Accessibility:** subhead is white text directly over a busy photograph with **no scrim**
— **VISUAL RISK.**
**Verdict:** **PREMIUM and resolved — factually wrong.**
**Disposition:** **PRESERVE INTENT, REBUILD EXECUTION** + **REVISE FOR BUSINESS ACCURACY.**

---

### A6 · `v3_frame_8_garment_portal_and_product_anatomy` — V3 · desktop · ROUTE + section
`6a59b79c` · 867×1600 · 820,627 B

**Directly visible:** *THE ATELIER EDITION* → **"Midnight Pearl Snap"**, a flat-laid indigo
western shirt. Copy: *"Woven from 12oz selvedge denim and punctuated with authentic
mother-of-pearl hardware."* **$285.00**. **Three colour swatches** with the selected one
named *Indigo Selvedge*. **Size buttons S · M · L · XL**, with **XL visibly disabled**.
**"Size Guide"** link. **"Add to Bag →"** primary; **"Customize Hardware"** secondary.
*"Complimentary global shipping on Atelier pieces."* Then **"Garment Anatomy"** — an
exploded **orange wireframe overlaid on the photographed shirt** (*"Structural Integrity /
The Outer Shell & Stitch Path"*), plus *Hardware / Mother of Pearl* and *12oz Selvedge —
"Sourced from the Kuroki Mill, dyed deeply with natural indigo."*

> **MAJOR REFINEMENT — the anatomy is 2D, not 3D.** The exploded view is a **wireframe
> drawn over a photograph**, not a rendered model. It is achievable with **SVG/CSS over an
> image**. This weakens the case that Product Anatomy requires WebGL — the *approved
> design itself does not depict real-time 3D*. Updates `08` §5.

> **NEW FINDING — invented sourcing that contradicts verified truth.** *"Sourced from the
> Kuroki Mill"* attributes the denim to a real Japanese mill. L&B is **vertically
> integrated and owns its textile production**. Registered as **C-18**.

**Commerce quality:** the strongest in the corpus — sizes as buttons not a dropdown, a
disabled out-of-stock state, a size-guide link, named colour swatches, real primary CTA.
**Gaps:** **no plus sizes** (S–XL only) against the brand's core inclusivity claim; $285 is
3–9× the verified band.
**Verdict:** **RESOLVED and excellent — factually wrong.**
**Disposition:** **PRESERVE CLOSELY** (interaction model) + **REVISE FOR BUSINESS ACCURACY.**

---

### A7 · `v3_frame_11_wholesale_showroom_and_owner_operating_world` — V3 · desktop · AUTHENTICATED ROUTE
`d6a62d09` · 1210×1600 · 808,683 B

**Directly visible:** *OPERATING WORLD* → **"Wholesale & Sourcing"** with an **"Export Line
Sheet"** button. **"Virtual Rack: AW24 Collection"** with a **"Wholesale View"** pill.
Three product cards:

| Product | SKU | WHLSL Price | MOQ | Pack Breakdown | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Waxed Canvas Chore Coat | AW24-CC-01 | **$145.00** | **24 Units** | **(12): 2 S \| 4 M \| 4 L \| 2 XL** | Add to Order · *In Stock* |
| Selvedge Frontier Denim | AW24-DN-05 | **$95.00** | **36 Units** | **(6): 1×30 \| 2×32 \| 2×34 \| 1×36** | Add to Order |
| Merino Ridge Sweater | AW24-SW-12 | *(clipped)* | — | *Open Sizing — select at checkout* | **Waitlist** (disabled) |

Plus: *Sourcing Diary — "Tannery Dispatches: Leon & Tuscany"*; *Campaign Launch Status —
'The High Plains' AW24, Post-Production 80%, voice notes pending*; **Bespoke Approvals (3)**
naming *Arthur Pendelton*, *E. Vance Holdings*, *J.R. Cash*.

> ### CORRECTION — the most important of this pass
> The prior audit concluded **"the wholesale showroom contains no wholesale."** That was
> **wrong**. It rested on grepping for the literal strings `MSRP` and `prepack`, which do
> not appear. **The mechanics are all present under different labels:** *WHLSL Price*,
> *MOQ*, *Pack Breakdown* with a real size run, *SKU*, *Add to Order*, *Export Line Sheet*,
> *Wholesale View*, *In Stock*, *Waitlist*, *Open Sizing*. One pack is **(6)** — matching
> L&B's verified prepack of six exactly.
>
> **Revised finding: the wholesale design is structurally excellent and factually wrong.**

**Factual defects:** prices $95–$145 are 3–5× verified wholesale; MOQ 24/36 units contradicts
the verified **$50** minimum; products are men's/unisex workwear, not women's western;
**"Leon & Tuscany" tanneries** contradict vertical integration and Texas identity;
*Arthur Pendelton*, *E. Vance Holdings*, *J.R. Cash* are **invented people** (`CLAUDE.md`
§12) — and *J.R. Cash* is Johnny Cash's birth name.
**Verdict:** **RESOLVED and genuinely strong — every fact must be replaced.**
**Disposition:** **PRESERVE CLOSELY** (structure) + **REVISE FOR BUSINESS ACCURACY** (content).

---

### A8 · `v3.1_frame_8_the_belt_buckle_aperture` — V3.1 · **documentation board**
`8d237bc9` · 793×1600 *(prior pass; carried forward)*

*"STUDY V3.1 — TECHNICAL DESIGN BOARD."* Hero region is an **empty black rectangle**
labelled *FRAME 08: CINEMATIC DARKNESS*. Six state thumbnails render as **rounded
rectangles**. Material studies are photographs. Production specs call for a *chamfered
rectangle*, `MeshPhysicalMaterial`, displacement map, Fresnel edge lighting.
**Disposition:** **CONCEPTUAL REFERENCE ONLY.**

---

### A9 · `v3.1_frame_8e_concentric_ring_separation` — V3.1 · desktop · STATE
`78dd94d6` · 1600×1280 · 361,137 B

**Directly visible:** **A single flat grey circle** filling most of a black field, with a
thin light outline. Centred type: **"08: SEPARATION"** and *THE FRONTIER ENGINE INITIATES*.
L&B monogram top-left; hamburger top-right. A mode pill (*Cinema ○ Instant*) sits at the
bottom, **overlapped by the circle** and very low contrast.

> ### CORRECTION — the coin problem is NOT solved
> The prior audit concluded *"the design board solved the coin problem; only the code
> builds a coin."* **The state frames build a coin too.** Frame 8e — an actual sequence
> state, not a documentation board — renders the artifact as **a perfect flat circle**.
> There is no chamfer, no rings, no separation, no material, no engraving.
>
> **Revised finding: the chamfered rectangle exists only in the technical board's
> thumbnails and in prose. Both the state frames and the Three.js code render a circle.**
> Registered as **C-08 (revised)**.

**Accessibility:** mode pill is dark-on-dark and partially occluded — **VISUAL RISK.**
**Verdict:** **INCOMPLETE / PLACEHOLDER.**
**Disposition:** **CONCEPTUAL REFERENCE ONLY** — the object must be designed before it is built.

---

### A10 · `v3.1_frame_8f_category_orbit` — V3.1 · desktop · SECTION
`295d1fd9` · 1600×1280 · 333,522 B

**Directly visible:** Bone ground. **"NEW ARRIVALS"** top-centre. A circular masked
photograph of a **warehouse rack aisle** at centre. Orbiting labels in display serif:
**PLUS** (upper-left) · **WOMEN** (upper-right, subtly highlighted) · **GIRLS**
(lower-left) · **ACCESSORIES AND HOME** (lower-right). Below, in a bordered pill:
**WHOLESALE**. Corner label *08: ORBIT*. Nav Cinema | **Balanced** | Instant, with search,
bag and account icons.

> ### NEW FINDING — the real category system, and it is the most brand-accurate one
> **WOMEN · PLUS · GIRLS · ACCESSORIES AND HOME**, plus **NEW ARRIVALS** and **WHOLESALE**.
> This **matches `v3_1_design.md`'s stated audience exactly** (five segments) and maps far
> better onto verified L&B taxonomy than V3 Frame 5 does — Women ✓, Plus ✓, Girls ✓,
> Accessories ✓ (Home partially), Wholesale ✓. **No menswear.**
>
> **Consequence: on category truth, V3.1 is more accurate than V3.** Frame 5's
> `FOR HER / FOR HIM` is the *less* correct artefact. This does not overturn the hierarchy
> — it means the hierarchy's Level 1 (verified truth) resolves in V3.1's favour here.

**Plus prominence:** `PLUS` is set at **identical size and weight to `WOMEN`**, positioned
symmetrically. **Validation item 8 CONFIRMED — Plus does receive equal visual prominence.**

**Wholesale prominence:** `WHOLESALE` is **smaller, bordered, set apart at the bottom** —
visually the least prominent element. For a wholesale-only business this is inverted.
**Validation item 9 CONTRADICTED.**

**Warehouse reading:** the central image is a literal **stockroom rack aisle** — utilitarian,
not premium-editorial.
**Accessibility:** orbiting labels have no visible focus affordance or ordering cue; reading
order for a screen reader is undefined — **VISUAL RISK.**
**Verdict:** **RESOLVED and strategically valuable.**
**Disposition:** **PRESERVE INTENT, REBUILD EXECUTION** + **OWNER DECISION REQUIRED** (D-04).

---

### A11 · `v3.1_frame_8g_6_warehouse_aisle_becoming_fashion_runway` — V3.1 · desktop · **destination, not transition**
`1372dbbb` · 1600×1280 · 950,781 B

**Directly visible:** Three-panel editorial layout on bone ground. Left: a woven throw over
a wooden A-frame in an industrial hall, tagged **"Artisan"**. Centre: *ACCESSORIES & HOME*
→ **"THE COLLECTION"** with an **"Explore Now ○"** black button. Right: a **brown leather
belt with a large aged-silver buckle** — genuine western hardware, beautifully lit.
Mode pill bottom-centre, **Cinema** active.

> ### NEW FINDING — the passage frame is not a passage
> The filename promises *warehouse aisle becoming fashion runway*. The render is an
> **Accessories & Home category landing page**. There is no warehouse, no runway, and no
> transformation. **The camera-passage frames are not a continuous sequence — they are not
> even all the same kind of artefact.** This strengthens the prior finding considerably.

**Defect visible:** **"THE COLLECTION" is clipped** — the final `N` is cut by the panel
edge. Layout bug, not a stylistic crop.
**Note:** the belt-and-buckle photograph delivers exactly the **material credibility the
3D buckle lacks** — brushed silver, tooled leather, stitching — as photography.
**Verdict:** **RESOLVED as a category page; MISSING as a transition.**
**Disposition:** **PRESERVE CLOSELY** (as a category surface) — and reclassify.

---

### A12 · `v3.1_frame_12k_mobile_fallback_states` — V3.1 · mobile · STATE
`0e9c09a1` · 472×1600 · 330,118 B

**Directly visible:** Mobile viewport. Wordmark, search, bag with badge **2**. A pill reading
**"⚡ POWER SAVING MODE"**. **A photograph of a literal mechanical engine block** — chrome
and aluminium, automotive/industrial. Heading **"Frontier Engine"** with **"Static Preview"**
in grey beneath. Body: *"Experience optimized for your device. Advanced interactive 3D
features have been disabled to conserve battery and ensure a smooth shopping experience."*
Large dark pill **"Enter Shop →"**. Card **"BROWSE CATEGORIES"**: **Women's Collection ›**,
**Men's Collection ›**, **Custom Orders ›**. Links *Search | Wholesale Access*. Bottom tab
bar: **HOME · DISCOVER · CUSTOM · PASSPORT · BAG**.

> ### NEW FINDING — the Frontier Engine is depicted as an actual engine
> The fallback renders the brand's central metaphor as a **literal internal-combustion
> engine**. The Frontier Engine was specified as the *supply-chain machine* — textile →
> design → manufacturing → warehouse → distribution. Here it is a car part.
>
> **This is the strongest possible evidence that the warehouse/engine meaning lives only in
> documentation** — the design itself misread its own metaphor. Registered as **C-19**.

> ### NEW FINDING — menswear, third occurrence
> **"Men's Collection"** appears as an explicit category link. Combined with Frame 5's
> `FOR HIM`, Frame 6's male hero and $850 boot, and Frame 4's male model, **menswear is not
> a stray label — it is woven through the design corpus.** This materially escalates D-03.

**What is genuinely good:** the fallback is **commercially usable** — a prominent Enter Shop,
categories as semantic text rows with generous touch targets, a persistent five-item tab bar,
and an honest explanation of *why* 3D is off. Native mobile patterns throughout.
**What is not:** the engine photograph is generic industrial stock and **does not read
premium**; *"Static Preview"* is low-contrast grey.
**Validation item 15 partially CONTRADICTED** — the fallback is *usable and well-structured*
but **not premium**.
**Disposition:** **PRESERVE INTENT, REBUILD EXECUTION** + **REVISE FOR BUSINESS ACCURACY.**

---

# Part A2 — Batch 2 (2026-08-01) · 11 frames · all `FULL_FIDELITY_INSPECTED`

Priority 1 (connected claims) then Priority 2 (mobile and category truth).

---

### B1 · `v3_connected_flagship_prototype` — V3 · desktop · **prototype board**
`1d150164` · 1600×1280 · 38,186 B

**Visible:** The **Ignition screen with a nav bar bolted on**. Content identical to Frame 1
— *YOU REMEMBER.* / *NOT THE WEST* / *ENTER THE FRONTIER* / *SKIP TO SHOP*. Added: top nav
**IGNITION · HOMEPAGE · CUSTOM ATELIER · WHOLESALE**; a real segmented mode control
**Cinema | Balanced | Instant**; search and bag icons. The CTA arrow is now a **down** arrow
(scroll), not a right arrow.

> **CONFIRMS the prior finding.** The "connected prototype" is a **four-destination
> navigation board**, not a connected platform. Four labels against 12+ V3 frames.

**Positive:** **WHOLESALE sits in the top nav at equal weight** with the other three —
better prominence than the V3.1 orbit gives it.
**Contrast:** *NOT THE WEST* remains near-invisible dark-grey-on-black — **VISUAL RISK**,
identical to Frame 1. **Typography:** premium. **Commerce:** exit only.
**Judgment:** RESOLVED as a board; INCOMPLETE as a prototype. `OBSERVED`.
**Disposition:** **CONCEPTUAL REFERENCE ONLY.**

---

### B2 · `v3.1_connected_desktop_prototype_hub` — V3.1 · desktop · **hub / route selector**
`c3f0af26` · 1600×1280 · 1,558,012 B

**Visible:** Dark navy textured ground. Wordmark centred; hamburger left; search/bag/account
right. Mode control **○ Cinema | Balanced | Instant**. A large **orbit ring** carrying four
labelled nodes — **WOMEN** (top) · **PLUS** (right) · **GIRLS** (bottom) · **WHOLESALE**
(left). Centre: an **oval-masked preview card** of *Accessories & Home* over a photograph of
an **ornate engraved silver buckle on tooled brown leather** with a heraldic crest, plus a
circular **→**. Below: **"⊙ START JOURNEY"** and **"SKIP TO SHOP"**.

> **NEW — this is a genuine navigation hub**, not a static board. Five destinations, a
> primary action, and an escape hatch.
> **REFINES "wholesale is not central":** here **WHOLESALE sits on the ring at equal weight**
> with Women, Plus and Girls.
> **Category set matches 8f and `v3_1_design.md` exactly. No menswear.**

**Defect:** text behind the centre card is **clipped** — *"…Detail V3.1"*, *"…LECTED REALM"*.
**Accessibility:** ring labels are small, letter-spaced, low-contrast grey on near-black —
**VISUAL RISK**; ring nodes are tiny dots — **target-size risk**.
**Judgment:** RESOLVED and strategically valuable. `OBSERVED`.
**Disposition:** **PRESERVE INTENT, REBUILD EXECUTION.**

---

### B3 · `v3.1_connected_mobile_prototype_hub` — V3.1 · mobile · **hub**
`37e4b08a` · 706×1600 · 1,139,038 B

**Visible:** Full-bleed photograph of a **real western belt buckle** engraved **"FRONTIER
SEAL"** with a star, a wolf figure, rope edging and **"EST. 1865"**, mounted on dark denim
with orange topstitching. Header: **L&B**, **"SKIP INTRO"**, search. Headline **"The
Frontier Awaits"**; sub *"Experience rugged heritage crafted for the modern era."* A large
segmented pill **CINEMA (active) | BALANCED | INSTANT**. Full-width **"ENTER SHOP"**. Tab
bar **HOME · DISCOVER · CUSTOM · PASSPORT · BAG**.

> ### NEW — the buckle reads unmistakably as a buckle here
> Engraved silver, rope edge, animal motif, mounted on topstitched denim. **This is the
> strongest evidence in the corpus that the buckle concept works — as photography.** It is
> not a coin, a token or a portal. It is garment hardware.

> ### NEW — an invented heritage date, baked into artwork
> **"EST. 1865"** is fabricated. Lucky & Blessed dates to ~2015 (FashionGo member since
> 2015-09-23). A 160-year heritage claim is rendered *into the image*, so it cannot be
> fixed by editing copy. Registered as **C-21**; owner decision **D-15**.

**Positive:** best mobile hierarchy in the corpus; **SKIP INTRO** prominent; mode targets
large and high-contrast.
**Accessibility:** sub-copy grey on busy dark photo — **VISUAL RISK**. No visible
safe-area inset at the tab bar.
**Judgment:** PREMIUM and RESOLVED — factually wrong. `OBSERVED`.
**Disposition:** **PRESERVE CLOSELY** + **REVISE FOR BUSINESS ACCURACY.**

---

### B4 · `v3.1_frame_12i_mobile_mode_selector` — V3.1 · mobile · **OVERLAY / state**
`c70795dc` · 706×1600 · 788,375 B

**Visible:** Near-white ground. *"Select Your Journey"* heading and body *"Choose how you
want to experience L&B Frontier House. This sets your default motion and pacing."* Three
blocks — **CINEMA MODE** (*"Immersive transitions, slow garment reveals, and full-screen
editorial galleries."*), **BALANCED MODE** (*"Standard pacing with subtle material
transitions. Ideal for exploring collections."*), **INSTANT SHOP** (*"Zero motion. Direct to
catalog, grid views, and fast checkout workflows."*). Bottom: **"⊙ ENTER GALLERY"**.

> ### NEW — the least legible frame inspected
> The three **mode labels — the most important text on a mode-selection screen — render in
> a grey so light they are barely readable**, and only **one** radio indicator is visible
> (beside Cinema). Selection state is unclear.
>
> **Two readings, and both are problems.** If this is the final state, it is a severe
> contrast failure on an accessibility-adjacent surface. If it is a **captured mid-entrance
> animation** — plausible, given the staggered opacities — then the frame is unusable as a
> specification. **CANNOT DETERMINE FROM STATIC FRAME** which; flagged either way.

**Copy quality:** genuinely good — *"Zero motion. Direct to catalog…"* is an accurate,
useful description of Instant Shop.
**Inconsistency:** CTA reads **"ENTER GALLERY"**, against *ENTER SHOP* everywhere else.
"Gallery" is not a commerce destination.
**Judgment:** INCOMPLETE. `OBSERVED` + `INFERRED` on cause.
**Disposition:** **REVISE FOR ACCESSIBILITY.**

---

### B5 · `v3.1_frame_12j_reduced_motion_journey` — V3.1 · mobile · **STATE**
`83077c2c` · 173×1600 · 239,224 B

**Visible:** A complete, stacked, card-based catalogue. Hero **"THE HERITAGE COLLECTION /
Forged for the Frontier."** with a **woman in a brown leather jacket** and *Shop Heritage →*.
Category cards: **Custom Leathercraft** (tagged *Bespoke*) · **Heavy Denim** (a woman in a
denim jumpsuit) · **Silver Hardware** (buckles, conchos) · **Footwear** (brown boots).
Then **New Arrivals** with *View All* — **"Frontier Jacket — $850 / Ink Black"** and a
clipped *"Raw Selv… / Heavy In…"*. Dark navy footer: *"Crafting heritage quality goods for
the modern frontier…"*, Explore / Brand Story / Wholesale / Legal / Privacy / Terms,
**"© 2024 L&B Frontier House. Crafted for the Modern West."** Tab bar present.

> ### CORRECTION — reduced motion is the strongest fallback in the corpus
> The prior pass judged fallback states *"not premium"* based on 12k. **That conflated two
> different things.** 12j — the **reduced-motion** path — is a rich, editorial, fully
> shoppable page with real products, prices, categories and a wholesale link. It is
> **commercially complete and premium**. It is **12k, the WebGL/low-power fallback**, that
> looks generic.
>
> **Revised: reduced motion is excellent; the WebGL fallback is not.** Validation item 15
> splits.

**Defects:** **"Footwear" as a top-level category** (unverified inventory); **$850** again;
*Custom Leathercraft / Bespoke* (unverified capability); product name and price **clipped**
in the horizontal rail; tagline **"Crafted for the Modern West"** conflicts with *"…Modern
Horizon"* elsewhere; **© 2024** stale.
**Positive:** models are women throughout — unlike Frames 4 and 6.
**Accessibility:** card labels sit on photography with no scrim; *Heavy Denim* falls over a
bright sky region — **VISUAL RISK**.
**Judgment:** RESOLVED and premium — factually wrong. `OBSERVED`.
**Disposition:** **PRESERVE CLOSELY** + **REVISE FOR BUSINESS ACCURACY.**

---

### B6 · `v3.1_frame_12a_poster_first_loading_nav` — V3.1 · mobile · **STATE (loading)**
`ef26bc1b` · 706×1600 · 535,771 B

**Visible:** Near-black with a very dark buckle/denim photograph behind. Circular hamburger
and search buttons. Centred **"L&B Frontier House"** over three lines; **"CRAFTED FOR THE
MODERN WEST"**; a **thin progress bar ~40% filled**. Mode pill **● Cinema | Balanced |
Instant**. Full-width **"ENTER SHOP →"**. **"Skip Intro"** underlined below.

> ### NEW — exemplary poster-first behaviour
> During loading the user is already offered: the brand, a tagline, **loading progress**,
> **mode choice**, and **two escape actions**. **A user can leave before the cinematic
> experience has finished loading.** This is textbook poster-first and directly satisfies
> `CLAUDE.md` §9 and §11.

**Accessibility:** good contrast; generous targets. No visible safe-area inset at the top.
**Judgment:** RESOLVED, PREMIUM. `OBSERVED`.
**Disposition:** **PRESERVE CLOSELY.**

---

### B7–B10 · The four depth carousels — direct comparison

| | **12f_1 Women** | **12f_2 Plus** | **12f_3 Accessories & Home** | **12f_4 Wholesale** |
| :--- | :--- | :--- | :--- | :--- |
| Hash | `39f62600` | `ba63e43a` | `cc2bf44b` | `76e3941d` |
| Ground | Full-bleed dark photo | **Inset card on dark** | **Light** | **Light, no hero photo** |
| Label | Centred, moderate | **Left, large** | Very large | Very large |
| Copy | 1 line | 3 lines | 3 lines | 3 lines |
| CTA | *Enter Collection* (black) | *ENTER COLLECTION →* (white) | *Enter Collection* (black) | **ENTER SHOWROOM** (black) |
| Carousel affordance | **4 dots, pos 2** | **none** | **none** | **← → circular buttons** |
| Mode pill | not visible | top, dark | top, light | **absent** |
| Header | full nav | none visible | full nav | **minimal: L&B + bag** |
| Tab active | Discover | **Custom** | Discover | unclear; **Bag item appears absent** |
| Tag | — | **"BESPOKE SIZING"** | — | **"FALL '24"** |

**Women (12f_1)** — a woman in a denim pearl-snap shirt and wide-brim felt hat. On-brand,
premium. *"The definitive western wardrobe."* Wordmark **wraps to two lines and overlaps the
photo edge** — layout defect. Sub-copy white over mid-tone denim — **VISUAL RISK**.

**Plus (12f_2)** — the **best photography in the corpus**: a plus-size woman in a dark denim
western jacket with yoke detail and pearl snaps, confidently lit and posed. Copy is
excellent: *"Every world, every silhouette."*

> ### NEW — Plus has equal *representation* but not equal *structure*
> Batch 1 found Plus typographically equal to Women in the desktop orbit (8f). **The mobile
> carousel tells a different story.** Plus is rendered in a **different layout system**
> (inset card vs full-bleed), has **no carousel dots**, is tagged **"BESPOKE SIZING"**, and
> sits under the **Custom** tab while Women sits under **Discover**.
>
> **Being routed to a bespoke/made-to-order lane is a subtler and more damaging separation
> than a separate catalogue** — it implies plus sizes are special-order rather than stock.
> **D-04 materially refined.**

**Accessories & Home (12f_3)** — an exceptional photograph of a floral-tooled leather belt
with an ornate engraved silver buckle on weathered wood. Copy: *"Engraved hardware and
textile craft."* **"Home" is asserted but not depicted** — the only product shown is an
accessory. **Reinforces D-02.**

**Wholesale (12f_4)** — *"TRADE AREA"* eyebrow, **WHOLESALE** at the largest type on screen,
*"The engine of the western world. Discover curated assortments for high-end retail
partners."*, **ENTER SHOWROOM**, then an **Assortments** rail with **explicit ← → circular
buttons**, a *FALL '24* card — **"Core Denim / Heavyweight selvedge & canvas staples / 24
SKUS"**.

> ### CORRECTION — a single-pointer carousel alternative *does* exist
> The prior pass stated *"no prev/next control is specified."* **12f_4 has explicit circular
> ← → buttons.** The **WCAG 2.5.7** position is therefore **partial, not absent** — one of
> four carousels has the alternative, and it appears to be incidental rather than systematic.

> ### NEW — the authorisation boundary is honoured here
> **No wholesale prices are shown.** The frame sells the *assortment* (24 SKUs, Fall '24)
> and gates pricing behind **ENTER SHOWROOM**. This is exactly the public/restricted split
> `13` recommends, achieved visually.

> ### NEW — four carousels, four design systems
> Different grounds, headers, affordances, tab states and CTA treatments. **They do not read
> as siblings in one carousel** — they read as four unrelated screens. The "depth carousel"
> premise is undermined by its own inconsistency.

**Defects:** *FALL '24* is a stale season; the Wholesale tab bar appears to be **missing the
Bag item**.
**Judgments:** Women RESOLVED · Plus RESOLVED but mis-placed · Accessories RESOLVED ·
Wholesale RESOLVED and the strongest commerce framing in V3.1. All `OBSERVED`.
**Dispositions:** Women **PRESERVE CLOSELY** · Plus **OWNER DECISION REQUIRED** (D-04) ·
Accessories **OWNER DECISION REQUIRED** (D-02) · Wholesale **PRESERVE CLOSELY**.

---

# Part A3 — Batch 3 (2026-08-01) · 11 frames · all `FULL_FIDELITY_INSPECTED`

Priority 3 — Frontier Engine, belt buckle, camera continuity, mobile arrival.
All paths under `stitch-export/v3-1-frontier-engine/…/stitch_l_b_frontier_house_platform_synthesis/`.

---

## The buckle — resolved precisely

> ### CORRECTION — the coin problem is **conditional**, not universal
> Batch 1 said the board solved it. Batch 2 reversed that on the strength of `8e`.
> **Batch 3 shows both were partly wrong.** The buckle's form depends entirely on whether
> the frame is **photographic** or **geometric**:
>
> | Frame | Form | Reads as |
> | :--- | :--- | :--- |
> | **`8b` Dormant** | **Scalloped, chamfered, rectangular inset** | **Belt buckle ✔** |
> | **`8c` Reveal** | **Photorealistic buckle on denim** | **Belt buckle ✔** |
> | `8d` Awakening | Circle with six radial spokes | Aperture blades / wheel ✘ |
> | `8e` Separation | Flat grey circle | Coin ✘ |
> | `8f` Orbit | Circular photo mask | Disc ✘ |
> | `8g_1` Aperture Lock | Concentric rings + crosshair | **Lens iris / rifle scope ✘** |
> | Mobile hub | Photographic buckle | Belt buckle ✔ |
> | Three.js code | Concentric tori | Coin ✘ |
>
> **The chamfered geometry does appear outside the documentation board — in `8b`.**
> **Rule for implementation: model the object from `8b`/`8c`, never from `8e`/`8f`/`8g_1`.**

### C1 · `02-belt-buckle-aperture/…/v3.1_frame_8b_dormant_artifact` — STATE
`364521bb` · 1600×1280 · 834,298 B
**Visible:** A large **scalloped, ornately engraved buckle** in darkened silver, hanging
from a leather cord, with a chamfered rectangular inset panel. A **glowing cyan thread
traces an S-curve** across it — the Frontier Thread, visually integrated. Label
*"08: DORMANT"*. **"ENTER SHOP"** in display serif; **"SKIP INTRO"** below. Light header bar
with wordmark, mode selector and icons.
**Bottom caption strip, clipped at both edges:** *"…Origin: 1870s American West | Materials:
Darkened Silver, Hand-Tooled Bridle Leather, Neon Thread | Dimensions: 14cm × 10cm × 2cm…"*
> **NEW FABRICATION — "Origin: 1870s American West"**, a *second and different* invented
> heritage date (the mobile hub says **EST. 1865**). Registered **C-25**.
**Also:** *"Neon Thread"* is listed as a material — not western. No pause control.
`OBSERVED`. **PREMIUM, RESOLVED.** → **PRESERVE CLOSELY** + **REVISE FOR BUSINESS ACCURACY**

### C2 · `02-belt-buckle-aperture/…/v3.1_frame_8c_material_lighting_reveal` — STATE
`b594305c` · 1600×1280 · 1,830,469 B
**Visible:** A **photorealistic western belt buckle on dark indigo denim with gold
topstitching**. Ornate silver scrollwork with **copper/bronze** tones; a **silver longhorn
skull**; **two turquoise stones**; **brass studs**; **hand-tooled leather** with basketweave
and floral carving; rope-edge border. Label *"08: REVEAL"*; **"SKIP INTRO →"**.
> ### CORRECTION — a pause control **does** exist
> **Bottom right: a ⏸ pause button and a 🔊 sound toggle**, both in circular containers.
> The prior audit stated *"no pause, stop, hide or sound control appears in any inspected
> frame."* **That is now false.** WCAG 2.2.2 is addressed here — though not systematically.

> ### Material credibility is **fully delivered** — in photography
> Every specified material is visibly present: darkened/brushed silver ✔ · copper ✔ ·
> tooled leather ✔ · denim ✔ · **turquoise ✔** · engraving ✔ · brass ✔ · stitching ✔.
> The `08` finding that materials are *"0% implemented"* holds **for the Three.js code
> only** — the design delivers them completely.
`OBSERVED`. **PREMIUM, RESOLVED — the strongest craft image in the corpus.**
→ **PRESERVE CLOSELY**

### C3 · `02-belt-buckle-aperture/…/v3.1_frame_8d_operational_awakening` — STATE
`80e47485` · 1600×1280 · 1,144,795 B
**Visible:** Near-black. A **faint circle with six radial spokes** (aperture blades / wheel).
**"L&B" monogram glowing at centre** — the identity **is** physically integrated, answering
the brief's question affirmatively. Label *"08: AWAKENING"*. Nav top-right reads
**"THE CINEMA | OPERATIONAL"** — a *third* navigation vocabulary, not Cinema/Balanced/Instant.
**Extremely low contrast throughout — VISUAL RISK.** No pause control.
`OBSERVED`. **INCOMPLETE.** → **CONCEPTUAL REFERENCE ONLY**

---

## The Frontier Engine narrative

### C4 · `01-frontier-engine-core/…/v3.1_frame_3_cinematic_ignition` — ROUTE
`a326cc80` · 1600×1280 · 1,157,355 B
**Visible:** Near-black. **"NOT THE WEST YOU REMEMBER"** in very dark grey display serif —
the full V1 line at last. **A single glowing blue thread traces an "L&B" monogram** across
it. **"Skip to Shop →"** as a well-formed pill, bottom-right, good contrast.
> **Thread ignition works.** *"A single luminous thread stitches the L&B mark"* is exactly
> what is depicted. **Thread-to-Trade step 1 is visually understandable without the spec.**
> **But the thread is neon blue, not thread-coloured.** A stitch rendered in Electric Cobalt
> reads as electronic, not textile. This is the clearest visual case for **D-07**.
**Headline contrast — VISUAL RISK** (dark grey on black), same as V3 Frame 1.
`OBSERVED`. **PREMIUM.** → **PRESERVE INTENT, REBUILD EXECUTION**

### C5 · `01-frontier-engine-core/…/v3.1_frame_5_impossible_frontier_engine_reveal` — SECTION
`14c579a1` · 1600×1280 · 1,357,985 B
**Visible:** ~95% empty black. A very faint circle with three grey dots. Left:
*CATEGORY ORIGIN* → **"FROM THREAD TO TRADE"**. Right: *DESTINATION* → **"FROM WAREHOUSE TO
FRONTIER WORLD"**. **"● ENTER THE ARCHIVE"**. Bottom: *"CENTRAL LOADING FLOOR"*.
> ### CONFIRMS emphatically — the warehouse is captioned, not shown
> The frame named *"Impossible Frontier Engine Reveal"* **reveals nothing visually**.
> Thread-to-Trade appears only as **typography**. There is no warehouse, no textile, no
> manufacturing, no distribution — only the words for them.
> **The Impossible Warehouse does not exist as an image anywhere in the corpus.**
**Also:** *"ENTER THE ARCHIVE"* is the **sixth distinct "Enter …" CTA verb** (Shop,
Collection, Showroom, Gallery, Distribution, Archive). Registered **C-26**.
`OBSERVED`. **INCOMPLETE.** → **CONCEPTUAL REFERENCE ONLY**

---

## The camera passage — four frames, four unrelated artefacts

### C6 · `03-camera-passage/…/v3.1_frame_8g_1_category_selection_and_aperture_lock`
`c1896764` · 1600×1280 · 1,321,289 B
**Visible:** Near-black. Mode control + **SKIP INTRO**. **Category nav: WOMEN · MEN ·
ACCESSORIES AND HOME (active) · PLUS · WHOLESALE.** Centre: **concentric glowing blue rings
with a crosshair reticle** over a dark leather detail. *"APERTURE LOCKED"* in blue mono.
**"◆ ENTER COLLECTION"**.
> ### OVERTURNS a batch-1 finding — **"MEN" is in V3.1's navigation**
> Batch 1 concluded V3.1's taxonomy contained **no menswear**. `8g_1` disproves it.
> This is a **sixth** taxonomy variant: it swaps **GIRLS → MEN** relative to `8f`.
> **Menswear is now confirmed in both V3 and V3.1.** Registered **C-27**; escalates **D-03**.
> **Also:** Electric Cobalt is finally visible — as a **targeting HUD**. It reads as a rifle
> scope or camera iris, not western hardware.
`OBSERVED`. **CONFUSING.** → **OWNER DECISION REQUIRED**

### C7 · `03-camera-passage/…/v3.1_frame_8g_2_camera_entering_the_separated_material_rings`
`0190c723` · 1600×1280 · 182,380 B
**Visible:** A **screenshot of a window** whose title bar reads *"8G-2: Camera Entering
Separated Material Rings"* — the frame's own label baked into the artwork. Inside: a very
dark photograph of an **empty industrial warehouse** — concrete pillars, steel trusses, one
shaft of light. Below: *"ENTERING THE ATELIER"* / **"The Bespoke Portal"**.
> **Three-way disagreement:** the title says *material rings*, the image shows an *empty
> warehouse*, and the caption says *atelier*. **No rings appear.** The warehouse reads as
> **derelict** — no racks, no garments, no people, no operations.
`OBSERVED`. **PLACEHOLDER.** → **REJECT** (as a passage frame)

### C8 · `03-camera-passage/…/v3.1_frame_8g_4_engraved_routing_geometry_becoming_warehouse_architecture`
`5a03f007` · 1600×1280 · 1,623,362 B
**Visible:** A vast blue-grey **steel-truss megastructure** with catwalks receding into fog —
reads as **sci-fi shipyard**, not fashion warehouse. **The frame title is rendered into the
image** as large grey type. Centre: a **denim trucker jacket on a hanger** inside a white
angular armature. Left: *WAREHOUSE_01* → **"Structural integrity verified."** Right:
**"ENTER DISTRIBUTION →"**.
> Language is **engineering and logistics** — *structural integrity*, *distribution*,
> *routing* — not fashion. Confirms the warehouse reads industrial.
> **Second frame with its own label baked into the artwork.**
`OBSERVED`. **CONFUSING.** → **PRESERVE INTENT, REBUILD EXECUTION**

### C9 · `03-camera-passage/…/v3.1_frame_8g_8_living_contact_sheet_arrival`
`08dc09b9` · 1096×1600 · 1,317,487 B
**Visible:** A **fully realised light commerce page**. Header with **search field**, mode
selector, account, bag. **"The Atelier Collection"**; *"A curated selection of bespoke
goods…"*. **FILTER** control + chips **ALL · HOME · APPAREL · LEATHER**. Grid:
**The High Plains Blanket $450** (*SIGNATURE PIECE*, *BESPOKE*) · **Frontier Saddlebag
$850** · **Dust & Denim Jacket $320** (*NEW ARRIVAL*, modelled by a man) · **Silver Pearl
Buckle $180** · a **"View in Space"** AR card · *THE ARCHIVE* → **SHOP THE COLLECTION**.
> ### NEW — Home is finally depicted
> **The High Plains Blanket** and a **HOME** filter chip. The first actual home product in
> the corpus. **Refines D-02** — depicted, though still unverified as real inventory.
> ### NEW — an AR feature appears nowhere in any spec
> **"View in Space — experience the materiality in your own environment before acquiring."**
> AR is absent from every manifest and specification. **Unjustified new scope.** **C-28.**
**Defects:** a leftover frame label bleeds into a product card (*"…CT SHEET ARRIVAL"*);
prices $180–$850; menswear.
**Continuity:** there is **no visual bridge** from `8g_4`'s dark blue megastructure to this
light editorial grid.
`OBSERVED`. **RESOLVED and genuinely good commerce.** → **PRESERVE CLOSELY** + **REVISE FOR BUSINESS ACCURACY**

> ### Camera passage verdict — the sequence does not exist
> `8g_1` is a category selector · `8g_2` is a reference-image card with window chrome ·
> `8g_4` is a sci-fi environment board · `8g_8` is a finished commerce page.
> **Camera direction, object scale, lighting and colour ground all change between every
> pair.** Two of four carry their own labels burned into the artwork. Three of eight steps
> were never exported. **There is no continuous spatial sequence to implement.**

---

## Mobile arrival

### C10 · `04-native-mobile/…/v3.1_frame_12g_living_contact_sheet_landing` — ROUTE
`3c1d5ece` · 639×1600 · 786,161 B
**Visible:** Black header **"Contact Sheet"** + filter icon. Hero: hide and tools on a
workbench — *Featured Collection* → **"The Frontier Heritage"** + **"Shop Collection"**.
Mixed grid: a **"Custom"**-tagged denim jacket · a **video tile with a ▶ play button**
labelled *Campaign Film* · **brown leather boots** · a **"Wholesale"**-tagged belt with cyan
rim light. Tab bar **Discover (active) · Home · Custom · Passport · Bag**.
> **A play affordance exists** on the film tile — media controls are present in places.
> **Wholesale is integrated into the discovery grid** — good prominence.
**Defects:** *"Campaign Film"* label is **clipped/overlapped**; **boots** (unverified);
**tab-bar order differs** from `12k` and the mobile hub (Discover-first vs Home-first) —
**C-29**; the filter control is **icon-only, unlabelled**; **selected-category persistence
is not visible**.
`OBSERVED`. **RESOLVED.** → **PRESERVE INTENT, REBUILD EXECUTION**

### C11 · `04-native-mobile/…/v3.1_frame_12h_mobile_commerce_arrival` — ROUTE (PDP)
`b6b66fa2` · 687×1600 · 350,080 B
**Visible:** **← back**, wordmark, bag with badge. Product image of a **raw selvedge denim
trucker jacket**, tagged **"Custom"**, with **3 carousel dots**. **"The Frontier Denim
Jacket — $345"**, *"Heavyweight Raw Selvedge"*. **"Select Size"** + **"Size Guide"** link.
**Size buttons S · M (selected) · L · XL** with a clear selected state. **"● ADD TO BAG"**
full-width.
> **The cinematic layer does resolve into genuinely usable commerce.** Back navigation,
> image carousel, name, price, description, size selector with visible selection, size
> guide, prominent primary action. Touch targets are generous.
**Defects:** the price **collides with the wrapping title**; **no plus sizes** (S–XL);
**DTC framing** (*Add to Bag*, not *Add to Order*) with no wholesale path; **$345**
fictional; **"Custom"** tag implies bespoke; no safe-area padding; **no breadcrumb**, so
category persistence is unclear.
`OBSERVED`. **RESOLVED.** → **PRESERVE CLOSELY** + **REVISE FOR BUSINESS ACCURACY**

---

# Part A4 — Batch 4 (2026-08-01) · 11 frames · all `FULL_FIDELITY_INSPECTED`

V3 completion · V3.1 mobile transformation · V1 historical.

---

### D1 · `v3-production/…/v3_frame_3_image_becomes_film` — V3 · desktop · ROUTE
`85f8271c` · 1191×1600
**Visible:** A **craft editorial page**, not a film. Hero: a **bearded man in an apron
hand-stitching a leather satchel** at a lit workbench. **"THE PROCESS"** in display serif
over the image. Below, **"Chapter Progression"**: **01 DESIGN** (patterns) · **02 SOURCE**
(hands with material) · **03 CRAFT** (press) · **04 FIT** (figure, **clipped at the right
edge**). Nav Cinema/Balanced/Instant; footer © 2024.
> **The still-to-film transformation is not depicted.** `MEASURED` — no `<video>`, no
> poster, no play, no scrubber, no pause, no audio, no captions in any V3 file. The frame
> *implies* expansion via an inset-over-blur composition only.
**Reproducible with:** **CSS + static images** (or GSAP for the scale/blur). **No video,
canvas or WebGL required.**
**Commerce:** none — no product, price or CTA. **Wholesale/DTC: neither.**
**Business conflict:** *"SOURCE"* implies external sourcing, and the artisan is a **one-man
leather-goods maker**, contradicting verified vertically-integrated apparel manufacturing.
`OBSERVED`. **INCOMPLETE.** → **PRESERVE INTENT, REBUILD EXECUTION**

### D2 · `v3-production/…/v3_frame_7_midnight_rodeo_campaign_journey` — V3 · desktop · ROUTE
`3c13a552` · 500×1600
**Visible:** Roughly **75% of the frame is empty black**. The designed band shows a **man in
a dark jacket walking a wet neon-lit city street** with a taxi, plus two inset cards — a
**belt buckle held in hand** and a **black felt cowboy hat**. Tiny **"SCROLL TO EXPLORE"**.
Camera-EXIF decoration (*"95.6 1/250 s"*).
> **"Midnight Rodeo" contains no rodeo.** It is an urban night scene. **Campaign name and
> imagery disagree.** No products identifiable, no prices, no CTAs, no campaign navigation.
> **Classification: conceptual mood only — not a verified campaign.**
**Menswear**; **hat and belt** as accessories. **A static editorial fallback would lose
almost nothing, because almost nothing is designed.**
`OBSERVED`. **INCOMPLETE.** → **CONCEPTUAL REFERENCE ONLY**

### D3 · `v3-production/…/v3_frame_9_built_by_you_custom_atelier` — V3 · desktop · ROUTE
`d77755ef` · 1600×1290
**Visible:** Three columns. Left: **"The Bespoke Atelier / Built by You Custom Process"**,
a **stepper** — *Step 01 Garment Selection* ✓ · *Step 02 Craft & Artwork* ● · *Step 03
Placement & Size* ○ — and a **Production Journey**: **Draft → Craft Review → Your Approval
→ In Production**. Centre: **"Artwork Selection"** with four options (**Ranch Emblem**
selected, **Desert Flora**, **Stallion**, **Upload Custom**), a **Thread Palette** of four
swatches labelled **"Oxidized Silver"**, a **"Feasibility Warning: Fine details in the
'Ranch Emblem' may merge at sizes under 3 inches."**, and **"Continue to Placement →"**.
Right: **Front | Back | Detail** toggle over a **flat-laid black chore coat** with a dashed
placement rectangle and an emblem preview card; **+ / −** zoom.
> ### NEW — the Atelier is far more credible than previously assessed
> A multi-step wizard with real state, a **human-in-the-loop production journey**, and a
> **manufacturing feasibility warning**. This is not aspirational vapour.
> ### It requires **no real-time 3D**
> The preview is a **photograph with a 2D overlay**. A **2D layer-based configurator is
> sufficient** — front/back/detail are three photographs, not camera angles.
**Missing:** pricing, MOQ, quote, size selection, save state, confirmation, focus states.
**Icon defect:** *"Stallion"* uses what reads as a **rabbit** icon.
**Assumes DTC.** **Transferable to wholesale** as retailer-exclusive colourways or
buyer artwork placement — see `14`.
`OBSERVED`. **RESOLVED.** → **OWNER DECISION REQUIRED** (D-08 / OQ-12)

### D4 · `v3-production/…/v3_frame_10_living_cart_and_frontier_passport` — V3 · desktop · ROUTE
`31d780e1` · 1079×1600
**Visible:** **"The Archive"** — *"A private record of your acquisitions, bespoke
alterations, and fit preferences."* **"FRONTIER TRUST ◆ 4,250"**. **In Transit:**
*ORDER #FT-8892 — **Midnight Pearl Snap*** with tags **SIZE: M (TALL)**, **CUSTOM: PEARL
HARDWARE**, **MONOGRAM: J.D.**, **Estimated Arrival Oct 24** with a progress bar, badge
*"EN ROUTE TO ATELIER"*, and **TRACK JOURNEY** / **MODIFY FIT**. **The Collection** —
*"Viewing 12 Garments"*: **The High Plains Boot** (ACQUIRED '22 · Fit Feedback: True to
Size · Alterations: None · **REORDER SAME SPEC**) and **Sandstone Field Jacket** (ACQUIRED
'23 · Slightly Boxy · *Sleeves shortened 0.5"* · **REORDER WITH ALTERATIONS**). **Frontier
Loyalty** — **AVAILABLE CREDIT $150.00** · **APPLY TO NEXT ORDER**.
> **Unambiguously a consumer account.** No prices, no packs, no MOQ, no buyer terms, no
> authentication state. **Invented loyalty mechanics** (points balance + store credit) —
> `CLAUDE.md` §11 classifies loyalty **NOT JUSTIFIED**. **Invented customer** (*J.D.*).
> **Boots** again.
> ### But the mechanics transfer to a buyer almost unchanged
> Order tracking · **fit feedback per garment** · **alterations record** ·
> **REORDER SAME SPEC / REORDER WITH ALTERATIONS** · saved collection. **Reorder is the
> highest-frequency buyer action** and it is already designed here.
`OBSERVED`. **RESOLVED and excellent — wrong audience.**
→ **PRESERVE CLOSELY** (mechanics) + **REVISE FOR BUSINESS ACCURACY** (audience, loyalty)

### D5 · `v3-production/…/v3_frame_12_native_mobile_cinematic_commerce_application` — V3 · mobile
`3c810c0f` · 706×1600
**Visible:** Full-bleed hero of **a man in a heavily distressed patched denim jacket** in
desert, **face cropped/blurred at the top edge**. Wordmark reads **"Frontier"** only. Bag
icon. **"THE HIGH PLAINS COLLECTION" / "Dust & Denim." / "Explore Collection →"**. Below,
**"FEATURED ARTIFACT"** and a buckle-on-denim photo **clipped by the tab bar**. Tab bar:
**four unlabelled icons** — home, search, **filter/sliders**, person. **No cart in the tab
bar.**
> ### V3.1 is decisively the stronger mobile source
> V3 mobile lacks: labelled tabs · a cart tab · a mode selector · poster-first loading ·
> reduced-motion · fallback states · wholesale entry · plus representation · safe-area.
> **One V3 principle worth keeping: a filter/sliders control in the tab bar** — V3.1's tab
> bar has no filter access at all.
**Defects:** wordmark inconsistency (*Frontier* vs *L&B Frontier House*); content clipped
under the tab bar; menswear hero; unlabelled icons.
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY** — historical precursor to V3.1 mobile.

---

## The V3.1 mobile transformation — `12b → 12c → 12d → 12e`

| Transition | Verdict |
| :--- | :--- |
| **12b → 12c** | **DISCONNECTED** — ground black→navy; object a neon line→a metal disc; no shared element, no shared material |
| **12c → 12d** | **CONTRADICTORY** — ground navy→bone; the disc **vanishes entirely**; **no rings, no compression, no opening** appear despite the frame's name |
| **12d → 12e** | **PLAUSIBLE WITH MISSING INTERPOLATION** — both light and card-based; 12d's card could credibly scroll into 12e's stack |

### D6 · `04-native-mobile/…/v3.1_frame_12b_mobile_thread_ignition`
`608f0236` · 706×1600
**Visible:** Pure black. **A single bright electric-blue line** curving down the screen,
forming a loose L&B shape; a ghost wordmark behind. **SKIP INTRO** (grey). *"Select
Experience"*. Mode pill shows **only Cinema (clapperboard icon) and Balanced (layers
icon)** — **Instant is demoted to a text link**, *"Enter Instant Mode →"*.
> **The thread is electronic, not textile** — uniform width, glowing, no needle, no
> tension, no fabric. Strongest single case for **D-07**.
> **Mode-selector inconsistency:** two peers plus a text link, against three peers
> elsewhere. The line also **crosses over the control**.
`OBSERVED`. → **PRESERVE INTENT, REBUILD EXECUTION**

### D7 · `04-native-mobile/…/v3.1_frame_12c_frontier_seal_material_reveal`
`529a0071` · 706×1600
**Visible:** Deep navy. A **perfectly circular brushed-metal disc** with concentric raised
rings, a bevelled rim, a **dark centre containing a white star**, two thin blue circles and
a small white edge dot. **"ENTER SHOP"** in black **overlapping the disc edge**;
**"⚙ EXPERIENCE MODE"** in grey **over the dark centre — effectively illegible**.
> ### The clearest coin in the corpus
> A circular medallion with a star. **It does not read as a belt buckle.** The name
> *"Frontier Seal"* is honest — a seal *is* circular — but it is not the approved buckle
> form, and the material is **generic brushed aluminium**, not tooled leather, silver,
> copper or turquoise. The **mobile hub's photographic buckle is vastly better**.
**Text placement appears mis-positioned rather than designed — EXACT FAILURE** on
"EXPERIENCE MODE".
`OBSERVED`. → **REJECT** (as the seal's form)

### D8 · `04-native-mobile/…/v3.1_frame_12d_compressed_ring_opening`
`8ca12f01` · 706×1600
**Visible:** **Light bone ground.** **L&B** wordmark in **white on light — effectively
invisible**. A rounded card holding a photograph of **a woman in an embellished denim
jacket, wide-brim hat, black leather trousers and brown cowboy boots** in a derelict
industrial space. **"ENTER THE FRONTIER →"**. Tab bar with the **Discover label greyed**.
> **No rings, no compression, no opening.** Complete title/content disagreement.
> **Third background in three frames** (black → navy → bone).
**Defects:** invisible wordmark (**EXACT FAILURE**); inconsistent tab rendering; **boots**.
**Positive:** genuinely on-brand women's western styling.
`OBSERVED`. → **REVISE FOR ACCESSIBILITY**

### D9 · `04-native-mobile/…/v3.1_frame_12e_vertical_depth_stack`
`aed784c1` · 243×1600
**Visible:** Light editorial scroll page. Mode pill (**Balanced** active). **"● Chapter 08:
Operational"** → **"Textile to Trade"**. Card: **rolls of raw denim stacked in a
light-shafted warehouse** — *"Raw Selvedge / The Foundation Rolls"*. Product rail:
**"Frontier Belt $185.00"** tagged *Custom* with **"Add to Cart +"**, and a clipped
**"Rancher… $220.00 / Add to Ca…"**. Then **"Crafted For The Modern West."** —
*"Uncompromising materials met with architectural precision. Our operational ethos demands
nothing less than perfection **from loom to ledger**."* — **"↓ Continue Journey"**. Card:
**a long warehouse aisle with a walking figure** — *"Phase II / Distribution"* with **→**.
> ### The single most important frame in V3.1
> **This is the Impossible Warehouse, and it works.** Textile (denim rolls) → product →
> **distribution** aisle, captioned as chapters, with **"from loom to ledger"** naming the
> vertical integration. **It does in flat 2D what `frame_5` failed to do in abstraction.**
> ### Commerce is embedded *inside* the narrative
> **"Add to Cart"** sits within the supply-chain story — the "editorial becomes commerce"
> thesis, achieved, with no 3D whatsoever.
**Defects:** second product card **clipped** (swipe-only rail); prices $185/$220 fictional;
*Custom* tag.
`OBSERVED`. **PREMIUM, RESOLVED.** → **PRESERVE CLOSELY**

---

## V1 historical — for traceability only

### D10 · `archive/v1-exploration/…/desktop_direction_a_monochrome_editorial`
`87d1a2db` · 660×1600
**Visible:** Header **L&B Frontier House** + **Cinema | Balanced | Instant** + nav
**Women · Men · Custom · Wholesale**. A layered page-within-page composition. Hero: a
**black-and-white macro of a thumb fastening a pearl snap**. **"NOT THE WEST YOU
REMEMBER."** + **"SCROLL TO DISCOVER ↓"**. Editorial grid, all monochrome: denim weave
macro · **the Dallas skyline (Reunion Tower, Margaret Hunt Hill Bridge)** · a workshop
bench · **an ornate circular concho** · **a woman mid-stride in a sharp black suit and
heels**. Footer: *"Crafting the modern western narrative. Precision, utility, and timeless
design **from the heart of Texas**."*
> **Origins confirmed:** the mode selector, the *"NOT THE WEST YOU REMEMBER"* line,
> macro-material photography, *"Crafted for the Modern West"*, **and menswear in the nav**.
> **The circular concho is where the coin geometry begins.**
> **Lost and worth noting:** the **Dallas skyline is the only verified real geography in
> the entire corpus**, and monochrome discipline meant zero palette conflict.
> **"from the heart of Texas"** states Texas identity **without** a manufacturing claim —
> careful, and correct.
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

### D11 · `archive/v1-exploration/…/desktop_direction_b_warm_modern_luxury`
`1be01a3f` · 862×1600
**Visible:** Same nav; mode pill reads **Cinema | Balanced | *Grid*** — the third mode's
original name. Hero: a **warm macro of hand-stitched tooled leather**. **"NOT THE WEST YOU
REMEMBER."** + *"Crafted for the modern frontier. **Precision tailoring meets rugged
authenticity** in our new collection."* + **EXPLORE THE COLLECTION**. Section
**"Tobacco & Indigo"** — *"The essential textures of the modern west."* Two product cards:
**The Frontier Boot $495 / Tobacco Leather** and **Raw Selvedge Jacket $285 / Indigo
Denim**.
> **This is where the warm palette lives** — *Tobacco & Indigo* is literally a section
> heading. V3 Frame 6's subhead *"Precision tailoring meets raw materiality"* is a direct
> descendant.
> **Origins confirmed:** boots, and the inflated price band (**$495**, **$285**).
> **Lost and worth recovering:** **material-led collection naming** (*Tobacco & Indigo*),
> the clean **product card with a material descriptor**, and **"Grid"** — arguably a
> clearer name than *Instant Shop*.
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

---

# Part A5 — Batch 5 (2026-08-01) · 11 frames · all `FULL_FIDELITY_INSPECTED`

Historical traceability only. **No V1 or V2 treatment is promoted to production authority.**

---

## V1 remaining (4)

### E1 · `archive/v1-exploration/…/desktop_direction_c_experimental_future`
`51db1ba4` · 784×1600
**Visible:** Nav *Women · Men · Custom · Wholesale*, **no mode selector**. Dark hero with
*"NOT THE WEST YOU REMEMBER."* + *"A cinematic exploration of frontier utility and modern
editorial precision."* + **EXPLORE NOW**. Below on cream: a woman in black tailoring, and a
**purple/lavender dusk mountain-dune landscape** carrying rotated text **"CHOOSE YOUR
WEST"** and a **"Location Data" HUD** — *Coords: 34.0522° 4.0522° N, 118.2437° W · Temp
+12°C · CLEAR*. **Deep maroon footer.**
> **Origins introduced:** **"CHOOSE YOUR WEST" — the ancestor of "One West, Four Worlds."**
> **Spectral/prismatic lighting** (the lavender dusk palette). A **data-HUD overlay**, which
> V3.1 later becomes *"APERTURE LOCKED"*.
> **Defects:** the coordinates are **Los Angeles, not Texas**, and the string is malformed;
> **a macOS dock is baked into the artwork** — a generated-image artifact.
> **Not the origin of:** coin geometry, neon thread, sci-fi warehouse, WebGL or shader
> assumptions — **none appear here.** Direction C is static cards, not a technology demo.
`OBSERVED`. **Valuable principle:** none beyond "Choose Your West". **Production risk:**
spectral palette. **Rejected treatment:** the HUD, the maroon, the false geography.
→ **CONCEPTUAL REFERENCE ONLY**

### E2 · `archive/v1-exploration/…/mobile_direction_a_monochrome_editorial`
`b166d4b7` · 271×1600
**Visible:** **L&B** + **"Skip to Shop"** pill. Monochrome hero — a woman in a black western
suit and wide-brim hat. *"NOT THE WEST YOU REMEMBER."* Mode tabs **Cinema | Balanced |
Instant**. **Three full-width category bands: "FOR HER" · "FOR HIM" (a torso with a large
ornate buckle) · "CUSTOM"**. *Latest Arrivals*: **Frontier Jacket $850** · **Rancher Boots
$420**. Tab bar **Home · Discover · Custom · Passport · Bag**.
> ### The single most consequential historical frame
> **"FOR HER | FOR HIM | CUSTOM" originates here** — V3 Frame 5's gateway is a direct
> descendant, adding *Wholesale*.
> **"Skip to Shop" originates here** — the escape hatch exists from generation one.
> **$850 originates here** — the exact fixture recurs in V3 Frame 6's boot, `8g_8`'s
> saddlebag and `12j`'s jacket. **One V1 number propagated across four generations.**
> **Boots originate here** (*Rancher Boots $420*).
**Defect:** **iOS status bar, a "Photo" title bar and a 5-icon iOS toolbar are baked into
the artwork.**
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

### E3 · `archive/v1-exploration/…/mobile_direction_b_warm_modern_luxury`
`19911692` · 351×1600
**Visible:** Warm golden-hour hero — a woman in denim jacket and tan felt hat.
**"The Golden Hour Collection"**. **A two-mode toggle: "Curated | Instant Shop."**
*"Enter the Frontier"* → **Women** (a tooled saddle) · **Men** (folded denim).
*Featured Goods*: **The Rustler Boot $450** · **Canyon Brim $220**.
> **"Instant Shop" as a term originates here**, in a **two-mode** system — Cinema/Balanced
> came from Directions A and C. **"Enter the Frontier" originates here.**
> The warm tan/tobacco palette is strongest here.
> **Odd:** the *Women* card is illustrated with **a saddle** — equestrian tack, not apparel.
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

### E4 · `archive/v1-exploration/…/mobile_direction_c_experimental_future`
`f94796e3` · 319×1600
**Visible:** Cream ground. **L&B Frontier** pill. Hero: a **grey-blue cowboy boot with cream
and turquoise stitching**. *"The Heritage Collection"* → **"Crafted for the Modern West."**
Mode pill **Cinema | Balanced | Instant**. **"Curated Journeys"**: **"Men's Editorial —
Explore the rugged frontier"** *(listed first)* and **"Women's Collection — Refined utility
and grace"** (a felt hat with **turquoise jewellery**). Tab bar **Home · Discover · Custom ·
Passport · Bag**.
> ### The V3.1 mobile tab bar originates here
> **Home · Discover · Custom · Passport · Bag** — identical to V3.1's, **skipping V2 and V3
> entirely**. **"Passport" and "Custom" as tabs both originate here.**
> **Turquoise originates here** (boot stitching, jewellery) — later specified for the buckle.
> **"The Heritage Collection" originates here** — the heritage framing that later hardens
> into the fabricated dates.
> **Menswear is listed *first*.**
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

---

## V2 (7 of 8)

### E5 · `archive/v2-synthesis/…/v2_frame_1_cinematic_opening_state_one`
`88430603` · 1600×1280
**Visible:** Full-bleed dark portrait — **a woman in a dark denim/wool trench with a heavy
belt buckle**, direct gaze. Mode pill **● Cinema | Balanced | Instant**. **"NOT THE WEST YOU
REMEMBER."** in high-contrast white. **Two equal CTAs side by side: "⊘ ENTER THE FRONTIER"
(white) and "SKIP TO SHOP" (dark).** *"SCROLL TO EXPLORE"*.
> ### V2 Frame 1 is better than V3 Frame 1
> **The headline is legible** — white on a dark portrait, where V3's is near-invisible dark
> grey on black. **Skip to Shop is a full peer button**, where V3 demotes it to small grey
> text. **The escape hatch has parity with the cinematic path.**
> **The hero is a woman**, contemporary and fashion-forward, western only via the buckle —
> the best expression of *"western without predictable"* in the corpus.
> No invented heritage, no sourcing claims, no prices. Clean.
**V3 inherited** the composition and the line; **V3 lost** CTA parity and headline legibility.
`OBSERVED`. **PREMIUM.** → **PRESERVE INTENT, REBUILD EXECUTION**

### E6 · `archive/v2-synthesis/…/v2_frame_2_living_contact_sheet_transition`
`03b2652f` · 1600×1491
**Visible:** Header *"FRAME 2: LIVING CONTACT SHEET — Visual storyboard of cinematic
transition"* with **1440px BASE** and **CINEMATIC MODE** chips. A **nine-cell editorial
grid**, each cell carrying a **motion annotation**: *ENTER: LEFT · ASSEMBLE: DOWN ·
**EXPAND: BECOME FILM** (a large centre cell of hands stitching tooled leather, with a
▶ play button) · ENTER: RIGHT (an ornate silver buckle) · RECEDE: UP · ASSEMBLE: RIGHT (an
**embroidered floral denim jacket**, captioned *Embroidered Denim Study – No. 4*) ·
**ENTER: DIAGONAL** (a **factory interior with rows of racks**) · ASSEMBLE: LEFT ·
**ANCHOR: BASE***.
> ### The clearest articulation of the contact sheet anywhere in the corpus
> Every cell specifies **how it moves**. **"EXPAND: BECOME FILM" with a play button is
> "Image Becomes Film", legibly designed** — V3 Frame 3 lost this entirely.
> **The "ENTER: DIAGONAL" factory cell reads as a real apparel facility** — better warehouse
> evidence than anything in V3.1.
> **It is a CSS Grid. Nine cells, varying spans. No 3D is justified at any point.**
> **Continuity is stronger than V3.1's camera passage** because the transitions are
> annotated rather than implied.
**Classification:** concept board, not a route. No prices, no product names, no commerce.
`OBSERVED`. → **PRESERVE CLOSELY** (as motion specification)

### E7 · `archive/v2-synthesis/…/v2_frame_3_definitive_desktop_homepage`
`28f1e5cb` · 594×1600
**Visible:** Hero — **a man on a mountain ridge at sunrise** — **"The Synthesis"** +
**EXPLORE COLLECTION**. Category cards **Women** (a woman in leather) and **Men** (a denim
cuff). Two service cards: **"Bespoke Custom"** (*Begin Process →*) and **"Trade &
Wholesale"** — *"Partner with us to outfit your crew…"* (*Partner Inquiries →*). Then
**"ANATOMY OF CRAFT / The Selvedge Standard"** — *"We utilize **vintage shuttle looms**…"* —
with **Silver Pearl Snaps** (*oxidized finish*) and **14oz Heavyweight Canvas**
(*"**Sourced ethically, milled for resilience**"*). Footer with an email capture:
*"Join the manifest…"*.
> **"Trade & Wholesale" is a peer card on the homepage** — better wholesale prominence than
> V3's homepage, which has none.
> **"ANATOMY OF CRAFT" originates here** as a homepage section — V3 Frame 8's Product
> Anatomy descends from it.
> ### Invented sourcing originates here
> *"vintage shuttle looms"* and *"Sourced ethically, milled for resilience"* **predate**
> Kuroki Mill and Leon & Tuscany. **The pattern begins in V2.**
**Also:** hero is a man; the *Men* card shows no person; subtitle contrast is poor.
`OBSERVED`. → **PRESERVE INTENT, REBUILD EXECUTION**

### E8 · `archive/v2-synthesis/…/v2_frame_4_campaign_and_scroll_story`
`907ce514` · 345×1600

> **Ledger correction.** An earlier draft of this entry described this frame without it
> having been opened, and asserted that Midnight Rodeo originates in V3. **Both were wrong.**
> The frame was then inspected at full fidelity and this entry rewritten from observation.

**Visible:** Near-black throughout. **L&B** top-left, **✕ close** top-right — an **overlay**.
Hero: **"MIDNIGHT RODEO"** in large display serif over dark garment texture, with a scroll
cue and ↓. Section **"The Architecture of Dust"** — *"**Hand-tooled in the Frontier House
workshop.** The Frontier Boot features a structurally reinforced heel and **Goodyear welt
construction**, designed not just to withstand the elements, but to age alongside them."* —
bullets **Oak-tanned leather sole · Stacked leather heel · Oxidized silver hardware**, beside
a floating **tan cowboy boot with harness strap**. Then **"Frontier Garments" (CHAPTER 02)**
— a large image of **a woman in a black leather jacket crossing a wet neon city street**,
captioned **"Midwest Rider"**, plus a denim rivet macro and a hand holding a belt buckle.
Then **"The Collection"**: **The Frontier Coat $480** (tagged *EDITION*) · **Selvedge Rider
$295** · **Midnight Brim $220** · **"Explore Full Campaign →"**.

> ### MIDNIGHT RODEO ORIGINATES IN V2 — and V2's version is far stronger
> V2 F4 has a **title**, a **craft story with real construction specs**, a **named chapter**,
> **three linked products with names and prices**, and a **campaign CTA**.
> **V3 Frame 7 has none of these** — it is ~75% empty black with two inset cards and no
> products, prices, CTAs or campaign navigation. **V3 materially weakened the campaign.**
> ### V3 also swapped the protagonist
> V2's *"Midwest Rider"* on the neon street is **a woman**. **V3 Frame 7 replaced her with
> a man.**
**Invented claims originate here too:** *"Hand-tooled in the Frontier House workshop"* — an
unverified manufacturing claim — and **Goodyear welt / oak-tanned sole** bootmaking specs
for a category L&B does not make.
**Contrast:** the *Architecture of Dust* body copy and the *"BEHIND / SOME PIECE OF THE
FRONTIER"* line are very low-contrast grey on black — **VISUAL RISK**.
`OBSERVED`. → **PRESERVE INTENT, REBUILD EXECUTION** (campaign structure) +
**REVISE FOR BUSINESS ACCURACY**

### E9 · `archive/v2-synthesis/…/v2_frame_5_pdp_and_customization_studio`
`ad433d1b` · 1208×1600
**Visible:** **"The Midnight Pearl Snap" — $285.00 USD**. **Monogram Placement: Cuff
(selected) | Collar | Pocket** with a **?** help icon. **Monogram Characters (Max 3)** — a
text input reading **"J.D."**. **Thread Tone** — cream / black / gold swatches.
ℹ **"Custom embroidery requires an artisan review. Lead times are currently 3-4 weeks.
Production Review Required."** **"Add to Atelier Bag +"**. Below: a pearl-snap macro and a
**video tile with a ▶ play button labelled "View Anatomy"**.
> **Customization lives *inside* the PDP** — simpler and arguably better than V3's separate
> three-step Atelier route.
> **It is entirely 2D.** **"View Anatomy" is a video, not 3D** — Product Anatomy's origin is
> film, not WebGL.
> **Explicit lead time and a human-review gate** — more operationally honest than V3 Frame 9.
> **"Add to Atelier Bag"** correctly separates custom fulfilment from standard cart.
> **The invented customer "J.D." originates here**, reappearing in V3 Frame 10's monogram.
> **$285 and the product name pass verbatim into V3 Frame 8.**
**Gap:** **no size selector at all.** DTC assumed.
`OBSERVED`. → **PRESERVE CLOSELY** (mechanics)

### E10 · `archive/v2-synthesis/…/v2_frame_6_wholesale_and_owner_intelligence`
`cf03939d` · 1211×1600
**Visible:** **"Intelligence Dashboard"** — *"Premium oversight for B2B accounts and
internal operations."* **Trend Signals & Alerts:** ⚠ **"Heavy Denim Sourcing Delay —
Impacts Fall '24 Collection • 3 Weeks"** (*Review*) and 📷 **"Photography Gap: Outerwear —
Missing detail shots for 4 SKUs"** (*Assign*). **"Fit Review Pending — 3 new custom
silhouettes require approval"** (*Review Specs*). **"Wholesale Catalog — Approved Retailer
View"** with tabs **Virtual Rack | Pack Breakdowns**. Three products, each with an **MOQ
badge** and **both prices**:

| Product | MOQ | Wholesale | MSRP |
| :--- | :--- | :--- | :--- |
| Frontier Work Jacket | **12** | **$185 WHSL** | **$395** |
| Rancher Boot | **24** | **$210 WHSL** | **$450** |
| Heritage Flannel | **6** | **$85 WHSL** | **$180** |

> ### V2 Frame 6 is stronger than V3 Frame 11 in two specific ways
> **1. MSRP is shown alongside wholesale price.** V3 Frame 11 has **no MSRP at all** — and
> margin maths is the buyer's core decision. **This is a genuine V2→V3 regression.**
> The ratios (≈2.1×) are a correct keystone markup.
> **2. The owner intelligence is operational, not decorative** — a sourcing delay with
> quantified impact, a **photography gap with a SKU count and an *Assign* action**, and a
> fit-review queue. V3 Frame 11's campaign-percentage and voice-notes layer is softer.
> **"Approved Retailer View"** is also a clearer authorisation label than V3's *"Wholesale
> View"*.
> **MOQ: 6** on the flannel matches L&B's verified prepack of six.
**Still absent:** authentication state; prices appear on an apparently public page.
**Boots** and menswear-leaning product throughout.
`OBSERVED`. → **PRESERVE CLOSELY** (MSRP + alert mechanics)

### E11 · `archive/v2-synthesis/…/v2_frame_7_native_mobile_homepage`
`a42ad956` · 366×1600
**Visible:** **L&B** + search + **a camera icon**. Hero: a woman in a denim jacket in a
bright architectural space. **"The Frontier"** + *"Cinematic Luxury. Artisanal Quality."* +
**Explore Collection**. **"Current Drops"** rail: **Heritage Boots $450** tagged **CUSTOM**,
and a clipped *"Indigo… $320"*. Category cards **Women** and **Men** (a man in a **business
suit**). Tab bar **Home · Discover · Custom · Passport · Bag**.
> **"Current Drops" originates here** — and it matches L&B's **verified daily drop
> cadence**. A genuine, evidence-aligned concept.
> **A camera icon (visual search) appears here and nowhere else in any generation** — a
> lost idea worth noting.
**Defects:** a **search-bar UI artifact is baked into the *Men* card image**; product name
clipped; the *Men* card shows a **business suit**, not western.
`OBSERVED`. → **CONCEPTUAL REFERENCE ONLY**

---

# Cross-generation origin map

| Concept | First observed | Evolution | Current authority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Skip / direct-shop exit** | **V1 Mobile A** | V2 F1 gives it CTA parity → V3 demotes it to grey text → V3.1 restores it as a pill | V3.1 | **Approved — restore V2's parity** |
| **Contact sheet** | **V1** (implied) | **V2 F2 annotates every cell's motion** → V3 F2 renders a Passport instead → V3.1 `8g_8`/`12g` | V2 F2 for motion; V3.1 for commerce | **Approved** |
| **Image becomes film** | **V2 F2** (*EXPAND: BECOME FILM*, with play button) | V3 F3 loses the film entirely | V2 F2 | **Approved — V3 regression** |
| Shoppable campaign | V2 F4 | V3 F4 adds hotspots + scrubber | V3 F4 | Approved |
| **One West / Four Worlds** | **V1 Desktop C** (*"CHOOSE YOUR WEST"*) + **V1 Mobile A** (*FOR HER/FOR HIM/CUSTOM*) | V3 F5 adds *Wholesale* | V3 F5 | **BLOCKED — D-03/D-04** |
| **Midnight Rodeo** | **V2 F4** — title, craft story, chapter, 3 priced products, campaign CTA | **V3 F7 strips it to ~75% empty black** and swaps the woman protagonist for a man | **V2 F4** | **Approved as structure — V3 is a regression** |
| **Product Anatomy** | **V2 F3** (*ANATOMY OF CRAFT*) + **V2 F5** (*View Anatomy*, a **video**) | V3 F8 makes it a wireframe over a photo | V3 F8 | **Approved — 2D, not 3D** |
| **Custom Atelier** | **V1 Mobile A/C** (*CUSTOM* tab) → **V2 F5** (in-PDP, 2D) | V3 F9 becomes a separate 3-step route | V3 F9 | **OWNER DECISION — D-18** |
| Living Cart | V2 F5 (*Atelier Bag*) | V3 F10 | V3 F10 | **OWNER DECISION — D-17** |
| **Frontier Passport** | **V1 Mobile A/C** (*Passport* tab) | V2 F8 → V3 F10 consumer archive | V3 F10 | **OWNER DECISION — D-17** |
| **Wholesale showroom** | **V2 F6** (*Approved Retailer View*, **with MSRP**) | V3 F11 drops MSRP | V2 F6 + V3 F11 | **Approved — recover MSRP** |
| **Owner operating world** | **V2 F6** (operational alerts) | V3 F11 softer | V2 F6 | **Approved — recover alerts** |
| **Mobile tab bar** | **V1 Mobile A/C** (Home·Discover·Custom·Passport·Bag) | Skips V2/V3 → reappears verbatim in V3.1 | V3.1 | **Approved** |
| **Experience modes** | **V1 A/C** (Cinema/Balanced/Instant); **V1 B** (Curated/**Instant Shop**) | V2 F1 pill → V3 nav → V3.1 pill | V3.1 | **Approved — composition unstable (C-35)** |
| Plus treatment | **V3.1 only** | Absent from V1 and V2 entirely | V3.1 `8f`/`12f_2` | **OWNER DECISION — D-04** |
| **Menswear** | **V1 — all six frames** (*Men* in every nav) | Every generation | V3 F5, V3.1 `8g_1` | **REJECT — D-03** |
| **Boots** | **V1 Mobile A** (*Rancher Boots $420*) | V1 B, V1 C, V2 F6/F7, V3 F6, `12j`, `8g_8` | — | **REJECT unless verified** |
| **Circular concho / coin** | **V1 Desktop A** (an ornate circular concho) | V3.1 `8d`/`8e`/`8f`/`8g_1`/`12c` + the Three.js code | — | **REJECT — model from `8b`/`8c`** |
| **Spectral lighting** | **V1 Desktop C** (lavender dusk) | V3.1 Electric Cobalt | V3.1 | **OWNER DECISION — D-07** |
| **Thread motif** | **V2 F2** (thread spool cell) | V3.1 `frame_3`/`12b` as **neon** | V3.1 | **Approved — but not neon (D-07)** |
| **Warehouse motif** | **V2 F2** (*ENTER: DIAGONAL*, a real factory) | V3.1 `8g_2`/`8g_4` sci-fi → **`12e` recovers it** | V3.1 `12e` | **Approved — `12e` is the model** |
| **Dallas / Texas geography** | **V1 Desktop A** (the Dallas skyline) | Lost after V1 | — | **Recover — the only verified geography** |
| **Material-led naming** | **V1 Desktop B** (*Tobacco & Indigo*) | V2 F3 (*The Selvedge Standard*) → lost | — | **Recover** |
| **"Grid" vs "Instant Shop"** | **V1 B** (*Instant Shop*); **V1 Desktop B** (*Grid*) | *Instant* wins by V2 | V3.1 | Approved |
| **Invented sourcing** | **V2 F3** (*vintage shuttle looms*, *sourced ethically*) | V3 F8 Kuroki Mill; V3 F11 Leon & Tuscany | — | **REJECT — C-18** |
| **Invented person "J.D."** | **V2 F5** (monogram input) | V3 F10 monogram | — | **REJECT — C-20** |
| **$850 fixture** | **V1 Mobile A** (*Frontier Jacket $850*) | V3 F6 boot · `8g_8` saddlebag · `12j` jacket | — | **REJECT — D-05** |

---

# Part A6 — Closure (2026-08-01) · 1 frame · `FULL_FIDELITY_INSPECTED`

### F1 · `archive/v2-synthesis/…/v2_frame_8_mobile_product_and_passport`
`73d9bb49` · 230×1600 · 275,978 B · **FULL_FIDELITY_INSPECTED**

**Visible — three stacked mobile panels (a design board showing three states, not one
screen):**

**Panel 1 — Product.** Image of dark denim/tweed with gold stitching; **← back** and
**♡ save** as circular controls; **3 carousel dots** (2nd active). **"The Frontier Jacket"
— $345.00**. *"Heavyweight 14oz raw selvedge denim. Crafted for durability and detailed
with oxidized silver hardware. A modern classic built for the rugged individual."*
A **"Size"** label and **"Size Guide"** link sit at the card's lower edge and are
**clipped — the size selector itself is not visible**. **"Add to Bag 🛍"** full-width.

**Panel 2 — Custom Studio.** **✕ close**; title *"Custom Studio"*; a **tan leather tote**
with a circular **"Monogram"** placement marker; **"Hardware"** — three circular swatches
(cream, pale silver-blue, mauve); a **"Monogram"** label; **"Review Design — $550.00"**.

**Panel 3 — Passport.** **"Passport"** · **"Member since 2022"** · tabs
**Wardrobe (active) | Orders | Saved**. Grid: **Nomad Satchel** — *Delivered Oct 12*, tagged
**Custom** · **Frontier Jacket** — *Delivered Sep 05* · **Bespoke Boots** — *Est. Delivery
Nov 20*, with an **"In Production"** badge on a grey placeholder. Tab bar:
**Home · Discover · Custom · Bag** — **four items; no Passport tab.**

---

### A. Product mechanics — every one is DTC

| Mechanic | Present | Class |
| :--- | :--- | :--- |
| Imagery + carousel · name · description · price | ✔ | **DTC** |
| **$345.00 single consumer price** | ✔ | **DTC** |
| Save (♡) · back navigation · Add to Bag | ✔ | **DTC** |
| **Size selector** | **Clipped — label visible, control not** | CANNOT DETERMINE |
| Size Guide link | Clipped | DTC |
| Colour/variant · quantity · SKU · availability | ✘ | — |
| **Wholesale price · MSRP · MOQ · pack · prepack · Add to Order · reorder** | **✘ — none** | — |
| Search · tabs · error/loading/unavailable states | ✘ | — |

> **No wholesale mechanic of any kind appears.** The frame is unambiguously **DTC**.

### B. Passport origin — decisive for **D-17**

> ### The invented loyalty layer does **not** exist in V2. It was introduced in V3.
>
> `OBSERVED` — V2's Passport contains **no points, no store credit, no rewards, no tier**.
> It is **"Member since 2022"** plus three tabs: **Wardrobe** (a delivered-purchase
> archive), **Orders** (status, including **"In Production"** and an estimated delivery
> date), and **Saved**.
>
> V3 Frame 10 added **"FRONTIER TRUST ◆ 4,250"**, **"AVAILABLE CREDIT $150.00"**, fit
> feedback and an alterations record. **None of it is inherited — all of it is a V3
> invention.**

**Original classification:** a **consumer purchase archive and order tracker** — consumer-
facing, but not a loyalty account. **No buyer, retailer, terms, approval, tax-ID, rep,
assortment or line-sheet element appears anywhere.**

### C. Buyer-first transferability

| | Items |
| :--- | :--- |
| **VISUALLY PRESENT** | Order status · **"In Production"** state · estimated delivery date · delivered-with-date archive · **Saved** list · save-to-list (♡) |
| **STRATEGICALLY TRANSFERABLE** | Wardrobe → reorder surface · Orders → open-order tracking · Saved → saved assortments |
| **FUTURE REQUIREMENT** | Approval status · tax-ID state · pack and size-run preferences · sell-through feedback · rep relationship · showroom appointment · waitlist · restock · daily-drop watchlist |
| **NOT SUPPORTED BY THE FRAME** | Every wholesale term, line sheet, business-account field and buyer credit mechanic |

### D. Mobile quality and comparison

`OBSERVED` — Genuinely mobile-native: card-based, thumb-reachable primaries, circular
back/save controls, carousel dots, generous targets.
**Defects:** the **Size row is clipped**; the **tab bar has four items and omits Passport**,
against V1's and V3.1's five; no safe-area treatment; the three-panel stack is a **board
convention**, not a shippable screen.

| Generation | Relationship |
| :--- | :--- |
| V1 Mobile A/C | Originated the **Passport tab** and the 5-item bar; **V2 F8 drops the Passport tab** while showing the Passport surface |
| V2 F5 | Custom Studio moves from desktop PDP to a mobile panel here |
| V2 F7 | Same tab-bar family, same *Custom* tag pattern |
| **V3 F10** | **Adds loyalty, fit feedback, alterations, explicit reorder buttons** |
| V3 F12 | Regresses to four **unlabelled** icons and no cart |
| **V3.1 `12h`** | **Recovers the visible size selector (S·M·L·XL with a selected state) that V2 F8 clipped** — and carries the **same $345 price and product lineage** |
| V3.1 `12j` | Extends the archive idea into a full reduced-motion catalogue |

### E. Integrity checks

| Check | Result |
| :--- | :--- |
| Boots / footwear | **CONFIRMED** — *Bespoke Boots* |
| Unsupported customization | **CONFIRMED** — Custom Studio, *Review Design $550.00* |
| Invented prices | **CONFIRMED** — $345.00, $550.00 |
| Invented product names | **CONFIRMED** — Nomad Satchel, Frontier Jacket, Bespoke Boots |
| Clipped content | **CONFIRMED** — the Size / Size Guide row |
| Missing authorization boundary | **CONFIRMED** — no auth state anywhere |
| Unsupported DTC checkout | **CONFIRMED** — *Add to Bag* |
| Unsupported loyalty | **NOT PRESENT** — the key finding |
| Public wholesale pricing | **NOT PRESENT** — pricing is consumer |
| Fabricated founding date | **NOT PRESENT** — *"Member since 2022"* is a fictional user's date, not a brand-heritage claim |
| Invented sourcing / designers | **NOT PRESENT** |
| Plus segregation | **NOT PRESENT** — no sizes rendered |
| Sizes below verified range | **CANNOT DETERMINE** — selector clipped |
| Unverified menswear | **CANNOT DETERMINE** — products are unisex-leaning; no gender label |
| Home-category assumption | **NOT PRESENT** |
| Filename/content disagreement | **NOT PRESENT** — the frame is what it says |

`OBSERVED`. **RESOLVED as a board.** → **PRESERVE INTENT, REBUILD EXECUTION** (Passport
tab structure) + **REVISE FOR BUSINESS ACCURACY**

---

## Part B — `CONTACT_SHEET_ONLY` (0 remaining)

Batch 2 cleared 11 entries from this list. The table below retains the original numbering;
struck entries are now `FULL_FIDELITY_INSPECTED` in Part A2:
~~#20, #30, #35, #36, #37, #38, #41, #42, #43, #44~~ — and `12f_3` / `12f_4`.

**Remaining 33** — V1 ×6 · V2 ×8 · V3 ×5 (frames 3, 7, 9, 10, 12) ·
V3.1 ×14 (frames 3, 5, 8b, 8c, 8d, 8g_1, 8g_2, 8g_4, 8g_8, 12b, 12c, 12d, 12e, 12g, 12h).

**Next batch priority (Priority 3 — Frontier Engine and camera continuity):**
`8g_1` · `8g_2` · `8g_4` · `8g_8` · `8b` · `8c` · `8d` · V3.1 `frame_3` · V3.1 `frame_5` ·
`12g` · `12h`.

---

## Part B (original) — full inventory as at batch 1

Every entry below is confirmed present, readable and unique by hash. **No conclusion in
this audit corpus depends on any of them.** They are the remaining work.

| # | Gen | Frame | Hash | W×H | Bytes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | V1 | desktop_direction_a_monochrome_editorial | `87d1a2db` | 660×1600 | 757,370 |
| 2 | V1 | desktop_direction_b_warm_modern_luxury | `1be01a3f` | 862×1600 | 1,030,916 |
| 3 | V1 | desktop_direction_c_experimental_future | `51db1ba4` | 784×1600 | 260,740 |
| 4 | V1 | mobile_direction_a_monochrome_editorial | `b166d4b7` | 271×1600 | 331,549 |
| 5 | V1 | mobile_direction_b_warm_modern_luxury | `19911692` | 351×1600 | 515,635 |
| 6 | V1 | mobile_direction_c_experimental_future | `f94796e3` | 319×1600 | 354,845 |
| 7 | V2 | v2_frame_1_cinematic_opening_state_one | `88430603` | 1600×1280 | 1,566,371 |
| 8 | V2 | v2_frame_2_living_contact_sheet_transition | `03b2652f` | 1600×1491 | 2,370,205 |
| 9 | V2 | v2_frame_3_definitive_desktop_homepage | `28f1e5cb` | 594×1600 | 750,109 |
| 10 | V2 | v2_frame_4_campaign_and_scroll_story | `907ce514` | 345×1600 | 256,181 |
| 11 | V2 | v2_frame_5_pdp_and_customization_studio | `ad433d1b` | 1208×1600 | 1,258,492 |
| 12 | V2 | v2_frame_6_wholesale_and_owner_intelligence | `cf03939d` | 1211×1600 | 1,615,204 |
| 13 | V2 | v2_frame_7_native_mobile_homepage | `a42ad956` | 366×1600 | 498,627 |
| 14 | V2 | v2_frame_8_mobile_product_and_passport | `73d9bb49` | 230×1600 | 275,978 |
| 15 | V3 | v3_frame_3_image_becomes_film | `85f8271c` | 1191×1600 | 1,295,242 |
| 16 | V3 | v3_frame_7_midnight_rodeo_campaign_journey | `3c13a552` | 500×1600 | 289,354 |
| 17 | V3 | v3_frame_9_built_by_you_custom_atelier | `d77755ef` | 1600×1290 | 542,127 |
| 18 | V3 | v3_frame_10_living_cart_and_frontier_passport | `31d780e1` | 1079×1600 | 528,055 |
| 19 | V3 | v3_frame_12_native_mobile_cinematic_commerce | `3c810c0f` | 706×1600 | 896,265 |
| 20 | V3 | v3_connected_flagship_prototype | `1d150164` | 1600×1280 | **38,186** — near-empty |
| 21 | V3.1 | v3.1_frame_3_cinematic_ignition | `a326cc80` | 1600×1280 | 1,157,355 |
| 22 | V3.1 | v3.1_frame_5_impossible_frontier_engine_reveal | `14c579a1` | 1600×1280 | 1,357,985 |
| 23 | V3.1 | v3.1_frame_8b_dormant_artifact | `364521bb` | 1600×1280 | 834,298 |
| 24 | V3.1 | v3.1_frame_8c_material_lighting_reveal | `b594305c` | 1600×1280 | 1,830,469 |
| 25 | V3.1 | v3.1_frame_8d_operational_awakening | `80e47485` | 1600×1280 | 1,144,795 |
| 26 | V3.1 | v3.1_frame_8g_1_category_selection_and_aperture_lock | `c1896764` | 1600×1280 | 1,321,289 |
| 27 | V3.1 | v3.1_frame_8g_2_camera_entering_the_separated_material_rings | `0190c723` | 1600×1280 | **182,380** |
| 28 | V3.1 | v3.1_frame_8g_4_engraved_routing_geometry_becoming_warehouse | `5a03f007` | 1600×1280 | 1,623,362 |
| 29 | V3.1 | v3.1_frame_8g_8_living_contact_sheet_arrival | `08dc09b9` | 1096×1600 | 1,317,487 |
| 30 | V3.1 | v3.1_frame_12a_poster_first_loading_nav | `ef26bc1b` | 706×1600 | 535,771 |
| 31 | V3.1 | v3.1_frame_12b_mobile_thread_ignition | `608f0236` | 706×1600 | **114,815** |
| 32 | V3.1 | v3.1_frame_12c_frontier_seal_material_reveal | `529a0071` | 706×1600 | 328,880 |
| 33 | V3.1 | v3.1_frame_12d_compressed_ring_opening | `8ca12f01` | 706×1600 | 557,395 |
| 34 | V3.1 | v3.1_frame_12e_vertical_depth_stack | `aed784c1` | 243×1600 | 237,258 |
| 35 | V3.1 | v3.1_frame_12f_1_women_depth_carousel | `39f62600` | 706×1600 | 757,125 |
| 36 | V3.1 | v3.1_frame_12f_2_plus_depth_carousel | `ba63e43a` | 706×1600 | 554,420 |
| 37 | V3.1 | v3.1_frame_12f_3_accessories_home_carousel | `cc2bf44b` | 517×1600 | 528,628 |
| 38 | V3.1 | v3.1_frame_12f_4_wholesale_depth_carousel | `76e3941d` | 520×1600 | 813,181 |
| 39 | V3.1 | v3.1_frame_12g_living_contact_sheet_landing | `3c1d5ece` | 639×1600 | 786,161 |
| 40 | V3.1 | v3.1_frame_12h_mobile_commerce_arrival | `b6b66fa2` | 687×1600 | 350,080 |
| 41 | V3.1 | v3.1_frame_12i_mobile_mode_selector | `c70795dc` | 706×1600 | 788,375 |
| 42 | V3.1 | v3.1_frame_12j_reduced_motion_journey | `83077c2c` | 173×1600 | 239,224 |
| 43 | V3.1 | v3.1_connected_desktop_prototype_hub | `c3f0af26` | 1600×1280 | 1,558,012 |
| 44 | V3.1 | v3.1_connected_mobile_prototype_hub | `37e4b08a` | 706×1600 | 1,139,038 |

**Priority for the next pass**, by decision value: #36 + #35 (Plus vs Women carousel parity)
· #43 + #44 (is the prototype actually connected) · #42 (reduced-motion parity) · #20
(38 KB — likely near-empty, tests the "connected prototype" claim) · #23–25 (buckle
material states) · #1–3 (V1 directions, for the evolution record).
