# 07 · Quality gates, review loop and handoff

A site is not done when the build passes. It is done when it passes the gates below and you have looked at it.

Contents: the build loop · design-first flow · gates · testing commands · what to look for in screenshots · honesty rules · final handoff template · iterating on feedback.

## The build loop

1. Concept one-pager (`02`). Decide worlds, objects, tool, variation axes.
2. Render or collect imagery (`04`). View every image on the world colour.
3. Write `site.config.json`. Content is specific, short, and honest.
4. `build_site.py`. Fix every warning (contrast, missing images).
5. `test_site.py`. Fix every failure.
6. **Look at the screenshots** in `qa/`: hero for every world, items, sheets, mobile. Fix what looks wrong. Rebuild. Retest.
7. Publish (Artifact tool, same `url` for updates) or save to outputs. Write the prompt pack if photography is needed.
8. Hand off in the template below.

Budget your effort: most of the quality comes from steps 2, 3 and 6.

## Design-first flow (when the user asks)

If the user says "design first", "don't build the HTML yet", or "show me 3 concepts", make a design canvas before building (use the Design artifact type when available). Boards: one analysis board (the taste and rules), then per concept an interactive hero board, a full home-page board, and one board with phone views. Use the same rendered objects. Put brackets on unknown facts ([PHONE], [00]). Do not verify the canvas with screenshots (the Design type's rules forbid it); verify your images separately. After the user picks a concept, build it with the scaffold.

## Gates

**Concept gate.** The one-pager names three worlds with colours, objects and words; a signature tool; the dial setting; and at least three variation choices that differ from the last site you built.

**Imagery gate.** Every hero object is recognisable at 100 px, matte, soft, free of unintended meaning, and sits on its world colour with visible shadows. No glossy plastic look. Faces, if any, are framed from the top.

**Content gate.** No lorem ipsum. No invented statistics or awards. All sample data is labelled sample. Prices, hours, phone, address and policies are placeholders unless the user supplied them or you verified them for a real business. Medical, legal and financial pages carry a safety line.

**Contrast gate.** `build_site.py` reports no contrast warnings. Body text 15 px or larger.

**Layout gate.** No horizontal overflow at 360, 390, 768, 1024, 1280, 1440, 1920 and 2560. No nav overlap at nine widths from 901 to 1440. Hero readable at 1280x600 and 390x844.

**Function gate.** Hero pickers, arrows, parked object, swipe; filters and empty state; item sheet; cart or form validation and success; About and Contact sheets; mobile menu; Escape closes; hash opens sheets. No console errors. No broken images.

**Accessibility gate.** Keyboard reaches everything. Visible focus. Labels on fields, errors announced. `aria-pressed` on toggles. Reduced motion respected.

**Performance gate.** Output under 14 MB (typically under 2 MB). Fonts are Google Fonts only.

**Uniqueness gate.** Put this site next to the previous one. If a stranger could swap their logos, change a variation axis (display face, corner style, texture, motion, hero layout) or the whole world logic.

## Testing commands

```bash
python scripts/build_site.py cfg.json out.html
python scripts/test_site.py out.html --out qa            # full: 8 widths, nine nav widths
python scripts/test_site.py out.html --out qa --quick    # faster pass while iterating
```

The script exits non-zero on any failure and prints the failed checks. It writes `hero_world*.png`, `sec_*.png`, `sheet_*.png`, `m_*.png`, `v_*.png`.

## What to look for in screenshots

- The hero object is centred, not clipped, with a visible floor shadow; decor is small and does not collide with the next-card or arrows.
- The ghost word is readable as a shape but never competes with the headline.
- The nav pill is legible both over colour (glass, white text) and over the page (solid, ink text).
- Cards have varied rotations or photos, not a wall of the same image. If every item shows the same world object, tell the user per-item photos or renders would lift the page (and offer them).
- Sheets are not cut off; the footer button is visible; error text is readable.
- Mobile: brand, cart and menu fit in the nav; the hero stacks cleanly; the grid is two columns for product catalogues.

## Honesty rules

- Say what is sample and what is real.
- Say what you could not verify (fonts in the sandbox, real addresses, local regulations).
- Say what was rendered versus photographed, and mark generated people as illustrative.
- Never claim a test passed that you did not run.

## Final handoff template

Keep it short. One link, what it does, what is placeholder, one question.

```
<Site name> is live: <link>.
What it does: <3 to 5 bullets: hero worlds, tool, pages, mobile>.
Tested: <what you ran and the result, e.g. 27 checks, 8 widths>.
Placeholders to replace: <contact, prices, hours, stories, policies>.
Images: <rendered / supplied / prompt pack link>.
One question: <the choice that matters most next>.
```

## Iterating on feedback

- "Looks cheap or glossy": lower specular, raise roughness, add layered shadows and grain, re-render. Check shapes again.
- "Overlap" or "broken at this size": reproduce at that width with the test script, fix the CSS in a class, add the width to the checks.
- "Use these images": follow Route B in `04`; use them everywhere sensible and report where.
- "Make it more unique": change two variation axes and the hero object; do not just recolour.
- "Prompts for Canva": produce the prompt pack (`08`).
- Small edits: Artifact `edit` action. Big edits: rebuild and republish to the same URL.
