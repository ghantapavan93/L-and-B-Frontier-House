# LB — Men's House Photography Brief

Everything the men's surfaces need, at the sizes they actually render, and the prompts to
produce it.

**Read §0 before commissioning anything.** The brief is split in two because the owner has
already decided which half can be generated and which half must be photographed, and the
decision is closed.

---

## 0. The route, decided

**Menswear is D-03 and unresolved.** Every men's surface currently ships as a labelled
demonstration — `DEMONSTRATION` in the eyebrow, a badge under the copy, no product name in
the card face, no prices. Nothing in this brief changes that. It specifies the imagery a
men's house *would* need, produced so it is usable the day D-03 is answered and harmless
until then.

**D-09 was answered 2026-08-03**, and it governs how each frame may be made:

| | Generated media | Photography |
| :--- | :--- | :--- |
| Atmosphere — light, ground, weather, abstract textile, material macro with no garment | **approved** | approved |
| A garment. Any garment. Hero, background, or blurred | **refused** | required |
| Fabric or construction evidence — a seam, a placket, a rivet, a snap on a garment | **refused** | required |
| Sellable product photography | **refused** | required |
| A model, a face, a body | **refused** | required |
| Anything implying a facility, a mill, or where something is made | **refused** | **refused** |

> Generated media may carry **atmosphere**, and may never carry **evidence**.

This is not a stylistic preference and it does not become approvable by rewording a prompt.
Two hero continuation videos are on file as `ownerApproval: withheld — renders: Never`
because they contained generated denim garments with pockets, plackets, belt loops, rivets
and a branded shank button. They were filed `withheld` rather than `pending` specifically so
the question does not get reopened —
[LB_CAMPAIGN_MEDIA_MANIFEST.md](LB_CAMPAIGN_MEDIA_MANIFEST.md) §0.

**So: §3 is a camera brief for a real shoot. §4 is a generation prompt set, and it contains
no garments.** The existing men's demo imagery sits on the photography side — it comes from
`assets/source/mens-reference/`, owner-dropped reference frames, which is why it renders.

**One more prohibition, learned the hard way on 2026-08-18.** Four campaign plates reached
production carrying design-tool chrome, one of them a phone mockup rendering an invented
product at €245. Review every candidate frame **at its natural aspect ratio on a mid-grey
ground, never square-cropped** — centre-cropping removes the caption bar and the gutters that
prove a frame is a screen rather than a photograph.

---

## 1. What "depth" means here, measured

The five benchmarks were measured directly, not admired
([teardown-burberry-gstar-vero.md](../research/teardown-burberry-gstar-vero.md),
plus the Kimes, Tecovas and Miss Me teardowns). Four findings drive every shot below.

| Finding | Measured | What it demands of the photography |
| :--- | :--- | :--- |
| **Premium is media density, not type scale** | Burberry's largest heading anywhere is **24 px**; their editorial bands run **8 images in 799 px** | Every band needs *more frames*, not bigger words. Budget 5–8 usable frames per editorial band, not one |
| **The PDP is the product** | Tecovas ships **8 gallery images** and 10 construction facts on a 4,984 px page | 5 frames minimum per style, 8 for a hero style |
| **One ratio, everywhere** | Burberry ≈ 0.75–0.78, G-Star 0.75 across 10 of 12 frames | Shoot and deliver product frames at **3:4**. Not 2:3, not 4:5 |
| **Construction fact beats adjective** | G-Star names articulated knees, curved seams, placed panels | Every macro must show a *nameable* thing — this seam, this snap, this leg opening. A pretty blur is not a shot |

**Depth in the layout is built from three planes**, and the photography has to supply all
three or the bands collapse flat: a **ground** (the environment, out of focus, carrying
light), a **subject** (the garment, sharp, at product ratio), and a **detail** (the macro
that proves the claim). Shoot every look as all three.

---

## 2. The slots, at the sizes they render

These are the real aspect ratios in `globals.css` today. Deliver to these and nothing gets
re-cropped by a designer downstream.

| # | Surface | Slot | Ratio | Widths | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| A | Homepage — `MensChapter` | `.story__lead` | **4:5** | 1408, 960, 480 | The campaign frame the headline sits across |
| B | Homepage — `MensChapter` | `.story__inset` | **1:1** | 960, 480 | The overlapping second frame, a detail |
| C | `/mens` hero | `.plate-hero` desktop | **1672:941** (≈16:9) | 1920, 1408 | Full-bleed opening. Type lands bottom-left |
| D | `/mens` hero | `.plate-hero` mobile | **1122:1402** (≈4:5) | 1080, 720 | Portrait crop of the same setup, not a squeeze |
| E | `/mens` rack | product card face | **3:4** | 960, 480 | The style, whole, on white or on ground |
| F | `/mens` rack | card hover swap | **3:4** | 960, 480 | Same style, *different distance* — worn, or back |
| G | `/mens` floor | `.mens-floor img` | **4:5** | 960, 480 | "How it is worn" — full-length, real light |
| H | PDP | gallery | **3:4** | 1408, 960, 480 | 5–8 per style. See §3.2 |
| I | PDP | anatomy callout | **3:4** or 1:1 | 960, 480 | One macro per named construction fact |
| J | PDP | `.worn-strip img` | **4:5** | 960, 480 | The style in use, 3 frames |
| K | `ProductWorlds` | `.worlds__card` | **3:4** desktop | 960 | One frame per world |
| L | Category tile | `.west-taxonomy__media` | **4:3** | 960, 480 | Landscape, deliberately — breaks the portrait run |

**Poster survivability, two hard rules.** Any frame that can back a video poster must stay
readable with (1) a centred iOS play glyph burned over it — Low Power Mode forces one and CSS
cannot hide it, and (2) type in the **lower-left third** with no scrim, which is where
Burberry sets its headline. Compose those zones quiet.

---

## 3. The camera brief — the real shoot

### 3.1 One lighting setup, three registers

Do not relight per garment. Three registers, everything shot inside them, so the set cuts
together as one house rather than as a stock library.

| Register | Light | Ground | Use |
| :--- | :--- | :--- | :--- |
| **Bench** | Single large soft source, 45° camera-left, warm 3400 K. Black flag camera-right for falloff | Weathered timber, or seamless bone | Flats, macros, accessories, anatomy |
| **Floor** | Open shade or overcast daylight, no fill. 5600 K, no reflector | Real ground — gravel, boards, paved street, dry grass | Full-length worn, floor frames, hover swaps |
| **Late** | Low raking sun within 40 min of setting, backlit, flare controlled with a hand flag | Open land, no landmark | Campaign, hero C/D, `story__lead` |

**Lenses.** 50 mm for full-length (no distortion on the leg line), 85 mm for three-quarter and
card faces, **100 mm macro for every detail frame**. Shoot detail at f/5.6 or tighter — the
North Star asks for the weave to be legible, and f/2 with a blurred seam is the opposite of
the claim.

### 3.2 The per-style pattern — five frames minimum

Every style in the rack gets these five. A hero style gets all eight.

| ID | Frame | Register | Ratio | Why it exists |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Flat** — garment laid square, filling frame, no props | Bench | 3:4 | The card face. Colour truth and cut, unambiguous |
| **2** | **Worn, full length** — head-to-boot, standing, neutral pose | Floor | 3:4 | The hover swap. Answers "what does it look like on" |
| **3** | **Three-quarter, waist to hem** — the leg line in profile | Floor | 3:4 | Proves the leg opening, the thing denim buyers filter on |
| **4** | **Hem / cuff macro** — the finish, at 100 mm | Bench | 3:4 | The construction fact. This is the G-Star frame |
| **5** | **Hardware or seam macro** — snap, rivet, stitch run, pocket bar-tack | Bench | 1:1 | The anatomy callout |
| 6 | Back — pocket detail and yoke | Floor | 3:4 | Denim sells from behind as much as the front |
| 7 | In motion — walking, mid-stride, 1/250 | Floor | 4:5 | The floor strip. Life, not a mannequin |
| 8 | Stack — folded, three of the run together | Bench | 4:3 | Editorial band filler, and it reads as a real inventory |

**Styling rules, all §12 consequences.**
No visible third-party branding. No badge, star, sheriff or costume-western signalling — the
anti-cliché contract. **No boot may be shot as merchandise** — footwear does not exist, so
boots appear only worn, in frame, never isolated on a bench or named. No date, no
"EST." anything, no invented heritage on any label, hangtag or hardware in shot. No signage,
no facility, no interior that reads as a factory.

**Models.** A person in a campaign photograph is fine; an *invented* person is not. No
composited faces, no generated models, no named individual presented as a customer,
ambassador or testimonial. Get a release.

### 3.3 Volume

| Set | Styles | Frames each | Total |
| :--- | ---: | ---: | ---: |
| Denim | 5 | 8 | 40 |
| Shirts | 2 | 5 | 10 |
| Outerwear | 1 | 8 | 8 |
| Accessories | 3 | 5 | 15 |
| Floor / lifestyle | — | — | 20 |
| Campaign A–D | — | — | 8 |
| **Total usable** | | | **~101** |

One day for Bench, one for Floor, a half-day golden-hour block for Late. Deliver 16-bit TIFF
masters plus 3:4, 4:5, 1:1 and 16:9 crops; the import script emits AVIF/WebP at the widths in
§2.

---

## 4. Generation prompts — atmosphere tier only

**Every prompt below is garment-free by construction.** These fill the ground plane: the
light, the surface, the weather a men's house is photographed in. They may never be captioned
as, or cropped to imply, a product.

### 4.1 Master style block — prepend to every prompt

> Editorial campaign photography, western workwear house. Natural light only, no studio
> strobe look. Warm low-angle sun or flat open shade. Materials at high fidelity: raw indigo
> denim twill, waxed cotton canvas, oiled saddle leather, blackened steel, bone thread.
> Shallow-to-medium depth of field, 100 mm macro or 50 mm lens character, fine 400-speed film
> grain, subtle halation in highlights. Muted earth palette — indigo, bone, tobacco, rust,
> sandstone. Restrained, unstyled, documentary. No set dressing.

### 4.2 Master negative — prepend to every prompt

> garment, jacket, shirt, jeans, trousers, clothing, apparel, pocket, placket, belt loop,
> rivet, snap button, zipper, collar, cuff, hem, folded clothing, garment on a body,
> mannequin, person, model, face, hands, skin, boots, footwear, shoe,
> text, letters, numbers, dates, price, currency, logo, wordmark, watermark, signature,
> label, hangtag, swing ticket, barcode,
> UI, user interface, app screen, phone, device frame, mockup, presentation board, slide,
> caption bar, title bar, border, frame, matte, letterbox, drop shadow on the image edge,
> factory, mill, sewing machine, production line, warehouse interior, storefront, signage,
> cowboy costume, sheriff badge, star shape, longhorn, skull, rodeo poster, HDR halo,
> plastic render sheen, cartoon, illustration

Each entry maps to a rule. Garment and construction terms → D-09's closed list. People and
faces → no invented people. Text, dates and currency → fabricated heritage and the €245
incident. **UI, mockup, board, caption bar, border → the 2026-08-18 withdrawal**; three of
those four plates would have been rejected at generation if this line had existed. Factory
and mill → the unevidenced manufacturing location, OQ-04. Badge, star, longhorn, skull → the
anti-cliché contract.

### 4.3 The prompts

Deliver each at 1408 px on the long edge minimum, and **review at natural aspect on `#888`**.

**M1 — Indigo twill, raking (1:1).** *Anatomy macro ground.*
> Extreme macro of heavyweight raw indigo denim twill, the diagonal weave line clearly
> legible, slubs and irregular yarn visible. Single warm light raking from the left at 15°
> so each thread throws a micro-shadow. Deep indigo, near-black in the shadow. Fills frame
> edge to edge, no border.

**M2 — Bone stitch run (1:1).** *Seam register, no garment.*
> Extreme macro of a run of bone-coloured saddle stitching through dark indigo denim, the
> thread twist visible in each stitch, even spacing. Cool overcast light. Shallow depth,
> the run receding out of focus. Fills frame edge to edge.

**M3 — Blackened steel on timber (1:1).** *Hardware register.*
> Macro of loose blackened steel workwear hardware — rivets, shanks, a plain buckle frame —
> scattered on weathered grey timber. Warm side light, long shadows. No branding, no
> engraving, no text on any piece.

**M4 — Oiled saddle leather edge (1:1).**
> Macro of the cut edge of thick oiled saddle-tan leather, burnished and slightly rolled,
> grain and pores legible. Warm raking light. Nothing else in frame.

**M5 — Gravel and dust, late sun (16:9).** *Hero ground, plate C.*
> Empty gravel and dry dust ground at golden hour, low sun raking from the left throwing
> long texture shadows. Warm dust suspended in the light. No horizon, no landmark, no
> structure, no figure. Lower-left third quiet and even for type.

**M6 — Open land, backlit haze (16:9).** *Hero ground, alternate.*
> Wide open dry grassland under a low backlit sun, heavy atmospheric haze, no trees, no
> buildings, no fence, no figure, no road. Muted sandstone and bone. Horizon low in frame,
> upper two-thirds sky, lower-left third clean.

**M7 — Weathered board wall, shade (4:5).** *Portrait ground, plate D.*
> A weathered vertical timber board wall in flat open shade, grey-brown, grain and nail
> holes visible, boards slightly uneven. Even soft light, no hotspot. Nothing mounted on it,
> no signage, no text.

**M8 — Wet paving, after rain (4:5).**
> Dark wet paving stones after rain, cool overcast light, reflections broken and soft. No
> figure, no vehicle, no kerb marking, no drain cover with text.

**M9 — Waxed canvas, folded light (4:3).**
> Macro-to-medium of heavy waxed cotton canvas in a loose drape, the wax bloom catching a
> single soft window light, creases holding. Tobacco brown. Abstract — no seam, no stitch,
> no edge that reads as a made object.

**M10 — Dust in a sunbeam (4:3).** *Transition plate.*
> A single hard shaft of warm sunlight cutting through darkness, dense dust motes suspended
> and drifting in it. Near-black surround. Nothing else in frame.

### 4.4 What these are for

M1–M4 are the **material wall** and the PDP anatomy grounds — the band that carries the
"legible at close range" claim. M5–M8 are the **hero and floor grounds**, ready for a
photographed subject to be shot against or composited over. M9–M10 are **transition and
editorial plates** for the long scroll.

None of them is a product. None of them is evidence. All of them are ground.

---

## 5. Delivery and clearance

1. Drop photography into `assets/source/mens-reference/`; drop generated plates into
   `assets/source/campaign/`.
2. Every generated asset carries the full record from
   [LB_CAMPAIGN_MEDIA_MANIFEST.md](LB_CAMPAIGN_MEDIA_MANIFEST.md) §0 — platform, model
   version, date, prompt, negative prompt, source references, licence status, route,
   section, both derivatives and a fallback still. Missing fields are a blocker.
3. Review at natural aspect on `#888`. Reject any frame with a border, caption bar, device
   frame or UI.
4. Run the import script; it emits AVIF + WebP at the §2 widths and writes the typed
   manifest.
5. Men's frames stay behind the `DEMONSTRATION` labelling until **D-03** is answered.
   Nothing here asserts that a men's line exists.


---

## 6. The site is ready for these — the naming contract

**Name the file after the frame and the site publishes it. There is no second step.**

Drop `dark-rigid-jean-hem.jpg` into `assets/source/mens-reference/`, run
`npm run import:mens-demo`, and it is encoded to AVIF + WebP at every width the layout asks
for and written into the typed manifest. No code change, no re-indexing, nothing to
remember. Any extension sharp can read works — the shoot will not arrive as `.avif`.

This did not used to be true, and the old behaviour was the single thing standing between
"we have the photographs" and "the site has them". Every frame was selected by its
**positional index into the alphabetically sorted source directory**. That is stable only
while the directory never changes — which is exactly what stops being true the moment a
real shoot lands. Every index would shift, and every men's image on the site would silently
become a different photograph. No error, no missing file, no failing test; the rack would
just show the wrong clothes.

Resolution is now **by filename first**, with the old index map kept only as a draining
remnant for the current unnamed reference drop. Each run prints the split:

```
manifest written with 46 assets
  by filename: 0   by legacy index: 46
```

As named frames arrive that first number rises and the second falls. When it reaches zero,
delete the map. A key that resolves neither way is a hard failure — the importer refuses to
render a placeholder, because a placeholder is how a silent default gets reinstated.

A correctly-named file **does not need to be referenced by a fixture to be published**.
`dark-rigid-jean-back` is frame 6 of the pattern and nothing uses it yet; name it correctly
and it is encoded and waiting in the manifest. Naming is the whole act of publishing.

---

## 7. The list — 50 frames to shoot

Eighteen of the sixty-eight per-style frames already exist in the reference drop. These are
the exact filenames. Shoot them to the §3.2 pattern and the §2 ratios.

### Denim

| Style | Frame filename | Status |
| :--- | :--- | :--- |
| Dark Rigid Jean | `dark-rigid-jean-flat` | have |
|  | `dark-rigid-jean-model` | **shoot** |
|  | `dark-rigid-jean-side` | have |
|  | `dark-rigid-jean-hem` | **shoot** |
|  | `dark-rigid-jean-macro` | have |
|  | `dark-rigid-jean-back` | **shoot** |
|  | `dark-rigid-jean-motion` | **shoot** |
|  | `dark-rigid-jean-stack` | **shoot** |
| Everyday Mid Jean | `mid-wash-jean-flat` | have |
|  | `mid-wash-jean-model` | have |
|  | `mid-wash-jean-side` | **shoot** |
|  | `mid-wash-jean-hem` | have |
|  | `mid-wash-jean-macro` | **shoot** |
|  | `mid-wash-jean-back` | **shoot** |
|  | `mid-wash-jean-motion` | **shoot** |
|  | `mid-wash-jean-stack` | **shoot** |
| Light Wash Jean | `light-wash-jean-flat` | have |
|  | `light-wash-jean-model` | have |
|  | `light-wash-jean-side` | **shoot** |
|  | `light-wash-jean-hem` | have |
|  | `light-wash-jean-macro` | **shoot** |
|  | `light-wash-jean-back` | **shoot** |
|  | `light-wash-jean-motion` | **shoot** |
|  | `light-wash-jean-stack` | **shoot** |
| Dark Bootcut Jean | `bootcut-jean-flat` | **shoot** |
|  | `bootcut-jean-model` | have |
|  | `bootcut-jean-side` | **shoot** |
|  | `bootcut-jean-hem` | have |
|  | `bootcut-jean-macro` | **shoot** |
|  | `bootcut-jean-back` | **shoot** |
|  | `bootcut-jean-motion` | **shoot** |
|  | `bootcut-jean-stack` | **shoot** |
| Khaki Five-Pocket Jean | `khaki-jean-flat` | have |
|  | `khaki-jean-model` | have |
|  | `khaki-jean-side` | have |
|  | `khaki-jean-hem` | **shoot** |
|  | `khaki-jean-macro` | **shoot** |
|  | `khaki-jean-back` | **shoot** |
|  | `khaki-jean-motion` | **shoot** |
|  | `khaki-jean-stack` | **shoot** |

### Shirts

| Style | Frame filename | Status |
| :--- | :--- | :--- |
| Stripe Pearl Snap Shirt | `stripe-shirt-flat` | have |
|  | `stripe-shirt-model` | **shoot** |
|  | `stripe-shirt-placket` | **shoot** |
|  | `stripe-shirt-cuff` | **shoot** |
|  | `stripe-shirt-macro` | **shoot** |

### Outerwear

| Style | Frame filename | Status |
| :--- | :--- | :--- |
| Indigo Trucker Jacket | `denim-jacket-flat` | **shoot** |
|  | `denim-jacket-model` | **shoot** |
|  | `denim-jacket-side` | **shoot** |
|  | `denim-jacket-cuff` | **shoot** |
|  | `denim-jacket-macro` | **shoot** |
|  | `denim-jacket-back` | **shoot** |
|  | `denim-jacket-motion` | **shoot** |
|  | `denim-jacket-stack` | **shoot** |

### Accessories

| Style | Frame filename | Status |
| :--- | :--- | :--- |
| Saddle Tan Belt | `saddle-belt-flat` | have |
|  | `saddle-belt-worn` | have |
|  | `saddle-belt-macro` | **shoot** |
|  | `saddle-belt-edge` | **shoot** |
|  | `saddle-belt-stack` | **shoot** |
| Textured Grain Belt | `ostrich-belt-flat` | have |
|  | `ostrich-belt-worn` | **shoot** |
|  | `ostrich-belt-macro` | **shoot** |
|  | `ostrich-belt-edge` | **shoot** |
|  | `ostrich-belt-stack` | **shoot** |
| Leather Weekend Duffel | `leather-duffel-flat` | **shoot** |
|  | `leather-duffel-worn` | **shoot** |
|  | `leather-duffel-macro` | **shoot** |
|  | `leather-duffel-edge` | **shoot** |
|  | `leather-duffel-stack` | **shoot** |

### The floor — 20 frames

Full-length worn looks and ground detail, register **Floor**, ratio **4:5**. The existing
twenty reference frames cover this set and can stay until real photography replaces them,
name for name: `floor-white-jean-worn`, `floor-dark-jean-back`, `floor-dark-jean-street`,
`floor-light-jean-side`, `floor-light-jean-worn`, `floor-light-jean-flat`,
`floor-pale-jean-flat`, `floor-cream-seated`, `floor-denim-texture`, `floor-back-pocket`,
`floor-waist-detail`, `floor-cuffing-barn`, `floor-dark-hem-boot`, `floor-black-boots`,
`floor-black-toe`, `floor-brown-boots`, `floor-tan-boots`, `floor-boot-crate`,
`floor-boot-floorboards`, `floor-boot-rocks`.

**Seven of those twenty are boots.** Footwear does not exist as a category and must never be
shot as merchandise. They stay only because they are how the trousers are worn; if a frame
reads as a boot *for sale* rather than a boot *being worn*, it does not ship. When
re-shooting, prefer the trouser in frame with the boot incidental.

### Campaign — 8 frames

Register **Late**, golden hour. Two exist (`campaign-gravel`, `campaign-boot-pull`); the
hero slots want six more, delivered as a matched desktop/mobile pair per setup:
`campaign-hero-desktop` (**1672:941**) and `campaign-hero-mobile` (**1122:1402**),
`campaign-story-lead` (**4:5**), `campaign-story-inset` (**1:1**),
`campaign-world-tile` (**3:4**), `campaign-taxonomy-tile` (**4:3**).

Compose the **lower-left third quiet** on every 16:9 frame — that is where the headline
lands, with no scrim — and keep the centre clear enough to survive an iOS play glyph.

### Totals

| Set | Frames | Status |
| :--- | ---: | :--- |
| Per-style | 68 | 18 have · **50 to shoot** |
| Floor | 20 | covered by reference, re-shoot when possible |
| Campaign | 8 | 2 have · **6 to shoot** |
| Generated ground plates (§4) | 10 | **all to generate** |
| **Total** | **106** | **56 to shoot · 10 to generate** |

---

## 8. What arrived — 2026-09-16

The owner generated and placed 32 frames. Every one was reviewed at natural aspect on grey
before it touched a page, and every one is wired through the existing resolution system:
the men's-line frames by **filename** through `import-mens-demo` (the §6 contract), the
rest through `owner-approved-mapping.ts` → `media:optimize` → the manifest → a named slot.

| Group | Files | Where | Provenance |
| :--- | :--- | :--- | :--- |
| Men's product frames | `dark-rigid-jean-{model,hem,back,motion,stack}`, `mid-wash-jean-{side,macro,back,motion,stack}` | `MENS_REFERENCE_MEDIA` → the product gallery, 8 frames per style | generated reference; replaced by real frames of the same names at launch |
| Campaign | `campaign-story-lead`, `campaign-story-inset`, `campaign-hero-mobile`, `campaign-world-tile` | Men's chapter lead + inset · `/mens` portrait hero · Denim world tile | generated |
| Thread to trade | `thread-to-trade-01…05` | one stage plane each, caption carries the plate marker | generated · **D-09 refused side** (facility, manufacturing, figures) — placed knowingly |
| Operations | `operations-01…04` | `OperationsCards`, one per fact | generated |
| The line | `shop-category-mens-{denim,shirts,outerwear,accessories}` | `WaysIn` line cards, slots `category-mens-*` | generated |
| Fixture notice | `development-fixture-notice` | `FixtureNotice`, beside live text | generated |
| Fit tiles | `fit-bootcut`, `fit-flare`, `fit-wide` (→ slot `fit-wide-leg`) | Fit Gateway | generated |

**Withheld:** `fit-straight.png` — a sign in frame reads *BETTER MEN HIGHER PLAINS* under
a longhorn skull. Invented slogan (§12) and the anti-cliché contract's longhorn. Regenerate
without signage; the tile shows type until then.

**Not on disk:** `operations-how-we-ship-background.png` was described but never placed;
the owner's later instruction superseded it with four cards, so nothing is missing.

**Content note:** `dark-rigid-jean-back.png` shows a mid-blue wash, not the dark indigo of
the style's flat. Mounted as named; the first frame a real shoot replaces.

Every generated frame carries `generated-campaign` provenance via the mapping's `generated`
flag and shows the plate marker on the surface that mounts it. None is reused.
