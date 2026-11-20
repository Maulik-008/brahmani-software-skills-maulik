import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { Hue } from '../../lib/palette';
import { Eyebrow } from './eyebrow';
import { Reveal } from './reveal';

/** Container ladder: 5xl (nav, contact, hero bento) / 6xl (sections, footer) / 2xl (copy measure). Never 7xl+. */
export function Section({
  id, band = false, width = '6xl', className, children,
}: { id?: string; band?: boolean; width?: '5xl' | '6xl'; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn('section-padding relative scroll-mt-24', band && 'border-t border-border bg-surface-1', className)}>
      <div className={cn('mx-auto', width === '5xl' ? 'max-w-5xl' : 'max-w-6xl')}>{children}</div>
    </section>
  );
}

/** eyebrow -> display heading -> max-w-2xl lead. Headlines are solid ink, never a gradient. */
export function SectionHeading({
  eyebrow, eyebrowHue = 'blue', title, description, align = 'center', className,
}: { eyebrow?: string; eyebrowHue?: Hue; title: string; description?: string; align?: 'center' | 'left'; className?: string }) {
  return (
    <div className={cn('mb-12 md:mb-16', align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <Reveal y={10}>
          <Eyebrow hue={eyebrowHue} className="mb-4">{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.08} y={15}>
        <h2 className={cn('text-balance text-display-sm font-semibold tracking-tight', align === 'center' && 'mx-auto max-w-3xl')}>{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16} y={15}>
          <p className={cn('mt-4 max-w-2xl text-base text-muted-foreground md:text-lg', align === 'center' && 'mx-auto')}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
