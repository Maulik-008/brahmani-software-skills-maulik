/* Paper & Pastel: Tailwind 3 preset.
   Use:  import paperPastel from './paper-pastel.preset'
         export default { presets: [paperPastel], darkMode: 'class', content: [...] }
   Differences from the owner's tailwind.v3.extend.ts: every colour carries
   <alpha-value> so /10 /35 /70 modifiers always work; adds the optional AA-safe
   text colours (text-chip-blue-ink, text-warning-ink; needs a11y-text.css); adds
   canvas/session colours only if you also paste the live-state module. */
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const c = (v: string) => `hsl(var(--${v}) / <alpha-value>)`;

const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        border: c('border'), input: c('input'), ring: c('ring'),
        background: c('background'), foreground: c('foreground'),
        primary: { DEFAULT: c('primary'), foreground: c('primary-foreground') },
        secondary: { DEFAULT: c('secondary'), foreground: c('secondary-foreground') },
        destructive: { DEFAULT: c('destructive'), foreground: c('destructive-foreground'), ink: c('destructive-ink') },
        muted: { DEFAULT: c('muted'), foreground: c('muted-foreground') },
        accent: { DEFAULT: c('accent'), foreground: c('accent-foreground') },
        success: { DEFAULT: c('success'), foreground: c('success-foreground'), ink: c('success-ink') },
        warning: { DEFAULT: c('warning'), foreground: c('warning-foreground'), ink: c('warning-ink') },
        popover: { DEFAULT: c('popover'), foreground: c('popover-foreground') },
        card: { DEFAULT: c('card'), foreground: c('card-foreground') },
        surface: { 0: c('surface-0'), 1: c('surface-1'), 2: c('surface-2'), 3: c('surface-3'), 4: c('surface-4'), 5: c('surface-5') },
        // category colours: text-chip-violet, bg-chip-violet/10, border-chip-violet/35
        // *-ink = AA-safe text variants (opt in with a11y-text.css)
        chip: {
          blue: c('accent-blue'), violet: c('accent-violet'), emerald: c('accent-emerald'),
          coral: c('accent-coral'), amber: c('accent-amber'), teal: c('accent-teal'),
          'blue-ink': c('chip-blue-ink'), 'violet-ink': c('chip-violet-ink'), 'emerald-ink': c('chip-emerald-ink'),
          'coral-ink': c('chip-coral-ink'), 'amber-ink': c('chip-amber-ink'), 'teal-ink': c('chip-teal-ink'),
        },
        tint: {
          blue: c('tint-blue'), violet: c('tint-violet'), emerald: c('tint-emerald'),
          coral: c('tint-coral'), amber: c('tint-amber'), teal: c('tint-teal'), cream: c('tint-cream'),
        },
        cta: { DEFAULT: c('cta'), foreground: c('cta-foreground') },
        sidebar: {
          DEFAULT: c('sidebar-background'), foreground: c('sidebar-foreground'),
          primary: c('sidebar-primary'), 'primary-foreground': c('sidebar-primary-foreground'),
          accent: c('sidebar-accent'), 'accent-foreground': c('sidebar-accent-foreground'),
          border: c('sidebar-border'), ring: c('sidebar-ring'),
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-sm': ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        display: ['3.5rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display-xl': ['5.5rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        breathe: { '0%, 100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.45', transform: 'scale(0.82)' } },
        rise: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        breathe: 'breathe 2.2s ease-in-out infinite',
        rise: 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'rise-delayed': 'rise 0.3s cubic-bezier(0.22,1,0.36,1) 0.28s forwards',
      },
    },
  },
  plugins: [
    // chip sitting ON a tint wash: white/70 in light, black/20 in dark. Token-driven, so no dark: variant on every use.
    plugin(({ addComponents }) => {
      addComponents({
        '.on-tint': { background: 'hsl(0 0% 100% / 0.7)' },
        '.dark .on-tint, [data-theme="dark"] .on-tint': { background: 'hsl(0 0% 0% / 0.2)' },
      });
    }),
  ],
} satisfies Config;

export default preset;
