"""Convert a SHARP .ply (3DGS, SH degree 0) to Niantic .spz v2 for the 3D portrait on the home page.

How public/splats/profile.spz was made:
  1. install SHARP (https://github.com/apple-aiml-research/ml-sharp) and run
       sharp predict -i <folder with the photo> -o <out folder> --device cuda
  2. python scripts/ply2spz.py <out folder>/profile.ply public/splats/profile.spz --min-opacity 0.05
  3. copy the printed size / focal / pivot / count into SPLAT in src/components/SplatPortrait.astro

Coordinates are kept as SHARP writes them (OpenCV: x right, y down, z forward);
the viewer flips them. Needs numpy and plyfile.
"""
import argparse, gzip, json, os, struct
import numpy as np
from plyfile import PlyData

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--min-opacity", type=float, default=0.0)
ap.add_argument("--max-depth", type=float, default=1e9)
args = ap.parse_args()

ply = PlyData.read(args.src)
v = ply["vertex"].data
xyz = np.stack([v["x"], v["y"], v["z"]], 1).astype(np.float64)
dc = np.stack([v["f_dc_0"], v["f_dc_1"], v["f_dc_2"]], 1)
alpha = 1 / (1 + np.exp(-v["opacity"].astype(np.float64)))
scale = np.stack([v["scale_0"], v["scale_1"], v["scale_2"]], 1)
rot = np.stack([v["rot_0"], v["rot_1"], v["rot_2"], v["rot_3"]], 1).astype(np.float64)  # w x y z

keep = (alpha >= args.min_opacity) & (xyz[:, 2] <= args.max_depth) & np.isfinite(xyz).all(1)
xyz, dc, alpha, scale, rot = xyz[keep], dc[keep], alpha[keep], scale[keep], rot[keep]
n = len(xyz)
print(f"{len(v)} -> {n} gaussians; z range {xyz[:,2].min():.2f}..{xyz[:,2].max():.2f}")
for el in ply.elements:
    if el.name != "vertex":
        print(el.name, [tuple(r) for r in el.data][:9])

FRAC = 12
pos = np.round(xyz * (1 << FRAC)).astype(np.int32)
pos_b = np.stack([pos & 0xFF, (pos >> 8) & 0xFF, (pos >> 16) & 0xFF], -1).astype(np.uint8)  # 24-bit LE per axis

u8 = lambda a: np.clip(np.round(a), 0, 255).astype(np.uint8)
alpha_b = u8(alpha * 255)
color_b = u8(dc * (0.15 * 255) + 0.5 * 255)
scale_b = u8((scale + 10) * 16)
q = rot / np.linalg.norm(rot, axis=1, keepdims=True)
q *= np.where(q[:, :1] < 0, -1, 1)  # w >= 0, store xyz only
rot_b = u8(q[:, 1:] * 127.5 + 127.5)

header = struct.pack("<IIIBBBB", 0x5053474E, 2, n, 0, FRAC, 0, 0)
body = b"".join(a.tobytes() for a in (pos_b, alpha_b, color_b, scale_b, rot_b))
with gzip.open(args.dst, "wb", compresslevel=9) as f:
    f.write(header + body)
print(f"wrote {args.dst}: {os.path.getsize(args.dst)/1e6:.1f} MB")

# Viewer metadata: square image size, focal (px) and the depth of whatever sits at the image centre
w, h = (int(x) for x in ply["image_size"].data["image_size"])
f = float(ply["intrinsic"].data["intrinsic"][0])
proj = xyz[:, :2] / xyz[:, 2:3] * f
centre = (np.abs(proj[:, 0]) < 0.06 * w) & (np.abs(proj[:, 1]) < 0.06 * h)
pivot = float(np.median(xyz[centre, 2]))
print(json.dumps({"size": w, "height": h, "focal": round(f, 2), "pivot": round(pivot, 3), "count": n}))
