# Building something new: feature, website or app

Three entry points, one procedure. What changes is how much foundation exists and which pattern file you read.

| You are building | Foundation | Read | Starter |
|---|---|---|---|
| **A feature or screen in an existing app** | Already there (or `add` it) | app-patterns.md or site-patterns.md | `scripts/install.sh add` if missing |
| **A website** (marketing, content, landing) | Install | site-patterns.md | `starters/html`, `starters/next` or `starters/vite` |
| **A software product / SaaS / internal tool** | Install | app-patterns.md, then site-patterns.md for the public site | `starters/vite` (SPA) or `starters/next` (SSR) |
| **A prototype to look at** (single file, Claude Artifact) | None | stacks.md "Single file / artifact" | `starters/html/artifact.html` |

## 0. Establish the brand config (2 minutes, write it down)
Put this in the project's `CLAUDE.md` or `docs/design-brand.md`. Ask only for what you cannot infer; propose defaults for the rest.
```
product:            <name>
primary hue:        <cobalt 217 78% 50% (default) | indigo 232 56% 52% | custom, see rebrand.md>
wordmark:           <text + accent dot in Geist Mono>
category mapping:   <entity -> blue|violet|emerald|coral|amber|teal>      (see the vertical presets in rebrand.md)
has live state?     <yes/no; if yes name the 3 to 5 states>
theme default:      light
tone of copy:       <e.g. calm, plain language, no em dashes>
a11y target:        <AA (default) | AAA | none stated>
stack:              <next | vite | astro | html | other>, tailwind <3|4|none>
```

## 1. Install the foundation
- **New project:** `scripts/install.sh new <vite|next|html|vanilla> <dir>`, then install deps and run.
- **Existing project:** `scripts/install.sh add <dir>` (never overwrites), then make the manual edits it prints (import the CSS, wrap in `ThemeProvider`, fonts).
- Confirm by running the dev server and the render check once on the untouched demo page before you change anything. If the starter is not clean, your edits will not make it cleaner.

## 2. Plan before pixels
Write four lines for the screen: **who and what in the first five seconds**, **the one primary action**, **the states** (empty, loading, error, success), **the families** (which tiles are featured / secondary / minimal).
Then follow the decision order in identity.md section 7. Classify the page into a family in site-patterns.md or app-patterns.md and say which.
For anything bigger than a single component, run `design-process.md` steps 1 to 4 first (hierarchy, flow and states, the swap test, one signature element). That is what makes the result specific to the product rather than a tidy template.

## 3. Assign colour last, by category
List the entities that deserve coding (services, projects, plans, sections, channels). Give each **one** hue, cycled with `hueAt(i)`. Washes for the few hero tiles, `chip-*/10` icon fills for everything neutral.
Status uses status tokens. If a screen reads as a rainbow, you coded decoration; remove colour until each hue means something.

## 4. Build in this order
1. Page shell and container (`Section`, `max-w-6xl`, bands). 2. The **featured** tile family. 3. The secondary and minimal families. 4. Forms. 5. States (empty, loading, error, success).
6. Nav and footer. 7. Motion. 8. Responsive pass at 375 / 768 / 1280. 9. Dark pass (toggle and look). Use kit components; do not restyle them per page. Load the matching `craft/*.md` as you build each item (forms: accessibility and writing; anything that moves: motion; text: typography).

## 5. New feature inside an existing product
- Match the product's existing patterns first: if it already has a settings layout, extend it rather than inventing one.
- Reuse its components; build a new one only if no recipe fits, by **extending the nearest recipe** and saying so in the report.
- Keep the change reviewable: one folder or feature slice, no drive-by restyling of untouched screens. (If the product is not yet on the system, that is a conversion: see convert.md.)
- New screens still pass both themes, 5 widths and axe. Run the checks on **your screen**, not the whole app.

## 6. New website specifics
- Choose the page families, write real copy (or mark placeholders clearly), then build. Never lorem ipsum, never invented testimonials or stats.
- SEO from the start: unique title and description per page, one `h1`, semantic landmarks, `lang` on `<html>`, real alt text, a sitemap if the framework offers one.
- Performance: Geist self-hosted via `geist` or fontsource (no render-blocking third-party CSS in production), lucide icons imported individually, images with explicit sizes, motion only for the specified reveals.

## 7. New software / SaaS specifics
- Start with the **shell** (sidebar, top bar, theme toggle, a designed empty state) and one real screen end to end (list, detail, create) before breadth.
- Every table, form and chart gets its empty / loading / error state on the first pass, not "later".
- Permissions, destructive actions and billing screens get confirm steps and plain-language copy. Status is shown with a label as well as a colour.
- Keep a `docs/design-brand.md` and a status file with one row per route (state, family used, verified widths, themes, open items).

## 8. Verify and report
Run `python3 scripts/audit.py src`, `python3 scripts/contrast.py <tokens.css>` (if you changed any token), and `node scripts/verify-render.mjs --url <dev url>`. Then run the review protocol (`craft/review-protocol.md` sections 1 and 3) on your own output and hand back the report in SKILL.md.
Do not commit or push unless the user asks.
