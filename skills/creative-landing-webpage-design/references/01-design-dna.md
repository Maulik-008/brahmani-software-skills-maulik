# 01 · Design DNA

> **Read this first.** The "eight signature moves" below come from the four reference sites and are a **toolkit, not a template**. After the first builds, real feedback showed that sites made with only these moves (colour field, hero object, ghost word, pill nav) all looked "almost the same". The invariants of this skill are the *values* underneath: real tools, realism and depth, honesty, motion discipline, accessibility, and a visual language that is ownable. The *surface* (the sunlit-worlds look) is one of ten directions; see `09-pattern-library.md` and run `scripts/direction.py` before every build.

This is the taste the skill encodes. It was derived by analysing four reference sites in depth (Creamy ice cream, Puffy puffer jacket, Bowl smoothie bowl, Lunar Homes real estate) and then refined through many rounds of real feedback while building three hospital concepts and one full hospital site. Read it before concept work, and again before the final review.

Contents: the eight signature moves · calm-to-playful dial · realism lessons · anti-patterns · taste test.

## The eight signature moves

Each move lists why it works and where the scaffold implements it.

1. **One colour world at a time.** The whole screen takes a single saturated hue, and switching a variant changes background, hero object, ghost word and copy together over about 900 ms. It makes a page feel like a place, not a template, and turns "choose a category" into a moment of delight. Scaffold: `worlds[]`, hero `paintHero()`. Rule: every world colour must reach 4.5:1 against its text colour (`build_site.py` warns). Never use neighbouring hues for two worlds.
2. **A hero object, not a stock photo.** One cut-out object, lighter than its background (tone on tone), lit softly with layered shadows and a floor shadow. A second object waits, small and blurred, in the bottom-right corner and invites a click. The object is what the customer would hold: a cup, a cone, a jacket, a heart. Scaffold: `.ob` states 0 to 3, `decor[]`.
3. **Type as a shape.** A giant, fat display word (about 350 px at 1440) sits behind the object at 12 to 14 % white. It is graphic first, label second. Headline in the body face, weight 500, tight tracking (-0.035em). Scaffold: `.wd`, `worlds[].word`. Turn it off with `theme.heroWord:false` when the brand is quiet.
4. **Pills and circles everywhere.** Nav, buttons, chips, arrows, filters are round; cards sit between 28 and 52 px radius. One radius language per site: `pill` (default), `soft`, `sharp` via `theme.radius`.
5. **Floating glass.** A translucent nav pill with backdrop blur that turns solid white after the hero, glass cards over colour, frosted chips. Layers float; nothing is boxed in. Scaffold: `.pillnav`, `.nxt`, `.em`.
6. **Slow, weighty motion.** One long ease, `cubic-bezier(0.51, 0, 0, 0.98)`, 0.9 to 1.6 s for colour changes and slides; hover and press stay quick (200 to 300 ms). Objects drift a few pixels with the pointer. Sections reveal once. Everything respects `prefers-reduced-motion`. See `05-motion-interaction.md`.
7. **Tools, not brochures.** Every nav item opens a real page or scrolls to a working section. Filters, search, carts, forms, "open now" state, availability. A site with only pretty sections feels like a poster. Scaffold: find bar, items grid with filters, cart or form, hours chip.
8. **Playful but tidy.** Little copy, generous space, one idea per screen. Playful devices (tilted cards with hard offset shadows, doodles, stickers) appear only when the brand is playful.

## The calm-to-playful dial

Set it deliberately from the business, then hold it everywhere.

| Business | Dial | Choices |
| --- | --- | --- |
| Clinic, hospital, legal, finance | Calm | Deep saturated worlds with white text, no stickers, no tilt, neutral shadows, formal headings, emergency or safety line always visible |
| Cafe, restaurant, dessert, kids | Playful | Tilted story cards with hard offset shadows, bubbly display face, warm tints, wave dividers, doodles |
| Fashion, jewellery, design studio | Editorial | Fewer worlds, serif display face, `radius: sharp`, slower motion, big photography |
| Gym, sport, nightlife | Bold | High-contrast worlds, condensed display type, faster 0.6 s easing, diagonal cuts |
| SaaS, services | Crisp | Light surfaces, one accent world, product screenshots as hero object, tight copy |

## Realism lessons (learned the hard way)

The first hospital imagery was inflated, glossy "balloon" shapes. The user called it cheap. These rules came out of that feedback.

- **Matte beats glossy.** Use roughness 0.5 to 0.85, specular 0.03 to 0.2. A shiny plastic look reads as a toy. Matte clay, ceramic, felt and ivory read as premium.
- **True 3D beats inflated 2D.** A signed-distance ray-marcher with a soft key light, soft shadows and ambient occlusion produced real depth; a height-field "inflate" trick did not. See `04-imagery-pipeline.md`.
- **Layered shadows.** Two `drop-shadow` filters (a tight contact one and a long soft one) plus a blurred floor ellipse make objects sit in the scene.
- **Grain and vignette.** A 4 to 17 % overlay noise tile and a 20 % radial vignette on the hero make flat colour feel photographic.
- **Shape safety.** Check every silhouette for unintended meaning. A dog-bone shape reads as a pet shop. A knee model with two round condyles on a shaft read as suggestive. Replace it with something unmistakable and neutral (a bent limb with a joint ball and a kneecap). When in doubt, rotate the object or change the view and look again.
- **People.** When the user supplies portraits, use them everywhere a person appears (cards, profile, avatars, availability chip). Pick the framing with the face in the top 12 to 14 % (`object-position: 50% 14%`) and match backdrop colours to the world tint.
- **Look at the screenshots.** Passing automated tests is not the same as good. Several real bugs (a giant decor image, a mis-aligned grid, a mobile nav overflow) only showed up in screenshots.

## Anti-patterns (never)

- Lorem ipsum, "Welcome to...", filler copy, fake awards, invented statistics, invented testimonials presented as real. Sample content is allowed only if labelled "sample" in the UI and the final message.
- Emoji as icons or decoration. Use stroke SVG icons.
- Decorative gradient washes, glow blobs, purple-to-blue gradients, left-border accent cards, three identical feature cards with icons.
- Stock-photo clichés: handshakes, thumbs-up, floating holograms, a centred hero over a blurred stock image.
- Mixed corner radii, three font families, body text below 15 px, low-contrast grey text.
- A hero that cannot be read at 1280x600 or 390x844.

## Sameness diagnostics (run before showing anything)

If two or more of these are true, the site is probably a repeat. Change direction, not just colour.

- The hero has a saturated colour field, a ghost word and a hero object (the stage look) and the previous site did too.
- The nav is a floating glass pill again.
- The section order is hero, find bar, collection cards, items grid, stories, band again.
- The same display face as the last site.
- The headline could swap into another business without edits.
- No block beyond the classic ones (no marquee, story, estimator, schedule, compare, map, bento, gallery).
- The imagery language is the same (rendered objects on flat colour) for a business that sells an experience or a service.

Fix with `scripts/direction.py --avoid-file <previous direction.json>` and `scripts/sameness_check.py`.

## Taste test (answer before showing the user anything)

1. Could you tell this site is about this business with the text hidden?
2. Does each world have its own colour, object and word, and does switching feel good?
3. Is there one object you want to touch?
4. Is there a tool you could use in 10 seconds (filter, add to cart, check hours)?
5. Is every nav item a real destination?
6. Does the mobile layout feel designed, not squeezed?
7. Do shadows, grain and matte materials make it look real, not toy-like?
8. Would a stranger remember it tomorrow? If it looks like the last site you built, change the direction (preset and hero layout first), not only a variation axis (see `02-concept-engine.md` and `09-pattern-library.md`).
9. Does it carry at least one extra effort and one surprise that only this business would have (see `10-domain-creativity.md`)?
