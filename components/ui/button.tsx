import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-heading font-semibold tracking-[0.01em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
        outline:
          "border border-brand-blue-dark bg-transparent text-brand-blue-dark hover:bg-brand-blue-50",
        subtle: "bg-surface text-ink hover:bg-surface-2",
        ghost: "text-brand-blue-dark hover:bg-brand-blue-50",
        /** Sobre fondo marino. */
        light: "bg-white text-navy hover:bg-brand-blue-50",
        "outline-light":
          "border border-white/70 bg-transparent text-white hover:bg-white/10",
        whatsapp:
          "bg-whatsapp text-[color:var(--color-whatsapp-ink)] hover:bg-whatsapp-hover",
        link: "text-brand-blue-dark underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-base [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
