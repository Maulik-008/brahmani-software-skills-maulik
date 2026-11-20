import type { ComponentType } from 'react';
import { cn } from '../../lib/utils';
import { chipBorderHover, chipFill, chipText, type Hue } from '../../lib/palette';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/* SECONDARY tile: compact, neutral surface, icon in a tinted circle, hover border takes the category colour. */
export function ListCard({
  hue, icon: Icon, title, description, href, className,
}: { hue: Hue; icon: Icon; title: string; description: string; href?: string; className?: string }) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        'group flex items-start gap-3.5 rounded-[18px] border border-border bg-surface-1 p-4 transition-colors duration-300',
        chipBorderHover[hue], className,
      )}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300', chipFill[hue])}>
        <Icon className={cn('h-4 w-4', chipText[hue])} strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-snug text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
      </span>
    </Tag>
  );
}

/* MINIMAL tile: plain surface, one title, one link. The quiet third family. */
export function MinimalCard({
  title, description, href, linkLabel = 'Read more', className,
}: { title: string; description: string; href: string; linkLabel?: string; className?: string }) {
  return (
    <div className={cn('rounded-[18px] border border-border p-5', className)}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      <a href={href} className="mt-3 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline">{linkLabel}</a>
    </div>
  );
}
