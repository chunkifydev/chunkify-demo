import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
                destructive:
                    'border-transparent bg-[hsl(var(--status-destructive))]/80 text-[hsl(var(--status-destructive-foreground))] [a&]:hover:bg-[hsl(var(--status-destructive))/90] focus-visible:ring-[hsl(var(--status-destructive))/20] dark:bg-[hsl(var(--status-destructive))]/60 dark:focus-visible:ring-[hsl(var(--status-destructive))/40]',
                outline:
                    'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
                success:
                    'border-transparent bg-[hsl(var(--status-primary))]/80 text-[hsl(var(--status-primary-foreground))] [a&]:hover:bg-[hsl(var(--status-primary))/90] focus-visible:ring-[hsl(var(--status-primary))/20] dark:bg-[hsl(var(--status-primary))]/60 dark:focus-visible:ring-[hsl(var(--status-primary))/40]',
                pending:
                    'border-transparent bg-[hsl(var(--status-warning))]/80 text-[hsl(var(--status-warning-foreground))] [a&]:hover:bg-[hsl(var(--status-primary))/90] focus-visible:ring-[hsl(var(--status-primary))/20] dark:bg-[hsl(var(--status-warning))]/60 dark:focus-visible:ring-[hsl(var(--status-primary))/40]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
