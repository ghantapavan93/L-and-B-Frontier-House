# L&B Frontier House V3.1: Motion & Asset Manifest

## 3D Asset Requirements
- **FrontierThread:** Procedural glowing line (Three.js LineSegments).
- **ImpossibleWarehouse:** Modular structural kit (Brushed Metal rails, Glass panels, Floating Racks).
- **BuckleAperture:** Multi-ring mechanical buckle (Tooled Leather, Oxidized Copper, Silver).
- **CategoryOrbs:** Material-based spheres (Indigo Denim weave, Flowing Silk scarf, Reflective Tumbler).

## Motion Tokens
| Name | Duration | Easing | Trigger |
| :--- | :--- | :--- | :--- |
| **T1_Stitch** | 2400ms | Custom Bezier(0.16, 1, 0.3, 1) | Page Load |
| **T2_Unfold** | 1800ms | Expo.out | Stitch Complete |
| **T3_Aperture** | 1200ms | Back.inOut | User Click/Approach |
| **T4_Erupt** | 800ms | Power4.out | Portal Entry |

## Media production Brief
- **Media_01:** Hero Film (Cinematic grain, 24fps, Dallas Night + Ranch Dusk).
- **Media_02:** Denim Macro (8K texture scan, shifting light).
- **Media_03:** Wholesale Distribution (Blurred motion, warm workshop light).

## Technical Layer Ownership
- **Tier 1 (CSS/GSAP):** Global Nav, UI Overlays, Labels.
- **Tier 2 (Shader):** Background atmospheric light, Thread glow.
- **Tier 3 (Three.js):** Impossible Warehouse, Buckle Aperture, Category Orbitals.
- **Tier 4 (Video):** Campaign film, Shoppable hotspots.