import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/content";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FaqJsonLd } from "@/components/site/json-ld";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { ogFor } from "@/lib/seo";

const FAQ_DESC =
  "Respuestas sobre AG Supply: qué es una convertidora de papel, las marcas Ocean Breeze y Bonche, cómo se cotiza, formatos a medida, cobertura y horario.";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: FAQ_DESC,
  alternates: { canonical: "/faq" },
  openGraph: ogFor("Preguntas frecuentes — AG Supply", FAQ_DESC),
};

export default async function FaqPage() {
  const categories = await getCategories();
  const catList = categories.map((c) => c.name.toLowerCase()).join(", ");

  const qa: { q: string; a: string }[] = [
    {
      q: "¿Qué es AG Supply?",
      a: `${siteConfig.legalName} es una convertidora de papel dominicana con planta en el sector Las Palomas, Santiago. Recibe bobinas de papel y materia prima y las transforma en producto terminado de higiene. La empresa nació en ${siteConfig.company.foundedYear} como ${siteConfig.company.formerName} y se reorientó a la conversión de papel en ${siteConfig.company.pivotYear}.`,
    },
    {
      q: "¿Qué diferencia hay entre una convertidora y un revendedor?",
      a: "El producto se fabrica en nuestra planta: controlamos gramaje, formato y rendimiento lote a lote, y ajustamos la presentación al volumen de cada cliente. No revendemos producto terminado de terceros.",
    },
    {
      q: "¿Qué productos fabrican?",
      a: `Cubrimos todo el programa de higiene institucional: ${catList}. Cada categoría se produce en planta.`,
    },
    {
      q: "¿Qué son Ocean Breeze y Bonche?",
      a: "Son las dos marcas propias de AG Supply, hechas en la misma planta con el mismo control de calidad. Ocean Breeze es la línea premium para hoteles, restaurantes y cadenas (canal HORECA). Bonche es la línea económica para colmados, supermercados y consumo masivo.",
    },
    {
      q: "¿Por qué no hay precios en el sitio?",
      a: "El precio depende del formato, el conteo y el volumen de cada pedido, así que se confirma por pedido. Arma tu lista en el catálogo y envíala por WhatsApp para recibir una cotización.",
    },
    {
      q: "¿Cómo pido una cotización?",
      a: "En el catálogo, añade los productos a tu cotización, ajusta cantidades y agrega una nota si necesitas un formato específico. Al enviar, se genera un mensaje de WhatsApp con tu lista listo para mandar. No hace falta registrarse.",
    },
    {
      q: "¿Hacen formatos y empaques a medida?",
      a: "Sí. Ajustamos la presentación, el conteo por paquete y el empaque —impreso o liso, en fardo o caja— al volumen de tu operación.",
    },
    {
      q: "¿A qué zonas entregan?",
      a: "Cobertura nacional en toda la República Dominicana, con vocación de servir a la región del Caribe. El plazo de entrega se acuerda por pedido.",
    },
    {
      q: "¿Tienen distribuidores autorizados?",
      a: "Sí, por zona: Santiago, Santo Domingo, Región Este y Puerto Plata. Los datos de cada uno están en la página de contacto.",
    },
    {
      q: "¿Dónde está la planta?",
      a: `${siteConfig.address.line1}, ${siteConfig.address.city} — a ${siteConfig.company.plant.proximity[0]}, ${siteConfig.company.plant.proximity[1]} y ${siteConfig.company.plant.proximity[2]}.`,
    },
    {
      q: "¿Cuál es la capacidad de producción?",
      a: `La planta procesa hasta ${siteConfig.company.capacityTonsMonth} toneladas de papel al mes.`,
    },
    {
      q: "¿Puedo pedir una muestra?",
      a: "Sí. Escríbenos por WhatsApp o por el formulario de contacto indicando el producto y el uso previsto, y coordinamos una muestra física.",
    },
    {
      q: "¿Cuál es el horario de atención?",
      a: siteConfig.hours.label + ".",
    },
    {
      q: "¿Cómo los contacto directamente?",
      a: `Teléfonos ${siteConfig.phones[0].value} y ${siteConfig.phones[1].value}, correo ${siteConfig.email}, o WhatsApp desde cualquier botón del sitio.`,
    },
  ];

  return (
    <>
      <FaqJsonLd qa={qa} />
      <PageHero
        title="Preguntas frecuentes"
        lead="Lo que más nos preguntan sobre cómo trabajamos, las marcas y el proceso de cotización."
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={qa} />

          <div className="mt-12 rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-6 md:p-8">
            <h2 className="text-xl">¿No está tu pregunta aquí?</h2>
            <p className="mt-2 text-body">
              Escríbenos y te respondemos con tu caso concreto.
            </p>
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
