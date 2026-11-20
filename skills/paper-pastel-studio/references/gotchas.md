# Gotchas found while building and verifying this skill [measured]

Each one cost a failed build, a failed audit or a wrong screenshot. Read before you debug.

| Symptom | Cause | Fix |
|---|---|---|
| A hue class has no effect; the tile is transparent | Class built by concatenation (`"bg-tint-" + hue`); Tailwind never sees the full string | Static maps in `lib/palette.ts`; never interpolate colour class names |
| `cn('text-display-sm','text-chip-blue')` drops one | `tailwind-merge` reads `text-display-sm` as a colour | `extendTailwindMerge` with the `display-*` sizes (the kit's `cn()` does it) |
| Chips on tint cards have no background (Tailwind 3) | `on-tint` is not in the owner's `tokens.css` | The v3 preset adds it as a plugin. Do not delete the preset |
| CalmLoader never appears | Arbitrary `[animation:rise_...]` does not pull in keyframes | Named animation `animate-rise-delayed` (in both configs) |
| Next build: "Attempted to call themeInitScript() from the server" | The function was exported from a `'use client'` file | Keep it in `theme-script.ts` (no `use client`) |
| `bg-chip-x/10` or `/35` does nothing (Tailwind 3) | Colour defined as a bare `hsl(var(--x))` in an old config | Use the preset (`<alpha-value>` on every colour) |
| Small chip-coloured labels fail axe contrast | The category hues are tuned for glyphs and washes, not 12px text | `-ink` text variants (`a11y-text.css`); body on tint `text-foreground/70` |
| `text-foreground/60` at 11px fails | Lower than the system's 70% floor over a tint | `/70` |
| Callout label contrast fails only in dark, or only on a band | Wash over `surface-1` is darker than over paper | Status inks are solved against the wash over background, surface-1 and surface-2 |
| Screenshot shows blank sections and counters at 0 | Scroll-triggered reveals never fired; `html{scroll-behavior:smooth}` makes `scrollTo()` animate and cancel itself | Scroll with `behavior:'instant'` (the verifier does) |
| Contrast "passes" in a script but axe says 4.49 | Float maths vs 8-bit rendering | Quantise to 8 bits and keep a 0.05 margin (the scripts do) |
| `Instagram`/`Facebook` icon missing after upgrading lucide | lucide v1 removed brand icons | `simple-icons`, or a generic message icon |
| `verify-render.mjs`: "Cannot find package playwright-core" | ESM imports resolve relative to the script, not your project | The script resolves from the **current directory**; run it where you installed the packages |
| `page.evaluate(fn, a, b)` throws "Too many arguments" | Playwright takes one argument | Pass an object |
| Favicon 404 pollutes console checks | No icon | `<link rel="icon" href="data:,">` or `app/icon.svg` |
| `lang` violation on a static page | Starter was a fragment | Use `index.html` (standalone) not `artifact.html` |
| Hydration warning on the theme toggle | Server/client markup differ | `mounted` placeholder of the same size; `suppressHydrationWarning` on `<html>` |
| Light flash before dark applies | Theme applied after hydration | Inline no-flash script in `<head>` |
| `.on-tint`, `.glass`, `.card-hover` missing in Tailwind 4 | Component classes live in the CSS, not the config | Use `tailwind.v4.css` (it defines them in `@layer components`) |
| Shell `sed`/`python -c` edits corrupt regexes | Backslash escaping through the shell | Write the script to a file |
| `install.sh new vanilla` fails with "Python was not found" on Windows | `python3` is a Microsoft Store stub that exits with an error | The installer now probes `python3`, `python` and `py` and uses the first that runs |
| Generated CSS and HTML have CRLF line endings after `build_assets.py` on Windows | Python text mode translates `\n` | `build_assets.py` writes with `newline='\n'`; keep it so diffs stay clean |
| Press scale never fires on `ButtonLink` (an `<a>`) | `enabled:` does not match anchors | `[&:not(:disabled)]:active:scale-[0.98]` (the kit does this) |
| Tailwind 3: `transition-[scale]` has no effect | v3 has no `scale` property utility, it animates `transform` | `transition-[color,background-color,border-color,transform]` |
| iPhone zooms the page when an input is focused | Input text under 16px | `text-base sm:text-sm` (the kit's `Input` does it) |
| A focused element or anchor target sits behind the floating nav | No scroll padding | `html { scroll-padding-top: 6rem }` (in `assets/craft.css`) |
| The whole page flickers through every transition when the theme toggles | Every element animates its colour change | The kit's `ThemeProvider` switches transitions off for two frames (`craft/motion.md` section 13) |
