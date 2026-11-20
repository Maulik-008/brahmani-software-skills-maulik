import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/* tailwind-merge must know our custom font sizes. Without this it reads
   `text-display-sm` as a text COLOUR and drops it when you also pass `text-chip-blue`. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-sm', 'display', 'display-lg', 'display-xl'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
