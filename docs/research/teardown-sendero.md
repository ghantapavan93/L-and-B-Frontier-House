# Front-end teardown — Sendero Provisions Co.

**Target:** `https://senderopc.com`
**Measured:** 2026-08-13, live in-browser (computed styles, resource timing, theme
source), desktop 1440 × 900 and mobile 375 × 812.
**Focus:** fast discovery and Quick Shop — how they shorten browse → buy.
**Status:** `MEASURED`. Every number below was read from the running page or the
shipped stylesheet/JS, not inferred from screenshots.

**Scope note.** Mechanisms and principles only. No layout, copy, imagery, code or
brand identity is reproduced here. Class names and CSS declarations are quoted only
where the exact mechanism is the finding.

**Agent-directed content:** none found. No `robots.txt` directive, page text or DOM
attribute on this domain attempted to address an automated agent.

**Consent:** the cookie bar offers only *More info* and *Accept* — consent is
asserted by continued browsing. There is no reject control, so the most
privacy-preserving action was to leave it unaccepted. It is a 64 px bottom bar and
does not block scroll or interaction.

---

## 0. Verdict in one paragraph

Sendero runs a heavily customised **Kalles 2.0** Shopify theme (`kalles_2-0`,
`nt_*` prefixes, The4/Nitro family) with one genuinely bespoke component bolted on:
a custom element `<x-product-card>` driven by a **37,247-byte** script,
`combined-listing.js`. That one file is the whole fast-discovery story. It turns
every product card into a buying surface: hover reveals a control, one click opens
a size row **inside the card image**, and clicking a size **adds to cart
immediately** — two clicks, zero navigations, no modal, no drawer. It is the best
mouse-driven grid-to-cart path in the western apparel set. It is also, measurably,
unusable by keyboard, invisible to screen readers at the point of size selection,
and it renders sold-out sizes identically to available ones. The mechanism is worth
taking. The implementation is not.

---

## 1. QUICK SHOP — the deepest finding

### 1.1 The three card states

The card branches on `data-option-count`, set server-side per product.

| Options | Hover reveals | Clicks to cart | Works with JS off |
| :--- | :--- | :--- | :--- |
| **1** (colour only — hats, accessories) | **ADD TO CART** button | **1** | **Yes** |
| **2** (colour + size — apparel) | **QUICK SHOP** button | **2** | No |
| any | colour swatches (always visible, below price) | — | n/a |

On `/collections/real-western` the split was **20 single-option cards to 18
two-option cards** — more than half the page is one click from the cart.

The single-option button is the interesting one:

```html
<button type="submit" name="add" form="form-atc-9339272724699-48750…"
        data-add-to-cart-label="Add to cart" data-sold-out-label="Sold out">
```

`type="submit"` plus the HTML **`form` attribute** associating it with a
`<form method="post" action="/cart/add">` elsewhere in the card. That is a real
form submission — it would add to cart with JavaScript disabled. The two-option
path has no submit button anywhere in the card, so it is JS-only.

### 1.2 Trigger and reveal — measured

The QUICK SHOP button is present in the HTML at all times and revealed by CSS
hover only:

```css
x-product-card button[data-quick-shop-trigger]{
  opacity:0; transform:translateY(5px); position:absolute; right:4%; bottom:4%;
  font-size:12px; padding:9px 14px; z-index:3;
  transition:opacity 150ms ease-in-out, transform; pointer-events:none }
x-product-card :is(.product-image:hover) button[data-quick-shop-trigger]{
  opacity:1; transform:translateY(0); pointer-events:auto }
```

- Button box **85 × 32 px**, bottom-right of the image, black on white, Oswald 12 px
  uppercase, square corners.
- Reveal transition **150 ms**, translateY 5 px.
- The reveal selector contains **`:hover` only — no `:focus`, no `:focus-within`.**

### 1.3 What appears — an in-card strip, not a modal or drawer

Clicking QUICK SHOP does not open anything. It sets an attribute on the card:

```js
if (this._quickShopTriggerBtn && target == this._quickShopTriggerBtn) {
  this.setAttribute("data-overlay-options-visible","true");
  this.addEventListener("mouseleave",
    () => this.setAttribute("data-overlay-options-visible","false"),
    {once:true, signal:this._ac.signal});
  return;
}
```

CSS then reveals a strip already sitting at the bottom of the image:

```css
.product-card-image-overlay{
  position:absolute; right:0; bottom:0; left:0; z-index:3;
  display:grid; gap:10px; padding:8px;
  background-color:var(--xpcv-overlay-bg-color);   /* #fafafa */
  opacity:0; visibility:hidden; transform:translateY(10px);
  transition:opacity .2s, transform .2s, visibility .2s }
.product-card-image-overlay:empty{ display:none !important }

x-product-card:is([data-overlay-options-visible="true"])
  :is(.product-image:hover, .product-image:focus-within)
  :is(.product-card-image-overlay, .product-card-image-actions){
  opacity:1; visibility:visible; transform:translateY(0); pointer-events:auto }
```

Measured geometry, desktop, 302 px card image:

| Property | Value |
| :--- | :--- |
| Overlay strip | **302 × 44 px**, flush to image bottom, `#fafafa` |
| Reveal transition | **200 ms** opacity + transform + visibility |
| Size buttons | **30 × 24 px** each, 34.7 px pitch, ~5 px gap |
| Size button style | white fill, **0.8 px solid #000**, Oswald 12 px, padding 0 |
| Row content | 7 sizes: XS S M L XL 2XL 3XL, spanning 238 px of 302 px |
| Mobile (375 px) | strip **165 × 81 px**, buttons **30–38 × 30 px**, wraps to 2 rows |

Two nice touches. The overlay **suppresses the trigger** it came from
(`x-product-card[data-overlay-options-visible="true"] button[data-quick-shop-trigger]
{opacity:0 !important}`), so the two controls never collide. And
`.product-card-option-group[data-rendered-swatches-count="1"]{display:none}` hides
a picker that would offer exactly one choice.

### 1.4 Selecting a size adds to cart immediately

This is the whole trick, and it is one expression:

```js
event.isTrusted && optionTerminal && this._currentVariant?.available
  && this._submitCurrentVariant()
```

Three guards: a real user gesture (`isTrusted`), the **last** option
(`data-option-terminal="true"` — colour swatches do not carry it, size buttons do),
and stock. There is no confirm step and no second button. The add is:

```js
fetch(`${root}/cart/add.js`, {method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({items:[{id:variantId,quantity:1}], sections:"cart_js"})})
```

One request, quantity fixed at 1, and `sections:"cart_js"` uses Shopify's Section
Rendering API so the re-rendered mini-cart comes back **in the same round trip**.

The `isTrusted` guard exists because the component calls `.click()` on its own
selected swatch during mount to warm the hover image — without the guard, every card
would add itself to the cart on page load. Worth remembering if we build anything
similar.

### 1.5 Out-of-stock sizes — the real defect

Sold-out sizes get exactly one declaration:

```css
.product-card-image-overlay .product-card-option-group[data-is-last-option="true"]
  button.swatch__value:is([disabled], .is-soldout){ pointer-events:none }
```

Measured on a live sold-out button (`/collections/mens`, **27 of them on one page**):

| Property | Sold-out button | Available button |
| :--- | :--- | :--- |
| colour | `rgb(0,0,0)` | `rgb(0,0,0)` |
| background | `rgb(255,255,255)` | `rgb(255,255,255)` |
| border | `0.8px solid rgb(0,0,0)` | same |
| opacity | `1` | `1` |
| text-decoration | `none` | `none` |
| `::before` / `::after` content | `none` / `none` | `none` / `none` |
| `disabled` attribute | **absent** | absent |
| `aria-disabled` | **absent** | absent |
| pointer-events | `none` | `auto` |

**A sold-out size is pixel-identical to an available one and simply does nothing
when clicked.** No strike-through, no dimming, no announcement. The Kalles theme
ships a diagonal sold-out marker for its *own* PDP swatches
(`.nt_soldout … ::before{background-image:url(sold_out.png)}`); the bespoke card
component never inherited it.

They partly compensate upstream: **every category link in the navigation carries
`?filter.v.availability=1`**, and collection URLs redirect to it. You are rarely
shown a fully sold-out product. But an in-stock product with three dead sizes is
extremely common, and those three sizes look buyable.

### 1.6 Keyboard access — nominally present, actually unusable

The reveal rule *does* include `:focus-within`. I traced whether it can ever fire.

Tab order inside one card, DOM order, with computed visibility at each stop:

| # | Element | `visibility` | `opacity` | Reachable | Visible when focused |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | image link | visible | 1 | yes | yes |
| 2 | size scroll ‹ | hidden | 0 | **no** | — |
| 3–9 | size buttons XS…3XL | **hidden** | 1 | **no** | — |
| 10 | size scroll › | hidden | 0 | **no** | — |
| 11 | **QUICK SHOP** | visible | **0** | yes | **no** |
| 12 | product title link | visible | 1 | yes | yes |
| 13 | colour scroll ‹ | visible | **0** | yes | **no** |
| 14–15 | colour swatches | visible | 1 | yes | yes |
| 16 | colour scroll › | visible | **0** | yes | **no** |

The size buttons sit inside a `visibility:hidden` container, so they are not
focusable, so `:focus-within` can never be satisfied *from them*. The only way in is
the invisible QUICK SHOP button at stop 11. Verified empirically, waiting out the
200 ms transition:

- Focus QUICK SHOP → overlay stays closed (`opacity 0`, `visibility hidden`).
  The focused control is at `opacity: 0`.
- Activate it → `data-overlay-options-visible="true"`, and because the button is
  focused, `:focus-within` is now true → **overlay opens** (`opacity 1`).
- Size buttons become focusable — but they are at DOM indices 2–8, **before** the
  trigger at index 10. Forward-Tab exits `.product-image` entirely, `:focus-within`
  goes false, and **the overlay collapses**. You must Shift-Tab backwards into it.
- Focus indicator on a size button: `outline-style: none`, `outline-width: 0`,
  `box-shadow: none`. There is a global `button:focus{outline:0; box-shadow:none}`.

So the sequence is: tab to an invisible button, activate it blind, reverse-tab into
a panel, and select a size with no focus indicator at any point. Technically
complete; practically not a path.

Page-wide count on `/collections/real-western` (38 cards): **743 tab stops, 93 of
them focusable at `opacity: 0`** — 74 swatch-scroll arrows, 18 quick-shop triggers,
1 other.

### 1.7 Touch

Capability detection, not UA sniffing — `IS_NON_TOUCH_DEVICE =
matchMedia("(hover: hover) and (pointer: fine)").matches`. Verified false at the
mobile preset (`hover: none`, `pointer: coarse`, `maxTouchPoints: 5`).

On touch the first tap on the card image is intercepted and opens the size overlay
instead of navigating:

```js
!this._hasHover && this._hasOverlayUi && link && this.contains(link)
  && !this.classList.contains("is-overlay-active")
  && (event.preventDefault(), this._showOverlay());
```

A capture-phase `document` click listener handles outside-dismiss. Enter/leave state
is driven by `["mouseenter","touchstart","focusin"]` /
`["mouseleave","touchend","blur"]` setting `data-in-focus`.

Net effect on phone: **tap card → size row → tap size → in cart. Two taps, no
navigation.** The cost is that the obvious gesture — tap the photo to see the
product — no longer does that on the first try.

### 1.8 Interaction cost, measured

| Path | Clicks | Full page loads | Notes |
| :--- | :--- | :--- | :--- |
| Quick Shop, 2-option product | **2** | **0** | hover → QUICK SHOP → size |
| Quick Shop, 1-option product | **1** | **0** | hover → ADD TO CART |
| Colour change before buying | +1 | 0 | re-fetches the card fragment |
| Via PDP | **3** | **2** | card → size → add → back |

Quick Shop saves one click and **two full navigations** per item. Across a
multi-item basket that is the entire difference between browsing and shopping.

### 1.9 The colour swatch is a product switch, not a variant switch

27 of 29 homepage cards carry `data-is-combined-product="true"`. Each colourway is a
**separate Shopify product**, stitched into one card. Colour swatches carry
`data-product-url`; size buttons carry `data-option-terminal="true"` and no URL.
Choosing a colour re-fetches a server-rendered card fragment:

```
GET /products/<handle>?view=card-sync&option_values=<id>,<id>
```

An alternate Liquid template that renders **only the card**. No client-side
templating, no JSON-to-DOM. That is a genuinely good architectural pattern and it is
reachable from a server-first stack.

The cost is measurable: the component calls `.click()` on its selected swatch at
mount to warm the hover image, so **every combined card fires one `card-sync`
request on page load**. On the PDP's 10-card Best Sellers row that was **10 extra
requests, 28.2 KB, averaging 263 ms each**.

---

## 2. Collection naming and merchandising

Sendero separates **utility** and **romance** into different nav slots so neither
compromises the other. Four naming layers coexist:

| Layer | Where | Contents |
| :--- | :--- | :--- |
| Seasonal campaign | nav slot **1**, coloured `#E9DC13` | one named campaign → a **page**, not a collection |
| Utility taxonomy | nav slots 2–4 | Men's / Women's / Accessories, plain sub-links (Hats, Shirts, Pants…) |
| **Named creative collections** | nav slot **5** — its own top-level "Collections" | 6 named worlds |
| Editorial series | under Company | a named content series |

The six creative collections are named, not descriptive — they read as themes rather
than as categories, and they cut *across* the utility taxonomy (a named collection
mixes hats, tees and shirts). Sub-menu structure per mega-menu:
`type_mn_html` (an image/promo block) + `type_mn_link` columns + **`type_mn_pr`
product columns** — live product cards inside the navigation, lazy-loaded on hover
(`lazy_menu unlazy_menu_mega`). Even the sale collection gets a branded name in its
mega-menu header rather than the word "Sale".

**Structural difference between the two kinds of collection page** (measured):

| | `/collections/mens` (utility) | named creative collection |
| :--- | :--- | :--- |
| Grid starts at | **y = 2233 px** | **y = 614 px** |
| Blocks before the grid | banner + 4-product row + 3-tile block | banner only |
| Faceted filter | **disabled** (`opacity:0; pointer-events:none`) | **enabled** |
| Products | 314 total, 36 per page | 114 total, 40 per page |
| Pagination | **Load More** button | Load More button |

Utility pages get merchandising, named pages get straight to product. Filters are
configured per collection.

---

## 3. Header and navigation

| Property | Value |
| :--- | :--- |
| Total header height at rest | **171 px** |
| Announcement bar | **49 px**, black ground, full width |
| Main row | **122 px** |
| Logo | 228 × 102 px (390 × 106 natural) |
| Nav item height | 92 px; 7 top-level items |
| Nav type | Oswald 15 px / 500 / `letter-spacing: 1.2px` / uppercase |
| Position at rest | `absolute`, `z-index: 390`, transparent — **overlays the hero** |
| Mega-menu | full-bleed 1440 px, height **281–364 px** by menu |
| Mega-menu columns | 3 × 348 px, or html-block + 2 link columns + 2 product columns |
| Sticky | body `sticky_true`; header gains **`live_stuck`** past its own height |
| Stuck state | outer header collapses to `height: 0`; a **compact sticky logo** swaps in at 75 px (from `display:none`) |
| Announcement in stuck state | **dropped** — only the main row pins |
| Mobile header | 143 px, `position: relative` |

The nav does merchandising work: **every category link carries
`?filter.v.availability=1`**, so navigation never lands you on sold-out stock.

---

## 4. Typography

Two families. **Oswald** (condensed sans) carries every display and UI role;
**Kameron** (slab serif) carries body, price and controls. Loaded weights: Oswald
300, Kameron 400/500.

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Section heading (primary) | Oswald | **40 px** | 500 | 48 px | 0.1 px | upper |
| Section heading (secondary) | Oswald | 32 px | 500 | 38.4 px | 0.1 px | upper |
| Nav link | Oswald | 15 px | 500 | 15 px | **1.2 px** | upper |
| Product title | Oswald | **14 px** | 500 | 16.8 px | 0.1 px | upper |
| Product subtitle (colourway) | Oswald | 12.6 px | 500 | 15.12 px | 0.1 px | upper |
| **Price** | Kameron | **20 px** | 400 | 32 px | normal | — |
| Body | Kameron | **18 px** | 400 | 28.8 px (1.6) | normal | — |
| Size button | Oswald | 12 px | 400 | 12 px | normal | upper |
| Card CTA | Oswald | 12 px | 400 | 12 px | normal | upper |
| PDP Add to cart | Oswald | 14 px | — | — | normal | upper |
| Load More | Oswald | 14 px | **600** | 22.4 px | normal | upper |
| Sort / filter control | Kameron | 18 px | 400 | 28.8 px | normal | — |

**No `h1` on collection pages.** The collection name renders as `h2`.

The load-bearing observation: **the price (20 px) is larger than the product title
(14 px).** On the card the hierarchy is photograph → price → name. That is a
deliberate merchandising decision and it is the opposite of what a fashion-house
template usually does.

Six icon fonts are loaded (Font Awesome 5 Brands/Free ×2, Font Awesome 6
Brands/Free, `iconKalles`, `fakalles`, `Pe-icon-7-stroke`) plus a decorative script
face. That is theme residue, not design.

---

## 5. Colour

The interface is achromatic. All colour comes from the photography and one accent.

| Token | Value | Use |
| :--- | :--- | :--- |
| Page ground | `#FFFFFF` | everywhere |
| Body text | `rgb(135,135,135)` | paragraphs, footer |
| Headings / product titles | `#000000` | — |
| Price | `rgb(105,105,105)` | — |
| Announcement ground | `#000000` | — |
| Accent (campaign nav item) | `rgb(233,220,19)` | **one nav item only** |
| Primary button | `#000000` fill / white text | card CTA |
| PDP Add to cart | `rgb(34,34,34)` fill / white text | — |
| Footer ground | `rgb(246,246,248)` | — |
| Quick-shop overlay | `#FAFAFA` | `--xpcv-overlay-bg-color` |
| Out-of-stock badge | `#AAAAAA` fill / `#FFF` text | `--xpcv-out-of-stock-*` |

The card component ships its own scoped token set on `x-product-card` — a good
pattern:

```
--xpcv-swatch-size: 24px  (20px when the row is crowded)
--xpcv-color-swatch-gap: 8px  (6px crowded)
--xpcv-overlay-bg-color: #fafafa
--xpcv-scroll-button-size: 28px
--xpcv-out-of-stock-bg-color: #aaaaaa
```

**Computed contrast ratios:**

| Pair | Ratio | AA normal text (4.5:1) |
| :--- | :--- | :--- |
| Body text `#878787` on white | **3.59 : 1** | **FAIL** |
| Out-of-stock badge white on `#AAA` | **2.32 : 1** | **FAIL** |
| Price `#696969` on white | 5.49 : 1 | pass |
| Headings `#000` on white | 21 : 1 | pass |
| Accent yellow on black | 14.71 : 1 | pass |
| Add to cart white on `#222` | 15.91 : 1 | pass |
| Quick-shop overlay vs page ground | **1.04 : 1** | n/a — the strip only reads because it sits on a photograph |

---

## 6. Homepage — section order and rhythm

Desktop 1440 × 900, total document **4,720 px** (≈ 5.2 screens).

| # | y | Height | Section | Carried by |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 0 | 595 | Hero | one 1539 × 641 JPEG, headline + one CTA |
| 2 | **605** | 543 | New T-shirts | **4 product cards** + "Shop all" |
| 3 | 1119 | 1114 | Shop by category | 8 image tiles |
| 4 | 2232 | 575 | New arrivals | **21 product cards** (carousel) |
| 5 | 2808 | 600 | Editorial / music session | 1 YouTube embed |
| 6 | 3418 | 547 | Men's shirts | **4 product cards** |
| 7 | 4029 | 369 | Returns & exchanges | — |
| 8 | 4398 | 261 | Support | — |
| 9 | 4659 | 61 | Legal | — |

**The first buyable product sits at y = 605 — above the fold on a 900 px viewport.**
The hero is 595 px, not a full-viewport takeover. 29 product cards on the homepage;
six content sections; **zero native `<video>`**, one YouTube iframe.

Imagery treatment: product photography is **1:1 square** (`padding-top: 100%`),
which is worth noting against the earlier reference set — Sézane, Double D Ranch and
GANNI all run 2:3–4:5 portrait. Sendero's is a flatter, more catalogue-like frame,
and it lets four cards fit a row comfortably at 302 px.

**Rhythm:** section heights cluster at 543–600 px with one 1114 px double-height
category block as the pause. Gaps between sections are ~10 px — the sections carry
their own internal padding rather than a global stack gap.

---

## 7. PLP anatomy

| Property | Desktop 1440 | Mobile 375 |
| :--- | :--- | :--- |
| Columns | **4** (`col-xl-3 col-md-3`) | **2** (`col-6`) |
| Grid mechanism | Bootstrap-style `display:flex; flex-wrap:wrap` — **not CSS Grid** | same |
| Card outer width | 356 px | 180 px |
| Image box | **328 × 328** (1:1) | **166 × 166** |
| Per page | 36–40 | same |
| Pagination | **Load More** button (`You've viewed 36 of 314 products`) | same |

**Card anatomy**, top to bottom:

1. `.product-image` — square, `overflow:hidden`
   - main image (CSS background)
   - `.hover_img` — second image, `opacity:0 → 1` on card hover, `pointer-events:none`
   - `.product-card-image-overlay` — the size strip (hidden)
   - `[data-quick-shop-trigger]` — the CTA (hidden)
   - `.banner--out-of-stock` — top-right badge, `display:none` unless `data-available="false"`
2. `.product-title` — name + colourway subtitle (Oswald 14/12.6 px)
3. `.product-price` — Kameron 20 px
4. colour swatch strip — horizontally scrollable, always visible
5. `<form action="/cart/add">` — hidden, no submit button on 2-option cards
6. `<script class="pr-variant-data">` — **the full variant matrix as inline JSON**

**Hover image swap:** `transition: opacity .5s, transform 2s
cubic-bezier(0,0,.44,1.18)`. The optional `hover_img2` variant adds `scale(1.09)`.
Half a second is slow for a hover swap.

**Filters:** a left drawer (`data-pos="left"`, `data-class="popup_filter"`), facets
= availability + size + product type. **Disabled on `/collections/mens`**, enabled on
named collections.

**Sort:** a custom dropdown, not a `<select>`. On mobile it becomes a **fixed bottom
sheet** (375 × 455, `z-index: 5000`) — a good pattern.

**Product imagery is not `<img>`.** Across 29 homepage cards,
`document.querySelectorAll('x-product-card img').length === 0`. Every product photo
is a `background-image` on a `<div>` with the `padding-top` aspect hack. Confirmed
in the raw server HTML: **6 `<img>` tags on the whole homepage against 58
background-image divs.** Consequences: no alt text is even possible, no `srcset`,
invisible to image search, invisible to screen readers.

---

## 8. PDP anatomy

Desktop 1440 × 900, document 3,832 px.

| Element | Measurement |
| :--- | :--- |
| Layout | two columns — gallery 683 px, buying panel right |
| Gallery | Flickity carousel, 5 media, thumbnails |
| Gallery image | displayed **678 px**, served **355 px**, `sizes="355px"` — **upscaled 1.9×** |
| Gallery alt text | `alt=""` on every image |
| Add to cart | **400 × 40 px**, `rgb(34,34,34)`, Oswald 14 px uppercase, square |
| Quantity | real `<input type="number">` with ± buttons |
| Variant control | `<li><span>` lists — **no `tabindex`, no `role`, no `aria`, no focusable child** |
| Real form control | `<select name="id">` with 7 options, **`display: none`** |
| Sticky add-to-cart bar | none |
| Accordions | **none** (`<details>` count: 0) |
| Cross-sell | one generic "Best Sellers" row, 10 cards |
| Editorial below fold | two brand sections, 936 px + 846 px |

**The PDP variant selector is keyboard-inaccessible.** The visible swatches are
non-interactive list items; the only real control is a `display:none` select. That
is a WCAG 2.1.1 (Level A) failure on the primary commerce action.

A control labelled "Size Chart" resolves to
`<button class="quick-links-button" aria-label="button to contact support"
onclick="thirdQuickLinkClick()">` — the support-chat widget. Visible label and
accessible name disagree (WCAG 2.5.3 Label in Name). I found no structured size
table on the PDP.

The card price and the PDP price disagreed on the sampled product (card $35.00, PDP
$32.00) — likely a lowest-variant vs selected-variant rendering difference, but
worth flagging as the kind of inconsistency a combined-listing card invites.

---

## 9. Motion

| Property | Value |
| :--- | :--- |
| Motion library | **none** — jQuery 3.6.0 only |
| GSAP / Three.js / Lenis / Swiper / Framer | **all absent** |
| CSS transition declarations | **239** |
| `@keyframes` blocks | **124** |
| `prefers-reduced-motion` media blocks | **1 total — 0 belonging to the theme** |

The single reduced-motion block ships inside Font Awesome's stylesheet and scopes
only Font Awesome's own spinner classes. **The theme provides no reduced-motion
handling at all.**

What animates:

| Element | Trigger | Duration | Easing |
| :--- | :--- | :--- | :--- |
| Quick-shop trigger | hover | **150 ms** | `ease-in-out` |
| Size overlay | click + hover/focus | **200 ms** | default |
| Hover image swap | hover | **500 ms** opacity / 2 s transform | `cubic-bezier(0,0,.44,1.18)` |
| **Every product image on load** | lazyload | **1250 ms** | `cubic-bezier(.26,.54,.32,1)` |
| Swatch scroller | pointer | `scroll-behavior: smooth` + `scroll-snap-type: x` | native |

The interaction durations (150/200 ms) are well judged and inside our 100–400 ms
rule. The **1250 ms fade-in on every product image** is not — it runs unconditionally
for a reduced-motion user, and on a 40-card grid it is the dominant visual event of
the page.

No scroll-jacking. Native scroll throughout; the swatch strip uses native
`overflow-x` with `scroll-snap` and pointer-drag, plus **prev/next arrow buttons** —
a genuine single-pointer alternative to dragging (relevant to WCAG 2.5.7).

---

## 10. Tech stack and weight

**Platform:** Shopify. Theme **Kalles 2.0** (The4/Nitro), heavily customised.
Custom elements: `<x-product-card>`, `<x-product-card-swatch-scroll>`,
`<shop-cart-sync>`.

**Libraries:** jQuery 3.6.0, lodash, lazysizes, Flickity (theme fork,
`flickityt4s`), PhotoSwipe (`produc.min.js`). No modern framework, no motion
library, no WebGL. **This is the fourteenth reference site measured with zero
canvas.**

**PDP load, desktop, warm cache:**

| Bucket | Files | Transfer | Decoded |
| :--- | :--- | :--- | :--- |
| **Scripts** | **228** | **889.6 KB** | **6,338.9 KB** |
| Stylesheets | 82 | 365.5 KB | 2,270.7 KB |
| HTML document | 1 | 73.7 KB | 554.8 KB |
| Images | 7 | 59.2 KB | 60.9 KB |
| `card-sync` fetches | 10 | 28.2 KB | 210.6 KB |
| **Total** | **387** | **1,381.7 KB** | **8,991.4 KB** |

`DOMContentLoaded` **1,964 ms**, `load` **6,067 ms** — on a fast desktop
connection. Against our budgets: initial JS **≈ 5× over** the 180 KB ceiling; page
weight roughly at the 1.5 MB shop-surface limit before real images.

Heaviest scripts by decoded size: reCAPTCHA 804 KB, Shopify checkout prefetch
(~60 chunks), Facebook `fbevents` 400 KB, theme vendor bundle 332 KB,
`moment-timezone` 137 KB. Third-party and theme residue dominate.

**Theme's own JS ≈ 750 KB decoded**, of which the entire quick-shop and
combined-listing engine — `combined-listing.js` — is **37,247 bytes (~10 KB
compressed)**. The mechanism is cheap; the platform around it is not.

**Images:** homepage HTML serves 52 PNG + 4 JPEG. **Zero WebP, zero AVIF.** 49 of
those PNGs are 32 px colour swatches — one request each. Lazy-loading is done by
`lazysizes` (JS), not native `loading="lazy"`.

**Apps detected:** Gorgias (chat), Klaviyo, Judge.me, a preorder app, an Instagram
feed, GOVX ID, ReturnRabbit, BugHerd, ~10 web pixels. A justone.ai overlay serves an
entry modal that segments visitors by gender before asking for an email — an
audience gateway at the door, worth noting as a merchandising idea even though the
execution is a third-party popup.

---

## 11. Accessibility summary

| Finding | Severity | Measurement |
| :--- | :--- | :--- |
| Product images are CSS backgrounds — no alt possible | **High** | 0 `<img>` in 29 cards; 6 `<img>` in the whole homepage HTML |
| PDP variant selector not keyboard operable | **High (2.1.1 A)** | swatches are `<li><span>`; real `<select>` is `display:none` |
| Sold-out sizes indistinguishable from available | **High** | 27 on one page; identical computed styles, no `disabled`/`aria-disabled` |
| Focusable controls at `opacity: 0` | **High (2.4.7 A)** | **93 of 743 tab stops** on one collection page |
| No focus indicator on buttons | **High (2.4.7 A)** | global `button:focus{outline:0; box-shadow:none}` |
| Quick-shop keyboard order reversed | Medium | sizes at DOM index 2–8, trigger at 10; forward-Tab collapses the panel |
| Body text contrast | **Fail (1.4.3 AA)** | **3.59 : 1** |
| Out-of-stock badge contrast | **Fail (1.4.3 AA)** | **2.32 : 1** |
| No reduced-motion handling | Medium | 0 theme `prefers-reduced-motion` blocks; 1250 ms image fade always runs |
| Gallery images `alt=""` | Medium | all 5 on the sampled PDP |
| No `h1` on collection pages | Medium | collection name is an `h2` |
| Mislabelled control ("Size Chart" → support chat) | Medium (2.5.3 AA) | visible label ≠ accessible name |
| Size button target size | Pass, marginal | **30 × 24 px** desktop (24 × 24 minimum), 30–38 × 30 px mobile |
| Colour swatch target size | Pass, marginal | 26 × 26 px mobile |
| Swatch scroller has arrow buttons | **Good (2.5.7 AA)** | single-pointer alternative to drag, `aria-label`ed |
| Size buttons carry `aria-pressed` | Good | but no group label — seven unlabelled buttons to a screen reader |
| Load More is a real button, not infinite scroll | Good | — |
| Capability detection, not UA sniffing | Good | `(hover: hover) and (pointer: fine)` |

The pattern is consistent: the **mouse** experience was designed carefully and the
**keyboard/AT** experience was never tested. Everything hidden is hidden with
`opacity` rather than `visibility`/`display` or `inert`, which is exactly the choice
that produces invisible focus stops.

---

## 12. What Frontier House should take

### 12.1 Honest comparison with our `:target` Quick View

Ours (`src/ui/product-card.tsx`, `src/app/globals.css` §quick-view):

| | **Sendero Quick Shop** | **Our Quick View** |
| :--- | :--- | :--- |
| Job it does | **completes a purchase** | **shows more information** |
| Trigger | hover-revealed button, `opacity: 0` at rest | **always-visible** text link, `min-height: var(--target-min)` |
| Surface | 44 px strip **inside the card image** | **full-screen fixed modal** |
| State machine | JS attribute + CSS | **URL hash + `:target`** |
| JS required | **yes** (2-option products) | **none** |
| Keyboard | 93 invisible focus stops; reversed order | anchors; `:target` moves focus to `tabIndex={-1}` panel |
| Reduced motion | **not handled** | `@media (prefers-reduced-motion: no-preference)` gate |
| Size selection | **yes, and it adds to cart** | **none** |
| Sold-out states | indistinguishable | availability + size-range badges on the card itself |
| Scroll restoration | n/a (never leaves) | Close returns to `#p-slug` |
| Cost at scale | 1 `card-sync` fetch per combined card on load | **a duplicate media + description block per product** after the grid |

**Where theirs genuinely beats ours — three specific things:**

1. **Ours has no buying action at all.** Quick View ends at *View product*. Theirs
   ends in the cart. On the one job the brief names — shortening browse → buy — we
   currently shorten nothing; we add a step. That is the finding.
2. **Theirs never leaves the grid.** A 44 px strip on the card image preserves
   scroll position, context and peripheral comparison. Our full-screen modal
   destroys all three, and a hash navigation is a heavier mental event than it
   looks.
3. **Their size row is where the eye already is** — on the photograph, bottom-aligned,
   at the moment of intent. Ours puts a 10 px uppercase link below the badges, which
   is the least-looked-at region of the card.

**Where ours genuinely beats theirs:**

1. **It cannot fail closed.** No JS in the path. Theirs disappears entirely without
   JavaScript on 2-option products — and JavaScript is exactly what fails on the
   mid-range Android we are told to test on.
2. **The trigger is visible.** Ours is a real, always-present control. Theirs is
   `opacity: 0` until hover, which is unusable by keyboard and invisible on touch.
3. **`:target` gives us focus management for free** — the thing they got most wrong.
4. **We already respect reduced motion.** They ship zero handling.
5. **We do not put a variant JSON blob in the card.** They inline the full variant
   matrix per card (`pr-variant-data`). For us that would be an outright §11
   violation the moment a wholesale price entered it.

**Verdict:** their *placement and outcome* beat ours; our *mechanism and robustness*
beat theirs. We should keep the state machine and move the surface.

### 12.2 What our fast-discovery layer should do differently

Framed against §13b (wholesale-first) and the zero-client-JS-by-default constraint.

**A. Move the panel into the card and keep `:target`.**
`:target` does not require a modal. The overlay element can be positioned
`absolute; inset-inline: 0; bottom: 0` inside the card and revealed by
`.quick-view:target`, exactly as today, with no JS and no layout change to the grid.
This is a pure CSS relocation and it captures Sendero's single best idea.
Keep the close anchor returning to `#p-slug` for scroll restoration.

**B. Make the trigger visible but put it on the image.**
Keep it a real always-rendered anchor — never `opacity: 0`. Enlarge it from 10 px to
at least 12 px and give it a ≥ 44 px target. Optionally strengthen its contrast on
hover; never make its *existence* conditional on hover. Their 93 invisible focus
stops are the cautionary number.

**C. Replace "select a size" with "enter a size run." This is the real adaptation.**
Sendero's terminal-click-adds-to-cart is a consumer pattern: one garment, one size,
quantity 1. Our paying audience buys **prepacks of 6** against a **$50 minimum**.
The equivalent accelerator for a buyer is a **size-run quantity grid inside the
card** — one number input per size, a running pack total, submitted as one form.

That is achievable with zero client JS: a `<form method="post">` inside the
`:target` panel with `<input type="number">` per size and one submit button. The
server owns validation, pack maths and minimum-order progress. No `fetch`, no
optimistic UI, no `cart/add.js`. And because the panel is server-rendered inside the
authorised session, the wholesale price can appear there — which is precisely what
Sendero's public inline JSON blob could never safely do.

**D. Do the availability filter in the navigation.**
Their cheapest, highest-leverage trick: every category link carries
`?filter.v.availability=1`. One query parameter, zero code, and the shopper is never
shown dead stock. We should default our category links the same way, with the filter
visibly reflected in our facet panel so it reads as a state, not a trap.

**E. Design the sold-out size state before building the size UI.**
Their failure is the most expensive thing on the site: 27 buttons on one page that
look buyable and are not. Ours must be `<button disabled>` **and** visually distinct
**and** carry an accessible name that says so. If a size is unavailable in a size
run, the input should be disabled with the reason adjacent as text, not implied by
styling.

**F. Adopt the server-rendered card fragment, reject the eager prefetch.**
`?view=card-sync` is a good pattern and maps cleanly onto a route that returns a
single card's HTML. But do **not** copy the mount-time warm-up: 10 fetches averaging
263 ms to render one row of cards is a self-inflicted INP problem, and INP is where
this category fails.

**G. Card hierarchy: photograph → the number → name.**
Their price at 20 px against a 14 px title is a real merchandising decision worth
borrowing in structure. For us the "number" is **pack and minimum**, not price — and
on public surfaces it must be pack structure only, never the wholesale figure.

**H. Separate utility nav from named collections.**
Their four-layer nav (campaign page / utility taxonomy / named creative collections /
editorial series) is the cleanest answer I have seen to the tension in our D-04.
Named worlds live in their *own* top-level slot and cut across the taxonomy, so
naming them costs the utility navigation nothing. This does not resolve D-04, but it
shows the two can coexist rather than compete — and that a named collection can be a
**page** rather than a route, which sidesteps the redirect-at-scale risk.

**I. One number to hold onto.**
The entire quick-shop engine is **~10 KB compressed**. If we ever conclude that a
scoped island is required for the fast-discovery layer, that is the budget it should
fit in — not 180 KB. But note that everything in §12.2 A–H is achievable with CSS,
`:target` and forms, so **no island is currently justified**.

### 12.3 Two things to explicitly not copy

- **Product images as CSS backgrounds.** It is the single worst decision on the site
  and it structurally forbids alt text. Our §8.5 and the DOM-truth rule in §11 both
  forbid it.
- **The inline per-card variant JSON.** A full variant matrix in public HTML is the
  exact shape of the leak our CI Test 2 exists to catch.

---

## 13. Method notes and limits

- All measurements taken live in-browser via computed styles, `getBoundingClientRect`,
  the Resource Timing API and direct reads of the shipped CSSOM and JS sources.
- Hover-state measurement required care: `getComputedStyle` read immediately after a
  state change returns the **transition start value**. An early reading suggested the
  focus path was dead; re-measuring after a 320 ms wait proved it works. Any future
  teardown of a transitioned property must wait out the duration.
- The browser session was shared with other agents; every call was scoped by
  `tabId`, and a mid-session tab closure required reopening the target.
- Screenshots were unavailable for part of the session (pane not compositing), so
  visual claims here are backed by computed geometry rather than pixels.
- No form was submitted, no account created, no item added to any cart. The
  QUICK SHOP trigger was exercised via its own handler, which sets an attribute and
  cannot mutate the cart; the add-to-cart path is guarded by `event.isTrusted` and
  was never fired.
- Not covered: cart and checkout surfaces, search, account/login, the campaign page
  at `/pages/fall-2026`, and the mega-menu product cards (lazy-loaded on hover; not
  triggered).
