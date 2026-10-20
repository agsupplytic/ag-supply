import Link from "next/link";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./whatsapp-button";
import { siteConfig } from "@/lib/site-config";

/** Cierre de página: una frase, dos acciones y los datos de contacto. */
export function ClosingCta({
  title = "¿Necesita una cotización?",
  text = "Arme su lista en el catálogo o escríbanos directamente; respondemos en horario comercial.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-navy text-white on-navy">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="rule-red !text-white !text-2xl">{title}</h2>
          <p className="mt-3 text-navy-300">{text}</p>
          <p className="mt-3 text-sm text-navy-300">
            {siteConfig.phones.map((p) => p.value).join(" · ")} · {siteConfig.hours.label}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="light">
            <Link href="/productos">Ver catálogo</Link>
          </Button>
          <WhatsAppButton size="lg" />
        </div>
      </Container>
    </section>
  );
}
