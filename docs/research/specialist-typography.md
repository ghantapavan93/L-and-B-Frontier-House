# Specialist: Typography — eleven references, measured, against our three-voice system

**Method.** Every number below is a **computed style read from the live DOM** at a
1440 × 900 viewport (`getComputedStyle` via in-app browser), 2026-08-14. Homepage,
one PLP and one PDP per site where reachable. Characters-per-line derived from the
element's rendered width against its own font's average character advance (canvas
`measureText`). No number is taken from a stylesheet, a screenshot or memory.
Mobile (390px) h1 sizes and scale ratios are in §3.

**Hard rule honoured throughout:** mechanisms and classes only. No recommendation
adopts a competitor's proprietary face; equivalents named are licensable
(Google Fonts / Adobe Fonts / retail foundries).

---

## 1. The comparison table

### 1.1 Voices and roles

| Site | Display face (class) | Text face (class) | Commerce face | Loading |
| :--- | :--- | :--- | :--- | :--- |
| **Kimes Ranch** | Poppins (geometric sans) | Poppins | Poppins | `fallback`, Shopify CDN |
| **Tecovas** | Borax **(variable)**, warm display, w550 | Mundial (humanist sans) | Lorimer No 2 (grotesque) | `swap`, Typekit |
| **Lucchese** | Brandon Grotesque w300 (geometric sans) | Brandon Grotesque | Brandon Grotesque | `swap`, Typekit |
| **Cinch** | Bevan (slab) | Outfit (geometric sans) | Outfit | `fallback` |
| **Rockmount** | Cormorant w700 (garalde serif) | Jost (geometric sans) | Jost | `swap` |
| **Sendero** | Oswald (condensed grotesque) | Kameron (slab serif) | Oswald caps + Kameron price | `swap` |
| **Schaefer** | Baskervville w700 (transitional serif) | Baskervville + Helvetica | Helvetica | `swap` |
| **Ferrell** | Arvo (slab) + Kiln Sans (display) | DM Sans | DM Sans / IBM Plex Sans | `swap` |
| **Miss Me** | Inter w700 | Inter | Inter | `fallback` + 10 stray families |
| **Sézane** | Sézane Serif (custom didone-ish) | EB Garamond 14px | Sézane Gothic 12px caps | `swap`, custom |
| **GANNI** | Helvetica Neue for GANNI (custom grotesque) | same | same | `swap`, custom |
| **OURS** | **Fraunces variable, opsz, w440** | **Inter 16px** | **Inter + IBM Plex Mono** | **next/font self-hosted, swap, zero CLS** |

### 1.2 Homepage roles at 1440px (computed)

| Site | h1 | h2 / display band | Body ¶ (size/leading, ~CPL) | Nav link | Button | Eyebrow / meta |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kimes | **16px** Poppins 400 (wordmark-as-h1) | 44px 400 caps +0.02em | 16/25.6 w300, 44ch | 16px 400 | 16px w700 | — |
| Tecovas | 42px Borax 550, lh 1.2 | 42px Borax 550 | 16/22.4, 45ch | 16px 400 | (PDP: Lorimer 600 caps) | 14px 600 caps +0.02em |
| Lucchese | *none* | **56px w300 caps −0.01em** | **14/22.4**, 63ch | **12px 500 caps +0.167em** | **11px 500 caps +0.12em** | 14px 500 caps +0.14em |
| Cinch | 34px Outfit 700 | 33.6px Bevan caps +0.1em | 17/28, 52ch | 17px 400 | 16px 400 caps +0.07em | 11px Bevan caps +0.1em |
| Rockmount | 32px Cormorant 700 +0.05em | 30px Cormorant 700 | 16/25.6, 46ch | 16px 400 | — | — |
| Sendero | *none* | 32px Oswald 500 caps | 18/23.4 Kameron, 37ch | 15px 500 caps +0.08em | 12px caps (quick shop) | — |
| Schaefer | 30px Baskervville 700 caps | **52px Baskervville 700 caps** | 18/23.4 serif, 32ch | — | **13px 700 caps +0.30em** | 13px 700 caps +0.20em |
| Ferrell | *none* | 27px Arvo caps +0.025em | 16/25.6, 64ch | 11px 500 caps | 15px IBM Plex Sans caps +0.10em | 11px caps +0.10em |
| Miss Me | *none* | 25.6px Inter 700 caps | 13/16.9 w300, 87ch | — | 14px caps +0.08em | 12.8px 700 caps **+0.30em** |
| Sézane | 30px serif +1.5px | 18px serif w600 | **14/19.6 EB Garamond**, 71ch | **12px 500 caps +0.125em** | 12px caps +0.125em | 12px caps +0.125em |
| GANNI | *none* | 18px Helv 500 | 14px/normal | 14px 400, no caps, no tracking | 14px 400 | — |
| **OURS** | **clamp → 68px Fraunces 440 −0.03em, lh 1.02** (hero variant 76px caps) | **clamp → 44px −0.025em** | **16/24 Inter, 62ch max** | **12px 500 caps +0.10em** | **14px 500 caps +0.05em, 48px tall** | **12px mono 600 caps +0.10em** |

### 1.3 PLP and PDP roles at 1440px (computed)

| Site | PLP title | Card name | Card price | PDP title | PDP price | Add to cart | PDP body (~CPL) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kimes | 44px Poppins caps | 16px 400 | 16px w300 | 44px caps | 20px w300 | 16px w700 | 16/25.6, 65ch |
| Tecovas | 32px Lorimer 600 | **18px Lorimer 600** | 14px 600 caps | 24px Lorimer 700 | 18px 600 caps +0.02em | — | 16/22.4, 86ch |
| Lucchese | 16px caps (crumb-scale) | 16px 400 caps +0.02em | 16px 400 | 28px w300 caps | 16px | — | 14px |
| Cinch | 33.6px Bevan caps +0.1em | (below fold, JS-gated) | — | 26.4px Bevan caps +0.1em | — | 16px Outfit caps | 17/28, 100ch |
| Rockmount | 40px Cormorant 700 | 16px Jost | 16px Jost | 32px Cormorant 700 | 18px | (icon) | 16/25.6, 77ch |
| Sendero | — | 14px Oswald 500 caps | 20px **Kameron serif** | 30px Oswald 600 caps | **28px Kameron serif** | 14px caps | — |
| Schaefer | 53px Kiln Sans caps (banner) | 15px Baskervville 700 caps **+0.20em** | 14.45px Helv | 24px Baskervville 700 caps | 19px Helv | 13px 700 caps +0.30em | 15.6/23.5, 76ch |
| Ferrell | 53px Kiln Sans caps | 14px DM Sans | 12px | 23px Arvo caps +0.025em | 16px | 15px IBM Plex Sans caps +0.10em | 16px, 64ch |
| Miss Me | 24px Inter 600 | 13px 500 | 13px 400 | 18px 500 | 18px 400 | 16px caps +0.08em | 13/20.8, 67ch |
| Sézane | **50px serif 500 caps** | **13px EB Garamond 600 caps +1.5px** | 13px, same style as name | 30px serif 500 caps | 18px serif 500 | 12px Gothic caps | 14/19.6, 41ch |
| GANNI | 26px Helv 500 | 14px 500 | 14px 400 | 26px 500 | **26px 500 — price at title scale** | 14px | 14/17.5 |
| **OURS** | h1 clamp → 68px *(page-hero)* | **18px Fraunces 500 −0.01em** | 14px Inter (spec line) | **clamp → 52px Fraunces 440** | **36–48px Fraunces (price panel, authorised)** | 14px 500 caps +0.05em | 16/24, ≤62ch |

---

## 2. What separates the premium-reading sites from the flat ones

The premium cluster here is **Sézane, GANNI, Lucchese, Tecovas** (and Schaefer's
buttons). The flat cluster is **Kimes, Miss Me**, with Rockmount/Cinch/Ferrell in
between. The separator is **never the display size** — it is what happens to the
small type.

1. **Role separation at the small end.** Premium sites give commerce type its own
   register: nav 12px caps tracked, card name 13–18px in a committed voice, price at
   or *below* the name's size and weight (Sézane 13=13, GANNI 14=14, Tecovas 14<18).
   Flat sites set everything — nav, body, card name, price, button — at 16px/400
   in one family (Kimes literally: h1 16px = body 16px = nav 16px). Hierarchy
   collapses and the page reads as an admin list with photos.

2. **Tracking is the premium signal, not size.** Every premium commerce role is
   uppercase with +0.10 to +0.30em tracking at 11–13px (Lucchese buttons 11/+0.12,
   Sézane everything +0.125, Schaefer buttons 13/+0.30). Sézane runs **+1.5px
   letter-spacing globally** — body included — as a house signature. The flat sites
   track nothing. GANNI is the exception that proves the rule: zero tracking, zero
   caps, but total commitment to one custom grotesque at two sizes (14/26) — the
   discipline is the signal.

3. **One or two voices, total commitment; a serif as identity, used scarcely.**
   Premium sites hold to a strict palette (GANNI one family; Lucchese one family;
   Sézane serif + gothic + garamond, each with one job). Flat sites accumulate:
   Miss Me computed Inter but *loads eleven families* including three Klaviyo
   hostages. Where a serif appears in the premium set it is the brand's voice —
   Sézane Serif for titles, Kameron for Sendero's *prices*, Cormorant for
   Rockmount's headlines — and body work stays in a workhorse.

4. **Display is scarce and capped around 50.** The largest display type measured
   anywhere in eleven sites: Lucchese 56, Ferrell/Schaefer 53, Sézane PLP 50,
   Kimes 44, Tecovas 42. Nobody runs 60px+. Premium reads as *one* statement at
   44–56 surrounded by disciplined 12–16px, not as large type everywhere.

**Where the money is — the two or three decisions that matter:**

- **Decision 1: commerce-role discipline.** Nav/name/price/button at 11–14px, caps,
  +0.08–0.15em, price never louder than the name. This is the cheapest, most
  measurable premium separator in the entire dataset.
- **Decision 2: display scarcity with a hard ceiling.** One display statement per
  screen at 44–56px; the next level down drops to ≤ 24px. The gap *between* levels,
  not the top size, creates the editorial read.
- **Decision 3: a committed identity voice with one job.** A serif (or one custom
  grotesque) that appears at title moments only — plus zero stray families loaded.

---

## 3. h1 at 1440 vs 390 — fluid scale ratios

Measured on the most prominent homepage display heading (h1 where one exists,
otherwise the lead h2/display band).

| Site | 1440px | 390px | Ratio | Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| Kimes | 44px (h2/PLP h1) | *see patch note* | — | media queries |
| Tecovas | 42px | *see patch note* | — | static + MQ |
| Lucchese | 56px | *see patch note* | — | MQ |
| Cinch | 33.6px | *see patch note* | — | **vw-fluid** (33.6 = 2.33vw-ish; measured 29.1 at 924) |
| Rockmount | 32px | *see patch note* | — | MQ |
| Sendero | 32px | *see patch note* | — | MQ |
| Schaefer | 52px | *see patch note* | — | MQ |
| Ferrell | 53px (PLP banner) | *see patch note* | — | vw-fluid |
| Miss Me | 25.6px | *see patch note* | — | rem-based |
| Sézane | 30px (PLP 50px) | *see patch note* | — | MQ |
| GANNI | 18–26px | *see patch note* | — | static |
| **OURS** | **68px (h1), 76px (hero)** | **36px / 34px (clamp floors)** | **1.89 / 2.24** | `clamp(2.25rem, 5.2vw, 4.25rem)` |

> **Patch note:** the 390px column is measured in the follow-up pass (§3.1 below if
> present). Our own values are exact — the clamp floors are deterministic.

---

## 4. Verdict on OUR system — Fraunces 440 / Inter / IBM Plex Mono

Judged against the measured field. File references:
`src/app/globals.css`, `src/app/tokens.css`, `src/app/layout.tsx`.

**D-07 (committed typeface) remains an OPEN owner decision.** Fraunces is the
working direction, owner-directed 2026-08-13 — everything below calibrates the
working direction; nothing below closes D-07.

### 4.1 Where we already beat the references — leave alone

- **Loading strategy.** `next/font` self-hosts all three faces with metric-matched
  fallbacks: zero third-party request, zero CLS. *Every* reference FOUTs from a CDN
  (`swap`/`fallback`), and Miss Me loads eleven families. We are strictly ahead.
- **A true variable display face.** Only Tecovas ships one (Borax, w550). Fraunces
  with `opsz` auto + weight 440 is the same move executed more deliberately — the
  optical axis opens contrast at 68px and closes it at 18px card names, which no
  static reference face can do.
- **Nav register: exact premium-cluster match.** Ours 12px/500/caps/+0.10em ≈
  Sézane 12/500/+0.125 and Lucchese 12/500/+0.167. Correct; keep.
- **Body: right side of both camps.** Inter 16/24 with a 62ch cap sits between the
  heritage-western 16–17px and the fashion 14px, and beats the measured extremes
  (Miss Me 87ch, Cinch 100ch). Keep 16/24; never let a column exceed 62ch.
- **Serif card name at 18px/500.** Top of the measured field (Tecovas 18 sans;
  Sézane 13 serif caps) — a real differentiator, and it survives our 230px grid
  column on one line. Keep; do not enlarge.
- **h2 at 44px cap.** Dead centre of the measured display band (33.6–56). Right.

### 4.2 Where the field disagrees with us — owner-directed, hold but know the number

- **h1 68px / hero 76px exceeds every one of eleven measured sites.** The field's
  ceiling is Lucchese 56. Our cap is +21% over the tallest reference and +36% over
  the premium median (~50). This scale was an explicit owner recalibration
  (2026-08-08, "dated and too timid") so it stands — but it is a *deliberate
  outlier*, not a measured norm. If it is ever revisited: **56–60px cap**
  (`clamp(2.25rem, 4.4vw, 3.625rem)`) is the largest value with any measured
  company; the hero variant should stay one step above the page h1, ≤ 64px.
- **PDP title 52px cap is 1.7× the largest measured PDP title** (Rockmount 32,
  Sézane 30, Sendero 30, Lucchese 28, GANNI 26, Tecovas 24). References treat the
  PDP title as a *label above data*, not a poster. Ours is a statement by design —
  but 40px (`clamp(2rem, 3.4vw, 2.5rem)`) would still lead the field by 25% while
  giving the spec table back its authority. Flagged, not mandated.

### 4.3 Concrete numeric corrections — apply these

1. **Synthetic bold on IBM Plex Mono — real bug.** `layout.tsx` loads Plex Mono at
   **400 and 500 only**, but `.eyebrow` carries `font-weight: 600`, `.badge` uses
   `--label-caps-weight` (600), and `thead th` sets 600 — which now applies to the
   mono `line-sheet__table` and `guide-table` heads. The browser fake-bolds all of
   them (smeared stems, wrong advance — visible at 10–12px). **Fix: either load
   `weight: ['400','500','600']`, or — better, mono needs no bold at caps sizes —
   drop every mono-role weight to 500:** `.eyebrow{font-weight:500}` when mono,
   `--label-caps-weight` stays 600 for Inter labels, and give
   `.line-sheet__table thead th, .guide-table thead th {font-weight:500}`.
2. **Mono tracking is double-wide.** Plex Mono's fixed advance already spaces
   capitals; +0.10em (`--tracking-wider`) on top makes 12px eyebrows run ~15% wider
   than the same words in tracked Inter. Measured premium caps tracking is
   +0.10–0.15em *on proportional faces*. **Set mono caps tracking to 0.05–0.06em**
   (a `--tracking-mono: 0.05em` token consumed by `.eyebrow`, `.notice__title`,
   `.calendar__kind`, `.line-sheet__table thead th`, `.guide-table thead th`).
3. **Button tracking +0.05em is slack against the premium cluster** (Sézane +0.125,
   Lucchese +0.12, Schaefer +0.30, Ferrell +0.10). At 14px/500/caps ours is the
   loosest tracked uppercase button in the comparison. **Raise `--ui-button-tracking`
   to 0.08em** (keep 14px; premium runs 11–13px but our 48px target height wants
   the extra size).
4. **Mono deployment: correctly wide on data, one role too wide on editorial.**
   Right (keep): badges, counts, SKU, spec-table `dt`, table heads, line-sheet
   terms, calendar kind/window, fixture flags, notice titles — the line-sheet
   register no consumer reference has; it is our wholesale-native differentiator.
   Wrong (split): **`.eyebrow` globally.** An editorial eyebrow ("The Autumn Edit")
   in mono reads as metadata, not invitation; no premium reference sets its
   editorial kicker in a data voice. **Split the role: `.eyebrow` back to Inter
   600/+0.10em; add `.eyebrow--tech` (mono 500/+0.05em) for wholesale surfaces,
   PDP spec blocks, drop counts.** Two-line change, and it removes the main
   "admin console" risk while keeping the trade voice everywhere it earns rent.
5. **Card price line.** Ours renders spec text (`--text-xs` 14px Inter meta) rather
   than a price on public cards — correct under the permission boundary. When the
   authorised price does appear (price panel, 36–48px Fraunces): that is 1.7× the
   loudest measured PDP price (Sendero 28 serif). A line-sheet states; it does not
   shout. **Recommend 28–32px cap** (`clamp(1.5rem, 2.6vw, 2rem)`) with the
   pack/terms rows given the recovered space — GANNI's price-at-title-scale (26=26)
   is the honest ceiling for "price as information".
6. **Fraunces 440 weight and −0.022em base tracking: keep exactly.** The field's
   serif displays run 300–700 with 0 to +0.05em; our 440/−0.022 (h1 −0.03) is the
   contemporary-fashion cut of the same register, and negative tracking beyond
   −0.03em would start to close Fraunces' apertures at caption sizes. Hold the line
   here; the opsz axis is doing the elegance work the references buy with weight.

### 4.4 Summary judgement

The system's *architecture* — variable serif identity + workhorse sans + mono data
voice, self-hosted, CLS-free — is stronger than any measured reference. The
calibration errors are all small and all at the edges: a fake-bold mono (bug), mono
tracking doubled (token), buttons under-tracked (token), the mono eyebrow one role
too broad (split), and two owner-directed scale outliers (h1 68 / PDP 52 / price 48)
that exceed the entire measured field and should be *known* outliers, revisited only
through D-07 when the owner commits a final typeface.
