import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

/**
 * Product photo. When Odoo has no image we show a clean tinted panel (no shouty
 * "AQUÍ VA UNA IMAGEN" art). The image is drag/right-click deterred.
 * `watermark` is accepted for backwards compatibility and ignored.
 */
export function ProductImage({
  product,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
  contain = true,
  watermark: _watermark = true,
  showNote = true,
}: {
  product: Pick<Product, "name" | "images" | "placeholderImage">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  contain?: boolean;
  watermark?: boolean;
  /** Show a discreet dev-only note on placeholders (hide for small thumbs). */
  showNote?: boolean;
}) {
  const real = product.images[0];
  const isDev = process.env.NODE_ENV !== "production";

  if (!real) {
    return (
      <div
        data-protected
        className={cn(
          "relative aspect-4/3 w-full overflow-hidden bg-brand-blue-50",
          className,
        )}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="size-8 text-brand-blue-200" aria-hidden />
        </span>
        {isDev && showNote && (
          <span className="figure-note">imagen de producto pendiente</span>
        )}
      </div>
    );
  }

  return (
    <div
      data-protected
      className={cn(
        "relative aspect-4/3 w-full overflow-hidden bg-white",
        className,
      )}
    >
      <Image
        src={real}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={cn(contain ? "object-contain p-4" : "object-cover")}
      />
    </div>
  );
}
