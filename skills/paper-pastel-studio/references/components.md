# Component recipes

Class strings for Tailwind. **[core]** = the owner's original recipes. **[ext]** = written to extend the system to more components, built only from core tokens.
**kit** = a ready component in `assets/starters/react-kit` (typechecked, built, rendered in both themes, axe clean).
Plain-CSS equivalents of the kit set live in `assets/pastel.css` (`pp-*` classes).

## The rule that prevents silent failures
Tailwind generates CSS only for class names it can read as **complete strings**. `"bg-tint-" + hue` produces nothing. The original recipes use concatenation;
do not copy that. Use the static maps in `lib/palette.ts` (`tint`, `chipText`, `chipInk`, `chipFill`, `chipBorderHover`) and `hueAt(i)` to cycle.

Use `text-chip-{hue}-ink` for **text** and `text-chip-{hue}` for **glyphs** (see identity.md, "Text contrast").

## Primitives

### Button [core] · kit `ui/button.tsx`
```
base:  group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out
       [&:not(:disabled)]:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
       disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0
default (THE filled button)  bg-cta text-cta-foreground hover:bg-cta/90
outline    border border-border bg-transparent hover:border-primary/30 hover:bg-surface-1
secondary  bg-secondary text-secondary-foreground hover:bg-secondary/80
ghost      hover:bg-accent hover:text-accent-foreground
link       rounded-none text-primary underline-offset-4 hover:underline
destructive bg-destructive text-destructive-foreground hover:bg-destructive/90     (confirm step only)
sizes  sm h-9 px-4 text-[13px] · default h-10 px-5 · lg h-12 px-7 text-[15px] · icon h-10 w-10
```
Forward CTAs get a trailing `ArrowRight h-4 w-4 transition-transform group-hover:translate-x-0.5`. No hover lift on buttons.
**44px hit area without a huge button** [core]: `relative after:absolute after:-inset-1.5 after:content-['']` on the control. The kit does this.
Icon-only buttons **always** carry `aria-label` (axe rates this critical).
**Craft** (`craft/motion.md`, `precedence.md`): transition properties are named, never `all`; press stays `0.98` (decision 14), never below 0.96, never on a disabled control (`[&:not(:disabled)]` also matches `<a>`, `enabled:` does not); 150ms ease-out. Tailwind 3 has no `scale` property utility: use `transition-[color,background-color,border-color,transform]` there.

### Eyebrow [core] · kit `paper/eyebrow.tsx`
chip: `inline-flex items-center gap-1.5 rounded-full bg-tint-blue px-3.5 py-1.5 text-xs font-semibold text-chip-blue-ink`
mono: `... font-mono text-xs font-medium uppercase tracking-[0.14em]`. Optional `Sparkles h-3 w-3`.

### Input / Textarea / Field [core] · kit `ui/input.tsx`
`w-full rounded-[10px] border border-border bg-surface-2/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/30`
Error swaps to `border-destructive/60 focus:ring-destructive/20` and shows `text-xs text-destructive-ink` with `AlertCircle h-3 w-3` below, `role="alert"`.
Label above: `flex items-center gap-1.5 text-xs font-medium text-muted-foreground` with an `h-3 w-3` icon. Dense app forms: `px-3.5 py-2.5 text-[13px]`.
Success state: centred `h-16 w-16 rounded-full bg-success/15` + `CheckCircle2`, a real message, auto-reset after about 6s.

### Pill / tag [core] · kit `paper/small.tsx`
canvas: `rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[10px] font-medium tracking-wide text-foreground/85` (+ `font-mono` for tech tags)
on a tint: `on-tint` instead of border/bg. Never a tint on a tint.

### Icon chip [core]
canvas: `flex h-9 w-9 items-center justify-center rounded-full bg-chip-violet/10` with glyph `text-chip-violet h-4 w-4 strokeWidth 1.75`. On a tint: `on-tint`.

### Avatar [ext] · kit `Avatar`
`rounded-full font-mono font-semibold` initials in `tint-{hue}` with `text-chip-{hue}-ink`. Presence: `absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500`.
Sizes 28/36/44/56. Never a stock-photo placeholder.

## The three tile families (use all three, never one repeated)

### Featured / showcase card [core] · kit `ShowcaseCard`
`group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[28px] p-5 bg-tint-{hue} transition-transform duration-300 hover:-translate-y-1`
top-left label pill (`on-tint`, icon + `text-[13px] font-semibold`), oversized watermark
`pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-foreground/[0.06]` (strokeWidth 1), body `text-[13px] leading-relaxed text-foreground/70 max-w-[85%]`,
bottom-right ink circle `h-10 w-10 rounded-full bg-cta text-cta-foreground group-hover:scale-110` with `ArrowUpRight`. Grid `sm:grid-cols-2 lg:grid-cols-4`
(or 3), stagger the middle cards `md:mt-8`.

### Secondary / list card [core] · kit `ListCard`
`group flex items-start gap-3.5 rounded-[18px] border border-border bg-surface-1 p-4 transition-colors hover:border-chip-{hue}/35`, `h-9 w-9` icon chip,
title `text-sm font-semibold leading-snug`, body `mt-1 text-xs leading-relaxed text-muted-foreground`.

### Minimal card [core] · kit `MinimalCard`
`rounded-[18px] border border-border p-5`, one title, one line, one text link (`text-xs font-medium text-primary underline-offset-4 hover:underline`).

### KPI / stat tile (double bezel) [core] · kit `StatTile`
outer `group rounded-[22px] p-1.5 bg-tint-{hue} hover:-translate-y-1`, inner `rounded-[17px] bg-background/60 p-4 shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06)]`,
icon chip, number `font-mono text-3xl md:text-4xl font-semibold tabular-nums text-chip-{hue}-ink`, label `text-sm font-semibold`, note `text-[11px] text-foreground/70`
(**not `/60`**). Count up once on first view with `CountUp`. Never animate a number you invented.

### Fully tinted content card (blog / project) [core]
`group relative flex h-full flex-col overflow-hidden rounded-[24px] p-6 bg-tint-{hue} hover:-translate-y-1`; hover arrow `absolute right-5 top-5 opacity-0 -translate-y-1 group-hover:translate-y-0 group-hover:opacity-100`;
tag pills `on-tint font-mono text-[11px]`; title `text-lg font-semibold tracking-tight`; excerpt `text-sm text-foreground/70`; meta row on `border-t border-foreground/10 pt-4 text-xs text-foreground/60`
(this meta is decorative, keep real information out of it). Watermark number variant: `font-mono text-[7rem] font-black text-foreground/[0.05]`.

## Chrome

### Navbar (floating pill) [core] · kit `paper/navbar.tsx`
`fixed inset-x-0 top-0 z-50 px-4 pt-4` > `nav.glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-3 py-2.5`. On `scrollY>50`: tighter `py-2` plus
`shadow-[0_8px_28px_-8px_hsl(var(--shadow-color)/0.35)]`. Items `rounded-full px-3.5 py-1.5 text-sm font-medium`; active = sliding `bg-tint-blue` (`layoutId`, spring 350/28)
with `text-chip-blue-ink`. Right: `ThemeToggle` plus exactly one `bg-cta` action. Mobile: `glass mx-auto mt-2 max-w-5xl rounded-[20px] p-2` sheet (not a full-screen overlay),
items `rounded-full px-4 py-3`, entrance `{opacity:0,y:-8,scale:.98}`. **`.glass` (backdrop blur) is allowed only here and on that sheet.** Logo = mono wordmark with an accent dot.

### Theme toggle [core] · kit `theme-toggle.tsx`
`h-9 w-9 rounded-full border border-border bg-surface-1`, Sun/Moon `h-[17px]` strokeWidth 1.75, **renders a same-size placeholder until mounted** (hydration-safe), `aria-label` switches.

### Footer [core] · kit `paper/footer.tsx`
`border-t border-border bg-surface-1` plus a 3% radial dot grid. Opens with a `rounded-[28px] bg-tint-blue` CTA card (watermark, eyebrow, headline, one `bg-cta` pill),
then brand / Explore / Contact columns (`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground` labels), a demoted link strip, then a mono bottom bar.

### Section heading [core] · kit `paper/section.tsx`
`eyebrow -> text-balance text-display-sm font-semibold tracking-tight -> mt-4 max-w-2xl text-base md:text-lg text-muted-foreground`, block `mb-12 md:mb-16`, inside `max-w-6xl`,
section `.section-padding`, alternate `border-t border-border bg-surface-1`.

### Callout [core] · kit `Callout`
`flex gap-3.5 rounded-[20px] border p-4` with `border-{status}/20 bg-{status}/[0.05]`, an `h-7 w-7 rounded-lg border` icon square, label
`font-mono text-xs font-semibold uppercase tracking-wider text-{status}-ink`, body `text-sm leading-relaxed text-foreground/80`. info = primary, tip = success, warning, danger = destructive.
Status is its own axis, never a category colour.

### Empty / loading / error [core+ext] · kit `states.tsx`
- Empty: `flex flex-col items-center gap-3 px-6 py-14 text-center`, `h-14 w-14 rounded-full bg-surface-2` icon, one friendly line, **one action**.
- Skeleton: mirrors the real chrome, `animate-pulse rounded-[10px] bg-surface-3` blocks. Only for lists that reliably take long.
- Calm loader: invisible for about 280ms, then a small spinner and a short mono label, height reserved. Preferred for screens with several calls (`CalmLoader`).
- Error: a `danger` Callout with a retry button. Never a raw stack trace.

## App components [ext]

### Segmented switcher / tabs · kit `Segmented`
`relative flex rounded-full border border-border bg-surface-1 p-0.5`, buttons `rounded-full px-3 py-1.5 text-[12px] font-medium`, active label `text-chip-blue-ink` over a sliding
`bg-tint-blue` indicator. Pill tabs only. Use `aria-pressed` (or a real `tablist` with roving tabindex for panels).

### Sidebar (app shell)
`w-[244px] shrink-0 border-r border-sidebar-border bg-sidebar`, brand row `h-[60px] px-5`, items `rounded-full px-3.5 py-2.5 text-sm font-medium` with a sliding `bg-tint-blue` indicator,
section label `font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground`, footer card `rounded-[20px] bg-tint-violet p-4` (watermark). Collapses below `lg` to a scrollable pill row.

### Top bar
In an app shell the sticky top bar **is** the navigation, so it may use `.glass` (the one place blur is allowed besides the marketing navbar and its sheet):
`glass sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-border`, title `text-[15px] font-semibold`, mono meta line
`text-[10px] uppercase tracking-[0.14em] text-muted-foreground`, then icon buttons and an avatar. A solid `bg-background` bar with the same border is equally on-system and cheaper.
Sticky bars use `top: env(safe-area-inset-top, 0px)` where safe areas matter.

### Table / list rows
Wrapper `rounded-[24px] border border-border bg-surface-1 overflow-hidden`. Header `bg-surface-2/60 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground`,
rows `divide-y divide-border`, cell `px-4 py-3 text-[13px]`, numerals `font-mono tabular-nums text-right`. Row hover `hover:bg-surface-2/60`. Status as a pill, never a coloured row.
Wide tables scroll in their own `overflow-x-auto` container. Empty = Empty state inside the wrapper.

### Dialog (Radix) · dropdown · popover · tooltip
Dialog content `rounded-[20px] sm:rounded-[24px] border border-border bg-popover p-0 shadow-[0_24px_60px_-24px_hsl(var(--shadow-color)/0.55)]`, header `border-b border-border px-5 py-4`
(icon chip + title + description). Dropdown/popover `rounded-[16px] border border-border bg-popover p-1.5` items `rounded-full px-3 py-2 text-[13px] hover:bg-accent`.
Tooltip `rounded-full bg-cta px-2.5 py-1 text-[11px] text-cta-foreground`. Use Radix for focus trap, Escape, roving focus. Destructive actions get a confirm dialog.

### Toast
`rounded-[20px] border border-border bg-popover p-4 shadow-[0_24px_60px_-24px_hsl(var(--shadow-color)/0.55)]`, `role="status"` (errors `role="alert"`), icon chip, one sentence naming what
happened ("Published"), optional ghost action, auto-dismiss about 5s, pause on hover. Bottom-right on desktop, top on phones.

### Progress / meter
track `h-1.5 w-full rounded-full bg-surface-3`, fill `rounded-full bg-chip-{hue}` with `transition-[width] duration-[800ms]`. Pair with a mono label ("3,240 of 5,000"). Never colour-only status.

### Stepper / wizard
Steps are `h-7 w-7 rounded-full font-mono text-xs`: done `bg-success/10 text-success-ink` with a check, current `bg-tint-blue text-chip-blue-ink ring-1 ring-primary/30`, upcoming
`border border-border text-muted-foreground`, connected by a `h-px bg-border` line. The step's primary button is the one `bg-cta`.

### Command palette (optional power-user layer, decision 18)
Dialog `rounded-[24px]`, input row `border-b border-border px-4`, results `rounded-[14px] px-3 py-2` with an icon chip, keys `rounded-full border border-border px-2 py-0.5 font-mono text-[10px]`.
Group labels use the mono label style. It adds to the nav, it never replaces it.

### Chart [ext]
Hairline gridlines `stroke-border`, axis and tick labels `font-mono text-[10px] fill-muted-foreground tabular-nums`, no chart border, no 3D. Categorical series use the six hues **in order**;
a single series uses `chip-blue` with `/25` for non-emphasised marks and solid for the one that matters. Sequential scales step through one tint (`/10 /25 /50 /100`). Area fill `/10`.
Line `strokeWidth 1.75` with an emphasised end-point dot. Every label names a value the chart reaches. Provide a text alternative (`role="img"` + `aria-label` summarising the finding).
Use `--chart-*` style colours from tokens, never raw hex. Tooltip = popover recipe.

### Accordion / FAQ
`divide-y divide-border rounded-[24px] border border-border bg-surface-1`, rows `p-5`, summary `text-sm font-semibold`, plus icon rotating 45deg on open. Native `<details>` is fine and accessible.

### Live dot / presence
`h-2 w-2 rounded-full bg-primary animate-breathe` (kit `LiveDot`). Always next to a label. Colour is never the only signal.

### Unread count / tiny indicator
Non-interactive counters may reuse the ink fill: `rounded-full bg-cta px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-cta-foreground`.

## Reveal wrapper · kit `Reveal`
`initial {opacity:0,y:20}` `whileInView {opacity:1,y:0}` `viewport {once:true, margin:'-60px'}` `transition {duration:.5, delay:i*.08, ease:[.22,1,.36,1]}`. Static under reduced motion.
Heavier hero-ish moment: add `filter:'blur(6px)' -> 'blur(0px)'`, duration .7.

## Aurora + noise (hero only) [core]
Three stacked radial gradients (`--accent-blue .11`, `--accent-violet .08`, `--accent-coral .06`), `blur(70px)`, `aurora-drift 24s ease-in-out infinite alternate`, plus a fixed
`.noise` layer at 2.5%. This is the one sanctioned gradient. Skip it on app screens.
