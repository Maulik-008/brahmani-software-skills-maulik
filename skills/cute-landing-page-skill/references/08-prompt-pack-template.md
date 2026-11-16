# 08 · Canva prompt pack template

Use this to write the image-generation prompt pack the user can follow in Canva (Magic Media or Dream Lab). Produce it as a document (a Claude Doc when the Docs tools exist, otherwise a Markdown file) with a title, a byline, and the sections below. Fill every prompt with the real business, colours and place from the concept.

Contents: document structure · global style line · category base prompts · per-image rules · delivery table · after the images arrive.

## Document structure

1. **How to use this pack** (numbered steps): open Magic Media or Dream Lab and choose Image; paste the style line, then the image prompt; set the aspect ratio shown; generate several and choose the best; for cut-outs ask for a plain light grey background then remove it and download a transparent PNG; download photos as JPG, objects as PNG, at the largest size, and name each file exactly as listed.
2. **Global style guide**: the style line, a palette table (name, hex, use), an "avoid in every image" list, and a note that generated people are fictional and should be replaced with real photos with consent.
3. **Sections of prompts** with file names and aspect ratios (see below).
4. **Delivery checklist**: a table of group, files, format and size, and where each image appears in the site. Mention which slots exist today and which need new slots once images arrive.

## Global style line (adapt the adjectives to the brand)

Healthcare: "Premium modern healthcare brand photography, soft diffused studio lighting, matte materials with no harsh gloss, natural realistic detail, shallow depth of field, calm and trustworthy mood, clean composition with generous empty space, no text, no logos, no watermarks."

Food and drink: "Warm editorial food photography, soft window light from the left, matte ceramic and natural textures, shallow depth of field, appetising and honest, generous negative space, no text, no logos, no watermarks."

Retail and fashion: "Clean studio product photography, soft box lighting, matte fabric texture, neutral seamless backdrop, crisp edges, no text, no logos, no watermarks."

Property and interiors: "Bright architectural photography, natural daylight, calm neutral palette with one accent colour, wide angle, no readable signage, no text, no logos, no watermarks."

Always keep "no text, no logos, no watermarks". Canva has no separate negative prompt field.

## Prompt sections and base prompts

**A. Hero objects (optional upgrades to the rendered objects).** One prompt per world object: "A [object] in [matte material and colour], [view], centred on a plain light grey seamless background, soft shadow beneath, studio product photograph." Aspect 1:1, 4:5 or 3:4 by shape. File names `object-<name>.png`.

**B. Portraits (staff, team, owner).** One base prompt plus a table of person details and backdrop colour (matched to the world tint, hex included):
"Professional headshot portrait of [PERSON], head and shoulders, wearing [attire], natural friendly expression, soft window light, realistic skin texture, sharp eyes, shallow depth of field, plain studio backdrop in [BACKDROP]." Aspect 4:5. File names `<role>-<name>.jpg`. Vary age, gender and appearance across the table so the team looks like the community.

**C. Category or department banners.** One prompt each, 3:2: the place or process in its best light, people from behind or at a distance, an accent colour from the matching world.

**D. Place and atmosphere.** Exterior at golden hour, interior with soft natural light, a signature corner, an entrance at dusk, a table or counter detail. 3:2. No readable signage.

**E. Customer or story portraits.** Warm candid portraits at 1:1, outside the business setting, soft natural light, genuine smile, soft blurred background. A base prompt plus a table of person, setting and story.

**F. Product shots (if the business sells items).** Per product: the item on its world-tint background, three-quarter angle, soft shadow, 1:1. For menus, create 6 to 12 hero items first.

## Per-image rules

- One concrete subject per prompt; avoid long lists of adjectives.
- Name the lighting and the material ("soft diffused studio lighting, matte ceramic").
- Match backdrops to the world colours (use the tint hex).
- For scenes with people, say "seen from behind" or "at a distance" if clear faces are not needed.
- For hands and food, ask for "natural proportions" and check results for distorted hands or teeth.
- File names are lowercase with hyphens, and the table of file names is the contract with the site.

## Delivery table (example)

| Group | Files | Format and size | Where it appears |
| --- | --- | --- | --- |
| Portraits | team-aisha, team-ravi, ... | JPG, 4:5, about 1200 x 1500 px | Team cards, profile pages, availability chip |
| Hero objects | object-cup, object-cone, ... | Transparent PNG, at least 1400 px | Hero, collection cards, band |
| Banners | banner-coffee, banner-icecream, ... | JPG, 3:2, about 2400 x 1600 px | Collection pages, how-it-works image |
| Place | place-exterior, place-interior, ... | JPG, 3:2, about 2400 x 1600 px | About page gallery, contact page |
| Stories | story-riya, story-karan, ... | JPG, 1:1, about 1200 x 1200 px | Stories section |

## After the images arrive

Follow Route B in `04-imagery-pipeline.md`: look at every image, map it to a role, crop, compress, add to `images` in the config, reference it by key (items use `img`, the About gallery uses `about.gallery[].img`, the how-it-works section uses `how.image`), rebuild, test, republish to the same URL, and report where each image is used. If the user supplied alternates (a tall and a square version of the same person), use the tall one for cards and the square one for profile headers.
