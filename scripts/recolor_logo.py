from PIL import Image
import colorsys
from pathlib import Path

src = Path("public/brand/makoto-logo-original.png")
out = Path("public/brand/makoto-logo.png")
img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a < 8:
            continue
        # near-white background -> transparent
        if r > 240 and g > 240 and b > 240:
            pixels[x, y] = (255, 255, 255, 0)
            continue

        rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
        h_, s, v = colorsys.rgb_to_hsv(rf, gf, bf)

        # keep structure, map to brand teal/aqua
        # darker parts -> deep teal, lighter -> aqua
        t = max(0.0, min(1.0, (v - 0.25) / 0.55))
        # hue blend teal(0.48) to aqua-blue(0.52)
        new_h = 0.47 + 0.05 * t
        new_s = min(0.78, max(0.35, s * 1.7 + 0.18))
        new_v = min(0.88, max(0.32, v * 0.92 + 0.04))
        nr, ng, nb = colorsys.hsv_to_rgb(new_h, new_s, new_v)
        pixels[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)

img.save(out, "PNG")
print(f"saved {out} {img.size}")
