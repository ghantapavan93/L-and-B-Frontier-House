# LB — Reference Translation

**Mechanism → Frontier House.** Companion to
[LB_REFERENCE_TEARDOWN.md](LB_REFERENCE_TEARDOWN.md), which carries the measured numbers.
This document records *what each reference does well, why it works, and what this build
does with it* — principles only, nothing copied. Live L&B findings measured 2026-08-07.

---

## 1. The current business, measured live (2026-08-07)

**landbapparel.com is the authority for what the business *is*; none of it is how the
business should *feel*.**

| Mechanism observed | State | Translation |
| :--- | :--- | :--- |
| Nav is a merchandising calendar — New Arrivals · Specials · Styles of the Week · **Fall 2026 Collection** · Lookbook · Clearance 30–60% | Live | The nav sells the *calendar*, not just the taxonomy. Frontier House: programming entries (drop, sale, market) surface in nav/promo bar from the content model, not hardcoded |
| **Full catalog now login-gated** — /shop/ and every category page render a sign-in form where the grid should be | Live, harsher than the research snapshot | We do the opposite deliberately: product truth public and crawlable, *prices* absent-not-hidden. Their gate loses SEO and browse-before-apply; ours converts it into an invitation |
| **D-00 still live** — homepage cards show `($25.00)`-prefixed names to signed-out visitors while the shop is gated | Contradiction, live today | Raise to owner again. Our slug-purity and crawl CI tests exist because of exactly this |
| Registration: **~25 fields on one page** — email/password, names, company, two phones, SMS opt-in, **Customer Type (Western · Boho · Contemporary · Conservative · Other)**, store Facebook/Instagram, brick-&-mortar address, **Sales Tax ID**, referral source (Google/Social/LAShowroom/Fashiongo/Dallas Market/Atlanta Market), preferred communication, shows attended, comments, full shipping address, anti-bot | Live | The field *set* is the business truth — keep it. The single-page *shape* is the failure — split into four steps (business → credentials → buying profile → review), conditional fields, visible progress. Customer Type and shows-attended become the buying-profile step |
| Wholesale info page: four sentences | Live | The rules are right (Tax ID · $50 · prepacks of 6) and stay verbatim; the presentation becomes the how-it-works journey on /wholesale |
| Card badges: New · Pre-Order · Sale 20% | Live | Keep as availability/programming badges; Pre-Order is already first-class here |
| Homepage rows: New Arrivals + Styles of the Week; brand letter "HEY Y'ALL"; contact form on the homepage | Live | Styles-of-the-week cadence → `/new-arrivals` drop page + This Week band. The warm letter voice is verified brand voice — keep it in ours |
| Chat bubble bottom-right ("Hi! How can we help you today?") | Live | They already run one. Ours ships as the **House Guide** — an honest FAQ/contact launcher, no fake AI |
| Category SEO prose is fit-led — Boyfriend, Ripped, Jeggings, Flare | Live | Fit-led discovery is native to this catalog. Feeds /find-your-denim and the fit facets |

## 2. Western references

| Reference | Does well | Why it works | Frontier House translation |
| :--- | :--- | :--- | :--- |
| **Double D Ranch** | 19 short product-motion loops on one homepage; named collections as stories; journal beside commerce | Many small moving proofs beat one hero film; a collection with a name is a reason to return | MotionClipBand slots (owner drops 3–6s loops, no code); programming model gives every drop a name and a story; h1 as a sentence, not a label |
| **Sterling Kreek** | Wholesale identity stated immediately; login + application + minimums unmissable | A buyer decides in seconds whether this is for them | Trade access in header, footer, homepage chapter; terms stated before the form asks anything |
| **Miss Me / Grace in LA** | Close-range denim proof — pocket, stitch, embroidery; alternate views; fast browsing | The detail *is* the argument at this price point | PDP reserved slots for detail crop + back view; craft chapter photographs thread-close |
| **Kimes Ranch** | Fit intelligence — construction, size depth, denim comparison | Fit certainty removes the wholesale buyer's real risk | /find-your-denim, structured size tables, fit facets; h1 16px — proof type can whisper |
| **Tecovas** | Restraint + rich attribute filtering (waist/inseam/fit/material/use); Quick Add; craft storytelling | Premium and utility are not in tension | Facet model already URL-state; add fit/wash facets as data allows; Quick View from card |
| **Cavender's** | Broad taxonomy, deep filters, promotion discoverability | Filters are how a big catalog stays navigable | Facet architecture ready for 235+ styles; only render filters backed by data |

## 3. Premium / editorial references

| Reference | Does well | Why it works | Translation |
| :--- | :--- | :--- | :--- |
| **Sézane** | 953 products, one scroll; 40-image PDPs; 4 accordions; serif body at 13px; no motion library | Density + quiet type = warmth at scale | Grid breaks every 12; PDP accordions (shipped); type scale reversed to reference values |
| **Burberry / Gucci / Prada** | 11,424px editorial scrolls; h1 20px or absent; images dominate | The photograph is the headline | Homepage chapters, quiet type, image-led bands |
| **SSENSE** | Editorial and commerce co-exist without interfering | Credibility transfers to checkout without slowing it | /edit pages beside shop; cinema never gates commerce |
| **GANNI** | Distinct personality through worlds/entries | A brand voice you can enter | Choose-Your-West edits over the same product truth |
| **Burberry × SSENSE / Lusion** | The admired immersive pieces are **microsites with no cart**; the only WebGL page sells nothing at 16.74 MB | Cinema belongs to discovery | Buckle stays pre-rendered media; zero WebGL in the store — settled, do not reopen |

## 4. What this pass builds from the above

1. **Search** — real, server-rendered, public fields only (their site's search is absent from the nav too; ours ships because the catalog exists to search).
2. **Grouped header** — Shop / Discover / Trade, disclosure panels, no novelty nav.
3. **Quick View** — `:target` overlay from the card, zero JS, PDP link as fallback.
4. **Hover-alt** — second image on hover/focus only where a second image exists. No fake motion.
5. **Four-step Trade Access** — the L&B field truth in a premium shape; designed received/pending/approved/denied states.
6. **Programming model** — drop / sale / lookbook / show / promo-bar entries with windows, so the owner launches a week without a developer.
7. **House Guide** — honest FAQ + contact launcher, bottom-right, no fake AI.
8. **Buyer dashboard** — new-this-week, reorder, saved rack: the site becomes a buying tool after approval.

Everything above ships with zero added client JavaScript, inside the §10 budgets, with
restricted data absent-not-hidden. Menswear remains a **fixture-flagged demo** behind the
frontier flag until D-03; no unsupported business claim ships (§13b).
