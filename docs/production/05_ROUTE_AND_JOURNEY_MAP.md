# 05 — Route and Journey Map

**One route tree. Three presentations (experience modes). Mode is a context, never a routing
branch** — this makes divergence between modes structurally impossible.

---

## Public routes

```
/                                  Home
/drop                              The Drop — index
/drop/[date]                       e.g. /drop/2026-08-01  · dated, permalinked
/new                               New Arrivals
/collections                       Index
/collections/[slug]                e.g. /collections/fall-2026
/shop                              All products + facets
/shop/[category]                   /shop/denim, /shop/dresses, /shop/accessories, /shop/girls
/product/[slug]                    PDP — public fields only, NO restricted price
/size-and-fit                      Structured measurement tables
/size-and-fit/[category]
/search                            Results
/stories                    (P2)   Editorial index
/stories/[slug]             (P2)   Lookbook / campaign chapter
/wholesale                         Terms, minimum, prepacks, tax-ID, approval timing
/wholesale/apply                   Buyer application
/wholesale/apply/status            Pending / approved / rejected
/showroom                          Permanent showroom + market calendar
/stockists                         Store locator
/about                             Brand story
/contact
/accessibility  /privacy  /terms
```

**Slug rule — enforced in CI:** a slug is derived from the product name only. **No numeric
price pattern may ever appear in a generated URL.** This is the test that prevents D-00 from
recurring.

---

## Authorised buyer routes — `/trade/*`

```
/trade                             Buyer dashboard
/trade/product/[slug]              Authorised PDP — WHLSL price, MSRP, MOQ, prepack, SKU
/trade/order                       Order builder — packs, live minimum progress
/trade/assortments                 Saved assortments
/trade/assortments/[id]
/trade/linesheets                  Export
/trade/orders                      History
/trade/orders/[id]                 Detail, production + shipment status
/trade/orders/[id]/reorder         Same assortment | with changes
/trade/passport                    Retailer profile, approval state, tax-ID status
/trade/appointments         (P2)   Market and showroom booking
```

**All `/trade/*`:** server-rendered inside the session · `Cache-Control: private, no-store` ·
`noindex, nofollow` · excluded from sitemap · **fail closed** to the public view.

---

## Owner routes — `/internal/*`

```
/internal                          Operations dashboard
/internal/drop                     Publish a dated drop
/internal/drop/[date]/edit
/internal/completeness             Product data · photography gaps · size & fit gaps
/internal/applications             Buyer approval queue
/internal/alerts                   Order, availability, pricing-security alerts
```

---

## Future DTC branch — documented, not built

```
/cart  /checkout  /account  /account/orders  /account/saved
```

Blocked on **D-01**. Reachable without restructuring — the buyer model is a superset.

---

## Overlays and states — not routes

`OBSERVED` — V3 Frame 5 has a `close` control; V2 Frame 4 has a `✕`. **Both are overlays,
not routes.**

| Surface | Classification |
| :--- | :--- |
| Four Worlds / category gateway | **Overlay** — dismissible, never owns a URL alone |
| Experience-mode selector | **Overlay** |
| Ignition / poster-first loading | **State** of `/` |
| Reduced motion | **State**, applies inside every mode |
| Low-power / no-WebGL fallback | **State** |
| Buckle sequence states (8b–8f) | **States** of one object |
| Camera passage | **Transition** — not addressable |
| Order drawer | **Overlay** over any `/trade` route |

---

## The primary journeys

**Buyer — the Phase 1 spine**
`/` → `/drop` → `/product/[slug]` *(public, no price)* → **sign in or apply** →
`/trade/product/[slug]` *(price, MOQ, prepack)* → **Add to Order** → `/trade/order` →
`/trade/orders/[id]` → `/trade/passport`

**Returning buyer — the highest-frequency path**
`/trade` → `/trade/orders/[id]/reorder` → `/trade/order`
`INFERRED` — This path must be the fastest in the product. Reorder is the most common buyer
action, and an authenticated buyer defaults to **Instant Shop**.

**Prospective retailer**
`/` → `/wholesale` → `/wholesale/apply` → `/wholesale/apply/status`
*The gate reads as an invitation. Terms, minimum and approval timing are public.*

**Search / social arrival**
`/product/[slug]` or `/drop/[date]` directly. **Every surface stands alone.**

**Consumer (public, cannot buy)**
`/` → `/shop/[category]` → `/product/[slug]` → `/stockists`
`INFERRED` — The store locator is the only consumer-facing conversion the business currently
has. It should be prominent, not buried.

---

## Mode behaviour across routes

Resolution order, first match wins: **explicit user choice (persisted, cookie, server-visible
on first render)** → `prefers-reduced-motion` → save-data/slow connection → device capability
→ **authenticated buyer defaults to Instant Shop** → otherwise Balanced.

**Never differs by mode:** products, prices, packs, availability, sizes, product truth,
commerce actions, **URLs**, or accessibility guarantees. Mode changes only how much
choreography wraps the content.
