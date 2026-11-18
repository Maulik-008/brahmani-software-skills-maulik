# 11 · Interface craft: the details that make it feel finished

Great interfaces are rarely one big idea. They are many small, correct details that add up. This file holds the exact values. Apply it to every site, whatever the direction. It is adapted from Jakub Krehel's `make-interfaces-feel-better` and `better-ui` skills (MIT; see `THIRD_PARTY_NOTICES.md`).

Contents: how to review motion · surfaces · motion rules · icons · typography rendering · performance · quick fixes table.

## How to review motion

Slow the interface down. Replay animations at 10 % speed (browser devtools, Animations panel) and walk every state: hover, focus, active, loading, empty, error. What feels off at 10 % speed is subtly wrong at full speed. Write fixes in the project's existing styling approach; the scaffold is plain CSS, so keep it plain CSS.

## Surfaces

**Concentric radius.** For a rounded element nested in a rounded element: `outer radius = inner radius + padding`. Equal radii on parent and child make the child look pinched. When the padding is larger than 24 px, treat the layers as separate surfaces and pick each radius on its own.

**Optical, not geometric, alignment.** A button with text and an icon takes about 2 px less padding on the icon side (`padding-inline: 16px 14px` for an icon at the end). A play triangle shifts about 2 px toward its point. Asymmetric icons are best fixed in the SVG itself.

**Shadows for elevation, borders for structure.** For cards, buttons and chips whose border only creates depth, use layered transparent shadows; they adapt to any background. Keep real borders for dividers, table cells, selected and focus states, and form inputs.

```css
:root{
  --shadow-ring: 0 0 0 1px oklch(0 0 0 / .06), 0 1px 2px -1px oklch(0 0 0 / .06), 0 2px 4px 0 oklch(0 0 0 / .04);
  --shadow-ring-hover: 0 0 0 1px oklch(0 0 0 / .08), 0 1px 2px -1px oklch(0 0 0 / .08), 0 2px 4px 0 oklch(0 0 0 / .06);
}
/* dark surfaces: one white ring, layered shadows are invisible there */
.dark{ --shadow-ring: 0 0 0 1px oklch(1 0 0 / .08); --shadow-ring-hover: 0 0 0 1px oklch(1 0 0 / .13); }
```

**Image outlines.** Photographs get a 1 px inset outline: `outline:1px solid oklch(0 0 0 / .1); outline-offset:-1px` on light surfaces and `oklch(1 0 0 / .1)` on dark ones. It must be pure black or pure white at 10 %, never a tinted neutral from the palette (it picks up the surface colour and reads as dirt on the edge). Cut-out PNG objects get no outline.

**Hit areas.** At least 44 x 44 px on touch, at least 40 x 40 px in dense desktop UI (WCAG 2.2 AA minimum is 24 x 24). If the visible control is smaller, extend it with a pseudo-element. Hit areas of two controls never overlap. Decorative layers get `pointer-events:none`.

## Motion rules

1. **Use transitions for interactive state, keyframes for one-shot sequences.** Transitions retarget mid-flight when the user changes their mind; keyframes restart. A drawer that closes while opening must reverse smoothly.
2. **Press feedback:** `scale: .96` on `:active`, with `transition-property: scale` and about 150 ms ease-out. Never below `.95`. Provide a way to turn it off for controls where it distracts.
3. **Staged entrances** (first load of a hero, a success state): split the content into semantic chunks and stagger them about 100 ms apart, each with `opacity 0 to 1`, `translateY(12px) to 0`, `blur(4px) to 0`, about 400 ms ease-out. Titles may stagger word by word at about 80 ms. Do not stagger routine, frequent interactions.
4. **Exits are softer and shorter than entrances:** a small fixed `translateY(-12px)` with opacity and a little blur, about 150 ms ease-out, not the full container height. Use the longer full exit only when spatial context matters (a drawer closing, a card returning to a list). Remove at once when motion adds no information.
5. **Contextual icon swaps** (play to pause, like to liked): cross-fade with `opacity 0 to 1`, `scale .25 to 1`, `blur 4px to 0`. With a motion library use `transition:{type:"spring",duration:.3,bounce:0}`. Without one, keep both icons in the DOM (one absolutely positioned) and cross-fade with `transition-property: opacity, filter, scale; duration .3s; easing cubic-bezier(.2,0,0,1)`. Bounce is always 0.
6. **Skip the animation on first paint** for elements that are already in their default state.
7. **Motion restraint.** No custom animation on high-frequency interactions (row hover, keystrokes, repeated taps): give instant feedback or at most a 100 to 150 ms colour or opacity change. Motion is never the only feedback: every animated state change also leaves a static cue (colour, icon, label). Brief and small beats prominent.
8. **Honour reduced motion** (see `13-accessibility-and-copy.md`).

The scaffold's signature curve (`cubic-bezier(.51,0,0,.98)`, 0.9 to 1.6 s) is for large brand moments (a world change, a sheet opening). Everything small follows the rules above.

## Icons

| Adjacent text | Stroke width on a 24 px grid |
| --- | --- |
| Regular (400), 14 to 16 px | 1.5 px |
| Medium or semibold (500 to 600) | 2 px |
| Bold (700) or emphasised, standalone | 2.5 px |

One stroke weight per icon set on a surface; never mix icon libraries. One SVG per icon drawn with `currentColor`; hover, selected and disabled states come from CSS colour and opacity, never from separate assets. Outline is the default, fill marks the active state. Test every icon at the smallest size it renders (often 16 px). Flip directional icons in right-to-left layouts (arrows, chevrons); do not flip logos, check marks, clocks or media controls. Every icon-only control has an accessible name; decorative icons are hidden from assistive technology.

## Typography rendering

- `html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }` once on the root.
- `text-wrap: balance` on headings and short blocks (works up to about 6 lines); `text-wrap: pretty` on paragraphs, captions and list items. Leave long text (10+ lines) and code alone.
- `font-variant-numeric: tabular-nums` on anything that updates (prices, counters, timers, numeric table columns). Not on phone numbers or version numbers.

## Performance

- Never `transition: all`. Name the properties that change (`transition-property: scale, background-color`).
- `will-change` only for `transform`, `opacity` or `filter`, only when you see first-frame stutter, never `will-change: all`.

## Quick fixes

| Mistake | Fix |
| --- | --- |
| Same radius on parent and child | `outer = inner + padding` |
| Border faking elevation | Layered transparent `box-shadow` |
| Icon looks off-centre | Optical padding or fix the SVG |
| Numbers jump as they change | `tabular-nums` |
| Heavy text on macOS | `antialiased` on the root |
| `transition: all` | List the exact properties |
| First-frame stutter | `will-change: transform`, sparingly |
| Tiny tap targets | Extend to 44 px (40 px dense desktop) |
| Hairline icon beside bold text | Match stroke to text weight |
| A separate asset per icon state | One `currentColor` SVG |
| Entrance animation on every hover | Instant feedback or a 150 ms opacity change |
| Dramatic exits | 150 ms, 12 px, ease-out |
