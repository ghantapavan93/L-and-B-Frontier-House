# L&B Frontier House V3.1: Native Mobile Depth Carousel Specification

## 1. Narrative Intent: "The Portable Frontier"
The mobile experience is a tactile adaptation of the Frontier Engine. It replaces the vast spatial camera travel of the desktop with a depth-carousel that feels like a living fashion object in the hand.

## 2. Interaction Model: "The Depth Carousel"
- **Primary Gesture:** Horizontal Swipe.
- **Visual Logic:** Layered 2.5D planes.
- **Physics:** Snap-to-center with elastic inertia.
- **Visual Weight:** Current item is at Z:0, Previous/Next items are at Z:-10 and partially desaturated.

## 3. Experience Progression
| Frame | Stage | Goal | Key Visual |
| :--- | :--- | :--- | :--- |
| **12A** | Poster Load | Immediate Utility | High-contrast identity, Mode Selector. |
| **12B** | Thread Ignition | Brand Spark | Single luminous line (Electric Cobalt). |
| **12C** | Seal Reveal | Material Authority | Macro textures of Leather, Metal, Denim. |
| **12D** | Ring Opening | Portal Activation | 3 concentric rings expanding vertically. |
| **12F** | Depth Carousel | Navigation | Swipeable world cards (Women, Plus, etc). |
| **12G** | Grid Resolve | Commerce Landing | Resolve into Living Contact Sheet. |

## 4. Performance Strategy
- **Poster-First:** Render the hero still and HTML UI before initializing WebGL.
- **Delayed enhancement:** Load low-res textures first, swap for high-res once 3D is idle.
- **Limited Geometry:** Max 15k polygons for the 3D Seal.
- **Capped Resolution:** 0.85x pixel ratio for mobile GPUs.

## 5. Accessibility & Fallbacks
- **Reduced Motion:** Replace all camera/depth motion with 400ms opacity crossfades.
- **WebGL Failure:** High-fidelity pre-rendered posters (AVIF/WebP) with static HTML links.
- **Touch Safe:** Minimum 44px tap targets; thumb-safe bottom navigation.

## 6. Component Mapping
- **MobileHero:** Vertical cinematic video/still.
- **DepthCarousel:** JS-driven layered plane swiper.
- **ModeToggle:** Segmented control overlay.
- **CommerceGrid:** 2-column editorial grid.