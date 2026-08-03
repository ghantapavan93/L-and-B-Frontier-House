# Buckle proof — Pass 2 refinement

Same pipeline and commands as `proof-run-2026-08-03.md`. Silhouette unchanged and
still passing (w −0.025%, h −0.085%). Geometry 43,863 polys. Samples raised
128 → 256; renders ~10–13 s each.

## What changed, against the six requested priorities

**1 · Richer metals.** Silver and copper each gained three things flat metal lacks:
roughness that varies across the surface (a coarse patch noise blended with a
stretched brush noise, remapped to 0.28–0.62 for silver, 0.24–0.66 for copper),
a directional brush and microscratch pair in the normal, and radial anisotropy.
The silver ramp was re-biased cool (`#100f0f` → `#38383a` → `#81828a`) — a
warm-leaning grey turns brass under a 3200 K key, which is the fastest way to
lose "darkened silver". Copper's recess stop now carries the verdigris.

**2 · Premium leather.** Three scales of relief at once: ~0.55 mm smooth-Voronoi
pebble grain, fine pores, and broad burnishing. Roughness varies 0.34–0.68 with
the grain (polished on the raised cells, matt in the valleys), sheen raised to
0.55, and a little subsurface for the warm translucency leather has. Grain drives
the *normal* strongly and the *albedo* only faintly — driving colour hard off the
cell texture reads as dirt at this scale.

**3 · Monogram presence.** Emission 5.0 → 9.0, plus a wider, far dimmer
transparent-to-emissive halo sheath (`engraving_inlay_halo`, shadow-disabled)
that supplies the near-field diffusion a real light guide throws into its own
channel. A Fog Glow compositor pass adds the bloom in linear space before AgX —
composited, never baked, as specified.

**4 · Cinematic contrast.** Key narrowed to 0.28 × 0.025 m and brought in close
(0.145 m) at the same ~15° rake, so inverse-square falloff drops the ground to
black a few centimetres past the buckle; a distant light of equal angle lights the
whole ground evenly instead. Rim shrunk to 0.022 m for a defined edge rather than
a gradient. Fill effectively off (0.012 W).

**5 · Turquoise as stone.** Sized to the brief exactly — `radiusUnits` *is* the
stone radius, so E/W are 3.1 mm and N/S 2.5 mm (they were 18% undersized). Dark
matrix veining, cloudy internal colour drift, subsurface, and a full polished coat
at 0.04 roughness for a small hard specular.

**6 · Depth and mood.** Denim specular cut to 0.12 — a near-black albedo alone
does not make a dark ground, because the default dielectric lobe still returns a
broad warm sheen that lifts the whole field to mid-grey. That was the actual cause
of the washed background, not the albedo. Vignette re-shaped via ramp positions
(the spherical gradient is linear in radius, so positions place the indigo, not the
mapping scale). Depth of field added: ¾ hero f/4, macro f/5.6, aperture f/4.5.

Aperture camera also re-framed — closer (2.55 BW), lower, 8° off axis, 42 mm — so
the parted halves get perspective and the dark opening becomes the subject rather
than the diagram.

## Two corrections worth recording

- The first glare attempt used threshold 0.55, which hazed the entire frame and
  destroyed exactly the contrast it was added to support. Threshold must sit above
  the lit metal (2.4) so only the emissive inlay clears it.
- Blender 5.x has no `scene.node_tree` and no `CompositorNodeComposite`. The
  compositor is a node group on `scene.compositing_node_group` terminating in a
  `NodeGroupOutput`, and Glare is entirely socket-driven (`Type`, `Threshold`,
  `Strength`, `Size`, `Saturation` are inputs, not properties).

## Still deferred to the final master

Tooling is procedural grain, not 8C's floral scrollwork (sculpt task) · engraving
channel is a displacement carve, not a boolean (needed for clean GLB export) ·
back face flat, not the specified 1.5% dome · animation clips not baked · no
textures, no GLB.
