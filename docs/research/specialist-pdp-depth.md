# Specialist teardown — PDP depth and product-anatomy inspection

**Date:** 2026-08-13 · **Scope:** how far a product page can go in explaining a garment, and
how interactive product-anatomy inspection actually works in practice.
**Status:** external research. Everything here is a **mechanism observation**, not an approved
decision. No competitor layout, copy, imagery or interaction is to be reproduced (§13).

**Method.** Eight western-apparel flagship PDPs plus two adjacent-category references, opened
top-to-bottom. Measurements taken in-browser with DOM instrumentation (`scrollHeight`,
`getBoundingClientRect().top`, element counts, computed styles) where the origin was reachable;
by server-HTML fetch where it was not. Viewport width is recorded with every height because it
changes the number materially. Cookie/consent surfaces were left at their most private setting;
no accounts, forms, carts or personal data were touched. Page content was treated as data.

**Sources examined**

| Brand | URL measured | How |
| :--- | :--- | :--- |
| Lucchese | `/products/charles-black` | Browser, instrumented |
| Tecovas | `/products/the-buck` | Browser, instrumented |
| Wrangler | `/shop/wrangler-cowboy-cut-original-fit-jean-13MWZ.html` | Browser, instrumented |
| Kimes Ranch | `/products/mens-jeans-rawdillon-blue` | Browser, instrumented |
| Miss Me | `/products/classic-saddle-stitched-bootcut-jeans` | Browser + server HTML |
| Rockmount | `/products/mens-black-vintage-cactus-stars-chain-stitch-embroidery-western-shirt` | Server HTML |
| Schaefer | `/products/legend-denim-jacket-1` | Server HTML |
| Cinch | `/products/cinch-mens-grant-jeans-dark-rinse` | Server HTML |
| Leatherman *(non-apparel)* | `/products/wave` | Server HTML |
| Filson *(adjacent)* | `/products/mackinaw-wool-cruiser-jacket-charcoal` | Server HTML |

Bellroy could not be inspected: its PDP is entirely client-rendered, so server HTML returns
navigation and footer only, and the in-app browser refused a first-load to that origin in this
session. Its capacity-demo pattern is therefore **not** evidenced here and is not cited below.

---

## 1. The comparison table

| Site | Page height | Product images | Anatomy / annotated callouts? | Size chart format | Video |
| :--- | ---: | ---: | :--- | :--- | :--- |
| **Lucchese** (boot) | **6,676 px** @1440 | 18 media in gallery (194 `<img>` page-wide) | **Yes — the deepest found.** 12 toe shapes + 6 heel profiles, each with its own silhouette image, a dimension in inches and a functional rationale; plus 2 numbered fit callouts (`01. TOE BOX`, `02. HEEL`) | **Image** — the men's size-conversion chart is a picture; zero `<table>` on the page | 4 × 10 s, no autoplay, **full controls** (play/pause/mute/fullscreen) |
| **Tecovas** (boot) | **4,987 px** @1440 | 8 gallery (45 page-wide) | No callouts. 10 named construction points as a **text list only** | No table anywhere; fit guide is a modal | None |
| **Wrangler** (jean) | **14,066 px** @1440 (**3,456 px to reviews** — ~10,600 px is the review engine) | 77 page-wide, ~4 gallery | No callouts. 6 named spec rows incl. real numbers | **HTML `<table>`, 23 rows × 3 cols** (Size / Waist / Hip) with a caption — the most accessible chart found in western | None |
| **Kimes Ranch** (jean) | **6,431 px** @1440 | 13 gallery (38 page-wide) | No callouts, but a **`<table>` comparison matrix** across sibling fits (Rise / Leg Opening / Denim Content) | Modal behind a "Size chart" control | 1 × 18.2 s, no autoplay, **controls on**, loops |
| **Miss Me** (jean) | **5,221 px** @1440 | 6 gallery (92 page-wide) | No callouts. Named details in prose | **Image** + how-to-measure prose. **No garment measurements at all** | None |
| **Rockmount** (shirt) | not instrumented | 5 | No callouts. 4 named details, no per-detail photo | **HTML text table, per size** — neck 14″–20″, chest 44″–57″, sleeve 32″–36.5″, width 18.5″–23.5″, length 31″–34″ | None |
| **Schaefer** (jacket) | not instrumented | 13 | No callouts. 6 named points; only 4 have a matching close-up | **None at all** | None |
| **Cinch** (jean) | not instrumented | 5 | No callouts. Fabric + fit blocks | **Image** (4 chart pictures) | None |
| **Leatherman** (multi-tool) | not instrumented | gallery + diagram | **Yes — numbered diagram, 01–18**, as a static image, mirrored by an 18-item text list | Structured text specs (closed 4″, open 6.25″, blade 2.92″, 420HC, 55–59 HRC) | Overview video |
| **Filson** (wool jacket) | not instrumented | 11 | No callouts. 6 named points, no per-point photo | **HTML table, per size** — neck, chest, waist, pit-to-pit, arm length across 7 sizes + 4 longs | 1 (creative director explains the garment) |

**The headline accessibility finding.** Three of eight western PDPs ship the size chart as a
**picture of a table** — Lucchese, Miss Me, Cinch. That is the exact WCAG 1.1.1 failure our
constitution names (§8.4), and it is the industry norm, not an outlier. The brands that get it
right are Rockmount, Wrangler and Filson, all with real `<table>` markup. Lucchese is the
instructive case: it has the most sophisticated construction pedagogy in the entire sample and
still renders its size conversions as a JPEG.

---

## 2. Per-site findings

### 2.1 Lucchese — the anatomy benchmark

**Section order, top to bottom:** store selector → gallery (18 media, "show more media" reveals
the rest) → title, 4.9/5 from 110 reviews, price → **Size / Size Chart / Width / Toe & Heel** →
add to cart, "call to order", store availability → **Fit Guide** (`01. TOE BOX`, `02. HEEL`) →
**Toe Gallery** (12 entries) → **Heel Gallery** (6 entries) → size-conversion chart (image) →
TIP → COMMON FIT PROBLEMS → care as three imperatives (CONDITION / WEAR / WAIT) + a note about
exotics → two how-to videos ("How To Try On A Cowboy Boot", "Wearing in Your Boots") →
"Dedicated to the craft" → material story (Caiman Crocodile) → customer reviews →
"You may be interested in" → "Our Bestsellers" → "Recently viewed items".

**The mechanism worth understanding.** Lucchese does not annotate *this boot*. It ships a
**house glossary of construction options** on every PDP, and the current product's code is the
one highlighted. Each toe entry carries three things:

- a **code** (`5`, `R`, `X1`, `7`),
- a **dimension** — `(5/8″ wide)`, `(1 1/2″ wide)`,
- a **one-sentence functional rationale** — the snip toe's is that it was originally made for
  getting in and out of a stirrup.

Each heel entry carries a code and a **height in inches**: 7/8″, 1″, 1 1/8″, 1 1/2″, 1 3/4″, 2″.
Six profiles, six numbers, no adjectives.

Each of the 12 toe entries has **its own silhouette image** — `.fit-accordion-content` holds 12
`<img>` elements, one per entry. This is exactly the evidence-per-callout discipline we already
enforce in `PdpAnatomy`.

**Delivery mechanics, measured:** the glossary lives in a `<button aria-expanded>` accordion, and
the panel content computes to `display: block; visibility: visible`, no `hidden` attribute — so
the text is in the document, not injected on click. Keyboard-reachable, and it survives a
JavaScript failure. The `TOE GALLERY` / `HEEL GALLERY` controls are progressive enhancement over
content that is already there. **This is the correct pattern and it is rare.**

**Reviews are attribute-specific and quantified.** Not stars alone:

- *Style of Product* — Good (2) · Very Good (86)
- *Quality of Product* — Good (2) · Very Good (86)
- *Fit of Product* — **Tight (25) · True to Size (60) · Too Large (2)**

That last row is a **fit distribution histogram**, and it is the single most decision-useful
artefact on any page in this sample. It converts 110 anecdotes into one number a buyer can act on.

**What Lucchese gets wrong:** the size-conversion chart is an image; the page carries zero
`<table>` elements. A screen-reader user gets the entire toe-and-heel pedagogy and then hits a
wall at the only numbers that decide the purchase.

### 2.2 Tecovas — the disciplined middle

4,987 px, 8 gallery images, and the gallery is the lesson. Alt text **names the view**:
"Pair view", "Quarterfront view", "Toe view", "Sole view" — a systematic vocabulary, not
"image 3 of 8". Thumbnail controls read "Scroll the gallery to image 4 of 8".

Buying panel order: rating → price → **colour (6 swatches) → material label → outsole label →
size (7–15 including halves) → width (D-AVERAGE / EE-WIDE) → fit guide link → add to cart →
free-shipping line → store availability**. Note width is a **first-class second axis**, not
buried in a chart.

Below the fold: a headline paragraph, two icon "key features", then **DETAILS — 10 named
construction points as plain text**: cowhide vamp and counter, 1½″ leather compound heel on a
recycled leather base, round toe, removable cushioned footbed, hung 11″ shaft lined in lambskin,
vintage-inspired stitching, rubber sole, mesh-lined vamp, **Goodyear leather-welt construction**,
reinforced nylon pull straps. Ten claims, zero evidence images. It reads as specification, not as
proof — the gap our `PdpAnatomy` is designed to close.

Then four accordions: **fit guide · material & care · design process · shipping & returns**. The
material entry is a short essay on cowhide followed by care steps that name the actual products
to use and an interval ("condition every 1–2 months"). An honest natural-material disclaimer
about hide variation closes the details list.

Zero `<table>` elements on the page.

### 2.3 Wrangler — cheapest garment, best size data

$59.99. 14,066 px, but **only 3,456 px of it is product** — the remaining ~10,600 px is a
1,724-review engine. Add-to-bag sits at y≈1,110; product information at 1,346; "Get the look" at
2,214.

Three things it does that no premium site in the sample does:

1. **"MODEL IS 6'2″ IN SIZE 33 X 34"** — placed *above the product title*, inside the gallery
   region, before price. Height and the exact size worn, as the first fact on the page.
2. **A real `<table>`**, 23 rows × 3 columns, captioned "Table with sizing measurements for
   sizing for Size, Waist, and Hip", covering waists 27–56 with hip ranges.
3. **Two garment numbers in the description**: `Front Rise: 11 7/8″` and
   `Leg Opening: 16 3/4″`, beside `Fit: Original`, `Rise: High`, `Leg: Fits over boot`,
   `Front Closure: Zip-Fly with button closure`.

Those two numbers are the entire question for a western jean — whether it stacks correctly over a
boot. They cost nothing to publish and Wrangler is one of the few that does.

Size selection is a genuine **19 × 6 matrix**: waists 27–52, lengths 30–40, as buttons.

Heritage functions as specification here: 1947, "Rodeo Ben" Lichtenstein, official ProRodeo
competition jean, "fully felled side seams", seven belt loops. Provenance is stated as a
construction consequence, not as atmosphere.

### 2.4 Kimes Ranch — the comparison matrix, and behaviour over time

6,431 px. Add-to-cart at y=901. **Jean Comparison at y=2,523. Reviews at y=4,605.** So roughly
3,700 px of product argument sits between the buy button and the social proof — the healthiest
ratio in the sample.

Two mechanisms worth taking:

**A sibling comparison `<table>`.** "JEAN COMPARISON" puts three fits side by side on
**Rise / Leg Opening / Denim Content**. This is cross-sell rebuilt as a *decision aid*: it
answers "is this the right one of your jeans for me", which is the actual question, instead of
"here are three more things".

**Behaviour over time, stated numerically.** The raw-denim block says the denim will shrink
"roughly 1/2 an inch in the waist and 1 to 1.5 inches in length", tells you dye will transfer to
skin, upholstery, garments, shoes and saddle, and then gives the resulting *sizing instruction*
("buy your typical Kimes Ranch size"). This is fit truth that a measurement table cannot express,
and it is the single most transferable idea for a denim-led house.

Construction is stated as three labelled blocks: `CONTENT: 100% Cotton` ·
`DETAILS: Mid-Low Rise, Relaxed Upper Thigh, Wide-Boot, Hand-Sanded Integrated Knife Pocket,
Off-White Stitch Detailing` · `CONSTRUCTION: 3×1 Right Hand Twill. Ring Spun. 13.75 oz. denim.`
Weave, spin and weight — the three numbers that separate real denim specification from adjectives.

Size is chosen on **two axes** (26W × 34L). One video, 18.2 s, `autoplay=false`, `controls=true`.
One gallery image carries genuinely descriptive alt text; the other twelve repeat the product
name. Reviews can be filtered to "Only pictures" / "Videos first".

### 2.5 Miss Me — the $109 jean, and the floor

5,221 px, 6 images, all tight: pocket, front crop, side crop, close-up, front full, back crop.
The photography is entirely about the decoration, because the decoration is the product.

Panel: price → 4.4 / 73 reviews → **size 23–34 → inseam 30″/32″/34″** → colour → add to cart →
shipping → returns → three tabs (Description · Size & Fit · Content & Care).

**No size chart in the sense that matters.** The size guide is an image plus prose headed
WAIST & HIPS / INSEAM / RISE explaining how to measure *yourself*. There are **no garment
measurements at any size**. The substitute is a model statement — *"Model is wearing size 25.
Height 5'9″. Bust 34″. Waist 25″. Hips 37″"* — which is one data point standing in for a grading table.

Two mechanisms are still worth noting:

- **Reviewers supply their own body data.** Review entries carry structured answers —
  "How old are you? 18–24", "What is your height? 5'0″" — so the fit evidence is a population,
  not a paragraph. Customer-uploaded images are a filterable review facet.
- **"Frequently Bought Together" with a single ADD ALL TO CART** at a combined price, above
  "You Might Also Like" (8 products) and "Recently Viewed".

### 2.6 Rockmount — the accessible chart, no evidence

Five images, no video, no reviews, two cross-sells (the women's and kids' matching versions —
cross-sell as *family*, not as *similar*). But the size chart is a proper **HTML text table** with
per-size neck, chest, sleeve, width and length. Four construction points are named — smile pockets
with arrow embroidery, six-snap shotgun cuffs, piping, chain-stitch embroidery — and **none has a
detail photograph**. The vocabulary is precise and the evidence is absent.

### 2.7 Schaefer — good words, no numbers

Thirteen images with genuine close-ups of collar, buttons, cuff and material. Six named points:
14.5 oz. 100% cotton denim, full-grain leather collar, four-pocket front, angled pockets,
double-V western yoke back, antique brass logo buttons. **154 reviews with attribute ratings —
Fit (runs large), Quality 5.0, Durability 4.9.** And then: **no size chart at all**, no garment
measurements, no model height. A $175–$525 jacket sold with no way to know if it fits.

### 2.8 Cinch — fabric numbers, chart as picture

Five images. Four size charts, all images. But the copy carries the two numbers again:
`11″ front rise`, `18 7/8″ bottom opening`, on `10.9 oz. performance stretch denim`, with the
finishing named as process — hand sanding, whiskers, chevrons, grinding. Four reviews.

### 2.9 Leatherman — how a numbered diagram should be built

The canonical annotated-inspection page in the sample, and its lesson is *structural*.

The diagram is a **static image** with callouts 01–18. It is not a hotspot layer, not an SVG, not
canvas. It is backed by a **plain text list naming all 18 tools** — needlenose pliers, replaceable
wire cutters, electrical crimper, wire stripper, 420HC knife, serrated knife, saw, spring-action
scissors, ruler (8 in | 19 cm), can opener, bottle opener, wood/metal file, diamond-coated file,
large and small bit drivers, medium screwdriver, and the rest.

**The text list is the authority; the diagram is the illustration.** That inversion is why the
page is accessible without anyone having built an accessibility feature: remove the image and the
information is intact. Specifications are structured text — closed length 4″, open 6.25″, primary
blade 2.92″, width 1.2″, height 0.7″, 420HC stainless, 55–59 HRC.

2,659 reviews. Cross-sell is a **side-by-side specification comparison table** across five sibling
models — the same mechanism Kimes Ranch uses for jeans.

### 2.10 Filson — the fit table done properly

Eleven images. Size chart is an **HTML table** giving neck, chest, waist, pit-to-pit and arm
length across seven sizes plus four long options — five garment measurements per size, the
richest in the sample. Model stated as **6'1″, 185 lbs, size Medium** (weight as well as height).

Craft content — "Stitched in Seattle", the 1914 patent, the Forest Service history, why Mackinaw
wool blocks wind while staying breathable — sits **after** add-to-cart, with its own photography
and a video of the creative director explaining the garment. Six named features, none with a
per-feature detail photograph. No reviews.

---

## 3. The pattern — what separates a $300 boot page from a $60 jean page

Ranked by how much of the difference each factor explains.

**1. Vocabulary, not media. (the largest single factor)**
Lucchese's page is only ~1,700 px taller than Kimes Ranch's and *shorter* than Wrangler's. What
makes it feel like a $600 boot is that it teaches you the names of things: twelve toes, six heels,
each with a code, a measurement and a reason. Once you know a snip toe was made for a stirrup, the
boot is not a picture any more — it is a set of decisions someone made. **This is information
architecture and it costs photography, not budget.**

**2. Numbers instead of adjectives.**
The premium pages state weave, weight, spin, rise, opening, heel height, shaft height in units:
`3×1 right hand twill, ring spun, 13.75 oz`; `1 3/4″ tall`; `11 7/8″ front rise`. The cheap pages
say "premium", "classic", "flattering". Wrangler is the proof that this is not a price effect —
it is the cheapest garment in the sample and it publishes front rise and leg opening while a
$525 Schaefer jacket publishes no measurement at all.

**3. Evidence per claim.**
Everyone names construction points. Almost nobody photographs them. Tecovas names ten and shows
none. Rockmount names four and shows none. Schaefer names six and shows four. Only Lucchese ships
an image for every entry in its glossary — and that is why its fit section reads as authority
rather than marketing.

**4. Behaviour over time.**
The pages that feel expensive tell you what the object *becomes*: Kimes on shrinkage and dye
transfer with exact inches; Tecovas on break-in and a conditioning interval; Lucchese on initial
heel slip and a three-step CONDITION / WEAR / WAIT discipline. A garment with a described future
is a garment someone expects you to keep.

**5. Fit evidence as a distribution.**
Lucchese's "Tight 25 · True to Size 60 · Too Large 2" and Schaefer's "runs large" are worth more
than a star average. Miss Me's reviewer-supplied heights are the same idea from the other end.

**6. Media volume — the smallest factor.**
Lucchese carries 18 media items and Miss Me carries 6, a 3× difference for a ~6× price
difference. Video is nearly absent from western: two of eight PDPs have any, both short, both
`autoplay=false` with visible controls (which is also the WCAG 2.2.2 answer — the category has
already converged on the compliant behaviour).

**Verdict: roughly 70% information architecture, 30% media.** The expensive-feeling pages are
not the ones with more pictures. They are the ones where a named thing, a number and a photograph
of that exact thing arrive together.

---

## 4. Mechanisms worth adapting for a garment (not a boot)

Boot pages get an easy win: a boot has six universally named parts. A shirt or a jean has to earn
the same structure. These translate:

- **A house construction glossary, keyed per product.** Lucchese's toe/heel model, restated for
  denim and shirting: leg openings, rises, yoke shapes, cuff types, pocket treatments, snap
  styles — each with a code, a measurement and a one-line reason it exists. The product page
  highlights the values this garment uses. It scales: one photograph per option, reused across
  the whole catalogue, forever.
- **The two decisive numbers, in the buying panel.** For western denim those are **front rise**
  and **leg opening**, because they determine whether the jean sits right over a boot. Wrangler
  and Cinch both publish them; premium brands frequently do not.
- **Fabric stated as weave + spin + weight.** `3×1 right hand twill · ring spun · 13.75 oz` is a
  complete, checkable, non-boastful specification.
- **A sibling comparison table on the attributes people actually choose between.** Rise, leg
  opening, fabric content, fit. Cross-sell that answers a question instead of adding options.
- **Behaviour-over-time copy with numbers in it.** Shrinkage in inches, dye transfer, break-in
  period, wash instruction for the first few washes.
- **View-named gallery alt text.** Front · back · quarterfront · detail · worn · sole. Tecovas
  proves a systematic vocabulary is worth more than a long sentence.
- **Model statement as a fit anchor.** Height, and the exact size worn. Filson adds weight.
- **Numbered diagram whose text list is the authority** (Leatherman). The picture illustrates;
  the list carries the information.
- **Care instructions that name a product and an interval**, not "wash cold".

Explicitly **not** worth taking: image-based size charts (three of eight — a WCAG 1.1.1 failure);
review engines that occupy three-quarters of the page (Wrangler); construction claims with no
evidence image (everyone but Lucchese).

---

## 5. What Frontier House should change

Our current PDP — `src/ui/pdp/gallery.tsx`, `src/ui/pdp/sections.tsx`,
`src/app/(public)/mens/[slug]/page.tsx` — already holds two positions nobody in this sample
holds:

- **Every anatomy callout must carry its own evidence image.** `PdpAnatomy` renders nothing
  without a `DemoDetail.image`. Lucchese is the only brand of ten that meets this bar, and only
  inside its fit glossary.
- **The `seen` badge**, which marks the subset of spec rows provable from the photograph on the
  page. No brand in the sample distinguishes *what is shown* from *what is asserted*. It is a
  genuinely novel honesty mechanism and it should be protected in every change below.

The gallery is also already the most robust in the sample: a scroll-snap strip with anchor
thumbnails and `:target` zoom needs no JavaScript at all, where Lucchese's, Tecovas's and Miss
Me's galleries are script-driven carousels.

Ranked by value. Each names the data or photography the owner must supply.

### R1 — Per-size garment measurements as an HTML table *(highest value; blocks nothing else)*

The gap that matters most. `PdpStory` renders `fit` as a `<dl>` of term/value pairs — good for
"Rise: mid", useless for "what is the waist at a 32". Filson and Rockmount both ship five
measurements across every size as real table markup; Wrangler ships a captioned three-column
table. We currently ship none.

**Build:** a `<table>` with a `<caption>`, sizes down the first column, measurements across —
laid flat, garment-measured, with the measuring method stated once. It must be a real table, not
a grid of `<div>`s, and never an image (§8.4). Add a tolerance row: the honest thing no site
publishes is that a graded measurement has a range.

**Owner must supply:** the **grading spec** — the finished-garment measurement for every size in
every style, in the points the category needs (jean: waist, front rise, back rise, thigh, knee,
leg opening, inseam; shirt: neck, chest, sleeve, shoulder, body length; jacket: chest,
pit-to-pit, sleeve, body length), plus the measuring convention and the production tolerance.
This is a spreadsheet from the pattern room, not a photoshoot. It is the single cheapest
high-value asset on the whole critical path.

### R2 — A house construction glossary, keyed to the garment

The Lucchese mechanism, translated. A shared, cross-catalogue set of named construction
options — leg openings, rises, yokes, cuffs, pocket treatments, snap types, stitch details — each
with a short code, a measurement where one exists, and one sentence on why it exists. The PDP
shows the whole set with this garment's values marked, exactly as Lucchese marks the boot's toe
and heel codes.

This subsumes `PdpAnatomy`'s per-product callouts rather than replacing them: the glossary
teaches the vocabulary once and amortises across every product; anatomy keeps proving *this*
garment's execution of it.

**Build:** a `<details>`-based accordion with the panels rendered in the markup, matching what
Lucchese actually does (content computes `display: block`, no `hidden`, so it survives a JS
failure). Keyboard-native, no-JS-safe, consistent with our existing `pdp-fold` pattern.

**Owner must supply:** (a) the **list of construction options the house actually uses** across
the line, with correct trade names; (b) **one silhouette or macro photograph per option**, shot
once on a neutral ground and reused catalogue-wide; (c) the measurement per option where one
exists (leg opening in inches, yoke depth, cuff width). Roughly 15–25 photographs total for the
whole catalogue — not per product.

### R3 — Fabric stated as weave + spin + weight, and the two decisive numbers in the panel

`PdpStory`'s `details` fold currently takes whatever the fixture provides. Give it a fixed
minimum contract for denim (`weave`, `spin`, `weight in oz`, `fibre content`) and surface the two
numbers that decide a western jean — **front rise** and **leg opening** — in the buying panel
beside the size run, not three folds down. Wrangler puts them in the description of a $59.99
jean; there is no excuse for a premium page to hide them.

**Owner must supply:** mill specification per fabric — weave structure, yarn type, oz/yd², fibre
content — and the finished front rise and leg opening per style. Available from existing tech
packs; no photography required.

### R4 — Behaviour over time

Add a fold — "How it wears in" — carrying what the garment *becomes*: shrinkage in inches after
first wash, dye transfer risk, break-in period, whether to size for shrink. Kimes Ranch publishes
exact figures and it reads as confidence, not a warning.

This is also a natural place for the `seen` discipline to extend: a wear claim is provable only
if we photograph a worn example. If the owner cannot supply a worn garment, the fold does not
render — same rule as everywhere else in `sections.tsx`.

**Owner must supply:** wash-test results (shrinkage percentages by axis), crocking/dye-transfer
test results, and the recommended sizing instruction that follows from them. Optionally, **a
photograph of the same style worn in and washed**, beside the new one — no site in the sample
does this, and for a manufacturer that owns its textile production it is a claim only we can make.

### R5 — Gallery view vocabulary, and the anatomy-to-frame link

Two fixes to work we already have.

`galleryFrames()` in the men's route assigns labels positionally —
`['Front','Worn','Detail','In context','Alternate']` by index. That is a guess about what the
photograph shows. Tecovas names the view in the alt text itself ("Quarterfront view", "Sole
view") because the view is a property of the image, not of its position. **Move the view name
onto the media record.**

Second: `PdpAnatomy` callouts float free of the gallery. Number them, and mark the gallery frame
each one is cropped from, so "03 — Yoke" points at the frame where the yoke is visible. That is
the Leatherman numbering discipline applied to our stronger evidence rule — and because our
callouts already carry real photographs, we get the numbered diagram *without drawing a diagram*.

**Owner must supply:** a **named shot list** per garment — front, back, quarter, collar/yoke
macro, cuff macro, hem/leg-opening macro, hardware macro, fabric macro at a stated scale, worn
full-length, worn detail — with the view name recorded per file at capture. Naming the shots
before the shoot costs nothing and is the difference between a gallery and a document.

### R6 — A sibling comparison table

Our related-products grid shows three cards with a name and a picture. Kimes Ranch and Leatherman
both instead compare siblings **on the attributes people choose between**. Replace the grid on
category-sibling pages with a small comparison table: fit, rise, leg opening, fabric weight. It
is more useful, it is `<table>` markup, and it works with no JavaScript.

**Owner must supply:** nothing new — this is R1 and R3 data, re-projected.

### R7 — Fit evidence without inventing people

Lucchese's "Tight 25 · True to Size 60 · Too Large 2" is the most decision-useful artefact in the
sample, and it is closed to us: §12 forbids invented reviews, and there is no consumer channel to
generate real ones (D-01). The honest equivalents for a wholesale-first launch are:

- **a stated measuring convention and production tolerance** (from R1) — nobody publishes this,
  and for a buyer placing a prepack it matters more than a consumer histogram;
- **a fit-intent statement per style** — what the pattern was cut to do, in the maker's words;
- later, once real buyer data exists, **aggregate reorder or size-run sell-through** — a
  wholesale-native form of the same evidence.

**Owner must supply:** the tolerance figure and the fit intent per block. Both already exist
inside a manufacturer that owns its patterns.

### R8 — Care that names a product and an interval

`PdpStory`'s `care` fold is generic. Tecovas names the conditioner and the interval; Lucchese
gives three imperative steps and an exotics caveat. Specific care copy is a low-cost, high-trust
addition and it is the natural home for the natural-variation disclaimer that a vertically
integrated maker should be making anyway.

**Owner must supply:** the real care regime per fabric and any known variation caveats.

### R9 — Video, if and only if it exists

Two of eight western PDPs carry video. Both are short (10 s, 18 s), neither autoplays, both
expose full controls. If D-11 ever resolves, that is the specification: short, controls visible,
`autoplay=false`, poster-first — which also satisfies WCAG 2.2.2 without a bespoke pause control.
**No video should be built before R1–R5 land**; a measurement table is worth more than a film.

---

## 6. Ordering note

R1, R3, R7 and R8 are **data tasks with no photography dependency** and can proceed immediately —
they are spreadsheets and specifications from a manufacturer that already owns the information.
R2, R4 and R5 need photography, and R5's shot list should be settled **before** the first
owner shoot, since naming views at capture is free and renaming them afterwards is not. R6 falls
out of R1 and R3 for nothing. R9 waits.

This ordering matches the standing finding that the critical path is data and photography, not
front-end work.
