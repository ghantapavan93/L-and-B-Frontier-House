# LB Frontier House — App-Wide Experience Map

Read from the App Router directly: 13 page routes, 2 root boundaries, 4 buyer
states, 3 verified categories. Authority is
[`LB_FINAL_VISUAL_AUTHORITY.md`](LB_FINAL_VISUAL_AUTHORITY.md).

**Status key** — `SHIPPED` landed and tested · `PASS` improved in this pass ·
`MEDIA` blocked on owner supply · `GATED` blocked on an owner decision.

---

## Public shopping

### `/` Homepage `SHIPPED`
User goal: understand who this is, then reach product in one action.
V3 F1/F6 · V3.1 F3/12A/8B/8C. Ignition (buckle proof, luminous monogram draw,
ghost statement, three poster-first actions), Thread-to-Trade with scroll-drawn
spine, contact-sheet `:target` stories, Four Worlds with mobile depth carousel.
Reduced motion: everything pre-drawn, content identical.
**Gap: the hero film does not exist** — `HeroMedia` renders the poster path and
ships zero video. `MEDIA`
*Acceptance:* one-action exit to shop from every cinematic surface; no `<video>`;
0 KB added JS.

### `/new-arrivals` — the drop `PASS`
Goal: see what landed today. Reference principle: *sell the buying calendar.*
Was: heading + grid. Now: editorial opening, then grid; verified market dates
available as commerce context rather than a footnote.
Mobile: grid-first, single column below 480px. `MEDIA` drop-hero photography.

### `/shop/[category]` — Women · Girls · Accessories `PASS`
Goal: narrow a category to a shortlist without losing the thread.
V3 F5 · AJIO principle (*editorial opening before the grid*) · Myntra principle
(*filter state visible, countable, clearable*).
Was: breadcrumb, h1, lede, banner, facets + grid — correct but the facet rail
gave no sense of applied state. Now: applied-count and clear-all are explicit;
all state stays in the URL and server-rendered.
**Girls and Accessories products sit on honest placeholders.** `MEDIA`
Mobile: rail collapses above the grid, never a modal that traps focus.

### `/product/[slug]` — public PDP `SHIPPED`
Goal: judge a garment truthfully. V3 F8 Garment Portal.
Editorial arrival band, gallery, Product Anatomy as a semantic list of the
product's *own* attributes, size range as **structured text — never a JPEG**,
related frames, return to the sheet.
**No price. No price panel outline.** Restricted data is absent, not hidden.
`MEDIA` 4–6 shots per SKU at ≥1600px; sources are 360×540.

### `/size-and-fit/[category]` `SHIPPED`
Already correct and a genuine differentiator: structured text, not an image of a
table. **Do not regress this.**

---

## Wholesale and buyer world

### `/wholesale` `SHIPPED` + `PASS`
Goal: decide whether to apply. Reference principle: *state terms above the login.*
Visual opening, partnership statement, four-step approval journey, Virtual Rack
(names and availability only — no price), terms, proof band, reorder preview.
This pass promotes the verified terms — **$50 minimum · prepacks of 6 · sales tax
ID · approval typically under one business day** — to the opening claim.

### `/wholesale/apply` · `/sign-in` `PASS`
Goal: qualify, or get in. Short by design — the 25-field competitor form is the
anti-pattern. This pass gives both routes the raised-panel treatment so they read
as part of the house rather than as bare forms, and tightens the development
fixture notice so it cannot be mistaken for real account guidance.

### `/trade` — buyer account and Passport `PASS`
Four states, each of which must name itself in a heading:
`pending` · `approved` · `rejected` · `suspended`.
Goal differs per state — wait, buy, understand, resolve. V3 F10/F11.
This pass unifies them under one panel language so a denial does not look like a
different website. **Passport scope is `GATED` on D-17.**

### `/trade/order` — order builder `PASS`
Goal: reach the minimum and submit. Minimum-order progress stays visible.
Restricted values are semantic text inside a named region.
Anti-pattern to avoid: *a wholesale spreadsheet disguised as fashion.*

### `/trade/orders` · `/trade/orders/[id]` — history and reorder `PASS`
Reference principle: *reorder is the highest-value action in wholesale.* This
pass promotes reorder from a link to a first-class action.
Wide tables scroll inside their own container — verified, no page overflow.

### `/trade/product/[slug]` — authorised PDP `SHIPPED`
Adds pack breakdown, MOQ, wholesale price, Add to Order. **MSRP is `GATED`** on
owner data (C-10) — V2 had it, V3 removed it, and margin maths is the buyer's
core decision.

---

## System states

| State | Status | Behaviour |
| :--- | :--- | :--- |
| Loading | `GATED` | Route-level `loading.tsx` breaks the 307/404 contract and both h1 invariants. Skeleton primitives are built and waiting. See [`LB_LOADING_STATES.md`](../assets/LB_LOADING_STATES.md) |
| Empty | `PASS` | Named state, one action, dashed raised block — never a blank column |
| Validation | `SHIPPED` | Inline, associated with the field, error colour at 6.02 : 1 |
| Error | `PASS` | Echoes no restricted value; digest opaque; retry + home |
| Not found | `PASS` | Designed 404 with its own chrome so it survives with JS disabled |
| Media failure | `SHIPPED` | 4:5 sunken box; alt text describes the object; layout never collapses |
| Unauthenticated | `SHIPPED` | 307 to sign-in with intent preserved. **Fail closed** |
| Reduced motion | `SHIPPED` | Content and capability identical; no `<video>` rendered |
| Mobile | `PASS` | 320 / 360 / 390 / 430 verified; no horizontal overflow; no truncation |

---

## Media still missing — the actual critical path

| Item | Blocks |
| :--- | :--- |
| Catalogue re-shoot ≥1600px (**18 of 31 flagged**) | Perceived quality of every surface |
| Girls + Accessories photography | Two of three category routes |
| Material macro set (one day) | Thread-to-Trade material honesty |
| Boutique / showroom / partnership stills | Wholesale hero, brand film beat 5 |
| Hero film | The 10-second homepage experience |

None is an engineering problem. Every one is an owner-supply problem.

## Acceptance, app-wide

One house across every route · no generic template · V3/V3.1 depth visible beyond
the homepage · products truthful · wholesale pricing protected · mobile
deliberately composed · states branded and stable · no competitor media · no
generated SKU imagery · no unsupported category or service · no horizontal
overflow · no truncation · reduced motion preserves full functionality · security
and cache guarantees intact · full pipeline green.

---

## 2026-08-07 pass — the shop mechanisms, from the live-reference translation

Source: [LB_REFERENCE_TRANSLATION.md](LB_REFERENCE_TRANSLATION.md) (live L&B measured
2026-08-07). All server HTML + CSS; zero client JavaScript added; first-load JS unchanged.

| Surface | Status | What shipped |
| :--- | :--- | :--- |
| `/search` | `SHIPPED` | Real GET-form search over public fields only (name, spec, category, fabric, detail, motif, colour, fit, availability). Ranked, no-JS, noindex. Header carries a working search field on desktop and a menu entry on mobile |
| Header | `SHIPPED` | DISCOVER and TRADE as native `<details>` panels with one-line context per destination; categories stay flat links. Market dates surface from programming |
| Promo bar | `SHIPPED` | One quiet line from the programming calendar; renders only a live, verified entry; scrolls away with the page |
| Programming model | `SHIPPED` | `src/content/programming.ts` — drop / sale / lookbook / market / campaign / promo-bar entries with windows, audience, priority. Consumed by promo bar, header, `/new-arrivals`, `/search`. Unverified entries stay `draft` and render nowhere |
| Product card | `SHIPPED` | Hover/focus swap to a second image ONLY where a real one exists; Quick view trigger where the grid carries overlays |
| Quick view | `SHIPPED` | `:target` overlay per product on category, new-arrivals and search grids — media, description, sizes, availability, View product. Close returns to the card anchor. Zero JS |
| Mobile filters | `SHIPPED` | Filter & sort trigger opens the facet panel as a full-height `:target` sheet under 62rem; applying the form drops the fragment and closes it. Desktop rail unchanged |
| `/wholesale/apply` | `SHIPPED` | Four steps (store → credentials → buying profile → review) with visible progress, httpOnly draft cookie between steps, masked tax-ID review, terms confirmation. Field truth from the live registration form (customer type, referral, shows attended); the 25-field single page becomes four small screens |
| `/wholesale/apply/received` | `SHIPPED` | Designed received state: what happens next, in order, with the verified approval timing |
| House Guide | `SHIPPED` | Bottom-right `<details>` help entry — find-it links, wholesale links, verified contact. Honest: no fake AI, no invented response times |
| PDP | `PASS` | Buying column sticky on desktop; accordions and gallery unchanged |
| Footer | `PASS` | Discover column, verified contact details added |

Structural tests extended: four-step application per-step labels, search-as-GET-form,
quick-view-in-HTML. Visual baselines re-recorded 2026-08-07 after the intentional chrome
change (delete-and-rerun — update-snapshots does not re-record passing shots).

### `/mens` — the demonstration rack `SHIPPED` (2026-08-07, second pass)

Rebuilt from the honesty page into the Frontier House demonstration: ten fixture products
across Denim / Shirts / Outerwear / Accessories, built from the owner-dropped reference
photographs in `public/Men wear/` (46 unique frames, grouped by eye from a generated
contact sheet). Same live mechanics as the store — cards, hover swap where a second frame
exists, `:target` quick views with thumbnail angles, zero JavaScript.

Honesty boundary, in force:
- Demo products live in `src/fixtures/mens-demo.ts`, OUTSIDE the catalogue — no
  repository, search, facet, sitemap or product route touches them (D-03).
- No price in any form. Sizes are labelled fixture runs. Descriptions state only what the
  photographs show.
- Boots occur only inside two labelled campaign frames — footwear is not a demo category.
- Reference imagery is flagged on-page as pending replacement (D-09); several sources are
  400px thumbnails despite 2000px filenames, and the import script
  (`scripts/import-mens-demo.mjs`) never upscales.
- Page is `noindex` and absent from the sitemap.

Also fixed in this pass: the new overlay entrances (quick view, facet sheet, nav panels,
House Guide) animate **transform only** — an opacity entrance leaves content invisible for
as long as a frozen timeline keeps the animation at its first frame, which §8.7 forbids.

---

## 2026-08-07 density pass — the media the pages were starving for

The owner's verdict on the previous state was blunt: not attractive, reads as if no
photography exists. The finding on inspection: the hero and buckle films were DELIVERED
on 2026-08-03 and already wired (promo/hero band plays them); the flatness lived below
the fold — three empty "film slot" boxes, one campaign plate recycled into every grid
break, imageless category tiles, a text-only warehouse teaser.

What changed, all from assets already on disk:

| Surface | Before | Now |
| :--- | :--- | :--- |
| Campaign plates | 2 published of 112 mirrored | **28 published** — curated by eye (MATERIAL / HARDWARE / PLACE / MAKING only, §12 rules in `manifest.json` per plate), imported via `scripts/import-campaign-plates.mjs` |
| Grid breaks | Same plate every 12 products | Rotation through 8 macros |
| Homepage motion band | 3 empty labelled slots | **The Register** — cinema / land / warehouse triptych, captioned campaign imagery. Static by design: references Ken-Burns nothing, and drift would re-enter WCAG 2.2.2 |
| Category tiles + shop banners | Empty when no owner photo | Cleared material plates as fallback (denim / snap / buckle) |
| Warehouse teaser | Dark text panel | The aisle plate behind the invitation at 38% |
| Search landing | Text columns | Material strip above the starting points |
| `/mens` | Photo rack only | **The reference film** — owner-dropped 1080p footage, click-to-play (`preload="none"`, native controls, poster grabbed from frame 1.5s), fixture-captioned. Focus ring added to the player (caught by the keyboard suite) |

Weight: plates ship as AVIF/WebP srcsets; per-page cost is the few frames a viewport
actually pulls. The 4.8 MB film costs zero bytes until clicked.

Baselines re-recorded 2026-08-07 (third pass). Media requests that remain owner-supply:
garment motion clips for the register band, ≥1600px catalogue photography, category
photography (D-09 licensing decision for everything generated or reference).
