import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Proporción natural del archivo: el logotipo nunca se estira ni se recorta.
const SRC = "/images/brand/agsupply-logo-main.webp";
const RATIO = 1080 / 328;

/**
 * Logotipo oficial (PNG/WebP con transparencia, sin eslogan). Para fondos claros.
 * Sobre marino se coloca en una pastilla blanca (`plate`) porque no existe versión
 * en negativo; ver docs/FOTOGRAFIA.md (se solicita el vector).
 */
export function Logo({
  height = 36,
  className,
  priority = false,
  plate = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
  plate?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        plate && "bg-white px-3 py-2",
        className,
      )}
    >
      <Image
        src={SRC}
        alt={siteConfig.name}
        width={Math.round(height * RATIO)}
        height={height}
        priority={priority}
        className="block w-auto"
        style={{ height, width: "auto" }}
        sizes={`${Math.round(height * RATIO)}px`}
      />
    </span>
  );
}
