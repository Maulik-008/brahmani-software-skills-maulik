# App patterns (dashboards, tools, SaaS, internal software) [ext, built from core tokens]

Everything here is composed from the core recipes in components.md. The inbox example (`assets/examples/clinic-inbox-app.html`) implements the shell,
three-pane inbox, KPI dashboard, agent settings, reminders and plan screens. It passes axe in both themes at 375 and 1280 and is the worked reference.

## Principles for an app screen
- **Compressed ramp.** Titles up to about `text-2xl`, body 13 to 14px, meta 11 to 12px mono. Display type is for marketing.
- **Summary before detail.** Title + one primary action, then KPI row, then the main panel and a secondary rail.
- **Encode state in form, not just number**: a pill, a chip, a dot with a label. Severity stripes are pills, never coloured rows.
- **Content above the fold at 1280x720.** One compact toolbar row (tabs + search + sort + filters). Active-filter chips only when a filter is set.
- **Resting surfaces are `surface-1` with hairlines. No washes on utility widgets** (decision 7). Tints are for the few hero tiles.
- **Design every state**: loading (calm loader), empty (icon + line + one action), error (callout + retry), offline, locked/full, signed-out.
- **One filled button per view.** The page's primary action is `bg-cta`; everything else outline/ghost.
- **Secondary help lives behind a button** (a popover next to the control), not permanently on the page.
- **Numbers are real.** Show a designed empty state instead of invented data. Sample data in a prototype is labelled as such.

## Shell
```
[ sidebar 244px ] [ top bar 60px ........................... ]
[                 ] [ content (screen-specific)                ]
```
- Sidebar `bg-sidebar border-r border-sidebar-border`, pill items with a sliding `bg-tint-blue` indicator, a "Connected" or "Workspace" mono section, a footer card (tint-violet, watermark).
- Below `lg` the sidebar collapses to a **scrollable pill row** under the top bar (`overflow-x-auto scrollbar-hide`, sticky). Never a hamburger-only app.
- Page content `max-w-6xl` inside the content area (the shell itself may be fluid, see "Fluid shell" below).
- Routes: the address bar must follow the screen. In plain single-file artifacts use a bare `#token` hash per screen and open the one in `location.hash` on load.

### Fluid shell (deliberate deviation)
A three-pane layout cannot live inside `max-w-6xl` once a 244px rail is subtracted. The shell may be fluid; every other screen's content stays capped. Say so in the report.

## Dashboard
1. Title `text-2xl font-semibold tracking-tight` + mono meta line + one `bg-cta` action.
2. **KPI row** `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` of StatTiles, one hue each, count-up once.
3. **Main panel** (`lg:col-span-2`) = a chart card, **secondary rail** = a live queue/list card. Both `rounded-[24px] border border-border bg-surface-1 p-5`.
4. A closing row of **minimal tiles** (people, projects) in compact `rounded-[18px]` cards.
- Chart: see components.md "Chart". Under it, one sentence stating the finding in plain words ("Two thirds of the day's volume lands in three hours").
- Live queue rows: avatar chip, name, one-line context, and a **wait pill** (`bg-chip-amber/15 text-chip-amber-ink`) with a mono duration. Severity escalates amber to coral.
- Channel/category split: a labelled meter per item (label left, mono value right, `h-1.5` track), one hue each.

## Three-pane inbox / master-detail
```
[ list 340px ] [ thread (flex) ] [ details rail 300px, 2xl+ ]
```
- **List**: search (`rounded-[10px]`) + sort icon button, a **Segmented** filter (All, Waiting, Mine, AI), a filter-chip row only when active, then rows.
- **Row** `rounded-[18px] border p-3`: avatar with a channel badge, name + time (mono), one-line snippet (medium weight if unread), then state pill + unread count. Selected = `border-border bg-background`,
  others `border-transparent hover:bg-surface-2/70`. Stagger rows in at 40ms.
- **Thread**: header (avatar, name, mono meta, Assign / Escalate ghost buttons), a date chip `font-mono text-[10px] uppercase`, bubbles: inbound `rounded-[18px] rounded-tl-[6px] border bg-background`,
  agent/automated `bg-tint-violet` with an `AI AGENT` label pill, staff `bg-tint-teal`. Meta line under each bubble in mono. **Always show who sent it.**
- **System events** as a centred divider with a tint pill ("Handed to a person: reason"), never a chat bubble.
- **Action cards** inside the thread (e.g. a held slot): `rounded-[20px] border bg-background`, tint header band with a mono label and a live countdown, then the action buttons.
- **Composer**: quick-reply chips (`rounded-full border bg-surface-1 text-[11px]`), a `rounded-[12px]` textarea, the one `bg-cta` Send pill, and a mono guidance line with a shield icon.
- **Details rail**: stacked `rounded-[24px]` cards (identity, linked accounts, consent), the consent card a tint-emerald wash.
- Mobile: list above thread, no rail. Both scroll independently with `min-h-0`.

## Settings / agent configuration
Left sub-nav of pill items (or tabs), right content as **stacked `surface-1` cards**. Toggle rows are compact bordered rows (`rounded-[18px]`) with an icon, label and a switch.
Guardrail or policy blocks that must not be edited casually get a tint-coral wash with the rule list as `on-tint` pills and a sentence saying they are enforced in code.
A **sandbox** card ("Try it") previews behaviour without touching live data. Danger zone: `destructive` tokens + a confirm dialog.

## Scheduling / calendar
Time grid with hairline rows, mono time labels, events as `rounded-[14px]` tiles in the category tint (practitioner/room = the category), a "now" line in `primary`.
Slot pickers are a grid of `rounded-full` time pills (`outline`), selected = `bg-tint-blue text-chip-blue-ink ring-1 ring-primary/30`. A held/pending slot shows a live mono countdown.
Never colour an event by status and by category at once: category = tint, status = a pill.

## Kanban / boards
Columns `rounded-[24px] bg-surface-1 p-3`, header mono uppercase + count pill, cards `rounded-[18px] border border-border bg-background p-3` with a hue-coded icon chip, drag affordance via hover lift
(`-translate-y-0.5`), drop target = `ring-1 ring-primary/30`. Column colour is never a wash; the cards carry category chips.

## Lists, directories, feeds
- **List/directory**: one toolbar row, hero items as tinted showcase cards, the rest compact; designed empty state.
- **Feed**: single column `max-w-2xl`, composer card on top, post cards `rounded-[24px] border` with a hue-cycled avatar, category pill, action row with 14px icons. Widgets in a side rail as compact cards.
- **Detail / immersive**: back link instead of the full nav, one paper card as the focal object, compact action row, no footer.

## Billing / plans
Three plan cards: **one featured** (`rounded-[28px] bg-tint-blue`, watermark, the one `bg-cta`), two secondary (`surface-1`). Prices `font-mono text-3xl tabular-nums`; the unit in muted small text.
Feature rows with `Check` in `chip-emerald`. Usage meters above the plans with the real figure ("3,240 of 5,000"). A neutral note card for fees paid elsewhere.

## Onboarding / first run
Stepper + a single column card `max-w-xl`, one question per step, progress as a segmented strip in the six hues (decorative) plus text "Step 2 of 5". The step's action is the `bg-cta`.
First-run empty states carry the setup action. Never block on optional steps.

## AI / streaming surfaces
Starter-prompt chips instead of a blank box; streamed output in a `surface-1` panel with a blinking cursor and a shimmer block while drafting; reuse the live-state canvas tokens only if the live module is installed
(live-state.md). Escalation and "who answered" labels are always visible. Show what the AI can and cannot do, in the product, in plain words.

## Realtime and live
Breathing live dot + label; presence as an avatar stack with a count; "N active now" chip; new-item arrival as a pop-in (not a flash). Reconnect states are a quiet banner, never a modal.
