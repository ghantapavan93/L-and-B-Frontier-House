# LB Frontier House — Final Visual Authority

The single reference an implementer consults. Where anything below disagrees with
a Stitch frame, a research note or a reference site, **this file wins** — because
this file is the only one that has been reconciled against all of them.

## Hierarchy

1. **Owner-confirmed and verified brand truth** controls facts.
2. **The Creative Constitution** controls experience ambition.
3. **V3** controls final platform composition.
4. **V3.1** controls cinematic, spatial, mobile and fallback enhancement.
5. **The existing application** controls verified functionality and security.
6. **External references** contribute principles only.
7. **Engineering judgement** delivers accessible, performant equivalence.

---

## Conflicts, and how each resolves

| # | Conflict | Resolution | Authority |
| :--- | :--- | :--- | :--- |
| C-1 | Every Stitch design system is a **Material 3 default theme**; the warm palette lives only in prose | Ship the warm palette. `tokens.css` is authoritative | 1 over 3 — tooling artefact, not a design decision |
| C-2 | V3 draws the wholesale showroom as a **public page with prices on it**; zero auth states in 48 files | Prices are **absent, not hidden**, from unauthorised responses | 5 over 3 — security |
| C-3 | V3 renders `FOR HIM`, a **$850 men's boot**, "Men's Collection" and a menswear rack | Menswear does not ship, anywhere, in any state | 1 over 3 |
| C-4 | V3 names *Kuroki Mill* and *Leon & Tuscany* | Removed with no alternative branch — they contradict verified vertical integration | 1 over 3 |
| C-5 | Corpus carries **"EST. 1865"** engraved into artwork | Dead. No date ships in any asset, alt text, caption or filename | 1 over 3 |
| C-6 | Design prices are **$45–$1,250**; verified wholesale is **$7–$33** | Fixture prices never ship. Implied retail ≈ $20–$85 calibrates the visual system | 1 over 3 |
| C-7 | V3.1 maps **wheel events to camera** | Overruled. Never intercept the wheel; drive from native scroll position | 7 over 4 |
| C-8 | The specified focus ring is **2.18 : 1** on bone | Tobacco Leather `#734F36` at **6.49 : 1** | 7 over 3 |
| C-9 | V3 demotes *Skip to Shop* to grey text; **V2 gave it CTA parity** | Recover parity — a mechanic, not a style | 2 over 3 |
| C-10 | **V3 removed MSRP**; V2 showed `$185 WHSL / MSRP $395` | Recover **when owner data exists**. Margin maths is the buyer's core decision | 2 over 3, gated on data |
| C-11 | Three taxonomies exist; only `Wholesale` is common to all | Ship **Women · Girls · Accessories**, the verified set. Plus is a filter and a fit story pending **D-04** | 1 over 3/4 |
| C-12 | Route-level `loading.tsx` breaks the 307/404 contract and the h1 invariants | Not shipped. In-page Suspense below the `h1` is the route through | 5 over 2 |
| C-13 | V1's **Dallas skyline** is the only verified geography; V1's *"from the heart of Texas"* asserts identity without a manufacturing claim | Both re-adoptable — the phrase verbatim, the skyline only from owner-supplied photography | 1 permits; media blocks |

---

## The system

**Typography.** Playfair Display (display) + Hanken Grotesk (UI) + JetBrains Mono
(numeric/mono). Display sizes `--display-xl` 84 / `--display-lg` 64 /
`--headline-lg` 40 (mobile 32) / `--headline-md` 24. Body 16/24, lede 18/28.
Label-caps 12px, 600 weight, `0.1em` tracking, uppercase — the system's connective
tissue. Headings carry `text-wrap: balance` and `-0.015em` tracking.
*Playfair is a substitute that became the brand face three generations ago; it
stays until D-07 answers.*

**Colour.** Ink `#0a0a0a` · Bone `#f5f2ee` · Tobacco `#734f36` · Rust `#8b3a3a` ·
Carbon `#121212` · Sandstone `#d9c5b2` · Indigo `#1b2b45`. Surfaces: page bone,
raised `#fffdfa`, sunken `#ece6de`, inverse ink. Rules `#e2dbd1` / `#cec4b6`.
Focus **Tobacco, never Oxidized Silver**. Error `#8b3a3a` (6.02 : 1 on bone).
**Colour is carried by the garment, not the interface.**

**Material language.** Recovered from V1: a fixed 2.5%-opacity fractal-noise
overlay across the page, pointer-transparent, one composited layer. Panels are
raised white with hairline rules — not flat stacked text. Radii are **0** by
system (`--radius-full` is reserved for pearl-snap hardware only).

**Grid and rhythm.** `.container` at `--container-max` with safe-area-aware
inline padding. Section gap `--space-9` (120px). Spacing scale 4/8/12/16/24/32/
48/80/120. PDP splits `1.15fr / 1fr` above 62rem, single column below. PLP is
`.layout-with-facets` — rail plus grid.

**Image scale.** Product media is **4:5**, always, on a sunken ground so a missing
image is a designed box rather than a hole. Editorial media is 16:9 or full-bleed.
Sources are currently **360 × 540** and 18 of 31 are flagged
`needsHigherResolution` — the cap on perceived quality everywhere, fixable only by
re-shoot.

**Navigation.** Desktop: wordmark left, primary nav, account right. Below 62rem:
a `<details>` disclosure — **Menu · centred wordmark · Account on one row**, full
nav inside, keyboard-native, zero JS. **Search is not built and no dead search
field ships** — a search box that cannot search is a lie.

**Product cards.** 4:5 media, name, one meta line. **No price on a public card** —
a public product record has no wholesale field at all.

**PLP language.** Breadcrumb → h1 → lede → optional approved banner → facet rail +
grid. Filter state is visible, countable, clearable, and lives entirely in the URL.

**PDP arrival.** Editorial band (blurred oversize backdrop behind a sharp
contained image — this protects 360px sources from soft full-bleed), gallery,
name, description, **Product Anatomy as a semantic list of the product's own
attributes**, size range as structured text, related frames, return to the sheet.

**Wholesale world.** Terms as the opening claim. Four-step approval journey.
Virtual Rack — rail-and-hooks over real product photography, **names and
availability only, no price**. Proof band: 100% fill rate · 2.64 days · $50
minimum · packs of 6. All verified; never rounded.

**Buyer world.** Restricted values are server-rendered inside the authorised
session, as **semantic text inside a named region** — never an image, never
WebGL. Each denial state names itself in a heading. Fail closed.

**Contact-sheet logic.** Nine frames; selecting one opens a story panel via
CSS `:target`; URL hash is the persistence; anchors are the keyboard path; zero
JS. V2's stated-motion annotation is the model to grow toward.

**Textile-thread language.** One continuous turquoise thread is the brand's
through-line: it draws the monogram at ignition, runs the Thread-to-Trade spine,
and exits the buckle at the canonical terminal. It encodes the **verified**
vertical-integration chain. It is never decorative filler.

**Buckle language.** Scalloped rectangle, 1.64:1, 92 mm reference. Darkened
brushed silver, oxidized copper, tooled leather, denim, bone stitch, four
turquoise cabochons, luminous inlay. **Never** a coin, badge, reticle, longhorn or
date. Delivered: 4.00 s ignition, desktop and mobile, MP4 + WebM + posters.

**Motion language.** Interactive 100–400 ms; two easing curves. Entry 300 ms /
exit 200 ms. Ignition draw 2.8 s, once, no loop — under the WCAG 2.2.2 five-second
threshold, so no pause control is owed. Scroll-linked only behind `@supports` and
`prefers-reduced-motion: no-preference`. **No scroll-jacking. No GSAP. Poster-
first, always.** Anything looping or over 5 s that the user did not start owes a
visible pause control.

**Mobile composition.** An original composition. Verified at 320 / 360 / 390 /
430. Portrait media is art-directed via `<picture>` — **a centre crop of a
landscape frame is not an art direction**. No horizontal overflow; wide content
scrolls inside its own container.

**Loading, empty, error.** Branded, semantic, stable — never a bare spinner.
Skeletons reserve the real boxes so arriving content shifts nothing. Empty states
name the state and offer one action. Errors echo no restricted value; the digest
is opaque. *Route-level `loading.tsx` is currently blocked — see C-12.*

**Reduced motion.** Not a fourth mode and not a synonym for Instant Shop. Keep
user-initiated interaction responsive; remove motion the user did not initiate.
**Content and capability identical.** No `<video>` element renders at all.

**Media provenance.** Four classes only — `owner-supplied`, `blender-master`,
`generated-campaign` (D-09: atmosphere only, never evidence), `licensed-stock`.
Every asset carries provenance, source, licence, approval, product-truth
classification, route, desktop and mobile derivatives, reduced-motion fallback and
a manifest row. **Supply is not publication.** Never present generated or borrowed
apparel as an L&B SKU.
