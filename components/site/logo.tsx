import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Proporción natural del archivo: el logotipo nunca se estira ni se recorta.
const SRC = "/images/brand/agsupply-logo-main.webp";
const RATIO = 1080 / 328;

/**
 * Logotipo oficial (WebP con transparencia, sin eslogan). Va directamente sobre fondos
 * claros —cabecera y pie— sin pastilla ni caja blanca. No existe versión en negativo,
 * por eso nunca se coloca sobre las bandas azules.
 */
export function Logo({
  height = 36,
  className,
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
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
