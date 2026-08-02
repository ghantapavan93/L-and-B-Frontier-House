# 12 — Performance Audit

Assessed against the contractual budgets in `CLAUDE.md` §10. **The category fails on INP,
not image weight.**

---

## 1. Budgets

| Metric | Budget | Assessment from sources |
| :--- | :--- | :--- |
| LCP p75 mobile | ≤ 2.0 s | **At risk** — hero surfaces carry shaders and no poster |
| **INP p75** | **≤ 150 ms** | **Highest risk** — scroll-driven camera, pinning, 13 easing curves |
| CLS p75 | ≤ 0.05 | **At risk** — no reserved aspect ratios anywhere |
| **Initial JS** | **≤ 180 KB** | **Would be exceeded by R3F alone (~250 KB gzip)** |
| Shop page weight | ≤ 1.5 MB | Unassessable from exports |
| Cinematic page weight | ≤ 4 MB | **At risk** — 8K texture brief |
| Frame sequences | ≤ 60 frames, ≤ 80 KB/frame | No sequence exists yet |

---

## 2. Findings from the sources

### 2.1 Known bundle floors

`MEASURED` (research corpus) — three.js tree-shaken to seven symbols: **~132 KB gzip**.
With React Three Fiber: **~250 KB gzip**, before any asset.

> `INFERRED` — **R3F alone exceeds the entire 180 KB initial-JS budget.** Any WebGL must
> live in a lazily-imported route chunk, never in the initial bundle. See
> [08](08_3D_SHADER_AND_RUNTIME_FEASIBILITY.md) §6.

### 2.2 The Tailwind CDN

`MEASURED` — `https://cdn.tailwindcss.com` appears in **48 of 48 files**.

`INFERRED` — The JIT CDN build ships a **compiler to the browser**, blocks render, and
cannot be tree-shaken. Appropriate for a design export; disqualifying for production. Must
not be carried forward.

### 2.3 Render-blocking third-party requests

`MEASURED` — 124 `fonts.googleapis.com/css2` references, 13 `fonts.gstatic.com`, 5
`ajax.googleapis.com` three.js. **Every export depends on two or three external origins.**

`INFERRED` — Four text families plus an icon font is a material font budget. Self-host,
subset, `font-display: swap`, and reduce to two families per
[06](06_DESIGN_TOKEN_RECONCILIATION.md).

### 2.4 Texture VRAM — the invisible cost

`OBSERVED` — `v3_1_engineering_handoff.md` Media_02: *"Denim Macro (**8K texture scan**,
shifting light)."*

`INFERRED` — An 8192² RGBA8 texture is **256 MiB uncompressed, ~333 MiB with mipmaps**.
That exceeds the entire realistic budget of a mid-tier mobile GPU **for a single map**, and
it is **invisible in a network waterfall** — a modest JPEG becomes hundreds of megabytes on
the GPU.

`RECOMMENDATION` — Cap source textures at **2048²** (20.8 MiB with mipmaps), deliver via
**KTX2/Basis** so they stay compressed in VRAM, and set explicit ceilings: **256 MB Tier 3
· 128 MB Tier 2 · 64 MB Tier 1**.

### 2.5 Runtime hygiene absent in every 3D sketch

`MEASURED` — across all six Three.js/shader files: **no visibility gating, no `dispose()`,
no `webglcontextlost` handling, no pause on tab-hidden, no route cleanup.** Every scene runs
an unconditional infinite `requestAnimationFrame`.

`INFERRED` — On mobile this is a **thermal and battery** problem, not just a frame-rate one.

### 2.6 Motion density

`MEASURED` — **66 duration values exceed 400 ms**; 13 distinct easing curves; V3.1's
T1_Stitch is **2400 ms** on page load.

`INFERRED` — Long, overlapping, scroll-driven animation on the main thread is precisely
what inflates INP. This is the mechanism by which comparable luxury sites fail — the
failure is JavaScript responsiveness, not photography weight.

### 2.7 Layout stability

`MEASURED` — No `aspect-ratio`, no reserved dimensions, no `width`/`height` on remote
images anywhere in the corpus. `INFERRED` — Every remote image is a CLS risk.

---

## 3. Load strategy

`RECOMMENDATION` — per `CLAUDE.md` §10:

| Phase | Loads |
| :--- | :--- |
| **Immediately** | Server-rendered HTML, critical CSS, LCP poster, nav, product data |
| **After first interaction** | Mode selector logic, non-critical CSS |
| **During idle** | Prefetch likely next route |
| **On approach** | Campaign video, frame sequences |
| **Only on explicit Cinema selection** | Three.js chunk, shaders, 3D assets |
| **Never on Instant Shop** | All of the above |

`INFERRED` — This is achievable because the design already has a **mode selector** and a
**Skip Intro**. The architecture for tiered loading is present in the approved direction;
it simply has to be honoured.

---

## 4. Commercial framing

`INFERRED` — Two numbers from the research corpus set the stakes:

- **The commercial floor is Shopify at 76% CWV-good.** A bespoke build landing below a
  stock Shopify theme is a measurable regression.
- **Luxury is the most speed-sensitive vertical measured** — roughly **+40.1%
  product-detail-to-add-to-basket per 0.1 s** of improvement.

`INFERRED` — Every megabyte of atmosphere is paid out of the add-to-basket rate, and in
this vertical the exchange rate is unusually punishing. **Beauty is not a performance
permission.**

---

## 5. Test conditions

`RECOMMENDATION` —

- A physical **mid-range Android** (Galaxy A-class), not a developer machine. The penalty
  for heavy pages is ~3.6× on a flagship and **19×** on a budget phone.
- A real **iPhone in Low Power Mode**, where autoplay is disabled and iOS forces a native
  play button that **cannot be hidden by CSS**.
- **Throttled network.** Stockists are in small-town Texas.
- **Long Animation Frames** (`blockingDuration`) as the primary scroll metric, not
  Lighthouse.
- Budgets enforced in CI. A budget that is not measured on every build is a wish.
