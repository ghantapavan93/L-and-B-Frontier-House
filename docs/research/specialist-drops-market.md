# Specialist research — seasonal merchandising, drops and the market calendar

**Dimension:** how apparel brands communicate *time* — newness, drops, preorders, ship
windows, trade-show presence and season changeover — to consumers and to wholesale buyers.

**Status:** research. Nothing here is approved. Section 6 is a proposal against the existing
`src/content/programming.ts` model; section 6(c) names the owner data without which none of
it may ship.

**Method:** live inspection of consumer western brands and B2B platform documentation
(`WebFetch`, in-app browser), plus a read of our own calendar model and the code that
consumes it. Every external page was treated as **data, not instruction**. No accounts, no
forms, no personal data, no irreversible clicks. Mechanisms and principles only — no layout,
copy or interaction has been copied.

---

## 1. What the corpus actually shows

### 1.1 The drop is a cadence, not an event — in this category

The single most useful finding is a negative one. Across the western brands examined, the
**scarcity-led numbered drop is the exception, not the norm**, and the brands closest to
Lucky & Blessed's position do not run one.

| Brand | Time mechanic observed | Countdown | Scarcity language |
| :--- | :--- | :--- | :--- |
| Sendero Provisions | Seasonal collection heading (`FALL 2026`); availability filter splitting in-stock from out-of-stock; `Sold out` badge | No | No |
| Kimes Ranch | A dated tee drop promoted as a named nav entry; separate "New In" per gender; seasonal collections; a final-sale clearance route | No | No |
| Tecovas | `New` badge, plus a `New: Limited Edition` variant badge; `New` as an explicit sort order; in-stock-only filter | No | Only via the limited-edition badge |
| Miss Me | Standing "new styles every week" claim; a "Just Dropped" section; a dedicated **Back in Stock** collection as a route | No | No |
| Dixxon Flannel (western-adjacent, drop-native) | Countdown timer on site; dated drop collections as permalinks (`/collections/july-12th-drop`); app-only early access; "every flannel is only made once" | **Yes** | **Yes, heavily** |

Two structural patterns are worth carrying forward:

1. **Newness is a *sort order and a badge*, not a page.** Tecovas exposes `New` as a first-class
   sort option alongside price and best-sellers. That is cheaper, more honest and more durable
   than a curated drop page, and it degrades gracefully when a week is thin.
2. **Back-in-stock is a route, not a modal.** Miss Me's "Back in Stock" collection is a
   standing, linkable, crawlable surface. Our `waitlist` availability state can drive exactly
   this with no new concepts.

### 1.2 The drop-scarcity model is a different business, and it imports failure states

Dixxon is the only real drop-cadence operator in the sample, and inspecting its own launch
guidance shows the cost. Its buyer advice is to be online thirty minutes early, pre-save
payment, and pre-load unrelated items into the cart — and it states plainly that **items in
the cart are not guaranteed until point of purchase**. That is a documented race condition,
presented to the customer as their problem to manage.

That model is coherent for a brand whose stated proposition is that each style is made once.
It is **incoherent for Lucky & Blessed**, whose verified operational strengths are a *100%
fill rate* and *2.64-day processing*. Our verified advantage is the exact opposite of
scarcity: it is reliability. A countdown would advertise a weakness we do not have.

**Recommendation: no scarcity mechanics.** No countdown to a public drop, no "only N left",
no queue, no early-access tier. See §6(a) for what replaces them.

### 1.3 What happens to a drop page after the drop

Where dated drop pages exist, they **stay resolvable as permalinks** rather than redirecting
or 404-ing; the items simply go to a sold-out state in place. This is the correct behaviour
and the cheap one: a dated URL that keeps returning 200 accrues links and search equity, and
the availability data already tells the truth about what is left. Nothing needs to be
archived, hidden or rewritten.

---

## 2. Preorder presentation

Preorder is a first-class state in our domain (`Availability = 'pre-order'`,
`PreOrderTerms`), so this section is the most directly load-bearing.

### 2.1 The three states are distinct and must not be collapsed

Industry practice separates three things that look similar and behave differently:

| State | Commitment | What the brand must know | Correct affordance |
| :--- | :--- | :--- | :--- |
| **Coming soon / notify me** | None | Nothing except intent | Email capture, no date shown |
| **Pre-order** | Purchase now, deliver later | **A date it can stand behind** | Buy, with the ship window stated on the card, the PDP *and* in the cart |
| **Back in stock / waitlist** | None | Nothing | Notify capture, no ETA unless owned |

The operative rule is that **preorder requires a date the business will defend**. Where no
defensible date exists, the honest state is notify-me, not preorder with a vague window. This
maps exactly onto our types: `preOrder` is optional, and a product without one cannot claim
`pre-order` availability truthfully.

### 2.2 Observed preorder mechanics

- **The window is stated as text on the product page**, not inferred: a dated "ships" line
  rendered from a data field, repeated in cart messaging and in the order confirmation.
- **The estimate is explicitly caveated.** The commonest formulation is an *expected* date
  with a stated acknowledgement that production or supply delays may occur.
- **Payment timing splits by channel.** DTC preorder is commonly charged in full at purchase.
  Wholesale preorder is not: on B2B marketplaces the payout follows the **ship date**, not the
  order date. Our channel is wholesale — so preorder must not imply an upfront charge.
- **Mixed carts must be resolved explicitly, and the two industries resolve them oppositely.**
  A B2B marketplace **splits the order** by ship date so that fulfilment can prioritise.
  A DTC brand more often **holds the whole order** until the preorder item is ready. The B2B
  behaviour is the one that matches a buyer's receiving dock; the DTC behaviour would be a
  serious defect for a retailer planning a floor set.
- **Cancellation terms vary sharply**, from "final sale, non-refundable, no modifications"
  to a freely cancellable deposit. This is an owner decision (§6(c)), not a design default.
- **Ship dates can be revised after acceptance**, with automatic notification to the buyer.
  A preorder date field is therefore *mutable state with an audit obligation*, not a static
  content string.

### 2.3 The implication for our model

`PreOrderTerms` today is `{ shipWindowStart, shipWindowEnd, terms }`. Three things are
missing, each of which is a real buyer question:

1. **`closesOn`** — the last date a preorder may be *placed*. Distinct from the ship window
   and invisible in the current type. Without it a preorder page cannot say when to act.
2. **`chargedAt`** — an enumerated value (`'on-ship'` for wholesale). Prevents the DTC
   assumption leaking in.
3. **`revisedFrom` / `revisedOn`** — so a moved date is disclosable rather than silently
   overwritten.

---

## 3. Wholesale and market calendars

### 3.1 Dallas Market Center — the verified calendar, and a correction

The published Dallas Market Center calendar shows the following apparel-relevant dates.
**Both of our verified dates are confirmed against it**, and one common assumption is wrong:

| Event | Dates | Notes |
| :--- | :--- | :--- |
| Apparel & Accessories Market | **Aug 18–21, 2026** | Runs concurrent with WESA and AETA |
| WESA's International Western/English Apparel & Equipment Market | **Aug 18–21, 2026** | The western market |
| Apparel & Accessories Market | **Oct 20–23, 2026** | **No concurrent WESA market** |
| Apparel & Accessories Market / WESA / AETA / KidsWorld | Jan 19–22, 2027 | The next western market after August |
| Apparel & Accessories Market | Mar 16–19, 2027 · Jun 15–18, 2027 · Oct 19–22, 2027 | |

**Correction worth recording:** October 20–23, 2026 is an Apparel & Accessories Market, **not**
a WESA western market. WESA runs January and August. Copy that describes our October dates as
a "western market" would be inaccurate. Both dates remain verified as *markets*; only the
characterisation would be wrong.

Date format on the source is `Month D – D, YYYY` (e.g. `August 18 - 21, 2026`).

### 3.2 How the market presents a showroom, and what a buyer does before arriving

- The venue distinguishes **permanent showrooms** (year-round leases) from **temporaries**
  (event-only booths). Lucky & Blessed's #13656 is a permanent showroom, which is a genuine
  credibility signal a temp cannot claim — it is worth stating plainly and is verified.
- Showroom identifiers are rendered as a building prefix plus a five-digit number, where the
  leading digits correspond to the floor — e.g. `WTC 13214` on the 13th floor, which is the
  apparel and fashion-accessories floor. **Inference, not verified fact:** #13656 is therefore
  on the 13th floor of the World Trade Center building. Do not print a floor or building
  prefix until the owner confirms it.
- Pre-market buyer tooling is: an exhibitor/brand directory, campus maps, a market calendar,
  and a **FastPass** digital pre-registration for qualified buyers with scan-and-go badge
  technology. Buyers register through an authenticated portal.
- The exhibitor directory allows a showroom to publish product categories, featured
  collections, showroom events and staff contacts **so buyers can schedule appointments**.
  Appointment booking is not a first-party calendar widget on the venue site; it routes to the
  exhibitor.

**Consequence:** our market surface should not try to be a booking system. Its job is to make
the appointment request trivially easy and to make the showroom findable. The venue already
owns registration and wayfinding.

### 3.3 Badge scanning already exists at this venue — in the opposite direction

Exhibitors at Dallas Market Center commonly run **lead retrieval**: scanning the QR on a
buyer's badge to capture contact details, either with a standalone 2D scanner or a phone app,
exporting to CSV. Third-party turn-key kits (iPad plus Bluetooth scanner) are sold for it.

This matters for §6(b) in two ways. First, **scanning is already native behaviour on this
floor** — the interaction needs no explanation to a buyer. Second, the existing flow is
*booth scans buyer*. Our proposal is *buyer scans garment*, which is the inverse and which
must not be conflated with badge capture. **We must not read the venue's badge.** Badge data
is the venue's, and ingesting it would be compiling personal information from a source the
buyer did not direct at us.

### 3.4 FashionGo and the B2B marketplace treatment of newness

FashionGo — a marketplace Lucky & Blessed already sells through — surfaces time to buyers
through a **"New In" navigation entry** and a **live-video commerce feature**, plus
trend-data framing. What it conspicuously does **not** surface on its public shell is granular
temporal transparency: no ship-window labels, no dated drop sections, no preorder timelines,
no trade-show scheduling. Newness is a navigation category; delivery timing is not a public
concept.

That is the low bar, and it is also the opportunity: a buyer's actual planning questions —
*when does this ship, when must I order by, what is this season called* — are answered nowhere
in the public marketplace surface.

---

## 4. Ship-window and delivery-date language in B2B apparel

This is a settled vocabulary. We should adopt it verbatim rather than invent house terms,
because buyers already read it fluently.

| Term | Definition | Owner |
| :--- | :--- | :--- |
| **Ship date** (start ship) | When the order is expected to ship | Seller sets; buyer may request |
| **Cancel date** (end date) | Deadline after which an unfulfilled order may be cancelled | Agreed by both |
| **Ship window** | The span between ship date and cancel date — weeks to months | Derived |
| **Delivery window** | A named, configured shipping period a buyer selects at order time | Seller configures |
| **At-once / immediate** | Drawn from live inventory, ships now | — |
| **Pre-book** | Sold against future production for a coming season | — |
| **Reorder** | Replenishment of a carried style | — |
| **Season** | A named merchandising period, brand-defined | Seller names |
| **OTB (open-to-buy)** | The buyer's budget for a period | Buyer |

Two mechanics deserve emphasis:

- **Orders split by ship date.** On the buyer side of a B2B platform, an order containing
  products with three different ship dates becomes three order forms. This is not a
  presentation choice; it is how receiving, invoicing and cancellation work.
- **Season naming is brand-specific and open-ended.** Platforms support dozens of concurrent
  season codes, with real-world examples ranging from `Spring/Summer` and `Fall/Winter`
  through `Pre-Fall`, `Resort`, `Holiday`, `Capsule`, to plain **monthly drops**. Delivery
  months are conventionally grouped — Spring/Summer delivering January–April, Fall/Winter
  July–October, Pre-Fall/Resort May–June, Holiday October–December.

**The last point is a direct warning for us.** `src/content/programming.ts` currently ships
an entry titled **"Fall Collection 2026" with `verified: true`**. Season names are a brand's
own vocabulary; nothing in our brand-truth corpus establishes that Lucky & Blessed calls
anything "Fall Collection 2026". Under §12 that flag is not currently earned. See §6(c).

---

## 5. Our existing model, read against the above

`src/content/programming.ts` is a good model. It is content-shaped, windowed, audience-aware,
and it already refuses to publish an unverified entry. Consumed by `promo-bar.tsx`,
`site-header.tsx`, `new-arrivals/page.tsx` and `search/page.tsx`.

Three defects and one absence surfaced while reading it against the research.

### 5.1 `audience` is declared but never enforced — latent restricted-surface bug

`ProgrammingEntry.audience` is `'public' | 'wholesale'`, but `liveProgramming()` filters only
on `status`, `verified`, the date window and `kind`. It **never reads `audience`**. Every
consumer — including `promoBarEntry()`, which drives the public promo bar above the header —
therefore renders wholesale entries to anonymous visitors.

No entry currently sets `audience: 'wholesale'`, so this is latent rather than live. But the
entire point of §6(a) below is to add buyer-facing calendar entries, and the first one added
would publish itself to the open web. **Fix before any wholesale entry exists**: make
`audience` a required argument of `liveProgramming`, defaulting to `'public'`, and have the
authorised surfaces opt in explicitly. A type-level default that fails *closed* is the right
shape here, consistent with `PublicProduct` having no wholesale field at all.

### 5.2 `verified: false` on a `live` entry is a silent no-op

`status: 'live'` combined with `verified: false` renders nowhere and reports nothing. That is
the safe direction, but it is an invisible trap for whoever edits this file next — they will
set an entry live, see no change, and have no signal why. Either narrow the type so a live
entry must be verified, or surface it in a development-time check.

### 5.3 Window edges resolve at build time

Documented already in the file's own comment: `liveProgramming` defaults `onDate` to
`new Date()`, and public pages are statically prerendered, so a window boundary takes effect
at the next revalidation rather than at midnight. Tolerable for a market banner with a
month-long window. **Not tolerable for a dated drop or a preorder close date**, which are the
two things §6(a) adds. Any surface that renders a same-day boundary needs an explicit
revalidation cadence, and any *time*-of-day boundary needs to not exist (§6(c), item 7).

### 5.4 There is no calendar *surface* — only entries

Entries render as a promo line, a nav item and a page heading. Nothing renders the calendar
*as a calendar*. That is the gap §6(a) fills.

---

## 6. What Frontier House should build

### (a) A visual drop calendar — one dataset, two renderings

**The governing principle: the calendar is a single set of dated records, and audience
changes what is *shown*, never what is *true*.** This is the §7 experience-mode rule applied
to time. A buyer and a consumer looking at the same August week must never be able to derive
contradictory facts.

#### The data shape

Extend `ProgrammingEntry` with an optional, additive block. Existing entries stay valid.

```ts
/** Buyer-relevant scheduling. Every field is owner-supplied; none is derived or inferred. */
export type ProgrammingSchedule = {
  /** Named delivery window this entry belongs to. Owner vocabulary, never generated. */
  readonly deliveryWindow?: string
  /** Last date an order against this entry may be placed. */
  readonly ordersCloseOn?: string
  /** The window in which goods ship. Both dates, or neither. */
  readonly shipWindow?: { readonly start: string; readonly end: string }
  /** Trade-show presence. Only for `kind: 'market'`. */
  readonly venue?: {
    readonly name: string
    readonly showroom: string
    /** Appointment contact route. Never an embedded third-party booking widget. */
    readonly appointmentHref: string
  }
}
```

Add `schedule?: ProgrammingSchedule` to `ProgrammingEntry`, and make `audience` enforced
(§5.1).

#### What each audience sees from the same record

| Field | Consumer / anonymous | Approved buyer |
| :--- | :--- | :--- |
| Title, statement, link | Yes | Yes |
| Drop identity | **Date only** — "New this week", with a dated permalink | Same date, plus the delivery window name |
| Availability | Coarse state per style: In stock · Pre-order · Waitlist · Discontinued | Same states — **plus** pack depth and MOQ progress inside the session |
| Ship window | Only where a style is `pre-order`, and only as owner-supplied text | Always, per delivery window |
| Orders close on | Not shown | Shown, with days remaining as a static count |
| Market dates | Shown — dates, showroom number, "plan your visit" | Shown, plus appointment request and the line that will be shown |
| Price, pack price, MSRP, minimum progress | **Absent from the type** | Server-rendered in session |

The asymmetry is *relevance*, not secrecy, and it is important to be precise about which.
**Dates are not restricted data.** §11's restricted list is pricing, packs, minimums, MSRP,
terms, credit, order history and buyer identity. A ship window is a public fact about a
garment. What makes a calendar entry restricted is **attachment to a price** ("pre-book at
$X until Y") or **attachment to an order** (`Order.shipWindow`, which is restricted because
the whole order is). Over-restricting dates would cost us the SEO and accessibility surface
for no security gain; under-restricting a price-bearing date would be a §11 failure. Encode
the distinction in the type — a `ProgrammingSchedule` carries no `Money` field, ever.

#### The surface

A dated, server-rendered list. Not a grid calendar widget — a buyer plans in weeks and
seasons, not in day cells, and a month grid is a poor fit for a four-day market and a
three-month ship window on the same screen.

- **Route:** `/calendar` public, mirrored inside `/trade` for the buyer view.
- **Rendering:** one row per entry, grouped by month, `<time datetime="...">` on every date so
  the machine-readable value and the display string can never drift.
- **Order:** ascending by start date, with a single "now" marker between past and future.
  Past entries stay on the page, greyed and still linked.
- **No countdown.** Static dates, rendered server-side. Rationale is threefold: WCAG 2.2.2
  treats auto-updating information as requiring a pause/stop/hide control unless essential
  (§8), a ticking clock in a statically prerendered page is wrong the moment it is served
  (§5.3), and the scarcity framing contradicts our verified fill rate (§1.2). If a countdown
  is ever mandated, the only acceptable form is: client-only, day-and-hour granularity,
  `aria-live="off"`, absent under `prefers-reduced-motion`, and with the absolute date always
  present beside it as the primary fact.
- **Drop identity is a date, never a number.** No "Drop 014". A sequence number asserts a
  history of numbered drops that does not exist, and the first one shipped would be a
  fabricated claim under §12. The permalink is the date: `/new-arrivals/2026-08-10`. This is
  already anticipated in `new-arrivals/page.tsx` ("a dated permalink per drop is the next
  slice").
- **Dated drop pages are permanent.** 200 forever, indexable, never redirected, never 404.
  Availability data carries the truth about what is left. This matches observed practice and
  costs nothing.
- **Newness is also a sort and a facet**, not only a page — the Tecovas pattern. `sort=newest`
  already exists in `ProductQuery`; expose it in the facet panel so a thin week degrades into
  an ordinary catalogue rather than an empty announcement.
- **Waitlist becomes a route.** `waitlist` is already an `Availability` value; give it a
  standing, crawlable listing rather than a per-product modal.

#### Season changeover

The changeover rule follows from `Availability` and needs no new state: a style leaving the
line becomes `discontinued`, not deleted. Its page stays up, stays indexed, and says so. A
retailer who bought it last season needs the page to keep existing so they can identify what
they carry. Deleting product pages at season end is the single most common own-goal in this
category and it destroys accumulated search equity.

---

### (b) Market mode — the Dallas showroom on a tablet

**Concept.** At showroom #13656 during market, a garment carries a QR on its hangtag. A buyer
scans it with the booth tablet or their own phone, lands on the product page, adds it to a
**saved rack**, and the rack survives the appointment — arriving in their account as a draft
order they can finish, share with a partner, or hand to the rep.

**Verdict: feasible, and smaller than it looks — with one blocking security problem that
dictates the entire design.**

#### What already exists

Nearly all of it. This is a naming and session problem, not a commerce-engine problem.

- `Order` already has `status: 'draft'`, `lines`, `shipWindow` and a `buyerId`.
- `src/data/order-repository.ts` already exposes `addToOrder`, `setOrderLineQuantity`,
  `submitOrder`, `reorder`, with a `NotAuthorisedError`.
- `src/features/order/actions.ts` already re-derives the session server-side on every action
  and refuses to accept a buyer id, tier or price from the client.
- `/trade/order` and `/trade/orders/[id]` already render an order.
- `src/domain/assortment.ts` already builds a plan against real prepacks and prices and calls
  the result a starting draft order.

**The "saved rack" is a named draft order.** Do not build a parallel concept.

#### The blocking problem: a shared device

`src/auth/session.ts` issues `lb_session` as an httpOnly cookie with an **eight-hour**
max-age carrying a `buyerId`. A booth tablet with one browser profile and a queue of
appointments means buyer A's session is live during buyer B's appointment — and an authorised
session is precisely the context in which wholesale prices, pack costs and minimum progress
render. **An authenticated shared tablet is a restricted-pricing leak with a physical attack
surface**, which is the exact failure the whole authorisation design exists to prevent.

Eight hours is longer than a market day session should be, and "sign out" on a busy booth is
the step that gets skipped.

#### The design that resolves it: the tablet is never authenticated

**Recommended for Phase 1 — anonymous rack plus claim code.**

1. The tablet runs the **public** surface. No buyer session, no `lb_session` cookie, no
   restricted field anywhere in the render tree. The `PublicProduct` type makes this
   structurally guaranteed rather than a matter of discipline — there is no price to leak.
2. Scanning a hangtag opens `/product/{slug}` and offers **Add to rack**. The rack is a
   server-side record keyed by a signed, short-lived cookie scoped to the *device*, holding
   **product ids and quantities only**.
3. At the end of the appointment the tablet shows a **claim code** — a short alphanumeric and
   a QR of a claim URL, single-use, expiring in minutes.
4. The buyer scans it **with their own phone**, signs in as themselves, and the rack transfers
   into their draft order. Prices appear for the first time, on the buyer's own device, inside
   their own authorised session.
5. "End appointment" clears the device rack. An idle timeout does the same automatically.

This preserves the permission boundary exactly, adds no new role, requires no new price
surface, and fails closed at every step: an unclaimed rack expires into nothing.

**Alternative, later — rep-attributed ordering.** A `rep` session kind selects a buyer account
and writes a draft order on their behalf, which is what B2B platform reps do on iPads today.
It is more capable and it is what a rep will eventually ask for. It also needs a new role, an
audit trail, per-buyer scoping, and it puts restricted pricing on a screen in a public room.
Not Phase 1.

#### Rules that fall out of the design

- **The QR encodes a public product URL and nothing else.** No price, no token, no buyer id,
  no session, no campaign parameter carrying anything restricted. Our existing **slug-purity
  CI test** (`/\/\d{1,3}-\d{2}-[a-z]/` matches nothing) therefore already covers printed
  hangtags for free — a pleasing property worth stating in the test's own comment.
- **Printed QR codes make slugs a physical commitment.** Once tags are printed, a slug change
  breaks a physical object in a warehouse. Our product route is already `/product/[slug]` —
  **category-free**, which means the unresolved taxonomy decision (D-04) does not invalidate
  printed tags. Protect that property explicitly: category routes must remain *views* over
  products, never the canonical product URL. This materially lowers the cost of D-04.
- **Offline tolerance is achievable only in the anonymous design.** Showroom connectivity is
  unreliable and a market tool that dies on a dropout is worse than paper. Because the rack
  holds only public ids, a service worker may cache public product pages and queue rack
  additions without ever caching a restricted value. The rep-attributed design cannot be made
  offline-safe without caching prices, so it must be online-only. Note this is the one place
  where the security constraint and the reliability constraint happen to agree.
- **Market mode is the lightest surface in the build.** Booth hardware is old tablets on
  venue wifi — §10's "test on a mid-range device" rule with teeth. Zero WebGL, zero film,
  zero motion islands. §7 already defaults an authenticated wholesale buyer to INSTANT SHOP;
  market mode should force it and say so visibly.
- **Touch targets at 44 px, not 24.** §8 sets 24 × 24 as the floor. A tablet held at a booth,
  possibly with a garment in the other hand, is the case that justifies exceeding it. No
  drag-to-reorder in the rack without button equivalents (2.5.7).
- **Never display a previous buyer's name, and never read the venue badge.** Lead retrieval is
  the venue's mechanism and the buyer's data; our claim code is ours. Keep them separate.

#### What it would require

| Item | Size | Blocked on |
| :--- | :--- | :--- |
| Anonymous rack record + device-scoped signed cookie | Small | — |
| Claim-code issue/redeem, single-use, short TTL | Small | — |
| Rack → draft-order transfer | Small — `addToOrder` exists | — |
| Idle clear + "end appointment" | Small | — |
| `/market` route forcing INSTANT SHOP, 44 px targets | Small | — |
| Hangtag QR artwork and print run | **Owner** | Stable slugs; taxonomy (D-04) for nothing else |
| Service-worker offline cache of public pages | Medium | Should follow, not lead |
| Rep role + audit trail | Large | Not Phase 1 |

---

### (c) The date fields the owner must own

Nothing in §6(a) or §6(b) may ship against a date we invented. These are the fields, what is
already verified, and what is not.

| # | Field | Status | Note |
| :--- | :--- | :--- | :--- |
| 1 | **Market name, start, end** | **Verified** for Aug 18–21 2026 and Oct 20–23 2026 | Confirmed against the venue calendar. Oct is **not** a WESA western market (§3.1) |
| 2 | **Showroom number** | **Verified** — #13656 | Building prefix and floor are **inference**; do not print until confirmed |
| 3 | **Market hours; whether L&B exhibits at a given market** | **Not owned** | Presence at Aug and Oct 2026 is our stated calendar; presence at Jan 2027 is unconfirmed. Do not extend the calendar forward |
| 4 | **Appointment contact / route** | **Not owned** | Needs an owner-supplied address or form target. Until then the market entry links to `/wholesale` and says "request an appointment", not "book" |
| 5 | **`newArrivalOn` per style** | Exists in the type; **fixture data today** | This is the drop calendar's spine. Must come from the owner's publishing system |
| 6 | **Delivery window / season names** | **Not owned** | Season vocabulary is brand-specific (§4). See the "Fall Collection 2026" flag below |
| 7 | **`preOrder.shipWindowStart` / `End`** | In the type; fixture | Must be owner data. Never derived from a lead time |
| 8 | **`preOrder.closesOn`** | **Missing from the type** | Add it. A preorder with no close date cannot tell a buyer when to act |
| 9 | **`preOrder.terms` + charge timing** | In the type; unowned | Wholesale convention is payment on ship, not on order. Cancellation policy is an owner decision |
| 10 | **Order deadline per delivery window** | **Missing** | The brand's cut-off, distinct from the buyer's cancel date |
| 11 | **Timezone** | **Deliberately absent** | Everything is date-only (`YYYY-MM-DD`). **Keep it that way.** A time-of-day boundary needs a declared timezone, a client clock and a revalidation strategy, and buys nothing our cadence needs |
| 12 | **Restock date for a `waitlist` style** | **Not owned** | A waitlist with no date is honest. A waitlist with a guessed date is a fabricated claim (§12) |

#### Two integrity traps specific to this dimension

- **2.64-day processing is *processing*, not delivery.** It is verified and it is attractive,
  and it will be tempting to render as "ships in 3 days" or to derive a delivery estimate from
  it. Processing time is not transit time. Rendering it as a delivery promise converts a
  verified operational metric into an unevidenced commitment.
- **100% fill rate is historical.** It describes orders already filled. It is not a
  forward-looking availability guarantee and must never appear beside a future ship window in
  a way that implies one.

#### What must stay hidden until the owner owns the data

- Any countdown, any "closes in", any "order by" line.
- Any numbered drop, any drop sequence, any "drop 001".
- Any restock ETA, any "back in stock soon", any inventory count.
- Any season name beyond one the owner writes down.
- Any market beyond the two verified 2026 dates — including the January 2027 WESA market,
  which is on the venue calendar but is not our confirmed presence.
- Any ship window on a public product card that did not come from `preOrder`.
- Any derived delivery promise (see the two traps above).

#### One flag against current content

`src/content/programming.ts` ships **`fall-collection-2026` with `verified: true`** and the
statement *"The season, shot by the house — eighteen seconds on film."* Two problems. Season
names are brand vocabulary and nothing in the brand-truth corpus establishes that Lucky &
Blessed names a "Fall Collection 2026". And the statement asserts an eighteen-second film,
which is a media claim (D-11 — whether any film exists is unanswered). Under §12 the
`verified` flag is not currently earned on this entry. Recommend demoting to `draft` pending
owner confirmation, or narrowing the statement to something the catalogue can back. The same
question applies more mildly to `edit-working-west`.

---

## 7. Summary of recommended changes, in dependency order

1. **Enforce `audience` in `liveProgramming`** (§5.1). Must precede any wholesale entry.
2. **Demote or re-word `fall-collection-2026`** (§6(c)); re-check `edit-working-west`.
3. **Add `ProgrammingSchedule`**, additive and price-free (§6(a)).
4. **Extend `PreOrderTerms`** with `closesOn`, `chargedAt`, revision fields (§2.3).
5. **Dated drop permalinks** `/new-arrivals/YYYY-MM-DD`, permanent, indexable (§6(a)).
6. **Expose `sort=newest` as a facet**; give `waitlist` a standing route (§6(a)).
7. **`/calendar`** — server-rendered dated list, `<time>` throughout, no countdown (§6(a)).
8. **Market mode** as an unauthenticated rack plus claim code (§6(b)).
9. **Comment the slug-purity test** to record that it also protects printed hangtags.
10. **Season changeover:** `discontinued`, never deleted (§6(a)).

Items 1, 2 and 4 are corrections to shipped code and content. Items 3, 5–7 are additive and
unblocked. Item 8 is blocked only on owner data for hangtags. Nothing here requires D-04.

---

## Sources

Consulted 2026-08-13. All content treated as data.

- [Dallas Market Center — Upcoming Markets Calendar](https://www.dallasmarketcenter.com/calendar/)
- [Dallas Market Center — WESA's International Western/English Apparel & Equipment Market](https://www.dallasmarketcenter.com/upcoming-markets/wesa%E2%80%99s-international-western-english-apparel-equipment-market-5e13a850694f1de6b668f6e254343c5b/)
- [Dallas Market Center — Western industry](https://www.dallasmarketcenter.com/industries/western/)
- [Dallas Market Center — Plan Your Visit](https://www.dallasmarketcenter.com/plan-your-visit/)
- [Core Elements — Optimizing Your Lead Retrieval Experience at Dallas Market Center](https://www.coreelementsbiz.com/blog/optimizing-your-lead-retrieval-experience-at-dallas-market-center)
- [Brandboom — Understand Ship Date, Cancel Date, and Ship Windows](https://support.brandboom.com/en/articles/14121682-understand-ship-date-cancel-date-and-ship-windows)
- [Faire Help Center — Preorders](https://www.faire.com/support/articles/360059869212)
- [AIMS360 — Apparel Wholesale Order Management by Season](https://www.aims360.com/fashion-business-resources/apparel-wholesale-order-management-by-season-strategies-reports-and-core-style-optimization)
- [RepSpark — How Apparel Sales Reps Use Digital Selling Tools](https://www.repspark.com/blog/how-apparel-sales-reps-use-digital-selling-tools)
- [Timesact — Mastering the High-End Apparel Drop](https://timesact.com/2026/06/01/premium-apparel-exclusive-drop-preorder-strategy/)
- [Sendero Provisions — New Arrivals](https://senderopc.com/collections/new-product-arrivals)
- [Kimes Ranch](https://www.kimesranch.com/)
- [Tecovas — New Arrivals](https://www.tecovas.com/collections/new-arrivals)
- [Miss Me — New Arrivals](https://www.missme.com/collections/new-arrivals)
- [Dixxon Flannel Co. — Helpful Launch Tips](https://www.dixxon.com/pages/helpful-launch-tips)
- [FashionGo](https://www.fashiongo.net/)
- [PARKE — Pre-Order Terms & Conditions](https://parkeofficial.com/pages/pre-order-terms-conditions)
