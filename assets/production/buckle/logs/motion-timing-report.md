# Buckle ignition — timing, camera values and delivery

**Duration 4.00 s exactly** — 97 frames at 24 fps (96 intervals).

The motion stage never writes the master. It loads it, clears the state
keyframes, lays a continuous timeline over the *same* values, renders and exits.
The approved still states on disk are untouched, and every object end value below
is the approved one.

---

## 1. Beat sheet

| # | Beat | In | Out | Frames | Channel | Easing |
| :--- | :--- | ---: | ---: | :--- | :--- | :--- |
| 1 | Closed, dormant — held | 0.00 | 0.30 | 1–8 | key 0.09 W, fill 0.002 W | hold |
| 2 | Key rises to approved lit | 0.30 | 1.30 | 8–32 | `light_key_3200k.energy` → 1.8 W | bezier |
| 3 | **Monogram draws on** | 0.30 | 1.30 | 8–32 | emission wipe front, left → right | bezier |
| 4 | Lit closed — held | 1.30 | 1.45 | 32–36 | — | hold |
| 5 | **Halves lift toward camera** | 1.45 | 1.90 | 36–47 | `half_L/R.location.z` → +0.15 BW | bezier |
| 6 | Halves part outward | 1.75 | 3.10 | 43–75 | `location.x` → ∓0.55 BW | bezier |
| 7 | Halves yaw outward | 1.80 | 3.10 | 44–75 | `rotation_euler.y` → ±6° | bezier |
| 8 | Denim drops away | 1.60 | 2.80 | 39–68 | `denim_ground.location.z` → −0.90 BW | bezier |
| 9 | Seam rectangle out | 2.76 | 2.80 | 67–68 | `denim_seam_stitches.hide_render` | stepped |
| 10 | Plate recedes into the well | 1.90 | 3.30 | 47–80 | `core_grp.location.z` → −0.55 BW | bezier |
| 11 | Camera pulls to aperture framing | 1.30 | 3.10 | 32–75 | loc/rot/lens/focus | bezier |
| 12 | **Thread grows from the terminal** | 2.60 | 3.92 | 63–95 | `routing_line.bevel_factor_end` 0 → 1 | bezier |
| 13 | **End settle — camera only** | 3.10 | 4.00 | 75–97 | dolly, aim rise, bank | bezier, front-loaded 80% by 3.55 s |

Easing is bezier with AUTO_CLAMPED handles on every non-boolean channel. Those
handles cannot overshoot by construction, which is what rules out both mechanical
snapping and elastic settle. Visibility channels are stepped.

## 2. Camera values

Desktop and mobile are **separate compositions**, not one framing and a crop. The
leather plate is only fractionally narrower than a 9:16 frame at desktop
distances, so a centre crop can never hold the required horizontal safety.

Distances are in buckle-widths (BW = 92 mm). `rise` and `shift` move the aim along
the camera's own up and right axes.

### Desktop — 1920 × 1080

| Key | t | dist | lens | rise | roll | shift | f-stop |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hero (closed ¾) | 0.00–1.30 | 2.40 BW | 50 mm | 0 | 0° | 0 | f/4.0 |
| Aperture | 3.10 | 3.60 BW | 45 mm | 0 | 0° | 0 | f/5.0 |
| Settle | 4.00 | 3.45 BW | 45 mm | **38.0 mm** | **12°** | −7.5 mm | f/5.5 |

Rotation: hero `(12°, 0, −30°)`, aperture and settle `(17°, 0, −29°)`.

### Mobile — 1080 × 1920

Sensor fit VERTICAL, sensor height 20.25 mm.

| Key | t | dist | lens | rise | roll | shift | f-stop |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hero (closed ¾) | 0.00–1.30 | 6.50 BW | 50 mm | 59 mm | 0° | 0 | f/5.6 |
| Aperture | 3.10 | 5.80 BW | 45 mm | 70 mm | 0° | 0 | f/6.3 |
| Settle | 4.00 | 5.50 BW | 45 mm | **81.2 mm** | **15°** | 0 | f/7.1 |

Mobile sits further back throughout and rides the subject low. That buys the
horizontal safety a crop cannot, and leaves the upper frame as deliberate negative
space for HTML copy. The settle is still a slight tighten (5.80 → 5.50 BW), so the
end reads as a push rather than a retreat.

**Focal length is constant across each settle** — a dolly, never a zoom, so it
cannot read as a digital push-in.

### Why the settle rolls

At the approved three-quarter angle the leather plate's lowest point projects
**below** the canonical thread's tail. A level bottom edge therefore always
crosses the plate before it crosses the thread, and no amount of tightening or
vertical drift changes that ordering — the gap is invariant to both. The bank
reverses it: the tail swings down, the plate corner swings up. It is the only way
to put the thread off the bottom edge with the plate still whole, and it reads as
the camera leaning after the thread.

Mobile uses 15° rather than 12° because its wider frame needs a larger separation
to place the bottom edge between the two.

## 3. Acceptance — measured, not eyeballed

`logs/motion-verification.json`, projected through each camera. Values are
normalised frame coordinates; the thread measurement applies the growth
truncation, because the tail is the last part to appear and measuring the whole
spline would over-report its reach.

| Criterion | Desktop | Mobile |
| :--- | :--- | :--- |
| Duration 4.00 s / 24 fps | 97 frames | 97 frames |
| Thread crosses bottom edge | **3.70 s** | **3.79 s** |
| Crossing before 3.85 s | pass | pass |
| Plate fully visible, every sampled frame | pass | pass |
| Minimum horizontal safety around plate | 33.5% | **2.58%** (≥ 2% required) |
| Settling moment before the cut | 0.30 s | 0.21 s |

## 4. Reproduction

```
blender -b lb-buckle-master.blend -P build_buckle.py -- --stage verify
blender -b lb-buckle-master.blend -P build_buckle.py -- --stage motion --which landscape --samples 48
blender -b lb-buckle-master.blend -P build_buckle.py -- --stage motion --which mobile    --samples 48
blender -b -P build_buckle.py -- --stage encode --which landscape
blender -b -P build_buckle.py -- --stage encode --which mobile
blender -b -P build_buckle.py -- --stage poster
blender -b -P build_buckle.py -- --stage contact
blender -b -P build_buckle.py -- --stage endframes
```

Render: Cycles on OPTIX, 48 samples + OpenImageDenoise, AgX base contrast,
Fog Glow composited above the lit-metal threshold.

Encode: H.264/MP4 and VP9/WebM, CRF *high*, GOP 12, `audio_codec = NONE`. The
sequencer runs view transform **Standard** — the frames already carry AgX and
would otherwise be graded twice. Two Blender 5.x notes that cost a round each:
`SequenceEditor.sequences` is now `strips` and must be detected with `hasattr`
(an empty collection is falsy, so `or` falls through), and video output is gated
behind `image_settings.media_type = 'VIDEO'` before `FFMPEG` appears in the
`file_format` enum.

## 5. Unchanged by this work

No geometry, no materials, no silhouette, no lighting rig, no aperture travel or
yaw, no plate depth, no monogram timing, no easing model. The canonical thread
path is untouched — it is grown along its own spline, never extended or redrawn.
The ignition wipe nodes are added to the loaded master in memory and never saved.
