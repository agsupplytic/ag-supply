import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Natural aspect ratios — the logo is never stretched or cropped.
const SRC = {
  header: { src: "/images/brand/agsupply-logo-main.png", ratio: 1080 / 328 },
  full: { src: "/images/brand/agsupply-logo-main.png", ratio: 1080 / 328 },
} as const;

/**
 * Official logo.
 *  Header y footer usan el mismo archivo (PNG con transparencia, sin eslogan).
 *  - "header" : barra superior
 *  - "full"   : pie de página
 */
export function Logo({
  variant = "header",
  height = 34,
  className,
  priority = false,
}: {
  variant?: "header" | "full";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const { src, ratio } = SRC[variant];
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={src}
        alt={`${siteConfig.legalName} — ${siteConfig.slogan}`}
        width={Math.round(height * ratio)}
        height={height}
        priority={priority}
        draggable={false}
        className="block w-auto select-none"
        style={{ height, width: "auto" }}
        sizes="320px"
      />
    </span>
  );
}
