# Re-branding and vertical presets

Change as little as possible. The identity is the **structure**, not the hue.

| Knob | Safe to change | Do not change |
|---|---|---|
| `--primary` / `--ring` / `--sidebar-primary` | Hue; keep S 55 to 85, L 50 to 52 (light) | Never use it as a button fill |
| Wordmark | Yes (mono wordmark + accent dot is the pattern) | Keep it in Geist Mono |
| Category assignments | Which entity gets which hue | The number of hues (six) |
| `--accent-*` / `--tint-*` hues | Only if a hue clashes with the brand; shift by 15 degrees at most | The lightness and saturation bands |
| Radius base | Keep 20px | The ladder (full / 28 / 24 / 20 / 18 / 10 to 12) |
| Fonts | Keep Geist | No second display face |
| Copy, routes, data | Yours | n/a |

## Re-hue procedure (5 minutes)
1. Edit `--primary`, `--ring`, `--sidebar-primary` (light) and their dark counterparts (brightened, S about +7) in `assets/tokens.css`. If you use the live-state module with indigo, match the "running" state to it.
2. `python3 scripts/build_assets.py` (regenerates the variables file and the starters' CSS).
3. `python3 scripts/contrast.py assets/tokens.css --fail`. Required pairs must pass.
4. `python3 scripts/suggest_ink.py assets/tokens.css > assets/a11y-text.css` then `build_assets.py` again, so the text variants track the new values.
5. Re-run `verify-render.mjs` on your app.

## Choosing category colours: vertical presets [ext]
A preset is a starting map from **entity to hue**. Keep one hue per item, cycle, never exceed six. These are suggestions drawn from the owner's own usage notes (healthcare = blue, AI/SaaS = violet, live/tools = emerald, billing/CRM = coral, analytics/ops = amber, portals/automation = teal).

| Vertical | blue | violet | emerald | coral | amber | teal |
|---|---|---|---|---|---|---|
| **Healthcare / clinic** | care, appointments | AI agent, records | live, available, confirmed | billing, urgent follow-up | analytics, operations | portals, reminders, automation |
| **SaaS / dev tools** | core product | AI, assistants | live, deployed, healthy | billing, CRM | analytics, monitoring | integrations, workflows |
| **Fintech** | accounts | insights, AI | income, available | spend, alerts | forecasts, budgets | transfers, automation |
| **Education** | courses | AI tutor | progress, live sessions | assessments | analytics, streaks | community, tools |
| **E-commerce** | catalogue | recommendations | in stock, fulfilled | orders, offers | merchandising, analytics | shipping, integrations |
| **Ops / logistics** | dispatch | forecasting, AI | on time, delivered | exceptions, SLA risk | capacity, analytics | integrations, workflows |
| **Creator / portfolio** | services | AI projects | tools, live demos | featured work | writing, analytics | process, contact |

Status colours are separate: success, warning, destructive. A category is never a status. If a product has live state (timers, calls, recordings, deploys, sync), add the state axis from live-state.md instead of overloading a category hue.

## Wordmark and brand lockup
Mono wordmark with an accent dot (`Brand<span class="text-primary">.</span><span class="text-muted-foreground">app</span>`), plus an optional mark on a pastel disc inside a white pill. Never a stock placeholder logo, never a gradient logo.

## Multi-brand products
One token file per brand, swapped by a class on `<html>` (`.brand-acme`) that overrides only `--primary`, `--ring`, `--sidebar-primary` and (rarely) category hues. Everything else stays shared. Run the contrast script per brand.
