# LB — Application Media & Experience Authority

Route-by-route audit of the **entire App Router**, not the homepage alone.

Sources of authority, in order: verified brand truth → this project's constitution
→ Stitch V3 (platform) → V3.1 (cinematic/mobile supplement) → the running
application (functionality and security). Owner-approved media is the only
authority for **product truth**.

**Permitted rendering sources:** owner-approved media · properly licensed stock ·
generated campaign media (D-09 + owner approval) · Blender-produced media.
**Nothing else.** A generated garment presented as an L&B SKU is never permitted,
in any placement, at any blur.

External apparel sites may be studied for interaction pattern, art direction,
pacing, navigation, layout, media treatment and mobile behaviour — **never** for
photographs, video, logos, copy, source or distinctive branded compositions.

---

## 1. Current inventory

| Fact | Value |
| :--- | :--- |
| Routes in App Router | 13 page routes + `error` + `not-found` |
| Owner-approved assets | 31 (`ownerApproval: 'approved'`), 27 published, 4 withheld with recorded reasons |
| **Assets flagged `needsHigherResolution`** | **18 of 31** |
| Source resolution | **360 × 540** — soft at editorial scale |
| Verified categories in fixtures | `women`, `girls`, `accessories` |
| Buyer states | `pending` · `approved` · `rejected` · `suspended` |
| `loading.tsx` files | **0, and by rule** — a streamed fallback is unreachable without JavaScript |
| Video elements shipped | 0, by design and by structural test |
| Blender media delivered | Buckle ignition, 2 formats × 2 codecs, + posters |

**The single highest-leverage fact:** 360 px sources cap the perceived quality of
every surface below. No render, no grade and no layout fixes it. It is a re-shoot.

## 2. Route-by-route map

Legend — **Src**: `O` owner-approved · `B` Blender · `G` generated (D-09) ·
`S` licensed stock · `P` honest placeholder. **Pri**: P1 ship-blocking ·
P2 quality · P3 enhancement.

### Public commerce

| Route | Gap | Required asset | Src | Desktop | Mobile | Reduced motion | Pri |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` homepage | Hero slot is poster-only and the poster does not exist | `lb-hero-poster-{desktop,mobile}.webp`; later the 10 s film | B → G | Ignition plays once, ≤ 5 s, no pause owed | Portrait poster art-directed, not a crop | Poster only, no `<video>` rendered | **P1** |
| `/` contact sheet band | Uses 360 px product shots at editorial scale | Re-shot catalogue at ≥ 1600 px long edge | O | 3-up sheet | 1-up scroll | Static, no reveal | **P1** |
| `/` thread-to-trade | Two honest abstract swatches stand in for material truth | One-day macro shoot: denim twill, buck-stitch, pearl snap, turquoise, silver | O | Macro pair | Stacked | Static | P2 |
| `/new-arrivals` | No editorial header image | Drop-hero still | O | Full-bleed still | 4:5 crop | Identical | P2 |
| `/shop/women` | Category header absent | Category hero | O | Hero + grid | Grid-first | Identical | P2 |
| `/shop/girls` | **Products on placeholders** | Girls product photography | O | Grid | Grid | Identical | **P1** |
| `/shop/accessories` | **Products on placeholders** | Accessories & Home photography (D-05) | O | Grid | Grid | Identical | **P1** |
| `/shop/[category]` generic | Empty-state has no art | Abstract plate, never merchandise | B/G | Centred plate + copy | Same | Static | P3 |
| `/product/[slug]` public PDP | Single 360 px image; no alternate angles, no detail macros | 4–6 shots per SKU at ≥ 1600 px | O | Gallery + zoom | Swipe gallery | No auto-advance | **P1** |
| `/trade/product/[slug]` authorised PDP | Same as above, plus no pack-breakdown visual | Same photography + a structural pack diagram | O + code | Gallery + pack table | Stacked | Identical | **P1** |
| `/size-and-fit/[category]` | — | **Already correct: structured text, not a JPEG.** Do not regress | — | Table | Scrollable table | Identical | — |

### Wholesale and authorisation

| Route | Gap | Required asset | Src | Desktop | Mobile | Reduced motion | Pri |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/wholesale` | Hero is typographic only | Showroom or market-booth still — **does not exist** | O | Still hero; buckle macro acceptable interim | 4:5 | Static | P2 |
| `/wholesale/apply` | No supporting imagery; correct — a form does not need art | Optional buckle macro as quiet anchor | B | Quiet macro | Omit | Static | P3 |
| `/sign-in` | Same | Same | B | Quiet macro | Omit | Static | P3 |
| `/trade` buyer account | No state art for `pending`/`rejected`/`suspended` | Abstract plates; **never a garment** | B/G | Plate + copy + action | Copy-first | Static | P2 |
| `/trade` passport | Scope unresolved (D-17) | Deferred | — | — | — | — | Blocked |
| `/trade/order` builder | Line items show 360 px thumbs | Re-shot catalogue | O | Table + thumbs | Card list | Identical | P2 |
| `/trade/orders` history | Empty state unillustrated | Abstract plate | B | Plate + copy | Copy-first | Static | P3 |
| `/trade/orders/[id]` | Reorder action has no visual affordance beyond text | None — text is correct here | — | — | — | — | — |

### System states

| State | Current | Required | Src | Pri |
| :--- | :--- | :--- | :--- | :--- |
| **Loading** | **No `loading.tsx` anywhere**, and none may be added | **Nothing.** Measured: a streamed fallback is what a no-JS visitor keeps, with the content parked in `<div hidden>`. CI Test 1B blocks it. [LB_LOADING_STATES.md](LB_LOADING_STATES.md) | — | **Closed** |
| Empty | Text-only | Abstract plate + one action | B/G | P3 |
| `error.tsx` | Exists, text-only | Keep text-first; add a quiet plate | B | P3 |
| `not-found.tsx` | Exists, text-only | Same, plus a route back to shop | B | P3 |
| Unauthenticated | Correct — restricted data is **absent, not hidden** | No media | — | — |
| Reduced motion | Honoured by the CSS/SVG system | Must remain honoured inside every new media slot: **poster only, no `<video>` rendered** | — | **P1** |
| Mobile | Responsive, tested | Art-direct portrait via `<picture>`; a centre crop of a landscape frame is not an art direction | O/B | P2 |

## 3. Rules this map enforces

1. **Do not replace honest placeholders with unrelated merchandise.** A
   placeholder that says "photography pending" is more honest than a stock
   photograph of someone else's garment.
2. **Never generate or borrow a garment and present it as an L&B SKU.**
3. **No facility imagery.** No mill, factory, warehouse or workshop — "Made in
   Texas" is not evidenced (OQ-04) and named mills contradict verified vertical
   integration.
4. **No invented people**, including in campaign plates.
5. **Restricted pricing never enters an image**, alt text, filename or caption.
   The permission boundary is a media rule as well as a data rule.
6. **Every asset carries a manifest entry** with provenance, SHA-256, dimensions,
   renditions and `ownerApproval`. Supply is not publication.

## 4. Implementation order

**P1, in sequence:** hero poster from the delivered Blender master → owner
re-shoot at editorial resolution → Girls and Accessories photography → PDP
galleries.

**P2:** category headers, wholesale hero, order-builder thumbs, buyer-state
plates, portrait art direction.

**P3:** empty/error/not-found plates, quiet macros on form routes.

`loading.tsx` is first because it is the only P1 item that needs **no owner asset
and no licensing decision** — it is pure code, it protects a contractual CLS
budget, and it currently does not exist on any route.

## 5. Genuinely blocked

| Item | Blocked on |
| :--- | :--- |
| Girls + Accessories product photography | Owner supply |
| Catalogue re-shoot at ≥ 1600 px | Owner supply — **18 of 31 assets flagged** |
| Material macro shoot | Owner supply (one day; highest value per hour in the plan) |
| Boutique / partnership imagery | Owner supply — none exists |
| Any generated plate | **D-09** licensing decision |
| Category routing and Plus structure | **D-04 / D-03 / D-05** |
| Passport scope | **D-17** |
