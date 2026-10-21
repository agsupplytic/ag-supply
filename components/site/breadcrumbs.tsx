import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href?: string };

/** Ruta de navegación accesible (nav + lista ordenada). La última migaja es la página actual. */
export function Breadcrumbs({
  items,
  label,
  tone = "light",
  className,
}: {
  items: Crumb[];
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm", tone === "dark" ? "text-white" : "text-muted")}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-1.5">
              {i === 0 && <Home className="size-3.5" aria-hidden />}
              {c.href && !last ? (
                <Link href={c.href} className="underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn("font-medium", tone === "dark" ? "text-white" : "text-ink")}>
                  {c.name}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 opacity-80" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
