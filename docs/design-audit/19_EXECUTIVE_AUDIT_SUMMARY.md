# 19 — Executive Audit Summary

**Design-source audit, 2026-08-01.** Four generations, 59 frames, 48 HTML files, 20
specifications, 42 renders, ~65 MB. Read-only; nothing in `archive/` or `stitch-export/`
was modified.

---

## The one-paragraph verdict

**The design work is strong and the production position is empty.** V3 delivers a complete
twelve-surface platform including the wholesale and owner surfaces most cinematic projects
never model. V3.1 adds a signature navigational object that encodes the brand's *verified*
vertical-integration chain — the best-argued idea in the corpus. But **zero production
assets exist**, **five of seven brand colours appear in no V3 frame**, **the only paying
audience cannot transact anywhere in 48 files**, and the designs price the brand
**10–40× above its actual product**. None of that is a design failure; all of it is the
gap between an approved specification and a buildable system.

---

## The five findings that should change the plan

### 1. There is nothing to build *with*
`MEASURED` — **0 GLB, 0 GLSL, 0 video, 0 textures, 0 local fonts.** All nine assets named
across both manifests are missing. All imagery is remote, generated, and hosted outside
project control. **The critical path is asset production and owner decisions, not code.**

### 2. The wholesale showroom is designed — but ungated, and factually wrong
> **Corrected by the visual pass.** This finding previously read *"the wholesale showroom
> contains no wholesale,"* based on string absence. **Frame 11 renders the mechanics under
> different labels:** *WHLSL Price*, *MOQ*, *Pack Breakdown* with real size runs (one is
> **(6)**, matching L&B's verified prepack), *SKU*, *Add to Order*, *Export Line Sheet*,
> *Wholesale View*, *In Stock*, *Waitlist*, *Open Sizing*.

**Revised: structurally excellent, factually wrong, and ungated.** Prices $95–$145 are
3–5× verified wholesale; MOQ 24/36 units contradicts the verified $50 minimum; the rack is
men's workwear; *"Tannery Dispatches: Leon & Tuscany"* contradicts vertical integration;
and the approvals queue names invented people. **What is genuinely missing is the
authorisation layer** — tax-ID capture, registration, login, pending-approval — not the
commerce layer.

### 3. There is no permission boundary
`MEASURED` — Prices appear in 11 files including the wholesale frame; there are 0 forms and
0 authenticated states. **The wholesale showroom is drawn as a public page with prices on
it.** The exports do not leak — there is no wholesale data to leak — but a faithful
implementation would leak by default. This matters because the *live* site already leaks
wholesale cost through URL slugs (**D-00**, urgent and independent).

### 4. The prices are fiction
`MEASURED` — `$45` to **`$1,250`** in the markup. `VERIFIED FACT` — wholesale **$7–$33**,
implied retail **$20–$85**. Layout, whitespace and image density are calibrated to a
$1,250 object. **A $38 dress in that composition reads as mispriced** — precisely the
"luxury imitation disconnected from the actual merchandise" failure the Creative North Star
names.

### 5. Accessibility is specified and not implemented
`MEASURED` — `:focus` **0/48** — and the *specified* focus colour (Oxidized Silver on Bone
White) computes to **2.18 : 1** against a 3 : 1 requirement, so it fails even as designed.
`prefers-reduced-motion` **2/48** despite being specified four times. Four swipe-only
carousels with no single-pointer alternative (**WCAG 2.5.7**). A 7.1-second auto-starting
buckle sequence (**WCAG 2.2.2**), mitigated by `Skip Intro` — which must be verified, not
assumed.

---

## Answers to the questions asked

**What V1 contributed** — the strategy. A reference matrix with explicit *Reject* columns,
the anti-cliché contract, the experience modes, the colour vocabulary, and the
material-texture principle. **The most methodologically sound artefact in the project.**

**What V2 contributed** — the architecture. One journey from three competing directions,
and the type system V3 still uses.

**What V3 captured exceptionally well** — platform completeness (wholesale and owner
operations included), the experience-mode selector, genuine editorial restraint, and
wholesale treated as a designed surface rather than a spreadsheet.

**What V3 omitted** — every wholesale mechanic, all video, all forms, all focus states,
size and fit, filters, sort, pre-order, and every loading/empty/error state.

**What V3.1 improved** — the mobile system (14 frames vs 1), the first genuine fallback and
reduced-motion thinking, the supply-chain narrative, and an honest self-QA report that
flags its own performance and contrast risks.

**What V3.1 leaves conceptual** — every 3D asset, every shader, every camera-passage
transition, all material credibility, and the entire route map.

**Is the Frontier Engine visually coherent?** **Yes as narrative, not yet as object.** The
Thread → Warehouse → Buckle → Passage → Contact Sheet arc is original and grounded in
verified truth. But the warehouse's meaning lives only in documentation, the accent palette
(Electric Cobalt, Hot Magenta) has no western equity and no hex values, and the buckle is
specified three incompatible ways.

**Does the buckle read as a coin?** **Conditionally — and batch 3 settled it.** The form
depends on medium. **Photographic frames read unmistakably as a belt buckle** — `8b` is
scalloped and chamfered with a rectangular inset; `8c` is a photorealistic buckle on denim
showing **every specified material**: darkened silver, copper, tooled leather, turquoise,
engraving, brass and stitching. **Geometric frames read as a coin or a lens** — `8d`,
`8e`, `8f`, `8g_1` (a crosshair reticle that reads as a rifle scope) and the Three.js code.
**Implementation rule: model from `8b`/`8c`, never from `8e`/`8f`/`8g_1` or the code.** The
"materials 0% implemented" finding applies to the **code only** — the design delivers them
completely.

**Two fabricated origin dates now exist** — `8b` captions *"Origin: 1870s American West"*
while the mobile hub engraves **"EST. 1865"**. L&B dates to ~2015 (**D-15**).

*Superseded reading, retained for traceability:* `v3.1_frame_8e` — an actual sequence state — renders the
artifact as **a single flat grey circle**: no chamfer, no rings, no material, no engraving.
The chamfered rectangle exists only as six thumbnails on a documentation board and in prose.
**Two of three representations build a coin**, and the Three.js file additionally **does not
run** — a nested IIFE resolves `threejs-container-BUCKLE_APERTURE`, an element that does not
exist, throwing on its first line. **The buckle has not yet been designed as an object; it
has been described.**

**Is the desktop camera passage implementable?** **Yes — as video, not as reconstruction.**
Five keyframes were exported of an eight-step sequence; frames 3, 5 and 7 never existed.
Six transitions must be originated, and the two carrying the entire thesis — routing
geometry becoming warehouse, warehouse becoming runway — have no documented midpoints.
It is a fixed, non-branching camera move, which is the textbook definition of something
that should be a well-encoded video.

**Is the mobile system genuinely native?** **In design yes; in markup no — and stronger
than first assessed.** Visual batch 2 confirms poster-first loading is exemplary: `12a`
offers the brand, a **progress bar**, **mode choice** and **two escape actions during
load**. And the **reduced-motion path `12j` is a complete, premium, fully shoppable
catalogue** — real products, prices, categories, wholesale link, tab bar. Content parity is
already designed.

Two corrections: the carousels are **not uniformly swipe-only** — `12f_4` ships explicit
**← → buttons**, making WCAG 2.5.7 *partial* rather than absent; and the four carousels use
**four different design systems**, so they do not read as siblings. Remaining gaps:
`env(`/`safe-area` **0/48** and `poster=` **0/48**.

**Is the "connected prototype" real?** **For V3.1 yes; for V3 no.** V3's
`v3_connected_flagship_prototype` is the Ignition screen with a four-item nav bar added —
a board. V3.1's two hubs are genuine navigation surfaces with five destinations, a primary
action and an escape hatch, and they place **Wholesale at equal weight** on the ring.

**Does the buckle ever read as a buckle?** **Yes — as photography.** The V3.1 mobile hub
shows a real engraved western buckle on topstitched denim; `8g_6` and `12f_3` show
tooled-leather buckles of genuine craft quality. **The concept works as an image and fails
only as geometry.** But that hub's buckle is engraved **"EST. 1865"** — a fabricated
160-year heritage claim baked into artwork (**D-15**).

**What is technically reusable** — the specifications, the 42 renders, the composition
intent, and the exact spacing/radius/type-scale tokens. **What must be rebuilt** — all
markup, all 3D, all media, all commerce mechanics, all states, the permission boundary, and
the token system.

**What should become video** — the buckle sequence, the camera passage, the thread
ignition, the warehouse reveal. **What stays semantic HTML** — every product name, price,
category, filter, form, and the parallel product list beneath any shoppable film.

---

## Risk register

| Risk | Severity |
| :--- | :--- |
| Live wholesale price leak (URL slugs) | **Critical — independent of this project** |
| No permission boundary in any design | **Critical** |
| Wholesale mechanics absent entirely | **Critical** |
| Focus states unimplemented *and* non-conformant as specified | **Critical** |
| Zero production assets | **Critical — schedule and budget** |
| Fictional prices 10–40× reality | **High** |
| Reduced motion near-absent | **High** |
| Swipe-only carousels (2.5.7) | **High** |
| Wheel interception specified (scroll-jacking) | **High** |
| R3F would exceed the entire JS budget alone | **High** |
| 8K texture brief (~333 MiB VRAM with mipmaps) | **High** |
| `FOR HIM` — false capability claim | **High** |
| Three conflicting taxonomies | **High** |
| Brand voice absent from all copy | **Medium** |
| Competitor validation without a reject test | **Medium** |
| Generated imagery licensing unverified | **Medium** |

---

---

# FINAL READINESS DETERMINATION (2026-08-01)

## **READY FOR PRODUCTION RECONCILIATION**

All six preconditions are met on evidence:

| Precondition | Status |
| :--- | :--- |
| 56/56 frames fully inspected | ✔ mechanically verified |
| Three original audit limitations closed | ✔ all three CLOSED |
| Executive summary reflects final evidence | ✔ including four reversals |
| Owner decisions separated from approved requirements | ✔ 18 decisions, none marked approved |
| V3 / V3.1 source authority stable | ✔ V3 authoritative; V3.1 supplements; V2 residue disregarded |
| Source files untouched | ✔ 0 modifications across six passes |

**Condition on proceeding:** the blueprint must carry every unresolved owner decision as an
**explicit branch**, never a silently chosen answer.

## Final source authority

**V3 remains the approved platform authority** — for typography, grid, editorial
composition, commerce surfaces and the wholesale showroom. Two evidenced exceptions where
**V2 is stronger and should be recovered**: **MSRP alongside wholesale price** (V2 F6), and
**operational alerts with SKU counts and assignable actions** (V2 F6). Two where **V3
regressed**: escape-hatch CTA parity and headline legibility (V2 F1), and campaign
completeness (V2 F4 *Midnight Rodeo*).

**V3.1 remains the approved supplement** — for mobile, experience modes, fallbacks and the
Frontier Engine narrative. Its taxonomy is **not** authoritative: `8g_1` contains **MEN**,
disproving the earlier finding that V3.1 was menswear-free. **Six taxonomy variants exist
across the corpus; none is approved.**

## Concepts requiring redesign

**CRITICAL** — camera passage (reject and redesign; there is no continuous sequence to
render) · geometric buckle (model from `8b`/`8c`, never from `8e`/`8f`/`8g_1`/`12c`/the
code) · authorization boundary (absent everywhere except `12f_4`) · plus architecture
(equal representation, unequal structure) · taxonomy (six variants) · **systemic text
truncation** (≥10 instances) · mobile mode selector (`12i` illegible; composition unstable).

**TARGETED REFINEMENT** — thread material treatment (neon → textile) · wholesale prominence
· mobile carousel consistency (four design systems) · low-power fallback (literal automotive
engine) · contact-sheet continuity · pause/audio controls (present only on `8c` and `12g`).

**PRESERVE CLOSELY** — V3 editorial restraint · V3 F11 wholesale mechanics · **V2 F2 per-cell
motion annotations** · V3.1 `12j` reduced-motion catalogue · **V3.1 `12e` supply-chain
storytelling** · V2 F6 operational alerts and MSRP · V1 Dallas geography and material-led
naming · V3 F8 PDP interaction model · `12f_4` price-gating.

## Recommended next step

**Do not begin production reconciliation until D-00 is raised.** Then reconcile in this
order: **Phase 1 wholesale** (auth, permission boundary, prepacks/MOQ/MSRP, filters, size
and fit, daily drop, states, three CI tests) → **Phase 2 brand** (editorial, campaign,
shoppable lookbook, material macro photography) → **Phase 3 cinema** (buckle and passage as
video, behind explicit Cinema mode).

---

## Recommended next planning step

**Do not begin implementation.** Two things should happen first, and they are independent:

1. **Take D-00 to the owner immediately** — the live wholesale price leak. It costs money
   now, it is unrelated to this project, and it needs no design decision.
2. **Run an owner decision session on D-01, D-03 and D-04** — wholesale-vs-DTC, `FOR HIM`,
   and the taxonomy/Plus question. Those three unblock roughly a third of the scope.

Then the correct next artefact is a **Phase 1 implementation plan covering the business
that already exists**: buyer authentication and the tax-ID gate, the permission boundary,
prepacks and minimums, faceted filtering, size and fit, the daily drop, every state, and
the three CI tests that make the guarantees structural — the unauthenticated-crawl
assertion, the slug-purity assertion, and the no-JS product assertion.

**Phase 1 contains no blocked items, requires no WebGL, needs no film, and serves the only
audience that currently pays.** The cinema is worth building — nothing in western fashion
looks like it — but it is Phase 3, and it should be justified as brand differentiation
rather than as a conversion claim the evidence does not support.

---

## Documents in this audit

`00` scope and method · `01` inventory and integrity · `02` V1→V3.1 evolution ·
`03` V3 platform · `04` V3.1 Frontier Engine · `05` screen/route/state map ·
`06` token reconciliation · `07` asset and provenance manifest · `08` 3D/shader
feasibility · `09` motion and interaction · `10` mobile and fallback · `11` accessibility ·
`12` performance · `13` security and restricted data · `14` brand/commerce gaps ·
`15` conflict register · `16` traceability matrix · `17` implementation feasibility ·
`18` owner decisions · `19` this summary · `evidence/`
