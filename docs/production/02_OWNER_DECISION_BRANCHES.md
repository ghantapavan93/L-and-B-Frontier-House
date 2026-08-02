# 02 — Owner Decision Branches

**Every unresolved decision is carried as an explicit branch. None is silently decided.**
**The default safe branch never introduces an unsupported business claim.**

Format per decision: question · why it matters · default safe branch · alternative ·
affected components/data/routes · evidence needed · cost of changing later · **last
responsible moment**.

---

## D-00 — The live wholesale price leak · **NOT A DESIGN DECISION**

Wholesale costs are readable in product URL slugs on 17 homepage products and 14 on the
Aug 1 drop page; some titles print the price; an Afterpay widget computes on the un-gated
pack total.

**Not a branch — an operational incident.** Full plan in
[`21_D00_PRICE_LEAK_REMEDIATION_PLAN.md`](21_D00_PRICE_LEAK_REMEDIATION_PLAN.md).
**Last responsible moment: immediately. It is costing money now.**

---

## D-01 — Wholesale only, or wholesale + future DTC?

**Why it matters:** determines roughly a third of scope, and whether the brand competes with
the boutiques that are its current revenue.

| | |
| :--- | :--- |
| **Default safe branch** | **Wholesale only.** Consumer surfaces are designed but not built. No consumer price, cart, checkout or account ships |
| **Alternative** | Dual-audience. Requires a returns policy (current policy is *"All Sales Are Final"* — fine for wholesale, unacceptable for consumers), consumer support, fulfilment, sales-tax handling, and an answer to channel conflict |
| **Affects** | Routes `/cart`, `/account`, `/checkout` · `PriceBlock`, `AddToOrder` vs `AddToBag` · the Passport's audience · the entire pricing model |
| **Evidence needed** | Owner statement; resolution of **D-02 (TikTok Shop seller identity)** |
| **Cost of changing later** | **Low if wholesale-first.** The buyer model is a superset — adding DTC later means adding a price tier and a checkout, not rebuilding. **High in reverse:** a DTC-first build has no permission boundary to retrofit |
| **Last responsible moment** | Before Phase 2 |

---

## D-02 — Who sells "Lucky And Blessed" on TikTok Shop?

May already answer D-01. **Default:** assume a stockist until proven otherwise; build no
consumer channel. **Evidence:** owner confirmation. **Last responsible moment:** with D-01.

---

## D-03 — Menswear · `FOR HIM` and "Men's Collection"

**Why it matters:** menswear appears in **every generation** — V1's nav (all six frames),
V3 Frame 5's gateway, V3 Frame 6's hero **and its $850 men's boot**, V3.1 `8g_1`'s nav,
`12k`'s "Men's Collection" row, and V3 Frame 11's workwear rack. **The catalogue is women's
and girls' only.**

| | |
| :--- | :--- |
| **Default safe branch** | **Remove menswear entirely.** Replace the fourth gateway slot with **Girls**, which is verified and already named in `v3_1_design.md` |
| **Alternative** | Retain as a roadmap item — a *future category* page with no product, clearly labelled |
| **Affects** | Frame 5 gateway · homepage hero · mobile category rows · every category route · navigation · photography brief |
| **Evidence needed** | Owner confirmation that menswear is not planned for launch |
| **Cost of changing later** | **Low** — adding a category is additive. Shipping a false one is a capability claim |
| **Last responsible moment** | Before navigation is built (early Phase 1) |

---

## D-04 — Taxonomy, and is Plus a world or a filter?

**Why it matters:** **six conflicting systems exist.** Only *Wholesale* is common to all.

| Source | Segments |
| :--- | :--- |
| V1 Mobile A | For Her · **For Him** · Custom |
| V1 Desktop C | *"Choose Your West"* |
| V3 Frame 5 | For Her · **For Him** · Built By You · Wholesale |
| V3 Frames 2/10/11 | The High Plains · Dust & Denim · Silver & Silk · The Bespoke Atelier |
| V3.1 `8f` + `v3_1_design.md` | Women · Plus · **Girls** · Accessories & Home · Wholesale |
| V3.1 `8g_1` | Women · **Men** · Accessories & Home · Plus · Wholesale |

| | |
| :--- | :--- |
| **Default safe branch** | Use the **verified live taxonomy**: Women (jeans, tops, dresses, skirts, skorts, shorts, pants, outerwear, jumpsuits/rompers) · Girls · Accessories (belts & buckles, wild rags, bows, easy-haul bags). **Plus is a size facet on one product record, not a world.** Wholesale is a channel, not a category |
| **Alternative** | Adopt V3.1 `8f`'s five worlds *if* Home is verified (D-05) |
| **Affects** | Every route, every filter, the product model, navigation, the sitemap |
| **Evidence needed** | Confirmation of the live category tree; **OQ-08 — is the plus assortment identical to straight?** |
| **Cost of changing later** | **High.** Taxonomy is in every URL. Changing it after launch means redirects at scale |
| **Last responsible moment** | **Before any route is written.** This is the earliest hard gate |

**Plus sub-branch.** Visual evidence is split: `8f` gives Plus **typographic parity** with
Women, but `12f_2` renders it in a different layout system, without carousel dots, tagged
**"BESPOKE SIZING"**, filed under the **Custom** tab. **Default: never route Plus to Custom
or Bespoke.** If the assortment genuinely differs, state availability per size range on one
product page rather than splitting the catalogue.

---

## D-05 — Is "Accessories & Home" real?

**Partially verified.** Home goods are claimed in the brand's own About Us **and** the Dallas
Market Center listing, and `8g_8` finally depicts one (*The High Plains Blanket*) with a
**HOME** filter chip — but there is **no home category in the live taxonomy**.

**Default safe branch:** ship **Accessories** only (verified). **Alternative:** include Home
if the owner confirms sellable inventory. **Cost of changing later:** low — adding a
category is additive. **Last responsible moment:** with D-04.

---

## D-06 — Price tier and the visual system

Designs price the brand **$45–$1,250**; verified wholesale is **$7–$33**, implied retail
**$20–$85**. Layout, whitespace and image density are calibrated to a $1,250 object.

**Default:** every fixture uses a value inside the verified band, clearly marked as a
fixture. **Alternative:** owner confirms a different real band. **Cost later:** medium —
recalibrating density is a design pass, not a rebuild. **Last responsible moment:** before
component styling is fixed.

---

## D-07 — Typeface, voice, and the accent palette

Playfair Display is labelled *"Substitute"* in V3's own `design.md` and has carried three
generations as a placeholder. Four text families ship against a two-family rule. The brand's
voice — *"Howdy"*, *"Hey y'all"*, *"a dash of sass"* — appears **nowhere** in the designs.
V3.1's accents (**Electric Cobalt, Hot Magenta, Molten Amber**) have **no hex values** and no
western equity; rendered, Electric Cobalt reads as a targeting HUD and as neon rather than
thread.

**Default:** keep V3's documented palette; **withhold the spectral accents**; use Tobacco
Leather `#734F36` for focus (6.49:1). Restore the brand voice in copy. **Alternative:**
commission a committed display face and supply accent hex values for contrast testing.
**Cost later:** medium. **Last responsible moment:** before the token system is frozen.

---

## D-08 — Do 3D assets and bespoke production exist?

Zero GLB, GLSL, video or textures exist. No evidence the business offers custom production.

**Default:** **Custom Atelier ships as an enquiry flow, not a configurator.** Buckle and
passage become video *after* a storyboard exists. Product Anatomy uses photography + SVG.
**Alternative:** owner confirms bespoke capability and a 3D production budget.
**Cost later:** low — everything is additive. **Last responsible moment:** before Phase 3.

---

## D-09 — Generated-image licensing

~30 unique generated images, all remote, all depicting garments, models, a workshop and a
retail interior that do not exist. **Default:** treat every one as
`CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY`; mirror locally before URLs
expire; replace before any external use. **The workshop imagery is the specific risk** — it
could read as evidence of manufacturing, which is unverified. **Last responsible moment:**
before any public deployment.

---

## D-10 — Is "L&B Frontier House" a public name?

Rendered footers use it as a live brand, with a **stale © 2024**. `CLAUDE.md` §1 says it is
a working internal name. **Default:** use **Lucky & Blessed** publicly; keep L&B Frontier
House as the internal project name. **Last responsible moment:** before any customer-facing
copy ships.

---

## D-11 — Campaign video availability and media budget

**0 `<video>`, 0 `poster`, 0 `<track>`** across 48 files. **Default:** poster-first
everywhere; every cinematic surface has a still that carries the full message alone.
**Sequencing by value per unit cost:** material macro set first (cheap, one day, carries the
entire material-honesty thesis) → craft/process → garment motion clips → campaign film.
**Last responsible moment:** before Phase 3.

---

## D-12 / D-13 — Invented sourcing and invented people

*Kuroki Mill*, *Leon & Tuscany*, *"vintage shuttle looms"*, *"Hand-tooled in the Frontier
House workshop"* · *Arthur Pendelton*, *E. Vance Holdings*, *J.R. Cash*, monogram *J.D.*

**Not branches — removals.** They contradict verified vertical integration and `CLAUDE.md`
§12. **Default and only branch: remove.** Replacement sourcing language requires owner
evidence (OQ-04). **Last responsible moment:** before any copy ships.

---

## D-14 — Fabricated heritage in artwork

**"EST. 1865"** engraved into the mobile hub's buckle; **"Origin: 1870s American West"**
captioned on `8b`. Two mutually inconsistent fabrications, one **baked into pixels**.
**Default: the asset must be reshot or replaced.** Keep the object — the buckle photography
is the strongest craft evidence in the corpus — remove the date.

---

## D-15 — AR ("View in Space")

Appears in `8g_8` and in **no manifest, handoff or design document**.
**Default: NOT CURRENTLY JUSTIFIED.** Preserve the concept; do not scope it.

---

## D-16 — Custom Atelier scope

Credible as a **2D** system (a real wizard, a production journey, a manufacturing feasibility
warning), but no evidence the business offers it.
**Default:** enquiry flow only. **Alternative A:** wholesale atelier — retailer-exclusive
colourways, buyer artwork placement. **Alternative B:** future DTC. **No branch requires
real-time 3D.**

---

## D-17 — Buyer-first Passport · **partially resolved on evidence**

**Resolved:** the loyalty layer is a **V3 invention**. V2's Passport had no points, no
credit, no rewards — only *Wardrobe · Orders · Saved*. **Deleting loyalty restores original
intent.**
**Still a branch:** the Passport's primary audience. **Default: buyer-first** (see `09`).
**Alternative:** dual, once D-01 resolves.

---

## Recommended decision-session order

1. **D-00** — raise immediately, separately, before any design conversation
2. **D-04 + D-03 + D-05** — taxonomy, menswear, Home. *Hard gate: blocks all routing*
3. **D-01 + D-02** — wholesale vs DTC. *Blocks Phase 2 scope*
4. **D-06 + D-07** — price tier, typeface, voice, accents. *Blocks token freeze*
5. **D-08 + D-11 + D-16** — 3D, media budget, Atelier. *Blocks Phase 3*
6. **D-09 + D-10 + D-12/13/14 + D-15** — content integrity and naming. *Blocks public launch*

**Sessions 1 and 2 are the only ones that block the start of Phase 1.**
