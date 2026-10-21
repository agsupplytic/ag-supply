import Link from "next/link";
import { Clock, Phone } from "lucide-react";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./whatsapp-button";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

/** Cierre de página: banda azul con una frase, dos acciones y los datos de contacto. */
export function ClosingCta({ lang, title, text }: { lang: Lang; title?: string; text?: string }) {
  const t = ui(lang);
  return (
    <section className="border-t-4 border-brand-red bg-brand-blue text-white on-band">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="rule-red !text-2xl !text-white">{title ?? t.closing.title}</h2>
          <p className="mt-3 text-white">{text ?? t.closing.text}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-4" aria-hidden />
              {siteConfig.phones.map((p) => p.value).join(" · ")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {textFor(lang).hours}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="light">
            <Link href={href(lang, { name: "products" })}>{t.catalogBtn}</Link>
          </Button>
          <WhatsAppButton size="lg" lang={lang} />
        </div>
      </Container>
    </section>
  );
}
