'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from './theme';

/** Renders a same-size placeholder until mounted so server and client markup match (no hydration warning). */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-foreground/70 transition-colors after:absolute after:-inset-1 after:content-[""] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {mounted ? (
        isDark ? <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} /> : <Moon className="h-[17px] w-[17px]" strokeWidth={1.75} />
      ) : (
        <span className="h-[17px] w-[17px]" />
      )}
    </button>
  );
}
