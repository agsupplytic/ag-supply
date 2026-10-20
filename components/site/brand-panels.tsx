import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Panel = {
  slug: "ocean-breeze" | "bonche";
  name: string;
  audience: string;
  body: string;
  count: number;
};

const LOOK = {
  "ocean-breeze": {
    bg: "bg-ocean-50",
    rule: "border-ocean",
    ink: "text-ocean",
    logo: "/images/brand/ocean-breeze-logo.webp",
    alt: "Logotipo Ocean Breeze",
    btn: "bg-ocean text-white hover:bg-ocean/90",
  },
  bonche: {
    bg: "bg-bonche-50",
    rule: "border-bonche",
    ink: "text-bonche",
    logo: "/images/brand/bonche-logo.webp",
    alt: "Logotipo Bonche Servilletas",
    btn: "bg-bonche text-white hover:bg-bonche-dark",
  },
} as const;

/**
 * Las dos marcas propias, cada una con su paleta y su logotipo, una al lado de la
 * otra. AG Supply (marino/azul) es el fabricante; las marcas conservan su identidad.
 */
export function BrandPanels({ ocean, bonche }: { ocean: Panel; bonche: Panel }) {
  return (
    <div className="grid gap-px bg-border md:grid-cols-2">
      {[ocean, bonche].map((p) => {
        const look = LOOK[p.slug];
        return (
          <div key={p.slug} className={cn("flex flex-col p-6 md:p-8", look.bg)}>
            <div className="flex h-24 items-center">
              <Image
                src={look.logo}
                alt={look.alt}
                width={200}
                height={125}
                className="h-24 w-auto"
              />
            </div>
            <h3 className={cn("mt-4 border-t-2 pt-4", look.rule)}>{p.name}</h3>
            <p className="label mt-1 text-muted">{p.audience}</p>
            <p className="mt-3 flex-1 text-body">{p.body}</p>
            <p className="mt-4 text-sm text-muted">
              Fabricada por AG Supply · {p.count} {p.count === 1 ? "producto" : "productos"} en catálogo
            </p>
            <Link
              href={`/${p.slug}`}
              className={cn(
                "mt-5 inline-flex h-11 w-fit items-center gap-2 px-5 font-heading font-semibold",
                look.btn,
              )}
            >
              Ver {p.name}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
