# L&B Buckle — 3D Production Brief

**Authority, in order:** Stitch V3.1 **Frame 8C** (Material Lighting Reveal — the material
truth) → Stitch V3.1 **Frame 8B** (Dormant Artifact — the dark state and the luminous
engraving) → the approved SVG proof in
[`src/ui/frontier-ignition.tsx`](../../src/ui/frontier-ignition.tsx) (the silhouette,
proportions and state choreography as shipped in Phase 2). Both frames were inspected as
images over Stitch MCP (`projects/15196412611531097008`), not from filenames or prose.

**What this asset is for.** The GLB is a **master for offline rendering** — posters, macro
stills and the pre-rendered transitions specified in the shot list. It is **not a runtime
deliverable**: Phases 1–2 ship zero WebGL by contract, and any future real-time use is
Phase 3 work gated on D-08. Deterministic, non-branching sequences ship as pre-rendered
video (CLAUDE.md §13a).

---

## 1. Silhouette — exact

**A scalloped rectangle. Never a circle, never a coin.**

Master proportions come from the approved proof (viewBox 320 × 240; silhouette spans
296 × 180 units):

| Property | Value |
| :--- | :--- |
| Aspect ratio, outer silhouette | **1.64 : 1** (W : H) |
| Physical reference scale | **92 × 56 mm** (a real trophy-buckle footprint; 1 proof unit ≈ 0.311 mm) |
| Corner treatment | **Two-tier scallop cluster at each corner** — an outer lobe stepping to an inner lobe, exactly the double-`Q` construction of the proof path (`Q26→24, Q10→12` offsets ≈ 5–6% of width per tier) |
| Edges between corners | Straight in silhouette; carry **rope-twist relief** per 8C, ~1.2 mm pitch, contained within the silhouette — the relief never changes the outline |
| Inner step | A second rounded-rectangle frame inset **6.5% of width** from the rim (the copper frame of the proof, stroke ≈ 2.5 units) |
| Central field | Rounded rectangle inset **14% of width** — the tooled-leather inset panel |

The proof's SVG path is the canonical 2D outline. Model the 3D silhouette so an orthographic
front render overlays the proof path within ±1% of width.

## 2. Relief and depth

| Property | Value |
| :--- | :--- |
| Overall depth at rim | **7% of width** (≈ 6.5 mm at reference scale) |
| Rim chamfer | **45° chamfer, depth 4% of width**, with a 0.4 mm fillet at both arrises — reads as a struck edge, not a machined one |
| Inner copper step | Raised **1.6% of width** above the leather field, top face chamfered 30° |
| Leather inset | Recessed **2% of width** below the copper step |
| Engraving depth | Monogram channel cut **1% of width** into the leather field, walls drafted 15° |
| Back face | Slightly domed (1.5% of width), with a plain bar-and-hook keeper — never rendered hero, must exist for the opened state |

## 3. The engraving

- **The mark is the script initials `L&B`** — the letterforms of the approved proof path,
  refined as hand-engraved script with entry/exit tapers. The proof's path is the layout;
  the modeller may smooth curvature but not redraw the letterforms.
- The channel doubles as the **light guide** for the illuminated state: model it as a
  separate inlay mesh (`engraving_inlay`) sitting 0.2 mm proud of the channel floor so it
  can carry an emissive material without affecting the dormant render.
- **Optional, owner-gated:** 8C shows a longhorn-skull concho, and the skull appears in the
  brand's own photo watermark. If the owner supplies their actual mark artwork, a skull
  concho may be added **behind** the monogram as a variant (`concho_variant` node, default
  hidden). Do not draw a skull from imagination — owner artwork or nothing.

## 4. Materials

Eight materials, all present in 8C. PBR metal/rough workflow.

| Slot | Material | Spec |
| :--- | :--- | :--- |
| `rim_silver` | **Brushed, darkened silver** | Base #8f8d88 → #4e4c49 gradient occupancy via curvature; anisotropic brush along the rope twist; roughness 0.38–0.55; metallic 1.0. In the dormant state it grades to near-black (#1c1a18) via the light rig, **not** a different material |
| `frame_copper` | **Oxidized copper** | Base #6e4226 with #c98a5e worn high edges (curvature-driven); roughness 0.5; metallic 1.0; verdigris kept to ≤3% area, in recesses only |
| `inset_leather` | **Tooled leather** | Warm chestnut #5a3a24; floral/scroll tooling per 8C at 0.5 mm relief in normal map; sheen from wax, roughness 0.55; **no basket-weave text, no words in the tooling** |
| `backing_denim` | **Denim backing** | Indigo twill #22344f → #131f31, 3/1 twill normal texture; the buckle sits on it in every hero shot (8C ground) |
| `stitch_thread` | **Visible stitching** | Bone #d9c5b2 saddle stitch, 2.4 mm pitch, running the perimeter of the leather inset and the denim seam — matches the proof's dash rows |
| `stone_turquoise` | **Four restrained turquoise details** | Cabochons at the proof's cardinal points: E + W ⌀ 3.1 mm, N + S ⌀ 2.5 mm; base #3d8f8a with #9adbd4 rim light and matrix veining ≤ 10%; bezel-set in silver. **Four. Not a ring of stones** |
| `stud_brass` | Brass studs | Only where 8C places them — flanking the keeper strap; ⌀ 2 mm domes; warm brass, roughness 0.45 |
| `engraving_inlay` | Luminous fibre | Dormant: near-black lacquer. Illuminated: emissive **#7fe0d6** core with #d6fff9 peak, emission masked to the channel; bloom is a render effect, never a texture |

## 5. States

Four states, matching the shipped proof's choreography. Each is a node-visibility /
material-variant configuration in the master file — one asset, four states.

| State | Definition |
| :--- | :--- |
| **S1 Dormant** (8B) | Low-key darkened silver, engraving unlit but legible as cut metal; denim ground almost swallowed by shadow; single cool top light |
| **S2 Illuminated** (8B→8C) | The monogram channel lights turquoise, core-to-tip, 2.4 s draw matching the shipped CSS timing; a warm raking key sweeps left→right revealing the materials (the 8C "material lighting reveal") |
| **S3 Opened** (aperture) | The buckle parts along the vertical centre seam behind the monogram: two rigid halves translate laterally ±55% of width with 6° outward yaw; leather inset and denim recede 20% in Z. **This is the aperture. It is a parting rectangle — never a dilating iris, never separating rings** |
| **S4 Routing line** | The lit fibre exits the monogram terminal (proof coordinates: from ≈ (216,160) sweeping to bottom-centre (160,240)), leaves the buckle and becomes the supply-chain routing line. The exit path must match the proof's `ignition__thread-exit` curve so the hand-off to the live SVG is seamless |

## 6. Explicitly rejected

Each of these has appeared somewhere in the corpus and is dead:

- **Coin geometry / circular token form** — the broken Three.js built concentric tori; frames 8D/8E/8F/8G-1/12C render a coin. The audit ruled the rectangle authoritative (CLAUDE.md §13a)
- **Sheriff-badge treatment** — no star, no badge points
- **Rifle-scope reticle** — no crosshair framing, no HUD targeting (the 8G-1 "aperture lock" reticle is not this object)
- **Fabricated dates — any date.** "EST. 1865" (mobile hub) and "Origin: 1870s American West" (8B caption strip) are both fabrications; the engraving carries the monogram and nothing else
- **Automotive imagery** — no pistons, no engine metaphor (12K)
- No text anywhere on the object other than the `L&B` monogram

## 7. GLB export requirements

| Requirement | Value |
| :--- | :--- |
| Format | glTF 2.0 binary (`.glb`), Y-up, metres; buckle width = 0.092 m |
| Geometry budget | ≤ **120 k triangles** total; hero faces quad-dominant before export |
| Compression | **Meshopt** (`EXT_meshopt_compression`) — not Draco; decoder cost is 28.6 KB vs 188 KB and geometry is < 1 MB (CLAUDE.md §10) |
| Node structure | `buckle_root` → `half_L`, `half_R` (S3 split), `engraving_inlay`, `stones[4]`, `keeper`, `concho_variant` (hidden), `denim_ground` |
| Animations | Three clips, baked, 24 fps: `ignite` (2.4 s), `open` (1.6 s), `route_exit` (1.2 s). No loops in the clips themselves |
| Materials | PBR metal/rough only; no KHR extensions beyond meshopt + `KHR_materials_emissive_strength` |
| File budget | GLB ≤ **2 MB** with textures external |

## 8. Texture requirements

| Requirement | Value |
| :--- | :--- |
| Source cap | **2048 × 2048 maximum** — one 2048² RGBA8 set already costs 20.8 MiB VRAM with mips (CLAUDE.md §10); the buckle gets ONE 2048 atlas, denim gets 1024 |
| Delivery | **KTX2 / Basis UASTC** for any Phase 3 runtime use; PNG-16 masters archived |
| Maps | Albedo, normal, roughness-metallic-AO (packed), emissive mask (engraving channel only) |
| Texel density | ≥ 12 px/mm on the engraving and stones; brush anisotropy authored in normal, not albedo |
| Naming | `buckle_{map}_{size}.ktx2` — **no dates, no price patterns in any filename** |

## 9. Performance budget (delivery, per CLAUDE.md §10)

| Deliverable | Budget |
| :--- | :--- |
| Poster WebP, 1920 w | ≤ 220 KB |
| Poster WebP, 1280 w | ≤ 140 KB |
| Poster WebP, 828 w (mobile) | ≤ 90 KB |
| Macro still, 1200 w | ≤ 150 KB each |
| Transition MP4 (H.264, 1080p) | ≤ 2.5 MB, ≤ 5 s |
| Transition WebM (AV1 preferred, else VP9) | ≤ 1.8 MB, ≤ 5 s |
| Mobile transition (720 portrait) | ≤ 1.5 MB |
| Frame-sequence alternative | ≤ 60 frames, WebP/AVIF, ≤ 80 KB/frame |
| Cinematic page total (everything on it) | ≤ 4 MB |
| Runtime JavaScript added by these assets | **0 KB** — posters and video slots only; the HeroMedia contract already exists |

Every transition must read correctly from its **first frame** (poster-first), and every
poster must survive a centred native play glyph (iOS Low Power Mode).
