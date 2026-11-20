# Motion

[craft] adapted from `better-motion` (and the motion half of `better-ui`). Values are exact desktop-web starting points; mobile full-screen transitions run longer and travel farther.

**First question: should this animate at all?** Removing motion is a valid fix.

## 0. Two tiers (settled in `../precedence.md`)

| Tier | What | Values |
|---|---|---|
| **Reveal** (page and section, once) | Section reveal on scroll, hero rise, count-up | Identity: `y 15 to 24 -> 0`, 0.4 to 0.7s, ease `[0.22,1,0.36,1]`, `once`, stagger 0.06 to 0.12 |
| **UI** (interactive) | Press, hover, tooltip, menu, popover, dialog, drawer, toast, tab, icon swap | This file |

Never use reveal values on interactive UI. Never use UI values on a section reveal. No parallax, no scroll-jacking, no bounce on layout, no autoplay media (identity, unchanged).

## 1. Frequency decides

| How often it happens | Treatment |
|---|---|
| Keystrokes, row hover, tab content change, repeated taps | Instant, or at most a 100 to 150ms `opacity` / `background-color` change. A tab *indicator* may travel |
| Menus and command palettes opened many times a day | Skip the open animation, animate only the close |
| Occasional (dialog, drawer, popover, toast) | Animate, using the size table below |
| First load, success, empty state | Expressive motion is allowed here, and only here |

**Every animated state change must also leave a static cue** (colour, icon or label) for when the animation does not run.

## 2. Transitions for state, keyframes for sequences

Interactive state uses **CSS transitions or springs**: they retarget mid-flight when the user changes their mind (a drawer closing while it opens reverses smoothly). Keyframes are for once-run sequences (a staged entrance, a count-up). Skip the animation on first paint for elements already in their default state.

## 3. Duration, easing, scale, origin, distance

| Element | Enter | Exit |
|---|---|---|
| Tooltip, small element | 150ms | shorter |
| Dropdown, menu, popover | 250ms | 150ms |
| Modal, drawer, panel | 350 to 450ms | about 150ms to 250ms |
| Press feedback | 150ms | 150ms |

- **Exit is shorter than enter** (a 250ms dropdown exits in 150ms).
- **Easing:** enters, exits and state changes = `ease-out`. Loaders and continuous loops = `linear`. Sheets, shape morphs, drag settle and slider thumbs = spring. **Colour and opacity never use a spring.** Without a motion library, stand in for a spring with `cubic-bezier(0.2, 0, 0, 1)` at the same duration.
- **Springs:** `{ type: "spring", duration: 0.3, bounce: 0 }`. **Bounce is always 0.** Duration 0.3 for small swaps, 0.4 for a tab indicator, 0.45 for a drawer. Set it once on a `MotionConfig` for the surface. (The system's sliding nav pill, spring 350/28, is the one stiffness-based exception; keep it as is.)
- **Scale:** tooltip and dropdown enter from **0.96 or 0.97**; modal and panel enter from **0.98 or 0.99** and exit to 0.99.
- **Origin:** `transform-origin` toward the trigger (Radix `var(--radix-popover-content-transform-origin)`, `--radix-dropdown-menu-content-transform-origin`, `--radix-tooltip-content-transform-origin`; Base UI `var(--transform-origin)`). A centred dialog keeps its centre.
- **Distance:** text swap 4px, page transition 8px, dropdowns and tooltips 8 to 32px, sheets and side panels up to 70% of their own width or height.

## 4. Press

```css
.btn { transition-property: scale, background-color, color, border-color; transition-duration: 150ms; transition-timing-function: ease-out; }
.btn:not(:disabled):active { scale: 0.98; }       /* system value, decision 14. Never below 0.96 */
```
Tailwind 4: `transition-[scale,background-color,color,border-color] duration-150 ease-out enabled:active:scale-[0.98]`. Tailwind 3 has no `scale` property utility: use `transition-[transform,background-color,color,border-color]` and the same `active:` class. **Disabled never scales.** Provide an opt-out (variant or prop) for controls where it distracts. Press scale stays under reduced motion.

## 5. Staged entrance (first load, success state only)

Split content into semantic chunks (title, description, actions). Stagger chunks **100ms** apart. Each chunk: `opacity 0 -> 1`, `translateY(12px) -> 0`, `blur(4px) -> 0`, **300ms** `ease-out`. A short display headline may stagger word by word at **80ms**. Never stagger routine, frequent interactions.

## 6. Exit

`opacity` + `blur(4px)` + a **fixed `translateY(-12px)`**, **150ms** `ease-out`. Not the full container height. Use the full slide-out only when the destination carries meaning (a drawer closing, a card returning to a list). Or remove instantly where motion adds nothing.

## 7. Popover and dialog in CSS

```css
[popover]{ opacity:0; transition: opacity 150ms ease-out, display 150ms allow-discrete, overlay 150ms allow-discrete; }
[popover]:popover-open{ opacity:1; transition-duration:250ms; }
@media (prefers-reduced-motion: no-preference){
  [popover]{ translate:0 12px; scale:.97; }
  [popover]:popover-open{ translate:0 0; scale:1; }
  @starting-style{ [popover]:popover-open{ opacity:0; translate:0 12px; scale:.97; } }
}
```
Under reduced motion the panel still cross-fades by opacity (150ms base, 250ms open).

## 8. Icon swap (play/pause, copy/copied, like/liked)

For infrequent state changes only: `scale 0.25 -> 1`, `opacity 0 -> 1`, `blur(4px) -> 0`. Motion library: `transition={{ type: "spring", duration: 0.3, bounce: 0 }}`. CSS: keep **both icons in the DOM** (one absolutely positioned) and cross-fade, `transition-property: opacity, filter, scale; duration: 300ms; easing: cubic-bezier(0.2, 0, 0, 1)`. Tab-icon swaps and hover-revealed row actions **do not** animate.

## 9. Shared layout (Motion `layoutId`)

- One `layoutId` per **pair** of shared elements; ids unique (build from the item key; two tab groups need two ids). The sliding nav pill is one pair.
- Leave `initial` / `exit` off `layoutId` elements.
- Animate `borderRadius` through `animate`, not a class.
- Swapping children inside `AnimatePresence` need a `key` that changes with state. Modes: `sync` (default, different places), `wait` (new child enters after the old leaves), `popLayout` (cross-fade in the same place). A dialog step cross-fade: `opacity` plus `scale 0.98`.
- `layoutId` and `drag` need `LazyMotion` with `domMax`; `domAnimation` lacks them.

## 10. Animated height

Measure an **inner wrapper** with `ResizeObserver`, animate the **outer**. First state gets a fixed height (a first measurement of 0 snaps). Skip it for content that changes per keystroke.

## 11. Drag

`dragMomentum={false}`; `dragConstraints` set to the outermost snap points; `dragElastic: 0.05`; on release spring to the nearest snap point; commit threshold = half the distance to that point (example constants: snap -116 / 116, threshold 58, reveal steps 44 and 88px, tuned by eye). Prefer Motion gesture props (`whileTap` also fires on Enter; `whileHover` ignores touch; `onPan` fires after 3px). Every drag needs a single-pointer alternative (a button): see `accessibility.md`.

## 12. Reduced motion

- Gate **movement, scale and blur** (including entrance/exit scale) under `@media (prefers-reduced-motion: no-preference)` or Tailwind `motion-safe:`.
- **Stays:** opacity fades, spinners and progress, instant state changes, the brief press scale.
- Slides and scales become an **opacity cross-fade**, not instant removal. Parallax and autoplay are disabled outright; carousels start paused.
- The global CSS guard in `tokens.css` covers CSS only. **Motion components need `<MotionConfig reducedMotion="user">`** (turns off transform and layout, keeps opacity). Blur still runs, so branch with `useReducedMotion()`.

## 13. Theme switch

Switching theme must not animate every colour at once. Inject `*,*::before,*::after{transition:none !important}`, force a style flush (`getComputedStyle(document.documentElement).opacity`), and remove it after **two nested `requestAnimationFrame`s**. The kit's `ThemeProvider` does this. (`next-themes`: `disableTransitionOnChange`.)

## 14. Performance

- Name the properties: `transition-property: scale, opacity`. **Never `all`.**
- Animate `transform`, `opacity`, `filter`, `clip-path`. Not width, height, top or left.
- `will-change` only after you have seen stutter or a 1 to 2px shift (Safari iOS); name the property; never `all`. On `filter` or `transform` it creates a containing block for `position: fixed` descendants.
- `backdrop-filter` stays on the floating nav and the app top bar only.

## 15. Slow-motion review

Replay at one tenth speed and walk every state. In devtools: `document.getAnimations().forEach(a => a.playbackRate = 0.1)`. Library-driven values: multiply the duration by 10, then restore.

| Symptom at 10% | Cause |
|---|---|
| Content mounts with no fade | Missing enter state |
| Content clipped while its container grows | Animate the wrapper, not the clipped child |
| Empty gap before a shrink | Exit and layout out of sync |
| A 1 to 2px jump at the end | Subpixel snap: `will-change: transform` |
| Popup grows from its centre | No `transform-origin` toward the trigger |
| A `layoutId` element fades mid-move | `initial` / `exit` left on it |
| Height snaps on first open | First measurement was 0 |

## 16. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| `transition-all` / `transition: all` | Name the properties |
| Press scale below 0.96 | 0.98 (system) and never below 0.96 |
| `:active` scale with no `:disabled` exclusion | `enabled:active:` or `:not(:disabled):active` |
| Spring `bounce` other than 0 | 0 |
| Spring on colour or opacity | `ease-out` with a duration |
| Modal entering from below 0.98 | 0.98 |
| Popup with no `transform-origin` | Library origin variable |
| Exit with the same duration and distance as the enter | 150ms and a fixed 12px |
| `opacity: 0` in the base rule revealed only by an animation | Hidden state in the `from` keyframe, `animation-fill-mode: both` |
| Motion with no reduced-motion guard | Gate it; cross-fade |
| `layoutId` on unrelated elements | One id per pair |
| `AnimatePresence` child swap without a `key` | Key by state |
| `height: auto` on swapping children | Measured height |
| `will-change: all` | Name the property |
| Hover animation on a list row | Instant background change |
