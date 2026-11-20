'use client';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { chipInk, chipText, tint, type Hue } from '../../lib/palette';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/** Ticks from 0 to `to` once, when it scrolls into view. Static under reduced motion. Never fake the number. */
export function CountUp({ to, duration = 900, className }: { to: number; duration?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduce) { setV(to); return; }
    const el = ref.current; if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration, reduce]);
  return <span ref={ref} className={cn('tabular-nums', className)}>{v.toLocaleString()}</span>;
}

/* KPI tile, "double bezel": tinted outer, translucent inner. Numerals are mono + tabular.
   The big number uses the glyph colour (it is large text, 3:1 is enough for decoration; use -ink if the number itself is the only carrier of meaning and your hue is amber/coral). */
export function StatTile({
  hue, icon: Icon, value, suffix, label, description, className,
}: { hue: Hue; icon: Icon; value: number; suffix?: string; label: string; description?: string; className?: string }) {
  return (
    <div className={cn('group rounded-[22px] p-1.5 transition-transform duration-300 hover:-translate-y-1', tint[hue], className)}>
      <div className="h-full rounded-[17px] bg-background/60 p-4 shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06)] transition-shadow duration-300 group-hover:shadow-[0_12px_28px_-12px_hsl(var(--shadow-color)/0.35)]">
        <span className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110', tint[hue])}>
          <Icon className={cn('h-4 w-4', chipText[hue])} strokeWidth={1.75} />
        </span>
        <span className={cn('block font-mono text-3xl font-semibold tracking-tight md:text-4xl', chipInk[hue])}>
          <CountUp to={value} />{suffix}
        </span>
        <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground">{label}</h3>
        {description && <p className="mt-1 text-[11px] leading-snug text-foreground/70">{description}</p>}
      </div>
    </div>
  );
}
