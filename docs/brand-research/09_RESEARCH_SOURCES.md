# 09 — Research Sources

**All sources accessed 2026-08-01** unless otherwise stated.

Source hierarchy reminder: official Lucky & Blessed properties outrank marketplace
listings, which outrank retailer-written marketing copy, which is **never** treated as
official brand truth on its own.

---

## Tier 1 — Official Lucky & Blessed properties

Primary sources. These carry `VERIFIED FACT` status.

| # | URL | Retrieved | What it established |
| :--- | :--- | :--- | :--- |
| S-01 | `https://landbapparel.com/` | Browser | Homepage, navigation, "HEY Y'ALL!" copy, product names, "SIGN IN TO ADD TO CART" gating |
| S-02 | `https://landbapparel.com/about-us.html` | Browser | Full brand story, "Texan based lifestyle brand with a dash of sass", vertical integration, business hours |
| S-03 | `https://landbapparel.com/wholesale-info.html` | Browser | Sales tax ID requirement, $50 minimum, prepacks of 6 |
| S-04 | `https://landbapparel.com/faq.html` | Browser | **"only sell to approved retailers"**, account setup, approval timing |
| S-05 | `https://landbapparel.com/trade-shows.html` | Browser | WESA + Dallas Market Aug 18–21 2026; Dallas Market Oct 20–23 2026; showroom #13656 |
| S-06 | `https://landbapparel.com/store-locator.html` | Browser | Retailer locator, Cavender's filter, named boutique stockists |
| S-07 | `https://landbapparel.com/size-chart.html` | Browser | Size chart is a single JPEG, zero text content |
| S-08 | `https://landbapparel.com/april-2026.html` | Browser | Lookbook = 8 flat JPEGs, one character of body text |
| S-09 | `https://landbapparel.com/womens-western-dresses/` | Browser | Category structure, filter set (availability + range only), SEO copy |
| S-10 | Navigation/URL extraction, landbapparel.com | Browser | Full taxonomy, plus-size parallel tree, daily drop URLs, lookbook archive |
| S-11 | `https://www.luckyandblessed.com/` | WebFetch | **301 redirect** to landbapparel.com |

**Method note.** `landbapparel.com` returns **HTTP 403** to automated fetchers. All
Tier 1 sources were retrieved through a real browser session against the public site.
No authentication was attempted and no gated content was accessed.

---

## Tier 2 — Official brand presences on third-party platforms

Brand-authored copy, platform-verified metrics. `VERIFIED FACT` for the metrics the
platform itself reports.

| # | URL | Retrieved | What it established |
| :--- | :--- | :--- | :--- |
| S-12 | `https://www.dallasmarketcenter.com/exhibitors/lucky-and-blessed,-llc/` | WebFetch | Showroom WTC #13656, wholesaler classification, categories incl. home goods, contact |
| S-13 | `https://www.fashiongo.net/luckyandblessed` | WebFetch | Member since 2015-09-23, $7–$33 wholesale, 4.76/5 (262), 100% fill rate, 2.64-day processing, Fall 2026 = 235 items |
| S-14 | `https://www.faire.com/brand/b_cmenfyx54t` | WebFetch | 4.7/5 (353), 60-day terms, free opening-order returns, *"rodeo season, NFR, everyday cowboy chic"* |

**Official social channels** — identified from the site footer, contents **not**
retrieved (see OQ-07):

`instagram.com/luckyandblessed_official` · `tiktok.com/@luckyandblessed_official` ·
`youtube.com/@luckyandblessed_official` · `facebook.com/LuckyandBlessedOfficial` ·
`pinterest.com/landb_official`

---

## Tier 3 — Retailer and directory listings

Third-party copy. **Not** treated as official brand truth; used only for
`OBSERVATION`-level claims about distribution.

| # | Source | Status |
| :--- | :--- | :--- |
| S-15 | `starrwesternwear.com/collections/lucky-blessed` | **HTTP 429** — not retrieved |
| S-16 | `westernsoul.com/collections/l-b` | **HTTP 429** — not retrieved |
| S-17 | `zoominfo.com` company listing | Search-result summary only — Farmers Branch HQ claim |
| S-18 | `revamp.landbw.co` | WebFetch — **not a brand site**; an employee clock-in login on a company subdomain. Recorded to prevent future misidentification |
| S-19 | `tiktok.com/view/product/1729452403164811418` | **Security challenge** — seller unidentified (OQ-02) |

---

## Tier 4 — Competitive and reference research

Conducted by delegated research agents. Full reports retain their own source tables and
their own evidence labels; findings are summarised in
[03_MARKET_AND_REFERENCE_RESEARCH.md](03_MARKET_AND_REFERENCE_RESEARCH.md).

| Group | Scope | Status |
| :--- | :--- | :--- |
| **Group 1** | Western and western-crossover brands | Complete — Miss Me, Grace in LA, Rock & Roll Denim, Cowgirl Tuff, Sterling Kreek verified against live sites |
| **Group 2** | Premium fashion commerce | Commissioned |
| **Group 3** | Immersive digital experiences and web-platform evidence | Commissioned |

Group 1 primary sources verified live on 2026-08-01 include
`wholesale.missme.com/create_account.php`, `missme.com/pages/fit-guide`,
`graceinla.com/pages/about-us-grace-in-la-embellished-jeans`,
`rockandrolldenim.com/pages/about-us`, `cowgirltuff.com/jeans/`,
`cowgirltuffwholesale.com/wholesale/`, `sterlingkreek.com/`.

---

## Local project sources

Inspected only to the extent needed for context. **The Stitch V3 engineering audit has
not been performed** — the brief defers it.

| Path | Status |
| :--- | :--- |
| `archive/v1-exploration/` | Present — three desktop and three mobile directions, plus a research matrix. Not yet analysed |
| `archive/v2-synthesis/` | Present — eight V2 frames. Not yet analysed |
| `stitch-export/v3-production/` | Present — 12 V3 frames, a connected prototype, shader and three.js references, `design.md`, `engineering_export_package.md` |
| `docs/CREATIVE_CONSTITUTION_SEED.md` | **Does not exist.** Named in the skill definition as a strategic input; absent from the repository |
| `CLAUDE.md` | Did not exist prior to this research pass |

`OBSERVATION` — V1 and V2 were **not** analysed in this pass. The brief for this stage
scoped research to brand, market and audience, and explicitly deferred export
inspection. Design-evolution analysis belongs to the V3 audit stage.

---

## Method limitations

Recorded rather than concealed.

1. **HTTP 403** — `landbapparel.com` blocks automated fetchers. Worked around with a
   real browser session against public pages only.
2. **HTTP 429** — Shopify-hosted retailer and competitor origins rate-limited
   repeatedly. Retail price confirmation (OQ-05) is outstanding.
3. **Web search budget exhausted** — 200/200 calls consumed. Social metrics and several
   verification passes could not be completed.
4. **Social platforms blocked** — Instagram, TikTok and Pinterest returned challenges or
   empty bodies; YouTube returned no channel content.
5. **Login-gated content not accessed** — the wholesale buyer experience is the most
   important unseen surface in the project. Authentication into third-party systems was
   not attempted. Request a demo account (OQ-19 in practice; see
   [10_OPEN_QUESTIONS.md](10_OPEN_QUESTIONS.md)).
6. **Rendered-text extraction** — the fetch tooling returns rendered content, not raw
   markup, so no claims are made about competitors' mobile implementation quality.

---

## Citation rule for downstream work

When any document, component or piece of copy in this project asserts a brand fact, it
must be traceable to a source ID above. **If it cannot be traced, it is not a fact** —
it is an inference, and must carry that label.
