# 12 · Layout, typography and colour rules

Structural rules for how a page is organised, how text is set and how colour is built. Adapted from Jakub Krehel's `better-layout`, `better-typography` and `better-colors` skills (MIT; see `THIRD_PARTY_NOTICES.md`). The numbers are starting points where a project has no scale of its own; the scaffold has its own tokens, so use them. A *finding* needs a failure you can show (a clip, an overlap, a failing contrast pair), not a preference.

Contents: layout · typography · colour · detection patterns.

## Layout

1. **Group with space first, shapes second, lines last.** The gap between groups is at least twice the gap inside one (8 px inside means 16 px or more between).
2. **Controls look like controls.** Every interactive element has a background shape, a border, an underline or a consistent zone (a toolbar). A control styled like the text beside it is not recognised as one.
3. **Align to shared edges.** Choose a few alignment edges and put everything on them. One spacing step per level of nesting (16 px is a good default).
4. **Logical properties for anything that mirrors:** `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`. Physical left and right only for physical geometry such as safe-area insets.
5. **Order by importance.** The most important content sits near the top and the leading edge. Within a row, identifying content leads, metadata and actions trail. Visual order equals DOM order: never rearrange with `order`, `row-reverse` or grid placement.
6. **One primary action per view.** More than three secondary actions go behind a menu. Prefer a short view that links deeper over a long view that shows everything.
7. **Hint at hidden content.** Anything off-screen or collapsed has a visible cue: let the next card peek 16 to 32 px past the scroll edge, or show a disclosure control. A truncated value has a path to the full text.
8. **Clearance.** Start with 12 px between adjacent filled or bordered controls; 24 px between the visible glyphs of borderless text and icon controls (counting each button's own padding). Hit areas never overlap.
9. **Inset full-width buttons** from the layout margins (about 16 px on phones) unless they follow platform chrome.
10. **Content bleeds, controls float.** Backgrounds and media extend to the viewport edges; controls and text stay inside margins and safe areas. `env(safe-area-inset-*)` is non-zero only with `viewport-fit=cover` in the viewport meta (the scaffold sets it).
11. **Sticky header means `scroll-padding-top`** equal to its height, so anchors and focused elements never land beneath it.
12. **Hold the structure until it breaks.** Breakpoints come from the content, not device presets. Prefer container queries for components. Test the smallest and largest sizes first.
13. **Plan for growth.** Translated text grows; short strings grow most, so a one-word button is the riskiest element. Use `min-height` and `max-width`, never a fixed height or width on text boxes; let rows wrap. Test with one long-string locale (German) and one right-to-left locale.
14. **Never park a critical action** where zoom, resize or scrolling can clip it.

## Typography

Exact (findings when missed):

- Line-height is **unitless**: display 1.1, headings 1.2 to 1.3, body 1.5 to 1.6; anything wrapping to three or more lines is at least 1.4.
- Below 18 px use weight 400 or heavier. Weights 100 to 300 belong at 28 px and up.
- Cap long-form text at **60 to 75 characters** per line (`max-width: 65ch`).
- Inputs are **16 px** on mobile (iOS Safari zooms the page below that).
- `tabular-nums` on changing numbers. `lang` on `<html>`; `dir` where direction changes; wrap mixed-direction values in `<bdi>`.
- Use `rem` for font sizes so the reader's browser setting still applies.
- Typographic characters in rendered text: curly quotes, en and em dashes, the ellipsis character, non-breaking spaces; straight quotes only in code.

Heuristics (report only if they break the project's own scale):

- Few fonts: rarely more than three (marketing pages may carry more). Pair for contrast: a serif headline over a sans body reads as deliberate; two near-identical sans faces read as a mistake. Weight and size carry hierarchy; every extra weight or size dilutes it.
- Heading sizes descend with level; a heading is never smaller than body text unless it is a deliberate overline.
- Letter-spacing: headings 24 px and up `-0.01em` to `-0.02em` (display type may go tighter, as in the editorial and hero styles), uppercase labels 14 px or smaller `+0.05em`, body `0`. Use `em`.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. `text-align: start` for interface text; `justify` only in editorial layouts.
- Truncate with a way back to the full value. Natural case in the source with `text-transform` for style. Load every weight the design uses (browsers fake missing weights and distort them). Properties over raw tags (`font-weight: 650`, not `font-variation-settings`). Never propose a new typeface just to satisfy a checklist: the direction and preset already chose one.
- Size floors: long-form body 16 px; inputs and menus 14 px; captions 13 px; rarely below 12 px.

## Colour

1. **A system is ramps, not colours.** One neutral ramp, one accent ramp and only the status ramps the site actually renders. A second accent hue earns its place only when two things must be told apart at a glance. (Our "worlds" are deliberate multi-hue systems; keep each world's ramp coherent.)
2. **Every step has a job** (page background, hover, border, solid fill, body text). Do not generate steps no role uses.
3. **Name primitives by hue, semantics by role.** Components only reference semantic tokens (`--ink`, `--accent`, `--card`, `--line`). A token is used only in its role: never borrow a border colour for text because it works today.
4. **Hold the hue across a ramp.** One hue end to end, most vivid mid-ramp, finer steps at the light end (about 0.04 to 0.05 OKLCH lightness per step). Build ramps with a colour library, never by eye.
5. **One colour, one meaning.** Hues within 15 degrees of OKLCH hue count as the same colour. Never let colour be the only carrier of meaning: pair with an icon or label.
6. **Fill exactly one action per view.** The primary action gets the filled colour (on the background, not the label); peers stay neutral. Accent-coloured text on a neutral button reads as a link.
7. **Measure the rendered pair.** Contrast is foreground against the background it actually renders on (card, image, translucent layer), in light and dark. Never report a ratio you did not measure. When a pair fails, change **lightness** first, hold hue and saturation, remeasure.

| Content | WCAG 2 AA | APCA (Lc) |
| --- | --- | --- |
| Text | 4.5:1 | 75 body, 60 labels and headlines |
| Large text (24 px, or 18.67 px bold) | 3:1 | 45 |
| UI components and meaningful graphics | 3:1 | 30 to 45 |

8. Gradients: interpolate `in oklab` by default; `in oklch` when a two-hue gradient goes grey in the middle. Text on a colour with alpha must be measured on the rendered result.
9. Dark mode is its own palette, not the light ramp reversed: lower the accent's chroma, widen the dark end, remeasure every pair. Use one switching mechanism.

## Detection patterns (grep for these)

| Pattern | Fix |
| --- | --- |
| `1fr` track or flex child holding long text overflowing | `minmax(0, 1fr)` on the track, `min-width: 0` on the child |
| `width: 100vw` | `width: 100%` (100vw includes the scrollbar) |
| `height: 100vh` on a mobile full-height pane | `100dvh` (the scaffold hero uses `100svh`) |
| Fixed `height:` on a box holding text | `min-height` |
| `@media (max-width)` inside a reusable component | `@container` on the parent |
| `env(safe-area-inset-*)` without `viewport-fit=cover` | Add it |
| Sticky header without `scroll-padding-top` | Set it |
| `line-height` in px or rem | Unitless |
| `letter-spacing` in px | `em` |
| Weight 100 to 300 on text under 18 px | 400 or heavier |
| `text-wrap: balance` on a paragraph | `pretty` |
| `...` or `--` in rendered text | `…` or a dash |
| Literal hex in a component where a token exists | Use or add the token |
| White text on a mid-bright fill | Measure; darken the fill |
