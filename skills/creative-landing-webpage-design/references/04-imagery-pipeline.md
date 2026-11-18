# 04 · Imagery pipeline

Images decide whether the site looks premium. Choose one of three routes per image set, and mix them freely.

| Route | Use when | Output |
| --- | --- | --- |
| A. 3D renders (default) | Hero objects and decor, any business | Transparent PNGs, matte and soft-lit, made with `scripts/sdf.py` |
| B. User photos | The user uploads images (portraits, rooms, food) | Cropped, compressed WebP embedded in the page |
| C. Canva prompt pack | Photography you cannot render (people, interiors, plated food) | A document of ready prompts; the user generates, then uploads |

Contents: route A in detail · route B · route C · embedding and size · fallbacks.

## Route A: render objects with the SDF ray-marcher

`scripts/sdf.py` is a numpy ray-marcher. You describe an object as signed-distance functions, give each material group a colour, and it renders a transparent PNG with a soft key light, soft shadows, ambient occlusion, subtle subsurface warmth, a gentle rim and a tiny bump texture. It is deliberately matte.

### Workflow

1. Pick the object and write down its silhouette in primitives (see the recipe table).
2. Write a scene function in a new file `my_scenes.py` (copy the layout of `scripts/scenes_food.py`).
3. Preview: `python scripts/render_objects.py --lib my_scenes --scenes cup --size 300 --out preview --force` (seconds). View it.
4. Fix shape, framing, colours. Repeat until you would be happy to see it at 500 px.
5. Final: `--size 820` (5 to 60 s each on one CPU). Run in the foreground inside a window of about 4 minutes; the script stops starting new renders after `--budget` seconds and skips files that already exist, so run it again to continue. Background jobs do not survive between tool calls.
6. View the final contact sheet on the real world colour before building the site.

### Scene function contract

```python
from sdf import *
def cup(q):                      # q: (N,3) model-space points
    wall = lathe(q, [(0,-.4),(.27,-.4),(.34,-.34),(.53,.36),(.53,.4),(.49,.41),(.47,.36),(.3,-.26),(0,-.26)], round_=.012)
    ...
    return [body, coffee, foam]  # one distance array per material group
MATS = [Mat('#FBF6EE', rough=.36, spec=.22, sss=.25, bump=.003), ...]   # same order as the groups
SCENES = {'cup': (cup, MATS, dict(R=1.0, rot=(38,-22,0), center=(0,0,0), kblend=.004))}
```

- `R` is the bounding radius; the object must fit inside `1.15 * R` or it gets cut off.
- `rot=(rx,ry,rz)` in degrees rotates the object. Use a 3/4 view; a flat front view looks dead.
- `center` is where the model origin lands on screen. **To centre an object whose middle is at model point P, set `center = -P`.** (Getting this sign wrong clips the feet or the top.)
- `kblend` smooth-unions the material groups. Keep it small (0.004 to 0.01) so features such as eyes stay crisp.

### Primitives (all in `sdf.py`)

| Tool | Use |
| --- | --- |
| `sph`, `ell` | Spheres, ellipsoids: scoops, heads, beans, bodies |
| `rcone(q, a, b, ra, rb)` | Tapered capsule: limbs, cones, straws, stems, branches |
| `rbox(q, c, half, r)` | Rounded box: crosses, books, slabs |
| `torus(q, c, R, r, axis)` | Rings: handles, skirts, ribbons |
| `lathe(q, profile, round_)` | Solid of revolution from a 2D profile: cups, bottles, bowls, glasses, vases, lamps |
| `heart2d`, `poly2d` | 2D shapes to paint onto a surface (foam hearts) or extrude |
| `smin`, `smax` | Smooth union and smooth intersection; subtract with `smax(a, -b)` |
| `Mat(color, rough, spec, sss, bump)` | Material |

Never call `smin` with `k=0` (it produces NaN and the object vanishes). Use `np.minimum`.

### Material cheat sheet

| Look | rough | spec | sss | bump |
| --- | --- | --- | --- | --- |
| Ceramic, enamel | 0.35 | 0.22 | 0.25 | 0.003 |
| Matte clay, plaster | 0.7 | 0.06 | 0.35 | 0.01 |
| Felt, plush, wool | 0.85 | 0.03 | 0.4 | 0.03 |
| Bone, ivory | 0.66 | 0.08 | 0.4 | 0.01 |
| Wax, candle, ice cream | 0.6 | 0.12 | 0.5 | 0.014 |
| Paper, cardboard | 0.7 | 0.05 | 0.35 | 0.012 |
| Fruit skin, glossy accent (cherry, pill coating) | 0.3 | 0.5 | 0.2 | 0 |
| Skin of organs, translucent look | 0.5 | 0.16 | 0.6 | 0.012 |

Use a gloss accent on at most one small part of an object.

### Recipe ideas by silhouette

Cup and saucer (lathe, torus handle), cone and scoops (rcone plus ellipsoids plus torus skirts), takeaway cup (lathe plus sleeve and straw), croissant (chain of tapered capsules), bottle (lathe), jar (lathe plus lid), bowl with noodles (lathe plus tori), teddy bear (ellipsoids plus spheres, felt material), heart (ellipsoids plus vessel tubes), neuron (soma plus branching tubes plus myelin beads), knee as a bent limb (two tubes, joint ball, kneecap), spine (stack of vertebra bodies with arches), mannequin (ellipsoids, tubes, ball joints), capsule (two half-capsules), cross (two rounded boxes), dumbbell, kettlebell, vase, lamp, candle, gift box, book. Working examples: `scripts/scenes_food.py` and `assets/examples/scenes-medical.py`.

### Shape safety

Look at every preview with fresh eyes: does it read as something unintended (a pet bone, a suggestive form, a weapon)? Does the silhouette work at 100 px? Fix by changing the view angle, the proportions, or the subject.

### Performance

About 1 to 10 s per object at 300 px, 5 to 60 s at 820 px. More primitives cost more. If one object takes over 90 s, simplify the scene or lower the size to 700.

## Route B: user photos

When the user uploads images, look at every one before using it.

1. Unzip and list sizes. View contact sheets with numbered labels.
2. Map images to roles (doctor, banner, interior, product). Note alternates.
3. Crop to the aspect the UI needs (4:5 for portrait cards, 16:9 for banners, 1:1 for avatars). For faces, crop from the top: take the top `1.25 * width` of a tall portrait, and display with `object-position: 50% 14%`.
4. Compress to WebP: portraits 520 x 650 at q80 (about 15 KB), squares 600 x 600 at q78, banners 1200 x 674 at q78.
5. Embed as data URIs through `build_site.py` (`images` in the config; items reference them by key with `img`).
6. Use each image everywhere it makes sense (cards, profile, availability chip, department banner, About gallery, section image). Say in the UI note that generated portraits are illustrative.

## Route C: Canva prompt pack

For photography that cannot be rendered, write a prompt pack (a document the user can follow in Canva Magic Media or Dream Lab). Structure, in this order:

1. How to use it (five steps: open the generator, paste the style line then the prompt, set the aspect ratio, generate several and choose, remove backgrounds on object shots, download and name files exactly).
2. Global style guide: one reusable style line, a palette table with hex codes, and an "avoid" list.
3. Sections of prompts, each with file names and aspect ratios: hero objects (optional upgrades), portraits (one base prompt plus a table of person and backdrop colour), department or category banners, facility or lifestyle scenes, customer portraits.
4. A delivery checklist table: group, file names, format and size, where each image appears in the site.

Prompt-writing rules: one concrete subject per prompt; lighting and mood ("soft diffused studio lighting, matte materials"); backdrop colour matched to the world tint; plain light grey background for cut-outs; people seen from behind or at a distance for scenes; always "no text, no logos, no watermarks". Canva has no separate negative-prompt field, so phrase exclusions inline. Full template: `08-prompt-pack-template.md`.

## Embedding and size

`build_site.py` compresses every image to WebP and embeds it as a data URI, so the site is one self-contained file (published pages cannot reference other files). Typical result: hero objects 10 to 30 KB each, photos 15 to 60 KB each, whole site 200 KB to 1.5 MB. Keep the file under 14 MB.

## Fallbacks when an object cannot be made

- Use a typographic hero: a huge display word with a flat shape cluster (circles, arches) in the world colour.
- Use a product photo cut-out supplied by the user.
- Use a simple geometric emblem rendered with the same pipeline (a sphere, a torus, a stack of rounded boxes) that nods to the brand.
