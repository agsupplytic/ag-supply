import { Container } from "./container";
import { cn } from "@/lib/utils";

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { containerClassName?: string }) {
  return (
    <section className={cn("py-16 md:py-24", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Title-led section heading. No uppercase eyebrow label — the headline carries
 * the section, with an optional supporting paragraph. `eyebrow` is accepted for
 * backwards compatibility and ignored.
 */
export function SectionHeading({
  eyebrow: _eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2>{title}</h2>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-body">{intro}</p>
      )}
    </div>
  );
}
