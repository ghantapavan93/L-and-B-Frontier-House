# L&B Buckle — Integration Contract

How the delivered assets enter the application. **No application code changes ship with
this document** — it binds the future integration so the assets drop in without redesign.

---

## 1. What the runtime receives — and what it never receives

| Runtime receives | Runtime never receives |
| :--- | :--- |
| WebP posters and macro stills | **The GLB** — it is an offline render master. Phases 1–2 ship zero WebGL bytes; any real-time use is Phase 3, gated on D-08 |
| MP4 + WebM transitions with poster-first delivery | Texture sources, KTX2, blend files |
| The existing SVG proof (already shipped, stays as the floor) | Any JavaScript added on behalf of these assets — the budget for this integration is **0 KB client JS** |

## 2. File layout

```
assets/source/buckle/            ← untouched masters: GLB, KTX2, PNG-16, project files
public/media/buckle/
  buckle-dormant-{828,1280,1920}.webp
  buckle-lit-{828,1280,1920}.webp
  buckle-lit-portrait-{828,1280}.webp
  buckle-macro-{engraving,stone,rim,copper,leather}-{828,1280}.webp
  buckle-open-{828,1280,1920}.webp
  buckle-route-{828,1280,1920}.webp
  buckle-ignite.{mp4,webm}
  buckle-ignite-portrait.{mp4,webm}
  buckle-reveal.{mp4,webm}
  buckle-open.{mp4,webm}
  buckle-route.{mp4,webm}
  buckle-ignite.vtt              ← captions track (required before any video ships)
```

Naming rules are load-bearing: **no dates, no price patterns** (`/\d{1,3}-\d{2}-/` must
never match), lower-kebab only. The existing filename tests extend to this directory.

## 3. Manifest and approval

Every delivered file is recorded in `src/content/media/official-media-manifest.json` under
`ownerApproved`, same shape as the photography: provenance, SHA-256, dimensions, byte size,
renditions, `ownerApproval`. **Supply is not publication** — files render only once marked
`approved`, exactly as the photography governance already enforces, and the same tests
cover them.

## 4. Consumption points

| Surface | Integration |
| :--- | :--- |
| **Frontier Ignition** | The SVG proof remains the structural layer. When posters are approved: S01 becomes a background plane behind the SVG (`<picture>`, art-directed portrait via S12). When M01 is approved **and** carries captions + poster: the `HeroMedia` component replaces the static plane — its API (poster, desktop/mobile sources, captions, transcript, failure→poster) already exists and is unused by design |
| Ignition thread | Unchanged — the live SVG draw stays; M01 is the richer replacement only when motion is welcome |
| S4 hand-off | `buckle-route` must visually resolve into the existing `ignition__thread-exit` SVG curve; acceptance is the ±2% overlay in the shot list |
| Thread-to-Trade | S06/S07/S08 macros may replace the two abstract swatches **only if** the owner approves describing them as the buckle's own materials — they depict the artifact, not a facility, so no location claim arises |
| Wholesale showroom | S03 may sit in the showroom hero rotation; no other change |
| PDP | Not used — product pages carry product photography only |

## 5. Motion and accessibility obligations (existing tests enforce these)

- **Poster-first, always.** Every video slot renders complete with the poster alone.
- **`prefers-reduced-motion`:** posters only; no video element is rendered at all. This is
  the shipped HeroMedia behaviour, not new work.
- Autoplay, if ever enabled, is muted + `playsinline`, and any sequence that **loops or
  exceeds 5 s** requires the visible pause control — M01–M05 are cut ≤ 5 s and non-looping
  precisely so the ignition can run once without owing one; a looping ambient use would
  change that obligation and must add the control.
- Captions track and a transcript route are prerequisites for shipping any video: the
  structural test that currently asserts **no `<video>` exists** is only allowed to change
  in the same commit that adds captions, poster, pause behaviour and a transcript.
- The buckle never carries text content: it stays `aria-hidden` decoration inside a section
  whose real content is the actions and the h1 below. Alt text on posters describes the
  object ("a scalloped rectangular western belt buckle…") — never a date, never a slogan.

## 6. Performance gates (CI-enforced budgets)

| Gate | Value |
| :--- | :--- |
| Added client JavaScript | 0 KB — First Load JS stays 103 kB |
| Ignition route page weight with posters | ≤ 1.5 MB (shop-surface budget — the homepage is a commerce surface first) |
| With M01 playing (cinematic allowance) | ≤ 4 MB total |
| LCP element | Remains the poster `<img>`/`<picture>`, `fetchPriority="high"`; video never becomes the LCP |
| CLS | Posters declare intrinsic dimensions; the slot reserves aspect-ratio — 0 shift |

## 7. Explicitly rejected at integration time

The rejections are not only a modelling rule — they are integration assertions:

- No coin, token, badge, reticle or automotive frame may be delivered "as an extra" and
  wired in; the content-integrity tests (`EST. 1865`, `1870s`, circular geometry markers)
  stay in force and extend to alt text, filenames and captions of these assets.
- The broken exported Three.js is never imported, adapted or "fixed" — Phase 3 starts from
  the GLB master and this contract, not from that file.
- No WebGL enters Phases 1–2 under any framing (preview, teaser, flag).

## 8. Acceptance sequence

1. Assets delivered into `assets/source/buckle/` + `public/media/buckle/`.
2. Manifest entries added, `ownerApproval: 'pending'`.
3. Owner reviews stills against Frames 8B/8C and the SVG proof overlay; approves in the
   manifest.
4. Posters wired (zero JS); `npm run verify` green, including the extended filename and
   content-integrity tests.
5. Video wired behind HeroMedia **with** captions, transcript, pause obligations; the
   no-`<video>` test updated in the same commit; verify green.
6. Only after 1–5: the Phase 3 camera-passage conversation may open, against D-08.
