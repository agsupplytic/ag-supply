import Image from "next/image";
import { CategoryIcon } from "./category-icon";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

/**
 * Foto de producto sobre blanco. Sin foto: bloque con el icono de la categoría y el
 * aviso «foto próximamente» (nunca imágenes de archivo que no sean de AG Supply).
 */
export function ProductImage({
  product,
  icon,
  soonLabel,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
  compact = false,
}: {
  product: Pick<Product, "name" | "images">;
  icon: string;
  soonLabel: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Miniatura: oculta el rótulo y reduce el relleno. */
  compact?: boolean;
}) {
  const src = product.images[0];
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-4/3 w-full flex-col items-center justify-center gap-1 bg-brand-blue-50 text-brand-blue",
          className,
        )}
      >
        <CategoryIcon name={icon} className={compact ? "size-7" : "size-10"} />
        {!compact && <span className="label text-brand-blue-dark">{soonLabel}</span>}
      </div>
    );
  }
  return (
    <div className={cn("relative aspect-4/3 w-full overflow-hidden bg-white", className)}>
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain", compact ? "p-1" : "p-4")}
      />
    </div>
  );
}
