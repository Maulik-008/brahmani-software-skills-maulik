# Precedence: how the identity and the craft rules fit together

This skill has two layers. They were written separately, so they overlap in places and disagree in a few. This file settles every disagreement once, so nobody re-argues it mid-task.

| Layer | Answers | Lives in | Source |
|---|---|---|---|
| **Identity** | What it *looks like*: palette, shape ladder, type family, button doctrine, motion character | `identity.md`, `decisions.md`, `components.md`, `assets/tokens.css` | The owner's Paper & Pastel system |
| **Craft** | How it is *built and behaves*: exact values for radii maths, motion, type rendering, contrast, keyboard, layout, copy, review | `craft/*.md` | Adapted from Jakub Krehel's `better-*` skills (MIT, see `THIRD_PARTY_NOTICES.md`) |

## The rule

1. **The user's instruction in this task wins.** If it reopens a settled decision, name the decision and confirm once.
2. **Identity decides *what*; craft decides *how*.** Where the identity states a value, it wins. Where it is silent, the craft rule applies.
3. **Craft floors are never traded for taste.** A WCAG 2.2 A/AA criterion, an escalation trigger (`craft/review-protocol.md`) or a functional failure (iOS zoom on focus, clipped content at 320px) beats an identity preference. The fix must still stay on-system (use the `-ink` colour, extend the hit area invisibly, add the ring), never by importing an off-system style.
4. **When converting an existing project**, keep its own conventions wherever both layers are silent (density, naming, file layout). A consistent project choice is not a defect; the same detail done two ways is.

## Settled conflicts

| Topic | Identity says | Craft says | Resolution |
|---|---|---|---|
| Depth | Hairline `border-border` + `surface-1..5` ramp, **no resting shadow** (decision 4) | Shadows for elevation, borders for structure; layered ring-shadow instead of a depth-only border | **Identity wins.** Cards keep the hairline. Craft contributes the *layering* idea for the few real shadows (hover lift, floating chrome): several low-alpha layers from `--shadow-color`. Keep a real 1px border (it survives forced-colors mode; box-shadow does not) |
| Press scale | `active:scale-[0.98]` (decision 14) | 0.96, never below 0.95 | **0.98 stays** (pill buttons and cards). Never go below 0.96. Disabled controls never scale (`enabled:active:`). Name the transition properties, 150ms, ease-out |
| `transition-all` | Used in the original recipes | Name the properties, never `all` | **Craft wins** (no identity value is lost). Recipes and starters in this skill are patched |
| Scroll reveal vs UI motion | Reveal `y 15 to 24 -> 0`, 0.4 to 0.7s, ease `[0.22,1,0.36,1]`, once | Enter duration by size 150 / 250 / 350 to 450ms, ease-out, exits shorter, reserve expressive motion for first load | **Two tiers.** *Reveal tier* (section and page-level, marketing, runs once): identity values. *UI tier* (tooltip, menu, popover, dialog, toast, tab, icon swap, press): craft values. Never use reveal values on interactive UI, never UI values on a section reveal |
| Hover lift | Cards lift `-translate-y-0.5/1`, buttons do not (decision 14) | Hover only behind `(hover: hover)`; high-frequency rows get instant feedback | Lift stays on showcase cards only. List and table rows: background colour change, 100ms, no movement. All hover styling gated by `(hover: hover)` (Tailwind 4 does it for you; Tailwind 3 needs `future.hoverOnlyWhenSupported`) |
| Icon stroke | Lucide `strokeWidth 1.75`, watermarks 1 | Stroke tracks adjacent text weight in *rendered* px (1.5 / 2 / 2.5) | **Identity wins** (it is the quiet look). Constant per cluster, never mixed. Listed as a deliberate deviation so reviews do not flag it |
| Filled icons | None, outline only (`identity.md` 5) | Outline default, fill as the active/selected pair | **Identity wins.** Selected state is carried by chip/tint plus colour, never a filled glyph |
| Body size in apps | Compressed ramp: body 13 to 14px, meta 11 to 12px mono, tag 10px | Long-form body 16px, UI floor 14px (inputs, menus), captions 13px, rarely below 12px | Compressed ramp stays for **chrome**. Floors: long-form prose (blog, docs, legal, articles) 16px; **inputs 16px on mobile** (`text-base sm:text-sm`) or iOS Safari zooms on focus; 11px mono only for non-essential micro labels (eyebrows, timestamps, tags), never for text needed to finish a task |
| Display tracking and leading | Display tracking -0.03 to -0.04em, leading 0.98 to 1.05 | Headings 24px+ -0.01 to -0.02em, leading 1.1 to 1.3 | **Identity wins** for the display scale. Any display or heading style that can wrap to 3+ lines uses leading 1.1 or more |
| Copy measure | `max-w-2xl` (672px) | 60 to 75 characters, about `max-w-md` to `max-w-lg` at 16px; `max-w-prose` (65ch) | `max-w-2xl` stays for leads and blocks of 3 lines or fewer. Long paragraphs (more than about 4 lines) get `max-w-prose` inside the container |
| Em dash | None in visible copy | Em dash for asides is fine | **Identity wins.** Asides use a colon, comma, brackets or a full stop. Still apply: curly quotes, `…` as one character, en dash for ranges (2010–2020), non-breaking space in "10 km" |
| Colour format and naming | HSL channel tokens, semantic names | OKLCH, role-based naming | **Keep the HSL tokens** (`tokens.css` is ground truth; convert only if asked). The names already follow the craft grammar (`background`, `foreground`, `border`, `primary`, `cta`, `chip-*`, `tint-*`). Craft adds: measure, never estimate; one colour one meaning; status hue 15 degrees or more from the accent |
| Dark-mode mechanism | Class, attribute, or three-state host (`dark-mode.md`) | One mechanism; do not mix `prefers-color-scheme` with a `.dark` class ad hoc | Pick **one** of the three documented mechanisms per host. The three-state host is already a guarded composite, so it is allowed |
| Hit area | 44px minimum, extended invisibly | WCAG 24px AA minimum, aim 44 touch / 40 desktop | Identity's 44 stays (stricter) |
| Focus ring | `:focus-visible` ring from `--ring` | Ring 3:1 against every adjacent colour, never hidden under a sticky header | Compatible. `--ring` measures 5.07:1 on white and 5.95:1 on ink. Add `scroll-padding-top` for the floating nav (`assets/craft.css`) |

## Known tension the owner should decide

**Input boundary contrast.** The system's input edge is `--input` = `220 15% 88%`, measured **1.34:1** on white (dark `222 12% 17%`, 1.33:1 on ink). WCAG 1.4.11 asks 3:1 for the boundary that identifies a form control. The hairline is the identity, so the default build keeps it, and `scripts/contrast.py` reports this pair as a warning. For an AA-strict product, add the opt-in token below and use it on inputs only (everything else keeps the hairline). Values are measured: 3.66:1 on white and 3.45:1 on the input fill (light), 3.66:1 on ink and 3.31:1 on the fill (dark).

```css
:root { --input-edge: 220 9% 54%; }
.dark { --input-edge: 222 10% 44%; }
/* inputs only: border-[hsl(var(--input-edge))]  (Tailwind 4: add --color-input-edge: hsl(var(--input-edge)) in @theme) */
```

## Deliberate deviations register

These are consistent, documented choices of the system. A review (including one run with the `interfaces:better-interface` skill, if installed) must not report them as findings:

hairline borders instead of ring-shadows on cards · `scale-[0.98]` press · Lucide `strokeWidth 1.75` · compressed app type ramp for chrome · tight display tracking · mono micro labels at 10 to 11px · no filled icons · no em dashes · `max-w-2xl` lead measure · pill buttons with a non-pill input · image outline `outline-black/10 dark:outline-white/10` (the one sanctioned black/white literal besides the `on-tint` chip pair).

Anything *outside* this list that breaks a craft rule is a finding.
