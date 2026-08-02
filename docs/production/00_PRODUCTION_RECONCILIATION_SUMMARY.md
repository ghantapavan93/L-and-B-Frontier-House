# 00 — Production Reconciliation Summary

**Date:** 2026-08-01 · **Stage:** Blueprint. **No implementation. No dependencies. No app.**
**Inputs:** verified research corpus (`docs/brand-research/`) + completed design audit
(`docs/design-audit/`, 56/56 frames inspected).

---

## 1. The reconciled product vision

> **L&B Frontier House is a wholesale-first digital flagship for Lucky & Blessed: a Texan
> house that shows its clothes with the confidence its factory already has, and lets an
> approved buyer write an order in under a minute.**

Three facts govern everything below, and none is negotiable:

1. **The business sells only to approved retailers.** Wholesale is not a section of the
   platform — it *is* the platform. Consumer commerce is a documented branch, not Phase 1.
2. **The designs are visually excellent and factually wrong.** V3 and V3.1 contain genuinely
   premium editorial work sitting on invented prices ($45–$1,250 against a verified $7–$33
   wholesale band), invented sourcing, invented people and two mutually contradictory
   fabricated founding dates.
3. **Nothing exists to build with.** Zero GLB, zero video, zero textures, zero local fonts.
   All nine manifest assets are missing and all imagery is remote and generated. **The
   critical path is asset production and owner decisions, not code.**

---

## 2. Scope by phase

| Phase | Serves | Contains | Requires |
| :--- | :--- | :--- | :--- |
| **1 — Wholesale platform** | The only audience that pays today | Public discovery · buyer application, tax-ID, approval · **permission-gated pricing** · prepacks, MOQ, MSRP · filters, sort, search · size and fit · order building, line sheets, reorder · every state · owner operational surfaces | **No WebGL, no video, no owner decision** |
| **2 — Brand and editorial** | Boutique buyers + prospective retailers | Living Contact Sheet · campaigns · shoppable editorial · Midnight Rodeo redesign · Product Anatomy (HTML/SVG/photography) · **buyer-first Passport** · supply-chain storytelling | Photography; some owner decisions |
| **3 — Cinema (optional)** | First-time visitors who opt in | Thread ignition · buckle sequence · redesigned camera passage · campaign film · Cinema mode | Assets that do not yet exist; a coherent storyboard |

**Cinema never gates shopping, search, buyer application, wholesale access or account
functions.**

---

## 3. What survives from each generation

**V1 (recovered):** Skip to Shop as a peer action · the **Dallas skyline** — the only
verified geography in the corpus · *"from the heart of Texas"* as a Texas claim that makes
no manufacturing claim · **material-led collection naming** (*Tobacco & Indigo*) · the
five-item mobile navigation principle.

**V2 (recovered):** **MSRP beside authorised wholesale price** · **operational alerts with
SKU counts and assignable actions** · **per-cell motion annotations** on the contact sheet ·
a **complete Midnight Rodeo campaign structure** · **Enter/Skip CTA parity** · headline
legibility · the Passport as an **order and purchase archive with no loyalty layer**.

**V3 (preserved):** editorial restraint · typography, grid, spacing, colour hierarchy ·
the wholesale showroom's mechanics (WHLSL price, MOQ, pack breakdown, SKU, Add to Order,
Export Line Sheet, In Stock/Waitlist) · the Frame 8 PDP interaction model (size **buttons**
with a disabled out-of-stock state, size-guide link, named colour swatches).

**V3.1 (preserved):** poster-first entry · experience modes · the **reduced-motion
catalogue** (`12j`) · fallback states · **`12e`'s flat supply-chain storytelling** ·
`12f_4`'s **price gating** — the only designed authorisation boundary in the corpus.

---

## 4. What is redesigned, and what is rejected

**Redesigned:** the camera passage (no continuous sequence exists to render) · the buckle's
geometry (model from `8b`/`8c` only) · the authorisation boundary (absent everywhere except
`12f_4`) · plus architecture · taxonomy · systemic text truncation · the mobile mode
selector.

**Rejected outright:** menswear · footwear · **EST. 1865** and **"Origin: 1870s American
West"** · Kuroki Mill and Leon & Tuscany sourcing · *Arthur Pendelton*, *E. Vance Holdings*,
*J.R. Cash* · consumer loyalty points and store credit · AR · circular coin geometry · the
literal automotive-engine fallback image · the $45–$1,250 price fixtures · real-time WebGL
for Phases 1 and 2.

---

## 5. The three findings that shape the build

**The authorisation boundary does not exist in any design.** The wholesale showroom is drawn
as a public page with prices on it, and there are zero forms and zero authenticated states
across 48 files. A faithful implementation leaks buyer pricing by default. **This is the
single most important thing the blueprint adds.**

**The live site already leaks.** Wholesale costs are readable in URL slugs on 17 homepage
products and 14 on a drop page. **D-00 is independent of this project and should be raised
before anything else.** Plan in `21`.

**Flat 2D tells the brand story better than 3D does.** V3.1 `12e` — a scroll page with
photographs and captions — communicates *textile → product → distribution* more clearly than
the entire Frontier Engine sequence. That is the strongest argument in the corpus against
WebGL, and it comes from the design itself.

---

## 6. Readiness

**Ready for Phase 1 planning approval.** Phase 1 requires no WebGL, no film, no Custom
Atelier, no consumer checkout and **no owner answer that is not yet available**. Every
unresolved decision is carried as an explicit branch in
[`02_OWNER_DECISION_BRANCHES.md`](02_OWNER_DECISION_BRANCHES.md), each with a default safe
branch that introduces no unsupported business claim.

**Remaining blockers before implementation:** D-00 must be raised · a demo buyer account is
needed to see the authenticated experience · product data and photography must be sourced ·
the commerce-system integration boundary must be confirmed with the owner.

---

## Document map

`01` source authority · `02` owner branches · `03` phasing · `04` IA · `05` routes ·
`06` domain models · `07` component contracts · `08` authorization and security ·
`09` buyer Passport · `10` taxonomy and sizing · `11` tokens · `12` motion and modes ·
`13` Frontier Engine · `14` media plan · `15` accessibility · `16` performance ·
`17` architecture · `18` tests · `19` analytics/SEO · `20` content governance ·
`21` D-00 remediation · `22` Phase 1 plan · `23` acceptance criteria · `24` readiness register
