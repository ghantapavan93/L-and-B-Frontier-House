# 13 — Security and Restricted-Data Audit

**Scope:** whether the design sources expose, or lead an implementation to expose,
restricted wholesale pricing and buyer data.

---

## 1. Context — the live-site leak this must not reproduce

`VERIFIED FACT` (research corpus, OQ-19) — Lucky & Blessed's **current** site leaks
wholesale unit cost publicly:

- Product URL slugs begin with the price — `/16-00-classic-western-button-down-…`,
  `/30-00-camel-wash-stretch-denim-…` — on **17 homepage products** and **14** on the
  Aug 1 drop page
- Some product titles print the price literally — `($31.00) Stone Wash Stretch Denim Dress…`
- An Afterpay module computes on the un-gated pack total

`INFERRED` — This is a live business issue independent of this project, and it is also the
**exact failure mode the new architecture must be designed to make impossible**. An audit
that only checked the exports would miss the lesson.

---

## 2. What the exports actually contain

`MEASURED` — across 48 HTML files:

| Check | Result |
| :--- | :--- |
| Wholesale prices present | **No** — no `$7`–`$33` band values |
| Price-bearing URL slugs | **No** — exports use descriptive folder names only |
| Prices in product titles | **No** |
| Third-party payment widgets | **No** |
| Embedded buyer data / fixtures | **No** |
| `MSRP` | **0 files** |
| `prepack` | **0 files** |
| `sign in` | **0 files** |
| `<form>` | **0 files** |

`INFERRED` — **The exports do not reproduce the live leak.** They contain no wholesale
data at all — which is a clean starting point, but for a different reason than it appears:
there is no wholesale data because there is **no wholesale mechanic anywhere in the
designs**.

---

## 3. The real finding — there is no authorisation boundary

> `MEASURED` — Prices appear in **11 files**, including
> **`v3_frame_11_wholesale_showroom_and_owner_operating_world`**.
>
> `MEASURED` — The corpus contains **0 forms, 0 sign-in affordances, 0 authenticated
> states, and 0 pending-approval states.**
>
> `INFERRED` — **The wholesale showroom is designed as a public page with prices on it.**
> There is no depicted gate, no unauthenticated variant, and no distinction anywhere in the
> corpus between "public product information" and "restricted buyer pricing."

This is the security finding that matters. Not that the exports leak — they do not — but
that **the designs contain no concept of a permission boundary**, so an implementation
following them faithfully would render buyer pricing into public markup by default.

---

## 4. Price magnitude — a separate but related exposure

`MEASURED` — prices in the markup run **$45 – $1,250** (`$1,250`, `$850` ×3, `$495`,
`$480`, `$450` ×2, `$345`, `$320` ×2, `$285`, `$220`, `$195`, `$185`, `$180` ×2, `$150`,
`$145`, `$95`, `$45`).

`VERIFIED FACT` — Actual wholesale is **$7–$33**; implied retail **$20–$85**.

`INFERRED` — These are **fictional consumer prices 10–40× the real product**. Two
consequences:

1. **They must never ship as fixtures.** A published `$1,250` on a Lucky & Blessed surface
   is a false product claim under `CLAUDE.md` §12, regardless of intent.
2. **They are not wholesale data**, so they are not a leak — but they demonstrate that the
   design has no model of what a real price looks like, which is exactly the condition
   under which a developer wires the wrong field to the wrong surface.

---

## 5. Third-party exposure surface

| Dependency | Files | Concern |
| :--- | :--- | :--- |
| `cdn.tailwindcss.com` | **48** | Third-party script on every page; supply-chain surface |
| `fonts.googleapis.com` / `gstatic.com` | 137 | Third-party requests on every route; privacy/consent implications |
| `ajax.googleapis.com` three.js **r125** | 5 | **Five-year-old** library from a third-party CDN, unpinned by integrity hash |
| `lh3.googleusercontent.com` | ~30 | All imagery on Google infrastructure outside project control |

`MEASURED` — **No Subresource Integrity attributes anywhere.** `INFERRED` — Acceptable in a
design export; unacceptable in production. Self-host, pin, and add SRI.

---

## 6. Production rules this audit recommends

`RECOMMENDATION` — the boundary the designs do not currently express:

**Public, semantic, crawlable — always**
Product name · category · description · materials · colour · size range · availability ·
editorial content · store locator.

**Restricted — authorised contexts only**
Wholesale unit price · pack price and pack structure · minimum-order progress · MSRP
guidance · buyer terms and credit · order history · buyer identity · any margin data.

**Restricted pricing must never appear in:**
public HTML · URLs or slugs · page titles or meta tags · structured data · static or
pre-rendered assets · client bundles or JSON payloads served unauthenticated · logs ·
analytics events · third-party payment widget calculations · image alt text · sitemaps.

**And critically:** restricted pricing must be **server-rendered inside the authorised
session**, not fetched client-side into a public shell. Per `CLAUDE.md` §11, permitted
pricing for an authorised buyer must be **semantic text**, never drawn into WebGL or baked
into an image — the accessibility rule and the security rule point the same way.

---

## 7. Enforceable tests

`RECOMMENDATION` — three CI tests that make the boundary structural rather than
aspirational:

1. **Unauthenticated crawl assertion.** Fetch every public route with no session; assert
   **zero** wholesale price patterns in HTML, headers, inline JSON, or metadata. Fail the
   build otherwise.
2. **Slug purity assertion.** Assert no generated URL contains a numeric price pattern.
   This directly prevents the live site's OQ-19 failure from recurring.
3. **No-JS product assertion.** Fetch each public product page with JavaScript disabled;
   assert product **name** and **public** price are present. This is the same test that
   defends against the atmosphere layer swallowing the commerce layer
   (`CLAUDE.md` §11) — one test, two protections.

`RECOMMENDATION` — Add a fourth at fixture level: **no fixture price may fall outside the
verified band** without an explicit annotation marking it as illustrative. The
`$45–$1,250` values in the current exports would all fail that check, which is the point.

---

## 8. Verdict

| Question | Answer |
| :--- | :--- |
| Do the exports leak wholesale prices? | **No** |
| Do the exports contain restricted buyer data? | **No** |
| Do they express an authorisation boundary? | **No — none exists anywhere** |
| Would a faithful implementation leak? | **Yes, by default** — the wholesale showroom is drawn as a public page with prices |
| Do they contain false price claims? | **Yes** — $45–$1,250 against a $20–$85 reality |
| Third-party exposure | **High** — 4 external origins, no SRI, one five-year-old library |
