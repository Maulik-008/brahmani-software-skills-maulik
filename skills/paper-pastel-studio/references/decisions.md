# Settled decisions (do not re-ask the owner)

The 19 design questions already answered for this system [core]. Apply them. If a request implies reopening one, name which decision it conflicts with and
confirm before deviating. A per-task override does not propagate to other pages.

Direction used throughout: **A, Editorial Calm** (white-first, quiet motion, hairline depth). A bolder "Kinetic Spatial" direction exists (bento, glass beyond the
nav, reveal-on-scroll, reading-progress bar). Use it only when the owner names it for a specific page, and flag that page in the report as "built on Direction B".

| # | Decision | Pick |
|---|---|---|
| 1 | Neutral character | Blue-tinted greys, hue about 220 throughout |
| 2 | Primary accent | Per product: cobalt `217 78% 50%` (default) or indigo `232 56% 52%`. Set `--primary`, `--ring`, `--sidebar-primary`. Never a button fill |
| 3 | Dark chrome | True ink-black `222 16% 6%`. Not navy, not `#000` |
| 4 | Shape and depth | 20px base, pills for controls, 18 to 28 cards, 10 to 12 inputs, no resting shadow |
| 5 | Category palette | Base six: blue violet emerald coral amber teal. No 7th |
| 6 | Colour application | Category strict. Add a state axis only if the product has live state |
| 7 | Tint reach | Showcase cards only: feature cards, blog cards, eyebrow chips, footer CTA. Not full bands, not list rows |
| 8 | Type family | Geist Sans + Geist Mono, strict. No second display face |
| 9 | Type scale | Editorial ramp for marketing, compressed ramp for app screens (cap about `text-2xl`) |
| 10 | Mono extent | Eyebrows, labels, meta, stat numbers. Widen to every numeric only for time/count-heavy products. Prose stays Sans |
| 11 | Numerals | `tabular-nums` wherever numbers align or tick. Big hero numbers in Mono |
| 12 | Button shape | Full pill. `[10px]` allowed in dense toolbars only |
| 13 | Button hierarchy | One ink/paper `bg-cta` fill. Only exception: a live transport control, if the live module is on |
| 14 | Button motion | `active:scale-[0.98]` plus a trailing-arrow nudge on forward CTAs. No hover lift on buttons |
| 15 | Card families | Featured / secondary / minimal, plus KPI tile (plus live card if the module is on) |
| 16 | Forms | Marketing-size public forms, dense app-shell forms. Same tokens, two padding scales |
| 17 | Empty / loading / error | Calm loader or skeleton; illustrative empty; retry on error. Skeleton mirrors real chrome. Empty = icon-in-circle + one `bg-cta` action |
| 18 | Navigation | Floating pill nav; optional command palette as a power-user layer |
| 19 | Motion budget | Quiet base: `whileInView` once. Only always-on motion is tied to a live state |

When this table and the deep reference disagree, **this table wins**.

## How "one `bg-cta` per view" is read in practice
The filled style is for **one primary action per view**. The nav action, the hero action and the footer action may all be `bg-cta` when they are the same action
(the original recipes do exactly this). Two *different* filled actions competing in one viewport is the violation.

## Craft refinements that do not reopen a decision
The craft layer adds exact values around these decisions without changing them (full table in `precedence.md`).

| Decision | What stays | What the craft layer adds |
|---|---|---|
| 4 Shape and depth | Hairline + surface ramp, no resting shadow | Real shadows are layered; keep a real 1px border where the edge matters; nested radii are concentric (`craft/surfaces-and-icons.md`) |
| 9 Type scale | Compressed ramp for app screens | Floors: long-form body 16px, inputs 16px on mobile, 11px mono only for non-essential micro labels (`craft/typography.md`) |
| 14 Button motion | `active:scale-[0.98]`, arrow nudge, no hover lift | Named transition properties, 150ms ease-out, never below 0.96, never on disabled controls (`craft/motion.md`) |
| 16 Forms | Marketing-size and dense app-shell forms | Labels not placeholders, validate on submit, never disable submit, inputs 16px on mobile (`craft/accessibility.md`) |
| 17 Empty / loading / error | Calm loader, illustrative empty, retry | Copy rules: what this place is, how to fill it, one next action (`craft/writing.md`) |
| 18 Navigation | Floating pill nav | `scroll-padding-top` so focus is never hidden behind it (`assets/craft.css`) |
| 19 Motion budget | Quiet base, `whileInView` once | Two tiers: reveal values for sections, craft values for interactive UI |
