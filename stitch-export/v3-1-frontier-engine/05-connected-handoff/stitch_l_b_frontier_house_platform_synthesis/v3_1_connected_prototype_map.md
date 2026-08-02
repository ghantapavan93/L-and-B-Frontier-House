# V3.1 Connected Prototype Map: The Frontier Engine

## 1. Journey Architecture
The prototype connects the "Impossible Warehouse" narrative (Thread to Trade) into the Modern Frontier V3 commerce system.

### Desktop Paths
- **Cinema Mode:** Full 21-step journey (Thread -> Blueprint -> Engine -> Buckle -> Passage -> Runway -> Contact Sheet).
- **Balanced Mode:** Compressed 10-step journey (Poster -> Fast Thread -> Aperture Separation -> Contact Sheet).
- **Instant Shop:** 2-step journey (Hero Poster -> Category Grid).

### Mobile Paths
- **Native Experience:** 15-step touch-safe journey (Ignition -> Seal Reveal -> Depth Carousel -> Landing).
- **Reduced Motion:** 6-step crossfade journey (Static Poster -> Category Cards -> Contact Sheet).

## 2. Global State Map
| State ID | Frame Name | Trigger | Destination |
| :--- | :--- | :--- | :--- |
| **S01** | Poster Load | On Load | S02 (Ignition) or S15 (Instant) |
| **S02** | Thread Ignition | S01 Complete | S03 (Blueprint) |
| **S04** | Frontier Engine | S03 Complete | S05 (Buckle Orbit) |
| **S05** | Aperture Lock | Category Click | S06 (Passage) |
| **S06** | Camera Passage | S05 Complete | S07 (Runway) |
| **S08** | Contact Sheet | S07 Complete | S09 (Product/Commerce) |

## 3. Experience Mode Matrix
| Feature | Cinema | Balanced | Instant |
| :--- | :--- | :--- | :--- |
| **Intro Length** | ~12s | ~4s | 0s |
| **3D Rendering** | High Detail | Optimized | Static Fallback |
| **Camera** | Continuous Path | Short Snap | None |
| **Nav Visibility** | Delayed/Progressive | Immediate | Constant |

## 4. Connection Points (V3.1 to V3)
- **V3.1 Frame 8G-8 (Contact Sheet Landing)** maps directly to **V3 Frame 2 (Living Contact Sheet Eruption)**.
- **V3.1 Frame 12H (Mobile Arrival)** maps to **V3 Frame 12 (Mobile Cinematic Commerce)**.
