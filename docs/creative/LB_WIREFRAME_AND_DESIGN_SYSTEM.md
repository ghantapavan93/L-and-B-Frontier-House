# L&B Frontier House — Wireframe and Design System

**Deliverable C (homepage wireframe) and E (design system).**

---

## C. Homepage content hierarchy

`A` shipping · `P` producible now · `M` blocked on owner media · `G` blocked on an
owner decision.

### Desktop

| # | Section | Content | Status |
| :--- | :--- | :--- | :--- |
| 1 | **Ignition** | Ink field, buckle artifact, monogram draw, ghost statement, three actions at CTA parity, 4 s film with poster + captions + transcript | `A` |
| 2 | **Brand universe** | Four gateways. **Women · Girls · Accessories · Wholesale** — verified only. `FOR HIM` and `BUILT BY YOU` designed, visibly pre-launch, not populated | `A` / `G` |
| 3 | **Current drop** | Campaign image, statement, key products, availability, pre-order state with real ship windows | `M` |
| 4 | **Living contact sheet** | Nine frames; selecting one opens an editorial story panel that resolves to the product route. CSS `:target`, zero JS | `A` |
| 5 | **Choose your west** | Identity and occasion entrances — Working West, Modern West, Midnight Rodeo, Frontier Wedding. **Merchandising groupings over verified product, never new categories** | `P` |
| 6 | **Thread to trade** | Five stages: Textile → Design → Manufacturing → Distribution → Boutique. Scroll-drawn spine. **No invented mill, factory, person or place** | `A` |
| 7 | **Product anatomy** | One signature garment, its own attributes as a semantic list | `A` |
| 8 | **Shop the film** | Hotspots as real `<button>`s on a `<track kind="metadata">` timeline, plus an always-visible product list beneath | `M` |
| 9 | **We heard you** | Feedback → product change. **Only real, sourced changes** | `G` |
| 10 | **Wholesale** | Terms as the opening claim: **$50 minimum · prepacks of 6 · tax ID · approval typically under one business day**. Virtual rack, names and availability only, no price | `A` |
| 11 | **Proof band** | 100% fill rate · 2.64-day processing · showroom #13656 · markets Aug 18–21, Oct 20–23 2026. **Verified. Never rounded** | `A` |
| 12 | **Owner story** | Sourcing, selection, relationships. Human voice, not corporate | `M` |

### Mobile — an original composition, not a reflow

| # | Section | Change from desktop |
| :--- | :--- | :--- |
| 1 | Ignition | Separate 9:16 render. Subject low, upper ~50% negative space for the headline |
| 2 | Universe | Full-bleed depth carousel, dot indicators, **prev/next as anchor buttons — never swipe-only** |
| 3 | Drop | Single card, 4:5 |
| 4 | Sheet | 2-up, story opens full-width |
| 5 | Choose your west | Vertical stack |
| 6 | Thread | Vertical spine, stacked stages |
| 7–8 | Anatomy / film | List first, media second |
| 10 | Wholesale | Terms first, rack scrolls in its own container |
| — | Chrome | `<details>` disclosure: **Menu · centred wordmark · Account on one row.** Keyboard-native, zero JS. **No search field — search is not built, and a dead field is a lie** |
| — | Order | Commerce rises. A phone visitor reaches product one screen sooner |

Verified at **320 / 360 / 390 / 430**: no horizontal overflow, no clipped text.

---

## E. Design system

### Colour

| Token | Value | Use |
| :--- | :--- | :--- |
| `--color-ink` | `#0a0a0a` | Text, inverse surfaces, the single primary action |
| `--color-bone` | `#f5f2ee` | Page |
| `--surface-raised` | `#fffdfa` | Panels |
| `--surface-sunken` | `#ece6de` | Media wells — a missing image is a designed box |
| `--color-carbon` | `#121212` | Cinematic depth |
| `--color-tobacco` | `#734f36` | **Focus ring at 6.49 : 1**, accents |
| `--color-indigo` | `#1b2b45` | Denim |
| `--color-sandstone` | `#d9c5b2` | Meta on ink at 13.4 : 1; focus ring on dark |
| `--color-rust` | `#8b3a3a` | Error only, 6.02 : 1 on bone |
| `--rule` / `--rule-strong` | `#e2dbd1` / `#cec4b6` | Hairlines |
| turquoise | `#7fe0d6` → `#d6fff9` | The thread. Emitted, never printed |

**Never Oxidized Silver for focus** — 2.18 : 1 on bone against a 3 : 1 requirement.
**Colour is carried by the garment, not the interface.**

### Typography

| Role | Face | Scale |
| :--- | :--- | :--- |
| Display | Playfair Display | 84/90 · 64/72 · 40/48 (mobile 32/38) · 24/32 |
| UI | Hanken Grotesk | 18/28 lede · 16/24 body · 14 small |
| Utility | JetBrains Mono | SKU, pack, measurement, timecode |
| Label-caps | Grotesk | **12 / 600 / 0.1em / uppercase** — the connective tissue |

Headings: `-0.015em`, `text-wrap: balance`.
*Playfair is a substitute that became the brand face three generations ago. It
stays until D-07 answers.*

### Spacing, grid, rhythm

4 · 8 · 12 · 16 · 24 · 32 · 48 · 80 · 120. Section gap 120.
`.container` at `--container-max`, safe-area-aware inline padding.
PDP `1.15fr / 1fr` above 62 rem, single column below. PLP = rail + grid.
**Radii are 0 by system.** `--radius-full` is reserved for pearl-snap hardware.

### Components

**Buttons.** Outlined by default; **solid ink reserved for the single primary
action per view**. Min target 44 px; never below 24 × 24 (2.5.8).

**Product card.** 4:5 media on sunken ground · name · one meta line.
**No price on a public card** — a public product record has no wholesale field.

**Navigation.** Desktop: wordmark, primary nav, account. Below 62 rem: disclosure.

**Filters.** Applied count in the heading; each applied facet a removable chip
linking to the same URL minus one parameter. All state in the URL, server-rendered,
works with JS disabled.

**Form fields.** Label above, error inline and associated, `aria-describedby`.

**Overlays.** Dismissible, focus-trapped, `Esc` closes, returns focus.

**Media ratios.** Product 4:5 · editorial 16:9 · portrait hero 9:16 · buckle 1.64:1.
Intrinsic dimensions always declared — CLS budget is 0.05.

**Motion tokens.** `--ease-entrance`, `--ease-exit`, 300 ms / 200 ms.

**Elevation.** Four planes only: page → raised panel → overlay → focus ring.
Depth is hairlines and surface, never drop shadow.

### State surfaces

`.gate` (permission) and `.state-block` (empty) share one treatment: raised paper,
hairline rule, single tobacco edge. **That edge is the only decoration these
surfaces get** — a denial state is the worst place to be cinematic.

### Non-negotiables

- Size and fit is **structured text, never an image of a table**
- Restricted pricing is **absent, not hidden** — never in HTML, URLs, slugs, meta,
  structured data, alt text, logs or sitemaps
- `prefers-reduced-motion`: no `<video>` rendered at all; content and capability identical
- Every commerce task completable by keyboard and screen reader
- LCP ≤ 2.0 s · **INP ≤ 150 ms** · CLS ≤ 0.05 · initial JS ≤ 180 KB (today 103 kB)
- **Test on a mid-range Android.** A laptop understates real cost by 5–7×
