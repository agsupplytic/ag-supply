import { cn } from "@/lib/utils";

/**
 * Marks copy or media that is not yet confirmed against an official source
 * (mission/vision text, real plant photography, the Santo Domingo branch, ...).
 * In development it renders a visible amber note; in production it renders the
 * fallback text quietly (or nothing). Every use should have a matching entry in
 * docs/PENDING-CONTENT.md.
 */
export function PendingContent({
  label,
  children,
  className,
}: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev) {
    return children ? <>{children}</> : null;
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col gap-1 rounded-md border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900",
        className,
      )}
    >
      <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-wide text-amber-700">
        Pendiente de confirmar · {label}
      </span>
      {children}
    </span>
  );
}
