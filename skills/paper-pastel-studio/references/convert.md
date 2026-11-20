# Converting an existing site or app to Paper & Pastel

Guiding rule: **change the visual layer, preserve everything else**: routes, slugs, data shapes, form field names, storage keys, analytics events, ARIA, copy meaning, SEO structure, test IDs.
Land it in **reviewable steps**, never one mega-diff. Each phase ends in a working, committable state. Do not commit or push unless asked.

## Phase 0: Audit (read only, no edits)
1. **Stack**: framework, styling approach (Tailwind? CSS modules? styled-components? Bootstrap/MUI/Chakra?), component library, dark-mode mechanism, font loading, Tailwind major version.
2. **Token surface**: where colours, spacing and radii live today (theme file, scattered hex, a UI kit theme).
3. **Inventory** recurring pieces: buttons, cards, nav, footer, forms, badges, type scale, section rhythm, hero.
4. **Run the linter**: `python3 scripts/audit.py <src>` gives the off-system list with file:line (identity rules are ERROR or WARN; craft rules such as `transition-all`, `<div onClick>`, `100vh`, inputs under 16px are WARN). Group it by rule. This is the diff's table of contents.
5. **Classify** each page into a family (site-patterns.md / app-patterns.md).
6. **Risk list**: CSS-driven layout logic, `:has()` hacks, JS reading computed styles, screenshot or visual-regression tests, vendored mock components that deliberately look like other products.

Output: "here is the stack, what maps cleanly, what needs manual rework, what I will not touch". **Stop and confirm scope with the user before editing anything wider than one small component.**
This is the one phase where being wrong is expensive to unwind.

## Phase 1: Install the token foundation (no visual wiring yet)
`scripts/install.sh add <project>` then the manual steps it prints. Tailwind 3: preset + `tokens.css` + `a11y-text.css`. Tailwind 4: `tailwind.v4.css` + vars. No Tailwind: `tokens.vars.css` + `a11y-text.css` + `pastel.css`.
Fonts as `--font-geist-sans` / `--font-geist-mono`. Theme provider with `defaultTheme="light"`, `suppressHydrationWarning` on `<html>`, no-flash script. Commit: "chore: install paper-pastel tokens".

## Phase 2: Global reskin (mechanical, high leverage)
Repo-wide search and replace, then review. After this pass the app already *reads* as the system.

| Find (typical) | Replace with |
|---|---|
| `bg-white` / `bg-gray-50` page bg | `bg-background` |
| `text-gray-900` / `#111` | `text-foreground` |
| `text-gray-500/600` | `text-muted-foreground` |
| `border-gray-200/300` | `border-border` |
| card `bg-white shadow-md rounded-lg` | `rounded-[24px] border border-border bg-surface-1` (drop the shadow) |
| `shadow-sm/md/lg/xl` on custom components | remove; add hover lift instead (Phase 3) |
| brand-coloured filled button (`bg-blue-600 text-white`) | `bg-cta text-cta-foreground hover:bg-cta/90 rounded-full` |
| secondary button | `border border-border bg-transparent hover:bg-accent rounded-full` |
| `rounded-md/lg/xl` on buttons and badges | `rounded-full` |
| `rounded-md/lg` on inputs | `rounded-[10px]` |
| `rounded-lg/xl` on cards | `rounded-[24px]` (or 20/28 by weight) |
| `from-x-500 to-y-600` gradient text/bg | solid `text-primary` or a `bg-tint-*` wash |
| `max-w-7xl` / no-max containers | `max-w-6xl` (`max-w-5xl` for nav/contact) |
| section vertical padding | `.section-padding` |
| Heroicons / FontAwesome / emoji | `lucide-react`, `strokeWidth={1.75}` |
| red/green/yellow status colours | `text-destructive-ink` / `text-success-ink` / `text-warning-ink` |

Then a colour-hygiene sweep: `audit.py --rule raw-hex palette-class white-black raw-color-fn`, routing each to a token or a category colour. Commit: "refactor: map chrome onto paper-pastel tokens".
**Show the user a diff summary and a before/after of one key page, then wait.** Phase 3 commits to component-level decisions that are cheap to redirect now.

## Phase 3: Component rebuild (the craft pass)
Rebuild each recurring component against components.md, in this order: Button (one filled variant), Card (hairline, no resting shadow, radius by weight), **category system** (decide which entities get colour, one hue each, cycled), Navbar (floating pill), Forms,
Badges/pills, Footer, Empty/loading/error, Section headings. Any section that is "N identical cards" becomes **featured + secondary** or three families. Commit per component group.
Where the user also wants the *experience* improved, not only recoloured, run `design-process.md` steps 1 to 4 for each page family before rebuilding its components (hierarchy, flow, the swap test, one signature element).

## Phase 4: Motion and polish
Reveal wrapper (`Reveal`), hero stagger, `active:scale-[0.98]`, hover lift, arrow nudge, sliding nav pill, watermark icons on flat tints. Optionally one aurora + noise behind the hero. Confirm the reduced-motion guard is present.
Apply the **two motion tiers** (`craft/motion.md`): section reveals keep the identity values; every interactive state (press, menus, dialogs, toasts, icon swaps) uses the craft values, with named transition properties. Then the **craft pass**: load the `craft/*.md` files for what you touched (visible focus rings, 44px hit areas, inputs at 16px on mobile, layout floors, copy).

## Phase 5: Verify
Build, typecheck, lint and existing tests green. Then `verify-render.mjs` (both themes x 5 widths + axe), `audit.py` re-run (errors must be zero), `contrast.py` if tokens changed. Behaviour unchanged: routes, submits, auth flows, keyboard order, labels.
Run the review protocol (`craft/review-protocol.md` sections 1 and 3) on the changed screens and state the verdict line. Screenshot before and after key pages for the PR. Report in the SKILL.md format.

## Framework notes
- **Next.js (app router)**: the reference. `geist` package for fonts, `ThemeProvider` client component, `themeInitScript` from the **non-client** `theme-script.ts` in `<head>`, `viewport.themeColor` for both themes.
- **Vite / CRA / Remix**: same Tailwind and tokens; the bundled `ThemeProvider` (no `next-themes` needed); self-host Geist via fontsource.
- **Astro**: tokens in a global CSS, Tailwind integration, islands only where motion or the toggle need JS.
- **Vue / Nuxt / Svelte**: tokens and classes carry over unchanged; port the kit components (they are small) and keep the same props. Use `lucide-vue-next` / `lucide-svelte`.
- **Plain HTML / SCSS / server templates (Rails, Django, PHP, WordPress)**: `tokens.vars.css` + `pastel.css`, or recreate recipes as BEM classes consuming the variables. Skip framer-motion; use CSS transitions.
- **shadcn/ui**: the closest fit. Its CSS variables map almost one to one; replace `components/ui/button.tsx` with the kit's (one filled variant, pills) and `Card`/`Input` radii per the ladder.
- **MUI / Chakra / Bootstrap**: build a theme object mapping palette, shape, shadows and typography to the `--` variables (`palette.background.default = 'hsl(var(--background))'`, `shape.borderRadius` per the ladder, kill default elevations).
  Still hand-build nav, footer, hero and cards to the recipes; library defaults will not get you there alone.
- **styled-components / Emotion**: expose the variables with a global style, build the theme from them, port recipes to styled components.

## Scope discipline
Do not rename routes, slugs, params, form field names, storage keys, analytics events or test IDs. Do not rewrite copy meaning (reformatting and de-em-dashing is fine). Do not touch vendored mock components that deliberately look like separate products.
Do not add features. A reskin is not a behaviour redesign unless the user asks for the featured/secondary restructure.
