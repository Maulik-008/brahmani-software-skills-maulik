# Dark mode: derived by rules, not inverted

Dark is a first-class second theme: the same *system* with the lightness axis re-mapped. If you only use tokens you write **no dark-specific CSS** except the one white/70 vs black/20 chip-on-tint pair (the `on-tint` class handles it).

## Rules per token group [core]
| Group | Light to dark | Result |
|---|---|---|
| background | pure white to **true ink-black**, hue 222, S 16, L 6. Never navy, never `#000` | `222 16% 6%` |
| foreground | near-black to off-white (never pure) | `220 15% 92%` |
| card / surface-1..5 | the ramp rises *upward* from the background | L 9, 11.5, 14, 17, 21 (hue 222, S 10 to 15) |
| border / input | still the only divider | `222 12% 16%` / `17%` |
| muted-foreground | re-check contrast | `220 10% 60%` |
| primary / ring | **brighten**, S up about 7 | `217 85% 63%` (cobalt), `232 78% 72%` (indigo) |
| chip (accent-*) | **brighten and slightly desaturate** (L +10 to +18) | blue 63, violet 70, emerald 52, coral 66, amber 60, teal 52 |
| tint-* | **not pastels.** Low-lightness tinted surfaces: L 14 to 17, S 30 to 45, same hue | `217 45% 15%`, `258 38% 17%` ... |
| cta | **flip**: paper on ink | `0 0% 96%` / `222 20% 10%` |
| shadow-color | darker, more saturated | `222 40% 2%` |
| status | brighten for contrast | destructive `0 68% 56%`, success `152 50% 48%`, warning `42 88% 58%` |

## Mechanisms (pick the one your host needs)
1. **Class** (default for apps): `.dark` on `<html>`. Bundled `ThemeProvider` + `theme-script.ts` (no flash). Light is the default; dark is a user choice (`enableSystem` only if the owner asks).
2. **Attribute**: `data-theme="dark"`. The v4 theme's `@custom-variant dark` already covers both `.dark` and `[data-theme="dark"]`; `.on-tint` covers both.
3. **Three-state host** (Claude Artifacts and any host that sets the theme itself): tokens defined on bare `:root` (light), redefined inside `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... color-scheme: dark } }`
   and again inside `:root[data-theme="dark"]`. `body` gets an explicit token background. This is exactly the shape in `starters/html/*.html` and the clinic example. Delete the media block only for a standalone brand site that must stay white-first regardless of the OS.

## What flips for free (tokens only)
Page, resting cards, tint cards (to dark tinted surfaces), the CTA (to paper on ink), links and focus rings (brightened accent), inputs, callouts, skeletons, glass nav (`surface-1 / .72`), watermarks (`text-foreground/[0.06]`), hover shadows (token-built, darker automatically), the 2.5% noise.

## Mistakes to avoid
- Using real pastels (`tint-*` at L 92+) on a dark page: they glow like billboards.
- Using the light `chip-*` values on ink: they fail contrast. Use the dark set.
- Keeping `primary` at its light value: links vanish.
- Hard-coded `bg-[#0b0c0f]`, `text-white/xx` islands: they ignore the toggle. (`audit.py` flags them.)
- Forgetting the `mounted` guard on the toggle or `suppressHydrationWarning` on `<html>` (flash and hydration warnings).
- Forgetting `color-scheme: dark`, so native controls and scrollbars stay light.
- Defining a colour only inside a `[data-theme]` or media block. Every token needs a bare `:root` definition first.

## Dark-specific checks [measured]
- All **required** pairs pass in dark, lowest 5.26:1. Near-misses: `destructive` text on ink is 4.50 (4.499 after 8-bit rounding) and on its 5 to 6% wash 4.06 to 4.35, and white on the solid destructive fill is 4.29. The ink set fixes the text (`--destructive-ink`);
  if destructive buttons are common in dark, lower `--destructive` lightness by about 4 points so white text clears 4.5.
- Look at both themes on **every** screen. Dark mode regressions hide in tints, chips on tints and borders that were only visible through a shadow.
