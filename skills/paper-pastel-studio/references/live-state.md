# Optional module: live-state axis and the dark canvas

Add **only** when the product has something live: a timer, a call, a recording, a streaming AI reply, a deploy in progress, a sync. If it has nothing live, skip this entirely and do not invent state.
Files: `assets/live-state.tokens.css`, `assets/live-state.tailwind.ts`, `references/live-state-recipes.md` (timer ring, control bar, session pill, streak calendar, leaderboard, badges, KPI, room card, AI chat surface, feed card, command palette).

## Why it exists
The base system has colour jobs for canvas, ink, line, accent, category and the button. None answers "what is this thing doing right now?". That is a **sixth job: state**. It also assumes every screen is the white canvas; a screen people run full-bleed for hours at night is better served by one permanently dark surface.

## State colours (`session-*`, rename to fit: `call-*`, `job-*`)
Five states, each a solid plus a pale wash, flipping with light/dark: `focus` (running, same hue as the indigo accent), `break` (emerald), `longbreak` (teal), `paused` (amber, but its own token so a pause never reads as an error), `overtime` (rose).
Rules: **one state visible per timer at a time**; it is a status, never a palette; never combine two state colours in one view; **never use a state colour to code a subject** (that is the category set's job);
state always carries a **label or icon** (paused shows a pause glyph, overtime shows `+mm:ss`), never colour alone. The two axes (category, state) are independent and can coexist on one card.

## The canvas (`canvas-*`, theme-independent)
A dark surface that does **not** participate in the light/dark toggle: `canvas-bg 230 24% 7%`, `canvas-surface 230 19% 11%`, `canvas-line 230 15% 20%`, `canvas-fg 220 18% 91%`, `canvas-muted 224 11% 56%`, plus brighter state hues as the only light source (a soft radial bloom, never a neon skin).
Composition: one big `tabular-nums` mono time display, one SVG progress ring, minimal ghost controls, one muted context line, no marketing chrome, a single ghost back control. AI generation surfaces reuse the same canvas tokens: the product only ever needs one dark surface, "something live is happening here".

## The one exception to "the only fill is bg-cta"
The play/pause transport inside a live canvas fills with `bg-session-{state}`. Nowhere else.

## Install
Paste `live-state.tokens.css` after the base tokens and merge `live-state.tailwind.ts` into `theme.extend.colors` (v3). In Tailwind 4 add the same names under `@theme inline` as `--color-session-*` / `--color-canvas-*`. Decision 10 widens mono to every numeric for products like this.
