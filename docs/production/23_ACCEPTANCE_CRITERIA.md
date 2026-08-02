# 23 — Acceptance Criteria

Objective, testable, and binary. **Every criterion is either automated in CI or has a named
manual verification.** A criterion that cannot be checked is not a criterion.

---

## A. Security and authorisation — blocking

| # | Criterion | Verified by |
| :--- | :--- | :--- |
| A1 | No public route exposes a wholesale price, pack price, MOQ, MSRP or buyer term in HTML, headers, inline JSON, client bundles, titles, meta, JSON-LD, sitemap or alt text | **Test 2** |
| A2 | **No generated URL contains a numeric price pattern** — `/\/\d{1,3}-\d{2}-[a-z]/` | **Test 2, assertion B** |
| A3 | Restricted data is server-rendered inside the authorised session; never client-fetched into a public shell | Code review + Test 2 |
| A4 | Every authorisation state — anonymous, pending, approved, expired, suspended, owner — sees exactly its permitted fields | Route/authorization suite |
| A5 | Authorisation **fails closed** on any lookup or session error | Route/authorization suite |
| A6 | An authorised response is never served from a shared cache to another buyer or to anonymous | Cache-isolation suite |
| A7 | No third-party tag, payment widget or session-replay tool receives price, pack total or buyer identity | Manual audit + `19` allowlist |
| A8 | No restricted field appears in any log, error payload or analytics event | Log audit |

---

## B. Content integrity — blocking

| # | Criterion | Verified by |
| :--- | :--- | :--- |
| B1 | **No fabricated founding date anywhere** — "EST. 1865" and "Origin: 1870s American West" absent from copy **and from imagery** | Manual + asset review |
| B2 | No invented sourcing attribution — Kuroki Mill, Leon & Tuscany, shuttle looms | Content review |
| B3 | No invented people, testimonials, reviews or ambassadors | Content review |
| B4 | No unevidenced manufacturing-location claim (OQ-04) | Content review |
| B5 | No menswear or footwear surface, route, filter or asset | Route + content review |
| B6 | Every factual sentence traces to a source ID in `09_RESEARCH_SOURCES.md`, or is labelled an inference | Claim review |
| B7 | No fixture price outside the verified **$7–$33** band without an explicit illustrative annotation | Product-data integrity suite |
| B8 | **No media with `provenance: 'generated-placeholder'` is referenced from a production route** | Product-data integrity suite |
| B9 | Copyright year is generated; no stale season labels (© 2024, FALL '24, AW24) | Automated |
| B10 | Operational metrics are stated exactly — 100% fill rate, 2.64-day processing, 4.76/5 of 262, 4.7/5 of 353. **Never rounded up** | Content review |

---

## C. Product truth in the DOM — blocking

| # | Criterion | Verified by |
| :--- | :--- | :--- |
| C1 | With JavaScript disabled, every public route contains every product name, description, materials, colour, size range and availability in HTML | **Test 1** |
| C2 | Product names and prices are **semantic text** — never canvas, never baked into an image | Test 1 + Test 3 |
| C3 | Pagination and category navigation are real `<a href>` and traversable without JavaScript | Test 1 |
| C4 | **Removing the atmosphere layer entirely leaves a complete, correct, shoppable store** | Manual: disable all motion modules and complete a purchase path |
| C5 | Authorised commerce is semantic and keyboard-operable — price, MSRP, MOQ, prepack, SKU, Add to Order | **Test 3** |

---

## D. Accessibility — blocking, WCAG 2.2 AA

| # | Criterion | Verified by |
| :--- | :--- | :--- |
| D1 | axe clean on every route in every mode | Automated |
| D2 | **Every commerce task completable by keyboard alone**, anonymous and authorised | Manual keyboard pass |
| D3 | Every commerce task completable with a screen reader | Manual SR pass |
| D4 | Visible focus on every interactive element at **≥3:1** — verified as a computed ratio, not assumed from a token | Automated + spot check |
| D5 | **2.2.2** — every auto-starting sequence looping over 5 seconds has a visible pause/stop/hide, **independent of `prefers-reduced-motion`** | Media-controls suite |
| D6 | **2.5.7** — every drag interaction has a single-pointer alternative | Media-controls suite |
| D7 | **2.4.11** — no focused element is entirely obscured by a pinned or sticky region | Keyboard suite |
| D8 | **2.5.8** — every target, including film hotspots, is ≥24×24 CSS px | Automated |
| D9 | **Size and fit is structured text with `<caption>` and `<th scope>`.** No image-only size chart anywhere | Automated |
| D10 | Meaningful alt text on every image, including lookbooks; decorative images explicitly `alt=""` | Broken-media suite |
| D11 | Under `prefers-reduced-motion`: **content parity** — same products, prices, actions, capabilities — and no uninitiated motion | Reduced-motion suite |
| D12 | **A JavaScript failure leaves content visible.** Hidden states are scoped under a JS-set attribute | Manual: block the JS bundle |
| D13 | Shoppable film hotspots are DOM `<button>` elements from a metadata cue track, with a parallel always-visible product list beneath | Manual |
| D14 | No clipped text at 320 / 768 / 1024 / 1440 px, or at 200% zoom | Truncation suite |
| D15 | Focus moves to `<h1>` on route commit; no keyboard traps; `Escape` restores focus to the trigger | Keyboard suite |

---

## E. Performance — blocking

| # | Criterion | Budget | Verified by |
| :--- | :--- | :--- | :--- |
| E1 | LCP p75 mobile | ≤ 2.0s | CI + RUM |
| E2 | **INP p75** | **≤ 150ms** | CI + RUM |
| E3 | CLS p75 | ≤ 0.05 | CI + RUM |
| E4 | Initial JS, compressed | ≤ 180 KB | CI |
| E5 | Page weight — shop surfaces | ≤ 1.5 MB | CI |
| E6 | Page weight — cinematic surfaces | ≤ 4 MB | CI |
| E7 | Frame sequences | ≤ 60 frames, WebP/AVIF, ≤ 80 KB/frame | CI |
| E8 | **Zero WebGL in Phases 1 and 2** | 0 bytes | Bundle assertion |
| E9 | Measured on a **physical mid-range Android** — a developer machine understates real cost by 5–7× | Manual, per release |
| E10 | Verified on a **real iPhone in Low Power Mode**, where autoplay is disabled and iOS forces a native play glyph that CSS cannot hide | Manual, per release |
| E11 | Exceeds the **76% CWV-good** Shopify floor | RUM |

---

## F. Functional — Phase 1

| # | Criterion |
| :--- | :--- |
| F1 | An approved buyer completes the full slice — home → drop → PDP → sign-in → authorised PDP → prepack → Add to Order → order surface → history — **by keyboard alone** |
| F2 | An anonymous visitor completes home → drop → PDP → application submitted, and **sees no restricted field at any point** |
| F3 | Faceted filtering works on colour, fabric, silhouette, embellishment, size range, availability and pre-order; filters serialise to a shareable URL with no price value |
| F4 | Zero-results states offer a recovery path, never a dead end |
| F5 | Minimum-order progress against the verified **$50** is accurate and announced at the threshold |
| F6 | Prepack composition renders as a table with a real size run; the verified **(6)** structure is representable |
| F7 | Pre-order is a first-class state with a ship window and terms |
| F8 | **Reorder same assortment** and **reorder with changes** both work |
| F9 | Line-sheet export is generated server-side inside the session and is never publicly cached |
| F10 | The pending-approval state reads as an invitation and states the verified under-one-business-day timing |
| F11 | Every product has a size range; availability per size range is stated honestly |
| F12 | The Drop is a dated permalink that remains addressable after the next drop |
| F13 | Owner surfaces: publish a drop, see completeness alerts, review the applications queue |

---

## G. Design fidelity

| # | Criterion |
| :--- | :--- |
| G1 | Typography, grid, spacing and editorial restraint hold at production across 320–1440px |
| G2 | Focus ring is **Tobacco Leather `#734F36`** — the specified Oxidized Silver on Bone White measures **2.18:1** against a 3:1 requirement and fails |
| G3 | Every colour pair in the shipped token set is measured, not assumed |
| G4 | No Material 3 default palette residue; **five of seven brand colours appear in no V3 frame and all seven appear in no V3.1 frame** — that is a tooling artefact, not direction |
| G5 | Icons are not stock Material Symbols |
| G6 | Fonts are self-hosted with confirmed licences |
| G7 | Safe-area insets respected at notch and home indicator |

---

## H. Source integrity — standing

| # | Criterion |
| :--- | :--- |
| H1 | `archive/` and `stitch-export/` remain unmodified — verified by `git status` and an mtime sweep |
| H2 | The 56-frame hashed inventory still reconciles |
| H3 | No unresolved owner decision is recorded as approved anywhere in the corpus |

---

## Release gate

> **A release ships only when every criterion in A, B, C, D and E passes**, plus every Phase-1
> criterion in F. **G and H are reviewed at every release and block on regression.**
>
> **A, B and C have no waiver path.** They are the three ways this project fails irrecoverably:
> leaking buyer pricing, publishing a false claim, and dissolving the catalogue into atmosphere.
