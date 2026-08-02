# 16 — Traceability Matrix

For any feature, this answers: **Why does it exist? Which source approved it? Is it
factual, strategic, visual or experimental? What is required to prove it works?**

Evidence class: **F** factual (verified brand truth) · **S** strategic (constitution) ·
**V** visual (V3/V3.1) · **X** experimental.

---

## 1. Core matrix

| Feature | Research basis | Origin | V3 | V3.1 | Class | Business need | A11y requirement | Perf requirement | Gap | Disposition | Owner? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Living Contact Sheet** | Verified **daily drop cadence** (`/jul-27/`…`/aug-01/`) | V1 storyboard | F2 | `8g_8`, `12g` | **F+V** | Retention; buyers scan newness | Keyboard grid; products in DOM | 800 ms eruption exceeds 400 ms | Products must survive JS failure | **BUILD FIRST** | No |
| **Experience modes** | `CLAUDE.md` §7 | **V1** (Studio Karo principle) | Nav in F1/F6 | `12i` | **S+V** | Serves buyer vs browser intent | Not a substitute for reduced motion | Instant Shop ≤ 90 KB JS | Persistence undefined | **BUILD** | No |
| **Wholesale showroom** | Verified: only paying audience | V1 (Talia principle) | **F11** | — | **F+V** | Revenue | Forms, focus, labels | Density over cinema | **All mechanics absent** | **BUILD — redesign mechanics** | No |
| **Vertical-integration narrative** | Verified supply chain | V3.1 | — | Buckle engravings | **F+V** | Strongest untold story | Semantic text, not geometry alone | — | Meaning only in docs | **BUILD — make semantic** | No |
| **Buckle Aperture** | — | V3.1 | — | Module 02 | **V+X** | Signature differentiation | 7.1 s → pause control | Video-first; WebGL unproven | Code broken; geometry conflict | **VIDEO FIRST** | No |
| **Camera Passage** | — | V3.1 | — | Module 03 | **V+X** | Narrative continuity | No wheel interception | Pre-render | 3 of 8 steps never exported | **VIDEO** | No |
| **Four Worlds** | — | **V1 storyboard** | **F5** | Carousels (differ) | **V** | Segmentation | Overlay focus trap risk | — | **`FOR HIM` false; 3 taxonomies** | **BLOCKED** | **D-03, D-04** |
| **Plus as a world** | Research: largest unclaimed position | Live site pattern | — | `12f_2` | **V** | Inclusive merchandising | Equal editorial parity | — | Contradicts one-record rule | **BLOCKED** | **D-04** |
| **Accessories & Home** | Claimed in About Us + DMC listing; **absent from live taxonomy** | V3.1 | — | `12f_3` | **V** | Category breadth | — | — | **Partially verified** | **BLOCKED** | **D-02** |
| **Frontier Passport** | No consumer business exists | V2 | F10 | — | **V** | Retention | Account a11y | — | Consumer audience absent | **REINTERPRET FOR BUYER** | **D-01** |
| **Custom Atelier** | No evidence bespoke is offered | V1 storyboard | F9, F5 | — | **V+X** | Differentiation | 0 forms today | — | Capability unverified | **ENQUIRY FLOW ONLY** | **D-08** |
| **Shoppable Film** | Research: parallel list required | V1 (Hotel Jägerhof) | F4 | — | **V** | Editorial→commerce | `<track>` + DOM buttons + parallel list | Poster-first | **No video exists** | **BLOCKED** | **D-11** |
| **Image Becomes Film** | — | V1 | F3 | — | **V** | Continuity | Poster carries message alone | LCP | **No video exists** | **BLOCKED** | **D-11** |
| **Product Anatomy** | Verified vertical integration | V1 (Aigle principle) | F8 | — | **V+X** | Proves craft | **2.5.7 drag alternative** | Lazy chunk only | GLB missing | **ONLY REAL WEBGL CANDIDATE** | **D-08** |
| **Midnight Rodeo campaign** | Verified: *"rodeo season, NFR"* | V2 | F7 | — | **F+V** | Evidenced merchandising | 2.4.11 pinning | Highest INP risk | Real scene JS exists | **BUILD** | No |
| **Faceted filtering** | Research: largest commerce gap | — | — | — | **F+S** | Buyers scan 235+ styles | Keyboard filters | — | **Not designed anywhere** | **BUILD — new** | No |
| **Size & fit data** | Verified: size chart is a text-free JPEG | — | — | — | **F+S** | Inclusivity claim | **WCAG 1.1.1** | — | **Not designed anywhere** | **BUILD — new** | No |
| **Prepacks / minimum / MSRP** | Verified wholesale mechanics | — | — | — | **F** | Buyers cannot transact without | Semantic text | — | **0 files** | **BUILD — new** | No |
| **Menswear (`FOR HIM`)** | **Verified: does not exist** | V1 | F5 | — | **V** | — | — | — | False capability | **REMOVE / REPLACE** | **D-03** |

---

## 2. Reverse lookup — "why does this exist?"

| If you find… | It exists because… | Approved by | Beware |
| :--- | :--- | :--- | :--- |
| A mode selector | V1 borrowed the principle from a reference; the constitution formalised it | S + V1 + V3 | Must not substitute for reduced motion |
| A belt buckle | V3.1 replaced V1's Pearl Snap to carry supply-chain engraving | V3.1 | Code builds a coin; board builds a buckle |
| Concentric rings | The Three.js sketch only | **Nothing** | Contradicts board and spec |
| `FOR HIM` | V1's storyboard, unexamined for three generations | **Nothing** | Menswear does not exist |
| A $1,250 price | Generated fixture | **Nothing** | 15–40× real wholesale |
| "Craft Your Legacy" | Generated luxury copy | **Nothing** | Brand says "Howdy" |
| Playfair Display | V2 chose it; `design.md` still calls it a *"Substitute"* | V2 → V3 | No western equity |
| A Material 3 grey palette | Stitch's default theme, present since V1 | **Nothing** | Not the brand palette |
| Electric Cobalt / Hot Magenta | V3.1 accent list | V3.1 | No hex; no western equity |

---

## 3. Evidence required before each claim ships

| Claim | Proof required |
| :--- | :--- |
| "Products are always reachable" | No-JS crawl asserts name + public price in HTML |
| "Wholesale pricing is protected" | Unauthenticated crawl finds zero restricted prices |
| "No price in a URL" | Slug purity assertion in CI |
| "Accessible commerce" | Full keyboard + screen-reader pass on every commerce task |
| "Reduced motion honoured" | Manual verification per surface; nothing in the stack provides it |
| "Pause control exists" | Visible from frame one, keyboard-reachable, on every >5 s sequence |
| "Drag has an alternative" | Prev/next controls ≥ 24×24 px on all four carousels + anatomy |
| "Performance budget met" | CI budgets + real mid-range Android + iPhone in Low Power Mode |
| "Imagery is honest" | Every generated asset labelled or replaced before launch |
| "Made in Texas" | **Do not claim** — unverified (OQ-04) |
