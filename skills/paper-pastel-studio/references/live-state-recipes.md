# Live-state component recipes (optional module)

Copy-paste class strings for every pattern the base `component-recipes.md`
doesn't cover. Assumes `tokens-focus.css` + `tailwind-focus.extend.ts` are
installed, and `cn()` / `lucide-react` are available as in the base recipes.

The 6 category colours (`blue violet emerald coral amber teal`) and the 5
session colours (`focus break longbreak paused overtime`) are **different
axes** — see FOCUS_EDITION.md §3. Never substitute one for the other.

---

## 1. Timer display + progress ring (Focus Canvas)

```tsx
<div className="relative flex flex-col items-center overflow-hidden rounded-[28px] bg-canvas-surface p-8 sm:p-10">
  <div
    className="pointer-events-none absolute -inset-10 canvas-bloom"
    style={{ background: `radial-gradient(circle at 50% 42%, hsl(var(--canvas-${state})/.2), transparent 60%)` }}
  />
  <div className="relative">
    <svg viewBox="0 0 240 240" className="h-56 w-56 -rotate-90 sm:h-64 sm:w-64">
      <circle cx="120" cy="120" r="108" fill="none" stroke="hsl(var(--canvas-line))" strokeWidth="8" />
      <circle
        cx="120" cy="120" r="108" fill="none"
        stroke={`hsl(var(--canvas-${state}))`}
        strokeWidth="8" strokeLinecap="round"
        strokeDasharray={678.58}
        strokeDashoffset={678.58 * (1 - progress)}
        className="ring-progress"
      />
    </svg>
    <div className="absolute inset-0 grid place-content-center text-center">
      <span className={cn("eyebrow", `text-canvas-${state}`)}>{stateLabel}</span>
      <span className="mt-1 font-mono text-6xl font-medium tabular-nums text-canvas-fg sm:text-7xl">
        {formatTime(remaining)}
      </span>
      <span className="mt-1 text-xs text-canvas-muted">{contextLabel}</span>
    </div>
  </div>
</div>
```

**Segmented variant** (Pomodoro 4-block cycle) — same SVG, but draw 4 arcs with
small gaps instead of one continuous stroke; the current block is
`stroke: hsl(var(--canvas-focus))`, completed blocks are
`hsl(var(--canvas-focus)/.35)`, upcoming are `hsl(var(--canvas-line))`.

**Indeterminate variant** (open stopwatch) — a short arc
(`strokeDasharray="45 231"`) with a CSS `rotate` animation, same stroke colour;
respects `prefers-reduced-motion` by freezing rotation and letting only the
digits update.

---

## 2. Session control bar (transport)

```tsx
<div className="relative mt-8 flex items-center gap-3 rounded-full border border-canvas-line bg-canvas-bg p-1.5">
  <button
    className="grid h-12 w-12 place-items-center rounded-full text-canvas-bg"
    style={{ background: `hsl(var(--canvas-${state}))` }}
    aria-label={isRunning ? "Pause" : "Start"}
  >
    {isRunning ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
  </button>
  <button className="grid h-10 w-10 place-items-center rounded-full text-canvas-fg" aria-label="Reset">
    <RotateCcw className="h-[18px] w-[18px]" strokeWidth={1.75} />
  </button>
  <button className="grid h-10 w-10 place-items-center rounded-full text-canvas-fg" aria-label="Skip">
    <SkipForward className="h-[18px] w-[18px]" strokeWidth={1.75} />
  </button>
</div>
```

**Chrome variant** (mini-player / session bar outside the canvas, on white):

```tsx
<div className="flex items-center gap-3 rounded-full border border-border bg-surface-1 p-2">
  <button className={cn("grid h-11 w-11 place-items-center rounded-full text-white", `bg-session-${state}`)} aria-label="Pause">
    <Pause className="h-5 w-5" fill="currentColor" />
  </button>
  <div className="min-w-0 flex-1">
    <p className="truncate text-sm font-semibold">{label} · {formatTime(total)}</p>
    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-3">
      <div className={cn("h-full rounded-full", `bg-session-${state}`)} style={{ width: `${progress * 100}%` }} />
    </div>
  </div>
  <span className="font-mono text-sm tabular-nums text-muted-foreground">{formatTime(remaining)}</span>
</div>
```

---

## 3. Session pill (status, not a button)

```tsx
<span className={cn(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
  `bg-session-${state}-wash text-session-${state}`
)}>
  {state === "paused" ? <Pause className="h-3 w-3" strokeWidth={2.5} />
    : state === "overtime" ? null
    : <span className={cn("h-1.5 w-1.5 rounded-full live-dot", `bg-session-${state}`)} />}
  {state === "overtime" ? `+${formatTime(over)} over` : stateLabel}
</span>
```

---

## 4. Streak calendar (pastel, not GitHub-green)

```tsx
<div className="flex flex-wrap gap-1">
  {days.map((d) => (
    <span
      key={d.date}
      className={cn(
        "h-3 w-3 rounded-[4px]",
        d.level === 0 ? "bg-surface-3" :
        d.level === 1 ? "bg-chip-emerald/25" :
        d.level === 2 ? "bg-chip-emerald/50" : "bg-chip-emerald/80",
        d.isToday && "ring-2 ring-primary"
      )}
    />
  ))}
</div>
```

**Week-ring variant** (preferred for a profile header): an
SVG ring with 7 arc segments, filled count in `session-break`, centre label
`"5 / 7 days"` + a one-line next action, per PAGE_TEMPLATES.md.

---

## 5. Leaderboard row

```tsx
<div className={cn("flex items-center gap-3 px-4 py-3", rank === 1 && "bg-tint-amber/60")}>
  <span className={cn("w-5 text-center font-mono text-sm font-semibold",
    rank === 1 ? "text-chip-amber" : "text-muted-foreground")}>{rank}</span>
  <span className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold", `bg-chip-${categoryColor}/15 text-chip-${categoryColor}`)}>
    {initials}
  </span>
  <span className="flex-1 truncate text-sm font-medium">{name}</span>
  {delta !== 0 && (
    <span className={cn("inline-flex items-center gap-0.5 font-mono text-[11px]",
      delta > 0 ? "text-session-break" : "text-session-overtime")}>
      {delta > 0 ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : <ArrowDown className="h-3 w-3" strokeWidth={2.5} />}
      {Math.abs(delta)}
    </span>
  )}
  <span className="font-mono text-sm tabular-nums">{formatDuration(total)}</span>
</div>
```

Your own row gets `bg-primary/[0.04]`, never a category tint (it isn't a
category — it's "you").

---

## 6. Badge tile (earned / in progress / locked)

```tsx
// earned
<div className={cn("flex flex-col items-center rounded-[16px] border border-border p-4 text-center", `bg-tint-${c}`)}>
  <span className="grid h-11 w-11 place-items-center rounded-full bg-white/70 dark:bg-black/20">
    <Icon className={cn("h-5 w-5", `text-chip-${c}`)} strokeWidth={1.75} />
  </span>
  <p className="mt-2 text-xs font-semibold">{badge.title}</p>
  <p className="text-[10px] text-foreground/60">{badge.caption}</p>
</div>

// in progress
<div className="flex flex-col items-center rounded-[16px] border border-border bg-surface-1 p-4 text-center">
  <span className={cn("grid h-11 w-11 place-items-center rounded-full", `bg-chip-${c}/10`)}>
    <Icon className={cn("h-5 w-5", `text-chip-${c}`)} strokeWidth={1.75} />
  </span>
  <p className="mt-2 text-xs font-semibold">{badge.title}</p>
  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-3">
    <div className={cn("h-full rounded-full", `bg-chip-${c}`)} style={{ width: `${pct}%` }} />
  </div>
  <p className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground">{current} / {target}</p>
</div>

// locked
<div className="flex flex-col items-center rounded-[16px] border border-dashed border-border bg-surface-1 p-4 text-center opacity-55">
  <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-3">
    <Lock className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
  </span>
  <p className="mt-2 text-xs font-semibold">{badge.title}</p>
  <p className="text-[10px] text-muted-foreground">{badge.caption}</p>
</div>
```

---

## 7. KPI / stat tile

```tsx
<div className="rounded-[16px] border border-border bg-surface-1 p-4">
  <span className={cn("grid h-8 w-8 place-items-center rounded-full", `bg-chip-${c}/10`)}>
    <Icon className={cn("h-4 w-4", `text-chip-${c}`)} strokeWidth={1.75} />
  </span>
  <p className="mt-3 font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
  <p className="text-xs text-muted-foreground">{label}</p>
</div>
```

Category colour here is cycled per tile, purely decorative-organisational
(not a status) — never a session colour.

---

## 8. Study-room card ("live" card family)

```tsx
<Link href={`/rooms/${slug}`} className={cn("overflow-hidden rounded-[22px] border border-border", `bg-tint-${c}`)}>
  <div className="p-5">
    <div className="flex items-center gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full live-dot", `bg-session-${state}`)} />
      <span className="eyebrow text-foreground/60">{stateLabel}</span>
    </div>
    <h3 className="mt-1.5 text-lg font-semibold tracking-tight">{room.name}</h3>
    <p className="mt-0.5 text-xs text-foreground/60">{room.format}</p>
  </div>
  <div className="flex items-center justify-between border-t border-foreground/10 px-5 py-3">
    <div className="flex -space-x-2">
      {room.avatars.slice(0, 3).map((a) => (
        <span key={a.id} className={cn("grid h-7 w-7 place-items-center rounded-full bg-white/80 text-[10px] font-semibold ring-2 dark:bg-black/40", `text-chip-${a.color} ring-tint-${c}`)}>
          {a.initials}
        </span>
      ))}
      {room.overflow > 0 && <span className="grid h-7 w-7 place-items-center rounded-full bg-white/80 text-[10px] font-semibold text-foreground/60 ring-2 ring-tint-{c} dark:bg-black/40">+{room.overflow}</span>}
    </div>
    <span className="rounded-full bg-cta px-3 py-1 text-[11px] font-semibold text-cta-foreground">Join</span>
  </div>
</Link>
```

The card carries **both** axes at once: `bg-tint-{c}` (category — which
room/subject) and the live dot in `session-{state}` (what's happening now).

---

## 9. AI tool card + AI chat surface

Tool grid card (chrome, white):

```tsx
<Link href={`/tools/${tool.slug}`} className={cn("rounded-[20px] border border-border bg-surface-1 p-4 hover:border-chip-{c}/35")}>
  <span className={cn("grid h-10 w-10 place-items-center rounded-full", `bg-chip-${c}/10`)}>
    <Icon className={cn("h-4 w-4", `text-chip-${c}`)} strokeWidth={1.75} />
  </span>
  <h3 className="mt-3 text-sm font-semibold">{tool.name}</h3>
  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tool.blurb}</p>
  <span className="mt-2 inline-block rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{tool.creditCost}</span>
</Link>
```

Chat / streaming surface (dark, reuses Focus Canvas tokens — see
FOCUS_EDITION.md §2):

```tsx
<div className="rounded-[24px] border border-canvas-line bg-canvas-surface/80 p-5 backdrop-blur-xl">
  {/* user bubble */}
  <div className="flex justify-end">
    <div className="max-w-md rounded-[16px] rounded-tr-[6px] bg-canvas-focus/15 px-4 py-2.5 text-sm text-canvas-fg">{userMessage}</div>
  </div>
  {/* streaming AI reply */}
  <div className="mt-3 flex items-start gap-2.5">
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas-focus/20">
      <Bot className="h-3.5 w-3.5 text-canvas-focus" />
    </span>
    <div className="max-w-lg rounded-[16px] rounded-tl-[6px] bg-canvas-surface px-4 py-2.5 text-sm leading-relaxed text-canvas-fg">
      {streamedText}{isStreaming && <span className="cursor-blink">▍</span>}
    </div>
  </div>
  {/* generating skeleton — shown instead of a spinner while waiting */}
  {isGenerating && <div className="mt-3 h-4 w-40 rounded-full shimmer" />}
</div>
```

Starter-prompt chips for the empty state (never a blank input alone):

```tsx
<div className="flex flex-wrap gap-2">
  {starters.map((s) => (
    <button key={s} className="rounded-full bg-canvas-surface/70 px-3 py-1.5 text-xs text-canvas-muted backdrop-blur-xl">{s}</button>
  ))}
</div>
```

Add `.cursor-blink { animation: blink 1s step-end infinite; }` and
`.shimmer { background: linear-gradient(90deg, hsl(var(--canvas-surface)) 20%, hsl(var(--canvas-line)) 45%, hsl(var(--canvas-surface)) 70%); background-size:200% 100%; animation: shimmer 1.5s linear infinite; }`
to your global stylesheet if not already present.

---

## 10. StudyFeed post card

```tsx
<article className="rounded-[20px] border border-border bg-background p-5">
  <div className="flex items-start gap-3">
    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold", `bg-chip-${authorColor}/15 text-chip-${authorColor}`)}>{initials}</span>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold">{author}</span>
        {isBot && <span className="rounded bg-chip-teal/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-chip-teal">AI</span>}
        <span className="text-muted-foreground">· {timeAgo}</span>
        <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium", `bg-chip-${category.color}/10 text-chip-${category.color}`)}>{category.label}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{content}</p>
      <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" strokeWidth={1.75} /> {likes}</span>
        <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} /> {comments}</span>
        <span className="flex items-center gap-1.5"><Repeat2 className="h-3.5 w-3.5" strokeWidth={1.75} /> {reshares}</span>
        <Bookmark className="ml-auto h-3.5 w-3.5" strokeWidth={1.75} />
      </div>
    </div>
  </div>
</article>
```

Matches the real `PostCard.tsx` shape (Heart/MessageCircle/Repeat2/Bookmark,
`CATEGORY_CONFIG`, a bot badge) — this recipe reskins it, it doesn't
restructure its data.

---

## 11. Command palette (⌘K, DECISIONS.md #18)

```tsx
<div className="overflow-hidden rounded-[20px] border border-border bg-background" style={{ boxShadow: "0 24px 60px -24px hsl(var(--shadow-color)/.5)" }}>
  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
    <Search className="h-4 w-4 text-muted-foreground" />
    <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Jump to a timer, room or tool…" />
    <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">esc</span>
  </div>
  <div className="p-2 text-sm">
    {results.map((r) => (
      <div key={r.id} className={cn("flex items-center gap-2.5 rounded-[10px] px-3 py-2", r.active ? "bg-surface-2" : "text-muted-foreground hover:bg-surface-2/60")}>
        <r.icon className={cn("h-3.5 w-3.5", `text-chip-${r.color}`)} />
        {r.label}
        {r.active && <span className="ml-auto font-mono text-[10px] text-muted-foreground">↵</span>}
      </div>
    ))}
  </div>
</div>
```
