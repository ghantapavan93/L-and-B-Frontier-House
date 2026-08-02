---
name: Modern Frontier V2
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
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
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 60px
    fontWeight: '400'
    lineHeight: 68px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  button-text:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style
The design system embodies the intersection of rugged Western heritage and high-fashion minimalism. It serves a discerning audience that values artisanal quality, from bespoke leatherwork to heavy-denim craftsmanship. 

The visual style is **Cinematic Luxury**. It leverages high-contrast editorial layouts, expansive whitespace, and sophisticated materiality. The interface should feel like a premium digital gallery where the product is the protagonist. Motion is intentional, utilizing "Garment Portal" transitions that mimic the slow, weighted movement of high-end fabrics. 

The emotional response is one of "Grounded Elegance"—the reliability of the frontier distilled into a world-class digital experience.

## Colors
The palette is rooted in the natural materials of the frontier. 
- **Ink Black (#0A0A0A)** and **Deep Charcoal (#181818)** provide a heavy, cinematic foundation for text and backgrounds.
- **Bone White (#F5F2EE)** serves as the primary canvas, offering a warm, paper-like alternative to stark white.
- **Tobacco Leather** and **Dark Denim Indigo** are reserved for functional accents, call-to-actions, and status indicators, grounding the digital interface in physical materiality.
- **Oxidized Silver** is used for hairline borders and interactive icons, referencing pearl-snap buttons and silver hardware.
- **Controlled Rust Red** is a high-alert or limited-edition indicator, used sparingly to maintain its impact.

## Typography
The typographic hierarchy relies on the tension between the romantic **Playfair Display** (Serif) and the technical **Chivo** (Sans-Serif). 

- **Display & Headlines:** Use Playfair Display for editorial impact. Large scales should utilize tight letter-spacing to emphasize the high-contrast strokes of the letterforms.
- **Body:** Chivo provides a precise, modern contrast. It ensures high legibility for product descriptions and technical specifications.
- **Labels & Data:** JetBrains Mono is introduced for specialized indicators (wholesale-pack, custom dimensions) to provide a "manifest" or "ledger" feel, evoking the utilitarian side of the frontier.

## Layout & Spacing
The system uses a **Fixed Grid** for desktop (12 columns) and a **Fluid Grid** for mobile (4 columns). 

- **Experience Selector Integration:** The persistent selector sits at the top-center or bottom-center, isolated by significant whitespace to maintain its role as a primary navigational toggle.
- **Vertical Rhythm:** Large-scale "Cinema" mode utilizes full-height viewport sections. "Balanced" mode uses standard 80px - 120px section padding to allow for rhythmic scrolling.
- **Mobile:** Adheres to a native-first philosophy. All primary CTAs are within the "thumb zone" (bottom 30% of the screen) using gesture-based interactions for gallery swiping.

## Elevation & Depth
Depth in this design system is achieved through **Materiality and Tonal Layers** rather than traditional shadows.

- **The Garment Portal:** Transitions between pages should feel like "opening" a fold of fabric, using subtle grain overlays (denim/leather textures) during the animation.
- **Surface Tiers:** Backgrounds are primarily Bone White. Overlays (modals, menus) use Ink Black with a slight grain texture and no blur, creating a sharp, structural hierarchy.
- **Silver Reflections:** Interactive elements use high-gloss silver gradients to simulate metallic hardware, providing a tactile "click" sensation.

## Shapes
The shape language is **Sharp (0)**. 

To maintain the high-fashion editorial aesthetic, all buttons, input fields, and product cards utilize 90-degree angles. The only exception to this rule is the **Pearl-Snap UI**, which uses perfect circles (rounded-full) for toggle indicators and specific small-scale action buttons, mimicking the physical silver snaps on a western shirt.

## Components
- **Experience Selector:** A tripartite segmented control (Cinema | Balanced | Instant). The active state is indicated by a "Silver Pearl" snap icon.
- **Top Navigation:** Transparent by default, snapping to an Ink Black solid background on scroll. Links are in `label-caps` typography.
- **Product Cards:** Minimalist frames with no borders. On hover, the image subtlely zooms (1.05x) and "Quick Add" buttons appear in Oxidized Silver. Specialized indicators (Custom/Wholesale) appear as small monospaced tags in the top-right corner.
- **Gateways (Split-Universe):** Full-screen vertical splits. Each side (e.g., For Her vs For Him) uses a high-contrast image with a center-aligned `display-lg` headline.
- **Pearl-Snap Buttons:** Primary buttons are rectangular (Ink Black) with a single Silver Pearl icon on the far left or right of the label text.
- **Input Fields:** Bottom-border only (1px Oxidized Silver) with `label-caps` floating labels to maintain a clean, architectural look.