import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A reserved space for a photo that hasn't been supplied yet. Deliberately quiet:
 * a tinted panel at the right aspect ratio, no "AQUÍ VA UNA IMAGEN" art. In dev it
 * shows the expected filename so it's traceable; in production it's just the panel.
 * When the real photo lands, swap this for <Figure isReal src=... />.
 */
export function ImageSlot({
  file,
  label,
  className,
  rounded = true,
  tone = "blue",
  children,
}: {
  /** Expected file, e.g. "planta-1.webp" — shown only in dev. */
  file?: string;
  /** Optional human label shown in dev under the filename. */
  label?: string;
  className?: string;
  rounded?: boolean;
  tone?: "blue" | "surface";
  children?: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        tone === "blue" ? "bg-brand-blue-50" : "bg-surface",
        rounded && "rounded-2xl",
        className,
      )}
    >
      <ImageIcon
        className={cn(
          "size-8",
          tone === "blue" ? "text-brand-blue-200" : "text-muted",
        )}
        aria-hidden
      />
      {isDev && file && (
        <span className="figure-note">
          {file}
          {label ? ` · ${label}` : ""}
        </span>
      )}
      {children}
    </div>
  );
}
