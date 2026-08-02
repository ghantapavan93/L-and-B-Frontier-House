# 16 — Performance Budget

**The category fails on INP, not image weight.** Budgets are contractual and enforced in CI.

---

## 1. Core budgets

| Metric | Budget | Basis |
| :--- | :--- | :--- |
| **LCP** p75 mobile | **≤ 2.0 s** | Good is 2.5 s; Burberry and SSENSE achieve 1.3–1.5 s |
| **INP** p75 | **≤ 150 ms** | Good is 200 ms. **This is the metric the category fails** — Gucci 400 ms, Zara 475 ms, Prada 575 ms |
| **CLS** p75 | **≤ 0.05** | Half the 0.10 threshold; four comparison sites achieve 0.00 |
| **CWV all-good rate** | **≥ 80%** | **Shopify sits at 76% — that is the commercial floor.** Landing below a stock Shopify theme is a measurable regression |

**Luxury is the most speed-sensitive vertical measured** — roughly **+40.1%
product-detail-to-add-to-basket per 0.1 s**. Every megabyte of atmosphere is paid out of the
add-to-basket rate.

---

## 2. Weight budgets

| Item | Budget |
| :--- | :--- |
| **Initial JS (compressed)** | **≤ 180 KB** |
| Route JS | ≤ 60 KB per route |
| Third-party JS | **≤ 100 KB total, all deferred** |
| Instant Shop total JS | **≤ 90 KB** |
| Page weight — shop surfaces | ≤ 1.5 MB |
| Page weight — cinematic surfaces | ≤ 4 MB |
| LCP resource (poster) | **≤ 120 KB** AVIF |
| Fonts | **≤ 120 KB, ≤ 2 families, ≤ 4 files**, `font-display: swap`, self-hosted, subset |
| Frame sequences | **≤ 60 frames, WebP/AVIF, ≤ 80 KB/frame** |
| Video (hero loop) | ≤ 1.5 MB for ≤ 8 s, **audio track stripped** |
| **Long Animation Frames** | **0 frames with `blockingDuration` > 100 ms** during scroll |
| Sustained frame rate, Tier 2 mobile | ≥ 50 fps during sequences |

---

## 3. WebGL — zero for Phases 1 and 2

| Cost | Value |
| :--- | :--- |
| three.js, tree-shaken to 7 symbols | **~132 KB gzip — a hard floor** |
| three.js + React Three Fiber | **~250 KB gzip** |

> **R3F alone exceeds the entire 180 KB initial-JS budget.** If a WebGL surface ever survives
> the video-first test, it lives in a **lazily-imported route chunk**, never the initial
> bundle — and **raw Three.js, not R3F**, unless a second surface with genuine React state
> coupling appears.

**Texture VRAM** — invisible in a network waterfall and the thing that actually kills mobile:

| Texture | VRAM | + mipmaps |
| :--- | :--- | :--- |
| 1024² RGBA8 | 4.0 MiB | 5.2 MiB |
| **2048² RGBA8** | **16.0 MiB** | **20.8 MiB** |
| 4096² RGBA8 | 64.0 MiB | 83.2 MiB |
| **8192² (the Media_02 brief)** | **256 MiB** | **~333 MiB** |

**Cap source textures at 2048².** Deliver via **KTX2/Basis** so they stay compressed in VRAM.
Ceilings: **256 MB Tier 3 · 128 MB Tier 2 · 64 MB Tier 1.** Prefer **Meshopt (28.6 KB
decoder)** over **Draco (188 KB)** unless aggregate geometry exceeds ~1 MB — the decoder is
often bigger than the thing it decodes.

---

## 4. Loading tiers

| Phase | Loads |
| :--- | :--- |
| **Immediate** | Server-rendered HTML · critical CSS · LCP poster · navigation · **product data** |
| **After first interaction** | Mode-selector logic · non-critical CSS · analytics |
| **During idle** | Prefetch likely next route (Speculation Rules where supported) |
| **On approach** | Campaign video · frame sequences · below-fold media |
| **On explicit Cinema selection** | GSAP choreography · any 3D chunk · shaders |
| **Never in Instant Shop** | All of the above |

**This is achievable because the design already has a mode selector and a Skip to Shop.** The
architecture for tiered loading is present in the approved direction; it simply has to be
honoured.

---

## 5. What must not be carried forward

`MEASURED` from the exports:

- **`cdn.tailwindcss.com` in 48/48 files** — a JIT compiler shipped to the browser, render-
  blocking, untree-shakeable. **Disqualifying for production.**
- **Google Fonts, 137 references** — render-blocking third-party on every route. **Self-host.**
- **three.js r125 from `ajax.googleapis.com`** — a five-year-old library, no SRI.
- **No `aspect-ratio` or reserved dimensions on any remote image** — every one is a CLS risk.

---

## 6. Runtime hygiene

`MEASURED` — every Three.js sketch in the corpus runs an **unconditional infinite
`requestAnimationFrame`** with **no visibility gate, no `dispose()`, no `webglcontextlost`
handling and no pause on tab-hidden.** On mobile that is a thermal and battery problem, not
just a frame-rate one.

**Required for any animated surface:** render only when visible · pause on tab-hidden ·
dispose on route change · handle context loss · **cap DPR by tier**.

---

## 7. Test conditions

- **A physical mid-range Android** (Galaxy A-class), not a developer machine. The penalty for
  heavy pages is ~3.6× on a flagship and **19×** on a budget phone — a laptop understates
  real cost by 5–7×.
- **A real iPhone in Low Power Mode**, where autoplay is disabled and a native play button
  cannot be hidden.
- **Throttled network.** Stockists are in small-town Texas — Mineral Wells, Weatherford.
- **Long Animation Frames `blockingDuration`** as the primary scroll metric, not Lighthouse.
- **CI budgets on every PR.** A budget that is not measured on every build is a wish.
