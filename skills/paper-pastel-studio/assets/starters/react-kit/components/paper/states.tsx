import type { ComponentType, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/** Empty state: icon in a circle, one friendly line, ONE action (the view's single bg-cta lives here if nothing else on the view has it). */
export function EmptyState({
  icon: Icon, title, description, action, className,
}: { icon: Icon; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-6 py-14 text-center', className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
        <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-[260px] text-xs leading-relaxed text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

/** Skeleton mirrors the real component's chrome. Use only for lists that reliably take long; otherwise prefer the calm loader. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-[10px] bg-surface-3', className)} />;
}

/** Calm loader: invisible for ~280ms, then a small spinner with a short mono label. Height reserved so nothing jumps. */
export function CalmLoader({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn('flex min-h-[96px] items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground opacity-0 animate-rise-delayed', className)}>
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden />
      {label}
    </div>
  );
}
