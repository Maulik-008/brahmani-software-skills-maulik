import type { ComponentType } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { tint, type Hue } from '../../lib/palette';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/* FEATURED tile: full-surface pastel wash, oversized watermark icon, icon+label pill, ink circular action.
   Use for hero items only (decision 7: tint washes reach showcase cards, not list rows or whole bands).
   On a tint, chips are white/70 (dark: black/20), never another tint. */
export function ShowcaseCard({
  hue, icon: Icon, label, description, href, className,
}: { hue: Hue; icon: Icon; label: string; description: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[28px] p-5 transition-transform duration-300 hover:-translate-y-1',
        tint[hue], className,
      )}
    >
      <div className="on-tint inline-flex w-fit items-center gap-2 rounded-full px-3 py-2">
        <Icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-semibold text-foreground">{label}</span>
      </div>
      <Icon className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-foreground/[0.06]" strokeWidth={1} />
      <p className="relative max-w-[85%] text-[13px] leading-relaxed text-foreground/70">{description}</p>
      <span
        aria-hidden
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-cta text-cta-foreground transition-transform duration-300 group-hover:scale-110"
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </a>
  );
}
