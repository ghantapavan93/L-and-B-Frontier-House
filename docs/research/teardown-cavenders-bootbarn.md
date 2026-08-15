# Teardown — Cavender's & Boot Barn (retail at scale)

**Status:** MEASURED (live sites) + ARCHIVED (Wayback snapshots, labeled by date) ·
Captured 2026-08-14/15 · Method: in-app browser on live pages; Wayback Machine for
historical L&B assortment (each finding carries its snapshot date). WebFetch/WebSearch
used where noted. Mechanisms only — no layout, copy, code or imagery copied.

**Why these two:** Cavender's is a verified Lucky & Blessed stockist (Level 1 brand
truth). Boot Barn is the category's largest specialist retailer. Together they define
what a western-wear buyer already knows how to use — and what L&B product data looks
like after a major retailer ingests it.

---

## 1. PRIORITY ONE — Lucky & Blessed at Cavender's

### 1.1 The live state (2026-08-14/15)

**The brand page exists. It is empty.**

- `https://www.cavenders.com/lb-apparel/` renders live today:
  - Page title: **"LB Apparel | Cavender's"**
  - H1: **"Lucky & Blessed"**
  - Breadcrumb: **Home / Brands / Lucky & Blessed**
  - Result count: **0 Results**, with the standard empty-facet message.
- The SFCC category record behind it (read from the server-rendered React Query cache,
  `#mobify-data`):
  - `id: "lb-apparel"`, `name: "Lucky & Blessed"`, `parentCategoryId: "brands"`
  - `onlineSubCategoriesCount: 3` — three subcategories still online
  - `c_showInMenu: false` — deliberately hidden from all navigation
  - `c_defaultSortingRule: "new-arrivals"`, `c_isCLP: true`
  - Meta description: "LB Apparel are online today at Cavender's. Shop for the best
    prices and selection on LB Apparel, and other top western brands."
  - The page's own product search (`refine: ["cgid=lb-apparel"]`) returns `total: 0`.
- **Site search finds nothing.** Query behaviour, verbatim:
  - `lucky and blessed` and `lucky & blessed` → 10 results, **all keyword noise on
    "lucky"** (Kimes Ranch "Lucky B" tee, Besita "Lucky" boots, Montana Silversmiths
    "Lucky Harmony" jewelry, Charlie 1 Horse "Lucky Me" hat, etc.). No L&B product.
  - `blessed` → 5 results, none L&B.
  - `L&B` → branded zero-results page ("WE'RE SORRY, WE SCOURED THE RANGE BUT DIDN'T
    FIND A MATCH") with "Recommended for you" and "Most viewed" recovery rails.
- **Interpretation (inference):** Cavender's has migrated to a new headless storefront
  (2025+) and *carried the L&B brand category through the migration* rather than
  deleting it — the relationship slot is maintained while current online assortment is
  zero. L&B presence at Cavender's today is in-store and/or between seasonal buys. The
  supplier relationship is confirmed by the taxonomy itself; the sell-through is not
  visible online right now.

### 1.2 The historical record (Wayback, dated)

Snapshot coverage of `/lb-apparel/`: 11 captures, **2019-10-23 → 2025-03-19**, all
HTTP 200. Distinct archived L&B subcategory URLs (CDX, 2019 era):

```
/lb-apparel/                          (brand root)
/lb-apparel-womens-tops/
/lb-apparel-womens-jeans/
/lb-apparel-womens-dresses-skirts/
/lb-apparel-womens-outerwear/
/lb-apparel-womens-belts/
/lb-apparel-womens-plus-sizes/
/lb-apparel-girls-clothing/
/lb-apparel-girls-jeans/
```

**Women's (six lines, including Plus) + Girls (two lines). No menswear — ever.**

#### 2019-10-23 — peak assortment visible: ~21 products

Style refinement counts on the brand PLP: Girls' Clothing (10) · Women's Belts (2) ·
Women's Dresses & Skirts (1) · Women's Jeans (4) · Women's Plus Sizes (1) ·
Women's Tops (3). Product names and prices, verbatim from the archived PLP:

| Product name (verbatim) | Price |
| :--- | :--- |
| L&B Women's Dark Wash Bell Bottom Frayed Jeans - Plus Size | $49.00 → $39.00 SALE |
| L&B Women's Serape Light Wash Flare Jeans | $49.00 → $39.00 SALE |
| L&B Women's Dark Wash Bell Bottom Frayed Jeans | $44.00 → $34.00 SALE |
| L&B Women's Black Bell Bottom Frayed Jeans | $44.00 → $34.00 SALE |
| L&B Women's Snake Print with Silver Turquoise Concho Leather Belt | $60.00 → $44.98 SALE |
| L&B Women's Red Serape Print with Silver Concho Belt | $60.00 → $44.98 SALE |
| Lucky & Blessed Women's Aztec Print Bell Sleeve Fashion Top | $34.00 |
| Lucky & Blessed Women's Olive Bell Sleeve Fashion Top | $29.00 |
| Lucky & Blessed Women's Mint Serape Print Button Down Dress | $54.00 |
| Lucky & Blessed Red Serape Print Vest | $54.00 |
| Lucky & Blessed Girls' Aztec Print Keyhole Fashion Top | $29.00 |
| Lucky & Blessed Girls' Pink Serape Kimono | $26.00 |
| Lucky & Blessed Toddlers Peach Serape Leopard Cactus Print T-Shirt | $14.00 |
| Lucky & Blessed Toddlers Black Serape Cactus Short Sleeve T-Shirt | $14.00 |
| Lucky & Blessed Toddlers Pink Sassy Steerhead T-Shirt | $14.00 |
| Lucky & Blessed Toddlers Pink Serape Llama T-Shirt | $14.00 → $9.98 SALE |
| Lucky & Blessed Infants Pink Wild Child Onesie | $14.00 |
| Lucky & Blessed Infants Dusty Pink Blessed Onesie | $14.00 |
| Lucky & Blessed Infants Mustard Aztec Cactus Onesie | $14.00 |
| Lucky & Blessed Infants Pink Floral Steerhead Onesie | $14.00 |

#### 2022-05-20 — clearance tail + drinkware: 10 products

| Product name (verbatim) | Price |
| :--- | :--- |
| Lucky & Blessed Women's Colorblock Seam Front Bell Bottom Jeans | $54.00 → $27.98 |
| Lucky & Blessed Women's Dark Wash High Rise Distressed Button Fly Release Hem Flare Jeans | $54.00 → $31.98 |
| L&B Women's Dark Wash Trouser Leg Jeans | $54.00 → $27.98 |
| L&B Women's Light Wash Mid Rise Frayed Skinny Leg Jeans | $45.00 → $23.18 |
| L&B Women's Dark Wash Bell Bottom Frayed Jeans | $54.00 → $27.97 |
| L&B White Floral Skull Print and Red Slim Can Insulator | $24.95 |
| L&B Cow Print and Turquoise Slim Can Insulator | $24.95 |
| L&B Orange Ombre Aztec Print Large Tumbler Cup | $24.95 |
| L&B Sunset Large Cup | $24.95 |
| L&B Serape Print Large Cup | $24.95 |

Women's jeans sizes offered: numeric **0–16**. Brand facet on this page listed **two
separate brand values for the same brand: "L&B; Apparel" (note the stray HTML-entity
semicolon) and "Lucky and Blessed Apparel"** — the facet split the brand in half.

#### 2024-03-05 and 2025-03-19 — zero products

Both captures render "no products were found." The online assortment ended sometime
between mid-2022 and early 2024; the category page survived two site architectures.

### 1.3 What the L&B-at-Cavender's evidence establishes

1. **Retail price truth: $14–$60.** Women's jeans $44–$54, tops $29–$34, dress/vest
   $54, belts $60, girls $26–$29, toddler/infant $14, drinkware $24.95. Wholesale
   $7–$33 × keystone ≈ confirmed. The design fixtures' $45–$1,250 range is fiction at
   the top; the *bottom* of the fixture range is where the whole brand actually lives.
2. **Category truth matches V3.1 Frame 8f, from a third party.** Women (jeans, tops,
   dresses, outerwear, belts) + Plus + Girls + Home goods (drinkware). No menswear in
   nine archived category URLs across six years. Real-world retail agrees with
   Women · Plus · Girls · Accessories & Home · Wholesale (D-04/D-03/D-05 evidence).
3. **Plus was modelled as a separate product, not a filter.** The same jean shipped
   twice: "…Frayed Jeans" ($44) and "…Frayed Jeans - Plus Size" ($49, a $5 premium),
   each in its own subcategory. That is the *retailer's* model, probably forced by
   L&B's own two-record data. Directly relevant to OQ-08: if the wholesale feed splits
   plus into separate styles, Frontier House either merges them into one record with a
   full size range (§11) or inherits Cavender's split.
4. **The brand string is unstable in the wild: "L&B" on denim and hard goods,
   "Lucky & Blessed" on tops and kids, "Lucky and Blessed Apparel" and a broken
   "L&B; Apparel" in facets.** Ampersand handling already corrupted one facet value.
   Frontier House must publish ONE canonical brand string and expect retailers to
   mangle ampersands ("L&B" is the safest export token; searches for "L&B" on
   Cavender's own engine return zero, so the abbreviation is also unsearchable there).
5. **Product-name grammar carried the entire story:**
   `{Brand} {Audience} {Color/Wash} {Motif/Print} {Construction} {Garment}` —
   "L&B Women's Snake Print with Silver Turquoise Concho Leather Belt". Every facet a
   retailer renders (color, pattern, material, detail, sleeve, fit) was derivable from
   the name. This is the attribute set L&B's product data must carry as *structured
   fields*, because Cavender's faceting engine clearly consumed them.
6. **Imagery:** live site has zero L&B imagery to assess; archived thumbnails were not
   re-examined after the archive throttle (gap, noted honestly). What is verifiable:
   Cavender's current PLP imagery standard is on-model front shots on white/neutral
   ground with hover-swap to a second angle — any L&B photography supplied to
   retailers must meet at least that two-shot standard.
7. **Search is a real discovery risk.** Even when L&B was stocked, "L&B" as a query
   returns nothing today; "lucky and blessed" drowns in "lucky" keyword noise from
   bigger brands. A brand whose name is a common phrase needs exact-phrase boosting
   and a synonym entry ("L&B" → "Lucky & Blessed") in any search engine, including
   Frontier House's own.

---

*(Sections 2–4 follow: Cavender's platform teardown, Boot Barn teardown, and "What
Frontier House should take".)*
