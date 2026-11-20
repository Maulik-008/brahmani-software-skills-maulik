'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/* The sanctioned entrance: fade + small upward drift, once, as it enters the viewport.
   Quiet, 0.4 to 0.7s, ease [0.22,1,0.36,1]. Honours prefers-reduced-motion (renders static).
   Stagger siblings with delay={i * 0.06}. */
export function Reveal({
  children, delay = 0, y = 20, className,
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
