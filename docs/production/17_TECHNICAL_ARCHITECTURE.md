# 17 — Technical Architecture

**Proposed, not implemented. No dependencies installed. No commerce provider selected.**

---

## 1. Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| Framework | **Next.js App Router** | Server components make the authorisation boundary enforceable at the data layer, not the view layer |
| Language | **Strict TypeScript** | The permission model is expressed in types — a restricted field is *absent*, not optional |
| Rendering | **Server-first.** Client components only where interaction requires | INP is the metric the category fails; the cure is shipping less JS |
| Styling | **CSS with design tokens as custom properties** | No CDN Tailwind. Tokens compile from `11` |
| Motion | **CSS/WAAPI first; GSAP only for pinned scroll choreography** | One mechanism per effect (`12`) |
| 3D | **None in Phase 1–2** | R3F alone exceeds the entire JS budget |
| Commerce | **Adapter boundary. No provider selected** | Pending owner and backend requirements |

---

## 2. Route and layout structure

```
app/
  (public)/                 layout: public shell, indexable, cacheable
    page.tsx                            /
    drop/[date]/page.tsx
    shop/[category]/page.tsx
    product/[slug]/page.tsx             PUBLIC fields only
    size-and-fit/[category]/page.tsx
    wholesale/apply/page.tsx
    ...
  (trade)/                  layout: AUTHENTICATED. private, no-store, noindex
    trade/page.tsx
    trade/product/[slug]/page.tsx       AUTHORISED fields
    trade/order/page.tsx
    trade/passport/page.tsx
    ...
  (internal)/               layout: owner role
    internal/...
```

**Three layout groups = three permission contexts.** A route cannot accidentally inherit the
wrong one, and the boundary is visible in the file tree.

---

## 3. Feature folders

```
src/
  domain/           types + pure logic: product, size, wholesale, buyer, order, passport
  data/             repositories; the ONLY place commerce/CMS is called
    adapters/       commerce-provider adapter (unselected), CMS adapter
  auth/             session, authorisation helper, guards
  ui/               tokens, primitives, accessible components
  features/         product, discovery, order, passport, editorial, internal
  motion/           mode context, reduced-motion, choreography (GSAP boundary)
  test/             the three CI tests + a11y, visual, route harnesses
```

**Rule:** `features/` may not import from `data/adapters/` directly. All access goes through
`data/` repositories, which are the single place authorisation is applied.

---

## 4. The authorisation seam

```ts
// One helper. One call site per data access. Deny by default.
export async function getProduct(slug: string, session: Session)
  : Promise<PublicProduct | AuthorisedProduct>
```

- **The restricted field is not in the returned object** unless the session is authorised.
  Not hidden, not null — **absent**. TypeScript then makes it impossible to render.
- **Fail closed.** An authorisation lookup error returns the public shape.
- **No client component ever receives a restricted value** it should not render.

This is the architectural answer to the audit's central finding: *no design source expresses
an authorisation boundary.*

---

## 5. Caching

| Surface | Policy |
| :--- | :--- |
| Public routes | Cacheable, shared, ISR where useful |
| **`(trade)` and `(internal)`** | **`private, no-store`**, never CDN-cached, vary on session |
| Static generation | **Public data only** — no build-time render may embed a wholesale price |

---

## 6. Adapter boundary

`VERIFIED FACT` — the existing platform is **CS-Cart**, holding the catalogue, account
approvals and order history.

**Do not select a headless-commerce provider yet.** Define the adapter interface, implement
it against fixtures for the first slice, and let the owner decision on migration
(replace / parallel / wrap) resolve later without restructuring.

```ts
interface CommerceAdapter {
  getProduct(slug: string): Promise<ProductRecord>
  listProducts(q: Query): Promise<ProductRecord[]>
  getWholesaleTerms(productId: string, buyerId: string): Promise<WholesaleTerms>
  createOrder(o: DraftOrder): Promise<Order>
  getBuyer(id: string): Promise<Buyer>
}
```

**Migration strategy is an open question** — recorded as OQ-15, not decided here.

---

## 7. Content-management boundary

**CMS owns:** drops, campaigns, chapters, editorial copy, media + alt text, size-and-fit
tables, brand story.
**Commerce owns:** products, variants, SKU, pricing, prepacks, inventory, orders, buyers.

> `INFERRED` — **Authoring ergonomics are a launch requirement.** The live site publishes by
> duplicating HTML pages. **If publishing a drop is slower than copy-paste, the platform will
> not be used.** The CMS choice should be judged on that single criterion first.

---

## 8. Error, analytics, observability

**Errors:** typed domain errors; designed 403 / 404 / 500; **no error message echoes a
restricted value**; fail closed on authorisation.

**Analytics:** event names carry no restricted value; **no price in any payload**; page-path
dimensions must not contain price patterns (the D-00 failure mode).

**Observability:** RUM for LCP/INP/CLS **segmented by device tier and experience mode**;
**LoAF `blockingDuration`** as the primary scroll metric; alerts on budget regression, on
authorisation failures, and on any restricted pattern appearing in a public response.

---

## 9. Deployment

Preview per PR with the three CI tests as required checks · budgets enforced per build ·
staging with a seeded buyer account (needed to verify the authorised path) · production
behind the same checks. **No deployment target selected** — it follows the hosting decision,
which is not yet made.
