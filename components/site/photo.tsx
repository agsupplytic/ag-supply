import Image from "next/image";
import { cn } from "@/lib/utils";

const RATIO = {
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "3/2": "aspect-3/2",
  "1/1": "aspect-square",
} as const;

/**
 * Fotografía con tratamiento único: proporción fija, sin filtros ni superposiciones.
 * `position` fija el punto focal del recorte (object-position).
 */
export function Photo({
  src,
  alt,
  ratio = "4/3",
  sizes = "(max-width: 1024px) 100vw, 560px",
  priority = false,
  lazy = false,
  position = "center",
  className,
}: {
  src: string;
  alt: string;
  ratio?: keyof typeof RATIO;
  sizes?: string;
  priority?: boolean;
  /** Carga diferida: para imágenes que pueden estar ocultas (display:none) según el ancho. */
  lazy?: boolean;
  position?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-surface-2", RATIO[ratio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={lazy ? "lazy" : undefined}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
