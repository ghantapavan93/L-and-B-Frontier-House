# Phase 1 — Implementation Report

**Status:** first vertical slice complete, browser-verified and corrected. 2026-08-02.
**Verification:** typecheck clean · lint clean · Prettier clean · production build succeeds ·
**335 of 335 tests pass** — 145 under Vitest, 190 under Playwright against the production
build.

**Lucky & Blessed's own photography is now live on the site (§30–§37):** 27 of 31 supplied
assets published, 4 withheld with reasons, 18 products carrying real imagery. The earlier
attempt to import from the live site (§24–§29) remains correctly blocked by `robots.txt`.

The browser pass is recorded in §13–§23 below. It found **six real defects**, all fixed.

The slice runs end to end and crosses the authorisation boundary in both directions:

```
Public Home → New Arrivals → Product Listing → Public Product Detail
  → Buyer Apply / Sign In → Pending · Approved · Denied · Suspended
    → Authorised Pricing → MSRP → MOQ and Prepack → Add to Order
      → Wholesale Order Surface → Buyer Passport → Order History → Reorder
```

---

## 1. Files created

**Configuration (10)** — [package.json](../../package.json) ·
[tsconfig.json](../../tsconfig.json) (strict, plus `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noUnusedLocals`) · [next.config.mjs](../../next.config.mjs) ·
[eslint.config.mjs](../../eslint.config.mjs) · [vitest.config.ts](../../vitest.config.ts) ·
`.prettierrc.json` · `.prettierignore` · `.gitignore` · `next-env.d.ts` ·
`package-lock.json`

**Domain — types and pure logic (7)**

| File | Carries |
| :--- | :--- |
| [money.ts](../../src/domain/money.ts) | Integer minor units; the verified $7–$33 band, $50 minimum, 6-unit prepack |
| [taxonomy.ts](../../src/domain/taxonomy.ts) | **The typed category config — the one file the owner taxonomy decision touches** |
| [product.ts](../../src/domain/product.ts) | `ProductRecord` / `PublicProduct` / `AuthorisedProduct` — the permission boundary as types |
| [size.ts](../../src/domain/size.ts) | Size ranges and structured measurements |
| [buyer.ts](../../src/domain/buyer.ts) | `Buyer` and `BuyerProfile`; the tax-ID value never crosses into the profile |
| [order.ts](../../src/domain/order.ts) | Order, lines, prepack arithmetic, minimum progress |
| [session.ts](../../src/domain/session.ts) | `Session` union and `isAuthorisedBuyer` — the single authorisation predicate |

**Authorisation (4)** — [authorize.ts](../../src/auth/authorize.ts) (the seam) ·
[session.ts](../../src/auth/session.ts) (HMAC cookie, status re-read per request) ·
[guards.ts](../../src/auth/guards.ts) (route guards) ·
[actions.ts](../../src/auth/actions.ts) (sign in / out / apply)

**Data layer (6)** — [commerce-adapter.ts](../../src/data/adapters/commerce-adapter.ts)
(interface) · [fixture-commerce-adapter.ts](../../src/data/adapters/fixture-commerce-adapter.ts)
· [index.ts](../../src/data/index.ts) · [catalog-repository.ts](../../src/data/catalog-repository.ts)
· [buyer-repository.ts](../../src/data/buyer-repository.ts) ·
[order-repository.ts](../../src/data/order-repository.ts)

**Fixtures (5)** — [products.ts](../../src/fixtures/products.ts) ·
[buyers.ts](../../src/fixtures/buyers.ts) · [orders.ts](../../src/fixtures/orders.ts) ·
[size-ranges.ts](../../src/fixtures/size-ranges.ts) · [notice.ts](../../src/fixtures/notice.ts)

**Features (2)** — [facet-params.ts](../../src/features/discovery/facet-params.ts) ·
[order/actions.ts](../../src/features/order/actions.ts)

**UI (9)** — site-header · site-footer · product-card (card + grid) · product-media ·
size-and-fit-table · facet-panel · wholesale (price panel, prepack, add-to-order, minimum
progress, gate) · buyer-status · notices

**App routes and shells (21)** — see §2.

**Design tokens (2)** — [tokens.css](../../src/app/tokens.css) ·
[globals.css](../../src/app/globals.css)

**Tests (17 files, 317 assertions)** — 4 unit and 6 structural under Vitest, 6 Playwright
specs, plus 3 harness files. See §13 for the browser suites added in the verification pass.

**Assets (1)** — `public/media/fixture-placeholder.svg`, a labelled placeholder. **No
generated imagery was mirrored and no photograph is implied.**

---

## 2. Routes created

| Route | Render | Permission |
| :--- | :--- | :--- |
| `/` | Static | Public |
| `/new-arrivals` | Dynamic (searchParams) | Public |
| `/shop/[category]` | SSG, closed param set | Public |
| `/product/[slug]` | SSG, closed param set | Public |
| `/size-and-fit/[category]` | SSG, closed param set | Public |
| `/wholesale` | Static | Public |
| `/wholesale/apply` | Dynamic | Public |
| `/sign-in` | Dynamic | Public |
| `/robots.txt`, `/sitemap.xml` | Static | Public |
| `/trade` | **Dynamic, no-store** | Signed in — serves pending / rejected / suspended / approved |
| `/trade/product/[slug]` | **Dynamic, no-store** | **Approved buyer** |
| `/trade/order` | **Dynamic, no-store** | **Approved buyer** |
| `/trade/orders` | **Dynamic, no-store** | **Approved buyer** |
| `/trade/orders/[id]` | **Dynamic, no-store** | **Approved buyer** |
| `not-found`, `error` | — | Designed 404 and 500 |

**Two route groups, two permission contexts.** `(public)` never reads the session at all;
`(trade)` is `force-dynamic` with `private, no-store` and `noindex`.

Categories, and therefore every route above that carries a category, are generated from
[taxonomy.ts](../../src/domain/taxonomy.ts). **Home exists in the config with status
`hidden` and has no route** (D-05). Changing the owner-approved taxonomy is a change to one
file; no route or component is rewritten.

---

## 3. Components created

Nineteen components across nine files. The load-bearing ones:

- **`ProductCard` / `ProductGrid`** — accept `PublicProduct` **only**. A listing surface
  cannot render a wholesale price even by mistake, because the value is not in the object it
  receives.
- **`SizeAndFitTable`** — structured `<table>` with `<caption>` and `<th scope>`. Replaces
  the live site's single text-free JPEG.
- **`FacetPanel`** — a GET form. Works without JavaScript, filters live in the URL and are
  shareable, no price value ever enters a query string.
- **`WholesalePricePanel` / `PrepackTable` / `AddToOrder` / `MinimumOrderProgress`** — accept
  `AuthorisedProduct`; unrenderable on a public route by type.
- **`WholesaleGate`** — the public pattern from V3.1 `12f_4`: sells access, shows no price,
  states the verified approval timing.
- **`BuyerStatusPanel`** — pending, rejected and suspended states. None is a dead end.
- **`SiteHeader`** — session-optional. Public routes render it with no session (see §5).

---

## 4. Models and fixture data

Domain types follow `docs/production/06` exactly, with one addition: **`stockBySize` sits on
`WholesaleTerms`** (restricted), while coarse availability stays on the public base record —
see the assumption in §11.

Fixtures: **9 products** across Women / Girls / Accessories, **4 buyer accounts** (approved,
pending, rejected, suspended), **2 historical orders**.

Every fixture is constrained by test, not by convention:

| Constraint | Enforced by |
| :--- | :--- |
| Wholesale price inside verified **$7–$33** | `content-integrity.test.ts` |
| MSRP inside implied **$20–$85** | same |
| Prepack totals **6 units**, breakdown sums to the total | same |
| No $45–$1,250 design-corpus fixture set | same |
| No price pattern in any slug | same, plus Test 2B |
| Every product has a size range and measurements | same |
| Extended sizing is `available`, never `made-to-order` by default | same |
| Every image has meaningful alt over 20 characters | same |
| No fabricated date, sourcing claim, invented person, menswear, footwear or AR **anywhere in source** | same |

Fixture provenance is `generated-placeholder` on every image, rendered with a visible
`Fixture` flag and the notice **`DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA`**.

---

## 5. Authorisation behaviour

**The seam.** [`visibleProduct(record, session)`](../../src/auth/authorize.ts) is the only
function that can widen a product into its authorised shape. It destructures the restricted
field away explicitly, so **adding a new restricted field without handling it here is a type
error, not a silent leak**. `PublicProduct` has no `wholesale` key at all — absence, not
concealment.

**Deny by default.** Only `{ kind: 'buyer', status: 'approved' }` is authorised. Anonymous,
expired, pending, rejected, suspended and owner sessions all receive the public shape.

**Fail closed everywhere.** A missing cookie, bad signature, expired token, unknown buyer or
thrown lookup all resolve to no authorisation. Repository reads catch and return the public
shape. If the authorised PDP somehow receives a public product, it renders an explicit
"pricing is not available" state rather than an empty price.

**Buyer status is re-read per request.** The cookie carries an identifier only — never a role
or entitlement — so a buyer suspended between requests loses access on the next request.

**Buyer ids are never accepted from the client.** Every order operation re-derives the id
from the session, so changing a parameter cannot read another buyer's data.

**Guards sit in pages, not layouts.** A layout does not prevent its child page from
executing, so a layout-only guard would still run restricted code for an unapproved session.

**Public routes do not read the session at all.** This is a deliberate architectural choice
beyond the blueprint: a public response that varies by cookie is a response a shared cache
can misdeliver. Public output is byte-identical for every visitor — asserted by test — which
removes the cross-serving failure mode structurally rather than defending against it with
headers. The account affordance points at `/trade`, which resolves per session.

**Cache policy.** `/trade/*` returns `private, no-store, max-age=0, must-revalidate` and
`X-Robots-Tag: noindex, nofollow`. Public routes are prerendered and shared-cacheable.

**Sales tax ID** is stored on the buyer record and never crosses into `BuyerProfile`, never
rendered, never logged.

---

## 6. Responsive behaviour

- Fluid grids via `repeat(auto-fill, minmax(15rem, 1fr))`; no fixed breakpoint assumptions in
  the product grid.
- Container maxes at the V3-exact **1440px**, 24px gutter, 20px mobile margin.
- **Safe-area insets** are reserved on header, footer, hero and skip link. `env()` appears
  **0 times across all 48 exported design files**; this is new work.
- `viewport-fit=cover` set in the root viewport export.
- Wide tables scroll inside `.table-scroll`; **the page body never scrolls sideways**.
- Text wraps rather than truncates — no `-webkit-line-clamp`, no `text-overflow: ellipsis`
  anywhere, asserted by test. Truncation is the most frequent defect in the design corpus.
- Hero headline uses `clamp(32px, 8vw, 84px)` within the exact V3 type scale.

---

## 7. Accessibility behaviour

| Behaviour | Implementation |
| :--- | :--- |
| Skip link | First element in the DOM on every page, targets a focusable `<main id="main">` |
| Focus ring | **`#734F36` Tobacco Leather, computed 6.49:1.** The design source specifies Oxidized Silver at **2.18:1 against a 3:1 requirement** — non-conformant and, at `:focus` in 0 of 48 files, unimplemented |
| Contrast | **Computed in test, not assumed.** Body, metadata, borders, chips, errors and inverse-surface text all verified against WCAG thresholds |
| Headline over media | Bone on Ink at 17.74:1; V3 Frame 1 rendered its headline near-invisible |
| Landmarks | Labelled `<nav>`, one `<h1>` per page — both asserted across every route |
| Tables | `<caption>`, `<th scope="col">`, `<th scope="row">` throughout |
| Forms | Every control labelled, grouped in `<fieldset>`/`<legend>`, works without JavaScript |
| Live regions | `role="status"` on filter counts and minimum progress; `role="alert"` on form errors; `role="progressbar"` with `aria-valuetext` |
| Target size | `--target-min: 24px` declared; buttons are 44px min-height, checkbox rows 24px |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` collapses every duration token to 1ms. **Content, controls and capability are unchanged** — it removes motion, never capability |
| Motion budget | Four duration tokens, all ≤400ms; **two** easing curves, neither with overshoot — asserted by test |
| No canvas | Asserted absent on every public route |
| Alt text | Required and non-empty on every image, asserted across every route |

**No JavaScript is required for any Phase 1 task.** Sign in, apply, filter, add to order,
change quantity, submit and reorder are all plain forms.

---

## 8. Tests implemented

**117 assertions, 9 files, all passing.**

### The three required structural tests

| # | File | Asserts |
| :--- | :--- | :--- |
| **1** | [01-no-js-product-truth](../../tests/structural/01-no-js-product-truth.test.ts) | Name, spec, description, materials, colour, **every size**, availability and the size table present in server HTML; category and product links are real anchors; no canvas; every public route 200s |
| **2** | [02-unauthenticated-crawl](../../tests/structural/02-unauthenticated-crawl.test.ts) | **No money-with-cents pattern, no SKU, no restricted vocabulary, no exact wholesale/pack/MSRP figure, no sales tax ID** on any public route — in body, in `<head>`, or in headers. Structured data emits **no `offers`**. Sitemap excludes `/trade`. Every authorised route denies anonymous without leaking. **Slug purity** across every emitted URL, every product slug and the sitemap |
| **3** | [03-authorised-semantics](../../tests/structural/03-authorised-semantics.test.ts) | Wholesale price, MSRP, margin, SKU, MOQ, terms as text; prepack as a table with a real 6-unit run; Add to Order as a real `<button>` in a real `<form>`; no canvas; no price in alt text; `private, no-store` and `noindex` |

A raw HTTP fetch **is** the no-JavaScript view. Response bodies are normalised for React's
`<!-- -->` text separators before scanning — a price emitted as two adjacent children would
otherwise reach the wire split by a separator and evade a raw-byte regex.

### Supporting suites

- **[04 — authorisation states](../../tests/structural/04-authorization-states.test.ts)** (14):
  anonymous, pending, rejected, suspended, expired, **forged signature**, unknown buyer,
  **buyer isolation**, direct-id access to another buyer's order, cache isolation, and public
  responses proven byte-identical with and without a cookie.
- **[05 — accessibility and states](../../tests/structural/05-accessibility-and-states.test.ts)** (23):
  skip link, main landmark, single `h1`, labelled nav, focus ring in shipped CSS, reduced
  motion, viewport, safe area, table scrolling, no truncation, alt text, **every media file
  resolves**, fixture flagging, designed 404, hidden-category 404, unknown-category 404,
  recoverable empty filter state, empty order state, form errors without JS, application form
  structure, facet GET form, shareable filters.
- **[unit/authorization](../../tests/unit/authorization.test.ts)** (9): the seam across all six
  unauthorised session shapes, including serialisation checks.
- **[unit/order-math](../../tests/unit/order-math.test.ts)** (7): prepack arithmetic, minimum
  threshold, progress clamping, fractional-money rejection.
- **[unit/content-integrity](../../tests/unit/content-integrity.test.ts)** (26): the removals
  with no alternative branch, scanned across all source with comments stripped, plus fixture
  band and taxonomy constraints.
- **[unit/contrast](../../tests/unit/contrast.test.ts)** (11): **WCAG ratios computed from the
  shipped token file**, resolving `var()` aliases — not read from documentation.

---

## 9. Lint, typecheck, test and build results

```
npm run typecheck   tsc --noEmit                    clean
npm run lint        eslint .                        no warnings or errors
prettier --check    src/** tests/**                 all files conform
npm run build       next build                      compiled successfully, 25 routes
npm test            vitest run                      117 passed (117)
```

**First Load JS: 103 kB shared** — against a **180 kB** budget. **Zero WebGL bytes.** The only
client component in the build is the error boundary.

`npm run verify` runs typecheck → lint → build → all tests in one command.

---

## 10. Missing real product data and assets

Nothing here is a code gap. **These are the critical path.**

| Missing | Blocks |
| :--- | :--- |
| **Product data** — names, descriptions, materials, colourways, SKUs | Every product surface |
| **Product photography** | Every product surface. Nine placeholder references stand in |
| **Size and measurement tables per category** | Real fit guidance; the structures exist and are empty of truth |
| **Prepack compositions and MOQ per style** | Real pack breakdowns |
| **Authorised wholesale prices and MSRP** | Real pricing |
| **Availability and pre-order ship windows** | Real states |
| **A real demo buyer account** | Replacing the four fixture accounts |
| **Self-hosted font files with licences** | Typography. Zero licensed font files exist; the stacks are system fallbacks |
| **Icon set** | Nothing yet uses icons; Material Symbols is rejected |

Also outstanding and owner-gated: **display typeface and accent palette (D-07)** — no accent
hex was invented, and no webfont is loaded.

---

## 11. Known deviations from V3, and assumptions

**Deviations from V3, each with its evidence:**

1. **The brand palette is implemented; the Material 3 default theme is not.** Five of seven
   brand colours appear in zero V3 frames and all seven appear in zero V3.1 frames. That is a
   Stitch tooling artefact, not direction.
2. **The focus ring is Tobacco, not Oxidized Silver.** The specified value fails 3:1.
3. **No menswear, no footwear, no AR, no loyalty, no fabricated dates or sourcing.** All
   removals with no alternative branch.
4. **MSRP is restored beside wholesale price** (V2 Frame 6). V3 Frame 11 dropped it.
5. **The wholesale showroom is gated.** V3 draws it as a public page with prices on it.
6. **`FOR HIM` is replaced by Girls**, the verified category.
7. **Editorial nav (`COLLECTIONS · JOURNAL · ATELIER`) is not built.** Phase 2 and 3.
8. **Voice is the brand's own** — "Howdy", "Hey y'all", "We are partners in your success" —
   not the corpus's silent-luxury register.
9. **No display typeface is committed** (D-07 unresolved).

**Assumptions, flagged rather than silently taken:**

- **Availability is split.** The approval brief lists availability as restricted; `CLAUDE.md`
  §11 and `docs/production/08` require it public, semantic and crawlable, and acceptance
  criterion C1 tests for it. Resolution: **coarse state** (In stock / Pre-order / Waitlist) is
  public; **per-size unit counts** are restricted and live on `WholesaleTerms`. This satisfies
  both. **Confirm with the owner.**
- **`dynamicParams = false`** on product and category routes. Measured behaviour: `notFound()`
  thrown from a rendered page streams its boundary as RSC payload, leaving an **empty body
  without JavaScript**; an unmatched URL server-renders the 404 correctly. Closing the param
  set converts unknown slugs into unmatched URLs. **Operational cost: a newly published style
  needs the param list regenerated** — with the real adapter that becomes a revalidation call
  on publish. Revisit when the daily drop is wired to a live backend.
- **`Vary: Cookie` could not be set on authorised responses.** Next owns the `Vary` header for
  RSC negotiation and replaces any value declared in `next.config`; a middleware append was
  tried and **measured as ineffective**, so the middleware was removed rather than left in
  place implying a protection it did not provide. `Cache-Control: private, no-store` is the
  operative control and is asserted by test.
- **Draft orders and new applications are process-local.** The fixture adapter holds them in
  memory; they do not survive a server restart. Real persistence arrives with the real
  adapter.
- **The fixture password is visible on the sign-in page.** It authenticates fixture accounts
  only and the block is removed when a real identity provider is wired in.

**What the tests do not cover.** Markup-level assertions are necessary, not sufficient.
**Real keyboard traversal, computed focus visibility, screen-reader output, and visual
regression need a browser runner (Playwright) and a manual pass.** Neither has been run. No
claim is made about them here.

---

## 12. Recommended next implementation slice

In order of value:

1. **Browser-level accessibility harness.** Playwright: keyboard traversal with no traps,
   focus visible at every step, focus not obscured by sticky regions (2.4.11), computed target
   sizes (2.5.8), axe on every route in every state. This is the largest verification gap.
2. **Server-action coverage.** The three structural tests mint a session cookie directly
   rather than posting the sign-in form, because Next's action protocol uses build-generated
   ids. A browser runner closes this and proves the real login, apply, add-to-order and
   reorder flows end to end.
3. **The Drop as a dated permalink** — `/drop/[date]`, archivable and subscribable. The daily
   drop is the brand's real operating rhythm and currently has only a listing form.
4. **Owner-internal surfaces** — publish a drop, product-completeness alerts, applications
   queue. The mechanic is sound in V3 Frame 11; **the names in it are invented and stay out.**
5. **Saved assortments and line-sheet export.** Buyers work from line sheets. Export must be
   generated server-side inside the session and never publicly cached.
6. **Search**, over the same extracted attributes the facets already use.
7. **Real commerce adapter** behind the existing interface, once the owner confirms the
   migration strategy (OQ-15). No route or component signature changes.
8. **Performance verification on real hardware** — a physical mid-range Android and an iPhone
   in Low Power Mode. The 103 kB budget is measured; **INP is not**, and INP is the metric this
   category fails.

**Still blocking, unchanged:** the taxonomy cluster **D-04 / D-03 / D-05** is currently
running on the default safe branch encoded in `taxonomy.ts`. **D-00 remains live and
unraised** — the Dallas market runs **August 18–21**.

---
---

# Browser verification pass — 2026-08-02

Everything below was added after the structural build was complete and `npm run verify` was
already green. The purpose was to close what markup assertions could not reach.

---

## 13. Browser test runner

**Playwright** (`@playwright/test` 1.62) with **`@axe-core/playwright`** for accessibility.
No other dependencies were added.

Configured in [playwright.config.ts](../../playwright.config.ts) to run against the **real
production build**, never the dev server. That distinction matters here more than usual: the
properties under test — static prerendering, `private, no-store` on authorised routes,
byte-identical public output, the production session-secret guard, `Secure` cookies — only
exist in a production build. A dev-server pass would have proven none of them.

**`reuseExistingServer: false`.** The fixture adapter holds draft and submitted orders in the
server process, so a reused process carries state between runs; order history grows and the
visual baselines drift. A fresh process per run is the only way these suites are
deterministic. The visual spec is named `00-` so it sorts first and captures pristine state.

| Spec | Tests | Covers |
| :--- | ---: | :--- |
| [00-visual-regression](../../e2e/00-visual-regression.spec.ts) | 30 | Baseline screenshots, desktop + mobile |
| [01-sign-in-flow](../../e2e/01-sign-in-flow.spec.ts) | 17 | The real buyer journey and session lifecycle |
| [02-keyboard-and-focus](../../e2e/02-keyboard-and-focus.spec.ts) | 30 | Keyboard-only operation, focus visibility, 2.4.11 |
| [03-responsive](../../e2e/03-responsive.spec.ts) | 48 | Six viewports, overflow, clipping, 2.5.8 |
| [04-accessibility](../../e2e/04-accessibility.spec.ts) | 53 | axe, landmarks, headings, relationships, reduced motion |
| [05-cache-and-availability](../../e2e/05-cache-and-availability.spec.ts) | 12 | Cache/session behaviour and the availability boundary |
| **Total** | **190** | |

Plus one new Vitest file,
[06-availability-boundary](../../tests/structural/06-availability-boundary.test.ts) (10 tests).

---

## 14. Real sign-in flow

**Verified end to end through the actual form** — labelled controls, accessible roles, real
POST, real server validation, real cookie, real redirect. No generated action ids, no minted
session.

| Journey | Result |
| :--- | :--- |
| Public PDP → gate → sign in → **intent preserved** → authorised PDP → price, MSRP, margin, SKU, MOQ, prepack → Add to Order → order surface → passport → history → reorder | **Pass** |
| Submit an order → status page with the designed confirmation | **Pass** |
| Buyer application → pending state, **tax ID never echoed back** | **Pass** |
| Invalid password | Rejected; message discloses neither account existence nor status |
| Unknown account | **Identical** message — no enumeration |
| Pending buyer | Status + verified timing; **no pricing**; authorised URL redirects |
| Denied buyer | Route forward, never a dead end; no pricing |
| Suspended buyer | Ordering paused; history retained; no pricing |
| Sign out | Access revoked on every restricted route immediately |
| **Browser back after sign out** | Redirects to sign-in; no restricted value in the restored page |
| Cookie expired in the browser | Fails safe on reload |
| **Token expired server-side** (genuine signature, past timestamp) | Refused |
| **Forged signature** | Refused |
| Direct URL access, anonymous | Redirected with `next=` intent preserved |

**Cookie attributes measured in the browser:** `httpOnly` yes · `sameSite=Lax` yes · `path=/`
yes · `secure` yes · **not readable from `document.cookie`** · value carries an identifier and
a signature, never a role or entitlement.

> One deliberate exception is marked in the code: the server-side-expiry test mints a token
> with a past timestamp, because the alternative is waiting out the eight-hour session
> lifetime. Its signature is genuine, which isolates expiry from tampering.

---

## 15. Keyboard results

**30 of 30 pass**, including acceptance criterion **F1** — an approved buyer completes the
entire slice using only the keyboard: sign in → authorised pricing → prepack quantity → Add
to Order → change a line quantity → send the order → reorder.

| Check | Result |
| :--- | :--- |
| Skip link is the first Tab stop on all 10 public routes, and moves focus to `main` | Pass |
| Focus order: skip → header → content → footer, never interleaved | Pass |
| No keyboard trap on the most control-dense route | Pass |
| Filters and sort operable by keyboard, result count announced | Pass |
| Product card activates with Enter | Pass |
| Sign-in form completes by keyboard | Pass |
| Buyer application completes by keyboard | Pass |
| 404 and empty-filter recovery links reachable and operable | Pass |
| Authorised surfaces keep a visible ring on every control | Pass |

**Not applicable in Phase 1, and not faked:** search field, dialogs, and an order *drawer* —
the order surface is a route, not an overlay. These are recorded as absent rather than
asserted against something that does not exist.

---

## 16. Focus results

Every focusable control on every public route, plus the authorised product page, was walked
with Tab and measured for three properties: a computed outline of **at least 2px**, presence
**inside the viewport**, and **being the topmost element at its own centre**
(WCAG 2.2 · 2.4.11).

**All pass.** One defect was found and fixed — D-1 in §21.

The focus ring is Tobacco Leather `#734F36`, verified in the shipped stylesheet, and Oxidized
Silver is verified absent as a focus colour.

---

## 17. Responsive results

Six widths — **320 · 375 · 390 · 768 · 1024 · 1440** — across all ten public routes plus the
authorised product page, order surface, passport and order history.

| Check | Result |
| :--- | :--- |
| No horizontal page scroll | Pass at every width (2 defects found and fixed) |
| No clipped text | Pass at every width |
| Every target at least 24 x 24 px (2.5.8, inline exception applied) | Pass (1 defect found and fixed) |
| Product cards keep image, name, spec and badges | Pass |
| Filters and sort usable | Pass |
| Tables scroll inside their own container | Pass |
| Size list wraps rather than overflowing | Pass |
| Buyer pricing block, order surface, passport, order history | Pass at 320 / 390 / 1440 |
| Nothing sticky or fixed | Confirmed — so nothing can hide content or obscure focus |
| Safe-area insets present in the shipped CSS | Pass |
| First product image reserves its aspect ratio | Pass |

> The overflow check was rewritten mid-pass. Comparing `scrollWidth` to `clientWidth`
> **under-reports**: a table clipped inside a scroll container still grew the root scroller,
> and only *attempting the scroll* revealed 173px of real sideways movement. The helper now
> tries to scroll and takes the larger of the two measures.

---

## 18. Accessibility results

**53 of 53 pass.** axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`,
`best-practice`) is clean on:

- all ten public routes
- the 404, the empty-filter state and a form-error state
- `/trade`, the authorised PDP, the order surface and order history
- the pending and suspended states
- the homepage under emulated reduced motion

**Structural checks beyond axe:** one `main`/`banner`/`contentinfo` per page · exactly one
`h1` · every navigation landmark named · **no skipped heading levels** (1 defect found and
fixed) · every form control has an accessible name · hints **programmatically associated** via
`aria-describedby` (1 defect found and fixed) · errors carry `role="alert"` · filter counts and
minimum progress are live regions · `progressbar` exposes `aria-valuetext` reading
"…% of the $50.00 minimum" · every table has a caption and scoped headers · every image has
meaningful alt containing no price · **restricted pricing is text inside a named region**, and
the `canvas` count is zero.

**Reduced motion:** the emulation is asserted to have taken effect before anything else is
measured, then **every** computed `transition-duration` and `animation-duration` on the page
is checked against the 1ms floor. Content, controls and capability are unchanged, and the
authorised journey still completes.

> **This is not a screen-reader pass.** axe cannot hear anything and neither can a role
> assertion. What is verified is that names, roles, relationships and announcements are
> present and correct. Whether NVDA, JAWS and VoiceOver read them *usefully* has not been
> tested, and is listed in §22.

---

## 19. Visual regression baseline

**30 intentional baselines** in `e2e/__screenshots__`, full-page, animations disabled,
captured against a pristine server.

**Desktop (1440):** homepage · new arrivals · product listing · public PDP · size and fit ·
wholesale · buyer application · sign in · permission denied · empty state · 404 · form error ·
pending approval · application denied · account suspended · authorised PDP · order surface
(empty and with lines) · passport · order history.

**Mobile (390):** homepage · new arrivals · product listing · public PDP · sign in · buyer
application · authorised PDP · order surface · order history · passport.

They are **not** a programmatic diff against V3: V3 is a set of static images of a different,
unbuilt design. V3 remains the comparison authority for *judgement*, and every deliberate
deviation is listed in §11 — none was absorbed silently into a snapshot. **The rule on a
future diff is: explain the change or revert the code, never re-record blindly.**

Baselines were re-recorded exactly once after the fixes in §21, deliberately, with the reasons
stated here.

**Visual observation, not a defect:** at 320–390px the order tables are legible and scroll
correctly, but the style column wraps tightly (`Frontier / Wide / Leg / LB-WLG-DKI`). It meets
every criterion; it is a candidate for a card-style narrow-viewport layout in a later slice.

---

## 20. Cache, session and availability results

**Cache and session — all pass.**

| Check | Result |
| :--- | :--- |
| **Every public route byte-identical before and after login** (raw server response, not the hydrated DOM) | Pass |
| Buyer pricing never appears on any public route while signed in | Pass |
| Public routes cacheable; authorised routes `private, no-store`, no `public`, no `s-maxage`, `noindex` | Pass |
| Sign-out revokes access to every restricted route | Pass |
| Reload after session expiry fails safe, shows no stale order data | Pass |
| Browser back cannot resurrect a restricted response | Pass |

**`Vary: Cookie` was not reintroduced.** It was measured as ineffective — Next owns that
header for RSC negotiation and replaces any value set in `next.config`; a middleware append
did not survive. The middleware was **removed** rather than left in place implying a
protection it did not provide. `no-store` means no cache may store the response at all, which
makes Vary moot, and that is what the tests assert.

**Availability boundary — proven on both sides**, in the browser and in the structural suite:

| Public | Authorised |
| :--- | :--- |
| In stock · Pre-order · Waitlist | Exact per-size quantities as a semantic table |
| Pre-order ship window | Account-specific terms (Net 30) |
| No unit counts, no "Stock by size", no `stockBySize` in any payload including RSC flight data | Waitlisted styles disable ordering **and say why** |

Unapproved buyers — pending, rejected, suspended — see **no** quantity and **no** terms.

> The value-level version of this test was replaced after two false positives. Stock counts
> and body measurements are both small integers in the same row shape, so they collide by
> coincidence: XL stock is 39 and a size-M hip is 39; jacket L stock is 38 and a size-L bust
> is 38. The boundary is now asserted **by identity** — caption, heading and field name — with
> the type-level test proving the values cannot reach a public payload at all. That is
> precise; the numeric scan was not.

---

## 21. Issues found and fixed

Six real defects. All were found by the browser pass, none by code review, and all are fixed.

| # | Defect | Evidence | Fix |
| :--- | :--- | :--- | :--- |
| **D-1** | **Skip link off-screen and obscured at the moment it received focus**, on every route | Measured on all 10 public routes | Reveal it synchronously with `clip-path`, no transition. A skip link that animates into view is not there when a keyboard user needs it |
| **D-2** | **Authorised product page scrolled sideways 20px at 320px** | Measured | Grid items were inheriting content min-width; added `min-width: 0` to grid children and removed the blanket `table { min-width: 20rem }` — 320px is wider than the 280px content box at that viewport |
| **D-3** | **Order history scrolled the page sideways 173px at 320px**, even though the table was visually clipped | Measured; `overflow: hidden`, `overflow: scroll`, `display: flow-root` and `contain: inline-size` were each tried and measured as ineffective | `position: relative` on `.table-scroll` makes it a containing block, which keeps the overflow inside it |
| **D-4** | **Order-line quantity input was 80 x 21px** — below the 24 x 24 minimum (2.5.8) | Measured at every viewport | Control sizing moved from `.field input` to the element itself, so a control cannot fall below the target size by being placed somewhere new |
| **D-5** | **Metadata text measured 4.16:1 on the footer surface** — below 4.5:1 — on 7 nodes of every page | axe | `--color-text-meta` to `#5f5e5c` (5.81:1 on bone, 5.23:1 on sunken). **The unit test was checking one background; it now checks all three light surfaces** |
| **D-6** | **Heading level jumped h1 to h3** on `/size-and-fit/[category]` | Structural check | Added the missing `h2` section heading |

**Two accessibility improvements** made in the same pass: the sales-tax-ID hint and the
prepack quantity hint are now **programmatically associated** with their inputs via
`aria-describedby`, not merely adjacent to them.

**One test-harness bug worth recording**, because it was silently passing and proving nothing:
`expect(locator).not.toHaveText(regex)` requires the regex to match the **whole** string, so a
negated partial pattern always passes. Every browser-side leak assertion now reads `innerText`
and matches against it explicitly.

**Not a defect, recorded as behaviour:** Next logs `Internal: NoFallbackError` for every
unknown product or category URL. The user-visible result is correct — a 404 status with the
designed, server-rendered page, asserted in both suites — but it is log noise on a route that
stale links and crawlers will hit. It is a consequence of `dynamicParams = false`, which is
what makes the 404 server-render at all (§11).

**Also recorded as a deliberate trade-off:** because the public header is session-independent
by design, a signed-in buyer on a public page **has no visible sign-out control**. Sign-out
lives in the account area, reached through the "Buyer account" link. This is the cost of
keeping public output byte-identical for every visitor, and it is a conventional pattern —
but it is a choice, not an oversight.

---

## 22. Remaining manual checks

These cannot be automated and **have not been performed**. No claim is made about them.

1. **A real screen-reader pass** — NVDA on Windows, VoiceOver on macOS and iOS. Roles, names
   and relationships are verified present; whether the reading order and announcements are
   *useful* is unknown.
2. **A physical mid-range Android device.** The 103 kB budget is measured; **INP is not**, and
   INP is the metric this category fails. A developer machine understates real cost by 5–7x.
3. **A real iPhone in Low Power Mode** — where autoplay is disabled and iOS forces a play
   glyph CSS cannot hide. Phase 1 ships no video, so this matters from Phase 2 onward.
4. **Cross-browser** — the browser pass runs Chromium only. Firefox and WebKit are not covered.
5. **Real CDN cache behaviour** in front of a deployed origin. `no-store` is asserted at the
   origin; no CDN has been placed in front of it.
6. **Zoom to 200% and 400% reflow** (WCAG 1.4.10), and Windows High Contrast Mode.
7. **The 500 error boundary** has no browser baseline. Triggering it would require a test-only
   error route, and adding one to the application was not justified.

---

## 23. Final state

```
npm run verify
  tsc --noEmit          clean
  eslint .              clean
  prettier --check .    clean
  next build            25 routes, 103 kB First Load JS, zero WebGL
  vitest run            127 passed
  playwright test       190 passed
                        -------------
                        317 passed
```

**Source integrity:** `archive/` and `stitch-export/` unmodified; mtime sweep returns 0.

**Blockers before Phase 1 review are unchanged.** The taxonomy cluster **D-04 / D-03 / D-05**
still runs on the default safe branch encoded in [taxonomy.ts](../../src/domain/taxonomy.ts).
**D-00 is still live and unraised** — the Dallas market opens **August 18**. Real product data,
photography, measurement tables and a demo buyer account remain the critical path.

---
---

# Official-media ingestion pass — 2026-08-02

## 24. Outcome: the import is blocked by the site operator, not by engineering

**No images were imported. This is the correct outcome and it is not a failure of the
pipeline — the pipeline ran and refused.**

Both Lucky & Blessed owned origins publish a `robots.txt` that disallows this agent by name:

```
landbapparel.com                     landbw.co
  User-agent: ClaudeBot                User-agent: claudebot
  Disallow: /                          Disallow: /
  User-agent: claudebot
  Disallow: /

  Content-Signal: search=yes,ai-train=no,use=reference
```

That is the site operator stating, in the standard machine-readable place, that automated
agents of this kind may not collect from the site. `use=reference` does not cover
bulk-copying a brand's product photography into a second web application, and `ai-train=no`
is explicit.

**What this means practically:** the assets exist, they are high quality, and they are
reachable — the blocker is permission, not access. Lucky & Blessed can resolve it in one
sentence. Until they do, the honest photography-pending placeholders stay.

**What was NOT done:** no anti-bot control was bypassed, no authentication was touched, no
buyer-only surface was read, no retailer / Pinterest / image-search source was substituted,
and no image was hotlinked. One 501 KB file was fetched during a resolution probe before the
robots directives were read; it was measured in memory and never written to disk. Nothing
from the official site is stored in this repository.

---

## 25. Official pages inspected

Public pages only, in the browser, at the user's direction — reading a public page is
browsing, and the factual findings below are already partly in the research corpus.

| Page | What it established |
| :--- | :--- |
| `landbapparel.com/` | Homepage structure, category tiles, editorial banners, product rail |
| `robots.txt` on both origins | **The blocking directives above** |
| Navigation tree (extracted from the homepage) | The live category taxonomy — see §27 |

Image hosting is `landbapparel.com/images/…` and `landbw.co/images/blog/…`, both L&B owned.
Product files follow a legible SKU convention — `DR821-WST__5_.jpg`, `JE624-MW__7_.jpg`,
`TO1059-BKKAZT-1.jpg` — where the prefix is the garment type (DR dress, JE jeans, TO top),
then style number, then colour code. Full-resolution originals are served at
`/images/detailed/248/{file}` (≈500 KB, well above the ~1400px long edge the 4:5 cards want);
the `/images/thumbnails/{w}/{h}/…` variants are fixed-size derivatives and 404 on
unrequested sizes.

---

## 26. What the pass delivered instead

Everything that does not require copying their photography. The moment authorisation exists,
this runs and the site fills with real merchandise without further engineering.

| Deliverable | Location |
| :--- | :--- |
| **Importer with a hard robots/Content-Signal preflight** | [scripts/import-official-media.ts](../../scripts/import-official-media.ts) |
| **Manifest, recording the block** | [src/content/media/official-media-manifest.json](../../src/content/media/official-media-manifest.json) |
| **Typed resolution layer, approval-gated** | [src/content/media/official-media.ts](../../src/content/media/official-media.ts) |
| **Governance tests** | [tests/unit/official-media.test.ts](../../tests/unit/official-media.test.ts) |
| Run it | `npm run import:media` (preflight, safe) · `-- --write` once authorised |

**The importer already implements every rule from the brief:** official-origin allowlist ·
provenance capture (source URL, source page, download date, original filename, generated
clean filename, dimensions, byte size, SHA-256, related product/category, suitable,
needs-higher-resolution, owner approval) · `OFFICIAL SITE IMPORT — OWNER APPROVAL PENDING` on
every entry · rejection of files under 12 KB or 400px, unreadable files, non-image responses
and hash duplicates · and **price-pattern stripping on every derived filename**, because the
live site encodes wholesale cost into its product slugs and a filename derived from a source
URL would re-import the very leak this project exists to fix.

**Two rules are enforced in code, not convention:**

1. **Import is not permission.** `officialMediaForProduct` returns only assets marked
   `ownerApproval: 'approved'`. An asset can be downloaded, hashed and manifested and still
   never render.
2. **Nothing from the manifest reaches a public payload except the local path and authored
   alt text.** Source URLs are provenance and stay server-side.

Media resolution is applied in [catalog-repository.ts](../../src/data/catalog-repository.ts)
*before* authorisation, so public and buyer reads resolve identical imagery — media is
content, and content is not gated.

---

## 27. Finding: the live taxonomy, and D-00 confirmed again

Two things worth the owner's attention came out of the public-page reading. Both are facts
about the brand, not copied assets.

**The live category tree is materially wider than any design source assumed.** Recorded here
as evidence for **D-04 / D-05**; the typed taxonomy config was NOT changed, because taxonomy
is an owner decision and the brief forbids choosing one silently.

| Live section | Live sub-categories |
| :--- | :--- |
| Women's | Jeans · Tops · Dresses · Skirts · Skorts · Shorts · Pants · Outerwear & Jackets · Jumpsuits & Rompers |
| **Plus** | **A top-level section with its own Jeans, Tops, Dresses, Jackets, Skirts, Shorts, Pants** |
| Accessories | Belts · Bags · Bows · Wild Rags |
| Kids | Girls Clothing |
| Merchandising | New · Specials · Styles of the Week · dated daily drops (`/jul-27/` … `/aug-02/`) · Fall 2026 Collection |

Two consequences: **Plus is currently a parallel catalogue on the live site**, which is the
exact structure `docs/production/10` argues against — so D-04 is a live migration decision,
not a greenfield one. And the daily drop is real and dated, confirming the drop model.

**D-00 is still live today.** Product URLs read directly off the homepage:

```
/30-00-rust-vintage-western-scenic-satin-button-down-maxi-shirt-dress.html
/15-00-black-satin-lace-trim-cami-slip-mini-dress.html
/32-00-cream-rodeo-embroidered-wide-leg-jeans-inseam-31in.html
```

Wholesale cost, in the URL, on the public homepage, unauthenticated. **The Dallas market opens
August 18.** This has now been observed twice, months apart, and remains unraised.

---

## 28. Report against the brief

| # | Item | Result |
| :--- | :--- | :--- |
| 1 | Official pages inspected | Homepage + both `robots.txt`; navigation tree extracted |
| 2 | Images imported | **0 — blocked by robots directive** |
| 3 | Images rejected | 0 reached the rejection stage; the preflight stopped before download |
| 4 | Images still missing | **All of them.** Product photography, editorial, hero, material macros, showroom |
| 5 | Manifest location | `src/content/media/official-media-manifest.json` |
| 6 | Product mappings | Typed resolver built and wired; 0 mappings populated |
| 7 | Routes visually updated | **None.** No media landed, so no route changed |
| 8 | V3 references used | Frames 6 and 11, already applied in the previous pass |
| 9 | Performance impact | **None.** 103 kB First Load JS unchanged; no new image bytes; LCP unchanged |
| 10 | Accessibility impact | **None.** Placeholders retain authored alt text; axe still clean |
| 11 | Test count | **325 passing** — 135 Vitest (8 new media-governance tests), 190 Playwright |
| 12 | Build result | Clean. 25 routes, 103 kB shared JS, zero WebGL |
| 13 | Remaining photography required | Everything in `docs/production/14` — unchanged |
| 14 | Assets requiring owner approval | **All future imports.** `ownerApproval` defaults to `pending` and rendering is gated on `approved` |

**No visual baseline changed.** The Playwright suite passed without `--update-snapshots`,
which proves the 30 baselines are byte-identical to the previous pass. That is the honest
before/after: there is no after, because no media landed.

---

## 29. What unblocks this

One of the following, in preference order:

1. **Lucky & Blessed supply the photography directly** — the plan `docs/production/14` has
   always assumed, and the only route that also delivers the resolution, crops and licensing
   clarity the flagship needs.
2. **Written authorisation from Lucky & Blessed** to reproduce their site imagery for this
   project, recorded in `AUTHORISATION` in the importer. The preflight then passes and the
   import runs unchanged.
3. **A brief shoot** covering the material macro set first — one day's work, and
   `docs/production/14` ranks it third by value per unit cost for exactly this reason.

Until one of those happens the honest placeholder is the right thing on the page, and the
brief agrees: *"Keep the placeholder when no honest image is suitable."*

---
---

# Owner-approved media pass — 2026-08-02

The photography Lucky & Blessed supplied is now the dominant visual layer. §24–§29 above
describe the earlier attempt to import from the live site, which robots.txt correctly blocked;
this section supersedes it as the route by which real imagery reached the build.

---

## 30. What was supplied, and what happened to it

**31 originals**, preserved untouched at `assets/source/owner-approved/` (22 MB). The
optimiser only ever reads them.

| | Count |
| :--- | ---: |
| Originals supplied | 31 |
| **Published** (optimised and mapped) | **27** |
| **Withheld** (approved, deliberately not published) | **4** |
| Renditions generated | **114 files, 6.9 MB** (2.9 MB AVIF · 3.7 MB WebP) |
| Products now carrying real photography | **18** |
| Products still on the honest placeholder | **4** (Girls ×2, Accessories ×2) |

**Withheld, with the reason recorded in the manifest:**

| Asset | Why it is not published |
| :--- | :--- |
| `2700x1000_MainBanner_Summer_Sale.jpg` | Embeds a **dated promotional claim** — "40% OFF… valid August 1st–10th… code SUMMER40". Publishing it would make a time-bound commercial offer this project has no authority to make, and the window has closed. *(It does independently corroborate the verified showroom facts: #13656, Dallas Apparel & Accessories Market, 18–21 August 2026.)* |
| `BuyNowPayLater_2600x320px.jpg` | Third-party payment branding, not merchandise. Phase 1 has no consumer checkout, and this is the same financing widget the D-00 research found computing on an un-gated pack total. |
| `JE322-DW3_…_360x (1).webp` | Byte-identical duplicate — same SHA-256 as the retained copy. |
| `video_6a36d58ece9146….mp4` | Phase 1 ships no video. A looping hero film needs a visible pause control (WCAG 2.2.2), a poster frame and captions; it belongs to Phase 2 media. Preserved as an original. |

---

## 31. Mapping — how "do not guess" was enforced

Every original is listed exactly once in
[scripts/owner-approved-mapping.ts](../../scripts/owner-approved-mapping.ts) with a
`describes` string **written after looking at the image**. Nothing was inferred from a
filename alone, and nothing from a source URL.

**The optimiser refuses to run if any original is unmapped, or any mapping names a file that
is not on disk.** An asset cannot be silently published, and cannot be silently dropped.

**Lucky & Blessed's own style codes are recorded as supplied** — `JE334-DW`, `DR047-BLK`,
`TO1069-CMLAZT`, `JO390-BLK` — and used as SKUs. They are not expanded into claims about
fabric, construction or origin: only what is visible in the photograph is described.

**Three assets were deliberately NOT mapped to a product:**

- `CF4EA635-…` — a genuinely good close crop of an embroidered flare leg, but the filename
  carries no style code and the crop shows no identifying detail. Assigning it to a product
  would have been a guess. It became a `craft-detail` editorial asset instead.
- Two category tiles show a garment other than the category they linked to on the live site
  (the tile in the "Jeans" slot is wearing a denim skirt). They are mapped as **editorial
  imagery** with alt text describing the photograph, not the category.

### The catalogue was rebuilt around the photography, not the other way round

This is the substantive decision in this pass. Attaching a real photograph of `JE334-DW` to
an invented fixture called "Frontier Wide Leg" would have been a **false claim about what is
being sold** — precisely what CLAUDE.md §12 forbids. So the women's catalogue was rebuilt so
that each entry *is* the garment in its photograph.

| Now real | Still a labelled development fixture |
| :--- | :--- |
| The photograph | Prices and MSRP (inside the verified $7–$33 / $20–$85 bands) |
| The Lucky & Blessed style code, used as SKU | Pack composition, MOQ |
| The garment description — colour, cut, detail, styling, all visible in the image | Size runs, measurements, stock quantities, availability |

The `DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA` notice still renders on every product
page, and a test now asserts that real photography is **not** flagged as a fixture image
while that notice remains.

---

## 32. Where the photography is applied

| Surface | Treatment |
| :--- | :--- |
| **Homepage hero** | Full-bleed lineup photograph behind a scrim, headline centred over it. **Two art directions**: the 1920×1066 lineup for desktop, an 850×1520 portrait for phones — so a 1.8:1 image never becomes a letterbox sliver. `fetchPriority="high"`, eager, LCP element |
| **New Arrivals** | One product at double scale beside four supporting cards — controlled variation, not a uniform grid |
| **Editorial band** | Full-bleed recent-looks collage between sections, with a caption linking to the drop |
| **Category tiles** | 4:5 photographic tiles for Women, Girls and Accessories |
| **Category pages** | Wide banner above the facet layout |
| **Wholesale page** | Editorial banner above the buyer journey |
| **Product grids and PDP** | 4:5 photography throughout; the gallery renders every mapped view |

The V3 language established in the previous pass is intact: centred wordmark, quiet nav,
editorial serif hierarchy, warm ground, hairline rules, large vertical rhythm, raised panels,
label/value commerce rows, dark footer, 4:5 cards. **The photography sits inside that system
rather than replacing it.**

**Where no photograph was supplied — Girls and Accessories — the honest
photography-pending placeholder remains.** Both paths are exercised, and a test asserts both
still exist.

---

## 33. Performance

| | |
| :--- | :--- |
| **First Load JS** | **103 kB — unchanged.** No client component was added; `<picture>` is static markup |
| Hero, desktop (1920w AVIF) | 330 kB · 1280w 156 kB · 960w 90 kB |
| Hero, mobile (portrait 640w AVIF) | **63 kB** |
| Product card (360w AVIF) | ~31 kB, WebP fallback ~45 kB |
| Category tiles | 1.3–2.2 MB PNG originals → **48–93 kB AVIF** at the widths actually used |

**LCP impact, stated honestly.** The homepage LCP element changed from a CSS gradient
(effectively free) to a photograph. On mobile the hero now costs **~63 kB** and is fetched
eagerly with `fetchPriority="high"`; on desktop the browser picks from the srcset, typically
90–156 kB. That is a real addition and it is the right trade — the page was previously fast
because it had nothing to show. **It is within the ≤1.5 MB shop-surface budget with a wide
margin, but LCP has not been measured on a physical mid-range Android**, and until it is, no
claim is made about the ≤2.0s target.

`next/image` is deliberately not used: optimisation already happened at build time, there is
no CDN or loader decision, and a plain `<picture>` keeps the client cost at zero.

---

## 34. Accessibility

- **Alt text is composed, not copied** — product name plus the hand-written description of
  what the photograph shows. Filenames are never used as descriptions. Asserted >40
  characters, and asserted never to contain a price.
- **Layout is reserved from the model** — intrinsic width/height and `aspect-ratio` on every
  image, so nothing shifts as bytes arrive.
- **axe remains clean** on all 10 public routes, the authorised routes, every denial state,
  the 404, the empty state and under reduced motion.
- Keyboard, focus visibility, target size, no-horizontal-overflow and reduced-motion suites
  all still pass unchanged across six viewports.
- The scrim over the hero holds the headline above 4.5:1.

---

## 35. Visual review

**All 30 baselines were re-recorded once**, deliberately, because the design changed: every
route that gained photography necessarily renders differently. That is the one case where
re-recording is correct. The suite then passed a second time **without** `--update-snapshots`,
which proves the new baselines are stable.

Compared against V3 Frames 6 and 11, the remaining gaps are no longer visual-system gaps —
they are asset gaps, listed in §36.

**One test-harness defect was found and fixed:** the screenshot stabiliser awaited
`img.decode()` on every image, and a `<picture>` element whose art-directed source did not
match could leave that promise pending forever. It hung three mobile baselines for 45 seconds
each. The decode is now raced against a timeout.

---

## 36. What is still missing

| Gap | Detail |
| :--- | :--- |
| **Higher-resolution product shots** | **Every supplied product photograph is 360×540.** The 4:5 cards want roughly 660px on the long edge at 2× — these are soft on a retina display. **They were not upscaled**, and the manifest flags all 19 with `needsHigherResolution: true` |
| Girls photography | 2 products on placeholders |
| Accessories photography | 2 products on placeholders |
| Second and third views per product | Only one image per garment was supplied; the PDP gallery supports more |
| Detail / material macros | The single craft crop supplied is unattributable; `docs/production/14` ranks a macro set third by value per unit cost |
| Real product data | Names, descriptions, size runs, measurements, prices and pack composition remain fixtures |
| Showroom and craft photography | Nothing supplied |

**Everything supplied is recorded as owner-approved.** Any *future* import from the live site
remains blocked by the robots directive in §24 and would need the written authorisation
described there.

---

## 37. Report against the brief

| # | Item | Result |
| :--- | :--- | :--- |
| 1 | Official pages inspected | Unchanged from §25 — no new fetching was done in this pass |
| 2 | Images imported | **27 published** from 31 owner-supplied originals |
| 3 | Images rejected | **4 withheld**, each with a recorded reason |
| 4 | Images still missing | §36 — higher-resolution product shots, Girls, Accessories, extra views, macros |
| 5 | Manifest location | `src/content/media/official-media-manifest.json` |
| 6 | Product mappings | 18 products mapped by hand; 3 assets deliberately left as editorial rather than guessed |
| 7 | Routes visually updated | Homepage, New Arrivals, category pages, public PDP, authorised PDP, Wholesale, plus every grid |
| 8 | V3 references used | Frames 6 and 11 |
| 9 | Performance impact | JS unchanged at 103 kB; hero adds ~63 kB mobile / 90–156 kB desktop. LCP unmeasured on real hardware |
| 10 | Accessibility impact | None negative; axe clean, alt text composed and asserted |
| 11 | Test count | **335 passing** — 145 Vitest (10 new media-governance tests), 190 Playwright |
| 12 | Build result | Clean. 103 kB First Load JS, zero WebGL |
| 13 | Remaining photography | §36 |
| 14 | Assets requiring owner approval | All 31 are recorded `ownerApproval: 'approved'` per the owner's instruction. Publication is separately gated: `published: false` assets can never render |

**Source integrity:** `archive/` and `stitch-export/` untouched — newest mtime in either tree
is 2026-08-01 07:20, which predates this entire pass.
