import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] font-display text-sm font-semibold tracking-wide transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-on hover:bg-accent-soft active:translate-y-px px-5 py-3 min-h-11',
        secondary:
          'border border-ink/20 bg-transparent text-ink hover:border-accent hover:text-accent px-5 py-3 min-h-11',
        ghost: 'text-ink-muted hover:text-accent px-3 py-2 min-h-11',
      },
      size: {
        default: '',
        sm: 'px-3 py-2 text-xs min-h-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
