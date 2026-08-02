# 08 — Technical Principles

**Research date:** 2026-08-01

Principles only. **The architecture is not finalised here** — the brief defers that until
after the Stitch V3 audit. Everything below is evidence gathered to make that decision
well.

---

## 1. The finding that should reshape the plan

> **`VERIFIED FACT` — In Chrome UX Report field data (June 2026, p75, retrieved
> 2026-08-01), the luxury and fashion sites that FAIL Core Web Vitals mostly fail on
> INP — JavaScript main-thread responsiveness — not on image weight.**

| Origin | LCP | INP | CLS | Verdict | Mobile share |
| :--- | :--- | :--- | :--- | :--- | :--- |
| burberry.com | 1.3s | **50ms** | 0.00 | **PASS** | 35.0% |
| ssense.com | 1.5s | **75ms** | 0.00 | **PASS** | 34.3% |
| hermes.com | 1.4s | 125ms | 0.05 | PASS | 73.7% |
| louisvuitton.com | 1.5s | 125ms | 0.00 | PASS | 77.0% |
| nike.com | 2.3s | 150ms | 0.05 | PASS | 74.0% |
| gucci.com | 2.0s | **400ms** | 0.00 | FAIL — INP | 82.8% |
| balenciaga.com | 2.8s | 175ms | 0.05 | FAIL — LCP | 70.8% |
| **apple.com** | **3.0s** | 100ms | 0.00 | **FAIL — LCP** | 67.9% |
| zara.com | 3.0s | **475ms** | 0.10 | FAIL | 71.6% |
| bang-olufsen.com | 4.3s | 250ms | 0.10 | FAIL | 62.0% |
| **prada.com** | **4.9s** | **575ms** | 0.10 | **FAIL — worst** | 83.6% |

Thresholds: LCP ≤2.5s · INP ≤200ms · CLS ≤0.10.

**Three consequences for this project:**

1. **Burberry and SSENSE are the exemplars, not Apple.** Both are editorially-driven
   fashion sites achieving LCP 1.3–1.5s and INP 50–75ms. **Editorial ambition and speed
   are not in conflict** — that is settled by evidence, not opinion.
2. **The risk is the animation runtime, not the photography.** Gucci (400ms), Zara
   (475ms) and Prada (575ms) fail on main-thread responsiveness. Scroll-driven animation
   libraries are precisely what inflates INP.
3. **`apple.com` fails Core Web Vitals.** The most-imitated scrollytelling site on the
   web does not pass the bar it is imitated for. Copying its technique inherits its
   problem.

`REASONABLE INFERENCE` — These are origin-level aggregates dominated by homepage and
product-listing traffic, not measurements of individual campaign pages. They evidence
**house technical discipline**, not any single immersive page. Treat accordingly.

---

## 2. What performance is worth, in money

`VERIFIED FACT` — Published, A/B-tested case studies (web.dev, retrieved 2026-08-01):

| Company | Change | Result |
| :--- | :--- | :--- |
| **Rakuten 24** | Load 2.0s → 1.6s mobile; CLS improved 92.72% | **+33.13% conversion · +53.37% revenue per visitor · +15.20% AOV · −35.12% exit rate** |
| Vodafone IT | LCP +31% | +8% sales |
| redBus | CLS 1.65 → 0 | +80–100% mobile conversion |
| Lazada | LCP 3× | +16.9% mobile conversion |
| Nykaa | LCP +40% | +28% organic traffic |

`OBSERVATION` — Against this, the evidence that immersive experiences increase fashion
conversion is **entirely vendor-published, uncontrolled, and without methodology**. A
widely-circulated "94% conversion lift from AR" figure attributed to Shopify **is not in
Shopify's article and could not be sourced. Do not cite it.**

> `RECOMMENDATION` — These two bodies of evidence are not of comparable quality. The
> performance case is multi-company, A/B tested and published by a disinterested party.
> The immersive case is testimonial and published by parties selling immersive services.
> **Budget cinematic ambition against the Rakuten number as its opportunity cost.**

`OBSERVATION` — Nike's SNKRS web experience — the highest-demand drop mechanic in
apparel — was deliberately built as an **anti-immersive** experience: stripping
distractions for a faster checkout. Its one flourish is a random lottery draw, a
*fairness* mechanic rather than a motion one.

---

## 3. Scroll-driven media: what it actually costs

`VERIFIED FACT` — Apple's 2019 AirPods Pro page was a canvas 2D sequence of **148
JPEGs**, measured at **55.8 MB across 1,609 requests, 30.45s load**. Median desktop page
weight in 2024 was **2,652 KB** (HTTP Archive). Apple's page was roughly **21× median**.

`VERIFIED FACT` — Modern budget guidance for the same effect: **60 frames, WebP at 80%
quality, 50–80 KB per frame ≈ 3–5 MB total**, versus 15–20 MB as PNG.

> `REASONABLE INFERENCE` — **The look is affordable; the 2019 implementation is not.**
> Frame-count and format discipline alone is roughly a 12× improvement.

`VERIFIED FACT` — Benchmarked approaches to scroll-scrubbed motion:

| Approach | Result |
| :--- | :--- |
| `video.currentTime` scrubbing | Severe frame drops; **poor on mobile even on capable devices** |
| Client-side unpack to canvas | ~9–18s preparation |
| **Pre-computed server-side frame sequence** | **2.5s cold, 1.3s cached** |

`RECOMMENDATION` — If a scrubbed sequence is used at all, it is a pre-computed WebP/AVIF
frame sequence, capped at roughly 60 frames, **never** `video.currentTime` scrubbing.

`VERIFIED FACT` — Techniques worth adopting, from builders who published their work:

- **`img.decode()` before display** — prevents main-thread decode stalls at scrub time.
- **Preload in `requestIdleCallback` batches** so the sequence never competes with first
  paint.
- **An AVIF/WebP capability ladder** via a `getFrameSrc(frame, supportTable)` indirection.
- **Pre-warm shaders and upload textures before a section is visible**, moving one-time
  cost off the user's first scroll.
- **Render only when visible**; unmount and dispose non-adjacent scenes.
- **Cap device pixel ratio**; compress textures (KTX2/Basis) and geometry (Draco).

---

## 4. Scroll-jacking: the usability evidence

`VERIFIED FACT` — Nielsen Norman Group, *"Scrolljacking 101"* (2023-08-06):

- *"The majority of our study participants were at least mildly disoriented by
  scrolljacking."*
- When lengthy, users **mistook it for a technical malfunction**.
- **Mobile experiences were dramatically worse.**
- Worst case is an altered scroll rate combined with text that must be read.

NN/g's conditions for defensible use — the closest thing to a validated spec:

1. Short — never spanning the whole page
2. **Below the fold only**
3. **No reading-critical text inside the jacked region**
4. **Desktop only**
5. Interleave normal-scrolling sections
6. Keep sticky navigation visible as an escape route
7. No directional changes during vertical scroll

> `OBSERVATION` — Condition 4 collides with this brand's reality. Luxury fashion mobile
> share runs 70–84%, and Lucky & Blessed's buyers are on phones in shops. **Scroll-jacking
> is close to indefensible for the majority of this audience.**

`VERIFIED FACT` — Awwwards juries — an audience explicitly rewarding creative ambition —
consistently score these sites lowest on usability. Gucci SS18: Creativity **8.47**,
Usability **6.90**. Active Theory v5: Animations **8.33**, **Accessibility 5.67 — its
lowest sub-score**.

`REASONABLE INFERENCE` — Performance and accessibility are **independent axes**. A site
can score 8.00 on performance and 5.67 on accessibility from the same jury. Optimising
one does not buy the other.

---

## 5. The smooth-scroll library trap

`VERIFIED FACT` — Verified by direct inspection of the shipped `lenis@1.3.25` package on
2026-08-01:

- 5,336 bytes gzipped, zero runtime dependencies, ~1.2M weekly downloads.
- **Grepping the entire distributed package for `prefers-reduced-motion`, `reducedMotion`
  and `matchMedia` returns zero matches.**
- The README uses the word "accessib*" exactly once, referring to anchor links, sticky
  positioning and keyboard semantics.
- A GitHub issue requesting `prefers-reduced-motion` support was opened 2026-07-31 and is
  unanswered.

`VERIFIED FACT` — The library's own manifesto states it was built to solve
**WebGL/DOM synchronisation**, and describes smooth scrolling as a *"happy accident"*
that overshadowed the original problem.

`VERIFIED FACT` — The same authors' production starter kit handles
`prefers-reduced-motion` correctly in three other places, and still mounts smooth scroll
unconditionally.

> `RECOMMENDATION` — Two conclusions.
>
> **First, "accessible" in this ecosystem means anchors and keyboard semantics survive.
> It does not mean motion-sensitive users are safe.** Do not inherit a claim that has not
> been verified.
>
> **Second, if there is no WebGL layer that must track DOM position, the library's own
> stated rationale does not apply.** Adopt smooth scroll for synchronisation, not for
> feel — and if adopted, add reduced-motion handling explicitly, because nothing in the
> stack provides it.

`VERIFIED FACT` — Locomotive Scroll v5 is now a thin wrapper over Lenis (its sole
dependency), with roughly 1/82nd of Lenis's install volume. Choosing it means choosing
Lenis plus a wrapper.

---

## 6. The fallback ladder

`RECOMMENDATION` — Modelled on the strongest published example found (Shopify's Spring
'26 experience), adapted to this project:

| Tier | Condition | Delivered |
| :--- | :--- | :--- |
| **0** | No WebGL, JS failed, or INSTANT SHOP | **Static images, full commerce, no canvas** |
| 1 | Low-memory mobile | Minimal motion, smallest assets, capped DPR |
| 2 | Mid-tier device | Reduced texture sizes, fewer frames |
| 3 | Capable desktop | Full quality |

`RECOMMENDATION` — Two rules that make the ladder real rather than decorative:

- **Tier 0 must not require a GPU.** A fallback that still needs WebGL is not a fallback.
- **Scope hidden states under a JS-set attribute**, so that if JavaScript fails, content
  renders **visible** rather than permanently hidden. For a commerce site this is close
  to mandatory: *a failed animation must never hide a product.*

### 6.1 Reduced motion, done correctly

`RECOMMENDATION` — Adopt the strongest pattern found in the research:
**under `prefers-reduced-motion`, keep user-initiated interaction responsive and remove
motion the user did not initiate.** Pointer and tap response stays; scroll-driven
parallax, scrubbing and spatial eruption go.

Weaker patterns to avoid:
- **Reducing speed instead of removing motion** — a partial accommodation that still
  moves.
- **Assuming the media query is sufficient.** Not everyone sets the system preference.
  Provide a visible in-page motion control as well.
- **Treating reduced motion as a downgrade to the plain grid** — that removes content the
  user asked for on the basis of a health setting. See
  [05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md) §3.4.

---

## 7. Proposed performance budget

`RECOMMENDATION` — Numeric, testable, and set against the actual audience: mid-range
Android on rural Texas connections.

| Metric | Budget | Rationale |
| :--- | :--- | :--- |
| **LCP** (p75, mobile) | **≤ 2.0s** | Beats the 2.5s threshold with margin; Burberry and SSENSE achieve 1.3–1.5s |
| **INP** (p75) | **≤ 150ms** | The metric the category actually fails. Gucci 400ms, Prada 575ms |
| **CLS** (p75) | **≤ 0.05** | Half the threshold; entirely achievable — four sites in the table hit 0.00 |
| Initial JS (compressed) | **≤ 180 KB** | INP is a JavaScript problem |
| Total page weight, shop surfaces | **≤ 1.5 MB** | Well under the 2,311 KB mobile median |
| Total page weight, cinematic surfaces | **≤ 4 MB** | Roughly 1.5× median; ~14× cheaper than Apple's 55.8 MB |
| Frame sequences | **≤ 60 frames, WebP/AVIF, ≤ 80 KB per frame** | Published guidance |
| Fonts | **≤ 2 families, ≤ 4 files** | Matches the two-typeface rule in [04](04_CREATIVE_NORTH_STAR.md) |

`RECOMMENDATION` — Enforce in CI. A budget that is not measured on every build is a
wish.

---

## 8. Where each technique is justified

`RECOMMENDATION` — Opinionated first pass, to be validated against V3 during the audit.

| Surface | Technique | Justification |
| :--- | :--- | :--- |
| Daily drop grid | **CSS + minimal JS** | It is a grid. It must be fast and updated daily |
| Lookbook → shoppable | **CSS + hotspot overlays** | No motion needed; the value is the data link |
| Product gallery / macro | **CSS + responsive images** | Material honesty comes from photography |
| Garment movement | **Short looping video, poster-first** | Cheaper and better than simulating cloth |
| Campaign hero | **Video with poster fallback** | One well-encoded video beats a frame sequence |
| Image-becomes-film transition | **CSS/Web Animations, or a capped frame sequence** | Only if a sequence proves necessary |
| Page transitions | **View Transitions where supported, CSS fallback** | Verify support level during the audit |
| Product Anatomy / 3D | **React Three Fiber — only if the audit proves it necessary** | Highest cost, least evidence, and requires assets that do not exist (OQ-13) |
| Ignition sequence | **Video or CSS** | Must never block first interaction |

`OBSERVATION` — On this assessment, **one surface out of nine has a plausible case for
WebGL**, and it depends on 3D assets that have not been confirmed to exist. That is a
finding, not a lack of ambition.

---

## 9. Architectural principles

`RECOMMENDATION` — For validation against V3:

1. **Server-render content; enhance with motion.** Product data must render without
   JavaScript. INP is the category's failure mode, and the cure is shipping less JS.
2. **Keep scroll out of React's render cycle.** Scroll position should drive animation
   values through refs, never component re-renders.
3. **One clock.** If a scroll library and an animation library are both used, drive one
   from the other's ticker. Two independent animation loops produce drift.
4. **One route tree, three presentations.** Experience mode is a context, not a routing
   branch — this makes divergence between modes structurally impossible.
5. **Structured product data is the foundation.** Extracting attributes from product-name
   strings unlocks filtering, editorial naming, shoppable lookbooks and the Garment
   Portal simultaneously. See [01](01_PRODUCT_AND_CATEGORY_MAP.md) §3.2.
6. **Media slots are declared, with posters and ratios**, so a missing asset degrades
   predictably. See [07](07_CONTENT_AND_MEDIA_STRATEGY.md) §3.
7. **Authoring ergonomics are a launch requirement.** If publishing a drop is slower than
   duplicating an HTML page, the platform will not be used.

---

## 10. The two most likely failure modes

`REASONABLE INFERENCE`, drawn from the evidence above:

> **First: the site ships beautiful and fails INP.** The category's own leaders fail this
> way — Gucci at 400ms, Prada at 575ms on 83.6% mobile traffic. Scroll-driven animation
> runtimes are the direct cause. It will not look like a failure in review; it will look
> like a slightly sticky page, and it will cost conversion measured in the tens of
> percent.
>
> **Second: the site ships beautiful and goes stale.** Content operations currently run
> on page duplication. If the new authoring flow is slower than copy-paste, the daily
> drop stops being daily. Nobody will file a bug for this.

Both are preventable, and neither is prevented by design quality.

---

## Cross-references

- [05_EXPERIENCE_ARCHITECTURE.md](05_EXPERIENCE_ARCHITECTURE.md) — modes and reduced motion
- [06_COMMERCE_REQUIREMENTS.md](06_COMMERCE_REQUIREMENTS.md) — what must work regardless
- [07_CONTENT_AND_MEDIA_STRATEGY.md](07_CONTENT_AND_MEDIA_STRATEGY.md) — media slots
- [09_RESEARCH_SOURCES.md](09_RESEARCH_SOURCES.md) — sources and access dates
