# Teardown — B2B Wholesale Buying Infrastructure

**JOOR · FashionGo · Faire.** Researched 2026-08-13.

The question this answers: *what turns a wholesale website into a digital buying room?*

**Method.** Three evidence classes, labelled throughout:

- **MEASURED** — observed directly by running JavaScript against the live page in a browser,
  or read verbatim from public API documentation. Reproducible.
- **DOCUMENTED** — stated in the vendor's own public help centre, API reference or feature
  page. Their claim, not our measurement.
- **INFERRED** — our reading. Flagged as such every time.

**What could not be observed.** All three products are login-gated at the point where the
interesting work happens. No account was created, no form submitted, no demo requested, no
personal data entered. **JOOR is the most closed** — its entire help centre
(`help.jooraccess.com`) redirects to `auth.jooraccess.com`, so every JOOR mechanism below is
DOCUMENTED from marketing pages or MEASURED from its **public API reference**, which turns
out to be the single richest artefact in the whole teardown. **FashionGo** exposes a public
category grid but hard-redirects the product page to login. **Faire** exposes public category
and brand pages with the price masked, and is therefore the only place we could measure a
live authorisation boundary end-to-end.

**Agent-directed content.** None found. No page text, `robots.txt` or documentation on any of
the three attempted to instruct an automated agent. JOOR's `robots.txt` explicitly *allows*
GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others, and points to `/llms.txt`
(MEASURED). FashionGo's blocks every user-agent except Googlebot (MEASURED). Faire's names
Pinterestbot, Applebot, FacebookExternalHit and Bytespider with no AI-directed prose
(MEASURED). Nothing was acted on.

**Nothing here is copied.** No layout, no copy, no imagery, no code, no proprietary
interaction. Mechanisms and data models only — the one thing about a competitor that is
legitimately learnable.

---

## 1. The headline: three different answers to the same permission problem

This is the finding that matters most to us, because §11 of the constitution stakes the whole
project on getting it right. All three platforms hide wholesale pricing from unauthorised
visitors. **They do it in three structurally different ways, with three different costs.**

| | FashionGo | Faire | JOOR |
| :--- | :--- | :--- | :--- |
| **Public category grid** | Yes — names, vendors, images, badges | Yes — names, brands, images, ratings | No |
| **Public product page** | **No** — 302 to login | Modal over category, sign-up prompted | No |
| **Price in public HTML** | **Absent** | **Absent** (unit wholesale) | n/a |
| **Visual treatment of the gate** | No price element at all | `$ XX.XX` placeholder, CSS-blurred | n/a |
| **MSRP in public payload** | No | **Yes** — `min_option_retail_price.amount_cents` | n/a |
| **MOQ in public payload** | No | **Yes** — `option_min_order_quantity` | n/a |
| **Inventory depth in public payload** | No | **Yes** — `option_available_units` | n/a |
| **Crawlable product detail** | **No** — `Disallow: /item/`, all bots but Google blocked | Partially | No |

### 1.1 FashionGo — absent, and gone entirely

MEASURED on `/Catalog/womens-apparel/dresses` (330,806 items) with no session:

- Occurrences of `"price"`, `"wholesalePrice"`, `"unitPrice"`, `"msrp"`, `"retailPrice"`,
  `"cost"`, `"minOrder"`, `"moq"`, `"prepack"`, `"packQty"` in the served HTML: **0 each.**
- Occurrences of `price` (any case) across all six inline scripts over 500 bytes: **0.**
- Elements with a CSS `blur` filter: **0.**
- Every `$` amount on the page is a marketing threshold — `$100`, `$300`, `$600`, `$1000` —
  free-shipping tiers, not product prices.

This is the standard our §11 describes: **absent, not hidden.** There is no price node to
un-hide, no JSON to read, no class to remove in DevTools.

The gate itself is a **server-side redirect**, not a client overlay. Requesting
`/item/26091020` returns
`/login?returnUrl=%2Fitem%2F26091020&productId=26091020&productName=D7003-12&categoryId=129`
(MEASURED). Note the cost: the return path is a **bag of product fields in the query string**.
No price leaks, but style number and category do, and they land in server logs, referrer
headers and analytics. INFERRED: a mild anti-pattern; an opaque return token is strictly
better.

**The strategic cost is severe and we must not pay it.** `robots.txt` disallows `/item/` and
blocks every crawler except Googlebot (MEASURED). Combined with the login redirect, **product
detail on FashionGo is invisible to search, to screen readers arriving cold, and to anyone
without an account.** Our §11 requires the opposite: product name, category, description,
materials, colour, size range and availability are *public, semantic and crawlable — always*.
FashionGo solved the leak by deleting the shop window. That is not our answer.

### 1.2 Faire — the interesting one, and a partial cautionary tale

MEASURED on `/category/Women` with no session. Faire renders the price slot as a literal
placeholder string, styled to *look* redacted:

```
<span class="… pointer-events-none blur-sm select-none …">XX.XX</span>
```

Twelve such spans on the page; twelve blurred elements; the innerHTML of each is the four
characters `XX.XX` and nothing else (MEASURED). Occurrences of `wholesale_price`,
`unit_price`, `price_cents` or a bare `"price"` key: **0.** The only price-shaped keys present
are experiment flag names (`verified_wsp_price_badge_xp_`, `fe_price_hero_font_`).

**So Faire got the load-bearing part right: the buyer's unit cost was never serialised.** The
blur is decoration over a placeholder, not a control. That distinction is the entire lesson —
and it is exactly the thing a designer or an engineer in a hurry will get backwards.

**But the same public payload ships a great deal else** (MEASURED, from the embedded RSC
flight data):

| Key | Sample values observed |
| :--- | :--- |
| `min_option_retail_price.amount_cents` | `4000`, `3400`, `790`, `2600`, `3150` |
| `option_min_order_quantity` | `1`, `2`, `6` |
| `option_available_units` | `1699`, `999`, `419`, `600`, `987` |
| `unit_multiplier`, `prepack` / `pre-pack` | present |
| pack labels | `Case of 1`, `Case of 3`, `Case of 5`, `Case of 6`, `Case of 24` |

Brand pages go further, all publicly: brand minimum (`$300 min`, `$100 min`, `$0 min`), star
rating and review count, city and state, a **lead-time promise** — *Delivers by Aug 17–27* —
and the brand's full MAP-policy prose (MEASURED on `/brand/b_…`).

INFERRED, and worth a decision: Faire has concluded that **only the buyer's cost is secret**.
Retail price, pack structure, minimums, lead time and stock depth are all treated as
shop-window information, which is precisely why Faire's category pages rank in search while
FashionGo's product pages do not exist to it. Our constitution currently restricts *MSRP
guidance* alongside wholesale price. That is a defensible position but it is stricter than the
market leader, and it costs us the ability to show a buyer their margin story. See §10.1.

Two further Faire observations we should **not** copy:

- **Exact inventory depth is public.** `option_available_units: 1699` tells a competitor
  precisely how deep a brand's stock is. Restricted-adjacent at best.
- **The category page is client-rendered.** MEASURED: `document.body.innerText` returned an
  empty string on first load and for roughly three seconds after; the page painted skeleton
  blocks first. No Suspense deferral markers were present (`<!--$?-->`: 0), so this is
  client-side data fetching rather than streamed SSR — but either way, a visitor without
  JavaScript sees nothing. Our CI Test 1 forbids this outright.

### 1.3 JOOR — connection-based authorisation

Nothing is public. DOCUMENTED: brands control visibility through accept/decline of *retail
connection requests* — a retailer requests access, the brand invites them, and only then can
they see and order the collection. Access is a **relationship**, not a role. Combined with
per-buyer catalogues and per-buyer price types (see §4), this means two authorised buyers can
legitimately see two different line sheets.

INFERRED: this is the right shape for L&B. Our verified truth is *"we only sell to approved
retailers"*, and approval is already a per-account human decision made in under one business
day. The gate is not a paywall; it is an account relationship that already exists offline.

---

## 2. Digital line sheets

### 2.1 What a line sheet contains

DOCUMENTED, JOOR's own definition — nine required elements: product images (multiple angles
and variations); product information (style name/number, colours, sizes, materials,
specifications); wholesale pricing (with bulk discounts, MOQ and suggested retail);
ordering information; contact information; brand story; **ordering terms with explicit cut-off
days**; **delivery windows with clear start and cancel dates**; and minimum order quantity.
Organised by category, season or delivery window, with a stated ceiling of under ten products
per page to keep the layout legible.

### 2.2 The actual data model

This is the most valuable artefact found. MEASURED verbatim from JOOR's **public** v2.0 API
reference. It is the closest thing the industry has to a canonical wholesale product schema,
and it should be the skeleton of our own.

**Identity and description.** `style_id`, `style_name`, `style_number`, `style_identifier`,
`style_description`, `division`, `division_code`, `style_country_origin`, `fabrication`,
`fabrication_code`, `measurements`, `silhouette`, `silhouette_code`, `source_of_materials`,
`material`, `heel_height`, `contains_fur`, `made_to_order`, `best_seller`, `minimum`.

**Pricing** — note it is a *repeating* structure, not a scalar: `price_label` ("delineates
between multiple prices of the same currency"), `price_currency`, `price_wholesale`
("price retailer pays when ordering"), `price_retail` ("recommended retail price"),
`price_currency_retail`.

**Sizes.** `size_name`, `size_code`, `size_description` ("long description including case pack
or translations"), **`size_multiplier` ("number of items included in a casepack")**.

**Colours.** `color_name`, `color_code`, `color_image`, `color_hex`, plus a per-colour
`minimum`. And `color_exclusion` — a colour can be excluded from a specific delivery.

**Delivery and season.** `delivery_name`, `delivery_code`, `season_name`, `season_year`,
`season_code`, **`date_delivery_start`**, **`date_delivery_end`** ("delivery ending date /
complete ship date"), **`date_cancel`**, `style_display_order`, `style_comments`, and
`public` — a binary flag controlling whether a delivery is viewable to connections.

**Taxonomy, badges, tags.** `category_parent`, `subcategory_parent`, `subcategory_id`,
`subcategory_label`; `badge_id`, `badge_name`, `badge_image_path`; and a free-form tag system
(`tag_group`, `tag_name`, `tag_value`, `tag_value_code`) explicitly described as a custom
field used for reporting.

**SKU and stock.** `sku_color_code`, `sku_size`, `upc`, **`inventory_available`** ("current
inventory total for Style/Color/Size").

Two definitions worth memorising (DOCUMENTED verbatim): *"A style (also called a product) is
the default level at which pricing is applied"* and *"A SKU is a specific combination of style
+ size + color."* Pricing lives at style level by default and drops to SKU level only when a
particular size/colour genuinely costs differently. **Our fixtures should model exactly this.**

### 2.3 How it stays current, and what a buyer can do with it

DOCUMENTED: line sheets update in real time so retailers always see current pricing, sizing
and availability; they are *shoppable* — the buyer builds and submits an order from the line
sheet itself; a brand runs multiple line sheets per collection, season or delivery; and each
can be personalised per retailer. Inventory systems integrate so buyers see live stock.

Imagery inside the line sheet: multiple angles, colourway variants, lifestyle *and* close-up
frames, 360° imagery, style video, and custom badges for top sellers, limited editions or
exclusives (DOCUMENTED).

**Export.** JOOR's line-sheet marketing page never mentions PDF or Excel export — the pitch is
explicitly *the always-current interactive thing instead of a file*. But JOOR's Frame-11-style
brand tooling and the wider category do export, and the honest industry position (DOCUMENTED,
third-party) is: **PDF for trade shows and cold outreach, the live platform for active
accounts.** INFERRED: both are needed. A buyer in a Dallas Market appointment with patchy wifi
needs a file; the same buyer at their desk three weeks later needs the live one.

---

## 3. Order building

### 3.1 Cart versus assortment — two genuinely different models

**Marketplace cart** (FashionGo, Faire). Add to cart, mix vendors freely, checkout splits into
one order per vendor with per-vendor shipping (DOCUMENTED). Optimised for impulse and
frequency.

**Seasonal assortment** (JOOR). The buyer's unit of work is a *season*, not a basket. JOOR
launched **Visual Assortment** in January 2026 (DOCUMENTED): a board of every product a
retailer plans to carry, aggregated across brands, seasons and deliveries — *including orders
not placed on JOOR at all*, normalised by an algorithm so cross-brand products become
comparable. Cards carry image, order quantity, price, order status, delivery window and a link
through to the underlying order. Default grouping is **by delivery window**, with secondary
filters on brand, category or colour, plus manual clustering to match the buyer's own logic.
Stated purpose: spot gaps, spot duplicates, adjust before ordering. 92% of trial retailers
cited time savings (DOCUMENTED, vendor claim).

INFERRED, and this is the design insight worth the whole section: **a buyer's mental model is
a wall of product, not a receipt.** The cart is a checkout artefact. The assortment is the
actual work. A single-brand house like L&B does not need cross-brand aggregation, but it does
need the wall.

### 3.2 Quantity entry — the matrix

DOCUMENTED (industry-wide, corroborated across several independent sources): apparel order
entry is a **grid with sizes across the top and colours down the side**, one quantity input
per cell, whole order submitted from one page. This is the mechanism the whole category has
converged on, and it exists because typing 8 sizes × 6 colours as 48 separate add-to-cart
actions is unusable.

Pack rules are **enforced inside the grid**, not at checkout: if a style ships in a ratio pack
of 12 (2S/4M/4L/2XL), a quantity that is not a valid multiple is flagged, or rounded up to the
nearest valid quantity, at the moment of entry (DOCUMENTED).

### 3.3 Prepack versus open sizing

Faire documents both models cleanly (DOCUMENTED):

- **Case size** — "the minimum quantity of a specific item that a brand requires a retailer to
  order". Multiples only. **Applied per option**: a case size of 6 across three colours means
  6 of *each* colour chosen, not 6 in total. Displayed on the product page.
- **Minimum order quantity** — the minimum units of a single style needed to check out. Must
  be ≥ the product MOQ *and* a multiple of the case size.
- **Prepacks** — a fixed size run bought as a unit. Rigid.
- **Open sizing** — an MOQ set at *style* level, with the buyer free to mix sizes to reach it
  (a 4, two 8s, a 12 …). Faire's claim: retailers spend 40% more and are 10% more likely to
  purchase with open sizing.

Directly relevant: L&B's verified structure is **prepacks of 6** with a **$50 order minimum**.
FashionGo exposes an **`Open Pack`** filter as a first-class facet (MEASURED), meaning
"sold in units, not packs" is a *searchable property of a product* in this market. If L&B ever
opens sizing on some styles, that is a facet, not a footnote.

### 3.4 Totals, minimums and progress

DOCUMENTED across the set: brand-level order minimum in currency (Faire shows `$300 min` on
the brand card publicly), per-style MOQ in units, per-colour minimum, case multiples. JOOR's
brand-side **Order Settings** configure "Payment Types and Terms, Minimum Order Requirements,
and Seasons", and those settings determine what a retailer may view or modify on an order.

INFERRED: the buyer needs *three simultaneous* progress readouts — units toward the style MOQ,
currency toward the order minimum, and pack-multiple validity per row. All three fail
differently and all three block submission.

### 3.5 Saving and resuming

DOCUMENTED: FashionGo persists carts and orders server-side under *My Orders*; JOOR orders are
editable by both parties with changes syncing automatically, eliminating the email round-trip;
Faire multi-location retailers "shop and build orders independently while your organization
maintains centralized visibility". INFERRED: server-persisted, account-scoped, multi-device is
table stakes. `localStorage` is not an acceptable implementation — buyers work on a phone at
market and a laptop at the store.

### 3.6 Order lifecycle — the states we must design

MEASURED from JOOR's public API (`order_type` enum): `0 = Cancelled`, `1 = In Progress`,
`3 = Pending`, `4 = Approved`, `5 = Shipped`, `6 = Notes`.

DOCUMENTED from FashionGo's buyer help, which is more granular and more useful:

1. **Newly Placed** — "under review by the vendor"; buyer may still cancel or modify.
2. **Confirmed** — vendor accepted; changes now need vendor contact.
3. **Partially / Fully Shipped** — charged, tracking available.
4. **Backordered** — unavailable lines are **split into a separate order** with a **`-BO1`
   suffix** on the original PO number, carrying an updated availability date.
5. **Pre-Order** — later-availability lines **split into their own order** with an **`-IN1`
   suffix** and a distinct PO number.
6. **Cancelled** · 7. **Returned**.

Faire independently arrives at the same rule (DOCUMENTED): an order mixing available-to-ship
and preorder products *is automatically split by expected ship date*.

**Two platforms, same conclusion, arrived at separately: never let one order carry two ship
dates.** Treat that as settled.

---

## 4. Pricing display to authorised buyers

DOCUMENTED and MEASURED from the JOOR schema, this is what an authorised buyer actually sees:

- **Wholesale unit price** — `price_wholesale`, per price label, per currency.
- **Suggested retail** — `price_retail`, in its own currency field, so a US brand can quote
  USD wholesale and EUR retail.
- **Multiple price types per buyer.** `price_label` exists specifically to distinguish several
  prices in the same currency. JOOR's brand pitch is explicit: tailor "product assortments,
  pricing, and discounts to every buyer". Price is a *function of the relationship*.
- **Order-level economics** — MEASURED from the orders API: `order_discount`,
  `order_discount_percent`, `order_shipping_total`, `order_total`, `order_currency`,
  `order_currency_retail`, `payment_method_name`, `tax_id_label`, `tax_id_number`.
- **Line-level economics** — `item_price` (including style-level discount), `item_unit_price`
  (original), `item_price_adjustment` (positive or negative, per style),
  **`item_retail_price`** (MSRP), `item_quantity`, **`item_multiplier`** ("number of items
  included in a casepack"), `item_price_extended` (`(price + adjustment) × quantity`).

**Margin is not a stored field anywhere in the schema.** INFERRED: it is computed from
`price_retail` − `price_wholesale`. This matters enormously for us — see §10.1 — because a
margin figure and a wholesale figure are informationally equivalent once MSRP is known.

**How the gate is presented to an unauthorised visitor.** Faire: a lock glyph and an
invitation to unlock, repeated at product-card level, page level and a mid-grid interstitial;
the framing is a benefit ("60 days to pay", "free returns on every first order", "low or no
minimums"), never a rejection. FashionGo: a redirect to a sign-in screen listing what is
behind it. INFERRED, and consistent with our §11 note that the wholesale gate *should read as
an invitation, not a failure*: both get the tone right. The gate is a door with a sign on it,
not a wall.

**What it takes to get through.** DOCUMENTED, FashionGo: a valid official copy of a **Seller's
Permit** (Sales Tax License / Number / Permit, depending on state) — explicitly *not* an IRS
EIN — plus proof of business ownership. International accounts need a Reseller's permit or any
business licence for review. Critically: **retailers without the permit are not rejected, they
are restricted** — "the inability to view all vendors and styles" — and can upload the document
later to gain full access. OBSERVED (screenshot only, no interaction): buyer registration is a
**two-step wizard**, Personal Information then Business Information.

That last detail is directly actionable. Our own memory records the live L&B registration as
**25 fields on one page**. FashionGo splits the same job in two and lets a partially-verified
account browse in the meantime. **Pending approval is a usable state, not a waiting room.**

---

## 5. Retailer identity and continuity

- **Buyer profile as a queryable object.** DOCUMENTED, JOOR Discover lets a *brand* search
  retailers by **location, brands carried, and wholesale price range**. INFERRED: those three
  axes are the industry's working definition of a store's identity, and the third one
  (price range) is the one we would never have thought to ask for.
- **Explicitly asked, not only inferred.** DOCUMENTED, Faire: "offers quizzes to retailers so
  they can tell us more about their business, and then recommends products to them that
  similar retailers have purchased." Behavioural signal (searched / clicked / purchased) is
  layered on top, and a ranking algorithm over ~100 factors drives discovery.
- **Order history and reorder.** DOCUMENTED, JOOR: "View your previous orders and product
  quantities on JOOR to reorder quickly from the same brands while staying informed on new
  collections." The order schema supports it natively — `order_type_name` carries client
  designations like *Initial Order, Re-order, Bulk Order*, so reorder is a first-class order
  type, not a UI shortcut.
- **Multi-door retailers.** MEASURED from the JOOR schema: a `door` object (`door_id`,
  `door_name`, `door_code`, `door_deleted`) with the constraint "JOOR allows for one door per
  Order." Plus `company_name` / `customer_group_name` above the individual customer. A chain
  buyer is a *group of doors*, and each door's order is separate. Our verified audience
  includes "chain/multi-store buyer" — this is exactly the mechanism that serves them.
- **Reputation as continuity.** DOCUMENTED, Faire: brand ratings, review counts, reorder rate
  and on-time fulfilment feed a **Top Shop** badge. INFERRED: L&B's verified operational
  metrics — 100% fill rate, 2.64-day processing, 4.76/5 across 262 reviews, 4.7/5 across 353 —
  are the same signal, already true, and currently invisible on the site.

**One thing to refuse to copy.** Faire publishes buyer reviews attributed by first name and
town — *"Tammy (Elk River, MN, United States)"* — on public, crawlable brand pages (MEASURED).
That is a named individual's purchasing behaviour published without evident need. §12 forbids
us inventing people; the same principle should stop us exposing real ones. Any buyer
testimonial we publish needs explicit written consent and no geographic identifier.

---

## 6. Catalogue browsing for trade buyers

MEASURED — FashionGo's complete public facet set on a category page. This is the most
concrete answer available to *"how do trade facets differ from consumer facets?"*:

| Facet group | Values | Consumer equivalent? |
| :--- | :--- | :--- |
| **CATEGORY** | two-level hierarchy | Yes |
| **COLOR** / **PATTERN** / **LENGTH** / **STYLE** / **FABRIC** | — | Yes |
| **ITEM AVAILABILITY** | In Stock · **Pre Order** | **Partly** — pre-order as a facet is trade |
| **ITEM PROPERTY** | With Product Video · **Open Pack** · **Volume Discount Item** · Made in USA | **No — pure trade** |
| **VENDORS** | by vendor | **No** |
| **VENDOR PROMOTION** | Vendor Free Shipping · Amount Discount · Collection Promotion | **No** |
| **VENDOR TYPE** | FG Exclusive · Premium · Rewards | **No** |
| **SHOP BY FIT** | **Plus** · Petite · Unisex · Contemporary · Missy · Junior · Maternity | **No — a fit axis, not a size** |
| **FREE SHIPPING** | threshold-qualifying items | **No** |
| Sort | Most Popular · New Arrivals | Yes |

Three of these deserve to be lifted directly.

**`Open Pack`.** Pack structure is a *filterable property*. A buyer who cannot commit to
prepacks filters the catalogue down to what they can buy. Given L&B ships prepacks of 6, this
facet is either a permanent "no results" or a real merchandising decision.

**`SHOP BY FIT`.** Plus, Petite, Missy, Junior, Contemporary, Maternity and Unisex sit as
**siblings in one filter group** — not as separate catalogues, not as separate navigation.
This is direct market evidence for the **D-04** question of whether Plus is a world or a
filter: the largest wholesale apparel marketplace in the US treats it as a **fit facet**,
alongside six others, on one product set. It does not resolve D-04 — the owner does — but it
is the strongest external evidence available, and it agrees with §11's "Plus is a filter and a
fit story, never a separate catalog."

**`Pre Order` as an availability value.** Not a badge, not a separate section — a value in the
same filter as In Stock. §11 requires pre-order to be a first-class state; this is what
first-class looks like in a facet system.

Faire's facets are shaped differently and reveal a different priority (MEASURED): *American
brands · Low minimum · Top Shop · New this month*, plus a brand-values group — Made in USA,
Eco-friendly, Handmade, Organic, Women owned, **Not on Amazon**. INFERRED: Faire's buyer is
choosing a *supplier relationship*; FashionGo's buyer is choosing *units*. Ours is doing both.

**Trend and bestseller intelligence** (DOCUMENTED, FashionGo). Three named tools:
**Best of Best**, a real-time bestseller list computed from sales across thousands of
retailers; **In-Focus**, a curated trend edit; and **StyleMatch+**, visual search from an
uploaded inspiration image, shipped as a Chrome extension and in the mobile app. The JOOR
schema carries a `best_seller` boolean at style level (MEASURED), so "bestseller" is a product
attribute that flows through integrations, not a merchandiser's manual badge.

INFERRED, and important for calibration: this is aggregate intelligence built on *many* stores'
sell-through. L&B has one brand's data. We can honestly say *what sells for us* — we cannot say
*what sells for you*. Anything framed as the latter would be a fabricated claim under §12.

**Availability and delivery display.** Faire publishes a lead-time window on the brand page
(*Delivers by Aug 17–27*, MEASURED) before any login. FashionGo separates In Stock from Pre
Order at facet level and splits backorders into suffixed child orders. JOOR carries
`inventory_available` per SKU and `date_delivery_start` / `date_delivery_end` / `date_cancel`
per delivery. **Lead time is public everywhere. Stock depth is the contested field.**

---

## 7. Visual quality — where it stops being beautiful

Honest limitation first: **we could not see any authenticated interface.** Everything in this
section is either MEASURED on public pages or INFERRED. No screenshots of a logged-in order
grid were obtained, and none should be inferred from vendor marketing renders.

What is measurable:

- **Faire's public surfaces are genuinely well designed** — restrained serif wordmark,
  generous whitespace, large editorial photography, quiet type. The brand page reads like a
  boutique's own site, not a portal (MEASURED, screenshots).
- **The product card is where it breaks.** A blurred `$ XX.XX` sitting above the product name
  is visual noise that carries no information. It occupies the most valuable line in the card
  to say *"there is a number here and you may not have it."* INFERRED: a lock affordance
  attached to a single, well-placed call to action would say the same thing once, instead of
  once per card.
- **FashionGo's catalogue is dense and utilitarian by design** — vendor name over product
  name, three or four competing badges per tile (FG Free Shipping, PLUS, *Up to 10% Off with
  promo*, Free Shipping $200+ Orders), 330,806 items behind a thirteen-group filter rail
  (MEASURED). This is a search interface, not a shop window. For a marketplace with three
  million SKUs that is arguably correct. **For a single house selling 235 styles it would be a
  disaster.**
- **Where the industry itself says it goes wrong** (DOCUMENTED, third-party): *"a PDF linesheet
  emailed to a retail buyer or a generic wholesale portal with stock imagery and basic order
  forms does not adequately represent the brand."* The stated 2026 direction is branded buyer
  portals with the consumer-store noise removed but the brand's visual language kept.

**INFERRED — what it takes to keep it beautiful.** Three rules, and they follow from the
evidence rather than from taste:

1. **The gate is one element, not a per-card tax.** Redaction repeated 48 times on a grid is
   the single largest source of ugliness observed. State the rule once; let the products be
   products.
2. **The density spike belongs in one place: the rack.** A quantity matrix *is* a spreadsheet
   and should look like a good one — aligned numerals, quiet rules, generous cell targets. The
   mistake is letting spreadsheet density leak backwards into browsing and the PDP. Cinema
   never enters the rack; equally, the rack never enters the gallery.
3. **Trade information is typography, not chrome.** Wholesale, MSRP, pack, MOQ and ship window
   are five short facts. They need a small-caps label column and tabular figures — not cards,
   not panels, not badges. Badge inflation is precisely what makes FashionGo's grid tiring.

---

## 8. Drop and season calendar mechanics

**The date fields** (MEASURED, JOOR schema) — this is the complete vocabulary:

| Field | Meaning |
| :--- | :--- |
| `season_name`, `season_year`, `season_code` | the season a delivery belongs to |
| `delivery_name`, `delivery_code` | the named drop within the season (also the line sheet) |
| `date_delivery_start` / `date_ship_start` | start ship date — the window opens |
| `date_delivery_end` / `date_ship_end` | complete ship date, explicitly annotated *"(cancel date)"* |
| `date_cancel` | delivery cancel date |
| `public` | binary — whether this delivery is visible to connections yet |

Note the identity: **`order_delivery_name` is "the linesheet name from which the order was
taken"** (MEASURED, verbatim). In JOOR's model a delivery, a line sheet and an order's
delivery attribution are **the same object**. That is an elegant collapse and we should copy
it: *a drop is a line sheet is an order grouping.*

**Preorder cutoffs** (DOCUMENTED, Faire): the brand toggles preordering per product, sets an
expected **Ship Date range** (start and end), and optionally a **"Deadline to place an order"**
— the cutoff. Unaccepted preorders auto-cancel after 30 days. Brands may revise the estimated
ship date after accepting. Mixed orders split by ship date automatically.

**The market calendar as a product** (DOCUMENTED, JOOR Passport): physical fashion events get a
transactional digital layer — brands upload seasonal lookbooks to profile pages, retailers
request access, brands invite, orders are placed inside the event. Passport ran 16 global
events in a recent season. FashionGo runs the same play under its own name (**FashionGo Week**,
with Best of Best surfacing real-time bestsellers *during* the show).

INFERRED, and this is the single most directly usable idea in the section: **L&B already has
this and does not use it.** Permanent showroom **#13656** at Dallas Market Center, with markets
**Aug 18–21** and **Oct 20–23, 2026** — all verified facts. A market-linked line sheet that
opens when the market opens, closes on a cutoff, and is bookable against an appointment is a
Passport-shaped mechanism built entirely from facts we already hold.

---

## 9. What Frontier House should take

Four specifications. Each states the mechanism, the constraints it inherits from the
constitution, and — separately and explicitly — **the data we do not have.**

The constraint that governs all four: **restricted wholesale data must be absent, not hidden.**
Server-rendered inside the authorised session only. Never in public HTML, URLs, slugs, titles,
meta, structured data, static assets, unauthenticated bundles or JSON, logs, analytics events,
third-party widget calculations, alt text, or sitemaps.

### 9.1 Trade Mode — an intelligence layer inside the existing PDP

**Not a separate route, not a separate template, not a client toggle.** Same URL, same
server-rendered product truth, same photography. An authorised session renders *additional*
server components; an unauthorised session renders a page that is complete without them.

**The type system is the enforcement mechanism.** Two types, and the public one has no price
field *at all*:

```ts
// Public. Rendered on every request. No optional price — no price.
type PublicProduct = {
  slug: string; name: string; category: string;
  description: string; materials: string[]; colorway: Colorway;
  sizeRange: Size[]; availability: 'available' | 'preorder' | 'waitlist';
  images: Image[];
};

// Constructed ONLY inside an authorised session. Never imported by a public route.
type TradeFacts = { /* wholesale, msrp, margin, pack, moq, ats, shipWindow, sku */ };
```

`price?: number | null` is the wrong shape and must be rejected in review. An optional field
invites a `?? '—'` somewhere downstream; an **absent** field makes the leak a compile error.

**Fields, each rendered only when verified data exists:**

| Row | Source | Rule |
| :--- | :--- | :--- |
| Wholesale unit | owner data | Never a range, never a placeholder |
| MSRP / suggested retail | owner data | See W-1 below before deciding public or restricted |
| Margin (% and currency) | **computed server-side** | Never computed client-side — that ships the inputs |
| Prepack structure | owner data | The size ratio, shown as read-only text |
| MOQ | verified: $50 order minimum; per-style units unknown | Show both units and currency |
| Availability | owner data | Coarse band publicly; exact count only in session (see W-2) |
| Ship window | owner data | Start ship + cancel date, per JOOR's vocabulary |
| Style number / SKU | owner data | Public — it is not restricted |

**Absolute rules.**

- **A missing field renders nothing.** No `—`, no "Contact for pricing", no greyed row. A
  placeholder where a number belongs is an invented fact by implication (§12).
- **No blur, ever.** Faire's blur is decoration over a placeholder; ours would be mistaken for
  the control. If a designer proposes blur, the answer is that the number was never sent.
- **Trade Mode works with JavaScript disabled.** It is server-rendered HTML inside the session,
  not a client fetch into a public shell (§13b). CI Test 1 must pass on the authorised route
  too, not just the public one.
- **If we ship a "show me the public view" toggle** — genuinely useful when a buyer is standing
  next to a customer — it is a **link or a form that re-requests the page server-side**, never
  a client state flip. A client flip means the restricted data was in the client.
- **Cinema never enters Trade Mode.** No WebGL bytes on this surface, in any phase.

**Data we do NOT have and must ask the owner for:** per-style wholesale price (we hold only the
verified $7–$33 band, which is a band, not a fixture); MSRP per style; the prepack size ratio
per style (we know packs are 6 — we do not know 2S/2M/2L versus any other run); per-style and
per-colour minimums; live inventory or any ATS feed; ship-window dates per delivery; a size
table per fit block; and a demo buyer account to test against.

### 9.2 Build a Rack — the persistent assortment builder

Replaces "add to cart" for authorised buyers. The word matters: a rack is what a buyer builds
in a showroom, and it is a *place*, not a transaction.

**Object model.**

- A **Rack** is named, persists server-side against the account, and a buyer may hold several
  (by season, by delivery, by door, by "thinking about it").
- A rack **row** is style + colourway. A **cell** is size. Multi-door buyers get a door
  selector per rack, following JOOR's constraint: **one door per order.**
- Submitting a rack creates orders — plural. **Split by ship window**, always. Both FashionGo
  and Faire converged on this independently; treat it as settled law rather than a decision.

**Quantity entry — the matrix, done properly.**

- A real `<table>`: sizes as `<th>` columns, colourways as `<th>` rows, one `<input
  type="number">` per cell. Not a canvas, not a div grid with ARIA bolted on.
- **Keyboard-first.** Tab and arrow keys move between cells; typing replaces; Enter commits the
  row. This is simultaneously the fastest interface for a professional buyer and the
  accessible one — the same design serves both (§8.3).
- **A prepack row is ONE input** — number of packs — with the expanded size ratio shown as
  read-only text beneath it. Never make a buyer type a ratio the pack already defines. This is
  the single most important adaptation of the industry matrix to L&B's actual product.
- **Validation is inline, visible and non-destructive.** The pack rule sits next to the input
  before it is broken. An invalid quantity offers a round-up the buyer *accepts* — it is never
  silently rewritten.
- Targets ≥ 24 × 24 CSS px (WCAG 2.5.8). Focus ring **Tobacco Leather `#734F36`** (6.49 : 1) —
  the specified Oxidized Silver fails at 2.18 : 1 per the audit.

**Three simultaneous progress readouts**, because they fail differently: units toward the
per-style MOQ, currency toward the **$50** order minimum, and pack-multiple validity per row.
All three gate submission; each needs its own message.

**States to design** (§11 requires every one): empty rack · minimum not met · pack rule
violated · item sold out while in the rack · price changed while in the rack · pre-order lines
about to split · submitted / pending vendor review · rejected. Plus offline and reduced motion.

**Persistence** is server-side and account-scoped. `localStorage` is not acceptable: buyers
work a phone at Dallas Market and a laptop at the store, and the rack must be the same object
in both hands.

**Data we do NOT have:** per-style pack ratios and MOQs (without these the matrix cannot
validate anything); any inventory signal, so "sold out while in your rack" has no trigger;
delivery windows to split orders by; whether L&B ever sells open-pack (which decides if the
matrix needs a per-size mode at all); door/multi-store structure for chain accounts; and the
order-approval workflow — verified approval is under one business day for *accounts*, but we
have nothing on whether *orders* are vendor-reviewed.

### 9.3 Digital Line Sheet — two artefacts, not one

**(i) The live line sheet.** A route inside the session. Grouped by **delivery window** by
default (JOOR's default, and the right one), then by category. Filterable with the trade facets
from §6. Every row carries a rack control, so browsing and ordering are the same act — this is
the whole point of a digital line sheet and the thing a PDF cannot do.

**(ii) The export.** Because a buyer in a market appointment needs a file, and their own
systems need data. Two formats: **CSV/XLSX** for their ERP, **PDF** for the meeting.

**Row contents** — the subset of the JOOR schema we can honestly populate: image · style name ·
style number · colour name and code · size range · **pack structure** · wholesale · MSRP ·
margin · MOQ · ship window (start / cancel) · availability state · materials and fabrication.
Country of origin is **absent, not blank** — "Made in Texas" is unevidenced (OQ-04) and a blank
field on a line sheet reads as an omission, which is worse than no field.

**Cover carries the terms**, not decoration: order minimum, pack rule, approval terms, ship
windows, and the market dates — permanent showroom **#13656**, **Aug 18–21** and **Oct 20–23,
2026**. All verified facts, all currently invisible on the site.

**Export security — the part that is easy to get wrong.** An export is restricted data *leaving*
the session in a file. Therefore:

- Generated **server-side, inside the session**, per request. Never pre-built.
- Served from a **signed, short-lived, session-scoped URL**. Never a predictable path.
  `/exports/linesheet-fw26.pdf` is a public price leak with extra steps, and it would sail
  straight past CI Tests 2 and 3 because it is not a route.
- `Content-Disposition: attachment`, `Cache-Control: private, no-store`. Never a CDN.
- **Stamped with the buyer's account name and generation timestamp.** Personalisation here is a
  traceability control, not a nicety — if a line sheet turns up somewhere it should not,
  the stamp says whose session produced it.
- Excluded from sitemaps and from `robots.txt`-visible paths. `robots.txt` is a courtesy, never
  a control (§13b).

**Data we do NOT have:** everything in §9.1's list, plus product photography (there are **zero**
production assets), a materials/fabrication string per style, and the delivery/season structure
that would give the line sheet its grouping.

### 9.4 Buyer Passport — the store, not the shopper

Read as **buyer-first**, consistent with D-17's partial resolution on evidence.

**Store profile.** Store name and DBA · storefront address(es), modelled as **doors** so chain
buyers work · buyer name(s) · sales tax ID **stored but never displayed in full — last four
only** · approval state and date · terms.

**Categories carried.** Which of our categories this store buys. Drives the default catalogue
filter and the drop digest. Directly modelled on JOOR Discover's retailer axes — location,
brands carried, wholesale price range.

**Size distribution — ask for it directly.** The ratio the store actually sells through. **This
is the differentiator.** Faire *infers* preference from clicks and purchases; JOOR profiles a
retailer by location, brands and price band. **Nobody in the set asks a boutique owner what
size curve their customers actually are** — and for a brand whose product ships in fixed packs
of 6, that number is the difference between a pack that sells out and a pack that marks down.

Used to **pre-fill the rack matrix** — visibly, reversibly, and labelled as such ("pre-filled
from your size profile"). Every pre-filled number stays editable. A pre-fill the buyer cannot
see the reason for is a dark pattern; one they can see and adjust is a service. It also
directly serves §11's fit-inclusivity commitment with a mechanism rather than a slogan.

**Saved racks, order history, reorder.** History carries the observed state model — placed /
under review → confirmed → partially or fully shipped → backordered (split) → pre-order (split)
→ cancelled → returned. **Reorder clones a past order into a new rack and then reconciles it
against current reality**, showing exactly what changed: discontinued styles, new colourways,
moved prices, altered pack ratios. Never silently substitute. JOOR's `order_type_name` treats
*Re-order* as a first-class order type, and so should we.

**Documents.** The buyer's own line-sheet exports, invoices, terms.

**Privacy.** All Passport data is restricted. Never in public HTML or metadata. Never in
analytics events with identity attached. Buyer identity is on §11's restricted list alongside
price.

**Data we do NOT have:** any buyer account data whatsoever · the approval workflow and its
states · what fields the current 25-field registration actually collects and which are legally
required · whether L&B holds size-distribution data for any account (almost certainly not — this
would be a new question asked at onboarding) · order history · and terms/credit structure.

---

## 10. Decisions this teardown surfaces

Not in the canonical register. Proposed for
[02_OWNER_DECISION_BRANCHES.md](../production/02_OWNER_DECISION_BRANCHES.md); labelled `W-n` to
avoid colliding with the existing `D-` numbering.

### W-1 · Is MSRP public or restricted?

§11 currently lists *"MSRP guidance"* as restricted. **Faire publishes it** —
`min_option_retail_price` is in the unauthenticated payload (MEASURED) — and its brands rely on
public MSRP to make MAP policy enforceable.

**Recommendation (INFERRED):** MSRP **public**, wholesale **restricted**, margin **restricted**.
The reasoning is arithmetic, not preference: **if MSRP is public and margin is displayed,
wholesale is derivable by subtraction.** Any branch that publishes two of the three publishes
all three. Publishing MSRP alone costs nothing (it is the consumer-facing price by definition),
makes the product page more useful to a consumer arriving from search, and keeps the buyer's
cost genuinely secret. **Owner decision required before any pricing UI is built** — retrofitting
this changes the type boundary, not just a template.

### W-2 · Is inventory depth restricted?

Faire ships exact `option_available_units` publicly — 1,699 units, 419 units (MEASURED). That
tells a competitor precisely how deep the stock is.

**Recommendation (INFERRED):** coarse bands in public (`available` / `low` / `waitlist` /
`preorder`), exact counts inside the session only. §11 requires availability to be public and
crawlable, and a band satisfies that without publishing the depth of the buy.

### W-3 · Pack structure — public or restricted?

Faire publishes pack labels and `min_order_quantity` (MEASURED); FashionGo makes `Open Pack` a
public facet (MEASURED). Neither treats pack structure as secret.

**Recommendation (INFERRED):** **public.** "Sold in prepacks of 6" is a product property, not a
commercial term, and a buyer needs it before they will spend attention on the style. It is
already a verified public fact about the brand.

### W-4 · Buyer testimonial consent

Faire publishes reviewer first name and town on public pages. If we ever publish buyer
testimonials, they require explicit written consent and no geographic identifier. §12 forbids
invented people; the corollary — do not casually expose real ones — should be written down.

---

## 11. Anti-patterns observed — do not copy

| Observed | Why not |
| :--- | :--- |
| **FashionGo:** product detail behind login *and* `Disallow: /item/`, all non-Google bots blocked | Solves the leak by deleting the shop window. §11 requires product facts public, semantic and crawlable |
| **FashionGo:** `productName` and `categoryId` in the login redirect query string | Product identity in a URL is a caching and logging hazard; use an opaque return token |
| **Faire:** blur as the visual language of the gate | The blur is decoration over a placeholder. The real control is that the number was never serialised — do not let anyone confuse the two |
| **Faire:** exact `option_available_units` in the public payload | Publishes stock depth to competitors. See W-2 |
| **Faire:** category page renders skeletons; body text empty for ~3s, content client-fetched | Fails our CI Test 1 outright. A no-JS visitor gets nothing |
| **Faire:** named buyer + town on public review quotes | Publishes a real individual's purchasing behaviour. See W-4 |
| **FashionGo:** three-plus competing badges per product tile | Badge inflation is the main reason the grid reads as a search tool rather than a shop. 235 styles do not need it |

---

## 12. Sources

**Measured directly in-browser, 2026-08-13** (no session, no interaction with any form):
`fashiongo.net` homepage · `/Catalog/womens-apparel/dresses` · `/item/26091020` (redirect
observed) · `/robots.txt` · `faire.com/category/Women` · `/brand/b_7dpvor9hnj` · `/robots.txt` ·
`joor.com/robots.txt` · `help.jooraccess.com` (auth redirect observed).

**JOOR public API reference** (`api-docs.jooraccess.com`) — Get Orders v2.0, Get Style v2.0,
Overview, Styles/Images/Linesheets integration mapping. The complete field lists in §2.2, §3.6,
§4 and §8 are read verbatim from these.

**Vendor documentation and feature pages:** joor.com — line sheet software, brands, retailers,
wholesale management, visual assortment planning, and the public insights articles on line
sheets and virtual showrooms · faire.com/support — case size, open sizing, minimum order
quantity, preorders · faire.com/how-faire-works · fashiongo.net/help-center — buyer categories,
My Orders, joining requirements.

**Third-party, used only for industry-wide mechanisms:** matrix/grid order entry and pack
enforcement (RepSpark, SparkLayer, WizzCommerce), JOOR Visual Assortment launch coverage
(FashionUnited, FashionNetwork), JOOR Passport coverage (Sourcing Journal, WWD, GlobeNewswire),
Faire Top Shop programme (BusinessWire).

**Cookie handling:** FashionGo's OneTrust banner was set to essential-only (functional and
targeting groups explicitly unchecked, then confirmed). Faire presented no banner in this
session.

---

## W-5 (added after implementation review): where does the style code live?

`WholesaleTerms.sku` files the style code under the restricted shape, so no public surface
can render it. The live business publishes its style codes publicly — in product names, in
public URL slugs (the D-00 finding was the *price* embedded beside the code, never the code
itself), and across its own public imagery filenames. Both trade-serving reference houses
print the style number on the public listing card, because buyers reorder by code.

**Proposed:** move the style code to the public base type as `styleCode`, leaving every
price, pack, MOQ and stock field exactly where it is. Blocked on confirming with the owner
that style codes are public-safe (all measured evidence says they already are). Until then
public cards deliberately omit it — the omission is annotated in `product-card.tsx`.
