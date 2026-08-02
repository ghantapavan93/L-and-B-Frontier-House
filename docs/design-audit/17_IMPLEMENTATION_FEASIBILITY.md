# 17 — Implementation Feasibility

**No architecture is proposed and no technology is approved.** This records what is
reusable, what must be rebuilt, and what each surface should realistically become.

---

## 1. What is technically reusable

`INFERRED` — assessed by opening every file.

| Artefact | Reusable? | Why |
| :--- | :--- | :--- |
| **Specifications** (buckle spec, state tables, narrative geometry, media briefs, motion tokens, QA report) | **Yes — high value** | Genuinely good direction. The buckle's supply-chain engraving is the best-argued detail in the corpus |
| **42 preview renders** | **Yes — as reference** | The only durable visual record |
| **Layout and composition intent** | **Yes** | Editorial restraint in the renders is sound |
| **Type scale, spacing, radius tokens** | **Yes — partially** | 12/14/16/18/32/48/84; 1440 / 24 / 20 px; radii 2–12 px are EXACT |
| **Colour tokens** | **Documented only** | 5 of 7 appear in zero V3 frames; all 7 in zero V3.1 frames |
| **HTML markup** | **No** | Tailwind CDN in 48/48; no forms; no focus; no video |
| **Three.js code** | **No** | Six sketches, one **broken**, on a five-year-old library, flat non-PBR materials |
| **Shader code** | **Partially** | Real simplex noise; no scene binding, no uniforms |
| **Route map** | **No** | Unsubstituted `{{DATA:SCREEN:…}}` placeholders |
| **Any asset** | **No — none exists** | 0 GLB, 0 GLSL, 0 video, 0 texture, 0 local font |
| **Prices and copy** | **No** | $45–$1,250 fictional; voice is not the brand's |

---

## 2. What must be rebuilt from zero

1. **All markup.** Semantic, server-rendered, form-bearing, focus-managed.
2. **All 3D.** Models, materials, shaders, camera paths — with the buckle rebuilt as a
   **chamfered rectangle with PBR materials**, per the board and spec, not the code.
3. **All media.** Hero film, denim macro, distribution footage, posters.
4. **All commerce mechanics.** Auth, tax-ID gate, prepacks, minimum, MSRP, filters, sort,
   size and fit, pre-order, cart.
5. **All states.** Loading, empty, error, unauthenticated, pending approval, reduced
   motion, offline.
6. **The permission boundary.** No concept of one exists anywhere.
7. **The token system.** Compile the brand palette into real tokens; the current output is
   a Material 3 default theme inherited from V1.

---

## 3. What should become video rather than real-time 3D

`INFERRED` — The test: *is the sequence deterministic and non-branching?* If yes, video is
cheaper, universally supported, colour-managed, and avoids a 132–250 KB bundle floor.

| Sequence | Verdict | Reasoning |
| :--- | :--- | :--- |
| **Belt Buckle S1–S8** | **VIDEO** | 8 fixed states, ~7.1 s, no branching |
| **Camera Passage T1–T6** | **VIDEO** | Fixed camera move; 3 of 8 steps were never even exported |
| **Thread Ignition / Blueprint Unfold** | **VIDEO or SVG/CSS** | A stroke animation; needs no engine |
| **Impossible Warehouse reveal** | **VIDEO** | Establishing shot |
| Campaign film | **VIDEO** | Always was |
| **Product Anatomy** | **Real-time 3D — the one candidate** | Genuinely interactive; delivers information a photograph cannot |
| Category orbit labels | **DOM overlay** | Must be semantic and keyboard-reachable regardless |

> `INFERRED` — **Two of thirteen surfaces have a plausible real-time 3D case, and one is
> blocked on assets that were never produced.** The two most cinematically ambitious
> sequences are both deterministic — the textbook definition of something that should be a
> well-encoded video.

---

## 4. What should remain ordinary semantic HTML

`INFERRED` — Everything transactional and everything indexable:

Product names, prices, descriptions, materials, sizes, availability · category and
collection listings · filters and sort · search and results · cart with pack quantities ·
buyer registration, login, approval status · size and fit tables · navigation · the
**parallel product list beneath any shoppable film** · every category label over a canvas ·
all editorial body copy.

`OBSERVED` — V3.1 already specifies this pattern: *"Semantic HTML overlay for all category
labels (Skip Intro, navigation)."* **The correct architecture is already in the approved
direction.**

---

## 5. Feasibility by surface

| Surface | Feasibility | Blocker |
| :--- | :--- | :--- |
| Living Contact Sheet | **High** | None — build first |
| Flagship Homepage | **High** | None |
| Wholesale Showroom | **High technically** | Every mechanic must be designed from scratch |
| Midnight Rodeo | **Medium** | Pinning + INP + 2.4.11 |
| Four Worlds overlay | **Medium** | **Blocked** — `FOR HIM`, taxonomy conflict |
| Buckle (as video) | **Medium** | Needs 3D production, then render |
| Camera Passage (as video) | **Medium** | 3 transitions never designed |
| Image→Film / Shoppable Film | **Blocked** | No film exists (OQ-13) |
| Product Anatomy | **Blocked** | No GLB exists |
| Custom Atelier | **Blocked** | Capability unverified (OQ-12) |
| Passport / consumer cart | **Blocked** | No consumer business (OQ-01) |
| Mobile system | **High** | Design is ready; markup is not |

---

## 6. Sequencing that follows from the evidence

`RECOMMENDATION` — three phases, ordered by certainty of return. **Not approved.**

**Phase 1 — the business that exists.** Buyer auth and tax-ID gate · permission boundary ·
prepacks, minimum, MSRP · filters and sort · size and fit · the daily drop · all states ·
the three CI tests. *No WebGL. No video. Nothing blocked on an owner decision.*

**Phase 2 — the brand.** Editorial surfaces, campaign, shoppable lookbook, material macro
photography, poster-first media slots, the supply-chain story told in semantic text.

**Phase 3 — the cinema.** Buckle and passage as rendered video behind explicit Cinema
mode; Product Anatomy in 3D only if assets exist and the drag alternative ships with it.

`INFERRED` — Phase 1 contains no blocked items and serves the only paying audience. Phase 3
contains almost every open owner decision. **The project can start without resolving them.**

---

## 7. Effort concentration

`INFERRED` — The largest costs are **not** engineering:

1. **Asset production** — every model, texture, shader, film and photograph. Zero exist.
2. **Commerce mechanics** — absent from all 48 files.
3. **Accessibility** — nothing in the stack provides reduced motion; focus is unimplemented
   and its specified colour fails contrast.
4. **Owner decisions** — six open conflicts.
5. **Actual front-end build** — the smallest of the five.

**The critical path is production and decisions, not code.**
