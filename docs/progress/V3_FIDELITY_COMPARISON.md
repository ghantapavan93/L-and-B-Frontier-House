# V3 / V3.1 visual-fidelity comparison

**Sources used.** Stitch MCP resolved. Live project `projects/15196412611531097008` —
*L&B Frontier House Platform Synthesis*, updated 2026-08-01 — plus its three design systems.
Local exports in `stitch-export/` were used for screen-level composition.

---

## 0. The Design DNA conflict, resolved

The live project carries **three** design systems, and the one **applied to the project** is
not the one the audit documented.

| | Applied project theme — **"Modern Frontier"** | Library asset — "Modern Frontier V3" |
| :--- | :--- | :--- |
| Display | **Libre Caslon Text** 84/90 −0.02em | Playfair Display 84/90 |
| UI / body | **Inter** 18/28, 16/24 | Hanken Grotesk |
| Labels | Inter 12/16 **600** 0.1em | Hanken Grotesk 12/16 700 |
| Corners | **Sharp — 0px, everywhere** | 4px soft |
| Rust | **#8B3A3A** | #7E241F |
| Margins | **64px desktop**, 20px mobile | 64px / 20px |
| Section gap | **120px** | 80–160px |
| Depth | **Glassmorphism** — 20px backdrop blur, 70% Bone tint | Tonal layering, vellum |

**Resolution: the applied project theme wins.** It is the theme the V3 screens were actually
generated against, it is the most recently updated, and CLAUDE.md §2 puts Stitch V3 at
Level 3 as *the approved visual reference* — which is the project, not a library asset
sitting beside it.

**This answers D-07's display typeface question from the source itself.** Playfair Display
was labelled *"Substitute"* in V3's own `design.md`; the project's applied theme names
**Libre Caslon Text**, and Inter for UI. Both are OFL and self-hostable, which also clears
the "zero licensed font files" blocker in `docs/production/14`.

**Recorded as a conflict, not a silent choice.** The audit's C-02 resolution ("Hanken
Grotesk, DESIGN.md wins over prose") was correct against the *export*; the live project
supersedes it. `CLAUDE.md` §13a should be updated when the owner confirms.

---

## 1. Route-by-route

### Homepage

| | |
| :--- | :--- |
| **Current** | Photographic hero with scrim; centred wordmark; 4-up new arrivals; category tiles; ops panel. System-serif fallback type, 8px radii, 24px gutters, ~64–96px section gaps |
| **V3 reference** | Frame 6 — full-bleed cinematic hero, `display-xl` 84px Libre Caslon centred over media; **120px section gaps**; asymmetric two-column product-anatomy block with a floating product card; dark footer |
| **V3.1 enhancement** | Poster-first with an explicit still that carries the message alone; layered depth; mobile art direction |
| **Gap** | Type is a system fallback, not Libre Caslon; hero is ~78vh not full-viewport; rhythm is ~40% too tight; no grain; no asymmetry; no glassmorphic nav; corners rounded where V3 is sharp |
| **Change** | Self-host Libre Caslon Text + Inter · full-viewport hero at `display-xl` · 120px section rhythm · 2–3% grain overlay on all surfaces · glass header · **0px corners throughout** · asymmetric editorial block · Living Contact Sheet section |

### Living Contact Sheet

| | |
| :--- | :--- |
| **Current** | **Does not exist.** New arrivals is a conventional 4-up grid |
| **V3 reference** | Frame 2 — contact-sheet eruption; V2 Frame 2 is the stronger nine-cell expression (audit §13a) |
| **V3.1 enhancement** | Layered reveal; each frame is a shoppable entry point |
| **Gap** | The single biggest compositional absence. A catalogue grid where the design calls for a photographer's contact sheet |
| **Change** | Nine-cell asymmetric CSS-grid sheet with sprocket-strip framing, frame numbers in `label-caps`, every cell a real product link, scale variation across cells |

### New Arrivals

| | |
| :--- | :--- |
| **Current** | Facet sidebar + uniform grid; one lead card at double scale |
| **V3 reference** | Editorial drop with dated identity, large-scale imagery |
| **V3.1 enhancement** | Mobile carousel with depth |
| **Gap** | Filters compete with merchandise; grid is uniform; no drop identity |
| **Change** | Filters demoted to a quiet rail; merchandise scaled up; drop date as `label-caps` eyebrow; contact-sheet rhythm |

### Product Detail

| | |
| :--- | :--- |
| **Current** | Two-column, gallery left, facts right; rounded panels |
| **V3 reference** | Frame 8 — Garment Portal: editorial arrival, large imagery, spec labels in `label-caps`, product-anatomy cards |
| **V3.1 enhancement** | Layered arrival; sticky commerce rail |
| **Gap** | Reads as a spec sheet, not an arrival. Title too small; no editorial entry; panels rounded |
| **Change** | Full-bleed opening image; `headline-lg` 40px title; sticky buyer rail; sharp corners; spec labels |

### Wholesale Showroom

| | |
| :--- | :--- |
| **Current** | Prose page with a banner |
| **V3 reference** | Frame 11 — *Virtual Rack*, white cards, WHLSL/MOQ label-value rows, pack breakdown insets |
| **V3.1 enhancement** | `12f_4` — sells the assortment, gates pricing, shows no price |
| **Gap** | No rack, no assortment presentation, no Thread-to-Trade narrative |
| **Change** | Virtual Rack strip of real photography · Thread-to-Trade SVG stitch-line section · gate as `12f_4` |

---

## 2. Cross-cutting changes

| Item | Change |
| :--- | :--- |
| **Typography** | Libre Caslon Text + Inter, **self-hosted via `next/font`** — no CDN, no runtime external request |
| **Shape** | **0px corners everywhere.** The only circles are Pearl-Snap hardware |
| **Grain** | 2–3% monochromatic SVG noise on all background surfaces |
| **Glassmorphism** | Header: 20px backdrop blur, 70% Bone tint, so photography bleeds behind the UI |
| **Rhythm** | 120px section gap; 64px desktop margin |
| **Cards** | No borders. 4:5. Name in Inter Medium. Hover: 1.02 zoom |
| **Inputs** | Bottom border only |
| **Experience states** | Cinema · Balanced · Instant Shop as a real segmented control |

### Motion decision — CSS, not GSAP, in this pass

GSAP was evaluated and **deferred**. Every effect specified here — layered depth, the
contact-sheet reveal, stitch-line drawing — is achievable with CSS transforms,
`@supports (animation-timeline: scroll())` and SVG `stroke-dashoffset`, at **zero JavaScript
cost** and with a static fallback that is correct by construction.

Adding GSAP would introduce ~23 KB gzip plus a client boundary on routes that currently ship
none, for effects CSS already delivers. `docs/production/17` says GSAP is for **pinned scroll
choreography** — which belongs to the Phase 3 camera passage, not to this pass. When a pinned
sequence is actually built, GSAP is the right tool and the budget is there for it.

**Not implemented, and deliberately:** the broken exported camera passage, the circular coin
geometry, the broken Three.js, and any WebGL.

---

## 3. Outcome — 2026-08-02

Implemented and verified: **336 of 336 tests pass** (145 Vitest, 191 Playwright), build clean,
**First Load JS unchanged at 103 kB** — the entire pass shipped zero client JavaScript.

**Landed:** Libre Caslon Text + Inter self-hosted via `next/font` · 84px display scale ·
sharp corners everywhere · 2.5% grain overlay · glass sticky header with scroll-margin
reserved beneath it · 120px section rhythm · 64px desktop margins · Living Contact Sheet
(nine frames, sprockets, asymmetric scale, every frame a product link) · Thread-to-Trade with
a scroll-drawn SVG stitch line · asymmetric editorial splits with offset figures · CSS-only
2.5D depth drift · stitched-patch chips · bottom-border inputs · V3 hover grammar.

**Built but deliberately unmounted: the experience selector.** Resolving the state cookie in
a layout forced every route dynamic, which was measured to break two tested guarantees — the
designed 404 stopped server-rendering, and public routes lost shared cacheability. The
selector, the server action and all three CSS presentation states exist and are styled;
applying the attribute per visitor needs either a small client script or Partial
Prerendering, and that choice is recorded in `src/app/layout.tsx`'s comment rather than
slipped in. The site currently ships pinned to Balanced.

**Defects found by the pass itself:** the hero headline inherited a fixed 48px leading at
76px scale and overlapped (fixed with a 1.07 ratio); the baseline stabiliser jumped straight
to the bottom of the now-9800px page and left mid-page lazy images unloaded (fixed by
stepping); the "nothing is sticky" test was recording history rather than a requirement
(replaced with the real 2.4.11 assertions — only the header sticks, scroll room is reserved,
the grain never intercepts a pointer).

Baselines re-recorded once for the redesign, then verified stable on a second run.
