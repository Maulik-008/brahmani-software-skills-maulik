---
name: paper-pastel-studio
description: >-
  Build, convert, design, review and polish interfaces in the "Paper & Pastel" design system (also: pastal, pastel, white pastel design, maulik pastal design): white-first canvas with true ink-black dark mode, six pastel category colours, one ink pill button, Geist Sans + Mono, hairline depth, quiet motion, plus a craft layer of exact interface rules (motion, type, contrast, accessibility, layout, writing, review).
  Use to start a new project, website, SaaS, dashboard or feature with light and dark mode; convert any existing app or site to this look; design or redesign a screen to be intuitive, creative and specific; audit or polish UI; or when the user says "make it pastel", "ink black button", "use my design system".
  React/Next/Vite with Tailwind 3 and 4, plain HTML/CSS, Claude Artifacts. WCAG 2.2 AA. Ships tokens, starters, audit linter, contrast checker, render verifier, installer. Visual layer only: keeps behaviour, routes, data and SEO.
---

# Paper & Pastel Studio

One skill for three jobs, built on one identity and one set of craft rules:

1. **Start something new** (project, website, SaaS, feature) already wired for light **and** dark.
2. **Convert anything that exists** onto the system, in reviewable steps, behaviour untouched.
3. **Design it well**: an intuitive, creative, product-specific interface that follows the exact rules of the craft layer, then proves it.

It is the merge of the owner's **Paper & Pastel** system (identity, tokens, kit, tooling), the hands-off conversion agents, and Jakub Krehel's `better-*` interface skills (MIT, adapted: `THIRD_PARTY_NOTICES.md`).

**Calm white/ink with colour used sparingly and by category.** If a screen reads as "white page, calm ink text, a few pastel cards that each mean something, one black pill button", it is on-system. The craft layer is what makes it correct and pleasant to use.

Provenance tags in the references: **[core]** the owner's system, **[ext]** an extension built only from core tokens, **[craft]** an adapted rule with exact values, **[P&P]** how the system applies it, **[measured]** verified by running code.

## 1. Pick the mode, then follow its file

| The user wants | Mode | Read | Start with |
|---|---|---|---|
| A new product: SaaS, dashboard, internal tool, admin | **new software** | `build-new.md`, `app-patterns.md`, `design-process.md` | `install.sh new vite\|next <dir>` |
| A website, landing page, blog, marketing site | **new website** | `build-new.md`, `site-patterns.md`, `design-process.md` | `install.sh new next\|vite\|html <dir>` |
| A feature or screen in an app that exists | **new feature** | `build-new.md`, `app-patterns.md` or `site-patterns.md` | `install.sh add <project>` if the foundation is missing |
| An existing site or app moved onto the system | **convert** | `convert.md` | `audit.py <src>` (read only) |
| "Design this", "make it better / more creative / more intuitive" | **design** | `design-process.md`, then the mode file above | the four-line brief |
| A check or review of something | **audit** | `craft/review-protocol.md`, `quality-gates.md` | `audit.py`, then `verify-render.mjs` |
| A quick visual to look at (single file, Claude Artifact) | **prototype** | `stacks.md` "Single file", `assets/starters/html/artifact.html` | copy the starter |
| A different accent colour or a new vertical | **rebrand** | `rebrand.md` | edit `assets/tokens.css`, `scripts/build_assets.py` |

Modes combine: a new website is `new website` + `design`; a conversion that also restructures is `convert` + `design`.

## 2. What to load, in order

**Always, at the start of a session:** this file, then `references/precedence.md` (how identity and craft fit; short), `references/identity.md` (the full system) and `references/decisions.md` (19 settled decisions, **do not re-ask the owner**).

**Then by task:**
- Before building any UI: `components.md`.
- The mode file from the table above, and the pattern family file.
- `craft/index.md`, then only the craft files the task touches (surfaces and icons, motion, typography, colour, accessibility, layout, writing).
- Colour work or dark tuning: `dark-mode.md`. Unclear stack: `stacks.md`. Something misbehaves: `gotchas.md`.
- `creative-method.md` is the effort standard for any redesign. `live-state.md` only for products with live state (timers, calls, streaming).

If a required file is missing, stop and say so. **Never reconstruct token values from memory:** `assets/tokens.css` is ground truth.

## 3. The identity in 15 rules

1. **Paper canvas.** Page is pure white (`--background: 0 0% 100%`), true ink-black in dark (`222 16% 6%`). Never cream, never navy, never `#000`. Greys are blue-tinted (hue about 220).
2. **Depth = hairline border + the one-hue `surface-1..5` ramp.** No resting shadows. Real shadows only on hover lift and floating chrome, layered, from `--shadow-color` at low alpha.
3. **Six category colours only**: `blue violet emerald coral amber teal`. Category coding, never decoration. One per item, **cycled**. No seventh hue.
4. **Two colour forms**: `chip-*` = glyph / icon fill; `tint-*` = full-surface wash for showcase cards. A chip *on* a tint is `on-tint`, never another tint.
5. **The one filled button is ink on paper** (`bg-cta text-cta-foreground`). The accent `primary` is links, focus ring, logo dot, form focus: **never a button fill**. One filled primary action per view.
6. **Geist Sans + Geist Mono, nothing else.** Mono for eyebrows, labels, meta, tags, stat numbers, wordmark; never prose. `tabular-nums` on numbers that align or tick.
7. **Oversized tight display scale for marketing; compressed ramp for app chrome** (titles to about 24px, body 13 to 14px), with the craft floors in rule 15.
8. **Pill-forward.** Buttons, badges, pills, avatars, nav items, icon chips = `rounded-full`. Cards 18 to 28px (24 default, 28 featured, 18 compact), nested radii concentric. **Inputs `rounded-[10px]`/`[12px]`: the one non-pill control.**
9. **Container ladder**: `max-w-5xl` (nav, contact), `max-w-6xl` (sections, footer), `max-w-2xl` (leads). Never full bleed, never `max-w-7xl`+. Padding `px-4 sm:px-6 lg:px-8`; alternate `bg-surface-1` bands.
10. **Lucide only**, `strokeWidth 1.75`, usually in a `rounded-full` chip; a `text-foreground/[0.06]` watermark on flat tints. No filled sets, no emoji icons.
11. **Quiet motion in two tiers.** *Reveal* (sections, once): `y 15-24 -> 0`, 0.4 to 0.7s, ease `[0.22,1,0.36,1]`. *UI* (press, menus, dialogs, toasts, icon swaps): the exact values in `craft/motion.md`. Always honour `prefers-reduced-motion`.
12. **Three tile families per section** (featured, secondary, minimal), never a wall of identical cards.
13. **Tokens only.** No raw hex, no Tailwind palette classes, no `text-white/xx` islands. Both themes work through tokens, so dark needs almost no extra CSS.
14. **Text colour is checked, not assumed** [measured]. Category colour as *small text* fails AA for most hues: use the `-ink` variants for text, `chip-*` for glyphs, `text-foreground/70` as the floor on tints.
15. **Craft floors beat taste.** Accessibility (WCAG 2.2 A/AA), the 13 escalation triggers, mobile inputs at 16px, 44px hit areas, visible focus, state never by colour or motion alone, content that survives 320px / 200% zoom. When the identity and a floor collide, `precedence.md` says how to satisfy both on-system.

**Decision order** (never start with colour): information hierarchy, flow and states, visual hierarchy, layout, spacing tier, component recipe, **then** category colour, type, icons, interaction, motion, responsive, accessibility, polish.

## 4. Craft floors you keep in your head (details in `references/craft/`)

- **Accessible by default**: native elements first, accessible names on every control, `:focus-visible` rings that reach 3:1 and are never hidden under the floating nav, keyboard paths for everything, labels not placeholders, validate on submit, live regions mounted empty.
- **Motion**: ask whether to animate; name transition properties (never `all`); exits shorter than enters; press never below 0.96 and never on disabled; spring bounce 0; reduced-motion gated.
- **Type**: unitless line-height, 3+ line text at 1.4 or more, `text-balance` headings and `text-pretty` paragraphs, `tabular-nums`, measure 60 to 75 characters for long copy, inputs 16px on mobile.
- **Layout**: space before lines, gap between groups at least 2x the gap within; logical properties; `minmax(0,1fr)` and `min-w-0`; `dvh` not `vh`; container queries for components; visual order equals DOM order.
- **Writing**: verb-first buttons, errors that say how to fix, "Undo" before "Are you sure?", destination-describing links, whole strings with `Intl`.
- **Colour**: measure, never estimate; one colour one meaning; status never colour alone.
- **Review before reporting**: the 13 triggers in `craft/review-protocol.md`, then each domain.

## 5. What you may change, and what you may not

| Change freely | Never change |
|---|---|
| Product name, copy, routes, data | Number of hues (six), the lightness and saturation bands |
| Accent hue (`--primary`, `--ring`) via `rebrand.md` | The accent as a button fill |
| Which entity gets which category hue | The radius ladder; pills versus inputs |
| Page structure inside the pattern families | Geist; a second display face |
| Optional modules (live state) when the product has live state | The "one filled button" doctrine |
| Signature element, micro-moments, composition, copy voice | Craft floors (rule 15) |

If a request reopens a settled decision, name which one and confirm once. A per-task override does not propagate to other pages.

## 6. Procedure (all modes)

1. **Establish the brand config** (product, accent, category mapping, live state?, tone, a11y target, stack). Propose defaults; ask only what you cannot infer. Template in `build-new.md`.
2. **Install the foundation** with `scripts/install.sh` (never overwrites). Run the untouched starter once and confirm it is clean before you change it.
3. **Understand and structure** (`design-process.md` steps 1 to 3): the four-line brief, hierarchy, flow, states, pattern family. **For conversions:** read the code, run `audit.py`, write the audit list, then **stop and confirm scope** before any edit wider than one small component.
4. **Build in decision order** with the kit components (`assets/starters/react-kit`) or `pastel.css`. One shared kit file first, then element by element. Do not restyle kit components per page.
5. **Design every state**: empty, loading (calm loader), error with retry, success, offline, locked.
6. **Make it specific and add engagement moments** (`design-process.md` steps 4 to 6): the swap test, one signature element, one to three micro-moments per screen.
7. **Craft pass**: load the matching `craft/*.md` and fix as you go.
8. **Preserve behaviour exactly** in conversions: routes, slugs, form field names, storage keys, analytics events, ARIA, test IDs. Never invent data; show a designed empty state.
9. **Review and verify** (`craft/review-protocol.md`, `quality-gates.md`): build, `audit.py` (0 errors), `contrast.py` (if tokens changed), `verify-render.mjs` (both themes x 375/768/1280/1440/1920 + axe), then **look at the screenshots**.
10. **Report** in the format in section 11. Do not commit or push unless asked.

## 7. Quickstart

Scripts need Python 3 and Node 18+. On Windows run `python` where this file says `python3`, and run `.sh` files from Git Bash or WSL.

```bash
# 1. NEW PROJECT, light + dark, ready to run (never overwrites; refuses a non-empty folder)
bash scripts/install.sh new vite  my-app     # SPA: React 19, Tailwind 4, Vite
bash scripts/install.sh new next  my-site    # SSR: Next, Tailwind 4, no-flash theme script
bash scripts/install.sh new html  my-page    # single-file standalone + Claude Artifact fragment
bash scripts/install.sh new vanilla my-page  # plain CSS, no build step
cd my-app && npm install && npm run dev      # the theme toggle is already wired

# 2. CONVERT AN EXISTING APP (read-only first, then phased: see convert.md)
python3 scripts/audit.py ./src               # the off-system list with file:line and the fix
bash scripts/install.sh add ./my-existing-app --dry-run

# 3. AUDIT / VERIFY
python3 scripts/contrast.py assets/tokens.css --fail
npm i -D playwright-core axe-core && node scripts/verify-render.mjs --url http://localhost:5173 --out shots
```

## 8. Tools (all in `scripts/`)

| Command | What it does |
|---|---|
| `bash scripts/install.sh new <vite\|next\|html\|vanilla> <dir>` | Scaffold a complete starter. Refuses a non-empty folder |
| `bash scripts/install.sh add <project> [--dry-run]` | Detect Next/Vite and Tailwind 3/4/none, copy what is missing, **skip what exists**, print the manual edits it will not make |
| `python3 scripts/audit.py <path> [--json] [--rule ID ...]` | Lint for off-system patterns **and craft violations** with file:line and the fix. Exit 1 on any ERROR |
| `python3 scripts/contrast.py assets/tokens.css [--fail]` | WCAG contrast of every token pair, both themes, 8-bit accurate |
| `python3 scripts/suggest_ink.py assets/tokens.css > assets/a11y-text.css` | Regenerate the AA-safe text colours after changing tokens |
| `python3 scripts/build_assets.py` | Regenerate `tokens.vars.css`, the Tailwind 4 starters' CSS and the HTML starters from `tokens.css` |
| `node scripts/verify-render.mjs --url <url> --out shots` | Render both themes at 5 widths, check overflow and errors, run axe, save screenshots |

## 9. Assets (ground truth and starters)

`assets/tokens.css` (the owner's tokens, verbatim) · `tokens.vars.css` (variables only, any stack) · `a11y-text.css` (AA text set) · `craft.css` (craft utilities and base rules: focus scroll padding, text wrapping, image outline, scroll containment, tap target, skip link, `sr-only`) · `tailwind.v3.preset.ts` · `tailwind.v4.css` · `pastel.css` (plain-CSS components) · `live-state.*` (optional module) · `starters/react-kit` (components, theme provider, palette maps) · `starters/{vite,next,html}` · `examples/showcase-kit.html` (the approved visual reference: open it and compare) · `examples/clinic-inbox-app.html` (a worked multi-screen app).

## 10. Gotchas that bite first (full list in `gotchas.md`)

- **Never build colour classes by concatenation** (`"bg-tint-" + hue`): Tailwind will not generate them. Use the static maps in `lib/palette.ts`.
- **`cn()` must know `text-display-*`** or tailwind-merge silently drops one of two text classes (the kit's does).
- **Next: the no-flash theme script must live in a non-`'use client'` file**, or the build fails.
- **Tailwind 3 needs the preset** (adds `on-tint`, alpha on every colour, ink colours) and `future.hoverOnlyWhenSupported`. Tailwind 3 has no `scale` property utility: transition `transform`.
- **Small category-coloured text fails contrast.** Use `-ink`. `/60` text on a tint fails; `/70` is the floor.
- **`scroll-behavior: smooth` breaks naive scroll tests** and scroll-triggered reveals never fire in screenshots; scroll with `behavior: 'instant'`.

## 11. Reject on sight

Cream + serif + terracotta · single-accent monochrome · accent `primary` as a button fill · grey `shadow-sm/md/lg` · raw hex or rainbow gradients in chrome · gradient text · glass cards outside the nav · `rounded-md/xl` cards · `rounded-full` inputs · `max-w-7xl`+ · filled or emoji icons · parallax, scroll-jacking, bounce · walls of identical cards · unsourced hero stats or invented social proof · hard-coded `bg-[#0b0c0f]` / `text-white/xx` islands · em dashes in visible copy · raw routes or URLs as visible text · `user-scalable=no` · big dark side panels on marketing or auth pages.

**Craft rejects:** `transition: all` · `outline: none` with no focus replacement · `<div onClick>` · positive `tabindex` · placeholder used as the label · submit disabled until valid · `100vh` for a full-height pane · inputs under 16px on mobile · content reachable only on hover · state carried by colour or motion alone · positive-tone errors with no fix ("Oops!") · "Are you sure?" with Yes/No buttons · "Click here" links.

`audit.py` detects most of these; the rest are caught by the review protocol.

## 12. Report format (hand back exactly this)

1. Files touched.
2. Anti-patterns removed (name them) and what replaced each.
3. Pattern family used (and Direction A/B; anything on Direction B is flagged).
4. Design note per screen (`design-process.md` section 10): the four lines, signature element, micro-moments, states designed. Conversions add before/after measurements.
5. **Review result** (`craft/review-protocol.md`): coverage table (domain, evidence, result), findings fixed, anything left, and the verdict line (**Block** or **Approve**, naming any domain *Not reviewed*).
6. Anything **deliberately left off-system and why**, and any deliberate deviation used from the register in `precedence.md`.
7. Verification: build, `audit.py` result, both themes, widths rendered, axe result, contrast spot-checks, behaviour unchanged, and **what could NOT be verified**.
8. Open items and manual follow-ups.

## 13. Scope discipline

Do not rename routes, slugs, params, form field names, storage keys, analytics events or test IDs. Do not rewrite copy meaning (reformatting and removing em dashes is fine). Do not touch vendored mock components that deliberately look like separate products. Do not add features. Land work in reviewable steps, not one mega-diff. Do not commit or push without being asked. Delete every throwaway page, mock or fixture you created. If a request implies reopening a settled decision, say which one and confirm first.
