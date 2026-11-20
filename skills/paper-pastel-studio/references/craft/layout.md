# Layout

[craft] adapted from `better-layout`. **The numbers apply only where the project has no spacing scale or density system of its own.** [P&P] already has one (`identity.md` section 4: container ladder, spacing tiers, section rhythm), so on-system work uses those values and this file supplies the *principles* and the failure checks. A layout finding needs a **demonstrable failure**: a clip, an overlap, a broken mirror, a misread group.

## 1. Grouping: space first, shapes second, lines last

- Things that belong together sit closer than things that do not. **The gap between groups is at least 2x the gap within a group** (8px inside, 16px or more between). Example: form gap 24px, field-group gap 8px.
- Separate with **space first, then a background shape (a tint or surface step), then a divider line last.** If a line is truly needed, make it a low-contrast hairline, and never pair it with a large gap already doing the job.
- [P&P] Spacing tiers are not mixed within one component: dense 1.5 to 4, content cards 5 to 8, hero and CTA panels 8 to 10.
- **Interactive elements look interactive**: give them a background, border, underline or a clear zone. A non-clickable badge styled like a button collects dead clicks. (Status pills and category chips are not buttons: no hover state, no pointer cursor.)

## 2. Alignment and shared edges

One spacing step per nesting level; 16px is a useful default. Numbers align to the **end** (right in LTR), text to the **start**. Example: section `padding-inline: 24px`, child `margin-inline-start: 16px`. Related items share an edge; do not stagger without a reason (the system's featured-card stagger `md:mt-8` / `md:-mt-8` is a deliberate, symmetric rhythm).

## 3. Reading order and priority

- The most important content sits **near the top and the leading edge**. Within a row, identifying content leads; metadata and actions trail.
- **Visual order equals DOM order.** Never reorder with `order`, `flex-row-reverse` or grid placement: keyboard and screen-reader order would diverge. If mobile must reorder, reorder in the DOM.
- Put the number the user came for first; move secondary detail into a collapsed section, tab or detail view.
- **One primary action per view.** More than 3 secondary actions go into a menu. Prefer a short view that links deeper.
- **Hidden content needs a cue:** let items **peek 16 to 32px** past the scroll edge, or use a disclosure that names what is hidden ("Show 12 more results", not "More"). Truncated values need a keyboard-reachable way to the full value.

## 4. Spacing between controls

**12px** between adjacent bordered or filled controls; **24px** between the visible glyphs of borderless text or icon controls (counting each button's padding); unrelated groups **24px or more**. Compact layouts may use less if hit areas still do not overlap. Full-width buttons sit inside the layout margins (about 16px inline on mobile); edge-to-edge only with platform chrome and safe areas.

## 5. Logical properties and RTL

Use **logical** properties: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`, `border-inline-end`, `float: inline-start`, `border-start-start-radius` (Tailwind `ms-*`, `pe-*`, `start-*`, `text-start`). Physical properties only for physical geometry (safe-area insets). Flex and grid mirror by themselves; `translateX`, `background-position` and `left/right` do not (add a `[dir="rtl"]` override). Progression (stars, steps, progress bars) mirrors in RTL; **digit order never reverses.**

## 6. Bleed versus float

Backgrounds and media may bleed; **controls and text stay inside the margins and safe areas.** `env(safe-area-inset-*)` is non-zero only with `viewport-fit=cover` in the viewport meta. A floating action button:
```css
position: fixed;
right: calc(16px + env(safe-area-inset-right));
bottom: calc(16px + env(safe-area-inset-bottom));
/* RTL */ [dir="rtl"] & { right: auto; left: calc(16px + env(safe-area-inset-left)); }
```
A sticky header needs `scroll-padding-block-start` equal to its height (the system's floating nav: `scroll-padding-top: 6rem`).

## 7. Responsive structure

- **Breakpoints come from the content**, not from device presets. Test the **smallest and largest** supported sizes first (the system's widths: 375, 768, 1280, 1440, 1920).
- **Components respond to their container, not the viewport**: `@container` with `container-type: inline-size` (Tailwind 4 `@container` / `@md:`). A reusable component with `@media` inside it is a bug waiting for a sidebar. `container-type` on a shrink-to-fit element needs a definite width.
- [P&P] Desktop-first design, mobile-complete build: decide the mobile collapse order deliberately for every bento and grid; never leave it to whatever `grid-cols` does.

## 8. Growth and clipping (translation, long data)

- Translated strings grow; **short strings grow proportionally more**. Use `max-width` and `min-height`, never fixed `width`/`height` on text boxes; let rows wrap. Test with pseudo-localisation and one long locale (German).
- `minmax(0, 1fr)` on grid tracks and `min-w-0` on flex children, or long content blows the track open.
- `width: 100vw` is wrong (the scrollbar): use `100%`. A full-height mobile pane is `100dvh`, **not `100vh`** (Tailwind `h-dvh`, `min-h-dvh`).
- A modal gets `max-height: 100dvh` with a scrolling body and the **action row outside the scroller**. Keep the critical action out of any clipping region.
- Wide tables, code and diagrams scroll **inside their own `overflow-x-auto` container**; the page never scrolls horizontally.

## 9. Two patterns worth copying

- **Scroller with a peek:** `display:flex; gap:12px; padding-inline:24px; scroll-padding-inline:24px; scroll-snap-type:x mandatory`, items `flex: 0 0 calc(100% - 12px - peek)`.
- **Article grid:** `grid-template-columns: 1fr min(65ch, calc(100% - 48px)) 1fr;` with content in the middle track and full-bleed media spanning all three.

## 10. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| Grid `1fr` overflowing | `minmax(0, 1fr)` and `min-w-0` |
| `width: 100vw` | `100%` |
| `height: 100vh` / `h-screen` | `100dvh` / `h-dvh` |
| Fixed height on a text container | `min-height` |
| `@media` inside a reusable component | `@container` |
| `container-type` on a flex or inline-block with no width | Give it a definite width |
| `env(safe-area-inset-*)` without `viewport-fit=cover` | Add it |
| `inline-*` combined with safe-area left/right | Physical value plus a `[dir="rtl"]` override |
| `float: left`, `margin-left` in mirrored UI | Logical equivalents |
| `translateX`, `background-position: left` | `[dir="rtl"]` override |
| `order`, `flex-row-reverse` changing reading order | Reorder the DOM |
| Sticky header with no `scroll-padding-block-start` | Header height |
| Hidden or scrolling content with no cue | Peek or a named disclosure |
| Gap between groups not at least 2x the gap inside | Re-space |
