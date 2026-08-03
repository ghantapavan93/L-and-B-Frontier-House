# LB — Video Edit Contract

Binds assembly, grade, encode and delivery for every moving image on the site. It
extends [LB_BUCKLE_INTEGRATION_CONTRACT.md](LB_BUCKLE_INTEGRATION_CONTRACT.md)
and never contradicts it.

---

## 1. Timeline standard

| Property | Value | Why |
| :--- | :--- | :--- |
| Frame rate | **24 fps, non-drop** | Matches the Blender master exactly; any conversion re-times the ignition |
| Colour | Rec.709, **AgX already applied in the render** | The sequencer must run view transform **Standard** or the grade lands twice |
| Duration | Exact frame counts, never "about" | 4.00 s = 97 frames; 10.00 s = 241 frames |
| Audio | **None.** No track, no silent track | `audio_codec = NONE` |
| Bit depth | 8-bit delivery from 16-bit intermediates | |

## 2. Cut points are contractual

The buckle segment ends on the canonical thread crossing the bottom edge —
**3.70 s desktop, 3.79 s mobile**, measured and recorded in
`assets/production/buckle/logs/motion-verification.json`. Any continuation joins
at 4.00 s on a thread already in motion and already leaving frame.

**No dissolve across that join.** A dissolve would soften the one element that
must stay continuous. Straight cut only.

## 3. Grade

Render-time lighting is the look. The grade may only:

- lift or lower overall exposure by ≤ ⅓ stop
- add film grain, fine, ≤ 2% amplitude
- add a vignette already implied by the lighting falloff

The grade may **not** re-colour the turquoise, warm the silver toward brass, lift
the black field, or add bloom — bloom is a composited Fog Glow at render time,
above the lit metal's threshold, and is already baked into the delivered frames.

## 4. Encode ladder

| Output | Codec | Container | CRF / quality | GOP |
| :--- | :--- | :--- | :--- | :--- |
| Primary | H.264 High | MP4 | CRF *high* | 12 |
| Modern | VP9 | WebM | CRF *high* | 12 |

`<source>` order is **WebM first, MP4 second** — browsers take the first they can
decode, and VP9 is smaller at equal quality. MP4 is the universal floor.

Faststart / moov-atom-first is required on MP4 so playback can begin before the
file completes.

## 5. Poster rules

1. Every video slot renders **complete** with the poster alone.
2. The poster is the frame that carries the whole message, **not** frame 1. For
   the ignition that is the fully-lit closed buckle at 1.40 s — a dormant first
   frame communicates nothing if the video never plays.
3. The poster must survive a **centred iOS play glyph**. In Low Power Mode iOS
   forces one and it cannot be hidden by CSS. Nothing load-bearing sits centre.
4. Poster is the LCP element, `fetchPriority="high"`. Video is never the LCP.
5. Poster declares intrinsic dimensions; the slot reserves aspect-ratio. CLS 0.

## 6. Motion obligations

| Case | Rule |
| :--- | :--- |
| `prefers-reduced-motion` | **No `<video>` element rendered at all.** Poster only. Not a downgrade to a plain grid — the surface stays complete |
| Loops, or runs > 5 s, un-initiated | Visible pause control, ≥ 24 × 24 px, always present |
| ≤ 5 s and non-looping | No pause control owed. The 4 s ignition is cut to this deliberately |
| Click-to-play | No autoplay obligations, but poster + captions + transcript still required |
| Decode or network failure | Falls back to poster; the section never empties |

## 7. Captions and transcript

Silent does not mean exempt. Every shipped video carries a
`<track kind="captions">` and a transcript route. For a film with no speech the
captions describe the absence and the visual beats — this is what a screen-reader
user relies on to know nothing was missed.

## 8. Naming

Lower-kebab only. **No dates. No price patterns** — `/\/\d{1,3}-\d{2}-[a-z]/` must
match nothing in any path, and the existing filename tests extend to every media
directory.

## 9. The gate

The structural test asserting **no `<video>` exists** may change only in the same
commit that adds poster, captions track, transcript route and pause behaviour.
Every delivered file is recorded in `src/content/media/official-media-manifest.json`
with provenance, SHA-256, dimensions, byte size, renditions and `ownerApproval`.
**Supply is not publication** — files render only once marked `approved`.

## 10. Budgets, CI-enforced

- Added client JavaScript: **0 KB**
- First Load JS stays **103 kB**
- Shop surfaces ≤ 1.5 MB · cinematic surfaces ≤ 4 MB
- LCP p75 mobile ≤ 2.0 s · INP p75 ≤ 150 ms · CLS p75 ≤ 0.05
- Tested on a mid-range Android, not a developer machine
