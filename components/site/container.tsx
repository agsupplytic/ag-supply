import { cn } from "@/lib/utils";

/** Ancho de contenido único: 1200 px, márgenes 20 / 24 / 32 px. */
export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
