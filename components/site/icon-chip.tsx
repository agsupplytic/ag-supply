import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Único estilo de icono de orientación: chip de 40 px con radio de 10 px. */
export function IconChip({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("icon-chip", className)} aria-hidden>
      <Icon />
    </span>
  );
}
