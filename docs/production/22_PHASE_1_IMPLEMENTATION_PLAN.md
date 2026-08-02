# 22 — Phase 1 Implementation Plan

**Implementable without:** WebGL · campaign video · Custom Atelier · consumer Passport ·
consumer checkout · unsupported taxonomy · **any owner answer that is not yet available**
(except the taxonomy gate, §0).

---

## 0. The one gate

**D-04 + D-03 + D-05 — taxonomy, menswear, Home — must be answered before the first route is
written.** Taxonomy is in every URL; changing it after launch means redirects at scale.

Everything else in Phase 1 proceeds under the default safe branches in `02`.

---

## 1. The first vertical slice

```
Public Home
  → New Arrivals / The Drop
    → Product Detail (public — no restricted price)
      → Buyer Sign-In or Apply
        → Authorised Product Detail (WHLSL price · MSRP · MOQ · prepack)
          → Add to Order
            → Buyer Order Surface (live minimum progress)
              → Buyer Passport / Order History
```

**One path, end to end, both permission states.** It is deliberately narrow and deliberately
crosses the authorisation boundary twice — because that boundary is the thing the designs
never expressed and the thing most likely to be got wrong.

### What the slice must prove

| # | Proof |
| :--- | :--- |
| 1 | **V3 visual fidelity** — typography, grid, spacing, editorial restraint hold at production |
| 2 | **The pricing boundary is secure** — Tests 1, 2, 3 pass |
| 3 | **Public product information is semantic** and present without JavaScript |
| 4 | **Authorised information renders server-side inside the session** and never leaks |
| 5 | **Responsive** at 320 / 768 / 1024 / 1440, with safe-area handling |
| 6 | **Size and fit is structured text**, not an image |
| 7 | **Inclusive sizing structure** — one record, size ranges, honest per-range availability |
| 8 | **Search and faceted filtering** work on extracted attributes |
| 9 | **Every state designed** — loading, empty, error, pending approval, permission denied |
| 10 | **Accessibility** — keyboard, screen reader, focus, contrast |
| 11 | **The three CI tests** run and gate the build |
| 12 | **Build and deployment viability** |

---

## 2. Workstreams

| # | Workstream | Depends on |
| :--- | :--- | :--- |
| **A** | **Foundations** — repo, TypeScript strict, token system from `11`, route groups, CI skeleton | Taxonomy gate |
| **B** | **Domain + data layer** — models from `06`, the authorisation helper, fixtures behind the commerce adapter | A |
| **C** | **Authorisation** — session, guards, the three permission contexts, fail-closed, cache policy | B |
| **D** | **Public product surfaces** — home, drop, category, PDP, size & fit, search, facets | B |
| **E** | **Buyer surfaces** — sign-in, apply, status, authorised PDP, order builder, history, reorder, Passport | C, D |
| **F** | **States and accessibility** — every state, focus system, reduced motion, announcements | D, E |
| **G** | **Tests and CI** — the three tests plus supporting suites from `18` | B onward |
| **H** | **Owner surfaces** — drop publishing, completeness alerts, applications queue | B, E |

**A → B → C is the critical path.** D and E parallelise after B. **G starts with B, not at
the end** — the three tests must exist before there is anything to leak.

---

## 3. Sequence

**Step 1 — Foundations and the boundary.** Repo, tokens, route groups, domain models, the
authorisation helper, fixtures, and **Tests 1–3 running against an empty app.** The tests
should pass trivially and then keep passing as surfaces are added.

**Step 2 — Public product truth.** PDP with public fields, semantic and server-rendered.
Structured size and fit. **Test 1 becomes meaningful here.**

**Step 3 — Discovery.** Category browse, facets built on extracted attributes, sort, search,
The Drop as a dated permalinked surface.

**Step 4 — The gate.** Buyer application with document upload, approval states, sign-in, and
the **pending state that reads as an invitation** with the verified under-one-business-day
timing.

**Step 5 — Authorised commerce.** Authorised PDP (WHLSL price, MSRP, MOQ, prepack, SKU),
order builder with live minimum progress, Add to Order. **Test 3 becomes meaningful here.**

**Step 6 — Buyer continuity.** Order history, production and shipment status, **reorder same
assortment / with changes**, saved assortments, line-sheet export, Passport.

**Step 7 — States, accessibility, owner surfaces.** Every remaining state, the full
accessibility pass, drop publishing and completeness alerts.

---

## 4. What Phase 1 explicitly does not build

Consumer cart, checkout, account or price · Custom Atelier configurator (enquiry flow only) ·
loyalty of any kind · campaign film or any video · the Living Contact Sheet · Product Anatomy
· the Frontier Engine sequence · the buckle · any WebGL · AR · menswear, footwear or Home
surfaces.

---

## 5. Data prerequisites

Phase 1 cannot complete without, from the owner: **product data** (names, descriptions,
materials, colourways, SKUs) · **size and measurement tables per category** · **prepack
compositions and MOQ** · **authorised wholesale prices and MSRP** · **availability and
pre-order ship windows** · **product photography** · **a demo buyer account** for verifying
the authorised path.

**These are the real long lead items.** The front-end work is not the critical path — data
and photography are.

---

## 6. Definition of done

Phase 1 ships when: all twelve slice proofs hold across the full route set · the three CI
tests plus supporting suites are green · budgets from `16` are met on a **physical mid-range
Android** and an **iPhone in Low Power Mode** · every state is designed and reachable · no
fabricated claim remains (`20`) · no fixture price sits outside the verified band · and an
approved buyer can complete an order end to end by keyboard alone.
