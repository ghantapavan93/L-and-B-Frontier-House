# 09 — Motion and Interaction Audit

All durations and easing values `MEASURED`. Ownership recommendations are proposals, not
approvals.

---

## 1. The interaction conflict that matters most

> `OBSERVED` — `v3_1_route_and_state_map.md` §1:
> **"Desktop: `Wheel/Scroll` maps to Camera Z-axis."**
>
> `INFERRED` — Mapping wheel deltas to a camera axis **is scroll interception**.
> `CLAUDE.md` §9: *"Never intercept the wheel. Read native scroll to drive animation."*
> Research measures scroll-jacking at roughly **5.6× more errors (p<0.001)** with no time
> saving, and it is materially worse on mobile — where this audience lives.
>
> **Resolvable without losing the effect:** drive the same camera value from **native
> scroll position** rather than from wheel events. The choreography survives; the hijack
> does not. Conflict **C-09**.

---

## 2. Motion inventory

`MEASURED` — V3.1 named motion tokens (`v3_1_engineering_handoff.md`):

| Token | Duration | Easing | Trigger |
| :--- | :--- | :--- | :--- |
| T1_Stitch | **2400 ms** | `cubic-bezier(0.16, 1, 0.3, 1)` | Page load |
| T2_Unfold | **1800 ms** | `Expo.out` | Stitch complete |
| T3_Aperture | **1200 ms** | **`Back.inOut`** | User click / approach |
| T4_Erupt | **800 ms** | `Power4.out` | Portal entry |

`MEASURED` — V3 (`design.md`): Eruption **800 ms** `cubic-bezier(0.16, 1, 0.3, 1)`;
reduced motion → **400 ms opacity crossfades**.

`MEASURED` — Belt Buckle states S2–S8: 1200 + 800 + 1500 + 1000 + 600 + 1200 + 800 =
**7,100 ms**.

`MEASURED` — Corpus-wide: **66 duration values exceed 400 ms; 21 comply.**
**13 distinct easing curves** against a two-curve rule.

`INFERRED` — **`Back.inOut` overshoots.** Overshoot is a documented vestibular trigger and
should not survive into any reduced-motion path.

---

## 3. Sequence-by-sequence

| Sequence | Purpose | Trigger | Duration | Blocks commerce? | Reduced-motion equivalent | Feasibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Thread Ignition | Brand entry; draws the L&B mark | Page load | 2400 ms | **Yes** unless skippable | Static mark | High — SVG/CSS stroke |
| Blueprint Unfold | Thread becomes warehouse | Auto | 1800 ms | Yes | Static still | Medium |
| Warehouse Reveal | Establish the "Impossible Warehouse" | Auto/scroll | — | Yes | Static still | Medium — **meaning is undocumented visually** |
| Buckle Awakening (S1–S4) | Dormant → activate | Approach | 3500 ms | Yes | Crossfade between states | **Video recommended** |
| Ring Separation (S5) | Buckle splits into rings | Scroll | 1000 ms | Yes | Static separated state | **Video** |
| Category Orbit (S6) | Category markers appear | Auto | 600 ms | Yes | Static labelled list | DOM overlay |
| Camera Passage (S7–S8 + T1–T6) | Buckle → warehouse → runway → contact sheet | Scroll | 2000 ms + | **Yes** | Crossfade to contact sheet | **Video — 3 of 8 steps never exported** |
| Image → Film | Still wakes into film | Scroll/click | — | No | Static poster | **No video asset exists** |
| Shoppable Film | Hotspot commerce | Playback | — | **No — must not** | Poster + product list | Needs `<track>` timeline |
| Contact Sheet Eruption | Nine frames erupt | Scroll/enter | 800 ms | No | Plain grid | High — CSS/GSAP |
| Garment Portal | Texture-mask page transition | Click | — | No | Cross-fade | Medium |
| Product Anatomy | Exploded garment layers | Scroll/drag | — | No | Static exploded diagram | **Needs GLB; needs 2.5.7 alternative** |
| Atelier config | Bespoke configuration | User input | — | No | Same, unanimated | DOM form |
| Living Cart | Item enters cart | Add | ≤ 400 ms | **No — never** | Instant | CSS |
| Mobile Depth Carousel | Horizontal category depth | **Swipe** | — | No | Static list | **Needs 2.5.7 alternative** |
| Mode switch | Cinema / Balanced / Instant | Click | ≤ 200 ms | No | Instant | CSS |

---

## 4. Focus, keyboard, interrupt and back-navigation

`MEASURED` — across 48 files: `:focus` **0** · `tabindex` **0** · `aria-live` **0** ·
`role=` **1** · `<form>` **0**.

`INFERRED` — **No motion sequence in the corpus documents focus behaviour, keyboard
control, interrupt behaviour, or back-navigation behaviour.** For a project whose signature
is a multi-stage scroll narrative, these are the four questions that decide whether it is
usable, and none is answered in any source file.

Specifically undefined:
- What happens to focus when a pinned section enters or leaves (WCAG **2.4.11**)
- Whether Tab, Home, End, PageUp/PageDown are intercepted during the camera passage
- Whether the sequence can be interrupted mid-flight and retargeted
- Whether browser Back exits the passage or replays it
- What happens when a user scrolls faster than the choreography

`OBSERVED` — One genuine mitigation exists: **`Skip Intro` always routes to the Contact
Sheet.** `INFERRED` — This is the correct escape hatch and plausibly satisfies WCAG 2.2.2
as a *hide* mechanism — **provided it is visible from the first frame, keyboard-reachable,
and not itself animated in.** Must be verified, not assumed.

---

## 5. Recommended ownership

`RECOMMENDATION` — one technology per effect, per `CLAUDE.md` §9.

| Mechanism | Owns | Rationale |
| :--- | :--- | :--- |
| **CSS / WAAPI** | Hovers, mode switches, cart feedback, reveals, cross-fades | Compositor-friendly; cheapest INP |
| **View Transitions (same-document)** | Route and world changes, Four Worlds overlay | Baseline across all four engines; near-zero bundle |
| **GSAP + ScrollTrigger** | Midnight Rodeo pinning, contact-sheet eruption | Needs pinning and progress callbacks — CSS scroll-driven animation provides neither and is Baseline **Limited** (no Firefox) |
| **Native video** | Ignition, buckle sequence, camera passage, campaign film | Deterministic, non-branching, universally supported, colour-managed |
| **Canvas 2D** | Frame-sequence scrub, if one survives | ≤ 60 frames, ≤ 80 KB/frame |
| **Three.js (lazy)** | Product Anatomy only, behind explicit user action | The one surface where 3D delivers information a photograph cannot |
| **Static imagery** | Every Tier 0 equivalent | A fallback that needs a GPU is not a fallback |

`RECOMMENDATION` — Do **not** adopt a smooth-scroll library. Nothing in the corpus requires
one, and the dominant library ships zero `matchMedia` calls — meaning reduced-motion users
are scroll-jacked by default.

---

## 6. Motion rules this audit recommends

1. **Interactive motion ≤ 400 ms.** 66 current values exceed it.
2. **Two easing curves.** 13 currently exist. Entrance `cubic-bezier(0.16, 1, 0.3, 1)` is
   already shared across V3 and V3.1 — adopt it.
3. **No wheel interception.** Native scroll position only.
4. **Every sequence > 5 s carries a visible pause/stop/hide.** The buckle sequence is
   7.1 s.
5. **Reduced motion removes uninitiated motion and keeps interaction responsive.** Never
   downgrade to a plain grid on the basis of a health setting.
6. **No overshoot easing** (`Back.*`) anywhere in a reduced-motion path.
7. **No blocking animation on any path to product.**
8. **Every sequence is interruptible**, and browser Back exits rather than replays.
