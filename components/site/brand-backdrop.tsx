import { cn } from "@/lib/utils";

/**
 * Plain brand-gradient panel for a section that has no photo (page heros,
 * decorative bands). For real photography use <BackgroundCarousel> instead.
 */
export function BrandBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-brand-gradient",
        className,
      )}
    >
      <div className="absolute -right-40 -top-48 size-[600px] rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
