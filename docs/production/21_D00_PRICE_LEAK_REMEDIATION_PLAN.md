# 21 — D-00 Wholesale Price Leak · Remediation Plan

> **This is a live operational issue on the existing production website, independent of the
> redesign. It is documented here for the owner. Nothing in this plan has been executed and
> the current production site has not been modified.**

---

## 1. The finding

`VERIFIED FACT` — Confirmed by direct fetch, 2026-08-01. Wholesale unit cost is publicly
readable without an account, in three distinct ways.

**1. Price embedded in the URL slug**

```
/30-00-camel-wash-stretch-denim-rhinestone-detail-cuffed-wide-leg-jeans-30in-inseam-clone-en.html
/26-00-mid-wash-crease-cuffed-high-rise-boyfriend-jeans-28in-inseam-folded.html
/23-00-black-rodeo-buck-stitch-printed-stretch-denim-shorts-3in-inseam.html
/16-00-classic-western-button-down-long-sleeve-denim-dress.html
/15-00-horse-snaffle-bit-burnout-collared-button-down-puff-short-sleeve-shirt-clone.html
```

| Surface | Priced slugs |
| :--- | :--- |
| Homepage | **17** |
| `/aug-01/` daily drop | **14** |
| Category pages | 0 |

**2. Price printed in the product title** — `($31.00) Stone Wash Stretch Denim Dress…`,
`($16.00) Classic Western Button Down Long Sleeve Denim Dress`.

**3. Third-party widget computing on un-gated data** — an Afterpay module rendering
*"Or 4 payments of $60.00"* on an 8-unit pack at $30/unit.

`OBSERVED` — The leak appears on hand-curated merchandising blocks (homepage, dated drops)
and **not** on category pages, whose tiles render differently. It is therefore a
**slug-generation and template issue**, not a platform limitation.

---

## 2. Business impact

1. **Competitors can reconstruct the full cost sheet.** Sterling Kreek, Judy Blue, Cowgirl
   Tuff and Double D Ranch can price directly against L&B.
2. **A boutique's own customers can see what the shop paid.** A shopper who finds a `$16.00`
   slug on a dress her local store sells at $42 has been handed the markup — damaging the
   retailer L&B exists to serve (*"We are partners in your success"*).
3. **Resale-price discipline becomes unenforceable.** Competitors in this category enforce
   MAP with published rules and account revocation; that posture is not credible while cost
   is public.

---

## 3. Remediation sequence

| # | Action | Notes |
| :--- | :--- | :--- |
| 1 | **Stop the bleeding at generation.** Change the slug rule so price is never a component. New slugs derive from product name only | Highest priority; prevents new leaks |
| 2 | **Rewrite the 31+ affected slugs** to price-free equivalents | `/classic-western-button-down-long-sleeve-denim-dress.html` |
| 3 | **301 every old URL to its new slug** | Preserves link equity and any indexed ranking |
| 4 | **Strip the price prefix from product titles** | `($16.00) Classic Western…` → `Classic Western…` |
| 5 | **Reconfigure or remove the Afterpay widget** on wholesale surfaces | It must never receive un-gated pack totals |
| 6 | **Audit public metadata** — `<title>`, meta description, Open Graph, JSON-LD, sitemap — for the same pattern | The sitemap is the most likely secondary carrier |
| 7 | **Request removal from search indexes** for cached priced URLs | Google Search Console removals + `noindex` on the old paths until the 301s propagate |
| 8 | **Purge CDN and page caches** | A cached priced page survives a fixed template |

---

## 4. Verification

**Pre-flight (capture the baseline):** record the count of priced slugs per surface, and
archive a sample of the current HTML as evidence of the starting state.

**Post-change assertions** — all must pass:

```bash
# A. No generated URL contains a price pattern
#    Fail on any /NN-NN- path segment
curl -s https://<site>/ | grep -oE 'href="[^"]*/[0-9]{1,3}-[0-9]{2}-[a-z][^"]*"' | wc -l   # expect 0

# B. No product title carries a parenthesised price
curl -s https://<site>/ | grep -oE '\(\$[0-9]+\.[0-9]{2}\)' | wc -l                        # expect 0

# C. Old URLs redirect rather than 404
curl -sI https://<site>/16-00-classic-western-button-down-long-sleeve-denim-dress.html \
  | head -1                                                                                 # expect 301

# D. Unauthenticated HTML contains no wholesale-band price
#    Verified band is $7–$33; assert absence of that pattern in public markup
```

**With and without JavaScript.** Both must pass — fetch the raw HTML (no JS) *and* a
rendered DOM. A price absent from source but injected client-side is still a leak.

**Logs and analytics.** Confirm that priced URLs are not being written into access logs,
analytics page-path dimensions, or error reports. Historic log retention may need purging.

---

## 5. Rollback

Each step is independently reversible. The slug rewrite is the only step with SEO exposure —
**do not remove the 301s** even if the slug change is reverted, or previously-indexed URLs
will 404. Keep the redirect map permanently.

---

## 6. Owner communication

**What to say, plainly:** *"Your wholesale costs are currently readable by anyone — they are
part of your product web addresses. Competitors can see your whole cost sheet, and so can
your retailers' customers. It's fixable without a redesign, and it should be fixed before
the August market."*

**Timing note:** the **WESA + Dallas Apparel & Accessories Market runs August 18–21, 2026.**
Buyers will be researching vendors immediately beforehand. Fixing this before the market is
materially more valuable than fixing it after.

**Decision needed:** whether remediation runs on the existing CS-Cart platform now
(recommended) or waits for the new build (not recommended — that is months away).

---

## 7. Relationship to the new build

The three CI tests in [`18_TEST_AND_CI_STRATEGY.md`](18_TEST_AND_CI_STRATEGY.md) are designed
to make this class of failure **structurally impossible** in the new platform:

- **Slug purity assertion** — no generated URL may contain a numeric price pattern
- **Unauthenticated crawl assertion** — zero restricted price patterns in public HTML,
  headers, inline JSON or metadata
- **No-JS product assertion** — public product information present without JavaScript

**Remediating the live site does not remove the need for these tests, and shipping the tests
does not remediate the live site. Both are required.**
