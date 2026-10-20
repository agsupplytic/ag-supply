import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

/** Foto de producto sobre blanco. Sin foto: bloque neutro rotulado, sin arte de relleno. */
export function ProductImage({
  product,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
}: {
  product: Pick<Product, "name" | "images">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = product.images[0];
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-4/3 w-full items-center justify-center bg-surface",
          className,
        )}
      >
        <span className="label text-muted">Fotografía pendiente</span>
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
        className="object-contain p-4"
      />
    </div>
  );
}
