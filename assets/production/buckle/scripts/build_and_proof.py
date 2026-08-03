"""
L&B BUCKLE — BLENDER BUILD + PROOF RENDERS.

Run headless:
    blender -b -P assets/production/buckle/scripts/build_and_proof.py

Builds the master from the CANONICAL paths in ../source/canonical-paths.json — the exact
SVG data shipping in src/ui/frontier-ignition.tsx. Nothing is redrawn: the silhouette, the
copper frame, the stitch rows, the L&B monogram and the exit thread are imported and
converted to geometry. Authority: docs/assets/LB_BUCKLE_3D_PRODUCTION_BRIEF.md, the shot
list, Stitch Frames 8B/8C.

Outputs:
    blender/lb-buckle-master.blend
    renders/previews/buckle-front-proof.webp        (dormant, hero camera)
    renders/previews/buckle-three-quarter-proof.webp (illuminated, 3/4 camera)
    renders/previews/buckle-illuminated-proof.webp   (illuminated, hero camera)
    renders/previews/buckle-aperture-proof.webp      (opened, hero camera)
    renders/previews/buckle-front-ortho.png          (orthographic — silhouette check)

Prohibited and absent by construction: circular/coin geometry, badge styling, reticles,
any date, any text beyond the monogram, automotive anything, invented longhorn artwork
(the concho variant is an EMPTY awaiting owner artwork).
"""

import json
import math
import os
import sys

import bpy
from mathutils import Vector

# ----------------------------------------------------------------------------- paths

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)  # assets/production/buckle
SOURCE = os.path.join(ROOT, "source", "canonical-paths.json")
BLEND_OUT = os.path.join(ROOT, "blender", "lb-buckle-master.blend")
PREVIEWS = os.path.join(ROOT, "renders", "previews")

with open(SOURCE, "r", encoding="utf-8") as fh:
    CANON = json.load(fh)

# metres per proof-unit: 92 mm across 296 units
S = 0.092 / CANON["referenceScale"]["buckleWidthUnits"]
CX, CY = 160.0, 120.0  # viewBox centre

DEPTH = 0.0065          # 7% of width — object depth
CHAMFER = 0.0037        # 45° chamfer width (4% of width)
FRONT_Z = DEPTH         # front face height; back face at z=0
LEATHER_TOP = FRONT_Z - 0.0009
INLAY_R = 0.00035
CHANNEL_R = 0.0006

FRAMES = {"dormant": 1, "illuminated": 10, "aperture": 20, "routing": 30}


def log(msg):
    print(f"[buckle] {msg}", flush=True)


def to_world(x, y):
    """SVG viewBox (y down) -> Blender XY plane (y up), metres, centred."""
    return ((x - CX) * S, (CY - y) * S)


# ----------------------------------------------------------------------------- svg path parsing

def parse_path(d):
    """Absolute M/L/Q/C/Z only — which is all the canonical paths use.
    Returns a list of subpaths; each subpath is a list of cubic segments
    (p0, c1, c2, p1) in world metres. Q is elevated to cubic exactly."""
    tokens = d.replace(",", " ").split()
    i, cur, start = 0, None, None
    subpaths, segs = [], []

    def flushsub():
        nonlocal segs
        if segs:
            subpaths.append(segs)
            segs = []

    def num():
        nonlocal i
        v = float(tokens[i])
        i += 1
        return v

    while i < len(tokens):
        t = tokens[i]
        if t in "MLQCZz":
            i += 1
            cmd = t
        else:
            cmd = last_cmd  # implicit repeat
        if cmd == "M":
            flushsub()
            cur = (num(), num())
            start = cur
        elif cmd == "L":
            p = (num(), num())
            a, b = Vector(to_world(*cur)), Vector(to_world(*p))
            segs.append((a, a + (b - a) / 3, b - (b - a) / 3, b))
            cur = p
        elif cmd == "Q":
            q = (num(), num())
            p = (num(), num())
            p0, qq, p1 = Vector(to_world(*cur)), Vector(to_world(*q)), Vector(to_world(*p))
            c1 = p0 + (qq - p0) * (2 / 3)
            c2 = p1 + (qq - p1) * (2 / 3)
            segs.append((p0, c1, c2, p1))
            cur = p
        elif cmd == "C":
            c1v = (num(), num())
            c2v = (num(), num())
            p = (num(), num())
            segs.append(
                (
                    Vector(to_world(*cur)),
                    Vector(to_world(*c1v)),
                    Vector(to_world(*c2v)),
                    Vector(to_world(*p)),
                )
            )
            cur = p
        elif cmd in "Zz":
            if cur != start:
                a, b = Vector(to_world(*cur)), Vector(to_world(*start))
                segs.append((a, a + (b - a) / 3, b - (b - a) / 3, b))
            cur = start
        last_cmd = cmd
    flushsub()
    return subpaths


def make_curve(name, subpaths, closed, z=0.0, bevel_depth=0.0, fill=False, twod=True):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "2D" if twod else "3D"
    cu.fill_mode = "BOTH" if fill else ("FULL" if not twod else "NONE")
    cu.bevel_depth = bevel_depth
    cu.resolution_u = 24
    for segs in subpaths:
        sp = cu.splines.new("BEZIER")
        n = len(segs) + (0 if closed else 1)
        sp.bezier_points.add(n - 1)
        # points: seg starts, plus final end when open
        for k in range(n):
            bp = sp.bezier_points[k]
            if k < len(segs):
                p0 = segs[k][0]
            else:
                p0 = segs[-1][3]
            bp.co = (p0.x, p0.y, 0.0)
            bp.handle_left_type = bp.handle_right_type = "FREE"
        for k, (p0, c1, c2, p1) in enumerate(segs):
            sp.bezier_points[k].handle_right = (c1.x, c1.y, 0.0)
            nxt = sp.bezier_points[(k + 1) % n]
            nxt.handle_left = (c2.x, c2.y, 0.0)
        first, last = sp.bezier_points[0], sp.bezier_points[-1]
        if closed:
            sp.use_cyclic_u = True
        else:
            first.handle_left = first.co
            last.handle_right = last.co
    ob = bpy.data.objects.new(name, cu)
    ob.location.z = z
    bpy.context.collection.objects.link(ob)
    return ob


# ----------------------------------------------------------------------------- helpers

def activate(ob):
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob


def apply_all_modifiers(ob):
    activate(ob)
    for m in list(ob.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=m.name)
        except Exception as e:  # noqa: BLE001
            log(f"WARN modifier {m.name} on {ob.name}: {e}")


def smooth(ob, angle=35):
    activate(ob)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:
        try:
            bpy.ops.object.shade_smooth()
        except Exception as e:  # noqa: BLE001
            log(f"WARN smooth {ob.name}: {e}")


def principled(name, base, rough, metal, emission=None, aniso=0.0, sheen=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    for key, val in (("Anisotropic", aniso), ("Sheen Weight", sheen)):
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = val
    if emission is not None:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 0.0
    return mat


def bump_noise(mat, scale=900.0, strength=0.18, detail=6.0):
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = detail
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


def bump_twill(mat, scale=1400.0, strength=0.35):
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.inputs["Scale"].default_value = scale
    wave.inputs["Distortion"].default_value = 4.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


def key_const(obj_or_id, data_path, frame, value):
    """Keyframe with CONSTANT interpolation so states never tween into stills."""
    ok = True
    try:
        if data_path.endswith("]"):
            # node input style: pass the input socket directly
            obj_or_id.default_value = value
            obj_or_id.keyframe_insert(data_path="default_value", frame=frame)
            anim = obj_or_id.id_data.animation_data
        else:
            setattr(obj_or_id, data_path, value)
            obj_or_id.keyframe_insert(data_path=data_path, frame=frame)
            anim = getattr(obj_or_id, "animation_data", None) or obj_or_id.id_data.animation_data
        if anim and anim.action:
            for fc in anim.action.fcurves:
                for kp in fc.keyframe_points:
                    kp.interpolation = "CONSTANT"
    except Exception as e:  # noqa: BLE001
        ok = False
        log(f"WARN keyframe {data_path}@{frame}: {e}")
    return ok


# ----------------------------------------------------------------------------- scene reset

log("resetting scene")
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.render.engine = "CYCLES"
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.view_settings.view_transform = "AgX"
try:
    scene.view_settings.look = "AgX - Base Contrast"
except Exception:
    scene.view_settings.look = "None"
scene.render.resolution_x = 960
scene.render.resolution_y = 720
scene.render.film_transparent = False

world = bpy.data.worlds.new("lb_world")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0

# ----------------------------------------------------------------------------- materials

MAT = {
    "rim_silver": principled("mat_rim_silver", (0.42, 0.41, 0.39), 0.42, 1.0, aniso=0.6),
    "frame_copper": principled("mat_frame_copper", (0.43, 0.26, 0.15), 0.5, 1.0),
    "inset_leather": principled("mat_inset_leather", (0.353, 0.227, 0.141), 0.55, 0.0, sheen=0.15),
    "backing_denim": principled("mat_backing_denim", (0.075, 0.115, 0.20), 0.75, 0.0),
    "stitch_thread": principled("mat_stitch_thread", (0.851, 0.772, 0.698), 0.6, 0.0),
    "stone_turquoise": principled("mat_stone_turquoise", (0.145, 0.494, 0.474), 0.25, 0.0),
    "stud_brass": principled("mat_stud_brass", (0.55, 0.38, 0.16), 0.45, 1.0),
    "engraving_inlay": principled(
        "mat_engraving_inlay", (0.02, 0.02, 0.02), 0.35, 0.0, emission=(0.498, 0.878, 0.839)
    ),
}
bump_noise(MAT["inset_leather"], scale=650, strength=0.3, detail=8)  # tooling suggestion (proof)
bump_twill(MAT["backing_denim"])
bump_noise(MAT["rim_silver"], scale=2400, strength=0.05, detail=2)  # brush

INLAY_STRENGTH = MAT["engraving_inlay"].node_tree.nodes["Principled BSDF"].inputs[
    "Emission Strength"
]

# ----------------------------------------------------------------------------- body

log("building body from canonical silhouette")
sil = parse_path(CANON["paths"]["silhouette"]["d"])
body_curve = make_curve("body_curve", sil, closed=True, fill=True)
activate(body_curve)
bpy.ops.object.convert(target="MESH")
body = bpy.context.view_layer.objects.active
body.name = "buckle_body"

solid = body.modifiers.new("solid", "SOLIDIFY")
solid.thickness = DEPTH
solid.offset = 1.0  # extrude toward -z; front face stays the drawn plane
bev = body.modifiers.new("chamfer", "BEVEL")
bev.width = CHAMFER * 0.55
bev.segments = 2
bev.profile = 0.72
bev.limit_method = "ANGLE"
bev.angle_limit = math.radians(40)
apply_all_modifiers(body)
body.location.z = FRONT_Z  # front face at FRONT_Z, back at 0 after solidify -z
smooth(body, 30)
body.data.materials.append(MAT["rim_silver"])

# ----------------------------------------------------------------------------- rope rim

log("rope-twist rim")
rope_profile = bpy.data.curves.new("rope_profile", "CURVE")
rope_profile.dimensions = "2D"
sp = rope_profile.splines.new("NURBS")
LOBES, PTS = 7, 28
sp.points.add(PTS - 1)
for k in range(PTS):
    a = 2 * math.pi * k / PTS
    r = 0.0010 + 0.00035 * math.sin(LOBES * a)
    sp.points[k].co = (r * math.cos(a), r * math.sin(a), 0, 1)
sp.use_cyclic_u = True
rope_prof_ob = bpy.data.objects.new("rope_profile", rope_profile)
bpy.context.collection.objects.link(rope_prof_ob)
rope_prof_ob.hide_render = True

rope = make_curve("rim_rope", sil, closed=True, twod=False)
rope.data.dimensions = "3D"
rope.data.bevel_mode = "OBJECT"
rope.data.bevel_object = rope_prof_ob
for spn in rope.data.splines:
    for idx, bp in enumerate(spn.bezier_points):
        bp.tilt = idx * math.radians(160)
rope.location.z = FRONT_Z - 0.0004
rope.scale = (0.985, 0.977, 1.0)  # sit just inside the chamfered edge
rope.data.materials.append(MAT["rim_silver"])

# ----------------------------------------------------------------------------- copper frame

log("copper frame")
cop = parse_path(CANON["paths"]["copperFrame"]["d"])
copper = make_curve("frame_copper", cop, closed=True, bevel_depth=0.0011)
copper.location.z = FRONT_Z + 0.0002
copper.data.materials.append(MAT["frame_copper"])

# ----------------------------------------------------------------------------- leather inset

log("leather inset")
# Parametric rounded rectangle inside the copper frame (frame path spans 42..278 / 46..194)
LX0, LX1, LY0, LY1, LR = 47.0, 273.0, 51.0, 189.0, 9.0
d_leather = (
    f"M{LX0 + LR} {LY0} L{LX1 - LR} {LY0} Q{LX1} {LY0} {LX1} {LY0 + LR} "
    f"L{LX1} {LY1 - LR} Q{LX1} {LY1} {LX1 - LR} {LY1} L{LX0 + LR} {LY1} "
    f"Q{LX0} {LY1} {LX0} {LY1 - LR} L{LX0} {LY0 + LR} Q{LX0} {LY0} {LX0 + LR} {LY0} Z"
)
lea = parse_path(d_leather)
leather_curve = make_curve("leather_curve", lea, closed=True, fill=True)
activate(leather_curve)
bpy.ops.object.convert(target="MESH")
leather = bpy.context.view_layer.objects.active
leather.name = "inset_leather"
lsolid = leather.modifiers.new("solid", "SOLIDIFY")
lsolid.thickness = 0.002
lsolid.offset = 1.0
apply_all_modifiers(leather)
leather.location.z = LEATHER_TOP
smooth(leather, 45)
leather.data.materials.append(MAT["inset_leather"])

# ----------------------------------------------------------------------------- engraving

log("engraving: channel boolean + luminous inlay (canonical monogram)")
mono = parse_path(CANON["paths"]["monogram"]["d"])

cutter = make_curve("engrave_cutter", mono, closed=False, twod=False, bevel_depth=CHANNEL_R)
cutter.data.dimensions = "3D"
cutter.data.use_fill_caps = True
cutter.location.z = LEATHER_TOP
activate(cutter)
bpy.ops.object.convert(target="MESH")
cutter = bpy.context.view_layer.objects.active
boo = leather.modifiers.new("engrave", "BOOLEAN")
boo.operation = "DIFFERENCE"
boo.object = cutter
boo.solver = "EXACT"
apply_all_modifiers(leather)
bpy.data.objects.remove(cutter, do_unlink=True)

inlay = make_curve("engraving_inlay", mono, closed=False, twod=False, bevel_depth=INLAY_R)
inlay.data.dimensions = "3D"
inlay.data.use_fill_caps = True
inlay.location.z = LEATHER_TOP - CHANNEL_R * 0.4 + 0.0002
inlay.data.materials.append(MAT["engraving_inlay"])

# ----------------------------------------------------------------------------- stones

log("four cardinal turquoise cabochons")
stones = []
for st in CANON["turquoiseStones"]:
    x, y = to_world(st["x"], st["y"])
    r = st["radiusUnits"] * S
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, FRONT_Z + 0.0006))
    stone = bpy.context.view_layer.objects.active
    stone.name = f"stone_{st['id']}"
    stone.scale.z = 0.55
    smooth(stone, 60)
    stone.data.materials.append(MAT["stone_turquoise"])
    bpy.ops.mesh.primitive_torus_add(
        major_radius=r * 1.12, minor_radius=0.00028, location=(x, y, FRONT_Z + 0.0004)
    )
    bezel = bpy.context.view_layer.objects.active
    bezel.name = f"bezel_{st['id']}"
    smooth(bezel, 60)
    bezel.data.materials.append(MAT["rim_silver"])
    stones.append((st["id"], stone, bezel))

# ----------------------------------------------------------------------------- stitches

log("saddle stitches along canonical rows")
stitch_objs = []
for row_y in (56.0, 184.0):
    _, wy = to_world(0, row_y)
    xw0, _ = to_world(60, 0)
    xw1, _ = to_world(260, 0)
    n = int((xw1 - xw0) / 0.0024)
    for k in range(n + 1):
        x = xw0 + k * 0.0024
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.00025, depth=0.0014, location=(x + 0.0005, wy, LEATHER_TOP + 0.0002)
        )
        stich = bpy.context.view_layer.objects.active
        stich.rotation_euler = (0, math.radians(90), 0)
        stich.data.materials.append(MAT["stitch_thread"])
        stitch_objs.append(stich)
log(f"  {len(stitch_objs)} stitches")

# ----------------------------------------------------------------------------- keeper + brass (back)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.0035))
keeper = bpy.context.view_layer.objects.active
keeper.name = "keeper"
keeper.scale = (0.012, 0.028, 0.0025)
keeper.data.materials.append(MAT["rim_silver"])
for sx in (-0.02, 0.02):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.001, location=(sx, 0, -0.0018))
    stud = bpy.context.view_layer.objects.active
    stud.name = f"stud_{'L' if sx < 0 else 'R'}"
    stud.scale.z = 0.5
    stud.data.materials.append(MAT["stud_brass"])

# Owner-artwork placeholder ONLY — never generated here (prohibited: invented longhorn).
concho = bpy.data.objects.new("concho_variant_EMPTY_owner_artwork_only", None)
bpy.context.collection.objects.link(concho)
concho.hide_render = True

# ----------------------------------------------------------------------------- aperture halves

log("aperture halves via bisect")
halves = []
for side, keep_positive in (("R", True), ("L", False)):
    activate(body)
    bpy.ops.object.duplicate()
    half = bpy.context.view_layer.objects.active
    half.name = f"half_{side}"
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.bisect(
        plane_co=(0, 0, 0),
        plane_no=(1, 0, 0),
        use_fill=True,
        clear_inner=keep_positive,
        clear_outer=not keep_positive,
    )
    bpy.ops.object.mode_set(mode="OBJECT")
    halves.append(half)

# ----------------------------------------------------------------------------- exit thread

exitp = parse_path(CANON["paths"]["exitThread"]["d"])
exit_thread = make_curve("route_exit_thread", exitp, closed=False, twod=False, bevel_depth=0.0004)
exit_thread.data.dimensions = "3D"
exit_thread.location.z = LEATHER_TOP + 0.0004
exit_thread.data.materials.append(MAT["engraving_inlay"])

# ----------------------------------------------------------------------------- denim ground

bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -0.0062))
denim = bpy.context.view_layer.objects.active
denim.name = "denim_ground"
denim.scale = (0.24, 0.18, 1)
denim.data.materials.append(MAT["backing_denim"])

# ----------------------------------------------------------------------------- lights

log("light rig: 3200K raking key + 5600K rim")
key_data = bpy.data.lights.new("key_3200K", "AREA")
key_data.shape = "RECTANGLE"
key_data.size = 0.46
key_data.size_y = 0.07
key_data.color = (1.0, 0.72, 0.45)
key_data.energy = 60
key = bpy.data.objects.new("light_key", key_data)
bpy.context.collection.objects.link(key)
key.location = (-0.17, 0.01, 0.055)

rim_data = bpy.data.lights.new("rim_5600K", "AREA")
rim_data.size = 0.10
rim_data.color = (0.78, 0.87, 1.0)
rim_data.energy = 22
rim = bpy.data.objects.new("light_rim", rim_data)
bpy.context.collection.objects.link(rim)
rim.location = (0.13, 0.11, 0.15)

target = bpy.data.objects.new("lookat", None)
bpy.context.collection.objects.link(target)
for lt in (key, rim):
    c = lt.constraints.new("TRACK_TO")
    c.target = target
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"

# ----------------------------------------------------------------------------- cameras

def add_cam(name, loc, lens=None, ortho_scale=None):
    cd = bpy.data.cameras.new(name)
    if ortho_scale:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho_scale
    if lens:
        cd.lens = lens
    cam = bpy.data.objects.new(name, cd)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    c = cam.constraints.new("TRACK_TO")
    c.target = target
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return cam


BW = 0.092
cam_ortho = add_cam("cam_front_ortho", (0, 0, 0.5), ortho_scale=BW * 1.10)
cam_hero = add_cam("cam_hero", (0, 0.021, 0.238), lens=35)
d34 = 2.4 * BW
cam_34 = add_cam(
    "cam_34",
    (
        d34 * math.sin(math.radians(30)) * math.cos(math.radians(12)),
        d34 * math.sin(math.radians(12)),
        d34 * math.cos(math.radians(30)) * math.cos(math.radians(12)),
    ),
    lens=50,
)
add_cam("cam_macro_engraving", (0.004, -0.006, 0.055), lens=100)
add_cam("cam_macro_stone_E", (0.052, 0.004, 0.035), lens=100)

# ----------------------------------------------------------------------------- states

log("keyframing states: dormant / illuminated / aperture / routing")
f = FRAMES
# key light: 5% dormant, full otherwise
key_const(key_data, "energy", f["dormant"], 3.0)
key_const(key_data, "energy", f["illuminated"], 60.0)
# inlay emission
key_const(INLAY_STRENGTH, "[emission]", f["dormant"], 0.0)
key_const(INLAY_STRENGTH, "[emission]", f["illuminated"], 22.0)
# body vs halves
for frame, body_hidden in ((f["dormant"], False), (f["aperture"], True), (f["routing"], False)):
    key_const(body, "hide_render", frame, body_hidden)
    key_const(body, "hide_viewport", frame, body_hidden)
for half, direction in ((halves[0], 1), (halves[1], -1)):
    key_const(half, "hide_render", f["dormant"], True)
    key_const(half, "hide_render", f["aperture"], False)
    key_const(half, "hide_render", f["routing"], True)
    key_const(half, "location", f["dormant"], (0, 0, FRONT_Z))
    half.location = (direction * 0.030, 0, FRONT_Z)
    half.keyframe_insert(data_path="location", frame=f["aperture"])
    half.location = (0, 0, FRONT_Z)
    half.keyframe_insert(data_path="location", frame=f["routing"])
# leather/inlay/denim recede in aperture
for ob, base_z in ((leather, LEATHER_TOP), (denim, -0.0062)):
    key_const(ob, "location", f["dormant"], (0, 0, base_z))
    ob.location = (0, 0, base_z - 0.012)
    ob.keyframe_insert(data_path="location", frame=f["aperture"])
    ob.location = (0, 0, base_z)
    ob.keyframe_insert(data_path="location", frame=f["routing"])
# exit thread only in routing
key_const(exit_thread, "hide_render", f["dormant"], True)
key_const(exit_thread, "hide_render", f["routing"], False)

# force constant interpolation everywhere
for action in bpy.data.actions:
    for fc in action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "CONSTANT"

# ----------------------------------------------------------------------------- save master

os.makedirs(os.path.dirname(BLEND_OUT), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUT)
log(f"master saved: {BLEND_OUT}")

# ----------------------------------------------------------------------------- proof renders

os.makedirs(PREVIEWS, exist_ok=True)


def render(cam, frame, filename, fmt="WEBP", res=(960, 720)):
    scene.camera = cam
    scene.frame_set(frame)
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.image_settings.file_format = fmt
    if fmt == "WEBP":
        scene.render.image_settings.quality = 90
    scene.render.filepath = os.path.join(PREVIEWS, filename)
    log(f"rendering {filename} (cam={cam.name}, frame={frame})")
    bpy.ops.render.render(write_still=True)


render(cam_hero, FRAMES["dormant"], "buckle-front-proof.webp")
render(cam_34, FRAMES["illuminated"], "buckle-three-quarter-proof.webp")
render(cam_hero, FRAMES["illuminated"], "buckle-illuminated-proof.webp")
render(cam_hero, FRAMES["aperture"], "buckle-aperture-proof.webp")
render(cam_ortho, FRAMES["illuminated"], "buckle-front-ortho.png", fmt="PNG", res=(1100, 825))

log("ALL PROOFS DONE")
sys.exit(0)
