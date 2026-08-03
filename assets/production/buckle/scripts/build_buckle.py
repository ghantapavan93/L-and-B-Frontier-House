"""L&B buckle master builder — Blender 5.x, headless.

Builds the scalloped rectangular buckle from the canonical SVG paths shipped in
src/ui/frontier-ignition.tsx (snapshotted in ../source/canonical-paths.json).
The paths are IMPORTED via a deterministic parser — never redrawn. Authority:
docs/assets/LB_BUCKLE_3D_PRODUCTION_BRIEF.md, Stitch V3.1 Frames 8B/8C.

Stages (pass after `--` on the Blender command line):
  --stage build                  build scene, save blender/lb-buckle-master.blend
  --stage proof --which <name>   render one proof: front | three_quarter |
                                 illuminated | aperture   (open the master first)
  --stage overlay                silhouette overlay render + numeric deviation

Example:
  blender -b -P build_buckle.py -- --stage build
  blender -b ../blender/lb-buckle-master.blend -P build_buckle.py -- --stage proof --which front

Explicitly rejected, per the brief §6: circular/coin geometry, sheriff-badge
styling, rifle-scope motifs, any invented date (EST. 1865, 1870s), automotive
imagery, invented longhorn artwork. validate() enforces the name-level part.
"""

import bpy
import bmesh
import json
import math
import os
import re
import sys
import time

from mathutils import Euler, Vector

# --------------------------------------------------------------------------- paths

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, os.pardir))
SOURCE_DIR = os.path.join(ROOT, "source")
BLEND_PATH = os.path.join(ROOT, "blender", "lb-buckle-master.blend")
PREVIEWS_DIR = os.path.join(ROOT, "renders", "previews")
EXPORTS_DIR = os.path.join(ROOT, "exports")
LOGS_DIR = os.path.join(ROOT, "logs")

DELIVERY = {"landscape": "desktop", "mobile": "mobile"}

# ------------------------------------------------------------------ canonical truth

with open(os.path.join(SOURCE_DIR, "canonical-paths.json"), "r", encoding="utf-8") as fh:
    CANON = json.load(fh)

# Metres per proof unit: silhouette spans 296 units = 92 mm.
UNIT = 0.092 / 296.0
BW = 0.092                       # buckle width, metres — camera distances are in BW
SVG_CX, SVG_CY = 160.0, 120.0    # viewBox centre → world origin

# z architecture (metres). Plate front face is z = 0; the buckle lies face-up
# on the denim ground, cameras look down -Z.
PLATE_DEPTH = 0.0065             # 7% of width
CHAMFER_W = 0.0037               # 4% of width, front rim
COPPER_TOP = 0.0015              # copper step raised above plate face
LEATHER_TOP = COPPER_TOP - 0.00184   # leather recessed 2% of width below the step
CHANNEL_DEPTH = 0.0009           # engraving cut into leather, 1% of width
INLAY_R = 0.0002                 # 0.4 mm round-profile light guide
DENIM_Z = -PLATE_DEPTH - 0.0001

STATE_FRAMES = {"dormant": 1, "illuminated": 10, "aperture": 20, "routing": 30}

# Aperture depth ladder, in buckle-widths along Z. The brief fixes the lateral
# travel (55%) and the outward yaw (6 deg); what it leaves open is depth, and
# depth is the whole difference between a parting artifact and three coplanar
# shapes. The halves come toward camera as they swing out, the monogram plate
# sinks into a well behind them, and the denim drops far enough that the key's
# inverse-square falloff turns the gap into a genuine void — which also quiets
# the seam-stitch rectangle, since it is parented to the denim.
APERTURE_HALF_X = 0.55
APERTURE_HALF_Z = 0.15
APERTURE_CORE_Z = -0.55
# Far enough to read as a void, near enough to still catch the halves' shadows.
# Pushed further than this the gap goes black but the occlusion cues go with it,
# and occlusion is what actually sells the separation.
APERTURE_DENIM_Z = -0.9
APERTURE_YAW_DEG = 6.0

FORBIDDEN_NAMES = ["1865", "1870", "badge", "sheriff", "coin", "reticle",
                   "scope", "longhorn", "skull", "engine", "piston", "truck"]

MATERIAL_NAMES = ["rim_silver", "frame_copper", "inset_leather", "backing_denim",
                  "stitch_thread", "stone_turquoise", "stud_brass", "engraving_inlay"]


def log(msg):
    print("[lb-buckle] " + msg, flush=True)


# ------------------------------------------------------------------- SVG path input
#
# The canonical paths use only absolute M / L / Q / C / Z commands, so a small
# exact parser keeps the import dependency-free and byte-deterministic.

def parse_path(d):
    # command letters may be glued to their first coordinate ("M42 30")
    tokens = re.findall(r"[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?", d)
    subpaths, current, i = [], [], 0
    pos = (0.0, 0.0)

    def flt(k):
        return float(tokens[k])

    while i < len(tokens):
        cmd = tokens[i]
        if cmd == "M":
            if current:
                subpaths.append({"points": current, "closed": False})
            pos = (flt(i + 1), flt(i + 2))
            current = [pos]
            i += 3
        elif cmd == "L":
            pos = (flt(i + 1), flt(i + 2))
            current.append(pos)
            i += 3
        elif cmd == "Q":
            c = (flt(i + 1), flt(i + 2))
            e = (flt(i + 3), flt(i + 4))
            for s in range(1, 15):
                t = s / 14.0
                mt = 1.0 - t
                current.append((mt * mt * pos[0] + 2 * mt * t * c[0] + t * t * e[0],
                                mt * mt * pos[1] + 2 * mt * t * c[1] + t * t * e[1]))
            pos = e
            i += 5
        elif cmd == "C":
            c1 = (flt(i + 1), flt(i + 2))
            c2 = (flt(i + 3), flt(i + 4))
            e = (flt(i + 5), flt(i + 6))
            for s in range(1, 19):
                t = s / 18.0
                mt = 1.0 - t
                current.append((mt ** 3 * pos[0] + 3 * mt * mt * t * c1[0]
                                + 3 * mt * t * t * c2[0] + t ** 3 * e[0],
                                mt ** 3 * pos[1] + 3 * mt * mt * t * c1[1]
                                + 3 * mt * t * t * c2[1] + t ** 3 * e[1]))
            pos = e
            i += 7
        elif cmd == "Z":
            subpaths.append({"points": current, "closed": True})
            current = []
            i += 1
        else:
            raise ValueError("unsupported path command: " + cmd)
    if current:
        subpaths.append({"points": current, "closed": False})
    return subpaths


def to_world(pt):
    return ((pt[0] - SVG_CX) * UNIT, (SVG_CY - pt[1]) * UNIT)


def world_path(d):
    return [{"points": [to_world(p) for p in sp["points"]], "closed": sp["closed"]}
            for sp in parse_path(d)]


def resample(points, step, closed, count=None):
    """Uniform arc-length resample of a 2D polyline."""
    pts = points + [points[0]] if closed else points
    lengths, total = [0.0], 0.0
    for a, b in zip(pts, pts[1:]):
        total += math.hypot(b[0] - a[0], b[1] - a[1])
        lengths.append(total)
    n = count if count else max(8, int(round(total / step)))
    out, k = [], 0
    for s in range(n if closed else n + 1):
        target = total * s / n
        while k < len(lengths) - 2 and lengths[k + 1] < target:
            k += 1
        seg = lengths[k + 1] - lengths[k]
        t = (target - lengths[k]) / seg if seg > 0 else 0.0
        a, b = pts[k], pts[k + 1]
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out, total


def offset_inward(points, dist):
    """Offset a closed CCW/CW polygon toward its interior by dist."""
    n = len(points)
    area = sum(points[i][0] * points[(i + 1) % n][1]
               - points[(i + 1) % n][0] * points[i][1] for i in range(n))
    sign = 1.0 if area > 0 else -1.0
    out = []
    for i in range(n):
        px, py = points[(i - 1) % n]
        cx, cy = points[i]
        nx_, ny_ = points[(i + 1) % n]
        tx, ty = nx_ - px, ny_ - py
        ln = math.hypot(tx, ty) or 1.0
        # interior is on the left of travel for CCW polygons
        ox, oy = -ty / ln * sign, tx / ln * sign
        out.append((cx + ox * dist, cy + oy * dist))
    return out


def rounded_rect(x0, y0, x1, y1, r, step=1.6):
    """Closed rounded-rect outline in SVG units, sampled clockwise."""
    pts = []

    def arc(cx, cy, a0, a1):
        steps = 10
        for s in range(steps + 1):
            a = math.radians(a0 + (a1 - a0) * s / steps)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))

    arc(x0 + r, y0 + r, 180, 270)
    arc(x1 - r, y0 + r, 270, 360)
    arc(x1 - r, y1 - r, 0, 90)
    arc(x0 + r, y1 - r, 90, 180)
    return pts


# ---------------------------------------------------------------- object utilities

def new_object(name, bm, collection, material, smooth=False):
    mesh = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    if material:
        obj.data.materials.append(material)
    if smooth:
        for poly in mesh.polygons:
            poly.use_smooth = True
    return obj


def tube_from_polyline(name, pts3, radius, collection, material):
    """Round-profile tube along a 3D polyline, as a curve object."""
    curve = bpy.data.curves.new(name, type="CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 6
    curve.resolution_u = 2
    curve.use_fill_caps = True
    for pts in pts3:
        spline = curve.splines.new("POLY")
        spline.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            spline.points[i].co = (p[0], p[1], p[2], 1.0)
    obj = bpy.data.objects.new(name, curve)
    collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


# ------------------------------------------------------------------------ materials

def _set_input(node, names, value):
    for n in names:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return
    log("WARN principled input missing: " + "/".join(names))


def _principled(mat):
    mat.use_nodes = True
    tree = mat.node_tree
    bsdf = tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = tree.nodes.new("ShaderNodeBsdfPrincipled")
        tree.links.new(bsdf.outputs[0], tree.nodes["Material Output"].inputs["Surface"])
    return tree, bsdf


def _pointiness_ramp(tree, stops):
    """Curvature-driven colour: recess -> flat -> struck edge."""
    geo = tree.nodes.new("ShaderNodeNewGeometry")
    ramp = tree.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.44
    ramp.color_ramp.elements[0].color = stops[0] + (1.0,)
    ramp.color_ramp.elements[1].position = 0.56
    ramp.color_ramp.elements[1].color = stops[-1] + (1.0,)
    if len(stops) == 3:
        mid = ramp.color_ramp.elements.new(0.5)
        mid.color = stops[1] + (1.0,)
    tree.links.new(geo.outputs["Pointiness"], ramp.inputs["Fac"])
    return ramp


def _noise(tree, scale, detail=6.0, roughness=0.5, distortion=0.0, stretch=None):
    """Object-space noise, optionally stretched into directional streaks."""
    n = tree.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = roughness
    n.inputs["Distortion"].default_value = distortion
    texco = tree.nodes.new("ShaderNodeTexCoord")
    if stretch:
        mapping = tree.nodes.new("ShaderNodeMapping")
        mapping.inputs["Scale"].default_value = stretch
        tree.links.new(texco.outputs["Object"], mapping.inputs["Vector"])
        tree.links.new(mapping.outputs["Vector"], n.inputs["Vector"])
    else:
        tree.links.new(texco.outputs["Object"], n.inputs["Vector"])
    return n


def _blend(tree, a_out, b_out, weight):
    """weight*a + (1-weight)*b, as float math."""
    ma = tree.nodes.new("ShaderNodeMath")
    ma.operation = "MULTIPLY"
    ma.inputs[1].default_value = weight
    tree.links.new(a_out, ma.inputs[0])
    mb = tree.nodes.new("ShaderNodeMath")
    mb.operation = "MULTIPLY"
    mb.inputs[1].default_value = 1.0 - weight
    tree.links.new(b_out, mb.inputs[0])
    add = tree.nodes.new("ShaderNodeMath")
    add.operation = "ADD"
    tree.links.new(ma.outputs[0], add.inputs[0])
    tree.links.new(mb.outputs[0], add.inputs[1])
    return add.outputs[0]


def _remap(tree, src, lo, hi):
    m = tree.nodes.new("ShaderNodeMapRange")
    m.inputs["From Min"].default_value = 0.0
    m.inputs["From Max"].default_value = 1.0
    m.inputs["To Min"].default_value = lo
    m.inputs["To Max"].default_value = hi
    tree.links.new(src, m.inputs["Value"])
    return m.outputs[0]


def _bump(tree, height_out, strength, distance, parent_normal=None):
    b = tree.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = strength
    b.inputs["Distance"].default_value = distance
    tree.links.new(height_out, b.inputs["Height"])
    if parent_normal:
        tree.links.new(parent_normal, b.inputs["Normal"])
    return b.outputs["Normal"]


def _radial_tangent(tree, bsdf):
    """Spun/brushed tangent for anisotropic metal. No UVs needed."""
    tan = tree.nodes.new("ShaderNodeTangent")
    tan.direction_type = "RADIAL"
    tan.axis = "Z"
    if "Tangent" in bsdf.inputs:
        tree.links.new(tan.outputs["Tangent"], bsdf.inputs["Tangent"])


def hexc(h):
    h = h.lstrip("#")
    # sRGB hex -> linear, which is what Principled Base Color expects
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(h[i:i + 2], 16)) for i in (0, 2, 4))


def build_materials():
    mats = {}

    # Darkened brushed silver. Three things stop metal reading as plastic:
    # roughness that varies across the surface, a directional brush in the
    # normal, and curvature that actually darkens the recesses.
    m = bpy.data.materials.new("rim_silver")
    tree, bsdf = _principled(m)
    # Cool-biased greys throughout: a warm-leaning silver turns brass under the
    # 3200K key, which is the single fastest way to lose "darkened silver".
    ramp = _pointiness_ramp(tree, (hexc("100f0f"), hexc("38383a"), hexc("81828a")))
    tree.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    _set_input(bsdf, ["Metallic"], 1.0)
    patch = _noise(tree, 55.0, detail=4.0)
    brush = _noise(tree, 620.0, detail=2.0, stretch=(1.0, 34.0, 1.0))
    tree.links.new(_remap(tree, _blend(tree, brush.outputs["Fac"],
                                       patch.outputs["Fac"], 0.62), 0.28, 0.62),
                   bsdf.inputs["Roughness"])
    scratch = _noise(tree, 2400.0, detail=2.0, stretch=(1.0, 60.0, 1.0))
    tree.links.new(_bump(tree, brush.outputs["Fac"], 0.12, 0.00004,
                         parent_normal=_bump(tree, scratch.outputs["Fac"],
                                             0.08, 0.00002)),
                   bsdf.inputs["Normal"])
    _set_input(bsdf, ["Anisotropic"], 0.62)
    _radial_tangent(tree, bsdf)
    mats["rim_silver"] = m

    # Oxidized copper: worn bright on the struck edges, sunk dark and faintly
    # verdigris in the recesses. Verdigris stays under the brief's 3% by living
    # only at the very bottom of the curvature ramp.
    m = bpy.data.materials.new("frame_copper")
    tree, bsdf = _principled(m)
    ramp = _pointiness_ramp(tree, (hexc("2f3b30"), hexc("6e4226"), hexc("e0a271")))
    tree.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    _set_input(bsdf, ["Metallic"], 1.0)
    patina = _noise(tree, 140.0, detail=6.0, distortion=1.2)
    grain = _noise(tree, 1500.0, detail=3.0)
    tree.links.new(_remap(tree, _blend(tree, patina.outputs["Fac"],
                                       grain.outputs["Fac"], 0.7), 0.24, 0.66),
                   bsdf.inputs["Roughness"])
    tree.links.new(_bump(tree, patina.outputs["Fac"], 0.16, 0.00006),
                   bsdf.inputs["Normal"])
    _set_input(bsdf, ["Anisotropic"], 0.3)
    _radial_tangent(tree, bsdf)
    mats["frame_copper"] = m

    # Tooled chestnut leather. The premium cue is three scales of relief at once:
    # pebble grain, fine pores, and broad burnishing where a hand would wear it.
    # No words and no motifs — real tooled scrollwork is a final-master sculpt.
    m = bpy.data.materials.new("inset_leather")
    tree, bsdf = _principled(m)
    _set_input(bsdf, ["Metallic"], 0.0)
    _set_input(bsdf, ["Sheen Weight", "Sheen"], 0.55)
    _set_input(bsdf, ["Sheen Roughness"], 0.3)
    _set_input(bsdf, ["Subsurface Weight", "Subsurface"], 0.08)
    _set_input(bsdf, ["Subsurface Radius"], (0.004, 0.0018, 0.001))

    # ~0.55 mm cells. Coarser than this and the grain reads as orange peel.
    pebble = tree.nodes.new("ShaderNodeTexVoronoi")
    pebble.feature = "SMOOTH_F1"
    pebble.inputs["Scale"].default_value = 1800.0
    if "Smoothness" in pebble.inputs:
        pebble.inputs["Smoothness"].default_value = 0.85
    texco = tree.nodes.new("ShaderNodeTexCoord")
    tree.links.new(texco.outputs["Object"], pebble.inputs["Vector"])
    pores = _noise(tree, 2600.0, detail=3.0)
    burnish = _noise(tree, 26.0, detail=5.0, distortion=0.6)

    # Colour: chestnut, deepened in the grain valleys, warmed where burnished.
    tone = tree.nodes.new("ShaderNodeValToRGB")
    tone.color_ramp.elements[0].position = 0.25
    tone.color_ramp.elements[0].color = hexc("3d2216") + (1.0,)
    tone.color_ramp.elements[1].position = 0.8
    tone.color_ramp.elements[1].color = hexc("5c3c25") + (1.0,)
    mid = tone.color_ramp.elements.new(0.5)
    mid.color = hexc("5a3a24") + (1.0,)
    # Grain belongs in the normal, not the albedo: driving colour hard off the
    # cell texture reads as dirt at this scale. Broad burnishing carries the
    # tone; the pebble only tints it.
    tree.links.new(_blend(tree, pebble.outputs["Distance"],
                          burnish.outputs["Fac"], 0.22), tone.inputs["Fac"])
    tree.links.new(tone.outputs["Color"], bsdf.inputs["Base Color"])

    # Wax sheen breaks up: polished on the raised grain, matt in the valleys.
    tree.links.new(_remap(tree, _blend(tree, burnish.outputs["Fac"],
                                       pebble.outputs["Distance"], 0.6),
                          0.34, 0.68),
                   bsdf.inputs["Roughness"])
    tree.links.new(
        _bump(tree, pebble.outputs["Distance"], 0.35, 0.00012,
              parent_normal=_bump(tree, pores.outputs["Fac"], 0.18, 0.00004)),
        bsdf.inputs["Normal"])
    mats["inset_leather"] = m

    m = bpy.data.materials.new("backing_denim")
    tree, bsdf = _principled(m)
    _set_input(bsdf, ["Metallic"], 0.0)
    _set_input(bsdf, ["Roughness"], 0.92)
    # A near-black albedo alone does not make a dark ground: the default
    # dielectric specular lobe still returns a broad warm sheen under the key,
    # and that sheen is what was lifting the whole field to mid-grey.
    _set_input(bsdf, ["Specular IOR Level", "Specular"], 0.12)
    texco = tree.nodes.new("ShaderNodeTexCoord")
    # indigo gradient along Y, vignetting to near-black away from the buckle
    grad = tree.nodes.new("ShaderNodeTexGradient")
    grad.gradient_type = "SPHERICAL"
    mapn = tree.nodes.new("ShaderNodeMapping")
    mapn.inputs["Scale"].default_value = (9.1, 9.1, 9.1)
    tree.links.new(texco.outputs["Object"], mapn.inputs["Vector"])
    tree.links.new(mapn.outputs["Vector"], grad.inputs["Vector"])
    # Tight vignette: indigo only immediately around the buckle, falling to the
    # near-black field of 8B well before the frame edge. This is what buys the
    # object its separation — the ground stops competing with it.
    # The spherical gradient is linear in radius, so the ramp positions — not
    # the mapping scale — are what place the indigo. Indigo reaches roughly the
    # buckle's own footprint and is gone by the frame edge.
    vign = tree.nodes.new("ShaderNodeValToRGB")
    vign.color_ramp.interpolation = "EASE"
    vign.color_ramp.elements[0].position = 0.04
    vign.color_ramp.elements[0].color = hexc("050506") + (1.0,)
    vign.color_ramp.elements[1].position = 0.72
    vign.color_ramp.elements[1].color = hexc("22344f") + (1.0,)
    tree.links.new(grad.outputs["Fac"], vign.inputs["Fac"])
    tree.links.new(vign.outputs["Color"], bsdf.inputs["Base Color"])
    # 3/1 twill: two crossed wave textures driving bump
    wave = tree.nodes.new("ShaderNodeTexWave")
    wave.inputs["Scale"].default_value = 900.0
    wave.inputs["Distortion"].default_value = 1.2
    wmap = tree.nodes.new("ShaderNodeMapping")
    wmap.inputs["Rotation"].default_value = (0.0, 0.0, math.radians(63.0))
    tree.links.new(texco.outputs["Object"], wmap.inputs["Vector"])
    tree.links.new(wmap.outputs["Vector"], wave.inputs["Vector"])
    wbump = tree.nodes.new("ShaderNodeBump")
    wbump.inputs["Strength"].default_value = 0.35
    wbump.inputs["Distance"].default_value = 0.0003
    tree.links.new(wave.outputs["Fac"], wbump.inputs["Height"])
    tree.links.new(wbump.outputs["Normal"], bsdf.inputs["Normal"])
    mats["backing_denim"] = m

    m = bpy.data.materials.new("stitch_thread")
    tree, bsdf = _principled(m)
    _set_input(bsdf, ["Base Color"], hexc("d9c5b2") + (1.0,))
    _set_input(bsdf, ["Roughness"], 0.6)
    _set_input(bsdf, ["Sheen Weight", "Sheen"], 0.4)
    mats["stitch_thread"] = m

    # Turquoise cabochons. Real stone reads through three cues the flat version
    # lacked: dark matrix veining, cloudy colour drift within the body, and a
    # hard polished coat that returns a small sharp specular.
    m = bpy.data.materials.new("stone_turquoise")
    tree, bsdf = _principled(m)
    voro = tree.nodes.new("ShaderNodeTexVoronoi")
    voro.feature = "DISTANCE_TO_EDGE"
    voro.inputs["Scale"].default_value = 620.0
    texco = tree.nodes.new("ShaderNodeTexCoord")
    tree.links.new(texco.outputs["Object"], voro.inputs["Vector"])
    vramp = tree.nodes.new("ShaderNodeValToRGB")
    vramp.color_ramp.elements[0].position = 0.0
    vramp.color_ramp.elements[0].color = hexc("140f0c") + (1.0,)   # matrix
    vramp.color_ramp.elements[1].position = 0.05
    vramp.color_ramp.elements[1].color = hexc("2f7d78") + (1.0,)
    tree.links.new(voro.outputs["Distance"], vramp.inputs["Fac"])

    # Cloudy body: pale sky-green through deeper teal, mottled inside the stone.
    cloud = _noise(tree, 320.0, detail=5.0, distortion=1.4)
    body = tree.nodes.new("ShaderNodeValToRGB")
    body.color_ramp.elements[0].position = 0.3
    body.color_ramp.elements[0].color = hexc("2b6f6d") + (1.0,)
    body.color_ramp.elements[1].position = 0.72
    body.color_ramp.elements[1].color = hexc("7ec9c0") + (1.0,)
    tree.links.new(cloud.outputs["Fac"], body.inputs["Fac"])
    blend = tree.nodes.new("ShaderNodeMix")
    blend.data_type = "RGBA"
    # ShaderNodeMix exposes one socket per data type under the same names, so
    # colour sockets must be addressed by index: 6 = A, 7 = B, output 2 = Result.
    blend.inputs[0].default_value = 0.55
    tree.links.new(vramp.outputs["Color"], blend.inputs[6])
    tree.links.new(body.outputs["Color"], blend.inputs[7])

    # Rim light #9adbd4 lifting the stone edge away from its bezel.
    lw = tree.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.28
    rim_mix = tree.nodes.new("ShaderNodeMix")
    rim_mix.data_type = "RGBA"
    rim_mix.inputs[7].default_value = hexc("9adbd4") + (1.0,)
    tree.links.new(blend.outputs[2], rim_mix.inputs[6])
    tree.links.new(lw.outputs["Facing"], rim_mix.inputs[0])
    tree.links.new(rim_mix.outputs[2], bsdf.inputs["Base Color"])

    tree.links.new(_remap(tree, cloud.outputs["Fac"], 0.09, 0.26),
                   bsdf.inputs["Roughness"])
    _set_input(bsdf, ["Coat Weight", "Clearcoat"], 1.0)
    _set_input(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.04)
    _set_input(bsdf, ["Subsurface Weight", "Subsurface"], 0.22)
    _set_input(bsdf, ["Subsurface Radius"], (0.0012, 0.002, 0.002))
    tree.links.new(_bump(tree, voro.outputs["Distance"], 0.25, 0.00003),
                   bsdf.inputs["Normal"])
    mats["stone_turquoise"] = m

    m = bpy.data.materials.new("stud_brass")
    tree, bsdf = _principled(m)
    _set_input(bsdf, ["Base Color"], hexc("b08d57") + (1.0,))
    _set_input(bsdf, ["Metallic"], 1.0)
    _set_input(bsdf, ["Roughness"], 0.45)
    mats["stud_brass"] = m

    # Luminous fibre: dormant black lacquer <-> emissive core, switched by the
    # "illum" value node, which the state keyframes drive.
    m = bpy.data.materials.new("engraving_inlay")
    m.use_nodes = True
    tree = m.node_tree
    out = tree.nodes["Material Output"]
    old = tree.nodes.get("Principled BSDF")
    if old:
        tree.nodes.remove(old)
    lacquer = tree.nodes.new("ShaderNodeBsdfPrincipled")
    _set_input(lacquer, ["Base Color"], (0.008, 0.008, 0.009, 1.0))
    _set_input(lacquer, ["Roughness"], 0.25)
    _set_input(lacquer, ["Coat Weight", "Clearcoat"], 0.8)
    emit = tree.nodes.new("ShaderNodeEmission")
    lw = tree.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.4
    cmix = tree.nodes.new("ShaderNodeMix")
    cmix.data_type = "RGBA"
    cmix.inputs[6].default_value = hexc("7fe0d6") + (1.0,)   # core
    cmix.inputs[7].default_value = hexc("d6fff9") + (1.0,)   # peak
    tree.links.new(lw.outputs["Facing"], cmix.inputs[0])
    tree.links.new(cmix.outputs[2], emit.inputs["Color"])
    # AgX desaturates a hot emitter toward white, so presence is bought with a
    # darker surround and composited glare — not by pushing strength until the
    # turquoise identity burns out. This sits just under that threshold.
    emit.inputs["Strength"].default_value = 9.0
    illum = tree.nodes.new("ShaderNodeValue")
    illum.name = illum.label = "illum"
    illum.outputs[0].default_value = 1.0
    shader_mix = tree.nodes.new("ShaderNodeMixShader")
    tree.links.new(illum.outputs[0], shader_mix.inputs["Fac"])
    tree.links.new(lacquer.outputs[0], shader_mix.inputs[1])
    tree.links.new(emit.outputs[0], shader_mix.inputs[2])
    tree.links.new(shader_mix.outputs[0], out.inputs["Surface"])
    mats["engraving_inlay"] = m

    # The halo sheath: transparent when dormant, a faint turquoise diffusion
    # when lit. Shadowless and non-occluding so it can only add light.
    h = bpy.data.materials.new("engraving_inlay_halo")
    h.use_nodes = True
    htree = h.node_tree
    hout = htree.nodes["Material Output"]
    old = htree.nodes.get("Principled BSDF")
    if old:
        htree.nodes.remove(old)
    transp = htree.nodes.new("ShaderNodeBsdfTransparent")
    hemit = htree.nodes.new("ShaderNodeEmission")
    hemit.inputs["Color"].default_value = hexc("7fe0d6") + (1.0,)
    hemit.inputs["Strength"].default_value = 1.6
    hillum = htree.nodes.new("ShaderNodeValue")
    hillum.name = hillum.label = "illum"
    hillum.outputs[0].default_value = 1.0
    scale = htree.nodes.new("ShaderNodeMath")
    scale.operation = "MULTIPLY"
    scale.inputs[1].default_value = 0.4
    htree.links.new(hillum.outputs[0], scale.inputs[0])
    hmix = htree.nodes.new("ShaderNodeMixShader")
    htree.links.new(scale.outputs[0], hmix.inputs["Fac"])
    htree.links.new(transp.outputs[0], hmix.inputs[1])
    htree.links.new(hemit.outputs[0], hmix.inputs[2])
    htree.links.new(hmix.outputs[0], hout.inputs["Surface"])
    mats["engraving_inlay_halo"] = h

    return mats


# ------------------------------------------------------------------------- geometry

def build_plate(collection, mat, outline_w):
    """Silhouette plate as a RING — canonical outline outside, the canonical
    copper line inside — so the central field is a real open recess for the
    leather inset, never a buried surface. 6.5 mm deep, chamfered front rim."""
    inner_w = [to_world(p) for p in
               parse_path(CANON["paths"]["copperFrame"]["d"])[0]["points"]]
    n = 380
    outer, _ = resample(outline_w, 0.0, closed=True, count=n)
    inner, _ = resample(inner_w, 0.0, closed=True, count=n)
    bm = bmesh.new()
    o0 = [bm.verts.new((p[0], p[1], 0.0)) for p in outer]
    i0 = [bm.verts.new((p[0], p[1], 0.0)) for p in inner]
    o1 = [bm.verts.new((p[0], p[1], -PLATE_DEPTH)) for p in outer]
    i1 = [bm.verts.new((p[0], p[1], -PLATE_DEPTH)) for p in inner]
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((o0[i], o0[j], i0[j], i0[i]))       # front ring face
        bm.faces.new((o1[j], i1[j], i1[i], o1[i]))       # back ring face
        bm.faces.new((o0[j], o0[i], o1[i], o1[j]))       # outer wall
        bm.faces.new((i0[i], i0[j], i1[j], i1[i]))       # inner wall
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    oset = set(o0)
    top_edges = [e for e in bm.edges
                 if e.verts[0] in oset and e.verts[1] in oset]
    bmesh.ops.bevel(bm, geom=top_edges, offset=CHAMFER_W, segments=4,
                    profile=0.62, affect="EDGES", clamp_overlap=True)
    return new_object("plate_silver", bm, collection, mat)


def build_rope(collection, mat, outline_w):
    """Rope-twist rim: 3-lobe section swept with continuous twist, 1.2 mm pitch.
    The rope is inset from the silhouette so relief never changes the outline."""
    path, total = resample(offset_inward(outline_w, 0.0032), 0.0003, closed=True)
    lobe_period = 0.0036          # 3 lobes x 1.2 mm strand pitch
    r_tube = 0.00105
    z_center = 0.0008
    section_n = 10
    bm = bmesh.new()
    rings = []
    arc = 0.0
    n = len(path)
    # quantise total twist to whole lobe periods so the seam closes cleanly
    turns = max(1, round(total / lobe_period))
    for i in range(n):
        if i > 0:
            a, b = path[i - 1], path[i]
            arc += math.hypot(b[0] - a[0], b[1] - a[1])
        cx, cy = path[i]
        nx_, ny_ = path[(i + 1) % n]
        px_, py_ = path[(i - 1) % n]
        tx, ty = nx_ - px_, ny_ - py_
        ln = math.hypot(tx, ty) or 1.0
        # in-plane normal to the path; section spans (normal, +Z)
        ox, oy = -ty / ln, tx / ln
        phase = 2.0 * math.pi * turns * (arc / total)
        ring = []
        for k in range(section_n):
            a = 2.0 * math.pi * k / section_n
            rr = r_tube * (1.0 + 0.26 * math.cos(3.0 * (a + phase)))
            ring.append(bm.verts.new((cx + ox * rr * math.cos(a),
                                      cy + oy * rr * math.cos(a),
                                      z_center + rr * math.sin(a))))
        rings.append(ring)
    for i in range(n):
        r0, r1 = rings[i], rings[(i + 1) % n]
        for k in range(section_n):
            bm.faces.new((r0[k], r0[(k + 1) % section_n],
                          r1[(k + 1) % section_n], r1[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object("rim_rope", bm, collection, mat, smooth=True)


def build_copper(collection, mat):
    """Raised copper step: the canonical inner rounded-rect, extruded with a
    struck 30-degree chamfer on both top edges."""
    outer_sp = world_path(CANON["paths"]["copperFrame"]["d"])[0]
    outer, _ = resample(outer_sp["points"], 0.0008, closed=True)
    band_half = 0.0011
    cham = 0.0006
    loops = [
        (offset_inward(outer, -band_half), 0.0009),
        (offset_inward(outer, -band_half + cham), COPPER_TOP),
        (offset_inward(outer, band_half - cham), COPPER_TOP),
        (offset_inward(outer, band_half), 0.0009),
    ]
    bm = bmesh.new()
    rings = [[bm.verts.new((p[0], p[1], z)) for p in pts] for pts, z in loops]
    n = len(outer)
    for r0, r1 in zip(rings, rings[1:]):
        for i in range(n):
            bm.faces.new((r0[i], r0[(i + 1) % n], r1[(i + 1) % n], r1[i]))
    # outer and inner walls down to the plate face
    base_out = [bm.verts.new((p[0], p[1], 0.0)) for p in loops[0][0]]
    base_in = [bm.verts.new((p[0], p[1], 0.0)) for p in loops[3][0]]
    for i in range(n):
        bm.faces.new((base_out[i], base_out[(i + 1) % n],
                      rings[0][(i + 1) % n], rings[0][i]))
        bm.faces.new((rings[3][i], rings[3][(i + 1) % n],
                      base_in[(i + 1) % n], base_in[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object("frame_copper_step", bm, collection, mat)


# Tucks 2 units under the copper band so the open plate ring never shows a gap.
LEATHER_RECT = (44.0, 48.0, 276.0, 192.0, 10.0)   # svg units: x0 y0 x1 y1 r


def _leather_project(px, py):
    x0, y0, x1, y1, r = LEATHER_RECT
    qx = min(max(px, x0 + r), x1 - r)
    qy = min(max(py, y0 + r), y1 - r)
    dx, dy = px - qx, py - qy
    d = math.hypot(dx, dy)
    if d <= r:
        return px, py, True
    return qx + dx / d * r, qy + dy / d * r, False


def build_leather(collection, mat, monogram_w):
    """Leather inset panel with the monogram channel engraved by vertex
    displacement — a real recess with drafted walls, no boolean risk."""
    import numpy as np
    x0, y0, x1, y1, _ = LEATHER_RECT
    step = 1.15                    # svg units ~ 0.36 mm grid
    nx = int((x1 - x0) / step) + 1
    ny = int((y1 - y0) / step) + 1
    # monogram segments in world space, flattened for numpy distance
    segs = []
    for sp in monogram_w:
        pts = sp["points"]
        for a, b in zip(pts, pts[1:]):
            segs.append((a[0], a[1], b[0], b[1]))
    seg = np.array(segs)                          # (M,4)
    grid = np.zeros((ny, nx, 2))
    snapped = np.zeros((ny, nx), dtype=bool)
    for j in range(ny):
        for i in range(nx):
            gx, gy, inside = _leather_project(x0 + i * step, y0 + j * step)
            wx, wy = to_world((gx, gy))
            grid[j, i] = (wx, wy)
            snapped[j, i] = not inside
    flat = grid.reshape(-1, 2)                    # (N,2)
    mind = np.full(flat.shape[0], 1e9)
    for c0 in range(0, seg.shape[0], 64):
        s = seg[c0:c0 + 64]
        a = s[:, 0:2][None, :, :]                 # (1,M,2)
        b = s[:, 2:4][None, :, :]
        p = flat[:, None, :]                      # (N,1,2)
        ab = b - a
        denom = (ab * ab).sum(-1)
        denom[denom == 0] = 1e-12
        t = (((p - a) * ab).sum(-1) / denom).clip(0.0, 1.0)
        proj = a + t[..., None] * ab
        d = np.sqrt(((p - proj) ** 2).sum(-1)).min(-1)
        mind = np.minimum(mind, d)
    w_core, w_out = 0.00045, 0.00105              # channel half-widths
    tt = ((mind - w_core) / (w_out - w_core)).clip(0.0, 1.0)
    depth = CHANNEL_DEPTH * (1.0 - tt * tt * (3.0 - 2.0 * tt))   # smoothstep draft
    zs = (LEATHER_TOP - depth).reshape(ny, nx)

    bm = bmesh.new()
    verts = [[bm.verts.new((grid[j, i, 0], grid[j, i, 1], zs[j, i]))
              for i in range(nx)] for j in range(ny)]
    for j in range(ny - 1):
        for i in range(nx - 1):
            quad = (verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i])
            if len({v.co.to_tuple(7) for v in quad}) == 4:
                bm.faces.new(quad)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    boundary = [e for e in bm.edges if e.is_boundary]
    ret = bmesh.ops.extrude_edge_only(bm, edges=boundary)
    down = [g for g in ret["geom"] if isinstance(g, bmesh.types.BMVert)]
    for v in down:
        v.co.z = LEATHER_TOP - 0.0025
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object("inset_leather_panel", bm, collection, mat, smooth=True)


def build_stitches(name, collection, mat, path_units, z, pitch=0.0024,
                   length=0.0014, radius=0.00025):
    """Saddle stitch: alternating-tilt capsules along a path. Geometry, not texture."""
    pts_w = [to_world(p) for p in path_units]
    path, total = resample(pts_w, pitch, closed=True)
    bm = bmesh.new()
    n = len(path)
    for i in range(n):
        cx, cy = path[i]
        nx_, ny_ = path[(i + 1) % n]
        px_, py_ = path[(i - 1) % n]
        tx, ty = nx_ - px_, ny_ - py_
        ln = math.hypot(tx, ty) or 1.0
        tx, ty = tx / ln, ty / ln
        tilt = 0.14 if i % 2 == 0 else -0.14      # hand-sewn alternation
        half = length / 2.0
        a = (cx - tx * half, cy - ty * half, z)
        b = (cx + tx * half, cy + ty * half, z + tilt * radius * 2.0)
        ring_prev = None
        for (ex, ey, ez), cap in ((a, -1), (b, 1)):
            ring = []
            for k in range(6):
                ang = 2.0 * math.pi * k / 6.0
                ox, oy = -ty, tx
                ring.append(bm.verts.new((ex + ox * radius * math.cos(ang),
                                          ey + oy * radius * math.cos(ang),
                                          ez + radius * math.sin(ang))))
            if ring_prev:
                for k in range(6):
                    bm.faces.new((ring_prev[k], ring_prev[(k + 1) % 6],
                                  ring[(k + 1) % 6], ring[k]))
            else:
                bm.faces.new(list(reversed(ring)))
            ring_prev = ring
        bm.faces.new(ring_prev)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object(name, bm, collection, mat, smooth=True)


def build_stones(collection, mat_stone, mat_bezel):
    """Four cardinal cabochons from the canonical stone table. Four — never a ring."""
    stones = []
    for s in CANON["turquoiseStones"]:
        # radiusUnits IS the stone radius: 5 u = 1.55 mm = the brief's 3.1 mm
        # E/W cabochon; 4 u = 2.5 mm for N/S. The bezel rides just outside it.
        r = s["radiusUnits"] * UNIT
        r_full = r * 1.14
        wx, wy = to_world((s["x"], s["y"]))
        base_z = COPPER_TOP if s["id"] in ("E", "W") else LEATHER_TOP
        bm = bmesh.new()
        bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=20, radius=r)
        for v in bm.verts:
            v.co.z *= 0.62
            v.co.z += base_z + r * 0.30
            v.co.x += wx
            v.co.y += wy
        cab = new_object("stone_%s" % s["id"], bm, collection, mat_stone, smooth=True)
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=False, segments=28,
                              radius1=r_full * 1.16, radius2=r_full * 0.98,
                              depth=r_full * 0.5)
        for v in bm.verts:
            v.co.z += base_z + r_full * 0.2
            v.co.x += wx
            v.co.y += wy
        bez = new_object("bezel_%s" % s["id"], bm, collection, mat_bezel, smooth=True)
        stones.append((s["id"], cab, bez))
    return stones


def build_inlay(collection, mat, halo_mat, monogram_w):
    """The luminous light guide: canonical monogram splines, 0.4 mm round profile,
    seated 0.2 mm proud of the channel floor. A wider, far dimmer sheath around
    it reads as the diffusion a real light guide throws into its own channel —
    the near-field falloff that composited glare alone cannot supply."""
    z = LEATHER_TOP - CHANNEL_DEPTH + INLAY_R
    paths = [[(p[0], p[1], z) for p in sp["points"]] for sp in monogram_w]
    core = tube_from_polyline("engraving_inlay", paths, INLAY_R, collection, mat)
    halo = tube_from_polyline("engraving_inlay_halo", paths, INLAY_R * 2.3,
                              collection, halo_mat)
    return core, halo


def build_exit(collection, mat):
    """S4 routing line: canonical exit-thread path leaving the buckle for the denim."""
    sp = world_path(CANON["paths"]["exitThread"]["d"])[0]
    raw = parse_path(CANON["paths"]["exitThread"]["d"])[0]["points"]
    pts = []
    for (wx, wy), (sx, sy) in zip(sp["points"], raw):
        if sy <= 180.0:
            z = LEATHER_TOP - 0.0004
        elif sy <= 210.0:
            z = LEATHER_TOP - 0.0004 + (sy - 180.0) / 30.0 * 0.0038
        else:
            t = (sy - 210.0) / 30.0
            z = 0.0034 + t * (DENIM_Z + 0.0006 - 0.0034)
        pts.append((wx, wy, z))
    return tube_from_polyline("routing_line", [pts], INLAY_R, collection, mat)


def build_keeper(collection, mat_silver, mat_brass):
    """Plain bar-and-hook keeper on the back, flanked by two brass studs.
    Never rendered hero; exists for the opened state."""
    objs = []
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16,
                          radius1=0.002, radius2=0.002, depth=0.03)
    for v in bm.verts:
        v.co = Vector((v.co.x, v.co.z, -v.co.y))         # rotate -90 about X: bar along Y
        v.co.x -= 0.016
        v.co.z += -PLATE_DEPTH - 0.0022
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    objs.append(new_object("keeper_bar", bm, collection, mat_silver, smooth=True))
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16,
                          radius1=0.0016, radius2=0.0008, depth=0.012)
    for v in bm.verts:
        v.co = Vector((v.co.z, v.co.y, -v.co.x))         # rotate 90 about Y: prong along X
        v.co.x += 0.02
        v.co.z += -PLATE_DEPTH - 0.0022
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    objs.append(new_object("keeper_hook", bm, collection, mat_silver, smooth=True))
    for sy, tag in ((0.017, "a"), (-0.017, "b")):
        bm = bmesh.new()
        bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=0.001)
        for v in bm.verts:
            v.co.z *= 0.6
            v.co.x -= 0.016
            v.co.y += sy
            v.co.z += -PLATE_DEPTH - 0.001
        objs.append(new_object("stud_brass_%s" % tag, bm, collection, mat_brass,
                               smooth=True))
    return objs


def build_denim(collection, mat):
    # Verts stay at local z = 0; the object location carries DENIM_Z so the
    # aperture-state keyframes on location.z compose correctly.
    bm = bmesh.new()
    v = [bm.verts.new(p) for p in ((-0.2, -0.15, 0.0), (0.2, -0.15, 0.0),
                                   (0.2, 0.15, 0.0), (-0.2, 0.15, 0.0))]
    bm.faces.new(v)
    obj = new_object("denim_ground", bm, collection, mat)
    obj.location = (0.0, 0.0, DENIM_Z)
    return obj


def bisect_into_halves(obj, keep_positive):
    """Cut a mesh object at the x=0 seam, sealing the cross-section."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, 0), plane_no=(1, 0, 0),
                           clear_inner=keep_positive, clear_outer=not keep_positive)
    open_edges = [e for e in bm.edges if e.is_boundary]
    if open_edges:
        try:
            bmesh.ops.holes_fill(bm, edges=open_edges, sides=0)
        except Exception:
            pass    # an unsealed cross-section is cosmetic; only S3 shows it
    bm.to_mesh(obj.data)
    bm.free()


# ------------------------------------------------------------------ rig and states

def build_lights(collection):
    def aim(obj, target=Vector((0, 0, 0))):
        d = target - obj.location
        obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

    def blackbody(light, kelvin):
        light.data.use_nodes = True
        tree = light.data.node_tree
        emit = tree.nodes.get("Emission")
        bb = tree.nodes.new("ShaderNodeBlackbody")
        bb.inputs["Temperature"].default_value = kelvin
        tree.links.new(bb.outputs["Color"], emit.inputs["Color"])

    # A narrow strip raking at ~15 deg. Narrow is the point: it is what throws
    # the long micro-shadows across the rope twist and tooling that make the
    # relief legible. A broad softbox would wash exactly that away.
    key_data = bpy.data.lights.new("light_key_3200k", type="AREA")
    key_data.shape = "RECTANGLE"
    key_data.size = 0.28
    key_data.size_y = 0.025
    key = bpy.data.objects.new("light_key_3200k", key_data)
    # Close in, at the same ~15 deg rake. Proximity is what makes inverse-square
    # falloff drop the denim to black a few centimetres past the buckle — a
    # distant light of equal angle lights the whole ground evenly instead.
    key.location = (-0.145, -0.012, 0.039)
    collection.objects.link(key)
    aim(key)
    blackbody(key, 3200.0)

    # Small and hard, so the cool edge separating silver from the dark field
    # stays a defined line rather than a gradient.
    rim_data = bpy.data.lights.new("light_rim_5600k", type="AREA")
    rim_data.shape = "SQUARE"
    rim_data.size = 0.022
    rim = bpy.data.objects.new("light_rim_5600k", rim_data)
    rim.location = (0.115, 0.075, 0.105)          # hard edge, upper camera-right
    collection.objects.link(rim)
    aim(rim)
    blackbody(rim, 5600.0)
    rim_data.energy = 0.5

    fill_data = bpy.data.lights.new("light_fill", type="AREA")
    fill_data.size = 0.6
    fill = bpy.data.objects.new("light_fill", fill_data)
    fill.location = (0.0, -0.25, 0.5)
    collection.objects.link(fill)
    aim(fill)
    fill_data.energy = 0.012                      # near-zero fill

    world = bpy.data.worlds.new("world_black")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
    bpy.context.scene.world = world
    return key, rim, fill


def build_compositor():
    """Glare on the render, in linear space before the view transform — the
    specified way to bloom the engraving. Never baked into a texture.

    Blender 5.x models the compositor as a node group hung off the scene:
    there is no Composite node any more, and Glare is entirely socket-driven.
    """
    scene = bpy.context.scene
    tree = bpy.data.node_groups.new("buckle_comp", "CompositorNodeTree")
    tree.interface.new_socket(name="Image", in_out="OUTPUT",
                              socket_type="NodeSocketColor")
    scene.compositing_node_group = tree

    rl = tree.nodes.new("CompositorNodeRLayers")
    glare = tree.nodes.new("CompositorNodeGlare")

    def put(socket, value):
        if socket in glare.inputs:
            try:
                glare.inputs[socket].default_value = value
                return
            except TypeError:
                pass
        log("WARN glare socket rejected: %s=%r" % (socket, value))

    put("Type", "Fog Glow")
    put("Quality", "High")
    # The threshold has to sit above the lit metal, or the glare hazes the whole
    # frame and destroys exactly the contrast it was added to support. Only the
    # emissive inlay should clear it.
    put("Threshold", 2.4)
    put("Strength", 0.32)
    put("Size", 7)
    put("Saturation", 1.3)     # AgX flattens the turquoise; the glare returns it

    out = tree.nodes.new("NodeGroupOutput")
    tree.links.new(rl.outputs["Image"], glare.inputs["Image"])
    tree.links.new(glare.outputs["Image"], out.inputs[0])
    return tree


def build_cameras(collection):
    cams = {}

    def add(name, loc, rot, focal=None, ortho=None, clip=0.001):
        cam_data = bpy.data.cameras.new(name)
        if ortho:
            cam_data.type = "ORTHO"
            cam_data.ortho_scale = ortho
        else:
            cam_data.lens = focal
            cam_data.sensor_width = 36.0
        cam_data.clip_start = clip
        cam = bpy.data.objects.new(name, cam_data)
        cam.location = loc
        cam.rotation_euler = rot
        collection.objects.link(cam)
        cams[name] = cam
        return cam

    add("cam_front_ortho", (0.0, 0.0, 0.5), Euler((0.0, 0.0, 0.0)), ortho=0.106)

    e = Euler((math.radians(5.0), 0.0, 0.0))
    add("cam_hero_front", e.to_matrix() @ Vector((0, 0, 2.6 * BW)), e, focal=35.0)

    e = Euler((math.radians(12.0), 0.0, math.radians(-30.0)))
    cam34 = add("cam_hero_34", e.to_matrix() @ Vector((0, 0, 2.4 * BW)), e,
                focal=50.0)
    # Jewellery-film depth: the buckle stays sharp, the denim falls away.
    cam34.data.dof.use_dof = True
    cam34.data.dof.focus_distance = 2.4 * BW
    cam34.data.dof.aperture_fstop = 4.0

    target = Vector((to_world((163.0, 124.0))[0], to_world((163.0, 124.0))[1], 0.0))
    e = Euler((math.radians(18.0), 0.0, math.radians(-14.0)))
    macro = add("cam_macro", target + e.to_matrix() @ Vector((0, 0, 0.55 * BW)),
                e, focal=90.0, clip=0.002)
    macro.data.dof.use_dof = True
    macro.data.dof.focus_distance = 0.55 * BW
    macro.data.dof.aperture_fstop = 5.6

    # The aperture reads as an event, not a diagram, when the camera is closer
    # and lower than the explanatory straight-on framing: the parted halves get
    # perspective, and the dark opening between them becomes the subject.
    e = Euler((math.radians(14.0), 0.0, math.radians(-8.0)))
    ap = add("cam_aperture", e.to_matrix() @ Vector((0, 0, 2.55 * BW)), e,
             focal=42.0)
    ap.data.dof.use_dof = True
    ap.data.dof.focus_distance = 2.55 * BW
    ap.data.dof.aperture_fstop = 4.5

    # Aperture cameras focus on the receded monogram plate, not the origin —
    # focusing on the closed-state plane would throw the anchor soft in the one
    # state where it has to hold the frame.
    core_pt = Vector((0.0, 0.0, APERTURE_CORE_Z * BW))

    def aimed(name, pitch, yaw_deg, dist, focal, fstop):
        rot = Euler((math.radians(pitch), 0.0, math.radians(yaw_deg)))
        cam = add(name, core_pt + rot.to_matrix() @ Vector((0, 0, dist)), rot,
                  focal=focal, clip=0.002)
        cam.data.dof.use_dof = True
        cam.data.dof.focus_distance = dist
        cam.data.dof.aperture_fstop = fstop
        return cam

    # Parted, the assembly spans about 2.1 BW — roughly twice the closed object.
    # The framing distance has to be set from that opened span, not the closed
    # one, or the halves leave frame the moment the aperture actually works.
    aimed("cam_aperture_34", 17.0, -29.0, 3.6 * BW, 45.0, 5.0)

    # The close-up subject is the opening itself: the inner edge of the left
    # half in the foreground, the sunk plate beyond it, and the dark gap between
    # them carrying the separation.
    # Focus sits mid-gap and the lens is stopped well down: at this focal length
    # and subject distance a wide aperture gives millimetres of depth, which
    # softens the very separation the shot exists to show.
    # Framed across the gap rather than onto the plate: the left half's inner
    # edge sits near, the sunk plate beyond it, and the 64 mm of depth between
    # them is the subject. Stopped to f/13 so both planes hold.
    edge = Vector((-0.032, 0.0, -0.022))
    rot = Euler((math.radians(19.0), 0.0, math.radians(-21.0)))
    macro = add("cam_aperture_macro", edge + rot.to_matrix() @ Vector((0, 0, 2.6 * BW)),
                rot, focal=48.0, clip=0.002)
    macro.data.dof.use_dof = True
    macro.data.dof.focus_distance = 2.6 * BW
    macro.data.dof.aperture_fstop = 13.0

    # Shot-list S10: frontal and framed low, so the canonical exit curve runs
    # out of the bottom of frame rather than stopping inside it. The downward
    # pitch plus a target lifted above the plate centre does that framing.
    rot = Euler((math.radians(21.0), 0.0, 0.0))
    route_target = core_pt + Vector((0.0, 0.022, 0.0))
    route = add("cam_route", route_target + rot.to_matrix() @ Vector((0, 0, 3.6 * BW)),
                rot, focal=40.0)
    route.data.dof.use_dof = True
    route.data.dof.focus_distance = 3.6 * BW
    route.data.dof.aperture_fstop = 5.6
    return cams


def key_states(key_light, fill_light, half_l, half_r, core, denim, exit_obj,
               seam_stitches, inlay_mats):
    f = STATE_FRAMES
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 30

    def insert(obj, path, values, index=-1):
        for state, val in values.items():
            if index >= 0:
                getattr(obj, path)[index] = val
            else:
                setattr(obj, path, val)
            obj.keyframe_insert(data_path=path, frame=f[state], index=index)

    insert(key_light.data, "energy",
           {"dormant": 0.09, "illuminated": 1.8, "aperture": 1.8, "routing": 1.8})
    insert(fill_light.data, "energy",
           {"dormant": 0.002, "illuminated": 0.012,
            "aperture": 0.012, "routing": 0.012})

    open_x = APERTURE_HALF_X * BW
    open_z = APERTURE_HALF_Z * BW
    insert(half_l, "location", {"dormant": 0.0, "illuminated": 0.0,
                                "aperture": -open_x, "routing": 0.0}, index=0)
    insert(half_r, "location", {"dormant": 0.0, "illuminated": 0.0,
                                "aperture": open_x, "routing": 0.0}, index=0)
    for half in (half_l, half_r):
        insert(half, "location", {"dormant": 0.0, "illuminated": 0.0,
                                  "aperture": open_z, "routing": 0.0}, index=2)
    yaw = math.radians(APERTURE_YAW_DEG)
    insert(half_l, "rotation_euler", {"dormant": 0.0, "illuminated": 0.0,
                                      "aperture": yaw, "routing": 0.0}, index=1)
    insert(half_r, "rotation_euler", {"dormant": 0.0, "illuminated": 0.0,
                                      "aperture": -yaw, "routing": 0.0}, index=1)

    core_z = APERTURE_CORE_Z * BW
    denim_z = APERTURE_DENIM_Z * BW
    insert(core, "location", {"dormant": 0.0, "illuminated": 0.0,
                              "aperture": core_z, "routing": 0.0}, index=2)
    insert(denim, "location", {"dormant": DENIM_Z, "illuminated": DENIM_Z,
                               "aperture": DENIM_Z + denim_z, "routing": DENIM_Z},
           index=2)

    # The routing thread is live through the aperture moment as well as S4, so
    # the opening reads as leading somewhere rather than simply standing open.
    # Every state needs its own key: under constant interpolation an unkeyed
    # frame inherits the previous one, which is how this silently stayed hidden.
    visible = {"dormant": True, "illuminated": True,
               "aperture": False, "routing": False}
    for path in ("hide_render", "hide_viewport"):
        for state, hidden in visible.items():
            setattr(exit_obj, path, hidden)
            exit_obj.keyframe_insert(data_path=path, frame=f[state])
        setattr(exit_obj, path, False)

    # The denim seam row frames the closed object, but during the aperture it
    # draws a bright rectangle around the opening and the whole thing reads as a
    # technical diagram. It drops out for that state alone.
    seam = {"dormant": False, "illuminated": False,
            "aperture": True, "routing": False}
    for path in ("hide_render", "hide_viewport"):
        for state, hidden in seam.items():
            setattr(seam_stitches, path, hidden)
            seam_stitches.keyframe_insert(data_path=path, frame=f[state])
        setattr(seam_stitches, path, False)

    for mat in inlay_mats:
        tree = mat.node_tree
        node = tree.nodes["illum"]
        for state, val in {"dormant": 0.0, "illuminated": 1.0,
                           "aperture": 1.0, "routing": 1.0}.items():
            node.outputs[0].default_value = val
            tree.keyframe_insert(
                data_path='nodes["illum"].outputs[0].default_value',
                frame=f[state])

    # States are read exactly at their keyed frames, so interpolation mode is
    # cosmetic — but constant steps keep scrubbing honest. Guarded because the
    # legacy Action.fcurves accessor is deprecated under slotted actions.
    try:
        for action in list(bpy.data.actions):
            fcurves = getattr(action, "fcurves", None)
            if fcurves is None:
                # slotted actions (4.4+): layers -> strips -> channelbags
                fcurves = [fc for layer in action.layers
                           for strip in layer.strips
                           for bag in strip.channelbags
                           for fc in bag.fcurves]
            for fc in fcurves:
                for kp in fc.keyframe_points:
                    kp.interpolation = "CONSTANT"
    except Exception as exc:
        log("WARN could not set constant interpolation: %s" % exc)


# --------------------------------------------------------------------- QA / overlay

def build_overlay(collection, outline_w):
    """Canonical silhouette as an emissive wire, hidden except in the overlay
    render. Sits above the plate so any deviation of the mesh edge is visible."""
    mat = bpy.data.materials.new("_qa_overlay_outline")
    mat.use_nodes = True
    tree = mat.node_tree
    old = tree.nodes.get("Principled BSDF")
    if old:
        tree.nodes.remove(old)
    emit = tree.nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = (0.0, 1.0, 0.25, 1.0)
    emit.inputs["Strength"].default_value = 30.0
    tree.links.new(emit.outputs[0], tree.nodes["Material Output"].inputs["Surface"])
    pts = [(p[0], p[1], 0.004) for p in outline_w] + [(outline_w[0][0], outline_w[0][1], 0.004)]
    obj = tube_from_polyline("_qa_canonical_outline", [pts], 0.00013, collection, mat)
    obj.hide_render = obj.hide_viewport = True
    return obj


def validate():
    failures = []
    names = ([o.name.lower() for o in bpy.data.objects]
             + [m.name.lower() for m in bpy.data.materials]
             + [c.name.lower() for c in bpy.data.collections])
    for name in names:
        for bad in FORBIDDEN_NAMES:
            if bad in name:
                failures.append("forbidden token '%s' in name '%s'" % (bad, name))
    for want in MATERIAL_NAMES:
        if want not in bpy.data.materials:
            failures.append("missing material: " + want)
    if any(o.type == "FONT" for o in bpy.data.objects):
        failures.append("text object present — the object carries no text")
    # The sampled path bulges ~0.5 unit past the nominal 296 x 180 anchors
    # (Bezier hull overshoot at the scallops) — that bulge IS canonical, the
    # SVG renders it too. Tolerance is the brief's own +/-1%.
    sil = parse_path(CANON["paths"]["silhouette"]["d"])[0]["points"]
    xs = [p[0] for p in sil]
    ys = [p[1] for p in sil]
    aspect = (max(xs) - min(xs)) / (max(ys) - min(ys))
    if abs(aspect / (296.0 / 180.0) - 1.0) > 0.01:
        failures.append("silhouette aspect off canonical by >1%%: %.4f" % aspect)
    return failures


# ----------------------------------------------------------------------- rendering

def configure_render(samples=256):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = "OPENIMAGEDENOISE"
    except TypeError:
        pass
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 768
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "None"             # AgX base contrast
    scene.render.film_transparent = False
    prefs = bpy.context.preferences.addons.get("cycles")
    if prefs:
        cprefs = prefs.preferences
        for backend in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
            try:
                cprefs.compute_device_type = backend
                cprefs.get_devices()
                gpus = [d for d in cprefs.devices if d.type != "CPU"]
                if gpus:
                    for d in cprefs.devices:
                        d.use = True
                    scene.cycles.device = "GPU"
                    log("render device: GPU via " + backend)
                    return
            except Exception:
                continue
    scene.cycles.device = "CPU"
    log("render device: CPU")


def render_to(path, camera_name, frame, fmt="WEBP", samples=256,
              transparent=False, glare=True):
    scene = bpy.context.scene
    configure_render(samples)
    scene.render.film_transparent = transparent
    # Fog glow spreads alpha and would blur the QA outline, so measurement
    # passes render straight out of Cycles.
    scene.render.use_compositing = glare
    scene.camera = bpy.data.objects[camera_name]
    scene.frame_set(frame)
    scene.render.image_settings.file_format = fmt
    if fmt == "WEBP":
        scene.render.image_settings.quality = 92
        scene.render.image_settings.color_mode = "RGB"
    else:
        scene.render.image_settings.color_mode = "RGBA"
    scene.render.filepath = path
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log("rendered %s in %.1fs" % (os.path.basename(path), time.time() - t0))


PROOFS = {
    "front": ("cam_front_ortho", "illuminated", "buckle-front-proof.webp"),
    "three_quarter": ("cam_hero_34", "illuminated", "buckle-three-quarter-proof.webp"),
    "illuminated": ("cam_hero_front", "illuminated", "buckle-illuminated-proof.webp"),
    "aperture": ("cam_aperture", "aperture", "buckle-aperture-proof.webp"),
    "aperture_34": ("cam_aperture_34", "aperture",
                    "buckle-aperture-three-quarter-proof.webp"),
    "aperture_macro": ("cam_aperture_macro", "aperture",
                       "buckle-aperture-closeup-proof.webp"),
    "route": ("cam_route", "aperture", "buckle-routing-handoff-proof.webp"),
}


# ------------------------------------------------------------------ motion proof
#
# The motion stage never writes the master. It loads it, clears the state
# keyframes, lays a continuous timeline over the same values, renders, and
# exits — so the approved still states stay exactly as reviewed.

FPS = 24
MOTION_LAST = 97                  # 96 intervals at 24 fps = 4.00 s exactly
MOTION_FRAMES_DIR = os.path.join(LOGS_DIR, "motion-frames")

# Monogram extent in object space, for the ignition wipe front.
MONOGRAM_X = (to_world((96.0, 0.0))[0], to_world((232.0, 0.0))[0])
WIPE_SOFT = 0.006

# The beat sheet, in seconds. Every entry is (start, end).
BEATS = {
    "ignite_light": (0.30, 1.30),
    "ignite_draw": (0.30, 1.30),
    "halves_forward": (1.45, 1.90),
    "halves_part": (1.75, 3.10),
    "halves_yaw": (1.80, 3.10),
    "plate_recede": (1.90, 3.30),
    "denim_recede": (1.60, 2.80),
    "seam_out": (2.80, 2.80),
    "thread_grow": (2.60, 3.92),
    # The pull must land as the aperture reaches full width, not after it. Ending
    # later leaves the camera still tight while the halves are already at ±55%,
    # and they overrun the frame in the middle of the move.
    "camera_pull": (1.30, 3.10),
    "camera_settle": (3.10, 4.00),
}

# Final-settle framing. `dist` is bounded from below by the mobile crop: the 9:16
# frame is only 31.6% of the landscape width, so pushing past ~3.45 BW starts
# cutting the leather plate's sides on mobile. `rise` moves the aim along the
# camera's up axis, which is what actually drops the thread through the bottom
# edge; `roll` reorders the thread tail against the plate's lower corner.
# The settle covers 80% of its distance in the first half, then eases the rest.
# A single ease across the whole 0.9 s puts the thread through the edge only in
# the last few frames; front-loading crosses it well before 3.85 s and leaves a
# real settling moment rather than an arrival landing on the cut.
SETTLE_LEAD = (3.55, 0.8)

# Camera profiles. Landscape reproduces the approved cameras exactly. Mobile is a
# dedicated 9:16 composition, NOT a centre crop: the plate is only fractionally
# narrower than a 9:16 frame at desktop distances, so a crop can never hold the
# required horizontal safety. Mobile therefore sits further back and rides the
# subject low, which both buys the safety margin and leaves the upper frame as
# deliberate negative space for HTML copy.
#
# The 12 deg settle roll is not decoration: at the approved three-quarter angle
# the leather plate's lowest point projects BELOW the canonical thread's tail, so
# a level bottom edge always crosses the plate first. The bank reverses that
# order — tail swings down, plate corner swings up — and is the only way to put
# the thread off the bottom edge with the plate still whole.
HERO_ROT = (12.0, 0.0, -30.0)
APERTURE_ROT = (17.0, 0.0, -29.0)

PROFILES = {
    "landscape": {
        "res": (1920, 1080),
        "sensor": None,
        "hero": {"dist": 2.4, "rise": 0.0, "lens": 50.0, "fstop": 4.0},
        "aperture": {"dist": 3.6, "rise": 0.0, "lens": 45.0, "fstop": 5.0},
        "settle": {"dist": 3.45, "rise": 0.0380, "roll": 12.0, "shift": -0.0075,
                   "fstop": 5.5},
    },
    "mobile": {
        "res": (1080, 1920),
        "sensor": ("VERTICAL", 36.0 * 1080.0 / 1920.0),
        "hero": {"dist": 6.5, "rise": 0.059, "lens": 50.0, "fstop": 5.6},
        "aperture": {"dist": 5.8, "rise": 0.070, "lens": 45.0, "fstop": 6.3},
        "settle": {"dist": 5.5, "rise": 0.0812, "roll": 15.0, "shift": 0.0,
                   "fstop": 7.1},
    },
}

VERIFY_TIMES = (3.10, 3.40, 3.55, 3.70, 3.79, 3.85, 4.00)
POSTER_TIME = 1.40          # fully lit, closed: the frame that stands alone

CONTACT_TIMES = (0.15, 0.80, 1.40, 2.05, 2.90, 3.95)

# Settle start, lead key, thread crossing, final frame.
END_FRAME_TIMES = (3.10, 3.55, 3.79, 4.00)

MOTION_PASSES = {
    "landscape": (1920, 1080),
    "mobile": (1080, 1920),
}


def at(seconds):
    """Seconds on the motion timeline -> frame number."""
    return int(round(1.0 + seconds * FPS))


def _iter_fcurves():
    curves = []
    for action in bpy.data.actions:
        fcs = getattr(action, "fcurves", None)
        if fcs is None:                     # slotted actions, 4.4+
            fcs = [fc for layer in action.layers
                   for strip in layer.strips
                   for bag in strip.channelbags
                   for fc in bag.fcurves]
        curves.extend(fcs)
    return curves


def _apply_easing():
    """Smooth S-curves everywhere, stepped booleans. AUTO_CLAMPED handles cannot
    overshoot, which is what rules out the elastic settle a luxury object never
    does."""
    for fc in _iter_fcurves():
        stepped = fc.data_path.endswith(("hide_render", "hide_viewport"))
        for kp in fc.keyframe_points:
            if stepped:
                kp.interpolation = "CONSTANT"
            else:
                kp.interpolation = "BEZIER"
                kp.handle_left_type = "AUTO_CLAMPED"
                kp.handle_right_type = "AUTO_CLAMPED"


def _clear_animation():
    for collection in (bpy.data.objects, bpy.data.lights, bpy.data.cameras,
                       bpy.data.curves, bpy.data.materials):
        for datum in collection:
            if getattr(datum, "animation_data", None):
                datum.animation_data_clear()
    for mat in bpy.data.materials:
        if mat.node_tree and mat.node_tree.animation_data:
            mat.node_tree.animation_data_clear()


def _add_ignition_wipe(mat, base_strength):
    """Gate emission strength behind a soft front travelling left-to-right across
    the monogram — the direction the shipped SVG strokes it, so the render draws
    in the same order as the live CSS. At draw = 1 the mask is 1 everywhere, so
    the fully-lit look is identical to the approved one."""
    tree = mat.node_tree
    emit = next(n for n in tree.nodes if n.type == "EMISSION")

    draw = tree.nodes.new("ShaderNodeValue")
    draw.name = draw.label = "draw"
    draw.outputs[0].default_value = 1.0

    front = tree.nodes.new("ShaderNodeMapRange")
    front.inputs["From Min"].default_value = 0.0
    front.inputs["From Max"].default_value = 1.0
    front.inputs["To Min"].default_value = MONOGRAM_X[0] - WIPE_SOFT
    front.inputs["To Max"].default_value = MONOGRAM_X[1] + WIPE_SOFT
    tree.links.new(draw.outputs[0], front.inputs["Value"])

    texco = tree.nodes.new("ShaderNodeTexCoord")
    sep = tree.nodes.new("ShaderNodeSeparateXYZ")
    tree.links.new(texco.outputs["Object"], sep.inputs["Vector"])

    behind = tree.nodes.new("ShaderNodeMath")
    behind.operation = "SUBTRACT"
    tree.links.new(front.outputs["Result"], behind.inputs[0])
    tree.links.new(sep.outputs["X"], behind.inputs[1])

    mask = tree.nodes.new("ShaderNodeMapRange")
    mask.inputs["From Min"].default_value = 0.0
    mask.inputs["From Max"].default_value = WIPE_SOFT
    mask.inputs["To Min"].default_value = 0.0
    mask.inputs["To Max"].default_value = 1.0
    tree.links.new(behind.outputs[0], mask.inputs["Value"])

    scaled = tree.nodes.new("ShaderNodeMath")
    scaled.operation = "MULTIPLY"
    scaled.inputs[1].default_value = base_strength
    tree.links.new(mask.outputs["Result"], scaled.inputs[0])
    tree.links.new(scaled.outputs[0], emit.inputs["Strength"])
    return draw


def _pose(spec, rot_deg, about_core, roll=0.0, shift=0.0):
    """Camera location/rotation for one keyed framing. `rise` and `shift` move
    the aim along the camera's own up and right axes, so the framing shifts
    without re-aiming at a different part of the object."""
    rot = Euler(tuple(math.radians(a) for a in rot_deg))
    basis = rot.to_matrix()
    origin = Vector((0.0, 0.0, APERTURE_CORE_Z * BW)) if about_core else Vector()
    aim = (origin
           + (basis @ Vector((0.0, 1.0, 0.0))) * spec["rise"]
           + (basis @ Vector((1.0, 0.0, 0.0))) * shift)
    if roll:
        basis = basis @ Euler((0.0, 0.0, math.radians(roll))).to_matrix()
        rot = basis.to_euler()
    return aim + basis @ Vector((0.0, 0.0, spec["dist"] * BW)), rot


def build_motion(profile_name="landscape"):
    profile = PROFILES[profile_name]
    scene = bpy.context.scene
    _clear_animation()
    scene.frame_start = 1
    scene.frame_end = MOTION_LAST
    scene.render.fps = FPS

    obj = bpy.data.objects
    half_l, half_r = obj["half_L"], obj["half_R"]
    core, denim = obj["core_grp"], obj["denim_ground"]
    seam, thread = obj["denim_seam_stitches"], obj["routing_line"]
    key, fill = obj["light_key_3200k"], obj["light_fill"]

    def kf(datum, path, pairs, index=-1):
        for seconds, value in pairs:
            if index >= 0:
                getattr(datum, path)[index] = value
            else:
                setattr(datum, path, value)
            datum.keyframe_insert(data_path=path, frame=at(seconds), index=index)

    # 1 — closed and dormant, then the key rises into the approved lit state.
    a, b = BEATS["ignite_light"]
    kf(key.data, "energy", [(0.0, 0.09), (a, 0.09), (b, 1.8)])
    kf(fill.data, "energy", [(0.0, 0.002), (a, 0.002), (b, 0.012)])

    # 2 — the monogram draws on rather than switching. `illum` opens the emission
    # branch a frame before the wipe starts; the wipe does all the visible work.
    a, b = BEATS["ignite_draw"]
    for mat_name, base in (("engraving_inlay", 9.0), ("engraving_inlay_halo", 1.6)):
        mat = bpy.data.materials[mat_name]
        tree = mat.node_tree
        node = _add_ignition_wipe(mat, base)
        illum = tree.nodes["illum"]
        for seconds, value in ((0.0, 0.0), (a - 0.04, 0.0), (a - 0.02, 1.0)):
            illum.outputs[0].default_value = value
            tree.keyframe_insert(
                data_path='nodes["illum"].outputs[0].default_value',
                frame=at(seconds))
        for seconds, value in ((0.0, 0.0), (a, 0.0), (b, 1.0)):
            node.outputs[0].default_value = value
            tree.keyframe_insert(
                data_path='nodes["%s"].outputs[0].default_value' % node.name,
                frame=at(seconds))

    # 3 — the halves lift toward camera BEFORE they travel outward.
    a, b = BEATS["halves_forward"]
    for half in (half_l, half_r):
        kf(half, "location", [(0.0, 0.0), (a, 0.0), (b, APERTURE_HALF_Z * BW)],
           index=2)

    # 4 — approved travel and yaw, unchanged in value.
    a, b = BEATS["halves_part"]
    open_x = APERTURE_HALF_X * BW
    kf(half_l, "location", [(0.0, 0.0), (a, 0.0), (b, -open_x)], index=0)
    kf(half_r, "location", [(0.0, 0.0), (a, 0.0), (b, open_x)], index=0)
    a, b = BEATS["halves_yaw"]
    yaw = math.radians(APERTURE_YAW_DEG)
    kf(half_l, "rotation_euler", [(0.0, 0.0), (a, 0.0), (b, yaw)], index=1)
    kf(half_r, "rotation_euler", [(0.0, 0.0), (a, 0.0), (b, -yaw)], index=1)

    # 5 — the plate sinks into the well; falloff darkens it as it goes.
    a, b = BEATS["plate_recede"]
    kf(core, "location", [(0.0, 0.0), (a, 0.0), (b, APERTURE_CORE_Z * BW)], index=2)

    # 6 — the denim drops away, taking the seam row with it. The row dims by
    # inverse-square as it recedes and is cut once already dark, well before the
    # aperture reaches full width at 3.10 s.
    a, b = BEATS["denim_recede"]
    kf(denim, "location",
       [(0.0, DENIM_Z), (a, DENIM_Z), (b, DENIM_Z + APERTURE_DENIM_Z * BW)],
       index=2)
    cut = BEATS["seam_out"][0]
    for path in ("hide_render", "hide_viewport"):
        for seconds, hidden in ((0.0, False), (cut - 0.04, False), (cut, True)):
            setattr(seam, path, hidden)
            seam.keyframe_insert(data_path=path, frame=at(seconds))
        setattr(seam, path, False)

    # 7 — the thread grows from the canonical terminal outward. bevel_factor_end
    # extends the tube along the spline from its first point, which is the
    # monogram terminal, so it is drawn rather than revealed.
    a, b = BEATS["thread_grow"]
    thread.hide_render = thread.hide_viewport = False
    kf(thread.data, "bevel_factor_end", [(0.0, 0.0), (a, 0.0), (b, 1.0)])

    # 8 — camera holds the approved closed three-quarter framing through the
    # ignition, then eases to the approved aperture framing. Both poses are read
    # off the approved cameras, so neither composition is re-invented here.
    src = obj["cam_hero_34"]
    cam = src.copy()
    cam.data = src.data.copy()
    cam.name = "cam_motion"
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.dof.use_dof = True
    if profile["sensor"]:
        cam.data.sensor_fit, cam.data.sensor_height = profile["sensor"]

    hero, aperture, settle = (profile["hero"], profile["aperture"],
                              profile["settle"])
    hero_pose = _pose(hero, HERO_ROT, about_core=False)
    ap_pose = _pose(aperture, APERTURE_ROT, about_core=True)

    def key_camera(seconds, loc, rot, lens, focus, fstop):
        cam.location = loc
        cam.rotation_euler = rot
        cam.keyframe_insert(data_path="location", frame=at(seconds))
        cam.keyframe_insert(data_path="rotation_euler", frame=at(seconds))
        cam.data.lens = lens
        cam.data.dof.focus_distance = focus
        cam.data.dof.aperture_fstop = fstop
        for path in ("lens", "dof.focus_distance", "dof.aperture_fstop"):
            cam.data.keyframe_insert(data_path=path, frame=at(seconds))

    a, b = BEATS["camera_pull"]
    for seconds in (0.0, a):
        key_camera(seconds, *hero_pose, hero["lens"], hero["dist"] * BW,
                   hero["fstop"])
    key_camera(b, *ap_pose, aperture["lens"], aperture["dist"] * BW,
               aperture["fstop"])

    # 9 — final settle. Framing only: a short dolly in, a slight lift of the aim
    # along the camera's own up axis, and an optional roll, so the canonical
    # thread runs off the bottom edge. No focal change (a dolly, never a zoom),
    # no new rotation target beyond the roll, nothing else touched.
    _, end = BEATS["camera_settle"]
    settle_loc, settle_rot = _pose(settle, APERTURE_ROT, about_core=True,
                                   roll=settle["roll"], shift=settle["shift"])
    ap_loc, ap_rot = ap_pose
    for seconds, fraction in (SETTLE_LEAD, (end, 1.0)):
        key_camera(
            seconds,
            ap_loc.lerp(settle_loc, fraction),
            Euler(tuple(p + (q - p) * fraction
                        for p, q in zip(ap_rot, settle_rot))),
            aperture["lens"],          # a dolly, never a zoom
            (aperture["dist"] + (settle["dist"] - aperture["dist"]) * fraction) * BW,
            aperture["fstop"] + (settle["fstop"] - aperture["fstop"]) * fraction)

    _apply_easing()
    return cam


def stage_motion(which, samples):
    scene = bpy.context.scene
    build_motion(which)
    width, height = PROFILES[which]["res"]
    configure_render(samples)
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    out = os.path.join(MOTION_FRAMES_DIR, which)
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.filepath = os.path.join(out, "f_")
    t0 = time.time()
    bpy.ops.render.render(animation=True)
    log("%s: %d frames in %.0fs" % (which, MOTION_LAST, time.time() - t0))


def stage_encode(which):
    """Delivery encodes from the rendered PNG sequence — H.264/MP4 and VP9/WebM.
    The frames already carry AgX, so the sequencer must pass them through
    untransformed or the grade lands twice."""
    scene = bpy.context.scene
    src = os.path.join(MOTION_FRAMES_DIR, which)
    names = sorted(n for n in os.listdir(src) if n.endswith(".png"))
    if len(names) != MOTION_LAST:
        raise SystemExit("expected %d frames in %s, found %d"
                         % (MOTION_LAST, src, len(names)))
    # 97 rendered frames span 96 intervals — 4.00 s of MOTION — but a 97-frame
    # file PLAYS for 97/24 = 4.0417 s. Exact duration is a delivery criterion, so
    # the encode carries 96 frames: frame 96 lands at 3.958 s and holds out the
    # final 1/24 s. The settle is 80% complete by 3.55 s, so nothing is lost.
    delivery_frames = MOTION_LAST - 1
    scene.frame_start = 1
    scene.frame_end = delivery_frames
    scene.render.fps = FPS
    scene.render.fps_base = 1.0
    scene.render.resolution_x, scene.render.resolution_y = PROFILES[which]["res"]
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "Standard"
    scene.render.use_compositing = False
    scene.render.use_sequencer = True

    editor = scene.sequence_editor_create()
    # `strips` is 4.4+, `sequences` before it. Test with hasattr, not `or` — an
    # empty collection is falsy, so `or` falls through even when it exists.
    strips = editor.strips if hasattr(editor, "strips") else editor.sequences
    strip = strips.new_image(name="motion", filepath=os.path.join(src, names[0]),
                            channel=1, frame_start=1)
    for name in names[1:delivery_frames]:
        strip.elements.append(name)
    strip.frame_final_duration = delivery_frames

    # Blender 5.x gates the video formats behind media_type; FFMPEG is not in
    # the file_format enum until VIDEO is selected.
    settings = scene.render.image_settings
    if hasattr(settings, "media_type"):
        settings.media_type = "VIDEO"
    settings.file_format = "FFMPEG"

    written = []
    for container, codec, suffix in (("MPEG4", "H264", "mp4"),
                                     ("WEBM", "WEBM", "webm")):
        ffmpeg = scene.render.ffmpeg
        ffmpeg.format = container
        ffmpeg.codec = codec
        ffmpeg.constant_rate_factor = "HIGH"
        ffmpeg.ffmpeg_preset = "GOOD"
        ffmpeg.gopsize = 12
        ffmpeg.audio_codec = "NONE"          # silent by design
        stem = "lb-buckle-ignition-%s" % DELIVERY[which]
        scene.render.filepath = os.path.join(EXPORTS_DIR, stem + "-")
        bpy.ops.render.render(animation=True)
        # Blender appends the frame range; the delivery name must not carry it.
        produced = [n for n in os.listdir(EXPORTS_DIR)
                    if n.startswith(stem + "-") and n.endswith("." + suffix)]
        final = os.path.join(EXPORTS_DIR, "%s.%s" % (stem, suffix))
        if produced:
            if os.path.exists(final):
                os.remove(final)
            os.rename(os.path.join(EXPORTS_DIR, produced[0]), final)
            written.append(os.path.basename(final))
    log("encoded %s: %s" % (which, ", ".join(written)))


def stage_poster():
    """Poster frames. The lit closed buckle is the still that carries the whole
    message alone, which is what poster-first asks of a fallback — a dormant
    first frame communicates nothing if the video never plays."""
    bpy.context.scene.render.image_settings.quality = 92
    for which, label in DELIVERY.items():
        src = os.path.join(MOTION_FRAMES_DIR, which,
                           "f_%04d.png" % at(POSTER_TIME))
        img = bpy.data.images.load(src)
        img.pixels[0]          # load() is lazy; save() fails on an undecoded image
        img.file_format = "WEBP"
        dest = os.path.join(EXPORTS_DIR, "lb-buckle-poster-%s.webp" % label)
        img.filepath_raw = dest
        img.save()
        bpy.data.images.remove(img)
        log("poster: %s" % os.path.basename(dest))


def stage_contact():
    """Six key frames from the landscape pass, tiled 3 x 2."""
    import numpy as np
    src = os.path.join(MOTION_FRAMES_DIR, "landscape")
    tiles = []
    for seconds in CONTACT_TIMES:
        path = os.path.join(src, "f_%04d.png" % at(seconds))
        img = bpy.data.images.load(path)
        w, h = img.size
        plane = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
        half = plane[:h - h % 2, :w - w % 2].reshape(h // 2, 2, w // 2, 2, 4)
        tiles.append(half.mean(axis=(1, 3)))
    th, tw = tiles[0].shape[:2]
    gap = 8
    sheet = np.zeros((th * 2 + gap, tw * 3 + gap * 2, 4), dtype=np.float32)
    sheet[:, :, 3] = 1.0
    for i, tile in enumerate(tiles):
        # numpy rows run bottom-up in Blender pixel order, so the top row of the
        # sheet is written last.
        row, col = divmod(i, 3)
        y = (1 - row) * (th + gap)
        x = col * (tw + gap)
        sheet[y:y + th, x:x + tw] = tile
    out = bpy.data.images.new("contact", width=sheet.shape[1],
                              height=sheet.shape[0])
    out.pixels = sheet.ravel().tolist()
    out.file_format = "WEBP"
    dest = os.path.join(EXPORTS_DIR, "lb-buckle-motion-contact-sheet.webp")
    out.filepath_raw = dest
    out.save()
    log("contact sheet: %s" % os.path.basename(dest))


def _time_label(seconds):
    """3.10 -> '3p10s'. Avoids the digit-hyphen-digit filename patterns the
    content-integrity tests reject."""
    return ("%.2f" % seconds).replace(".", "p") + "s"


def stage_endframes():
    """Pull the four settle frames out of both sequences as standalone stills."""
    bpy.context.scene.render.image_settings.quality = 92
    for source, label in (("landscape", "desktop"), ("mobile", "mobile")):
        for seconds in END_FRAME_TIMES:
            src = os.path.join(MOTION_FRAMES_DIR, source,
                               "f_%04d.png" % at(seconds))
            img = bpy.data.images.load(src)
            img.pixels[0]      # load() is lazy; save() fails on an undecoded image
            img.file_format = "WEBP"
            dest = os.path.join(PREVIEWS_DIR, "buckle-motion-end-%s-%s.webp"
                                % (_time_label(seconds), label))
            img.filepath_raw = dest
            img.save()
            bpy.data.images.remove(img)
            log("end frame: %s" % os.path.basename(dest))


def stage_verify():
    """Measure, rather than eyeball, the two acceptance claims: that the
    canonical thread leaves the bottom of frame, and that the leather plate does
    not. Normalised camera coordinates — y < 0 is below the bottom edge, y > 1
    above the top, and the same for x on the sides."""
    from bpy_extras.object_utils import world_to_camera_view

    scene = bpy.context.scene
    report = {}

    for aspect, profile in PROFILES.items():
        cam = build_motion(aspect)
        thread = bpy.data.objects["routing_line"]
        plate = bpy.data.objects["inset_leather_panel"]
        scene.render.resolution_x, scene.render.resolution_y = profile["res"]

        rows = []
        for seconds in VERIFY_TIMES:
            scene.frame_set(at(seconds))
            # Only the drawn part of the spline is on screen: bevel_factor_end
            # truncates the tube, and the tail — the lowest point — is the last
            # thing to appear. Measuring the whole spline would over-report the
            # thread's reach at any frame before the growth completes.
            matrix = thread.matrix_world
            drawn = thread.data.bevel_factor_end
            points = [p for spline in thread.data.splines for p in spline.points]
            points = points[:max(2, int(round(len(points) * drawn)))]
            thread_pts = [world_to_camera_view(scene, cam, matrix @ p.co.to_3d())
                          for p in points]
            # Real vertices, not bound_box: the axis-aligned box's corners are
            # not points on a rounded-rect plate, so it over-reports the extent
            # and would fail a framing that is actually clean.
            plate_pts = [world_to_camera_view(scene, cam,
                                              plate.matrix_world @ v.co)
                         for v in plate.data.vertices]
            rows.append({
                "t": seconds,
                "frame": at(seconds),
                "thread_min_y": round(min(p.y for p in thread_pts), 4),
                "thread_crosses_bottom": min(p.y for p in thread_pts) < 0.0,
                "plate_x": [round(min(p.x for p in plate_pts), 4),
                            round(max(p.x for p in plate_pts), 4)],
                "plate_y": [round(min(p.y for p in plate_pts), 4),
                            round(max(p.y for p in plate_pts), 4)],
                "plate_fully_inside": (min(p.x for p in plate_pts) >= 0.0
                                       and max(p.x for p in plate_pts) <= 1.0
                                       and min(p.y for p in plate_pts) >= 0.0
                                       and max(p.y for p in plate_pts) <= 1.0),
            })
        report[aspect] = rows
        for row in rows:
            row["plate_margin"] = round(min(row["plate_x"][0], row["plate_y"][0],
                                            1.0 - row["plate_x"][1],
                                            1.0 - row["plate_y"][1]), 4)
            row["plate_h_safety"] = round(min(row["plate_x"][0],
                                              1.0 - row["plate_x"][1]), 4)
            log("%-9s t=%.2f  thread_y=%+.4f cross=%-5s  plate_y0=%+.4f "
                "h_safety=%+.4f in=%s"
                % (aspect, row["t"], row["thread_min_y"],
                   row["thread_crosses_bottom"], row["plate_y"][0],
                   row["plate_h_safety"], row["plate_fully_inside"]))

    # Acceptance, evaluated rather than asserted by hand.
    verdict = {}
    for aspect, rows in report.items():
        crossed = [r["t"] for r in rows if r["thread_crosses_bottom"]]
        verdict[aspect] = {
            "thread_crosses_by": min(crossed) if crossed else None,
            "thread_crosses_before_3_85": bool(crossed) and min(crossed) <= 3.85,
            "plate_fully_visible_throughout": all(r["plate_fully_inside"]
                                                  for r in rows),
            "min_horizontal_safety": min(r["plate_h_safety"] for r in rows),
            "horizontal_safety_at_least_2pc": min(r["plate_h_safety"]
                                                  for r in rows) >= 0.02,
        }
        log("VERDICT %-9s %s" % (aspect, json.dumps(verdict[aspect])))

    with open(os.path.join(LOGS_DIR, "motion-verification.json"), "w",
              encoding="utf-8") as fh:
        json.dump({"frames": report, "verdict": verdict}, fh, indent=2)


def stage_compare():
    """Side-by-side sheet: the pre-refinement aperture render on the left, the
    refined one on the right, same camera and same framing."""
    import numpy as np
    pairs = [os.path.join(LOGS_DIR, "aperture-before.webp"),
             os.path.join(PREVIEWS_DIR, "buckle-aperture-proof.webp")]
    planes = []
    for path in pairs:
        img = bpy.data.images.load(path)
        w, h = img.size
        planes.append(np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4))
    left, right = planes
    h = max(left.shape[0], right.shape[0])
    gap = 14
    out = np.zeros((h, left.shape[1] + gap + right.shape[1], 4), dtype=np.float32)
    out[:, :, 3] = 1.0
    out[:left.shape[0], :left.shape[1]] = left
    out[:right.shape[0], left.shape[1] + gap:] = right
    sheet = bpy.data.images.new("aperture_compare", width=out.shape[1],
                                height=out.shape[0])
    sheet.pixels = out.ravel().tolist()
    sheet.file_format = "WEBP"
    dest = os.path.join(PREVIEWS_DIR, "buckle-aperture-compare-before-after.webp")
    sheet.filepath_raw = dest
    sheet.save()
    log("comparison sheet written: %s (left = before, right = refined)"
        % os.path.basename(dest))


def stage_proof(which):
    cam, state, filename = PROOFS[which]
    render_to(os.path.join(PREVIEWS_DIR, filename), cam, STATE_FRAMES[state])


def stage_overlay():
    """Numeric silhouette check + visual overlay render."""
    import numpy as np
    scene = bpy.context.scene

    # 1. Transparent-film alpha render of the buckle alone, orthographic front.
    hidden = []
    for name in ("denim_ground", "denim_seam_stitches"):
        obj = bpy.data.objects.get(name)
        if obj:
            hidden.append((obj, obj.hide_render))
            obj.hide_render = True
    alpha_png = os.path.join(LOGS_DIR, "silhouette-alpha.png")
    render_to(alpha_png, "cam_front_ortho", STATE_FRAMES["illuminated"],
              fmt="PNG", samples=48, transparent=True, glare=False)
    for obj, prev in hidden:
        obj.hide_render = prev

    img = bpy.data.images.load(alpha_png)
    w, h = img.size
    px = np.array(img.pixels[:]).reshape(h, w, 4)
    mask = px[:, :, 3] > 0.5
    cols = np.where(mask.any(axis=0))[0]
    rows = np.where(mask.any(axis=1))[0]
    meas_w = int(cols[-1] - cols[0] + 1)
    meas_h = int(rows[-1] - rows[0] + 1)
    # Expected extents come from the sampled canonical path itself (including
    # its Bezier hull bulge), since that is what the mesh must overlay.
    sil = [to_world(p) for p in
           parse_path(CANON["paths"]["silhouette"]["d"])[0]["points"]]
    sil_w = max(p[0] for p in sil) - min(p[0] for p in sil)
    sil_h = max(p[1] for p in sil) - min(p[1] for p in sil)
    ortho = bpy.data.objects["cam_front_ortho"].data.ortho_scale
    px_per_m = scene.render.resolution_x / ortho
    exp_w = sil_w * px_per_m
    exp_h = sil_h * px_per_m
    report = {
        "expected_px": {"width": round(exp_w, 1), "height": round(exp_h, 1)},
        "measured_px": {"width": meas_w, "height": meas_h},
        "deviation_pct": {
            "width": round((meas_w - exp_w) / exp_w * 100.0, 3),
            "height": round((meas_h - exp_h) / exp_h * 100.0, 3),
        },
        "aspect": {"canonical": round(296.0 / 180.0, 4),
                   "measured": round(meas_w / meas_h, 4)},
        "tolerance_pct": 1.0,
    }
    report["pass"] = (abs(report["deviation_pct"]["width"]) <= 1.0
                      and abs(report["deviation_pct"]["height"]) <= 1.0)
    with open(os.path.join(LOGS_DIR, "silhouette-report.json"), "w",
              encoding="utf-8") as fh:
        json.dump(report, fh, indent=2)
    log("silhouette deviation: w %.3f%%  h %.3f%%  pass=%s"
        % (report["deviation_pct"]["width"], report["deviation_pct"]["height"],
           report["pass"]))

    # 2. Beauty overlay with the canonical outline glowing above the mesh.
    outline = bpy.data.objects["_qa_canonical_outline"]
    outline.hide_render = False
    render_to(os.path.join(PREVIEWS_DIR, "buckle-silhouette-overlay.webp"),
              "cam_front_ortho", STATE_FRAMES["illuminated"], samples=96,
              glare=False)
    outline.hide_render = True


# --------------------------------------------------------------------------- build

def stage_build():
    t0 = time.time()
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "MILLIMETERS"

    # wipe the startup scene entirely — cube, light, camera and their collection
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for coll in list(bpy.data.collections):
        bpy.data.collections.remove(coll)
    bpy.data.orphans_purge(do_recursive=True)

    for coll_name in ("buckle_assembly", "rig", "env", "_qa"):
        coll = bpy.data.collections.new(coll_name)
        scene.collection.children.link(coll)
    parts = bpy.data.collections["buckle_assembly"]
    rig = bpy.data.collections["rig"]
    env = bpy.data.collections["env"]
    qa = bpy.data.collections["_qa"]

    mats = build_materials()
    outline_sp = world_path(CANON["paths"]["silhouette"]["d"])[0]
    outline_w, _ = resample(outline_sp["points"], 0.0008, closed=True)
    monogram_w = world_path(CANON["paths"]["monogram"]["d"])

    log("building plate, rope rim, copper step, leather field")
    plate = build_plate(parts, mats["rim_silver"], outline_w)
    rope = build_rope(parts, mats["rim_silver"], outline_w)
    copper = build_copper(parts, mats["frame_copper"])
    leather = build_leather(parts, mats["inset_leather"], monogram_w)

    log("building stitches, stones, inlay, keeper, denim")
    x0, y0, x1, y1, r = LEATHER_RECT
    leather_stitches = build_stitches(
        "leather_perimeter_stitches", parts, mats["stitch_thread"],
        rounded_rect(x0 + 4, y0 + 4, x1 - 4, y1 - 4, r - 3),
        LEATHER_TOP + 0.00022)
    denim = build_denim(env, mats["backing_denim"])
    # Built in denim-local coordinates (z above the plane), then parented, so
    # the S3 recede keyframed on the denim carries the seam row with it.
    seam_stitches = build_stitches(
        "denim_seam_stitches", env, mats["stitch_thread"],
        rounded_rect(-52, -22, 372, 262, 30), 0.0003,
        pitch=0.003, length=0.0017, radius=0.0003)
    seam_stitches.parent = denim
    stones = build_stones(parts, mats["stone_turquoise"], mats["rim_silver"])
    inlay, inlay_halo = build_inlay(parts, mats["engraving_inlay"],
                                    mats["engraving_inlay_halo"], monogram_w)
    inlay_halo.visible_shadow = False
    keeper_objs = build_keeper(parts, mats["rim_silver"], mats["stud_brass"])
    exit_obj = build_exit(parts, mats["engraving_inlay"])
    overlay = build_overlay(qa, outline_w)

    log("splitting aperture halves at the centre seam")
    root = bpy.data.objects.new("buckle_root", None)
    half_l = bpy.data.objects.new("half_L", None)
    half_r = bpy.data.objects.new("half_R", None)
    core = bpy.data.objects.new("core_grp", None)
    concho = bpy.data.objects.new("concho_variant", None)   # owner artwork only
    concho.hide_render = concho.hide_viewport = True
    for empty in (root, half_l, half_r, core, concho):
        parts.objects.link(empty)
    for empty in (half_l, half_r, core, concho):
        empty.parent = root

    for src_obj in (plate, rope, copper):
        for suffix, keep_pos, parent in (("_L", False, half_l), ("_R", True, half_r)):
            dup = src_obj.copy()
            dup.data = src_obj.data.copy()
            dup.name = src_obj.name + suffix
            parts.objects.link(dup)
            bisect_into_halves(dup, keep_positive=keep_pos)
            dup.parent = parent
        bpy.data.objects.remove(src_obj, do_unlink=True)

    for obj in (leather, leather_stitches, inlay, inlay_halo, *keeper_objs):
        obj.parent = core
    for sid, cab, bez in stones:
        if sid == "W":
            cab.parent = bez.parent = half_l
        elif sid == "E":
            cab.parent = bez.parent = half_r
        else:
            cab.parent = bez.parent = core       # N/S sit on the seam; they
    exit_obj.parent = core                       # recede with the leather field

    log("lights, cameras, states")
    key, rim_light, fill = build_lights(rig)
    build_cameras(rig)
    build_compositor()
    key_states(key, fill, half_l, half_r, core, denim, exit_obj, seam_stitches,
               (mats["engraving_inlay"], mats["engraving_inlay_halo"]))
    scene.frame_set(STATE_FRAMES["illuminated"])
    configure_render()

    failures = validate()
    tri_count = sum(len(o.data.polygons) for o in bpy.data.objects
                    if o.type == "MESH")
    summary = {
        "blender": bpy.app.version_string,
        "built_at_frame_states": STATE_FRAMES,
        "materials": sorted(m.name for m in bpy.data.materials),
        "objects": sorted(o.name for o in bpy.data.objects),
        "approx_polys": tri_count,
        "validation_failures": failures,
        "build_seconds": round(time.time() - t0, 1),
    }
    with open(os.path.join(LOGS_DIR, "build-summary.json"), "w",
              encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2)
    if failures:
        for f in failures:
            log("VALIDATION FAIL: " + f)
        sys.exit(1)
    log("validation clean — %d polys, %.1fs" % (tri_count, summary["build_seconds"]))

    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    log("saved " + BLEND_PATH)


# ----------------------------------------------------------------------------- main

def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    args = dict(zip(argv[::2], argv[1::2]))
    stage = args.get("--stage", "build")
    if stage == "build":
        stage_build()
    elif stage == "proof":
        stage_proof(args["--which"])
    elif stage == "overlay":
        stage_overlay()
    elif stage == "compare":
        stage_compare()
    elif stage == "motion":
        stage_motion(args["--which"], int(args.get("--samples", 48)))
    elif stage == "encode":
        stage_encode(args["--which"])
    elif stage == "contact":
        stage_contact()
    elif stage == "endframes":
        stage_endframes()
    elif stage == "poster":
        stage_poster()
    elif stage == "verify":
        stage_verify()
    else:
        raise SystemExit("unknown stage: " + stage)


main()
