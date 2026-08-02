# 14 — Media and Asset Production Plan

> **`MEASURED` — There are zero production assets.** No GLB, glTF, video, texture, local font
> or GLSL exists anywhere in `stitch-export/`. **All nine assets named across both manifests
> are missing.** All imagery is remote, generated, and hosted outside project control.
>
> **Every pixel that ships must be created or licensed. This is the largest unstated cost in
> the project, and it is a budget and schedule fact more than an engineering one.**

---

## Immediate — before anything expires

**Mirror all ~30 remote generated images locally.** They resolve to
`lh3.googleusercontent.com/aida-public/…` with no persistence guarantee. If they expire,
every frame renders imageless and **the 42 Stitch preview renders become the only durable
visual record**. This is preservation of the design record, not production work.

---

## Phase 1 — required for the wholesale platform

| Asset | Notes |
| :--- | :--- |
| **Verified product photography** | Flat-lay + on-body, per SKU. The single largest line item |
| **Product data** | Names (display + spec), descriptions, materials, colourways |
| **SKU data** | Real SKUs |
| **Size and fit data** | **Structured measurement tables per category** — replaces the current text-free JPEG |
| **Availability data** | In stock / pre-order + ship windows |
| **Prepack and MOQ data** | Verified: prepacks of 6, $50 minimum |
| **Approved MSRP** | Recovered from V2 F6 — buyers need margin maths |
| **Authorised wholesale pricing** | Verified band $7–$33 |
| **Poster imagery** | Every media slot needs one. Currently `poster` appears in 0 of 48 files |
| **Self-hosted font files** | With confirmed licences. Currently 0 local fonts; 4 families load remotely |
| **Replacement icon set** | Material Symbols undercuts the craft claim |
| **Accessible image alternatives** | Meaningful alt text on every image, authored not generated |

**On-body photography must cover the full size range**, including extended sizes — required
to make the inclusivity claim credible rather than stated.

---

## Phase 2 — brand and editorial

| Asset | Notes |
| :--- | :--- |
| **Material macro set** | Buck-stitch · burnout velvet · denim slub · pearl snap · suede nap · rhinestone · silver. **Cheap, shot in a day, and it carries the entire "premium through material honesty" thesis. Do this first.** |
| **Craft / vertical-integration set** | The strongest untold story. **Verify what can honestly be shown before shooting** (OQ-04) |
| **Warehouse photography** | A **real apparel facility** — racks, aisles, rolls, dispatch. Replaces the sci-fi megastructure and the derelict interior |
| **Editorial and campaign photography** | Chapter-based, per V2 F4's structure |
| **Dallas / Texas geography** | Recovering V1's skyline — **the only verified real geography in 56 frames** |
| **Contact-sheet assets** | Nine-cell grid, per V2 F2 |
| **Product-anatomy photography** | High-resolution, with SVG callouts. **No 3D required** |
| **Garment motion clips** | 3–6 s, silent, looping. Fringe, ruffle, burnout and wide-leg denim only read in movement |
| **Buyer-story media** | Stockist profiles — *"We are partners in your success"* made literal |

---

## Cinema — only after a coherent storyboard exists

| Asset | Notes |
| :--- | :--- |
| **Buckle geometry** | **Modelled from `8b` and `8c` only.** Scalloped, chamfered, rectangular inset — **never** from `8e`, `8f`, `8g_1`, `12c` or the code. Photogrammetry of a real buckle is the preferred route |
| **Buckle materials** | Darkened/brushed silver · **copper** · tooled leather · denim · **turquoise** · brass · engraving · stitching. All are visibly present in `8c` — **the design delivers them; only the code does not** |
| Denim / leather / metal texture | Cap source at **2048²**, deliver KTX2/Basis |
| **Campaign film** | Highest cost, highest visibility. **Last, not first** |
| **Poster frames** | For every video. Must survive a centred native play glyph |
| **Captions and transcript** | Required. For silent film, the transcript describes garment, fabric, colourway — which doubles as SEO copy |
| Optional audio | With a visible sound control |

---

## Rejected — do not produce, do not carry forward

- **Fabricated-history assets** — **"EST. 1865"** engraved into the mobile hub's buckle;
  **"Origin: 1870s American West"** captioned on `8b`. Two mutually inconsistent fabrications,
  one **baked into pixels**. **Keep the object, remove the date** — the buckle photography is
  the strongest craft evidence in the corpus
- **The literal automotive engine** (`12k`)
- **Circular coin geometry** — `8d`, `8e`, `8f`, `8g_1`, `12c`, and the Three.js tori
- **Unsupported menswear** — every asset featuring a male model as primary subject
- **Unsupported footwear** — boots appear from V1 onward and are unverified inventory
- **AR assets** — "View in Space" appears in no manifest or specification
- **Invented sourcing imagery** implying Kuroki Mill or Leon & Tuscany tanneries
- **The $850 / $1,250 fixture set**

---

## Provenance governance

Every asset carries `provenance: 'photography' | 'generated-placeholder' | 'owner-supplied'`.

**Anything marked `generated-placeholder` is visually flagged in development and fails the
build if referenced from a production route.** This is the mechanism that keeps
**`CONCEPTUAL PLACEHOLDER — NOT VERIFIED PRODUCT INVENTORY`** true rather than aspirational.

**Licensing (D-09):** generated-image terms are unverified. **The workshop imagery is the
specific risk** — it could be read as evidence of manufacturing, which is explicitly
unverified. **Never caption it as "our factory."**

---

## Sequencing by value per unit of cost

1. **Product photography + product data** — nothing ships without it
2. **Structured size and fit data** — cheap, fixes a probable WCAG failure, and is the most
   damaging current gap
3. **Material macro set** — one day's work, carries the premium thesis
4. **Warehouse photography** — makes the best idea in the corpus legible
5. **Craft / vertical integration** — the strongest untold story
6. **Garment motion clips**
7. **Campaign film** — last

**Steps 1–5 need no film crew and no 3D. The site can look like a fashion house before a
single second of video exists.**
