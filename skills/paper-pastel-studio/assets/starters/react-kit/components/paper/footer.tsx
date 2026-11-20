import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Hue } from '../../lib/palette';
import { chipInk, tint } from '../../lib/palette';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/** The closing CTA card: a rounded-[28px] tint wash with a watermark, one eyebrow, one headline, one bg-cta pill. */
export function FooterCta({
  hue = 'blue', watermark: Watermark, eyebrow, title, action,
}: { hue?: Hue; watermark: Icon; eyebrow: string; title: string; action: { label: string; href: string } }) {
  return (
    <div className={cn('relative mb-14 overflow-hidden rounded-[28px] px-6 py-8 sm:px-10 sm:py-10', tint[hue])}>
      <Watermark className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 text-foreground/[0.06] sm:h-48 sm:w-48" strokeWidth={1} />
      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className={cn('mb-1.5 text-[11px] font-semibold uppercase tracking-widest', chipInk[hue])}>{eyebrow}</p>
          <h3 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3>
        </div>
        <a href={action.href} className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta/90 active:scale-[0.98]">
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
        </a>
      </div>
    </div>
  );
}

/** surface-1 band with a 3% dot grid. Children = CTA card, then columns, then the mono bottom bar. */
export function Footer({ children, bottom }: { children: ReactNode; bottom: ReactNode }) {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface-1">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {children}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row">{bottom}</div>
      </div>
    </footer>
  );
}
