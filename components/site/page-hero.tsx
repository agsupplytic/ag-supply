import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Photo } from "./photo";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * Encabezado único de las páginas interiores: banda azul de marca con texto blanco y,
 * si hay fotografía, a la derecha sin superposiciones. El contraste lo garantiza el
 * fondo plano (blanco sobre #1c75bc = 4,9:1).
 */
export function PageHero({
  breadcrumb,
  breadcrumbLabel,
  title,
  lead,
  actions,
  image,
  meta,
  className,
  children,
}: {
  breadcrumb?: Crumb[];
  breadcrumbLabel?: string;
  title: string;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  image?: { src: string; alt: string; position?: string };
  meta?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("border-b-4 border-brand-red bg-brand-blue text-white on-band", className)}>
      <Container className={cn("grid items-center gap-8 py-10 md:py-14", image && "lg:grid-cols-[1.1fr_1fr] lg:gap-14")}>
        <div>
          {breadcrumb && <Breadcrumbs items={breadcrumb} label={breadcrumbLabel ?? "Breadcrumb"} tone="dark" className="mb-5" />}
          <h1 className="max-w-3xl text-balance !text-white">{title}</h1>
          {lead && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-white">{lead}</div>}
          {meta && <div className="mt-3 text-sm text-white">{meta}</div>}
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {image && (
          <Photo
            src={image.src}
            alt={image.alt}
            ratio="4/3"
            lazy
            position={image.position}
            sizes="(max-width: 1024px) 100vw, 480px"
            className="hidden rounded-xl lg:block"
          />
        )}
      </Container>
    </section>
  );
}
