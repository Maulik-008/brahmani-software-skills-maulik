import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { chipInk, tint, type Hue } from '../../lib/palette';

/* Eyebrow = the small label above a headline.
   chip  : sentence case, above a hero H1 or on a card
   mono  : uppercase mono, above a section H2
   Text uses the -ink variant so it stays AA on the tint (falls back to the chip colour if a11y-text.css is not loaded). */
export function Eyebrow({
  hue = 'blue', variant = 'mono', icon, children, className,
}: { hue?: Hue; variant?: 'chip' | 'mono'; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5',
        tint[hue], chipInk[hue],
        variant === 'mono' ? 'font-mono text-xs font-medium uppercase tracking-[0.14em]' : 'text-xs font-semibold',
        className,
      )}
    >
      {icon && <span className="[&_svg]:h-3 [&_svg]:w-3">{icon}</span>}
      {children}
    </span>
  );
}
