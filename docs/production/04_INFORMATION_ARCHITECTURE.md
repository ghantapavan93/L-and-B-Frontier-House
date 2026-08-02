# 04 — Information Architecture

**Three audiences, one product truth.** Public, authorised buyer, and owner/internal are
*permission layers over the same data*, not three sites.

---

## Public

| Area | Contents | Phase |
| :--- | :--- | :--- |
| **Home** | Brand position, current drop, category entry, wholesale invitation | 1 |
| **The Drop** | Dated, permalinked daily surface; archive; subscribable | **1** |
| **New Arrivals** | Rolling recent | 1 |
| **Collections** | Seasonal (e.g. Fall 2026) | 1 |
| **Category browse** | Denim · Dresses · Tops · Bottoms · Outerwear · Jumpsuits · Accessories · Girls — **with facets and sort** | **1** |
| **Product detail** | Name, description, materials, colour, **size range**, availability, imagery — **no restricted price** | **1** |
| **Size & fit** | Structured measurement tables per category | **1** |
| **Wholesale information** | Terms, $50 minimum, prepacks of 6, sales-tax-ID requirement, approval timing | **1** |
| **Buyer application** | Form + document upload + status | **1** |
| **Showroom & markets** | Permanent showroom #13656; Aug 18–21 and Oct 20–23, 2026; appointments | 1 |
| **Store locator** | Existing retailer finder incl. Cavender's | 1 |
| Brand story | Vertical integration, Texas identity | 1 |
| Contact | Phone (call **or text**), email, hours | 1 |
| Accessibility · Privacy · Terms · Consent | | 1 |
| **Lookbook / editorial** | Monthly archive, **shoppable** | 2 |
| **Campaigns** | Chapter-based routes | 2 |

---

## Authorised buyer

| Area | Contents | Phase |
| :--- | :--- | :--- |
| **Buyer dashboard** | Open orders, drop alerts, minimum progress | **1** |
| **Authorised product view** | **WHLSL price · MSRP · MOQ · prepack composition · SKU · availability** | **1** |
| **Order builder** | Add to Order, pack quantities, **live progress to the $50 minimum** | **1** |
| **Saved assortments** | Named, reusable | **1** |
| **Line sheets** | Export (CSV/PDF) | **1** |
| **Order history** | Past orders, spec retained | **1** |
| **Reorder** | Same assortment · with changes | **1** |
| **Production & shipment status** | Incl. pre-order ship windows | **1** |
| **Buyer profile** | Retailer details, approval state, tax-ID status | **1** |
| Waitlist / restock | Per style | 2 |
| Sell-through & fit feedback | Per style | 2 |
| Rep relationship · appointments | | 2 |

---

## Owner / internal

| Surface | Purpose | Phase |
| :--- | :--- | :--- |
| **Daily-drop publishing** | Create, schedule, preview, publish a dated drop | **1** |
| **Product-data completeness** | Missing description, materials, size range | **1** |
| **Photography gaps** | *"Missing detail shots for 4 SKUs"* — V2 F6's pattern, with **assignable actions** | **1** |
| **Size & fit completeness** | Which categories lack measurement data | **1** |
| **Buyer applications queue** | Approve / reject / request documents | **1** |
| **Pricing-security alerts** | Automated flag if a restricted value appears in a public surface | **1** |
| Order alerts · availability | | 1 |
| Campaign readiness · missing media | | 2 |

> `INFERRED` — **Authoring ergonomics are a launch requirement, not a phase-two nicety.**
> The live site publishes by duplicating HTML pages (`april-2026-clone.html` exists; a nav
> item labelled "JANUARY 2026" points at `january-2025.html`). **If publishing a drop is
> slower than copy-paste, the platform will not be used and will be stale within a month.**

---

## Future DTC — documented branch, not built

Consumer account · cart · checkout · returns · public consumer pricing · consumer Passport.
**Architecturally reachable** — the buyer model is a superset — but out of Phase 1 scope
pending **D-01**.

---

## Cross-cutting principles

1. **One product record.** Public and buyer views are the same record with different
   permitted fields. Never two catalogues.
2. **Every surface stands alone.** Most traffic arrives from search or social into the middle
   of the journey, not at the homepage.
3. **One action to shop, from anywhere.** Including from every cinematic surface.
4. **Every state is designed** — loading, empty, error, unauthenticated, pending, denied,
   offline. The wholesale gate reads as an invitation.
5. **Public is semantic and crawlable; restricted is server-rendered inside the session.**
