# 08 — 3D, Shader and Runtime Feasibility

**Every Three.js and shader file in the corpus was read in full.** Six files, 3–5 KB each.
No technology is approved by this document.

---

## 1. What actually exists

| File | Bytes | Status |
| :--- | :--- | :--- |
| `v3-production/…/three.js/code.html` | 3,097 | **FUNCTIONAL — skeletal** |
| `v3-production/…/shader/code.html` | 5,085 | **PARTIALLY FUNCTIONAL** |
| `v3.1/01-frontier-engine-core/…/three.js/code.html` | 3,557 | Skeletal |
| `v3.1/01-frontier-engine-core/…/shader/code.html` | 3,793 | Partial |
| **`v3.1/02-belt-buckle-aperture/…/three.js/code.html`** | 4,049 | **BROKEN** |
| `v3.1/03-camera-passage/…/three.js/code.html` | 3,901 | Skeletal |

`INFERRED` — A production scene for any of these concepts is thousands of lines. **These
are 100-line sketches.** They demonstrate intent; none is a starting point.

---

## 2. The broken file

> `OBSERVED` — **`02-belt-buckle-aperture/three.js/code.html` does not execute.**
>
> ```js
> const container = document.getElementById('threejs-container-ANIMATION_44');  // exists
> (function() {
>   const container = document.getElementById('threejs-container-BUCKLE_APERTURE'); // null
>   const width = container.clientWidth || window.innerWidth;   // TypeError
> ```
>
> A nested IIFE re-declares `container` against an element ID that appears **nowhere in the
> document**. The scene throws on its first line. **Status: BROKEN**, not degraded.
>
> Per the brief, the file was not altered.

`INFERRED` — The signature object of V3.1 has **no working reference implementation**.

---

## 3. Feasibility per requirement

### 3.1 Does it run?

| Scene | Runs | Notes |
| :--- | :--- | :--- |
| V3 pearl snap | **Yes** | Renders a rotating snap from primitives |
| V3 shader | Partially | Real simplex-noise GLSL, no scene binding |
| V3.1 core | Yes | Same skeletal pattern |
| **V3.1 buckle** | **No** | Null-reference TypeError |
| V3.1 passage | Yes | No camera path implemented |

### 3.2 Dependencies

`MEASURED` — **three.js r125** (January 2021) from `ajax.googleapis.com`, global UMD build,
5 occurrences. Roughly 60 revisions behind current.

`INFERRED` — r125 predates modern colour management, `WebGLRenderer.outputColorSpace`, and
current `MeshPhysicalMaterial` capability. **It cannot deliver the specified materials.**
It must not be carried forward.

### 3.3 Are models, textures and shaders present?

**No.** 0 GLB, 0 glTF, 0 textures, 0 `.glsl` files. All geometry in the sketches is
**procedural primitives** — `CylinderGeometry`, `SphereGeometry`, `TorusGeometry`.

### 3.4 Are camera, lighting and materials documented?

| | Status |
| :--- | :--- |
| Camera | **Partial** — `PerspectiveCamera(35, …, 0.1, 1000)`, `position.z = 5` / `15`. No path, no keyframes, no FOV changes |
| Lighting | **Partial** — one `AmbientLight` + one `SpotLight`; V3 documents `angle 0.3`, `penumbra 1`, `decay 2`, `distance 50`. No IBL, no environment map |
| Materials | **Specified but not implemented** — see §4 |

---

## 4. The material gap

`OBSERVED` — `v3_1_belt_buckle_aperture_spec.md` requires **Brushed Silver, Oxidized
Copper, Dark Indigo Selvedge Denim, Tooled Leather, Prismatic Glass in Gunmetal, Mineral
Turquoise, Bone Enamel**, plus a displacement map and Fresnel edge lighting.

`MEASURED` — the code implements **four flat colours on `MeshPhongMaterial`**:
`0xa7a6a2`, `0x5E4033`, `0x1B2B45`, `0x0a0a0a`.

**Absent:** copper · turquoise · bone enamel · prismatic glass · stitching · engraving ·
all normal, roughness, metalness, displacement and environment maps.

> `INFERRED` — `MeshPhongMaterial` is a **legacy non-PBR** model. Brushed metal, tooled
> leather and selvedge denim **cannot be expressed in it at all.** Material credibility —
> the thing the brief asks about, and the thing the Creative North Star calls "material
> honesty at high resolution" — is **0% implemented**.
>
> This is also V1's lost principle resurfacing: *"CSS backdrops using subtle denim grain or
> leather texture noise rather than flat hex colors."* V1 was right, and three generations
> later the implementation is still flat colour.

Also note the geometry contradiction: the spec says *chamfered rectangle*; the code builds
*concentric tori*. See [04](04_V3_1_FRONTIER_ENGINE_AUDIT.md) §2.1 — conflict **C-08**.

---

## 5. What must be rebuilt, and what each surface should actually be

`INFERRED` — assessed per surface against `CLAUDE.md` §9 (*"WebGL must be justified per
surface, not assumed"*).

| Surface | Recommended mechanism | Reasoning |
| :--- | :--- | :--- |
| Cinematic Ignition | **Video + CSS**, poster-first | LCP-critical. Shipping 132–250 KB of Three.js before first paint is the worst possible allocation |
| Living Contact Sheet | **CSS + minimal JS** | It is a grid. Must be crawlable and fast |
| Image Becomes Film | **CSS/WAAPI, or a capped WebP frame sequence** | ≤ 60 frames, ≤ 80 KB/frame |
| Shoppable Film | **`<video>` + `<track kind="metadata">` + DOM buttons** | Canvas hotspots are keyboard-unreachable by construction |
| Four Worlds | **View Transitions + CSS** | Same-document VT is Baseline across all four engines |
| Flagship Homepage | **Server-rendered HTML + CSS** | SEO and INP contention |
| Midnight Rodeo | **GSAP ScrollTrigger + video** | Needs pinning and progress callbacks; CSS scroll-driven animation cannot pin and is Baseline Limited |
| **Belt Buckle Aperture** | **Pre-rendered video sequence first; WebGL only if interactivity proves necessary** | 8 states, ~7.1 s, deterministic. A video is cheaper, universally supported, and colour-managed |
| **Garment Portal / Anatomy** | **The one genuine WebGL candidate** — gated behind explicit user action | Delivers information a photograph cannot. Blocked on assets that do not exist |
| Camera Passage | **Pre-rendered video** | A fixed 6-transition camera move with no branching. Real-time buys nothing |
| Custom Atelier | **DOM form + server-composited preview** | State must be keyboard-operable and URL-serialisable |
| Living Cart | **Pure DOM** | Cinema never belongs at checkout |

> `INFERRED` — **Two of thirteen surfaces have a plausible real-time 3D case, and one of
> those is blocked on assets that were never produced.** The camera passage and the buckle
> — the two most cinematically ambitious sequences — are both **deterministic, non-branching
> sequences**, which is the textbook definition of something that should be a well-encoded
> video.

---

## 5a. Camera passage — revised recommendation after visual batch 3

`OBSERVED` — All four exported passage frames were inspected. They are **not four moments
of one camera move**. They are four unrelated artefacts:

| Frame | What it actually is |
| :--- | :--- |
| `8g_1` | A **category selector** with a targeting reticle |
| `8g_2` | A **screenshot of a window** containing a warehouse photograph, with the frame's own title in the title bar |
| `8g_4` | A **sci-fi environment board** with the frame title rendered into the image |
| `8g_8` | A **finished light commerce page** |

`OBSERVED` — Camera direction, object scale, lighting, colour ground and even *medium*
change between every adjacent pair. Three of eight steps (`8g_3`, `8g_5`, `8g_7`) were never
exported, and the one that was — `8g_6` — is an Accessories & Home category page.

> ### Revised recommendation: **REJECT AND REDESIGN**, not "pre-render as video"
> The earlier recommendation assumed a coherent camera move existed that could simply be
> rendered offline. **It does not.** There is no continuous sequence to pre-render — only
> four unrelated boards with three missing steps and no consistent spatial logic.
>
> **Pre-rendering requires something to render.** The passage would have to be *designed
> first* — storyboarded, with consistent camera, scale and lighting — and that is original
> art direction, not reconstruction.
>
> **If it is redesigned**, video remains the correct delivery form: the sequence is
> deterministic and non-branching, so real-time WebGL buys nothing and costs a 132–250 KB
> bundle floor. **But the design work comes first, and it has not been done.**

## 6. Raw Three.js or React Three Fiber?

`INFERRED` — **Neither is justified by the current evidence.**

`MEASURED` cost floor: three.js tree-shaken to seven symbols is **~132 KB gzip**; with R3F
it is **~250 KB gzip** — before any asset. Against a **≤180 KB total initial JS budget**
(`CLAUDE.md` §10), **R3F alone exceeds the entire budget.**

`RECOMMENDATION` — If a WebGL surface survives the video-first test, use **raw Three.js in
a lazily-imported route chunk**, never in the initial bundle, and never R3F unless a
second surface with genuine React state coupling appears. **No decision is approved here.**

---

## 7. Runtime risks

| Risk | Assessment |
| :--- | :--- |
| **Texture VRAM** | An 8K source (Media_02) is **~333 MiB with mipmaps** — beyond a mid-tier mobile GPU for one map. Cap at 2048², deliver KTX2/Basis |
| **Desktop GPU** | Low for the specified scenes |
| **Mobile GPU** | **High.** V3.1's own QA flags mobile WebGL init on older devices |
| **Bundle** | **Critical** — see §6 |
| **Context loss** | **Unhandled.** No `webglcontextlost` listener in any file |
| **Disposal** | **Unhandled.** No `dispose()`; infinite rAF with no visibility gate |
| **Reduced motion** | **Unhandled in code.** `prefers-reduced-motion` in 2 of 48 files |
| **Failure behaviour** | **Undefined.** No Tier 0 in the handoff's layer model |

---

## 8. Capability detection

`CLAUDE.md` §10 forbids tiering on `navigator.deviceMemory` or the Network Information API
— neither is supported in any version of Safari or Firefox, so tiering on them silently
promotes every iPhone to the top tier.

`RECOMMENDATION` — Tier on: **viewport**, **`hardwareConcurrency`**, a **WebGL capability
probe** (context creation + `MAX_TEXTURE_SIZE`), a **first-frame timing measurement**,
**explicit user mode choice**, and **`prefers-reduced-motion`**. Use `saveData` and
`deviceMemory` only to demote, never to promote.

**Tier 0 must render fully without a GPU.** The V3.1 layer model does not define one; it
must be added.

---

## 9. Verdict

`INFERRED` —

- **Reusable code: none.** Six sketches, one broken, all on a five-year-old library.
- **Reusable specification: substantial.** The buckle spec, state table, material list and
  narrative geometry are genuinely good direction.
- **Reusable assets: none.** Zero models, textures or shaders exist.
- **Most cinematic sequences should be video, not real-time 3D** — deterministic,
  non-branching, and far cheaper to ship correctly.
- **The one real WebGL candidate is Product Anatomy**, and it cannot start until 3D assets
  exist (OQ-13, D-08).
