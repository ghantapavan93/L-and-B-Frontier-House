"""L&B hero continuation — abstract fibre field. Blender 5.x, headless.

Continues the approved buckle ignition: the canonical turquoise fibre leaves the
buckle and descends through a suspended field of loose indigo warp-and-weft
strands, which separate into deep negative space for HTML copy.

Why this is built rather than generated: the failure that rejected generation
candidate 1 was constructed garments — pockets, plackets, belt loops, a branded
shank button. Here the geometry is authored, so a garment is not merely
prohibited, it is *unrepresentable*. There is no cloth surface in the scene at
all: only individual strands suspended in space with air between them.

  --stage build                    write blender/lb-fibre-field.blend
  --stage render --which desktop|mobile [--samples N]
  --stage encode --which desktop|mobile
  --stage hero   --which desktop|mobile      buckle 4.00s + continuation 6.00s

Duration is exactly 6.00 s: 144 frames at 24 fps. 144 frames PLAY for 6.000 s —
the ignition's 97-rendered/96-encoded lesson applies, so this renders exactly the
number of frames it encodes.
"""

import bpy
import json
import math
import os
import random
import sys
import time

from mathutils import Euler, Vector

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, os.pardir))
BLEND_PATH = os.path.join(ROOT, "blender", "lb-fibre-field.blend")
FRAMES_DIR = os.path.join(ROOT, "logs", "fibre-frames")
EXPORTS_DIR = os.path.join(ROOT, "exports")
CAMPAIGN_DIR = os.path.abspath(
    os.path.join(ROOT, os.pardir, os.pardir, "source", "campaign")
)
REVIEW_DIR = os.path.join(ROOT, "renders", "review")
LOGS_DIR = os.path.join(ROOT, "logs")

FPS = 24
LAST = 144                       # 144 frames at 24 fps = 6.000 s exactly
SEED = 20260803

# Scene extent, metres. The camera travels down Y; the field fills a volume
# around that path rather than sitting on a plane — a plane of threads would read
# as cloth, which is the one thing this may never become.
#
# Scale is set by real optics rather than by taste. A 90 mm lens on a 36 mm
# sensor at 0.30 m frames 120 mm across, so a strand that reads at 2-3% of frame
# width has to be ~2-3 mm thick. Authoring millimetre fibres and then flying a
# camera metres through them — the first attempt — puts the lens at 9x
# magnification, where depth of field is microscopic and everything is a blur.
FIELD_TOP = 0.12
FIELD_BOTTOM = -0.80
CAM_Y_START = 0.02
CAM_Y_END = -0.62

PROFILES = {
    "desktop": {"res": (1920, 1080), "lens": 90.0, "dist": 0.30, "fstop": 8.0},
    "mobile": {"res": (1080, 1920), "lens": 80.0, "dist": 0.34, "fstop": 9.0},
}


def log(msg):
    print("[lb-fibre] " + msg, flush=True)


def hexc(h):
    h = h.lstrip("#")

    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return tuple(lin(int(h[i:i + 2], 16)) for i in (0, 2, 4))


# ----------------------------------------------------------------------- materials

def _principled(mat):
    mat.use_nodes = True
    tree = mat.node_tree
    bsdf = tree.nodes.get("Principled BSDF")
    return tree, bsdf


def _set(bsdf, names, value):
    for n in names:
        if n in bsdf.inputs:
            bsdf.inputs[n].default_value = value
            return


def build_materials():
    mats = {}

    # Indigo strand. Fibre is not a smooth dielectric rod: sheen is what stops it
    # reading as plastic tubing at macro scale.
    m = bpy.data.materials.new("fibre_indigo")
    tree, bsdf = _principled(m)
    _set(bsdf, ["Base Color"], hexc("22344f") + (1.0,))
    _set(bsdf, ["Roughness"], 0.68)
    _set(bsdf, ["Sheen Weight", "Sheen"], 1.0)
    _set(bsdf, ["Sheen Roughness"], 0.28)
    _set(bsdf, ["Sheen Tint"], (0.62, 0.70, 0.85, 1.0))
    _set(bsdf, ["Specular IOR Level", "Specular"], 0.18)
    _set(bsdf, ["Subsurface Weight", "Subsurface"], 0.12)
    _set(bsdf, ["Subsurface Radius"], (0.0006, 0.0009, 0.0016))
    mats["fibre_indigo"] = m

    # A sparse bone strand keeps the field from reading as a single flat colour.
    m = bpy.data.materials.new("fibre_bone")
    tree, bsdf = _principled(m)
    _set(bsdf, ["Base Color"], hexc("d9c5b2") + (1.0,))
    _set(bsdf, ["Roughness"], 0.55)
    _set(bsdf, ["Sheen Weight", "Sheen"], 1.0)
    _set(bsdf, ["Subsurface Weight", "Subsurface"], 0.18)
    _set(bsdf, ["Subsurface Radius"], (0.0018, 0.0014, 0.0010))
    mats["fibre_bone"] = m

    # Restrained copper warmth, a very small proportion of strands.
    m = bpy.data.materials.new("fibre_copper")
    tree, bsdf = _principled(m)
    _set(bsdf, ["Base Color"], hexc("6b452b") + (1.0,))
    _set(bsdf, ["Metallic"], 0.55)
    _set(bsdf, ["Roughness"], 0.48)
    mats["fibre_copper"] = m

    # The canonical luminous fibre. Same colours as the buckle inlay so the cut at
    # 4.00 s lands on a continuous object rather than a lookalike.
    m = bpy.data.materials.new("fibre_turquoise")
    m.use_nodes = True
    tree = m.node_tree
    out = tree.nodes["Material Output"]
    old = tree.nodes.get("Principled BSDF")
    if old:
        tree.nodes.remove(old)
    emit = tree.nodes.new("ShaderNodeEmission")
    lw = tree.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.4
    mix = tree.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = hexc("7fe0d6") + (1.0,)
    mix.inputs[7].default_value = hexc("d6fff9") + (1.0,)
    tree.links.new(lw.outputs["Facing"], mix.inputs[0])
    tree.links.new(mix.outputs[2], emit.inputs["Color"])
    emit.inputs["Strength"].default_value = 3.0
    tree.links.new(emit.outputs[0], out.inputs["Surface"])
    mats["fibre_turquoise"] = m

    return mats


# ------------------------------------------------------------------------ geometry

def strand(name, points, radius, material, collection, taper=True):
    """A single fibre.

    NURBS, not POLY. A poly spline renders its control points as literal corners,
    which is what made the first field read as bent wire rather than spun thread —
    the giveaway that says "computer graphics" before any other cue does. Order-4
    NURBS interpolates through the same points as a smooth curve, so the strand
    bends the way a suspended fibre bends.

    Real thread is also not a constant-diameter rod: `taper` runs the radius down
    toward each end so strands resolve into the dark instead of stopping dead.
    """
    curve = bpy.data.curves.new(name, type="CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 8
    curve.resolution_u = 12
    curve.use_fill_caps = True
    spline = curve.splines.new("NURBS")
    spline.points.add(len(points) - 1)
    for i, p in enumerate(points):
        spline.points[i].co = (p[0], p[1], p[2], 1.0)
    spline.order_u = 4
    spline.use_endpoint_u = True
    if taper:
        curve.taper_object = _taper_profile()
        curve.taper_radius_mode = "OVERRIDE"
    obj = bpy.data.objects.new(name, curve)
    obj.data.materials.append(material)
    collection.objects.link(obj)
    return obj


_TAPER_CACHE = {}


def _taper_profile():
    """One shared taper curve: full thickness through the middle, easing to a
    point at both ends. Shared rather than duplicated so 300+ strands cost one
    datablock, not 300."""
    if "obj" in _TAPER_CACHE:
        return _TAPER_CACHE["obj"]
    curve = bpy.data.curves.new("fibre_taper", type="CURVE")
    curve.dimensions = "3D"
    spline = curve.splines.new("NURBS")
    profile = [(0.0, 0.06, 0.0), (0.25, 1.0, 0.0), (0.75, 1.0, 0.0), (1.0, 0.06, 0.0)]
    spline.points.add(len(profile) - 1)
    for i, p in enumerate(profile):
        spline.points[i].co = (p[0], p[1], p[2], 1.0)
    spline.order_u = 3
    spline.use_endpoint_u = True
    obj = bpy.data.objects.new("fibre_taper", curve)
    obj.hide_render = obj.hide_viewport = True
    bpy.context.scene.collection.objects.link(obj)
    _TAPER_CACHE["obj"] = obj
    return obj


def density_at(y):
    """Strand density along the descent.

    Near zero at the very top (the fibre falls through darkness), full through the
    middle, then falling away to nothing at the bottom so the field *separates*
    into the clean editorial opening the brief asks for. The separation is
    geometric, not a fade — nothing is faked with opacity.
    """
    if y > 0.02:
        return 0.12                                   # near-total darkness
    if y > -0.14:
        return 0.12 + 0.88 * (0.02 - y) / 0.16        # entering the field
    if y > -0.30:
        return 1.0                                    # dense passage
    if y > -0.52:
        return max(0.0, 1.0 - (-0.30 - y) / 0.22)     # strands separate
    return 0.0                                        # clean editorial opening


def build_field(collection, mats, rng):
    counts = {"warp": 0, "weft": 0}

    # WARP — long strands running with the descent, swept in x/z so they never
    # align into a sheet.
    y = FIELD_TOP
    while y > FIELD_BOTTOM:
        band = density_at(y)
        for _ in range(int(round(band * 17))):
            x0 = rng.uniform(-0.11, 0.11)
            z0 = rng.uniform(-0.20, -0.02)
            length = rng.uniform(0.16, 0.40)
            pts, steps = [], 16
            for s in range(steps + 1):
                t = s / steps
                pts.append((
                    x0 + math.sin(t * 4.7 + x0 * 90.0) * 0.026 + rng.uniform(-0.004, 0.004),
                    y - t * length,
                    z0 + math.cos(t * 3.3 + z0 * 70.0) * 0.020,
                ))
            mat = mats["fibre_indigo"]
            roll = rng.random()
            if roll > 0.96:
                mat = mats["fibre_bone"]
            elif roll > 0.945:
                mat = mats["fibre_copper"]
            strand("warp_%03d" % counts["warp"], pts,
                   rng.uniform(0.00022, 0.00068), mat, collection)
            counts["warp"] += 1
        y -= 0.028

    # WEFT — crossing strands. Deliberately short and irregularly spaced: a
    # regular grid of crossings is a weave, and a weave is a fabric.
    y = FIELD_TOP - 0.03
    while y > FIELD_BOTTOM + 0.05:
        band = density_at(y)
        for _ in range(int(round(band * 9))):
            z0 = rng.uniform(-0.20, -0.02)
            y0 = y + rng.uniform(-0.014, 0.014)
            span = rng.uniform(0.10, 0.24)
            x0 = rng.uniform(-0.14, 0.02)
            pts, steps = [], 12
            for s in range(steps + 1):
                t = s / steps
                pts.append((
                    x0 + t * span,
                    y0 + math.sin(t * 2.8 + y0 * 22.0) * 0.012,
                    z0 + math.cos(t * 3.4) * 0.010,
                ))
            mat = mats["fibre_bone"] if rng.random() > 0.9 else mats["fibre_indigo"]
            strand("weft_%03d" % counts["weft"], pts,
                   rng.uniform(0.00018, 0.00055), mat, collection)
            counts["weft"] += 1
        y -= 0.040

    return counts


def build_luminous_fibre(collection, mats):
    """The canonical fibre. One strand — the brief says no extra turquoise fibres,
    and continuity with the buckle depends on there being exactly one."""
    pts, steps = [], 220
    for s in range(steps + 1):
        t = s / steps
        y = FIELD_TOP + 0.25 - t * (FIELD_TOP + 0.25 - (FIELD_BOTTOM + 0.15))
        # A slow S through the field, resolving to lower-centre and settling.
        settle = min(1.0, max(0.0, (t - 0.78) / 0.22))
        x = math.sin(t * 5.2) * 0.030 * (1.0 - settle)
        z = math.cos(t * 3.7) * 0.020 * (1.0 - settle)
        pts.append((x, y, z))
    return strand("luminous_fibre", pts, 0.0011, mats["fibre_turquoise"],
                  collection, taper=False)


# --------------------------------------------------------------------- rig / motion

def build_lights(collection):
    """The rig is authored in CAMERA space and parented to the camera.

    The first attempt aimed both lights at the world origin once, at build time.
    Six seconds later the camera was half a metre below that point and the key was
    pointing at nothing — every frame past the opening rendered black. Riding with
    the camera is also what the brief asks for: one consistent raking angle for
    the whole descent, not a light the subject travels away from.
    """

    def blackbody(light, kelvin):
        light.data.use_nodes = True
        tree = light.data.node_tree
        emit = tree.nodes.get("Emission")
        bb = tree.nodes.new("ShaderNodeBlackbody")
        bb.inputs["Temperature"].default_value = kelvin
        tree.links.new(bb.outputs["Color"], emit.inputs["Color"])

    def aim_local(obj, local_pos, local_target):
        obj.location = local_pos
        d = Vector(local_target) - Vector(local_pos)
        obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

    # Camera looks down its local -Z; the subject sits at local (0, 0, -dist).
    subject = (0.0, 0.0, -0.30)

    key_data = bpy.data.lights.new("light_key_3200k", type="AREA")
    key_data.shape = "RECTANGLE"
    key_data.size = 0.22
    key_data.size_y = 0.02
    key_data.energy = 1.5
    key = bpy.data.objects.new("light_key_3200k", key_data)
    collection.objects.link(key)
    aim_local(key, (-0.17, 0.01, -0.12), subject)
    blackbody(key, 3200.0)

    rim_data = bpy.data.lights.new("light_rim_5600k", type="AREA")
    rim_data.size = 0.035
    rim_data.energy = 0.30
    rim = bpy.data.objects.new("light_rim_5600k", rim_data)
    collection.objects.link(rim)
    aim_local(rim, (0.14, 0.10, -0.06), subject)
    blackbody(rim, 5600.0)

    world = bpy.data.worlds.new("world_black")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
    bpy.context.scene.world = world
    return key, rim


def build_compositor():
    """Fog Glow above the lit strands so only the luminous fibre blooms. Threshold
    is the whole trick: set it low and the field hazes, which is what killed the
    first glare attempt on the buckle."""
    scene = bpy.context.scene
    tree = bpy.data.node_groups.new("fibre_comp", "CompositorNodeTree")
    tree.interface.new_socket(name="Image", in_out="OUTPUT",
                              socket_type="NodeSocketColor")
    scene.compositing_node_group = tree
    rl = tree.nodes.new("CompositorNodeRLayers")
    glare = tree.nodes.new("CompositorNodeGlare")

    def put(socket, value):
        if socket in glare.inputs:
            try:
                glare.inputs[socket].default_value = value
            except TypeError:
                pass

    put("Type", "Fog Glow")
    put("Quality", "High")
    put("Threshold", 1.9)
    put("Strength", 0.4)
    put("Size", 7)
    put("Saturation", 1.25)
    out = tree.nodes.new("NodeGroupOutput")
    tree.links.new(rl.outputs["Image"], glare.inputs["Image"])
    tree.links.new(glare.outputs["Image"], out.inputs[0])


def build_camera(profile_name, collection, key_light):
    profile = PROFILES[profile_name]
    cam_data = bpy.data.cameras.new("cam_" + profile_name)
    cam_data.lens = profile["lens"]
    cam_data.sensor_width = 36.0
    cam_data.clip_start = 0.005
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = profile["fstop"]
    cam_data.dof.focus_distance = profile["dist"]
    cam = bpy.data.objects.new("cam_" + profile_name, cam_data)
    collection.objects.link(cam)
    bpy.context.scene.camera = cam

    scene = bpy.context.scene
    scene.frame_start, scene.frame_end = 1, LAST

    # The camera descends with the fibre, looking slightly down. Straight-on would
    # flatten the field into a wall; a shallow tilt keeps depth readable.
    # Lights are children of the camera, so they need no keys of their own.
    for light in (key_light, bpy.data.objects["light_rim_5600k"]):
        light.parent = cam

    # The fibre hangs along world Y and the camera watches it from the side,
    # looking along -Z, translating down in Y as it descends. A -6 deg pitch tips
    # the view slightly downward so the field has depth rather than reading as a
    # flat wall. (Pitching +90 deg instead — the first attempt — aims the camera
    # along +Y, i.e. straight up, away from every strand in the scene.)
    pitch = math.radians(-6.0)
    for frame, t in ((1, 0.0), (LAST, 1.0)):
        eased = t * t * (3.0 - 2.0 * t)          # smoothstep — no linear drift
        y = CAM_Y_START + (CAM_Y_END - CAM_Y_START) * eased
        cam.location = (0.0, y, profile["dist"])
        cam.rotation_euler = Euler((pitch, 0.0, 0.0))
        cam.keyframe_insert(data_path="location", frame=frame)
        cam.keyframe_insert(data_path="rotation_euler", frame=frame)

    for action in bpy.data.actions:
        fcurves = getattr(action, "fcurves", None)
        if fcurves is None:
            fcurves = [fc for layer in action.layers for strip in layer.strips
                       for bag in strip.channelbags for fc in bag.fcurves]
        for fc in fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "BEZIER"
                kp.handle_left_type = kp.handle_right_type = "AUTO_CLAMPED"
    return cam


def animate_sway(objects, rng):
    """Gentle suspended movement. Amplitude is sub-millimetre — a textile sculpture
    hanging in still air, not fabric in wind."""
    for obj in objects:
        base = obj.location.copy()
        phase = rng.uniform(0.0, math.tau)
        amp = rng.uniform(0.0012, 0.0042)
        for frame in (1, LAST // 2, LAST):
            t = (frame - 1) / (LAST - 1)
            obj.location = (
                base.x + math.sin(phase + t * math.pi * 1.3) * amp,
                base.y,
                base.z + math.cos(phase + t * math.pi * 1.1) * amp * 0.6,
            )
            obj.keyframe_insert(data_path="location", frame=frame)


# ------------------------------------------------------------------------- stages

def configure_render(samples):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = "OPENIMAGEDENOISE"
    except TypeError:
        pass
    scene.render.fps, scene.render.fps_base = FPS, 1.0
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "None"
    prefs = bpy.context.preferences.addons.get("cycles")
    if prefs:
        cprefs = prefs.preferences
        for backend in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
            try:
                cprefs.compute_device_type = backend
                cprefs.get_devices()
                if [d for d in cprefs.devices if d.type != "CPU"]:
                    for d in cprefs.devices:
                        d.use = True
                    scene.cycles.device = "GPU"
                    return
            except Exception:
                continue
    scene.cycles.device = "CPU"


def stage_build():
    t0 = time.time()
    rng = random.Random(SEED)
    scene = bpy.context.scene
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for coll in list(bpy.data.collections):
        bpy.data.collections.remove(coll)

    field = bpy.data.collections.new("fibre_field")
    rig = bpy.data.collections.new("rig")
    scene.collection.children.link(field)
    scene.collection.children.link(rig)

    mats = build_materials()
    counts = build_field(field, mats, rng)
    build_luminous_fibre(field, mats)
    key, _rim = build_lights(rig)
    build_camera("desktop", rig, key)
    build_compositor()
    animate_sway([o for o in field.objects if o.name != "luminous_fibre"], rng)
    configure_render(64)

    strands = counts["warp"] + counts["weft"]
    log("built %d strands (%d warp, %d weft) + 1 luminous fibre in %.1fs"
        % (strands, counts["warp"], counts["weft"], time.time() - t0))
    with open(os.path.join(LOGS_DIR, "fibre-build.json"), "w", encoding="utf-8") as fh:
        json.dump({"strands": strands, "frames": LAST, "fps": FPS,
                   "duration_s": LAST / FPS, "seed": SEED, **counts}, fh, indent=2)
    os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    log("saved " + BLEND_PATH)


def stage_render(which, samples):
    scene = bpy.context.scene
    profile = PROFILES[which]
    key = bpy.data.objects["light_key_3200k"]
    for cam in [o for o in bpy.data.objects if o.type == "CAMERA"]:
        bpy.data.objects.remove(cam, do_unlink=True)
    for action in list(bpy.data.actions):
        if action.users == 0:
            bpy.data.actions.remove(action)
    build_camera(which, bpy.data.collections["rig"], key)
    configure_render(samples)
    scene.render.resolution_x, scene.render.resolution_y = profile["res"]
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    out = os.path.join(FRAMES_DIR, which)
    scene.render.filepath = os.path.join(out, "f_")
    t0 = time.time()
    bpy.ops.render.render(animation=True)
    log("%s: %d frames in %.0fs" % (which, LAST, time.time() - t0))


def _encode(src_dir, names, width, height, dest_stem, out_dir):
    scene = bpy.context.scene
    scene.frame_start, scene.frame_end = 1, len(names)
    scene.render.fps, scene.render.fps_base = FPS, 1.0
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "Standard"
    scene.render.use_compositing = False
    scene.render.use_sequencer = True
    editor = scene.sequence_editor_create()
    strips = editor.strips if hasattr(editor, "strips") else editor.sequences
    strip = strips.new_image(name="seq", filepath=os.path.join(src_dir, names[0]),
                             channel=1, frame_start=1)
    for name in names[1:]:
        strip.elements.append(name)
    strip.frame_final_duration = len(names)
    settings = scene.render.image_settings
    if hasattr(settings, "media_type"):
        settings.media_type = "VIDEO"
    settings.file_format = "FFMPEG"
    written = []
    for container, codec, suffix in (("MPEG4", "H264", "mp4"), ("WEBM", "WEBM", "webm")):
        ff = scene.render.ffmpeg
        ff.format, ff.codec = container, codec
        ff.constant_rate_factor, ff.ffmpeg_preset = "HIGH", "GOOD"
        ff.gopsize, ff.audio_codec = 12, "NONE"
        scene.render.filepath = os.path.join(out_dir, dest_stem + "-")
        bpy.ops.render.render(animation=True)
        made = [n for n in os.listdir(out_dir)
                if n.startswith(dest_stem + "-") and n.endswith("." + suffix)]
        final = os.path.join(out_dir, "%s.%s" % (dest_stem, suffix))
        if made:
            if os.path.exists(final):
                os.remove(final)
            os.rename(os.path.join(out_dir, made[0]), final)
            written.append(os.path.basename(final))
    return written


def stage_encode(which):
    src = os.path.join(FRAMES_DIR, which)
    names = sorted(n for n in os.listdir(src) if n.endswith(".png"))
    if len(names) != LAST:
        raise SystemExit("expected %d frames, found %d" % (LAST, len(names)))
    width, height = PROFILES[which]["res"]
    os.makedirs(CAMPAIGN_DIR, exist_ok=True)
    written = _encode(src, names, width, height,
                      "lb-hero-continuation-%s" % which, CAMPAIGN_DIR)
    log("encoded %s: %s" % (which, ", ".join(written)))


def stage_hero(which):
    """Buckle 4.00 s + continuation 6.00 s = 10.00 s, cut straight at the join."""
    scene = bpy.context.scene
    buckle = os.path.join(EXPORTS_DIR, "lb-buckle-ignition-%s.mp4"
                          % ("desktop" if which == "desktop" else "mobile"))
    cont = os.path.join(CAMPAIGN_DIR, "lb-hero-continuation-%s.mp4" % which)
    width, height = PROFILES[which]["res"]
    scene.render.fps, scene.render.fps_base = FPS, 1.0
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "Standard"
    scene.render.use_compositing = False
    scene.render.use_sequencer = True
    editor = scene.sequence_editor_create()
    strips = editor.strips if hasattr(editor, "strips") else editor.sequences
    a = strips.new_movie(name="buckle", filepath=buckle, channel=1, frame_start=1)
    b = strips.new_movie(name="cont", filepath=cont, channel=1,
                         frame_start=1 + a.frame_final_duration)
    total = a.frame_final_duration + b.frame_final_duration
    scene.frame_start, scene.frame_end = 1, total
    settings = scene.render.image_settings
    if hasattr(settings, "media_type"):
        settings.media_type = "VIDEO"
    settings.file_format = "FFMPEG"
    ff = scene.render.ffmpeg
    ff.format, ff.codec = "MPEG4", "H264"
    ff.constant_rate_factor, ff.ffmpeg_preset = "HIGH", "GOOD"
    ff.gopsize, ff.audio_codec = 12, "NONE"
    os.makedirs(REVIEW_DIR, exist_ok=True)
    stem = "lb-hero-10s-%s" % which
    scene.render.filepath = os.path.join(REVIEW_DIR, stem + "-")
    bpy.ops.render.render(animation=True)
    made = [n for n in os.listdir(REVIEW_DIR)
            if n.startswith(stem + "-") and n.endswith(".mp4")]
    if made:
        final = os.path.join(REVIEW_DIR, stem + ".mp4")
        if os.path.exists(final):
            os.remove(final)
        os.rename(os.path.join(REVIEW_DIR, made[0]), final)
    log("hero %s: %d frames = %.3fs" % (which, total, total / FPS))


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    args = dict(zip(argv[::2], argv[1::2]))
    stage = args.get("--stage", "build")
    if stage == "build":
        stage_build()
    elif stage == "render":
        stage_render(args["--which"], int(args.get("--samples", 64)))
    elif stage == "encode":
        stage_encode(args["--which"])
    elif stage == "hero":
        stage_hero(args["--which"])
    else:
        raise SystemExit("unknown stage: " + stage)


main()
