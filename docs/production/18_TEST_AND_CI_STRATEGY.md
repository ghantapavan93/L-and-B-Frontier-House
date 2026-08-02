# 18 — Test and CI Strategy

**Three structural tests gate every build.** They exist because the two most likely failure
modes — a price leak and a disappearing catalogue — are invisible to code review.

---

## Test 1 — Public content without JavaScript

**Fetch every public route with JavaScript disabled. Assert required public product and
navigation information is present in the HTML.**

Assert present: product **name**, description, materials, colour, **size range**,
availability, category navigation, primary links.
Assert **absent**: any restricted wholesale price.

> **Why.** This is the structural defence against the atmosphere layer swallowing the
> commerce layer — the failure where the hero becomes a canvas for a smoother dissolve, then
> the grid joins it, then the type joins to avoid relayout. **Nobody decides to remove the
> products.** The precedent is real: an Awwwards Site of the Year ships a DOM containing a
> single text node, and an award-winning WebGL fashion store has no product listings in its
> HTML at all. **Code review will not catch it. This test will.**

---

## Test 2 — Restricted pricing absence

**Fetch every public route with no session. Fail on any exposure.**

Surfaces checked: HTML · response headers · **inline JSON and `__NEXT_DATA__`** · client
bundles · **URLs and slugs** · `<title>` and meta · Open Graph · **JSON-LD** · sitemap ·
`robots.txt` · unauthenticated API responses · analytics payloads · **image alt text** ·
build logs · fixtures.

Two assertions:

```
A. No response contains a value in the restricted wholesale band ($7–$33 pattern),
   nor MOQ, pack price, or buyer-term strings.

B. SLUG PURITY — no generated URL contains a numeric price pattern.
   Regex: /\/\d{1,3}-\d{2}-[a-z]/
```

> **Assertion B is the test that prevents D-00 from recurring.** The live site currently
> leaks wholesale cost through exactly this pattern on 17 homepage products and 14 on a drop
> page.

---

## Test 3 — Authorised buyer semantics

**Fetch an authenticated buyer product page. Assert the commerce layer is real HTML.**

Assert present **as semantic, keyboard-accessible elements**: wholesale price · **MSRP** ·
**MOQ** · **prepack composition** · SKU · availability · product name · **Add to Order**
control.

Assert: prices are **text**, not canvas or image · every control is reachable and operable by
keyboard · the price region announces via `aria-live` when it appears after sign-in.

---

## Supporting suites

| Suite | Asserts |
| :--- | :--- |
| **Accessibility** | axe clean on every route; **plus manual keyboard and screen-reader verification** — automated passes are necessary, never sufficient |
| **Keyboard** | Full traversal, no traps, visible focus at ≥3:1, focus moves to `<h1>` on route commit, no focused element entirely obscured |
| **Reduced motion** | With `prefers-reduced-motion: reduce`: **content parity** with the animated view — same products, prices, actions — and no uninitiated motion |
| **Media controls** | Every auto-starting sequence >5 s exposes a visible pause/stop/hide; every draggable surface exposes a single-pointer alternative |
| **Visual regression** | Per route, per mode, per breakpoint |
| **Mobile safe-area** | Tab bars and header controls respect `env(safe-area-inset-*)` at notch and home-indicator |
| **Route and authorization** | Each state — anonymous, pending, approved, expired, suspended, owner — sees exactly its permitted fields. **Fail-closed** on lookup error |
| **Cache isolation** | Buyer A's authorised response is never served to buyer B or to anonymous |
| **Broken media** | Every `MediaRef` resolves; every video has a poster; every image has non-empty meaningful alt or explicit `alt=""` |
| **Text truncation** | **No clipped text at 320 / 768 / 1024 / 1440 px.** Truncation is the most frequent defect in the design corpus — at least ten instances across 56 frames |
| **Product-data integrity** | No fixture price outside the verified band without an explicit illustrative annotation; **no media with `provenance: 'generated-placeholder'` referenced from a production route**; no product without a size range |
| **Performance budgets** | Bundle sizes, LCP/INP/CLS thresholds, LoAF `blockingDuration` |

---

## CI gates

**Blocking on every PR:** Tests 1, 2, 3 · accessibility · route/authorization · product-data
integrity · performance budgets.
**Blocking before release:** visual regression · reduced-motion parity · cache isolation ·
safe-area · text truncation · manual keyboard and SR pass on changed surfaces.
**Continuous in production:** RUM segmented by device tier and mode · an alert if any
restricted pattern appears in a public response.

---

## Fixture policy

Fixtures are **clearly labelled** and **visually distinguishable in development** so a
placeholder cannot silently ship. **No fixture price may fall outside the verified $7–$33
wholesale band** without an explicit illustrative annotation — the current design fixtures
($45–$1,250) would all fail this check, which is the point.
