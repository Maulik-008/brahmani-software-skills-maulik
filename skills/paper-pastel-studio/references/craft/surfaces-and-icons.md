# Surfaces and icons

[craft] adapted from `better-ui`. Values are exact. See `../precedence.md` for where the identity overrides.

## 1. Concentric radius

For a rounded element nested in a rounded element: **outer radius = inner radius + padding + border width.** Equal radii on parent and child make the child look pinched.

| Outer (P&P ladder) | Padding | Inner |
|---|---|---|
| `rounded-[28px]` featured card, dialog | `p-2` (8px) | `rounded-[20px]` |
| `rounded-[24px]` content card | `p-2` (8px) | `rounded-[16px]` |
| `rounded-[20px]` default card | `p-1.5` (6px) | `rounded-[14px]` |
| `rounded-[18px]` compact card | `p-1` (4px) | `rounded-[14px]` |
| `rounded-[16px]` tile | `p-1.5` (6px) | `rounded-[10px]` |

- With a 1px hairline border on the outer card, add 1px: a `[24px]` card with `p-2` and a border holds an inner `[15px]`; in practice 16px reads identically, use the ladder value.
- **Padding above 24px**: treat the layers as separate surfaces and pick each radius on its own. Do not chase the maths.
- Pills are concentric by nature (radius is half the height). A pill inside a pill with equal padding needs no adjustment.

## 2. Optical alignment

- **Button with text and icon:** the side that carries the icon gets about **2px less padding** (`ps-5 pe-3.5` when the icon trails). With the trailing arrow-in-circle CTA, the circle's outer gap should match the leading padding visually, not numerically.
- **Play triangle:** `translateX(2px)` toward its point. This is a deliberate physical shift.
- **Asymmetric icons:** fix the SVG (`viewBox` or path) first. If you cannot, `translate-x-px` on the wrapper.
- Judge by eye at the real rendered size, in both themes.

## 3. Depth

[P&P] Cards use a **hairline `border-border` plus the surface ramp**, no resting shadow. Real shadows exist only for hover lift and floating chrome (nav, dialog, sheet), built from `--shadow-color` (`identity.md` section 1).

[craft] rules that still apply:
- **Layer the real shadows.** One large soft layer reads as a smudge. Pair a 1px-ish contact layer with a wide soft one: `0 1px 2px hsl(var(--shadow-color)/.06), 0 12px 24px -8px hsl(var(--shadow-color)/.18)` (the system's hover lift is exactly this).
- **Keep a real border where the edge matters.** Box-shadow is removed in forced-colors (Windows high contrast) mode; a 1px `border` (even a transparent one) keeps the edge. Dividers, table cells, selected states and form inputs always use real borders.
- Dark mode: tinted layered shadows vanish on ink. Rely on the surface step and a `border-border` edge there; the token-built shadows already darken.
- **Hover styling only where hover exists**: `@media (hover: hover)`. Tailwind 4's `hover:` already compiles under it. Tailwind 3: set `future: { hoverOnlyWhenSupported: true }`. Plain CSS: wrap it. Where a control draws its own pressed state, add `-webkit-tap-highlight-color: transparent`.
- **Scrollable overlays** (dialogs, drawers, menus, side panels, command palette): `overscroll-behavior: contain` (`.scroll-contain` in `assets/craft.css`) so the page behind does not scroll.

## 4. Images

- **1px inset outline** on photographs and screenshots: `outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10`. Always pure black or white at 10%, never a tinted grey or an accent colour (it picks up the surface and reads as a dirty edge). `.img-outline` in `assets/craft.css` does the same in plain CSS.
- Skip transparent PNG cut-outs, logos and illustrations.
- Use `outline`, not `border`, so the image does not change size.
- This outline is the one sanctioned black/white literal besides the `on-tint` chip pair, because it is theme-aware by construction.
- Always set explicit `width`/`height` (or `aspect-ratio`) so nothing shifts while loading.

## 5. Icons

[P&P] Lucide only, `strokeWidth` **1.75** (watermarks 1), `h-4 w-4` in text, `h-3 w-3` in meta, usually in a `rounded-full` chip, no filled sets, no emoji.

[craft] rules layered on top:
- **One icon library per surface** and one stroke width per cluster. Never mix 1.5 and 2 in one row of icons.
- **Colour comes from `currentColor`.** Strip hard-coded `fill`/`stroke` hex from any SVG you import. State is expressed by CSS colour or opacity (disabled `opacity-50`, active `text-foreground`).
- **Size relative to text:** inline icons 1em to 1.25em of the adjacent font size (16px beside 14px text is fine).
- **Test icons at the smallest render size** (often 16px). If a detail disappears there, simplify it or use a 16px-grid icon.
- **SVG only.** Never an icon font, never a raster.
- **Selected state without fill:** chip background (`bg-chip-*/10` to `/15`), glyph colour, and a label or position cue. The system does not use filled glyphs.
- **Icon-only controls need an accessible name** (`aria-label` on the button, `aria-hidden` on the icon). See `accessibility.md`.
- **RTL:** mirror directional glyphs only (back/forward arrows, chevrons, list and alignment glyphs, "send"). Never mirror logos, checkmarks, physical objects or media-playback icons. One mechanism per element: `rtl:-scale-x-100` or `[dir=rtl] .icon-directional { scale: -1 1 }`, not both.
- **Scaled-stroke caveat (measured reasoning):** a 24px-grid icon drawn at 16px paints a `strokeWidth` 1.75 line at about 1.17px. That is the system's quiet look and is accepted. If an icon must hold a specific rendered weight next to text (for instance 1.5px beside 400-weight copy), use Lucide's `absoluteStrokeWidth` or `vector-effect: non-scaling-stroke`, and keep it constant across the cluster.
- **Icon swaps** (copy to check, play to pause): see `motion.md` section 8. Tab-icon changes and hover-revealed row actions do not animate.

## 6. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| Padded parent and child with the same radius | Child radius = parent radius minus padding (table above) |
| `box-shadow` ring with no `border` on a depth-only surface that must survive forced-colors | Add `border: 1px solid transparent` |
| `outline-slate-*`, `outline-zinc-*` or a hex on an `img` | `outline-black/10 dark:outline-white/10` |
| `fill="#..."` / `stroke="#..."` inside an icon SVG | `currentColor` |
| `:hover` or `hover:` outside `(hover: hover)` (Tailwind 3, plain CSS) | Wrap or enable `hoverOnlyWhenSupported` |
| `overflow: auto` on a dialog, drawer or menu without `overscroll-behavior` | `overscroll-behavior: contain` |
| Mixed stroke widths in one icon row | One width per cluster |
| Icon button without a name | `aria-label` on the button |
| Image without `width`/`height` | Add dimensions or `aspect-ratio` |

Verify without a browser by reading every state from code (hover, pressed, selected, loading, empty). With a browser, walk each one in **both themes**.
