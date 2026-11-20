/* =============================================================================
   PAPER & PASTEL — tailwind.config.ts `theme.extend` snippet
   Merge this into your existing config. Requires `darkMode: 'class'` and the
   token CSS from tokens.css. Pairs with `tailwindcss-animate`.
   ============================================================================= */
import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Surface elevation ramp (one hue, lightness steps).
        surface: {
          0: 'hsl(var(--surface-0))',
          1: 'hsl(var(--surface-1))',
          2: 'hsl(var(--surface-2))',
          3: 'hsl(var(--surface-3))',
          4: 'hsl(var(--surface-4))',
          5: 'hsl(var(--surface-5))',
        },

        // Curated multi-colour accent set — category coding only. Glyph + chip
        // tint. Access as text-chip-blue / bg-chip-violet/10 / border-chip-teal/35.
        chip: {
          blue: 'hsl(var(--accent-blue))',
          violet: 'hsl(var(--accent-violet))',
          emerald: 'hsl(var(--accent-emerald))',
          coral: 'hsl(var(--accent-coral))',
          amber: 'hsl(var(--accent-amber))',
          teal: 'hsl(var(--accent-teal))',
        },

        // Pastel tint washes — full-surface card / band / eyebrow-chip fills.
        tint: {
          blue: 'hsl(var(--tint-blue))',
          violet: 'hsl(var(--tint-violet))',
          emerald: 'hsl(var(--tint-emerald))',
          coral: 'hsl(var(--tint-coral))',
          amber: 'hsl(var(--tint-amber))',
          teal: 'hsl(var(--tint-teal))',
          cream: 'hsl(var(--tint-cream))',
        },

        // Ink/Paper — the ONLY filled-CTA colour.
        cta: {
          DEFAULT: 'hsl(var(--cta))',
          foreground: 'hsl(var(--cta-foreground))',
        },

        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },

      // Oversized, tight-tracking display scale — hero + section headlines only.
      // "Typographic confidence": big, dark, and calm rather than decorated.
      fontSize: {
        'display-sm': ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        display:      ['3.5rem',  { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['4.5rem',  { lineHeight: '1',    letterSpacing: '-0.04em' }],
        'display-xl': ['5.5rem',  { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      },

      borderRadius: {
        lg: 'var(--radius)',                 // 20px
        md: 'calc(var(--radius) - 2px)',     // 18px
        sm: 'calc(var(--radius) - 4px)',     // 16px
      },

      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'gradient-shift': { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
