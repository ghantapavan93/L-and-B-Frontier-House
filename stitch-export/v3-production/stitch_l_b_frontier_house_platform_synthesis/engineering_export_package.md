# Engineering Export Package: L&B Frontier House

## 1. Prototype Map
- **Ignition** (Frame 1) -> **Contact Sheet** (Frame 2) [Trigger: ENTER THE FRONTIER]
- **Contact Sheet** (Frame 2) -> **Shoppable Film** (Frame 4) [Trigger: BECOME FILM]
- **Shoppable Film** (Frame 4) -> **Built by You Gateway** (Frame 5) [Trigger: Hotspot/CTA]
- **Gateway** (Frame 5) -> **Custom Atelier** (Frame 9) [Trigger: ENTER STUDIO]

## 2. Interaction Matrix
| Component | Desktop | Mobile | Instant Shop Fallback |
| :--- | :--- | :--- | :--- |
| ExperienceSelector | Toggle (Hover+Click) | Swiper | Static Badge |
| LivingContactSheet | Spatial Grid (GSAP) | Vertical Stack | Single Image |
| ProductHotspot | Silver Ring (Pulse) | Tappable Dot | Static Label |

## 3. Reference Validation Audit
- **Drop Edition:** Validated via Frame 6 (Flagship Homepage) image scale and typography interaction.
- **Aigle RainPack:** Validated via Frame 10 (Product Anatomy) exploding layers.
- **Hotel Jägerhof:** Validated via transition between Frame 2 and Frame 3 (Image to Film).
- **Oflyn/Nike:** Validated via Frame 9 (Atelier) guided config flow.
- **Talia:** Validated via Frame 11 (Wholesale) pack-breakdown logic.

## 4. Accessibility Requirements
- **Contrast:** AA/AAA compliance for Bone White on Ink Black.
- **Reduced Motion:** Global `prefers-reduced-motion` listener to disable WebGL and scrubbed video.
- **Focus States:** 2px solid Oxidized Silver rings for all keyboard navigation.
