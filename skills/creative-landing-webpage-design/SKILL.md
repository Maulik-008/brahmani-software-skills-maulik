---
name: creative-landing-webpage-design
description: Design and build a unique, modern, interactive website for any business from a one-line topic, and make every site look and feel different from the last. Turns "cafe in Ahmedabad, coffee and ice cream" (or a clinic, salon, gym, shop, restaurant, studio, school, real-estate firm, software product, NGO) into a finished single-file site, choosing a distinct creative direction each time (editorial, noir, brutalist, soft glass, sticker, luxe or sunlit worlds), with domain-specific features, realistic 3D or composed imagery, filters, cart, booking, schedule and estimator blocks, mobile layout, automated QA, publishing and a Canva prompt pack. Use whenever the user asks to design, redesign or build a good, unique, modern or creative website, landing page or brand site, asks for website concepts, hero images or image prompts for a site, or complains that generated sites look alike, even if they never say skill.
---

# Creative Landing Webpage Design

Builds websites that look like *this* business and do the things *its* visitors came to do. The enemy is sameness: free themes and AI generators produce the same page (centred hero, gradient, three cards), and so did the first version of this skill (a colour field, a ghost word and a pill nav every time). So every build starts by choosing a **direction** on purpose, then adds **domain-specific extras** and **one surprise** that only this business would have.

What stays constant across all directions is the quality bar: real tools instead of brochure sections, realistic depth in imagery, honest content, disciplined motion, accessibility, and a design you can verify with tests and your own eyes. What changes is everything the visitor sees first.

## What you produce

1. A **direction card** (preset, hero layout, nav, blocks, imagery language, type, motion, extra efforts, surprise) and a short **concept one-pager**.
2. **Imagery**: matte 3D-rendered objects, composed still lifes, the user's photos, or a **Canva prompt pack**, whichever fits the direction.
3. A **single self-contained HTML site** published through the Artifact tool (or saved to outputs).
4. A **QA report** (automated test plus your own look at screenshots) and a **sameness check** against earlier sites.
5. A short **handoff**: link, what it does, what is placeholder, one question.

## Workflow

Do the thinking quietly; speak briefly. Follow the steps in order.

### 1. Understand the topic

Read `references/02-concept-engine.md` section 1. Extract business type, hero products or services, place and language, audience, main conversion, and whether it is a real business (verify facts with web search; use only verified ones) or a new concept (everything contact-related is a labelled sample). Ask at most one question, and only if it would change the whole concept; otherwise state assumptions in one line.

If the user wants designs first ("design first", "don't build HTML yet", "show 3 concepts"), follow the design-first flow in `references/07-quality-gates.md` and stop after the canvas.

### 2. Choose the direction (this is what prevents sameness)

```bash
python scripts/direction.py "<topic>" --avoid-file <previous site>/direction.json --json <new site>/direction.json
```

It returns an archetype: **preset** (paper, noir, brutal, glass, sticker, luxe, world) x **hero layout** (editorial, frame, demo, bento, stage) x **nav** (pill, bar, rail) x **blocks** x **imagery language** x **motion** x **type pair** x **accent** x the domain's **extra efforts** and a **surprise**. Re-roll with `--seed`, inspect all with `--list`, exclude with `--avoid preset:world,hero:stage`.

Rules: the new site must differ from the previous one in preset **and** hero layout (check with `scripts/sameness_check.py`). You may override the engine for a stated reason. Implement at least three extra efforts and the surprise for real. Read `references/09-pattern-library.md` (patterns and when to use them) and `references/10-domain-creativity.md` (what this domain's visitors need). The original saturated-worlds look is only one of ten directions.

### 3. Invent the concept

Work through `references/02-concept-engine.md` sections 2 to 10: local and cultural lens, worlds or sections, hero objects or imagery, the signature tool, voice. Consult `references/03-industry-playbooks.md` and `references/01-design-dna.md` (values, realism lessons, sameness diagnostics). Share the one-pager (about 10 lines, including the direction). If the brief is clear, continue without waiting for approval.

### 4. Make the imagery

Read `references/04-imagery-pipeline.md`. Choose what the direction needs:

- **3D objects** (`scripts/sdf.py`, `render_objects.py`; examples in `scenes_food.py`, `scenes_misc.py`, `assets/examples/scenes-medical.py`): matte, soft-lit. Preview at 300 px and look before the final render.
- **Still life** (`scripts/compose_scene.py`): arrange rendered objects on a coloured surface with light, floor and shadows, for `frame` heroes and banners.
- **User photos**: look at all of them, map to roles, crop, use them everywhere sensible.
- **Type and UI only**: software and services can ship with no objects; worlds get abstract emblems automatically.
- **Canva prompt pack** (`references/08-prompt-pack-template.md`) for photography you cannot render.

Run long jobs in the foreground inside a 4-minute window; renders are resumable.

### 5. Write the config and build

```bash
python scripts/init_project.py my-site
python scripts/build_site.py my-site/site.config.json my-site/site.html
```

Write `site.config.json` from `references/06-build-architecture.md` (full reference, including hero layouts, presets, `page.order` and every block). The example configs in `assets/examples/directions/` show four complete, very different sites; `assets/scaffold/site.config.example.json` shows the original stage direction. Fix every builder warning. Content rules: specific and short; no lorem ipsum; no invented statistics, awards or real-looking testimonials; samples labelled; contact, prices, hours and policies are placeholders unless supplied or verified.

Slot booking with availability (clinic, salon, trainer) can be ported from `assets/examples/pulse-hospital-template.html`. New blocks or layouts: add a renderer to `assets/scaffold/blocks.js` and styles to `blocks.css`.

### 5b. Craft pass

Before testing, read `references/11-interface-craft.md`, `12-layout-type-color.md` and `13-accessibility-and-copy.md` and check the config against them: one primary action per view, copy that names the next step, verb-first buttons, errors that say how to fix, empty states that point forward, `meta.lang` set, alt text on every photo, colours chosen so text passes 4.5:1 on what it sits on. The scaffold already applies the exact values (radius, shadow, motion, hit areas); keep them.

### 6. Test, look, compare, fix

```bash
python scripts/test_site.py my-site/site.html --out my-site/qa --quick --stress
python scripts/sameness_check.py previous/site.config.json my-site/site.config.json
```

Fix every failing check, and every HIGH finding in the audit verdict (Block means do not show it; see `references/14-review-protocol.md`). Run `--stress` once. Then **open the screenshots** (`hero_*.png`, `blk_*.png`, `sheet_*.png`, `m_*.png`) and judge them as a designer using the gates and per-layout checks in `references/07-quality-gates.md`. Rebuild and retest until clean.

### 7. Publish and hand off

Publish with the Artifact tool (emoji favicon, title); update the same URL later. Otherwise save to `/mnt/user-data/outputs/`. If photography is needed, create the prompt pack as a document. End with the handoff template from `references/07-quality-gates.md`, naming the direction you chose and why.

### 8. Iterate on feedback

Use the feedback playbook at the end of `references/07-quality-gates.md`. "It looks like the last one" means change the direction (preset and hero layout), not only colours. Small edits: the Artifact `edit` action. Big edits: change the config, rebuild, republish to the same URL. Never regex-replace a large generated HTML file.

## Redesigning an existing site

When the user gives a URL or screenshots, first read how it is built and what its visitors do (`references/14-review-protocol.md`, "Reading an existing site"): record the journeys to keep, the content that must survive and the failures against `11` to `13`, tagging claims as measured, derived or inferred. Then choose a new direction with `direction.py`; do not reproduce the old look.

## Principles (why, not just what)

- **Distinctive beats safe.** The site must be recognisably about this business, this place and this audience, and unlike the previous site.
- **Visitors first.** Each domain has a short list of things people came to do (see `10-domain-creativity.md`); put them one or two clicks from the hero.
- **Tools make a site feel alive.** Filters, carts, forms, schedules, estimators, open-now state; every nav item a real destination.
- **Realism is matte.** Soft light, matte materials, real shadows, grain. Glossy plastic looks cheap.
- **Honesty builds trust.** Label samples, verify claims, never invent proof.
- **Look at the result.** Tests catch logic; your eyes catch taste.
- **Details are the difference.** Exact radii, shadows, motion timings, 44 px targets and measured contrast separate a finished site from a generated one (`11` to `13`).
- **One dial, held everywhere.** Calm for clinics, playful for dessert, editorial for fashion, bold for gyms.

## Bundled resources

| Path | What it is | When |
| --- | --- | --- |
| `references/01-design-dna.md` | Values, the original eight moves (a toolkit), realism lessons, sameness diagnostics, taste test | Before concept work and final review |
| `references/02-concept-engine.md` | Direction choice, topic to concept, local lens, worlds, objects, interaction, voice, divergence | Every project |
| `references/03-industry-playbooks.md` | Worlds, objects, tools and modes for 20+ business types | After you know the business |
| `references/04-imagery-pipeline.md` | 3D renders, still lifes, photos, Canva route | Whenever you need images |
| `references/05-motion-interaction.md` | Signature curve, hero state machine, reduced motion | Tuning motion |
| `references/06-build-architecture.md` | Full config reference (layouts, presets, blocks), kit API, publishing limits, bug catalogue | While writing the config and debugging |
| `references/07-quality-gates.md` | Build loop, gates, QA commands, handoff, feedback playbook | Before showing anything |
| `references/08-prompt-pack-template.md` | Canva prompt pack structure and base prompts | When photography is needed |
| `references/09-pattern-library.md` | Researched 2026 patterns: heroes, blocks, nav, type, colour, motion, what is fading | Choosing and justifying a direction |
| `references/10-domain-creativity.md` | Per-domain visitor needs, extra efforts, surprises, archetypes, sources | Every project |
| `references/11-interface-craft.md` | Exact values: radius, shadows, motion, icons, hit areas, text rendering | Every build (craft pass) |
| `references/12-layout-type-color.md` | Grouping, alignment, type scale, colour ramps, contrast thresholds | Every build |
| `references/13-accessibility-and-copy.md` | WCAG 2.2 rules, escalation triggers, interface copy rules | Every build |
| `references/14-review-protocol.md` | Evidence-based review, severity, verdict, stress scenarios, variants, reading existing sites | Final review, redesigns |
| `assets/scaffold/` | `site.template.html`, `app.js`, `blocks.js`, `blocks.css`, `presets.json`, example config | Every build |
| `assets/examples/directions/` | Four complete configs and screenshots: noir-demo, paper-editorial, brutal-bento, glass-frame | To see how far the scaffold stretches |
| `assets/examples/` | Hospital site template (slot booking), medical 3D scenes | When you need booking or anatomy |
| `assets/kit/` | Sheet, toast, focus-trap and hash-routing kit | Embedded by the builder |
| `scripts/direction.py`, `sameness_check.py` | Propose a direction; compare two configs | Steps 2 and 6 |
| `scripts/sdf.py`, `render_objects.py`, `scenes_food.py`, `scenes_misc.py`, `compose_scene.py` | 3D renderer, CLI, scenes, still-life composer | Step 4 |
| `scripts/build_site.py`, `init_project.py`, `test_site.py`, `audit.py` | Builder, initialiser, headless QA, interface audit with verdict | Steps 5 and 6 |
| `THIRD_PARTY_NOTICES.md` | Attribution and MIT licence for the adapted interface rules | Keep with the skill |

Setup if packages are missing: `pip install pillow numpy scipy playwright && playwright install chromium`.

## Worked examples (what a good run looks like)

**Cafe in Ahmedabad (coffee and ice cream).** `direction.py` returns `paper-editorial` (paper preset, editorial hero with cup and cone chips, bar nav, marquee, day story, gallery, reviews wall). Extra efforts: text menu with filters, open-now chip, WhatsApp ordering. Surprise: a seasonal banner (mango season). Not the saturated-worlds look, because that look has been used before.

**Automation software for clinics.** `noir-demo`: the hero is a replayable workflow card, with an estimator for hours saved, a plan table and a story; no objects. Surprise: the estimator feeds the demo request.

**Strength gym.** `brutal-bento`: bento hero with a live open-now tile, schedule block with Book buttons, membership estimator. **Specialist clinic.** `glass-frame`: a composed still life under frosted cards, vertical rail nav, team portraits, map.

Never reuse one of these for a different business. Run the engine, justify any override, and make something new.
