import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { isRealImage } from "@/lib/real-images";

/**
 * The one page header for the whole site. Before this there were seven hand-rolled
 * copies of `<section className="… bg-brand-gradient text-white">`, all flat.
 *
 * - `image`  → real photo background with a scrim for white-text contrast.
 * - `slot`   → no photo yet: brand gradient + (in dev) the expected filename.
 * - neither  → plain brand gradient (used by the product detail page on purpose,
 *              so the product photo stays the star).
 *
 * The background sits in its own clipped layer, so the section itself is not
 * `overflow-hidden` and pages can overlap content upward into it (e.g. /contacto).
 */
export function PageHero({
  image,
  slot,
  breadcrumb,
  title,
  lead,
  body,
  meta,
  actions,
  tone = "deep",
  className,
  children,
}: {
  image?: { src: string; alt: string };
  slot?: { file?: string; label?: string };
  breadcrumb?: React.ReactNode;
  title: string;
  lead?: React.ReactNode;
  /**
   * Long-form detail (technical specs, formats). Never set white-over-photo:
   * it renders in a plain light band right under the hero, dark text on white,
   * so a spec paragraph stays legible and does not push page content off-screen.
   */
  body?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** "deep" = darker scrim for busy interior photos; "brand" = light overlay. */
  tone?: "deep" | "brand";
  className?: string;
  children?: React.ReactNode;
}) {
  const real = image ? isRealImage(image.src) : false;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <>
    <section
      className={cn(
        "relative isolate border-b border-border text-white",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              draggable={false}
              className="object-cover"
            />
            <div
              className={cn(
                "absolute inset-0",
                tone === "deep" ? "hero-scrim-deep" : "overlay-brand",
              )}
            />
            {!real && (
              <span className="figure-note">
                <ImageIcon className="size-3" aria-hidden />
                Imagen de prueba
              </span>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-brand-gradient" />
            {slot?.file && isDev && (
              <span className="figure-note">
                {slot.file}
                {slot.label ? ` · ${slot.label}` : ""}
              </span>
            )}
          </>
        )}
      </div>

      <Container className="relative py-16 md:py-24">
        {breadcrumb && (
          <div className="mb-3 text-sm text-white/85">{breadcrumb}</div>
        )}
        <h1 className="max-w-3xl text-balance text-white">{title}</h1>
        {lead && (
          <div className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            {lead}
          </div>
        )}
        {meta && <div className="mt-2 text-sm text-white/85">{meta}</div>}
        {actions && (
          <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
        )}
        {children}
      </Container>
    </section>

    {body && (
      <div className="border-b border-border bg-white">
        <Container className="py-8 md:py-10">
          <div className="max-w-3xl text-pretty leading-relaxed text-body">
            {body}
          </div>
        </Container>
      </div>
    )}
    </>
  );
}
