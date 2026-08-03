# LB — Campaign Media Manifest

Governance for every moving or generated asset that is **not** owner-supplied
product photography. It extends the existing
`src/content/media/official-media-manifest.json` schema rather than replacing it.

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
