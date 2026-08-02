# L&B Frontier House V3.1: Engineering Handoff (Updated)

## 3D Asset Requirements
- **FrontierThread:** Procedural glowing line (Three.js LineSegments).
- **ImpossibleWarehouse:** Modular structural kit.
- **BuckleAperture:** 5-layer mechanical GLB. Layers: (1) Outer Engraved Ring, (2) Leather Inlay, (3) Denim Ring, (4) Operational Routing Plate, (5) Aperture Blades.

## Motion Tokens
| Name | Duration | Easing | Trigger |
| :--- | :--- | :--- | :--- |
| **T1_Stitch** | 2400ms | Custom Bezier | Page Load |
| **T2_Unfold** | 1800ms | Expo.out | Stitch Complete |
| **T3_Aperture** | 1200ms | Back.inOut | User Click/Approach |
| **T4_Ring_Sep** | 1000ms | Power2.inOut | Category Hover |
| **T5_Passage** | 800ms | Expo.in | Selection Confirmed |

## Layer Ownership
- **Tier 1 (DOM):** Navigation labels, CTAs, Experience Selector.
- **Tier 2 (Shader):** Thread glow, Portal energy, Material iridescence.
- **Tier 3 (Three.js):** Warehouse, Buckle Aperture, Category Orbs.
