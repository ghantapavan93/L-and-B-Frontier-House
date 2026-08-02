# V3.1 Final Export Manifest

## 1. Required Geometry (GLB)
- `Frontier_Thread_V3_1.glb` (Spline path)
- `Buckle_Aperture_V3_1.glb` (5-Ring Mechanical)
- `Warehouse_Kit_V3_1.glb` (Modular rails/frames)

## 2. Required Shaders
- `Frontier_Thread_Ignition.glsl` (Flowing neon)
- `Buckle_Edge_Fresnel.glsl` (Metallic iridescence)
- `Warehouse_Atmo_Fog.glsl` (Volumetric light)

## 3. UI Layer Stack
- **Top:** Navigation, Mode Selector, Skip Intro (DOM/CSS)
- **Middle:** 3D Scene / Video (WebGL/Video)
- **Bottom:** Background atmospheric gradient (CSS)

## 4. Final Prototype Frame Recommendations
1. **Cinema Path:** SCREEN_38 -> SCREEN_37 -> SCREEN_34 -> SCREEN_25 -> SCREEN_24 -> SCREEN_20 -> SCREEN_22
2. **Mobile Path:** SCREEN_19 -> SCREEN_17 -> SCREEN_18 -> SCREEN_16 -> SCREEN_14 -> SCREEN_10 -> SCREEN_9
3. **Fallback Path:** SCREEN_5 -> SCREEN_7
