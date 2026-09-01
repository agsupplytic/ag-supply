import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-heading font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        neutral: "bg-surface text-ink",
        blue: "bg-brand-blue-50 text-brand-blue-dark",
        outline: "border border-control-border text-ink",
        red: "bg-brand-red-900 text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.65rem] tracking-[0.08em]",
        md: "px-2.5 py-1 text-[0.7rem] tracking-[0.08em]",
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
