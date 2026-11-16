---
name: signature-site-studio
description: Design and build a unique, modern, interactive website for any business from a one-line topic. Turns "cafe in Ahmedabad, coffee and ice cream" (or a clinic, salon, gym, shop, restaurant, studio, school, real-estate firm, NGO) into a finished single-file site with colour worlds, realistic 3D-rendered hero objects, glass nav, slow weighty motion, working filters, cart or booking forms, mobile layout, automated QA, publishing, and a Canva image-prompt pack. Also redesigns existing sites in the same style. Use this skill whenever the user asks to design, redesign, build, or "make a good/unique/modern" website, landing page, web design, brand site, or website concept for a business, or asks for a design canvas of website concepts, hero images for a site, or image prompts for a website, even if they never say "skill".
---

# Signature Site Studio

Builds websites with a distinct signature: **one colour world at a time, a single realistic hero object, type used as a shape, pills and glass, slow weighty motion, and real tools instead of brochure sections.** The taste was distilled from four reference sites and many rounds of feedback (the full story is in `references/01-design-dna.md`).

You are not filling a template. You are inventing a concept for this specific business, then using the bundled scaffold, renderer and test scripts to make it real quickly and to a high standard.

## What you produce

1. A short **concept one-pager** (worlds, hero objects, signature tool, variation choices, local touches, placeholders).
2. **Imagery**: realistic matte 3D-rendered hero objects (default), the user's own photos if supplied, and/or a **Canva prompt pack**.
3. A **single self-contained HTML site** (usually 200 KB to 2 MB): hero with swapping worlds, find bar, collections, filterable items, cart or reservation form, stories, highlight band, About and Contact pages, mobile menu, open-now chip. Published through the Artifact tool when available, otherwise saved to outputs.
4. A **QA report** from the automated test plus your own look at the screenshots.
5. A short **handoff** (link, what it does, what is placeholder, one question).

## Workflow

Follow these steps in order. Do the thinking quietly; speak briefly.

### 1. Understand the topic and decide scope

Read `references/02-concept-engine.md` section 1. Extract business type, hero products, place and language, audience, conversion goal, and whether it is a real business (verify facts with web search and use only verified ones) or a new concept (everything contact-related is a labelled sample). Ask at most one question, and only if the answer would change the whole concept. Otherwise state assumptions in one line and continue.

If the user wants to *see designs first* ("design first", "don't build HTML yet", "give me 3 concepts"), follow the design-first flow in `references/07-quality-gates.md` and stop after the canvas until they choose.

### 2. Invent the concept

Work through `references/02-concept-engine.md` sections 2 to 9: local and cultural lens, 3 to 4 worlds (name, ghost word, colour, object), hero objects you can actually produce, a signature interaction tied to the customer's main decision, structure, voice, variation axes, and three quick divergent directions before committing. Consult `references/03-industry-playbooks.md` for the closest business type. Pick the calm-to-playful dial deliberately.

Share the concept one-pager (about 10 lines) in chat. If the user already gave a clear brief, do not wait for approval; continue and let them react to the real site.

### 3. Make the imagery

Read `references/04-imagery-pipeline.md`.

- **Default (Route A):** render matte, soft-lit 3D hero objects with `scripts/sdf.py` and `scripts/render_objects.py`. Copy `scripts/scenes_food.py` (food and drink) or `assets/examples/scenes-medical.py` (anatomy, bears, mannequin) as a starting point; build new scene functions from primitives (`sph`, `ell`, `rcone`, `rbox`, `torus`, `lathe`). **Always preview at 300 px, look at it, fix it, then render 820 px.** Check each silhouette for unintended meaning.
- **User photos (Route B):** if the user uploaded images, look at all of them, map them to roles, crop, and use them everywhere they make sense.
- **Photography you cannot render (Route C):** write a Canva prompt pack (`references/08-prompt-pack-template.md`).

Run long jobs in the foreground inside a 4-minute window (the render script is resumable). Background jobs do not survive.

### 4. Write the config and build

```bash
python scripts/init_project.py my-site            # makes my-site/site.config.json and images/
# put hero object PNGs in my-site/images/
python scripts/build_site.py my-site/site.config.json my-site/site.html
```

Edit `site.config.json` using the reference in `references/06-build-architecture.md` (every key is documented; the café example in `assets/scaffold/site.config.example.json` shows a complete config). Set the theme (fonts, colours, `radius`, `heroWord`, `grain`) to your variation choices so the site does not look like the last one. Fix every warning the builder prints (contrast, missing images).

Content rules: specific and short; no lorem ipsum; no invented statistics, awards or real-looking testimonials (sample stories are labelled "sample"); contact, prices, hours and policies are labelled placeholders unless supplied or verified.

If the business needs slot booking with availability (clinic, salon, trainer), port the engine from `assets/examples/pulse-hospital-template.html` instead of using the generic form. If it needs a layout the scaffold does not offer, extend the scaffold as described in `references/06-build-architecture.md`.

### 5. Test, look, fix

```bash
python scripts/test_site.py my-site/site.html --out my-site/qa --quick    # drop --quick for the full width matrix
```

Fix every failing check. Then **open the screenshots** (`hero_world*.png`, `sec_*.png`, `sheet_*.png`, `m_*.png`) and judge them as a designer: object centred and grounded, decor not colliding, nav legible, mobile nav fits, grid not a wall of one image, sheets not cut off. Use the gates in `references/07-quality-gates.md`. Rebuild and retest until clean.

### 6. Publish and hand off

If the Artifact tool exists, publish the HTML (pass an emoji favicon and a title); update the same URL on later changes. Otherwise save to `/mnt/user-data/outputs/` and present the file. If photography is needed, create the prompt pack as a document. End with the handoff template in `references/07-quality-gates.md`: link, what it does, what was tested, placeholders to replace, where images came from, and one question.

### 7. Iterate on feedback

Use the feedback playbook at the end of `references/07-quality-gates.md`. Small edits: the Artifact `edit` action. Big edits: change the config or scaffold, rebuild, republish to the same URL. Never regex-replace a large generated HTML file.

## Principles to keep in mind (why, not just what)

- **Distinctive beats safe.** A site that could belong to any business is a failure. The worlds, the hero object and the tool must be about *this* business and *this* place.
- **Realism is matte.** Glossy plastic looks cheap. True 3D with soft light, matte materials, layered shadows and grain looks premium.
- **Tools make a site feel alive.** Filters, carts, forms, open-now state, every nav item a real page.
- **Honesty builds trust.** Label samples, verify claims, never invent proof.
- **Look at the result.** Tests catch logic; your eyes catch taste. Several real bugs were found only in screenshots.
- **One dial, held everywhere.** Calm for clinics, playful for dessert, editorial for fashion. Do not mix.

## Bundled resources

| Path | What it is | When to read or run it |
| --- | --- | --- |
| `references/01-design-dna.md` | The taste, eight signature moves, calm-to-playful dial, realism lessons, anti-patterns, taste test | Before concept work and before the final review |
| `references/02-concept-engine.md` | Topic to concept: local lens, worlds, objects, interaction, variation axes, divergence, one-pager | Every project, step 1 to 2 |
| `references/03-industry-playbooks.md` | Worlds, hero objects, tools and modes for 20+ business types | After you know the business |
| `references/04-imagery-pipeline.md` | 3D render workflow, primitives, materials, photos, Canva route | Whenever you need images |
| `references/05-motion-interaction.md` | Signature curve, hero state machine, stage scaling, reduced motion | When tuning or extending motion |
| `references/06-build-architecture.md` | Full config reference, extension recipes, kit API, publishing limits, 14-item bug catalogue | While writing the config and debugging |
| `references/07-quality-gates.md` | Build loop, design-first flow, gates, QA commands, handoff template, feedback playbook | Before showing anything, and at handoff |
| `references/08-prompt-pack-template.md` | Structure and base prompts for a Canva prompt pack | When photography is needed |
| `assets/scaffold/` | `site.template.html`, `app.js`, `site.config.example.json` (a complete Ahmedabad cafe config) | Every build |
| `assets/kit/` | Sheet, toast, focus-trap and hash-routing kit | Embedded by the builder |
| `assets/examples/` | The full hospital site template (slot booking) and medical 3D scenes | When you need booking or anatomy objects |
| `scripts/sdf.py`, `render_objects.py`, `scenes_food.py` | 3D renderer, CLI, and food and drink scenes | Route A imagery |
| `scripts/build_site.py`, `init_project.py`, `test_site.py` | Builder, project initialiser, headless QA | Steps 4 and 5 |

Setup if packages are missing: `pip install pillow numpy scipy playwright && playwright install chromium`.

## Worked example (what a good run looks like)

User: "Cafe in Ahmedabad, coffee and ice cream are the main things."

1. Assumptions: new concept, English with Gujarati touches avoided unless certain, rupees, WhatsApp ordering, late-night crowd, hot summers. Concept "Brew & Scoop": worlds Coffee (brown, latte cup, word COFFEE), Ice cream (raspberry, two-scoop cone, word SCOOP), Cold and shakes (teal, iced takeaway cup, word CHILL); decor bean and cone; tool is the filterable menu with cart and WhatsApp checkout; open-now chip; late-night band. Playful dial, pill radius, Bagel Fat One display with Inter body, warm cream surface, grain 0.17.
2. Render cup, cone, iced cup, bean (preview 300 px, check, final 820 px).
3. Config from `site.config.example.json`, adapt names, items, prices (sample), hours (sample).
4. Build, test (27 checks), look at screenshots, fix.
5. Publish, hand off with placeholders and one question ("real business or a new concept?").

Do not reuse that exact concept for another cafe: choose different worlds, objects and variation axes.
