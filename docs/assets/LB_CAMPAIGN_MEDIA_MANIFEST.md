# LB — Campaign Media Manifest

Governance for every moving or generated asset that is **not** owner-supplied
product photography. It extends the existing
`src/content/media/official-media-manifest.json` schema rather than replacing it.

---

## 0. D-09 — ANSWERED

**Owner decision recorded 2026-08-03.** Generated campaign media is approved,
with a closed list of permitted subjects.

**Approved for:**

- the Blender buckle continuation
- abstract textile environments
- illuminated thread transitions
- atmospheric campaign plates
- non-literal material and lighting sequences

**Not approved for — and these do not become approvable by rewording a prompt:**

- sellable product photography
- fictional L&B garments
- altered models or faces
- showroom or facility claims
- manufacturing claims
- fabric or construction evidence

The two lists divide on a single principle: generated media may carry
**atmosphere**, and may never carry **evidence**. Anything a buyer could
reasonably read as proof of what a garment is, how it is made, or where — is out,
regardless of how abstract it looks.

### Required record, per generated asset

No generated asset renders publicly until every field below is filled. Missing
fields are a blocker, not a warning.

| Field | Notes |
| :--- | :--- |
| `generation.platform` | The service used |
| `generation.modelVersion` | Where the platform exposes it; `null` where it does not |
| `generation.date` | ISO |
| `generation.prompt` | Verbatim |
| `generation.negativePrompt` | Verbatim |
| `generation.sourceReferences[]` | The conditioning assets — for us, always our own renders |
| `licence.commercialUse` | Explicit status, not an assumption |
| `ownerApproval` | `pending` until the owner approves the specific output |
| `placement.route` | The route it renders on |
| `placement.section` | The section within it |
| `derivatives.desktop` / `derivatives.mobile` | Both required |
| `fallback` | The still that renders when the asset does not |

**No account credentials are stored** in the manifest, in the repository, or in
any log. The record identifies the platform and the model; it never identifies
the account or carries a key, and nothing in this pipeline needs one to be
committed.

`fallback` is not optional. Every generated asset is decoration over a surface
that must already be complete without it — the same rule the buckle ships under.

---

## 1. Provenance classes

| Class | Meaning | Renders when |
| :--- | :--- | :--- |
| `owner-supplied` | Given to us by Lucky & Blessed | `ownerApproval: 'approved'` |
| `blender-master` | Rendered by us from an object we designed | `ownerApproval: 'approved'` |
| `generated-campaign` | Produced by a generative model | `ownerApproval: 'approved'` **and** `licence.checked: true` |
| `licensed-stock` | Third-party, licensed | `ownerApproval: 'approved'` **and** `licence.checked: true` |

**Supply is not publication.** A file on disk with a manifest row renders nothing
until its approval state says so. This is already enforced for photography and
extends unchanged to video.

## 2. Required fields per entry

```
sourcePath        original master, never served
describes         plain-language description — becomes alt text
provenance        one of the four classes above
addedOn           ISO date
sha256            of the master
width, height     of the master
byteSize
renditions[]      { width, format, file, byteSize }
poster            required for every video entry
captions          required for every video entry
transcriptRoute   required for every video entry
ownerApproval     'pending' | 'approved' | 'withheld'
withheldReason    required when withheld — a sentence, not a code
licence           { checked, tool, modelVersion, terms, checkedOn }  (generated/stock only)
```

`licence` is absent, not null, for owner-supplied and Blender masters. There is no
licence question to answer for an object we designed and rendered ourselves.

## 3. Delivered — buckle ignition

| Field | Value |
| :--- | :--- |
| Provenance | `blender-master` |
| Masters | `assets/production/buckle/blender/lb-buckle-master.blend`, frame sequences under `logs/motion-frames/` |
| Exports | `lb-buckle-ignition-{desktop,mobile}.{mp4,webm}`, `lb-buckle-poster-{desktop,mobile}.webp`, `lb-buckle-motion-contact-sheet.webp` |
| Duration | 4.00 s, 97 frames, 24 fps |
| Audio | none |
| Captions | **outstanding** — required before any `<video>` ships |
| Transcript route | **outstanding** — same gate |
| Pause control | not owed: ≤ 5 s and non-looping, by design |
| `ownerApproval` | `approved` (design, materials, aperture and motion approved in review) |

The 4-second cut is deliberately under the WCAG 2.2.2 five-second threshold and
non-looping, so it can autoplay without owing a pause control. **The 10-second
hero film loops and therefore does owe one** — that obligation arrives with the
continuation, not with this asset.

## 3a. Registered — hero continuation, candidate 1 — **REJECTED ON VALIDATION**

Both files below are registered so they are tracked, not so they are considered.
They were validated frame by frame against
[`LB_VIDEO_GENERATION_PROMPTS.md`](LB_VIDEO_GENERATION_PROMPTS.md) and **failed
its hardest rule**. They render nowhere and must not be re-submitted without
regeneration.

| Field | `lb-hero-continuation-desktop.mp4` | `lb-hero-continuation-mobile.mp4` |
| :--- | :--- | :--- |
| `sourcePath` | `assets/source/campaign/lb-hero-continuation-desktop.mp4` | `assets/source/campaign/lb-hero-continuation-mobile.mp4` |
| `provenance` | `generated-campaign` | `generated-campaign` |
| `addedOn` | 2026-08-03 | 2026-08-03 |
| Measured | 1280 × 720 · 144 frames · 24 fps · 6.000 s · 1.42 MB | 720 × 1280 · 121 frames · 24 fps · **5.042 s** · 4.19 MB |
| Required | 1920 × 1080 · 6.00 s | 1080 × 1920 · 6.00 s |
| `describes` | Turquoise thread travelling across denim **garments** | As desktop, portrait |
| `ownerApproval` | **`withheld`** | **`withheld`** |
| `withheldReason` | Depicts generated denim garments — a jacket and jeans, with pockets, plackets, belt loops, rivets and a branded shank button. D-09 does not approve generated media for fictional L&B garments, and the prompt contract's first rule is absolute: *"Never generate a garment. Not as hero, not as background, not blurred."* Also under-resolution and, on mobile, 0.96 s short. | Identical failure, more explicit: the opening frame is a denim jacket with an embossed metal shank button reading as branded hardware. |
| `licence.checked` | `false` — not pursued; the asset fails before licensing matters | `false` |
| Renders | **Never** | **Never** |

**Why `withheld` rather than `pending`.** `pending` means *awaiting an owner
decision*. The owner has already made this decision: D-09 excludes fictional L&B
garments, and these clips are made of them. Filing them as `pending` would invite
a second review of a question that is closed, and would leave assets one approval
click away from rendering generated apparel beside real SKUs.

**Private review edits** — for judging the defect in motion only, never for
publication:
`assets/production/buckle/renders/review/lb-hero-review-desktop.mp4` (10.000 s) ·
`lb-hero-review-mobile.mp4` (9.042 s). QA stills:
`assets/production/buckle/logs/qa-frames/`.

---

## 3b. Registered — hero continuation, candidate 2 — **BLENDER, PASSES CONTRACT**

Candidate 1 was rejected because a generative model put garments in an abstract
brief. Candidate 2 removes the possibility rather than re-forbidding it: the
scene is authored geometry — 312 individual strands suspended in space with air
between them — so there is **no cloth surface anywhere in it**. A pocket or a
placket is not prohibited here, it is unrepresentable.

| Field | Desktop | Mobile |
| :--- | :--- | :--- |
| `sourcePath` | `assets/source/campaign/lb-hero-continuation-desktop.{mp4,webm}` | `…-mobile.{mp4,webm}` |
| `provenance` | **`blender-master`** | `blender-master` |
| Measured | **1920 × 1080 · 144 frames · 24 fps · 6.000 s** · 4.36 MB / 2.34 MB | **1080 × 1920 · 144 frames · 24 fps · 6.000 s** · 4.83 MB / 3.15 MB |
| Built from | `blender/lb-fibre-field.blend`, `scripts/build_fibre_field.py`, seed 20260803 | same scene, separate camera — **not a crop** |
| `licence` | absent — we authored and rendered it | absent |
| `ownerApproval` | `pending` | `pending` |

**Provenance is `blender-master`, not `generated-campaign`.** No generative model
touched it, so the D-09 licence record does not apply and there is nothing to
license. This is the same class as the buckle.

### Validation, frame by frame

| Check | Result |
| :--- | :--- |
| Uninterrupted turquoise-thread continuity | **pass** — one strand, present in every frame |
| No people, garments, facilities, text, logos, dates | **pass** — no such geometry exists in the scene |
| No altered buckle or monogram | **pass** — neither appears; the cut hands off at 4.00 s |
| No invented products | **pass** |
| Premium textile atmosphere | **pass** — indigo field, restrained copper, 3200 K rake, cool rim |
| Clean final negative space | **pass** — field clears by frame 144, fibre settles lower-centre |
| Exactly one turquoise fibre | **pass** |
| Duration 6.00 s / 24 fps | **pass**, both |
| Native resolution, generated separately | **pass**, both |

### Ten-second review edits

`renders/review/lb-hero-10s-desktop.mp4` · `lb-hero-10s-mobile.mp4` — both
**10.000 s**, straight cut at 4.00 s, no dissolve. Private review only.

### Revision 2 — material fidelity pass (owner-approved to proceed)

Candidate 2's first render passed the contract but not the quality bar. Three
fixes, re-rendered at 80 samples:

- **NURBS, not poly splines.** A poly spline renders its control points as
  literal corners, so the field read as bent wire — the clearest "this is CGI"
  tell in the frame. Order-4 NURBS interpolates a smooth curve through the same
  points, and the strands now hang the way suspended fibre hangs.
- **Tapered strands.** Real thread is not a constant-diameter rod. One shared
  taper profile runs each strand's radius down toward both ends so fibres resolve
  into the dark instead of stopping dead. Shared across all 312 strands, so it
  costs one datablock rather than 312. The luminous fibre keeps its gauge — a
  proportional taper would have thinned a quarter of its visible length.
- **Fibre shading.** Full sheen with a cool tint plus a little subsurface on
  indigo and bone. Flat diffuse on fine cylinders is what reads as plastic
  tubing at macro scale.

Measured after revision: desktop 3.82 MB / 1.92 MB, mobile 4.15 MB / 2.55 MB.
Duration, frame rate, resolution and every contract check unchanged and still
passing. Render 2040 s + 2007 s.

### Remaining limitation

The luminous fibre still reads slightly ribbon-like when close to edge-on, since
it is a beveled curve rather than a lit volume. It does not breach any contract
rule. If it matters at final grade, the fix is a thin emissive volume rather than
more bevel segments.

---

## 4. Pending — campaign plates

Every entry below is `ownerApproval: 'pending'` and `licence.checked: false`.
None may render.

| Id | Describes | Provenance | Blocked on |
| :--- | :--- | :--- | :--- |
| `thread-fall` | Luminous fibre descending through darkness | `generated-campaign` | D-09 |
| `woven-field` | Macro traverse of indigo textile structure | `generated-campaign` | D-09 |
| `field-opening` | Woven field lifting to reveal clean space | `generated-campaign` | D-09 |
| `atmosphere-plate` | Warm horizon band, no landscape features | `generated-campaign` | D-09 |
| `indigo-abstraction` | Indigo and bone fibre, extreme macro | `generated-campaign` | D-09 |

**Deliberately absent, and to stay absent:** any garment, any person, any
facility, any storefront, any dated or numbered artwork.

## 5. Owner-supply register

| Item | State |
| :--- | :--- |
| Catalogue at editorial resolution | **18 of 31 assets flagged `needsHigherResolution`**; sources are 360 × 540 |
| Girls photography | Missing — products on placeholders |
| Accessories & Home photography | Missing — products on placeholders |
| Material macro set | Missing — the material-honesty thesis, must be photographed, cannot be generated |
| Boutique / partnership imagery | Missing |
| Showroom or market-booth still | Missing |

## 6. Withheld, with reasons preserved

Four owner-supplied assets are withheld and their reasons are recorded verbatim in
the JSON manifest. They are kept as originals, not optimised, not published.
The reasons are substantive, not procedural: a time-bound promotional claim with a
discount code this project has no authority to make; third-party payment branding
computing on an un-gated pack total; a byte-identical duplicate; and a hero video
that would need a pause control, poster and captions before it could ship.

**Do not silently un-withhold any of them.** Each requires the owner decision its
reason names.

## 7. Audit rule

Any asset that cannot name its provenance class, its approval state and — where
applicable — its licence check **does not ship**. There is no fifth class and no
temporary exemption. If a file appears in a media directory without a manifest
row, that is a defect, not a shortcut.
