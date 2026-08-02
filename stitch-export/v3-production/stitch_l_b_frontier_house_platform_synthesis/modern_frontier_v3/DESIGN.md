---
name: Modern Frontier V3
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfdb'
  on-secondary-container: '#636260'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0a1c35'
  on-tertiary-container: '#7584a3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e5e2de'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1c1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#b7c7e8'
  on-tertiary-fixed: '#0a1c35'
  on-tertiary-fixed-variant: '#384763'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 90px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  ui-button:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system embodies "Cinematic Western Craftsmanship"—a sophisticated synthesis of rugged durability and high-fashion editorial precision. It avoids the kitsch of the "Old West" in favor of a modern, tactile luxury that prioritizes raw materiality and expansive spatial layouts.

The visual direction combines **Minimalism** with **Tactile Materiality**. The UI should feel like a premium leather-bound lookbook or a high-end bespoke atelier digital storefront. Expect heavy use of whitespace to signify "luxury," punctuated by dense, high-contrast typography and micro-textures reminiscent of denim weaves and brushed silver.

**Emotional Response:**
*   **Rugged Authenticity:** Trustworthy, sturdy, and time-tested.
*   **Editorial Elegance:** Controlled, curated, and exclusive.
*   **Spatial Depth:** Immersive and cinematic transitions.

## Colors
The palette is grounded in the high-contrast relationship between **Ink Black** and **Bone White**. This creates an editorial foundation that allows the secondary "materials" to provide warmth and depth.

*   **Ink Black (#0A0A0A):** Used for primary text, deep backgrounds, and heavy structural elements.
*   **Bone White (#F5F2EE):** The primary canvas color. It is warmer than pure white, suggesting natural parchment or light-washed stone.
*   **Dark Denim (#1B2B45):** A deep, structural blue used for interactive states or secondary containers.
*   **Tobacco (#734F36) & Sandstone (#D9C5B2):** Organic warmth, used for leather-like accents, dividers, and focus states.
*   **Oxidized Silver (#A7A6A2):** Used for "hardware" elements like icons, borders, and metallic-style buttons.
*   **Rust Red (#7E241F):** A highly controlled functional color for errors, alerts, or singular "hero" call-to-actions.

## Typography
The typography system relies on the tension between the dramatic, high-contrast serifs of **Playfair Display** and the clinical, modern precision of **Hanken Grotesk**.

*   **Display & Headlines:** Use Playfair Display for narrative moments, product titles, and editorial headers. Large sizes should use negative letter-spacing to enhance the "luxury magazine" feel.
*   **Body Copy:** Use Hanken Grotesk for readability. It provides a "technical" counterpoint to the romantic serif, ensuring the UI feels modern and functional.
*   **Labels:** All-caps Hanken Grotesk with wide tracking is used for category labels, metadata, and small navigational cues.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to mimic the wide-open horizons of the frontier. 

*   **The 12-Column System:** Desktop layouts utilize 12 columns with wide 64px outer margins to create an "isolated" luxury feel.
*   **Rhythm:** Spacing is based on an 8px scale. Use large gaps (80px, 120px, 160px) between major sections to allow the brand photography and typography to breathe.
*   **Asymmetry:** Occasionally break the grid with offset images or floating "hardware" elements (icons) to add a sense of bespoke craftsmanship.

## Elevation & Depth
Elevation in this design system is not achieved through generic shadows, but through **Tonal Layering** and **Materiality**.

*   **Stacked Vellum:** Use subtle, low-opacity Bone White overlays on top of images to create depth without blurring.
*   **Metallic Highlights:** Elements like buttons or active tabs utilize thin, 1px **Oxidized Silver** borders that catch light, suggesting the edge of a metal snap or buckle.
*   **Soft Grounding:** When shadows are required, use "Ambient Shadows"—extremely soft, large-radius blurs with a Tobacco (#734F36) tint at 5% opacity to ground elements in a warm, natural way.
*   **Recessed Wells:** Input fields and secondary containers should appear "stamped" into the surface using a subtle inner border of Sandstone.

## Shapes
The shape language is disciplined and "Soft" (0.25rem). While organic materials like leather are soft, the craftsmanship is precise.

*   **Standard Radius:** 4px (Soft) for buttons and inputs, providing just enough edge-softening to feel premium without losing structural integrity.
*   **Large Containers:** Use 8px (rounded-lg) for cards or large sections to suggest the gentle bend of heavy-duty denim or thick leather.
*   **No Circular UI:** Avoid pills or circles unless they represent literal "hardware" (e.g., radio buttons as metal snaps).

## Components
Consistent styling of core elements to maintain the "Modern Frontier" aesthetic:

*   **Buttons:** 
    *   *Primary:* Solid Ink Black with Bone White text. Sharp, 4px corners. 
    *   *Secondary:* Oxidized Silver border (1px) with Tobacco-tinted text on hover.
    *   *Ghost:* Underlined text in Playfair Display for "Editorial" links.
*   **Cards:** 
    *   Full-bleed imagery with typography overlaid on a subtle gradient or "Vellum" (Bone White at 80%) container.
    *   1px Sandstone border for card definitions on lighter backgrounds.
*   **Input Fields:** 
    *   Minimalist design. No full background; only a bottom border in Sandstone that transitions to Ink Black on focus. 
    *   Labels use the "label-caps" typographic style.
*   **Chips/Tags:** 
    *   Styled to look like leather patches or denim labels. Use Sandstone background with Tobacco text and a "stitched" 1px dashed border.
*   **Navigation:** 
    *   Top-tier navigation is sparse and centered, using Hanken Grotesk. Hover states should include a slow, spatial "ink-bleed" underline.