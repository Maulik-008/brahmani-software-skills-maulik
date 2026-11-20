# Quality gates: how to know a build is done

Nothing here is "eyeball it". Each gate has a command. Run them on **your** screens, in both themes, before you report.

## The gates
| # | Gate | Command | Pass means |
|---|---|---|---|
| 1 | Builds | your build, typecheck, lint, existing tests | green |
| 2 | Off-system patterns and craft violations | `python3 scripts/audit.py <src>` | **0 ERROR**; each WARN (identity or craft: `transition-all`, `<div onClick>`, `100vh`, inputs under 16px, ...) fixed or justified in the report |
| 3 | Token contrast | `python3 scripts/contrast.py <tokens.css> --fail` | 0 REQUIRED failures (run after any token change) |
| 4 | Render, both themes, five widths | `node scripts/verify-render.mjs --url <url> --out shots` | no horizontal scroll at 375/768/1280/1440/1920, no console errors, 0 serious/critical axe violations |
| 5 | Look at it | open `shots/light-1280.png`, `dark-1280.png`, `light-375.png`, `dark-375.png` | recognisably the same family as `assets/examples/showcase-kit.html` |
| 6 | Behaviour unchanged (conversions) | existing tests + a manual pass on forms, auth, keyboard order | routes, submits and labels unchanged |
| 7 | Review protocol | `craft/review-protocol.md` sections 1 and 3 on your own output | none of the 13 escalation triggers open; coverage table and verdict line (Block or Approve) written |

`verify-render.mjs` needs `npm i -D playwright-core axe-core` in the folder you run it from, and a Chromium (it auto-detects `/opt/pw-browsers`). Flags: `--widths`, `--theme-mode class|attr|both`, `--no-axe`, `--chrome`.
Gate 5 is not optional. Axe checks rules; it cannot tell you the page is ugly, off-brand or has a section that never revealed.

## What to do with axe "incomplete"
Axe reports translucent backgrounds (tints, glass, `bg-background/60`) as *incomplete*, not as passes. That is expected here. The token-level truth comes from `contrast.py`; axe covers everything else (names, labels, landmarks, structure, solid-background contrast).

## Measured contrast of the shipped tokens [measured]
8-bit quantised, WCAG relative luminance, 132 pairs. Reproduce with `scripts/contrast.py assets/tokens.css`.

**Required pairs: 44 of 44 pass** (lowest light 4.61, dark 5.26): foreground and muted on background/surface-1/surface-2, links (`primary`) on the same, the CTA label on the CTA, `foreground` and `foreground/70` on all six tints.

**Below AA, by design of the palette (the reason the ink set exists)**
| Pair (light) | Ratio | Needs |
|---|---|---|
| `chip-amber` text on background / own tint / own 15% pill | 2.78 / 2.45 / 2.40 | 4.5 |
| `chip-coral` text on background / own tint / own 15% pill | 3.98 / 3.42 / 3.27 | 4.5 |
| `chip-emerald` text on own tint / own 15% pill | 3.93 / 3.73 | 4.5 |
| `chip-teal` text on own tint / own 15% pill | 3.88 / 3.70 | 4.5 |
| `chip-blue` text on own tint / own 15% pill | 4.36 / 4.11 | 4.5 |
| `chip-violet` text on own 15% pill | 4.36 | 4.5 |
| `warning` text on background / on its 5% callout | 2.58 / 2.46 | 4.5 |
| `success` text on its 5% / 6% callout | 4.25 / 4.02 | 4.5 |
| `chip-amber` glyph vs background (non-text) | 2.78 | 3.0 |
| **Dark:** `destructive` text on ink / on its 5% / 6% callout | 4.50* / 4.35 / 4.06 | 4.5 |
| **Dark:** white on solid `destructive` fill | 4.29 | 4.5 |
\* rounds to 4.50 but is 4.499 once quantised.

**With the ink set (`assets/a11y-text.css`): every chip text pair, on the canvas, bands, tints, white/70 pills and 10 to 15% own-colour pills, is at least 4.57:1 in both themes**, and the status inks clear their callout washes.
The ink values move lightness by about 2 to 15 points (amber and coral the most) and keep hue and saturation. They are for **text only**; glyphs and icon fills keep the original chip colours.

### Checks added by the craft layer [measured]
- **Focus ring (`--ring`) vs `background`, `surface-1`, `surface-2`** is now a *required* pair (WCAG 1.4.11, 3:1): light 5.07 / 4.86 / 4.61, dark 5.95 / 5.59 / 5.26. A re-hue that breaks it fails the gate.
- **Input border (`--input`) vs background** is reported as a *warning*: 1.34:1 light, 1.33:1 dark, against 3:1 for the boundary that identifies a form control. The hairline is the identity; AA-strict products opt in to `--input-edge` (`precedence.md`, "Known tension"). If `--input-edge` exists in the tokens, it becomes a required pair.

### Policy
- **Default for new work: ink set on.** Text uses `-ink`, glyphs use `chip`. This is a deliberate extension; the owner's `tokens.css` is untouched.
- **Strict brand-fidelity mode** (rare): leave the ink set off, use `text-foreground` for any small label on a tint, and reserve `chip-*` colour for glyphs and large numerals only.
- Body text on a tint is `text-foreground/70`. `/60` fails; do not use it for anything that must be read.
- Do not "fix" contrast by switching to a non-system colour. Fix the pairing or use the ink variant.

## Accessibility checklist
The full craft rules (keyboard map, dialogs, forms, live regions, zoom, hit areas) are in `craft/accessibility.md`. The short list:
- Focus visible on every interactive element, both themes (`:focus-visible` ring from `--ring`). `outline-none` only with a replacement ring.
- Icon-only buttons have `aria-label` (axe: critical). Inputs have labels, `aria-invalid`, and errors linked with `aria-describedby`/`role="alert"`.
- Targets at least 44 x 44 at every width. Extend invisibly (`after:-inset-1.5`) instead of making controls huge.
- Keyboard: tab order matches visual order; menus and dialogs trap focus and close on Escape (Radix); tabs use roving focus if they control panels.
- Live regions for join/leave/chat/reactions/toasts (`role="status"`, errors `role="alert"`). New-message and escalation announcements in an inbox.
- Charts have a text alternative (`role="img"` + `aria-label` stating the finding) and a table or summary beside them.
- State is never colour-only: dot + label, pill + text, icon + number.
- `prefers-reduced-motion`: the global guard in `tokens.css` / `tailwind.v4.css`, plus `Reveal` and `CountUp` render static.
- `lang` on `<html>`; one `h1`; heading order; landmarks (`header`, `main`, `nav`, `footer`); real `alt`.
- Zoom works to 200%. Never `user-scalable=no` or `maximum-scale=1`.

## Responsive checklist
375, 768, 1280 (plus 1440, 1920 for desktop-heavy products). No horizontal page scroll. Bento grids collapse deliberately (decide the mobile order as you design). The last tab or button is never clipped. Wide tables, code and diagrams scroll **inside their own** `overflow-x-auto` container.
Safe-area insets on full-screen surfaces. Desktop first, mobile complete.

## Performance checklist
CSS transitions for hover/press/focus; framer-motion only for the specified reveals and the sliding pill. `backdrop-filter` only on the floating nav (and the app top bar). Guard client-only first-render state (the `mounted` pattern). Import lucide icons individually.
Images through the framework component with explicit `sizes`. Self-host fonts in production.

## Verification honesty
Say what you did **not** verify: a real backend, sockets, sign-in, a browser you did not test, a width you did not render. A report that lists its gaps is trusted; one that implies full coverage is not.
