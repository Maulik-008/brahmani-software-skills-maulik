# 09 · Pattern library (researched, 2026)

This file answers one question: **how do you make every site look and feel different, and still be excellent?** It is built from a research pass on current web design (2026 trend reports from Webflow, Digidop, Line25, spoko.space and others; domain studies listed in `10-domain-creativity.md`) and from real feedback on earlier builds, where two sites made with this skill looked "almost the same".

Contents: 1 the sameness problem · 2 the toolkit at a glance · 3 hero patterns · 4 section and block patterns · 5 navigation · 6 type · 7 colour and surface · 8 texture and shape · 9 motion · 10 copy · 11 performance and accessibility · 12 what is fading · 13 how to be ownable · 14 sources.

## 1. The sameness problem

Two waves made websites look identical: free themes (hero, features, about, contact) and now generated sites (a centred hero, a purple gradient, three feature cards). Research from multiple sources agrees that the answer is **a visual language that is recognisably the brand's own**, not a trendier effect. Trends are tools: a bento grid suits software, not a law firm; neo-brutalism suits a challenger brand, not consumer electronics.

Our own version of the problem: a saturated colour field, grain, a ghost word, a pill nav and a left-aligned headline. Strong, but if every site has it, none is memorable. The skill now treats that look as **one direction among ten** (`sunlit-worlds`) and requires every build to choose a direction deliberately (`scripts/direction.py`).

A direction is the combination of: **preset** (surface, type, corners, borders, shadows) × **hero layout** × **nav style** × **block list** × **imagery language** × **motion personality** × **one surprise**.

## 2. The toolkit at a glance (what the scaffold supports now)

| Axis | Options (config key) |
| --- | --- |
| Preset | `world` (default saturated worlds), `paper`, `noir`, `brutal`, `glass`, `sticker`, `luxe` (`theme.preset`) |
| Hero layout | `stage`, `editorial`, `frame`, `demo`, `bento` (`hero.layout`) |
| Nav | `pill`, `bar`, `rail` (`nav.style`); phones always get the compact pill |
| Blocks (`page.order`) | `marquee`, `bento`, `story`, `compare` (slider or table), `estimator`, `gallery`, `faq`, `schedule`, `reviews`, `team`, `stats`, `map` + the classic sections `find`, `worlds`, `items`, `how`, `stories`, `band` |
| Corners | `theme.radius`: `pill`, `soft`, `sharp` |
| Texture | `theme.grain` opacity, preset-specific |
| Fonts | `theme.fontDisplay`, `theme.fontBody`, `theme.googleFonts` (presets set sensible defaults) |

Each is documented in `06-build-architecture.md`. Working examples of four directions are in `assets/examples/directions/`.

## 3. Hero patterns

| Pattern | What it is | Use when | Config | Pitfalls |
| --- | --- | --- | --- | --- |
| **Stage** (sunlit worlds) | One saturated colour world, a hero object, a ghost word, pickers that swap the whole screen | Product families with strong objects (food, dessert, kids, retail) | `hero.layout:"stage"` | Overused; do not make it the default |
| **Editorial** | Oversized type is the layout; small image chips sit inside the sentence; an index strip of collections underneath | Brands that sell taste: cafes, hotels, boutiques, studios, premium services | `hero.layout:"editorial"`, `hero.editorial.lines` | Needs a short, strong headline; chips need clean cut-outs |
| **Frame** | A full-bleed photo or composed still life under a soft tint, with frosted cards and a floating search pill | Places and people: clinics, hotels, real estate, spas, schools | `hero.layout:"frame"`, `hero.frame.image` | Needs good imagery (photo or `compose_scene.py`) |
| **Product-as-hero (demo card)** | A replayable live example of what the service does | Software, automation, services with a process | `hero.layout:"demo"`, `hero.demo.steps` | Keep to 5 to 8 steps; the demo must be the real value, not decoration |
| **Bento** | A modular grid of tiles: headline, collections, live status, CTA, quote | Many equal-weight things at once: gyms, events, creative brands | `hero.layout:"bento"`, `hero.bento.tiles` | Tiles must earn their place; leave no empty grid cells |

Research notes: interactive product previews in the hero are replacing static screenshots; outcome-first headlines with proof directly under the primary CTA convert best; oversized, expressive type is now the dominant hero move on award-winning sites.

## 4. Section and block patterns

- **Bento grid with active tiles.** Tiles of different sizes; on hover they lift or reveal. Good for scannable feature sets. `bento` block.
- **Marquee ticker.** An endless strip of short phrases and objects; adds energy and brand voice, pauses on hover, static for reduced motion. `marquee` block (`style:"small"` for a quiet ticker).
- **Sticky scroll story with progress.** A pinned visual swaps as chapters scroll past, with a progress bar. Research calls this "guided scrolling": scroll as wayfinding, with progress indicators and steps that advance. `story` block. Collapses to stacked cards on phones.
- **Compare.** Before and after slider for visual change, or a feature table with a highlighted plan. `compare` block.
- **Estimator.** A small calculator (sliders and selects with sample rates) that outputs a number and feeds a CTA. Works for membership price, hours saved, a quote, an EMI-style estimate. `estimator` block. Always label numbers as sample unless the business provided them.
- **Horizontal gallery rail.** Scroll-snap cards with arrows; for objects, rooms, work. `gallery` block.
- **Reviews wall.** A slow marquee of review cards; mark as sample unless real. `reviews` block.
- **Live schedule.** Day chips and class rows with Book buttons; the highest-impact feature for fitness and studios. `schedule` block.
- **Map with pins.** A stylised city map and a list; no external tiles needed. `map` block.
- **Team.** Portraits or initials with roles. `team` block.
- **Stats.** Big numbers, only when the business supplied them. `stats` block.
- **FAQ accordion.** Short, honest answers. `faq` block.
- **TL;DR layout.** An overview that lets people scan first and dive later (hero index strip, bento overview, a short "how it works"). Build it into the hero rather than adding a long page.

## 5. Navigation

| Style | Best for | Notes |
| --- | --- | --- |
| **Pill** (floating, glass) | Colour-led, playful sites | The signature of the original look |
| **Bar** (full width, underline for current) | Editorial, SaaS, brutalist, luxe | Calm, familiar, always legible |
| **Rail** (vertical icon pill at the left) | Frames over imagery, dashboards, boutique services | Content shifts clear of it; phones fall back to the compact pill |

Rules from the research: the hamburger is a secondary pattern; on phones keep the primary action visible (a button or a bottom bar), keep the menu a drawer with a backdrop and Escape to close, hide-on-scroll-down and show-on-scroll-up saves space on content-heavy pages, and key details (hours, phone, location, booking) belong in header and footer. A bottom tab bar suits app-like sites and can be added as a custom extension.

## 6. Type

- **Oversized and expressive** headlines that fill the width are the defining move of 2026; clip them at the edge on purpose.
- **Pair deliberately:** a display face with character plus a quiet body face (two families, never five). Presets set pairs; `direction.py` suggests alternates.
- **Dynamic text:** an italic accent word in a headline (`{"em":"slowly."}`), inline image chips, text that reveals on scroll. Keep it readable.
- **Image-filled text** (`background-clip:text`) can be added as a custom touch for creative brands.
- Body copy at 16 to 19 px with a 55 to 65 character line; headings tight (-0.03 to -0.045em).

## 7. Colour and surface

- **Full colour systems** are replacing "one accent": use several hues deliberately (our worlds do this).
- **Dark mode 2.0:** a dark surface with a saturated accent as a whole identity (`noir`, `luxe`), not an afterthought toggle.
- **Barely-there minimalism** for premium services: one or two typefaces, two or three colours, white space as structure (`paper`).
- **Neo-brutalism:** thick borders, flat bold colour, hard shadows, mono labels (`brutal`). For challenger and youth brands; not for clinics.
- **Soft glass:** frosted cards on pastel (`glass`). Use as an accent, never the entire system.
- Every text colour must meet 4.5:1. `build_site.py` checks world colours.

## 8. Texture and shape

- **Grain** (a low-opacity noise tile) restores a human, photographic feel; keep it at 4 to 17 %.
- **Organic shapes**, wave dividers and blobs make a page "breathe" (use in `sticker` or `world` directions).
- **Hard offset shadows** for sticker and brutal directions; soft long shadows for glass and paper.
- **Real depth in imagery:** matte 3D renders with soft shadows beat flat icons (`04-imagery-pipeline.md`); composed still lifes beat stock photos (`compose_scene.py`).

## 9. Motion

- Motion conveys hierarchy, state and narrative; it is not decoration. Award-winning sites lean on scroll-driven and state-based motion.
- **CSS scroll-driven animations** (`animation-timeline: view()`) need no JavaScript and run off the main thread; fall back to the observer-based reveals already in the scaffold. Use them for custom section entrances.
- **Micro-interactions** on every control (hover, focus, pressed, success): quick (150 to 300 ms), ease-out, `transform` and `opacity` only, press scale 0.96 (never below 0.95), entrances starting near 0.95 scale, never from 0.
- **Magnetic buttons** and a **custom cursor** are desktop-only flourishes; skip on touch.
- Keep UI animation under 300 ms and big colour changes at 900 to 1000 ms with the signature curve (`05-motion-interaction.md`). Respect `prefers-reduced-motion`.

## 10. Copy

- **Minimalism in copy.** With unlimited generated text available, saying less is distinctive. Cut everything that is not load-bearing.
- **Outcome first.** Name the problem, the audience and a concrete outcome. Proof sits directly under the primary CTA.
- **One conversion goal per page.** Hero action repeated at the end.
- **Labelled samples.** Anything invented is marked sample.

## 11. Performance and accessibility

Targets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1; filter and search updates feel instant. The scaffold ships one HTML file with compressed WebP images and no frameworks. Accessibility is a requirement (the European Accessibility Act now applies to many services): contrast, keyboard access, visible focus, labels and errors, reduced motion, touch targets of at least 44 px, no information by colour alone.

## 12. What is fading (avoid)

Full-screen hero carousels and sliders · parallax on every element · a mandatory animated loader before content · the hamburger as the only mobile navigation · five fonts on one page · sharp rectangles with zero breathing room everywhere · "we have dark mode" without a reason · sterile stock photos without context · generating a site with no strategy.

## 13. How to be ownable

1. **A signature visual device** used consistently: our rendered matte objects, an inline image chip, a ghost word, an estimator in the brand's colours, a hero that is a live demo.
2. **One surprise per site** that belongs to the business (`direction.py` proposes one): a seasonal banner that follows the calendar, a symptom-to-department finder, a plan estimator, a commute estimator, a replayable workflow.
3. **One local or human detail** that a template could not know (a landmark, a season, a language, a habit).
4. **A different direction from the last site.** Run `sameness_check.py`.

## 14. Sources (research pass, 2026)

- Webflow, "8 web design trends to watch in 2026" (proprietary effects, art meets UI, minimal copy, TL;DR experience, colour systems, dynamic text, guided scrolling, infinite canvas).
- spoko.space, "Modern Website Design 2026" (bento, dark mode, neo-brutalism, glassmorphism, grain, organic shapes, kinetic type, CSS scroll-driven animation, navigation patterns, performance, what works and what does not).
- Digidop, "Web design trends 2026" (motion as the norm, clarity and accessibility for B2B).
- Line25, Hostinger, Clutch trend roundups (oversized type, maximalism, microinteractions, experimental navigation).
- Domain sources are listed in `10-domain-creativity.md`.
