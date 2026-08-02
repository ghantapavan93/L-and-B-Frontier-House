# 11 — Design Token System

**V3 is authoritative.** V2 residue bundled inside V3.1 is disregarded (**C-01**). V2 values
are recovered only where the audit proved V3 weakened usability. **No token is approved
here** — each carries a status and, where needed, an owner flag.

Status key: **EXACT** (extracted) · **DOC-ONLY** (documented, not implemented) ·
**RECOVERED** (from V2, on evidence) · **DECISION** (owner) · **MISSING**

---

## 1. Colour

### Brand palette — V3 documented

| Token | Hex | Status | Note |
| :--- | :--- | :--- | :--- |
| Ink Black | `#0A0A0A` | DOC-ONLY | 2/15 V3 frames, 0/33 V3.1 |
| Bone White | `#F5F2EE` | **MISSING** | **0 of 48 files** |
| Tobacco Leather | `#734F36` | DOC-ONLY | 3/15 |
| Sandstone | `#D9C5B2` | **MISSING** | 0 of 48 |
| Dark Denim Indigo | `#1B2B45` | **MISSING** | 0 of 48 |
| Oxidized Silver | `#A7A6A2` | **MISSING** | 0 of 48 |
| Rust Red | `#7E241F` | **MISSING** | 0 of 48 |
| Carbon | `#121212` | DECISION | V3.1 addition; non-conflicting, useful as a surface step |

> `MEASURED` — **Five of seven brand colours appear in zero V3 frames; all seven appear in
> zero V3.1 frames.** What ships is a **Material 3 default theme** (`#fdf8f8`, `#1c1b1b`,
> `#e5e2e1`, `#000000`) present since **V1** — **71 distinct hex values against a documented
> palette of 7**.
>
> `INFERRED` — This is a **tooling artefact**, not a design decision. Stitch emits a Material
> theme; the brand palette was authored in prose alongside it and never compiled. **Correct
> it at implementation.** The rendered frames *read* warm because the **photography** carries
> the colour — which is exactly what the Creative North Star prescribes: *"colour carried by
> the garment, not the interface."*

### Accents — **DECISION (D-07)**

V3.1 names **Electric Cobalt · Hot Magenta · Molten Amber** with **no hex values**. Rendered,
Electric Cobalt reads as a **targeting HUD** (`8g_1`) and as **neon rather than thread**
(`12b`, V3.1 `frame_3`). **Withhold.** Do not invent hex values. If an accent role is needed,
draw from the verified material palette — **copper, turquoise, rust** are in the buckle's own
material list and are authentically western.

### Contrast — computed, and one specified failure

| Pair | Ratio | Required | Result |
| :--- | :--- | :--- | :--- |
| Bone White on Ink Black | 17.74:1 | 4.5:1 | PASS |
| Dark Denim Indigo on Bone White | 12.73:1 | 4.5:1 | PASS |
| Tobacco Leather on Bone White | 6.49:1 | 4.5:1 | PASS |
| **Oxidized Silver on Bone White** | **2.18:1** | **3:1** | **FAIL** |
| **Sandstone on Bone White** | **1.50:1** | 3:1 | **FAIL** |
| **Rust Red on Ink Black** | **2.04:1** | 4.5:1 | **FAIL** |
| **Tobacco on Sandstone** | **4.34:1** | 4.5:1 | **FAIL (marginal)** |

> **The focus ring is specified non-conformant.** `engineering_export_package.md` requires
> *"2px solid Oxidized Silver rings for all keyboard navigation"* — **2.18:1 against a 3:1
> requirement** — and `:focus` appears in **0 of 48 files**. Both non-conformant *and*
> unimplemented.

**Canonical corrections (all pass):** focus ring **`#734F36` Tobacco (6.49:1)** ·
metadata text `#6E6D6B` (4.63:1) · load-bearing borders `#96795D` (3.63:1) ·
error-on-dark `#D97066` (6.09:1) · chip text `#6B4931` (4.80:1).

---

## 2. Typography

| Role | Canonical | Status |
| :--- | :--- | :--- |
| Display | **DECISION** — Playfair Display is labelled *"Substitute"* in V3's own `design.md` and has carried three generations as a placeholder | **D-07** |
| UI | **Hanken Grotesk** | EXACT (`DESIGN.md` wins over prose — **C-02**) |
| Mono | JetBrains Mono — technical labels only | EXACT |
| Icons | **Replace** Material Symbols Outlined | DECISION |

`MEASURED` — **Four text families ship against a two-family rule.** Inter is specified in
prose and loads in **0 files**. Chivo is V2 residue.

**Type scale (EXACT, `DESIGN.md`):** 12 · 14 · 16 · 18 · 32 · 48 · 84 px.
Prose claims of 140/96px are **not implemented** (**C-03**).

**RECOVERED from V2:** **headline legibility.** V2 F1 sets the hero in high-contrast white
over a dark portrait; V3 F1 renders it near-invisible dark-grey-on-black. **Minimum 4.5:1 for
any headline over media, with a scrim where needed.**

---

## 3. Motion

`MEASURED` — **66 duration values exceed 400 ms; 21 comply. 13 distinct easing curves** exist
against a two-curve rule. V3.1's tokens are worse: T1_Stitch **2400 ms**, T2_Unfold 1800 ms,
T3_Aperture 1200 ms (**`Back.inOut` — overshoot**), T4_Erupt 800 ms.

**Canonical:**

| Token | Value |
| :--- | :--- |
| `duration.instant` | 100 ms |
| `duration.fast` | 200 ms |
| `duration.base` | 300 ms |
| `duration.slow` | **400 ms — hard cap for anything interactive** |
| `ease.entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` — the most-used curve, shared by V3 and V3.1 |
| `ease.exit` | slightly faster than entrance |

**No overshoot easing (`Back.*`) anywhere in a reduced-motion path.** Cinematic sequences may
exceed 400 ms **only** where non-blocking, skippable, and carrying a visible pause control.

---

## 4. Spacing, layout, radius

**EXACT**, from V3's Tailwind config:

| Token | Value |
| :--- | :--- |
| `container.max` | **1440 px** |
| `gutter` | **24 px** |
| `margin.mobile` | **20 px** |
| `radius.default` | 2 px |
| `radius.lg` | 4 px |
| `radius.xl` | 8 px |
| `radius.full` | 12 px |

`INFERRED` — Radii are **very tight (2–12 px)** and correct: hard corners read as editorial
and structural, consistent with the western-hardware register.

**MISSING entirely** — must be authored: breakpoint set (`sm:` and `xl:` appear **0 times**);
z-index scale; section spacing scale; line heights and letter spacing beyond `DESIGN.md`;
shadow scale; blur; grain/texture; **safe-area insets** (`env()` appears **0 times**);
camera timing; scroll distances; lighting values; shader parameters.

---

## 5. Recovering V1's material principle

`OBSERVED` — V1 specified *"CSS backdrops using subtle denim grain or leather texture noise
rather than flat hex colors."* It is absent from V3.1's implementation, whose Three.js
materials are flat `MeshPhongMaterial` colours with **no maps of any kind**.

`INFERRED` — V1 identified material texture as the mechanism for "premium through material
honesty" five generations before the research reached the same conclusion. **Restore it as a
token-level concern** — grain and texture overlays are a rendering technique, not a layout,
so recovering it does not touch V3's visual authority.

---

## 6. Approval gates

Nothing here is approved. These require an owner decision before the system is frozen:

**Display typeface** · **accent palette** (or its removal) · **icon set replacement** ·
**Carbon as a surface step** · **price-tier calibration** (D-06 — density is currently tuned
to a $1,250 object against a verified $20–$85 retail band).
