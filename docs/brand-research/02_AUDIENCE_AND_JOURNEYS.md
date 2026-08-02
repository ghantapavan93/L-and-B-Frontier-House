# 02 — Audience and Journeys

**Research date:** 2026-08-01

---

## 0. The honesty clause

The brief asks for ten audience profiles. Before any of them: **only four are currently
customers.**

`VERIFIED FACT` — Lucky & Blessed sells only to approved retailers with a sales tax ID
and does not sell to consumers ([00_BRAND_TRUTH.md](00_BRAND_TRUTH.md) §1).

So the ten profiles split into two classes, and **they must never be presented as
equivalent**:

| Class | Audiences | Status |
| :--- | :--- | :--- |
| **Evidenced** | Boutique owner · Wholesale buyer · Sales representative · Brand operator | Real, paying, today |
| **Prospective** | All six consumer profiles | Hypotheses. No transactional relationship exists. |

Consumer profiles below are built from **product evidence** (what L&B makes, at what
price, with what motifs) and **distribution evidence** (which stores stock it), not from
L&B customer data, which does not exist for consumers. They are labeled
`REASONABLE INFERENCE` throughout and must not be cited as verified customer research.

`OPEN QUESTION` — Does L&B hold any consumer-side data at all: email list, social
audience demographics, Meta Pixel audiences, retailer sell-through reports? If yes, it
would upgrade six of these profiles from inference to evidence. (OQ-09)

---

## Part A — Evidenced audiences

### A1. The boutique owner

The primary customer. Usually owner, buyer, merchandiser and marketer in one person.

| Dimension | Finding |
| :--- | :--- |
| **Primary intent** | Fill next season's rack with pieces that sell through and that the shop three towns over does not have |
| **Emotional motivation** | Pride in curation; fear of being undifferentiated. L&B's own Faire copy targets this exactly: *"styles your competition simply doesn't offer"* (`VERIFIED FACT`) |
| **Purchase anxieties** | Dead stock. Cash tied up in prepacks of six that do not move. Fill-rate failure after committing an ad campaign to a style. Ordering plus assortment blind. |
| **Information needed** | Wholesale price, MSRP guidance, pack structure, ship date, in-stock vs pre-order, size range, fabric, what is selling |
| **Device behaviour** | `REASONABLE INFERENCE` — Phone during the day on the shop floor; desktop at night for order writing. Mobile browsing, desktop committing. |
| **Discovery** | Dallas Market Center showroom, FashionGo, Faire, sales rep, email/text, Instagram |
| **Conversion path** | Approved account → browse drop → build order to $50+ minimum → often reorder proven sellers |
| **Trust requirements** | Fill rate, ship speed, someone who answers the phone. L&B has 100% fill rate and 4.7–4.76 ratings across 615 reviews and **surfaces none of it** (`VERIFIED FACT`) |
| **Accessibility** | Long sessions, dense grids, often mid-40s+ eyesight. Small type on image-only content is a real barrier. |
| **Memorable** | Seeing the whole drop fast; a linesheet that exports cleanly; knowing what their peers reordered |
| **Causes abandonment** | Hidden prices before approval; inability to filter 235 items; no export; slow grids |

> **Design consequence.** For this audience, speed and density beat cinema. Any
> cinematic layer must be **skippable in one action and never on the reorder path.**
> This is the strongest argument for the INSTANT SHOP mode
> ([05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md)).

### A2. The chain / multi-store buyer

`VERIFIED FACT` — The store locator has a dedicated **Cavender's** filter, so at least
one national western chain stocks L&B.

Differences from A1: buys deeper and earlier, plans to a seasonal calendar, needs
consistent sizing and repeatable quality, requires linesheets and often EDI or
structured data. Anxiety is not "will it sell" but "can you supply 40 doors on time".

`RECOMMENDATION` — Vertical integration and a 100% fill rate are precisely this buyer's
decision criteria. Say them plainly, with the numbers.

`OPEN QUESTION` — Is the Cavender's relationship publicly citable? (OQ-06)

### A3. The sales representative

`REASONABLE INFERENCE` — Standard for this channel; not directly evidenced.
Works the showroom during market weeks (Aug 18–21, Oct 20–23) and territory in between.

Needs: a linesheet that works on a tablet with bad convention-centre wifi, the ability to
build an order *with* a buyer present, and instant access to price and availability.

> **Design consequence.** A market-week interface used standing up, offline-tolerant,
> is a genuine and unglamorous requirement. Cinematic scroll choreography is actively
> hostile in this context.

### A4. The brand operator

Internal. Merchandises the daily drop, publishes the monthly lookbook, manages market
prep, approves accounts.

`VERIFIED FACT` — The current workflow leaks: `april-2026-clone.html` and
`may-2026-clone.html` exist as live URLs, and a nav item labelled "JANUARY 2026" points
at `january-2025.html`.

`OBSERVATION` — These are the fingerprints of page-duplication publishing. Someone
copies last month's page to make this month's. It works, and it silently accumulates
errors.

> **Design consequence.** If publishing the daily drop is harder in the new platform
> than duplicating an HTML page, **the new platform will not be used.** Authoring
> ergonomics are a launch requirement, not a phase-two nicety. A cinematic homepage that
> only an engineer can update will be stale within a month.

---

## Part B — Prospective consumer audiences

All `REASONABLE INFERENCE`. Derived from product evidence and stockist geography.

### B1. The western lifestyle customer

Lives the culture rather than costuming it — ranch country, small-town Texas and
surrounding states, where the stockists actually are (Mineral Wells, Weatherford,
Houston). Buys wild rags and pearl snaps because they are worn, not ironic.

Anxieties: authenticity policing, and fit through hips and thighs in denim.
Trust: does this brand know what a buck-stitch is. **L&B does** — its category names
prove it.
Abandonment: any whiff of costume-shop or theme-park West.

### B2. The rodeo / NFR / festival shopper

`VERIFIED FACT` — L&B's Faire copy explicitly names this: *"designs for rodeo season,
NFR, everyday cowboy chic"*.

Deadline-driven and event-anchored — NFR, stock shows, concerts, festivals. Wants an
outfit for a **specific date**, so shipping certainty outranks price. Peak intent is
seasonal and predictable.

> **Design consequence.** Event-anchored merchandising ("Shop NFR", "Rodeo Season") is
> evidenced, ownable, and far more useful than generic seasonal collections. Delivery
> dates must be unambiguous near events.

### B3. The fashion-forward crossover customer

The brand's own stated target: *"A western background with a crossover to the young
contemporary"* (`VERIFIED FACT`).

Wears a fringe jacket with modern tailoring. Western is one reference in a broader
wardrobe, not an identity. Discovers via Instagram, TikTok and Pinterest — all channels
L&B already runs.

Anxiety: looking like a costume. Needs **styling context**, which is exactly what a
shoppable lookbook provides and a flat JPEG does not.

> **Design consequence.** This is the audience the cinematic layer is genuinely for.
> They respond to editorial and campaign work. They are also the audience most likely to
> be lost by a slow site.

### B4. The plus-size customer

`VERIFIED FACT` — L&B claims inclusivity *"to all ages, shapes, and sizes"*, and
`VERIFIED FACT` — architects plus as a separate parallel catalog with separate SKUs.

Arrives braced for disappointment: fewer styles, worse photography, an afterthought
section. **The current architecture confirms that expectation.**

Needs: the same garment, the same styling, the same photography, real measurements, and
to be shown the clothes on a body like theirs.

> **Design consequence.** Merging the catalog is the single most meaningful inclusivity
> action available, and it is structural rather than cosmetic — no amount of warm
> copywriting compensates for a separate, smaller store. See
> [01_PRODUCT_AND_CATEGORY_MAP.md](01_PRODUCT_AND_CATEGORY_MAP.md) §1.1, and the honesty
> caveat in OQ-08.

### B5. The parent buying girls' clothing

`VERIFIED FACT` — A Girls category exists; boys' does not.

Buying for an event or a matching moment. Wants speed, durability and sizing certainty.
Frequently buys for herself in the same session.

> **Design consequence.** Cross-sell between women's and girls' is natural and low-risk.
> Never gate this audience behind a cinematic entry sequence — intent is high and
> patience is low.

### B6. The gift and occasion buyer

Low category knowledge, high anxiety, deadline-driven. Needs sizing help, gift
receipts, and clear delivery dates. Currently unserved in every respect —
`VERIFIED FACT`: the site's return policy is *"All Sales Are Final"*, which is normal
wholesale practice and **completely unacceptable in a consumer context.**

> **Design consequence.** If DTC ever launches, returns policy is a business
> prerequisite, not a UX detail. Flagged in OQ-01.

---

## Part C — What every audience shares

Three requirements appear in all ten profiles. They should be treated as
platform-level invariants.

1. **Fit certainty.** Buyers need measurements to merchandise; consumers need them to
   avoid returns; plus-size customers need them most. Today it is one JPEG with no text.
   `VERIFIED FACT`.
2. **Speed on the path to product.** Boutique owners scanning 235 styles, reps on
   convention wifi, and parents buying before an event all lose patience at the same
   point. Every audience needs to reach a product in a small number of actions.
3. **Proof.** Fill rate and review volume for buyers; styling and real bodies for
   consumers; both are trust, and both are currently invisible.

---

## Part D — The stereotype the brief warned about

The brief says: *do not reduce the audience to a stereotypical "cowgirl."*
The evidence independently supports that instruction.

- The brand describes **crossover to young contemporary**, not pure western.
- Its own word for its customer is *"fiercely independent, unique"*, spanning
  *"all ages, shapes and sizes"* — not a demographic, a **disposition**.
- The catalog runs from wild rags to corsets to boyfriend jeans to velvet burnout: at
  least three different style identities.
- Distribution spans a national boot chain and contemporary boutiques.

`RECOMMENDATION` — Model the audience by **relationship to western identity**, not by
age or body type:

| Axis | Anchor | Style expression |
| :--- | :--- | :--- |
| **Lived** | Western is who I am | Pearl snap, wild rag, honest denim |
| **Celebrated** | Western is an event I show up for | Rhinestone, fringe, "Yee Haw", rodeo prints |
| **Referenced** | Western is a note in my wardrobe | Western blazer, corset, contemporary tailoring |

All three must be served by the same platform without any one being framed as more
authentic. L&B already makes product for all three. The site currently expresses none
of the distinction.

---

## Cross-references

- Brand facts and price tier → [00_BRAND_TRUTH.md](00_BRAND_TRUTH.md)
- Taxonomy and the plus-size architecture → [01_PRODUCT_AND_CATEGORY_MAP.md](01_PRODUCT_AND_CATEGORY_MAP.md)
- Experience modes per audience → [05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md)
- Feature classification → [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md)
- Unresolved questions → [10_OPEN_QUESTIONS.md](10_OPEN_QUESTIONS.md)
