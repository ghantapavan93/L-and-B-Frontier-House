# L&B Frontier House — Business Experience Map

**Deliverable F.** Eight connected journeys. Each states the goal, the path, what
the platform remembers, and the gate that blocks it.

`A` shipping · `P` producible now · `M` blocked on owner media · `G` blocked on an
owner decision.

---

## 1. Women's customer `G` — blocked on D-01

**The honest position first.** The brand's own FAQ says it sells *only to approved
retailers* and not to consumers. Until **D-01** answers, a women's *customer* has
no purchase path, and building one would claim a service that does not exist.

**What she can do today** `A` — arrive, browse the full line, read structured size
and fit, understand the brand, and find the retailer route. That is a complete,
honest experience for a visitor who is not yet a customer.

**What unlocks with D-01** — cart, checkout, fit passport, loyalty, returns. Roughly
a third of the brief's scope hangs on this one decision.

**Remembers:** experience mode, filter state (URL), story selection (hash).
Nothing identifying without a session.

## 2. Men's customer `G` — blocked on D-03

**Menswear does not exist.** It entered through V1's storyboard, was never
re-examined, and is systemic across the corpus — `FOR HIM`, a male hero, an $850
men's boot, a "Men's Collection" row, a men's workwear rack. **D-03 is a
re-merchandising task, not a text edit.**

**Design it, gate it, do not populate it.** A `FOR HIM` gateway that opens onto
product the business cannot ship is a false capability claim the owner will
discover on his first click. **Girls** is the verified category and the obvious
occupant of that slot today.

## 3. Customization customer `G` — blocked on D-16

**V2 already had the honest version and V3 lost it:** customization *inside the
PDP*, in 2D, with an explicit lead time and a human-review gate — *"Custom
embroidery requires an artisan review. Lead times are currently 3–4 weeks."* —
plus a separate bag. Simpler and more operationally honest than a separate
three-step atelier route.

**Production states, when it ships:** Draft → Submitted → Production Review →
Customer Approval → In Production → Quality Check → Shipped. **A human approves
physical feasibility before production.** Feasibility warnings must be specific
("fine details may disappear at this embroidery size — increase to four inches or
simplify the internal lines"), never a confidence score.

**Never:** unauthorised logos or licensed characters in any demo.

## 4. Wholesale buyer `A` — **the audience that currently pays**

The one journey that is complete today, and the one Phase 1 exists to serve.

**Path.** Public wholesale surface with **terms as the opening claim** — $50
minimum, prepacks of 6, sales tax ID, approval typically under one business day —
then application, then a gated showroom. Publishing terms *before* the wall turns
a gate into a self-qualifying filter: unqualified buyers leave, qualified ones
arrive pre-committed.

**Inside:** pack breakdown with real size runs, MOQ, wholesale price, add to
order, order history, **reorder as a first-class action** — wholesale is repeat
business and a buyer's second order should cost three clicks.

**States, each naming itself in a heading:** pending · approved · rejected ·
suspended. **Fail closed on any session or lookup error.**

**Gated:** MSRP beside wholesale price (**C-10**). V2 showed `$185 WHSL / MSRP
$395`; V3 removed it. Margin maths is the buyer's core decision — recover it the
day owner data exists.

**Assortment builder** `A` — shipped at `/trade/assortment`. Budget, store size,
category mix, price band and launch month → a rack with units, spend, suggested
retail, blended margin and size and colour distribution. Every line carries its own
editable pack count, and the whole rack lands in the ordinary draft order, so it is
a starting point rather than a locked recommendation.

**Region was specified here and is deliberately not built.** There is no
sell-through, returns or regional performance data in this project. Distribution
being Texas-concentrated is a verified fact about *where the brand sells*, not about
*what sells where*, and weighting a rack by it would invent a merchandising claim
about the buyer's own business — §12 and "no features without evidence" outrank this
document. The surface names region, sell-through, return rate and size curve as
inputs it does **not** use, because a budget-filling tool is indistinguishable from a
demand predictor unless it says so. Launch month is honoured only against real
pre-order ship windows.

## 5. Returning loyal customer `G` — blocked on D-01 and D-17

**Frontier Passport** is partially resolved on evidence: **buyer-first**. For an
approved retailer it is already meaningful — orders, terms, reorder, saved
assortments. For a consumer it depends on D-01.

**Garment passport, when it ships:** product, version, size, purchase date, fit
feedback, materials, care, customizations, repairs, alterations, warranty, reorder.

**Loyalty must be benefits, not points.** Early access, free monogramming,
customization credits, alteration allowance, priority production, private
appointments. **No evidence supports a points system, so none is designed.**

## 6. Owner `P`

**Sourcing capture** — photograph a candidate, voice note, vendor, cost, MOQ,
colours, target price, possible collection, compare, track samples.
**Sample workflow** — Discovered → Sample Requested → Received → Fit Review →
Pricing Review → Approved → Content Ready → Launched.

**Product quality dashboard** — missing images, missing size data, conflicting
descriptions, unapproved prices, return patterns, fit complaints.

**V2's owner intelligence was operational and V3 made it decorative.** V2 surfaced
a sourcing delay *with quantified impact* and a photography gap *with a SKU count
and an Assign action*. V3 replaced that with a campaign percentage and pending voice
notes. **Recover V2's version.**

**Every AI summary links to the underlying reviews or conversations.** No
ungrounded insight, ever.

## 7. Merchandising employee `P`

Campaign assembly from approved products only: homepage story, app story, email,
collection page, wholesale line sheet, trade-show deck.

**Staff approve every price, claim, description and campaign before publishing.**
Every asset carries provenance, licence, approval and product-truth classification.
**Supply is not publication.**

## 8. Customer-support employee `P`

Order lookup, buyer state, custom-order stage, fit history, return reason.
**Support sees what the buyer sees plus operational state — never more.**
Role-based access; every consequential action writes an audit event.

---

## The connective tissue

**One identity, one checkout, one audit trail, many brands.** A second business
swaps `tokens.css` and its content model and inherits identity, sessions,
authorisation, payments, analytics, security and audit unchanged. That is what
makes this a platform rather than a site — and it is why the token layer, not the
page layer, is the thing worth getting right.

## Audit events — non-negotiable

Product published · price changed · discount created · refund approved · customer
data exported · staff permission changed · inventory adjusted · custom design
approved.

## What blocks what

| Gate | Blocks |
| :--- | :--- |
| **D-04 / D-03 / D-05** taxonomy | All routing. **The one hard gate on Phase 1** |
| **D-01** DTC | ~⅓ of scope: cart, checkout, consumer passport, loyalty, returns |
| **D-16** atelier scope | Customization |
| **D-17** passport scope | Consumer passport |
| **D-09** — *answered* | Generated media: atmosphere only, never evidence |
| Owner photography | Girls, Accessories, campaign film, boutique, macro set. **18 of 31 approved assets are flagged `needsHigherResolution` at 360 × 540** |

**The critical path is data and photography, not front-end work.** No render fixes
a 360 px source; that is a re-shoot, and it is the single highest-leverage owner
action available.
