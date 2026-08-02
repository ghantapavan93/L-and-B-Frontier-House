# 06 — Design Token Reconciliation

All values `MEASURED` across 48 HTML files (15 V3 + 33 V3.1) plus four design-system
documents. **V3 is authoritative where sources disagree** (`CLAUDE.md` §2).

Status key: **EXACT** (extracted) · **DOC-ONLY** (documented, not implemented) ·
**CONFLICT** · **MISSING** · **DECISION**

---

## 1. Colour — the headline reconciliation

### 1.1 Documented brand palette versus implementation

`MEASURED` — occurrence of each documented V3 token, per generation:

| Token | Hex | V3 (15 files) | V3.1 (33 files) | Status |
| :--- | :--- | :--- | :--- | :--- |
| Ink Black | `#0A0A0A` | **2 / 15** | **0 / 33** | DOC-ONLY |
| Bone White | `#F5F2EE` | **0 / 15** | **0 / 33** | **MISSING** |
| Tobacco Leather | `#734F36` | **3 / 15** | **0 / 33** | DOC-ONLY |
| Sandstone | `#D9C5B2` | **0 / 15** | **0 / 33** | **MISSING** |
| Dark Denim Indigo | `#1B2B45` | **0 / 15** | **0 / 33** | **MISSING** |
| Oxidized Silver | `#A7A6A2` | **0 / 15** | **0 / 33** | **MISSING** |
| Rust Red | `#7E241F` | **0 / 15** | **0 / 33** | **MISSING** |

> `MEASURED` — **Five of seven brand colours appear in zero V3 frames. All seven appear in
> zero V3.1 frames.** The warm western palette exists in the prose layer and essentially
> nowhere in the machine-readable layer.

### 1.2 What is actually rendered

`MEASURED` — most-used hex values across the corpus:

| Hex | Uses | Role |
| :--- | :--- | :--- |
| `#ffffff` | 215 | on-primary |
| `#1c1b1b` | 165 | on-surface (text) |
| `#e5e2e1` | 128 | surface-variant |
| `#fcf9f8` | 86 | surface |
| `#000000` | 85 | primary |
| `#c9c6c5` | 84 | inverse-primary |
| `#0a1c35` | 81 | on-tertiary-fixed |

`MEASURED` — **71 distinct hex values** across the corpus, against a documented palette of
**7**.

`INFERRED` — This is a **Material Design 3 generated theme**, identifiable by its token
names (`surface-container-*`, `on-*`, `*-fixed-dim`, `inverse-*`). Per
[02](02_V1_V2_DESIGN_EVOLUTION.md) §5 it is present from **V1 onward** and drifts only
slightly: V1 `#fcf9f5` → V2 `#fcf9f8` → V3 `#fdf8f8`.

> `INFERRED` — **This is a tooling artefact, not a design decision.** Stitch emits a
> Material 3 theme; the brand palette was authored in prose alongside it and never
> compiled into the tokens. It should be corrected at implementation, and the correction
> does not contradict V3's visual authority — the *renders* show warm western imagery;
> only the *token file* is grey.

### 1.3 V3 versus V3.1 palette conflict

| Role | V3 | V3.1 | Resolution |
| :--- | :--- | :--- | :--- |
| Black | Ink Black `#0A0A0A` | Obsidian `#050505` | **V3 wins** |
| Leather | Tobacco `#734F36` | Weathered `#5E4033` | **V3 wins** |
| Carbon | — | `#121212` | V3.1 addition — **DECISION** |
| Accents | — | Electric Cobalt, Hot Magenta, Molten Amber — **no hex given** | **DECISION** (D-07) |

---

## 2. Contrast

`MEASURED` — computed from documented token values, not sampled pixels:

| Pair | Ratio | Requirement | Result |
| :--- | :--- | :--- | :--- |
| Bone White on Ink Black | **17.74 : 1** | 4.5 : 1 | PASS |
| Dark Denim Indigo on Bone White | **12.73 : 1** | 4.5 : 1 | PASS |
| Tobacco Leather on Bone White | **6.49 : 1** | 4.5 : 1 | PASS |
| **Oxidized Silver on Bone White** | **2.18 : 1** | **3 : 1** | **FAIL** |
| **Sandstone on Bone White** | **1.50 : 1** | 3 : 1 | **FAIL** |
| **Rust Red on Ink Black** | **2.04 : 1** | 4.5 : 1 | **FAIL** |
| Tobacco on Sandstone | **4.34 : 1** | 4.5 : 1 | **FAIL (marginal)** |

> `INFERRED` — The Oxidized Silver failure is the serious one.
> `engineering_export_package.md` specifies *"2px solid Oxidized Silver rings for all
> keyboard navigation."* At **2.18 : 1 against a 3 : 1 requirement**, the specified focus
> indicator fails WCAG 1.4.11 — and `MEASURED`, `:focus` appears in **0 of 48 files**, so
> it is both non-conformant and unimplemented.

**Computed remedies, all passing:** focus ring → `#7C7B79` (3.79 : 1) or Tobacco `#734F36`
(6.49 : 1); metadata text → `#6E6D6B` (4.63 : 1); load-bearing borders → `#96795D`
(3.63 : 1); error-on-dark → `#D97066` (6.09 : 1); chip text → `#6B4931` (4.80 : 1).

---

## 3. Typography

| Generation | Display | UI | Mono |
| :--- | :--- | :--- | :--- |
| V1 | Libre Caslon Text | Inter | — |
| V2 | Playfair Display | Chivo | JetBrains Mono |
| **V3 `DESIGN.md`** | **Playfair Display** | **Hanken Grotesk** | — |
| V3 `design.md` prose | Playfair Display | **Inter** | — |

`MEASURED` — families actually loaded across the corpus: **Playfair Display, Hanken
Grotesk, Chivo, JetBrains Mono, Material Symbols Outlined**. **Inter is loaded in 0 files.**

**Conflicts:**
- **C-02** — `design.md` says Inter; `DESIGN.md` says Hanken Grotesk; neither Inter nor a
  single UI face is consistently used. **Four text families ship against a two-family rule.**
- **C-03** — `design.md` claims a scale of 140 px / 96 px / 16 px. `DESIGN.md` tops out at
  **84 px**; steps are 12 / 14 / 16 / 18 / 32 / 48 / 84.

`OBSERVED` — `design.md` labels both faces **"Substitute"**. `INFERRED` — **the brand has
no committed typeface**; Playfair Display has carried three generations as a placeholder
and has no western equity. Owner decision **D-06**.

`OBSERVED` — **Material Symbols Outlined** supplies icons (`search`, `menu`, `person`,
`shopping_bag`, `terrain`, `apparel`, `south`, `close`). `INFERRED` — Google's Material
icon set inside a bespoke western house undercuts the craft claim. Flag, not a blocker.

---

## 4. Motion

`MEASURED` — declared durations across the corpus:

| Duration | Count | Against the ≤400 ms interactive rule |
| :--- | :--- | :--- |
| 0.1 s | 5 | PASS |
| 0.2 s | 6 | PASS |
| 0.3 s | 4 | PASS |
| 0.4 s | 6 | PASS (at limit) |
| **0.5 s** | **14** | Exceeds |
| **0.6 s** | 7 | Exceeds |
| **0.8 s** | **16** | Exceeds |
| **1.2 s** | 7 | Exceeds |
| **1.5 s** | 4 | Exceeds |
| **2 s** | 10 | Exceeds |
| **3 s** | 5 | Exceeds |
| **4 s** | 3 | Exceeds |

`MEASURED` — **21 compliant values against 66 non-compliant.** V3.1's motion tokens are
worse: T1_Stitch **2400 ms**, T2_Unfold **1800 ms**, T3_Aperture **1200 ms**, T4_Erupt
**800 ms**.

`MEASURED` — **13 distinct `cubic-bezier` curves** against `CLAUDE.md`'s *"two easing
curves total"*. Most used: `(0.2, 0.8, 0.2, 1)` ×7, `(0.25, 1, 0.5, 1)` ×6,
`(0.16, 1, 0.3, 1)` ×6.

`OBSERVED` — V3.1 names GSAP idioms: `Expo.out`, `Back.inOut`, `Power4.out`. `INFERRED` —
implies a GSAP dependency, and **`Back.inOut` overshoots**, which is a vestibular concern
under reduced motion.

`RECOMMENDATION` — Two curves: entrance `cubic-bezier(0.16, 1, 0.3, 1)` (already the most
used and shared between V3 and V3.1), exit slightly faster. **Cap interactive transitions
at 400 ms.** Cinematic sequences may exceed only where non-blocking, skippable, and
carrying a pause control.

---

## 5. Spacing, layout, radius

`MEASURED` — from V3 frame Tailwind config (**EXACT**):

| Token | Value |
| :--- | :--- |
| `container-max-width` | **1440 px** |
| `margin-mobile` | **20 px** |
| `gutter` | **24 px** |
| `borderRadius.DEFAULT` | 0.125 rem (2 px) |
| `borderRadius.lg` | 0.25 rem (4 px) |
| `borderRadius.xl` | 0.5 rem (8 px) |
| `borderRadius.full` | 0.75 rem (12 px) |

`INFERRED` — Radii are **very tight** (2–12 px). Appropriate: hard corners read as
editorial and structural, consistent with the western-hardware register.

**MISSING entirely:** breakpoint set, z-index scale, section spacing scale, line heights
and letter spacing beyond the design-system file, shadow scale, blur, grain/texture
values, camera timing, scroll distances, lighting values, shader parameters.

`MEASURED` — responsive coverage is thin: `sm:` and `xl:` appear **0 times**; `env(` /
`safe-area` appear **0 times**.

---

## 6. Canonical recommendation — **not approved**

| Token | Recommendation | Basis |
| :--- | :--- | :--- |
| Palette | V3's seven, compiled into real tokens | V3 authoritative |
| Carbon `#121212` | Adopt as a surface step | Useful, non-conflicting |
| Accents | **Withhold** pending hex values and brand fit | D-07 |
| Focus ring | `#734F36` (6.49 : 1) | Passes; already in palette |
| Display face | **Decide** — Playfair is a placeholder | D-06 |
| UI face | Hanken Grotesk | V3 `DESIGN.md` wins |
| Mono | JetBrains Mono, technical labels only | In use |
| Icons | **Replace** Material Symbols | Craft consistency |
| Type scale | 12 / 14 / 16 / 18 / 32 / 48 / 84 | EXACT from V3 |
| Easing | Two curves, entrance `(0.16, 1, 0.3, 1)` | Most used, cross-generation |
| Interactive duration | ≤ 400 ms | `CLAUDE.md` §9 |
| Container / gutter / mobile margin | 1440 / 24 / 20 px | EXACT |

**No token is approved by this audit.** V3 remains authoritative; V2 residue is
disregarded; every **DECISION** row needs an owner.
