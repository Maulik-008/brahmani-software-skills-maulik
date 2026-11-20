/* The six category hues, as STATIC class lookups.
   Tailwind only generates CSS for class names it can read as complete strings,
   so `"bg-tint-" + hue` silently produces nothing. Always go through these maps. */
export const HUES = ['blue', 'violet', 'emerald', 'coral', 'amber', 'teal'] as const;
export type Hue = (typeof HUES)[number];

/** Cycle the six hues across a list: hueAt(0)=blue ... hueAt(6)=blue. Never invent a 7th. */
export const hueAt = (i: number): Hue => HUES[((i % HUES.length) + HUES.length) % HUES.length];

/** full-surface pastel wash (showcase cards, eyebrow chips, footer CTA) */
export const tint: Record<Hue, string> = {
  blue: 'bg-tint-blue', violet: 'bg-tint-violet', emerald: 'bg-tint-emerald',
  coral: 'bg-tint-coral', amber: 'bg-tint-amber', teal: 'bg-tint-teal',
};
/** solid glyph colour, for icons and big numerals */
export const chipText: Record<Hue, string> = {
  blue: 'text-chip-blue', violet: 'text-chip-violet', emerald: 'text-chip-emerald',
  coral: 'text-chip-coral', amber: 'text-chip-amber', teal: 'text-chip-teal',
};
/** AA-safe text colour for small labels. Needs a11y-text.css (falls back to chip colour without it). */
export const chipInk: Record<Hue, string> = {
  blue: 'text-chip-blue-ink', violet: 'text-chip-violet-ink', emerald: 'text-chip-emerald-ink',
  coral: 'text-chip-coral-ink', amber: 'text-chip-amber-ink', teal: 'text-chip-teal-ink',
};
/** icon-chip fill on the canvas, with the matching hover step */
export const chipFill: Record<Hue, string> = {
  blue: 'bg-chip-blue/10 group-hover:bg-chip-blue/15', violet: 'bg-chip-violet/10 group-hover:bg-chip-violet/15',
  emerald: 'bg-chip-emerald/10 group-hover:bg-chip-emerald/15', coral: 'bg-chip-coral/10 group-hover:bg-chip-coral/15',
  amber: 'bg-chip-amber/10 group-hover:bg-chip-amber/15', teal: 'bg-chip-teal/10 group-hover:bg-chip-teal/15',
};
/** hover border on a neutral card */
export const chipBorderHover: Record<Hue, string> = {
  blue: 'hover:border-chip-blue/35', violet: 'hover:border-chip-violet/35', emerald: 'hover:border-chip-emerald/35',
  coral: 'hover:border-chip-coral/35', amber: 'hover:border-chip-amber/35', teal: 'hover:border-chip-teal/35',
};
