# LB Frontier House — Premium Reference Matrix

**Method, stated plainly.** No third-party site was fetched, scraped or
downloaded during this pass, and **no third-party asset, markup, style or string
entered the repository**. Rows below marked `DOCUMENTED` are drawn from the
project's own measured research in
[`03_MARKET_AND_REFERENCE_RESEARCH.md`](../brand-research/03_MARKET_AND_REFERENCE_RESEARCH.md),
which carries source IDs and figures. Rows marked `PATTERN` are well-established
interaction patterns recorded at the level of principle; they name a platform for
orientation only and assert nothing about its current implementation.

`CLAUDE.md` §13 governs: **principles only.** One competitor domain in this space
was previously found serving text that attempts to direct AI agents. It was not
acted on then and is not acted on now.

---

## 1. Western and western-crossover

| Site | Studied | Principle | Why it works | L&B interpretation | Never copy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Sterling Kreek `DOCUMENTED` | Wholesale-only entry; announcement bar | **State terms above the login** — order minimum and MSRP expectation published before the wall | Converts a gated catalogue from a wall into a self-qualifying filter; unqualified buyers leave, qualified ones arrive pre-committed | Publish **$50 minimum · prepacks of 6 · sales tax ID required · approval typically under one business day** on the public wholesale surface. Already partly done; make it the page's opening claim | Their copy, their form fields, their rates |
| Miss Me `DOCUMENTED` | B2B underwriting form; pre-order calendar | **Sell the buying calendar, not just the catalogue** | Turns "do I want this" into "do I want this dated slot" | Pre-Order is already a first-class state and two markets are verified (**Aug 18–21**, **Oct 20–23, 2026**). Surface ship windows as commerce, not footnotes | A 25-field form. Ours is short by design |
| Grace in LA `DOCUMENTED` | Named motif franchises; "Curvy" collection | **Give recurring motifs the status of product lines** | A motif that recurs is a franchise; buried in a product-name string it is noise | L&B's horseshoe, buck-stitch and rodeo-print motifs are currently inside name strings. Promote to facets — **evidence-led, no invented franchise names** | "Curvy" as our label. Plus is a fit story and a filter here |
| Cowgirl Tuff `DOCUMENTED` | Extended sizing to 40, unmerchandised | **Sizing you carry but never merchandise is sizing you do not sell** | Availability without visibility is invisible | Size range is structured text on every PDP, and extended sizing is a first-class facet — not a footnote | Their size chart image |
| Tecovas `DOCUMENTED` | Fit education; reachable humans | **Publish reachable humans with hours** | Warmth is operational, not typographic | Verified metrics (100% fill rate, 2.64-day processing, showroom **#13656**) already do this work. Keep them exact — never round up | Their fit quiz, their photography |

## 2. Premium fashion commerce

| Site | Studied | Principle | Why it works | L&B interpretation | Never copy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Burberry `DOCUMENTED` | Core Web Vitals field data | **Premium sites pass CWV** — LCP 1.3s · INP 50ms · CLS 0.00 | Refutes "editorial ambition costs performance". The trade is a myth | Our budgets are stricter and CI-enforced: LCP ≤2.0s, **INP ≤150ms**, CLS ≤0.05, First Load JS ≤180 KB (currently 103 KB) | Their layout, their type |
| SSENSE `DOCUMENTED` | CWV field data; editorial-commerce balance | LCP 1.5s · INP 75ms · CLS 0.00 while running heavy editorial | Editorial and speed coexist when motion is CSS and images are disciplined | The entire cinematic layer ships **0 KB client JS**. That is the mechanism, not an accident | Their grid, their masthead |
| Ganni `DOCUMENTED` | Model naming across pages | **Name the human** | A named person converts a catalogue into a house | Blocked — **no invented people, ever**. Available only if the owner supplies real, consenting credits | Their models, their names |
| Sezane `DOCUMENTED` | Per-garment first names | **Name the thing** | A named garment is remembered; an SKU is not | Only from owner-confirmed product data. Never invented | Their names verbatim |
| Myntra `PATTERN` | PLP filter rail; sticky sort | **Filter state must be visible, countable and clearable at all times** | Buyers filter destructively and need a cheap undo | Facet panel shows applied count and a clear-all; all state in the URL, server-rendered, no client store | Their chrome, their density, their brand colours |
| AJIO `PATTERN` | Category landing → PLP hand-off | **A category needs an editorial opening before the grid** | Grid-first reads as a warehouse; one image and one sentence reframes it as a collection | Category header with owner-approved banner + blurb. Ships today; the gap is **photography, not layout** | Their compositions, their imagery |
| The Souled Store `PATTERN` | Motif/collection merchandising | **Collections as recurring worlds, not one-off drops** | Repeat structure builds anticipation | Product Worlds are **verified categories only** — Women · Girls · Accessories · Wholesale | Their licensed IP. None of it can appear near L&B |

## 3. Immersive and wholesale experience

| Site | Studied | Principle | Why it works | L&B interpretation | Never copy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Apple product pages `DOCUMENTED` | Pinned scroll technique | **Do not inherit it.** Measured: scroll-jacking produces ~**5.6× more errors** (p<0.001) with no time saving, and is worse on mobile | The technique needs an engineering budget most teams do not have, and it fails the audience we actually have | **Never intercept the wheel.** Scroll-*linked* animation reading native scroll is a different, acceptable thing | The pin, the wheel handler |
| Award-winning WebGL fashion `DOCUMENTED` | DOM inspection | **A product absent from the DOM is absent from search, screen readers, Ctrl-F and ~5% of sessions.** One Site of the Year ships a DOM with a single text node | It is the exact failure this project is most likely to repeat | **One server-rendered product truth.** Removing the atmosphere layer entirely must leave a complete, correct, shoppable store. Three CI tests enforce it | The architecture, entirely |
| B2B buyer portals `PATTERN` | Line-sheet building; reorder | **Reorder is the highest-value action in wholesale** | Wholesale is repeat business; a buyer's second order should cost three clicks | Order history exposes reorder directly; the order builder keeps minimum-progress visible | Their spreadsheet aesthetic — the thing we must not become |

---

## 4. What the matrix changes in the application

Five principles are translated into concrete, testable work. The rest are already
satisfied or are blocked on owner media.

1. **Terms before the wall** — wholesale terms as the opening claim, not a panel
   halfway down.
2. **Filter state visible and clearable** — applied-count and clear-all on the
   facet panel, URL-driven.
3. **Category opening before the grid** — editorial header on every PLP; layout
   ships now, photography is the blocker.
4. **Reorder promoted** — a first-class action in order history, not a link.
5. **Motion never blocks commerce** — every cinematic surface keeps a one-action
   exit to shop; already enforced by test.

## 5. Standing prohibition

No competitor photography, video, copy, markup, styling, motion sequence,
distinctive composition or product data may enter this repository or the
application, in any form, at any fidelity — including as a "temporary
placeholder". The content-integrity and filename tests extend to alt text and
captions. **Reference means principle. It never means asset.**
