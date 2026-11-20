# Typography

[craft] adapted from `better-typography`. Some values are exact (unitless line-height, weight floor, measure, 16px mobile inputs, tabular numbers). Letter-spacing, pairing and scale ratios are heuristics: report them only when they break the project's own scale. **Never propose a new typeface**: the system is Geist Sans plus Geist Mono.

## 1. Fonts

- [P&P] Geist Sans for everything, Geist Mono for eyebrows, labels, meta, tags, stat numbers, wordmark and code. Never mono for prose.
- **Weight floor:** below 18px use weight **400 or heavier**. Weights 100 to 300 only at 28px and up, and only after checking against the background. (The system uses 400, 500, 600.)
- **Load every face the design uses.** Browsers synthesise missing weights and distort. Variable Geist (`geist` package or fontsource variable) covers all of them in one file.
- Serve `.woff2`. Self-host in production; no render-blocking third-party CSS.
- **Properties over raw tags:** `font-weight: 650`, not `font-variation-settings: "wght" 650`. `font-variant-numeric: tabular-nums`, not `font-feature-settings: "tnum" 1`. Leave `font-optical-sizing: auto`. Raw tags only for custom axes or features with no property (`"ss01" 1`). The tokens' `'rlig' 1, 'calt' 1` is fine.
- Disable synthesis only the unwanted longhand (`font-synthesis-weight: none`), never the whole `font-synthesis` on body.
- `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` **once at the root** (already in the tokens and `pastel.css`), never inside a component.

## 2. Scale and line-height

[P&P] Marketing uses the oversized display scale; app screens use the compressed ramp (`identity.md` section 2). Role mapping:

| Role | System class | Line-height |
|---|---|---|
| Display / hero H1 | `text-display-sm` to `text-display-xl`, `font-semibold tracking-tight text-balance` | 0.98 to 1.05 (**1.1 minimum if it can wrap to 3+ lines**) |
| Section / card heading | `text-xl md:text-2xl font-semibold tracking-tight` | 1.2 to 1.3 |
| Compact title | `text-sm font-semibold leading-snug` | 1.375 |
| Body | `text-sm leading-relaxed` (app), `text-base leading-relaxed` (long-form) | 1.5 to 1.6 |
| Caption / meta | `text-xs` (12px), `text-[11px]` mono micro labels | 1.4 |

- **Unitless** line-height, never px or rem. Text that wraps to 3+ lines needs **at least 1.4**, even in a height-constrained row (`leading-none` and `leading-tight` are for single-line text only).
- Heading sizes descend with level. Never a heading smaller than body unless it is a deliberate overline. Emphasis is **one weight step up** (400 to 500), not size.
- **Floors (settled in `../precedence.md`):** long-form body 16px; UI controls and menus 14px; captions 13px; rarely below 12px; **11px mono only for non-essential micro labels**. Use `rem`.
- Letter-spacing in `em`, never px. Headings 24px+: `-0.01em` to `-0.02em` (the display scale is deliberately tighter). Uppercase labels 14px or less: `0.05em` or more (the mono eyebrow's `0.14em` is intentional). Body 0. `font-kerning: none` is never a fix.

## 3. Measure and wrapping

- **Measure 60 to 75 characters.** At 16px that is about `max-w-md` (448px) to `max-w-lg` (512px); `max-w-xl` (576px) runs a few over; `max-w-prose` (65ch) is the safe class for long copy. The system's `max-w-2xl` (672px) is for leads of 3 lines or fewer.
- `text-balance` on headings and short descriptions, **never on paragraphs** (Chromium ignores it past six lines). `text-pretty` on paragraphs (avoids a lone last word). Base rules in `assets/craft.css` set both.
- `overflow-wrap: break-word` (`break-words`) for long words, URLs, IDs and emails. `whitespace-nowrap` on labels and badges. `text-start`, never `text-justify` in app UI (justify only in editorial).
- **Truncation:** one line = `truncate` (`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`). Several lines = `line-clamp-3` (`-webkit-box`, `-webkit-box-orient: vertical`, `overflow:hidden`). **Truncated text must stay reachable**: a keyboard-reachable expand, a detail view or a tooltip (a hover-only `title` does not count). Grid and flex children need `min-w-0` or truncation never triggers.
- Store text in natural case and use `text-transform` (`uppercase`) for display.

## 4. Numbers

`tabular-nums` on every number that aligns or ticks: timers, counters, prices, table columns, stat numbers. Prose numerals stay proportional. Tabular figures come before reaching for a monospace font. `slashed-zero` where 0 and O must be distinguished (IDs, codes).

## 5. Smart punctuation and detail

- Curly quotes in prose (straight in code). En dash for ranges (2010–2020). **No em dashes in visible copy** (system rule); asides use a colon, comma or brackets. One `…` character, not three dots. Non-breaking space inside values ("10 km", "5 min"). `&shy;` or `hyphens: auto` with a correct `lang` for long words.
- Underlines: `text-underline-offset: 3px` and `text-decoration-thickness: 1px` (or `from-font`). `text-decoration-skip-ink` left at default. A dotted underline marks abbreviations and defined terms. Animate underlines with a colour transition (200ms `ease-out`), not by animating thickness.
- Decorative text effects (drop caps, outlines, shadows) are done in CSS so the text stays selectable. `::selection` may carry the brand colour if it stays legible. `user-select: none` only on drag and gesture surfaces.
- `text-box: trim-both cap alphabetic` in buttons and badges where supported (Chromium 133+, Safari 18.2+, not Firefox): progressive enhancement only.

## 6. Mobile inputs (a functional failure, not taste)

iOS Safari **zooms the page when an input's text is under 16px.** Two fixes; ask which the design wants or offer both:

- **A (default):** `text-base sm:text-sm`, 16px on mobile and the design size from `sm` up. The kit's `Input` does this.
- **B:** keep 16px and scale down with a transform on a wrapper that draws the surface and focus outline (13px = 13/16 = 0.8125; widen by 1/0.8125, divide line-height by the factor, `origin-left`, `rtl:origin-right`).

## 7. Language and direction

Set `lang` (and `dir`) on `<html>`. Wrap mixed-direction values (an email inside Arabic copy) in `<bdi>`. Paragraphs of 3+ lines align by their own script.

## 8. Tailwind cheat sheet

| Intent | Class |
|---|---|
| Root smoothing | `antialiased` |
| One-line ellipsis | `truncate` |
| Multi-line clamp | `line-clamp-3` |
| Measure | `max-w-md` / `max-w-lg` / `max-w-prose` |
| Heading wrap / paragraph wrap | `text-balance` / `text-pretty` |
| Tabular numbers | `tabular-nums` |
| Underline from the font | `decoration-from-font` |
| Small caps, superscript | `[font-variant-caps:small-caps]`, `[font-variant-position:super]` |
| Disable only weight synthesis | `[font-synthesis-weight:none]` |

## 9. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| `font-weight` with no loaded face | Load the face |
| `font-synthesis: none` on body | Remove; scope to a longhand |
| `font-variation-settings` for weight or `opsz` | `font-weight`; drop `opsz` |
| `font-feature-settings: "tnum"` / `"zero"` | `tabular-nums` / `slashed-zero` |
| `line-height` in px or rem | Unitless |
| `leading-none` / `leading-tight` on 3+ line text | 1.4 or more |
| `letter-spacing` in px | `em` |
| Body `font-size` in px | `rem` |
| Weights 100 to 300 under 18px | 400 or heavier |
| `text-balance` on a paragraph | `text-pretty` |
| `text-justify` in app UI | `text-start` |
| `-webkit-line-clamp` without `display: -webkit-box` | Use `line-clamp-*` |
| Timers, prices, columns without `tabular-nums` | Add it |
| `"..."`, `--`, `—` in visible strings | `…`, en dash, or rewrite |
| Input text under 16px with no mobile override | Fix A or B |
| Antialiasing set inside a component | Move to root |
| Mixed-direction value with no `bdi` | Wrap |
| `user-select: none` on a layout root | Remove |
| Truncated text with no way to the full value | Expand, detail view or tooltip |
