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
