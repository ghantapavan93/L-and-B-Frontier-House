# L&B Frontier House — Platform Blueprint

**Deliverable A (three visual directions) and G (recommended direction).**
B and D: [`LB_STORYBOARD_AND_MOTION.md`](LB_STORYBOARD_AND_MOTION.md) ·
C and E: [`LB_WIREFRAME_AND_DESIGN_SYSTEM.md`](LB_WIREFRAME_AND_DESIGN_SYSTEM.md) ·
F: [`LB_BUSINESS_EXPERIENCE_MAP.md`](LB_BUSINESS_EXPERIENCE_MAP.md).

---

## 0. The finding that should shape this decision

**This exact three-way fork has already been run on this project.** V1 explored
precisely these directions under precisely these names:

| This brief | V1, already built and archived |
| :--- | :--- |
| A — Cinematic Monochrome Western Editorial | **Direction A — Monochrome Editorial** |
| B — Warm Modern Western Luxury | **Direction B — Warm Modern Luxury** |
| C — Future Western | **Direction C — Experimental Future** |

V2 rejected the fork and synthesised one journey. V3 shipped a descendant of **B**
— its subhead *"Precision tailoring meets raw materiality"* is a direct descendant
of V1-B's *"Precision tailoring meets rugged authenticity."* The production
application ships that lineage today.

So the recommendation in §G is not a preference. It is a question the project has
already answered once, with artefacts, and the honest move is to say what changed
since — not to re-run the exploration as though it were new.

## 0.1 What is verified, and what this blueprint may only propose

The brief describes a business the owner is **considering**. That framing is
correct and this document keeps it. Nothing below may be built as an active
service until its gate clears.

| Element | Status |
| :--- | :--- |
| Women's western apparel, wholesale to approved retailers | **VERIFIED.** Ships today |
| Girls, Accessories & Home | **VERIFIED** categories, blocked on photography |
| $50 minimum · prepacks of 6 · tax ID · sub-1-day approval · 100% fill · 2.64 days · showroom #13656 | **VERIFIED.** Never round these |
| **FOR HIM / menswear** | **NOT VERIFIED.** Menswear does not exist. Entered the project through V1's storyboard and has never been re-examined. Blocked on **D-03** |
| **Boots, hats, belts** | **NOT VERIFIED.** Footwear does not exist. The corpus's $850 men's boot and $495 Frontier Boot are fiction |
| **Direct-to-consumer** | Blocked on **D-01.** The brand's own FAQ says it sells only to approved retailers |
| Customization / Built By You | Blocked on **D-16.** V2 had the honest version: inside the PDP, with a lead time and a human-review gate |
| Loyalty, points, reviews, AI stylist | **No evidence.** "Do not build features without evidence" |
| "Made in Texas" | **NOT EVIDENCED (OQ-04).** V1's *"from the heart of Texas"* asserts identity without a manufacturing claim and is safe to re-adopt verbatim |

**The design may show all four worlds. The application may not claim the two that
do not exist.** A prototype that renders `FOR HIM` with product in it is a
capability claim, and the owner will discover it is false the moment he clicks.
The blueprint therefore treats FOR HIM and BUILT BY YOU as **designed, gated and
visibly pre-launch** — which is a stronger demonstration of judgement than
pretending, and is exactly what the brief means by "engineering maturity."

---

## A. Three visual directions

### Direction A — Cinematic Monochrome Western Editorial

**Design thesis.** Remove colour so material has to carry the work. Weave, grain,
topstitch and hardware become the only subject. Colour returns exactly once per
page, from the garment itself.

**Emotional response.** Gallery, not shop. Serious, adult, unhurried. The visitor
slows down.

**Colour.** Ink `#0a0a0a` and bone `#f5f2ee` at 92% of surface. Carbon `#121212`
for depth. **Rust `#8b3a3a` as the sole accent, one instance per viewport.**
Silver reserved for hardware highlights.

**Typography.** Display serif at 84/64 with tight tracking; grotesk at 16/24;
mono for SKU, pack and measurement. Type is a layer — behind the model, cropped
by the viewport, crossing depth planes.

**Photography.** Black and white, hard raking light, deep blacks, macro-first.
The one V1 asset worth recovering: **the Dallas skyline** — the only verified real
geography in the entire corpus.

**Hero.** Full-bleed monochrome macro, headline centred over it, single rust CTA.

**Motion.** Contact-sheet eruption and time tunnel read *better* in monochrome,
because the colour drain that signals depth is already the palette.

**Mobile.** Strongest of the three. Monochrome compresses without loss; a 360 px
source degrades far less gracefully in colour than in greyscale.

**Product card.** 4:5 monochrome, name, one meta line. Colour swatch is the only
chroma.

**Product page.** Material fills the viewport on arrival, then resolves to
specification. Anatomy list over a still.

**Customization.** Excellent — thread and patch colour are the only colour on
screen, so the customer's choice is literally the accent.

**Wholesale.** Excellent. Line-sheet logic *is* monochrome logic.

**Strengths.** Cheapest to art-direct. Most forgiving of 360 px sources. Ages
slowest. Highest contrast headroom for accessibility.

**Risks.** Reads cold if warmth is not carried by copy. Western without colour can
tip into fashion-generic. Garment colour becomes load-bearing — a bad shot has
nowhere to hide.

**Staying current.** Monochrome does not date; *composition* dates. Keep the grid
plain and let photography rotate.

---

### Direction B — Warm Modern Western Luxury

**Design thesis.** Premium is material honesty at high resolution, lit warm. The
interface is bone paper; the colour comes from leather, denim and thread.

**Emotional response.** Welcome, craft, hospitality. Texan warmth without twang.

**Colour.** Bone `#f5f2ee` page, raised `#fffdfa` panels, hairline `#e2dbd1`.
Tobacco `#734f36` for focus and accent, indigo `#1b2b45`, sandstone `#d9c5b2`,
rust `#8b3a3a` for error only. Ink for the single primary action.

**Typography.** Playfair Display + Hanken Grotesk + JetBrains Mono. Label-caps at
12/600/0.1em is the connective tissue.

**Photography.** Warm 3200 K raking key, cool rim, real texture. Tooled leather,
selvedge, pearl snap, bone stitch.

**Hero.** Raised panel over warm ground; headline balanced; outlined controls with
one solid black primary.

**Motion.** 100–400 ms, two curves, poster-first. Restraint is the style.

**Mobile.** Proven — this is what ships today at 320/360/390/430 with no overflow.

**Product card.** 4:5 on sunken ground so a missing image is a designed box.

**Product page.** Editorial arrival band (blurred oversize backdrop behind a sharp
contained image — this is what protects 360 px sources from soft full-bleed),
then anatomy as a semantic list.

**Customization.** Good. Thread palette sits naturally in the warm system.

**Wholesale.** Strongest of the three. Label/value rows, raised panels and
hairlines are exactly what a buyer reads fastest.

**Strengths.** Already built, already tested, already accessible. 103 kB First
Load JS. Warm without cliché.

**Risks.** Least surprising. A buyer who has seen three premium DTC sites has seen
this register. Warmth can read soft if the type does not stay disciplined.

**Staying current.** It already survived four generations. Refresh photography,
never the chrome.

---

### Direction C — Future Western

**Design thesis.** The navigational object *is* the brand. A physical artifact —
the buckle — encodes the verified vertical-integration chain and becomes the way
you move through the business.

**Emotional response.** Astonishment first, comprehension second. Memorable in a
way A and B are not.

**Colour.** Near-black field, indigo depth, turquoise `#7fe0d6` as the single
luminous signal, restrained copper warmth. Colour is emitted, not printed.

**Typography.** Ghost display headlines at low contrast behind the artifact;
label-caps stage markers (`01 · Ignition`); mono for data.

**Photography.** Less photography, more *rendered material* — which is precisely
why it is available today: the buckle is an object we designed, so it needs no
owner shoot and makes no product claim.

**Hero.** Ink field, buckle artifact, luminous monogram drawing on, three
poster-first actions.

**Motion.** The full system — eruption, tunnel, portal, layered type, scrubbed
film, anatomy, living cart.

**Mobile.** An original composition, not a compressed desktop. Depth carousel,
compact disclosure chrome.

**Product card.** Risk of the atmosphere layer swallowing the product. Mitigation
is structural, not stylistic — see §G.

**Product page.** Garment portal: camera approaches material, material becomes the
page background.

**Customization.** Best of the three — configuration inside a dimensional preview.

**Wholesale.** Weakest. A buyer building a $50-minimum pack order does not want
cinema. **Cinema belongs to discovery, never to checkout.**

**Strengths.** Only direction that is genuinely differentiated. Grounded in
verified brand truth rather than invented. The buckle asset already exists,
finished and delivered.

**Risks.** The failure mode this project is most likely to hit: *the atmosphere
layer and the commerce layer gradually fuse until products no longer exist in the
DOM.* It happens one reasonable transition at a time and code review will not
catch it. Precedent is real — an Awwwards Site of the Year ships a DOM containing
a single text node.

**Staying current.** WebGL dates fastest of anything here. Everything durable in
this direction is CSS, SVG and pre-rendered video.

---

## G. Recommended direction

### Ship B as the platform. Let C own discovery. Take one thing from A.

Not a compromise — a division of labour, with the boundary drawn where the
evidence puts it.

**Why B is the substrate.** It is the only direction with a shipped, tested,
accessible implementation: 360 tests green, 103 kB First Load JS, no overflow at
320–430 px, axe clean under reduced motion, and a permission boundary proven by
three CI gates. Rebuilding that in A or C spends months to arrive at the same
commerce with worse contrast headroom or worse performance.

**Why C owns discovery only.** C is the only direction that answers *"why this
company and not the other one"* — and it is real, not styling: the buckle encodes
the **verified** Textile → Design → Manufacturing → Warehouse → Distribution →
Boutique → Customer chain. It is also already produced. But its wholesale story is
its weakest, and wholesale is the audience that currently pays.

**Why one thing from A.** V1 specified *"CSS backdrops using subtle denim grain or
leather texture noise rather than flat hex colors"* — and it is the clearest
concept lost between generations. It is a rendering technique, not a layout, so it
costs nothing and applies to all three. It ships today as a 2.5% fractal-noise
overlay.

### The rule that makes the hybrid safe

> **One server-rendered product truth. Atmosphere mounts above it, never replaces
> it. Removing the atmosphere layer entirely must leave a complete, correct,
> shoppable store.**

Enforced by three CI tests that gate every build: no-JS product assertion,
unauthenticated crawl assertion, slug purity. This is the structural defence
against C's failure mode, and it is why C can be adopted at all.

### Against the brief's own criteria

| Requirement | How the hybrid meets it |
| :--- | :--- |
| Impress the owner | C's ignition is unlike anything in western apparel, and it is *his* supply chain rendered as an object |
| Remain commercially usable | B runs every commerce surface. Cinema never enters checkout |
| Support multiple brands | Tokens, not hardcoded colour. A second brand swaps `tokens.css` and keeps identity, checkout, payments, analytics and audit |
| Scale to mobile | Mobile is an original composition, verified at four widths |
| Remain maintainable | The cinematic layer ships **0 KB of client JavaScript**. No GSAP, no WebGL, no Three.js in Phases 1–2 |
| Avoid dating | Everything durable is CSS, SVG and pre-rendered video. The one thing that would date fastest — runtime WebGL — is the one thing not built |

### What this costs the brief

Four honest subtractions, each with a reason rather than a refusal:

1. **No 20-second mandatory intro.** The brief's own restriction list forbids it.
   The signature runs **10 seconds**, is skippable, and remembers the choice.
2. **No FOR HIM until D-03.** Designed and gated, not populated.
3. **No boots, hats or belts.** Footwear does not exist.
4. **No runtime 3D in Phases 1–2.** three.js has a hard floor of ~132 KB gzip
   (~250 KB with R3F) against a 180 KB budget, and one 2048² RGBA8 texture costs
   20.8 MiB of VRAM with mipmaps — invisible in a network waterfall and fatal on a
   mid-range Android. Deterministic sequences are **pre-rendered video**, which is
   why the buckle already exists as MP4 and WebM rather than as a GLB.
