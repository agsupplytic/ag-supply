import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Natural aspect ratios — the logo is never stretched or cropped.
const SRC = {
  header: { src: "/images/brand/agsupply-header.png", ratio: 1081 / 336 },
  full: { src: "/images/brand/agsupply-logo.png", ratio: 1920 / 736 },
} as const;

/**
 * Official logo.
 *  - "header" : wordmark + swoosh, no tagline (for the white header)
 *  - "full"   : wordmark + swoosh + «Siente la Limpieza» script (footer, OG)
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
