# 00 — Audit Scope and Method

**Audit date:** 2026-08-01
**Stage:** Design-source audit. Research complete; implementation not started, not approved.
**Sources audited:** V1, V2 (historical) · V3 (production platform) · V3.1 (cinematic supplement)

---

## 1. What this audit is

A read-only forensic inspection of every on-disk design source, measured against the
verified research corpus in `docs/brand-research/` and the constitution in `CLAUDE.md`.

**Nothing in `archive/` or `stitch-export/` was modified, renamed, moved, regenerated or
deleted.** Verified: `git status` shows those trees untouched; the only files written by
this audit are under `docs/design-audit/`.

---

## 2. Evidence labels

Every claim carries one:

| Label | Meaning |
| :--- | :--- |
| `MEASURED` | Extracted mechanically from source files. Counts and hex values are reproducible |
| `OBSERVED` | Seen directly in a rendered screen or read in a source file |
| `INFERRED` | A reasoned conclusion from measured or observed evidence |
| `SPEC-ONLY` | Stated in a specification document with no corresponding implementation |
| `OPEN QUESTION` | Unresolved; requires owner input or further work |

Functional status uses a separate scale, per the brief:

**FUNCTIONAL · PARTIALLY FUNCTIONAL · STATIC VISUAL REFERENCE · CONCEPTUAL SPECIFICATION ·
PLACEHOLDER · BROKEN · MISSING**

---

## 3. Method actually used

**Mechanical extraction across all 48 HTML files** — remote dependencies, font families,
hex values, motion durations, easing curves, accessibility attributes, commerce
vocabulary, dollar amounts. Counts in this corpus are reproducible with `grep` and are
stated as fractions of the 48-file corpus (15 V3 + 33 V3.1) so they can be re-derived.

**Full text reading** of every specification document: V3's `design.md` and
`engineering_export_package.md`; V3.1's `v3_1_design.md`,
`v3_1_engineering_handoff.md`, `v3_1_belt_buckle_aperture_spec.md`,
`v3_1_route_and_state_map.md`, `v3_1_export_manifest.md`; and the V1/V2 design systems.

**Source-code reading** of every Three.js and shader file (six `code.html` files,
3–5 KB each).

**Visual inspection** of rendered screens, prioritised on the questions the brief raises
explicitly — V3 Frame 5 (Four Worlds) and the V3.1 belt buckle board.

**Asset existence verification** — every asset named in a manifest was checked against
the filesystem rather than assumed present.

**Integrity verification** — md5 comparison of duplicated design-system files; zip
integrity tested on all five `_source-zips` archives.

---

## 4. Depth achieved, stated honestly

Not every area received equal depth. Where depth is partial, the document says so rather
than implying completeness.

| Area | Depth |
| :--- | :--- |
| Asset existence and manifest reconciliation | **Complete** — every named asset checked |
| Design tokens (colour, type, motion, easing) | **Complete** — mechanically extracted across all 48 files |
| Three.js and shader source | **Complete** — all six files read in full |
| Specification documents | **Complete** — all 20 markdown files read |
| Accessibility signals in markup | **Complete** — attribute-level counts across all 48 files |
| Commerce and pricing signals | **Complete** — all dollar amounts and commerce vocabulary extracted |
| Visual inspection of rendered screens | **Partial** — decision-critical frames read in full; remainder assessed via markup and structure. Noted per screen in `03` and `04` |
| Live rendering of exported HTML in a browser | **Not performed** — the exports depend on a remote CDN and remote generated imagery; rendering them would produce a network-dependent result that is not reproducible evidence. Structure was read from source instead |
| Computed contrast ratios on rendered pixels | **Partial** — computed from declared token values, not sampled from rendered screenshots |

---

## 5. Source-of-truth hierarchy applied

Per `CLAUDE.md` §2, and applied throughout:

1. **Verified brand truth** — the research corpus
2. **Creative constitution** — `CLAUDE.md` and `docs/brand-research/`
3. **V3** — approved platform visual language
3.1. **V3.1** — approved cinematic supplement; extends V3, never overrides it
4. **Production engineering**

**V1 and V2 are historical evidence only.** Where a V3.1 package contains a bundled copy
of the V2 design system, V3 wins — this was confirmed as export residue and is recorded
in `15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md`.

---

## 6. What this audit deliberately does not do

- **Does not resolve owner decisions.** Wholesale-vs-DTC, plus-size architecture, and
  home goods are surfaced and classified, never decided.
- **Does not delete or dismiss visual concepts.** Where a concept is unsupported by
  current business reality, the audit records how the architecture can preserve it
  without presenting it as a live capability.
- **Does not propose production architecture.** Feasibility is assessed; no stack is
  approved.
- **Does not treat generated imagery as product.** All generated visuals remain labelled
  `CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY`.
- **Does not treat filenames as evidence.** Every conclusion about content comes from
  opening the file.

---

## 7. Reading order for this corpus

1. [19_EXECUTIVE_AUDIT_SUMMARY.md](19_EXECUTIVE_AUDIT_SUMMARY.md) — the findings that matter
2. [18_OWNER_DECISIONS_REQUIRED.md](18_OWNER_DECISIONS_REQUIRED.md) — what is blocked
3. [15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md](15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md) — every conflict found
4. [01_SOURCE_INVENTORY_AND_INTEGRITY.md](01_SOURCE_INVENTORY_AND_INTEGRITY.md) — what exists
5. [03_V3_PLATFORM_AUDIT.md](03_V3_PLATFORM_AUDIT.md) and [04_V3_1_FRONTIER_ENGINE_AUDIT.md](04_V3_1_FRONTIER_ENGINE_AUDIT.md)
6. Then the specialist documents as needed
