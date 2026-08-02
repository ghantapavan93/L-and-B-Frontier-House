# 01 — Source Authority and Conflict Resolution

---

## 1. The hierarchy

| Level | Source | Controls |
| :--- | :--- | :--- |
| **1** | **Verified brand truth** (`docs/brand-research/`, owner confirmation) | Business model, products, categories, pricing rules, buyer requirements, history, operational claims, current capabilities |
| **2** | **Creative constitution** (`CLAUDE.md`, research corpus) | Strategic ambition, brand emotion, experience philosophy, editorial direction, Thread-to-Trade narrative, inclusive representation, wholesale credibility, progressive enhancement |
| **3** | **Modern Frontier V3** | Platform visual language — typography, colour hierarchy, grid, spacing, editorial composition, commerce and campaign presentation, wholesale surfaces, desktop/mobile relationship |
| **3.1** | **Frontier Engine V3.1** | *Supplemental intent only* — Frontier Thread, Engine narrative, buckle artifact, mobile depth, experience modes, reduced motion, fallbacks, poster-first entry, selected transitions |
| **4** | **Production engineering** | Accessibility, security, performance, authorisation, semantics, state, testing, maintainability, progressive enhancement, technology |

**V1 and V2 are historical evidence only.** They may contribute *recovered principles*
(§3), never tokens, layouts, routes or components.

---

## 2. Standing resolutions

These are settled. Do not re-litigate.

| Conflict | Resolution |
| :--- | :--- |
| **C-01** V3.1 bundles the V2 design system (5 byte-identical copies, `b85c8d30…`) | **Export residue. Disregard entirely.** V3's `modern_frontier_v3/DESIGN.md` is authoritative |
| **C-02** `design.md` says Inter; `DESIGN.md` says Hanken Grotesk; Inter loads in 0 files | **`DESIGN.md` wins — Hanken Grotesk.** Chivo is V2 residue; JetBrains Mono for technical labels only |
| **C-03** Type scale: prose claims 140/96px; `DESIGN.md` tops at 84px | **`DESIGN.md` wins.** Scale is 12/14/16/18/32/48/84 |
| **C-06** V3 Ink Black `#0A0A0A` vs V3.1 Obsidian `#050505`; Tobacco `#734F36` vs Weathered `#5E4033` | **V3 wins.** V3.1's Carbon `#121212` may be adopted as an additional surface step |
| **C-08** Buckle: board and spec say chamfered rectangle; code builds tori; state frames render circles | **Model from `8b` and `8c` only.** Photographic states are authoritative; geometric states and the code are rejected |
| **C-09** V3.1 maps the wheel to a camera axis | **`CLAUDE.md` §9 wins.** Drive the same value from native scroll position. Never intercept the wheel |
| **C-10** Route map is unsubstituted `{{DATA:SCREEN:…}}` | Export defect. Useful as intent, unusable as navigation |
| **C-16** V3 folder names do not match rendered content (`v3_frame_2` renders a Passport) | **Never treat a filename as evidence.** Always open the image |
| **C-22 / C-29 / C-35** Four carousel design systems; unstable tab order; unstable mode-selector composition | Design-system defects. **One consistent mobile system** — see `12` |
| **C-26** Six "Enter …" CTA verbs | Defect. **One primary-action vocabulary** |
| **C-30** Two frames carry their own labels burned into the artwork (`8g_2`, `8g_4`) | Board mockups, not screens. Unusable as visual reference |

---

## 3. Where V2 outranks V3 — four evidenced recoveries

`OBSERVED` — V2 is stronger than V3 in four specific, measured ways. **These are mechanics
and treatments, not styling.** V2 still controls no token.

| # | Recovery | Evidence |
| :--- | :--- | :--- |
| **1** | **MSRP beside authorised wholesale price** | V2 F6: `$185 WHSL / MSRP $395`, `$210 / $450`, `$85 / $180` — ≈2.1× keystone. **V3 F11 has no MSRP at all**, and margin maths is the buyer's core decision |
| **2** | **Operational alerts with SKU counts and assignable actions** | V2 F6: *"Heavy Denim Sourcing Delay — Impacts Fall '24 • 3 Weeks"* (Review) and *"Photography Gap: Outerwear — Missing detail shots for 4 SKUs"* (**Assign**). V3 F11's campaign-percentage and voice-notes layer is decorative by comparison |
| **3** | **Enter / Skip CTA parity and headline legibility** | V2 F1 places both CTAs as equal buttons with a high-contrast white headline. V3 F1 demotes *Skip to Shop* to small grey text and renders the headline in near-invisible dark grey |
| **4** | **Complete campaign structure** | **V2 F4 *is* Midnight Rodeo** — title, craft story with real construction specs, named chapter, three priced products, campaign CTA. **V3 F7 strips it to ~75% empty black** and replaces V2's woman protagonist with a man |

**Plus two mechanics worth recovering outright:** V2 F2's **per-cell motion annotations**
(*ENTER: LEFT · ASSEMBLE: DOWN · EXPAND: BECOME FILM*) — a real motion spec on a CSS Grid,
with stronger continuity than V3.1's entire camera passage; and V2 F5's **in-PDP 2D
customization** with an explicit lead time and human-review gate.

---

## 4. Where V1 contributes

**Recover:** Skip to Shop as a peer action · the **Dallas skyline** (the only verified
geography in 56 frames) · *"from the heart of Texas"* — Texas identity with **no
manufacturing claim** · **material-led collection naming** (*Tobacco & Indigo*) · the
five-item mobile navigation principle · *"Grid"* as a candidate label for direct shopping.

**Do not recover:** menswear (in all six V1 frames) · boots (*Rancher Boots $420*) · the
**circular concho** — where coin geometry begins · the **$850 fixture**, which propagates
from V1 Mobile A into V3 F6, `8g_8` and `12j` · Los Angeles coordinates presented as
location data · baked-in OS chrome (iOS status bar, macOS dock) · any unsupported category.

---

## 5. Conflict-resolution procedure

When a new conflict appears:

1. **Identify the level of each source.** Higher wins on its own domain.
2. **Level 1 always wins on fact.** A beautiful design showing a category that does not exist
   loses to the catalogue.
3. **Level 4 may override 3 and 3.1** only where an interaction causes severe accessibility,
   security or performance failure — and must then **design an equivalent**, never simply
   delete.
4. **Where levels tie**, or where the conflict is a business question rather than a design
   one, it becomes an **owner branch** in `02` — never a silent decision.
5. **Record every resolution.** The audit's register is the precedent set.

**A recommendation is never a fact.** An open question is never a fact. Generated Stitch copy
never overrides verified brand truth.
