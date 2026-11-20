# The Paper & Pastel identity (full reference)

Read this once per session before real design work. It is the consolidated reference behind SKILL.md.
Provenance: **[core]** is the owner's original system. **[ext]** is an extension written to cover more ground and kept consistent with it.
**[measured]** is something verified by running the code in this skill.
The **craft layer** (`craft/*.md`) supplies exact values for behaviour, accessibility, motion, type rendering, layout and copy. Where it disagrees with this file, `precedence.md` decides.

## 0. One paragraph

A **paper-white editorial canvas** carrying a small, curated family of **pastel-tinted cards**. The page is pure white (true ink-black in dark).
Structure and depth come from **hairline borders plus a one-hue surface ramp**, almost never from shadows. Personality comes from a **fixed set of six
colours** (blue, violet, emerald, coral, amber, teal) used for **category coding**, never decoration, in two forms: a solid glyph/text colour (`chip-*`)
and a soft full-surface wash (`tint-*`). The only filled button is **ink on paper** (`cta`). Type is **Geist Sans + Geist Mono** with an oversized,
tight display scale. Shapes are **pill-forward**: controls are full pills, cards 18 to 28px. Motion is **quiet, brief, once**.
Mood board: ClickUp, Acctual, Family, customer.io. A vivid, premium product brochure, not a clinical portal and not a dark developer portfolio. [core]

What it reacts against: the dark-navy developer portfolio, single-accent monochrome SaaS ("use some multi pastel colour", the owner rejected a cobalt-only
version), warm cream + serif + terracotta (the most common AI light-mode look), grey `shadow-md` everywhere, `rounded-xl` everything, rainbow gradients. [core]

## 1. Colour

### The jobs (nothing else gets a colour)
| Job | Tokens | Where |
|---|---|---|
| Canvas | `background`, `surface-0..5`, `card` | page, alternating bands, resting cards |
| Ink | `foreground`, `foreground/70`, `muted-foreground` | all text: three weights |
| Line | `border` | every divider and outline. One hairline colour |
| Brand accent | `primary` | links, focus ring, logo dot, form-focus border. **Never a button fill** |
| Category | `chip-*` (solid) + `tint-*` (wash) | which service / project / plan / section |
| The button | `cta` / `cta-foreground` | the one filled button, ink on paper |
| (optional) State | `session-*` | what is happening right now. See live-state.md |

If you reach for a colour that is not one of these jobs, stop.

### Core values (HSL channels) [core]
| Token | Light | Dark | Note |
|---|---|---|---|
| `background` | `0 0% 100%` | `222 16% 6%` | true white / true ink-black. Never cream, navy or `#000` |
| `foreground` | `222 20% 12%` | `220 15% 92%` | never pure |
| `card` / `surface-1` | `220 20% 98%` | `222 15% 9%` | a hair off the page: an object without a shadow |
| `surface-2..5` | L 96, 94, 91, 87 | L 11.5, 14, 17, 21 | one hue, each step 2 to 4% |
| `muted-foreground` | `220 9% 42%` | `220 10% 60%` | captions, meta |
| `border` | `220 15% 90%` | `222 12% 16%` | the only divider |
| `primary` | `217 78% 50%` (cobalt) or `232 56% 52%` (indigo) | `217 85% 63%` / `232 78% 72%` | pick one per product |
| `cta` | `222 20% 12%` | `0 0% 96%` | flips to paper on ink |
| `destructive / success / warning` | `0 72% 48%` / `152 55% 34%` / `38 88% 46%` | brightened | status is its own axis |

Greys are **blue-tinted** (hue about 220, saturation 9 to 20%), never neutral `0 0% x%`. That is what stops white reading as an unstyled template.

### The six category hues [core]
| Name | chip (solid) light | tint (wash) light | Typical owner |
|---|---|---|---|
| blue | `217 78% 50%` | `213 78% 94%` | primary category, nav active, healthcare |
| violet | `258 65% 58%` | `258 60% 95%` | AI, SaaS, backend |
| emerald | `156 55% 34%` | `156 45% 92%` | live/available, tools, success-adjacent |
| coral | `351 75% 58%` | `351 65% 95%` | billing, CRM, "featured" energy |
| amber | `32 88% 48%` | `34 75% 93%` | analytics, ops, caution-adjacent |
| teal | `185 62% 34%` | `185 45% 92%` | portals, automation, workflow |
| (cream) | | `38 40% 95%` | neutral warm wash if a 7th surface is needed |

Dark: chips **brighten and desaturate slightly**; tints become **low-lightness tinted surfaces** (`217 45% 15%` etc.), never pastels.
Rules: one category colour per item, **cycled** (`hueAt(i % 6)`), never six colours fighting in one card. Category is not status. Never invent a 7th hue.
The one sanctioned raw-palette use is `bg-emerald-500` for a tiny presence dot (1.5 to 3.5 units).

### Opacity ladder for category colour [core]
| Use | Pattern |
|---|---|
| glyph / accent text | `text-chip-violet` |
| icon-chip fill | `bg-chip-violet/10`, `group-hover:bg-chip-violet/15` |
| hover border on a neutral card | `hover:border-chip-violet/35` |
| full card / band / eyebrow wash | `bg-tint-violet` (whole token, no opacity) |
| chip sitting ON a tint | white/70 (dark: black/20). Not another tint. Use the `on-tint` class |
| text on a tint | `text-foreground` (headings), `text-foreground/70` (body) |

### Text contrast is not automatic [measured, ext]
The owner's system says "verify with real math". Measured against the shipped tokens (see quality-gates.md): every **required** pair passes
(foreground, muted, links, the CTA, `foreground/70` on all six tints). But **category colour as small text fails AA** in light for most hues
(amber 2.45:1 on its own tint, coral 3.4, emerald 3.9, teal 3.9, blue 4.33) and `warning` text on white is 2.59:1. So:

- `chip-*` is for **glyphs, icon fills and big decorative numerals**.
- **Text** (eyebrows, pill labels, KPI numbers, active-nav labels) uses the **`-ink`** variants: `text-chip-blue-ink`, `text-warning-ink`, `text-destructive-ink`,
  `text-success-ink`. Same hue and saturation, lightness nudged only enough to reach 4.55:1. Defined in `assets/a11y-text.css` (generated by `scripts/suggest_ink.py`).
- New projects ship the ink set by default. Body text on a tint stays `text-foreground/70`. **`/60` fails** (measured), `/70` is the floor.

### Shadows [core]
Every shadow is built from `--shadow-color` at low alpha, large blur, large negative spread. Resting card: **none**. Hover lift: `translateY(-3px)` plus
`0 1px 2px hsl(var(--shadow-color)/.06), 0 12px 24px -8px hsl(var(--shadow-color)/.18)`. Scrolled nav: `0 8px 28px -8px .../.35`. Dialog/floating:
`0 24px 60px -24px .../.55`. Mobile sheet: `0 16px 40px -12px .../.4`. There is no neutral grey `shadow-md`.

## 2. Typography [core]
Two fonts, no exceptions: **Geist Sans** (everything) and **Geist Mono** (eyebrows, labels, wordmark, meta, tags, stat numbers, code, `//` comments).
`font-feature-settings: 'rlig' 1, 'calt' 1`, antialiased. Never mono for prose. `tabular-nums` on any number that aligns or ticks.

| Level | Classes |
|---|---|
| Display (marketing only) | `text-display-sm` 2.75rem/1.05/-0.03em, `display` 3.5rem/1.02/-0.035em, `display-lg` 4.5rem/1/-0.04em, `display-xl` 5.5rem/.98/-0.04em |
| Hero H1 | `text-display-sm font-semibold tracking-tight sm:text-display md:text-display-lg` (`text-balance`) |
| Card H3 | `text-xl md:text-2xl font-semibold tracking-tight` |
| Compact title | `text-sm font-semibold leading-snug` |
| Lead | `text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl` |
| Body | `text-sm leading-relaxed text-muted-foreground` (on tint: `text-foreground/70`) |
| Eyebrow chip | `rounded-full bg-tint-blue px-3.5 py-1.5 text-xs font-semibold` |
| Eyebrow mono | `font-mono text-xs font-medium uppercase tracking-[0.14em]` |
| Meta | `text-xs` / `text-[11px] text-muted-foreground` with an `h-3 w-3` icon |
| Stat number | `font-mono text-3xl md:text-4xl font-semibold tracking-tight tabular-nums` |
| Tag | `rounded-full font-mono text-[10px]/[11px] font-medium` |

Headings: always `font-semibold tracking-tight`, never black/900, never loose. **App screens use a compressed ramp**: titles up to about `text-2xl`, body 13 to 14px, meta 11 to 12px mono. Display scale is for marketing only.

## 3. Shape: the radius ladder [core]
| Radius | Where |
|---|---|
| `rounded-full` | every button, badge, pill, avatar, icon chip, nav item, status dot |
| `[28px]` | featured/showcase cards, footer CTA card, dialog outer |
| `[24px]` | standard content cards, tint cards, blog/project cards |
| `[20px]` | default card, mobile menu, hero bento tiles |
| `[18px]` | compact list cards |
| `[16px]` / `[14px]` | small highlight tiles, nested callouts |
| `[10px]` / `[12px]` | **inputs and textareas, the one non-pill control** |
| `rounded-lg` (8px) | callout icon squares only |

Never a sharp corner, never a timid `rounded-md` on a card, never `rounded-full` on an `<input>`.

## 4. Spacing and layout [core]
Container ladder: `max-w-5xl` (nav, contact, hero bento) / `max-w-6xl` (sections, footer) / `max-w-2xl` (copy measure) / `max-w-3xl` (centred intros).
**Never full-bleed, never `max-w-7xl`+.** Padding `px-4 sm:px-6 lg:px-8`. `.section-padding` = `px-4 py-20 sm:px-6 md:py-28 lg:px-8`; alternate `bg-surface-1` bands.
Section header block `mb-12 md:mb-16`. Spacing tiers (do not mix in one component): dense 1.5 to 4, content cards 5 to 8, hero/CTA panels 8 to 10.
Field `px-4 py-3`, label to input `space-y-1.5`, between fields `space-y-4`. Grid gap 3 dense, 4 default, 5 to 6 cards, 10 to 16 major columns.

Grid patterns: **featured + secondary** (4 tinted cards with a staggered offset `md:mt-8` / `md:-mt-8`, then a grid of compact cards), **bento** (`md:grid-cols-6`
with uneven spans), zigzag bento (one `md:col-span-2`), even grid for blog/testimonials. **Three tile families per section**: featured (big, watermark, tags),
secondary (compact, icon chip), minimal (plain, one link). Replace any wall of N identical cards.

## 5. Iconography [core]
`lucide` only, `strokeWidth` 1.75 (watermarks 1), `h-4 w-4` in text, `h-3 w-3` in meta, usually inside a `rounded-full` chip. Signature: an oversized
`text-foreground/[0.06]` watermark on flat tint cards. No filled sets, no emoji as icons. [ext] lucide v1+ removed brand logos: use `simple-icons` for
brand marks or a generic message icon.

## 6. Motion [core]
Quiet, brief, once. Section reveal `y:15-24 -> 0`, `opacity 0 -> 1`, `once:true`, `margin:'-60px'`, 0.4 to 0.7s, ease `[0.22,1,0.36,1]`, stagger 0.06 to 0.12.
Hover lift `-translate-y-0.5/1`, `active:scale-[0.98]`, trailing-arrow nudge `group-hover:translate-x-0.5`, sliding `layoutId` nav pill (spring 350/28).
Optional: one restrained aurora (three radial blobs at 6 to 11% alpha, blur 70px, 24s) plus a 2.5% noise layer behind the hero only.
No parallax, no scroll-jacking, no bounce on layout, no autoplay media. `prefers-reduced-motion` is always honoured (global guard in tokens.css).
[ext] For static single-file pages and artifacts, skip scroll-triggered reveals (the page must be complete at rest); use a load-time rise on the hero only.
**Two tiers:** the values above are the *reveal tier* (sections and pages, once). Interactive UI motion (press, menus, dialogs, toasts, tabs, icon swaps) follows `craft/motion.md`.

## 7. Decision order (never start with colour)
1 information hierarchy, 2 flow and states (empty/loading/error/success), 3 visual hierarchy, 4 layout and section anatomy, 5 spacing tier, 6 component recipe,
7 category colour, 8 typography, 9 iconography, 10 interaction states, 11 motion, 12 responsive, 13 accessibility, 14 polish.

Self-check before shipping: same family as the showcase kit? mostly calm white/ink with colour sparing and by category? one filled `bg-cta` per view? all
controls pills, cards 18 to 28, inputs 10 to 12? zero grey shadow, zero raw hex, zero real gradient?

## 8. Anti-patterns (auto-reject) [core]
Pure `#fff`/`#000` or neutral greys. Cream + serif + terracotta. Single-accent monochrome. Accent `primary` as a button fill. More than two category colours in one
card. Grey `shadow-sm/md/lg/xl`. `rounded-md/lg` on a content card, sharp corners, `rounded-full` on an input. Gradient text or rainbow gradients. Filled/emoji icons.
`max-w-7xl`+ or full bleed. Parallax, scroll-jacking, bounce, autoplay. Walls of identical cards. Unsourced hero stats or invented social proof. Hard-coded
`bg-[#0b0c0f]` / `text-white/xx` islands that ignore the theme. Em dashes in visible copy. Raw routes/URLs as visible text. `user-scalable=no`.
`scripts/audit.py` detects all of these.
