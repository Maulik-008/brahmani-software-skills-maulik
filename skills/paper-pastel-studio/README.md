# paper-pastel-studio

One skill to **start**, **convert** and **design** interfaces in the **Paper & Pastel** system: a white-first editorial canvas (true ink-black in dark), six pastel category colours, one ink pill button, Geist Sans + Mono, hairline depth, quiet motion, **plus a craft layer of exact interface rules** (surfaces, motion, typography, contrast, accessibility, layout, writing, review).

It merges:
- the owner's **`paper-pastel`** skill (identity, tokens, kit, starters, tooling),
- the two hands-off agents (`paper-pastel-converter`, `studyclock-redesigner`), generalised into one agent,
- Jakub Krehel's [`better-*` interface skills](https://github.com/jakubkrehel/skills) (MIT, adapted: see `THIRD_PARTY_NOTICES.md`).

## What you can do with it

| You say | It does |
|---|---|
| "Start a new SaaS for clinics in the pastel design" | **New project** with light and dark wired: scaffolds Vite or Next, shell first, one real screen end to end, verified in both themes |
| "Build a pricing page / landing page in the pastel design" | New website: installs the foundation if missing, builds from the kit, real copy, SEO basics |
| "Add a billing screen to this app using paper pastel" | New feature: matches the app, reuses components, checks your screen only |
| "Convert this app to the pastel design" | **Convert**: audit first (read only), **stops for your confirmation**, then phased and reviewable, behaviour untouched |
| "Redesign the dashboard so it is more intuitive and creative" | **Design**: four-line brief, hierarchy and states, anti-template tests, one signature element, micro-moments, craft pass, review |
| "Audit this against the pastel design" / "review this UI" | Linter (identity + craft), contrast, render checks, then the review protocol with a Block or Approve verdict |
| "Change the accent to teal across the design system" | Rebrand: edits tokens, regenerates, re-checks contrast |

Hands-off: "use the paper-pastel-studio agent to redesign the dashboard".

## Install (pick one)

**Claude Code, every project (recommended)**
```bash
mkdir -p ~/.claude/skills && cp -r paper-pastel-studio ~/.claude/skills/
mkdir -p ~/.claude/agents && cp paper-pastel-studio/agents/paper-pastel-studio.md ~/.claude/agents/   # optional hands-off agent
```
**Claude Code, one project:** the same into `.claude/skills/` and `.claude/agents/`.
**Claude.ai / Claude desktop:** upload `paper-pastel-studio.skill` under Settings, Capabilities, Skills.

Restart the session and ask "what skills do you have?": look for `paper-pastel-studio`. It replaces the older `paper-pastel` skill; remove that one to avoid two skills answering the same request.

## How the two layers fit

| Layer | Answers | Where |
|---|---|---|
| **Identity** | What it looks like | `references/identity.md`, `decisions.md`, `components.md`, `assets/tokens.css` |
| **Craft** | How it is built and behaves | `references/craft/*.md`, `assets/craft.css`, the craft rules in `scripts/audit.py` |
| **Process** | How to make it good, not just on-system | `references/design-process.md`, `creative-method.md` |

Where they disagree, `references/precedence.md` decides once (for example: press scale stays 0.98, hairlines stay, em dashes stay banned, but inputs are 16px on mobile and transitions never use `all`). It also lists the deliberate deviations a reviewer must not flag.

## What is inside

```
paper-pastel-studio/
├── SKILL.md                     router: modes, 15 rules, craft floors, procedure, quickstart, report format
├── THIRD_PARTY_NOTICES.md       MIT notice for the adapted craft rules
├── references/
│   ├── precedence.md            how identity and craft fit; settled conflicts; deviations register
│   ├── identity.md · decisions.md · components.md · dark-mode.md · rebrand.md · stacks.md · gotchas.md
│   ├── app-patterns.md · site-patterns.md · build-new.md · convert.md
│   ├── design-process.md        the design loop: understand, structure, compose, make specific, states, craft, critique
│   ├── creative-method.md · quality-gates.md · live-state.md · live-state-recipes.md
│   └── craft/                   index · surfaces-and-icons · motion · typography · color-and-contrast
│                                · accessibility · layout · writing · review-protocol
├── assets/                      tokens.css (ground truth) · tokens.vars.css · a11y-text.css · craft.css
│                                · tailwind.v3.preset.ts · tailwind.v4.css · pastel.css · live-state.*
│                                · starters/{react-kit,vite,next,html} · examples/
├── scripts/                     install.sh · audit.py · contrast.py · suggest_ink.py · build_assets.py · verify-render.mjs
└── agents/paper-pastel-studio.md
```

## Requirements
Nothing for the knowledge. For the tools: Python 3 (audit, contrast, build), Node 18+ (starters, `verify-render.mjs`), and for render checks `npm i -D playwright-core axe-core` plus a Chromium or Chrome (`--chrome <path>`). On Windows use `python` for `python3` and run the `.sh` files in Git Bash or WSL. Starters target React 19, Tailwind 4, Vite 7 or Next 16.

## Changing the design
`examples/` are snapshots and are not regenerated; everything else under `assets/starters` is. Edit `assets/tokens.css` (or `assets/craft.css`), then `python3 scripts/build_assets.py`, `python3 scripts/contrast.py assets/tokens.css --fail`, and `python3 scripts/suggest_ink.py assets/tokens.css > assets/a11y-text.css` followed by `build_assets.py` again.

## What changed from the original `paper-pastel`
- **Added:** the craft layer (8 reference files), `precedence.md`, `design-process.md`, `assets/craft.css`, 11 craft rules in `audit.py`, focus-ring and input-border contrast checks, the unified agent, the MIT notice.
- **Patched in the kit and starters:** no `transition-all` (named properties), press never on disabled controls and works on links, inputs 16px on mobile with a stronger focus edge, theme switch without a colour-transition flash, hover only where hover exists (`@media (hover: hover)`, `hoverOnlyWhenSupported` in the HTML starters), `scroll-padding-top` for the floating nav, `.card-hover` in `tokens.css` names its properties (the one edit to the owner's file).
- **Fixed:** `install.sh` found no working Python on Windows; `build_assets.py` wrote CRLF on Windows.
- **Unchanged:** every token value, the six hues, the radius ladder, the one-filled-button doctrine, the 19 settled decisions.

## Provenance and honesty
Identity, tokens, decisions, core recipes and the conversion playbook are the owner's. Components beyond them are extensions tagged **[ext]**. The craft rules are adapted from Jakub Krehel's skills with their exact values, rewritten for this system. The `-ink` text set is an extension: the original small category-coloured text is below 4.5:1 for most hues (measured).

**Verified in this build:** the scaffolded Vite starter installs, typechecks and builds, renders with no horizontal scroll or console errors at 375/768/1280/1440/1920 in light and dark, and passes axe (0 violations at 375 and 1280, both themes); the Next starter installs and builds; the single-file HTML starter and the plain-CSS starter render at 375 and 1280 in both themes with no overflow, no errors and 0 axe violations; `audit.py` reports 0 errors and 0 warnings on the starters and fires correctly on a fixture for each new craft rule; `contrast.py` reports 0 required failures with the focus-ring pairs now required; the four `install.sh new` kinds scaffold, `add` dry-runs on a Tailwind 4 project, and a non-empty folder is refused.
**Not verified:** the Next starter's runtime render, the Tailwind 3 preset in a real project, Safari and Firefox, real devices, screen-reader behaviour, and the unchanged `examples/`.
