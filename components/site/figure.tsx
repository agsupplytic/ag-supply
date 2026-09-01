import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRealImage } from "@/lib/real-images";

/**
 * An image slot. While we run on placeholder art, every Figure shows a small
 * "IMAGEN DE PRUEBA" badge so it's obvious what still needs real photography.
 * Pass `isReal` once a genuine photo is wired in to hide the badge.
 */
export function Figure({
  src,
  alt,
  className,
  imgClassName,
  sizes = "100vw",
  priority = false,
  note = "Imagen de prueba",
  isReal = false,
  rounded = true,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  note?: string;
  isReal?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
}) {
  const real = isReal || isRealImage(src);
  return (
    <div
      data-protected
      className={cn(
        "relative overflow-hidden bg-brand-blue-50",
        rounded && "rounded-2xl",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={cn("object-cover", imgClassName)}
      />
      {!real && (
        <span className="figure-note">
          <ImageIcon className="size-3" aria-hidden />
          {note}
        </span>
      )}
      {children}
    </div>
  );
}
