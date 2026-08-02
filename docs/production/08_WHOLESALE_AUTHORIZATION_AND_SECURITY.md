# 08 — Wholesale Authorization and Security

> **The audit's central structural finding: no design source expresses an authorisation
> boundary.** The wholesale showroom is drawn as a public page with prices on it; there are
> **0 forms, 0 sign-in affordances and 0 authenticated states** across all 48 exported files.
> A faithful implementation would leak buyer pricing by default. This document is the fix.

---

## 1. The permission model

### Public — always semantic, always crawlable

Product name · category · description · materials · colour · **size range** · availability
(in stock / pre-order) · editorial and campaign content · store locator · brand story ·
wholesale *information* (terms, minimum, process) · buyer application.

### Authorised buyer only

**Wholesale unit price** · pack price · **prepack composition** · **MOQ** · minimum-order
progress · **MSRP guidance** · buyer terms and credit · order history · saved assortments ·
line sheets · buyer identity · any margin data.

### Public MSRP — a conditional

`OBSERVED` — V2 Frame 6 showed **MSRP beside wholesale price**; V3 Frame 11 dropped MSRP
entirely. Recovering it is correct **for the authorised view**.

**Whether MSRP may appear publicly is an owner decision.** It is arguably a retail-facing
number rather than a restricted one, and publishing it supports MAP discipline. **Default:
authorised-only** until the owner confirms. Never infer permission from usefulness.

---

## 2. Restricted data must never appear in

Public HTML · URLs or slugs · page titles or meta tags · Open Graph · **JSON-LD** · static or
pre-rendered assets · **unauthenticated client bundles or JSON** · logs · **analytics
payloads** · third-party widget configuration · **image text** · alt text · sitemaps ·
unauthenticated API responses · error messages · cache keys that echo values.

**Two rules that follow:**

1. **Restricted pricing is server-rendered inside the authorised session.** It is never
   fetched client-side into a public shell — that pattern puts the value in a network
   response an unauthenticated client can request.
2. **Restricted pricing is semantic text.** Never drawn into canvas, never baked into an
   image. The accessibility rule and the security rule point the same way.

---

## 3. Authentication and authorisation states

| State | Sees | Route behaviour |
| :--- | :--- | :--- |
| **Anonymous** | Public product info; no price | Public routes render; `/trade/*` redirects to sign-in |
| **Applied — pending** | Public info + **application status with expected timing** | *"Approval typically takes under one business day"* — the verified figure |
| **Applied — rejected** | Public info + a route to contact | Never a dead end |
| **Approved — active** | Full buyer data | `/trade/*` renders server-side |
| **Approved — session expired** | Public info + re-auth prompt | **Must not flash restricted data before redirect** |
| **Approved — suspended** | Public info + account notice | Terms/credit issues |
| **Owner / internal** | Buyer data + operational surfaces | Separate role, separate layout |

`INFERRED` — The **pending** state matters more than it appears. It is the first thing a
prospective retailer sees after applying, and `CLAUDE.md` §11 requires the gate to read as
an invitation, not a failure.

---

## 4. Server-side enforcement

**Authorisation is decided on the server, per request, before render.** Not in a layout, not
in a client component, not in middleware alone.

- **The price field is not in the payload unless the session is authorised.** Absence, not
  hiding. A CSS-hidden price is a leak; a client-filtered array is a leak.
- **One authorisation helper, one call site per data access.** A product fetched for a public
  route and the same product fetched for a buyer route go through the same function with
  different session context, and the function decides which fields exist.
- **Deny by default.** A new field is restricted until explicitly marked public.
- **Never trust a client-supplied role, account id or tier.**

---

## 5. Caching

| Surface | Rule |
| :--- | :--- |
| Public routes | Cacheable, shared, long-lived |
| **Any authorised route** | **`Cache-Control: private, no-store`** |
| CDN | **Must never cache an authorised response.** Vary on session presence |
| Static generation | **Public data only.** No build-time render may embed a wholesale price |
| ISR / revalidation | Public only |

`INFERRED` — The highest-risk failure here is a CDN caching one buyer's authorised page and
serving it to another buyer — or to the public. **Test this explicitly.**

---

## 6. Search-engine behaviour

`/trade/*` and buyer routes: `noindex, nofollow`, excluded from the sitemap, disallowed in
`robots.txt`. Public product pages **are** indexed — with name, description, materials, size
range and availability, and **no price**. `Product` structured data is emitted **without**
`offers.price` unless a public MSRP is approved (§1).

---

## 7. Error and denial behaviour

- **Access denied** → a designed 403 explaining *how to get access*, linking to the buyer
  application. Never a raw error.
- **Expired session** → preserve intent. Return the buyer to the page they wanted after
  re-auth. **Never render restricted data before the redirect resolves.**
- **Failed authorisation lookup** → **fail closed.** Render the public view, never the
  buyer view.
- **No error message may echo a restricted value.**

---

## 8. Third-party exposure

`MEASURED` — the exports load four external origins (`cdn.tailwindcss.com` in 48/48 files,
Google Fonts, `ajax.googleapis.com` three.js **r125**, and `lh3.googleusercontent.com`) with
**no Subresource Integrity anywhere**.

**Production rules:** self-host fonts · no CDN-delivered framework or library · SRI on any
remaining third-party script · **no analytics or payment widget receives a restricted
value** · a documented allowlist of external origins, reviewed before launch.

---

## 9. Test strategy

Specified in full in [`18_TEST_AND_CI_STRATEGY.md`](18_TEST_AND_CI_STRATEGY.md). The three
that gate the build:

1. **Unauthenticated crawl assertion** — every public route, no session; assert zero
   restricted price patterns in HTML, headers, inline JSON, metadata and bundles.
2. **Slug purity assertion** — no generated URL contains a numeric price pattern. *This is
   the test that prevents D-00 from recurring.*
3. **Authorised buyer semantics** — an authenticated product page exposes wholesale price,
   MOQ, prepack and Add to Order as **semantic, keyboard-accessible HTML**.

Plus: a **cache-isolation test** (buyer A's response is never served to buyer B or to
anonymous), and a **fail-closed test** (authorisation lookup failure renders the public view).

---

## 10. What the designs already got right

`OBSERVED` — **V3.1 `12f_4` is the only frame in the corpus that designs this correctly.**
The wholesale carousel sells the *assortment* — *"TRADE AREA"*, *"Core Denim / Heavyweight
selvedge & canvas staples / **24 SKUS**"*, *FALL '24* — and gates pricing behind
**ENTER SHOWROOM**. **No price is shown.**

That is exactly the public/restricted split above, achieved visually. **Use it as the
reference for every public wholesale surface.**
