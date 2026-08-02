# L&B Frontier House: Modern Frontier V3 Design System

## Brand Principles
- **Cinematic Western Craftsmanship:** The intersection of authentic frontier heritage and elite digital interaction.
- **Material Intimacy:** Use of hard directional light and high-resolution textures (denim, leather, silver) to evoke physical quality.
- **Editorial Fluidity:** Typography and imagery behave as architectural layers, creating depth and discovery.

## Color Tokens
- **Ink Black:** `#0A0A0A` (Primary Background)
- **Bone White:** `#F5F2EE` (Primary Text/Surface)
- **Tobacco Leather:** `#734F36` (Warm Accent)
- **Sandstone:** `#D9C5B2` (Secondary Surface)
- **Dark Denim Indigo:** `#1B2B45` (Material Context)
- **Oxidized Silver:** `#A7A6A2` (Hardware/UI Accents)
- **Rust Red:** `#7E241F` (Controlled Action Accent)

## Typography Tokens
- **Display Serif:** Playfair Display (Substitute for high-contrast editorial)
- **UI Sans:** Inter (Substitute for precision modern grotesk)
- **Hierarchy:**
  - `text-display-lg`: 140px (Hero Headlines)
  - `text-headline-xl`: 96px (Campaign Titles)
  - `text-body-md`: 16px (Standard Commerce Copy)

## Component Inventory
- **CinematicHero:** Full-bleed WebGL/Video container with layered typography.
- **ExperienceSelector:** Custom silver toggle for Cinema/Balanced/Instant modes.
- **LivingContactSheet:** Nine-grid spatial erupted gallery.
- **GarmentPortal:** Texture-based full-page transition mask.
- **ProductAnatomy:** Exploded view of garment layers (Hardware, Stitching, Fabric).
- **CustomAtelier:** Bespoke configuration studio with human-review status.

## Motion Specification
- **Eruption (T1):** Duration 800ms, Cubic-Bezier(0.16, 1, 0.3, 1). Trigger: Scroll/Enter.
- **Time Tunnel (T2):** Parallel scale-down of previous scene while next scene enters at z+10.
- **Reduced Motion:** All transitions replaced with 400ms opacity crossfades.

## Asset Manifest
- `hero_still_01.png`: 1440x900, Poster for Video.
- `midnight_pearl_snap_3D.glb`: 3D object for Anatomy.
- `denim_texture_grain.jpg`: 512x512 tileable, Overlay.
