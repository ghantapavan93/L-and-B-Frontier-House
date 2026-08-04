# LB — Route Loading States

**Outcome: a streamed loading state cannot ship on this codebase in any form, and the
work has been removed.** Route-level `loading.tsx` was implemented across all eleven
requested routes and failed the project's own gating tests three ways. The documented
replacement — in-page `<Suspense>` below the `h1` — was then measured on this build and
fails a fourth way that is worse than the first three, because no test in the suite could
see it.

This document is the record so no third attempt rediscovers any of it.

---

## 1. What is in the repository

| State | Detail |
| :--- | :--- |
| Nothing under `src/app/**/loading.tsx` | Every file removed — see §2 |
| `src/ui/loading-skeletons.tsx` | **Deleted** — see §4 |
| `Loading states` block in `globals.css` | **Deleted** — 95 lines that shipped in the single stylesheet on every route, with no consumer |
| `Test 1B` in [`01-no-js-product-truth.test.ts`](../../tests/structural/01-no-js-product-truth.test.ts) | **Added** — the gate that makes §3 impossible to reintroduce silently |

Both deletions are in git history at `047ae84`. Recovering the primitives is one
`git show` away if a future surface earns them; §5 says what would have to be true first.

## 2. Three failures of route-level `loading.tsx`

### 2a. Gated routes lose their HTTP status

A `loading.tsx` wraps its segment in a Suspense boundary, so Next flushes an HTTP **200**
with the fallback shell *before* the page's server component runs — which means before
`redirect()` in `requireSignedIn` / `requireApprovedBuyer`, and before `notFound()`. The
redirect still reaches a browser via the RSC stream. It no longer reaches the status line.

```
Test 2A — denies every authorised route to an anonymous session
  AssertionError: /trade returned 200 to anonymous: expected [307, 308] to include 200
04 — 404s a category that is hidden pending an owner decision
  AssertionError: expected 200 to be 404
```

11 structural tests, including two of the three the constitution says gate every build. A
200 on `/trade` for an anonymous caller is a cacheable success on an authorised route; a
200 for a hidden category is a soft 404. Both break **fail closed**.

Affected: `(trade)/trade`, `/order`, `/orders`, `/orders/[id]`, `/product/[slug]`, plus
public `shop/[category]`, `product/[slug]`, `size-and-fit/[category]` — and
`(public)/loading.tsx`, which cascades onto those last three. A child `loading.tsx` does
not rescue a parent's; any boundary at or above a gated segment produces the same 200.

### 2b. Without an `h1` in the fallback, the outline starts at `h2`

The streamed shell is header + fallback + **footer**. The footer's `h2.eyebrow` elements
therefore precede the resolved page content and its `h1`.

```
/wholesale does not start at h1 — expected 1, received 2
```

### 2c. With an `h1` in the fallback, every such page serves two

React streaming ships the fallback and the resolved content in the *same* document, so
both headings are present in the served HTML:

```
wholesale  h1 count: 2 | first headings: <h1 <h2 <h2 <h2
/new-arrivals has 2 h1 elements: expected 2 to be 1
```

**2b and 2c are the same constraint from two sides, and they have no overlap.** No
fallback content satisfies both "the document starts at h1" and "exactly one h1 per page"
while the fallback and the page coexist in one response.

## 3. The proposed fix, and why it is worse

The previous pass concluded that **in-page `<Suspense>` below the `h1`** resolved all
three: keep each page's guard and its `h1` outside the boundary, suspend only the
data-dependent subtree, and the status line, the outline and the h1 count all survive.

That reasoning is correct as far as it goes, and all three failures do clear. It stops one
question short of the one that matters.

### What a Suspense boundary actually serves

Measured directly — a `force-dynamic` probe route with a 300 ms child, built with
`next build` and fetched over HTTP from `next start`:

```html
<h1>Probe</h1><!--$?--><template id="B:0"></template><p>PROBE_FALLBACK_MARKER</p><!--/$-->
…
<div hidden id="S:0"><p>PROBE_RESOLVED_CONTENT</p></div><script>$RB=[];$RV=function(a){…
```

The shell carries the **fallback**, visibly. The real content arrives later in the same
response, parked inside `<div hidden>`, and the swap is performed by React's `$RC`
runtime — which is JavaScript.

**With JavaScript disabled, the fallback is the final state of the page.** The visitor
holds a skeleton for good. The product name is in the bytes but inside `hidden`: not
announced by a screen reader, not found by Ctrl-F, not selectable, not visible.

### Why every existing test passed it anyway

Test 1 asserts product facts are *present in the HTML*. They are — `PROBE_RESOLVED_CONTENT`
is right there in the response. The crawl assertion scans for restricted patterns and finds
none. The h1 count is 1. The status line is correct. The accessibility suite runs in
Playwright, where JavaScript is on and the swap has already happened.

Every gate in the project reports green on a page that, without JavaScript, shows a
skeleton and no product.

**"Present in the HTML" and "visible without JavaScript" are different properties**, and
the constitution's §11 is unambiguous about which one it means: *"A product absent from the
DOM is absent from search, from screen readers, from Ctrl-F, and from the 5%-plus of
sessions with no WebGL or failed JavaScript."* Content inside `hidden` is absent from three
of those four.

This is the documented failure mode — the atmosphere layer displacing the commerce layer
one reasonable-looking transition at a time — arriving through a door nobody was watching.
It would not have been a hero becoming a canvas. It would have been a loading skeleton.

### The gate that now watches that door

`Test 1B` in [`01-no-js-product-truth.test.ts`](../../tests/structural/01-no-js-product-truth.test.ts)
asserts that no public route and no authorised route serves either marker:

| Marker | Meaning |
| :--- | :--- |
| `<!--$?-->` | a boundary still pending when the shell flushed — the fallback is what a no-JS visitor keeps |
| `<div hidden id="S:` | content parked for a client-side swap |

A **resolved** boundary streams as `<!--$-->…<!--/$-->` with its content inline and passes
untouched. The gate forbids deferral, not `<Suspense>`. Every one of the 22 public routes
and 4 trade routes is clean today, so it starts green and only ever fires on a regression.

## 4. Why the primitives were deleted rather than kept

The previous pass kept `src/ui/loading-skeletons.tsx` and its CSS on the premise that §3
would consume them. That premise is now measured false, and nothing imports either one.

What remained was 163 lines of TSX with no call site and 95 lines of CSS shipping in the
single stylesheet on **every route** — a real cost against a contractual budget, paid on
every page load, for code that could not legally be used anywhere in the application. Left
in place it is also a trap: the next developer finds a complete, well-commented skeleton
system and the obvious way to wire it up is the one way that breaks the no-JS contract.

`LoadingRegion` also carried an `h1` whose entire justification was 2b — a route-level
concern that no longer exists. The primitive could not have been used as written regardless.

## 5. What would have to be true to revisit this

Not "find a cleverer boundary". Three concrete conditions, any one of which changes the
arithmetic:

1. **A surface that legitimately requires JavaScript.** Phase 3 cinema is the only
   candidate in the plan, and it is blocked on assets that do not exist. A skeleton inside
   a surface that is already JS-gated hides nothing that was reachable.
2. **A measured latency problem.** Today every read is an in-memory fixture; the boundary
   would resolve before the shell flushed and the fallback would never render at all. When
   the real commerce adapter lands with real network latency, measure server response time
   first — *"do not build features without evidence"* applies to loading states too.
3. **Navigation feedback, which is a different problem.** The gap a user actually feels is
   between clicking a link and the next route painting. That is a client-side navigation,
   where JavaScript is running by definition, so a pending-state affordance on `<Link>`
   touches no server HTML, no status line, no heading outline and no no-JS guarantee. It is
   the one form of this feature that is not in conflict with anything — and it needs
   evidence of a slow navigation before it is worth its bytes.

Until one of those holds, the correct number of loading states in this application is zero,
and the browser's own progress indicator is the honest affordance for a full-page load.
