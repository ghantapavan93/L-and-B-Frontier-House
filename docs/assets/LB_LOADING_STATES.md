# LB — Route Loading States

**Outcome: route-level `loading.tsx` cannot ship in this codebase.** It was
implemented across all eleven requested routes, failed the project's own gating
tests in three independent ways, and was removed. The skeleton system it needs is
built and kept; what remains is a placement change that requires touching code
this pass was scoped away from.

This document exists so the next attempt does not rediscover any of it.

---

## 1. What is in the repository

| Kept | Why |
| :--- | :--- |
| [`src/ui/loading-skeletons.tsx`](../../src/ui/loading-skeletons.tsx) | The primitives — `LoadingRegion`, `PageHeading`, `ProductTile`, `ProductGrid`, `FormSkeleton`, `RowsSkeleton`, `PanelSkeleton`. Server components, zero client JS |
| `Loading states` block in [`globals.css`](../../src/app/globals.css) | `.skeleton` and its modifiers, sweep gated behind `prefers-reduced-motion: no-preference` |
| Nothing under `src/app/**/loading.tsx` | Every file removed — see §2 |

The primitives are correct and reusable as-is. They reserve real boxes rather
than centring a spinner, they invent no content, and the public product tile
deliberately reserves **no price line** because a public product record has no
wholesale field at all.

## 2. Three independent failures

### 2a. Gated routes lose their HTTP status

A `loading.tsx` wraps its segment in a Suspense boundary, so Next flushes an HTTP
**200** with the fallback shell *before* the page's server component runs — which
means before `redirect()` in `requireSignedIn` / `requireApprovedBuyer`, and
before `notFound()`. The redirect still reaches a browser via the RSC stream. It
no longer reaches the status line.

```
Test 2A — denies every authorised route to an anonymous session
  AssertionError: /trade returned 200 to anonymous: expected [307, 308] to include 200
04 — 404s a category that is hidden pending an owner decision
  AssertionError: expected 200 to be 404
```

11 structural tests, including two of the three the constitution says gate every
build. A 200 on `/trade` for an anonymous caller is a cacheable success on an
authorised route; a 200 for a hidden category is a soft 404. Both break **fail
closed**.

Affected: `(trade)/trade`, `/order`, `/orders`, `/orders/[id]`,
`/product/[slug]`, plus public `shop/[category]`, `product/[slug]`,
`size-and-fit/[category]` — and `(public)/loading.tsx`, which cascades onto those
last three. A child `loading.tsx` does not rescue a parent's; any boundary at or
above a gated segment produces the same 200.

### 2b. Without an `h1` in the fallback, the outline starts at `h2`

The streamed shell is header + fallback + **footer**. The footer's
`h2.eyebrow` elements therefore precede the resolved page content and its `h1`.

```
/wholesale does not start at h1 — expected 1, received 2
```

### 2c. With an `h1` in the fallback, every such page serves two

React streaming ships the fallback and the resolved content in the *same*
document, so both headings are present in the served HTML:

```
wholesale  h1 count: 2 | first headings: <h1 <h2 <h2 <h2
/new-arrivals has 2 h1 elements: expected 2 to be 1
```

**2b and 2c are the same constraint from two sides, and they have no overlap.**
No fallback content satisfies both "the document starts at h1" and "exactly one
h1 per page" while the fallback and the page coexist in one response.

## 3. What actually unblocks this

**In-page `<Suspense>`, below the `h1`.** Keep each page's guard and its `h1`
outside the boundary; suspend only the data-dependent subtree:

```tsx
export default async function Page() {
  const session = await requireApprovedBuyer('/trade/orders')   // status preserved
  return (
    <div className="container section">
      <p className="eyebrow">Wholesale</p>
      <h1>Order history</h1>                                    {/* exactly one, always */}
      <Suspense fallback={<RowsSkeleton rows={5} />}>
        <OrderRows buyerId={session.buyerId} />                 {/* promise, not awaited here */}
      </Suspense>
    </div>
  )
}
```

This resolves all three failures at once: the guard runs before the shell
flushes, so the status line survives; the `h1` renders once and outside the
boundary, so the outline is valid at every moment and never duplicated.

**Cost:** each page must stop awaiting its data before render and pass promises
into child components instead. That is a real refactor of every gated page, with
caching implications — which is why it was not done under a brief that excluded
changes to authorization, caching and route logic.

**Rejected alternative — guards in `middleware.ts`.** It would fix 2a alone and
nothing else, and it relocates a security control to satisfy a presentation
requirement. The trade layout carries a deliberate comment that the guard lives
in each page; that is a considered decision, not an oversight.
