# Stacks and targets

## Choosing the target
| Target | Use | Notes |
|---|---|---|
| Next.js (app router) | `install.sh new next` | Tailwind 4, `geist` fonts, `ThemeProvider`, server-safe no-flash script. Built and verified |
| Vite + React | `install.sh new vite` | Tailwind 4 plugin, fontsource fonts. Built and verified |
| Plain HTML, no build | `starters/html/index.html` | Tailwind play CDN (pinned) + lucide UMD. Verified (CDNs swapped locally in the test) |
| Plain CSS, no Tailwind | `install.sh new vanilla` (demo: `starters/html/vanilla.html`) | `tokens.vars.css` + `a11y-text.css` + `pastel.css`. Verified |
| Claude Artifact / hosted single file | `starters/html/artifact.html` | Fragment, see below |
| Astro, Remix, Nuxt, SvelteKit, Rails, Django, WordPress | tokens + `pastel.css`, or port the kit | See convert.md framework notes |
| MUI, Chakra, Bootstrap, shadcn | theme mapping | See convert.md |
| React Native / native | map the tokens | See "Native and other renderers" |

## Tailwind 3 vs 4
- **v4 (default for new work):** CSS-first. `@import "tailwindcss"`, then variables, then `@theme inline { --color-... }`. Dark variant via `@custom-variant dark (...)`. Custom utilities with `@utility`. `tailwind.v4.css` is the whole config; the Vite and Next starters inline it.
  Tailwind already ships `tabular-nums` and `text-balance`, so the v4 file does not redefine them.
- **v3:** `presets: [paperPastel]` (the preset adds `<alpha-value>` to every colour so `/10 /35 /70` always work, the `on-tint` plugin, and the ink colours) plus `tokens.css` (the owner's file; it uses `@apply`). `darkMode: 'class'`.
- The class names the kit uses are identical in both. Only the config differs. Both were compiled and the custom classes checked for output.
- `tailwind-merge` v3 matches Tailwind 4; the kit's `cn()` registers the `display-*` sizes.
- **Hover on touch screens:** v4's `hover:` already compiles under `@media (hover: hover)`. v3 does not: set `future: { hoverOnlyWhenSupported: true }` in `tailwind.config` (the single-file HTML starters do). v3 also has no `scale` property utility, so transition `transform` there (`craft/motion.md` section 4).

## Tooling versions the starters were verified with
Node 22, React 19, Vite 7, Tailwind 4.3, Next 16, TypeScript 5.9, lucide-react 0.544, framer-motion 12, tailwind-merge 3, geist 1.9, `@fontsource-variable/geist` 5.
**Check before upgrading:** lucide-react 1.x removes brand icons (Instagram, Facebook): use `simple-icons`. framer-motion and TypeScript major versions moved after this was verified; run the build after any upgrade.

## Next.js specifics
- `app/layout.tsx`: `<html lang="en" suppressHydrationWarning className={GeistSans.variable GeistMono.variable}>`, inline `<script dangerouslySetInnerHTML={{__html: themeInitScript()}}/>` in `<head>`, body `bg-background font-sans text-foreground antialiased`, `viewport.themeColor` for both schemes.
- **`themeInitScript` must come from `components/theme-script.ts` (no `'use client'`).** If it is exported from the client `theme.tsx` the build fails ("Attempted to call themeInitScript() from the server but it is on the client"). This was a real build failure found while verifying.
- Wrap links with `next/link` where you navigate; the kit renders plain `<a>`.
- Add `app/icon.svg` (or any icon) to avoid a favicon 404 in checks.

## Single file / Claude Artifact
Hosts that wrap your page in their own `<html>` want a **fragment**: `<title>`, styles, markup, scripts, no doctype/html/head/body. `starters/html/artifact.html` is that. Rules that matter:
- **Theme**: the three-state token shape (dark-mode.md mechanism 3). `body` has an explicit token background (the host paints its own behind a transparent body).
- **Complete at rest**: no content left at `opacity:0` waiting for a scroll observer. The starter animates the hero on load only. A thumbnail or link preview must show everything.
- **Libraries**: scripts only from cdnjs, jsDelivr/npm, unpkg, cdn.tailwindcss.com, code.jquery.com; stylesheets only from Google Fonts; pin exact versions at least two weeks old. Everything else inline or `data:`.
- **No** `alert/confirm/prompt`, `window.print`, downloads via `<a download>`, `mailto:`/`tel:` as the only path, iframes of other sites. Build confirmation steps into the page; show addresses as selectable text.
- **Phone**: side gutters `max(16px, env(safe-area-inset-left))`, no horizontal scroll, sticky headers `top: env(safe-area-inset-top, 0px)`.
- Persisted state belongs in the host's runtime capability, not `localStorage` (use `localStorage` only for per-viewer conveniences, always in try/catch).
- The clinic example is a worked multi-screen artifact (hash-less single page with JS screen switching). If you need bookmarkable screens, name each with a bare `#token` and open `location.hash` on load.

## Non-Tailwind
`tokens.vars.css` (variables) + `a11y-text.css` + `pastel.css` (components). Hues are a modifier class (`pp-hue-violet`) that sets three variables the components read. Dark = `class="dark"` on `<html>`. SCSS/CSS modules can consume the same variables; do not copy values.

## Native and other renderers
Tokens are HSL channel triples. Convert once (HSL to hex/RGB) in a build step and keep the **names**: `background`, `foreground`, `surface-1..5`, `border`, `primary`, `cta`, `chip-*`, `tint-*`. Keep the radius ladder (pill, 28/24/20/18/10), the type roles and Geist if the platform allows.
Email and PDF: inline the converted hex values; dark mode usually does not apply. Re-run contrast on the converted values.

## Fonts
Geist Sans + Geist Mono. Next: `geist` package. Vite/others: `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` (then `--font-geist-sans: "Geist Variable"`). Plain HTML: Google Fonts link with `display=swap` and the system fallback stack.
No second display face, ever.
