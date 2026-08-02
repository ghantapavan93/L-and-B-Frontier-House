# V3.1 Prototype QA & Route Map

## 1. Interaction Mapping
- **Desktop:** `Wheel/Scroll` maps to Camera Z-axis. `Click` on categories triggers Aperture Lock.
- **Mobile:** `Horizontal Swipe` on Depth Carousel. `Tap` to enter collection.
- **Global:** `Skip Intro` always routes to `S08` (Contact Sheet).

## 2. QA Report (V3.1 Alpha)
- **[High] Performance Risk:** Mobile WebGL initialization on older devices during S12D (Ring Opening). *Mitigation: Delay initialization until S12E.*
- **[Medium] Visual Contrast:** "Bone White" typography on "Electric Cobalt" transition light requires AA check.
- **[Medium] Continuity:** Transition between S04 (Warehouse) and S05 (Buckle) needs smoother easing to avoid "pop."
- **[Low] UI Clipping:** Menu overlap on 13" laptops during "Category Orbit" state.

## 3. Route & State Manifest
- **Cinema Start:** {{DATA:SCREEN:SCREEN_38}}
- **Buckle Portal:** {{DATA:SCREEN:SCREEN_34}}
- **Warehouse Passage:** {{DATA:SCREEN:SCREEN_23}}
- **Mobile Carousel:** {{DATA:SCREEN:SCREEN_14}}
- **Commerce Arrival:** {{DATA:SCREEN:SCREEN_9}}
- **Fallback:** {{DATA:SCREEN:SCREEN_5}}
