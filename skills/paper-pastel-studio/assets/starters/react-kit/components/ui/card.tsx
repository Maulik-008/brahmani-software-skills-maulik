import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/* Resting card = hairline border + surface-1. NO shadow at rest. Depth is border + surface step.
   Radius by weight: 18 compact, 20 default, 24 standard content, 28 featured/showcase. */
const radius = { compact: 'rounded-[18px]', default: 'rounded-[20px]', content: 'rounded-[24px]', featured: 'rounded-[28px]' } as const;

export function Card({
  className, size = 'content', hover = false, ...props
}: HTMLAttributes<HTMLDivElement> & { size?: keyof typeof radius; hover?: boolean }) {
  return (
    <div
      className={cn(
        'border border-border bg-surface-1 text-card-foreground',
        radius[size],
        hover && 'transition-transform duration-300 hover:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  );
}
