# 06 — Commerce Requirements

**Research date:** 2026-08-01

Every requirement is classified. The brief is explicit that not every feature should be
added, so each line carries a verdict and a reason tied to evidence.

| Class | Meaning |
| :--- | :--- |
| **REQUIRED** | Launch is not credible without it |
| **RECOMMENDED** | Strong evidence, high value, should make launch if scope allows |
| **FUTURE** | Real value, but depends on an unresolved decision or later phase |
| **NOT JUSTIFIED** | No current evidence supports building this |

---

## 1. The gate that determines everything

`VERIFIED FACT` — Lucky & Blessed sells only to approved retailers and not to
consumers.

Until OQ-01 is answered, **the wholesale platform is the product and the consumer
platform is a proposal.** This table is therefore split by audience, and the wholesale
column is the one that must be complete at launch.

If the answer to OQ-01 is "wholesale only", roughly a third of the rows below become
FUTURE. If it is "dual audience", the consumer column becomes a genuine second build
with its own legal and operational prerequisites — returns, consumer tax, support,
fulfilment — none of which exist today.

---

## 2. Discovery and navigation

| Requirement | Class | Evidence and reasoning |
| :--- | :--- | :--- |
| Global navigation | **REQUIRED** | Exists today; must survive any cinematic layer |
| Persistent access to Shop from every cinematic surface | **REQUIRED** | Brief: *"a website where animation prevents shopping"* is a named failure |
| Search | **REQUIRED** | Exists today. 235 items in one seasonal collection alone |
| **Faceted filtering** — size, plus, wash, colour, fabric, print, silhouette, availability, price | **REQUIRED** | Largest evidenced gap. Today only *Item Availability* + one numeric range exist, while every attribute is already encoded in product names |
| Sorting (newest, price, best-selling) | **REQUIRED** | Absent today; trivial; buyers scan by newness |
| Daily drop as a dated, permalinked surface | **REQUIRED** | `/jul-27/` … `/aug-01/` prove a daily cadence already exists |
| Collection pages | **REQUIRED** | "Fall 2026 Collection" is live |
| Clearance | **REQUIRED** | Live today at 30–60% off |
| Shoppable lookbook | **RECOMMENDED** | Six monthly lookbooks exist as flat JPEGs with no product links — the highest-value unlock in the project |
| Saved / wishlist | **RECOMMENDED** | `wishlist.html` already exists; for buyers this is a **linesheet builder** |
| Recently viewed | **RECOMMENDED** | Cheap; genuinely useful across a 235-item scan |
| Store locator | **REQUIRED** | Exists, works, and is the only consumer-facing bridge the brand has |

---

## 3. Product detail

| Requirement | Class | Evidence and reasoning |
| :--- | :--- | :--- |
| Structured attributes (wash, fabric, detail, inseam, silhouette) | **REQUIRED** | Already in product names as unstructured text; extraction enables everything else |
| Editorial display name alongside specification name | **RECOMMENDED** | Serves consumer and buyer from one record — see [01](01_PRODUCT_AND_CATEGORY_MAP.md) §3.2 |
| **Real size and measurement data** | **REQUIRED** | Size chart is a single JPEG with zero text. WCAG 1.1.1 risk and a direct contradiction of the brand's inclusivity claim |
| Size range shown per garment, straight and plus together | **REQUIRED** | Plus is currently a separate SKU and a separate tree |
| Availability state: In-Stock / Pre-Order | **REQUIRED** | Already a first-class state with separately tracked backorder rates |
| Pre-order ship window and terms | **REQUIRED** | Buyers commit budget to pre-orders; 86.67% on-time is good but not certain |
| Pack structure (prepacks of 6) shown clearly | **REQUIRED** | Wholesale-only rule; a buyer must know they are buying six |
| Wholesale price + suggested MSRP | **REQUIRED** | Buyers need margin maths at the point of decision |
| Multiple angles, detail and fabric macro imagery | **RECOMMENDED** | Motifs are the product — buck-stitch and burnout need macro shots |
| Garment video / movement | **RECOMMENDED** | Fringe, ruffle and burnout only read in motion |
| 3D / exploded "Product Anatomy" | **FUTURE** | Concept exists in V3; needs the V3 audit and asset feasibility before commitment |
| Product reviews | **NOT JUSTIFIED** | No consumer base exists. Marketplace ratings already carry proof for buyers |

---

## 4. Cart, checkout and account

### Wholesale

| Requirement | Class | Evidence |
| :--- | :--- | :--- |
| Account gate with sales tax ID | **REQUIRED** | Legally and operationally mandatory today |
| Manual approval flow with clear status | **REQUIRED** | Approval "typically less than one business day"; today an unapproved account is simply "disabled", which reads like an error |
| $50 minimum enforced with live progress | **REQUIRED** | Stated policy |
| Cart with pack quantities | **REQUIRED** | Prepacks of 6 |
| Reorder from history | **RECOMMENDED** | Highest-frequency buyer action; no evidence it exists today |
| Linesheet / CSV export | **RECOMMENDED** | Standard buyer workflow; reps need it at market |
| Market appointment booking | **RECOMMENDED** | Aug 18–21 and Oct 20–23 are the revenue events |
| Terms / net-60 visibility | **FUTURE** | Faire offers 60-day terms; unknown whether direct accounts do (OQ-10) |

### Consumer — all conditional on OQ-01

| Requirement | Class | Evidence |
| :--- | :--- | :--- |
| Consumer cart and checkout | **FUTURE** | Blocked on OQ-01 |
| **Returns policy** | **FUTURE — blocking** | Current policy is *"All Sales Are Final"*. Fine for wholesale, unacceptable for consumers. A business decision, not a design one |
| Guest checkout | **FUTURE** | Blocked on OQ-01 |
| "Frontier Passport" account | **FUTURE** | Compelling, but an account system with no customers is premature |
| Custom Atelier | **FUTURE** | Vertical integration makes it *plausible*; needs an operational commitment to bespoke production before any UI |

---

## 5. Trust, legal and support

| Requirement | Class | Evidence |
| :--- | :--- | :--- |
| Contact, hours, phone, text | **REQUIRED** | Exists. Text ordering is real here — *"please call or text"* |
| Shipping terms | **REQUIRED** | $300 free-shipping threshold exists on FashionGo but not surfaced on own site |
| Returns policy | **REQUIRED** | Exists; must stay unambiguous |
| Privacy policy, terms, text-alert policy | **REQUIRED** | All exist |
| Cookie consent | **REQUIRED** | A Meta Pixel is installed sitewide; consent handling must match jurisdiction |
| **Surface operational proof** — 100% fill rate, ship speed, 615 combined reviews | **RECOMMENDED** | Strongest untapped trust asset the brand owns |
| Cavender's / stockist credibility | **RECOMMENDED** | Pending permission (OQ-06) |
| Trade show calendar | **REQUIRED** | Exists; should become interactive |

---

## 6. States that must be designed, not discovered

`OBSERVATION` — The current site 404s on at least two paths reachable from search
results, and its size-chart page renders an empty content region. States are clearly not
treated as designed surfaces today.

**REQUIRED** for every one of these:

- Loading — for grids, media, and mode transitions
- Empty — no results after filtering; empty cart; empty wishlist
- Error — 404, 500, failed media, failed WebGL init
- Unauthenticated — the wholesale gate must read as an *invitation*, not a failure
- Pending approval — an explicit, reassuring status with expected timing
- Reduced motion — a designed alternative, never a broken animation
- Offline / degraded — reps work convention-centre wifi

`RECOMMENDATION` — The unauthenticated state deserves particular care. It is the first
thing a prospective retailer sees, and today it is a wall of "SIGN IN TO ADD TO CART".
It should sell the brand and the partnership before it asks for a tax ID.

---

## 7. Explicitly NOT justified

Naming these protects scope.

| Feature | Why not |
| :--- | :--- |
| Consumer product reviews | No consumer base |
| Loyalty points | No consumer base; FashionGo already runs one for buyers |
| Subscription / membership | No evidence of demand |
| AI stylist / chatbot | No evidenced need; high maintenance; distracts from the real gaps |
| Live shopping | Requires operational capacity not evidenced |
| Multi-currency | International retailers are claimed but unquantified (OQ-11) |
| User-generated content gallery | Needs rights management and a consumer base |
| Menswear surfaces | **No menswear exists.** The brief asks whether expansion is credible: it is a hypothesis, not a capability, and must not be designed as though it ships |

---

## 8. Launch shortlist

If only ten things ship, these are the ten — ordered by evidenced value.

1. Faceted filtering built on extracted product attributes
2. Structured, accessible size and fit data
3. Unified straight + plus product records
4. The daily drop as a dated, permalinked, subscribable surface
5. Shoppable lookbooks
6. Product detail with pack, price, MSRP, availability and pre-order clarity
7. Wholesale application and approval with honest status
8. Reorder and linesheet export
9. Operational proof surfaced (fill rate, ship speed, reviews)
10. Every state above designed rather than defaulted

`OBSERVATION` — Not one of these ten requires WebGL. That is not an argument against
the cinematic layer; it is the order of operations. The cinema is what makes people
*feel* something. This list is what makes them *buy*.

---

## Cross-references

- [00_BRAND_TRUTH.md](00_BRAND_TRUTH.md) · [01_PRODUCT_AND_CATEGORY_MAP.md](01_PRODUCT_AND_CATEGORY_MAP.md) · [02_AUDIENCE_AND_JOURNEYS.md](02_AUDIENCE_AND_JOURNEYS.md) · [05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md) · [10_OPEN_QUESTIONS.md](10_OPEN_QUESTIONS.md)
