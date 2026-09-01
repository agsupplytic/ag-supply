import { cn } from "@/lib/utils";

/**
 * Subtle transition between two light sections: a thin brand hairline that fades
 * out at both ends (no hard cut, no big diagonal band).
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("mx-auto max-w-6xl px-6 lg:px-8", className)}>
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-brand-blue-200) 25%, var(--color-brand-red) 50%, var(--color-brand-blue-200) 75%, transparent 100%)",
          opacity: 0.45,
        }}
      />
    </div>
  );
}
