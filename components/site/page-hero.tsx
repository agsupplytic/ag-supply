import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Photo } from "./photo";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * Encabezado único de todas las páginas interiores: banda marino plana, texto a
 * la izquierda y, si existe, fotografía a la derecha sin superposiciones. Nada
 * de texto sobre foto: el contraste lo garantiza el fondo plano.
 */
export function PageHero({
  breadcrumb,
  title,
  lead,
  actions,
  image,
  meta,
  className,
  children,
}: {
  breadcrumb?: Crumb[];
  title: string;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  image?: { src: string; alt: string; position?: string };
  meta?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("bg-navy text-white on-navy", className)}>
      <Container
        className={cn(
          "grid items-center gap-8 py-10 md:py-14",
          image && "lg:grid-cols-[1.15fr_1fr] lg:gap-14",
        )}
      >
        <div>
          {breadcrumb && <Breadcrumbs items={breadcrumb} tone="dark" className="mb-5" />}
          <h1 className="max-w-3xl text-balance !text-white">{title}</h1>
          {lead && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-300">{lead}</div>}
          {meta && <div className="mt-3 text-sm text-navy-300">{meta}</div>}
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {image && (
          <Photo
            src={image.src}
            alt={image.alt}
            ratio="4/3"
            priority
            position={image.position}
            sizes="(max-width: 1024px) 100vw, 480px"
            className="hidden lg:block"
          />
        )}
      </Container>
    </section>
  );
}
