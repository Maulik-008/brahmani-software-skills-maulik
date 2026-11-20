# Colour and contrast

[craft] adapted from `better-colors`. **Never report a contrast value you did not measure; never estimate what can be computed.** In this skill the measuring tool is `scripts/contrast.py` (8-bit accurate, both themes) plus axe in `verify-render.mjs`.

[P&P] The palette itself is fixed (`identity.md` section 1: paper canvas, blue-tinted greys, six category hues, ink CTA, status axis). This file governs *how colour is used and checked*, and what to do when a product needs a different accent.

## 1. Thresholds

| Pair | WCAG 2 minimum |
|---|---|
| Body text | **4.5:1** (AAA 7:1) |
| Large text (24px, or 18.67px bold) | **3:1** (AAA 4.5:1) |
| UI components, states, meaningful graphics, **input boundaries**, focus rings | **3:1** |
| Disabled controls, pure decoration, logos | exempt |

Optional APCA (Lc, signed, compare the absolute value): body text Lc 75 (prefer 90); labels and headlines Lc 60; large text Lc 45; outline icons Lc 45; solid icons and UI components Lc 30; dividers Lc 15.

How to check, in order:
1. **Every pair in both themes.** A pass in light says nothing about dark.
2. **Translucent surfaces** (`bg-chip-*/10`, glass nav, tints over bands): test against the lightest and darkest content that can sit behind.
3. **Computed colours** (`color-mix`, `/50` alpha, relative colour): measure the *rendered* result.
4. **Text over images**: the worst region, or a scrim.
5. **8-bit rounding**: a float pass can be 4.49 once rendered. Keep a 0.05 margin (the scripts do).

[measured] Where the shipped tokens stand: every *required* pair passes; small category-coloured **text** fails for most hues; the `-ink` set (`assets/a11y-text.css`) fixes text while glyphs keep the original `chip-*`. **`/60` text on a tint fails, `/70` is the floor.** Details in `../quality-gates.md`. The input-border tension is in `../precedence.md`.

When a pair fails: **change lightness first** (hue and saturation move the value much less). A mid-lightness background (about L 0.75) caps black text near APCA Lc 60: move the background, not the text. Pick text polarity by measurement; black versus white can differ between APCA and WCAG 2. Do not "fix" contrast with an off-system colour: fix the pairing or use the `-ink` variant.

## 2. One colour, one meaning

- A hue (within about 15 degrees) carries **one** meaning across the product. If blue means "link", it does not also mean "success". Absence also communicates: do not introduce a colour for decoration.
- [P&P] Jobs are fixed: canvas, ink, line, accent (`primary`: links, focus, logo dot), category (`chip-*` / `tint-*`), the button (`cta`), state/status. Category is not status.
- **Status hue at least 15 degrees of OKLCH hue from the accent.** Check this when re-hueing the accent (`rebrand.md`). If impossible, give the destructive action a distinct treatment (outlined with an icon).
- **One filled primary action per view.** Selected and active states may use the accent on a glyph or label.
- Status needs a **redundant cue** (icon, text, underline): never colour alone (WCAG 1.4.1).
- Gain/loss colours differ by locale (red means gain in some Chinese financial UIs): confirm the audience before colour-coding money.

## 3. Palette structure (when you build or extend a ramp)

A product needs **1 neutral ramp** (80 to 90% of the UI), **1 accent ramp**, and **0 to 4 status ramps** (only the ones the product actually shows). Never fewer neutral steps than accent steps.

| Role | Tailwind step | Radix step |
|---|---|---|
| Page background | 50 | 1 |
| Subtle background | 50 | 2 |
| Component background | 100 | 3 |
| Component hover | 200 | 4 |
| Active / selected | 200 | 5 |
| Subtle border, separator | 200 | 6 |
| Border, focus ring | 300 | 7 |
| Hovered border | 400 | 8 |
| **Solid fill** | 600 | 9 |
| Solid hover | 700 | 10 |
| Low-contrast text | 700 | 11 |
| High-contrast text | 900 | 12 |

- Solid fills sit on **600**, not 500: white text fails 4.5:1 on most 500 hues, and several (green, amber) still fail at 600. Measure.
- [P&P] The system's ladder is `surface-0..5` (neutral), `foreground` / `muted-foreground`, `border`, six `chip` + `tint` pairs. Use the table to sanity-check a *new* ramp, not to replace these.
- **Ramp properties:** lightness steady in OKLCH L; hue constant; vividness peaks mid-ramp and falls at both ends; light-end steps finer (50 to 200 about 0.04 to 0.05 apart in L, mid-ramp 0.07 to 0.10); adjacent steps under 0.03 apart are redundant; ends never reach pure black or white. Across several hues, match perceived L per step and match vividness as a *proportion of each hue's own maximum* (yellows and cyans peak lower).
- A brand colour lands on step 600 (Tailwind) / 9 (Radix) for buttons and links. Pin or snap it; never quietly darken the brand.
- Tools: `culori`, `colorjs.io`, `chroma.js` (interpolate in `oklab`).

## 4. Dark mode

[P&P] Derived by rules, not inverted (`../dark-mode.md`). Craft adds:
- **Swap semantic roles first, then tune**: reduce accent vividness a step or two, give the dark end more separation, then re-measure.
- One switching mechanism per host: `prefers-color-scheme` only (no toggle), **or** a `.dark` class / `data-theme` when the user can override, **or** the documented three-state host. Do not hand-mix them. `color-scheme: light dark` on `:root` makes native controls and scrollbars follow.
- Real pastels on an ink page glow like billboards: tints become low-lightness tinted surfaces.
- `prefers-contrast: more` (optional, AAA-minded): define a separate variant per appearance and widen the gap by at least **0.15 OKLCH L**; aim Lc 90 for body text. Do not put light and dark in one block.

## 5. Gradients and tints

- [P&P] No gradient text, no rainbow gradients; depth comes from tint washes. The one sanctioned gradient is the restrained hero aurora (three radial blobs at 6 to 11% alpha).
- If you do interpolate (for example a per-page pastel wash): `in oklab` (default recommendation) or `in oklch` for vivid hue travel; sRGB midpoints go muddy. A grey dead zone appears between opposite hues: add a third stop. Banding on large low-contrast areas: widen contrast, shrink the area, or add the 2.5% noise layer.
- Text on a gradient or tint: measure the worst region or add a scrim.

## 6. Formats and gamut (only when asked or migrating)

The tokens are HSL channels and stay so. If a project is converting to OKLCH: `oklch(L C H / alpha)` with the slash, L 0 to 1, C 0 to about 0.4, H 0 to 360; change values only, keep `currentColor`, `transparent`, `inherit`; keep the gradient method. P3 colours need an sRGB fallback first, then `@media (color-gamut: p3)`. `color-mix(in oklab, <colour> 15%, white)` makes tints; relative colour syntax `oklch(from var(--x) calc(l - 0.1) c h)` makes hover steps; `light-dark()` pairs a light and dark value.

## 7. Token naming (when you add tokens)

Two tiers: **primitives** (`--blue-600`, never used in components) and **semantic** (`--color-accent-solid`, used by components). Component-tier tokens only for a documented, intentional divergence.
- Neutral roles: `--color-{bg|text|border}-{variant}-{state}` (`--color-text-secondary`, `--color-border-strong`). Accent and status: `--color-{accent|danger|...}-{subtle|border|solid|text}-{state}`.
- **One word per concept:** `text` (not fg, foreground, ink, content), `bg` (not fill), `border` (not stroke, outline, line). Reserve `primary` for "most prominent of its group"; use `accent` for the brand.
- Anti-patterns: `--color-blue-button` (name the role: `--color-accent-solid`), `--color-light-gray`, `--color-text-2`, a primitive (`--blue-600`) used inside a component, a hue or a component name inside a semantic token.
- [P&P] The existing names (`background`, `foreground`, `border`, `primary`, `cta`, `chip-*`, `tint-*`, `surface-*`, `session-*`) are the project's vocabulary: extend it, do not rename it.
- Tailwind 4: names declared in `@theme` become utilities (`--color-accent-solid` gives `bg-accent-solid`). Re-point dark values in a `.dark` block *outside* `@theme`. Alpha tokens cannot be contrast-checked statically.

## 8. Auditing a messy palette (conversions)

Collect every literal colour; sort by lightness; collapse near-duplicates within **0.02 OKLab delta-E** (keep the most used, never average); assign each to a role; **report the inventory before changing anything**, because consolidating a colour changes unrelated screens. Then map onto the system with the find/replace table in `../convert.md`.

## 9. Checklist (detect, then fix)

| Detect | Fix |
|---|---|
| Hex, `rgb()`, `hsl()` in a component where a token exists | Use the token |
| `bg-blue-600`, `var(--blue-600)` in a component | Semantic token |
| Hue or component in a semantic name | Role name |
| `--color-primary` next to `--color-text-primary` | Rename the brand to `accent` |
| `hsl` ramp that varies only L | Constant perceived hue (OKLCH) |
| Light-end steps spaced like the mid-ramp | Tighten to 0.04 to 0.05 |
| Same chroma number reused across hues | Proportion of each hue's maximum |
| Status hue within 15 degrees of the accent | Move it, or give destructive a distinct treatment |
| `text-white` on a 500 fill | Measure; use 600 or the `-ink` pairing |
| Category-coloured **text** | `-ink` variant |
| `/60` text on a tint | `/70` |
| Colour as the only status cue | Add icon or text |
| `prefers-contrast` for both appearances in one block | Separate blocks |
| Light and dark mechanisms mixed ad hoc | One mechanism |
