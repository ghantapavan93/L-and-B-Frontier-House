# L&B — Cinematic Asset Production Plan

From "good frontend" to fashion-house. The structure is finished and tested (360/360); what
remains is asset quality. This plan produces the three asset classes that close the gap —
the buckle artifact, the hero film, the editorial still set — and binds how they re-enter
the site. It extends, and never contradicts, the three buckle documents already in this
directory.

**Standing rules that bind every asset here:**

- Nothing is copied from any third-party brand. Style is described in adjectives, never in
  competitor names.
- Owner-approved Lucky & Blessed photography is used wherever it exists.
- **Generated media may depict only two things: the buckle artifact world (an object we
  designed) and abstract atmosphere.** It may never depict people, garments presented as
  product, materials presented as *our* materials, or facilities presented as *our*
  facilities — those are photography, or they do not exist. This is the "no invented
  people / no invented product facts / material honesty" line from CLAUDE.md §12 drawn
  through generative tooling.
- Generated output ships only after owner approval **and** a licensing check (D-09), and is
  recorded in the manifest with a `generated-campaign` provenance that requires both.
- No date, badge, coin, reticle, gun or vehicle appears anywhere, in any asset, ever.
- 3D is an **offline production asset**. Runtime receives WebP/MP4/WebM and 0 KB of new
  JavaScript.

---

## A. What is missing now

| Asset | Current state | Gap |
| :--- | :--- | :--- |
| **Buckle artifact** | Shipped SVG proof — correct form, flat rendering | The finished object: metal, leather, stone, light |
| **Hero film** | Poster-only HeroMedia slot, wired and tested | The film itself |
| Product photography | 27 approved shots at **360×540** | Resolution — soft at editorial scale; flagged `needsHigherResolution` |
| Material macros | Two honest abstract swatches in Thread-to-Trade | Real macro photography (owner shoot — cannot be generated without lying) |
| Girls / Accessories | 4 products on placeholders | Owner photography |
| Craft / warehouse world | Absent | Owner photography, Phase 2 media plan |

The first two are producible now, by us. The rest are owner-supply items already recorded
in `docs/production/14`.

## B. Asset production plan

Order of operations — each step feeds the next:

1. **Buckle master in Blender** (§C). One asset, four states, three baked animation clips.
   Output: the 12 stills + 5 clips of `LB_BUCKLE_SHOT_LIST.md`, plus 4 clean renders at
   2048² to serve as image-conditioning anchors for step 2.
2. **Hero film, hybrid method** (§D). Not one text-to-video roll of the dice: the Blender
   renders are the first/last frames of each generated shot (image-to-video conditioning),
   so the artifact on screen is *our* object in every frame that matters. Generated frames
   supply atmosphere between anchors. Assembly, grade and grain happen in an editor;
   exports follow the ladder in the integration contract.
3. **Editorial stills** (§E). Generated buckle-world and atmosphere plates; simultaneously
   hand the owner the one-day **real macro shoot list** (denim twill, buck-stitch, pearl
   snap, turquoise, silver hardware) — the material-honesty layer that must not be faked.
4. **Integration** (§F) strictly through the existing HeroMedia slot, manifest governance
   and CI budgets.

Tooling: Blender 4.x + Cycles → `gltfpack` (meshopt) → image-conditioned video generation →
NLE for assembly → `ffmpeg` for the delivery ladder → `sharp` for poster renditions.

## C. Blender production brief

**Scene.** Units metric, 1 unit = 1 mm. Buckle outer width **92 mm** (aspect 1.64:1, height
≈ 56 mm). 24 fps. Colour management **AgX, base contrast** — the warm-key look is lit, not
graded in.

**Silhouette — import, do not redraw.** The canonical outline and monogram are the two SVG
paths in [`src/ui/frontier-ignition.tsx`](../../src/ui/frontier-ignition.tsx): the
silhouette path (`M42 30 Q26 30 24 46 …`), the monogram path (`M96 158 C92 108 …`) and the
exit-thread path (`M216 160 C250 178 …`). Import as curves (SVG import, 1 proof-unit =
0.311 mm), then:

1. Silhouette curve → mesh, solidify to 6.5 mm, custom bevel profile: 45° chamfer 3.7 mm
   with 0.4 mm fillets both arrises.
2. **Rope rim**: torus-section profile swept along an inset of the silhouette curve, twisted
   ~1.2 mm pitch (Curve modifier + array of a twisted segment). Relief only — the outline
   never changes.
3. **Copper step**: inner rounded-rect curve (6.5% inset), extrude 1.5 mm, 30° top chamfer.
4. **Leather inset**: recessed panel; tooling as a sculpted/normal-baked scroll pattern
   ≈0.5 mm relief. No words, no basket-weave lettering.
5. **Engraving**: monogram curve → boolean-cut channel 0.9 mm deep, 15° drafted walls;
   duplicate the curve as `engraving_inlay`, a 0.4 mm round-profile tube seated 0.2 mm
   proud of the channel floor (the light guide).
6. **Stones**: four bezel-set cabochons at the cardinal points from the proof (E/W ⌀3.1 mm,
   N/S ⌀2.5 mm) — squashed UV spheres, silver bezels.
7. `half_L` / `half_R` split along the vertical centre seam for the aperture; plain
   bar-and-hook keeper on the back; `concho_variant` empty (owner artwork only, default
   hidden); denim ground plane 400 × 300 mm.

**Shading** (values from `LB_BUCKLE_3D_PRODUCTION_BRIEF.md` §4). Silver: anisotropic brush
along the twist, roughness 0.38–0.55, darkened via Pointiness/AO mix toward #1c1a18 in
recesses. Copper: #6e4226 body, #c98a5e curvature-worn edges, verdigris ≤3% in recesses.
Leather: #5a3a24, wax sheen 0.55 roughness. Denim: 3/1 twill normal, #22344f→#131f31.
Stitch: bone #d9c5b2 saddle stitch, 2.4 mm pitch, geometry not texture. Inlay: black lacquer
in S1; emissive #7fe0d6 (peak #d6fff9) via `KHR_materials_emissive_strength`-compatible
emission in S2/S4.

**Lighting rig** (one rig, all shots): 3200 K area strip key at 15–20° elevation
camera-left (the 8C raking reveal — this light does the material storytelling); 5600 K hard
rim upper camera-right at ¼ key; near-zero fill; warm bounce card for copper macros only;
world black. Dormant = key at 5%.

**Animation.** Three NLA-named actions, baked, no loops: `ignite` 2.4 s (inlay emission
draws core-to-tip — animate a gradient mask along the curve, matching the shipped CSS draw
order), `open` 1.6 s (halves translate ±55% width, 6° outward yaw; inset and denim recede
20% Z), `route_exit` 1.2 s (a curve-follow light along the exit path).

**Render.** Cycles, 256–512 samples + OpenImageDenoise; beauty and **emission as a separate
pass** (bloom is composited, never baked); cameras per the shot-list IDs (S01 = frontal 5°
down, 2.6 BW, 35 mm-equiv; macros 0.35–0.55 BW at 85–100 mm-equiv).

**Export.** Textures baked to one 2048² atlas (albedo / normal / rough-metal-AO packed /
emissive mask) + 1024² denim; glTF .glb (Y-up, metres, buckle = 0.092 m) then
`gltfpack -i buckle.glb -o buckle.glb -cc -kn -tc` for meshopt + KTX2. Budgets: ≤120 k
tris, GLB ≤2 MB, textures per the brief. **Acceptance stays: orthographic front render
overlays the SVG proof within ±1% of width.**

## D. Hero film — generation prompt

**Method: image-to-video, anchored on our renders.** Feed each shot its Blender anchor
frame; the generator supplies motion and atmosphere, never the object's design. Master in
21:9, 24 fps; 4:5 portrait re-generation for mobile using the same anchors.

**Master style block (prepend to every shot):**

> Cinematic luxury product film, western fashion-house. Dark editorial atmosphere: deep
> charcoal-black environment with warm 3200K raking light from the left and a cool steel
> rim light from the upper right. Materials rendered with extreme fidelity: brushed darkened
> silver, oxidized copper, hand-tooled chestnut leather, deep indigo selvedge denim, bone
> saddle-stitching, four small turquoise cabochons. Shallow depth of field, 85–100mm macro
> lens character, slow deliberate dolly moves, no camera shake, subtle fine film grain,
> floating dust motes catching the key light. Refined, premium, restrained — jewellery-film
> pacing. 24fps.
>
> **Negative:** text, letters, numbers, dates, logos, watermark, people, hands, faces,
> mannequin, cowboy costume, sheriff badge, star shape, circular coin, medallion, gun,
> horse, vehicle, neon sign, lens flare kitsch, HDR halo, cartoon, render-smooth plastic.

**Shot beats (each ≤5 s, generated separately against its anchor):**

1. **Darkness breathes** — near-black frame, denim texture barely resolving, dust motes
   drift through a single blade of warm light. *(anchor: S01 dormant render at 5% key)*
2. **The reveal** — the raking key sweeps left-to-right across the buckle; rope-twist rim,
   tooling and stones ignite in sequence as the light passes. *(anchor: S03; this is 8C in
   motion)*
3. **Macro travel** — slow lateral dolly across the leather field: tooling relief, one
   turquoise cabochon entering focus, stitch row falling out of focus. *(anchor: S05/S08)*
4. **Ignition** — the engraved monogram channel lights turquoise from core to tip, glow
   blooming softly onto the silver. *(anchor pair: S01 → S03; or composite our M01 render
   directly — preferred)*
5. **The thread leaves** — the lit fibre exits the buckle bottom-centre and travels down
   into darkness, camera tilting to follow. *(anchor: S10; must land on the site's SVG exit
   curve)*
6. *(brand film only)* **Pull-back** — the buckle small in a dark field of denim, one warm
   horizon-line of light behind it. No landscape detail, no location.

**Deliverables from the edit:** the ≤5 s ignition transitions (M01–M05 equivalents, replacing
or grading over pure Blender renders wherever the hybrid looks better) and one **12–18 s
brand film** for click-to-play use — user-initiated, so no autoplay obligations, but it
still ships with captions, a transcript route and its poster. Text and the monogram are
**always composited from our renders**, never generated.

## E. Editorial still prompts

Same master style block and negative list as §D. Generate at ≥2048 on the long edge. All
stills are the *artifact world* — no people, no product claims.

**P1 — Dormant artifact (8B energy):**
> A scalloped rectangular western belt buckle in darkened brushed silver, resting on deep
> indigo selvedge denim in near-darkness. A single cool top light traces its rope-twist
> rim. The engraved channel of a script monogram is unlit, legible only as cut metal. Vast
> negative space above. Square 1:1 and 4:5 crops.

**P2 — Material reveal (8C energy):**
> The same buckle raked by one warm low light from the left: tooled chestnut leather inset,
> oxidized copper frame catching amber highlights, one turquoise cabochon glowing
> blue-green against the warm palette, bone stitching in sharp relief. Macro, luxurious,
> tactile. 3:2.

**P3 — The lit thread:**
> Extreme macro of an engraved channel in dark metal filled with a luminous turquoise fibre
> of light, soft bloom onto brushed silver, shallow focus falling into darkness. 4:5.

**P4 — Atmosphere plate (layer material, not a "place"):**
> Abstract dusk horizon: a single warm band of low light across a dark field, fine dust in
> the air, no landscape features, no buildings, no recognisable location. Wide 21:9, mostly
> empty. *(backdrop layer behind the ignition — deliberately unlocatable, so it claims
> nothing)*

**P5 — Indigo thread abstraction:**
> Threads of indigo and bone-white fibre in extreme macro, one fibre catching warm light,
> black background, painterly and abstract. 4:3. *(candidate upgrade for the
> Thread-to-Trade abstract swatches — remains labelled abstract, not "our textile")*

**Explicitly not generated, ever:** models or any human; garments framed as product;
"material macro" shots framed as our materials (the real macro shoot in
`docs/production/14` covers this — one day, higher value than any render); factory,
warehouse or mill interiors framed as ours.

## F. Integration plan

Everything lands through machinery that already exists and is already tested.

| Asset | Slot | Mechanism |
| :--- | :--- | :--- |
| S01/S03/S12 posters | Ignition background plane behind the SVG proof | `<picture>`, art-directed portrait; SVG remains the structural floor and reduced-motion state |
| M01 ignition clip | Ignition, replacing the CSS draw when motion is welcome | **HeroMedia** — poster, captions, transcript, pause obligations already specified; the no-`<video>` test changes only in that same commit |
| Brand film (12–18 s) | New editorial band on the homepage (post-sheet) and wholesale hero | **Click-to-play only.** Poster + play button; no autoplay; captions + transcript |
| S04–S08 macros | PDP anatomy header; Thread-to-Trade *buckle* stage | Direct `<picture>` swaps |
| P4 atmosphere plate | Ignition backdrop layer (`depth-far`) | Static layer behind buckle |
| P5 abstraction | Optional swatch upgrade in Thread-to-Trade | Keeps its "abstract" caption |
| Real macro shoot (owner) | Replaces both journey swatches with photographed truth | Highest-value swap in the plan |

**Governance:** every file → `assets/source/` masters + `public/media/buckle/` renditions →
manifest entries with SHA-256, dimensions, renditions and provenance — `owner-supplied` for
renders of our own object, **`generated-campaign`** for generated plates, which requires
`ownerApproval: 'approved'` *and* a recorded licence check (D-09) before it can render.
Filename rules (no dates, no price patterns) and the content-integrity tests extend to alt
text and captions.

**Budgets (unchanged, CI-enforced):** 0 KB new JavaScript · homepage ≤1.5 MB with posters ·
≤4 MB with the film playing · LCP stays the poster image · CLS 0 via intrinsic dimensions ·
every poster survives the iOS play glyph.

## G. What stays simple vs what needs premium production

| Stays simple — already right | Needs premium production |
| :--- | :--- |
| The SVG buckle proof as permanent floor and reduced-motion state | **The buckle renders and clips** — the brand-defining first impression |
| CSS/SVG motion system (draw, spine, depth) — 0 KB and correct | **The hero film** — hybrid render-anchored generation, graded and grained |
| Contact sheet, worlds, journey, wholesale structure | **Product photography re-shoot at resolution** — 360px sources cap the whole site's perceived quality; no render fixes this |
| Abstract journey swatches until real macros exist | **The one-day real macro shoot** — the material-honesty thesis, must be photographed |
| Compact chrome, glass header, typography | Girls + Accessories product photography |
| **Not worth building:** runtime WebGL, GSAP, the full camera passage (blocked on the buckle proof's approval and D-08), any generated human or garment imagery | |

The single highest-leverage sequencing fact: **the buckle master (step 1) unlocks
everything** — the stills, the film anchors, the ignition upgrade and eventually Phase 3 —
while the single highest-leverage *owner* action remains real photography at resolution.
