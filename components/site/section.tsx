import { Container } from "./container";
import { cn } from "@/lib/utils";

type Tone = "white" | "surface" | "navy";

const TONE: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy text-white on-navy",
};

/** Sección de página: fondo plano (blanco, gris frío o marino) y ritmo vertical fijo. */
export function Section({
  className,
  containerClassName,
  tone = "white",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  containerClassName?: string;
  tone?: Tone;
}) {
  return (
    <section className={cn("py-14 md:py-20", TONE[tone], className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Encabezado de sección: filete rojo, titular y párrafo de apoyo opcional.
 * `as` permite mantener la jerarquía (h2 por defecto).
 */
export function SectionHeading({
  title,
  intro,
  as: Tag = "h2",
  tone = "light",
  className,
}: {
  title: string;
  intro?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Tag className={cn("rule-red", tone === "dark" && "!text-white")}>{title}</Tag>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            tone === "dark" ? "text-navy-300" : "text-body",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
