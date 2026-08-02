# 14 — Brand, Commerce and Operational Gap Audit

Classification per the brief: **CURRENT LAUNCH REQUIREMENT · RECOMMENDED FOR LAUNCH ·
OWNER DECISION REQUIRED · FUTURE DTC · FUTURE OPERATIONAL · EXPERIMENTAL · NOT JUSTIFIED ·
NOT APPLICABLE**

---

## 1. Brand truth

| Item | Design support | Class |
| :--- | :--- | :--- |
| Verified brand story (vertical integration) | **Excellent** — V3.1 encodes Textile→Design→Manufacturing→Warehouse→Distribution→Boutique→Customer into the buckle's engravings | **CURRENT** |
| Texas identity without "Made in Texas" | **At risk** — Media_01 names *"Ranch Dusk"*; workshop imagery could imply owned manufacturing (OQ-04) | **OWNER DECISION** |
| Warm Texan voice ("Howdy", "y'all", "a dash of sass") | **Absent.** Copy reads *"Craft Your Legacy"*, *"Every stitch is a deliberate act of creation"* — luxury-house register, not L&B's | **CURRENT — gap** |
| Operational proof (100% fill rate, 2.64-day processing, 615 reviews) | **Absent everywhere** | **RECOMMENDED** |
| "L&B Frontier House" as public name | **Used in footers as a live brand** — not approved (OQ-17) | **OWNER DECISION** |

> `INFERRED` — **The voice gap is a real strategic finding.** The brand's own words are
> warm and Texan; the designs are silent and luxury. The Creative North Star is explicit
> that *"the warmth in the words stays."* Premium must come from photography, type and
> motion craft — **not** from deleting the personality. Owner decision **D-06**.

---

## 2. Wholesale — the only paying audience today

| Capability | Design support | Class |
| :--- | :--- | :--- |
| Buyer registration | **None** — 0 forms | **CURRENT LAUNCH REQUIREMENT** |
| Sales-tax-ID capture and verification | **None** | **CURRENT** |
| Pending-approval state | **None** | **CURRENT** |
| Buyer login / authenticated session | **None** — 0 sign-in | **CURRENT** |
| **Hidden wholesale pricing** | **None** — no gate concept exists | **CURRENT** |
| **Prepack logic (packs of 6)** | **`prepack` 0 files** | **CURRENT** |
| **$50 minimum with progress** | **None** | **CURRENT** |
| **MSRP for margin maths** | **`MSRP` 0 files** | **CURRENT** |
| Wholesale cart | Depicted, not mechanised | **CURRENT** |
| Reorder from history | **None** | **RECOMMENDED** |
| Linesheet / CSV export | **None** | **RECOMMENDED** |
| Market calendar & appointments (Aug 18–21, Oct 20–23) | **None** | **RECOMMENDED** |
| Showroom & retailer support | Frame 11 depicts a showroom | **CURRENT** |

> `INFERRED` — **Frame 11 depicts a wholesale showroom containing no wholesale.** Every
> verified mechanic of the actual business — tax-ID gating, prepacks of six, the $50
> minimum, MSRP, buyer authentication — is absent from all 48 files. This is the single
> largest commerce gap in the corpus, and it affects the **only** audience that currently
> pays.

---

## 3. Catalogue and discovery

| Capability | Design support | Class |
| :--- | :--- | :--- |
| Daily product drops | **Excellent** — Living Contact Sheet maps directly to the real daily cadence | **CURRENT** |
| New arrivals | Implied | **CURRENT** |
| Search | Icon only (`search`), no results surface | **CURRENT** |
| Product taxonomy | **Three conflicting taxonomies** — see [15](15_SOURCE_CONFLICT_AND_DECISION_REGISTER.md) C-05 | **OWNER DECISION** |
| Collection browsing | Partial | **CURRENT** |
| **Filters** | **None designed** | **CURRENT** — largest evidenced commerce gap |
| Sorting | **None** | **CURRENT** |
| Product detail | Frame 8 | **CURRENT** |
| **Size and fit** | **None designed** | **CURRENT** |
| **Inclusive sizing** | Plus as a separate world — contradicts one-record rule | **OWNER DECISION** |
| Availability / pre-order | **None** | **CURRENT** |
| Lookbook | Not designed as a surface | **RECOMMENDED** |
| Shoppable editorial | Frame 4 conceptual | **RECOMMENDED** |

---

## 4. Consumer concepts — preserve, do not delete, do not present as live

Per the brief: audit them, classify them, and determine how the architecture preserves them
without falsely claiming capability.

| Concept | Where | Class |
| :--- | :--- | :--- |
| Public DTC checkout | Frame 10 | **FUTURE DTC** (OQ-01) |
| Consumer account | Frame 10 | **FUTURE DTC** |
| **Frontier Passport** | Frames 10, 11 (14 files) | **OWNER DECISION** — see below |
| Consumer order tracking | Implied | **FUTURE DTC** |
| Consumer wishlist | Not designed | **FUTURE DTC** |
| **Custom Atelier** | Frame 9, Frame 5 world (15 files) | **OWNER DECISION** (OQ-12) |
| Direct consumer payment | Not designed | **FUTURE DTC** |
| Consumer returns | Not designed | **FUTURE DTC** — current policy is *"All Sales Are Final"*, normal for wholesale, unacceptable for consumers |
| Public consumer pricing | $45–$1,250 in markup | **NOT JUSTIFIED as shown** |

> `RECOMMENDATION` — **How to preserve them honestly.**
>
> **Reinterpret the Frontier Passport for the buyer before building it for a consumer who
> does not exist.** A buyer passport that remembers pack quantities, tracks progress to the
> $50 minimum, retains order history for reorder, and carries a market-appointment record
> **is** a living cart and a passport — serving a real, paying audience today with the same
> visual concept and the same name. Nothing is discarded; the audience changes.
>
> For the **Atelier**, keep the surface as an *enquiry* flow — "request a bespoke
> consultation" — rather than a live configurator, until the business confirms it offers
> custom production. The design survives; the false capability claim does not.

---

## 5. Content, operations, compliance

| Capability | Design support | Class |
| :--- | :--- | :--- |
| Content authoring | **None** | **CURRENT** — the live site publishes by duplicating HTML pages (`april-2026-clone.html`); if the new flow is slower than copy-paste it will not be used |
| Owner operating workflow | Frame 11 depicts it | **RECOMMENDED** |
| Loading / empty / error states | **None designed** in V3; V3.1 `12k` covers mobile fallback only | **CURRENT** |
| Low-bandwidth behaviour | V3.1 `12k` partial | **CURRENT** |
| Media fallbacks | Poster-first named, **0 posters implemented** | **CURRENT** |
| Privacy / cookie consent | **None** | **CURRENT** |
| SEO | Semantic base is good; no metadata strategy | **CURRENT** |
| Analytics | **None** | **RECOMMENDED** |
| Security / restricted data | **No boundary exists** | **CURRENT** — see [13](13_SECURITY_AND_RESTRICTED_DATA_AUDIT.md) |
| Accessibility | Structural base good; interaction layer absent | **CURRENT** |
| Menswear | `FOR HIM` in Frame 5 | **NOT JUSTIFIED** |
| Boots / footwear | Referenced in a few files | **NOT JUSTIFIED** without verification |
| Home goods | V3.1 "Accessories & Home" | **OWNER DECISION** (OQ-03) — *partially verified*: claimed in About Us and the Dallas Market Center listing, absent from live taxonomy |

---

## 6. Launch shortlist

`RECOMMENDATION` — if only ten things ship, these ten, ordered by evidenced value. **None
requires WebGL.**

1. Buyer registration, tax-ID verification and honest pending-approval state
2. Authenticated wholesale pricing with a real permission boundary
3. Prepack, minimum-order and MSRP clarity
4. Faceted filtering built on attributes extracted from product names
5. Structured, accessible size and fit data
6. Unified straight + plus product records (subject to OQ-08)
7. The daily drop as a dated, permalinked surface — the Living Contact Sheet
8. Reorder and linesheet export
9. Operational proof surfaced (100% fill rate, 2.64-day processing, 615 reviews)
10. Every state designed: loading, empty, error, unauthenticated, pending, reduced-motion,
    offline

`INFERRED` — The cinematic layer is justified as **brand differentiation** — a real and
defensible goal. It is **not** justified by a conversion claim the evidence does not
support. Held to that honest standard it remains worth building, because nothing in western
fashion looks like it.
