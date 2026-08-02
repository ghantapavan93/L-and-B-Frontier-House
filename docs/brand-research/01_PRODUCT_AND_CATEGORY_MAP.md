# 01 — Product and Category Map

**Research date:** 2026-08-01
**Method:** Live extraction of the navigation tree, category pages and product listings
from landbapparel.com, plus marketplace listings on FashionGo and Faire.
Sources in [09_RESEARCH_SOURCES.md](09_RESEARCH_SOURCES.md).

---

## 1. The live taxonomy

`VERIFIED FACT` — Extracted from the site's own navigation and URL structure,
2026-08-01.

```
Women's
  Jeans · Tops · Dresses · Skirts · Skorts · Shorts · Pants
  Jackets and Outerwear · Jumpsuits and Rompers

Plus                          ← a complete parallel tree
  Plus Jeans · Plus Top · Plus Dresses · Plus Jackets and Outerwear
  Plus Skirts · Plus Shorts · Plus Pants

Accessories
  Belts – Buckles · Easy-Haul/Tote Bags · Bows · Wild Rags

Girls
  Girls Clothing

Merchandising surfaces (not categories)
  New Arrivals · Specials · Styles of the Week · Fall 2026 Collection
  Lookbook · Clearance 30%–60% Off · Style Spotlight
```

### 1.1 Observations that matter

**`OBSERVATION` — Plus size is architected as a separate store.**
Plus is not a size range on a product. It is a parallel category tree with its own
jeans, tops, dresses, skirts, shorts, pants and outerwear branches, and plus items are
**separate SKUs with "Plus Size" appended to the product name** — e.g. *"Dark Wash Puff
Long Sleeve Bow Tie Neckline Denim Shirt"* and *"Dark Wash Puff Long Sleeve Bow Tie
Neckline Denim Shirt Plus Size"* are two distinct listings.

This directly contradicts the brand's own stated value — *"we are inclusive to all
ages, shapes, and sizes"* — at the level of information architecture. A shopper or
buyer in plus sizes browses a **different, smaller store** than everyone else.

> `RECOMMENDATION` — This is the highest-value, lowest-risk fix available to the
> project, and it is a **structural** fix rather than a visual one. One garment, one
> product record, one editorial image set, one full size range. Plus becomes a
> **filter and a fit story**, never a separate destination.
>
> The wholesale reality still needs respecting: buyers order plus in different pack
> configurations and budget for it separately. Solve that with **order-side pack
> selection**, not by splitting the catalog. A buyer should reach one garment and choose
> straight, plus, or both — from the same page.
>
> Caveat: `OPEN QUESTION` — plus styles may be a genuinely *different assortment*
> (not every straight style is made in plus). If so, the honest model is one product
> page that states availability per size range, not a merged catalog that implies
> parity that does not exist. Confirm before building. (OQ-08)

**`OBSERVATION` — "Wild Rags" and "Easy-Haul Bags" are authentic category names.**
A wild rag is a traditional western silk neckerchief. This is real western vocabulary
used correctly, not costume language. It is evidence the brand has genuine category
literacy, and these names should be **preserved, not modernised away** in any redesign.

**`OBSERVATION` — Girls' clothing exists; boys' does not. Menswear does not exist.**
The catalog is women's and girls' only.

**`OBSERVATION` — Home goods and footwear are claimed but not navigable.**
About Us and the Dallas Market Center listing both name **home goods**; FashionGo lists
**footwear**. Neither has a category on the live site. Recorded as conflicts C-01 and
C-02 in [00_BRAND_TRUTH.md](00_BRAND_TRUTH.md). Do not design surfaces for either until
confirmed. (OQ-03)

---

## 2. Merchandising rhythm — the most under-appreciated finding

`VERIFIED FACT` — "Styles of the Week" is not weekly. It resolves to **dated daily
pages**: `/jul-27/`, `/jul-28/`, `/jul-29/`, `/jul-30/`, `/jul-31/`, `/aug-01/`.

`VERIFIED FACT` — The Lookbook is **monthly**, with January through June 2026 live at
time of research.

`VERIFIED FACT` — Season collections exist alongside these — "Fall 2026 Collection",
listed on FashionGo at **235 items**.

`REASONABLE INFERENCE` — The business runs on three simultaneous clocks:

| Clock | Cadence | Purpose |
| :--- | :--- | :--- |
| **Daily drop** | Every business day | Novelty, re-engagement, "check back tomorrow" |
| **Monthly lookbook** | Monthly | Editorial framing, styling direction |
| **Seasonal collection** | Seasonal | Buying structure, market alignment |
| **Market cycle** | Aug / Oct | Order-writing, the actual revenue event |

> This is **exactly the rhythm a "Living Contact Sheet" is built for.** A daily drop
> cadence is the strongest possible justification for a homepage that behaves like a
> living, dated, ever-refreshing grid rather than a static hero. The concept in the
> project brief is not decorative here — it maps onto a real operational fact.

`RECOMMENDATION` — Architect the platform around **the drop as a first-class content
type**: dated, permalinked, archivable, notifiable. A buyer should be able to subscribe
to the daily drop and see exactly what landed since their last visit. This is a real
retention mechanic supported by evidence, and it costs far less than WebGL.

---

## 3. Product vocabulary — the actual design language

`VERIFIED FACT` — Product names captured live on 2026-08-01. These are the brand's
real materials and motifs, and they are the only legitimate basis for the visual
system's material palette.

**Materials and construction**
luxe / stretch denim · suede · liquid leather · faux fur · velvet burnout · burnout mesh ·
traditional lace · pearl snap · buck-stitch · western piping · topstitching · embroidery ·
studding · rhinestone

**Motifs and prints**
horseshoe · cowboy hat · vintage rodeo · "Howdy" · "Yee Haw" · custom vintage prints ·
bold artistic lace

**Silhouettes**
wide-leg jeans · boyfriend jeans · high-rise trousers · denim dresses · western blazers ·
corsets · fringe jackets · denim vests · rompers · puff sleeves · gathered wrist ·
spaghetti-strap ruffle · sleeveless buckle-waist

**Colour language in use**
dark wash · mid wash · light wash · vintage light wash · stone wash · ivory · mint ·
beige/black · brown · camel

### 3.1 Representative real product names

> *"Dark Wash Stretch Denim Rhinestone Detail Cuffed Wide Leg Jeans (30in Inseam)"*
> *"Black Rodeo Buck-stitch Printed Stretch Denim Shorts (3in Inseam)"*
> *"Stone Wash Stretch Denim Dress W Camel Suede Boot Stitch Embroidery Patch Detail"*
> *"Mint Stretch Denim Pearl Snap Contrast Ivory Embroidered Western Piping Short Sleeve Dress"*
> *"Black Howdy Rhinestone Horse Bit Mesh Puff Sleeve Top"*
> *"Beige Black Western Velvet Burnout Spaghetti Strap Ruffle Dress"*

### 3.2 What the naming convention reveals

`OBSERVATION` — Names are **specification strings, not names.** They encode
colour + wash + fabric + hardware + detail + silhouette + sleeve + inseam, in that
approximate order. There is no editorial naming layer at all.

`REASONABLE INFERENCE` — This is correct for the audience it was written for. A buyer
scanning 235 Fall styles needs the inseam in the title. A consumer does not.

`RECOMMENDATION` — Do **not** delete the specification string; buyers depend on it.
Add an **editorial display name** as a separate field, and let the specification string
become structured attributes. One product record, two registers:

| Field | Example | Serves |
| :--- | :--- | :--- |
| `displayName` | "Midnight Rodeo Short" | Consumer, editorial, campaign |
| `specName` | "Black Rodeo Buck-stitch Printed Stretch Denim Shorts (3in Inseam)" | Buyer, linesheet, search |
| `attributes` | `{wash: black, fabric: stretch denim, detail: buck-stitch, inseam: 3in}` | Filtering, both audiences |

This single change unlocks filtering, editorial storytelling and the Garment Portal
concept simultaneously. It is the highest-leverage data-model decision in the project.
See [08_TECHNICAL_PRINCIPLES.md](08_TECHNICAL_PRINCIPLES.md).

---

## 4. Inventory and order model

| Attribute | Value | Label |
| :--- | :--- | :--- |
| Pack structure | Prepacked in **quantities of 6** unless stated | `VERIFIED FACT` |
| Minimum order | $50 | `VERIFIED FACT` |
| Availability states | **In-Stock** and **Pre-Order** (both surfaced as badges and filters) | `VERIFIED FACT` |
| Returns | "All Sales Are Final" on own site | `VERIFIED FACT` |
| Free shipping | $300+ (FashionGo) | `VERIFIED FACT` |
| Wholesale price band | $7–$33 (FashionGo) | `VERIFIED FACT` |
| Implied retail band | ≈$20–$85 at 2.2–2.5× keystone | `REASONABLE INFERENCE` |

`OBSERVATION` — Pre-Order is a **first-class inventory state**, not an edge case. It
appears as a product badge and as one of only two available filters. Backorder rates
are tracked separately for in-stock (0.98%) and pre-order (2.22%) on FashionGo.

`RECOMMENDATION` — Pre-order must be designed properly, not bolted on: expected ship
window, deposit/terms clarity, and a distinct visual state. A buyer committing
open-to-buy dollars to pre-order needs more certainty than an in-stock purchase, not
less. This is a **REQUIRED FOR LAUNCH** commerce behaviour.

---

## 5. Current discovery capability — and its ceiling

`VERIFIED FACT` — The complete filter set on a category page is:

- **Item Availability**: In-Stock, Pre-Order
- **Custom Range** (a numeric range, presumed price)
- Apply / Reset

That is all. There is **no filter for size, colour, wash, fabric, print, silhouette,
sleeve length, or inseam** — despite every one of those attributes being encoded in
the product name.

`OBSERVATION` — Category SEO copy compensates in prose. The dresses page describes
"Lace Dresses" as a theme in body text, but there is no lace facet to click.

> `RECOMMENDATION` — **Faceted discovery is the single largest commerce gap.**
> A buyer sourcing "black, plus, in-stock, under $20, dresses" for a specific store
> cannot do it. They must eyeball 235 Fall items.
>
> The attributes already exist inside the product names. Extracting them into
> structured fields converts an existing liability into the platform's best feature, and
> it benefits the wholesale buyer **more** than the consumer. Classified
> **REQUIRED FOR LAUNCH** in [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md).

---

## 6. Size and fit — a hard gap

`VERIFIED FACT` — The Size Chart page contains **no text and no table**. Its entire
content is a single JPEG:
`https://landbw.co/images/companies/1/Lookbooks/size%20chart%201.jpg`
Extracted text length of the page's main content region: **0 characters.**

`OBSERVATION` — Consequences, all of them concrete:

- A screen-reader user gets nothing. This is a **WCAG 1.1.1 (Non-text Content)
  failure** if the image lacks an equivalent text alternative.
- It cannot be searched, filtered, translated, or read comfortably on a phone.
- It cannot be surfaced contextually on a product page.
- It cannot differ by category, and denim, dresses and outerwear do not share a fit
  model.

`RECOMMENDATION` — Replace with structured size data: a real table, per-category,
per-garment measurements, keyboard accessible, responsive, and renderable **inside** the
product page. For a brand whose stated identity is *"inclusive to all ages, shapes, and
sizes"*, a flat JPEG is the weakest possible expression of that promise. This is both an
accessibility obligation and a conversion lever.

---

## 7. The lookbook — editorial that cannot be shopped

`VERIFIED FACT` — The April 2026 lookbook (`/april-2026.html`, title
`LOOKBOOK :: APRIL 2026`) consists of **eight flat JPEGs** hosted on `landbw.co`:
`Apr 26-COVER.jpg`, `Apr 26-1jpg.jpg` … `Apr 26-7jpg.jpg`.
Extracted body text: **a single space character.**

`OBSERVATION` — There is no product link, no caption, no alt text, no SKU reference and
no path from any lookbook image to any purchasable item. The brand invests in monthly
editorial photography and then **strands it**.

`VERIFIED FACT` — Content-operations debris is visible in the URL space:
`april-2026-clone.html` and `may-2026-clone.html` exist alongside the real pages, and the
navigation item labelled "JANUARY 2026" links to `january-2025.html`.

> `RECOMMENDATION` — **This is the project's proof case.** The brief's
> "image becomes film" and "shoppable film" ambitions have an unglamorous prerequisite:
> *images that know which products are in them.* A lookbook image linked to its SKUs is
> the minimum viable version of the entire cinematic-commerce thesis, it is achievable
> without a single line of WebGL, and it converts on day one.
>
> Build that first. Earn the cinema afterwards.

---

## 8. Category map for the new platform

`RECOMMENDATION` — Proposed structure, derived from the live taxonomy. Not approved;
requires owner sign-off and must be reconciled with Stitch V3 during the audit.

```
Shop
  New / The Daily Drop        ← dated, permalinked, subscribable
  Denim                       ← elevate: jeans + shorts + skirts + denim dresses
  Dresses · Tops · Bottoms · Outerwear · Jumpsuits & Rompers
  Accessories                 ← belts & buckles, wild rags, bows, easy-haul bags
  Girls
  Collections                 ← Fall 2026, seasonal
  Clearance

  Every category filterable by: size range (incl. plus), wash, colour,
  fabric, print/motif, silhouette, availability, price band

Stories
  Lookbooks (monthly archive, fully shoppable)
  Campaigns
  Craft / How It's Made       ← the vertical-integration story

Trade
  Market calendar & appointments
  Linesheets
  Wholesale application
  Reorder
```

`OBSERVATION` — Denim deserves elevation to a top-level destination. It is named first
in the brand's own copy (*"High-graded premium denim"*), it is what Faire describes them
as (*"a Dallas-based denim brand"*), and it spans four existing categories. It is the
brand's strongest single product story and is currently just one nav item among nine.

---

## Cross-references

- Verified brand facts and price tier → [00_BRAND_TRUTH.md](00_BRAND_TRUTH.md)
- Who buys these products → [02_AUDIENCE_AND_JOURNEYS.md](02_AUDIENCE_AND_JOURNEYS.md)
- Feature classification → [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md)
- Data model implications → [08_TECHNICAL_PRINCIPLES.md](08_TECHNICAL_PRINCIPLES.md)
