# L&B Frontier House V3.1: Inner Frontier Camera Passage Specification

## 1. Narrative Intent: "The Operational Descent"
The Camera Passage is the definitive immersive bridge. It transforms the Belt Buckle Aperture from a decorative object into an architectural environment, visually proving the brand's thesis: *The operation powers the fashion world.*

## 2. Journey Stages (Motion Sequence)
| Stage | Name | Scroll Range | Description |
| :--- | :--- | :--- | :--- |
| **01** | Selection Lock | 0 - 10% | Selected category (Accessories & Home) highlights; Aperture rings align and 'click' with haptic visual cue. |
| **02** | Scaling Expansion | 10 - 30% | Buckle rings expand beyond viewport; Metal becomes girders, Leather becomes walls, Denim becomes the ground plane. |
| **03** | Macro Passage | 30 - 50% | High-detail fly-through of material layers (Engraved silver, tooled leather, indigo fibers). |
| **04** | Warehouse Emergence | 50 - 70% | Engraved lines manifest as 3D warehouse aisles, floating rails, and suspended garment frames. |
| **05** | Runway Resolve | 70 - 90% | Central warehouse aisle flattens and transforms into a fashion runway; Editorial frames align. |
| **06** | Contact Sheet Landing | 90 - 100% | 3D space resolves into the 2D Living Contact Sheet (Modern Frontier V3). |

## 3. Technical Layer Ownership
- **Tier 4 (Three.js):** Geometry for the 5 rings, warehouse rails, product orbs, and camera FOV manipulation.
- **Tier 3 (Shader):** Iridescent material shifts during passage; "Electric Cobalt" routing line illumination.
- **Tier 1 (DOM/GSAP):** Persistent navigation, category labels, Skip Intro, and the final transition into commerce UI.

## 4. Camera Specification
- **Path:** Linear Z-axis penetration with subtle Y-axis tilt (parabolic).
- **Field of View (FOV):** 35° (Starting) → 95° (Macro Passage) → 45° (Landing).
- **Easing:** `expo.inOut` for the initial plunge; `power2.out` for the landing resolution.

## 5. Performance & Accessibility
- **Reduced Motion:** Replace camera fly-through with a 3-stage high-fidelity crossfade (Buckle -> Material Macro -> Contact Sheet).
- **Balanced Mode:** Compresses the 100% scroll journey into a 3.5s automated sequence.
- **Instant Shop:** Bypasses WebGL entirely; immediate cross-fade to static collection poster.

## 6. Conceptual Product Placeholders (NOT VERIFIED)
- **Accessories & Home World:** Suspended frames containing a Tooled Silver Buckle, Indigo Selvedge Blanket, and reflective Copper Tumbler.
