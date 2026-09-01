import { cn } from "@/lib/utils";

/**
 * AG Supply brand swoosh — the paired ribbons from the logo: blunt/rounded on the
 * left, tapering to a sharp point on the right, sweeping up. Red leads, blue
 * trails behind and lower so the two never overlap. Used sparingly and large as a
 * brand signature on solid-colour bands — never as small card decoration.
 *
 *  - field : full-bleed diagonal accent for a section background
 *  - mark  : contained badge (kept for compatibility; use rarely)
 *  - draw  : `mark` that animates in on hover (see .swoosh-draw in globals.css)
 */
type Variant = "mark" | "field" | "draw";

const RED_RIBBON =
  "M10 60 C 3 58 3 34 14 32 C 100 36 200 22 296 4 C 210 40 112 58 26 62 C 18 63 14 62 10 60 Z";
const BLUE_RIBBON =
  "M8 80 C 1 78 1 54 12 52 C 100 56 202 42 300 22 C 214 58 116 76 26 82 C 18 83 12 82 8 80 Z";

export function Swoosh({
  variant = "field",
  className,
  flip = false,
  tone = "brand",
}: {
  variant?: Variant;
  className?: string;
  flip?: boolean;
  /** "brand" = red+blue ribbons; "light" = both white (for dark photo areas). */
  tone?: "brand" | "light";
}) {
  const red = tone === "light" ? "#ffffff" : "var(--color-brand-red)";
  const blue = tone === "light" ? "#ffffff" : "var(--color-brand-blue)";
  const blueOpacity = tone === "light" ? 0.5 : 0.9;
  const transform = flip ? "scaleX(-1)" : undefined;

  const paths = (
    <>
      <path d={BLUE_RIBBON} fill={blue} fillOpacity={blueOpacity} />
      <path d={RED_RIBBON} fill={red} />
    </>
  );

  if (variant === "field") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 300 90"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform }}
        className={cn("pointer-events-none absolute", className)}
      >
        {paths}
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 300 90"
      fill="none"
      style={{ transform }}
      className={cn(
        "pointer-events-none overflow-visible",
        variant === "draw" && "swoosh-draw",
        className,
      )}
    >
      {paths}
    </svg>
  );
}
