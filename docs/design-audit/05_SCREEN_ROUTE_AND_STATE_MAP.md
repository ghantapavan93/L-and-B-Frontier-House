# 05 — Screen, Route and State Map

**Purpose:** classify every exported screen as route / section / state / overlay /
transition, and record what the source claims versus what it delivers.
**Nothing here is an approved route tree.** It is a reading of the design sources.

---

## 1. Classification key

| Class | Meaning |
| :--- | :--- |
| **ROUTE** | Deserves a URL. Must stand alone — most traffic arrives mid-journey |
| **SECTION** | A region within a route |
| **STATE** | A variant of a route (loading, reduced-motion, unauthenticated, fallback) |
| **OVERLAY** | Dismissible layer above a route; must not own a URL alone |
| **TRANSITION** | Motion between two of the above; not addressable |

---

## 2. V3 platform

| Frame | Class | Delivered | Notes |
| :--- | :--- | :--- | :--- |
| 1 Cinematic Ignition | ROUTE `/` + first-visit OVERLAY | Static + working shader | Must never repeat for returning buyers |
| 2 Living Contact Sheet | ROUTE `/drop` | Static | Best-evidenced surface; maps to the real daily drop cadence |
| 3 Image Becomes Film | **TRANSITION** | Conceptual | No `<video>` exists |
| 4 Shoppable Film | ROUTE `/film/{slug}` | Conceptual | No `<video>`, no `<track>` |
| 5 One West, Four Worlds | **OVERLAY** | Static | Has a `close` control — confirms overlay, not route |
| 6 Flagship Homepage | ROUTE `/` | Static | Carries nav, merchandising, SEO |
| 7 Midnight Rodeo | ROUTE `/campaign/{slug}` + pinned SECTIONS | Partially functional | Real `scene-1/2/3` JS |
| 8 Garment Portal & Anatomy | ROUTE `/product/{slug}` + OVERLAY | Static | Named GLB missing |
| 9 Custom Atelier | ROUTE `/atelier` | Static | **0 forms, 0 inputs** |
| 10 Living Cart & Passport | ROUTE `/cart`, `/passport` | Static | Consumer concept — blocked on OQ-01 |
| 11 Wholesale & Owner World | **AUTHENTICATED ROUTE** `/trade/*` | Static | No auth, no forms, no pack logic |
| 12 Native Mobile | ROUTE set | Static | Superseded by V3.1 Module 04 |
| Connected Prototype | Demonstration | **Partially functional** | 4 screens only |

`MEASURED` — `engineering_export_package.md` documents **four** transitions:
1→2, 2→4, 4→5, 5→9. **Frames 3, 6, 7, 8, 10, 11, 12 have no documented entry or exit.**

---

## 3. V3.1 supplement

| Frame | Class | Delivered |
| :--- | :--- | :--- |
| `3` Cinematic Ignition | ROUTE `/` (Cinema mode) | Static |
| `5` Impossible Frontier Engine Reveal | SECTION | Static |
| `8` Belt Buckle Aperture | **Technical design board — not a screen** | Documentation |
| `8b`–`8f` Dormant → Category Orbit | **STATES** of one object | Static keyframes |
| `8g_1,2,4,6,8` Camera Passage | **TRANSITION keyframes** | Static; 3 of 8 steps never exported |
| `12a`–`12k` Mobile | Mixed ROUTE / STATE | Static |
| `12i` Mode Selector | **OVERLAY** | Static |
| `12j` Reduced Motion | **STATE** | Static |
| `12k` Fallback States | **STATE** | Static |
| Desktop / Mobile Prototype Hubs | Demonstration | Static |

`OBSERVED` — Frame `8` is titled *"STUDY V3.1 — TECHNICAL DESIGN BOARD"* and its hero
region is an empty black rectangle labelled *"FRAME 08: CINEMATIC DARKNESS / TRANSITION
STATE 1-8"*. **It documents the buckle; it is not the buckle experience.**

---

## 4. The route map does not resolve

`MEASURED` — `v3_1_route_and_state_map.md` §3 and `v3_1_export_manifest.md` §4 reference
screens as unsubstituted template variables — `{{DATA:SCREEN:SCREEN_38}}`,
`SCREEN_37`, `SCREEN_34`, `SCREEN_25`, `SCREEN_24`, `SCREEN_23`, `SCREEN_22`, `SCREEN_20`,
`SCREEN_19`, `SCREEN_18`, `SCREEN_17`, `SCREEN_16`, `SCREEN_14`, `SCREEN_10`, `SCREEN_9`,
`SCREEN_7`, `SCREEN_5`.

**No `SCREEN_n` identifier maps to any file on disk.** The intended sequences are legible;
the mapping is not. Conflict **C-10**.

---

## 5. Reconstructed intent

`INFERRED` — Reading the manifests as narrative rather than as addresses:

**Cinema (desktop):** Ignition → Engine Reveal → Buckle Aperture → Camera Passage →
Warehouse → Runway → Contact Sheet → Commerce
**Mobile:** Poster load → Thread ignition → Seal reveal → Ring opening → Depth stack →
Carousel → Contact sheet → Commerce
**Fallback:** Static poster → Catalogue

`OBSERVED` — `Skip Intro` always routes to the Contact Sheet. **This is the correct escape
hatch** and satisfies `CLAUDE.md` §11's one-action exit — provided it is visible from the
first frame and keyboard-reachable.

---

## 6. Structural gaps

`INFERRED` — Not designed anywhere in V3 or V3.1:

- Search results · Category/collection listing with filters · Sort
- Buyer registration, login, pending-approval, rejected
- Cart with pack quantities and minimum progress
- Order history / reorder
- Size guide, fit content
- Pre-order state
- 404, 500, offline, empty-filter results
- Cookie consent, privacy surfaces

`INFERRED` — The exports cover the **cinematic and editorial** surfaces thoroughly and the
**transactional and administrative** surfaces barely. That is the expected output of a
design tool, and it is the largest single scope item for any implementation plan.
