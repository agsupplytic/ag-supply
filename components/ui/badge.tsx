import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Etiqueta funcional (marca de un producto, estado). Cuadrada, sin decoración. */
const badgeVariants = cva(
  "inline-flex items-center rounded-xs font-label font-semibold uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-ink",
        blue: "bg-brand-blue-50 text-brand-blue-dark",
        outline: "border border-control-border text-ink",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[0.6875rem]",
        md: "px-2 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
