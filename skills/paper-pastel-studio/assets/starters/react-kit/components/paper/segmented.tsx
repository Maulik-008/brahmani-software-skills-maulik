'use client';
import { useId } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/** Pill tab switcher with a sliding tinted indicator. One per toolbar. Roving focus via native buttons + aria-pressed. */
export function Segmented<T extends string>({
  options, value, onChange, label, className,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; className?: string }) {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <div role="group" aria-label={label} className={cn('relative flex rounded-full border border-border bg-surface-1 p-0.5', className)}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={cn(
                'relative z-10 flex-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                on ? 'text-chip-blue-ink' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {on && (
                <motion.span layoutId="seg-ind" className="absolute inset-0 -z-10 rounded-full bg-tint-blue" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />
              )}
              {o.label}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
