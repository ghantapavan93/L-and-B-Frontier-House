# LB — 10-Second Hero Film

The homepage's automatic, silent, cinematic entry. **Ten seconds, no audio, no
narrative that requires sound, and complete as a still if it never plays.**

Authority: [LB_CINEMATIC_ASSET_PRODUCTION_PLAN.md](LB_CINEMATIC_ASSET_PRODUCTION_PLAN.md) ·
[LB_BUCKLE_INTEGRATION_CONTRACT.md](LB_BUCKLE_INTEGRATION_CONTRACT.md) ·
CLAUDE.md §8 §9 §10 §12.

---

## 1. Structure

| Segment | Time | Source | Status |
| :--- | :--- | :--- | :--- |
| **A — Ignition** | 0.0 – 4.0 s | `assets/production/buckle/exports/lb-buckle-ignition-{desktop,mobile}.{mp4,webm}` | **Delivered.** Blender master, owner-approved |
| **B — Thread passage** | 4.0 – 7.4 s | Generated continuation, image-conditioned on our own render | Blocked on D-09 licensing |
| **C — Arrival** | 7.4 – 10.0 s | Owner-approved L&B campaign photography, animated only by a slow push | Blocked on owner supply at editorial resolution |

Segment A already ends on the exact frame segment B must begin from: the canonical
turquoise thread crossing the bottom edge at 3.70 s (desktop) / 3.79 s (mobile),
running down and out of frame. **That crossing is the cut point.** The continuation
inherits a thread already in motion, already leaving, already off-frame-bottom —
so the join needs no dissolve and no camera cheat.

## 2. Segment B — the thread passage (4.0 – 7.4 s)

The thread is the only continuous object across the whole ten seconds. It is the
brand's through-line and the one element that may never be re-invented by a
generator.

- **4.0 – 5.2 s** — the thread falls through darkness. Indigo fibre and bone
  stitching resolve around it as abstract texture, never as a garment.
- **5.2 – 6.4 s** — the thread runs horizontally through a field of woven
  structure: warp, weft, selvedge edge. Abstract at all times. **No mill, no
  factory, no facility** — those would be a manufacturing claim the brand has not
  evidenced (OQ-04) and would contradict verified vertical integration.
- **6.4 – 7.4 s** — the thread lifts and the field opens into the first real
  photograph.

**Hard constraint.** Segment B may depict only two things: the buckle artifact
world and abstract atmosphere. No people, no hands, no faces, no garments framed
as product, no materials framed as *our* materials, no interiors framed as ours.

## 3. Segment C — arrival (7.4 – 10.0 s)

Owner-approved photography only, from
`src/content/media/official-media-manifest.json` where `ownerApproval:
'approved'`. Motion is a slow push or a held frame — **never a generated
extension of a real photograph**, because that fabricates product truth.

Ends on a held frame that is also the poster: the composition must survive being
frozen, because on a failed or blocked autoplay that frozen frame is the entire
hero.

## 4. Accessibility and autoplay obligations

The ten-second cut **loops** and therefore **exceeds five seconds of
user-uninitiated motion**, which triggers WCAG 2.2.2 Pause, Stop, Hide at Level
**A**.

| Obligation | Implementation |
| :--- | :--- |
| Visible pause control | Required, always present, not hover-revealed, ≥ 24 × 24 px |
| `prefers-reduced-motion` | **No `<video>` element rendered at all.** Poster only. This is existing `HeroMedia` behaviour |
| Autoplay | Muted, `playsinline`, `preload="metadata"` |
| Captions | Silent film with no speech still ships a `<track kind="captions">` describing nothing-spoken, plus a transcript route |
| iOS Low Power Mode | Autoplay is disabled and a native play glyph is forced centre-frame and **cannot be hidden by CSS** — every poster must be designed to survive it |
| Failure | Any load or decode error falls back to the poster; the section never empties |

**The buckle stays `aria-hidden` decoration.** The section's real content is the
h1 and the commerce actions beneath it. Alt text describes the object — never a
date, never a slogan.

## 5. Performance budget

| Gate | Value |
| :--- | :--- |
| Added client JavaScript | **0 KB.** `HeroMedia` already exists and is already tested |
| LCP element | The poster `<img>`, `fetchPriority="high"` — video never becomes LCP |
| CLS | 0 — poster declares intrinsic dimensions, slot reserves aspect-ratio |
| Homepage weight, poster only | ≤ 1.5 MB (it is a commerce surface first) |
| Homepage weight, film playing | ≤ 4 MB |
| Encode target | ≤ 2.2 MB for the 10 s desktop cut, ≤ 1.4 MB mobile |

## 6. Delivery ladder

```
public/media/hero/
  lb-hero-10s-desktop.{mp4,webm}      1920x1080, 24 fps
  lb-hero-10s-mobile.{mp4,webm}       1080x1920, 24 fps
  lb-hero-poster-desktop.webp         {828,1280,1920}
  lb-hero-poster-mobile.webp          {828,1280}
  lb-hero-10s.vtt                     captions, required before any video ships
```

Filenames: lower-kebab, **no dates, no price patterns** — `/\/\d{1,3}-\d{2}-[a-z]/`
must match nothing. The existing filename tests extend to this directory.

## 7. Gate

The no-`<video>` structural test may only change in the **same commit** that adds
poster, captions, transcript route and pause control. Segments B and C cannot be
produced until D-09 (generated-media licensing) and owner photography supply are
resolved. **Segment A ships independently of both.**
