# 19 — Analytics, SEO and Observability

**One rule governs all three: restricted wholesale data never enters a measurement, indexing or
logging surface.** Analytics payloads, structured data, page titles, sitemaps and logs are all
listed explicitly in the permission boundary (`08`) — they are the easiest places for a leak to
appear and the hardest to notice.

---

## 1. SEO

### What is indexable

**Public and crawlable:** product name, category, description, materials, colour, size range,
availability, editorial content, store locator, showroom and market information.

**Never indexable:** wholesale unit price, pack price and structure, minimum-order progress,
MSRP guidance, buyer terms, order history, buyer identity.

### Structured data

`Product` with `name`, `description`, `material`, `color`, `size`, `image`, `brand`.

**`offers` is omitted entirely on public routes.** Not zeroed, not obfuscated — **absent**.
Emitting `offers` with a wholesale figure would publish restricted pricing into the single most
aggressively crawled field on the page.

`Organization` carries the verified showroom location and market dates. **No `foundingDate`** —
the sources fabricate two mutually inconsistent ones and neither is true.

### Mechanics

- **Server-rendered HTML is the indexable surface.** Test 1 is simultaneously the SEO test:
  a product absent from the DOM is absent from search, from screen readers, from Ctrl-F, and
  from the 5%-plus of sessions with no WebGL or failed JavaScript.
- **Slugs are semantic and price-free.** The slug-purity assertion (`18`) is an SEO rule and a
  security rule at once.
- **The Drop is a dated permalink**, not a rotating page — every drop stays addressable.
- **Video transcripts are the SEO surface for cinematic pages.** A silent campaign film has no
  indexable content without one.
- **Alt text is authored, meaningful, and never contains price.**
- **Canonical URLs on filtered views;** facet permutations are `noindex, follow`.
- `robots.txt` disallows every `(trade)` and `(internal)` route. **This is a courtesy, not a
  control** — the authorisation layer is the control.

---

## 2. Analytics

### Event allowlist

Events are **allowlisted, not filtered**. A denylist fails open; an allowlist fails closed.

| Public events | Authorised events |
| :--- | :--- |
| page view (route, mode, tier) | authorised PDP view |
| product view (`productId`) | add to order (`productId`, `packId`, `quantity`) |
| category / facet applied | minimum threshold crossed (boolean) |
| search performed (query, result count) | line sheet exported |
| media play / pause / complete | order submitted (`orderId`) |
| mode changed (from, to, resolvedBy) | reorder initiated |
| wholesale application started / submitted | |

**Authorised events carry identifiers and quantities. They never carry monetary values.**
Conversion value reporting, if required, is computed **server-side inside the session** and sent
to a first-party endpoint — never assembled in the browser and never handed to a third-party tag.

### Prohibitions

- **No third-party tag receives a price, pack total, or buyer identity.**
- **No session replay on any `(trade)` route.** Replay tools capture the DOM, which on an
  authorised page *is* the restricted data.
- **No price in a URL parameter**, therefore none in a referrer.
- **No payment widget that computes on an un-gated pack total** — this is precisely the failure
  pattern found live (`21`).

---

## 3. Real user monitoring

Segment **by device tier and by experience mode.** Aggregate CWV hides the failure: a p75 that
passes overall can conceal a CINEMA-mode INP disaster on budget Android.

| Metric | Budget | Note |
| :--- | :--- | :--- |
| LCP p75 mobile | ≤ 2.0s | |
| **INP p75** | **≤ 150ms** | **The category fails here, not on image weight** |
| CLS p75 | ≤ 0.05 | |
| **LoAF `blockingDuration`** | tracked | The diagnostic that explains an INP regression |

**Reference floor:** Shopify sits at **76% CWV-good**. A bespoke build landing below a stock
Shopify theme is a measurable regression. Luxury is the most speed-sensitive vertical measured —
Deloitte found **+40.1% product-detail-to-add-to-basket progression per 0.1 second**.

Also tracked: WebGL context-loss rate · fallback-tier activation rate · reduced-motion share ·
mode distribution · media start failure rate (iOS Low Power Mode disables autoplay) ·
`generated-placeholder` render attempts (should be zero in production).

---

## 4. Observability and logging

- **Structured logs. No restricted field is ever logged** — not at debug level, not in an error
  payload, not in a stack trace's serialised props.
- **Errors are redacted before transport.** A crash on an authorised PDP must not ship the
  component's props to a third-party error service.
- **Authorisation events are audited** — application submitted, approved, rejected, suspended,
  expired; sign-in; line-sheet export. Who, what, when. No prices.
- **Cache-isolation alarm** — any authorised response served from a shared cache is a P1.
- **Continuous production assertion:** an alert fires if any restricted pattern appears in a
  public response. This is Test 2 running forever, not only in CI.

---

## 5. Owner reporting

The owner's real questions are operational: what sold, to whom, what is short, which
applications are waiting, which products are incomplete. **All of it is `(internal)`, authorised,
and server-rendered.**

`INFERRED` — The verified operational metrics — **100% fill rate**, **2.64-day processing**,
**4.76/5 across 262 reviews** and **4.7/5 across 353 reviews** — are already true and currently
surfaced nowhere. Instrument them so they stay true and can be published honestly. **Real numbers
only; never round them up.**
