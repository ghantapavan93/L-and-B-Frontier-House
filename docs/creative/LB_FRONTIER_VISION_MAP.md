# LB — The Frontier House Vision, Mapped to the Build

The owner's fourteen-point vision ("the West, rebuilt as software"), point by point,
against what exists, what shipped in the cinematic pass (2026-08-07), and what is
honestly gated on media or an owner decision. The governing principle held throughout:
**spectacle on top, excellent commerce underneath — and nothing fake in between.**

| # | Vision | Status | How it lives in the build |
| :--- | :--- | :--- | :--- |
| 1 | **The Door** — the House opens, three exits | `LIVE` | Buckle ignition film (delivered 2026-08-03) with poster floor, pause control, reduced-motion gate; Enter/Shop/Trade exits. The "cowboy crosses through light" beat needs owner footage — recorded as a media request |
| 2 | **The House is alive** — weekly recomposition | `LIVE (model)` | `src/content/programming.ts`: drop/sale/lookbook/market/promo entries with windows feed the promo bar, nav, drop page and search. A real CMS replaces the file at the adapter seam (OQ-15) |
| 3 | **Living Rack** — spatial merchandise wall | `LIVE` | The Warehouse: one horizontal aisle, racks at depth, hover advances, native scroll (§9 — never intercepted). Hover-to-clip waits on garment footage |
| 4 | **Every product responds** | `LIVE` | Hover → second angle (only where a real one exists); quick view over the current world; **click → the card photograph now MORPHS into the product page** (cross-document view transitions, CSS-only, reduced-motion off, unsupported browsers get a plain navigation). Longer-hover clips wait on footage |
| 5 | **Product anatomy** | `LIVE` | PDP leads with the garment; anatomy list carries only the product's own attributes, now stitched with the house thread. Hover-reframing waits on per-detail crops |
| 6 | **Fit Passport** | `SHIPPED` | `/fit-passport`: waist + cut remembered in an httpOnly cookie, on its own dynamic room only (public pages stay byte-identical — cache contract). Suggestions are arithmetic over the **published measurement charts**, shown with the chart figure they came from. Never "high confidence" — no fit model exists, so the copy never claims one |
| 7 | **Shop the film** | `MEDIA-GATED` | Needs a campaign film containing real merchandise. The mechanism exists in miniature: ignition hands off to This Week and the contact sheet; hotspot rules pre-written in CLAUDE.md §8 |
| 8 | **The thread as house code** | `SHIPPED` | The ignition's turquoise thread continues as a 1px dashed stitch: under every section eyebrow, along anatomy entries, under the application's progress line, atop the House Guide. Decorative only — the accent palette remains D-07, so the thread never becomes text or a focus ring |
| 9 | **Trade transforms the same site** | `LIVE` | Same photograph, same world; the authorised session adds WHSL/MSRP/prepack/stock/Add-to-order server-side. Absent-not-hidden throughout |
| 10 | **Build a Rack** | `LIVE` | Assortment builder plans a rack to budget/mix and prices it (units, wholesale, blended margin); lands in the editable draft order. Drag-and-drop deliberately declined: 2.5.7 requires a single-pointer path anyway, and the planner IS that path |
| 11 | **Trade application as house account** | `LIVE` | Four steps, draft cookie autosave, why-we-ask hints, masked review, "private buying room" welcome, received-state timeline |
| 12 | **House Guide → Ask the House** | `SHIPPED (honest)` | Now opens with three plain-language asks that are real searches ("dark bootcut", "what's on pre-order?") plus Fit Passport. Becomes an assistant only when a real one exists — never a fake AI |
| 13 | **Drop Engine** | `LIVE (model)` | A programming entry already surfaces in promo bar, nav, drop page title/statement and search. Auto-generated collection landings and trade announcements are the next slice of the same model |
| 14 | **Physical store / QR / NFC** | `ROADMAP` | Operations + hardware; recorded here so it is planned for, not improvised. The Passport (buyer + fit) is the account spine it would attach to |

## The depth pass that rode along

- **Scroll-driven arrival and parallax** on the register triptych and editorial figures —
  native-scroll `view()` timelines inside `@supports`, transform-only, absent under
  reduced motion, static-complete without support. Exactly the §9 enhancement pattern.
- **View transitions** make every product click "reveal another layer of the House rather
  than navigating to another webpage" — the owner's stated principle — at zero JavaScript.

## What "five years ahead" is still gated on

1. **Photography ≥1600px, second angles, garment clips** — every responsive mechanism is
   built and lights up per-asset as media arrives (D-09 for anything not owner-shot).
2. **Owner decisions** — D-07 (accent palette: the stitch stays decorative until then),
   D-03/D-04 (taxonomy), D-01 (consumer commerce), OQ-15 (commerce platform / CMS).
3. **A real assistant** behind Ask the House, if ever — honesty first until then.

## The motion-stack rule, rewritten (2026-08-08, owner-directed)

The owner overrode the CSS-only stance: Framer Motion is now installed and approved for
**scoped islands** where springs on live input earn the bytes. First two islands:

- **DepthField** (This Week band): pointer position through springs, published as
  `--depth-x/--depth-y`; the five frames separate into planes under the cursor.
- **AisleDepth** (the Warehouse): native scroll progress through a spring as
  `--aisle-drift`; the camera dollies and the rack signs counter-drift.

The contract every island keeps: server children untouched, vars zero by default (no-JS
renders pixel-identical), transform-only spends, `LazyMotion`+`m` strict for tree-shaken
weight, reduced motion zeroes the field, wheel never intercepted, 180 KB budget holds.
