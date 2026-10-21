import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

type Panel = { name: string; audience: string; body: string; count: number };

const LOOK = {
  oceanBreeze: {
    bg: "bg-ocean-50",
    rule: "border-ocean",
    logo: "/images/brand/ocean-breeze-logo.webp",
    alt: "Ocean Breeze",
    btn: "bg-ocean text-white hover:bg-ocean/90",
  },
  bonche: {
    bg: "bg-bonche-50",
    rule: "border-bonche-accent",
    logo: "/images/brand/bonche-logo.webp",
    alt: "Bonche Servilletas",
    btn: "bg-bonche text-white hover:bg-bonche-dark",
  },
} as const;

const COPY = {
  es: { made: "Fabricada por AG Supply", view: (n: string) => `Ver ${n}` },
  en: { made: "Made by AG Supply", view: (n: string) => `View ${n}` },
};

/**
 * Las dos marcas propias, cada una con su paleta y su logotipo (con transparencia, sin
 * caja blanca). AG Supply (azul) es el fabricante; las marcas conservan su identidad.
 */
export function BrandPanels({ lang, ocean, bonche }: { lang: Lang; ocean: Panel; bonche: Panel }) {
  const c = COPY[lang];
  const t = ui(lang);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {([["oceanBreeze", ocean], ["bonche", bonche]] as const).map(([key, p]) => {
        const look = LOOK[key];
        return (
          <div key={key} className={cn("card card-hover flex flex-col overflow-hidden p-6 md:p-8", look.bg)}>
            <Image src={look.logo} alt={look.alt} width={240} height={150} className="h-28 w-auto self-start" />
            <h3 className={cn("mt-4 border-t-4 pt-4", look.rule)}>{p.name}</h3>
            <p className="label mt-1 text-muted">{p.audience}</p>
            <p className="mt-3 flex-1 text-body">{p.body}</p>
            <p className="mt-4 text-sm text-muted">
              {c.made} · {t.count.product(p.count)}
            </p>
            <Link
              href={href(lang, { name: key })}
              className={cn("mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md px-5 font-heading font-bold", look.btn)}
            >
              {c.view(p.name)}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
