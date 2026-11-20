# Designing something good (new or converted)

The identity makes a screen on-system. The craft files make it correct. **This file makes it *good*:** clear, intuitive, specific to its product and a pleasure to use. A tidy reskin of a bad structure is a failure; so is a template layout with pastel paint on it. Use this process for any new feature, screen, site or product, and for any conversion where the user wants the experience improved, not just recoloured.

## The loop

1. **Understand** → 2. **Structure** → 3. **Compose** → 4. **Make it specific** → 5. **Interaction and states** → 6. **Craft pass** → 7. **Critique** → 8. **Verify and report**

Do the thinking quietly and write down only the short artefacts named below. Ask the user **at most one question**, and only if the answer would change the whole concept; otherwise state your assumptions in one line and go.

## 1. Understand (write four lines)

| Line | Question |
|---|---|
| **Who and what in 5 seconds** | Who is here, what do they need to know or do, what must they see without scrolling at 1280 x 720 and at 375? |
| **The one primary action** | The single `bg-cta` action. If there are two, one of them is secondary |
| **The states** | Empty, loading, error with retry, success, offline, locked, long-data, first-run, signed-out |
| **The families** | Which tiles are featured, secondary, minimal; which entities get a category colour |

Also capture: frequency of use (daily tool or one-off visit?), device mix (desktop first, mobile complete), what content truly exists (never invent data), and what would make someone come back.

## 2. Structure before pixels

- **Information hierarchy first:** what is the number or fact they came for? Put it first, near the top and leading edge. Move the rest behind a disclosure, a tab or a detail view.
- **Flow:** map the happy path and the worst path (error, empty, no permission). Every dead end gets a way out.
- **Progressive disclosure:** show the 20% that serves 80% of use; name what is hidden ("Show 12 more", not "More").
- **Reversible by default:** prefer undo to confirmation; confirm only the irreversible (`craft/writing.md` section 5).
- Classify the page into a pattern family (`site-patterns.md` or `app-patterns.md`) and say which. If nothing fits, extend the nearest family and say so; do not invent a seventh visual language.

## 3. Compose (inside the system)

- **Three tile families per section** (featured, secondary, minimal), plus a KPI tile where numbers matter. A wall of N identical cards is always wrong: group, rank, or vary by importance.
- Layout from the container ladder and spacing tiers (`identity.md` section 4), grouping by space first (`craft/layout.md`). Decide the **mobile collapse order deliberately** for every grid.
- **Colour last, by category**: assign one hue per entity, cycled; if a screen reads as a rainbow, you coded decoration, so remove colour until each hue means something.

## 4. Make it specific (the anti-template step)

Generic output looks the same on any product: a centred hero, a soft gradient, three icon cards, a testimonial strip. Run these tests on your composition:

- **Swap test.** Replace this product's name and copy with a competitor's. If the page still works unchanged, it is a template. Rewrite until it could only be *this* product.
- **Noun test.** Do the headings use the product's real nouns and verbs, or "Powerful", "Seamless", "Supercharge"? Real nouns win.
- **Content test.** Is every number, name and quote real or clearly a labelled placeholder? Replace invented social proof with a designed empty state or honest copy.
- **One signature.** Pick **one** element only this product would have and make it excellent: a live preview tile that takes the chosen option, a mono wordmark with an accent dot, a segmented progress strip in the six hues, a marker-underlined key word, a ticket strip that lights one slot per typed character, a chart with the finding as its title. One memorable thing beats ten decorations.
- **Where creativity lives inside this system:** composition (bento spans, stagger offsets), the category mapping, the signature element, illustration and watermark glyph choice, empty-state character, copy voice, motion choreography within the budget. **Where it does not:** the palette, the radius ladder, Geist, the one-filled-button rule, no gradients or filled icons (the identity guards those).

## 5. Interaction and states

For every control and surface, decide **before building**:

- **Frequency** → motion budget (`craft/motion.md` section 1). Daily actions are instant; occasional ones animate; expressive motion only on first load, success and empty.
- **All states with a face**: default, hover, focus-visible, pressed, selected, disabled, loading, error, success. A control missing one is unfinished.
- **Input path**: a keyboard path for every pointer action, a single-pointer alternative for every drag, a 44px hit area (extended invisibly).
- **Error prevention over error messages**: constrain inputs, show requirements up front, validate on submit, never disable the submit button.
- **Power-user layer** where the product is used daily: command palette (`app-patterns.md`), shortcuts shown in tooltips, saved filters.
- **Calm loading**: invisible for the first ~280ms, then a small spinner with a mono label and reserved height; skeletons only for large lists that reliably take long.

## 6. Engagement micro-moments (pick, do not force)

Choose **one to three per screen**, each tied to a real feeling or need, all CSS or transform, all reduced-motion safe (catalogue in `creative-method.md`): count-up numbers that tick once, a breathing live dot, staggered tile arrival, a copy button that flips to a check, a pop-in for a chip you just added, a completion ripple, a presence chip ("12 active now", from real data), a welcome chip on first join. If a moment does not answer "what does this tell or reward the user?", cut it.

## 7. Craft pass

Load the domain files that match what you built (`craft/index.md` routing table): surfaces and icons, motion, typography, colour and contrast, accessibility, layout, writing. Fix as you go; do not leave it all to the end.

## 8. Critique (before you say it is done)

- **Remove test:** what can I delete without losing meaning? (Cheaper-fix ladder: delete first.)
- **Squint test:** blur the screen mentally. Is the primary action and the main fact still the most prominent things?
- **First five seconds at 1280 x 720 and 375:** is the useful content above the fold, not a decorative header?
- **Uncertain about the direction?** Build **three variants on one axis** (structure, density, emphasis, type or voice) with the variant technique in `craft/review-protocol.md` section 7, present trade-offs, never pick a favourite for the user.
- Run the **review protocol** on your own output: the 13 escalation triggers, then each domain. Then `audit.py`, and look at the screenshots.

## 9. Usability checks (apply to every screen)

1. **Visibility of status:** the user always knows what is happening (loading, saved, failed, offline).
2. **Match the real world:** the product's nouns and verbs, not internal names.
3. **Control and freedom:** undo, cancel, back; no trap states.
4. **Consistency:** the same thing looks and behaves the same everywhere; recurring controls live in the same place on every page of a family.
5. **Error prevention and recovery:** constrain first; every error says how to fix it.
6. **Recognition over recall:** options visible or searchable, not memorised.
7. **Minimal:** every element earns its place; secondary help lives behind a button or popover, not on the page permanently.
8. **Accessible by default:** keyboard, screen reader, zoom, reduced motion, contrast, as in `craft/accessibility.md`.

## 10. Deliverable: a short design note per screen

Keep it in the PR description or `docs/design-brand.md`: the four lines from step 1, the family used, the signature element, the micro-moments chosen, the states designed, and any deliberate deviation with its reason. The report in `SKILL.md` section 9 includes it.
