/* =============================================================================
   LIVE-STATE MODULE (optional) — tailwind.config.ts theme.extend addition
   Merge these keys into the existing `colors` block (which already has
   border/background/foreground/primary/surface/chip/tint/cta from the base
   base tailwind.extend.ts). Do not replace the existing
   `primary` mapping — it already reads `hsl(var(--primary))`, and
   tokens-focus.css is what changes --primary's value, not this file.
   ============================================================================= */
colors: {
  // ...existing border/background/foreground/primary/secondary/muted/
  // accent/success/warning/popover/card/surface/chip/tint/cta/sidebar...

  // NEW — session-state axis (Focus Edition). Access as
  // text-session-focus / bg-session-break-wash / border-session-paused etc.
  session: {
    focus: 'hsl(var(--session-focus))',
    'focus-wash': 'hsl(var(--session-focus-wash))',
    break: 'hsl(var(--session-break))',
    'break-wash': 'hsl(var(--session-break-wash))',
    longbreak: 'hsl(var(--session-longbreak))',
    'longbreak-wash': 'hsl(var(--session-longbreak-wash))',
    paused: 'hsl(var(--session-paused))',
    'paused-wash': 'hsl(var(--session-paused-wash))',
    overtime: 'hsl(var(--session-overtime))',
    'overtime-wash': 'hsl(var(--session-overtime-wash))',
  },

  // NEW — Focus Canvas (Focus Edition). Theme-independent: these tokens are
  // never redeclared under .dark, so bg-canvas-bg etc. look the same in both
  // toggle states, by design. Access as bg-canvas-bg / text-canvas-fg /
  // border-canvas-line / text-canvas-focus etc.
  canvas: {
    bg: 'hsl(var(--canvas-bg))',
    surface: 'hsl(var(--canvas-surface))',
    line: 'hsl(var(--canvas-line))',
    fg: 'hsl(var(--canvas-fg))',
    muted: 'hsl(var(--canvas-muted))',
    focus: 'hsl(var(--canvas-focus))',
    break: 'hsl(var(--canvas-break))',
    longbreak: 'hsl(var(--canvas-longbreak))',
    paused: 'hsl(var(--canvas-paused))',
    overtime: 'hsl(var(--canvas-overtime))',
  },
},

/* Opacity modifiers (bg-session-focus/10, text-canvas-focus/70, etc.) work
   automatically once the values above are the bare `hsl(var(--x))` form —
   Tailwind rewrites them to `hsl(var(--x) / <alpha-value>)` under the hood
   for any color that isn't already using the object DEFAULT/foreground shape,
   same as the base system's chip/tint groups. No extra config needed. */

/* keyframes / animation — merge into the existing keyframes/animation blocks
   (which already have accordion-down/up, marquee, float, gradient-shift). */
keyframes: {
  'canvas-bloom': {
    '0%, 100%': { opacity: '0.5' },
    '50%': { opacity: '0.85' },
  },
  'live-dot-pulse': {
    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
    '50%': { opacity: '0.5', transform: 'scale(0.8)' },
  },
},
animation: {
  'canvas-bloom': 'canvas-bloom 5s ease-in-out infinite',
  'live-dot-pulse': 'live-dot-pulse 2.2s ease-in-out infinite',
},
