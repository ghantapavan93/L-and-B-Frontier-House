# Buckle proof — Aperture Pass

Scope was the S3 aperture state only. **No geometry, material, silhouette or
lighting-rig change** — every edit is a state keyframe or a camera. The approved
closed, front, three-quarter and illuminated renders are untouched, and the
silhouette check still returns w −0.025% / h −0.085%.

## The diagnosis

The old aperture read as a diagram for one structural reason: all three parts sat
on the same Z plane. The halves translated laterally and yawed but never left the
plane of the plate, the plate receded only 0.20 BW, and the denim seam row drew a
bright rectangle around the whole arrangement. Nothing occluded anything, so
nothing had depth.

## The depth ladder

The brief fixes the lateral travel (±55% of width) and the outward yaw (6°); both
are preserved exactly. What it leaves open is Z, and Z is the whole difference.

| Element | Aperture-state Z | Effect |
| :--- | :--- | :--- |
| `half_L` / `half_R` | **+0.15 BW** toward camera | swing out *and* forward — perspective and scale separation |
| `core_grp` (monogram plate) | **−0.55 BW** | sinks into a well behind the parted halves |
| `denim_ground` | **−0.90 BW** | deep dark surround that still catches the halves' shadows |
| `denim_seam_stitches` | hidden for this state only | the rectangle that made it read as a diagram |
| `routing_line` | now visible in aperture as well as S4 | exits the canonical terminal and leads out of frame |

The denim distance is a deliberate compromise. At −1.6 BW the gap went properly
black but took the occlusion cues with it, and occlusion is what actually sells
the separation. −0.90 BW keeps both.

## Cameras added

| Camera | Framing |
| :--- | :--- |
| `cam_aperture_34` | 3.6 BW, 45 mm, 17° pitch / −29° yaw, f/5 |
| `cam_aperture_macro` | 2.6 BW, 48 mm, f/13 — framed *across* the 64 mm gap, not onto the plate |
| `cam_route` | 3.6 BW, 40 mm, 21° pitch — shot-list S10, framed low so the exit curve runs out of frame bottom-centre |

Two framing facts worth keeping: parted, the assembly spans ~2.1 BW, roughly twice
the closed object, so distances must be set from the **opened** span or the halves
leave frame the instant the aperture works. And at close range a wide aperture
gives millimetres of depth — the close-up needs f/13 or it softens the very
separation it exists to show.

## One bug fixed

Making the routing thread visible in the aperture state by removing `"aperture"`
from its hidden list silently did nothing: under constant interpolation an unkeyed
frame inherits the previous key, so frame 20 kept frame 10's hidden value. Every
state now gets its own explicit key.

## Renders

`buckle-aperture-three-quarter-proof.webp` · `buckle-aperture-closeup-proof.webp` ·
`buckle-routing-handoff-proof.webp` · `buckle-aperture-compare-before-after.webp`
(left = pre-refinement, right = refined, same camera). `buckle-aperture-proof.webp`
was re-rendered on the original camera to serve as the comparison's right half;
the pre-refinement frame is preserved at `logs/aperture-before.webp`.

No clips, no integration, no changes to the approved states.
