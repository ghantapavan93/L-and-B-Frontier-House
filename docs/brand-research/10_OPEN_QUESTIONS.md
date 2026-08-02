# 10 — Open Questions

**Research date:** 2026-08-01

Questions requiring **owner confirmation** or further research. Nothing here has been
guessed at elsewhere in the corpus; each is referenced where it blocks a decision.

**Severity key** — **BLOCKING**: a major decision cannot be made without it ·
**HIGH**: shapes significant scope · **MEDIUM**: affects specific features ·
**LOW**: cosmetic or verification-only.

---

## Blocking

### OQ-19 — The wholesale price gate leaks. Is the owner aware?
**Severity: BLOCKING — and live right now.**

`VERIFIED FACT` — Wholesale unit costs are publicly readable in product URL slugs
(`/16-00-classic-western-button-down-long-sleeve-denim-dress.html`), on **17 homepage
products and 14 on the `/aug-01/` drop page**, confirmed 2026-08-01. Some titles also
print the price, and an Afterpay module computes on the un-gated pack total.

Full detail in [00_BRAND_TRUTH.md](00_BRAND_TRUTH.md) §1a.

**This is not a design question and does not depend on this project.** It should be
raised with the owner before anything else in this document. Competitors can read the
cost sheet; a boutique's own customers can see what the shop paid; resale-price
discipline is unenforceable while it persists.

**Needed from the owner:** confirmation of awareness, and a decision on whether fixing it
is in scope for this project or handled separately on the existing platform.

### OQ-01 — Is L&B Frontier House wholesale, DTC, or both?
**Severity: BLOCKING.** The largest unresolved question in the project.

`VERIFIED FACT` — Today the brand sells only to approved retailers: *"As of now we are
not selling our products directly to the consumers."*

The brief describes a cart, a customer passport, a custom atelier and a retail
shopper journey. **None of those has an existing audience.** Three possible answers, with
very different consequences:

| Answer | Consequence |
| :--- | :--- |
| **Wholesale only** | Roughly a third of the commerce requirements become FUTURE. The Wholesale Showroom becomes the flagship. Cheapest, fastest, highest certainty of return |
| **DTC launch** | A genuine change of business model. Requires a returns policy, consumer support, fulfilment, sales tax handling — and **risks channel conflict with the boutiques that are the current business** |
| **Dual audience** | Largest scope. Needs a deliberate answer to "why would a boutique keep buying from a brand that now competes with it?" |

**Also needed if DTC:** does the brand accept competing with its own stockists,
including Cavender's?

*Blocks:* [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md) §4,
[05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md) §1.1

### OQ-02 — Who sells "Lucky And Blessed" products on TikTok Shop?
**Severity: BLOCKING** (because it may already answer OQ-01).

A TikTok Shop listing for a *"Lucky And Blessed Women's T-Shirt"* appears in search
results. TikTok returned a security challenge, so the seller could not be identified.

- If **L&B is the seller**, the FAQ's "not selling to consumers" is already outdated and
  a consumer business exists.
- If a **stockist is the seller**, it is ordinary retail distribution.

A Meta Pixel is also installed sitewide on a login-gated B2B catalog, which points the
same direction and needs explaining.

---

## High

### OQ-03 — Do home goods and footwear exist as sellable lines?
About Us and the Dallas Market Center listing both claim **home goods**; FashionGo lists
**footwear**. Neither has a category on the live site. Do not design surfaces for either
until confirmed. *(Conflicts C-01, C-02)*

### OQ-04 — Where is manufacturing, and what can be claimed?
*"we own, operate, and manage all areas of the supply chain... textile, design,
manufacturing, distribution, and sales"* is verified. **Where** this happens is not.
"Texas-based" plus "owns manufacturing" invites a "Made in Texas" reading that is
**not evidenced and must not be implied.**

This blocks the single strongest untold brand story
([07_CONTENT_AND_MEDIA_STRATEGY.md](07_CONTENT_AND_MEDIA_STRATEGY.md) §4).

### OQ-08 — Is the plus assortment identical to the straight assortment?
Plus is currently a separate SKU and a separate category tree. The recommendation to
merge them assumes the same garment exists in both size ranges.

If plus is a genuinely **different, smaller assortment**, the honest solution is one
product page stating availability per size range — not a merged catalog implying a parity
that does not exist. *Confirm before building.*

Group 1 competitive research found this is an industry-wide weak point: one competitor
manufactures plus denim to size 40 but does not merchandise it on its own site, sending
that demand to third-party retailers. **Getting this right is a genuine differentiator.**

### OQ-12 — Is bespoke or custom production actually offered?
The "Built By You Custom Atelier" is a major journey step. Vertical integration makes it
*plausible*, but there is no evidence L&B offers customisation. Does the business want
to? At what MOQ, lead time and price? Without an operational commitment this surface
cannot be honestly designed.

### OQ-13 — Does any video or fashion film exist?
No video was found anywhere on the site. Several journey steps — Image Becomes Film,
Shoppable Film, Campaign Journey — assume film assets.
**What exists, what is planned, and what is the production budget?**

---

## Medium

### OQ-05 — Confirm retail price positioning
Wholesale is verified at $7–$33; retail is **inferred** at roughly $20–$85 via keystone
markup. Stockist sites (Starr Western Wear, Western Soul) returned HTTP 429 before
prices could be captured. This should be confirmed, because the price tier constrains the
entire visual register ([04](04_CREATIVE_NORTH_STAR.md) §2).

### OQ-06 — Is the Cavender's relationship publicly citable?
The store locator has a dedicated Cavender's filter, so the relationship is real and
already public on the brand's own site. Whether it can be used as a **marketing claim**
is a different question and may be contractually constrained.

### OQ-07 — Social audience size and content patterns
Five official channels exist. Instagram, TikTok and Pinterest blocked automated access;
YouTube returned no channel body; the session's web-search budget was exhausted before
social could be re-queried.

Unknown: follower counts, posting cadence, what content performs, whether video already
exists on social that could seed the site. **Social strategy is evidence-thin and has
not been filled with assumption.**

### OQ-09 — Does any consumer-side data exist?
Email list, social demographics, Meta Pixel audiences, retailer sell-through reports? If
yes, six audience profiles in [02](02_AUDIENCE_AND_JOURNEYS.md) upgrade from inference to
evidence.

### OQ-10 — What are direct wholesale payment terms?
Faire offers 60-day terms. Whether direct accounts get terms, and what they are, is
unknown — and it materially affects the buyer experience.

### OQ-11 — How international is the business?
*"thousands of retailers all across the world"* and *"across the US and
internationally"* are claims without numbers. Determines whether multi-currency,
multi-language or international shipping are justified. Currently classified
NOT JUSTIFIED on absence of evidence.

### OQ-14 — Who owns and operates the platform after launch?
Content operations currently run on page duplication. Who publishes the daily drop? Who
builds the monthly lookbook? What is their technical comfort level? **This determines
CMS choice more than any technical consideration**
([07](07_CONTENT_AND_MEDIA_STRATEGY.md) §7).

### OQ-15 — What happens to the existing CS-Cart platform?
Replace, run in parallel, or wrap? The existing site holds the product catalog, account
approvals and order history. **Migration strategy is unaddressed and is a major scope
determinant.**

---

## Low

### OQ-16 — Dallas or Farmers Branch?
Site says Dallas; a business directory says Farmers Branch HQ. The Harry Hines corridor
straddles the boundary. Confirm before printing an address.

### OQ-17 — Is "L&B Frontier House" an approved name?
The brief instructs treating it as a working product name unless an official source
confirms it is already public. **No such confirmation was found.** Treat as internal
until the owner approves. It should not appear in customer-facing copy on that basis
alone.

### OQ-18 — Brand mark and typography assets
No logo files, typefaces or brand guidelines were located. Does a brand book exist? The
design system will otherwise be reconstructed from screenshots, which is lossy.

---

## Research gaps — method limitations, not findings

Recorded honestly rather than filled in:

| Gap | Cause |
| :--- | :--- |
| Social media metrics and content | Platforms blocked automated access; search budget exhausted (200/200) |
| Retail prices at stockists | HTTP 429 rate limiting |
| TikTok Shop seller identity | Security challenge |
| Competitor mobile experience quality | Fetch tooling returns rendered text, not raw markup — no viewport, payload or image-format observation was possible for any competitor |
| Product detail page structure on landbapparel.com | The indexed PDP URL now 404s; a live PDP was not captured before budget limits |
| Anything behind the wholesale login | Requires credentials. **Not attempted** — authenticating into a third party's system was out of scope |

`RECOMMENDATION` — The wholesale-gated view is the most important unseen surface in the
project. **Ask the owner for a demo account** rather than attempting access. Until then,
all statements about the logged-in buyer experience are inference.
