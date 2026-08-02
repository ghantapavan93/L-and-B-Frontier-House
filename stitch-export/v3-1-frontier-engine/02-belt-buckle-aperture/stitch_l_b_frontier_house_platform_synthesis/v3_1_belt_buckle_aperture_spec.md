# L&B Frontier House V3.1: The Belt Buckle Aperture Specification

## 1. Object Identity
The Aperture is a contemporary reinterpretation of a sculptural Western belt buckle, serving as a mechanical portal into the brand's operating world.

### Materials
- **Base:** Brushed Silver with Oxidized Copper accents.
- **Inlay:** Dark Indigo Selvedge Denim and Tooled Leather.
- **Center:** Prismatic Glass/Aperture blades in Gunmetal.
- **Accents:** Restrained Mineral Turquoise and Bone Enamel.

## 2. Narrative Geometry
The engravings on the buckle face represent the L&B chain:
- **Textile:** Vertical loom-inspired hatch marks.
- **Design:** Geometric pattern-drafting vectors.
- **Manufacturing:** High-tension stitch paths.
- **Warehouse:** Radial aisle routing lines.
- **Distribution:** Kinetic flow arrows.
- **Boutique/Customer:** High-polish contact points.

## 3. Transformation States (Motion Spec)
| State | Name | Duration | Description |
| :--- | :--- | :--- | :--- |
| **S1** | Dormant | - | Near-black. Single silver edge highlight. |
| **S2** | Reveal | 1200ms | Light sweep across leather/metal textures. |
| **S3** | Lock | 800ms | L&B mark settles with mechanical 'click' haptic. |
| **S4** | Activate | 1500ms | Engraved routing lines illuminate (Electric Cobalt). |
| **S5** | Separate | 1000ms | Buckle splits into 5 concentric rings. |
| **S6** | Orbit | 600ms | Category markers appear (Women, Plus, etc). |
| **S7** | Portal | 1200ms | Aperture opens; Warehouse Rails become visible. |
| **S8** | Passage | 800ms | Camera Z-axis fly-through into Frontier World. |

## 4. Technical Implementation
- **Renderer:** Three.js / WebGL.
- **Geometry:** Modular GLB (5 concentric rings).
- **Shaders:** Fresnel edge glow, Iridescent material shift, Luminous thread path.
- **Accessibility:** Semantic HTML overlay for all category labels (Skip Intro, navigation).
- **Reduced Motion:** Replace 3D flight with high-fidelity crossfades between key states.
