'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* Zero-dependency theme provider. (The no-flash <head> script lives in ./theme-script.ts: it must NOT be in a 'use client' file,
   because a server layout calls it.) Same API shape as next-themes' useTheme, so you can swap it.
   Strategy: a `dark` class on <html>. Light is the default (the identity is white-first);
   dark is a deliberate user choice. Set enableSystem to follow the OS instead. */
type Theme = 'light' | 'dark';

/* Switching theme must not animate every colour at once: turn transitions off, flush styles,
   and restore after two animation frames (craft/motion.md section 13). */
function withoutTransitions(apply: () => void) {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode('*,*::before,*::after{transition:none !important}'));
  document.head.appendChild(style);
  apply();
  void window.getComputedStyle(document.documentElement).opacity; // force a style flush
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}
type Ctx = { theme: Theme; resolvedTheme: Theme; setTheme: (t: Theme) => void };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({
  children, storageKey = 'pp-theme', defaultTheme = 'light', enableSystem = false,
}: { children: ReactNode; storageKey?: string; defaultTheme?: Theme; enableSystem?: boolean }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    let t: Theme = defaultTheme;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') t = saved;
      else if (enableSystem && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
    } catch { /* storage blocked: stay on default */ }
    setThemeState(t);
  }, [storageKey, defaultTheme, enableSystem]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    withoutTransitions(() => {
      document.documentElement.classList.toggle('dark', t === 'dark');
      document.documentElement.style.colorScheme = t;
    });
    try { localStorage.setItem(storageKey, t); } catch { /* ignore */ }
  }, [storageKey]);

  const value = useMemo(() => ({ theme, resolvedTheme: theme, setTheme }), [theme, setTheme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
