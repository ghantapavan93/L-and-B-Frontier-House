# 07 — Content and Media Strategy

**Research date:** 2026-08-01

---

## 1. What content actually exists today

`VERIFIED FACT` — Audited live on 2026-08-01:

| Asset | Status | Quality of implementation |
| :--- | :--- | :--- |
| Product photography | Exists at scale — 235 items in Fall 2026 alone | Catalog-grade; unverified whether editorial-grade masters exist |
| Monthly lookbooks | Six live (Jan–Jun 2026) | **Flat JPEGs. No text, no links, no alt text** |
| Daily drop pages | `/jul-27/` … `/aug-01/` | Live and current |
| Size chart | One JPEG | **Zero extractable text** |
| Category SEO copy | Substantial, retailer-directed prose | Well written; describes themes that are not navigable |
| Brand story | About Us | Strong voice, single page |
| Social channels | 5 official accounts | Content patterns unverified (OQ-07) |
| Video / fashion film | **None found on site** | (OQ-13) |
| Craft / manufacturing content | **None found** | The biggest untold story |

### 1.1 The central content finding

> **Lucky & Blessed already produces monthly editorial photography and then throws away
> its commercial value.**
>
> The April 2026 lookbook is eight full-bleed JPEGs — `Apr 26-COVER.jpg` through
> `Apr 26-7jpg.jpg` — with a body-text length of **one character**. There is no link
> from any image to any product.

`REASONABLE INFERENCE` — Someone styles, shoots, retouches and lays out a lookbook every
month. That is a real, recurring production cost already being paid. The images are the
brand's best argument, and they currently sell nothing, rank for nothing, and are
invisible to assistive technology.

`RECOMMENDATION` — **Shoppable lookbooks are the highest return-on-effort content
decision available**, because the expensive part (photography) is already happening. The
missing part is a data relationship between an image and the SKUs in it. This is the
minimum viable form of the brief's entire "editorial becomes commerce" thesis, and it
requires no WebGL, no film crew and no new budget.

---

## 2. Media integrity rules

The brief warns that Stitch exports may contain generated or placeholder imagery. These
rules are non-negotiable and belong in CLAUDE.md.

1. **Generated imagery is never presented as real product.** Any image produced by a
   design tool or model is a layout reference until a real photograph replaces it.
2. **No invented product facts.** Names, colours, materials, sizes, prices, availability
   and wholesale terms come from verified data or from fixtures that are *clearly
   labelled as fixtures* in the code.
3. **No fabricated brand claims.** "Made in Texas", sustainability claims, factory
   certifications and heritage dates must not appear unless sourced. `OPEN QUESTION` —
   where manufacturing happens is unverified (OQ-04).
4. **No invented people.** No fake reviews, fake testimonials, fake ambassadors, fake
   stockist quotes.
5. **Fixtures are visually distinguishable in development** so a placeholder cannot
   silently ship.
6. **Real numbers only.** The operational metrics worth surfacing — 100% fill rate,
   2.64-day processing, 4.76/5 from 262 reviews, 4.7/5 from 353 — are already true.
   Never round them upward or restate them as "over 600 five-star reviews", which they
   are not.

---

## 3. Declared media slots

`RECOMMENDATION` — Every media position in the platform is a **declared slot** with a
name, an aspect ratio, a poster, a fallback and an owner. A slot with no asset renders
its poster or its empty state — never a broken or collapsed container.

| Slot | Ratio | Fallback when missing | Exists today? |
| :--- | :--- | :--- | :--- |
| `campaign.hero.film` | 16:9 | Poster still | No (OQ-13) |
| `campaign.hero.mobile` | 9:16 | Poster still | No |
| `drop.daily.cover` | 4:5 | First product image | Effectively yes |
| `lookbook.page` | Variable | Existing JPEG | **Yes — six months of it** |
| `product.gallery.*` | 4:5 | — | Yes |
| `product.macro.material` | 1:1 | Cropped gallery image | Unverified |
| `product.motion` | 4:5 | Poster still | No |
| `craft.process.*` | 16:9 / 1:1 | Static still | No |
| `collection.trailer` | 16:9 | Cover still | No |
| `film.chapter.*` | 16:9 | Chapter poster | No |
| `anatomy.layer.*` | 1:1 | Flat product image | No |

`OBSERVATION` — Only two of eleven slots have assets today. **A cinematic platform is
being designed on top of a media library that does not yet exist.** That is the
project's largest practical risk, and it is a production risk rather than an engineering
one.

`RECOMMENDATION` — Build every cinematic surface **poster-first**: the still image is the
canonical asset and video is the enhancement. This means the site is complete and
launchable with photography alone, and each film upgrades a surface that already worked.
It also happens to be the correct pattern for reduced motion, slow connections and
autoplay restrictions.

---

## 4. Production briefs needed

`RECOMMENDATION` — Missing assets, in priority order by value per unit of cost:

1. **Material macro set** — buck-stitch, burnout velvet, denim slub, pearl snap, suede
   nap, rhinestone. Small, cheap, shot in a day, and it carries the entire "premium
   through material honesty" thesis in [04](04_CREATIVE_NORTH_STAR.md).
2. **Craft / vertical-integration set** — the strongest unused brand story. Verify what
   can honestly be shown before shooting (OQ-04).
3. **Garment motion clips** — 3–6 seconds each, silent, looping. Fringe, ruffle, burnout
   and wide-leg denim only read in movement.
4. **Lookbook re-shoot with SKU mapping** — or simply map the existing six months, which
   costs nothing but data entry.
5. **Campaign film** — the "Midnight Rodeo" concept. Highest cost, highest visibility,
   and it should come after 1–4 have proven the visual language.
6. **On-body imagery across the full size range** — required to make the inclusivity
   claim credible rather than stated.

`OBSERVATION` — Items 1–4 are achievable with existing product and a small crew. Only
item 5 needs a production budget. The project does not have to wait for a film to look
like a fashion house.

---

## 5. Editorial content the brand should own

`RECOMMENDATION` — Each tied to evidence, not to generic content-marketing advice:

| Content type | Why it is credible here |
| :--- | :--- |
| **The Daily Drop** | A genuine daily cadence already exists |
| **Monthly Lookbook** | Already produced; needs shoppability |
| **Rodeo & NFR season guides** | *"designs for rodeo season, NFR"* is the brand's own language |
| **Market previews** | Aug 18–21 and Oct 20–23 are real revenue events |
| **How It's Made** | *"we own... textile, design, manufacturing"* — verifiable and rare |
| **Stockist stories** | Named boutiques exist; *"We are partners in your success"* made literal |
| **Fit & fabric guides** | Fills the most damaging current gap |
| **Styling across the three western identities** | Serves lived / celebrated / referenced — see [02](02_AUDIENCE_AND_JOURNEYS.md) §D |

`OBSERVATION` — Not one of these requires inventing a brand story. Every one is
documentation of something Lucky & Blessed already does.

---

## 6. Accessibility of content

`RECOMMENDATION` — Content-level obligations, distinct from interface accessibility:

- **Every image carries meaningful alt text.** The lookbook currently has none; the size
  chart is an image whose entire informational content is inaccessible. This is a
  probable **WCAG 1.1.1** failure today.
- **Size and fit data is structured text**, never an image of a table.
- **Video is captioned** when it carries information, and has an accessible description
  when it carries narrative.
- **No text baked into images** where that text matters — it cannot be read, searched,
  translated or resized.
- **Editorial imagery describes the garment**, not just the mood — alt text on a lookbook
  page should name what is being worn, since that is its commercial and informational
  purpose.

---

## 7. Content operations

`VERIFIED FACT` — `april-2026-clone.html` and `may-2026-clone.html` exist as live URLs,
and the navigation item "JANUARY 2026" links to `january-2025.html`.

`REASONABLE INFERENCE` — Monthly editorial is published by duplicating the previous
month's page. It works, it is fast for the person doing it, and it silently accumulates
dead URLs and mislabelled links.

`RECOMMENDATION` — The replacement must be **faster than duplicating a page**, or it
will not be adopted. Concretely: create a dated drop or lookbook, attach images, link
products by search, schedule, preview, publish. If that flow takes longer than
copy-paste, the team will keep copy-pasting and the cinematic platform will show stale
content within one month of launch.

`OBSERVATION` — This is the most likely quiet failure mode for the whole project. It
will not look like a technical failure; it will look like a beautiful site nobody
updated.

---

## Cross-references

- [01_PRODUCT_AND_CATEGORY_MAP.md](01_PRODUCT_AND_CATEGORY_MAP.md) §7 — the lookbook gap
- [04_CREATIVE_NORTH_STAR.md](04_CREATIVE_NORTH_STAR.md) — what premium looks like here
- [05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md) §6 — operator surface
- [08_TECHNICAL_PRINCIPLES.md](08_TECHNICAL_PRINCIPLES.md) — media delivery
- [10_OPEN_QUESTIONS.md](10_OPEN_QUESTIONS.md) — OQ-04, OQ-07, OQ-13
