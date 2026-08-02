---
name: Modern Frontier
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#7b563d'
  on-secondary: '#ffffff'
  secondary-container: '#ffcdad'
  on-secondary-container: '#7a553c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f0207'
  on-tertiary-container: '#c66867'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#edbd9d'
  on-secondary-fixed: '#2e1503'
  on-secondary-fixed-variant: '#613f27'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#3f0207'
  on-tertiary-fixed-variant: '#7a2d2e'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display-xl:
    fontFamily: Libre Caslon Text
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 90px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 38px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  ui-button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system establishes a visual language called "Modern Frontier." It moves away from rustic clichés toward a high-fashion, cinematic interpretation of Western heritage. The objective is to merge the rugged utility of the frontier with the precision of a modern editorial house.

The style is characterized by **Sophisticated Minimalism** with a **Tactile** edge. It utilizes generous whitespace to elevate products to the status of art, while subtle grain textures provide a sense of material honesty. Layouts are inspired by high-end print magazines, favoring asymmetrical balance and large-scale imagery. The emotional response should be one of quiet confidence, premium quality, and timelessness.

## Colors

The palette is grounded in the organic tones of the American West but executed with a high-fashion lens.

- **Ink Black (#0A0A0A):** Used for primary typography and deep structural elements. It provides the "ink on paper" editorial feel.
- **Bone White (#F5F2EE):** The primary canvas. It is warmer than pure white, providing a sophisticated, slightly aged paper quality.
- **Tobacco Leather (#734F36):** Used for tactile accents, CTAs, and signaling premium craftsmanship.
- **Rust Red (#8B3A3A):** A high-contrast accent color used sparingly for notifications, sale markers, or critical calls to action.
- **Indigo & Silver:** Utility colors used for denim-related features and metallic hardware iconography.

Apply a subtle, low-opacity monochromatic noise overlay (2-3%) across all background surfaces to simulate the texture of high-grade paper or fine-grain leather.

## Typography

The typographic hierarchy relies on the tension between the classicism of **Libre Caslon Text** and the functional precision of **Inter**.

**Editorial Headers:** Use Libre Caslon Text for all headlines. Use the display sizes for hero sections with tight tracking to create a "Vogue-style" impact. 

**UI & Body:** Use Inter for all functional elements. Body copy should be set with generous line-height to maintain legibility against the textured backgrounds. Use the `label-caps` style for category markers and secondary navigation to provide a clean, modern contrast to the serif headlines.

## Layout & Spacing

The layout follows a **Fixed Grid** system for desktop, centered within the viewport to maintain a gallery-like feel.

- **Desktop (1440px):** 12-column grid, 24px gutters, 64px outer margins.
- **Mobile:** 4-column grid, 16px gutters, 20px outer margins.

The spacing rhythm is intentionally spacious. "Section Gaps" of 120px or more are encouraged between major content blocks to create "Cinematic Scale." Avoid crowding elements; allow the Bone White background to act as a frame for the product photography.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

- **Navigation:** The primary header uses a "Backdrop Blur" effect (20px blur) with a 70% opacity Bone White tint. This allows the cinematic product photography to bleed behind the UI.
- **Overlays:** Use high-contrast outlines (1px solid Ink Black at 10% opacity) for cards and modals.
- **Shadows:** When necessary for functional depth (e.g., a floating Cart drawer), use an "Ambient Shadow": `0 20px 40px rgba(10, 10, 10, 0.05)`. It should be almost imperceptible, providing lift without visual weight.

## Shapes

The design system utilizes **Sharp (0px)** corners for all structural elements, buttons, and product cards. This geometric precision communicates a modern, architectural, and high-fashion aesthetic. 

The only exception to the sharp-edge rule is the "Pearl Snap" hardware elements, which are perfectly circular to mimic the functional snap-buttons of Western shirting.

## Components

**The Pearl Snap Toggle:** A custom UI switch for settings. The track is a thin 1px Ink Black outline. The "thumb" is a high-gloss, domed white circle with a subtle silver metallic rim, mimicking a mother-of-pearl snap.

**Experience Selector:** A segmented control allowing users to toggle between:
- *Cinema:* Full-bleed video/image backgrounds with minimal UI.
- *Balanced:* Standard editorial shopping.
- *Instant Shop:* High-density grid for power users.

**Editorial Product Cards:** 
- No borders. 
- Image aspect ratio 4:5. 
- Product name in Inter Medium, Price in Libre Caslon Italic. 
- Hover state: Subtle zoom on the image with a Tobacco Leather "Quick Add" button appearing at the bottom.

**Product Anatomy Cards:** Specialized blocks in product descriptions that show macro-photography of materials (denim twill, leather grain). These cards feature a "Spec Label" using the `label-caps` typography style.

**Buttons:** 
- *Primary:* Solid Ink Black, white Inter text, sharp corners, 0.05em letter spacing.
- *Secondary:* 1px Ink Black border, no fill, sharp corners.

**Inputs:** Bottom-border only (1px Ink Black) to maintain the minimalist, high-end stationery feel.