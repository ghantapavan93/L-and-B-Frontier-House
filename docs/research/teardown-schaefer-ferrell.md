# Front-end teardown — Schaefer Outfitter and Ferrell Brand

**Date:** 2026-08-13
**Method:** live in-app browser, computed styles and Resource Timing read via injected
JavaScript. Every number below is `MEASURED` at a 1440 × 900 viewport unless marked.
**Focus:** credibility through environment and contemporary Western identity — *not*
nostalgia.
**Status:** research input. Nothing here is approved direction.

## Why these two

| | Schaefer Outfitter | Ferrell Brand |
| :--- | :--- | :--- |
| Claimed origin | 1982, Jackson Hole WY, founder named | "Born in Texas", **no year, no founder** |
| Authority source | Four decades, proprietary fabrics, three stores | Present-tense proof of use |
| Register | Heritage workwear | Contemporary men-forward Western lifestyle |
| Price band observed | $75 – $695 | $45 – $70 |
| Relevance to L&B | The credibility mechanics we can copy | **The proof that 2015 is enough** |

L&B is verified as established 2015 on FashionGo. It cannot claim a century.
Ferrell is the working demonstration that it does not need one.

### Compliance notes

- No account was created, no form submitted, no personal data entered.
- Cookie banners: **declined / rejected non-essential** on both sites.
- Neither site served text addressed to AI agents. Nothing was treated as instruction.
- **Mechanisms and principles only.** No layout, copy, imagery, code or interaction is
  reproduced here or recommended for reuse. Short factual specifications (fabric weights,
  measurements) are cited as facts, not as text to copy.

---

# PART 1 — SCHAEFER OUTFITTER

`https://schaeferoutfitter.com` · Shopify · theme named "Production" (`theme_store_id`
null, custom build on an Archetype-family theme — class names `site-nav__`, `page-width`,
`grid__item`).

## 1.1 Header and navigation

| Property | Value |
| :--- | :--- |
| Header height at rest | **110 px** (`padding: 20px 0`, inner row 70 px) |
| Header height when stuck | **90 px** — condenses by 20 px |
| Sticky mechanism | `position: relative` → `position: fixed` via a `--stuck` class on `<header id="SiteHeader">` |
| Header background | `#eeefea` (bone), no bottom border |
| Announcement bar | **42 px**, `#f2ae2e` amber, text `#403d3e`, 14.45 px |
| Announcement content | Rotating Flickity slider with **Pause / Play controls present** — two slides: a since-1982 line and an aggregate review score |
| Top-level items | Men · Women · Accessories · **Materials** · Stores · Last Call |
| Utility | account · search · cart, right-aligned |

### The mega menu

| Menu | Panel height | Links | Images |
| :--- | ---: | ---: | ---: |
| Men | 504 px | 21 | 4 |
| Women | 384 px | 22 | 5 |
| Materials | 358 px | 22 | 5 |
| Accessories | 359 px | 8 | 0 |
| Stores | 187 px | 4 | 0 |

- Transition: `opacity 0.3s cubic-bezier(0.2, 0.06, 0.05, 0.95)` with a **0.3 s delay** —
  a deliberate hover-intent guard, not an instant flyout.
- Panels are `position: absolute`, `visibility: hidden` + `opacity: 0` at rest.
- Each shopping menu carries **4–5 collection images** alongside the link columns.

### The finding that matters: Materials is a navigation axis

`Materials` sits at the same level as `Men` and `Women`. Its children are
**Denim · Canvas · Leather · Wool · Heritage Classics**, and inside Canvas the children
are **named, trademarked fabrics**: RangeWax®, Fenceline®, Brushcloth® — plus an
editorial link into a fabric explainer *inside the shopping menu*.

A shopper can therefore navigate the catalogue by **what the garment is made of**. For a
brand whose whole argument is material honesty, this is the single most transferable
structure on either site — and L&B, which **owns its textile production** (verified
vertical integration), has a stronger claim to it than Schaefer does.

## 1.2 Typography — computed

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| Body | Helvetica, Arial *(system, no webfont)* | 17 px | 400 | 25.5 px (1.5) | 0 | none |
| H1 (logo/page) | Baskervville, serif | 30 px | 700 | 39 px (1.3) | 0 | uppercase |
| H2 hero | Baskervville | 47–70 px | 700 | 1.3 | 0 | uppercase |
| H2 section | Baskervville | 29.75 px | 700 | 38.7 px | 0 | uppercase |
| H3 | Baskervville | 24 px | 400 | 24 px (1.0) | 0 | uppercase |
| Editorial / quote | Baskervville | 18 px | 400 | 23.4 px (1.3) | 0 | none |
| Nav top level | Helvetica | 13.6 px | 700 | 24.48 px | **4.08 px (0.30 em)** | uppercase |
| Nav dropdown | Helvetica | 16 px | 400 | 24 px | 0 | none |
| Primary button | Helvetica | 13 px | 700 | 18.46 px | **3.9 px (0.30 em)** | uppercase |

Design-system tokens confirm the intent: `--typeHeaderPrimary: Baskervville`,
`--typeHeaderWeight: 700`, `--typeHeaderLineHeight: 1.3`; `--typeBasePrimary: Helvetica`,
`--typeBaseSize: 17px`, `--typeBaseLineHeight: 1.5`.

**Exactly one webfont loads for the brand: Baskervville 700.** Every other loaded face
(Kanit, Poppins, `oke-widget-icons`) belongs to a third-party widget. Body copy is system
Helvetica. Two type roles, one webfont, one letter-spacing value (0.30 em) applied to all
uppercase micro-type.

## 1.3 Colour — UI versus photography

Five UI colours carry the whole site. Everything else is photograph.

| Token | Value | Used for |
| :--- | :--- | :--- |
| `--colorTextBody` / `--colorBtnPrimary` | `#403d3e` | Warm near-black: all body text, buttons, footer, image scrim |
| `--colorNav` / `--colorDrawers` / `--colorHeroText` | `#eeefea` | Bone: header, drawers, hero type |
| `--colorBody` | `#ffffff` | Page ground |
| `--colorAnnouncement` | `#f2ae2e` | Amber: announcement bar and every primary CTA |
| `--colorSaleTag` / `--colorTextSavings` | `#d95448` | Red — sale only |

Census of computed values across header + main + footer: `#403d3e` on 641 elements,
`#eeefea` on 253, `#f2ae2e` on 10, `#d95448` on **1**. The accent is rationed.

Two tokens do the heavy lifting for legibility over photography:
`--colorImageOverlay: #403d3e` at `--colorImageOverlayOpacity: 0.15`, plus a text-shadow
factor of `0.44`. **One scrim recipe, applied everywhere**, so white type survives any
photograph without art-directing each one. `--buttonRadius: 3px`, `--grid-gutter: 17px`.

## 1.4 Homepage, band by band

Document height **8,889 px**; 11 Shopify sections; every band is full-bleed (1,434 px) with
content constrained to a 1,354 px inner width.

| # | Band | Top | Height | Carried by | Media |
| ---: | :--- | ---: | ---: | :--- | :--- |
| 0 | Header + announcement | 0 | 152 | UI | 22 menu imgs |
| 1 | Hero slideshow, 5 slides | 152 | **650** | **Environmental photograph** | 5 @ 1440 × 810 |
| 2 | Shop by category, 6 tiles | 877 | 1,133 | Photograph + label | 6 @ 3:4 |
| 3 | Product rail, 8 products | 2,084 | 1,236 | Product cards | 16 (2 per card) |
| 4 | Heritage / origin | 3,395 | **650** | Full-bleed photograph, 2880 × 1620 | 1 |
| 5 | "For land / for life" — two manifesto panels | 4,025 | 675 | 2 square photographs 2880 × 2880 + prose + own CTAs | 2 |
| 6 | Visit us in store — 3 stores | 4,775 | 940 | Store/place photographs 390 × 260 | 3 |
| 7 | Reviews heading (rich text) | 5,790 | 39 | Type | 0 |
| 8 | Review carousel + promo grid | 5,894 | **2,115** | Customer quotes over dark, then 5 editorial tiles | 5 |
| 9 | Newsletter | 8,009 | 325 | Type | 0 |
| 10 | Footer | 8,334 | 555 | UI | 1 |

Rhythm: hero 650 → content 1,133 → content 1,236 → **breath 650** → 675 → 940. The
full-bleed single photograph at band 4 is the pause between two dense commerce blocks.
Band heights are not uniform; the two purely atmospheric bands are the shortest.

Notable: an engraved line-art landscape motif appears between photographic bands — a cheap,
ownable, weightless texture that carries brand without another photo shoot.

## 1.5 Photography system — the deep read

### 1.5.1 The naming convention decodes the whole system

Every asset follows `{style}_{slug}_{colourway}_{shotType}[-{index}].jpg`. Observed shot
types, in the brand's own vocabulary:

| Token | What it is |
| :--- | :--- |
| `_front` | Studio, garment front, on-figure, plain ground |
| `_back` | Studio, garment back |
| `_open` | **Garment in an altered state** — jacket open, lining visible |
| `_flat` | Flat lay of an unstructured item |
| `_tied` | **The same item in use** — a wild rag actually knotted |
| `_studio-2` … `_studio-6` | Studio alternates: angles, crops, detail |
| `_lifestyle-1` … `_lifestyle-8` | Worn, on location, environmental |
| `-00073` … `-00080` | Raw sequence frames retained from the shoot |

`_flat` → `_tied` is the cheapest, most honest idea on the site: **photograph the object,
then photograph the object doing its job.** One extra frame converts a rectangle of fabric
into a demonstrated product.

### 1.5.2 One product's full media stack — measured

`RangeWax® Mesquite Brush Jacket`, $255: **21 images + 1 HLS video**, all delivered at
720 × 960 (**3:4 portrait**) into a 571 × 761 slot, with 26 thumbnails.

| Kind | Count | Share |
| :--- | ---: | ---: |
| Studio (front, back, open, studio-2…6) | 8 | 38% |
| Worn / environmental (lifestyle-1…8) | 7 | 33% |
| Retained raw sequence frames | 5 | 24% |
| Video (HLS, `.m3u8`, ~2.27 MB) | 1 | 5% |

Roughly **40 / 60 studio-to-everything-else**, and the studio half is not eight flat
repeats — it includes the open-garment state and five constructed detail angles.

### 1.5.3 Studio versus environment across the site

| Surface | Studio | Environmental | Notes |
| :--- | ---: | ---: | ---: |
| Homepage hero (5 slides) | 0 | **5** | 100% environmental |
| Category tiles (6) | 1 | 5 | |
| Product cards (8) | 8 primary | 8 secondary | **Every card is a studio/worn pair** |
| Editorial bands (4, 5, 8) | 0 | 8 | 100% environmental |
| Store band | 0 | 3 | Real storefronts and one aerial |
| PDP (1 product) | 8 | 12 + video | |

**The homepage never opens on a studio frame.** Every full-bleed band is a photograph of a
place with weather in it. Studio photography appears only where a shopper is comparing —
grids and galleries.

### 1.5.4 The mechanism: the hover pair

Every PLP and homepage product card stacks exactly two images:

- Primary: `_front` — studio, on-figure, plain ground, 322 × 429 (**0.75, 3:4**)
- Secondary on hover: `_lifestyle-N` or `_studio-N`, 324 × 431

This is the cheapest credibility device on the site. The studio frame answers *what is
it?*; one pointer move answers *where does it live?* The card never has to choose. Both
images are in the DOM at rest, cross-faded by opacity.

Colour options are rendered as **90 × 90 image chips cropped from the garment photograph**
(`background-size: cover`), not flat colour circles — so the swatch itself carries weave.
One card showed 42 swatch elements; the RangeTek shirt is labelled "+18" colours.

### 1.5.5 How they photograph weight and durability

Four devices, none of which requires a new camera:

1. **Ounce weights in prose.** The fabric page states Fenceline as 11 oz 100% cotton
   canvas and Brushcloth as 15 oz 100% cotton. A number does what a photograph cannot.
2. **The altered-state frame** (`_open`) — you can only judge a lining you can see.
3. **Retained raw sequence frames** — five consecutive frames from the shoot, kept in the
   gallery. They read as documentation rather than art direction.
4. **A maintenance product cross-sold on the PDP** (reproofing wax). Durability is made
   *purchasable*, which is a stronger claim than any adjective.

### 1.5.6 Working or posed?

Both, deliberately separated. Environmental frames show riding, handling stock, weather.
The store band uses real interiors and a town aerial. But the review band is where the
brand admits the limit of its own photography: the section is headed with a claim that
quality reads best in person, and the first quote in the rotation is a customer saying the
photographs undersell the weight and fabric. **The site converts the weakness of
e-commerce photography into a reason to visit a store**, with the store locator placed
immediately above.

## 1.6 Product storytelling and customer commentary

### PDP copy structure

1. One narrative paragraph about conditions the garment is for.
2. A construction bullet list — pocket count, internal chest pocket, solid brass logo
   buttons, unlined. Facts, not adjectives.
3. **An origin statement that concedes as much as it claims**: designed in Texas,
   imported. They do not claim domestic manufacture.
4. A maintenance upsell.
5. Product care and shipping in collapsed accordions.

Point 3 is the direct precedent for L&B's OQ-04. A brand can name where design happens
without implying where sewing happens, and it costs nothing in authority.

### The review system (Okendo) — the strongest single mechanism found

For one $255 jacket, 205 reviews at 4.9. Beyond stars:

| Aggregated attribute | Scale | Value shown |
| :--- | :--- | :--- |
| **Fit** | −2 (runs small) … +2 (runs large) | −0.0 |
| **Quality** | 1 – 5 | 4.9 |
| **Durability** | 1 – 5 | 4.9 |

- **Durability is a first-class, quantified, aggregated review attribute.** The brand never
  has to assert it.
- Every reviewer publishes **height, weight, usual size purchased and size purchased**.
  That is structured fit evidence generated by customers, not by a photographer.
- An **AI-written review summary** sits above the reviews, timestamped with its last
  update, and it aggregates *material* language specifically — waxing weight, unlined
  layering, water and brush resistance, sizing up for layers.
- Review text is present in the rendered DOM (readable without interaction).
- Reviews do the ageing story the brand is not allowed to promise: buyers write about
  breaking the jacket in, wanting the weathered look, expecting to outlast it.

Homepage social proof is aggregate and specific: an announcement-bar score over 8,500+
reviews, and a five-quote carousel where each quote is attributed to a first name, last
initial, city and state.

## 1.7 PLP and PDP mechanics

**PLP** (`/collections/mens-outerwear`, 64 products, 36 rendered initially):

| Property | Value |
| :--- | :--- |
| Grid | Float-based `.grid--uniform`, **4 columns** in a 1,376 px container |
| Item box | 344 × 544 px (495 px without swatches) |
| Card image | 322 × 429 px → **0.75 (3:4)** |
| Images per card | 2 (front + lifestyle/studio, opacity cross-fade) |
| Card contents | badge · quick-view · title (uppercase) · price · swatch strip |
| Badges observed | NEW · BEST SELLER · BUNDLE & SAVE 20% · Sale · Sold Out |
| **Filters** | **Availability only** — in stock (55) / out of stock (32) |
| Sort | 9 options |
| SEO | Collection `<title>` is written as a phrase, not the collection name |

**A brand that navigates by material offers no material filter.** 64 products, one facet.
This is the same failure L&B's constitution already flags on the live L&B site (§11) —
confirming it is an industry-wide gap, not an L&B-specific one, and therefore a
differentiator if we fix it.

**PDP:** 50 / 50 two-column split at 666 px each (46% of viewport each), gallery
`display: flex` with 26 thumbnails, info column **not** sticky. Size chart present but
**not rendered as a `<table>`** on the PDP itself. Media: 21 images + 1 video (see 1.5.2).

## 1.8 Tech stack and weight (PDP, measured)

| Metric | Schaefer | L&B budget (CLAUDE.md §10) |
| :--- | ---: | ---: |
| Requests | **504** | — |
| Total transferred | **7.54 MB** | ≤ 1.5 MB shop surfaces |
| **JS compressed** | **1,024 KB across 132 scripts** | **≤ 180 KB** |
| JS decompressed | 3,940 KB | — |
| CSS | 305 KB across **174 requests** | — |
| Images | 54 JPEG = 3.82 MB | — |
| Video | 2.27 MB HLS | — |
| **Image formats** | **JPEG and PNG only — no WebP, no AVIF** | WebP/AVIF |
| TTFB / DOMContentLoaded / load | 80 ms / 1,073 ms / 1,896 ms | — |

Apps identified: Klaviyo (email + reviews design mode), Okendo (reviews), Flickity
(carousels), SlideCart HQ, Variant Swatch King, Consentmo/OneTrust-style consent.

## 1.9 Faults worth not repeating

- **JS is 5.7× our budget** and images are still JPEG-only. Both are fixable for free.
- **Alt text is empty on all 12 heritage-page images** and on all 5 hero slides.
- The fabrics page ships **four Shopify placeholder products** ("Example product, $29") in
  the Brushcloth row — demo data in production on the brand's most important credibility
  page.
- No `<h1>` semantics beyond the logo on the homepage.
- 174 separate CSS requests.

---

# PART 2 — FERRELL BRAND

`https://ferrellbrand.com` · Shopify · **stock premium theme "Broadcast"**
(`theme_store_id: 868`), largely unmodified. Reviews by Junip. Fonts via Adobe Typekit.

## 2.1 Header and navigation

| Property | Value |
| :--- | :--- |
| Header height | **125 px** desktop / token `--HEADER-HEIGHT-MOBILE: 86px` |
| Position | **`absolute`, `z-index: 2300`, transparent** — the hero photograph runs full-bleed *underneath* the nav |
| Structure | Two rows: utility (menu · centred wordmark · currency · account · search · cart) then a category row |
| Announcement | 36 px, a single promotional line |
| Nav type | DM Sans **11 px**, weight 400/500, uppercase, line-height 13.2 px |
| Radius | `--RADIUS: 0px` — nothing is rounded |

Top-level: Shop All · New Arrivals · Long Sleeve Snap Shirts · Short Sleeve Snap Shirts ·
Button Up Shirts · Pearl Snap Polos · Last Call · Women's · Kids · Hats ·
**Retailer Locator**.

Two structural reads:

1. **Men-forward by architecture, not by label.** There is no "Men" menu. The men's
   product types *are* the top level; Women's and Kids are each one entry. The brand
   asserts a default audience through information architecture rather than a gendered
   gateway. This is the opposite of the V3 Frame 5 "FOR HIM / FOR HER" pattern our audit
   already rejected.
2. **Retailer Locator sits in primary navigation.** Wholesale distribution is presented as
   customer-facing proof, not a back-office function — structurally the same hybrid
   position L&B occupies.

Nav type at 11 px corroborates the earlier reference teardown finding: premium reads as
media density, not type scale.

## 2.2 Typography — computed and tokenised

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| Body | DM Sans | 16 px | 400 | normal | 0 | none |
| Heading (token) | **Arvo** (slab serif) | — | 400 / 700 bold | — | 0.025 em | uppercase |
| Section heading | Arvo | 27 px | 400 | 32.4 px (1.2) | 0.675 px | uppercase |
| Large heading | Arvo | 38 px | 400 | 45.6 px | 0.95 px | uppercase |
| Product title | Arvo | 16 px | 600 | 19.2 px | 0.4 px | uppercase |
| Nav | DM Sans | 11 px | 400/500 | 13.2 px | 0 | uppercase |
| Subheading (token) | Arvo | — | 400 | — | **0.1 em** | uppercase |
| Button (token) | **IBM Plex Sans** | 15 px | 400 | — | **0.1 em** | uppercase |

Three families in the token set (Arvo, DM Sans, IBM Plex Sans) where Schaefer uses one
webfont — and a 15-step type ramp
(`--font-1: 10px` … `--font-15: 55px`: 10/12/14/16/19/23/27/32/37/40/43/47/50/52/55).
Layout tokens: `--LAYOUT-OUTER: 50px`, `--LAYOUT-GUTTER: 32px`, `--COLUMNS: 4 / 3 / 2 / 1`.

**No `<h1>` exists on the homepage.**

## 2.3 Colour — a dark chrome

Ferrell inverts Schaefer. The interface is near-black; the photography is the only light
in the page.

| Token | Value | Role |
| :--- | :--- | :--- |
| `--COLOR-BG` | `#1d2226` | Dark slate page ground |
| `--COLOR-HEADER-BG` / `--COLOR-MENU-BG` | `#2c3037` | Header and menu |
| `--COLOR-SUBMENU-BG` / `--COLOR-FOOTER-BG` | `#000000` | Submenu, footer |
| `--COLOR-TEXT` / `--COLOR-PRIMARY` | `#ffffff` | All text |
| `--BTN-PRIMARY-BG-COLOR` | `#020303` | Primary button |
| `--BTN-SECONDARY-BG-COLOR` | **`#ba816d`** | The one warm accent — a dusty clay |
| `--COLOR-SALE` / `--COLOR-SALE-BG` | `#d29312` / `#a54545` | Sale amber / sale red |

Effectively **one hue of interface (blue-grey) plus a single clay accent**. As with
Schaefer, the palette is a container, and colour is delivered by garment and landscape.

The dark ground is a legitimate strategic choice for a young brand: it removes the
"bright, cheerful, new e-commerce" register and makes even modest photography look
deliberate. It also raises the stakes on image quality, because nothing is hiding.

## 2.4 Homepage, band by band

Document height **7,434 px**; all bands full-bleed at 1,425 px.

| # | Band | Top | Height | Carried by | Media |
| ---: | :--- | ---: | ---: | :--- | ---: |
| 0 | Announcement | 0 | 36 | UI | 0 |
| 1 | Header (absolute overlay) | 36 | 125 | UI | 98 menu imgs |
| 2 | Utility strip | 161 | 44 | UI | 0 |
| 3 | **Hero** | 205 | **703** | One environmental photograph | 1 |
| 4 | New Arrivals + brand story | 908 | **1,821** | Product rail + "our story" prose | 11 |
| 5 | **Well Worn** | 2,729 | **1,754** | Customer & partner photography | 10 |
| 6 | Our collections (rich text) | 4,483 | 174 | Type | 0 |
| 7 | Two-tile custom content | 4,657 | 1,052 | 2 photographs at 646 × 1,115 | 2 |
| 8 | **Instagram UGC wall** | 5,729 | 710 | 12 social tiles, 222 × 277 | 24 |
| 9 | Newsletter | 6,439 | 288 | Photograph band + form | 1 |
| 10 | Footer | 6,727 | 602 | UI | 1 |

**Bands 5 and 8 together are 2,464 px — a third of the page — and both are made of other
people's photographs of themselves.** That is the whole strategy expressed as layout.

Two of eleven bands are pure product merchandising; the rest are people, place or proof.

## 2.5 Photography system

### 2.5.1 The hero

Single frame, 1440 × 781 (**1.84:1**), `loading="eager"`, running full-bleed under a
transparent header. Character, observed: one subject, natural golden-hour light, shallow
depth of field with the background dissolved to bokeh, a real field with a wire fence and
sunflowers, subject caught mid-moment looking off-camera. Personal detail is left in —
tattoo, wedding ring, working straw hat.

This is **environmental portraiture in a photojournalistic register**, not a lookbook
frame. It is also the cheapest kind of premium photography to produce: one person, one
location, available light. No studio, no crew, no set build.

### 2.5.2 Shoot-based naming, and what it reveals

Ferrell's filenames encode two different systems running in parallel:

| Pattern | Example shape | Meaning |
| :--- | :--- | :--- |
| `{StyleCode}.{Colour}.{n}.jpg` | `FBS1026109.H.Black.1.jpg` | Catalogue asset keyed to SKU |
| `{StyleCode}.{Shoot}{Date}.{frame}.jpg` | `FPS1026049.Keller0106.6.jpg` | Campaign frame keyed to SKU **and** shoot |
| `{date}_{Shoot}-p{frame}-lr.jpg` | `2026-01-14_Ferrell_Shirts-p0098b-lr.jpg` | Dated shoot, Lightroom export |
| `{campaign}-{shooter/subject}-{n}` | `ferrell-summer2026-kellersnaps-10.png` | Named collaborator |
| `{PersonName}{Garment}.jpg` | Named-artist files on Well Worn | Partner imagery |

The style code is public: the PDP prints a style number that matches the filename prefix.
**The asset is traceable to the SKU from its filename alone** — a DAM discipline worth
adopting wholesale.

Weaknesses in the same system: **no shot-type token**, so `…Cream1/2/3/4` tells you
nothing about what each frame contains; PNG is used for photographic content; and two
files named `Screenshot_2026-08-04_at_….png` and `Screenshot_2025-08-08_at_….png` are
shipped in production — one inside the mega menu, one inside Well Worn.

### 2.5.3 Studio versus environment

| Surface | Studio | Environmental / worn | Share environmental |
| :--- | ---: | ---: | ---: |
| Hero | 0 | 1 | 100% |
| New Arrivals rail | 4 | 0 | 0% |
| Well Worn band | ~2 | ~8 | ~80% |
| Two-tile content | 1 | 1 | 50% |
| Instagram wall | 0 | 12 | 100% |
| PDP (The Tristan) | ~4 | ~2 | ~33% |

Homepage overall runs roughly **80% environmental**. The studio frames are confined to
the product rail and the top of PDP galleries.

### 2.5.4 The mechanism that matters: "Well Worn"

A named, permanent editorial programme with its own page and its own footer link. Framed as
real people, real style, real stories, and explicitly spanning working ground and city
weekends.

Its caption structure is the entire credibility engine:

```
{NAME} | {PLACE, RANCH OR STATE}
SHIRT: {STYLE NAME}
```

The grid, at equal tile size and with no ranking, mixes:

- **Nationally known musicians** (five of them, one very large name),
- **a named ranch hand at a named ranch**,
- **customers identified by first name and state initial**,
- and a community group.

Three consequences, each transferable:

1. **A famous person and a customer are given identical visual weight.** The message is
   that both are evidence of the same thing — the shirt gets worn by people who do things.
   No hierarchy of endorsement, so no whiff of paid celebrity.
2. **Every credibility tile names the garment**, so the proof band is also a merchandising
   band. Nothing is spent on atmosphere alone.
3. **None of it requires history.** The programme substitutes *proof of use* for *proof of
   age*. This is the specific answer to L&B's problem.

The Instagram wall reinforces it with 12 tiles whose captions (readable in `alt`) are
straightforward observations about early mornings, honest work and daylight-to-dust — plus
direct customer quotes about fit and build.

### 2.5.5 How Ferrell communicates weight and durability

Weakly in prose, strongly in specification. The persistent PDP editorial block about
materials is entirely qualitative — a blend of durability and softness, carefully selected
fabrics — with **no fibre content, no ounce weight, no mill**. Compare Schaefer's 11 oz and
15 oz.

Where Ferrell wins is the **functional bullet list on the PDP**, which is unusually
specific about use:

- breathable and lightweight, explicitly rated for sweat
- dries fast
- **UPF+**
- wrinkle-resistant, described by what happens when you put it on
- **vented back**
- soft-stretch fabric
- **a sunglasses/pen slit in the pocket**
- **hidden snaps that hold the collar down**

Those last two are the tell. Nobody specifies a pen slit and a hidden collar snap unless
somebody wore the shirt to work and complained. **Feature specificity is a credibility
substitute for fabric-weight data** — and it costs nothing but honesty.

## 2.6 PLP and PDP

**PLP** (`/collections/all`, 24 products in grid):

| Property | Value |
| :--- | :--- |
| Grid | CSS Grid, `--COLUMNS: 4` desktop / 3 / 2 / 1, gap **22 px** both axes |
| Card image ratio | `--PRODUCT-GRID-ASPECT-RATIO: 140%` → **0.714 (5:7)**, taller than Schaefer |
| Images per card | 2 — catalogue primary, campaign secondary on hover |
| Card contents | badge · title · **review count inline** · price |
| **Filters** | **Availability · Product type · Size** — three facets |
| Product type values | Caps · Long-Sleeve · Polo · Short Sleeve Shirt |

Ferrell's filtering is meaningfully better than Schaefer's single facet. But the Size facet
mixes adult (S–3XL) and children's (6, 7, 8, 10, 12, 2X) vocabularies in one list — a
taxonomy leak across audiences and a live warning for L&B's D-04.

**PDP** (`/products/the-tristan-cream`):

| Property | Value |
| :--- | :--- |
| Gallery | **6 images, 0 video** (a second PDP measured 5) |
| Native asset size | **357 × 536 / 389 × 585 → 0.667 (2:3)** |
| Max asset width | **under 400 px** — no zoom-grade resolution anywhere |
| Structure | Description / Our Guarantee tabs · feature bullets · public style number · size guide |
| **Size guide** | **A real HTML text table** — chest circumference and sleeve length in inches per size |
| Fit guidance | One prose sentence on cut through the waist |
| Persistent blocks | "Premium materials" and "Texas roots" appended to every PDP |
| Reviews | Junip element present; **review content did not render into the DOM** |

Two things stand out.

**The size guide is structured HTML text, not an image of a table.** That is exactly what
CLAUDE.md §8.4 requires and exactly what the live L&B site fails. Ferrell — the smaller,
younger, cheaper brand — already does it right.

**The gallery is the system's weakest link: six sub-400-px images and no video for a $70
shirt.** For comparison, Schaefer ships 21 images at 720 × 960 plus video for a $255
jacket. Ferrell's authority comes from the Well Worn programme *because* its product
photography is thin. That is a survivable trade for a young brand, but it is a trade.

### The origin claim, and the trap inside it

Ferrell handles origin **two different ways on two different pages**, and the difference is
instructive:

| Page | Register | Verdict |
| :--- | :--- | :--- |
| PDP "Texas roots" block | Names the state, names the inspiration (real cowboys), **claims no date and no founder** | **Safe and effective** |
| About Us | Claims to preserve a legacy, honours unnamed generations, cites unnamed skilled artisans and unspecified advanced technologies | **The exact trap CLAUDE.md §12 forbids** |
| Well Worn | Names real, living, checkable people wearing named garments | **Strongest authority on the site** |

The About page borrows heritage it does not own and names nobody. The Well Worn page names
everybody and borrows nothing. **The page with no history is the page with the most
authority.**

## 2.7 Tech stack and weight (PDP, measured)

| Metric | Ferrell | L&B budget |
| :--- | ---: | ---: |
| Requests | **365** | — |
| Total transferred | **3.94 MB** | ≤ 1.5 MB |
| **JS compressed** | **1,673 KB across 148 scripts** | **≤ 180 KB** |
| CSS | 330 KB | — |
| Images | 10 JPEG = 773 KB + 4 PNG + 31 SVG | — |
| **Image formats** | **JPEG / PNG only — no WebP, no AVIF** | WebP/AVIF |
| TTFB / DOMContentLoaded / load | 33 ms / 2,102 ms / **5,474 ms** | — |
| Third-party hosts | **20** incl. Typekit, Vitals, Klaviyo, GTranslate, CookieYes, Zepto, Redo, GTM, DoubleClick | — |

**Ferrell ships 63% more JavaScript than Schaefer while serving one-fifth the imagery.**
The weight is entirely app-stack, not content. Page load is 5.5 s.

## 2.8 Faults worth not repeating

- **JS at 9.3× our budget**; 148 scripts; 20 third-party hosts; 5.5 s load.
- **Retailer Locator renders zero retailer data in HTML** — it is a third-party Stockist
  widget that shows only a loading string without JavaScript. A locator is a public,
  crawlable surface under CLAUDE.md §11; this one is invisible to crawlers and to any
  session with failed JS.
- **Instagram UGC band uses 1 × 1 placeholder images**; without JavaScript the band is
  empty. The captions do survive in `alt`, which is the only reason it degrades at all.
- **Reviews do not appear in the DOM** — the brand's second-best social proof is invisible
  to no-JS and to crawlers.
- **Alt text is empty across the entire Well Worn page** (12 images) and the hero.
- **No `<h1>`** on the homepage.
- **Screenshots shipped as production imagery**, twice, on two different pages.
- Copy errors in the size table and fit paragraph.
- PDP assets under 400 px wide.

---

# PART 3 — HOW EACH EARNS AUTHORITY

| Lever | Schaefer | Ferrell |
| :--- | :--- | :--- |
| Time | Four decades, a founder's name, a specific valley | **None claimed on product surfaces** |
| Material proof | Trademarked fabrics with dates and **ounce weights** | Functional feature specificity (UPF, vents, pen slit) |
| Third-party proof | 8,500+ reviews; durability scored 4.9/5 as an attribute | Named wearers: musicians, a ranch hand, customers by state |
| Place proof | Three physical stores photographed | A retailer locator in primary nav |
| Honesty move | States design origin and import status plainly | States the state and the inspiration; claims no date |
| Photography | Environmental for story, studio for comparison, 21-frame PDP | Environmental almost everywhere, 6-frame PDP |
| Where it is weakest | Filtering; page weight; alt text | Product photography depth; About-page heritage borrowing |

**Two independent routes to the same destination.** Schaefer earns authority by being
checkable about *the cloth*. Ferrell earns it by being checkable about *the people*.

Both are available to L&B. **Only Ferrell's is available immediately**, because it needs no
mill data, no archive and no history — only a camera and permission.

And note what neither brand does: neither invents a founding date it cannot support,
neither names a mill it does not use, and neither claims domestic manufacture. Schaefer,
with the strongest heritage case of the two, is the one that writes "imported" on the page.

---

# PART 4 — WHAT FRONTIER HOUSE SHOULD TAKE

A specification for the L&B photography system. This is a **research recommendation**, not
approved direction, and it does not depend on any open owner decision except D-09
(licensing) and D-11 (media budget).

## 4.1 The principle

> **Authority without heritage is bought with specificity and with other people's time.**

Lucky & Blessed cannot say 1865. It can say **2015**, **Texas**, **a 100% fill rate**, a
**2.64-day processing time**, **262 and 353 verified reviews across two marketplaces**, and
**showroom #13656 at Dallas Market Center**. Those are checkable facts and there are more
of them than most heritage brands can produce. Photography's job is to make them *visible*.

Three rules follow, in priority order:

1. **Photograph the cloth close enough to argue.** Weave, topstitch, snap, selvedge, hem.
2. **Photograph the garment where it is used, not where it was made.** Environment is the
   only free credibility on the internet.
3. **Photograph the people who already buy it.** L&B's customers are *boutique owners*.
   That is a Well Worn programme nobody else in this category is running.

## 4.2 The deliberate media stack — eight slots per product

Every real product should eventually carry these eight, in this order. The order is also
the gallery order and the fallback order: if only slot 1 exists, the PDP is still correct.

| # | Slot | Ratio | Min. long edge | What it must prove | Required? |
| ---: | :--- | :--- | ---: | :--- | :--- |
| 1 | **Object** | 3:4 | 2,000 px | What it is. Front, even light, neutral ground, no crop. | **Required** |
| 2 | **Reverse** | 3:4 | 2,000 px | Back yoke, back pockets, back rise. Half of western design lives here. | **Required** |
| 3 | **Worn** | 3:4 | 2,000 px | The garment on a body, full length, standing, neutral ground. | **Required** |
| 4 | **Fit** | 3:4 | 2,000 px | The same garment on a **second body of a different size**, same light, same ground. | **Required where the size range spans straight and plus** |
| 5 | **Detail** | 1:1 | 1,600 px | One construction fact per frame: snap, buckstitch, rivet, hem, waistband, label. **2–4 frames.** | **Required, ≥ 2** |
| 6 | **Material** | 1:1 | 1,600 px | Raking light across the weave at a distance where thread count is countable. **No garment shape.** | **Required, 1** |
| 7 | **World** | 3:2 | 2,400 px | The garment in a real Texas place, in real light, worn by someone doing something. **2–4 frames.** | **Required, ≥ 1** |
| 8 | **Motion** | 3:4 or 9:16 | 1,080 px | 3–6 s, no audio, no cuts: fabric moving, a fringe swinging, a jacket going on. | Optional |

**Minimum viable stack for launch: slots 1, 2, 3, 5 (×2), 6, 7 (×1) = 7 assets.**
**Full stack: 13–17 assets per style.**

Benchmarks: Schaefer ships 21 + video for one jacket; Ferrell ships 5–6 and no video. Seven
is defensible; thirteen beats both on quality-per-asset.

### Proportion target

| Category | Share of assets | Share of *homepage and editorial surface* |
| :--- | ---: | ---: |
| Studio (slots 1, 2, 3, 4) | **~45%** | **≈ 0% of full-bleed bands** |
| Material and detail (5, 6) | **~25%** | Used in editorial bands and material pages |
| Environmental (7) and motion (8) | **~30%** | **100% of full-bleed bands** |

The rule both teardown subjects follow without exception: **studio photography never opens
a page.** It lives in grids and galleries, where the shopper is comparing. Every full-bleed
band is a place with weather in it.

## 4.3 The photographer's brief

One brief, three shoot days, two locations. Written to be handed over as-is.

### Day 1 — Studio (slots 1–4)

- **Setup:** single softbox key plus a large white bounce; one neutral warm-grey seamless
  (must not compete with the bone/off-white UI ground); locked camera on a tripod at chest
  height; identical framing across every style so the grid never jumps.
- **Per style, per colourway:** front on a form or model, back, then the garment in its
  **altered state** — jacket open showing lining, snap shirt half-unsnapped, a wild rag or
  scarf **actually knotted, not laid flat**. That altered-state frame is Schaefer's
  cheapest and best trick.
- **Two bodies, not one.** Shoot every style on a straight-size and a plus-size fit model
  under identical light and identical framing. Not a separate "plus shoot" — the same
  shoot, the same day, the same ground. This is the photographic expression of the
  constitution's rule: **one garment, one record, one full size range** (§11).
- **Deliverables:** 3:4, ≥ 2,000 px long edge, colour-managed, sRGB, unretouched masters
  archived.
- **Do not:** retouch away weave, wrinkle or seam pucker. The pucker is the evidence.

### Day 2 — Material and detail (slots 5–6)

This is the day that earns "material honesty at high resolution", and it is the cheapest
day on the schedule.

- **Macro lens, raking light at 15–25° across the surface.** Flat frontal light kills
  weave; side light is the entire point.
- **Per fabric family, one material frame** at a distance where an individual thread is
  resolvable. No garment shape, no styling — just cloth. These become the assets for a
  future *Materials* navigation axis.
- **Per style, 2–4 detail frames**, one construction fact each: the snap face, the
  buckstitch, the rivet and bar tack, the hem and the topstitch line, the waistband
  interior, the woven label.
- **Shoot a paired "new / worn" frame** where any garment exists in both states. Two frames
  of the same seam, one fresh, one after wear.
- **Deliverables:** 1:1, ≥ 1,600 px.
- Photograph **an alteration or repair in progress** if available — needle in cloth, chalk
  line on denim. Process imagery is the honest substitute for a heritage archive.

### Day 3 — World (slots 7–8)

- **Two real Texas locations**, named in the caption. Not a set, not a rented ranch styled
  as a set. A working yard, a loading dock, a two-lane at dusk, a boutique's back room,
  the Dallas Market Center floor during market week.
- **Available light only**, at the two ends of the day. One reflector maximum.
- **Direct the activity, not the pose.** Give the subject a task — loading, walking,
  fastening, unrolling a bolt of cloth, hanging a rack. Photograph the task. Ferrell's hero
  works because the subject is caught mid-moment, not held mid-pose.
- **Leave the evidence in:** dust, sweat, a scuffed boot, a wedding ring, a tattoo, a
  crooked hat. Retouching these out is the single fastest way to lose the argument.
- **Motion:** 3–6 s, locked or slow pan, **no audio, no cuts, no titles**. One idea per
  clip. Every clip needs a poster frame that carries the whole message alone (§9).
- **Deliverables:** 3:2 for world, 9:16 for a mobile-first crop of the same frame.

### Day 3b — The buyer programme (the Ferrell lesson, adapted)

The highest-value shoot L&B can commission, and it is not a shoot at all:

- **Photograph the boutiques that already stock Lucky & Blessed**, and photograph the
  owners in their own stores. Named, with the town.
- Caption structure, one line, always naming the garment:
  `{OWNER OR STORE} · {TOWN, STATE}` / `WEARING: {STYLE NAME}`
- Equal tile size for every subject. No hierarchy between a large account and a
  single-store boutique — that equality *is* the message, exactly as Ferrell places a
  ranch hand beside a musician.
- **This programme requires zero heritage, zero mill data, and zero owner decisions
  beyond a signed release.** It is the fastest authority L&B can buy, and it is
  differentiated: no competitor in this category photographs its *retailers*.
- **Constraint:** real people, real stores, signed releases, correct names. CLAUDE.md §12
  forbids invented people absolutely. A single fabricated testimonial would destroy the
  mechanism it is imitating.

## 4.4 Asset naming and DAM convention

Adopt Schaefer's shot-type token and Ferrell's SKU traceability together. Neither brand has
both.

```
{style}_{slug}_{colourway}_{slot}[-{index}][_{size-model}].{ext}

2411_dark-wash-flare-jean_indigo_object.avif
2411_dark-wash-flare-jean_indigo_reverse.avif
2411_dark-wash-flare-jean_indigo_worn.avif
2411_dark-wash-flare-jean_indigo_fit_1x.avif      ← plus-size fit model
2411_dark-wash-flare-jean_indigo_detail-hem.avif
2411_dark-wash-flare-jean_indigo_material.avif
2411_dark-wash-flare-jean_indigo_world-2.avif
```

Why it matters here specifically:

- The **slot token is machine-readable**, so gallery order, card hover pair and the no-JS
  fallback can all be derived rather than curated per product.
- The **style number ties the asset to the SKU**, so an orphaned file is detectable in CI.
- **Never encode price, wholesale terms, MOQ or pack structure in a filename, path or alt
  text.** CLAUDE.md §11 lists alt text explicitly as a leak surface, and the live D-00
  failure is a filename-adjacent leak. Add a filename check to the slug-purity test.
- Formats: **AVIF with a WebP fallback.** Both teardown subjects ship JPEG/PNG only. This
  is free ground.

## 4.5 The card and gallery mechanics to adopt

| Mechanism | Source | Take it? |
| :--- | :--- | :--- |
| **Two-image card: object primary, world secondary on hover** | Both | **Yes.** Both images in the DOM at rest, opacity cross-fade, transform-only. Works without JS as a static primary. |
| Colour swatches cropped from the garment photograph, not flat circles | Schaefer | **Yes** — the swatch carries weave. Requires a swatch crop per colourway; add it to Day 1. |
| Portrait card ratio | Both (0.75 / 0.714) | **Yes — 3:4.** Never square. |
| Studio never opens a page | Both | **Yes, as a hard rule.** |
| Altered-state frame (open / knotted / half-fastened) | Schaefer | **Yes.** One frame per style, near-zero cost. |
| Retained raw sequence frames | Schaefer | **Yes, sparingly.** They read as documentation. |
| Material page with named fabrics and **stated weights** | Schaefer | **Yes** — and L&B can go further, because it owns the textile production Schaefer only buys. |
| Named-wearer programme with garment named in every caption | Ferrell | **Yes** — retargeted at boutique owners. |
| Reviews scored on **Fit / Quality / Durability** with reviewer height, weight and usual size | Schaefer | **Yes, when consumer commerce is decided (D-01).** Until then it does not apply — Phase 1 serves buyers, not consumers. |
| Sticky header that condenses on scroll | Schaefer 110 → 90 px | Optional. |
| Single webfont for the brand, system stack for body | Schaefer | **Strongly yes** — it is most of the reason Schaefer's CSS behaves. |

## 4.6 What to reject

- **Both sites' JavaScript.** 1,024 KB and 1,673 KB compressed, against our 180 KB budget.
  Both are Shopify app stacks, not features. We do not inherit this.
- **Ferrell's JS-only store locator, UGC band and reviews.** All three fail with JavaScript
  off. Our store locator and product truth are server-rendered, non-negotiably (§11, CI
  Test 1). Any UGC or review widget must render its content into the HTML or not ship.
- **Both sites' empty `alt` on editorial and hero imagery.** Every frame in the eight-slot
  stack gets alt text written at ingest, describing the garment and the setting. It is a
  contractual delivery item from the photographer, not an afterthought (§8.5).
- **Ferrell's About-page register** — preserving a legacy, honouring unnamed generations,
  unnamed artisans. This is precisely what CLAUDE.md §12 and §13b forbid, and it is
  Ferrell's own weakest page.
- **Any invented sourcing attribution.** The audit already found invented mills in the V3
  designs. Both live sites avoid this; so must we.
- **Screenshots, placeholder products and demo data in production.** Observed on both
  sites. Add a CI check for filenames matching `screenshot|untitled|placeholder|example`.
- **Sub-400 px PDP assets** (Ferrell). If the weave is not resolvable, the frame is not
  doing its job.

## 4.7 The one-paragraph version

L&B should photograph in three registers and keep them separate. **Studio** answers *what
is it* and lives only in grids and galleries. **Macro** answers *what is it made of* and is
the cheapest day on the schedule and the one that discharges the constitution's promise of
material honesty. **Environment** answers *who wears it and where*, carries every
full-bleed band, and is shot with available light in real Texas places with the dust left
in. Around that, run a named programme photographing the boutique owners who already stock
the line — named, equal-sized, garment named in every caption. That programme is the whole
answer to having no heritage: it replaces *proof of age* with *proof of use*, it is the
mechanism Ferrell demonstrates works at $55 a shirt, and it is the one form of authority a
vertically integrated Texas manufacturer founded in 2015 can start earning this quarter.

---

## Appendix — measurement caveats

- Viewport 1440 × 900 unless noted. Some screenshot captures ran at a smaller viewport
  than the JavaScript context; **all numbers in this document come from the JavaScript
  context**, not from screenshots.
- The browser session was shared with other concurrent tasks; tabs were reassigned several
  times mid-teardown. Every measurement call returned `location.href` and was discarded if
  the origin did not match. No figure here is from a mismatched origin.
- Resource Timing totals are per page load and include third-party requests; figures for
  Schaefer are from the RangeWax jacket PDP, for Ferrell from The Tristan PDP.
- Ferrell's PLP filter and grid figures were captured at a 775 px viewport where the theme
  renders 2 columns; the 4-column figure is from the theme token `--COLUMNS: 4`.
- Ferrell review counts appear on PLP cards but review bodies did not render into the DOM
  during measurement; the widget (Junip) is present.
