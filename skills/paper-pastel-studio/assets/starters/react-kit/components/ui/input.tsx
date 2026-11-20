import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/* Inputs are the ONE control that is not a pill: rounded-[10px]. Never rounded-full on an input.
   Dense app forms: py-2.5 text-[13px]. Marketing forms: py-3 text-sm. Same tokens, two padding scales. */
const base =
  'w-full rounded-[10px] border bg-surface-2/60 text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/60 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';
const ok = 'border-border focus:border-primary focus:ring-primary/25';
const bad = 'border-destructive focus:border-destructive focus:ring-destructive/25';
/* 16px on mobile (text-base) or iOS Safari zooms the page on focus; the design size applies from sm up (craft/typography.md section 6). */
const sizes = { app: 'px-3.5 py-2.5 text-base sm:text-[13px]', marketing: 'px-4 py-3 text-base sm:text-sm' } as const;

type Size = keyof typeof sizes;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; density?: Size }>(
  ({ className, invalid, density = 'marketing', ...props }, ref) => (
    <input ref={ref} aria-invalid={invalid || undefined} className={cn(base, sizes[density], invalid ? bad : ok, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; density?: Size }>(
  ({ className, invalid, density = 'marketing', ...props }, ref) => (
    <textarea ref={ref} aria-invalid={invalid || undefined} className={cn(base, 'min-h-[88px] resize-y', sizes[density], invalid ? bad : ok, className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

/** Label above, optional icon, hint, inline error. Wires aria-describedby for you. */
export function Field({
  label, icon, hint, error, children,
}: { label: string; icon?: ReactNode; hint?: string; error?: string; children: (a: { id: string; 'aria-describedby'?: string; invalid: boolean }) => ReactNode }) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon && <span className="[&_svg]:h-3 [&_svg]:w-3">{icon}</span>}
        {label}
      </label>
      {children({ id, 'aria-describedby': describedBy, invalid: !!error })}
      {error ? (
        <p id={`${id}-err`} role="alert" className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" strokeWidth={1.75} /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
