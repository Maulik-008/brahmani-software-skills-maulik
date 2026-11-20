import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

/* Status is its own axis (success / warning / destructive / info=primary). It is never a category colour.
   Static maps on purpose: Tailwind must see every class name as a complete string. */
const tones = {
  info:    { wrap: 'border-primary/20 bg-primary/[0.05]',         box: 'border-primary/20 bg-primary/10',         ink: 'text-primary',     label: 'Note',    Icon: Info },
  warning: { wrap: 'border-warning/25 bg-warning/[0.06]',         box: 'border-warning/25 bg-warning/10',         ink: 'text-warning-ink', label: 'Heads up', Icon: AlertTriangle },
  tip:     { wrap: 'border-success/20 bg-success/[0.05]',         box: 'border-success/20 bg-success/10',         ink: 'text-success-ink',     label: 'Tip',     Icon: CheckCircle2 },
  danger:  { wrap: 'border-destructive/20 bg-destructive/[0.05]', box: 'border-destructive/20 bg-destructive/10', ink: 'text-destructive-ink', label: 'Careful', Icon: OctagonAlert },
} as const;

export function Callout({
  tone = 'info', title, children, className,
}: { tone?: keyof typeof tones; title?: string; children: ReactNode; className?: string }) {
  const t = tones[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'note'} className={cn('flex gap-3.5 rounded-[20px] border p-4', t.wrap, className)}>
      <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border', t.box)}>
        <t.Icon className={cn('h-4 w-4', t.ink)} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <span className={cn('mb-1 block font-mono text-xs font-semibold uppercase tracking-wider', t.ink)}>{title ?? t.label}</span>
        <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
      </div>
    </div>
  );
}
