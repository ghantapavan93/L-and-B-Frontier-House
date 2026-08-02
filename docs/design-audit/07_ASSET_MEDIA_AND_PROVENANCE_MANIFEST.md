# 07 — Asset, Media and Provenance Manifest

All findings `MEASURED` by filesystem search and markup extraction across
`stitch-export/` (48 HTML, 42 PNG).

---

## 1. The complete asset position

> **There are zero production assets on disk.**
>
> Search for `*.glb` `*.gltf` `*.mp4` `*.webm` `*.jpg` `*.jpeg` `*.webp` `*.svg` `*.woff`
> `*.woff2` `*.ktx2` `*.bin` `*.glsl` across `stitch-export/` returns **0 files**.

| Asset class | On disk | Required by manifests |
| :--- | :--- | :--- |
| 3D models (GLB/glTF) | **0** | 4 |
| Shader files (GLSL) | **0** | 3 |
| Video | **0** | 3 media briefs |
| Textures | **0** | 1 named + all buckle materials |
| Fonts (self-hosted) | **0** | 4 families, all remote |
| Icons | **0** | Remote Material Symbols |
| Product photography | **0** local | All remote, all generated |
| **Stitch preview renders** | **42 PNG** | — |

---

## 2. The only durable assets: 42 preview renders

`MEASURED` — 42 × `screen.png`, **1600 × 1280**, average **193 KB**, total **7.9 MB**.

| Generation | Count |
| :--- | :--- |
| V1 | 6 |
| V2 | 8 |
| V3 | 13 |
| V3.1 | 29 |

**Intended use:** Stitch preview. **Actual use in this project:** the sole durable visual
record of the approved design. **Production readiness:** none — flat composites at a fixed
1600 × 1280.

---

## 3. All imagery is remote, generated, and expirable

`MEASURED` — every image reference resolves to
`https://lh3.googleusercontent.com/aida-public/…`. **No local image references exist.**

| Property | Assessment |
| :--- | :--- |
| Provenance | **Machine-generated** (Stitch/Gemini) |
| Hosting | Google infrastructure, outside project control |
| Persistence | **Not guaranteed.** No published retention |
| Licensing | **OPEN QUESTION** — generated-asset terms unverified (D-09) |
| Resembles real product? | **Yes** — garments, models, workshop scenes, retail interiors |
| Owner approval needed? | **Yes, before any external use** |
| Replacement required? | **Yes, universally** |

> **Every generated image in this corpus is:**
> **`CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY`**
>
> This label applies without exception, per `CLAUDE.md` §12. Several renders depict
> convincing garments, a workshop and a retail interior. **None depicts a real Lucky &
> Blessed product, facility or location.** The workshop imagery is a particular risk: it
> could be read as evidence of manufacturing, and manufacturing location is explicitly
> unverified (OQ-04). It must never be captioned in a way that implies "our factory."

`RECOMMENDATION` — **Mirror every remote image into
`docs/design-audit/evidence/` before the URLs expire.** This is preservation of the design
record, not production asset work, and it is the only mitigation for a dependency the
project does not control.

---

## 4. Named-but-absent assets

**V3 `design.md` § Asset Manifest — 0 of 3 exist**

| Asset | Spec | Status |
| :--- | :--- | :--- |
| `hero_still_01.png` | 1440 × 900, video poster | **MISSING** |
| `midnight_pearl_snap_3D.glb` | Anatomy 3D object | **MISSING** |
| `denim_texture_grain.jpg` | 512 × 512 tileable | **MISSING** |

**V3.1 `v3_1_export_manifest.md` — 0 of 6 exist**

| Asset | Spec | Status |
| :--- | :--- | :--- |
| `Frontier_Thread_V3_1.glb` | Spline path | **MISSING** |
| `Buckle_Aperture_V3_1.glb` | 5-ring mechanical | **MISSING** |
| `Warehouse_Kit_V3_1.glb` | Modular rails/frames | **MISSING** |
| `Frontier_Thread_Ignition.glsl` | Flowing neon | **MISSING** |
| `Buckle_Edge_Fresnel.glsl` | Metallic iridescence | **MISSING** |
| `Warehouse_Atmo_Fog.glsl` | Volumetric light | **MISSING** |

**V3.1 `v3_1_engineering_handoff.md` § Media Production Brief — 0 of 3 exist**

| Brief | Description | Status |
| :--- | :--- | :--- |
| Media_01 | Hero Film — cinematic grain, 24 fps, Dallas Night + Ranch Dusk | **MISSING** |
| Media_02 | Denim Macro — **8K texture scan**, shifting light | **MISSING** |
| Media_03 | Wholesale Distribution — blurred motion, warm workshop light | **MISSING** |

> `INFERRED` — **Media_02 at 8K is a VRAM problem, not a file-size problem.** An 8192²
> RGBA8 texture is **256 MiB uncompressed, ~333 MiB with mipmaps** — beyond the entire
> budget of a mid-tier mobile GPU for a single map, and invisible in a network waterfall.
> Cap texture source at **2048²** and deliver via KTX2/Basis. See
> [12_PERFORMANCE_AUDIT.md](12_PERFORMANCE_AUDIT.md).

`OBSERVED` — Media_01 names **"Dallas Night + Ranch Dusk."** Dallas is verified (showroom
#13656, Harry Hines Blvd). A ranch is **not** verified and must not imply owned property or
Texas manufacturing (OQ-04).

---

## 5. Fonts and icons

`MEASURED` — **0 self-hosted font files.** All four families load from Google Fonts:
Playfair Display, Hanken Grotesk, Chivo, JetBrains Mono — plus Material Symbols Outlined.

`INFERRED` — Render-blocking third-party requests on every route, and a licence/privacy
posture the project has not chosen. Self-hosting is the normal remedy. Icon replacement is
recommended for craft consistency (see [06](06_DESIGN_TOKEN_RECONCILIATION.md) §3).

---

## 6. Media slots implied but never declared

`MEASURED` — across all 48 files: `<video>` **0** · `poster=` **0** ·
`<track>` **0** · `playsinline` **0**.

`INFERRED` — The corpus names a cinematic film experience and contains **no video element,
no poster attribute and no cue timeline anywhere**. `CLAUDE.md` §9 requires poster-first
construction. **Nothing has to be undone — the slots simply have to be declared properly
the first time.**

Slots that must exist, with a poster and a fallback each: campaign hero (desktop 16:9 and
mobile 9:16), drop cover, lookbook page, product gallery, product material macro, product
motion, craft/process, collection trailer, film chapter, anatomy layer.

---

## 7. Provenance summary

| Class | Count | Provenance | Production ready |
| :--- | :--- | :--- | :--- |
| Preview renders | 42 | Stitch | No — reference only |
| Remote imagery | ~30 unique | **Generated** | **No — replace entirely** |
| 3D models | 0 | — | Must be originated |
| Shaders | 0 | — | Must be originated |
| Video | 0 | — | Must be produced |
| Textures | 0 | — | Must be produced |
| Fonts | 0 local | Google Fonts | Self-host |

> `INFERRED` — **The project has a complete design specification and an empty asset
> library.** Every pixel that ships must be created or licensed after this audit. That is
> a budget and schedule fact more than an engineering one, and it is the single largest
> unstated cost in the project.
