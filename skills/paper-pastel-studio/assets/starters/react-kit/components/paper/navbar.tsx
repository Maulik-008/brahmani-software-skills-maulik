'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../theme-toggle';

export type NavItem = { href: string; label: string };

/* Floating glass pill, max-w-5xl. Two-state on scroll (>50px: tighter + tinted shadow).
   Active item = sliding tint-blue indicator (layoutId). Right side: ThemeToggle + exactly ONE bg-cta action.
   Mobile: a glass rounded-[20px] sheet, not a full-screen overlay. The ONLY place backdrop blur is allowed (plus that sheet). */
export function Navbar({
  brand, items, activeHref, action,
}: { brand: ReactNode; items: NavItem[]; activeHref?: string; action: { label: string; href: string } }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary"
        className={cn(
          'glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-3 transition-[padding,box-shadow] duration-300 sm:px-4',
          scrolled ? 'py-2 shadow-[0_8px_28px_-8px_hsl(var(--shadow-color)/0.35)]' : 'py-2.5',
        )}
      >
        <a href="/" className="flex items-center gap-2.5 font-mono text-[15px] font-semibold tracking-tight text-foreground">{brand}</a>

        <LayoutGroup id="nav">
          <div className="hidden items-center gap-0.5 md:flex">
            {items.map((it) => {
              const on = it.href === activeHref;
              return (
                <a key={it.href} href={it.href} aria-current={on ? 'page' : undefined}
                  className={cn('relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200', on ? 'text-chip-blue-ink' : 'text-muted-foreground hover:bg-surface-2/70 hover:text-foreground')}>
                  {on && (reduce
                    ? <span className="absolute inset-0 rounded-full bg-tint-blue" />
                    : <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-tint-blue" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />)}
                  <span className="relative z-10">{it.label}</span>
                </a>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={action.href} className="hidden items-center gap-1.5 rounded-full bg-cta px-5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta/90 active:scale-[0.98] md:inline-flex">
            {action.label}
          </a>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-1 after:absolute after:-inset-1 after:content-[''] md:hidden">
            {open ? <X className="h-[17px] w-[17px]" strokeWidth={1.75} /> : <Menu className="h-[17px] w-[17px]" strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-5xl overflow-hidden rounded-[20px] p-2 shadow-[0_16px_40px_-12px_hsl(var(--shadow-color)/0.4)] md:hidden">
          {items.map((it) => (
            <a key={it.href} href={it.href} onClick={() => setOpen(false)}
              className={cn('block rounded-full px-4 py-3 text-sm font-medium', it.href === activeHref ? 'bg-tint-blue text-chip-blue-ink' : 'text-muted-foreground hover:bg-surface-2/70')}>
              {it.label}
            </a>
          ))}
          <a href={action.href} className="mt-1 flex items-center justify-center rounded-full bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground">{action.label}</a>
        </div>
      )}
    </header>
  );
}
