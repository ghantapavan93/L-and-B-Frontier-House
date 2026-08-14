# Teardown — Cinch Jeans (cinchjeans.com)

**Focus:** fit architecture and fit education.
**Date measured:** 2026-08-13. **Method:** in-app browser, computed styles, Performance
API, direct inspection of CDN artwork. Desktop 1440×900 unless stated; mobile 375×812.
**Pages:** homepage · `/pages/mens-fit-guide` · `/pages/womens-fit-guide` ·
`/collections/mens-denim` (filtered and unfiltered) · PDP
`/products/cinch-mens-white-label-relaxed-fit-jeans-dark-stonewash`.

**Status:** competitor reference. **Mechanisms and principles only.** No layout, copy,
imagery, code or interaction from this site is to be reproduced. Numbers below are
measurements taken for comparison, not assets.

**Note on observed content:** nothing on the site addressed AI agents or attempted to
direct tooling. A cookie banner was present and was dismissed via its Preferences
control; no consent was granted, no form submitted, no account created.

---

## 0. Executive summary

Cinch has **the best fit *model* in the western denim set and the worst fit *delivery***.

They have done the hard editorial work almost nobody does: a five-column comparison matrix
that resolves every denim style to `FIT · RISE · LEG · BOTTOM OPENING`, a controlled
photographic contact sheet that shows four or five fits in identical pose and crop, and
technical flats drawn over a ghosted human leg so you can see the negative space. They
publish a stated reference size and a definition of how rise is measured. They ship
`fit` and `leg_opening` as real product metafields, so the guide deep-links into a
pre-filtered catalogue.

Then they **flatten all of it into four JPEGs with `alt=""`**.

The men's fit guide is 7,598px tall and contains **1,024 characters of text, zero
`<table>` elements, and one heading — which belongs to the newsletter block**. The PDP
size-chart modal contains **688 characters of HTML total**: a title and four `<img>` tags.
On a 375px phone those charts render at **0.35× scale**, putting the body text at roughly
five effective pixels.

The lesson for Frontier House is not "copy the matrix". It is: **the matrix is the right
data model, and it must be born as structured data, not as artwork.** Everything Cinch
draws by hand — the comparison, the flats, the deep-links — falls out of a typed product
record for free, stays legible on a phone, survives a screen reader, and can never drift
from the PDP.

**Ten measured headlines**

| # | Finding | Number |
| :-- | :--- | :--- |
| 1 | Men's fit guide text in `<main>` | **1,024 chars**, **0 tables**, **1 heading** (the newsletter's) |
| 2 | Size/fit data delivery | **4 JPEGs**, **all `alt=""`**, PDP modal **688 chars of HTML** |
| 3 | Chart legibility on mobile | **0.35× scale** (960px art → 335px box) |
| 4 | Fit-family contact sheets on mobile | **0.26× scale** (1440×544 → 375×142) |
| 5 | Guide → shop connection | **3 metafield deep-links**, `filter.p.m.custom.fit=SLIM\|RELAXED\|LOOSE` |
| 6 | Fit metafield coverage | **33 of 46** men's denim styles (**28% untagged**) |
| 7 | Leg-opening metafield coverage | **30 of 46** (**35% untagged**) |
| 8 | Fit surfaced on the product card | **3 of 15** cards in a fit-filtered PLP |
| 9 | Announcement-bar contrast | **3.26 : 1** — fails 1.4.3 at 11px |
| 10 | Fit-guide entry points in the header | **0** — footer and PLP only |

---

## 1. THE FIT GUIDE

### 1.1 How fit families are defined and named

Cinch runs **three naming layers at once**, and only one of them is a fit.

**Layer 1 — fit family (3 values).** `SLIM` · `RELAXED` · `LOOSE`.
Editorialised on the guide as *"Our Slimmest & Most Popular Fits"*, *"Our Best-Selling &
Most Comfortable Fits"*, *"Our Roomiest & Most Generous Fits"* — each family carries a
positioning claim, not just a dimension.

**Layer 2 — the Label system (colour-coded price/construction tiers).**
`BRONZE · SILVER · GREEN · WHITE · BLUE · BLACK` — plus `Black Label 2.0`, `Carter 2.0`,
`Carter 2.4`. These are **not fits**; they are lines that each *have* a fit.

**Layer 3 — named styles.** `IAN · JESSE · CARTER · GRANT · SAWYER`.

The mapping is many-to-one and is the whole job the guide performs:

| Family | Members |
| :--- | :--- |
| **SLIM** | Bronze Label, Silver Label, Ian, Jesse |
| **RELAXED** | Green Label, White Label, Carter, Carter 2.0/2.4, Grant |
| **LOOSE** | Blue Label, Black Label, Black Label 2.0, Sawyer |

A fourth axis — **fabric** (`Rigid` vs `Performance`/`Arenaflex`, i.e. stretch) — appears
in product names and in nav, but is **absent from the fit matrix entirely**. So a shopper
comparing "White Label 019 Rigid" against "White Label 039 Performance" gets no help from
the guide on how stretch changes the wear.

**The numbers are a fourth naming layer with no documentation at all.** Products are sold
as *White Label 003 / 013 / 019 / 039 / 045 / 057 / 058 / 059 / 064*, *Silver Label 001 /
002 / 006 / 007 / 012 / 015*. **Nothing anywhere on the site explains what those three
digits mean.** The guide resolves the *Label*, never the number. This is the single
biggest comprehension gap in their system, and it is entirely self-inflicted — the URL
slug for White Label 019 is
`cinch-mens-white-label-relaxed-fit-jeans-dark-stonewash`, i.e. **the fit is already in
the slug and has been deleted from the display name.**

### 1.2 The fit matrix — the artefact worth learning from

Delivered as `MENS_SIZE_GUIDE-DENIM_08132025.jpg` (960×1398). Five columns:
`JEAN NAME · FIT · RISE · LEG · BOTTOM OPENING`. The FIT cell carries a value **and a
body-part gloss** — this is the mechanism to steal.

**SLIM DENIM**

| Jean | Fit | Rise | Leg | Bottom opening |
| :--- | :--- | :--- | :--- | :--- |
| Bronze Label | SLIM — *Fitted Hip & Slim Thigh* | ORIGINAL 12″ | TAPERED | 16 ⅞″ |
| Silver Label | SLIM — *Slim Hip & Thigh* | MID 11 ½″ | STRAIGHT | 17 ¼″ |
| Ian | SLIM — *Slim Hip & Thigh* | MID 10 ½″ | BOOT CUT | 18 ⅜″ |
| Jesse | SLIM — *Slim Hip, Thigh & Knee* | MID 10 ¾″ | STRAIGHT | 16″ |

**RELAXED DENIM**

| Jean | Fit | Rise | Leg | Bottom opening |
| :--- | :--- | :--- | :--- | :--- |
| Green Label | RELAXED — *Fitted Hip & Thigh* | ORIGINAL 12 ½″ | TAPERED | 16 ⅞″ |
| White Label | RELAXED — *Fitted Hip, Relaxed Thigh & Knee* | MID 11 ¼″ | STRAIGHT | 18 ¼″ |
| Carter | RELAXED — *Fitted Hip, Relaxed Thigh & Knee* | MID 10 ⅜″ | BOOT CUT | 20″ |
| Carter 2.0 / 2.4 | RELAXED — *Fitted Hip, Relaxed Thigh & Knee* | MID 10 ⅜″ | BOOT CUT | 19″ |
| Grant | RELAXED — *Relaxed Hip, Thigh & Knee* | MID 11″ | BOOT CUT | 18 ⅞″ |

**LOOSE DENIM**

| Jean | Fit | Rise | Leg | Bottom opening |
| :--- | :--- | :--- | :--- | :--- |
| Blue Label | LOOSE — *Relaxed Hip, Loose Thigh & Knee* | ORIGINAL 12 ¾″ | TAPERED | 16 ⅞″ |
| Black Label / 2.0 | LOOSE — *Relaxed Hip, Loose Thigh & Knee* | ORIGINAL 12 ¼″ | SLIGHTLY TAPERED | 17″ |
| Sawyer | LOOSE — *Loose Hip, Thigh & Knee* | MID 11 ¾″ | BOOT CUT | 18″ |

**Footnote, and it is the most professional sentence on the site:**
> Bottom openings and rises are based off size 33×36. Rise is measured from top of
> waistband to inseam. Actual specs vary by size.

That does three things at once: it **declares a reference size** so the numbers are
comparable across rows, it **defines the measurement method** so "rise" is unambiguous,
and it **admits the numbers grade** so nobody treats them as a per-size promise. Any fit
table without those three statements is decorative. We must ship all three.

**Cross-checking the matrix reveals the vocabularies are richer than the taxonomy.**
`RISE` has two named tiers (`ORIGINAL` ≈ 12–12¾″, `MID` ≈ 10⅜–11¾″) — note **"Original"
sits *higher* than "Mid"**, which is counter-intuitive and unexplained. `LEG` has four
values (`TAPERED`, `SLIGHTLY TAPERED`, `STRAIGHT`, `BOOT CUT`). Bottom openings span
**16″ (Jesse) to 20″ (Carter Original)** — a 4-inch, 25% spread, which is the single most
decision-relevant number for a boot wearer and is never once related to a boot.

### 1.3 How each fit is visually communicated — four distinct mechanisms

**(a) Controlled comparison photography — the strongest thing on the site.**
Three full-bleed contact sheets (1440×544 each): `Cinch-Mens-Slim-Fit-w.jpg`,
`-Relaxed-`, `-Loose-`. Each is a 3-to-5-up of **the same crop, same wall, same floor,
same lighting, same stance, boots visible**. Under each figure: the style name, a
**colour-coded rule matching the Label colour**, the leg cut, and the bottom opening.

- SLIM: Bronze (Tapered 16⅞″) · Silver (Straight 17¼″) · Ian (Boot Cut 18⅜″) · Jesse (Straight 16″)
- RELAXED: Green (Tapered 16⅞″) · White (Straight 18¼″) · Carter Original (Boot Cut 20″) · Carter 2.0 & 2.4 (Boot Cut 19″) · Grant (Boot Cut 18⅞″)
- LOOSE: Blue (Tapered 16⅞″) · Black (Slightly Tapered 17″) · Sawyer (Boot Cut 18″)

Why it works: **variables are controlled**, so the only difference your eye can find is
the garment. A grid of marketing shots in different locations teaches nothing; this
teaches immediately. It is a *production* discipline, not a *design* one — it costs a
studio day and a locked-off camera.

**(b) Technical flats over a ghosted body — the mechanism to actually adopt.**
Inside `MENS_SIZE_GUIDE-DENIM_08142025_4_*.jpg`: three line-drawn jeans labelled
`SLIM · RELAXED · LOOSE`, each drawn **over a grey silhouette of a human leg**. You are
not looking at a shape; you are looking at **the air between the body and the cloth**.
That is what "fit" physically means and it is legible in under a second.

Repeated for the hem: four cropped flats — `TAPERED · SLIGHTLY TAPERED · STRAIGHT ·
BOOT CUT` — each over a ghosted **calf and foot**. The foot is the reference object that
makes the opening comprehensible.

**But there is no boot.** In western denim the boot *is* the use case, and Cinch draws a
bare foot. A 20″ Carter Original and a 16″ Jesse are two completely different garments in
relation to a roper versus a tall shaft, and the guide never says so.

The same ghosted-body technique is applied to shirts (`CLASSIC FIT · MODERN FIT · TEES`),
where the prose is unusually candid:

> Cinch Classic shirts fit much larger than most other men's shirt brands. Many
> individuals will need to size down one or two sizes. Classic shirts on average are 2″
> longer in sleeve & body length than other brands.

That is **calibration against the market**, not against themselves — the most useful fit
sentence a brand can write, and it is trapped inside a JPEG.

**(c) Body-measurement tables (also JPEG).**
Men's denim: sizes **26–46** (26,27,28,29,30,31,32,33,34,35,36,38,40,42,44,46) × rows
`WAIST / HIP / THIGH`. Waist 27–28″ at size 26 → 47–49″ at 46; hip 34″ → 54–55″;
thigh 21″ → 32″. **Thigh is published**, which most denim brands omit and which is exactly
the measurement that decides slim-versus-relaxed.
Pants/shorts XS–XXL (waist 26–42), boxers S–XL, socks M/L by shoe size.
Shirts: `CLASSIC FIT` XS–3XL and `MODERN FIT` XS–XXL, rows `CHEST / NECK / SLEEVE (from
center back)`; outerwear XS–4XL with three plain-English advisories.

**(d) Prose.** One 324-character paragraph at the top of the guide doing the
family→Label mapping in sentences. It names *Carter* but **omits Ian, Grant, Jesse and
Sawyer entirely** — four of the eleven denim styles are unmentioned in the only text on
the page.

### 1.4 Is there a fit-finder tool or quiz?

**No.** Zero interactive fit tooling anywhere: no quiz, no measurement input, no
"find my size", no size recommender, no body-type selector, no fit comparison widget, no
"compare to a jean you own". The entire system is static artwork plus three hyperlinks.
There is no JS beyond the Shopify theme (no fit app in the 156 scripts loaded).

This is worth sitting with: **the best fit content in the category is delivered with
zero interactivity, and it still beats everyone.** The content is the asset. Interactivity
is an amplifier, not a substitute — but Cinch has left the amplifier entirely unbuilt.

### 1.5 How the guide connects back to shoppable product

**This is the mechanism to adopt wholesale.** Three CTAs under the three contact sheets:

```
/collections/mens-denim?filter.p.m.custom.fit=SLIM
/collections/mens-denim?filter.p.m.custom.fit=RELAXED
/collections/mens-denim?filter.p.m.custom.fit=LOOSE
```

Fit is a **first-class product metafield** (`custom.fit`), so the guide does not maintain
a hand-curated list of products — it hands off to the catalogue and the catalogue answers.
A second metafield `custom.leg_opening` exists and is also URL-addressable. Both surface
as visible PLP facets.

**Can you filter by fit family from the guide? Yes — and that is its best feature.**

**The reverse path exists too**: `/collections/mens-denim` carries a `FIND YOUR FIT` link
back to the guide, and the top of the PLP carries a four-tile fit selector with the copy
*"Select your preferred jean fit below to find your Cinch denim label."* — SLIM /
RELAXED / LOOSE / **STRETCH**.

Three defects in that tile row, all measured:

1. **The tile links point at the staging domain.** All three fit tiles resolve to
   `https://rgptsp-y1.myshopify.com/collections/mens-denim?filter...` — the `.myshopify.com`
   preview host leaked into production markup. Clicking a fit tile takes a customer off
   the canonical domain. (Direct evidence that **URLs are where merchandising mistakes
   actually ship** — the same class of failure as our own D-00.)
2. **Two of four tiles render with no image** (LOOSE and STRETCH are blank boxes).
3. **`STRETCH` is a fabric axis presented as a fourth fit**, linking to
   `/collections/mens-performance-jeans`. Category conflation on the primary fit control.

### 1.6 What measurements are published, and in what format — **critical**

| Datum | Published? | Format |
| :--- | :--- | :--- |
| Fit family per style | Yes | **JPEG** (also a metafield, also a facet) |
| Fit gloss (hip/thigh/knee) | Yes | **JPEG only** |
| Rise tier + inches | Yes | **JPEG**; inches repeat as plain text on PDP |
| Leg cut | Yes | **JPEG** (also a metafield/facet) |
| Bottom opening inches | Yes | **JPEG**; repeats as plain text on PDP |
| Reference size + method | Yes | **JPEG only** |
| Body waist/hip/thigh by size | Yes | **JPEG only** |
| Garment inseam by size | **No** | — |
| Front rise by size (graded) | **No** | single reference size only |
| Stretch % / fabric weight | Weight yes | PDP plain text (`13.25 oz.`) |
| Boot relationship | **No** | — |

**Format verdict: image, not structured text.** Measured:

- Men's fit guide `<main>`: **1,024 characters**, **0 `<table>`**, **1 heading** (which is
  the newsletter's `<h2>`; the visible title "THE MEN'S FIT GUIDE" is a styled `<p>`, and
  the page has **no `<h1>`**).
- The `shopify-section--main-page` block that holds *all* sizing is **3,695px tall with
  4 images and 0 characters of text**.
- All 9 images on the page carry **`alt=""`**.
- The PDP size-chart modal, in full: **688 characters of HTML** — a `<span>` title and
  four `<img alt="">` tags. **0 tables. 21 characters of text.**

This is a textbook **WCAG 2.2 SC 1.1.1 Non-text Content (Level A)** failure, and it is
precisely the failure our own constitution (§8.4) names about L&B's current site. Cinch
commits it at larger scale: the women's `LADIES_TOPS_SIZE_CHART_08132025.jpg` is a
**2667×5278** raster — a 14-megapixel picture of a table.

### 1.7 The women's guide is materially worse — and shows the maintenance cost

- **892 characters**, **0 tables**, **6 chart JPEGs**, all `alt=""`.
- **Zero shop CTAs.** No fit deep-links at all. The men's guide's best feature simply does
  not exist here.
- **Two** fit families (slim, relaxed) vs men's three; named styles Jenna, Kylie, Ada.
- **A live copy contradiction:** *"For a slim thigh and leg, try the **Jenna** or Kylie
  jean. For a relaxed thigh and leg, try the Ada or **Jenna** jean."* Jenna is in both
  families. When fit lives in prose instead of a field, it can contradict itself and no
  system notices.
- A **separately hand-authored mobile artwork file** (`Cinch-Womens-Denim-Fit-mobile.jpg`,
  375×539) sits alongside the desktop one. That is the tell: an image-based fit system
  forces you to redraw and re-export per breakpoint, per season, forever. The filenames
  are hand-dated (`08132025`, `08142025`, `_Page_1`, `_Page_3`) — this is a PDF/InDesign
  export pipeline, versioned by a human, with no relationship to the product database.

---

## 2. Header and navigation

| Property | Value |
| :--- | :--- |
| Announcement bar | 40px, `#B38808` brass, white 11px Bevan, `letter-spacing 1.1px`, carousel `autoplay=5` |
| Header height | **66px** desktop, **54px** mobile |
| Position | `sticky`, `top: 40px`, `z-index: 4`, transparent background |
| Total sticky stack | **106px** |
| Structure | one row: logo (130×22 PNG) · primary nav · secondary nav · account/search/cart |
| Top-level items | 7 — `NEW ARRIVALS · MEN · WOMEN · BOYS · SALE · SUPPORT · RETURNS` |
| Nav type | Outfit 17px / 400 / `0.51px` tracking / no uppercase transform / `#00245D` |
| Mega-menu | 5 of 7 items have panels, hydrated from a `<template>` on interaction |

**How fit families appear in navigation — the key structural finding.**

Under `MEN`, denim is enumerated as **twelve sibling links on one flat level**:

```
ALL DENIM
BLACK LABEL · BLUE LABEL · BRONZE LABEL · GREEN LABEL · SILVER LABEL · WHITE LABEL
IAN · GRANT · JESSE · CARTER
```

**The nav exposes Layer 2 and Layer 3 (Labels and style names) and never Layer 1 (the fit
family).** You cannot navigate to "slim" from the header. The three words the fit guide
spends its whole existence teaching — SLIM, RELAXED, LOOSE — appear **nowhere in the
navigation**, even though they are live facet values with clean URLs.

**Fit-guide entry points: zero in the header.** The links live in a footer column
(`FIND YOUR FIT` → Men's / Women's / Boy's Fit Guide) and on the PLP. The phrase "FIND
YOUR FIT" *does* appear on the homepage — twice — but as a **decorative `.h6` eyebrow on
an image band whose CTA is "SHOP MEN'S DENIM"**. It is not a link. The most valuable page
on the site is marketed by a word that goes nowhere.

---

## 3. Typography

Two families, both Google-hosted. **Bevan** (a heavy slab serif) for display only;
**Outfit** (geometric sans) for everything else. Measured across 362 sans nodes and 44
slab nodes on the homepage.

| Level | Family | Size | Weight | Tracking | Line-height | Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PDP `h1` | Bevan | 26.4px | 400 | 2.64px (0.1em) | 39.6px (1.5) | uppercase |
| Eyebrow `.h6` | Bevan | 14.4px | 400 | 1.44px (0.1em) | 24.48px | uppercase |
| Footer heading | Bevan | 11px | 400 | 1.1px | 18.15px | uppercase |
| Announcement | Bevan | 11px | 400 | 1.1px | — | uppercase |
| Nav link | Outfit | 17px | 400 | 0.51px (0.03em) | 28.05px | none |
| Body | Outfit | 17px | 400 | 0.51px | 28.05px (1.65) | none |
| Card title | Outfit | 17px | 400 | 0.51px | 28.05px | none |
| Price | Outfit | 17px | 400 | 0.51px | 28.05px | none |
| Button | Outfit | 16px | 400 | 1.12px (0.07em) | 26.4px | uppercase |

**Token system** (235 CSS custom properties):

```
--heading-font-family : Bevan, serif      --text-font-family : Outfit, sans-serif
--heading-letter-spacing : 0.1em          --text-letter-spacing : 0.03em
--heading-text-transform : uppercase      --text-base : 1.0625rem  (17px)
--text-heading-size-factor : 1.2
--text-h1 : max(0.6875rem, clamp(1.375rem, 1.1463rem + 0.9756vw, 2rem) * 1.2)
--text-h2 : max(0.6875rem, clamp(1.25rem,  1.0671rem + 0.7805vw, 1.75rem) * 1.2)
--text-h3 : max(0.6875rem, clamp(1.125rem, 1.0335rem + 0.3902vw, 1.375rem) * 1.2)
```

Observations worth carrying:

- **Everything is weight 400.** No bold anywhere in the type system. Hierarchy is carried
  entirely by **family, size, tracking and case** — the slab does the shouting, the sans
  never raises its voice. This is a cheap, robust discipline and it holds up.
- **Body text is 17px with 1.65 line-height** — larger and looser than most fashion sites.
  Consistent with our own reference finding that premium reads as media density, not type
  scale, but Cinch goes the other way on body copy and it is more readable for it.
- **Display type is small in absolute terms.** `h1` maxes at 2rem × 1.2 = **38.4px** at the
  top of the clamp; the PDP h1 measured **26.4px**. The homepage hero is the exception and
  is set as a section-level override, not from the scale.
- **`0.1em` tracking on a heavy slab at 11px** (footer/announcement) is the weakest
  decision in the system — see contrast, §4.

---

## 4. Colour

Palette is narrow and almost entirely UI-neutral; **all colour comes from photography and
denim.** Seven named schemes:

| Token / scheme | Value | Role |
| :--- | :--- | :--- |
| Page background | `rgb(253,252,250)` `#FDFCFA` | bone white, sitewide |
| Primary navy | `rgb(0,36,93)` `#00245D` | logo, nav, headings, **focus ring** |
| Deep navy | `rgb(20,33,61)` `#14213D` | dark section ground |
| Brass | `rgb(179,136,8)` `#B38808` | announcement bar, review stars |
| Cream | `rgb(243,241,232)` `#F3F1E8` | alternate band |
| Sale red | `rgb(227,44,43)` | on-sale text and badge |
| Body text | `#000000` | |

**Computed contrast ratios**

| Pair | Ratio | Verdict |
| :--- | :--- | :--- |
| Black on bone `#FDFCFA` | **20.48 : 1** | pass |
| Navy `#00245D` on bone | **14.52 : 1** | pass |
| White on navy | **14.89 : 1** | pass |
| White on deep navy `#14213D` | **15.97 : 1** | pass |
| Black on cream `#F3F1E8` | **18.56 : 1** | pass |
| Footer link white @ 65% on navy | **6.95 : 1** | pass |
| **White on brass `#B38808` (announcement bar)** | **3.26 : 1** | **fails 1.4.3** |
| Focus ring navy on bone | **14.52 : 1** | pass (needs 3:1) |

The announcement bar is the only contrast failure and it is a real one: **11px Bevan,
uppercase, 1.1px tracking, 3.26 : 1** — small heavy slab type at a ratio that needs 4.5.

**Directly relevant to us:** Cinch's focus ring is `#00245D` at **2.4px, offset 0**, giving
**14.52 : 1**. Our audit found our specified ring (Oxidized Silver on Bone White) computes
**2.18 : 1** against a 3 : 1 requirement. Cinch is the proof that a single dark brand
colour used as the ring solves this at zero design cost — the same conclusion as our
Tobacco Leather `#734F36` (6.49 : 1) recommendation.

---

## 5. Homepage

Platform: Shopify, custom theme `OCT 01 - New Media With Text`. Document height **7,389px**
at 1440×900. Fourteen sections; padding is set per-section (all `0` at the wrapper), with
the rhythm carried by tokens `--section-vertical-spacing: 2.5rem` and
`--section-stack-gap: 2.25rem`.

| # | Section | Height | Carried by |
| :-- | :--- | ---: | :--- |
| 0 | Hero video | 576 | 2 `<video>`, 3 img — 25.7s loop, poster, muted, `playsInline` |
| 1 | `SHOP MEN / WOMEN / BOYS` + product carousel | 860 | **39 images** |
| 2 | `BUILT TOUGH, WORN PROUD.` image-with-text-overlay | 512 | 1 full-bleed image, eyebrow `FIND YOUR FIT` |
| 3 | `LEAD, DON'T FOLLOW.` marquee | 137 | type only, `marquee-text speed=0.3 direction=left` |
| 4 | `IT SETS THE STANDARD.` media grid | 778 | 3 img + 1 video |
| 5 | Slideshow | 801 | black ground, 2 slides, `autoplay=5` |
| 6 | `NEW ARRIVALS` carousel | 876 | 22 images |
| 8 | Multiple-media-with-text | 695 | 2 images |
| 9 | `BEST SELLERS` carousel | 864 | 30 images |
| 11 | Newsletter | 512 | 1 image |
| 12 | Footer | 588 | link columns incl. `FIND YOUR FIT` |

**Structure of the argument:** film → shop the three audiences → brand claim → marquee →
brand claim → slideshow → new product → brand claim → best sellers → capture. Product and
brand alternate strictly, roughly every 500–870px. **Three of the eleven visible bands are
pure product carousels totalling 91 images** — the page is a merchandising instrument
wearing a brand coat.

**Imagery treatment:** garment photography is on plain studio grounds; brand bands are
location work (rodeo, mountains). Type sits directly on the image with no scrim on the
hero — it survives because the slab is white, huge and high in the frame.

**Fit gets no homepage band.** The word "fit" appears twice, both as non-linking eyebrows.

---

## 6. PLP — `/collections/mens-denim`

**46 products.** Grid at 1440: **4 columns × 214.7px, gap 64px row / 60px column**
(a deliberately generous row gap — vertical air, not horizontal). At 775px: 3 columns,
gap 48/24. Grid-density switcher in the toolbar (3 states) plus `SORT BY` (a custom
disclosure, not a native `<select name="sort_by">`).

**Card anatomy — deliberately spare:**

```
image (1080×1350, 4:5, hover-swaps to a second image)
title      Outfit 17px / 400 / #000
price      Outfit 17px / 400
"Choose options"  → quick-buy modal (x-modal)
```

**No swatches. No badges. No rating. No fit chip.** Card height 377px at a 215px column.

**Is fit surfaced on the card? Barely.** In a `fit=RELAXED` filtered PLP, **3 of 15 cards
mention any fit word** — and only because those styles are *named* "Grant Relaxed Fit".
The Label styles read *"Men's White Label 058 Rigid — Medium Stone"*: label, number,
fabric, wash, **no fit**. Meanwhile the `<img alt>` on the same card reads *"Men's Grant
Relaxed Fit - Medium Stone"* — **the alt text is more informative than the visible title.**

**Facets — 8 groups:**

| Facet | Param | Values |
| :--- | :--- | :--- |
| Availability | `filter.v.availability` | In stock only |
| Price | `filter.v.price.gte/lte` | range |
| Waist | `filter.v.option.waist` | 16 values, 26–46 |
| Inseam | `filter.v.option.inseam` | 30/32/34/36/38/40 (+ `35 (0)`) |
| Color | `filter.v.option.color` | 7 — incl. **both `MEDIUM` and `Medium`** |
| Size | `filter.v.option.size` | 19 — incl. **`S (0) M (0) L (0) XL (0)`** |
| **FIT** | `filter.p.m.custom.fit` | RELAXED 15 · SLIM 14 · LOOSE 4 |
| **LEG OPENING** | `filter.p.m.custom.leg_opening` | STRAIGHT 14 · TAPERED 9 · BOOT CUT 7 |

**Metafield coverage is the buried headline:**

- FIT: 15 + 14 + 4 = **33 of 46 → 13 styles (28%) have no fit value.**
- LEG OPENING: 14 + 9 + 7 = **30 of 46 → 16 styles (35%) have no leg-opening value.**
- **`SLIGHTLY TAPERED` exists in the printed matrix but is not a facet value.** The
  artwork vocabulary and the data vocabulary have already diverged — inevitable, because
  they are maintained in different places by different people.

So a shopper who follows the guide's advice and filters to LOOSE sees **4 products out of
46**, when the matrix lists four loose families. The guide promises a taxonomy the data
cannot yet honour.

Quick-shop: `Choose options` opens a `quick-buy-modal` — variant selection without leaving
the grid. No add-to-cart directly from the card.

---

## 7. PDP — `Men's White Label 019 Rigid — Dark Stone`, $90

**Gallery:** 27 images, first at 647×808 natural rendered 560×700 (4:5). No video, no 3D,
no zoom-on-hover beyond the theme default. **Every image carries the same alt** — the
product title — so alt is identifying, not describing.

**How fit / rise / leg-opening are expressed.** Two collapsed `<details>` accordions:

```
FIT      Runs True to Size, 11 1/4" Front Rise, 18 1/4" Bottom Opening
FABRIC   100% Cotton, 13.25 oz. Rigid Denim
```

This is the good news and the bad news in one line.

- **Good:** it is **real text**, it is on the PDP, and both numbers **exactly match the
  guide's White Label row** (MID 11¼″ rise, 18¼″ opening). Guide and PDP agree.
- **Good:** `Runs True to Size` is a **calibration statement**, not a dimension —
  the thing shoppers actually want.
- **Bad:** it is a **comma-separated string in a single text field**, not a `<dl>` or a
  table. Three data points share one node; nothing is individually addressable, filterable
  or announceable.
- **Bad:** it **omits the fit family entirely.** The product is RELAXED. The word does not
  appear on the PDP — not in the title, not in FIT, not in the description. It exists only
  in the metafield that powers the facet, and in the URL slug
  (`...white-label-relaxed-fit-jeans...`).
- **Bad:** it omits leg cut (STRAIGHT), the hip/thigh/knee gloss, inseam, and stretch %.

The marketing description *does* carry the fit language the structured fields drop:
*"known for its versatile relaxed fit, straight leg and easy stacking bottom opening."*
So the facts are on the page **three times in three incompatible formats** — prose,
accordion string, and metafield — and never once as one addressable record.

**Size selection.** Two radio groups: **Waist (14 values)** and **Inseam (6)**, plus a
21-swatch colour group. Swatch targets measured **46–51 × 46px** — comfortably over WCAG
2.5.8's 24×24 and even 2.5.5's 44×44.

**Measurement data.** A `Size chart` `<button>` (not a link) opens `x-modal` titled
*"Men's Pants Size Guide"*. Contents in full: **688 characters of HTML, 0 tables,
4 `<img alt="">`** — the same four JPEGs as the guide page. Text content: 21 characters.

**Related products.** 6 items from a recommendation app (`pr_rec_id`, `pr_prod_strat=jac`
/ `e5_desc`) — algorithmic, mostly other White Label washes plus one Carter.
**There is no fit-based cross-link.** No "the same jean in a slimmer thigh", no "if this
is too narrow through the knee, try Grant", no link to the fit guide from the PDP at all
other than the size-chart modal. The one place a fit-comparison link would convert, it
does not exist.

**Structured data:** `ProductGroup` (with `hasVariant`, `productGroupID`),
`BreadcrumbList`, `FAQPage`, `Product` + `aggregateRating`. Sound. **No `size` or
`additionalProperty` carrying fit** — the fit data never reaches structured data either.

**Reviews:** Judge.me, 28 reviews, 4.64/5, with merchant replies shown inline including a
warranty complaint and its resolution. Left visible rather than buried — worth noting as a
trust mechanism, though not applicable to a wholesale-first Phase 1.

---

## 8. Motion

Deliberately restrained, and the reduced-motion architecture is **correct** — worth
recording because it matches what §9 of our constitution asks for and most sites get
backwards.

| Measurement | Value |
| :--- | :--- |
| CSS rules total | 2,492 |
| `@keyframes` defined | 45 (mostly Shopify checkout / Judge.me / chat widgets) |
| Rules with `animation` | 52 |
| **`prefers-reduced-motion` media blocks** | **12** |
| Live WAAPI animations at rest | **2**, 200ms each |
| Motion library | **none** — no GSAP, Lenis, Swiper, Framer, Splide, Flickity |

**Transition durations, by frequency:**

| Duration | Count | Property |
| :--- | ---: | :--- |
| `transform 0.2s ease-in-out` | 8 | cards, buttons |
| `opacity 0.2s` | 7 | reveals, hovers |
| `transform 0.2s` | 5 | |
| `color 0.2s ease-in-out` | 4 | links |
| `background-size 0.3s ease-in-out` | 4 | underline sweeps |
| `0.45s cubic-bezier(.785,.135,.15,.86)` | 2 | button fill |
| `scale 8s cubic-bezier(.25,.46,.45,.94)` | 1 | slow Ken-Burns zoom |

**Everything interactive sits at 200ms.** That is inside our 100–400ms rule and below the
500ms drag threshold. The only long duration is an 8s ambient image zoom — ambient, not
interactive, and correctly gated.

**The gating pattern is the opt-in one, which is the right one:**

```css
@media screen and (pointer: fine) and (prefers-reduced-motion: no-preference) { … }
@media (prefers-reduced-motion: no-preference) { image-parallax img { transform: … } }
@media (prefers-reduced-motion: no-preference) { [reveal-on-scroll="true"] { opacity: 0 } }
```

Motion is **added when the user has not objected**, rather than stripped afterwards. It
also gates on `pointer: fine`, so hover choreography never fires on touch. Both are
patterns to copy.

**One caveat we must not inherit:** `[reveal-on-scroll="true"] { opacity: 0 }` is scoped
under a *media query and a markup attribute*, **not under a JS-set attribute**. If the
reveal script fails, that content stays at `opacity: 0` permanently. Our §8.7 requires
hidden states be scoped under a JS-set attribute precisely so a JS failure leaves content
visible. Cinch has the failure mode; we must not.

**Auto-playing content and WCAG 2.2.2 (Pause, Stop, Hide, Level A):**

- Hero video: **25.7s, `loop`, `muted`, `playsInline`, poster set, `controls: false`**.
- Slideshow: `autoplay=5` (5s interval), 2 slides.
- Announcement bar carousel: `autoplay=5`.
- Marquee: `speed=0.3 direction=left`, JS-driven (no CSS animation, no WAAPI entry).
- **Pause / play controls found on the page: 0.**

Four independent auto-advancing or looping mechanisms, all over five seconds, **none with
a visible pause control**. This is a Level A failure and it is exactly the trap our §8
table warns about — a pause control cannot be retrofitted into a finished art direction.

Poster discipline is otherwise good: every `<video>` has a poster and `preload` is
`metadata` or `none`, so a blocked autoplay degrades to a still.

---

## 9. Tech stack and weight

| | |
| :--- | :--- |
| Platform | **Shopify**, theme `OCT 01 - New Media With Text` (id 145958764735) |
| Architecture | Liquid + **Web Components** — `x-header`, `x-modal`, `product-card`, `price-list`, `quick-buy-modal`, `scroll-carousel`, `slideshow-carousel`, `marquee-text`, `predictive-search`, `cart-drawer`, `video-media`, `height-observer`, `accordion-disclosure` |
| Frameworks | **none** — no React, Vue, Alpine |
| Libraries | jQuery 3.7.1 (app-injected), Judge.me reviews, a rewards widget, `access-widget-ui` (accessibility overlay) |
| Fonts | Bevan + Outfit (Google) |

**Weight, measured:**

| Page | Requests | Transferred | Notes |
| :--- | ---: | ---: | :--- |
| Homepage | 320 | **1,311 KB** | images 990 KB / 20 req; video 46 KB (posters+metadata only) |
| PDP | 431 | **1,076 KB** | |

**PDP breakdown:**

| Type | Files | Transferred | Decoded |
| :--- | ---: | ---: | ---: |
| JS | **156** | 199 KB | **3,472 KB** |
| CSS | **162** | 131 KB | **4,840 KB** |
| Images (jpg) | 14 | 496 KB | 647 KB |
| XHR | 11 | 138 KB | 584 KB |

DOM: **1,573 nodes**. DCL **533ms**, load **1,860ms** (on a fast desktop connection —
treat as a floor, not a result).

**199 KB of compressed JS is over our own 180 KB budget**, and that is a Shopify baseline
with almost no bespoke behaviour: the single largest script is
`portable-wallets.en.js` at **75 KB compressed / 375 KB decoded**, followed by
`shop-js` payment modules (~21 + 19 + 19 + 11 KB). **The checkout-adjacent Shopify runtime
alone consumes ~72% of our entire JS budget before a line of our code exists.** That is a
concrete argument for our decision not to build on a hosted-checkout platform for Phase 1.

**162 separate CSS files** is app-injection sprawl; each app ships its own stylesheet.

**Image formats.** URLs are `.jpg` / `.png`, but the Shopify CDN sends `Vary: Accept` and
content-negotiates. Verified directly: the same `.jpg` URL returns
**`content-type: image/webp`** when `Accept` includes it. So **WebP is served in practice;
AVIF is not** (an `Accept` listing `image/avif` first still returned WebP). No `<picture>`
elements, no explicit `format=` params, no AVIF anywhere. `srcset` is comprehensive
(200/300/400/500/600/700/800/1000w) with correct `sizes`. 14 of 36 images lazy-loaded.

---

## 10. Accessibility

**The headline is §1.6: size and fit data is imagery, not structured text.** Everything
below is secondary to that.

**Fails / risks**

| Issue | Criterion | Measurement |
| :--- | :--- | :--- |
| All size & fit data is JPEG with `alt=""` | **1.1.1 (A)** | 4 images, 0 tables, 21 chars of text in the PDP modal |
| No pause control on looping video / carousels | **2.2.2 (A)** | 25.7s loop + three `autoplay=5` mechanisms, 0 controls |
| Announcement bar contrast | **1.4.3 (AA)** | **3.26 : 1** at 11px |
| Fit guide has **no `<h1>`**; page title is a styled `<p>` | 1.3.1 / 2.4.6 | 1 heading in `<main>`, and it belongs to the newsletter |
| Charts at **0.35×** on a 375px phone | 1.4.4-adjacent | body text ≈ 5 effective px; only pinch-zoom recovers it |
| Accessibility **overlay** widget present | — | `access-widget-ui`; overlays are not remediation |

**Passes / good practice**

| Item | Measurement |
| :--- | :--- |
| Skip link | present, `Skip to content` → `#main` |
| `lang="en"`, landmarks | 1 `main`, 1 `header`, 2 `nav`, 1 `footer` |
| Focus ring | `#00245D`, 2.4px, **14.52 : 1** — well over the 3:1 requirement |
| `:focus:not(:focus-visible) { outline: none }` | correct — keyboard keeps the ring, mouse does not |
| Focus rules in CSS | 41, including explicit `:focus-visible` offsets on every swatch type |
| Touch targets | size swatches **46–51 × 46px** (2.5.8 needs 24; 2.5.5 needs 44) |
| Heading order on PDP | H1 → H2 → H2 → H2, no skipped levels |
| Reduced motion | 12 `no-preference` gates; correct opt-in direction |
| Zoom | `maximum-scale=5.0` — pinch-zoom to 500% permitted |
| Images with alt | 30 of 36 on PDP have non-empty alt |
| Keyboard operability | variant selection is native `<input type="radio">` in `<fieldset>`; accordions are `<details>`; size chart is a `<button>` — all natively operable |

The commerce path is genuinely keyboard-operable because it is built on native elements —
a direct consequence of the theme choosing Web Components over a JS framework. **That is
the architectural lesson: native semantics first makes accessibility mostly free, and it
is the same conclusion our §9 motion-stack rewrite reached from a different direction.**

---

## 11. What Frontier House should take

### 11.1 The one-sentence thesis

**Cinch proves the fit comparison matrix is the right editorial object, and proves by
counter-example that it must be born as typed product data.** We should build their
content model as a schema, render it from the record, and let the artwork be a *view* of
the data rather than the only copy of it.

Concretely: **one `FitProfile` record per denim style, server-rendered as structured text,
projected into four surfaces** — a comparison table, a scale strip, a PDP block, and a
facet — with **zero duplication between them**.

### 11.2 What to take, and what to reject

| Cinch mechanism | Verdict |
| :--- | :--- |
| `FIT · RISE · LEG · BOTTOM OPENING` as the fixed comparison axis | **Take.** Four columns is the right resolution. |
| Fit value + body-part gloss (`RELAXED — Fitted Hip, Relaxed Thigh & Knee`) | **Take, and split.** Make hip / thigh / knee three graded fields. |
| Declared reference size + measurement method + "specs vary by size" | **Take verbatim as a policy.** Non-negotiable. |
| Controlled comparison photography, identical crop and stance | **Take.** Cheapest highest-value asset we can shoot. |
| Technical flat over a ghosted body showing negative space | **Take — and make it data-driven SVG, not a drawing.** |
| Fit as a first-class metafield with URL-addressable facets | **Take.** Fit must be a field before it is a page. |
| Guide → pre-filtered PLP deep-links | **Take.** Both directions. |
| Bare foot as the hem reference object | **Reject — replace with a boot.** |
| Numbered style names with no published meaning | **Reject.** |
| Fit family absent from nav and from the PDP | **Reject.** |
| Fit data as raster imagery | **Reject absolutely.** |
| Auto-looping media with no pause control | **Reject.** |
| Accessibility overlay widget | **Reject.** |

### 11.3 The `FitProfile` schema — exactly what product data we need

This is the ask to put in front of the owner. Without these fields the fit layer cannot
exist; with them, every surface below is generated.

**Per style (the fit block — one record per silhouette, not per wash):**

```
style_id                     e.g. "frontier-straight"
fit_family                   enum: SLIM | STRAIGHT | RELAXED | LOOSE      (pick 3–4, final)
rise_class                   enum: LOW | MID | HIGH | ULTRA_HIGH
rise_inches                  decimal, at the declared reference size
leg_shape                    enum: SKINNY | TAPERED | STRAIGHT | BOOTCUT | FLARE | WIDE
leg_opening_inches           decimal, at the declared reference size
thigh_ease                   enum: FITTED | SLIM | RELAXED | LOOSE        (graded, 1–4)
knee_ease                    enum: FITTED | SLIM | RELAXED | LOOSE
hip_ease                     enum: FITTED | SLIM | RELAXED | LOOSE
front_rise_inches            decimal
inseam_options[]             integer array, actual offered inseams
stretch_pct                  integer (0 for rigid)
fabric_weight_oz             decimal
fabric_composition           string
recovery                     enum: RIGID | LOW | MEDIUM | HIGH            (does it bag out?)
boot_compatibility           enum: OVER_BOOT | STACKS_OVER_BOOT | MEETS_BOOT | TUCKS_IN | NOT_FOR_BOOTS
sits_at                      string, plain language ("at the navel", "below the hip bone")
runs_relative_to_size        enum: SMALL | TRUE | LARGE  + optional advice string
compare_to[]                 array of style_ids with a one-line reason
```

**Global, published once and cited on every table:**

```
reference_size               e.g. "30 × 32"          — MUST be stated
rise_measurement_method      "top of waistband to inseam"
opening_measurement_method   "flat, hem edge, doubled"
grading_disclaimer           "Specs vary by size."
```

**Per size (the grading table — structured text, never an image):**

```
size_label · body_waist_in · body_hip_in · body_thigh_in
           · garment_waist_in · garment_front_rise_in · garment_leg_opening_in · inseam_in
```

Cinch publishes body waist / hip / **thigh** and no garment grading. We should publish
**both**, because body measurements answer "what size am I" and garment measurements
answer "will this fit like the pair I own" — the second question is the one that prevents
returns.

**Data we must NOT invent** (constitution §12): none of the above may be estimated. Every
value is measured from a real garment or comes from the owner's spec sheets. If a field is
unknown it is **absent**, and the UI renders "not published" rather than a guess. A fit
table that lies is worse than no fit table.

### 11.4 How it should work — four surfaces, one record

**Surface 1 — the Fit Comparison Table (the guide's spine).**
A real `<table>` with `<caption>`, `<th scope="col">`, `<th scope="row">`. Rows are
styles, columns are `Fit · Rise · Leg · Opening · Thigh · Stretch · Boots`. Grouped by
`fit_family` with `<tbody>` per family. Sortable by opening and by rise — sorting a table
is the cheapest comparison tool that exists and Cinch cannot offer it because theirs is a
picture. Each row's style name links to the PDP; each family heading links to the
pre-filtered PLP.

**No-JS behaviour:** the table is fully present and readable; sorting is the enhancement.
This satisfies CI Test 1 by construction.

**Surface 2 — the Fit Scale Strip (our answer to their flats).**
A single horizontal axis, rendered as **inline SVG generated from the data**, not drawn by
a designer. Every style is a tick on the axis, positioned by `leg_opening_inches`. Above
the axis, each tick carries a **small silhouette whose leg width is computed from
`thigh_ease` and `leg_opening_inches`** — so the drawing cannot disagree with the number,
because the number *is* the drawing.

Three reasons this beats Cinch's approach outright:

1. **It cannot drift.** Add a style, it appears. Change an opening, the shape changes.
2. **It scales to a phone.** SVG at 375px is still sharp; their 960px JPEG is not.
3. **It is text underneath.** Each tick is a `<a>` with a visible label and an accessible
   name; the whole strip degrades to a linked list when SVG fails.

Ghost a **boot** behind the hem — a roper and a tall shaft as two toggle states — so the
20-inch versus 16-inch question is answered by looking. This is the single differentiator
Cinch left on the table and it is the one that matters most to a western customer.

**Surface 3 — the PDP Fit Block (a definition list, never a string).**

```html
<dl class="fit-spec">
  <dt>Fit</dt>            <dd>Relaxed — fitted hip, relaxed thigh and knee</dd>
  <dt>Rise</dt>           <dd>Mid — 11¼ in at size 30×32</dd>
  <dt>Leg</dt>            <dd>Straight — 18¼ in opening</dd>
  <dt>Stretch</dt>        <dd>2% — holds its shape through the day</dd>
  <dt>Over boots</dt>     <dd>Stacks over a roper. Clears a tall shaft.</dd>
  <dt>Sizing</dt>         <dd>Runs true to size</dd>
</dl>
```

Every `<dd>` is generated from a field. **Not collapsed by default** — Cinch hides this
behind an accordion, which means the highest-intent content on the page starts closed.

Beneath it, a **"Compared with"** row rendered from `compare_to[]`: two or three sibling
styles with a one-line reason ("*roomier through the thigh*", "*same rise, narrower hem*")
and a direct PDP link. This is the cross-link Cinch has no version of, and it is the
highest-converting element in the whole proposal, because a shopper who is *nearly* right
is one click from right instead of one click from gone.

**Surface 4 — the facets and the card.**
`fit_family`, `leg_shape`, `rise_class`, `stretch` (rigid / stretch) as PLP facets, all
URL-addressable and all server-rendered. **And — unlike Cinch — put the fit on the card.**
A single line under the title: `Relaxed · Straight · 18¼″`. Cinch surfaces fit on 3 of 15
cards; we surface it on 100% or the field is not populated and the product should not
ship.

**Coverage is a release gate, not a backlog item.** Cinch's fit facet covers 72% of its
denim and its leg-opening facet 65%. We should enforce **100% `FitProfile` completeness
for any garment in a denim collection** as a build-time assertion, sitting alongside the
three existing CI tests. A partial taxonomy is worse than none: it silently hides
products from the exact shopper who is trying hardest to find them.

### 11.5 How this connects to the Fit Passport and the denim finder

**The Fit Passport becomes the user's half of the same schema.** Today the Passport is
scoped around identity and saved preferences; this gives it a measurable spine.

- The Passport stores the **user side**: `body_waist`, `body_hip`, `body_thigh`,
  `preferred_rise`, `preferred_thigh_ease`, `boot_style` (roper / tall shaft / none),
  `inseam`, and — most valuable of all — **`reference_garment`**: a style_id they already
  own and like.
- The `FitProfile` stores the **garment side**.
- The **denim finder is the join**, and it must be honest about what it is doing: a
  transparent distance function over four or five named axes, with the reasoning shown.
  *"Closest to the pair you saved: same mid rise, ¾ inch more room in the thigh, 1½ inch
  wider hem for your tall shafts."* Never a black-box score, never a personality quiz.

Two hard rules follow from our constitution:

1. **The finder is an accelerator over a complete, browsable table — never a gate.**
   Every recommendation it makes must be reachable without it. Removing the finder
   entirely must leave a complete, correct, shoppable store (§11).
2. **Body measurements are personal data.** They stay in the authorised session, never in
   a URL, never in an analytics event, never in a public bundle. The permission boundary
   in §13b covers wholesale pricing; **it must be extended to cover Passport body data**,
   which is at least as sensitive and to which exactly the same "absent, not hidden" rule
   applies.

**For the wholesale buyer — the audience that actually pays today — the same record does
different work.** A boutique owner is not choosing a jean for themselves; they are
choosing an assortment. The comparison table becomes an **assortment-gap view**:
"you have three straight-leg mid-rise styles and nothing tapered under 17 inches." The
`FitProfile` fields are the exact inputs for that, and it needs no consumer commerce, no
WebGL and no owner decision beyond taxonomy — so **it fits inside Phase 1 as specified.**

### 11.6 The five things to build first

Ordered by value per unit of effort, all Phase-1-compatible, none blocked on D-01.

1. **Ship the `FitProfile` schema and make it required.** Nothing else is possible first.
   Add a build-time assertion for 100% coverage on denim.
2. **Render the comparison table as a real `<table>`** with declared reference size,
   measurement method and grading disclaimer. This alone beats every site in the set.
3. **Put fit on the product card and in the PDP as a `<dl>`.** Delete the possibility of
   fit living only in prose.
4. **Build the fit-scale SVG from the data**, with the boot ghost. Progressive
   enhancement over a linked list.
5. **Add `compare_to[]` cross-links to the PDP.** Cheapest conversion mechanism here.

### 11.7 What Cinch teaches about our own risk

Their failure is not laziness — the content is excellent and clearly expensive. Their
failure is that **the fit system was produced by a design team in InDesign and exported as
artwork**, so it lives outside the product database. Every symptom follows from that one
decision: the mobile illegibility, the empty alt text, the vocabulary drift between chart
and facet, the Jenna-in-two-families contradiction, the separately drawn mobile file, the
hand-dated filenames, the 28% of products the taxonomy has quietly forgotten.

This is the same class of failure our constitution §11 warns about in a different costume:
**not a decision to remove the product truth, but a gradual migration of it into a layer
where it cannot be read.** There, it was atmosphere absorbing commerce. Here, it is
art direction absorbing data. The defence is identical — **one server-rendered truth,
everything else a view of it** — and it should be enforced the same way: with a test that
fails the build.

Proposed fourth CI assertion, alongside the existing three:

> **Fit data assertion.** For every product in a denim collection, fetch the built page
> with JavaScript disabled and assert that `fit_family`, `rise_inches`, `leg_shape` and
> `leg_opening_inches` are present as text in the HTML — and that no size or fit table is
> delivered as an `<img>`.

That single test makes the Cinch failure structurally impossible for us.
