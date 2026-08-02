# 18 — Owner Decisions Required

Each entry states the decision, the evidence, what it blocks, and a recommendation.
**Nothing here is decided.** Ordered by consequence.

---

## D-00 — The wholesale price leak on the live site · **URGENT, INDEPENDENT**

**Not a design decision.** Raised first because it is live and costing money now.

`VERIFIED FACT` — Wholesale unit costs are publicly readable in product URL slugs
(`/16-00-classic-western-button-down-…`) on **17 homepage products** and **14** on the
Aug 1 drop page; some titles print the price; an Afterpay widget computes on the un-gated
pack total.

**Consequence:** competitors can reconstruct the cost sheet; a boutique's own customers can
see what the shop paid; resale-price discipline is unenforceable.

**Needed:** confirmation of awareness, and whether the fix is in this project's scope or
handled separately on the existing platform. **Recommendation: fix separately, now.**

---

## D-01 — Wholesale, DTC, or both? · **BLOCKS ~⅓ OF SCOPE**

`VERIFIED FACT` — *"We are manufacturer and Designer who only sell to approved retailers.
As of now we are not selling our products directly to the consumers."*

`MEASURED` — The designs are substantially consumer-facing: `passport` in 14 files,
`atelier` in 15, consumer prices $45–$1,250, and no wholesale mechanic anywhere.

**Blocks:** Frontier Passport · consumer cart and checkout · returns policy · Custom
Atelier · the entire consumer half of the Four Worlds.

**Recommendation:** Confirm **wholesale-first**. Reinterpret the Passport as a **buyer**
passport — pack quantities, minimum progress, order history, market appointments. Same
visual concept, same name, real paying audience. Preserve the consumer surfaces as
designed-but-dormant.

---

## D-02 — Is "Accessories & Home" a real category? · **PARTIALLY VERIFIED**

`VERIFIED FACT` — Home goods are claimed in the brand's own About Us **and** the Dallas
Market Center listing. `VERIFIED FACT` — There is **no home category in the live site
taxonomy**. Footwear is listed on FashionGo but likewise absent.

**Blocks:** one of the four V3.1 worlds.
**Classification: PARTIALLY VERIFIED — owner confirmation required.**

**Recommendation:** If home goods ship, keep the world and merchandise it properly. If not,
narrow to Accessories, which is verified (belts, buckles, wild rags, bows, easy-haul bags).
**Do not design a home category on the strength of an About Us sentence.**

---

## D-03 — `FOR HIM` — menswear does not exist · **FALSE CAPABILITY CLAIM**

`MEASURED` — `FOR HIM` is one of the four gateway worlds in V3 Frame 5's markup.
`VERIFIED FACT` — The catalogue is women's and girls' only. `CLAUDE.md` §11:
*"Menswear does not exist. Never design as though it ships."*

`INFERRED` — Inherited verbatim from V1's storyboard and never re-examined across three
generations.

**Blocks:** Frame 5 entirely.

**Recommendation:** **Remove `FOR HIM`.** Replace with a verified fourth world — **Girls**
is real and already named in `v3_1_design.md`'s audience list. If menswear is a genuine
future ambition, it is a **roadmap** item, not a navigation item.

---

## D-04 — Which taxonomy, and is Plus a world or a filter? · **STRATEGIC**

`MEASURED` — Three incompatible taxonomies (V3 Frame 5 · V3.1 carousels ·
`v3_1_design.md`). Only **Wholesale** is common to all three.

`CLAUDE.md` §11 — *"One garment, one product record, one full size range. Plus is a filter
and a fit story, never a separate catalog"* — subject to **OQ-08**, since the plus
assortment may genuinely differ.

`INFERRED` — V3.1's structure mirrors the **live site's existing** separate plus catalogue,
so it is inherited, not invented. Research identifies coherent extended-size merchandising
as the **largest unclaimed position in western denim** — a direct competitor manufactures
plus to size 40 and does not merchandise it, sending that demand to third-party retailers.

**Recommendation:** First answer **OQ-08** — is the plus assortment identical to straight?
If yes: one record, plus as a filter with full editorial parity. If no: one product page
stating availability honestly per size range. **Either way, do not remove Plus
visibility** — elevate it inside the main catalogue rather than beside it.

---

## D-05 — What price tier does the visual system serve? · **CALIBRATION**

`MEASURED` — Markup prices run **$45 – $1,250**. `VERIFIED FACT` — wholesale $7–$33,
implied retail **$20–$85**.

`INFERRED` — The designs price the brand **10–40× above its actual product**. Layout,
whitespace, type scale and image density are all calibrated to a $1,250 object. A $38
dress in that composition reads as mispriced — the *"luxury imitation disconnected from
the actual merchandise"* failure the Creative North Star names.

**Recommendation:** Confirm the real retail band, then **recalibrate density rather than
lower ambition**. Premium here means material honesty at high resolution — legible weave
and topstitch — not scarcity. Replace every fictional price with verified data or clearly
labelled fixtures within the real band.

---

## D-06 — Typeface and voice · **BRAND**

`OBSERVED` — V3's `design.md` labels **both** faces *"Substitute."* Playfair Display has
carried three generations as a placeholder and has no western equity. `MEASURED` — four
text families ship against a two-family rule; Inter is specified but loaded in 0 files.

`OBSERVED` — Copy reads *"Craft Your Legacy"*, *"Crafted for the Modern Horizon."*
`VERIFIED FACT` — The brand says *"Howdy"*, *"Hey y'all"*, *"a dash of sass"*,
*"We are partners in your success."*

**Recommendation:** Commission or select a committed display face — the western vernacular
has its own typographic lineage distinct from the Didone register borrowed from Paris.
**And restore the brand voice.** Premium must come from photography, type and motion craft.
Deleting the warmth is the one thing the Creative North Star explicitly forbids.

---

## D-07 — The unspecified accent palette · **BRAND FIT**

`OBSERVED` — V3.1 names accents **"Electric Cobalt, Hot Magenta, Molten Amber"** with **no
hex values**. V3.1's own QA flags *"Bone White on Electric Cobalt requires AA check"* — a
check that **cannot be performed** because the colour is undefined.

`INFERRED` — Hot Magenta and Electric Cobalt have no western equity; they read as a
technology brand. The Creative North Star holds that colour should be *"carried by the
garment, not the interface."*

**Recommendation:** Either supply hex values and contrast-test them, or replace the accent
role with a colour drawn from the verified material palette — copper, turquoise and rust
are already in the buckle's own material list and are authentically western.

---

## D-08 — Do 3D assets and bespoke production exist? · **BLOCKS PHASE 3**

`MEASURED` — **0 GLB, 0 GLSL, 0 video, 0 textures.** All nine manifest assets missing.
`OPEN QUESTION` OQ-12 — no evidence the business offers custom production. OQ-13 — no
evidence any film exists.

**Blocks:** Product Anatomy · Custom Atelier · Image Becomes Film · Shoppable Film · the
whole Cinema tier.

**Recommendation:** Confirm what exists and what the production budget is. Until then:
Atelier becomes an **enquiry flow**, not a live configurator; the buckle and passage become
**rendered video**; Product Anatomy waits.

---

## D-09 — Generated-image licensing and replacement · **LEGAL / CONTENT**

`MEASURED` — ~30 unique generated images, all hosted on Google infrastructure, all
depicting garments, models, a workshop and a retail interior that **do not exist**.

**Recommendation:** Confirm usage terms. Treat every one as
`CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY`. **The workshop imagery is the
specific risk** — it could be read as evidence of manufacturing, and manufacturing location
is unverified (OQ-04). Never caption it as "our factory." Mirror the images locally before
the URLs expire.

---

## D-10 — Is "L&B Frontier House" a public name? · **NAMING**

`OBSERVED` — Rendered footers read *"© 2024 L&B Frontier House."* — used as a live public
brand, with a **stale copyright year**. `CLAUDE.md` §1 says it is a working internal name
(OQ-17).

**Recommendation:** Approve, replace, or scope it to an internal project name and use
**Lucky & Blessed** publicly.

---

## D-11 — Does any film exist, and what is the media budget? · **PRODUCTION**

`MEASURED` — **0 `<video>`, 0 `poster`, 0 `<track>`** across all 48 files. Three media
briefs specified, none produced.

**Recommendation:** Sequence by value per unit of cost — **material macro set first**
(cheap, shot in a day, carries the entire material-honesty thesis), then craft/process,
then garment motion clips, then campaign film. The site can look like a fashion house
before any film exists.

---

---

## D-15 — "EST. 1865" is a fabricated heritage claim, baked into artwork · **NEW, HIGH**

`OBSERVED` — The V3.1 mobile prototype hub is a full-bleed photograph of a belt buckle
engraved **"FRONTIER SEAL"** and **"EST. 1865"**.
`VERIFIED FACT` — Lucky & Blessed dates to approximately **2015**.

`INFERRED` — A **160-year fabricated heritage claim**. Unlike a copy error it is **rendered
into the image**, so it cannot be fixed by editing text — the asset must be reshot or
replaced. `CLAUDE.md` §12 forbids fabricated brand claims.

**Recommendation:** replace the asset. The buckle photograph is otherwise the single best
argument in the corpus that the Frontier Seal concept works — **keep the object, remove the
date.**

---

## D-17 — RESOLVED ON EVIDENCE: the loyalty layer is a V3 invention

> ### Closure finding (V2 Frame 8, inspected 2026-08-01)
> `OBSERVED` — **V2's Passport contains no loyalty points, no store credit, no rewards and
> no tier.** It is *"Member since 2022"* plus three tabs: **Wardrobe** (delivered-purchase
> archive), **Orders** (status, including an **"In Production"** state and an estimated
> delivery date) and **Saved**.
>
> **"FRONTIER TRUST ◆ 4,250" and "AVAILABLE CREDIT $150.00" appear only in V3 Frame 10.**
> They are not inherited. **Deleting the loyalty layer restores the original design intent
> rather than departing from it** — which materially lowers the cost and the risk of the
> buyer-first reinterpretation below.

## D-17 — Frontier Passport: reinterpret for the buyer · **refines D-01**

`OBSERVED` — V3 Frame 10 is a consumer account with **invented loyalty** (a 4,250-point
"Frontier Trust" balance and **$150.00 store credit**) and an invented customer monogram.
`CLAUDE.md` §11 classifies loyalty **NOT JUSTIFIED**.

`INFERRED` — **The mechanics beneath it are the strongest buyer design in the corpus** and
transfer with the audience changed and the loyalty layer deleted:

| As designed (consumer) | As a buyer passport |
| :--- | :--- |
| Order in transit, ETA, track | Open orders, ship window, track |
| **Fit Feedback: "True to Size" / "Slightly Boxy"** | **Sell-through and fit feedback per style** |
| **Alterations: "Sleeves shortened 0.5″"** | **Pack/size-run adjustments per account** |
| **REORDER SAME SPEC / WITH ALTERATIONS** | **Reorder — the highest-frequency buyer action** |
| "Viewing 12 Garments" collection | Saved assortments / line sheets |
| Frontier Trust points + credit | **Delete** — replace with terms, credit limit, balance |

**Recommendation:** preserve the visual concept and the name; change the audience; delete
loyalty. **Living Cart → buyer order builder. Frontier Passport → buyer account. Consumer
account → FUTURE DTC.**

---

## D-18 — The Atelier is more credible than assessed, and needs no 3D · **NEW, refines D-08**

`OBSERVED` — V3 Frame 9 has a real multi-step wizard, a **human-in-the-loop production
journey** (Draft → Craft Review → Your Approval → In Production), and a **manufacturing
feasibility warning** (*"Fine details may merge at sizes under 3 inches"*).

`INFERRED` — Two consequences. **It requires no real-time 3D** — the preview is a
photograph with a 2D overlay, and Front/Back/Detail are three photographs, not camera
angles. **And it has a wholesale reading**: retailer-exclusive colourways, buyer artwork
placement, or assortment configuration — which would serve the audience that actually pays.

**Still missing:** pricing, MOQ, quote, size selection, save state, confirmation.
**Recommendation:** classify **OWNER DECISION REQUIRED**; if approved, build as a **2D
layer configurator**, and evaluate the wholesale reading first.

---

## D-16 — "View in Space" AR appears in no specification · **NEW**

`OBSERVED` — `8g_8` includes an AR card: *"Experience the materiality in your own
environment before acquiring."* AR appears in **no manifest, no handoff, no design
document**, and has no supporting research.

**Recommendation:** classify **NOT CURRENTLY JUSTIFIED**. It carries device, asset-pipeline
and accessibility cost, and it depends on 3D assets that do not exist (D-08). Preserve the
concept; do not scope it.

---

## D-03 — escalated again by visual batch 3

`OBSERVED` — **"MEN" appears in V3.1's own category navigation** (`8g_1`:
*WOMEN · MEN · ACCESSORIES AND HOME · PLUS · WHOLESALE*).

> **This overturns the batch-1 conclusion** that V3.1's taxonomy was menswear-free and
> therefore more brand-accurate than V3's. **Menswear is confirmed in both generations**,
> and V3.1 is internally inconsistent — `8f` lists GIRLS where `8g_1` lists MEN.
>
> **Six taxonomy variants now exist across the corpus.** The decision is no longer "remove
> one label" but **"choose one taxonomy and enforce it."**

---

## D-15 — widened by visual batch 3

Two **mutually inconsistent** fabricated origin dates now exist: **"EST. 1865"** engraved
into the mobile hub's buckle, and **"Origin: 1870s American West"** captioned on `8b`.
`8b` also lists **"Neon Thread"** as a material. **This is a pattern, not a single asset.**

---

## D-04 — refined by visual batch 2

`OBSERVED` — Plus has **equal representation** (the best photography and copy in the
corpus — *"Every world, every silhouette"*) but **unequal structure**: an inset card rather
than full-bleed, no carousel affordance, tagged **"BESPOKE SIZING"**, and filed under the
**Custom** tab while Women sits under **Discover**.

`INFERRED` — **Routing plus sizing into a bespoke/made-to-order lane is a subtler and more
damaging separation than a separate catalogue** — it implies special-order rather than
stock. The decision is now narrower and sharper: **not "is Plus visible" but "is Plus
stocked or bespoke".**

---

## Summary

| # | Decision | Blocks | Urgency |
| :--- | :--- | :--- | :--- |
| **D-00** | Live price leak | Nothing — but live | **Now, separately** |
| **D-01** | Wholesale / DTC / both | ~⅓ of scope | **Before Phase 2** |
| **D-03** | `FOR HIM` | Frame 5 | **Before Phase 2** |
| **D-04** | Taxonomy + Plus | Navigation, catalogue | **Before Phase 2** |
| D-02 | Accessories & Home | One world | Before Phase 2 |
| D-05 | Price tier | Visual calibration | Before Phase 2 |
| D-06 | Typeface + voice | Design system | Before Phase 2 |
| D-07 | Accent palette | Motion colour | Before Phase 3 |
| D-08 | 3D + bespoke | Phase 3 | Before Phase 3 |
| D-09 | Image licensing | Any external use | Before launch |
| D-10 | Public name | All copy | Before launch |
| D-11 | Film budget | Cinematic surfaces | Before Phase 3 |

> `INFERRED` — **None of these blocks Phase 1.** Buyer authentication, the permission
> boundary, prepacks and minimums, filters, size and fit, the daily drop, and the CI tests
> can all start immediately and serve the only audience that currently pays.
