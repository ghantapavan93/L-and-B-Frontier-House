# 20 — Content Governance

---

## 1. The rule

> **Every production claim must be one of:**
> **(a)** a verified public fact · **(b)** owner-confirmed · **(c)** approved campaign fiction,
> **clearly labelled as such** · **(d)** product-data-backed · or **(e)** a clearly-marked
> conceptual fixture in development.
>
> **Anything else does not ship.**

---

## 2. Removals — not branches

These contradict verified brand truth. There is no alternative branch.

| Claim | Where | Why it must go |
| :--- | :--- | :--- |
| **"EST. 1865"** | Engraved into the V3.1 mobile hub's buckle | L&B dates to ~2015. A **160-year fabricated heritage claim, baked into pixels** — cannot be fixed by editing copy |
| **"Origin: 1870s American West"** | `8b` caption | A **second, mutually inconsistent** fabricated date |
| **"Kuroki Mill"** | V3 Frame 8 | Attributes the denim to a named Japanese mill. **Contradicts verified vertical integration** — the brand owns its textile production |
| **"Tannery Dispatches: Leon & Tuscany"** | V3 Frame 11 | Same, plus it undercuts Texas identity |
| **"vintage shuttle looms"**, **"Sourced ethically, milled for resilience"** | V2 Frame 3 | Where the invented-sourcing pattern begins |
| **"Hand-tooled in the Frontier House workshop"** | V2 Frame 4 | An unverified manufacturing claim |
| **Arthur Pendelton · E. Vance Holdings · J.R. Cash** | V3 Frame 11 approvals queue | Invented people. **J.R. Cash is Johnny Cash's birth name** |
| **Monogram "J.D."** | V2 F5, V3 F10 | Invented customer |
| **"Frontier Trust 4,250" · "$150 store credit"** | V3 Frame 10 | Invented loyalty. **Does not exist in V2** — a V3 invention |
| **"Neon Thread"** as a material | `8b` | Not a western material |
| **$45–$1,250 price fixtures** | Throughout | Verified wholesale is **$7–$33**; implied retail **$20–$85** |
| **"Men's Collection" / "FOR HIM" / "MEN"** | V1 ×6, V3 F5, V3 F6, `8g_1`, `12k` | **Menswear does not exist** |
| **Boots / footwear** | V1 onward | Unverified inventory |
| **"View in Space" (AR)** | `8g_8` | In no manifest, handoff or specification |
| **Los Angeles coordinates** presented as location data | V1 Desktop C | Wrong geography, malformed string |

---

## 3. Claims that require owner evidence before use

| Claim | Status |
| :--- | :--- |
| **"Made in Texas"** or any manufacturing location | **Not evidenced (OQ-04).** *"from the heart of Texas"* — V1's phrasing — asserts identity **without** a manufacturing claim, and is the safe formulation |
| **Home goods** | Partially verified — claimed in About Us and the DMC listing, depicted in `8g_8`, **absent from the live taxonomy** (D-05) |
| **Cavender's relationship** | Real and already public on the brand's own store locator; whether it is usable as a **marketing claim** is separate (OQ-06) |
| **Bespoke / custom production** | No evidence it is offered (OQ-12) |
| **International reach** | *"thousands of retailers all across the world"* is a claim without numbers (OQ-11) |
| **"L&B Frontier House"** as a public name | Working internal name (D-10) |

---

## 4. Claims that are verified and should be used more

These are true, differentiating, and **currently surfaced nowhere on the brand's own site**:

- **100% order fill rate**
- **2.64-day processing**; same-day or next-business-day dispatch if ordered by 5pm CST
- **4.76/5 from 262 reviews** and **4.7/5 from 353 reviews** — 615 combined
- **Vertical integration** — *"we own, operate, and manage all areas of the supply chain…
  textile, design, manufacturing, distribution, and sales"*
- **Permanent showroom #13656**, Dallas Market Center; markets **Aug 18–21** and
  **Oct 20–23, 2026**
- **Since 2015** on FashionGo
- **$50 minimum · prepacks of 6 · sales-tax ID · approval under one business day**

> `INFERRED` — For a boutique buyer deciding where to spend an open-to-buy budget,
> **"100% fill rate"** outperforms any amount of cinematic motion. **Real numbers only —
> never round them up**, and never restate 615 reviews as "over 600 five-star reviews," which
> they are not.

---

## 5. Voice

`VERIFIED FACT` — The brand's own voice: **"Howdy"** · **"Hey y'all"** · **"a dash of sass"**
· **"We are partners in your success"** · **"Have a Lucky & Blessed day!"** ·
*"fiercely independent, unique customers of all ages, shapes and sizes."*

`OBSERVED` — The designs read *"Craft Your Legacy"*, *"Every stitch is a deliberate act of
creation"*, *"Crafted for the Modern Horizon."* **Silent luxury. Not this brand.**

**Rule: the warmth stays.** Premium comes from photography, typography and motion craft —
**never from deleting the personality.** Deleting the warmth is the one thing the Creative
North Star explicitly forbids.

---

## 6. Campaign fiction — permitted, with labels

Campaign narrative is legitimate. *"Midnight Rodeo"* is a campaign name, not a factual claim,
and V2 Frame 4's structure is worth recovering.

**Permitted:** campaign names, editorial concepts, styling narratives, collection titles.
**Not permitted under a campaign banner:** founding dates · manufacturing claims · sourcing
attributions · named people presented as real · construction specs the product does not have
(e.g. *"Goodyear welt construction"* on a category the brand does not make).

**A campaign may be evocative. It may not be evidentiary.**

---

## 7. Enforcement

1. **Provenance on every media asset.** `generated-placeholder` fails the build if referenced
   from a production route (`06`, `18`).
2. **Fixture band check.** No fixture price outside $7–$33 without an explicit illustrative
   annotation.
3. **Claim review before public launch** — every factual sentence traced to a source ID in
   `docs/brand-research/09_RESEARCH_SOURCES.md`. **If it cannot be traced, it is an inference
   and must be labelled as one — or removed.**
4. **Copyright and season currency.** The corpus carries **© 2024**, *FALL '24* and *AW24*
   throughout. All stale against 2026.
