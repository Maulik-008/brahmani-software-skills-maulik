import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/* ONE filled button in the whole system: variant "default" (ink on paper, bg-cta).
   Use it once per view. Everything else is outline / ghost / secondary / link.
   The accent `primary` is never a button fill. Buttons are full pills.
   sm/default get an invisible 44px hit area via after:-inset-1.5 without growing the visual size.
   Press: 0.98 (decision 14), never on disabled (works for <button> and <a>), named transition properties (craft/motion.md). */
export const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-[color,background-color,border-color,scale] duration-150 ease-out [&:not(:disabled)]:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-cta text-cta-foreground hover:bg-cta/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-transparent hover:border-primary/30 hover:bg-surface-1',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'rounded-none text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-[13px] after:absolute after:-inset-1 after:content-[""]',
        default: 'h-10 px-5 after:absolute after:-inset-0.5 after:content-[""]',
        lg: 'h-12 px-7 text-[15px]',
        icon: 'h-10 w-10 after:absolute after:-inset-0.5 after:content-[""]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

type Common = VariantProps<typeof buttonVariants> & {
  /** trailing arrow that nudges right on hover. Use on forward-moving CTAs. */
  arrow?: boolean;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Common;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, arrow, children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      {arrow && <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />}
    </button>
  ),
);
Button.displayName = 'Button';

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & Common;
/** Same look as Button, rendered as a link. In Next.js wrap or swap <a> for next/link. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, arrow, children, ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      {arrow && <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />}
    </a>
  ),
);
ButtonLink.displayName = 'ButtonLink';
