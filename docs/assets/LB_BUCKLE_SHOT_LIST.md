# L&B Buckle — Shot List

Camera distances are in buckle-widths (BW = the buckle's outer width). All hero shots sit
on the denim ground per 8C. Every still is delivered as WebP at 1920 / 1280 / 828, every
motion piece as MP4 + WebM + its own poster. Budgets are in the production brief §9.

## Lighting setup — one rig, all shots

Built from 8C's raking reveal and 8B's dormant key:

| Light | Spec |
| :--- | :--- |
| **Key** | Warm (3200 K) strip light, low angle (15–20° elevation), camera-left, raking across the relief so the rope twist, tooling and engraving throw long micro-shadows. This is the light that "reveals material" in 8C |
| **Rim** | Cool (5600 K) hard edge from upper camera-right at ¼ key intensity — separates the darkened silver from the dark field in 8B states |
| **Fill** | Near-zero. Dormant state runs at key ≈ 5%, rim only |
| **Bounce** | Warm card below camera for the copper step in macro shots only |
| **Emissive** | The engraving inlay is self-lit in S2/S4; no external light imitates it |

Background: denim ground fading to near-black vignette (#0c0b09). Grain is applied in the
page, not baked into renders.

## Stills

| ID | Shot | State | Camera | Output |
| :--- | :--- | :--- | :--- | :--- |
| S01 | **Dormant hero** — the 8B frame | S1 | Frontal, 5° pitch down, 2.6 BW distance, 35 mm-equiv | `buckle-dormant-{w}.webp` — the ignition poster |
| S02 | Dormant three-quarter | S1 | 30° yaw, 12° pitch, 2.4 BW | `buckle-dormant-34-{w}.webp` |
| S03 | **Illuminated hero** | S2 (draw complete) | As S01 | `buckle-lit-{w}.webp` |
| S04 | Macro — engraving | S2 | 0.55 BW on the monogram, key sweep mid-position | `buckle-macro-engraving-{w}.webp` |
| S05 | Macro — turquoise E stone | S2 | 0.35 BW, stone centred, bezel and matrix visible | `buckle-macro-stone-{w}.webp` |
| S06 | Macro — rope rim + chamfer | S1→S2 mid | 0.5 BW along the top edge, raking key | `buckle-macro-rim-{w}.webp` |
| S07 | Macro — copper step + stitch row | S2 | 0.5 BW lower-left quadrant | `buckle-macro-copper-{w}.webp` |
| S08 | Macro — leather tooling | S2 | 0.45 BW, tooling relief in raking light | `buckle-macro-leather-{w}.webp` |
| S09 | Opened plate | S3 (fully parted) | Frontal, 3.2 BW — the aperture standing open | `buckle-open-{w}.webp` |
| S10 | Routing-line hand-off | S4 (line at exit) | Frontal, 2.8 BW, framed low so the exit curve leads out of frame bottom-centre | `buckle-route-{w}.webp` — must composite over the live SVG exit path |
| S11 | Top-down | S1 | 90° overhead, 2.2 BW — for the mobile poster crop | `buckle-top-{w}.webp` |
| S12 | Mobile portrait hero | S2 | 4:5 crop of S03 recomposed, monogram upper third | `buckle-lit-portrait-{w}.webp` |

## Motion

All clips 24 fps, ≤ 5 s, no loops, first frame = the matching poster.

| ID | Clip | States | Camera | Duration | Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| M01 | **Ignition** — engraving draws, materials wake | S1 → S2 | Locked-off S01 framing; only light and emission move | 2.8 s (matches the shipped CSS draw: 2.4 s draw + 0.4 s settle) | `buckle-ignite.{mp4,webm}` + `buckle-dormant-1920.webp` poster |
| M02 | **Material reveal** — the 8C raking sweep | S2 held | Key sweeps left→right full travel; camera static | 3.5 s | `buckle-reveal.{mp4,webm}` |
| M03 | **Aperture** — the buckle parts | S2 → S3 | Slow push-in 2.6 → 2.0 BW as halves part; ends on the dark opening | 1.6 s | `buckle-open.{mp4,webm}` |
| M04 | **Route exit** — fibre leaves the buckle | S2 → S4 | Tilt down 12° following the exit curve to bottom-centre | 1.2 s | `buckle-route.{mp4,webm}` |
| M05 | Mobile ignition | S1 → S2 | S12 portrait framing | 2.8 s, 720 × 900 | `buckle-ignite-portrait.{mp4,webm}` |

**The full camera passage (through the opened buckle into the warehouse) is NOT on this
list.** It stays blocked until this proof is approved coherent, per the Phase 2 instruction
and the Phase 3 gate.

## Fallback matrix

| Condition | What ships |
| :--- | :--- |
| No media yet (today) | The live SVG proof — it remains the permanent floor |
| `prefers-reduced-motion` | Poster stills only (S01/S03/S12); no video is requested at all |
| Mobile | S12 portrait poster; M05 only on explicit interaction or where autoplay-muted is honoured; must read correctly under the iOS native play glyph |
| Save-data / slow connection | Posters only |
| Video element fails to load | The poster attribute — already the HeroMedia contract |

## Acceptance criteria for the renders

1. An orthographic front render of S01 overlays the approved SVG proof silhouette within
   ±1% of width.
2. The dormant frame is legible as a buckle in a 200 px thumbnail.
3. The four stones read as stones, not lights, in S03.
4. No frame anywhere contains a date, a word other than the monogram, a circular buckle, a
   badge, a reticle, or any vehicle.
5. M04's exit curve lands within 2% of the live SVG `ignition__thread-exit` path when
   overlaid at 1440 w.
6. Every poster carries the full meaning of its clip with the clip removed.
