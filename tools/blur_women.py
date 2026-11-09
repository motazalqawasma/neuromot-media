"""Blur a woman's hair and visible skin, keep face + clothing sharp (Motaz's rule, 2026-11-09).
Usage in Python:
  from blur_women import make
  make('in.jpg','out.jpg', face=(cx,cy,rx,ry), clothes=[[(x,y),...]], skin=[[(x,y),...]], crop=(l,t,r,b), size=(600,800))
Find the coordinates by drawing a 50 px grid on the photo and looking at it first."""
from PIL import Image, ImageDraw, ImageFilter
def make(src, dst, face, clothes, skin, crop=None, size=None, blur=26):
    im = Image.open(src).convert('RGB'); bl = im.filter(ImageFilter.GaussianBlur(blur))
    m = Image.new('L', im.size, 0); d = ImageDraw.Draw(m)
    cx, cy, rx, ry = face; d.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=255)
    for p in clothes: d.polygon(p, fill=255)
    for p in skin: d.polygon(p, fill=0)
    out = Image.composite(im, bl, m.filter(ImageFilter.GaussianBlur(6)))
    if crop: out = out.crop(crop)
    if size: out = out.resize(size, Image.LANCZOS)
    out.save(dst, quality=93); return out
