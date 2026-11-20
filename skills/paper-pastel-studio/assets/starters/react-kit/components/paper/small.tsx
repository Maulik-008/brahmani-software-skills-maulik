import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { chipInk, tint, type Hue } from '../../lib/palette';

/** Initials avatar in a cycled pastel. `presence` adds the one sanctioned raw-palette dot (live / available). */
export function Avatar({
  initials, hue, size = 36, presence, className,
}: { initials: string; hue: Hue; size?: 28 | 36 | 44 | 56; presence?: boolean; className?: string }) {
  const dims = { 28: 'h-7 w-7 text-[10px]', 36: 'h-9 w-9 text-[11px]', 44: 'h-11 w-11 text-sm', 56: 'h-14 w-14 text-base' } as const;
  return (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center rounded-full font-mono font-semibold', dims[size], tint[hue], chipInk[hue], className)}>
      {initials}
      {presence && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" aria-label="online" />}
    </span>
  );
}

/** Tag / pill. neutral = hairline on canvas. tint = on a tint wash (white/70, dark black/20). mono for tech/meta tags. */
export function Pill({
  children, on = 'canvas', mono = false, className,
}: { children: ReactNode; on?: 'canvas' | 'tint'; mono?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide text-foreground/85',
        on === 'canvas' ? 'border border-border bg-surface-2' : 'on-tint',
        mono && 'font-mono',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Breathing dot for anything live. Pair it with a label: colour is never the only signal. */
export function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn('inline-block h-2 w-2 animate-breathe rounded-full bg-primary', className)} />;
}
