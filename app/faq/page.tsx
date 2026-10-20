import Link from "next/link";
import { getCategories } from "@/lib/content";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FaqJsonLd } from "@/components/site/json-ld";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preguntas frecuentes sobre AG Supply",
  description:
    "Respuestas sobre AG Supply: qué fabrica, las marcas Ocean Breeze y Bonche, cómo se cotiza, distribuidores, ubicación de la planta y horario de atención.",
  path: "/faq",
});

type QA = { q: string; a: string };

export default async function FaqPage() {
  const categories = await getCategories();
  const made = categories.filter((c) => c.fabricated).map((c) => c.name.toLowerCase()).join(", ");
  const supplied = categories.filter((c) => !c.fabricated).map((c) => c.name.toLowerCase()).join(", ");
  const { company, address } = siteConfig;

  const groups: { title: string; items: QA[] }[] = [
    {
      title: "La empresa",
      items: [
        {
          q: "¿Qué es AG Supply?",
          a: `${siteConfig.legalName} es una convertidora de papel dominicana con planta en el sector Las Palomas, Santiago. Recibe bobinas de papel y las convierte en producto terminado. Nació en ${company.foundedYear} como ${company.formerName} y se reorientó a la conversión de papel en ${company.pivotYear}.`,
        },
        {
          q: "¿Dónde está la planta?",
          a: `${address.line1}, ${address.city}. Queda a ${company.plant.proximity[0]}, ${company.plant.proximity[1]} y ${company.plant.proximity[2]}.`,
        },
        {
          q: "¿Cuál es la capacidad de producción?",
          a: `La planta tiene capacidad instalada para procesar hasta ${company.capacityTonsMonth} toneladas de papel al mes.`,
        },
        {
          q: "¿Cuál es el horario de atención?",
          a: `${siteConfig.hours.label}.`,
        },
      ],
    },
    {
      title: "Productos y marcas",
      items: [
        {
          q: "¿Qué productos fabrica AG Supply?",
          a: `Papel tissue convertido en la planta: ${made}. Además suministra ${supplied}, que no se fabrican en la planta.`,
        },
        {
          q: "¿Qué son Ocean Breeze y Bonche?",
          a: "Son las dos marcas propias de AG Supply. Ocean Breeze es la línea para hoteles, restaurantes y cadenas. Bonche es la línea de consumo masivo y uso cotidiano, de precio accesible.",
        },
        {
          q: "¿Qué significa la presentación, por ejemplo 12/1 o 48/1?",
          a: "Es la presentación del producto tal como figura en el catálogo y en el sistema de AG Supply. La cantidad que se pide en la cotización se cuenta en esa presentación. Si tiene dudas sobre una referencia, atención comercial la confirma antes de cotizar.",
        },
      ],
    },
    {
      title: "Cotización y entrega",
      items: [
        {
          q: "¿Por qué no hay precios en el sitio?",
          a: "El precio depende de la referencia y del volumen de cada pedido, por eso se confirma por pedido. Arme su lista en el catálogo y envíela por WhatsApp.",
        },
        {
          q: "¿Cómo pido una cotización?",
          a: "En el catálogo, añada los productos a la lista, ajuste las cantidades y agregue una nota por producto si lo necesita. Al enviar, se genera un mensaje de WhatsApp con su lista. No hace falta registrarse.",
        },
        {
          q: "¿Pueden fabricar un formato o empaque específico?",
          a: "Consulte por WhatsApp o por el formulario de contacto indicando producto, formato y volumen; atención comercial evalúa cada caso.",
        },
        {
          q: "¿Tienen distribuidores autorizados?",
          a: "Sí, en Santiago, Santo Domingo, Región Este y Puerto Plata. Sus datos están en la página de contacto.",
        },
        {
          q: "¿Cómo los contacto directamente?",
          a: `Por teléfono (${siteConfig.phones[0].value} y ${siteConfig.phones[1].value}), por correo (${siteConfig.email}) o por WhatsApp desde cualquier botón del sitio.`,
        },
      ],
    },
  ];

  return (
    <>
      <FaqJsonLd qa={groups.flatMap((g) => g.items)} />
      <PageHero
        breadcrumb={[{ name: "Inicio", href: "/" }, { name: "Preguntas frecuentes" }]}
        title="Preguntas frecuentes"
        lead="Lo que más preguntan los clientes sobre la empresa, las marcas y la cotización."
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="rule-red">{g.title}</h2>
              <div className="mt-4">
                <FaqAccordion items={g.items} idPrefix={g.title} />
              </div>
            </section>
          ))}

          <div className="border-t-2 border-ink pt-6">
            <h2 className="text-xl">¿No encuentra su pregunta?</h2>
            <p className="mt-2 text-body">Escríbanos con su caso concreto.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <WhatsAppButton size="lg" />
              <Button asChild variant="outline" size="lg">
                <Link href="/contacto">Ir a contacto</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
