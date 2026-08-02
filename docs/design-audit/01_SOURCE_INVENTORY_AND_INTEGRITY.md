# 01 — Source Inventory and Integrity

**Audit date:** 2026-08-01 · All figures `MEASURED`

---

## 1. Inventory

| Source | Path | Frames | Files | Size |
| :--- | :--- | :--- | :--- | :--- |
| **V1** historical | `archive/v1-exploration/` | 6 | 14 | 3.3 MB |
| **V2** historical | `archive/v2-synthesis/` | 8 | 17 | 8.4 MB |
| **V3** production | `stitch-export/v3-production/` | 12 + prototype | 31 | 9.4 MB |
| **V3.1** supplement | `stitch-export/v3-1-frontier-engine/` | 31 + 2 hubs | 81 | 44 MB |

**Totals:** 59 frames · 48 HTML · 42 PNG · 20 Markdown · 5 ZIP · **~65 MB**

`MEASURED` — Zip integrity: all five archives in `_source-zips/` pass `unzip -t`.

---

## 2. The single most consequential inventory finding

> **`MEASURED` — There are zero production assets on disk.**
>
> A filesystem search across `stitch-export/` for `*.glb`, `*.gltf`, `*.mp4`, `*.webm`,
> `*.jpg`, `*.jpeg`, `*.webp`, `*.svg`, `*.woff`, `*.woff2`, `*.ktx2` and `*.bin`
> returns **0 files**.

The only binary files present are **42 `screen.png` files** — one Stitch preview render
per frame, 1600×1280, averaging 193 KB, totalling 7.9 MB. These are **flat screenshots of
the design**, not usable assets.

### 2.1 Every manifest-required asset is missing

**V3 `design.md` § Asset Manifest** names three assets. `MEASURED` — none exist:

| Asset named | Status |
| :--- | :--- |
| `hero_still_01.png` (1440×900, video poster) | **MISSING** |
| `midnight_pearl_snap_3D.glb` | **MISSING** |
| `denim_texture_grain.jpg` (512×512 tileable) | **MISSING** |

**V3.1 `v3_1_export_manifest.md`** names six required assets. `MEASURED` — none exist:

| Asset named | Status |
| :--- | :--- |
| `Frontier_Thread_V3_1.glb` | **MISSING** |
| `Buckle_Aperture_V3_1.glb` (5-ring mechanical) | **MISSING** |
| `Warehouse_Kit_V3_1.glb` (modular rails/frames) | **MISSING** |
| `Frontier_Thread_Ignition.glsl` | **MISSING** |
| `Buckle_Edge_Fresnel.glsl` | **MISSING** |
| `Warehouse_Atmo_Fog.glsl` | **MISSING** |

`INFERRED` — **All nine manifest entries across both generations are aspirational.** The
manifests describe what a build would need, not what was delivered. This is not a defect
in the design work — Stitch does not produce GLB or GLSL — but it means **the 3D layer of
this project has no starting assets whatsoever.** Every model, texture and shader must be
originated.

---

## 3. Imagery is entirely remote and generated

`MEASURED` — All imagery in the exports resolves to
`https://lh3.googleusercontent.com/aida-public/…` URLs. There are **no local image
references** in any of the 48 HTML files.

`INFERRED` — Three consequences:

1. **Ephemerality.** These are Google-hosted generated-asset URLs. They are not
   guaranteed to persist. If they expire, every frame renders imageless and the exports
   become unreadable as visual reference. **The 42 `screen.png` renders are currently the
   only durable visual record of the design.**
2. **Provenance.** Every image is machine-generated. Per `CLAUDE.md` §12 none may be
   presented as real product. See `07_ASSET_MEDIA_AND_PROVENANCE_MANIFEST.md`.
3. **Third-party dependency.** The exports cannot be rendered offline or archived
   self-contained without first mirroring the remote imagery.

`RECOMMENDATION` — Mirror every remote image into `docs/design-audit/evidence/` **before**
the URLs expire. This is preservation of the design record, not production asset work.

---

## 4. Remote runtime dependencies

`MEASURED` — across 48 HTML files:

| Dependency | Occurrences | Assessment |
| :--- | :--- | :--- |
| `https://cdn.tailwindcss.com` | **48** — every file | JIT CDN build. Not production-appropriate: ships a compiler to the browser, blocks render, and cannot be tree-shaken |
| `https://fonts.googleapis.com/css2` | 124 | Render-blocking third-party font CSS |
| `https://fonts.gstatic.com` | 13 | Font binaries |
| `https://ajax.googleapis.com/.../threejs/**r125**/three.min.js` | **5** | **three.js r125 — released January 2021, roughly 60 revisions behind current.** Global UMD build, not a module |

`INFERRED` — Every export is **100% network-dependent**. Nothing renders offline. This is
normal for a design tool export and is not a criticism of the design, but it means none
of this markup is reusable as-is, and the `r125` pin must not be carried forward.

---

## 5. Design-system duplication and the V2 residue conflict

`MEASURED` — md5 of every `DESIGN.md` in the tree:

| File | md5 | Verdict |
| :--- | :--- | :--- |
| `archive/v1-exploration/.../modern_frontier/DESIGN.md` | `8232a1c8…` | V1 system, unique |
| `archive/v2-synthesis/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | V2 system |
| `v3-production/.../modern_frontier_v3/DESIGN.md` | `ab11ac29…` | **V3 system — authoritative** |
| V3.1 `01-frontier-engine-core/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | **V2 copy** |
| V3.1 `02-belt-buckle-aperture/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | **V2 copy** |
| V3.1 `03-camera-passage/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | **V2 copy** |
| V3.1 `04-native-mobile/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | **V2 copy** |
| V3.1 `05-connected-handoff/.../modern_frontier_v2/DESIGN.md` | `b85c8d30…` | **V2 copy** |

`MEASURED` — All five V3.1 copies are **byte-identical to the archived V2 design system**
(`b85c8d30…`, 155 lines). V3's own system (`ab11ac29…`, 175 lines) appears **only** in
`v3-production`.

`INFERRED` — This is Stitch re-exporting the older design-system folder alongside each
V3.1 module, not a deliberate branch. **Confirmed as export residue.** Per `CLAUDE.md`
§2, V3 wins. Registered as conflict **C-01** in
[15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md](15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md).

---

## 6. Structural notes

`OBSERVED` — Every module repeats the wrapper directory
`stitch_l_b_frontier_house_platform_synthesis/`, producing paths five levels deep. Harmless,
but verbose; no reorganisation performed, per instruction.

`OBSERVED` — `_source-zips/` duplicates the extracted content, which accounts for roughly
half of V3.1's 44 MB. Correct as a preservation measure; not audited further, per
instruction.

`MEASURED` — Modification times confirm generation order: V3 exported 2026-07-31 20:21;
V1 and V2 placed 2026-08-01 01:20–01:22; V3.1 extracted 2026-08-01 07:20.

---

## 7. Integrity verdict

| Check | Result |
| :--- | :--- |
| All four generations present and populated | **PASS** |
| Zip archives intact | **PASS** (5/5) |
| Frame counts match folder structure | **PASS** |
| Design-system files traceable to a generation | **PASS** |
| **Production assets present** | **FAIL — 0 of 9 manifest assets exist** |
| **Imagery durable and local** | **FAIL — 100% remote, generated, expirable** |
| **Exports render offline** | **FAIL — every file depends on 2+ remote CDNs** |

`INFERRED` — The design record is **complete as design** and **empty as production
input**. That distinction governs the rest of this audit: what exists is a rigorous
visual and narrative specification, not a codebase or an asset library.
