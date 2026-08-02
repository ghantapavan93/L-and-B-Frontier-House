# 10 — Mobile, Responsive and Fallback Audit

---

## 1. Is the mobile system genuinely native?

> `INFERRED` — **Yes in conception, not yet in implementation.**

V3.1 Module 04 is **14 frames** against V3's single mobile frame. Four pieces of evidence
that it is native thinking rather than a squashed desktop:

1. **Poster-first loading is a designed state** (`12a`), not a placeholder.
2. **The ring opening is "compressed"** (`12d`) — re-choreographed for a vertical viewport
   rather than scaled down.
3. **Depth is re-expressed, not re-scaled** — a **vertical depth stack** (`12e`) plus
   **horizontal carousels** (`12f_1–4`), instead of a camera flight through Z.
4. **Failure is designed** — a mode selector (`12i`), a reduced-motion journey (`12j`) and
   fallback states (`12k`) each get a dedicated frame. Very few projects design the failure
   path at all.

`INFERRED` — This is the strongest module in the corpus, and the only place the project
treats degraded conditions as first-class design rather than as an engineering afterthought.

---

## 2. Where the mobile implementation falls short

`MEASURED` — across all 48 HTML files:

| Signal | Count | Consequence |
| :--- | :--- | :--- |
| `sm:` breakpoint utilities | **0** | Single-breakpoint responsive strategy |
| `xl:` breakpoint utilities | **0** | No large-desktop treatment |
| `env(` / `safe-area-inset` | **0** | **No notch or home-indicator handling** |
| `playsinline` | **0** | iOS would force fullscreen video |
| `poster=` | **0** | No poster despite "poster-first" being a module name |
| `prefers-reduced-motion` | **2** | Despite a dedicated reduced-motion frame |
| `:focus` | **0** | No visible focus anywhere |
| `<form>` | **0** | No touch form controls |

`INFERRED` — **The mobile *design* is native; the mobile *markup* is not.** `12a` is named
"poster-first loading" and no file in the corpus contains a `poster` attribute. `12j` is a
reduced-motion journey and `prefers-reduced-motion` appears in 2 of 48 files. The
specification is ahead of the export, which is normal for a design tool — but it means none
of this markup is a starting point.

---

## 3. Touch and dragging

`MEASURED` — `v3_1_route_and_state_map.md`: *"Mobile: `Horizontal Swipe` on Depth
Carousel. `Tap` to enter collection."*

> `INFERRED` — **WCAG 2.5.7 Dragging Movements (AA)** requires that all
> dragging-based functionality have a **single-pointer alternative that does not involve
> dragging**. Four depth carousels are swipe-driven and **no prev/next control is specified
> or implemented**.
>
> The fix is cheap — visible previous/next buttons, ≥ 24 × 24 CSS px per **2.5.8** — but it
> must be designed into the carousel, not bolted on. Almost no carousel ships this.

`INFERRED` — Target sizing cannot be verified from the exports because no interactive
element carries measured dimensions. **2.5.8 compliance is unassessed and must be checked
at build.**

---

## 4. Fallback coverage

`OBSERVED` — `12k` "Mobile Fallback States" and `12j` "Reduced Motion Journey" exist as
designed screens. `INFERRED` — genuinely ahead of most projects.

**But the tier model has no Tier 0.** `v3_1_engineering_handoff.md` defines *Technical
Layer Ownership* as Tier 1 CSS/GSAP · Tier 2 Shader · Tier 3 Three.js · Tier 4 Video.

> `INFERRED` — That is a **layer stack**, not a capability ladder. Every tier assumes a
> working GPU or video decoder. `CLAUDE.md` §9 requires **"Tier 0 must not require a
> GPU."** The fallback *screens* exist; nothing binds them to a capability tier, and no
> source defines what renders when WebGL is unavailable.

`RECOMMENDATION` — Adopt an explicit four-tier ladder with a real floor:

| Tier | Condition | Delivered |
| :--- | :--- | :--- |
| **0** | No WebGL · JS failed · Instant Shop | **Static images, full commerce, no canvas** |
| 1 | Low-memory mobile | Minimal motion, smallest assets, capped DPR |
| 2 | Mid-tier device | Reduced textures, fewer frames |
| 3 | Capable desktop | Full quality |

---

## 5. Device and platform risks

| Risk | Assessment |
| :--- | :--- |
| **iOS Low Power Mode** | Autoplay disabled; iOS forces a native play button that **cannot be hidden by CSS**. Every poster must survive a centred play glyph. No poster exists |
| **iOS off-screen pause** | iOS pauses autoplaying video the moment it scrolls out of viewport — hostile to scroll-driven `<video>`; drive a canvas instead |
| **Safe areas** | 0 files handle notch or home indicator |
| **Mobile WebGL init** | V3.1's own QA flags this **[High]** on older devices, with mitigation "delay initialization" |
| **Thermal / battery** | Infinite `requestAnimationFrame` with no visibility gate in every Three.js sketch |
| **Rural connections** | Stockists are in small-town Texas. Every export is 100% CDN-dependent |

---

## 5a. Visual batch 2 findings (2026-08-01)

### Poster-first is exemplary — `12a`
`OBSERVED` — During loading the frame already offers the brand, a tagline, a **progress
bar**, **mode selection**, and **two escape actions** (*ENTER SHOP*, *Skip Intro*). **A user
can leave before the cinematic experience finishes loading.** This is textbook poster-first
and satisfies `CLAUDE.md` §9 and §11 directly.

### Reduced motion is the strongest fallback — `12j`
> **CORRECTION.** This document previously grouped reduced-motion with the WebGL fallback and
> judged fallbacks *"not premium."* **That conflated two different states.**
>
> `OBSERVED` — `12j` is a complete, editorial, stacked catalogue: hero collection, four
> category cards, a New Arrivals rail with real products and prices, a full footer including
> a **Wholesale** link, and a persistent tab bar. **It is commercially complete and premium.**
>
> **Revised: reduced motion is excellent. It is `12k`, the WebGL/low-power fallback, that
> looks generic** — the literal engine photograph and low-contrast *"Static Preview"* label.

### Carousel affordance is inconsistent — and 2.5.7 is partial, not absent
> **CORRECTION.** This document previously stated *"no prev/next control is specified."*
> `OBSERVED` — **`12f_4` Wholesale has explicit circular ← → buttons.**

| Carousel | Affordance |
| :--- | :--- |
| `12f_1` Women | **4 dots** (position indicator only — not an operable alternative) |
| `12f_2` Plus | **none** |
| `12f_3` Accessories & Home | **none** |
| `12f_4` Wholesale | **← → circular buttons** ✔ |

`INFERRED` — **WCAG 2.5.7 compliance is partial and appears incidental.** One of four
carousels has the single-pointer alternative. The fix is to systematise what `12f_4`
already does.

### The four carousels use four different design systems
`OBSERVED` — Ground, header, mode-pill presence, active tab, CTA styling and carousel
affordance all differ across the four. **They do not read as siblings.** Registered as
**C-22**.

### Wholesale is stronger on mobile than the desktop orbit suggested
`OBSERVED` — `12f_4` gives Wholesale the largest type on screen, a *TRADE AREA* eyebrow,
an **ENTER SHOWROOM** primary, an **Assortments** rail with a *FALL '24* card reading
**"Core Denim / Heavyweight selvedge & canvas staples / 24 SKUS"** — and **no prices**.

> `INFERRED` — **The authorisation boundary is honoured visually here.** The frame sells
> the assortment and gates pricing behind *Enter Showroom*. This is exactly the
> public/restricted split `13` recommends, and it is the only place in the corpus where it
> is designed.

### Safe areas remain unaddressed
`OBSERVED` — No visible safe-area inset in `12a`, `12k`, the mobile hub or any carousel;
tab bars and header controls sit at the extreme edge. Consistent with `env(` appearing in
**0 of 48** files.

---

## 6. Responsive verdict

| Question | Answer |
| :--- | :--- |
| Truly native? | **In design yes; in markup no** |
| Touch-safe? | **No** — swipe with no alternative; target sizes unverified |
| Readable? | Unassessed — text-over-media is pervasive; contrast unsampled |
| Performant? | **At risk** — V3.1's own QA flags mobile WebGL init |
| Accessible? | **No** — 0 focus states, 0 safe-area, swipe-only carousels |
| Commercially direct? | **Yes** — `12h` Commerce Arrival and `Skip Intro` both provide short paths to product |

`INFERRED` — The mobile module is the project's **best design work and its least
implemented**. Nothing needs redesigning; the gaps are all build-time obligations that the
design has already anticipated.
