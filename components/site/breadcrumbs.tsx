import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href?: string };

/** Ruta de navegación accesible (nav + lista ordenada). La última migaja es la página actual. */
export function Breadcrumbs({
  items,
  tone = "light",
  className,
}: {
  items: Crumb[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
          tone === "dark" ? "text-navy-300" : "text-muted",
        )}
      >
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href} className="underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && (tone === "dark" ? "text-white" : "text-ink"))}>
                  {c.name}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
