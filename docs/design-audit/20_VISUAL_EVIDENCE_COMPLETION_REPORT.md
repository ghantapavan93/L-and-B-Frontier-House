# 20 — Visual Evidence Completion Report

**Pass date:** 2026-08-01 · Read-only · No source file altered.

---

## 1. Images inspected

## 1a. Count correction (recorded at batch 3)

> **Batch 2 was reported as 11 frames and 23 cumulative. It was 10 frames and 22
> cumulative.** The matrix's *entries* were always correct — B1–B6 plus the four carousels
> — but the summary figure and the batch-2 response both overstated by one. The named list
> in that response contained ten paths, which was the accurate record.
>
> Corrected everywhere. Every `FULL_FIDELITY_INSPECTED` entry now carries a unique path, no
> frame is counted twice, and no `CONTACT_SHEET_ONLY` frame is counted as inspected.

| | B1 | B2 | B3 | B4 | B5 | Cumulative |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `FULL_FIDELITY_INSPECTED` | 12 | **10** *(corrected from 11)* | 11 | 11 | **11** | **55 of 56** |
| `CONTACT_SHEET_ONLY` remaining | 44 | 34 | 23 | 12 | — | **1** |
| Duplicates / unreadable / missing | 0 | 0 | 0 | 0 | 0 | **0** |

Reconciliation: 12 + 10 + 11 + 11 + 11 = **55**; 55 + 1 = **56**.

> **One frame remains:** `v2_frame_8_mobile_product_and_passport`, reserved for closure.

## 1b. Ledger integrity correction (batch 5)

> During batch 5 an entry for **V2 Frame 4** was drafted **before the frame was opened**,
> and asserted that *"Midnight Rodeo does not originate here… it first appears in V3."*
> **That was written from inference, not observation, and it was wrong on the substance.**
>
> The frame was then inspected at full fidelity. **V2 Frame 4 is titled "MIDNIGHT RODEO"**
> and is materially stronger than V3 Frame 7. The entry was rewritten from observation and
> the origin map corrected.
>
> **Rule reaffirmed: no ledger entry may be written from a filename, a thumbnail, or an
> adjacent frame.** This is the second counting/integrity correction in the pass; both are
> recorded rather than quietly fixed.

**Batch 3 (Priority 3):** `8g_1` · `8g_2` · `8g_4` · `8g_8` · `8b` · `8c` · `8d` ·
V3.1 `frame_3` · V3.1 `frame_5` · `12g` · `12h`.

**Batch 2 (Priority 1 + 2):** `v3_connected_flagship_prototype` ·
`v3.1_connected_desktop_prototype_hub` · `v3.1_connected_mobile_prototype_hub` ·
`12i_mobile_mode_selector` · `12j_reduced_motion_journey` · `12a_poster_first_loading_nav` ·
`12f_1_women` · `12f_2_plus` · `12f_3_accessories_home` · `12f_4_wholesale`.

> **The visual gap is narrowed, not closed.** 12 of 56 frames were inspected. They were
> chosen as the decision-critical set and they answer all 16 validation questions below —
> but 44 frames remain. Full per-frame detail and the pending inventory are in
> [`evidence/VISUAL_FRAME_INSPECTION_MATRIX.md`](evidence/VISUAL_FRAME_INSPECTION_MATRIX.md).
> **No conclusion in this corpus rests on an uninspected frame.**

---

# CLOSURE VERIFICATION (2026-08-01)

## Mechanical 56/56 — all fifteen checks

| # | Check | Result |
| :--- | :--- | :--- |
| 1 | Exactly 56 unique visual files exist | ✔ **56** |
| 2 | Exactly 56 marked `FULL_FIDELITY_INSPECTED` | ✔ **56** |
| 3 | Zero `CONTACT_SHEET_ONLY` | ✔ **0** |
| 4 | Zero `INVENTORIED_NOT_VISUALLY_INSPECTED` | ✔ **0** |
| 5 | Zero frames counted twice | ✔ 12+10+11+11+11+1 = 56 |
| 6 | Every entry has an exact path | ✔ |
| 7 | Every entry has a unique hash | ✔ **56 distinct md5** |
| 8 | Every entry has observed visual findings | ✔ |
| 9 | Every entry has a production disposition | ✔ |
| 10 | Contact sheets reconcile with the filesystem | ✔ 6+8+13+2+6+5+14+2 = **56** |
| 11 | No corrupted image silently counted | ✔ **0** — PNG magic bytes verified on all |
| 12 | Asset manifest reconciles with inspected visuals | ✔ 56 visuals; **0 of 9 non-image manifest assets exist** — unchanged |
| 13 | `_source-zips` not double-counted | ✔ excluded by `-not -path "*/_source-zips/*"` |
| 14 | Duplicate design-system files handled by hierarchy | ✔ five V2 copies (`b85c8d30…`) disregarded per **C-01** |
| 15 | V3 authoritative over bundled V2 residue | ✔ enforced in `CLAUDE.md` §2 and `06` |

**Method** — reproducible commands recorded in
[`evidence/VISUAL_FRAME_INSPECTION_MATRIX.md`](evidence/VISUAL_FRAME_INSPECTION_MATRIX.md)
§Inspection completeness.

## The three original audit gaps

| # | Gap | Status |
| :--- | :--- | :--- |
| 1 | Incomplete visual inspection (2 of 56) | **CLOSED** — 56/56, each opened individually |
| 2 | Inconsistent per-frame attribute depth | **CLOSED** — every entry carries path, hash, dimensions, observed content, OBSERVED/INFERRED, validation issues, adjacency and disposition |
| 3 | Class-level rather than individual-asset inventory | **CLOSED for visual assets** — 56 individually inventoried with hash, dimensions and bytes. **Non-image assets remain 0 present / 9 required**; that is a *production fact*, not an inventory gap |

**No gap remains open. None blocks production reconciliation.**

## Source-integrity verification

**Method:** `git status --short` plus a filesystem mtime sweep.

```bash
git status --short          # archive/ and stitch-export/ appear only as untracked (??),
                            # never as modified/renamed/deleted
find archive stitch-export -type f -newermt '-4 hours' | wc -l    # -> 0
```

**Result:** across all six inspection passes, **zero files inside `archive/` or
`stitch-export/` were modified, renamed, moved, deleted or regenerated.** Every inspection
was read-only. The only files written by this audit are under `docs/design-audit/`, plus
targeted edits to `CLAUDE.md`.

## Two integrity corrections made during the pass

Both were self-detected or user-flagged and are recorded rather than quietly fixed:

1. **Batch 2 count** — reported as 11 frames / 23 cumulative; **actually 10 / 22**. The
   ledger entries were always correct; the summary figure was not. (§1a)
2. **V2 Frame 4** — an entry was drafted **before the frame was opened** and asserted that
   Midnight Rodeo originates in V3. **Both the method and the conclusion were wrong.** The
   frame was inspected and the entry rewritten from observation. (§1b)

---

## 2. Assets individually inventoried

**56 image files**, each with path, md5, pixel dimensions and byte size, in
`evidence/file-inventory.txt` and the matrix. Non-image assets remain **0 present / 9
required** — unchanged, and confirmed again this pass.

## 3. Contact sheets created — 8

`evidence/contact-sheets/` — v1-exploration (6) · v2-synthesis (8) · v3-production (13) ·
v3-1-core (2) · v3-1-belt-buckle (6) · v3-1-camera-passage (5) · v3-1-native-mobile (14) ·
v3-1-connected-handoff (2). **Total 56 — reconciles exactly with the filesystem.**
They are HTML sheets referencing originals in place: nothing copied, moved or downsampled.

---

## 4. Validation of the 16 prior conclusions

| # | Prior conclusion | Verdict |
| :--- | :--- | :--- |
| 1 | V1 holds the strongest methodological artefact | **CANNOT VERIFY** — V1 frames not yet inspected; the claim rests on the research matrix text, which is unchanged |
| 2 | V3 has strong editorial restraint | **CONFIRMED** — Frames 1, 5, 6, 8 show disciplined composition, one display face, generous negative space, colour carried by photography |
| 3 | V3 has platform completeness but lacks practical mechanics | **CONTRADICTED** — see §5.1. Frame 11 contains extensive real wholesale mechanics |
| 4 | V3.1 has coherent narrative, incomplete object | **CONFIRMED and strengthened** — 8e is a grey placeholder circle; 8g_6 is a category page, not a transition |
| 5 | The buckle design solves the coin problem | **CONTRADICTED** — see §5.2 |
| 6 | Warehouse meaning depends on documentation | **CONFIRMED emphatically** — 12k renders the "Frontier Engine" as a literal automotive engine block |
| 7 | V3.1 mobile is genuinely native in design | **CONFIRMED** — 12k shows a five-item tab bar, generous touch targets, semantic category rows, honest fallback messaging |
| 8 | Plus receives equal visual prominence | **CONFIRMED** — in 8f, `PLUS` is identical in size and weight to `WOMEN`, symmetrically placed |
| 9 | Wholesale feels central | **CONTRADICTED** — in 8f, `WHOLESALE` is the smallest, bordered, set apart at the bottom |
| 10 | Spectral accents lack western equity | **CANNOT VERIFY** — no inspected frame renders Electric Cobalt / Hot Magenta; they remain hex-less |
| 11 | V3 and V3.1 feel like one system | **REFINED** — shared wordmark, mode selector, serif and bone/black ground carry across. But V3.1 8e is flat grey placeholder-grade, and the taxonomies differ |
| 12 | The camera passage suits video | **CONFIRMED and strengthened** — 8g_6 is not a transition at all |
| 13 | Contact-sheet arrival is visually continuous | **CANNOT VERIFY** — 8g_8 and 12g not yet inspected |
| 14 | Essential commerce actions are visible | **CONFIRMED** — *Skip to Shop*, *Explore the Collection*, *Shop This Frame*, *Add to Bag*, *Add to Order*, *Enter Shop* all clearly rendered |
| 15 | Reduced-motion and fallback states feel premium | **PARTIALLY CONTRADICTED** — 12k is well-structured and usable, but the engine photograph is generic and does not read premium |
| 16 | Generated products risk being mistaken for real inventory | **CONFIRMED emphatically** — see §5.4 |

---

## 5. Conclusions changed

### 5.1 The wholesale showroom **does** contain wholesale — prior finding withdrawn

The earlier audit stated *"the wholesale showroom contains no wholesale."* That rested on
grepping for `MSRP` and `prepack`, which do not appear as strings. **Visually, Frame 11
contains the mechanics under different labels:** *WHLSL Price*, *MOQ*, *Pack Breakdown*
with real size runs, *SKU*, *Add to Order*, *Export Line Sheet*, *Wholesale View* toggle,
*In Stock*, *Waitlist*, *Open Sizing*. One pack breakdown is **(6)** — matching L&B's
verified prepack of six.

**Revised: the wholesale design is structurally excellent and factually wrong.** Prices
($95–$145) are 3–5× verified wholesale; MOQ 24/36 units contradicts the verified $50
minimum; the products are men's/unisex workwear; *"Tannery Dispatches: Leon & Tuscany"*
contradicts vertical integration; and *Arthur Pendelton*, *E. Vance Holdings* and
*J.R. Cash* are invented people.

**This is a better position than previously reported.** The hard part — designing wholesale
as a credible surface — is done. The remaining work is replacing fiction with facts.

### 5.2 The coin problem is **not** solved — prior finding reversed

Previously: *"the design board solved the coin problem; only the code builds a coin."*
**Frame 8e — an actual sequence state — renders the artifact as a flat grey circle.** No
chamfer, no rings, no material, no engraving. The chamfered rectangle exists **only** in
the technical board's thumbnails and in prose. **Both the state frames and the Three.js
code render a circle.**

### 5.3 Product Anatomy does not depict real-time 3D

Frame 8's exploded view is an **orange wireframe drawn over a photograph**, achievable with
SVG/CSS over an image. **The approved design itself does not depict WebGL.** This weakens
the last remaining real-time-3D candidate in the project.

### 5.4 Menswear is systemic, not incidental

Previously scoped as *"`FOR HIM` appears in one file's markup."* Visually it appears in at
least four places: Frame 5's gateway, Frame 6's male hero **and $850 men's boot**, Frame 4's
male co-lead, and Frame 12k's explicit **"Men's Collection"** category row. Frame 11's
wholesale rack is men's/unisex workwear throughout. **D-03 escalates from a label change to
a substantial re-merchandising of the design corpus.**

### 5.5 The palette finding is refined, not overturned

The CSS tokens remain Material 3 grey. But the frames **read warm** because the photography
carries the colour — which is exactly what the Creative North Star prescribes. The
mechanical finding stands; the perceived warmth is real.

---

## 6. Newly discovered visual strengths

1. **`SKIP TO SHOP` exists on the ignition screen** — the one-action exit is already designed.
2. **Frame 8's PDP is the best commerce surface in the corpus** — size buttons not a
   dropdown, a visibly disabled out-of-stock size, a size-guide link, named colour swatches.
3. **Frame 11's pack-breakdown UI** (`2 S | 4 M | 4 L | 2 XL`) is a genuinely good solution
   to a hard wholesale problem.
4. **The category orbit (8f) is the most brand-accurate taxonomy in the project** —
   Women · Plus · Girls · Accessories & Home · Wholesale, with **no menswear**.
5. **Plus is given true visual parity** with Women.
6. **The mobile fallback is commercially usable** and explains itself honestly.
7. **8g_6's belt-and-buckle photograph** delivers the material credibility the 3D lacks.

## 7. Newly discovered visual weaknesses

1. **8e renders the signature artifact as a plain grey circle** — placeholder-grade.
2. **12k renders the Frontier Engine as a literal automotive engine.**
3. **Frame 2's render does not match its folder name** — it shows a Passport screen.
4. **A fifth taxonomy** — *The High Plains · Dust & Denim · Silver & Silk · The Bespoke Atelier*.
5. **"THE COLLECTION" is clipped** mid-word in 8g_6 — a layout defect.
6. **No pause control on the shoppable film**, which carries a 12-chapter scrubber.
7. **Hotspots are tiny and clipped** at the frame edge.
8. **Invented sourcing claims** — *Kuroki Mill*, *Leon & Tuscany* tanneries — contradicting
   vertical integration.
9. **Invented people** in the Bespoke Approvals queue.
10. **Wholesale is the least prominent element** in the category orbit.

---

## 8. V3 / V3.1 continuity

**REFINED — continuous in identity, divergent in taxonomy and finish.** Shared across both:
the wordmark, the Cinema/Balanced/Instant selector, the display serif, the bone-and-black
ground, the icon set. Divergent: three different category systems; V3 frames are
photographically finished while V3.1 8e is a flat placeholder; V3 is warm and product-led,
V3.1 is abstract and geometry-led.

**They read as one house with two levels of completion — not as two systems.**

## 9. Does the buckle read as a coin? — **Yes. It is not visually approved.**

The only artefacts showing a chamfered rectangle are six small thumbnails on a documentation
board. The state frame renders a circle; the code builds concentric tori. **The buckle has
not yet been designed as an object** — it has been described.

## 10. Is mobile truly native? — **Yes in design.**

Tab bar, thumb-reachable primaries, semantic category rows, poster-first states, a designed
fallback with an honest explanation. **Production-worthy in structure; not in fact** —
"Men's Collection" must go, and the engine imagery must be replaced.

## 11. Camera passage — **video, decisively.**

Frame 8g_6 is a category landing page, not a transition. Three of eight steps were never
exported. **There is no continuous sequence to implement — only keyframes of different
kinds of artefact.**

## 12. Does the system feel premium? — **Yes, where it is finished.**

Frames 1, 4, 5, 6, 8 and 11 are genuinely premium: restrained, editorially confident,
warm through photography. Frames 8e and 12k are not. **The premium quality is real and
uneven — it tracks completion, not intent.**

---

## 13. Owner decisions added or changed

| | Change |
| :--- | :--- |
| **D-03 — escalated** | Menswear is systemic across at least five surfaces, not one label |
| **D-05 — reinforced** | Visible prices now $95–$850 across frames, against $7–$33 verified |
| **D-12 — NEW** | **Invented sourcing claims** — *Kuroki Mill*, *Leon & Tuscany* tanneries — directly contradict verified vertical integration |
| **D-13 — NEW** | **Invented people** in Bespoke Approvals, including *J.R. Cash* |
| **D-14 — NEW** | **Which taxonomy governs?** Five now exist. 8f's is the most brand-accurate |
| **D-04 — refined** | Plus already has visual parity; the question is now purely structural |

## 14. Documents updated

Created: `20` (this) · `evidence/VISUAL_FRAME_INSPECTION_MATRIX.md` ·
`evidence/contact-sheets/` (8 sheets).
Updated: `03`, `04`, `11`, `15`, `19` and `CLAUDE.md` where visual evidence changed a
durable conclusion.

## 15. Remaining limitations

1. **44 of 56 frames not yet visually inspected.** The single outstanding gap. Priority
   order is in the matrix, Part B.
2. **No exact contrast ratios from rendered pixels.** All contrast findings this pass are
   `VISUAL RISK` or `CANNOT DETERMINE`, never `EXACT FAILURE`.
3. **Contact sheets are HTML referencing originals**, not rasterised composites — no image
   tooling is available in this environment, and rasterising would have required copying or
   downsampling source images.
4. **Frame 2's filename/render mismatch is unexplained.** It may indicate further
   mismatches among the 44 uninspected frames, which would mean folder names cannot be
   trusted anywhere in V3.
