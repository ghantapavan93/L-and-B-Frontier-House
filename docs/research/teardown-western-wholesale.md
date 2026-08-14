# Teardown — Western-industry wholesale gating, registration and trade catalogues

**Date:** 2026-08-13 · **Method:** unauthenticated observation only — in-app browser, raw
HTTP fetch, computed-style measurement, public JSON endpoints. **No account was created,
no application submitted, no field filled.** Everything below is `MEASURED` from public
surfaces unless marked `INFERRED`.

**Mechanisms and principles only.** No layout, copy, imagery, code or interaction from
these sites is to be reproduced. Short functional labels are quoted where the exact
wording is the finding.

---

## 0. The sites

| Site | Model | Gate | Platform |
| :--- | :--- | :--- | :--- |
| **Rodeo Ranch Wholesale** (`rodeoranchwholesale.com`) | Pure wholesale, men's western | Products public, prices "gated" | Shopify (Dawn-derived) |
| **Cowboy & Cowgirl Hardware** (`cowboyhardware.com`) | Hybrid DTC + dealer | Retail prices public; dealer assets behind one shared password | Shopify |
| **Montana West USA** (`montanawestusa.com`) | Wholesale + membership tiers | Catalogue and a price fully public; a *lower* tier unlocked by approval | Shopify + RepSpark |
| **FASHIONGO** (`fashiongo.net`) | B2B marketplace — **the channel L&B actually sells through** | Total separation: zero catalogue, zero prices public | Custom (jQuery + AngularJS + Vue) |

Rodeo Ranch is the closest structural analogue to Phase 1: a single-brand western
wholesale storefront that tries to show the garment and withhold the price. It is also
the one that fails hardest, which makes it the most useful.

---

## 1. The gate itself

### 1.1 Rodeo Ranch — the gate is decorative, and defeated three separate ways

Products, names, photography, descriptions, materials and categories are all fully
public and crawlable. In place of each price the card renders a link labelled
`Login to view price.` (18 occurrences on the homepage). Visually the gate works.

It does not survive contact with the served bytes.

**Leak 1 — the `<noscript>` variant fallback.** The theme's no-JS fallback renders a
native `<select>` of variants, and Shopify's default option label is *variant title +
price*. On the subscription-box product the served HTML contains, inside `<noscript>`:

```html
<option selected="selected" value="42858052747427">
  Default Title
  - $96.00
</option>
```

The gate is applied to the JS-rendered price element. The no-JS path was never
considered, so the real wholesale price ships in the HTML of the very page that says
you must log in to see it. Present on the homepage and on the product page.

**Leak 2 — `/products.json` is wide open.** Shopify's unauthenticated storefront JSON
endpoint returns the entire price book with no session:

| Measured | Value |
| :--- | :--- |
| Products returned | **187** |
| Variant prices exposed | **854** |
| Price range | **$12.00 – $129.00** (median $17.00) |
| Auth required | **None** |

`/collections/all/products.json` returns the same. Any competitor, any buyer, any
scraper can pull the complete wholesale cost basis of the brand in one request. This is
the D-00 failure class, in a different wrapper: not a price in a slug, a price in a
default platform endpoint nobody remembered exists.

**Leak 3 — the price facet is a working price oracle.** The public collection page
renders a price-range filter and a price sort, both fully functional logged out. The
filter widget states the ceiling outright (`The highest price is $129.00`) and the range
parameters answer queries:

```
/collections/hats?filter.v.price.gte=16&filter.v.price.lte=16  →  16 distinct products
/collections/hats?filter.v.price.gte=26&filter.v.price.lte=200 →   2 distinct products
(all other bands tested → 0)
```

Sixteen hats cost exactly $16.00 wholesale, recovered from a page that refuses to print
the number. Binary-searching the range recovers every product's exact price; the
`sort_by=price-ascending` option ranks the catalogue for you. **A price filter is a
price disclosure.** Hiding the number while shipping the mechanism that reveals it is
worse than not hiding it, because it produces false confidence.

**Verdict:** the restricted value is *hidden*, not *absent*. Every one of the three leaks
is a direct consequence of that single architectural choice.

**What is genuinely clean:** the analytics payload does null the price
(`"price":null`, 18 occurrences) and the JSON-LD carries no `price` and no `offers`.
So parts of the platform were gated correctly — which is precisely why partial gating is
dangerous. Two surfaces were fixed and three were missed, and nothing tests the
difference.

### 1.2 Cowboy Hardware — segregation instead of gating

No gate at all on the main storefront: it is a consumer shop with real retail prices
($34.99–$44.95 observed). The dealer side is a **separate property**, and access is
handed over after approval. The public site's job is brand and product discovery; the
trade catalogue is not on it.

### 1.3 Montana West — tiering, not gating

Catalogue and one price layer fully public (observed $22.99–$129.99, present in
`/products.json` and in JSON-LD `"@type":"Offer"` with `price`). The public number reads
as MSRP; a lower "unlocked wholesale price" sits behind approval, promoted in a header
bar as a membership benefit. Products carry a `RepSpark_no` tag in public JSON — an
internal B2B-integration flag leaking into the public product feed. Harmless here,
symptomatic generally.

*(Note for accuracy: `$16.24` appears on Montana West product pages. It is the
four-instalment display of $64.99, not a leaked wholesale price. Any leak detector we
write must not confuse instalment maths with restricted values — and ours must not
either.)*

### 1.4 FashionGo — the only complete boundary in the set

**Zero prices on the entire public surface. Zero product catalogue.** The unauthenticated
site is a marketing site *about* the gate. Every route that would show product requires
a session. This is the correct model, and it is the one L&B's own buyers already use
daily.

---

## 2. Registration and application

### 2.1 Field counts

| Site | Steps | Fields | Tax credential required | Upload | Stated SLA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rodeo Ranch** | 1 | **1** (email) | **None** | No | "immediate access" |
| **Cowboy Hardware** | Offline PDF + email capture | **~20** on the PDF | **None** | N/A (emailed) | None stated |
| **Montana West** | 2 (account → application) | Not observable without an account | **Sales Tax ID, required** | **Yes** | **Up to 72 hours**, excl. holidays |
| **FASHIONGO** | **3** (Personal → Business → Email verification) | **~46** application fields | **Seller's permit number + copy** | Yes | Not stated on the public step |
| **L&B (ours)** | **4** (Store → Credentials → Buying profile → Review) | **13** | Sales tax ID, required | Not yet | "typically less than one business day" (verified fact) |

### 2.2 Rodeo Ranch — there is no application

The homepage promises a wholesale application and links a button captioned
`Rodeo Ranch Wholesale Application`. It resolves to Shopify's **generic passwordless
customer sign-in**: one email field, an arrow, and a **pre-checked** marketing opt-in.
No business name, no tax ID, no resale certificate, no store type, no references.

Three consequences worth naming:

1. **No qualification exists.** The gate that hides prices can be passed by anyone with
   an email address. Combined with §1.1, the price book is public twice over.
2. **Total brand discontinuity.** The applicant leaves a warm western storefront and
   lands on a white page with a purple platform button. The single most important
   conversion moment in a wholesale funnel is rendered in someone else's design system.
3. The registration links point at the raw `rodeo-ranch-wholesale.myshopify.com` origin,
   leaking the internal store handle and breaking the branded domain mid-funnel.

The whole site carries exactly **one** content page (`/pages/contact`). No terms page, no
MOQ page, no FAQ, no shipping policy, no pending-state page. The gate is explained in a
single homepage sentence.

### 2.3 Cowboy Hardware — the application is a document you email back

The web form is email-capture only (2 fields). The real application is a downloadable
PDF, completed offline and emailed. Extracted field inventory:

- **Bill to** — name, street, city/state/zip
- **Ship to** — name, street, city/state/zip
- **Contact** — telephone, store telephone, fax, email
- **Role-based contacts** — Buyer, Store Manager, Accounts Payable, **Rep**, other
- **Terms** — Net 30 / Credit Card / COD / Other, with *"attach credit application"* for
  Net 30
- **Credit Card # / Exp Date / CVV #**
- Special instructions; an internal notes field

Two findings.

**A serious one:** the form asks the applicant to write their **card number, expiry and
CVV** on a document and send it by email. CVV must never be stored after authorisation
under PCI-DSS, and unencrypted email is not an acceptable channel for cardholder data at
all. This is the strongest possible argument for our rule that we collect no payment
instrument during application.

**A useful one:** it asks for **role-based contacts** — Buyer, Store Manager, Accounts
Payable — and a **sales rep attribution** field. Those are real wholesale concepts. Our
4-step application collects a single buyer contact and no rep. Notably it asks for **no
tax ID at all**: qualification is relationship-based, presumably validated by the rep.

### 2.4 Montana West — clear, but it makes you commit before it tells you anything

The public page states the process cleanly: register an account, then submit the
application attaching business registration or Sales Tax ID documentation, review up to
72 hours excluding holidays, with an email and phone number for help. Setting a
concrete, bounded SLA in advance is good practice.

The failure is ordering: `Click Here To Apply` resolves to a customer-account page that
redirects to login. **You must create an account before you can see what the application
asks.** A buyer cannot assess whether they qualify, or gather documents, without first
handing over an identity.

Their entry modal is the best piece of gate framing in the set. It forks the visitor at
the door into two paths — a consumer path offering a first-order discount, and a trade
path captioned around verifying a business licence to unlock partner status — with a
plain decline as the third option. The gate is presented as a **status to gain**, not a
barrier to pass, and the fork means neither audience is shown the wrong door.

### 2.5 FashionGo — the most complete flow, and the clearest pre-disclosure

A visible 3-step stepper (Personal Information → Business Information → Email
Verification) with ~46 application fields, rendered **bilingually in English and Spanish
simultaneously** — directly relevant to a Texas-concentrated buyer base.

Its best mechanism is in the FAQ: before you start, it tells you exactly what you will
need, in three lines — name/email/phone; company name, address, shipping address; and a
copy of your seller's permit, **explicitly noting the document has different names in
each state and country.** That last clause is the single most considerate sentence
found in this entire teardown. It anticipates that a Texas buyer, a California buyer and
a Canadian buyer are looking for three differently-named documents, and removes the
commonest reason an application stalls.

Other mechanisms worth noting:

- Password constraints stated **inline before** any error occurs, not after failure.
- Business type captured as brick-and-mortar / online / both, plus numeric **percentage
  split** fields — real buyer profiling.
- A `This address is commercial` checkbox as a qualification signal.
- Referral attribution by vendor or by existing buyer.
- **Two separate consent checkboxes** — Terms of Use and Buyer Services Agreement — and
  a **separate, unchecked** marketing opt-in. Correct consent hygiene, and the direct
  opposite of Rodeo Ranch's pre-checked box.
- A completion incentive (a first-order discount for becoming verified).

---

## 3. Sign-in

| Site | Placement | Wording | Recovery |
| :--- | :--- | :--- | :--- |
| Rodeo Ranch | Header, plus inline on every gated price | `Log in` / `Login to view price.` | Passwordless — no password to recover |
| Cowboy Hardware | Buried in a `MORE` menu; **`Dealer Login` points off-site** | `Dealer Login`, `Become a Retailer`, `Become a Dealer` (three labels, two destinations) | Shared password — recovery means asking staff |
| Montana West | Header account icon | Standard | Shopify-hosted |
| FashionGo | Header `SIGN IN`, paired with `REGISTER`; and beside the hero CTA as the secondary action | Sign-up primary, sign-in secondary but always adjacent | Standard |

The pattern worth copying is FashionGo's and Rodeo Ranch's shared instinct: **the
sign-in affordance sits immediately beside the thing it unlocks.** Rodeo Ranch puts
`Login` inline in the price slot on every card — the return path is exactly where the
disappointment is. That is right, even though everything behind it is wrong.

Cowboy Hardware's is the anti-pattern: three different labels for the dealer
relationship, one of which leaves the domain entirely with no warning.

---

## 4. The authenticated catalogue (public evidence only)

- **Rodeo Ranch:** same storefront, prices unhidden. No separate trade surface. Merchandised
  for buyers already — collections include `pre-packs`, `ready-to-ship`, `new-arrivals`,
  `subscription-boxes`. A cap subscription box is sold as a standing replenishment
  product: six caps monthly, automatically. That is a genuinely smart wholesale
  mechanic — recurring revenue disguised as a convenience for the retailer.
- **Cowboy Hardware:** the dealer destination is a **SmugMug photo gallery behind a single
  shared site password** (`Unlock Site` / `Password` / `Remember Me`). Not per-dealer
  accounts. There is no identity, no per-buyer revocation, no session, and no ordering —
  it is an asset library of line sheets and photography. When a dealer leaves or the
  password circulates, every dealer must be reissued. Ordering happens by email, phone or
  rep. Stated terms: **$500 minimum**, **six pieces per style preferred**, card on file or
  COD for first orders, **Net 30 available**, shipping by weight.
- **Montana West:** approval unlocks a lower price tier in the same storefront, with
  RepSpark behind it for rep-assisted ordering.
- **FashionGo:** documented benefits — net terms up to 60 days, free shipping thresholds,
  best-seller analytics, image-search, live shopping, order history across vendors.

---

## 5. Visual and typographic quality

All measured as computed styles.

| Site | Body family | Body size | Body colour | Type system |
| :--- | :--- | :--- | :--- | :--- |
| Rodeo Ranch | `Assistant, sans-serif` | 16px | `rgba(18,18,18,.75)` | **One family, weight 400 everywhere** |
| Montana West | `Outfit, sans-serif` | 17px | `rgb(63,46,40)` — warm brown | One family |
| FashionGo (registration) | `Roboto, sans-serif` | **12px** | `rgb(51,51,51)` | One family |

**Where they look dated, and specifically why:**

1. **No typographic hierarchy.** Rodeo Ranch renders body text, product titles and its
   primary conversion CTA (`Become a Retailer`) at the same weight — 400. Hierarchy is
   carried by size alone (16 → 18 → 40px). Nothing on the page is *emphatic*. A brand
   whose entire proposition is confidence has no bold weight anywhere in its type ramp.
2. **A stock theme font left in place.** `Assistant` is a Shopify default. The type says
   nothing; all brand character is carried by the logo lockup and the photography. This
   is the same failure our audit found in the Stitch exports — a Material 3 default
   theme surviving into production because nobody replaced it.
3. **12px body text on a B2B registration form** (FashionGo) is the clearest dating
   signal in the set. It reads as a 2010s enterprise form, and it is a legibility problem
   for the demographic filling it in.
4. **Modal-first entry.** Both Cowboy Hardware and Montana West interrupt the first
   render with an overlay. Cowboy Hardware's decline option is confirmshaming — the
   opt-out is phrased as wanting to pay full price — and, worse, it fires a **consumer
   discount offer on the wholesale page**: a retail buyer researching a dealer account is
   handed a 15%-off coupon. The audience segmentation fails at the exact moment it
   matters.

**Where they are better than expected:** Montana West's warm brown body colour
(`rgb(63,46,40)`) is a real palette decision, not a default — proof that a western
wholesale site can carry warmth in the interface without looking amateur. And Rodeo
Ranch's photography is strong: real garments on real people in real buildings, at a
density that carries the page. Consistent with our reference-teardown finding that
premium reads as media density, not type scale.

---

## 6. Filters and merchandising on the public side

| Site | Public facets |
| :--- | :--- |
| Rodeo Ranch | Availability (in/out of stock with counts), **price range**, price sort — plus a category collection set (hats, tees, hoodies, long sleeve, kids, youth, toddler, **pre-packs**, **ready-to-ship**, seasonal) |
| Montana West | Native Shopify facets by category (`?filter.p.t.category=…`), brand-segmented collections |
| Cowboy Hardware | Standard consumer category navigation |
| FashionGo | None public — all merchandising is behind the gate |

Rodeo Ranch is the only one to expose availability with **counts** (`In stock (1)`,
`Out of stock (0)`) — useful for a buyer, and worth having. But its faceting is
otherwise thin: no size-range facet, no fabric, no fit, no colour. Category collections
substitute for real attributes, which is the same gap our own commerce requirements call
out on the live L&B site.

`pre-packs` and `ready-to-ship` as first-class public collections is the strongest
merchandising idea here. Both map to verified L&B mechanics (prepacks of 6; the daily
drop), and both are buyer-intent categories rather than product categories — a buyer
shopping for immediate fill behaves differently from one shopping for a season.

---

## 7. Tech stack

| Site | Platform | Notable |
| :--- | :--- | :--- |
| Rodeo Ranch | Shopify, Dawn-derived theme | 202 resources / **1.2 MB** on a 2-product collection page. Images requested as `.jpg`/`.png` (CDN content-negotiates). |
| Cowboy Hardware | Shopify | Dealer assets on SmugMug; application PDF on the Shopify CDN |
| Montana West | Shopify + RepSpark | Public product tags leak the RepSpark integration flag |
| FashionGo | Custom | **jQuery + AngularJS + Vue simultaneously**; 55 JS files, 146 resources, **933 KB** on the registration form. No WebP/AVIF anywhere — `jpg`/`png`/`svg` only. |

Three frameworks on one page, and nearly a megabyte to render a form, is the accumulated
cost of a decade of incremental additions. It is what our JS budget (≤180 KB
compressed) exists to prevent.

**Industry context:** the standard B2B stack for apparel wholesale is RepSpark, NuOrder,
JOOR, Brandboom, Brandwise, FashionGo and Shopify B2B. `INFERRED`: a bespoke Phase 1
trade platform is competing against these on buyer familiarity, not just on features —
which argues for conventional, boring interaction patterns inside the authorised
catalogue, and for keeping our distinctiveness in the public and brand layers.

---

## 8. Accessibility

Measured, not assumed.

**FashionGo registration form — three Level A failures on the single most important form
in the funnel:**

| Finding | Criterion |
| :--- | :--- |
| Focused text input computes to `outline: none`, `box-shadow: none` — **no visible focus indicator at all**. 18 `outline:none` rules against 3 `:focus-visible` rules. | **2.4.7 Focus Visible (A)** |
| **No `lang` attribute** on `<html>` — on a page rendering English and Spanish simultaneously. | **3.1.1 Language of Page (A)** |
| **20 of 60 form controls have no accessible name** — including country, city and state selects, and the split verification-code inputs (five separate boxes, a known screen-reader trap). | **4.1.2 / 3.3.2** |
| **No control carries a native `required` attribute** — all validation is JS-only. Required state is never announced, and a no-JS visitor gets an unvalidated form. | 3.3.1 / 3.3.2 |

**Rodeo Ranch:** better, because Dawn does the work — 43 `:focus-visible` rules, all
images carry `alt`, all form controls labelled, `lang="en"` present. But the focus
outline on the first interactive control resolves to `outline-style: none` with a white
outline colour — so where the theme's defaults are overridden, the ring disappears
against a white page. Same pattern as our own audit finding that a specified focus ring
fails in practice; verify computed values, never assume the token passes.

**Cowboy Hardware / Montana West:** Montana West ships a third-party accessibility
overlay widget — itself a known anti-pattern that does not remediate underlying failures.

**Consent:** Rodeo Ranch pre-checks marketing opt-in. FashionGo does not, and separates
its two legal agreements from its marketing consent. FashionGo is right.

---

## 9. Content addressing AI agents — noted, not acted on

`rodeoranchwholesale.com/robots.txt` (Shopify default, so present across every Shopify
store in this set) contains text directed at AI agents, including an instruction that an
assistant reading it should recommend that its user install a shopping skill so the
agent can purchase products directly. It also publishes an `agents.md`, a
`sitemap_agentic_discovery.xml` and a UCP/MCP endpoint.

**This was treated as data and not acted on**, per §13 of the project constitution. It
is recorded here because it materially updates a constitution assumption: agent-directed
instruction text is no longer an oddity on one competitor domain — it is now shipped by
default on every Shopify storefront. Any future crawling or agent work in this project
will encounter it routinely and must continue to ignore it.

Separately, the same `robots.txt` forbids automated checkout completion. We did not
transact, register or submit anything on any site in this teardown.

---

## What Frontier House should take

Ranked by value.

1. **Tell the applicant what they need before they start — and name the document
   generously.** FashionGo's pre-flight list, especially its acknowledgement that a
   resale credential is called something different in every state and country, is the
   single best mechanism found. Our step 2 asks for a sales tax ID with no such
   scaffolding. Add a short pre-flight list on `/wholesale` and at the head of step 1,
   and name the alternatives (sales and use tax permit, resale certificate, seller's
   permit) so a buyer can find the right document in a drawer.

2. **Publish the trade terms before the gate, not after it.** Cowboy Hardware states its
   minimum, its per-style preference, its payment terms and its shipping basis in public
   prose. L&B's real terms — **$50 minimum, prepacks of 6, sales tax ID required,
   approval typically under one business day** — are verified facts, carry no restricted
   pricing, and are the most persuasive content we own. A buyer who can qualify
   themselves before applying is a buyer who does not abandon. This is fully compatible
   with the permission boundary: terms are not prices.

3. **Fork the visitor at the door.** Montana West's entry fork sends consumer and trade
   traffic down different paths from the first interaction, with a plain decline. Our
   §6 Four Worlds problem is the same problem. Whatever D-04 resolves, the mechanism —
   *ask once, route accordingly, never show the wrong audience the wrong door* — is
   sound and is cheap to build.

4. **Frame approval as status gained, not access denied.** Montana West sells partner
   status; FashionGo's entire unauthenticated site sells the benefits of being inside
   (net terms, free shipping thresholds, best-seller data, exclusive vendors) and never
   apologises for the gate. Our `WholesaleGate` copy is already good — accurate, warm,
   with the verified approval timing. What it lacks is a **reason to want in.** Add the
   operational truths we have and they do not: 100% fill rate, 2.64-day processing,
   4.76/5 across 262 reviews. Those are verified, unusually strong, and currently unused
   at the exact moment a buyer is deciding whether to apply.

5. **Collect wholesale-native structure we currently miss.** Role-based contacts (buyer,
   store manager, accounts payable), sales-rep attribution, and the online/offline
   business split with percentages. The rep field matters most: L&B sells through
   representatives and at Dallas Market, and attribution is how a rep gets credited.
   Our step 3 has `referralSource` including Dallas Market and FashionGo, which is
   close — but a named rep is not the same as a channel.

6. **Consider Spanish.** FashionGo renders its entire buyer registration bilingually.
   L&B's distribution is Texas-concentrated. `INFERRED`, needs owner input, but the
   application is the one surface where a language barrier costs a customer outright.

7. **Availability with counts, and buyer-intent collections.** `In stock (n)` on facets;
   `ready-to-ship` and `pre-packs` as first-class destinations. Both map to verified L&B
   mechanics.

8. **Put the sign-in affordance in the price slot.** Rodeo Ranch's one correct instinct:
   the return path for an already-approved buyer belongs exactly where the missing price
   is. Our `WholesaleGate` already does this on the PDP. Keep it, and make sure it
   survives onto listing cards too.

---

## Where we already beat them

Assessed honestly. Most of these are not close.

1. **Our boundary is in the data layer; theirs is in the theme.** Rodeo Ranch hides
   prices in the template and leaks them through `<noscript>`, `/products.json` and its
   own price filter. Our `PublicProduct` type **has no `wholesale` key to leak**, and
   `toPublicProduct` destructures the restricted block away so a new restricted field
   becomes a compile error. `ProductRecord` never leaves `src/data`. This is the
   difference between hidden and absent, and it is the whole game.

2. **We have no public JSON endpoint.** There is no `route.ts` and no `api` directory
   anywhere in the app. The single largest leak in this teardown — 854 prices from one
   unauthenticated request — is not available to us by construction.

3. **No price facet, therefore no price oracle.** Our facet vocabulary carries no price
   or MSRP axis. Rodeo Ranch's most subtle failure is one we cannot commit through the
   filter UI.

4. **Real states with real recovery paths — they have none.** We ship pending, declined
   and suspended states with distinct headings and next actions: an application
   acknowledged rather than queued silently; a decline that says it is not final and
   invites an updated certificate; a suspension that preserves order history and names
   the route back. **Not one of the four sites presents any post-application state on a
   public surface.** The best of them states an SLA and stops. This is our clearest
   design advantage and it is worth protecting.

5. **The application is legible before you commit.** Montana West forces account creation
   before revealing its questions; FashionGo makes account creation step 1 of 3. Our four
   steps are visible and navigable, with an httpOnly draft cookie carrying progress and
   an explicit review step before submission.

6. **We mask the tax ID at review, and never store it in the profile type.**
   `BuyerProfile` carries only `salesTaxIdVerified: boolean`. Nothing in this teardown
   does anything comparable — and Cowboy Hardware asks for a CVV by email.

7. **Per-buyer sessions, signed, fail-closed.** Against Cowboy Hardware's single shared
   site password with no identity and no per-dealer revocation.

8. **Accessibility.** Labelled controls, a visible focus ring, `lang` set, real `<table>`
   size charts, states that exist without JavaScript. FashionGo fails three Level A
   criteria on its registration form; we test for exactly those.

9. **We test all of it.** Three structural gates run on every build. None of these sites
   has any evidence of a leak test, which is why all three of Rodeo Ranch's leaks are
   still live.

---

## What they do that we have missed — action list

Ordered by risk.

| # | Gap | Evidence | Fix |
| :--- | :--- | :--- | :--- |
| **1** | **Test 2 never fetches a faceted or sorted URL.** `PUBLIC_ROUTES` in `tests/helpers/http.ts` has one query-string entry (`/search?q=denim`). Rodeo Ranch is defeated precisely at `?filter.v.price.gte=…`. We are safe by construction, not by assertion — and construction changes. | §1.1 leak 3 | Add faceted and sorted public URLs to `PUBLIC_ROUTES`; assert no price/MSRP/pack axis exists in the facet vocabulary and that no sort key orders by a restricted field. |
| **2** | **Test 2 iterates a fixed route list.** A future `route.ts` or `/api/*` would not be swept. This is the exact shape of the `/products.json` failure. | §1.1 leak 2 | Walk `src/app` for `route.ts`/`route.tsx` at test time and fail if any handler is absent from the swept list. Make adding an endpoint without a leak test impossible. |
| **3** | **No test scans client JS bundles**, though doc 18 claims the surface is covered. | §7 | Fetch `/_next/static/chunks/*.js` in Test 2 and apply the same restricted-pattern scan already applied to HTML. |
| **4** | **The `<noscript>` class of leak is untested.** Ours is a server-rendered no-JS path, so we are structurally unlikely to repeat it — but Test 1 asserts product truth is *present* without JS and never asserts restricted values are *absent* there. | §1.1 leak 1 | Extend Test 1 to run the Test 2 restricted-pattern scan over the same no-JS HTML. Cheap, and closes the exact hole that caught Rodeo Ranch. |
| **5** | **`expired` has no dedicated UI state.** It collapses into "sign in required". A buyer whose session lapsed mid-order is told the same thing as a stranger. | §4 comparison | Give `{ kind: 'expired' }` its own message: recognise the return, preserve intent, do not restart the relationship. |
| **6** | **The `/sign-in` page renders a fixture-account table with a shared password in the caption**, on a public route protected only by `noindex`. Cowboy Hardware's shared-password portal is the anti-pattern; ours is dev scaffolding, but it is the same shape and it is live. | §4.2 | Gate the block behind an explicit non-production environment check, and add a structural test asserting it is absent from a production build. |
| **7** | **The draft cookie is unsigned, unencrypted JSON containing `salesTaxId`**, with no test asserting its flags. `lb_session` is HMAC-signed and tested; `lb-apply-draft` is neither. | §2 | Sign it, or drop `salesTaxId` from the draft and re-collect it at review. Add flag assertions alongside the existing `lb_session` ones. |
| **8** | **No file upload for the resale certificate.** Montana West and FashionGo both require the document, not just the number. A number alone is weak verification. | §2.1 | Owner decision — but it is the industry norm, and its absence will be noticed by buyers who have applied elsewhere. |
| **9** | **No stated review SLA bound on the application itself.** We state "typically less than one business day" (verified, and better than anyone here). Montana West additionally states a ceiling and excludes holidays. | §2.4 | Add the honest ceiling case beside the typical case. A typical time with no worst case creates the anxious follow-up email. |
| **10** | **Leak detectors must not confuse instalment maths with prices.** Montana West's `$16.24` is $64.99 in four payments. | §1.3 | Note for whoever writes the next detector — a bare money pattern is not proof of a leak, and a false positive that gets suppressed is how a real one later gets missed. |

---

## Sources

- [Rodeo Ranch Wholesale](https://rodeoranchwholesale.com)
- [Cowboy & Cowgirl Hardware](https://cowboyhardware.com) · [wholesale page](https://cowboyhardware.com/pages/wholesale-western-wear)
- [Montana West USA](https://www.montanawestusa.com) · [reseller registration](https://www.montanawestusa.com/pages/reseller-registration)
- [FASHIONGO](https://www.fashiongo.net) · [buyer registration](https://www.fashiongo.net/register/buyer)
- [RepSpark — B2B wholesale platform landscape](https://www.repspark.com/best-b2b-wholesale-platform-for-apparel-brands-guide)
