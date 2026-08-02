# 10 — Taxonomy and Inclusive Sizing

> **Six conflicting category systems exist across the corpus. Only *Wholesale* appears in
> all of them. No filename and no Stitch navigation is authoritative product taxonomy.**

---

## 1. The six systems

| Source | Segments | Menswear? |
| :--- | :--- | :--- |
| V1 Mobile A | For Her · For Him · Custom | **Yes** |
| V1 Desktop C | *"Choose Your West"* | — |
| **V3 Frame 5** | For Her · **For Him** · Built By You · Wholesale | **Yes** |
| V3 Frames 2/10/11 rail | The High Plains · Dust & Denim · Silver & Silk · The Bespoke Atelier | — |
| **V3.1 `8f` + `v3_1_design.md`** | Women · Plus · **Girls** · Accessories & Home · Wholesale | No |
| **V3.1 `8g_1`** | Women · **Men** · Accessories & Home · Plus · Wholesale | **Yes** |

`INFERRED` — V3.1 is internally inconsistent with itself (`8f` lists Girls where `8g_1`
lists Men). **No generation is reliably menswear-free.**

---

## 2. The verified live taxonomy — the safe default

`VERIFIED FACT` — extracted from the live site's navigation and URL structure:

```
Women's
  Jeans · Tops · Dresses · Skirts · Skorts · Shorts · Pants
  Jackets & Outerwear · Jumpsuits & Rompers
Plus                    ← currently a complete parallel tree with separate SKUs
Accessories
  Belts & Buckles · Easy-Haul/Tote Bags · Bows · Wild Rags
Girls
Merchandising surfaces: New Arrivals · Specials · Styles of the Week (daily) ·
  Seasonal Collection · Lookbook · Clearance
```

**Claimed but not navigable:** home goods (About Us + Dallas Market Center) and footwear
(FashionGo). **Neither has a live category.**

---

## 3. Proposed model — **default safe branch**

```
Shop
  New Arrivals
  The Drop            ← dated, permalinked, subscribable (verified daily cadence)
  Denim               ← elevated: jeans + shorts + skirts + denim dresses
  Dresses · Tops · Bottoms · Outerwear · Jumpsuits & Rompers
  Accessories         ← belts & buckles, wild rags, bows, easy-haul bags
  Girls
  Collections         ← seasonal
  Clearance

  Every category filterable by:
    size range (incl. extended) · wash · colour · fabric · print/motif ·
    silhouette · availability · price band

Stories               ← Phase 2
Trade                 ← market calendar, line sheets, application, reorder
```

**Rationale, per element:**

- **Denim elevated to top level.** Named first in the brand's own copy (*"High-graded premium
  denim"*), described by Faire as a denim brand, and it spans four existing categories. It is
  the strongest single product story and is currently one nav item among nine.
- **The Drop as a first-class surface.** The live site runs a genuine **daily** cadence
  (`/jul-27/` … `/aug-01/`). This is the best-evidenced concept in the entire project.
- **Wild Rags and Easy-Haul Bags keep their names.** Authentic western vocabulary, used
  correctly. Do not modernise them away.
- **No menswear. No footwear. No Home** — pending D-03 and D-05.
- **Plus is a facet, not a branch** — see §4.

### Alternative branches

| Branch | Condition |
| :--- | :--- |
| **B — V3.1 five worlds** (Women · Plus · Girls · Accessories & Home · Wholesale) | Only if Home is verified (D-05) **and** the owner accepts Plus as a world (D-04) |
| **C — Editorial worlds** (The High Plains · Dust & Denim · Silver & Silk) | Viable as **campaign/collection names layered above** the product taxonomy — not as a replacement for it |
| **D — Add Home** | If the owner confirms sellable home inventory |

**Taxonomy is in every URL. This is the earliest hard gate in the project.**

---

## 4. Inclusive sizing

### The finding

`VERIFIED FACT` — The live site architects Plus as a **complete parallel tree** with
**separate SKUs** (`…-denim-shirt` and `…-denim-shirt-plus-size`), while the brand claims
*"inclusive to all ages, shapes, and sizes."*

`OBSERVED` — The designs are split. **`8f` gives Plus full typographic parity** with Women.
But **`12f_2` renders it in a different layout system** — an inset card rather than
full-bleed, **no carousel affordance**, tagged **"BESPOKE SIZING"**, filed under the
**Custom** tab while Women sits under **Discover**.

> `INFERRED` — **Routing plus sizing into a bespoke/made-to-order lane is a subtler and more
> damaging separation than a separate catalogue.** It implies special-order rather than
> stock. The *representation* in `12f_2` is the best inclusive work in the corpus — the
> photography and the line *"Every world, every silhouette"* are excellent. **The placement
> undoes it.**

### The rules

1. **One garment, one product record, one full size range** — where the same garment exists
   across ranges.
2. **Plus is a size facet with equal editorial prominence**, never a separate destination and
   **never routed to Custom or Bespoke.**
3. **Never imply larger sizes are special-order** unless verified.
4. **Never duplicate a product solely to create a separate Plus catalogue.**
5. **Dedicated extended-size storytelling is welcome** — an editorial lens, a fit guide, a
   campaign — as long as it sits *inside* the main catalogue.
6. **Where the assortment genuinely differs, state availability per size range honestly on
   one product page** rather than implying a parity that does not exist.

### The unresolved question — OQ-08

**Is the plus assortment identical to the straight assortment?** The merge rule assumes it
is. If it is not, rule 6 applies rather than rule 1.

`INFERRED` — This is a genuine strategic opportunity, not just a correction. Research found
**coherent extended-size merchandising is the largest unclaimed position in western denim**:
Tecovas stops at 16, Miss Me at 34 with no plus language, and a direct competitor
manufactures plus to size 40 without merchandising it — sending that demand to third-party
retailers. **L&B already makes the range and already claims the value.**

### Size data

`VERIFIED FACT` — The live size chart is a **single JPEG with zero extractable text** — a
probable **WCAG 1.1.1** failure and the thing most directly contradicting the inclusivity
claim.

**Requirement:** size and fit is **structured text** — a real table, per category, with
garment measurements, renderable inside the product page, filterable, translatable and
screen-reader accessible. **Never an image of a table.** This is both an accessibility
obligation and a conversion lever, and it is a Phase 1 requirement.
